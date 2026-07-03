-- compatibility: backward-compatible (initial schema)
-- notes: creates all registry tables, constraints, FTS/trigram indexes, and
--        immutability triggers. Requires PostgreSQL 14+. Takes no long locks
--        on an empty database.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- Identity & publisher authorization
-- ---------------------------------------------------------------------------

CREATE TABLE external_identities (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_key_fingerprint TEXT NOT NULL,
    subject                  TEXT NOT NULL,
    issuer_label             TEXT NOT NULL,
    display_name             TEXT,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_identity_key_subject UNIQUE (provider_key_fingerprint, subject)
);

CREATE INDEX idx_identities_subject ON external_identities (subject);

-- Key-rotation: a new instance key claiming an existing identity stays
-- pending until confirmed by an existing grant, admin, or old-key assertion.
CREATE TABLE pending_identity_links (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    existing_identity_id UUID NOT NULL REFERENCES external_identities (id) ON DELETE CASCADE,
    new_key_fingerprint  TEXT NOT NULL,
    new_issuer_label     TEXT NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at         TIMESTAMPTZ,
    CONSTRAINT uq_pending_link UNIQUE (existing_identity_id, new_key_fingerprint)
);

CREATE TABLE publishers (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle         TEXT NOT NULL,
    display_name   TEXT NOT NULL,
    publisher_type TEXT NOT NULL CHECK (publisher_type IN ('personal', 'organization')),
    verified       BOOLEAN NOT NULL DEFAULT false,
    banned_at      TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_publisher_handle UNIQUE (handle),
    CONSTRAINT ck_publisher_handle CHECK (handle ~ '^[a-z0-9][a-z0-9-]{0,37}[a-z0-9]$')
);

CREATE TABLE publisher_members (
    publisher_id UUID NOT NULL REFERENCES publishers (id) ON DELETE CASCADE,
    identity_id  UUID NOT NULL REFERENCES external_identities (id) ON DELETE CASCADE,
    role         TEXT NOT NULL CHECK (role IN ('owner', 'maintainer')),
    added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (publisher_id, identity_id)
);

CREATE INDEX idx_publisher_members_identity ON publisher_members (identity_id);

-- One-time grant codes (browser step); only hashes are stored.
CREATE TABLE publisher_grants (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id  UUID NOT NULL REFERENCES external_identities (id) ON DELETE CASCADE,
    publisher_id UUID NOT NULL REFERENCES publishers (id) ON DELETE CASCADE,
    code_hash    TEXT NOT NULL,
    scopes       TEXT[] NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at   TIMESTAMPTZ NOT NULL,
    consumed_at  TIMESTAMPTZ,
    CONSTRAINT uq_grant_code_hash UNIQUE (code_hash)
);

