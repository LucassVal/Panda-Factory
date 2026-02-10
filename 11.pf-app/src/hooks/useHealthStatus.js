import { useState, useEffect, useCallback } from "react";

/**
 * Health status configurations by context
 */
const HEALTH_CONFIGS = {
  jam: {
    endpoint: "/api/health", // or IPC to Rust
    services: ["rust", "firebase", "gas", "gpu", "mcp"],
    pollInterval: 5000,
  },
  store: {
    endpoint: "/api/health/store",
    services: ["github", "payment", "cdn", "analytics"],
    pollInterval: 10000,
  },
  devtools: {
    endpoint: "/api/health/dev",
    services: ["vsx", "mcp", "debugger", "terminal"],
    pollInterval: 5000,
  },
  admin: {
    endpoint: "/api/health/admin",
    services: ["firestore", "gas", "bigquery", "users"],
    pollInterval: 15000,
  },
};

/**
 * Mock health data for development
 */
const getMockHealth = (context) => {
  const baseServices = {
    rust: { status: "ready", message: "Rust Agent v0.2.0" },
    firebase: { status: "connected", latency_ms: 45 },
    gas: { status: "connected", latency_ms: 120 },
    gpu: { status: "unavailable", message: "No NVIDIA GPU" },
    mcp: { status: "ready", details: { tools: "5" } },
    github: { status: "connected", message: "API connected" },
    payment: { status: "ready", message: "PC Gateway active" },
    cdn: { status: "connected", latency_ms: 25 },
    analytics: { status: "connected", message: "Firebase Analytics" },
    vsx: { status: "ready", message: "VSX Extension loaded" },
    debugger: { status: "unavailable", message: "Not attached" },
    terminal: { status: "ready", message: "PowerShell" },
    firestore: { status: "connected", latency_ms: 35 },
    bigquery: { status: "connected", message: "1TB/month" },
    users: { status: "connected", details: { count: "1,247" } },
  };

  const config = HEALTH_CONFIGS[context] || HEALTH_CONFIGS.jam;
  const services = {};

  config.services.forEach((service) => {
    services[service] = baseServices[service] || { status: "notinitialized" };
  });

  return {
    version: "0.2.0",
    uptime_secs: Math.floor(
      (Date.now() - (window._pandaStartTime || Date.now())) / 1000,
    ),
    status: "healthy",
    context,
    services,
  };
};

/**
 * Custom hook for health status
 *
 * @param {string} context - 'jam' | 'store' | 'devtools' | 'admin'
 * @returns {{ health, isConnected, isLoading, error, refresh }}
 */
export function useHealthStatus(context = "jam") {
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = HEALTH_CONFIGS[context] || HEALTH_CONFIGS.jam;

  const fetchHealth = useCallback(async () => {
    try {
      // TODO: Replace with actual fetch when Rust IPC is ready
      // const response = await fetch(config.endpoint);
      // const data = await response.json();

      // For now, use mock data
      const data = getMockHealth(context);

      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(`Health check failed for ${context}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [context, config.endpoint]);

  // Initial fetch and polling
  useEffect(() => {
    window._pandaStartTime = window._pandaStartTime || Date.now();
    fetchHealth();

    const interval = setInterval(fetchHealth, config.pollInterval);
    return () => clearInterval(interval);
  }, [fetchHealth, config.pollInterval]);

  // Computed values
  const isConnected = health?.status === "healthy";

  const serviceStatuses = health?.services
    ? Object.entries(health.services).map(([name, info]) => ({
        name,
        ...info,
        isHealthy: ["ready", "connected", "available"].includes(info.status),
      }))
    : [];

  return {
    health,
    isLoading,
    error,
    isConnected,
    services: serviceStatuses,
    refresh: fetchHealth,
  };
}

export default useHealthStatus;
