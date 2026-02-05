// 🐼 Panda Factory - Mining & Rewards Module
// rust-agent/src/mining.rs
//
// Responsabilidade: Mineração Partner Mode, rewards, integração XMRig/T-Rex
// Cross-Ref: docs/PF_P2P_REFERENCE.md

use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};
use crate::node::{NodeTier, NodeConfig};

// ============================================================================
// MINING CONFIG
// ============================================================================

/// Mining configuration for Partner Mode
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MiningConfig {
    pub enabled: bool,
    pub pool: MiningPool,
    pub wallet: String,
    pub worker_name: String,
    
    // Resource limits
    pub cpu_threads: u8,
    pub gpu_enabled: bool,
    
    // Scheduling
    pub only_when_idle: bool,
    pub idle_seconds_threshold: u32, // 15s default
    pub active_hours: Vec<u8>,       // 0-23, empty = always
}

impl Default for MiningConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            pool: MiningPool::Unmineable,
            wallet: String::new(),
            worker_name: String::new(),
            cpu_threads: 2,
            gpu_enabled: false,
            only_when_idle: true,
            idle_seconds_threshold: 15,
            active_hours: vec![],
        }
    }
}

// ============================================================================
// MINING POOL
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MiningPool {
    Unmineable,  // Multi-coin, USDT payout
    NiceHash,
    Custom(String),
}

impl MiningPool {
    /// Get pool stratum URL
    pub fn stratum_url(&self) -> &str {
        match self {
            MiningPool::Unmineable => "stratum+tcp://rx.unmineable.com:3333",
            MiningPool::NiceHash => "stratum+tcp://randomxmonero.usa.nicehash.com:3380",
            MiningPool::Custom(url) => url,
        }
    }
}

// ============================================================================
// MINING SESSION
// ============================================================================

/// Active mining session tracking
pub struct MiningSession {
    config: MiningConfig,
    started_at: Instant,
    total_hashes: u64,
    estimated_pc: f64,
    is_paused: bool,
    pause_reason: Option<PauseReason>,
}

#[derive(Debug, Clone)]
pub enum PauseReason {
    UserActivity,      // Mouse/keyboard detected
    HighCpuUsage,      // CPU > 85%
    HighGpuTemp,       // GPU > 80°C
    LowBattery,        // Battery < 20%
    FullscreenApp,     // Fullscreen app detected
    GameRunning,       // Game detected
    ScheduledPause,    // Outside active hours
    ManualPause,       // User paused
}

impl MiningSession {
    pub fn new(config: MiningConfig) -> Self {
        Self {
            config,
            started_at: Instant::now(),
            total_hashes: 0,
            estimated_pc: 0.0,
            is_paused: false,
            pause_reason: None,
        }
    }

    /// Start mining with XMRig (CPU) or T-Rex (GPU)
    pub async fn start(&mut self) -> Result<(), MiningError> {
        if !self.config.enabled {
            return Err(MiningError::NotEnabled);
        }
        
        // Check idle status
        if self.config.only_when_idle {
            // TODO: Check system idle time
        }
        
        self.is_paused = false;
        self.pause_reason = None;
        
        // TODO: Spawn XMRig/T-Rex process
        // - Set resource limits
        // - Configure pool and wallet
        // - Start hashrate monitoring
        
        Ok(())
    }

    /// Pause mining immediately (Phantom Protocol trigger)
    pub fn pause(&mut self, reason: PauseReason) {
        self.is_paused = true;
        self.pause_reason = Some(reason);
        
        // TODO: Send signal to XMRig/T-Rex to pause
    }

    /// Resume mining after pause
    pub fn resume(&mut self) -> Result<(), MiningError> {
        if !self.config.enabled {
            return Err(MiningError::NotEnabled);
        }
        
        self.is_paused = false;
        self.pause_reason = None;
        
        // TODO: Resume XMRig/T-Rex
        
        Ok(())
    }

    /// Check Phantom Protocol conditions
    pub fn check_phantom_triggers(&self) -> Option<PauseReason> {
        // TODO: Implement actual checks using sysinfo
        // - Check for user input
        // - Check CPU usage
        // - Check GPU temperature
        // - Check battery level
        // - Check for fullscreen apps
        
        None
    }

    /// Get current session statistics
    pub fn stats(&self) -> MiningStats {
        let elapsed = self.started_at.elapsed();
        
        MiningStats {
            running: !self.is_paused,
            elapsed_seconds: elapsed.as_secs(),
            total_hashes: self.total_hashes,
            estimated_pc: self.estimated_pc,
            pause_reason: self.pause_reason.clone(),
        }
    }
}

// ============================================================================
// REWARD CALCULATION
// ============================================================================

/// Partner Mode reward splits (hardcoded)
pub const PARTNER_SPLIT: PartnerSplit = PartnerSplit {
    user: 0.50,       // 50% to user as PC
    founder: 0.02,    // 2% founder fee
    ops: 0.23,        // 23% Panda Ops
    taxes: 0.25,      // 25% tax provision
};

