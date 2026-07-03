//! Publisher authentication: ChengFlow identity assertions, the browser
//! grant flow, token exchange, and bearer authentication.
//!
//! Identity model: `provider_key_fingerprint + subject`. The assertion is a
//! JSON payload signed with the ChengFlow instance's Ed25519 key; the
//! Registry verifies the signature against the *embedded* public key and
//! derives the fingerprint from it — the issuer URL is a display label only.
//! The Registry never receives ChengFlow credentials of any kind.
//!
//! Replay protection: each assertion `jti` may be consumed once within its
//! TTL, tracked in the cache. The cache fails open (documented degradation:
//! a Redis outage briefly weakens replay protection on an already-signed,
//! short-lived assertion, never authentication itself).

use std::sync::Arc;
use std::time::Duration;

use base64::Engine;
use chrono::Utc;
use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use sha2::{Digest as Sha2Digest, Sha256};
use uuid::Uuid;

use crate::config::AuthConfig;
use crate::domain::moderation::AuditActorType;
use crate::domain::publisher::{validate_handle, MemberRole, Publisher, PublisherType};
use crate::domain::publisher_auth::{
    scopes, validate_assertion_times, validate_scopes, ExternalIdentity, GrantCode,
    IdentityAssertion, PublisherToken, TokenId, TokenKind,
};
use crate::error::{RegistryError, Result};
use crate::ports::cache::Cache;
use crate::ports::repositories::{IdentityRepo, NewAuditEvent, NewPublisher, PublisherRepo, TokenRepo};
use crate::security::publisher_tokens;

/// The signed envelope ChengFlow sends: base64 JSON payload + base64
/// Ed25519 signature over the exact payload bytes.
#[derive(Debug, Clone, serde::Deserialize)]
pub struct SignedAssertion {
    pub payload: String,
    pub signature: String,
}

/// Verified assertion plus the derived key fingerprint.
pub struct VerifiedAssertion {
    pub assertion: IdentityAssertion,
    pub fingerprint: String,
}

/// What the authorize UI needs to render the consent screen.
pub struct AuthPreview {
    pub subject: String,
    pub issuer_label: String,
    pub display_name: Option<String>,
    /// Publishers this identity already controls (empty on first visit).
    pub publishers: Vec<(Publisher, MemberRole)>,
    pub return_uri: String,
    pub state: String,
}

/// The user's choice on the consent screen.
pub enum PublisherChoice {
    Existing { handle: String },
    New {
        handle: String,
        display_name: String,
        publisher_type: PublisherType,
    },
}

/// Result of a confirmed authorization: the one-time code for the redirect.
pub struct GrantIssued {
    pub code: String,
    pub return_uri: String,
    pub state: String,
    pub publisher: Publisher,
}

/// Result of a code exchange: the grant token, shown exactly once.
pub struct TokenIssued {
    pub token: String,
    pub token_id: TokenId,
    pub kind: TokenKind,
    pub scopes: Vec<String>,
    pub expires_at: Option<chrono::DateTime<Utc>>,
    pub publisher: Publisher,
}

/// Authenticated publisher context attached to publish/token requests.
pub struct AuthContext {
    pub token: PublisherToken,
    pub identity: ExternalIdentity,
    pub publisher: Publisher,
    pub role: MemberRole,
}

impl AuthContext {
    pub fn require_scope(&self, scope: &str) -> Result<()> {
        if self.token.has_scope(scope) {
            Ok(())
        } else {
            Err(RegistryError::forbidden(format!("token lacks the {scope:?} scope")))
        }
    }
    /// Audit actor string: the identity id (never the token).
    pub fn actor(&self) -> String {
        self.identity.id.to_string()
    }
}

pub struct PublisherAuthService {
    identities: Arc<dyn IdentityRepo>,
    publishers: Arc<dyn PublisherRepo>,
    tokens: Arc<dyn TokenRepo>,
    cache: Arc<dyn Cache>,
    auth_config: AuthConfig,
    /// Expected assertion audience (the registry's public URL, no trailing /).
    audience: String,
}

