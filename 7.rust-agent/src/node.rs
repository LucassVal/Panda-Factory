// 🐼 Panda Factory - P2P Node Manager
// rust-agent/src/node.rs
//
// Responsabilidade: Gerenciamento de nós P2P, benchmark, heartbeat
// Cross-Ref: docs/PF_P2P_REFERENCE.md

use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

// ============================================================================
// NODE TIERS
// ============================================================================

/// Node tier levels with multiplier rewards
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum NodeTier {
    Seed,    // 1.0x - 4GB RAM, 2 cores
    Sprout,  // 1.5x - 8GB RAM, 4 cores
    Tree,    // 2.5x - 16GB RAM, 8 cores, GPU
    Forest,  // 4.0x - 32GB RAM, 12 cores, RTX 30+
    Titan,   // 8.0x - 64GB+ RAM, 16+ cores, Multi-GPU
}

impl NodeTier {
    /// Returns the reward multiplier for this tier
    pub fn multiplier(&self) -> f64 {
        match self {
            NodeTier::Seed => 1.0,
            NodeTier::Sprout => 1.5,
            NodeTier::Tree => 2.5,
            NodeTier::Forest => 4.0,
            NodeTier::Titan => 8.0,
        }
    }

    /// Returns minimum uptime requirement (percentage)
    pub fn min_uptime(&self) -> f64 {
        match self {
            NodeTier::Seed => 0.90,
            NodeTier::Sprout => 0.95,
            _ => 0.99,
        }
    }

    /// Determine tier based on system resources
    pub fn from_resources(resources: &Resources) -> Self {
        if resources.ram_gb >= 64 && resources.cpu_cores >= 16 && resources.gpu_count > 1 {
            NodeTier::Titan
        } else if resources.ram_gb >= 32 && resources.cpu_cores >= 12 && resources.has_rtx30_plus() {
            NodeTier::Forest
        } else if resources.ram_gb >= 16 && resources.cpu_cores >= 8 && resources.gpu_tflops.is_some() {
            NodeTier::Tree
        } else if resources.ram_gb >= 8 && resources.cpu_cores >= 4 {
            NodeTier::Sprout
        } else {
            NodeTier::Seed
        }
    }
}

// ============================================================================
// RESOURCES
// ============================================================================

/// System resources available for P2P compute
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resources {
    pub cpu_cores: u8,
    pub ram_gb: u16,
    pub gpu_tflops: Option<f32>,
    pub gpu_name: Option<String>,
    pub gpu_count: u8,
    pub storage_gb: u32,
    pub bandwidth_mbps: u32,
}

impl Resources {
    /// Check if GPU is RTX 30 series or better
    pub fn has_rtx30_plus(&self) -> bool {
        if let Some(ref name) = self.gpu_name {
            let name_lower = name.to_lowercase();
            name_lower.contains("rtx 30") ||
            name_lower.contains("rtx 40") ||
            name_lower.contains("rtx 50") ||
            name_lower.contains("a100") ||
            name_lower.contains("h100")
        } else {
            false
        }
    }

    /// Detect system resources using sysinfo crate
    #[cfg(feature = "sysinfo")]
    pub fn detect() -> Self {
        use sysinfo::{System, SystemExt, CpuExt};
        
        let mut sys = System::new_all();
        sys.refresh_all();
        
        Resources {
            cpu_cores: sys.cpus().len() as u8,
            ram_gb: (sys.total_memory() / 1024 / 1024 / 1024) as u16,
            gpu_tflops: None, // Requires NVML
            gpu_name: None,
            gpu_count: 0,
            storage_gb: 0,
            bandwidth_mbps: 100, // Default estimate
        }
    }
}

// ============================================================================
// NODE CONFIG
// ============================================================================

/// Node configuration for P2P participation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeConfig {
    pub node_id: String,
    pub user_id: String,
    pub tier: NodeTier,
    pub resources: Resources,
    
    // Resource limits (percentage)
    pub max_cpu_percent: u8,   // 10-90%, default 30%
    pub max_ram_percent: u8,   // 10-50%, default 20%
    pub max_gpu_percent: u8,   // 10-90%, default 50%
    
    // Scheduling
    pub active_hours: Vec<u8>, // 0-23, empty = always
    pub only_when_idle: bool,
    
    // Partner Mode
    pub partner_mode: bool,
    pub mining_enabled: bool,
}

impl Default for NodeConfig {
    fn default() -> Self {
        Self {
            node_id: uuid::Uuid::new_v4().to_string(),
            user_id: String::new(),
            tier: NodeTier::Seed,
            resources: Resources {
                cpu_cores: 2,
                ram_gb: 4,
                gpu_tflops: None,
                gpu_name: None,
                gpu_count: 0,
                storage_gb: 100,
                bandwidth_mbps: 100,
            },
            max_cpu_percent: 30,
            max_ram_percent: 20,
            max_gpu_percent: 50,
            active_hours: vec![],
            only_when_idle: true,
            partner_mode: false,
            mining_enabled: false,
        }
    }
}

