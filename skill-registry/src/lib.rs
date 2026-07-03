//! ChengOS Skills Registry library crate.
//!
//! Exposes every layer so integration tests can assemble routers and services
//! with real or fake ports. The binary (`main.rs`) only parses subcommands and
//! delegates to [`app`].

pub mod api;
pub mod app;
pub mod config;
pub mod domain;
pub mod error;
pub mod jobs;
pub mod ports;
pub mod security;
pub mod services;
pub mod storage;
pub mod telemetry;
