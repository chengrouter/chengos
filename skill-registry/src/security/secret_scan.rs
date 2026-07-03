//! Secret detection over package text content.
//!
//! Findings store only the location and a masked hint — raw secret values are
//! never persisted (see `ScanFinding::excerpt`). Detection is deliberately
//! high-signal: canonical token formats plus assignment-context high-entropy
//! strings, to keep reviewer noise low at MVP scale.

use std::sync::OnceLock;

use regex::Regex;

use crate::domain::scan::{FindingKind, ScanFinding, Severity};

struct SecretRule {
    code: &'static str,
    description: &'static str,
    severity: Severity,
    pattern: &'static str,
}

const RULES: &[SecretRule] = &[
    SecretRule {
        code: "SECRET_PRIVATE_KEY",
        description: "private key material",
        severity: Severity::Critical,
        pattern: r"-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----",
    },
    SecretRule {
        code: "SECRET_AWS_ACCESS_KEY",
        description: "AWS access key id",
        severity: Severity::High,
        pattern: r"\b(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b",
    },
    SecretRule {
        code: "SECRET_GITHUB_TOKEN",
        description: "GitHub token",
        severity: Severity::High,
        pattern: r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,255}\b",
    },
    SecretRule {
        code: "SECRET_GITLAB_TOKEN",
        description: "GitLab personal access token",
        severity: Severity::High,
        pattern: r"\bglpat-[A-Za-z0-9\-_]{20,}\b",
    },
    SecretRule {
        code: "SECRET_SLACK_TOKEN",
        description: "Slack token",
        severity: Severity::High,
        pattern: r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b",
    },
    SecretRule {
        code: "SECRET_OPENAI_KEY",
        description: "OpenAI-style API key",
        severity: Severity::High,
        pattern: r"\bsk-[A-Za-z0-9_-]{20,}\b",
    },
    SecretRule {
        code: "SECRET_ANTHROPIC_KEY",
        description: "Anthropic API key",
        severity: Severity::High,
        pattern: r"\bsk-ant-[A-Za-z0-9_-]{20,}\b",
    },
    SecretRule {
        code: "SECRET_GOOGLE_KEY",
        description: "Google API key",
        severity: Severity::High,
        pattern: r"\bAIza[0-9A-Za-z\-_]{35}\b",
    },
    SecretRule {
        code: "SECRET_JWT",
        description: "hardcoded JWT",
        severity: Severity::Medium,
        pattern: r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b",
    },
    SecretRule {
        code: "SECRET_URL_CREDENTIALS",
        description: "credentials embedded in a URL",
        severity: Severity::High,
        pattern: r"[a-z][a-z0-9+.-]*://[^/\s:@]{1,64}:[^/\s:@]{1,128}@[^\s]+",
    },
    SecretRule {
        code: "SECRET_ENV_ASSIGNMENT",
        description: "secret-looking environment assignment",
        severity: Severity::High,
        pattern: r#"(?im)^\s*(?:export\s+)?[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PASSWD|API_KEY|ACCESS_KEY|PRIVATE_KEY)[A-Z0-9_]*\s*[:=]\s*['"]?[^\s'"]{8,}"#,
    },
];

fn compiled() -> &'static Vec<(usize, Regex)> {
    static COMPILED: OnceLock<Vec<(usize, Regex)>> = OnceLock::new();
    COMPILED.get_or_init(|| {
        RULES
            .iter()
            .enumerate()
            .map(|(i, rule)| (i, Regex::new(rule.pattern).expect("secret rule regex")))
            .collect()
    })
}

/// Mask a matched secret: keep a short prefix, drop the rest.
fn redact(matched: &str) -> String {
    let prefix: String = matched.chars().take(6).collect();
    format!("{prefix}****(len {})", matched.chars().count())
}

/// Scan one text file; returns redacted findings.
pub fn scan_text(path: &str, text: &str) -> Vec<ScanFinding> {
    let mut findings = Vec::new();
    for (rule_index, regex) in compiled() {
        let rule = &RULES[*rule_index];
        for matched in regex.find_iter(text) {
            let line = text[..matched.start()].bytes().filter(|b| *b == b'\n').count() as u32 + 1;
            findings.push(ScanFinding {
                kind: FindingKind::Secret,
                severity: rule.severity,
                code: rule.code.to_string(),
                message: format!("{} detected", rule.description),
                path: Some(path.to_string()),
                line: Some(line),
                excerpt: Some(redact(matched.as_str())),
            });
            // One finding per rule per file keeps reports readable.
            break;
        }
    }
    findings
}

/// Scan every UTF-8 decodable file in the package.
pub fn scan_package(files: &[(String, Vec<u8>)]) -> Vec<ScanFinding> {
    let mut findings = Vec::new();
    for (path, data) in files {
        if let Ok(text) = std::str::from_utf8(data) {
            findings.extend(scan_text(path, text));
        }
    }
    findings
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn detects_canonical_tokens_and_redacts() {
        let text = "AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nkey=AKIAIOSFODNN7EXAMPLE\n";
        let findings = scan_text("references/deploy.env", text);
        assert!(findings.iter().any(|f| f.code == "SECRET_AWS_ACCESS_KEY"));
        assert!(findings.iter().any(|f| f.code == "SECRET_ENV_ASSIGNMENT"));
        for finding in &findings {
            let excerpt = finding.excerpt.as_deref().unwrap();
            assert!(!excerpt.contains("EXAMPLEKEY"), "raw secret leaked: {excerpt}");
        }
    }

    #[test]
    fn detects_url_credentials() {
        let findings = scan_text("skill.yaml", "db: postgres://admin:hunter2hunter2@db:5432/x");
        assert!(findings.iter().any(|f| f.code == "SECRET_URL_CREDENTIALS"));
    }

    #[test]
    fn clean_text_has_no_findings() {
        let findings = scan_text("SKILL.md", "# Hello\nUse the API key from your credential store.\n");
        assert!(findings.is_empty());
    }

    #[test]
    fn detects_private_keys() {
        let findings = scan_text("references/key.pem", "-----BEGIN RSA PRIVATE KEY-----\nabc");
        assert_eq!(findings[0].severity, Severity::Critical);
    }
}