impl PublisherAuthService {
    pub fn new(
        identities: Arc<dyn IdentityRepo>,
        publishers: Arc<dyn PublisherRepo>,
        tokens: Arc<dyn TokenRepo>,
        cache: Arc<dyn Cache>,
        auth_config: AuthConfig,
        public_url: &str,
    ) -> Self {
        Self {
            identities,
            publishers,
            tokens,
            cache,
            auth_config,
            audience: public_url.trim_end_matches('/').to_string(),
        }
    }

    // -----------------------------------------------------------------------
    // Assertion verification
    // -----------------------------------------------------------------------

    /// Verify signature, times, and audience. Does NOT consume the jti —
    /// `confirm_authorize` does, so preview + confirm can share an assertion.
    pub fn verify_assertion(&self, signed: &SignedAssertion) -> Result<VerifiedAssertion> {
        let b64 = base64::engine::general_purpose::STANDARD;
        let payload_bytes = b64
            .decode(&signed.payload)
            .map_err(|_| RegistryError::unauthorized("assertion payload is not valid base64"))?;
        let signature_bytes = b64
            .decode(&signed.signature)
            .map_err(|_| RegistryError::unauthorized("assertion signature is not valid base64"))?;
        let assertion: IdentityAssertion = serde_json::from_slice(&payload_bytes)
            .map_err(|_| RegistryError::unauthorized("assertion payload is not a valid identity assertion"))?;

        let key_bytes: [u8; 32] = b64
            .decode(&assertion.public_key)
            .ok()
            .and_then(|k| k.try_into().ok())
            .ok_or_else(|| RegistryError::unauthorized("assertion public key must be 32 base64 bytes"))?;
        let verifying_key = VerifyingKey::from_bytes(&key_bytes)
            .map_err(|_| RegistryError::unauthorized("assertion public key is not a valid Ed25519 key"))?;
        let signature = Signature::from_slice(&signature_bytes)
            .map_err(|_| RegistryError::unauthorized("assertion signature has the wrong length"))?;
        verifying_key
            .verify(&payload_bytes, &signature)
            .map_err(|_| RegistryError::unauthorized("assertion signature verification failed"))?;

        validate_assertion_times(
            &assertion,
            Utc::now(),
            chrono::Duration::seconds(self.auth_config.assertion_max_age_secs as i64),
        )
        .map_err(RegistryError::unauthorized)?;

        if assertion.audience.trim_end_matches('/') != self.audience {
            return Err(RegistryError::unauthorized(format!(
                "assertion audience {:?} does not match this registry",
                assertion.audience
            )));
        }
        if assertion.subject.trim().is_empty() || assertion.jti.trim().is_empty() {
            return Err(RegistryError::unauthorized("assertion subject/jti must be non-empty"));
        }

        let fingerprint = hex::encode(Sha256::digest(key_bytes));
        Ok(VerifiedAssertion { assertion, fingerprint })
    }

    /// One-shot jti consumption within the replay window.
    async fn consume_jti(&self, verified: &VerifiedAssertion) -> Result<()> {
        let key = format!("jti:{}:{}", verified.fingerprint, verified.assertion.jti);
        let first = self
            .cache
            .try_single_flight(&key, Duration::from_secs(self.auth_config.jti_ttl_secs))
            .await;
        if first {
            Ok(())
        } else {
            Err(RegistryError::unauthorized("assertion already used (replay)"))
        }
    }

    // -----------------------------------------------------------------------
    // Browser grant flow
    // -----------------------------------------------------------------------

    /// Render data for the consent screen. Verifies but does not consume.
    pub async fn preview_authorize(&self, signed: &SignedAssertion) -> Result<AuthPreview> {
        let verified = self.verify_assertion(signed)?;
        let publishers = match self
            .identities
            .find(&verified.fingerprint, &verified.assertion.subject)
            .await?
        {
            Some(identity) => self.publishers.list_for_identity(identity.id).await?,
            None => vec![],
        };
        Ok(AuthPreview {
            subject: verified.assertion.subject,
            issuer_label: verified.assertion.issuer,
            display_name: verified.assertion.display_name,
            publishers,
            return_uri: verified.assertion.return_uri,
            state: verified.assertion.state,
        })
    }

