#!/usr/bin/env node
/**
 * Release gate: refuse to publish a release whose assets do not match what the
 * marketing site advertises.
 *
 * It reads the site's release manifest (the single source of truth for every
 * download link) and checks, against the real GitHub release, that each
 * platform marked `available` has a matching asset, and that any recorded
 * SHA-256 still matches the published checksum.
 *
 * Exit codes: 0 = consistent, 1 = mismatch (block the release), 2 = could not
 * check (bad arguments, unreachable API) — also blocking, because a release
 * gate that silently passes is not a gate.
 *
 * Usage:
 *   node scripts/verify-marketing-release-assets.mjs [--tag v0.2.0] [--manifest <path>]
 *
 * GITHUB_TOKEN is read from the environment to lift the anonymous rate limit.
 * It must come from CI secrets and must never be written into any build output.
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const REPO = process.env.RELEASE_REPO || 'chengrouter/chengos'
const DEFAULT_MANIFEST =
  process.env.MARKETING_MANIFEST ||
  resolve(process.cwd(), '../chengrouter/frontend-ui/user-ui/lib/config/release-manifest.json')

function arg(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

function fail(message, code = 1) {
  console.error(`\nFAIL  ${message}\n`)
  process.exit(code)
}

async function gh(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'chengos-release-gate' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const response = await fetch(`https://api.github.com/repos/${REPO}${path}`, { headers })
  if (!response.ok) fail(`GitHub API ${path} returned ${response.status}`, 2)
  return response.json()
}

async function main() {
  const manifestPath = arg('--manifest') || DEFAULT_MANIFEST
  const tag = arg('--tag')

  let manifest
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (error) {
    fail(`Could not read the marketing manifest at ${manifestPath}: ${error.message}`, 2)
  }

  const release = tag ? await gh(`/releases/tags/${tag}`) : await gh('/releases/latest')
  const assets = new Map((release.assets || []).map((asset) => [asset.name, asset]))
  const advertised = manifest.platforms.filter((platform) => platform.available)

  if (advertised.length === 0) fail('The site advertises no downloads at all — check the manifest.', 2)

  const problems = []

  for (const platform of advertised) {
    const asset = assets.get(platform.assetName)
    if (!asset) {
      problems.push(`${platform.id}: site advertises "${platform.assetName}" but release ${release.tag_name} has no such asset`)
      continue
    }
    if (platform.sizeBytes !== null && platform.sizeBytes !== asset.size) {
      problems.push(`${platform.id}: manifest size ${platform.sizeBytes} != release size ${asset.size}`)
    }
    if (platform.sha256) {
      const checksumAsset = assets.get(`${platform.assetName}.sha256`)
      if (!checksumAsset) {
        problems.push(`${platform.id}: manifest records a SHA-256 but the release publishes no "${platform.assetName}.sha256"`)
      } else {
        const published = await fetch(checksumAsset.browser_download_url).then((r) => r.text())
        const digest = published.trim().split(/\s+/)[0]
        if (digest.toLowerCase() !== platform.sha256.toLowerCase()) {
          problems.push(`${platform.id}: SHA-256 mismatch (manifest ${platform.sha256}, release ${digest})`)
        }
      }
    }
    // A version-less `releases/latest/download/...` URL must still name the
    // asset the release actually carries, or the link 404s after publishing.
    if (!platform.url.endsWith(`/${platform.assetName}`)) {
      problems.push(`${platform.id}: download URL does not end in the advertised asset name`)
    }
  }

  // Anything the site refuses to advertise must also not be implied elsewhere.
  for (const roadmapOnly of manifest.roadmapOnly || []) {
    if (advertised.some((platform) => platform.id.includes(roadmapOnly))) {
      problems.push(`"${roadmapOnly}" is roadmap-only but is advertised as a download`)
    }
  }

  if (problems.length > 0) {
    fail(`Marketing downloads do not match release ${release.tag_name}:\n  - ${problems.join('\n  - ')}`)
  }

  console.log(`OK    ${advertised.length} advertised download(s) match release ${release.tag_name}.`)
}

main().catch((error) => fail(error.message, 2))
