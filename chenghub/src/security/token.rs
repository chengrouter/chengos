//! Opaque token generation and HMAC hashing.
//!
//! Raw tokens leave the process exactly once (issuance response / cookie);
//! only keyed HMAC-SHA256 hashes are stored, so a database leak does not
//! leak usable credentials. Lookups are by hash, which also makes them
//! constant-time by construction.

use hmac::{Hmac, Mac};
use rand::RngCore;
use sha2::Sha256;

/// Prefixes make leaked tokens identifiable in scanners and logs.
pub const ACCESS_TOKEN_PREFIX: &str = "chg_at_";
pub const REFRESH_TOKEN_PREFIX: &str = "chg_rt_";
pub const SESSION_PREFIX: &str = "chg_ss_";
pub const DEVICE_CODE_PREFIX: &str = "chg_dc_";

#[derive(Clone)]
pub struct TokenHasher {
    secret: Vec<u8>,
}

impl TokenHasher {
    pub fn new(secret: &str) -> Self {
        Self { secret: secret.as_bytes().to_vec() }
    }

    /// Keyed hash of a raw token, hex-encoded for storage.
    pub fn hash(&self, raw: &str) -> String {
        let mut mac =
            Hmac::<Sha256>::new_from_slice(&self.secret).expect("hmac accepts any key length");
        mac.update(raw.as_bytes());
        hex::encode(mac.finalize().into_bytes())
    }
}

/// 256-bit random token with an identifying prefix.
pub fn generate_token(prefix: &str) -> String {
    let mut bytes = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut bytes);
    format!("{prefix}{}", hex::encode(bytes))
}

/// Human-enterable device user code from an unambiguous alphabet
/// (no 0/O/1/I), grouped as XXXX-XXXX for an 8-char code.
pub fn generate_user_code(length: usize) -> String {
    const ALPHABET: &[u8] = b"BCDFGHJKLMNPQRSTVWXZ23456789";
    let mut code = String::with_capacity(length + length / 4);
    let mut bytes = vec![0u8; length];
    rand::rngs::OsRng.fill_bytes(&mut bytes);
    for (i, b) in bytes.iter().enumerate() {
        if i > 0 && i % 4 == 0 {
            code.push('-');
        }
        code.push(ALPHABET[(*b as usize) % ALPHABET.len()] as char);
    }
    code
}

/// Normalize a user-entered code: uppercase, strip separators/whitespace.
pub fn normalize_user_code(input: &str) -> String {
    input
        .chars()
        .filter(|c| c.is_ascii_alphanumeric())
        .map(|c| c.to_ascii_uppercase())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_is_stable_and_keyed() {
        let a = TokenHasher::new("secret-a");
        let b = TokenHasher::new("secret-b");
        let token = generate_token(ACCESS_TOKEN_PREFIX);
        assert!(token.starts_with(ACCESS_TOKEN_PREFIX));
        assert_eq!(a.hash(&token), a.hash(&token));
        assert_ne!(a.hash(&token), b.hash(&token));
    }

    #[test]
    fn user_code_normalization() {
        let code = generate_user_code(8);
        assert_eq!(code.len(), 9); // 8 chars + separator
        assert_eq!(normalize_user_code(&code).len(), 8);
        assert_eq!(normalize_user_code(" bcdf-ghjk "), "BCDFGHJK");
    }
}
