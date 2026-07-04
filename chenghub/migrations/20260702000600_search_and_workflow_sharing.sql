-- compatibility: backward-compatible
-- notes: trigram similarity for similar-title detection (Chinese-friendly:
--        pg_trgm works on any UTF-8 text), plus sanitized workflow shares.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Similar-title lookup and ILIKE fallback search both use this index.
CREATE INDEX idx_posts_title_trgm ON posts USING GIN (title gin_trgm_ops);
CREATE INDEX idx_posts_body_trgm ON posts USING GIN (body_md gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Sanitized workflow sharing
-- ---------------------------------------------------------------------------

CREATE TABLE workflow_shares (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id          UUID NOT NULL REFERENCES chenghub_users (id),
    title             TEXT NOT NULL,
    summary           TEXT NOT NULL DEFAULT '',
    -- Sanitized workflow document produced by the local ChengFlow exporter.
    -- Server-side validation re-checks for residual secret material.
    payload           JSONB NOT NULL,
    node_types        TEXT[] NOT NULL DEFAULT '{}',
    node_count        INT NOT NULL DEFAULT 0,
    -- Local exporter versioning for forward compatibility.
    compat_version    TEXT NOT NULL DEFAULT '1',
    sanitizer_version TEXT NOT NULL DEFAULT '1',
    hidden_at         TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_workflow_shares_touch
    BEFORE UPDATE ON workflow_shares
    FOR EACH ROW EXECUTE FUNCTION chenghub_touch_updated_at();

CREATE INDEX idx_workflow_shares_owner ON workflow_shares (owner_id);

-- Variables/credentials the importing user must provide (secrets were
-- stripped locally; these are the named placeholders left behind).
CREATE TABLE workflow_share_required_variables (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_id    UUID NOT NULL REFERENCES workflow_shares (id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    kind        TEXT NOT NULL CHECK (kind IN ('credential', 'env', 'variable')),
    description TEXT NOT NULL DEFAULT '',
    required    BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT uq_share_variable UNIQUE (share_id, kind, name)
);

-- Sanitizer findings surfaced to viewers ("2 API keys removed", ...).
CREATE TABLE workflow_share_safety_findings (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_id UUID NOT NULL REFERENCES workflow_shares (id) ON DELETE CASCADE,
    kind     TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning')),
    message  TEXT NOT NULL,
    path     TEXT
);

-- posts.workflow_share_id was created before this table existed.
ALTER TABLE posts
    ADD CONSTRAINT fk_posts_workflow_share
    FOREIGN KEY (workflow_share_id) REFERENCES workflow_shares (id) ON DELETE SET NULL;
