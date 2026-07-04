//! Reaction and comment counter tests: support-once semantics, like/star
//! toggles, comment count correctness under hide/delete, comment likes.

mod common;

use chenghub::domain::pagination::PageRequest;
use chenghub::domain::post::PostType;
use chenghub::ports::community_repository::PostRepo;
use chenghub::services::post_service::viewer_of;

async fn fresh_post(app: &common::TestApp, ctx: &chenghub::services::identity_service::AuthContext) -> chenghub::domain::post::Post {
    app.posts
        .create(ctx, PostType::Requirement, "reaction target", "", &[], None)
        .await
        .unwrap()
}

#[tokio::test]
async fn support_is_once_and_not_removable() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let supporter = common::plain_user(&app).await;
    let post = fresh_post(&app, &author).await;

    let state = app.reactions.support(&supporter, post.id).await.unwrap();
    assert!(state.supported);
    let after_first = PostRepo::get(&*app.repos, post.id).await.unwrap().unwrap();
    assert_eq!(after_first.support_count, 1);

    // Second support is idempotent: still supported, count unchanged.
    let state = app.reactions.support(&supporter, post.id).await.unwrap();
    assert!(state.supported);
    let after_second = PostRepo::get(&*app.repos, post.id).await.unwrap().unwrap();
    assert_eq!(after_second.support_count, 1);

    // There is no removal path; toggling "support" is rejected.
    let err = app
        .reactions
        .toggle(&supporter, post.id, chenghub::domain::reaction::PostReaction::Support)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "SUPPORT_NOT_REMOVABLE");
}

#[tokio::test]
async fn like_and_star_toggle() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let user = common::plain_user(&app).await;
    let post = fresh_post(&app, &author).await;

    use chenghub::domain::reaction::PostReaction;
    let on = app.reactions.toggle(&user, post.id, PostReaction::Like).await.unwrap();
    assert!(on.active);
    assert_eq!(on.count, 1);
    let off = app.reactions.toggle(&user, post.id, PostReaction::Like).await.unwrap();
    assert!(!off.active);
    assert_eq!(off.count, 0);

    let starred = app.reactions.toggle(&user, post.id, PostReaction::Star).await.unwrap();
    assert!(starred.active);
    let state = app.reactions.state_for(&viewer_of(&user), post.id).await.unwrap().unwrap();
    assert!(state.starred && !state.liked && !state.supported);

    // /me/reactions groups by type.
    let mine = app.reactions.my_reactions(&user).await.unwrap();
    assert!(mine.get("star").map(|v| v.contains(&post.id)).unwrap_or(false));
}

#[tokio::test]
async fn comment_counts_track_visibility_only() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let commenter = common::plain_user(&app).await;
    let moderator =
        common::user_with_roles(&app, &[chenghub::domain::roles::Role::Moderator]).await;
    let post = fresh_post(&app, &author).await;

    let c1 = app.comments.create(&commenter, post.id, "first").await.unwrap();
    let _c2 = app.comments.create(&commenter, post.id, "second").await.unwrap();
    let after_create = PostRepo::get(&*app.repos, post.id).await.unwrap().unwrap();
    assert_eq!(after_create.comments_count, 2);

    // Comment likes never touch comments_count.
    let like = app.reactions.toggle_comment_like(&author, c1.id).await.unwrap();
    assert!(like.active);
    assert_eq!(like.count, 1);
    let after_like = PostRepo::get(&*app.repos, post.id).await.unwrap().unwrap();
    assert_eq!(after_like.comments_count, 2);

    // Hiding decrements; restoring increments.
    app.comments.set_hidden(&moderator, c1.id, true, "test").await.unwrap();
    let hidden = PostRepo::get(&*app.repos, post.id).await.unwrap().unwrap();
    assert_eq!(hidden.comments_count, 1);
    app.comments.set_hidden(&moderator, c1.id, false, "test").await.unwrap();
    let restored = PostRepo::get(&*app.repos, post.id).await.unwrap().unwrap();
    assert_eq!(restored.comments_count, 2);

    // Author soft-delete decrements once.
    app.comments.delete(&commenter, c1.id).await.unwrap();
    let deleted = PostRepo::get(&*app.repos, post.id).await.unwrap().unwrap();
    assert_eq!(deleted.comments_count, 1);

    // Anonymous listing shows only the surviving comment.
    let page = app
        .comments
        .list(post.id, &Default::default(), PageRequest::new(Some(10), None))
        .await
        .unwrap();
    assert_eq!(page.items.len(), 1);
    assert_eq!(page.items[0].comment.body_md, "second");
}

#[tokio::test]
async fn comment_permissions() {
    let app = require_app!();
    let author = common::plain_user(&app).await;
    let commenter = common::plain_user(&app).await;
    let stranger = common::plain_user(&app).await;
    let post = fresh_post(&app, &author).await;

    let comment = app.comments.create(&commenter, post.id, "hello").await.unwrap();
    let err = app.comments.update(&stranger, comment.id, "hijack").await.unwrap_err();
    assert_eq!(err.code(), "FORBIDDEN");
    let err = app.comments.delete(&stranger, comment.id).await.unwrap_err();
    assert_eq!(err.code(), "FORBIDDEN");

    let updated = app.comments.update(&commenter, comment.id, "edited").await.unwrap();
    assert_eq!(updated.body_md, "edited");

    // Oversized body rejected.
    let big = "x".repeat(9 * 1024);
    let err = app.comments.create(&commenter, post.id, &big).await.unwrap_err();
    assert_eq!(err.code(), "BODY_TOO_LARGE");
}
