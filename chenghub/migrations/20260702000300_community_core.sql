-- compatibility: backward-compatible
-- notes: posts, requirement status history, tags. Counter columns are
--        maintained by triggers created in the reactions/comments migration.

CREATE TABLE posts (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id            UUID NOT NULL REFERENCES chenghub_users (id),
    post_type            TEXT NOT NULL
                         CHECK (post_type IN ('requirement', 'experience', 'workflow', 'discussion')),
    title                TEXT NOT NULL,
    body_md              TEXT NOT NULL DEFAULT '',
    -- Denormalized copy of post_tags for cheap rendering; post_tags is the
    -- indexed filter source. Both change in the same transaction.
    tags                 TEXT[] NOT NULL DEFAULT '{}',
    -- Requirement lifecycle status. NULL for non-requirement posts; the API
    -- never surfaces a status workflow for those.
    status               TEXT
                         CHECK (status IN ('new', 'triaged', 'planned', 'in_progress', 'done', 'rejected', 'duplicate')),
    duplicate_of_post_id UUID REFERENCES posts (id),
    -- Set for workflow posts once the share is stored (FK added in the
    -- workflow-sharing migration, which creates workflow_shares).
    workflow_share_id    UUID,
    support_count        INT NOT NULL DEFAULT 0,
    like_count           INT NOT NULL DEFAULT 0,
    star_count           INT NOT NULL DEFAULT 0,
    comments_count       INT NOT NULL DEFAULT 0,
    hidden_at            TIMESTAMPTZ,
    hidden_by            UUID REFERENCES chenghub_users (id),
    deleted_at           TIMESTAMPTZ,
    locked_at            TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_activity_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    search_tsv           TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(body_md, '')), 'C')
    ) STORED,
    -- Status exists exactly for requirement posts.
    CONSTRAINT ck_posts_status_requirement
        CHECK ((post_type = 'requirement') = (status IS NOT NULL)),
    -- duplicate status always points at its target.
    CONSTRAINT ck_posts_duplicate_target
        CHECK (status IS DISTINCT FROM 'duplicate' OR duplicate_of_post_id IS NOT NULL),
    CONSTRAINT ck_posts_no_self_duplicate
        CHECK (duplicate_of_post_id IS NULL OR duplicate_of_post_id <> id)
);

CREATE TRIGGER trg_posts_touch
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION chenghub_touch_updated_at();

CREATE INDEX idx_posts_type ON posts (post_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_status ON posts (status) WHERE status IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_posts_author ON posts (author_id);
-- hot: support desc, then activity, then id (cursor tie-break).
CREATE INDEX idx_posts_hot ON posts (support_count DESC, last_activity_at DESC, id DESC)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_newest ON posts (created_at DESC, id DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_active ON posts (last_activity_at DESC, id DESC) WHERE deleted_at IS NULL;
-- pending requirement triage queue.
CREATE INDEX idx_posts_pending ON posts (support_count DESC, id DESC)
    WHERE status IN ('new', 'triaged', 'planned', 'in_progress') AND deleted_at IS NULL;
CREATE INDEX idx_posts_search_tsv ON posts USING GIN (search_tsv);

CREATE TABLE post_status_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id     UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    from_status TEXT,
    to_status   TEXT NOT NULL,
    changed_by  UUID REFERENCES chenghub_users (id) ON DELETE SET NULL,
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_status_events_post ON post_status_events (post_id, created_at);

CREATE TABLE post_tags (
    post_id    UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    tag        TEXT NOT NULL,
    PRIMARY KEY (post_id, tag)
);

CREATE INDEX idx_post_tags_tag ON post_tags (tag);
