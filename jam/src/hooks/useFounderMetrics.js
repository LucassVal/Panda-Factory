import { useState, useEffect, useCallback } from "react";

/**
 * Mock metrics data for development
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
 * Aggregates data from Firebase, BigQuery, and GAS
 */
export function useFounderMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API calls
      // const [treasury, users, usage, errors] = await Promise.all([
      //   Panda.Admin.getTreasury(),
      //   Panda.Admin.getUserStats(),
      //   Panda.Admin.getUsageStats(),
      //   Panda.Admin.getErrors(),
      // ]);

      // For now, use mock data
      const data = getMockMetrics();

      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch founder metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refresh: fetchMetrics,
  };
}

export default useFounderMetrics;
