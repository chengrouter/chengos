//! API and package-format version constants.
//!
//! The path prefix (`/api/v1`) is the API contract version; the capabilities
//! endpoint advertises exactly what this deployment supports so ChengFlow can
//! negotiate before attempting installs or publishes. Frozen once shipped —
//! breaking changes mean `/api/v2`, not mutations of v1.

/// Current (and only) API version segment.
pub const API_VERSION: &str = "v1";

/// Package format versions this registry accepts and serves.
pub const SUPPORTED_PACKAGE_FORMATS: &[i32] = &[1];

/// Response header advertising the API version on every response.
pub const API_VERSION_HEADER: &str = "x-registry-api-version";

/// Feature flags advertised through capabilities. Additive only.
pub const FEATURES: &[&str] = &[
    "catalog",
    "downloads",
    "publishing",
    "identity-assertion-auth",
    "scan-reports",
    "abuse-reports",
    "yank",
];
