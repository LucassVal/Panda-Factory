//! 🐼 Panda Agent - Main Entry Point
//! ==================================
//! MCP Server + GPU Detection + Ed25519 Crypto
//!
//! Features:
//! - MCP Tools for Antigravity/Brain
//! - GPU/CUDA Detection
//! - Ed25519 Founder Authentication
//! - Bridge to JavaScript SDK

use anyhow::Result;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

mod crypto;
mod gpu;
mod mcp;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    info!("🐼 Panda Agent v0.1.0 starting...");

    // Detect GPU
    #[cfg(feature = "gpu")]
    {
        let gpu_info = gpu::detect_gpu();
        info!("GPU: {:?}", gpu_info);
    }

    // Initialize Ed25519 keys
    let keypair = crypto::load_or_create_keypair()?;
    info!("Ed25519 Public Key: {}", keypair.public_key_hex());

    // Start MCP Server
    info!("Starting MCP Server on stdio...");
    mcp::start_server().await?;

    Ok(())
}
