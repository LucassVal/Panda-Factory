import { useState, useEffect, useCallback, useRef } from "react";
import { Gasometer } from "../services/callGAS";

/**
 * ⛽ useGasometer v2.0 — Google Apps Script Usage Monitor
 * Tracks GAS execution quota and cost per operation.
 * Now supports real data from GAS backend with mock fallback.
 *
 * Free-tier: 6,000,000 executions/day
 * @see README.md §Gasômetro
 * @see PF_GAS_REFERENCE.md
 */

const GAS_FREE_TIER_DAILY = 6_000_000;
const POLL_INTERVAL_MS = 60_000; // 60s auto-refresh

// Mock operation costs (executions per operation)
const OPERATION_COSTS = {
  "Drive.read": 1,
  "Drive.write": 2,
  "Sheets.read": 1,
  "Sheets.write": 2,
  "Brain.chat": 5,
  "Brain.vision": 8,
  "Social.send": 3,
  "Webhook.trigger": 2,
  "Store.checkout": 4,
  "Auth.verify": 1,
};

// Generate mock execution log
function generateMockLog() {
  const ops = Object.keys(OPERATION_COSTS);
  const log = [];
  const now = Date.now();

  for (let i = 0; i < 50; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)];
    log.push({
      id: `exec-${i}`,
      operation: op,
      cost: OPERATION_COSTS[op],
      timestamp: new Date(
        now - i * 60000 * (Math.random() * 30 + 1),
      ).toISOString(),
      status: Math.random() > 0.05 ? "success" : "error",
    });
  }

  return log.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function generateMockQuota() {
  const mockUsed = Math.floor(Math.random() * 150000) + 5000;
  return {
    daily: GAS_FREE_TIER_DAILY,
    used: mockUsed,
    remaining: GAS_FREE_TIER_DAILY - mockUsed,
    percentage: (mockUsed / GAS_FREE_TIER_DAILY) * 100,
  };
}

export function useGasometer() {
  const [quota, setQuota] = useState({
    daily: GAS_FREE_TIER_DAILY,
    used: 0,
    remaining: GAS_FREE_TIER_DAILY,
    percentage: 0,
  });

  const [executionLog, setExecutionLog] = useState([]);
  const [topOperations, setTopOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [mode, setMode] = useState("loading"); // "real" | "mock" | "loading"
  const pollRef = useRef(null);

  // ── Process log into top operations + alerts ──
  const processLog = useCallback((log, quotaData) => {
    const opMap = {};
    log.forEach((entry) => {
      if (!opMap[entry.operation]) {
        opMap[entry.operation] = {
          operation: entry.operation,
          totalCost: 0,
          count: 0,
        };
      }
      opMap[entry.operation].totalCost += entry.cost;
      opMap[entry.operation].count += 1;
    });

    const sorted = Object.values(opMap).sort(
      (a, b) => b.totalCost - a.totalCost,
    );
    setTopOperations(sorted.slice(0, 5));

    // Generate alerts
    const pct = quotaData.percentage;
    const newAlerts = [];
    if (pct > 80) {
      newAlerts.push({
        type: "critical",
        message: "⚠️ GAS quota above 80% — consider batching operations",
      });
    } else if (pct > 50) {
      newAlerts.push({
        type: "warning",
        message: "📊 GAS usage moderate — monitor heavy operations",
      });
    }
    setAlerts(newAlerts);
  }, []);

  // ── Fetch data (real with mock fallback) ──
  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);

      try {
        // Try real GAS endpoint
        const stats = await Gasometer.getStats();
        if (stats && stats.used !== undefined) {
          const realQuota = {
            daily: stats.daily || GAS_FREE_TIER_DAILY,
            used: stats.used,
            remaining: (stats.daily || GAS_FREE_TIER_DAILY) - stats.used,
            percentage:
              (stats.used / (stats.daily || GAS_FREE_TIER_DAILY)) * 100,
          };
          setQuota(realQuota);
          const realLog = stats.log || generateMockLog();
          setExecutionLog(realLog);
          processLog(realLog, realQuota);
          setMode("real");
          setIsLoading(false);
          return;
        }
      } catch {
        // GAS endpoint unavailable — fall through to mock
      }

      // Mock fallback
      const mockQuota = generateMockQuota();
      setQuota(mockQuota);
      const log = generateMockLog();
      setExecutionLog(log);
      processLog(log, mockQuota);
      setMode("mock");
      setIsLoading(false);
    },
    [processLog],
  );

  // ── Initial load + polling ──
  useEffect(() => {
    fetchData();

    // Auto-refresh every 60s
    pollRef.current = setInterval(() => {
      fetchData(true); // silent refresh
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  const refresh = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  return {
    quota,
    executionLog,
    topOperations,
    alerts,
    isLoading,
    mode,
    refresh,
    operationCosts: OPERATION_COSTS,
  };
}
