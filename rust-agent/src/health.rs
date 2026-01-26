//! 🏥 Health Check Module
//! =======================
//! Provides health status for all Panda services

use serde::Serialize;
use std::collections::HashMap;
use std::sync::OnceLock;
use std::time::Instant;

use crate::gpu;

/// Global start time for uptime calculation
static START_TIME: OnceLock<Instant> = OnceLock::new();

/// Initialize health system (call at startup)
pub fn init() {
    START_TIME.get_or_init(Instant::now);
    tracing::info!("🏥 Health system initialized");
}

/// Service status enum
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum ServiceStatus {
    Ready,
    Connected,
    Available,
    Unavailable,
    Error,
    NotInitialized,
}

/// Individual service info
#[derive(Debug, Clone, Serialize)]
pub struct ServiceInfo {
    pub status: ServiceStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<u64>,
    #[serde(skip_serializing_if = "HashMap::is_empty", default)]
    pub details: HashMap<String, String>,
}

impl ServiceInfo {
    pub fn ready() -> Self {
        Self {
            status: ServiceStatus::Ready,
            message: None,
            latency_ms: None,
            details: HashMap::new(),
        }
    }

    pub fn connected() -> Self {
        Self {
            status: ServiceStatus::Connected,
            message: None,
            latency_ms: None,
            details: HashMap::new(),
        }
    }

    pub fn unavailable(msg: &str) -> Self {
        Self {
            status: ServiceStatus::Unavailable,
            message: Some(msg.to_string()),
            latency_ms: None,
            details: HashMap::new(),
        }
    }

    pub fn with_latency(mut self, ms: u64) -> Self {
        self.latency_ms = Some(ms);
        self
    }

    pub fn with_detail(mut self, key: &str, value: &str) -> Self {
        self.details.insert(key.to_string(), value.to_string());
        self
    }
}

/// Full health status response
#[derive(Debug, Clone, Serialize)]
pub struct HealthStatus {
    pub version: String,
    pub uptime_secs: u64,
    pub status: String,
    pub services: HashMap<String, ServiceInfo>,
}

impl HealthStatus {
    /// Check if all critical services are healthy
    pub fn is_healthy(&self) -> bool {
        self.services.values().all(|s| {
            matches!(
                s.status,
                ServiceStatus::Ready | ServiceStatus::Connected | ServiceStatus::Available
            )
        })
    }
}

/// Get current health status
pub fn get_health() -> HealthStatus {
    let uptime = START_TIME
        .get()
        .map(|t| t.elapsed().as_secs())
        .unwrap_or(0);

    let mut services = HashMap::new();

    // MCP Server status
    services.insert(
        "mcp".to_string(),
        ServiceInfo::ready().with_detail("tools", "5"),
    );

    // GPU status
    let gpu_info = gpu::detect_gpu();
    if gpu_info.available {
        services.insert(
            "gpu".to_string(),
            ServiceInfo {
                status: ServiceStatus::Available,
                message: None,
                latency_ms: None,
                details: {
                    let mut d = HashMap::new();
                    d.insert("name".to_string(), gpu_info.name);
                    d.insert(
                        "memory_gb".to_string(),
                        format!("{:.1}", gpu_info.memory_total as f64 / 1024.0 / 1024.0 / 1024.0),
                    );
                    if let Some(cuda) = gpu_info.cuda_version {
                        d.insert("cuda".to_string(), cuda);
                    }
                    d
                },
            },
        );
    } else {
        services.insert(
            "gpu".to_string(),
            ServiceInfo::unavailable("No NVIDIA GPU detected"),
        );
    }

    // Firebase status (placeholder - will be updated when firebase.rs is implemented)
    services.insert(
        "firebase".to_string(),
        ServiceInfo {
            status: ServiceStatus::NotInitialized,
            message: Some("Not configured".to_string()),
            latency_ms: None,
            details: HashMap::new(),
        },
    );

    // GAS status (placeholder)
    services.insert(
        "gas".to_string(),
        ServiceInfo {
            status: ServiceStatus::NotInitialized,
            message: Some("Not configured".to_string()),
            latency_ms: None,
            details: HashMap::new(),
        },
    );

    // Screen capture status
    services.insert(
        "screen".to_string(),
        ServiceInfo::ready().with_detail("backend", "scap"),
    );

    // Determine overall status
    let status = if services
        .values()
        .any(|s| matches!(s.status, ServiceStatus::Error))
    {
        "error"
    } else if services
        .values()
        .any(|s| matches!(s.status, ServiceStatus::Unavailable | ServiceStatus::NotInitialized))
    {
        "degraded"
    } else {
        "healthy"
    };

    HealthStatus {
        version: env!("CARGO_PKG_VERSION").to_string(),
        uptime_secs: uptime,
        status: status.to_string(),
        services,
    }
}

/// Get health as JSON string
pub fn get_health_json() -> String {
    serde_json::to_string_pretty(&get_health()).unwrap_or_else(|_| "{}".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_health_status() {
        init();
        let health = get_health();
        assert!(!health.version.is_empty());
        assert!(health.services.contains_key("mcp"));
    }
}
