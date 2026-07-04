//! Admin/moderation tests: role enforcement, status transitions, duplicate
//! merge without double counting, reports, and audit events.

mod common;

use chenghub::domain::moderation::{ReportReason, ReportSubjectType};
use chenghub::domain::pagination::PageRequest;
use chenghub::domain::post::{PostType, RequirementStatus};
use chenghub::domain::roles::Role;
use chenghub::ports::community_repository::{AuditRepo, PostRepo, ReactionRepo};

#[tokio::test]
async fn status_transitions_enforce_roles_and_rules() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let operator = common::user_with_roles(&app, &[Role::Operator]).await;
    let post = app
        .posts
        .create(&author, PostType::Requirement, "triage me", "", &[], None)
        .await
        .unwrap();

    // Plain users cannot triage.
    let err = app
        .requirements
        .set_status(&author, post.id, RequirementStatus::Triaged, None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "FORBIDDEN");

    // Operators can walk the lifecycle.
    for status in [
        RequirementStatus::Triaged,
        RequirementStatus::Planned,
        RequirementStatus::InProgress,
        RequirementStatus::Done,
    ] {
        app.requirements.set_status(&operator, post.id, status, Some("step")).await.unwrap();
    }

    // Done -> planned is not allowed; done -> triaged (reopen) is.
    let err = app
        .requirements
        .set_status(&operator, post.id, RequirementStatus::Planned, None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "INVALID_STATUS_TRANSITION");
    app.requirements
        .set_status(&operator, post.id, RequirementStatus::Triaged, None)
        .await
        .unwrap();

    // Duplicate must go through merge.
    let err = app
        .requirements
        .set_status(&operator, post.id, RequirementStatus::Duplicate, None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "DUPLICATE_TARGET_REQUIRED");

    // Status ops are requirement-only.
    let discussion = app
        .posts
        .create(&author, PostType::Discussion, "chat", "", &[], None)
        .await
        .unwrap();
    let err = app
        .requirements
        .set_status(&operator, discussion.id, RequirementStatus::Triaged, None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "NOT_REQUIREMENT");

    // History recorded every step (new + 4 walks + reopen).
    let history = PostRepo::status_history(&*app.repos, post.id).await.unwrap();
    assert_eq!(history.len(), 6);
}

#[tokio::test]
async fn duplicate_merge_copies_support_without_double_count() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let operator = common::user_with_roles(&app, &[Role::Operator]).await;

    let source = app
        .posts
        .create(&author, PostType::Requirement, "dup source", "", &[], None)
        .await
        .unwrap();
    let target = app
        .posts
        .create(&author, PostType::Requirement, "dup target", "", &[], None)
        .await
        .unwrap();

    // u1 supports only source; u2 supports both (must not double count).
    let u1 = common::plain_user(&app).await;
    let u2 = common::plain_user(&app).await;
    app.reactions.support(&u1, source.id).await.unwrap();
    app.reactions.support(&u2, source.id).await.unwrap();
    app.reactions.support(&u2, target.id).await.unwrap();

    let outcome = app
        .requirements
        .merge(&operator, source.id, target.id, Some("same request"))
        .await
        .unwrap();
    assert_eq!(outcome.supports_copied, 1); // only u1 was new to the target
    assert_eq!(outcome.target_support_count, 2); // u1 + u2, not 3

    let merged_source = PostRepo::get(&*app.repos, source.id).await.unwrap().unwrap();
    assert_eq!(merged_source.status, Some(RequirementStatus::Duplicate));
    assert_eq!(merged_source.duplicate_of_post_id, Some(target.id));

    // Detail exposes the duplicate banner.
    let detail = app
        .posts
        .detail(source.id, &chenghub::domain::post::ViewerContext::default())
        .await
        .unwrap();
    assert_eq!(detail.duplicate_of.as_ref().map(|(id, _)| *id), Some(target.id));

    // Merging into a duplicate is refused.
    let third = app
        .posts
        .create(&author, PostType::Requirement, "third", "", &[], None)
        .await
        .unwrap();
    let err = app
        .requirements
        .merge(&operator, third.id, source.id, None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "MERGE_TARGET_INVALID");

    // Support state is per-user visible on the target.
    let states = ReactionRepo::post_states(&*app.repos, u1.user.id, &[target.id])
        .await
        .unwrap();
    assert!(states.get(&target.id).map(|s| s.supported).unwrap_or(false));
}

#[tokio::test]
async fn reports_flow_and_role_gates() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let reporter = common::plain_user(&app).await;
    let moderator = common::user_with_roles(&app, &[Role::Moderator]).await;

    let post = app
        .posts
        .create(&author, PostType::Discussion, "reported", "", &[], None)
        .await
        .unwrap();

    let report = app
        .moderation
        .file_report(&reporter, ReportSubjectType::Post, post.id, ReportReason::Spam, "spammy")
        .await
        .unwrap();

    // Duplicate report by the same user conflicts.
    let err = app
        .moderation
        .file_report(&reporter, ReportSubjectType::Post, post.id, ReportReason::Spam, "again")
        .await
        .unwrap_err();
    assert_eq!(err.code(), "UNIQUE_CONFLICT");

    // Plain users cannot read the queue; moderators can.
    let err = app
        .moderation
        .list_reports(&reporter, None, PageRequest::new(Some(10), None))
        .await
        .unwrap_err();
    assert_eq!(err.code(), "FORBIDDEN");
    app.moderation
        .list_reports(&moderator, None, PageRequest::new(Some(10), None))
        .await
        .unwrap();

    let resolved = app
        .moderation
        .resolve_report(&moderator, report.id, false, Some("handled"))
        .await
        .unwrap();
    assert_eq!(resolved.status.as_str(), "resolved");

    // Double resolution is refused.
    let err = app
        .moderation
        .resolve_report(&moderator, report.id, true, None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "REPORT_ALREADY_RESOLVED");
}

#[tokio::test]
async fn privileged_operations_write_audit_events() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let operator = common::user_with_roles(&app, &[Role::Operator]).await;

    let post = app
        .posts
        .create(&author, PostType::Requirement, "audited", "", &[], None)
        .await
        .unwrap();
    app.requirements
        .set_status(&operator, post.id, RequirementStatus::Triaged, None)
        .await
        .unwrap();

    let events = AuditRepo::list(&*app.repos, None, 100).await.unwrap();
    let found = events.iter().any(|e| {
        e.action == "requirement.status" && e.subject_id == post.id.to_string()
    });
    assert!(found, "status change must write an audit event");
}
