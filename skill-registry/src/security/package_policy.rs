//! Package v1 content policy (implements `skill-package-spec/package-v1.md`).
//!
//! Takes structurally safe archive entries from
//! [`crate::storage::filesystem::safe_archive`] and validates layout,
//! required files, UTF-8, manifest schema and consistency, slug/version
//! agreement, script declarations, binary signatures, and dependency rules.
//! Declared text scripts are elevated risk but valid; disguised binaries,
//! bytecode, and undeclared scripts are rejected.

use std::collections::{BTreeMap, HashSet};

use serde::{Deserialize, Serialize};

use crate::domain::artifact::{ArtifactFileEntry, FileKind, ScriptDeclaration, ScriptPurpose, PACKAGE_V1_MEDIA_TYPE};
use crate::domain::skill::validate_slug;
use crate::error::{codes, PackageError};
use crate::storage::filesystem::safe_archive::ArchiveEntry;

pub const REQUIRED_FILES: &[&str] = &["SKILL.md", "skill.yaml", "manifest.json"];
pub const OPTIONAL_ROOT_FILES: &[&str] = &["workflow.json"];
pub const ALLOWED_ROOT_DIRS: &[&str] = &["references", "scripts"];

// ---------------------------------------------------------------------------
// Manifest model (mirrors manifest-v1.schema.json)
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestV1 {
    pub format_version: i64,
    pub slug: String,
    pub version: String,
    pub compatibility: ManifestCompatibility,
    pub files: Vec<ManifestFile>,
    #[serde(default)]
    pub scripts: Vec<ScriptDeclaration>,
    #[serde(default)]
    pub dependencies: Vec<serde_json::Value>,
    pub artifact: ManifestArtifact,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_hints: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestCompatibility {
    pub minimum_chengos_version: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub maximum_chengos_version: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestFile {
    pub path: String,
    pub size: u64,
    pub sha256: String,
    pub kind: FileKind,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestArtifact {
    pub media_type: String,
}

/// Minimal typed view of `skill.yaml` — the Registry validates structural
/// consistency only; full CanonicalSkillSpec validation is ChengFlow's job.
#[derive(Debug, Clone, Deserialize)]
pub struct SkillYamlLite {
    #[serde(default)]
    pub schema_version: Option<serde_yaml::Value>,
    pub name: String,
    pub version: String,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub scripts: Vec<ScriptDeclaration>,
}

/// Successful validation output consumed by services and the scanner.
#[derive(Debug, Clone)]
pub struct ValidatedPackage {
    pub slug: String,
    pub version: String,
    pub minimum_chengos_version: String,
    pub maximum_chengos_version: Option<String>,
    pub files: Vec<ArtifactFileEntry>,
    pub scripts: Vec<ScriptDeclaration>,
    pub manifest: ManifestV1,
    pub skill_yaml: serde_yaml::Value,
    pub workflow_json: Option<serde_json::Value>,
    pub expanded_bytes: u64,
    pub file_count: usize,
}

/// Expected identity from the publish request / install pin.
#[derive(Debug, Clone, Default)]
pub struct ExpectedIdentity<'a> {
    pub slug: Option<&'a str>,
    pub version: Option<&'a str>,
}

pub fn infer_kind(path: &str) -> FileKind {
    match path {
        "SKILL.md" => FileKind::SkillMd,
        "skill.yaml" => FileKind::SkillYaml,
        "workflow.json" => FileKind::WorkflowJson,
        p if p.starts_with("scripts/") => FileKind::Script,
        _ => FileKind::Reference,
    }
}

/// Full Package v1 policy validation over safe archive entries.
pub fn validate_package(
    entries: &[ArchiveEntry],
    expected: ExpectedIdentity<'_>,
) -> Result<ValidatedPackage, Vec<PackageError>> {
    let mut errors: Vec<PackageError> = Vec::new();
    let by_path: BTreeMap<&str, &ArchiveEntry> =
        entries.iter().map(|e| (e.path.as_str(), e)).collect();

    // --- layout ------------------------------------------------------------
    for entry in entries {
        let path = entry.path.as_str();
        let is_root_file = !path.contains('/');
        if is_root_file {
            if !REQUIRED_FILES.contains(&path) && !OPTIONAL_ROOT_FILES.contains(&path) {
                errors.push(PackageError::at(codes::PKG_UNKNOWN_ROOT_ENTRY, "unknown root file", path));
            }
        } else {
            let root_dir = path.split('/').next().unwrap_or_default();
            if !ALLOWED_ROOT_DIRS.contains(&root_dir) {
                errors.push(PackageError::at(codes::PKG_UNKNOWN_ROOT_ENTRY, "unknown root directory", path));
            }
        }
    }
    for required in REQUIRED_FILES {
        if !by_path.contains_key(required) {
            errors.push(PackageError::at(codes::PKG_MISSING_REQUIRED_FILE, "required file missing", *required));
        }
    }

    // --- binary / bytecode / disguise checks (every file) -------------------
    for entry in entries {
        if let Some((code, what)) = detect_forbidden_binary(&entry.path, &entry.data) {
            errors.push(PackageError::at(code, format!("{what} content is forbidden"), &entry.path));
        }
    }

    // --- UTF-8 for required-text files --------------------------------------
    let mut text_of = |path: &str| -> Option<String> {
        let entry = by_path.get(path)?;
        match std::str::from_utf8(&entry.data) {
            Ok(s) => Some(s.to_string()),
            Err(_) => {
                errors.push(PackageError::at(codes::PKG_INVALID_UTF8, "file must be valid UTF-8", path));
                None
            }
        }
    };
    let _skill_md_text = text_of("SKILL.md");
    let skill_yaml_text = text_of("skill.yaml");
    let manifest_text = text_of("manifest.json");
    let workflow_text = text_of("workflow.json");
    let mut script_texts: BTreeMap<String, String> = BTreeMap::new();
    let script_paths: Vec<String> = entries
        .iter()
        .filter(|e| e.path.starts_with("scripts/"))
        .map(|e| e.path.clone())
        .collect();
    for path in &script_paths {
        if let Some(text) = text_of(path) {
            script_texts.insert(path.clone(), text);
        }
    }

    // --- manifest ------------------------------------------------------------
    let manifest: Option<ManifestV1> = manifest_text.as_deref().and_then(|text| {
        match serde_json::from_str::<serde_json::Value>(text) {
            Err(e) => {
                errors.push(PackageError::at(codes::PKG_INVALID_JSON, format!("manifest.json: {e}"), "manifest.json"));
                None
            }
            Ok(value) => match serde_json::from_value::<ManifestV1>(value) {
                Err(e) => {
                    errors.push(PackageError::at(
                        codes::PKG_MANIFEST_INVALID,
                        format!("manifest.json does not match manifest-v1 schema: {e}"),
                        "manifest.json",
                    ));
                    None
                }
                Ok(manifest) => Some(manifest),
            },
        }
    });

    // --- skill.yaml ------------------------------------------------------------
    let (skill_yaml_value, skill_yaml_lite): (Option<serde_yaml::Value>, Option<SkillYamlLite>) =
        match skill_yaml_text.as_deref() {
            None => (None, None),
            Some(text) => match serde_yaml::from_str::<serde_yaml::Value>(text) {
                Err(e) => {
                    errors.push(PackageError::at(codes::PKG_INVALID_YAML, format!("skill.yaml: {e}"), "skill.yaml"));
                    (None, None)
                }
                Ok(value) => {
                    let lite = match serde_yaml::from_value::<SkillYamlLite>(value.clone()) {
                        Ok(lite) => Some(lite),
                        Err(e) => {
                            errors.push(PackageError::at(
                                codes::PKG_INVALID_YAML,
                                format!("skill.yaml missing required fields (name/version): {e}"),
                                "skill.yaml",
                            ));
                            None
                        }
                    };
                    (Some(value), lite)
                }
            },
        };

    // Forbidden embedded state (credentials, workspace/user ids, runtime state).
    if let Some(value) = &skill_yaml_value {
        for key in ["workspace_id", "user_id", "credential_values", "execution_logs", "approval_records"] {
            if value.get(key).is_some() {
                errors.push(PackageError::at(
                    codes::PKG_FORBIDDEN_CONTENT,
                    format!("skill.yaml must not embed {key}"),
                    "skill.yaml",
                ));
            }
        }
        if let Some(credentials) = value.get("credentials") {
            if credentials.get("values").is_some() {
                errors.push(PackageError::at(
                    codes::PKG_FORBIDDEN_CONTENT,
                    "skill.yaml must not embed credential values",
                    "skill.yaml",
                ));
            }
        }
    }

    // --- workflow.json parse ------------------------------------------------
    let workflow_json: Option<serde_json::Value> = match workflow_text.as_deref() {
        None => None,
        Some(text) => match serde_json::from_str(text) {
            Ok(value) => Some(value),
            Err(e) => {
                errors.push(PackageError::at(codes::PKG_INVALID_JSON, format!("workflow.json: {e}"), "workflow.json"));
                None
            }
        },
    };

    // --- deep manifest validation --------------------------------------------
    if let Some(manifest) = &manifest {
        validate_manifest_rules(manifest, &mut errors);
        validate_manifest_matches_archive(manifest, entries, &mut errors);
    }

    // --- identity agreement ----------------------------------------------------
    let manifest_slug = manifest.as_ref().map(|m| m.slug.clone());
    let manifest_version = manifest.as_ref().map(|m| m.version.clone());
    let yaml_name = skill_yaml_lite.as_ref().map(|y| y.name.clone());
    let yaml_version = skill_yaml_lite.as_ref().map(|y| y.version.clone());

    check_agreement(
        &mut errors,
        codes::PKG_SLUG_MISMATCH,
        "slug",
        &[
            ("manifest.json", manifest_slug.as_deref()),
            ("skill.yaml", yaml_name.as_deref()),
            ("request", expected.slug),
        ],
    );
    check_agreement(
        &mut errors,
        codes::PKG_VERSION_MISMATCH,
        "version",
        &[
            ("manifest.json", manifest_version.as_deref()),
            ("skill.yaml", yaml_version.as_deref()),
            ("request", expected.version),
        ],
    );
    if let Some(version) = yaml_version.as_deref().or(manifest_version.as_deref()) {
        if semver::Version::parse(version).is_err() {
            errors.push(PackageError::new(codes::PKG_INVALID_SEMVER, format!("invalid SemVer {version:?}")));
        }
    }
    if let Some(slug) = yaml_name.as_deref().or(manifest_slug.as_deref()) {
        if let Err(e) = validate_slug(slug) {
            errors.push(PackageError::new(codes::PKG_INVALID_SLUG, e));
        }
    }

    // --- script declarations ------------------------------------------------
    let declared_manifest: HashSet<String> = manifest
        .as_ref()
        .map(|m| m.scripts.iter().map(|s| s.path.clone()).collect())
        .unwrap_or_default();
    let declared_yaml: HashSet<String> = skill_yaml_lite
        .as_ref()
        .map(|y| y.scripts.iter().map(|s| s.path.clone()).collect())
        .unwrap_or_default();

    for path in &script_paths {
        if !declared_manifest.contains(path) {
            errors.push(PackageError::at(
                codes::PKG_UNDECLARED_SCRIPT,
                "script not declared in manifest.scripts",
                path,
            ));
        }
        if !declared_yaml.contains(path) {
            errors.push(PackageError::at(
                codes::PKG_UNDECLARED_SCRIPT,
                "script not declared in skill.yaml scripts",
                path,
            ));
        }
    }
    if let Some(manifest) = &manifest {
        let mut runtime_entry_points = 0;
        for declaration in &manifest.scripts {
            if !declaration.path.starts_with("scripts/") {
                errors.push(PackageError::at(
                    codes::PKG_SCRIPT_DECLARATION_INVALID,
                    "declared script path must live under scripts/",
                    &declaration.path,
                ));
            }
            if !by_path.contains_key(declaration.path.as_str()) {
                errors.push(PackageError::at(
                    codes::PKG_SCRIPT_DECLARATION_INVALID,
                    "declared script file missing from archive",
                    &declaration.path,
                ));
            }
            if declaration.interpreter.trim().is_empty() {
                errors.push(PackageError::at(
                    codes::PKG_SCRIPT_DECLARATION_INVALID,
                    "script declaration missing interpreter",
                    &declaration.path,
                ));
            }
            if declaration.entry_point {
                if declaration.purpose == ScriptPurpose::Runtime {
                    runtime_entry_points += 1;
                } else {
                    errors.push(PackageError::at(
                        codes::PKG_SCRIPT_DECLARATION_INVALID,
                        "entry_point is only valid on runtime scripts",
                        &declaration.path,
                    ));
                }
            }
        }
        if runtime_entry_points > 1 {
            errors.push(PackageError::new(
                codes::PKG_SCRIPT_DECLARATION_INVALID,
                "at most one runtime script may be the entry point",
            ));
        }
    }

    if !errors.is_empty() {
        return Err(errors);
    }

    // Success path: all Options above are guaranteed present.
    let manifest = manifest.expect("validated");
    let files: Vec<ArtifactFileEntry> = entries
        .iter()
        .filter(|e| e.path != "manifest.json")
        .map(|e| ArtifactFileEntry {
            path: e.path.clone(),
            size: e.size,
            sha256: e.sha256.clone(),
            kind: infer_kind(&e.path),
        })
        .collect();

    Ok(ValidatedPackage {
        slug: manifest.slug.clone(),
        version: manifest.version.clone(),
        minimum_chengos_version: manifest.compatibility.minimum_chengos_version.clone(),
        maximum_chengos_version: manifest.compatibility.maximum_chengos_version.clone(),
        scripts: manifest.scripts.clone(),
        expanded_bytes: entries.iter().map(|e| e.size).sum(),
        file_count: entries.len(),
        files,
        skill_yaml: skill_yaml_value.expect("validated"),
        workflow_json,
        manifest,
    })
}

fn validate_manifest_rules(manifest: &ManifestV1, errors: &mut Vec<PackageError>) {
    if manifest.format_version != 1 {
        errors.push(PackageError::new(
            codes::PKG_MANIFEST_INVALID,
            format!("unsupported format_version {}", manifest.format_version),
        ));
    }
    if manifest.artifact.media_type != PACKAGE_V1_MEDIA_TYPE {
        errors.push(PackageError::new(
            codes::PKG_MANIFEST_INVALID,
            format!("unsupported artifact media_type {:?}", manifest.artifact.media_type),
        ));
    }
    if !manifest.dependencies.is_empty() {
        errors.push(PackageError::new(
            codes::PKG_DEPENDENCIES_UNSUPPORTED,
            "skill dependencies are not supported in Package v1 (field is reserved)",
        ));
    }
    match semver::Version::parse(&manifest.version) {
        Err(_) => errors.push(PackageError::new(
            codes::PKG_INVALID_SEMVER,
            format!("manifest version {:?} is not SemVer", manifest.version),
        )),
        Ok(_) => {}
    }
    let min = semver::Version::parse(&manifest.compatibility.minimum_chengos_version);
    if min.is_err() {
        errors.push(PackageError::new(
            codes::PKG_INVALID_SEMVER,
            "compatibility.minimum_chengos_version is not SemVer",
        ));
    }
    if let Some(max_raw) = &manifest.compatibility.maximum_chengos_version {
        match (min, semver::Version::parse(max_raw)) {
            (Ok(min), Ok(max)) if max < min => errors.push(PackageError::new(
                codes::PKG_MANIFEST_INVALID,
                "maximum_chengos_version is lower than minimum_chengos_version",
            )),
            (_, Err(_)) => errors.push(PackageError::new(
                codes::PKG_INVALID_SEMVER,
                "compatibility.maximum_chengos_version is not SemVer",
            )),
            _ => {}
        }
    }
}

fn validate_manifest_matches_archive(
    manifest: &ManifestV1,
    entries: &[ArchiveEntry],
    errors: &mut Vec<PackageError>,
) {
    let archive: BTreeMap<&str, &ArchiveEntry> = entries
        .iter()
        .filter(|e| e.path != "manifest.json")
        .map(|e| (e.path.as_str(), e))
        .collect();
    let mut listed: HashSet<&str> = HashSet::new();

    for file in &manifest.files {
        if !listed.insert(file.path.as_str()) {
            errors.push(PackageError::at(codes::PKG_MANIFEST_INVALID, "duplicate manifest file entry", &file.path));
            continue;
        }
        match archive.get(file.path.as_str()) {
            None => errors.push(PackageError::at(
                codes::PKG_MANIFEST_MISMATCH,
                "manifest lists a file missing from the archive",
                &file.path,
            )),
            Some(entry) => {
                if entry.size != file.size {
                    errors.push(PackageError::at(
                        codes::PKG_MANIFEST_MISMATCH,
                        format!("size mismatch (archive {} vs manifest {})", entry.size, file.size),
                        &file.path,
                    ));
                }
                if !entry.sha256.eq_ignore_ascii_case(&file.sha256) {
                    errors.push(PackageError::at(codes::PKG_MANIFEST_MISMATCH, "sha256 mismatch", &file.path));
                }
                let expected_kind = infer_kind(&file.path);
                if expected_kind != file.kind {
                    errors.push(PackageError::at(
                        codes::PKG_MANIFEST_MISMATCH,
                        format!("kind mismatch (expected {})", expected_kind.as_str()),
                        &file.path,
                    ));
                }
            }
        }
    }
    for path in archive.keys() {
        if !listed.contains(path) {
            errors.push(PackageError::at(
                codes::PKG_MANIFEST_MISMATCH,
                "archive file missing from manifest.files",
                *path,
            ));
        }
    }
}

fn check_agreement(
    errors: &mut Vec<PackageError>,
    code: &str,
    what: &str,
    sources: &[(&str, Option<&str>)],
) {
    let present: Vec<(&str, &str)> = sources
        .iter()
        .filter_map(|(name, value)| value.map(|v| (*name, v)))
        .collect();
    if present.len() < 2 {
        return;
    }
    let first = present[0];
    for other in &present[1..] {
        if other.1 != first.1 {
            errors.push(PackageError::new(
                code,
                format!(
                    "{what} disagreement: {}={:?} vs {}={:?}",
                    first.0, first.1, other.0, other.1
                ),
            ));
            return;
        }
    }
}

/// Detect native binaries, bytecode, and disguised binaries.
fn detect_forbidden_binary(path: &str, data: &[u8]) -> Option<(&'static str, &'static str)> {
    let ext = path.rsplit('.').next().unwrap_or_default().to_ascii_lowercase();
    match ext.as_str() {
        "so" | "dylib" | "dll" | "a" | "o" | "bin" | "exe" => {
            return Some((codes::PKG_BINARY_FORBIDDEN, "native binary/library"));
        }
        "pyc" | "pyo" | "luac" | "class" | "wasm" => {
            return Some((codes::PKG_BYTECODE_FORBIDDEN, "bytecode artifact"));
        }
        _ => {}
    }
    if data.len() < 4 {
        return None;
    }
    let m4: [u8; 4] = [data[0], data[1], data[2], data[3]];
    match m4 {
        [0x7f, b'E', b'L', b'F'] => Some((codes::PKG_BINARY_FORBIDDEN, "ELF binary")),
        [0x00, b'a', b's', b'm'] => Some((codes::PKG_BINARY_FORBIDDEN, "WebAssembly binary")),
        [0xca, 0xfe, 0xba, 0xbe] | [0xca, 0xfe, 0xba, 0xbf] => {
            Some((codes::PKG_BYTECODE_FORBIDDEN, "Java class / Mach-O fat binary"))
        }
        [0xfe, 0xed, 0xfa, 0xce] | [0xfe, 0xed, 0xfa, 0xcf] | [0xce, 0xfa, 0xed, 0xfe] | [0xcf, 0xfa, 0xed, 0xfe] => {
            Some((codes::PKG_BINARY_FORBIDDEN, "Mach-O binary"))
        }
        [0x1b, b'L', b'u', b'a'] => Some((codes::PKG_BYTECODE_FORBIDDEN, "Lua bytecode")),
        _ => {
            if data.starts_with(b"MZ") && data.len() > 64 {
                Some((codes::PKG_BINARY_FORBIDDEN, "PE binary"))
            } else if data.starts_with(b"!<arch>") {
                Some((codes::PKG_BINARY_FORBIDDEN, "static archive"))
            } else if data.starts_with(b"PK\x03\x04") && !path.ends_with(".zip") {
                // Extension-based nested-archive rejection already happened;
                // this catches renamed archives.
                Some((codes::PKG_NESTED_ARCHIVE, "disguised ZIP archive"))
            } else if data.starts_with(&[0x1f, 0x8b]) {
                Some((codes::PKG_NESTED_ARCHIVE, "disguised gzip archive"))
            } else {
                None
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use sha2::{Digest as _, Sha256};

    fn entry(path: &str, data: &[u8]) -> ArchiveEntry {
        let hash: [u8; 32] = Sha256::digest(data).into();
        ArchiveEntry {
            path: path.to_string(),
            size: data.len() as u64,
            sha256: hex::encode(hash),
            data: data.to_vec(),
        }
    }

    fn manifest_for(slug: &str, version: &str, files: &[&ArchiveEntry], scripts: &[ScriptDeclaration]) -> Vec<u8> {
        let manifest = ManifestV1 {
            format_version: 1,
            slug: slug.into(),
            version: version.into(),
            compatibility: ManifestCompatibility {
                minimum_chengos_version: "0.1.0".into(),
                maximum_chengos_version: None,
            },
            files: files
                .iter()
                .map(|e| ManifestFile {
                    path: e.path.clone(),
                    size: e.size,
                    sha256: e.sha256.clone(),
                    kind: infer_kind(&e.path),
                })
                .collect(),
            scripts: scripts.to_vec(),
            dependencies: vec![],
            artifact: ManifestArtifact { media_type: PACKAGE_V1_MEDIA_TYPE.into() },
            policy_hints: None,
        };
        serde_json::to_vec(&manifest).unwrap()
    }

    fn valid_entries() -> Vec<ArchiveEntry> {
        let skill_md = entry("SKILL.md", b"# Test\n");
        let skill_yaml = entry(
            "skill.yaml",
            b"schema_version: \"1\"\nname: test-skill\nversion: 1.0.0\ndescription: t\nbackend:\n  type: reference\n",
        );
        let manifest = entry(
            "manifest.json",
            &manifest_for("test-skill", "1.0.0", &[&skill_md, &skill_yaml], &[]),
        );
        vec![skill_md, skill_yaml, manifest]
    }

    #[test]
    fn valid_minimal_passes() {
        let package = validate_package(&valid_entries(), ExpectedIdentity { slug: Some("test-skill"), version: Some("1.0.0") }).unwrap();
        assert_eq!(package.slug, "test-skill");
        assert_eq!(package.files.len(), 2);
    }

    #[test]
    fn slug_mismatch_fails() {
        let errs = validate_package(&valid_entries(), ExpectedIdentity { slug: Some("other"), version: Some("1.0.0") }).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_SLUG_MISMATCH));
    }

    #[test]
    fn missing_required_fails() {
        let mut entries = valid_entries();
        entries.retain(|e| e.path != "SKILL.md");
        let errs = validate_package(&entries, ExpectedIdentity::default()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_MISSING_REQUIRED_FILE));
        // and the manifest now mismatches too
        assert!(errs.iter().any(|e| e.code == codes::PKG_MANIFEST_MISMATCH));
    }

    #[test]
    fn undeclared_script_fails() {
        let skill_md = entry("SKILL.md", b"# Test\n");
        let skill_yaml = entry(
            "skill.yaml",
            b"schema_version: \"1\"\nname: test-skill\nversion: 1.0.0\nbackend:\n  type: reference\n",
        );
        let script = entry("scripts/run.sh", b"#!/bin/sh\necho hi\n");
        let manifest = entry(
            "manifest.json",
            &manifest_for("test-skill", "1.0.0", &[&skill_md, &skill_yaml, &script], &[]),
        );
        let errs = validate_package(&[skill_md, skill_yaml, script, manifest], ExpectedIdentity::default()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_UNDECLARED_SCRIPT));
    }

    #[test]
    fn declared_script_passes() {
        let skill_md = entry("SKILL.md", b"# Test\n");
        let declaration = ScriptDeclaration {
            path: "scripts/run.sh".into(),
            interpreter: "sh".into(),
            purpose: ScriptPurpose::Helper,
            entry_point: false,
            description: None,
        };
        let skill_yaml = entry(
            "skill.yaml",
            b"schema_version: \"1\"\nname: test-skill\nversion: 1.0.0\nbackend:\n  type: reference\nscripts:\n  - path: scripts/run.sh\n    interpreter: sh\n    purpose: helper\n",
        );
        let script = entry("scripts/run.sh", b"#!/bin/sh\necho hi\n");
        let manifest = entry(
            "manifest.json",
            &manifest_for("test-skill", "1.0.0", &[&skill_md, &skill_yaml, &script], &[declaration]),
        );
        let package = validate_package(&[skill_md, skill_yaml, script, manifest], ExpectedIdentity::default()).unwrap();
        assert_eq!(package.scripts.len(), 1);
    }

    #[test]
    fn disguised_elf_fails() {
        let skill_md = entry("SKILL.md", b"# Test\n");
        let declaration = ScriptDeclaration {
            path: "scripts/run.sh".into(),
            interpreter: "sh".into(),
            purpose: ScriptPurpose::Helper,
            entry_point: false,
            description: None,
        };
        let skill_yaml = entry(
            "skill.yaml",
            b"schema_version: \"1\"\nname: test-skill\nversion: 1.0.0\nbackend:\n  type: reference\nscripts:\n  - path: scripts/run.sh\n    interpreter: sh\n    purpose: helper\n",
        );
        let script = entry("scripts/run.sh", b"\x7fELF\x02\x01\x01\x00payload");
        let manifest = entry(
            "manifest.json",
            &manifest_for("test-skill", "1.0.0", &[&skill_md, &skill_yaml, &script], &[declaration]),
        );
        let errs = validate_package(&[skill_md, skill_yaml, script, manifest], ExpectedIdentity::default()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_BINARY_FORBIDDEN));
    }

    #[test]
    fn nonempty_dependencies_fails() {
        let skill_md = entry("SKILL.md", b"# Test\n");
        let skill_yaml = entry(
            "skill.yaml",
            b"schema_version: \"1\"\nname: test-skill\nversion: 1.0.0\nbackend:\n  type: reference\n",
        );
        let mut manifest_value: serde_json::Value = serde_json::from_slice(
            &manifest_for("test-skill", "1.0.0", &[&skill_md, &skill_yaml], &[]),
        )
        .unwrap();
        manifest_value["dependencies"] = serde_json::json!(["acme/other@^1"]);
        let manifest = entry("manifest.json", serde_json::to_vec(&manifest_value).unwrap().as_slice());
        let errs = validate_package(&[skill_md, skill_yaml, manifest], ExpectedIdentity::default()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_DEPENDENCIES_UNSUPPORTED));
    }

    #[test]
    fn hash_mismatch_fails() {
        let skill_md = entry("SKILL.md", b"# Test\n");
        let skill_yaml = entry(
            "skill.yaml",
            b"schema_version: \"1\"\nname: test-skill\nversion: 1.0.0\nbackend:\n  type: reference\n",
        );
        let mut fake_md = skill_md.clone();
        fake_md.sha256 = "0".repeat(64);
        let manifest = entry(
            "manifest.json",
            &manifest_for("test-skill", "1.0.0", &[&fake_md, &skill_yaml], &[]),
        );
        let errs = validate_package(&[skill_md, skill_yaml, manifest], ExpectedIdentity::default()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_MANIFEST_MISMATCH));
    }
}
