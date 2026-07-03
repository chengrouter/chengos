# skill-registry restore procedure

Truth model: **PostgreSQL is the source of truth**; the artifact store is
content-addressed and immutable; Redis is a cache and is never restored.

## 1. Stop the service

```bash
systemctl stop skill-registry
```

## 2. Restore the database

```bash
createdb skill_registry_restore
pg_restore --no-owner --dbname skill_registry_restore \
    /srv/backups/skill-registry/db/skill_registry_<STAMP>.dump
# Point DATABASE_URL at the restored database (or rename databases).
```

## 3. Restore artifacts

```bash
rsync -a /srv/backups/skill-registry/artifacts/ /var/lib/skill-registry/artifacts/
chown -R skill-registry:skill-registry /var/lib/skill-registry/artifacts
```

Because storage keys are digests, restoring on top of existing files is safe:
identical keys are identical bytes.

## 4. Verify consistency

Every published/yanked release must have its artifact bytes present:

```sql
-- Rows returned here = artifacts referenced by visible releases but missing
-- from the store (check each storage_key on disk).
SELECT r.id, a.storage_key
FROM skill_releases r JOIN artifacts a ON a.id = r.artifact_id
WHERE r.status IN ('published', 'yanked');
```

Spot-check a few `storage_key` paths exist under the artifact root. Orphan
artifact *files* without database rows are harmless (the cleanup job ignores
files it cannot map; unreferenced *rows* are cleaned up normally).

## 5. Migrate and start

```bash
skill-registry migrate       # no-op when the dump is current
systemctl start skill-registry
curl -fsS localhost:8300/health/ready
```

Redis reconnects automatically. Cached pages and rate-limit windows start
cold; download counts resume (the unsealed Redis window at backup time is
lost by design).
