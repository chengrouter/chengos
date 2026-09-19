#!/usr/bin/env node
/**
 * Migration gate: check that the domain move actually works, against the live
 * deployment.
 *
 * The plan's C1/C2 prerequisites are DNS, TLS, redirects and third-party
 * allowlists — things code cannot do. What code *can* do is refuse to let them
 * be ticked off by hand. Every item below is a claim that is either true right
 * now or is not, and each one has a way of being false that nobody notices:
 *
 *   - a subdomain whose DNS is live but whose certificate was never issued,
 *     so it fails only in a browser and only on first visit;
 *   - a redirect that lands every old URL on the new front page, which looks
 *     perfect in a smoke test of `/` and silently throws away every deep link,
 *     every inbound link and the site's ranking;
 *   - a 302 where a 301 was meant, which search engines read as "temporary"
 *     and never transfer anything for;
 *   - `/.well-known/` caught by the redirect, which breaks ACME renewal on the
 *     old domain and kills the redirect itself about ninety days later.
 *
 * Exit codes: 0 = the migration is consistent, 1 = something is wrong (do not
 * proceed / roll back), 2 = the check could not run (bad arguments, network) —
 * also non-zero, because a gate that passes when it could not look is not a
 * gate.
 *
 * Usage:
 *   node scripts/verify-domain-migration.mjs
 *   node scripts/verify-domain-migration.mjs --from chengrouter.com --to chengos.dev
 *   node scripts/verify-domain-migration.mjs --skip-legacy   # new domain only
 *
 * No credentials are read and nothing is written. It is safe to run against
 * production, and it is meant to be.
 */

import { lookup } from 'node:dns/promises'
import { connect } from 'node:tls'

const DEFAULT_FROM = process.env.LEGACY_ROOT_DOMAIN || 'chengrouter.com'
const DEFAULT_TO = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'chengos.dev'

/** Every host the plan requires to be resolvable and serving TLS. */
const REQUIRED_SUBDOMAINS = ['', 'app', 'api', 'id', 'payment', 'media']

/**
 * Old host + path → the host it must land on, same path.
 *
 * Deep paths deliberately, not `/`: a redirect rule that collapses everything
 * onto the front page passes a check of `/` and fails the only thing that
 * matters.
 */
const DEEP_LINKS = [
  { sub: '', path: '/' },
  { sub: '', path: '/pricing' },
  { sub: '', path: '/deployment' },
  { sub: '', path: '/en' },
  { sub: 'www', path: '/pricing' },
  // C2. `demo-ui` served the application that now lives at `app`, so its paths
  // carry across one-for-one — including deep ones, which is the case a check
  // of `/` alone would never catch.
  { sub: 'demo-ui', path: '/', to: 'app' },
  { sub: 'demo-ui', path: '/editor', to: 'app' },
  // `demo-app` served a different front end whose paths do not exist at the new
  // address, so it maps to the corresponding page rather than the identical one.
  { sub: 'demo-app', path: '/', to: 'app', expectPath: '/chat' },
]

const REQUEST_TIMEOUT_MS = 10_000

function arg(name) {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? undefined : process.argv[index + 1]
}

const flag = (name) => process.argv.includes(`--${name}`)

const host = (sub, root) => (sub ? `${sub}.${root}` : root)

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const results = []
let blocked = false

function record(status, name, detail) {
  results.push({ status, name, detail })
  const mark = status === 'pass' ? 'OK  ' : status === 'warn' ? 'WARN' : 'FAIL'
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (status === 'fail') {
    blocked = true
  }
}

// ---------------------------------------------------------------------------
// Probes
// ---------------------------------------------------------------------------

async function resolves(hostname) {
  try {
    const { address } = await lookup(hostname)
    return { ok: true, address }
  } catch (error) {
    return { ok: false, reason: error.code || String(error) }
  }
}

/**
 * Whether the host presents a certificate that is currently valid for it.
 *
 * `rejectUnauthorized` does the verification; an expired or wrong-name
 * certificate fails the handshake rather than being reported as fine.
 */
function servesTls(hostname) {
  return new Promise((resolve) => {
    const socket = connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: true },
      () => {
        const cert = socket.getPeerCertificate()
        const validTo = cert?.valid_to ? new Date(cert.valid_to) : null
        socket.end()
        resolve({ ok: true, validTo })
      },
    )
    socket.setTimeout(REQUEST_TIMEOUT_MS, () => {
      socket.destroy()
      resolve({ ok: false, reason: 'timed out' })
    })
    socket.on('error', (error) => resolve({ ok: false, reason: error.message }))
  })
}

async function head(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'user-agent': 'chengos-domain-migration-check' },
    })
    return { ok: true, status: response.status, location: response.headers.get('location') }
  } catch (error) {
    return { ok: false, reason: error.name === 'AbortError' ? 'timed out' : error.message }
  } finally {
    clearTimeout(timer)
  }
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

