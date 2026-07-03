//! Public catalog reads: list/search, detail, versions, publishers,
//! categories. Results are cached best-effort; a Redis outage only removes
//! the cache, never the data. Only publicly visible, installable state is
//! returned by the public surface.

use std::sync::Arc;
use std::time::Duration;

use serde::{de::DeserializeOwned, Serialize};

use crate::config::CacheConfig;
use crate::domain::pagination::{Page, PageRequest, SortOrder};
use crate::domain::publisher::Publisher;
use crate::domain::release::{Release, ReleaseStatus};
use crate::domain::scan::ScanReport;
use crate::domain::skill::SkillVisibility;
use crate::error::{RegistryError, Result};
use crate::ports::cache::{Cache, CacheScope};
use crate::ports::repositories::{
    ArtifactRepo, DownloadStatsRepo, PublisherRepo, ReleaseRepo, ResolvedSkill, ScanRepo,
    SkillListFilter, SkillListRow, SkillRepo,
};
use crate::telemetry::metrics::SharedMetrics;

/// Everything the detail endpoints need in one bundle.
pub struct SkillDetail {
    pub resolved: ResolvedSkill,
    pub latest: Option<Release>,
    pub downloads_total: i64,
}

pub struct ReleaseDetail {
    pub resolved: ResolvedSkill,
    pub release: Release,
    pub artifact: Option<crate::domain::artifact::Artifact>,
    pub files: Vec<crate::domain::artifact::ArtifactFileEntry>,
    pub scripts: Vec<crate::domain::artifact::ScriptDeclaration>,
    pub safety: Option<crate::domain::artifact::SafetySummary>,
    pub latest_scan: Option<ScanReport>,
    pub downloads_total: i64,
}

pub struct CatalogService {
    skills: Arc<dyn SkillRepo>,
    releases: Arc<dyn ReleaseRepo>,
    artifacts: Arc<dyn ArtifactRepo>,
    scans: Arc<dyn ScanRepo>,
    publishers: Arc<dyn PublisherRepo>,
    downloads: Arc<dyn DownloadStatsRepo>,
    cache: Arc<dyn Cache>,
    cache_config: CacheConfig,
    metrics: SharedMetrics,
}

