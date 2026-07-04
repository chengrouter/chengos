-- compatibility: backward-compatible
-- notes: abuse reports, moderation actions, user bans, audit events.

CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id     UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    subject_type    TEXT NOT NULL CHECK (subject_type IN ('post', 'comment')),
    subject_id      UUID NOT NULL,
    reason          TEXT NOT NULL CHECK (reason IN ('spam', 'abuse', 'illegal', 'sensitive', 'off_topic', 'other')),
    detail          TEXT NOT NULL DEFAULT '',
    status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at     TIMESTAMPTZ,
    resolved_by     UUID REFERENCES chenghub_users (id) ON DELETE SET NULL,
    resolution_note TEXT,
    -- One open report per user per subject.
    CONSTRAINT uq_reports_once UNIQUE (reporter_id, subject_type, subject_id)
);

CREATE INDEX idx_reports_status ON reports (status, created_at);
CREATE INDEX idx_reports_subject ON reports (subject_type, subject_id);

-- Every hide/restore/ban/merge writes a moderation action row (queryable
-- moderation history) in the same transaction.
CREATE TABLE moderation_actions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id     UUID REFERENCES chenghub_users (id) ON DELETE SET NULL,
    action       TEXT NOT NULL,
    subject_type TEXT NOT NULL,
    subject_id   UUID NOT NULL,
    reason       TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_moderation_actions_subject ON moderation_actions (subject_type, subject_id);
CREATE INDEX idx_moderation_actions_time ON moderation_actions (created_at);

CREATE TABLE user_bans (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES chenghub_users (id) ON DELETE CASCADE,
    banned_by  UUID REFERENCES chenghub_users (id) ON DELETE SET NULL,
    reason     TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    lifted_at  TIMESTAMPTZ,
    lifted_by  UUID REFERENCES chenghub_users (id) ON DELETE SET NULL
);

CREATE INDEX idx_user_bans_user ON user_bans (user_id) WHERE lifted_at IS NULL;

-- Append-only audit stream for privileged and sensitive operations.
CREATE TABLE audit_events (
    id           BIGSERIAL PRIMARY KEY,
    actor_type   TEXT NOT NULL CHECK (actor_type IN ('user', 'moderator', 'operator', 'admin', 'system', 'cli')),
    actor        TEXT NOT NULL,
    action       TEXT NOT NULL,
    subject_type TEXT NOT NULL,
    subject_id   TEXT NOT NULL,
    details      JSONB NOT NULL DEFAULT '{}',
    request_id   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_events_time ON audit_events (created_at);
CREATE INDEX idx_audit_events_subject ON audit_events (subject_type, subject_id);