    /// The user confirmed on the consent screen: establish/load the identity,
    /// resolve the publisher, and mint a one-time grant code.
    pub async fn confirm_authorize(
        &self,
        signed: &SignedAssertion,
        choice: PublisherChoice,
        requested_scopes: Vec<String>,
    ) -> Result<GrantIssued> {
        let verified = self.verify_assertion(signed)?;
        self.consume_jti(&verified).await?;
        validate_scopes(&requested_scopes)
            .map_err(|m| RegistryError::validation("INVALID_SCOPES", m))?;

        let identity = self.resolve_identity(&verified).await?;
        let publisher = match choice {
            PublisherChoice::Existing { handle } => {
                let publisher = self
                    .publishers
                    .get_by_handle(&handle)
                    .await?
                    .ok_or(RegistryError::NotFound("publisher"))?;
                let role = self
                    .publishers
                    .member_role(publisher.id, identity.id)
                    .await?
                    .ok_or_else(|| RegistryError::forbidden("identity is not a member of this publisher"))?;
                let _ = role;
                if publisher.is_banned() {
                    return Err(RegistryError::forbidden("publisher is banned"));
                }
                publisher
            }
            PublisherChoice::New { handle, display_name, publisher_type } => {
                validate_handle(&handle)
                    .map_err(|m| RegistryError::validation("INVALID_HANDLE", m))?;
                let display_name = display_name.trim().to_string();
                if display_name.is_empty() || display_name.chars().count() > 80 {
                    return Err(RegistryError::validation(
                        "INVALID_DISPLAY_NAME",
                        "display name must be 1..=80 characters",
                    ));
                }
                self.publishers
                    .create_with_owner(
                        NewPublisher { handle, display_name, publisher_type },
                        identity.id,
                        audit(
                            AuditActorType::Identity,
                            identity.id.to_string(),
                            "publisher.create",
                            "publisher",
                            "pending",
                        ),
                    )
                    .await?
            }
        };

        let code = publisher_tokens::generate_grant_code();
        let now = Utc::now();
        self.tokens
            .create_grant_code(&GrantCode {
                id: Uuid::new_v4(),
                identity_id: identity.id,
                publisher_id: publisher.id,
                code_hash: self.hash(&code),
                scopes: requested_scopes,
                created_at: now,
                expires_at: now + chrono::Duration::seconds(self.auth_config.grant_code_ttl_secs as i64),
                consumed_at: None,
            })
            .await?;

        Ok(GrantIssued {
            code,
            return_uri: verified.assertion.return_uri,
            state: verified.assertion.state,
            publisher,
        })
    }

    /// Server-to-server: exchange the one-time code for a grant token.
    pub async fn exchange_grant_code(&self, code: &str) -> Result<TokenIssued> {
        if !publisher_tokens::looks_like_grant_code(code) {
            return Err(RegistryError::unauthorized("malformed grant code"));
        }
        let grant = self
            .tokens
            .consume_grant_code(&self.hash(code))
            .await?
            .ok_or_else(|| RegistryError::unauthorized("unknown or already used grant code"))?;
        if grant.expires_at <= Utc::now() {
            return Err(RegistryError::unauthorized("grant code expired"));
        }
        self.issue_token(
            grant.identity_id,
            grant.publisher_id,
            TokenKind::Grant,
            "chengflow-grant".to_string(),
            grant.scopes,
            Some(self.auth_config.grant_token_ttl_secs),
        )
        .await
    }

    // -----------------------------------------------------------------------
    // Bearer authentication + token management
    // -----------------------------------------------------------------------