-- Publisher grant tokens and API tokens; only hashes are stored.
CREATE TABLE api_tokens (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id  UUID NOT NULL REFERENCES external_identities (id) ON DELETE CASCADE,
    publisher_id UUID NOT NULL REFERENCES publishers (id) ON DELETE CASCADE,
    kind         TEXT NOT NULL CHECK (kind IN ('grant', 'api')),
    label        TEXT NOT NULL,
    token_hash   TEXT NOT NULL,
    scopes       TEXT[] NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at   TIMESTAMPTZ,
    revoked_at   TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    CONSTRAINT uq_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_api_tokens_identity ON api_tokens (identity_id) WHERE revoked_at IS NULL;

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

CREATE TABLE skills (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher_id    UUID NOT NULL REFERENCES publishers (id),
    slug            TEXT NOT NULL,
    name            TEXT NOT NULL,
    summary         TEXT NOT NULL DEFAULT '',
    description     TEXT NOT NULL DEFAULT '',
    categories      TEXT[] NOT NULL DEFAULT '{}',
    tags            TEXT[] NOT NULL DEFAULT '{}',
    license         TEXT,
    visibility      TEXT NOT NULL DEFAULT 'public'
                    CHECK (visibility IN ('public', 'unlisted', 'hidden')),
    -- Denormalized aggregate maintained by the download-aggregation job;
    -- used only for popularity sorting, never business decisions.
    downloads_total BIGINT NOT NULL DEFAULT 0,
    -- Denormalized latest published release facts for list queries.
    latest_version    TEXT,
    latest_release_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    search_tsv      TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('simple', coalesce(slug, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(array_to_string(tags, ' '), '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(description, '')), 'C')
    ) STORED,
    CONSTRAINT uq_skill_publisher_slug UNIQUE (publisher_id, slug),
    CONSTRAINT ck_skill_slug CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$')
);

CREATE INDEX idx_skills_search ON skills USING gin (search_tsv);
CREATE INDEX idx_skills_slug_trgm ON skills USING gin (slug gin_trgm_ops);
CREATE INDEX idx_skills_name_trgm ON skills USING gin (name gin_trgm_ops);
CREATE INDEX idx_skills_updated ON skills (updated_at DESC, id DESC);
CREATE INDEX idx_skills_created ON skills (created_at DESC, id DESC);
CREATE INDEX idx_skills_downloads ON skills (downloads_total DESC, id DESC);
CREATE INDEX idx_skills_categories ON skills USING gin (categories);
CREATE INDEX idx_skills_tags ON skills USING gin (tags);

-- Old slugs keep working after renames; unique per publisher.
CREATE TABLE skill_aliases (
    publisher_id UUID NOT NULL REFERENCES publishers (id),
    old_slug     TEXT NOT NULL,
    skill_id     UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (publisher_id, old_slug)
);

-- ---------------------------------------------------------------------------
-- Artifacts (immutable, content-addressed)
-- ---------------------------------------------------------------------------

CREATE TABLE artifacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sha256          TEXT NOT NULL,
    storage_key     TEXT NOT NULL,
    media_type      TEXT NOT NULL,
    size_bytes      BIGINT NOT NULL,
    expanded_bytes  BIGINT NOT NULL,
    file_count      INTEGER NOT NULL,
    -- Declared script metadata (manifest scripts[]), JSONB array.
    scripts         JSONB NOT NULL DEFAULT '[]',
    -- Aggregated safety facts extracted at validation time.
    safety          JSONB NOT NULL DEFAULT '{}',
    min_chengos_version TEXT NOT NULL,
    max_chengos_version TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_artifact_sha256 UNIQUE (sha256),
    CONSTRAINT ck_artifact_sha256 CHECK (sha256 ~ '^[a-f0-9]{64}$')
);

CREATE TABLE artifact_files (
    artifact_id UUID NOT NULL REFERENCES artifacts (id) ON DELETE CASCADE,
    path        TEXT NOT NULL,
    size_bytes  BIGINT NOT NULL,
    sha256      TEXT NOT NULL,
    kind        TEXT NOT NULL CHECK (kind IN ('skill_md', 'skill_yaml', 'workflow_json', 'reference', 'script')),
    PRIMARY KEY (artifact_id, path)
);

-- ---------------------------------------------------------------------------
-- Releases
-- ---------------------------------------------------------------------------

CREATE TABLE skill_releases (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id            UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    version             TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'pending_upload' CHECK (status IN (
                          'pending_upload', 'uploaded', 'scanning', 'needs_review',
                          'approved', 'published', 'rejected', 'yanked', 'quarantined')),
    changelog           TEXT,
    min_chengos_version TEXT NOT NULL DEFAULT '0.1.0',
    max_chengos_version TEXT,
    artifact_id         UUID REFERENCES artifacts (id),
    created_by_identity UUID NOT NULL REFERENCES external_identities (id),
    published_at        TIMESTAMPTZ,
    yanked_at           TIMESTAMPTZ,
    yank_reason         TEXT,
    quarantined_at      TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_release_skill_version UNIQUE (skill_id, version)
);

CREATE INDEX idx_releases_skill ON skill_releases (skill_id, created_at DESC);
CREATE INDEX idx_releases_status ON skill_releases (status, updated_at);
CREATE INDEX idx_releases_artifact ON skill_releases (artifact_id);
CREATE INDEX idx_releases_published ON skill_releases (skill_id, published_at DESC)
    WHERE status = 'published';

-- Immutability guard: version and a bound artifact can never change.
CREATE FUNCTION guard_release_immutability() RETURNS trigger AS $$
BEGIN
    IF NEW.version IS DISTINCT FROM OLD.version THEN
        RAISE EXCEPTION 'release version is immutable';
    END IF;
    IF OLD.artifact_id IS NOT NULL AND NEW.artifact_id IS DISTINCT FROM OLD.artifact_id THEN
        RAISE EXCEPTION 'release artifact binding is immutable';
    END IF;
    IF NEW.skill_id IS DISTINCT FROM OLD.skill_id THEN
        RAISE EXCEPTION 'release skill binding is immutable';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_release_immutability
    BEFORE UPDATE ON skill_releases
    FOR EACH ROW EXECUTE FUNCTION guard_release_immutability();

-- Artifacts bound to any release are immutable rows.
CREATE FUNCTION guard_artifact_immutability() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'artifact records are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_artifact_immutability
    BEFORE UPDATE ON artifacts
    FOR EACH ROW EXECUTE FUNCTION guard_artifact_immutability();

CREATE TABLE release_tags (
    skill_id   UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    tag        TEXT NOT NULL,
    release_id UUID NOT NULL REFERENCES skill_releases (id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, tag)
);

-- ---------------------------------------------------------------------------
-- Scanning (append-only)
-- ---------------------------------------------------------------------------

CREATE TABLE scan_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id      UUID NOT NULL REFERENCES skill_releases (id) ON DELETE CASCADE,
    artifact_id     UUID NOT NULL REFERENCES artifacts (id),
    scanner_name    TEXT NOT NULL,
    scanner_version TEXT NOT NULL,
    policy_version  TEXT NOT NULL,
    conclusion      TEXT NOT NULL CHECK (conclusion IN ('clean', 'findings', 'error')),
    started_at      TIMESTAMPTZ NOT NULL,
    finished_at     TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_scan_reports_release ON scan_reports (release_id, finished_at DESC);
CREATE INDEX idx_scan_reports_policy ON scan_reports (policy_version);

CREATE TABLE scan_findings (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_id  UUID NOT NULL REFERENCES scan_reports (id) ON DELETE CASCADE,
    kind       TEXT NOT NULL,
    severity   TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    code       TEXT NOT NULL,
    message    TEXT NOT NULL,
    path       TEXT,
    line       INTEGER,
    excerpt    TEXT
);

CREATE INDEX idx_scan_findings_report ON scan_findings (report_id);

CREATE FUNCTION guard_append_only() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION '% is append-only', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_scan_reports_append_only
    BEFORE UPDATE OR DELETE ON scan_reports
    FOR EACH ROW EXECUTE FUNCTION guard_append_only();

-- ---------------------------------------------------------------------------
-- Moderation & audit (append-only)
-- ---------------------------------------------------------------------------

CREATE TABLE reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id    UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    release_id  UUID REFERENCES skill_releases (id) ON DELETE SET NULL,
    reason      TEXT NOT NULL,
    details     TEXT NOT NULL DEFAULT '',
    contact     TEXT,
    status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_status ON reports (status, created_at);

CREATE TABLE moderation_actions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind         TEXT NOT NULL,
    actor        TEXT NOT NULL,
    skill_id     UUID,
    release_id   UUID,
    publisher_id UUID,
    report_id    UUID,
    reason       TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_moderation_actions_release ON moderation_actions (release_id, created_at DESC);

CREATE TRIGGER trg_moderation_actions_append_only
    BEFORE UPDATE OR DELETE ON moderation_actions
    FOR EACH ROW EXECUTE FUNCTION guard_append_only();

CREATE TABLE audit_events (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type   TEXT NOT NULL CHECK (actor_type IN ('anonymous', 'identity', 'admin', 'system')),
    actor        TEXT NOT NULL,
    action       TEXT NOT NULL,
    subject_type TEXT NOT NULL,
    subject_id   TEXT NOT NULL,
    details      JSONB NOT NULL DEFAULT '{}',
    request_id   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_subject ON audit_events (subject_type, subject_id, created_at DESC);
CREATE INDEX idx_audit_created ON audit_events (created_at DESC);

CREATE TRIGGER trg_audit_events_append_only
    BEFORE UPDATE OR DELETE ON audit_events
    FOR EACH ROW EXECUTE FUNCTION guard_append_only();

-- ---------------------------------------------------------------------------
-- Download statistics (privacy-preserving daily aggregates)
-- ---------------------------------------------------------------------------

CREATE TABLE download_events_daily (
    release_id UUID NOT NULL REFERENCES skill_releases (id) ON DELETE CASCADE,
    day        DATE NOT NULL,
    downloads  BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (release_id, day)
);

-- Idempotency guard for counter flush batches.
CREATE TABLE download_counter_batches (
    batch_id   TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Durable job outbox
-- ---------------------------------------------------------------------------

CREATE TABLE job_outbox (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type           TEXT NOT NULL,
    schema_version     INTEGER NOT NULL DEFAULT 1,
    payload            JSONB NOT NULL,
    status             TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                         'pending', 'dispatched', 'running', 'completed', 'dead_lettered')),
    trace_id           TEXT,
    idempotency_key    TEXT,
    attempts           INTEGER NOT NULL DEFAULT 0,
    max_attempts       INTEGER NOT NULL DEFAULT 5,
    run_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    lease_owner        TEXT,
    lease_expires_at   TIMESTAMPTZ,
    last_error         TEXT,
    dead_letter_reason TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_job_idempotency UNIQUE (idempotency_key)
);

CREATE INDEX idx_job_outbox_due ON job_outbox (run_at)
    WHERE status IN ('pending', 'dispatched', 'running');
CREATE INDEX idx_job_outbox_status ON job_outbox (status, job_type);