#[derive(Debug, Clone, Copy)]
pub struct PartnerSplit {
    pub user: f64,
    pub founder: f64,
    pub ops: f64,
    pub taxes: f64,
}

/// Calculate PC reward based on mining output
pub fn calculate_reward(
    usdt_earned: f64,
    tier: NodeTier,
    uptime_percent: f64,
) -> RewardCalculation {
    // PC base rate: 1 PC = R$0.01 = ~$0.002
    const USDT_TO_PC_RATE: f64 = 500.0; // 1 USDT = 500 PC
    
    let gross_pc = usdt_earned * USDT_TO_PC_RATE;
    let user_pc = gross_pc * PARTNER_SPLIT.user;
    
    // Apply tier multiplier
    let tier_bonus = user_pc * (tier.multiplier() - 1.0);
    
    // Apply uptime bonus (up to 1% extra for 99%+ uptime)
    let uptime_bonus = if uptime_percent >= 0.99 {
        user_pc * 0.01
    } else {
        0.0
    };
    
    RewardCalculation {
        gross_pc,
        user_pc: user_pc + tier_bonus + uptime_bonus,
        tier_bonus,
        uptime_bonus,
        founder_fee: gross_pc * PARTNER_SPLIT.founder,
        ops_fee: gross_pc * PARTNER_SPLIT.ops,
        tax_provision: gross_pc * PARTNER_SPLIT.taxes,
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RewardCalculation {
    pub gross_pc: f64,
    pub user_pc: f64,
    pub tier_bonus: f64,
    pub uptime_bonus: f64,
    pub founder_fee: f64,
    pub ops_fee: f64,
    pub tax_provision: f64,
}

// ============================================================================
// MINING STATS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct MiningStats {
    pub running: bool,
    pub elapsed_seconds: u64,
    pub total_hashes: u64,
    pub estimated_pc: f64,
    #[serde(skip)]
    pub pause_reason: Option<PauseReason>,
}

/// Estimated earnings by hardware tier
pub fn estimate_daily_earnings(tier: NodeTier, has_gpu: bool) -> DailyEstimate {
    // Based on current mining rates (approximate)
    let base_pc = match tier {
        NodeTier::Seed => 15.0,
        NodeTier::Sprout => 25.0,
        NodeTier::Tree => 50.0,
        NodeTier::Forest => 120.0,
        NodeTier::Titan => 300.0,
    };
    
    let gpu_bonus = if has_gpu {
        match tier {
            NodeTier::Tree => 30.0,
            NodeTier::Forest => 80.0,
            NodeTier::Titan => 200.0,
            _ => 0.0,
        }
    } else {
        0.0
    };
    
    let total_pc = base_pc + gpu_bonus;
    let brl_equivalent = total_pc * 0.01; // 1 PC = R$0.01
    
    DailyEstimate {
        pc_per_day: total_pc,
        brl_per_month: brl_equivalent * 30.0,
        tier,
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyEstimate {
    pub pc_per_day: f64,
    pub brl_per_month: f64,
    pub tier: NodeTier,
}

// ============================================================================
// ERRORS
// ============================================================================

#[derive(Debug)]
pub enum MiningError {
    NotEnabled,
    ProcessSpawnFailed,
    PoolConnectionFailed,
    ResourceLimitExceeded,
    PhantomProtocolViolation,
}

impl std::fmt::Display for MiningError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MiningError::NotEnabled => write!(f, "Mining not enabled"),
            MiningError::ProcessSpawnFailed => write!(f, "Failed to spawn mining process"),
            MiningError::PoolConnectionFailed => write!(f, "Failed to connect to mining pool"),
            MiningError::ResourceLimitExceeded => write!(f, "Resource limit exceeded"),
            MiningError::PhantomProtocolViolation => write!(f, "Phantom Protocol violation"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_reward_calculation() {
        let reward = calculate_reward(1.0, NodeTier::Seed, 0.95);
        
        // 1 USDT = 500 PC gross
        assert_eq!(reward.gross_pc, 500.0);
        
        // User gets 50% base = 250 PC (no tier bonus for Seed)
        assert_eq!(reward.user_pc, 250.0);
        
        // Founder gets 2% = 10 PC
        assert_eq!(reward.founder_fee, 10.0);
    }

    #[test]
    fn test_tier_bonus() {
        let seed_reward = calculate_reward(1.0, NodeTier::Seed, 0.95);
        let titan_reward = calculate_reward(1.0, NodeTier::Titan, 0.95);
        
        // Titan should earn significantly more due to 8x multiplier
        assert!(titan_reward.user_pc > seed_reward.user_pc * 5.0);
    }

    #[test]
    fn test_daily_estimates() {
        let seed = estimate_daily_earnings(NodeTier::Seed, false);
        let titan = estimate_daily_earnings(NodeTier::Titan, true);
        
        assert_eq!(seed.pc_per_day, 15.0);
        assert_eq!(titan.pc_per_day, 500.0); // 300 + 200 GPU
    }
}
