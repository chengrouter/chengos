//! Device Authorization Flow tests: approve, deny, expiry, polling
//! interval / slow_down, and single-use token handout.

mod common;

use chenghub::error::HubError;

fn device_code_of(err: &HubError) -> &str {
    err.code()
}

#[tokio::test]
async fn approve_then_poll_issues_tokens_once() {
    let app = require_app!(); // interval 0: no slow_down interference
    let user = common::plain_user(&app).await;

    let start = app.device_flow.start("chengflow-test").await.unwrap();
    assert!(start.verification_uri.ends_with("/device"));
    assert!(start.verification_uri_complete.contains("user_code="));

    // Pending until the user decides.
    let err = app.device_flow.poll(&start.device_code).await.unwrap_err();
    assert_eq!(device_code_of(&err), "authorization_pending");

    app.device_flow.approve(&start.user_code, user.user.id).await.unwrap();

    // First poll after approval hands out tokens...
    let pair = app.device_flow.poll(&start.device_code).await.unwrap();
    let authed = app
        .identity
        .authenticate_bearer(&pair.access_token)
        .await
        .unwrap()
        .expect("device token should authenticate");
    assert_eq!(authed.user.id, user.user.id);

    // ...and the device code is consumed: replay fails.
    let err = app.device_flow.poll(&start.device_code).await.unwrap_err();
    assert_eq!(device_code_of(&err), "invalid_grant");
}

#[tokio::test]
async fn denied_authorization_reports_access_denied() {
    let app = require_app!();
    let _user = common::plain_user(&app).await;

    let start = app.device_flow.start("chengflow-test").await.unwrap();
    app.device_flow.deny(&start.user_code).await.unwrap();
    let err = app.device_flow.poll(&start.device_code).await.unwrap_err();
    assert_eq!(device_code_of(&err), "access_denied");

    // A denied code cannot be approved afterwards.
    let user = common::plain_user(&app).await;
    let err = app
        .device_flow
        .approve(&start.user_code, user.user.id)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "invalid_grant");
}

#[tokio::test]
async fn fast_polling_gets_slow_down() {
    let Some(app) = common::test_app_with_device_interval(30).await else {
        eprintln!("CHENGHUB_TEST_DATABASE_URL not set; skipping integration test");
        return;
    };
    let start = app.device_flow.start("chengflow-test").await.unwrap();

    // First poll records the timestamp (pending), the immediate second poll
    // violates the 30s interval.
    let err = app.device_flow.poll(&start.device_code).await.unwrap_err();
    assert_eq!(device_code_of(&err), "authorization_pending");
    let err = app.device_flow.poll(&start.device_code).await.unwrap_err();
    assert_eq!(device_code_of(&err), "slow_down");
}

#[tokio::test]
async fn expired_codes_report_expired_token() {
    let app = require_app!();

    let start = app.device_flow.start("chengflow-test").await.unwrap();
    // Force expiry directly (no waiting in tests).
    sqlx::query(
        "UPDATE device_authorizations SET expires_at = now() - interval '1 minute'
         WHERE user_code = $1",
    )
    .bind(chenghub::security::token::normalize_user_code(&start.user_code))
    .execute(app.repos.pool())
    .await
    .unwrap();

    let err = app.device_flow.poll(&start.device_code).await.unwrap_err();
    assert_eq!(device_code_of(&err), "expired_token");

    // Approving an expired code fails too.
    let user = common::plain_user(&app).await;
    let err = app
        .device_flow
        .approve(&start.user_code, user.user.id)
        .await
        .unwrap_err();
    assert_eq!(err.code(), "expired_token");
}

#[tokio::test]
async fn unknown_device_code_is_invalid_grant() {
    let app = require_app!();
    let err = app.device_flow.poll("chg_dc_doesnotexist").await.unwrap_err();
    assert_eq!(device_code_of(&err), "invalid_grant");
    let err = app.device_flow.poll("garbage").await.unwrap_err();
    assert_eq!(device_code_of(&err), "invalid_grant");
}
