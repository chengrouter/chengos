-- compatibility: backward-compatible
-- notes: browser sessions, opaque tokens (hash-only), device authorizations.

-- Browser sessions: HTTP-only cookie carries the raw session id; only the
-- HMAC hash is stored.
CREATE TABLE browser_sessions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    session_hash TEXT NOT NULL,
    user_agent   TEXT,
    ip           TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at   TIMESTAMPTZ NOT NULL,
    revoked_at   TIMESTAMPTZ,
    CONSTRAINT uq_browser_sessions_hash UNIQUE (session_hash)
);

CREATE INDEX idx_browser_sessions_user ON browser_sessions (user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_browser_sessions_expiry ON browser_sessions (expires_at);

-- Opaque bearer access tokens; only hashes are stored, individually revocable.
CREATE TABLE access_tokens (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    token_hash   TEXT NOT NULL,
    label        TEXT NOT NULL DEFAULT '',
    scopes       TEXT[] NOT NULL DEFAULT '{community}',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at   TIMESTAMPTZ NOT NULL,
    revoked_at   TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    CONSTRAINT uq_access_tokens_hash UNIQUE (token_hash)
);

CREATE INDEX idx_access_tokens_user ON access_tokens (user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_access_tokens_expiry ON access_tokens (expires_at);

-- Refresh tokens rotate: using one revokes it and records its successor.
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    access_token_id UUID REFERENCES access_tokens (id) ON DELETE SET NULL,
    token_hash      TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    rotated_to      UUID REFERENCES refresh_tokens (id) ON DELETE SET NULL,
    CONSTRAINT uq_refresh_tokens_hash UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_refresh_tokens_expiry ON refresh_tokens (expires_at);

-- OAuth 2.0 Device Authorization Flow (RFC 8628) state.
CREATE TABLE device_authorizations (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_code_hash TEXT NOT NULL,
    -- Human-entered code, stored uppercase without separators.
    user_code        TEXT NOT NULL,
    client_name      TEXT NOT NULL DEFAULT 'chengflow',
    scopes           TEXT[] NOT NULL DEFAULT '{community}',
    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'approved', 'denied', 'expired', 'consumed')),
    user_id          UUID REFERENCES chenghub_users (id) ON DELETE SET NULL,
    interval_secs    INT NOT NULL DEFAULT 5,
    last_polled_at   TIMESTAMPTZ,
    approved_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at       TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_device_code_hash UNIQUE (device_code_hash),
    CONSTRAINT uq_device_user_code UNIQUE (user_code)
);

CREATE INDEX idx_device_authorizations_expiry ON device_authorizations (expires_at);
