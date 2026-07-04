//! ChengHub — shared cloud identity and community board for ChengFlow.
//!
//! Library form exists so integration tests can assemble the app in-process.
//! The binary (`main.rs`) stays thin: CLI parsing and runtime setup only.

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
