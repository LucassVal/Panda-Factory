import { useState, useEffect, useCallback, useRef } from "react";
import { gasGet } from "../services/callGAS";
import { firebaseDB } from "./useFirebase";

// Em desenvolvimento local sem GAS URL real, pings causam flood de erros CORS.
// Detecta automaticamente se estamos em localhost sem URL do GAS configurada.
const IS_DEV_WITHOUT_GAS = import.meta.env.DEV && !import.meta.env.VITE_GAS_URL;

/**
 * 💓 useHeartbeat — Agent Health Monitor (5 min interval)
 *
 * Pings all system agents and tracks their status.
 * Data feeds into the Founder Dashboard heartbeat panel.
 *
 * Agents monitored:
 *   ☁️ GAS Backend      — gasGet('status')
 *   🔥 Firebase RTDB    — connection test
 *   🦀 Rust Agent       — pf_cells/agent_status
 *   💳 Stripe           — API health
 *   ⛽ Gasometer        — gasGet('gasometer.stats')
 *   🏪 Store Catalog    — gasGet('store.catalog')
 *   💰 Wallet           — gasGet('status')
 *
 * @param {Object} options
 * @param {number} options.interval - Heartbeat interval in ms (default: 300000 = 5 min)
 * @param {boolean} options.enabled - Whether to run heartbeats (default: true)
 * @returns {Object} { agents, isChecking, lastCheck, alerts, refresh }
 */

const DEFAULT_AGENTS = [
  { id: "gas_backend", name: "GAS Backend", icon: "☁️", action: "status" },
  { id: "firebase_rtdb", name: "Firebase RTDB", icon: "🔥", action: null },
  { id: "rust_agent", name: "Rust Agent", icon: "🦀", action: null },
  { id: "stripe", name: "Stripe", icon: "💳", action: null },
  { id: "gasometer", name: "Gasometer", icon: "⛽", action: "gasometer.stats" },
  {
    id: "store_catalog",
    name: "Store Catalog",
    icon: "🏪",
    action: "store.catalog",
  },
  { id: "wallet_ledger", name: "Wallet Ledger", icon: "💰", action: "status" },
];

const HEARTBEAT_INTERVAL = 300_000; // 5 minutes

export function useHeartbeat({
  interval = HEARTBEAT_INTERVAL,
  enabled = !IS_DEV_WITHOUT_GAS, // desativa pings em dev sem GAS URL (evita CORS flood)
} = {}) {
  const [agents, setAgents] = useState(() =>
    DEFAULT_AGENTS.map((a) => ({
      ...a,
      status: "unknown", // "online" | "offline" | "warning" | "unknown"
      lastPing: null,
      latency: null,
      detail: null,
    })),
  );
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const timerRef = useRef(null);

  const pingAgent = useCallback(async (agent) => {
    const start = Date.now();

    // Agents with GAS actions
    if (agent.action) {
      try {
        const result = await gasGet(agent.action);
        const latency = Date.now() - start;

        if (result.status === "MOCK") {
          return {
            ...agent,
            status: "unknown",
            latency: null,
            detail: "GAS URL not set",
            lastPing: new Date().toISOString(),
          };
        }
        if (result.status === "ERROR") {
          return {
            ...agent,
            status: "offline",
            latency,
            detail: result.error,
            lastPing: new Date().toISOString(),
          };
        }

        // Build detail string based on agent type
        let detail = "";
        if (agent.id === "gas_backend")
          detail = `v${result.version || "?"} │ ${latency}ms`;
        if (agent.id === "gasometer")
          detail = `${(result.percentage || 0).toFixed(1)}% used`;
        if (agent.id === "store_catalog")
          detail = `${result.count || 0} modules`;
        if (agent.id === "wallet_ledger")
          detail = `rate: ${result.usdRate || "?"}`;

        return {
          ...agent,
          status: latency > 5000 ? "warning" : "online",
          latency,
          detail,
          lastPing: new Date().toISOString(),
        };
      } catch (err) {
        return {
          ...agent,
          status: "offline",
          latency: Date.now() - start,
          detail: err.message,
          lastPing: new Date().toISOString(),
        };
      }
    }

    // Firebase RTDB — real connectivity test
    if (agent.id === "firebase_rtdb") {
      try {
        if (!firebaseDB || !firebaseDB.isReady?.()) {
          return {
            ...agent,
            status: "offline",
            detail: "Firebase not initialized",
            lastPing: new Date().toISOString(),
          };
        }
        // Write a heartbeat timestamp and read it back
        const now = new Date().toISOString();
        await firebaseDB.set("heartbeat/lastCheck", now);
        const readBack = await firebaseDB.get("heartbeat/lastCheck");
        const latency = Date.now() - start;
        return {
          ...agent,
          status: readBack
            ? latency > 3000
              ? "warning"
              : "online"
            : "offline",
          latency,
          detail: readBack
            ? `round-trip: ${latency}ms`
            : "write OK, read failed",
          lastPing: now,
        };
      } catch (err) {
        return {
          ...agent,
          status: "offline",
          latency: Date.now() - start,
          detail: err.message?.slice(0, 60) || "RTDB error",
          lastPing: new Date().toISOString(),
        };
      }
    }

    // Rust Agent — offline until detected
    if (agent.id === "rust_agent") {
      return {
        ...agent,
        status: "offline",
        detail: "not installed",
        lastPing: new Date().toISOString(),
      };
    }

    // Stripe — will be wired when Stripe SDK loads
    if (agent.id === "stripe") {
      return {
        ...agent,
        status: "unknown",
        detail: "wire in Sprint 1C",
        lastPing: new Date().toISOString(),
      };
    }

    return agent;
  }, []);

  const runHeartbeat = useCallback(async () => {
    setIsChecking(true);

    const results = await Promise.all(agents.map((a) => pingAgent(a)));
    setAgents(results);
    setLastCheck(new Date().toISOString());

    // Generate alerts
    const newAlerts = [];
    results.forEach((a) => {
      if (a.status === "offline") {
        newAlerts.push({
          type: "error",
          agent: a.id,
          message: `⚠️ ${a.name} is OFFLINE`,
        });
      }
      if (a.status === "warning") {
        newAlerts.push({
          type: "warning",
          agent: a.id,
          message: `🟡 ${a.name}: slow response`,
        });
      }
    });

    const onlineCount = results.filter((a) => a.status === "online").length;
    if (onlineCount === results.length) {
      newAlerts.push({
        type: "success",
        message: "✅ All systems operational",
      });
    }

    setAlerts(newAlerts);
    setIsChecking(false);
  }, [agents, pingAgent]);

  // Auto-run on interval
  useEffect(() => {
    if (!enabled) return;

    // Initial check
    runHeartbeat();

    // Set interval
    timerRef.current = setInterval(runHeartbeat, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, interval]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    agents,
    isChecking,
    lastCheck,
    alerts,
    refresh: runHeartbeat,
  };
}

export default useHeartbeat;
