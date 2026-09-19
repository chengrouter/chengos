/**
 * Runtime configuration for the hosted application at `app.chengos.dev`.
 *
 * Copy this over `ui/runtime-config.js` in the deployed bundle. It is read by
 * the browser at page load, *not* baked in at build time — which is the whole
 * point: the same build artifact serves the hosted deployment and every
 * self-hosted install, and moving a host is a file swap rather than a rebuild.
 *
 * Nothing secret belongs here. This file is downloaded by every visitor.
 *
 * ---------------------------------------------------------------------------
 * A self-hosted install should NOT copy this file.
 * ---------------------------------------------------------------------------
 * The stock `runtime-config.js` sets `apiBaseUrl` and `wsUrl` to "" (same
 * origin) and nothing else, which is correct for a private deployment: no
 * billing, no trial banner, no upgrade prompts, no analytics. Every key below
 * exists to turn on something that only makes sense when somebody else is
 * paying the model bill.
 */
window.__CHENGOS_RUNTIME_CONFIG__ = window.__CHENGOS_RUNTIME_CONFIG__ || {};
window.__CHENGOS_RUNTIME_CONFIG__ = Object.assign({}, window.__CHENGOS_RUNTIME_CONFIG__, {
  // Empty means "same origin". The hosted app is served from app.chengos.dev
  // and its API is reverse-proxied under the same host, so there is no CORS
  // surface and no second hostname to keep in sync.
  apiBaseUrl: "",
  wsUrl: "",

  // --- Billing -------------------------------------------------------------
  // Both URLs must be present for billing UI to appear at all; `billingEnabled`
  // is an additional kill switch, not the thing that turns it on. Absent, the
  // account panel renders as it does on a private install.
  paymentSystemBaseUrl: "https://payment.chengos.dev",
  storageBaseUrl: "https://media.chengos.dev",
  billingEnabled: true,
  // Opt-in, and deliberately separate: having a storage host configured is not
  // the same as the operator having switched managed storage on.
  managedStorageEnabled: true,

  // --- Ways out of the trial ----------------------------------------------
  // Each is independently optional, and an unset one hides its option rather
  // than rendering a button that goes nowhere.
  //
  // The marketing site's self-hosting page, offered when a trial ends. Distinct
  // from `selfHostCommand`: somebody whose 7-day window just closed is deciding
  // whether to run this at all, and a bare shell command answers a question
  // they have not reached yet.
  selfHostUrl: "https://chengos.dev/deployment",
  // Where "upgrade" goes. Unset falls back to the in-app plan comparison, so
  // the option is never a dead end.
  upgradeUrl: "https://chengos.dev/pricing",
  // Shown to somebody who has run out today, for whom waiting is one option and
  // running it themselves is the other.
  selfHostCommand: "curl -fsSL https://chengos.dev/chengos.sh | bash",
  // Version-less on purpose: `releases/latest/download/...` keeps working
  // across releases, so shipping a new build needs no change here.
  desktopDownloadUrl: "https://chengos.dev/#download",
});
