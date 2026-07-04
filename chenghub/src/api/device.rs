//! Device Authorization Flow routes and the browser approval page.

use axum::extract::{Query, State};
use axum::response::Html;
use axum::Json;
use serde::Deserialize;

use crate::api::dto::{DeviceCodeRequest, DeviceDecisionRequest, DeviceTokenRequest};
use crate::api::middleware::RequireSessionUser;
use crate::api::ApiState;
use crate::domain::identity::TokenPair;
use crate::error::Result;
use crate::services::device_flow_service::DeviceCodeResponse;

/// POST /api/v1/auth/device/code
pub async fn device_code(
    State(state): State<ApiState>,
    Json(request): Json<DeviceCodeRequest>,
) -> Result<Json<DeviceCodeResponse>> {
    let client_name: String = request.client_name.chars().take(80).collect();
    Ok(Json(state.device_flow.start(&client_name).await?))
}

/// POST /api/v1/auth/device/token — RFC 8628 polling endpoint.
pub async fn device_token(
    State(state): State<ApiState>,
    Json(request): Json<DeviceTokenRequest>,
) -> Result<Json<TokenPair>> {
    let _ = &request.grant_type; // accepted for spec compatibility
    Ok(Json(state.device_flow.poll(&request.device_code).await?))
}

#[derive(Deserialize)]
pub struct DeviceInfoQuery {
    pub user_code: String,
}

/// GET /api/v1/auth/device/info — approval page metadata (requires a
/// browser session, so an attacker cannot enumerate codes anonymously).
pub async fn device_info(
    State(state): State<ApiState>,
    RequireSessionUser(_ctx): RequireSessionUser,
    Query(query): Query<DeviceInfoQuery>,
) -> Result<Json<serde_json::Value>> {
    let auth = state.device_flow.lookup(&query.user_code).await?;
    Ok(Json(serde_json::json!({
        "client_name": auth.client_name,
        "scopes": auth.scopes,
        "status": auth.status.as_str(),
        "expires_at": auth.expires_at,
    })))
}

/// POST /api/v1/auth/device/authorize — approve (browser session only).
pub async fn device_authorize(
    State(state): State<ApiState>,
    RequireSessionUser(ctx): RequireSessionUser,
    Json(request): Json<DeviceDecisionRequest>,
) -> Result<Json<serde_json::Value>> {
    ctx.ensure_can_write()?;
    state.device_flow.approve(&request.user_code, ctx.user.id).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// POST /api/v1/auth/device/deny
pub async fn device_deny(
    State(state): State<ApiState>,
    RequireSessionUser(_ctx): RequireSessionUser,
    Json(request): Json<DeviceDecisionRequest>,
) -> Result<Json<serde_json::Value>> {
    state.device_flow.deny(&request.user_code).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// GET /device — self-contained approval page. ChengHub has no SPA; this
/// page talks to the JSON APIs above and offers provider login links when
/// the browser has no session yet.
pub async fn device_page() -> Html<&'static str> {
    Html(DEVICE_PAGE_HTML)
}

const DEVICE_PAGE_HTML: &str = r##"<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ChengHub — Device Authorization</title>
<style>
  :root { color-scheme: light dark; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
  body { display: flex; justify-content: center; padding: 8vh 16px; margin: 0;
         background: Canvas; color: CanvasText; }
  main { max-width: 420px; width: 100%; }
  h1 { font-size: 1.3rem; }
  .card { border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas); border-radius: 10px;
          padding: 20px; margin-top: 16px; }
  input[type=text] { font-size: 1.4rem; letter-spacing: 0.2em; text-align: center;
          width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px;
          border: 1px solid color-mix(in srgb, CanvasText 25%, Canvas);
          background: transparent; color: inherit; text-transform: uppercase; }
  button { font-size: 1rem; padding: 10px 18px; border-radius: 8px; border: none;
           cursor: pointer; margin-right: 8px; margin-top: 14px; }
  .approve { background: #2563eb; color: #fff; }
  .deny { background: transparent; border: 1px solid color-mix(in srgb, CanvasText 30%, Canvas); color: inherit; }
  .login { display: inline-block; margin: 10px 8px 0 0; padding: 10px 16px; border-radius: 8px;
           background: color-mix(in srgb, CanvasText 10%, Canvas); color: inherit;
           text-decoration: none; }
  #message { margin-top: 14px; min-height: 1.4em; }
  .ok { color: #16a34a; } .err { color: #dc2626; }
  .muted { opacity: 0.7; font-size: 0.9rem; }
</style>
</head>
<body>
<main>
  <h1>ChengHub device authorization</h1>
  <p class="muted">A local ChengFlow instance is asking to connect to your ChengHub account.
     Confirm the code shown in ChengFlow matches the one below.</p>
  <div class="card" id="login-card" hidden>
    <p>Sign in first, then come back to approve the device.</p>
    <span id="login-links"></span>
  </div>
  <div class="card" id="approve-card" hidden>
    <p class="muted" id="who"></p>
    <input type="text" id="user-code" placeholder="XXXX-XXXX" autocomplete="off" spellcheck="false">
    <p class="muted" id="client-info"></p>
    <button class="approve" id="approve">Approve</button>
    <button class="deny" id="deny">Deny</button>
    <div id="message"></div>
  </div>
</main>
<script>
(function () {
  var qs = new URLSearchParams(location.search);
  var codeInput = document.getElementById('user-code');
  var message = document.getElementById('message');
  if (qs.get('user_code')) codeInput.value = qs.get('user_code');

  function say(text, cls) { message.textContent = text; message.className = cls || ''; }

  function post(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.detail || data.code || 'request failed');
        return data;
      });
    });
  }

  fetch('/api/v1/auth/me', { credentials: 'same-origin' })
    .then(function (res) { return res.json(); })
    .then(function (me) {
      if (me.authenticated) {
        document.getElementById('approve-card').hidden = false;
        document.getElementById('who').textContent =
          'Signed in as ' + (me.user.display_name || me.user.username);
      } else {
        document.getElementById('login-card').hidden = false;
        var links = document.getElementById('login-links');
        var back = '/device' + (qs.get('user_code') ? '?user_code=' + encodeURIComponent(qs.get('user_code')) : '');
        (me.providers || []).forEach(function (p) {
          var a = document.createElement('a');
          a.className = 'login';
          a.href = '/api/v1/auth/' + p + '/start?return_to=' + encodeURIComponent(back);
          a.textContent = 'Sign in with ' + p.charAt(0).toUpperCase() + p.slice(1);
          links.appendChild(a);
        });
      }
    });

  document.getElementById('approve').addEventListener('click', function () {
    say('Approving…');
    post('/api/v1/auth/device/authorize', { user_code: codeInput.value })
      .then(function () { say('Device approved. You can return to ChengFlow.', 'ok'); })
      .catch(function (err) { say(err.message, 'err'); });
  });
  document.getElementById('deny').addEventListener('click', function () {
    post('/api/v1/auth/device/deny', { user_code: codeInput.value })
      .then(function () { say('Request denied.', 'ok'); })
      .catch(function (err) { say(err.message, 'err'); });
  });
})();
</script>
</body>
</html>
"##;
