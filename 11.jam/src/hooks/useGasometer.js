import { useState, useEffect, useCallback } from "react";

/**
 * ⛽ useGasometer v1.0 — Google Apps Script Usage Monitor
 * Tracks GAS execution quota and cost per operation.
 *
 * Free-tier: 6,000,000 executions/day
 * @see README.md §Gasômetro
 * @see PF_GAS_REFERENCE.md
 */

const GAS_FREE_TIER_DAILY = 6_000_000;

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

  // Simulate quota usage
  useEffect(() => {
    const mockUsed = Math.floor(Math.random() * 150000) + 5000;
    const remaining = GAS_FREE_TIER_DAILY - mockUsed;
    const percentage = (mockUsed / GAS_FREE_TIER_DAILY) * 100;

    setQuota({
      daily: GAS_FREE_TIER_DAILY,
      used: mockUsed,
      remaining,
      percentage,
    });

    const log = generateMockLog();
    setExecutionLog(log);

    // Calculate top operations by cost
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
    const newAlerts = [];
    if (percentage > 80) {
      newAlerts.push({
        type: "critical",
        message: "⚠️ GAS quota above 80% — consider batching operations",
      });
    } else if (percentage > 50) {
      newAlerts.push({
        type: "warning",
        message: "📊 GAS usage moderate — monitor heavy operations",
      });
    }
    setAlerts(newAlerts);

    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUsed = Math.floor(Math.random() * 150000) + 5000;
      const remaining = GAS_FREE_TIER_DAILY - mockUsed;
      setQuota({
        daily: GAS_FREE_TIER_DAILY,
        used: mockUsed,
        remaining,
        percentage: (mockUsed / GAS_FREE_TIER_DAILY) * 100,
      });
      setExecutionLog(generateMockLog());
      setIsLoading(false);
    }, 800);
  }, []);

  return {
    quota,
    executionLog,
    topOperations,
    alerts,
    isLoading,
    refresh,
    operationCosts: OPERATION_COSTS,
  };
}
