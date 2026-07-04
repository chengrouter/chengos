//! Search tests: English keyword search, Chinese fallback, and
//! similar-title lookup for anti-duplication.

mod common;

use chenghub::domain::pagination::PageRequest;
use chenghub::domain::post::PostType;

#[tokio::test]
async fn english_and_chinese_search() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;
    let tag = uuid::Uuid::new_v4().simple().to_string();
    let marker = &tag[..10];

    let english = app
        .posts
        .create(
            &ctx,
            PostType::Experience,
            &format!("Webhook retry patterns {marker}"),
            "How we made webhook retries reliable.",
            &[],
            None,
        )
        .await
        .unwrap();
    let chinese = app
        .posts
        .create(
            &ctx,
            PostType::Requirement,
            &format!("希望支持深色模式 {marker}"),
            "夜间使用时太亮了，希望增加深色模式。",
            &[],
            None,
        )
        .await
        .unwrap();

    // English keyword hits via FTS.
    let result = app
        .search
        .search(&format!("webhook {marker}"), PageRequest::new(Some(10), None))
        .await
        .unwrap();
    assert!(result.items.iter().any(|r| r.post.id == english.id));

    // Chinese substring hits via trigram/ILIKE fallback.
    let result = app
        .search
        .search("深色模式", PageRequest::new(Some(20), None))
        .await
        .unwrap();
    assert!(result.items.iter().any(|r| r.post.id == chinese.id));

    // Body-only Chinese content is also reachable.
    let result = app
        .search
        .search("夜间使用", PageRequest::new(Some(20), None))
        .await
        .unwrap();
    assert!(result.items.iter().any(|r| r.post.id == chinese.id));

    // Empty queries are rejected.
    let err = app.search.search("   ", PageRequest::new(Some(10), None)).await.unwrap_err();
    assert_eq!(err.code(), "INVALID_PARAM");
}

#[tokio::test]
async fn similar_title_lookup() {
    let app = require_app!();
    let ctx = common::plain_user(&app).await;
    let tag = uuid::Uuid::new_v4().simple().to_string();
    let marker = &tag[..10];

    let existing = app
        .posts
        .create(
            &ctx,
            PostType::Requirement,
            &format!("Add CSV export for tables {marker}"),
            "",
            &[],
            None,
        )
        .await
        .unwrap();

    let similar = app
        .search
        .similar_titles(&format!("CSV export for tables {marker}"), Some(5))
        .await
        .unwrap();
    assert!(
        similar.iter().any(|s| s.id == existing.id),
        "near-identical title should be suggested"
    );

    // Chinese similar titles work through the same path.
    let chinese = app
        .posts
        .create(
            &ctx,
            PostType::Requirement,
            &format!("支持表格导出为CSV文件 {marker}"),
            "",
            &[],
            None,
        )
        .await
        .unwrap();
    let similar = app
        .search
        .similar_titles(&format!("表格导出为CSV {marker}"), Some(5))
        .await
        .unwrap();
    assert!(similar.iter().any(|s| s.id == chinese.id));

    // Hidden posts never appear in suggestions.
    let moderator =
        common::user_with_roles(&app, &[chenghub::domain::roles::Role::Moderator]).await;
    app.moderation
        .set_post_hidden(&moderator, existing.id, true, "test")
        .await
        .unwrap();
    let similar = app
        .search
        .similar_titles(&format!("CSV export for tables {marker}"), Some(5))
        .await
        .unwrap();
    assert!(similar.iter().all(|s| s.id != existing.id));
}
