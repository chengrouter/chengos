//! Identity integration tests: user creation, identity linking, sessions,
//! token refresh/revocation, banned-user enforcement.

mod common;

use chenghub::domain::identity::AuthProvider;
use chenghub::error::HubError;
use chenghub::ports::identity_repository::{IdentityRepo, SessionRepo, TokenRepo, UserRepo};

#[tokio::test]
async fn create_login_and_link_identity() {
    let app = require_app!();

    // New subject creates a user bound to that identity.
    let profile = common::unique_profile(AuthProvider::Github);
    let username = format!("id-{}", uuid::Uuid::new_v4().simple());
    let (user, identity) = app
        .repos
        .create_user_with_identity(&username[..16], &profile)
        .await
        .unwrap();
    assert_eq!(identity.user_id, user.id);

    // The subject maps back to the same user.
    let found = app
        .repos
        .find_by_subject(AuthProvider::Github, &profile.subject)
        .await
        .unwrap()
        .expect("subject should resolve");
    assert_eq!(found.user_id, user.id);

    // Linking a second provider identity to the same user.
    let wechat_profile = common::unique_profile(AuthProvider::Wechat);
    let linked = app.repos.link_identity(user.id, &wechat_profile).await.unwrap();
    assert_eq!(linked.user_id, user.id);
    assert_eq!(app.repos.count_for_user(user.id).await.unwrap(), 2);

    // Unlinking down to one identity works; the last one is refused by the
    // service.
    let ctx = common::context_for(&app, user.clone()).await;
    app.identity.unlink_identity(ctx.user.id, linked.id).await.unwrap();
    let err = app.identity.unlink_identity(ctx.user.id, identity.id).await.unwrap_err();
    assert_eq!(err.code(), "LAST_IDENTITY");
}

#[tokio::test]
async fn sessions_authenticate_and_revoke() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;

    let raw = app.identity.create_session(ctx.user.id, None, None).await.unwrap();
    let authed = app
        .identity
        .authenticate_session(&raw)
        .await
        .unwrap()
        .expect("session should authenticate");
    assert_eq!(authed.user.id, ctx.user.id);

    app.identity.logout(&raw).await.unwrap();
    assert!(app.identity.authenticate_session(&raw).await.unwrap().is_none());

    // Garbage cookie values are rejected without error.
    assert!(app.identity.authenticate_session("chg_ss_bogus").await.unwrap().is_none());
    assert!(app.identity.authenticate_session("not-a-session").await.unwrap().is_none());
}

#[tokio::test]
async fn token_pair_refresh_rotation_and_revocation() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;

    let pair = app
        .identity
        .issue_token_pair(ctx.user.id, "test", &["community".into()])
        .await
        .unwrap();
    let authed = app
        .identity
        .authenticate_bearer(&pair.access_token)
        .await
        .unwrap()
        .expect("access token should authenticate");
    assert_eq!(authed.user.id, ctx.user.id);

    // Rotation invalidates the old pair and yields a working new one.
    let rotated = app.identity.refresh(&pair.refresh_token).await.unwrap();
    assert!(app
        .identity
        .authenticate_bearer(&pair.access_token)
        .await
        .unwrap()
        .is_none());
    assert!(app
        .identity
        .authenticate_bearer(&rotated.access_token)
        .await
        .unwrap()
        .is_some());

    // Replaying the consumed refresh token fails.
    let err = app.identity.refresh(&pair.refresh_token).await.unwrap_err();
    assert!(matches!(err, HubError::DeviceFlow { code: "invalid_grant" }));

    // Listing + revoking through the service.
    let tokens = app.identity.list_tokens(ctx.user.id).await.unwrap();
    assert!(!tokens.is_empty());
    app.identity.revoke_token(ctx.user.id, tokens[0].id).await.unwrap();
    assert!(app
        .identity
        .authenticate_bearer(&rotated.access_token)
        .await
        .unwrap()
        .is_none());
}

#[tokio::test]
async fn banned_users_cannot_write() {
    let app = require_app!();
    let moderator =
        common::user_with_roles(&app, &[chenghub::domain::roles::Role::Moderator]).await;
    let victim = common::plain_user(&app).await;

    app.moderation
        .ban_user(&moderator, victim.user.id, "spam", None)
        .await
        .unwrap();

    // Fresh context reflects the ban and write guard trips.
    let banned_user = UserRepo::get(&*app.repos, victim.user.id).await.unwrap().unwrap();
    assert!(banned_user.is_banned());
    let banned_ctx = common::context_for(&app, banned_user).await;
    let err = banned_ctx.ensure_can_write().unwrap_err();
    assert_eq!(err.code(), "USER_BANNED");

    // Posting through the service is refused.
    let err = app
        .posts
        .create(
            &banned_ctx,
            chenghub::domain::post::PostType::Discussion,
            "hello",
            "body",
            &[],
            None,
        )
        .await
        .unwrap_err();
    assert_eq!(err.code(), "USER_BANNED");

    // Unban restores write access.
    app.moderation.unban_user(&moderator, victim.user.id).await.unwrap();
    let restored = UserRepo::get(&*app.repos, victim.user.id).await.unwrap().unwrap();
    assert!(!restored.is_banned());
}

#[tokio::test]
async fn session_and_token_hashes_only_in_database() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;
    let raw_session = app.identity.create_session(ctx.user.id, None, None).await.unwrap();
    let pair = app
        .identity
        .issue_token_pair(ctx.user.id, "hash-test", &["community".into()])
        .await
        .unwrap();

    // The raw values never appear in storage.
    let (session_hits,): (i64,) = sqlx::query_as(
        "SELECT count(*) FROM browser_sessions WHERE session_hash = $1",
    )
    .bind(&raw_session)
    .fetch_one(app.repos.pool())
    .await
    .unwrap();
    assert_eq!(session_hits, 0);
    let (token_hits,): (i64,) =
        sqlx::query_as("SELECT count(*) FROM access_tokens WHERE token_hash = $1")
            .bind(&pair.access_token)
            .fetch_one(app.repos.pool())
            .await
            .unwrap();
    assert_eq!(token_hits, 0);

    // Cleanup is callable and non-destructive for live rows.
    use chenghub::ports::identity_repository::IdentityCleanup;
    app.repos.cleanup_expired().await.unwrap();
    assert!(app.identity.authenticate_session(&raw_session).await.unwrap().is_some());
    let _ = (SessionRepo::revoke(&*app.repos, "x").await.ok(), TokenRepo::revoke_refresh(&*app.repos, "x").await.ok());
}