async function checkNewDomain(to) {
  for (const sub of REQUIRED_SUBDOMAINS) {
    const name = host(sub, to)

    const dns = await resolves(name)
    if (!dns.ok) {
      record('fail', `DNS ${name}`, dns.reason)
      continue
    }
    record('pass', `DNS ${name}`, dns.address)

    const tls = await servesTls(name)
    if (!tls.ok) {
      record('fail', `TLS ${name}`, tls.reason)
      continue
    }
    // A certificate inside its last fortnight is not broken, but on a domain
    // that was just moved it is worth seeing before it becomes an outage.
    const days = tls.validTo ? Math.round((tls.validTo - Date.now()) / 86_400_000) : null
    if (days !== null && days < 14) {
      record('warn', `TLS ${name}`, `expires in ${days} day(s)`)
    } else {
      record('pass', `TLS ${name}`, days === null ? 'valid' : `${days} day(s) left`)
    }
  }
}

async function checkRedirects(from, to) {
  for (const link of DEEP_LINKS) {
    const source = host(link.sub, from)
    const expectedHost = host(link.to ?? (link.sub === 'www' ? '' : link.sub), to)
    const url = `https://${source}${link.path}`

    const response = await head(url)
    if (!response.ok) {
      record('fail', `301 ${url}`, response.reason)
      continue
    }

    if (response.status !== 301 && response.status !== 308) {
      record(
        'fail',
        `301 ${url}`,
        `answered ${response.status}` +
          (response.status === 302 || response.status === 307
            ? ' — a temporary redirect transfers no ranking'
            : ''),
      )
      continue
    }

    let target
    try {
      target = new URL(response.location, url)
    } catch {
      record('fail', `301 ${url}`, `unreadable Location: ${response.location}`)
      continue
    }

    if (target.hostname !== expectedHost) {
      record('fail', `301 ${url}`, `went to ${target.hostname}, expected ${expectedHost}`)
      continue
    }

    // The check this script exists for.
    const expectedPath = link.expectPath ?? link.path
    if (target.pathname !== expectedPath) {
      record(
        'fail',
        `301 ${url}`,
        `landed on ${target.pathname} instead of ${expectedPath} — deep links are being dropped`,
      )
      continue
    }

    record('pass', `301 ${url}`, `→ ${target.href}`)
  }
}

async function checkAcmeStillAnswers(from) {
  // Must NOT redirect: this is how the old domain proves it is still ours, and
  // the old certificate is what keeps the redirects serving for the next year.
  const url = `https://${from}/.well-known/acme-challenge/migration-probe`
  const response = await head(url)
  if (!response.ok) {
    record('warn', `ACME ${from}`, `could not probe: ${response.reason}`)
    return
  }
  if (response.status === 301 || response.status === 308 || response.status === 302) {
    record(
      'fail',
      `ACME ${from}`,
      `/.well-known/ is being redirected (${response.status}) — certificate renewal on the old domain will fail`,
    )
    return
  }
  // 404 is the expected answer to a token that does not exist. What matters is
  // that the old domain answered it itself.
  record('pass', `ACME ${from}`, `answered ${response.status} locally`)
}

async function checkNewDomainServes(to) {
  const response = await head(`https://${to}/`)
  if (!response.ok) {
    record('fail', `serve https://${to}/`, response.reason)
    return
  }
  if (response.status >= 400) {
    record('fail', `serve https://${to}/`, `answered ${response.status}`)
    return
  }
  record('pass', `serve https://${to}/`, `answered ${response.status}`)
}

// ---------------------------------------------------------------------------

async function main() {
  const from = (arg('from') || DEFAULT_FROM).trim().toLowerCase()
  const to = (arg('to') || DEFAULT_TO).trim().toLowerCase()

  if (!to) {
    console.error('No destination domain: pass --to or set NEXT_PUBLIC_ROOT_DOMAIN.')
    process.exit(2)
  }
  if (from === to) {
    console.error(`--from and --to are both "${to}"; there is no migration to check.`)
    process.exit(2)
  }

  console.log(`Domain migration check: ${from} → ${to}\n`)

  await checkNewDomain(to)
  await checkNewDomainServes(to)

  if (flag('skip-legacy')) {
    record('warn', 'legacy domain', 'skipped by --skip-legacy; redirects were not checked')
  } else {
    console.log('')
    await checkRedirects(from, to)
    await checkAcmeStillAnswers(from)
  }

  const failed = results.filter((r) => r.status === 'fail').length
  const warned = results.filter((r) => r.status === 'warn').length
  console.log(
    `\n${results.length - failed - warned} passed, ${warned} warning(s), ${failed} failure(s).`,
  )

  if (blocked) {
    console.error(
      '\nThe migration is not ready. Fix the failures above, or set ' +
        'LEGACY_DOMAIN_REDIRECT=off to fall back to serving both domains independently.',
    )
    process.exit(1)
  }

  // Deliberately not claimed as "done": these are the parts a machine can see.
  console.log(
    '\nStill manual, and not checkable from here:\n' +
      '  - Search Console change of address submitted (and Bing Webmaster updated)\n' +
      '  - OAuth redirect URIs, Stripe webhook endpoints and email link domains\n' +
      '    updated in each third-party console\n' +
      '  - old domain registered and resolving for at least 12 more months',
  )
}

main().catch((error) => {
  console.error(`Could not run the migration check: ${error.message}`)
  process.exit(2)
})
