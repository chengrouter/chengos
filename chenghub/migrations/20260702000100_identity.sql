-- compatibility: backward-compatible (initial identity schema)
-- notes: users, external identities, roles. Requires PostgreSQL 14+.

CREATE OR REPLACE FUNCTION chenghub_touch_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE chenghub_users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Stable public handle, derived from the first provider profile and
    -- de-duplicated with a numeric suffix.
    username     TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url   TEXT,
    email        TEXT,
    banned_at    TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_chenghub_users_username UNIQUE (username),
    CONSTRAINT ck_chenghub_username CHECK (username ~ '^[a-z0-9][a-z0-9_-]{0,38}$')
);

CREATE TRIGGER trg_chenghub_users_touch
    BEFORE UPDATE ON chenghub_users
    FOR EACH ROW EXECUTE FUNCTION chenghub_touch_updated_at();

-- One ChengHub user may bind multiple external identities; a provider
-- subject maps to exactly one user.
CREATE TABLE external_identities (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    provider         TEXT NOT NULL CHECK (provider IN ('github', 'wechat', 'qq')),
    -- GitHub numeric id, WeChat unionid (or openid fallback), QQ openid.
    provider_subject TEXT NOT NULL,
    display_name     TEXT,
    avatar_url       TEXT,
    email            TEXT,
    -- Normalized provider profile snapshot; provider-specific fields stay
    -- out of chenghub_users.
    profile          JSONB NOT NULL DEFAULT '{}',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_external_identity UNIQUE (provider, provider_subject)
);

CREATE INDEX idx_external_identities_user ON external_identities (user_id);

CREATE TABLE user_roles (
    user_id    UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    role       TEXT NOT NULL CHECK (role IN ('user', 'moderator', 'operator', 'admin')),
    granted_by UUID REFERENCES chenghub_users (id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role)
);
