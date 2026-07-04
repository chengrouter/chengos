//! Browser session cookie construction.
//!
//! HTTP-only, SameSite=Lax (the OAuth callback is a top-level GET redirect,
//! which Lax permits), Secure per configuration (mandatory in production).

use axum_extra::extract::cookie::{Cookie, SameSite};

use crate::config::CookieConfig;

/// Session cookie carrying the raw session token. Only the HMAC hash is
/// stored server-side.
pub fn session_cookie(config: &CookieConfig, raw_session_token: String) -> Cookie<'static> {
    let mut cookie = Cookie::new(config.name.clone(), raw_session_token);
    cookie.set_http_only(true);
    cookie.set_same_site(SameSite::Lax);
    cookie.set_secure(config.secure);
    cookie.set_path("/");
    cookie.set_max_age(time::Duration::seconds(config.session_ttl_secs as i64));
    if !config.domain.is_empty() {
        cookie.set_domain(config.domain.clone());
    }
    cookie
}

/// Expired cookie that clears the session in the browser.
pub fn clear_session_cookie(config: &CookieConfig) -> Cookie<'static> {
    let mut cookie = Cookie::new(config.name.clone(), "");
    cookie.set_http_only(true);
    cookie.set_same_site(SameSite::Lax);
    cookie.set_secure(config.secure);
    cookie.set_path("/");
    cookie.set_max_age(time::Duration::ZERO);
    if !config.domain.is_empty() {
        cookie.set_domain(config.domain.clone());
    }
    cookie
}
