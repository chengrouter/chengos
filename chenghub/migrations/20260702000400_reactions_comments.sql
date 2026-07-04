-- compatibility: backward-compatible
-- notes: comments, reactions, and the counter triggers. posts.comments_count
--        changes only when comments are created, deleted, hidden, or
--        restored; comment likes never touch it.

CREATE TABLE comments (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id    UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    author_id  UUID NOT NULL REFERENCES chenghub_users (id),
    body_md    TEXT NOT NULL,
    like_count INT NOT NULL DEFAULT 0,
    hidden_at  TIMESTAMPTZ,
    hidden_by  UUID REFERENCES chenghub_users (id),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_comments_touch
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION chenghub_touch_updated_at();

CREATE INDEX idx_comments_post ON comments (post_id, created_at);
CREATE INDEX idx_comments_author ON comments (author_id);

-- Post reactions. Support is one-way at the service layer (no public DELETE
-- path); like/star toggle by insert/delete.
CREATE TABLE post_reactions (
    user_id       UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    post_id       UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('support', 'like', 'star')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id, reaction_type)
);

CREATE INDEX idx_post_reactions_post ON post_reactions (post_id, reaction_type);

CREATE TABLE comment_reactions (
    user_id       UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    comment_id    UUID NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, comment_id, reaction_type)
);

CREATE INDEX idx_comment_reactions_comment ON comment_reactions (comment_id);

-- ---------------------------------------------------------------------------
-- Counter triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION chenghub_post_reaction_counters() RETURNS trigger AS $$
DECLARE
    delta INT;
    target UUID;
    r TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        delta := 1; target := NEW.post_id; r := NEW.reaction_type;
    ELSE
        delta := -1; target := OLD.post_id; r := OLD.reaction_type;
    END IF;
    IF r = 'support' THEN
        UPDATE posts SET support_count = GREATEST(support_count + delta, 0) WHERE id = target;
    ELSIF r = 'like' THEN
        UPDATE posts SET like_count = GREATEST(like_count + delta, 0) WHERE id = target;
    ELSIF r = 'star' THEN
        UPDATE posts SET star_count = GREATEST(star_count + delta, 0) WHERE id = target;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_post_reaction_counters
    AFTER INSERT OR DELETE ON post_reactions
    FOR EACH ROW EXECUTE FUNCTION chenghub_post_reaction_counters();

CREATE OR REPLACE FUNCTION chenghub_comment_reaction_counters() RETURNS trigger AS $$
DECLARE
    delta INT;
    target UUID;
BEGIN
    IF TG_OP = 'INSERT' THEN
        delta := 1; target := NEW.comment_id;
    ELSE
        delta := -1; target := OLD.comment_id;
    END IF;
    UPDATE comments SET like_count = GREATEST(like_count + delta, 0) WHERE id = target;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comment_reaction_counters
    AFTER INSERT OR DELETE ON comment_reactions
    FOR EACH ROW EXECUTE FUNCTION chenghub_comment_reaction_counters();

-- posts.comments_count counts *visible* comments (not deleted, not hidden).
CREATE OR REPLACE FUNCTION chenghub_comment_counters() RETURNS trigger AS $$
DECLARE
    was_visible BOOLEAN;
    is_visible  BOOLEAN;
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.deleted_at IS NULL AND NEW.hidden_at IS NULL THEN
            UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        END IF;
        RETURN NULL;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.deleted_at IS NULL AND OLD.hidden_at IS NULL THEN
            UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
        END IF;
        RETURN NULL;
    END IF;
    -- UPDATE: adjust only when visibility flips (delete/hide/restore).
    was_visible := OLD.deleted_at IS NULL AND OLD.hidden_at IS NULL;
    is_visible  := NEW.deleted_at IS NULL AND NEW.hidden_at IS NULL;
    IF was_visible AND NOT is_visible THEN
        UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = NEW.post_id;
    ELSIF is_visible AND NOT was_visible THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comment_counters
    AFTER INSERT OR UPDATE OF deleted_at, hidden_at OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION chenghub_comment_counters();
