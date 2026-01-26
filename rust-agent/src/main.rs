//! 🐼 Panda Agent - Main Entry Point
//! ==================================
//! MCP Server + GPU Detection + Ed25519 Crypto + Health System
//!
//! Features:
//! - MCP Tools for Antigravity/Brain
//! - GPU/CUDA Detection
//! - Ed25519 Founder Authentication
//! - Health monitoring endpoint
//! - Bridge to JavaScript SDK

use anyhow::Result;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

mod crypto;
mod gpu;
mod health;
mod mcp;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    info!("🐼 Panda Agent v{} starting...", env!("CARGO_PKG_VERSION"));

    // Initialize health system
    health::init();

    // Detect GPU
    #[cfg(feature = "gpu")]
    {
        let gpu_info = gpu::detect_gpu();
        info!("GPU: {:?}", gpu_info);
    }

    // Initialize Ed25519 keys
    let keypair = crypto::load_or_create_keypair()?;
    info!("Ed25519 Public Key: {}", keypair.public_key_hex());

    // Log current health
    info!("Health: {}", health::get_health().status);

    // Start MCP Server
    info!("Starting MCP Server on stdio...");
    mcp::start_server().await?;

    Ok(())
}
