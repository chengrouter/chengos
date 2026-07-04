//! Post lifecycle tests: creation, validation, editing, deletion, listing,
//! sorting, filtering, anonymous reads, and hidden-content visibility.

mod common;

use chenghub::domain::pagination::PageRequest;
use chenghub::domain::post::{PostFilter, PostSort, PostType, ViewerContext};
use chenghub::services::post_service::viewer_of;

#[tokio::test]
async fn requirement_creation_sets_status_and_history() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;

    let post = app
        .posts
        .create(&ctx, PostType::Requirement, "Need dark mode", "please", &["ui".into()], None)
        .await
        .unwrap();
    assert_eq!(post.status.map(|s| s.as_str()), Some("new"));

    let detail = app.posts.detail(post.id, &viewer_of(&ctx)).await.unwrap();
    assert_eq!(detail.status_history.len(), 1);
    assert_eq!(detail.status_history[0].to_status.as_str(), "new");

    // Non-requirement posts have no status and no history.
    let discussion = app
        .posts
        .create(&ctx, PostType::Discussion, "General chat", "hello", &[], None)
        .await
        .unwrap();
    assert!(discussion.status.is_none());
    let detail = app.posts.detail(discussion.id, &viewer_of(&ctx)).await.unwrap();
    assert!(detail.status_history.is_empty());
}

#[tokio::test]
async fn content_validation_rules() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;

    let long_title = "x".repeat(201);
    let err = app
        .posts
        .create(&ctx, PostType::Discussion, &long_title, "", &[], None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "TITLE_TOO_LONG");

    let err = app
        .posts
        .create(&ctx, PostType::Discussion, "  ", "", &[], None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "INVALID_PARAM");

    let big_body = "b".repeat(65 * 1024);
    let err = app
        .posts
        .create(&ctx, PostType::Discussion, "ok", &big_body, &[], None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "BODY_TOO_LARGE");

    let many_tags: Vec<String> = (0..9).map(|i| format!("tag{i}")).collect();
    let err = app
        .posts
        .create(&ctx, PostType::Discussion, "ok", "", &many_tags, None)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "TOO_MANY_TAGS");

    // Tags normalize to lowercase and dedupe.
    let post = app
        .posts
        .create(&ctx, PostType::Discussion, "tags", "", &["UI".into(), "ui".into()], None)
        .await
        .unwrap();
    assert_eq!(post.tags, vec!["ui".to_string()]);

    // Workflow share attachment is workflow-posts-only.
    let err = app
        .posts
        .create(&ctx, PostType::Discussion, "ok", "", &[], Some(uuid::Uuid::new_v4()))
        .await
        .unwrap_err();
    assert_eq!(err.code(), "INVALID_PARAM");
}

#[tokio::test]
async fn author_permissions_on_edit_and_delete() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let stranger = common::plain_user(&app).await;

    let post = app
        .posts
        .create(&author, PostType::Discussion, "mine", "body", &[], None)
        .await
        .unwrap();

    let err = app
        .posts
        .update(&stranger, post.id, "hijacked", "body", &[])
        .await
        .unwrap_err();
    assert_eq!(err.code(), "FORBIDDEN");
    let err = app.posts.delete(&stranger, post.id).await.unwrap_err();
    assert_eq!(err.code(), "FORBIDDEN");

    let updated = app
        .posts
        .update(&author, post.id, "mine v2", "body v2", &["x".into()])
        .await
        .unwrap();
    assert_eq!(updated.title, "mine v2");

    app.posts.delete(&author, post.id).await.unwrap();
    // Deleted posts vanish for everyone (author included).
    let err = app.posts.detail(post.id, &viewer_of(&author)).await.unwrap_err();
    assert_eq!(err.code(), "NOT_FOUND");
}

#[tokio::test]
async fn listing_sorts_filters_and_paginates() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;
    let marker = format!("m{}", uuid::Uuid::new_v4().simple());

    for i in 0..5 {
        app.posts
            .create(
                &ctx,
                PostType::Requirement,
                &format!("{marker} req {i}"),
                "",
                &[marker.clone()],
                None,
            )
            .await
            .unwrap();
    }

    // Tag filter + newest sort + pagination (2 + 2 + 1).
    let filter = PostFilter {
        post_type: Some(PostType::Requirement),
        status: None,
        tag: Some(marker.clone()),
        author: Some(ctx.user.id),
        viewer: ViewerContext::default(),
    };
    let first = app
        .posts
        .list(&filter, PostSort::Newest, PageRequest::new(Some(2), None))
        .await
        .unwrap();
    assert_eq!(first.items.len(), 2);
    let cursor = first.next_cursor.expect("expected a second page");
    let decoded = chenghub::domain::pagination::Cursor::decode(&cursor, "newest").unwrap();
    let second = app
        .posts
        .list(&filter, PostSort::Newest, PageRequest::new(Some(2), Some(decoded)))
        .await
        .unwrap();
    assert_eq!(second.items.len(), 2);
    // No overlap between pages.
    let first_ids: Vec<_> = first.items.iter().map(|r| r.post.id).collect();
    assert!(second.items.iter().all(|r| !first_ids.contains(&r.post.id)));

    // Pending sort surfaces open requirements.
    let pending = app
        .posts
        .list(&filter, PostSort::Pending, PageRequest::new(Some(10), None))
        .await
        .unwrap();
    assert_eq!(pending.items.len(), 5);
}

#[tokio::test]
async fn hidden_posts_visibility_matrix() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let moderator =
        common::user_with_roles(&app, &[chenghub::domain::roles::Role::Moderator]).await;
    let stranger = common::plain_user(&app).await;

    let post = app
        .posts
        .create(&author, PostType::Discussion, "to hide", "", &[], None)
        .await
        .unwrap();
    app.moderation
        .set_post_hidden(&moderator, post.id, true, "test")
        .await
        .unwrap();

    // Anonymous and stranger: gone. Author and moderator: visible.
    let anon = ViewerContext::default();
    assert_eq!(app.posts.detail(post.id, &anon).await.unwrap_err().code(), "NOT_FOUND");
    assert_eq!(
        app.posts.detail(post.id, &viewer_of(&stranger)).await.unwrap_err().code(),
        "NOT_FOUND"
    );
    assert!(app.posts.detail(post.id, &viewer_of(&author)).await.is_ok());
    assert!(app.posts.detail(post.id, &viewer_of(&moderator)).await.is_ok());

    // Restore brings it back for everyone.
    app.moderation
        .set_post_hidden(&moderator, post.id, false, "test")
        .await
        .unwrap();
    assert!(app.posts.detail(post.id, &anon).await.is_ok());
}
