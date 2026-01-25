//! 🎮 GPU Detection Module
//! ========================
//! Detects NVIDIA GPUs via NVML

#[cfg(feature = "gpu")]
use nvml_wrapper::Nvml;

#[derive(Debug, Clone)]
pub struct GpuInfo {
    pub available: bool,
    pub name: String,
    pub memory_total: u64,
    pub memory_free: u64,
    pub cuda_version: Option<String>,
    pub driver_version: Option<String>,
}

impl Default for GpuInfo {
    fn default() -> Self {
        Self {
            available: false,
            name: "None".to_string(),
            memory_total: 0,
            memory_free: 0,
            cuda_version: None,
            driver_version: None,
        }
    }
}

/// Detect NVIDIA GPU
#[cfg(feature = "gpu")]
pub fn detect_gpu() -> GpuInfo {
    match Nvml::init() {
        Ok(nvml) => {
            let device_count = nvml.device_count().unwrap_or(0);
            
            if device_count == 0 {
                return GpuInfo::default();
            }

            // Get first GPU
            match nvml.device_by_index(0) {
                Ok(device) => {
                    let name = device.name().unwrap_or_else(|_| "Unknown".to_string());
                    let memory = device.memory_info().ok();
                    let cuda = nvml.sys_cuda_driver_version().ok();
                    let driver = nvml.sys_driver_version().ok();

                    GpuInfo {
                        available: true,
                        name,
                        memory_total: memory.as_ref().map(|m| m.total).unwrap_or(0),
                        memory_free: memory.as_ref().map(|m| m.free).unwrap_or(0),
                        cuda_version: cuda.map(|v| format!("{}.{}", v / 1000, (v % 1000) / 10)),
                        driver_version: driver,
                    }
                }
                Err(_) => GpuInfo::default(),
            }
        }
        Err(_) => GpuInfo::default(),
    }
}

/// Fallback when GPU feature is disabled
#[cfg(not(feature = "gpu"))]
pub fn detect_gpu() -> GpuInfo {
    GpuInfo::default()
}

/// Check if CUDA is available
pub fn is_cuda_available() -> bool {
    detect_gpu().available
}

/// Get GPU memory in GB
pub fn get_gpu_memory_gb() -> f64 {
    let info = detect_gpu();
    (info.memory_total as f64) / (1024.0 * 1024.0 * 1024.0)
}
