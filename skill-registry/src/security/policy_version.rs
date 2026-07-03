//! Active package/scan policy version.
//!
//! Every scan report records the policy version that produced it. Bump
//! [`SCAN_POLICY_VERSION`] whenever detection rules change materially so the
//! rescan job can find releases scanned under older policies.

/// Package v1 structural policy revision (spec: skill-package-spec).
pub const PACKAGE_POLICY_VERSION: &str = "package-v1.0";

/// Scanner rule set revision (secret + content scan).
pub const SCAN_POLICY_VERSION: &str = "scan-v1.0";

/// Combined version stamped on scan reports.
pub fn active_policy_version() -> String {
    format!("{PACKAGE_POLICY_VERSION}/{SCAN_POLICY_VERSION}")
}

pub const SCANNER_NAME: &str = "skill-registry-scanner";

pub fn scanner_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}