    /// Authenticate a `Bearer` token into a full publisher context.
    pub async fn authenticate(&self, bearer: &str) -> Result<AuthContext> {
        if !publisher_tokens::looks_like_token(bearer) {
            return Err(RegistryError::unauthorized("malformed token"));
        }
        let token = self
            .tokens
            .find_active_by_hash(&self.hash(bearer))
            .await?
            .ok_or_else(|| RegistryError::unauthorized("unknown, expired, or revoked token"))?;
        let identity = self
            .identities
            .get(token.identity_id)
            .await?
            .ok_or_else(|| RegistryError::unauthorized("token identity no longer exists"))?;
        let publisher = self
            .publishers
            .get(token.publisher_id)
            .await?
            .ok_or_else(|| RegistryError::unauthorized("token publisher no longer exists"))?;
        if publisher.is_banned() {
            return Err(RegistryError::forbidden("publisher is banned"));
        }
        let role = self
            .publishers
            .member_role(publisher.id, identity.id)
            .await?
            .ok_or_else(|| RegistryError::forbidden("identity is no longer a member of this publisher"))?;
        // Best-effort freshness marker; never fails the request.
        let _ = self.tokens.touch_last_used(token.id).await;
        Ok(AuthContext { token, identity, publisher, role })
    }

    /// Mint an API token (CI publishing). Requires the `tokens` scope.
    pub async fn create_api_token(
        &self,
        auth: &AuthContext,
        label: String,
        requested_scopes: Vec<String>,
        expires_in_secs: Option<u64>,
    ) -> Result<TokenIssued> {
        auth.require_scope(scopes::TOKENS)?;
        validate_scopes(&requested_scopes)
            .map_err(|m| RegistryError::validation("INVALID_SCOPES", m))?;
        // An API token can never exceed the scopes of the token creating it.
        for scope in &requested_scopes {
            auth.require_scope(scope)?;
        }
        let label = label.trim().to_string();
        if label.is_empty() || label.chars().count() > 64 {
            return Err(RegistryError::validation("INVALID_LABEL", "label must be 1..=64 characters"));
        }
        self.issue_token(
            auth.identity.id,
            auth.publisher.id,
            TokenKind::Api,
            label,
            requested_scopes,
            expires_in_secs,
        )
        .await
    }

    pub async fn list_tokens(&self, auth: &AuthContext) -> Result<Vec<PublisherToken>> {
        auth.require_scope(scopes::TOKENS)?;
        self.tokens.list_for_identity(auth.identity.id).await
    }