// ============================================================================
// NODE MANAGER
// ============================================================================

/// Node manager handles registration, heartbeat, and health monitoring
pub struct NodeManager {
    config: NodeConfig,
    registered: bool,
    last_heartbeat: Option<Instant>,
    uptime_start: Option<Instant>,
    total_uptime_seconds: u64,
}

impl NodeManager {
    pub fn new(config: NodeConfig) -> Self {
        Self {
            config,
            registered: false,
            last_heartbeat: None,
            uptime_start: None,
            total_uptime_seconds: 0,
        }
    }

    /// Register node with the Panda network
    pub async fn register(&mut self) -> Result<NodeRegistration, NodeError> {
        // Detect current resources
        #[cfg(feature = "sysinfo")]
        {
            self.config.resources = Resources::detect();
        }
        
        // Determine tier based on resources
        self.config.tier = NodeTier::from_resources(&self.config.resources);
        
        // TODO: Call GAS backend to register
        // POST /node/register
        
        self.registered = true;
        self.uptime_start = Some(Instant::now());
        
        Ok(NodeRegistration {
            node_id: self.config.node_id.clone(),
            tier: self.config.tier,
            multiplier: self.config.tier.multiplier(),
        })
    }

    /// Send heartbeat to network (every 60 seconds)
    pub async fn heartbeat(&mut self) -> Result<HeartbeatResponse, NodeError> {
        if !self.registered {
            return Err(NodeError::NotRegistered);
        }
        
        self.last_heartbeat = Some(Instant::now());
        
        // Calculate current uptime
        let uptime = self.uptime_start
            .map(|start| start.elapsed().as_secs())
            .unwrap_or(0);
        
        // TODO: Call GAS backend
        // POST /node/heartbeat
        
        Ok(HeartbeatResponse {
            acknowledged: true,
            next_heartbeat_ms: 60_000,
            pending_tasks: 0,
        })
    }

    /// Check if node meets Phantom Protocol rules (15% free resources)
    pub fn check_phantom_protocol(&self) -> PhantomStatus {
        // Rule: Never use more than 85% of any resource
        const MAX_USAGE: u8 = 85;
        
        PhantomStatus {
            cpu_ok: self.config.max_cpu_percent <= MAX_USAGE,
            ram_ok: self.config.max_ram_percent <= MAX_USAGE,
            gpu_ok: self.config.max_gpu_percent <= 90, // GPU can go to 90%
            can_proceed: true,
        }
    }

    /// Get current node statistics
    pub fn stats(&self) -> NodeStats {
        NodeStats {
            node_id: self.config.node_id.clone(),
            tier: self.config.tier,
            multiplier: self.config.tier.multiplier(),
            uptime_seconds: self.uptime_start
                .map(|start| start.elapsed().as_secs())
                .unwrap_or(0),
            is_active: self.registered,
            partner_mode: self.config.partner_mode,
        }
    }
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct NodeRegistration {
    pub node_id: String,
    pub tier: NodeTier,
    pub multiplier: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HeartbeatResponse {
    pub acknowledged: bool,
    pub next_heartbeat_ms: u64,
    pub pending_tasks: u32,
}

#[derive(Debug)]
pub struct PhantomStatus {
    pub cpu_ok: bool,
    pub ram_ok: bool,
    pub gpu_ok: bool,
    pub can_proceed: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NodeStats {
    pub node_id: String,
    pub tier: NodeTier,
    pub multiplier: f64,
    pub uptime_seconds: u64,
    pub is_active: bool,
    pub partner_mode: bool,
}

// ============================================================================
// ERRORS
// ============================================================================

#[derive(Debug)]
pub enum NodeError {
    NotRegistered,
    NetworkError(String),
    ResourcesInsufficient,
    BenchmarkFailed,
}

impl std::fmt::Display for NodeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            NodeError::NotRegistered => write!(f, "Node not registered"),
            NodeError::NetworkError(msg) => write!(f, "Network error: {}", msg),
            NodeError::ResourcesInsufficient => write!(f, "Insufficient resources"),
            NodeError::BenchmarkFailed => write!(f, "Benchmark failed"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tier_from_resources() {
        let seed = Resources {
            cpu_cores: 2,
            ram_gb: 4,
            gpu_tflops: None,
            gpu_name: None,
            gpu_count: 0,
            storage_gb: 100,
            bandwidth_mbps: 50,
        };
        assert_eq!(NodeTier::from_resources(&seed), NodeTier::Seed);

        let titan = Resources {
            cpu_cores: 32,
            ram_gb: 128,
            gpu_tflops: Some(160.0),
            gpu_name: Some("RTX 4090".to_string()),
            gpu_count: 2,
            storage_gb: 2000,
            bandwidth_mbps: 1000,
        };
        assert_eq!(NodeTier::from_resources(&titan), NodeTier::Titan);
    }

    #[test]
    fn test_tier_multipliers() {
        assert_eq!(NodeTier::Seed.multiplier(), 1.0);
        assert_eq!(NodeTier::Titan.multiplier(), 8.0);
    }
}
