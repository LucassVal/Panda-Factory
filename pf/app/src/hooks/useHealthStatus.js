import { useState, useEffect, useCallback } from "react";
import { firebaseAuth, firebaseDB } from "./useFirebase";

/**
 * Health status configurations by context
 */
const HEALTH_CONFIGS = {
  jam: {
    services: ["firebase_auth", "firebase_rtdb", "gas", "mcp"],
    pollInterval: 10000,
  },
  store: {
    services: ["firebase_auth", "firebase_rtdb", "gas", "stripe"],
    pollInterval: 15000,
  },
  devtools: {
    services: ["firebase_auth", "firebase_rtdb", "mcp"],
    pollInterval: 10000,
  },
  admin: {
    services: ["firebase_auth", "firebase_rtdb", "gas", "gasometer"],
    pollInterval: 15000,
  },
};

/**
 * Check real service health
 */
const checkServiceHealth = async (serviceName) => {
  switch (serviceName) {
    case "firebase_auth": {
      try {
        const user = firebaseAuth.getCurrentUser?.();
        if (user) {
          return {
            status: "connected",
            message: user.email || "Authenticated",
          };
        }
        // Auth SDK loaded but no user logged in
        return { status: "ready", message: "SDK loaded, no user" };
      } catch {
        return { status: "unavailable", message: "Auth SDK error" };
      }
    }
    case "firebase_rtdb": {
      try {
        if (!firebaseDB.isReady?.()) {
          return { status: "unavailable", message: "RTDB not initialized" };
        }
        const start = Date.now();
        await firebaseDB.get("heartbeat/lastCheck");
        const latency = Date.now() - start;
        return {
          status: "connected",
          latency_ms: latency,
          message: `${latency}ms`,
        };
      } catch (err) {
        return {
          status: "unavailable",
          message: err.message?.slice(0, 50) || "RTDB error",
        };
      }
    }
    case "gas": {
      const url = import.meta.env.VITE_GAS_URL || "";
      if (!url) {
        return { status: "unavailable", message: "VITE_GAS_URL not set" };
      }
      try {
        const start = Date.now();
        const resp = await fetch(`${url}?action=ping`, {
          signal: AbortSignal.timeout(8000),
        });
        const latency = Date.now() - start;
        if (resp.ok) {
          return {
            status: "connected",
            latency_ms: latency,
            message: `${latency}ms`,
          };
        }
        return { status: "unavailable", message: `HTTP ${resp.status}` };
      } catch {
        return { status: "unavailable", message: "Unreachable" };
      }
    }
    case "mcp": {
      // MCP is ready if window.Panda or MCP tools exist
      const hasMCP = !!(window.Panda?.MCP || window.__panda_mcp);
      return hasMCP
        ? { status: "ready", message: "MCP Bridge active" }
        : { status: "unavailable", message: "Not loaded" };
    }
    case "stripe": {
      const hasStripe = !!window.Stripe;
      return hasStripe
        ? { status: "ready", message: "Stripe.js loaded" }
        : { status: "unavailable", message: "Stripe.js not loaded" };
    }
    case "gasometer": {
      // Depends on GAS being available
      const url = import.meta.env.VITE_GAS_URL || "";
      if (!url) return { status: "unavailable", message: "GAS not configured" };
      try {
        const resp = await fetch(`${url}?action=gasometer.stats`, {
          signal: AbortSignal.timeout(8000),
        });
        if (resp.ok) {
          const data = await resp.json();
          return {
            status: "connected",
            message: `${(data.percentage || 0).toFixed(1)}% used`,
          };
        }
        return { status: "unavailable", message: "Endpoint error" };
      } catch {
        return { status: "unavailable", message: "Unreachable" };
      }
    }
    default:
      return { status: "unavailable", message: "Unknown service" };
  }
};

/**
 * Custom hook for health status
 *
 * @param {string} context - 'jam' | 'store' | 'devtools' | 'admin'
 * @returns {{ health, isConnected, isLoading, error, refresh, services }}
 */
export function useHealthStatus(context = "jam") {
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = HEALTH_CONFIGS[context] || HEALTH_CONFIGS.jam;

  const fetchHealth = useCallback(async () => {
    try {
      const serviceResults = {};
      const checks = await Promise.allSettled(
        config.services.map(async (svc) => {
          const result = await checkServiceHealth(svc);
          return { name: svc, ...result };
        }),
      );

      checks.forEach((result) => {
        if (result.status === "fulfilled") {
          const { name, ...info } = result.value;
          serviceResults[name] = info;
        }
      });

      // Determine overall status
      const statuses = Object.values(serviceResults);
      const connectedCount = statuses.filter((s) =>
        ["ready", "connected", "available"].includes(s.status),
      ).length;
      const overallStatus =
        connectedCount === statuses.length
          ? "healthy"
          : connectedCount > 0
            ? "degraded"
            : "offline";

      const data = {
        version: "0.2.0",
        uptime_secs: Math.floor(
          (Date.now() - (window._pandaStartTime || Date.now())) / 1000,
        ),
        status: overallStatus,
        context,
        services: serviceResults,
      };

      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(`Health check failed for ${context}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [context, config.services]);

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
