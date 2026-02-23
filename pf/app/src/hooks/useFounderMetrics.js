import { useState, useEffect, useCallback } from "react";

/**
 * 🔭 useFounderMetrics Hook
 * =========================
 * Aggregates telemetry data from all agents for Founder Dashboard
 *
 * Sources:
 * - AgentTelemetry (Panda.Telemetry)
 * - TentacleMonitor (TM)
 * - Firebase (if available)
 */

/**
 * Get metrics from AgentTelemetry
 */
const getAgentMetrics = () => {
  const AT = window.AgentTelemetry || window.Panda?.Telemetry;

  if (!AT) {
    return null;
  }

  const summary = AT.getSummary?.();
  if (summary?.error) {
    return null; // Not founder
  }

  return summary;
};

/**
 * Get mock metrics for development
 */
const getMockMetrics = () => ({
  treasury: {
    pc: "1,234,567",
    pat: "500",
    usd: "$5,234.89",
    pending: "$0.00",
  },
  users: {
    total: "1,247",
    online: "89",
    newToday: "23",
    premium: "156",
    devs: "42",
  },
  usage: {
    apiCalls: "45,230",
    mcpCalls: "12,450",
    gpuHours: "2.1k",
  },
  errors: {
    last24h: 3,
    open: 1,
    critical: 0,
  },
  transactions: [
    { type: "purchase", amount: 500, user: "user123", time: "2 min ago" },
    { type: "spend", amount: -50, user: "dev456", time: "5 min ago" },
    { type: "purchase", amount: 1000, user: "user789", time: "12 min ago" },
    { type: "refund", amount: 100, user: "user321", time: "1 hour ago" },
    { type: "spend", amount: -200, user: "dev654", time: "2 hours ago" },
  ],
});

/**
 * Hook for Founder-level metrics
 * Aggregates data from AgentTelemetry, TentacleMonitor, Firebase, and GAS
 */
export function useFounderMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get AgentTelemetry data (real activities from tentacles)
      const agentMetrics = getAgentMetrics();
      setAgentData(agentMetrics);

      // Fetch real data from GAS backend
      let walletData = null;
      let statusData = null;
      let salesData = null;

      try {
        const { Wallet, Status, Founder } =
          await import("../services/callGAS.js");
        const [walletRes, statusRes, salesRes] = await Promise.allSettled([
          Wallet.getBalance(),
          Status.health(),
          Founder.getRecentSales(5),
        ]);

        if (
          walletRes.status === "fulfilled" &&
          walletRes.value?.status !== "MOCK"
        ) {
          walletData = walletRes.value;
        }
        if (
          statusRes.status === "fulfilled" &&
          statusRes.value?.status !== "MOCK"
        ) {
          statusData = statusRes.value;
        }
        if (
          salesRes.status === "fulfilled" &&
          salesRes.value?.status !== "MOCK"
        ) {
          salesData = salesRes.value;
        }
      } catch (gasError) {
        console.warn(
          "[useFounderMetrics] GAS fetch failed, using fallbacks:",
          gasError.message,
        );
      }

      // Build metrics object — real data where available, fallback where not
      const data = {
        treasury: {
          pc:
            walletData?.balance != null
              ? Number(walletData.balance).toLocaleString()
              : "—",
          pat: "0",
          usd:
            walletData?.usdRate && walletData?.balance != null
              ? `$${((walletData.balance / 100) * walletData.usdRate).toFixed(2)}`
              : "—",
          pending: "$0.00",
          source: walletData ? "GAS" : "offline",
        },
        users: {
          total: "—",
          online: "—",
          newToday: "—",
          premium: "—",
          devs: "—",
        },
        usage: {
          apiCalls:
            statusData?.catalogCount != null
              ? `${statusData.catalogCount} modules`
              : "—",
          mcpCalls: statusData?.modes ? statusData.modes.join(", ") : "—",
          gpuHours: "—",
          version: statusData?.version || "—",
          gasStatus: statusData?.status || "OFFLINE",
        },
        errors: {
          last24h: 0,
          open: 0,
          critical: 0,
        },
        transactions: salesData?.data || [],
      };

      // Override with real AgentTelemetry data where available
      if (agentMetrics) {
        data.tentacles = agentMetrics.tentacles;
        data.activities = agentMetrics.activities;
        data.agentMetrics = agentMetrics.metrics;

        if (agentMetrics.errors) {
          data.errors = {
            last24h: agentMetrics.errors.total,
            open: agentMetrics.errors.unresolved,
            critical: 0,
            list: agentMetrics.errors.last3,
          };
        }
      }

      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch founder metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for real-time updates from AgentTelemetry
  useEffect(() => {
    const handleActivity = (data) => {
      setAgentData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          activities: {
            ...prev.activities,
            last5: [data, ...(prev.activities?.last5 || [])].slice(0, 5),
            total: (prev.activities?.total || 0) + 1,
          },
        };
      });
    };

    const handleError = (data) => {
      setAgentData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          errors: {
            ...prev.errors,
            last3: [data, ...(prev.errors?.last3 || [])].slice(0, 3),
            total: (prev.errors?.total || 0) + 1,
            unresolved: (prev.errors?.unresolved || 0) + 1,
          },
        };
      });
    };

    // Subscribe to Panda events
    if (window.Panda?.on) {
      window.Panda.on("founder:activity", handleActivity);
      window.Panda.on("founder:error", handleError);
    }

    return () => {
      if (window.Panda?.off) {
        window.Panda.off("founder:activity", handleActivity);
        window.Panda.off("founder:error", handleError);
      }
    };
  }, []);

  useEffect(() => {
    fetchMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  // Get activity feed for display
  const getActivityFeed = useCallback(
    (limit = 10) => {
      const AT = window.AgentTelemetry || window.Panda?.Telemetry;
      return AT?.getActivities?.(limit) || agentData?.activities?.last5 || [];
    },
    [agentData],
  );

  // Get error list for display
  const getErrorList = useCallback((limit = 10, unresolvedOnly = true) => {
    const AT = window.AgentTelemetry || window.Panda?.Telemetry;
    return AT?.getErrors?.(limit, unresolvedOnly) || [];
  }, []);

  // Get tentacle status map
  const getTentacleStatus = useCallback(() => {
    const AT = window.AgentTelemetry || window.Panda?.Telemetry;
    return AT?.getTentacleStatus?.() || {};
  }, []);

  // Resolve an error
  const resolveError = useCallback((errorId) => {
    const AT = window.AgentTelemetry || window.Panda?.Telemetry;
    return AT?.resolveError?.(errorId) || { success: false };
  }, []);

  return {
    // Core metrics
    metrics,
    agentData,
    isLoading,
    error,

    // Actions
    refresh: fetchMetrics,

    // Helpers
    getActivityFeed,
    getErrorList,
    getTentacleStatus,
    resolveError,
  };
}

export default useFounderMetrics;