    /// Revoke a token belonging to the caller's identity.
    pub async fn revoke_token(&self, auth: &AuthContext, token_id: TokenId) -> Result<()> {
        auth.require_scope(scopes::TOKENS)?;
        let owned = self
            .tokens
            .list_for_identity(auth.identity.id)
            .await?
            .iter()
            .any(|t| t.id == token_id);
        if !owned {
            return Err(RegistryError::NotFound("token"));
        }
        let revoked = self
            .tokens
            .revoke(
                token_id,
                audit(
                    AuditActorType::Identity,
                    auth.actor(),
                    "token.revoke",
                    "token",
                    token_id.to_string(),
                ),
            )
            .await?;
        if !revoked {
            return Err(RegistryError::NotFound("token"));
        }
        Ok(())
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    fn hash(&self, value: &str) -> String {
        publisher_tokens::hash_token(self.auth_config.token_hmac_secret.expose(), value)
    }

    /// Load or establish the identity for a verified assertion, handling the
    /// explicit key-rotation claim.
    async fn resolve_identity(&self, verified: &VerifiedAssertion) -> Result<ExternalIdentity> {
        if let Some(existing) = self
            .identities
            .find(&verified.fingerprint, &verified.assertion.subject)
            .await?
        {
            return Ok(existing);
        }

        // A new key explicitly claiming an existing identity: record the
        // pending link; control transfers only after out-of-band confirmation
        // (admin recovery in MVP). Unclaimed new keys are simply new identities.
        if let Some(old_fingerprint) = &verified.assertion.rotation_of_fingerprint {
            if let Some(existing) = self
                .identities
                .find(old_fingerprint, &verified.assertion.subject)
                .await?
            {
                self.identities
                    .create_pending_link(existing.id, &verified.fingerprint, &verified.assertion.issuer)
                    .await?;
                return Err(RegistryError::forbidden(
                    "key rotation recorded; awaiting confirmation before this key controls the publisher",
                ));
            }
        }

        self.identities
            .get_or_create(
                &verified.fingerprint,
                &verified.assertion.subject,
                &verified.assertion.issuer,
                verified.assertion.display_name.as_deref(),
            )
            .await
    }

    async fn issue_token(
        &self,
        identity_id: Uuid,
        publisher_id: Uuid,
        kind: TokenKind,
        label: String,
        token_scopes: Vec<String>,
        expires_in_secs: Option<u64>,
    ) -> Result<TokenIssued> {
        let plaintext = match kind {
            TokenKind::Grant => publisher_tokens::generate_grant_token(),
            TokenKind::Api => publisher_tokens::generate_api_token(),
        };
        let now = Utc::now();
        let expires_at = expires_in_secs.map(|s| now + chrono::Duration::seconds(s as i64));
        let token = PublisherToken {
            id: Uuid::new_v4(),
            identity_id,
            publisher_id,
            kind,
            label,
            token_hash: self.hash(&plaintext),
            scopes: token_scopes.clone(),
            created_at: now,
            expires_at,
            revoked_at: None,
            last_used_at: None,
        };
        self.tokens
            .create(
                &token,
                audit(
                    AuditActorType::Identity,
                    identity_id.to_string(),
                    "token.create",
                    "token",
                    token.id.to_string(),
                ),
            )
            .await?;
        let publisher = self
            .publishers
            .get(publisher_id)
            .await?
            .ok_or(RegistryError::NotFound("publisher"))?;
        Ok(TokenIssued {
            token: plaintext,
            token_id: token.id,
            kind,
            scopes: token_scopes,
            expires_at,
            publisher,
        })
    }
}

fn audit(
    actor_type: AuditActorType,
    actor: String,
    action: &str,
    subject_type: &str,
    subject_id: impl Into<String>,
) -> NewAuditEvent {
    NewAuditEvent {
        actor_type,
        actor,
        action: action.to_string(),
        subject_type: subject_type.to_string(),
        subject_id: subject_id.into(),
        details: serde_json::json!({}),
        request_id: None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ed25519_dalek::{Signer, SigningKey};

    fn make_signed(assertion: &IdentityAssertion, key: &SigningKey) -> SignedAssertion {
        let b64 = base64::engine::general_purpose::STANDARD;
        let payload_bytes = serde_json::to_vec(assertion).unwrap();
        let signature = key.sign(&payload_bytes);
        SignedAssertion {
            payload: b64.encode(&payload_bytes),
            signature: b64.encode(signature.to_bytes()),
        }
    }

    fn service() -> PublisherAuthService {
        // Only `verify_assertion` (pure) is exercised here; repos are unused.
        struct NoIdentities;
        struct NoPublishers;
        struct NoTokens;
        #[async_trait::async_trait]
        impl IdentityRepo for NoIdentities {
            async fn get(&self, _: Uuid) -> Result<Option<ExternalIdentity>> { Ok(None) }
            async fn find(&self, _: &str, _: &str) -> Result<Option<ExternalIdentity>> { Ok(None) }
            async fn get_or_create(&self, _: &str, _: &str, _: &str, _: Option<&str>) -> Result<ExternalIdentity> {
                unreachable!()
            }
            async fn find_by_subject(&self, _: &str) -> Result<Vec<ExternalIdentity>> { Ok(vec![]) }
            async fn create_pending_link(&self, _: Uuid, _: &str, _: &str) -> Result<Uuid> { unreachable!() }
            async fn confirm_pending_link(&self, _: Uuid, _: NewAuditEvent) -> Result<bool> { unreachable!() }
        }
        #[async_trait::async_trait]
        impl PublisherRepo for NoPublishers {
            async fn get(&self, _: Uuid) -> Result<Option<Publisher>> { Ok(None) }
            async fn get_by_handle(&self, _: &str) -> Result<Option<Publisher>> { Ok(None) }
            async fn create_with_owner(&self, _: NewPublisher, _: Uuid, _: NewAuditEvent) -> Result<Publisher> {
                unreachable!()
            }
            async fn member_role(&self, _: Uuid, _: Uuid) -> Result<Option<MemberRole>> { Ok(None) }
            async fn list_for_identity(&self, _: Uuid) -> Result<Vec<(Publisher, MemberRole)>> { Ok(vec![]) }
            async fn set_banned(&self, _: Uuid, _: bool, _: NewAuditEvent) -> Result<bool> { Ok(false) }
        }
        #[async_trait::async_trait]
        impl TokenRepo for NoTokens {
            async fn create(&self, _: &PublisherToken, _: NewAuditEvent) -> Result<()> { Ok(()) }
            async fn find_active_by_hash(&self, _: &str) -> Result<Option<PublisherToken>> { Ok(None) }
            async fn list_for_identity(&self, _: Uuid) -> Result<Vec<PublisherToken>> { Ok(vec![]) }
            async fn revoke(&self, _: TokenId, _: NewAuditEvent) -> Result<bool> { Ok(false) }
            async fn touch_last_used(&self, _: TokenId) -> Result<()> { Ok(()) }
            async fn create_grant_code(&self, _: &GrantCode) -> Result<()> { Ok(()) }
            async fn consume_grant_code(&self, _: &str) -> Result<Option<GrantCode>> { Ok(None) }
        }
        PublisherAuthService::new(
            Arc::new(NoIdentities),
            Arc::new(NoPublishers),
            Arc::new(NoTokens),
            Arc::new(crate::ports::cache::NoopCache),
            AuthConfig::default(),
            "https://skills.example.com/",
        )
    }

    fn assertion_for(key: &SigningKey) -> IdentityAssertion {
        let now = Utc::now().timestamp();
        IdentityAssertion {
            public_key: base64::engine::general_purpose::STANDARD.encode(key.verifying_key().to_bytes()),
            subject: "user-123".into(),
            issuer: "https://flow.acme.com".into(),
            audience: "https://skills.example.com".into(),
            return_uri: "https://flow.acme.com/registry/callback".into(),
            state: "csrf".into(),
            jti: Uuid::new_v4().to_string(),
            issued_at: now,
            expires_at: now + 60,
            display_name: Some("Alice".into()),
            rotation_of_fingerprint: None,
        }
    }

    #[test]
    fn verifies_valid_assertion_and_derives_fingerprint() {
        let key = SigningKey::from_bytes(&[7u8; 32]);
        let svc = service();
        let assertion = assertion_for(&key);
        let verified = svc.verify_assertion(&make_signed(&assertion, &key)).unwrap();
        assert_eq!(verified.assertion.subject, "user-123");
        assert_eq!(
            verified.fingerprint,
            hex::encode(Sha256::digest(key.verifying_key().to_bytes()))
        );
    }

    #[test]
    fn rejects_tampered_payload_and_wrong_audience_and_expiry() {
        let key = SigningKey::from_bytes(&[7u8; 32]);
        let svc = service();

        // Tampered payload
        let mut signed = make_signed(&assertion_for(&key), &key);
        let mut other = assertion_for(&key);
        other.subject = "attacker".into();
        signed.payload = base64::engine::general_purpose::STANDARD.encode(serde_json::to_vec(&other).unwrap());
        assert!(svc.verify_assertion(&signed).is_err());

        // Wrong audience
        let mut wrong_aud = assertion_for(&key);
        wrong_aud.audience = "https://evil.example.com".into();
        assert!(svc.verify_assertion(&make_signed(&wrong_aud, &key)).is_err());

        // Expired
        let mut expired = assertion_for(&key);
        expired.issued_at -= 3600;
        expired.expires_at -= 3600;
        assert!(svc.verify_assertion(&make_signed(&expired, &key)).is_err());

        // Signed by a different key than the embedded one
        let other_key = SigningKey::from_bytes(&[9u8; 32]);
        assert!(svc.verify_assertion(&make_signed(&assertion_for(&key), &other_key)).is_err());
    }
}