impl CatalogService {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        skills: Arc<dyn SkillRepo>,
        releases: Arc<dyn ReleaseRepo>,
        artifacts: Arc<dyn ArtifactRepo>,
        scans: Arc<dyn ScanRepo>,
        publishers: Arc<dyn PublisherRepo>,
        downloads: Arc<dyn DownloadStatsRepo>,
        cache: Arc<dyn Cache>,
        cache_config: CacheConfig,
        metrics: SharedMetrics,
    ) -> Self {
        Self { skills, releases, artifacts, scans, publishers, downloads, cache, cache_config, metrics }
    }

    async fn cached<T, F>(&self, scope: CacheScope, key: String, ttl: Duration, load: F) -> Result<T>
    where
        T: Serialize + DeserializeOwned,
        F: std::future::Future<Output = Result<T>>,
    {
        if let Some(bytes) = self.cache.get(scope, &key).await {
            if let Ok(value) = serde_json::from_slice(&bytes) {
                self.metrics.cache_hits_total.inc();
                return Ok(value);
            }
        }
        self.metrics.cache_misses_total.inc();
        let value = load.await?;
        if let Ok(bytes) = serde_json::to_vec(&value) {
            self.cache.set(scope, &key, &bytes, ttl).await;
        }
        Ok(value)
    }

    fn versioned_key(&self, parts: &[&str]) -> String {
        format!("v{}:{}", self.cache_config.schema_version, parts.join(":"))
    }

    /// Public list/search. Deterministic cursor pagination.
    pub async fn list_skills(
        &self,
        filter: SkillListFilter,
        order: SortOrder,
        page: PageRequest,
    ) -> Result<Page<SkillListRow>> {
        // Search results are cached only for the un-cursored first page of a
        // query — deep pages are rare and cheap to serve from indexes.
        if page.cursor.is_none() {
            let key = self.versioned_key(&[
                "list",
                filter.query.as_deref().unwrap_or(""),
                filter.category.as_deref().unwrap_or(""),
                filter.tag.as_deref().unwrap_or(""),
                filter.publisher_handle.as_deref().unwrap_or(""),
                order.as_str(),
                &page.limit.to_string(),
            ]);
            if let Some(bytes) = self.cache.get(CacheScope::Catalog, &key).await {
                if let Ok(cached) = serde_json::from_slice::<CachedPage>(&bytes) {
                    self.metrics.cache_hits_total.inc();
                    if let Ok(page) = cached.try_into_page() {
                        return Ok(page);
                    }
                }
            }
            self.metrics.cache_misses_total.inc();
            let result = self.skills.list(filter, order, page).await?;
            let cached = CachedPage::from_page(&result);
            if let Ok(bytes) = serde_json::to_vec(&cached) {
                self.cache
                    .set(
                        CacheScope::Catalog,
                        &key,
                        &bytes,
                        Duration::from_secs(self.cache_config.search_ttl_secs),
                    )
                    .await;
            }
            return Ok(result);
        }
        self.skills.list(filter, order, page).await
    }

    /// Resolve + guard public visibility. Alias requests return the canonical
    /// identity with `via_alias = true`.
    pub async fn resolve_public(&self, publisher: &str, slug: &str) -> Result<ResolvedSkill> {
        let resolved = self
            .skills
            .resolve(publisher, slug)
            .await?
            .ok_or(RegistryError::NotFound("skill"))?;
        if resolved.skill.visibility == SkillVisibility::Hidden || resolved.publisher.is_banned() {
            return Err(RegistryError::NotFound("skill"));
        }
        Ok(resolved)
    }

    pub async fn skill_detail(&self, publisher: &str, slug: &str) -> Result<SkillDetail> {
        let resolved = self.resolve_public(publisher, slug).await?;
        let latest = self.releases.latest_published(resolved.skill.id).await?;
        let downloads_total = self
            .downloads
            .totals_for_skills(&[resolved.skill.id])
            .await?
            .get(&resolved.skill.id)
            .copied()
            .unwrap_or(0);
        Ok(SkillDetail { resolved, latest, downloads_total })
    }

    /// Public version list: published + yanked (yanked marked, still pinnable).
    pub async fn versions(&self, publisher: &str, slug: &str) -> Result<(ResolvedSkill, Vec<Release>)> {
        let resolved = self.resolve_public(publisher, slug).await?;
        let mut releases = self.releases.list_for_skill(resolved.skill.id, true).await?;
        // Highest SemVer first; unparsable versions sink to the end.
        releases.sort_by(|a, b| {
            let av = semver::Version::parse(&a.version).ok();
            let bv = semver::Version::parse(&b.version).ok();
            bv.cmp(&av)
        });
        Ok((resolved, releases))
    }

    pub async fn release_detail(&self, publisher: &str, slug: &str, version: &str) -> Result<ReleaseDetail> {
        let resolved = self.resolve_public(publisher, slug).await?;
        let release = self
            .releases
            .get_by_version(resolved.skill.id, version)
            .await?
            .ok_or(RegistryError::NotFound("release"))?;
        if !matches!(release.status, ReleaseStatus::Published | ReleaseStatus::Yanked) {
            return Err(RegistryError::NotFound("release"));
        }
        let artifact = match release.artifact_id {
            Some(id) => self.artifacts.get(id).await?,
            None => None,
        };
        let (files, scripts, safety) = match &artifact {
            Some(artifact) => (
                self.artifacts.files(artifact.id).await?,
                self.artifacts.scripts(artifact.id).await?,
                self.artifacts.safety_summary(artifact.id).await?,
            ),
            None => (vec![], vec![], None),
        };
        let latest_scan = self.scans.latest_for_release(release.id).await?;
        let downloads_total = self.downloads.total_for_release(release.id).await?;
        Ok(ReleaseDetail {
            resolved,
            release,
            artifact,
            files,
            scripts,
            safety,
            latest_scan,
            downloads_total,
        })
    }

    pub async fn publisher(&self, handle: &str) -> Result<Publisher> {
        let publisher = self
            .publishers
            .get_by_handle(handle)
            .await?
            .ok_or(RegistryError::NotFound("publisher"))?;
        if publisher.is_banned() {
            return Err(RegistryError::NotFound("publisher"));
        }
        Ok(publisher)
    }

    pub async fn categories(&self) -> Result<Vec<(String, i64)>> {
        let key = self.versioned_key(&["categories"]);
        let skills = self.skills.clone();
        self.cached(
            CacheScope::Aggregate,
            key,
            Duration::from_secs(self.cache_config.search_ttl_secs.max(60)),
            async move { skills.categories().await },
        )
        .await
    }

    /// Active invalidation after writes that change public visibility.
    pub async fn invalidate_after_change(&self, _publisher_handle: &str, _slug: &str) {
        self.cache.invalidate_prefix(CacheScope::Catalog, "").await;
        self.cache.invalidate_prefix(CacheScope::Aggregate, "").await;
        self.cache.invalidate_prefix(CacheScope::SkillDetail, "").await;
    }
}

