//! Token generation and HMAC hashing for publisher credentials.
//!
//! Plaintext tokens are random, prefixed for identification, shown exactly
//! once, and never stored: the database keeps only
//! `HMAC-SHA256(token_hmac_secret, token)`. Lookup recomputes the HMAC, so a
//! database leak alone cannot forge or recover credentials. Comparison
//! happens on hex digests of fixed length via the unique index — no timing
//! oracle on token bytes.

use hmac::{Hmac, Mac};
use rand::RngCore;
use sha2::Sha256;

/// Grant tokens: held by ChengFlow servers after the browser grant flow.
pub const GRANT_TOKEN_PREFIX: &str = "srg_";
/// API tokens: created for CI publishing.
pub const API_TOKEN_PREFIX: &str = "sra_";
/// One-time grant codes exchanged for grant tokens.
pub const GRANT_CODE_PREFIX: &str = "src_";

const TOKEN_ENTROPY_BYTES: usize = 32;

fn random_suffix() -> String {
    let mut bytes = [0u8; TOKEN_ENTROPY_BYTES];
    rand::rngs::OsRng.fill_bytes(&mut bytes);
    hex::encode(bytes)
}

pub fn generate_grant_token() -> String {
    format!("{GRANT_TOKEN_PREFIX}{}", random_suffix())
}

pub fn generate_api_token() -> String {
    format!("{API_TOKEN_PREFIX}{}", random_suffix())
}

pub fn generate_grant_code() -> String {
    format!("{GRANT_CODE_PREFIX}{}", random_suffix())
}

/// HMAC-SHA256 of the full plaintext token, lowercase hex. The only form
/// that ever reaches storage or lookups.
pub fn hash_token(hmac_secret: &str, token: &str) -> String {
    let mut mac = Hmac::<Sha256>::new_from_slice(hmac_secret.as_bytes())
        .expect("HMAC accepts any key length");
    mac.update(token.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

/// Shape check before touching the database: known prefix + hex suffix of
/// the right length. Rejects garbage cheaply and keeps logs free of noise.
pub fn looks_like_token(token: &str) -> bool {
    let suffix = token
        .strip_prefix(GRANT_TOKEN_PREFIX)
        .or_else(|| token.strip_prefix(API_TOKEN_PREFIX));
    matches!(suffix, Some(s) if s.len() == TOKEN_ENTROPY_BYTES * 2 && s.bytes().all(|b| b.is_ascii_hexdigit()))
}

pub fn looks_like_grant_code(code: &str) -> bool {
    matches!(
        code.strip_prefix(GRANT_CODE_PREFIX),
        Some(s) if s.len() == TOKEN_ENTROPY_BYTES * 2 && s.bytes().all(|b| b.is_ascii_hexdigit())
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tokens_are_unique_prefixed_and_hashable() {
        let a = generate_grant_token();
        let b = generate_grant_token();
        assert_ne!(a, b);
        assert!(looks_like_token(&a));
        assert!(looks_like_token(&generate_api_token()));
        assert!(!looks_like_token(&generate_grant_code()));
        assert!(looks_like_grant_code(&generate_grant_code()));
        assert!(!looks_like_token("srg_short"));
        assert!(!looks_like_token("Bearer whatever"));
    }

    #[test]
    fn hash_is_keyed_and_deterministic() {
        let token = generate_api_token();
        let h1 = hash_token("secret-1", &token);
        let h2 = hash_token("secret-1", &token);
        let h3 = hash_token("secret-2", &token);
        assert_eq!(h1, h2);
        assert_ne!(h1, h3);
        assert_eq!(h1.len(), 64);
        assert!(!h1.contains(&token));
    }
}
