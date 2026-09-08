window.__CHENGOS_RUNTIME_CONFIG__ = window.__CHENGOS_RUNTIME_CONFIG__ || {};
window.__CHENGOS_RUNTIME_CONFIG__ = Object.assign({}, window.__CHENGOS_RUNTIME_CONFIG__, {
  apiBaseUrl: "",
  wsUrl: "",

  // Ways out of the trial, offered to a user who has spent their message
  // allowance (see CHENG_TRIAL_TURNS_PER_WINDOW in deploy/.env). Each is hidden
  // when left empty, so a deployment that is not a public trial sets neither
  // and the dialog offers only "add your own API key" -- which is always true.
  //
  // Deliberately configured here rather than compiled in: the install command
  // and the download page differ per channel, and a stale hardcoded URL would
  // send people to a 404 at exactly the moment they were ready to install.
  selfHostCommand: "",
  desktopDownloadUrl: "",
});