/// Serializable snapshot of a list page (domain rows are not Serialize; the
/// cache stores a DTO-ish mirror and converts back).
#[derive(serde::Serialize, serde::Deserialize)]
struct CachedPage {
    items: Vec<CachedRow>,
    next_cursor: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct CachedRow {
    id: uuid::Uuid,
    publisher_id: uuid::Uuid,
    slug: String,
    name: String,
    summary: String,
    description: String,
    categories: Vec<String>,
    tags: Vec<String>,
    license: Option<String>,
    visibility: String,
    created_at: chrono::DateTime<chrono::Utc>,
    updated_at: chrono::DateTime<chrono::Utc>,
    publisher_handle: String,
    publisher_display_name: String,
    publisher_verified: bool,
    latest_version: Option<String>,
    latest_release_at: Option<chrono::DateTime<chrono::Utc>>,
    downloads_total: i64,
}

impl CachedPage {
    fn from_page(page: &Page<SkillListRow>) -> Self {
        Self {
            next_cursor: page.next_cursor.clone(),
            items: page
                .items
                .iter()
                .map(|row| CachedRow {
                    id: row.skill.id,
                    publisher_id: row.skill.publisher_id,
                    slug: row.skill.slug.clone(),
                    name: row.skill.name.clone(),
                    summary: row.skill.summary.clone(),
                    description: row.skill.description.clone(),
                    categories: row.skill.categories.clone(),
                    tags: row.skill.tags.clone(),
                    license: row.skill.license.clone(),
                    visibility: row.skill.visibility.as_str().to_string(),
                    created_at: row.skill.created_at,
                    updated_at: row.skill.updated_at,
                    publisher_handle: row.publisher_handle.clone(),
                    publisher_display_name: row.publisher_display_name.clone(),
                    publisher_verified: row.publisher_verified,
                    latest_version: row.latest_version.clone(),
                    latest_release_at: row.latest_release_at,
                    downloads_total: row.downloads_total,
                })
                .collect(),
        }
    }

    fn try_into_page(self) -> Result<Page<SkillListRow>> {
        let mut items = Vec::with_capacity(self.items.len());
        for row in self.items {
            let visibility = SkillVisibility::parse(&row.visibility)
                .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("bad cached visibility")))?;
            items.push(SkillListRow {
                skill: crate::domain::skill::Skill {
                    id: row.id,
                    publisher_id: row.publisher_id,
                    slug: row.slug,
                    name: row.name,
                    summary: row.summary,
                    description: row.description,
                    categories: row.categories,
                    tags: row.tags,
                    license: row.license,
                    visibility,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                },
                publisher_handle: row.publisher_handle,
                publisher_display_name: row.publisher_display_name,
                publisher_verified: row.publisher_verified,
                latest_version: row.latest_version,
                latest_release_at: row.latest_release_at,
                downloads_total: row.downloads_total,
            });
        }
        Ok(Page { items, next_cursor: self.next_cursor })
    }
}
