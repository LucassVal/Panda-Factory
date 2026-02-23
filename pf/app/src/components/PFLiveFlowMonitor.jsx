import React, { useState, useEffect, useCallback } from "react";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByKey,
  limitToLast,
} from "firebase/database";

/**
 * 🌐 PFLiveFlowMonitor — Real-time service flow diagram + live logs
 * TICKET-17: Founder Live Monitor
 *
 * Reads from:
 *   /system/heartbeat (service statuses)
 *   /system/logs      (live action logs)
 */

const SERVICE_NODES = [
  { id: "firebase", label: "Firebase Auth", icon: "🔐", x: 0, y: 0 },
  { id: "gas", label: "GAS Endpoint", icon: "⚡", x: 1, y: 0 },
  { id: "gemini", label: "Gemini API", icon: "🧠", x: 2, y: 0 },
  { id: "rtdb", label: "RTDB", icon: "🗄️", x: 0, y: 1 },
  { id: "kiwify", label: "Kiwify Hook", icon: "🛒", x: 1, y: 1 },
  { id: "stripe", label: "Stripe", icon: "💳", x: 2, y: 1 },
  { id: "hotmart", label: "Hotmart Hook", icon: "📦", x: 1, y: 2 },
];

const CONNECTIONS = [
  ["firebase", "gas"],
  ["gas", "gemini"],
  ["firebase", "rtdb"],
  ["gas", "kiwify"],
  ["kiwify", "stripe"],
  ["gas", "hotmart"],
];

const STATUS_COLORS = {
  ok: "#00ff88",
  stale: "#ffaa00",
  degraded: "#ffaa00",
  error: "#ff3366",
  critical: "#ff3366",
  unknown: "#666",
};

const STATUS_EMOJI = {
  ok: "🟢",
  stale: "🟡",
  degraded: "🟡",
  error: "🔴",
  critical: "🔴",
  unknown: "⚪",
};

function StatusNode({ node, status, latency }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.unknown;
  const emoji = STATUS_EMOJI[status] || "⚪";

  return (
    <div
      className="flow-node"
      style={{
        gridColumn: node.x + 1,
        gridRow: node.y + 1,
        borderColor: color,
        boxShadow:
          status === "ok" ? `0 0 12px ${color}33` : `0 0 8px ${color}55`,
      }}
    >
      <div className="flow-node-header">
        <span className="flow-node-icon">{node.icon}</span>
        <span className="flow-node-status">{emoji}</span>
      </div>
      <div className="flow-node-label">{node.label}</div>
      {latency != null && (
        <div className="flow-node-latency" style={{ color }}>
          {latency}ms
        </div>
      )}
    </div>
  );
}

function LiveLogEntry({ entry }) {
  const statusIcon =
    entry.status === "ok" || entry.status === "received"
      ? "✅"
      : entry.status === "error"
        ? "❌"
        : "⚠️";
  const time = entry.timestamp
    ? new Date(entry.timestamp).toLocaleTimeString("pt-BR")
    : "—";

  return (
    <div className="log-entry">
      <span className="log-time">{time}</span>
      <span className="log-icon">{statusIcon}</span>
      <span className="log-action">{entry.action}</span>
      {entry.latency_ms > 0 && (
        <span className="log-latency">{entry.latency_ms}ms</span>
      )}
    </div>
  );
}

export function PFLiveFlowMonitor() {
  const [heartbeat, setHeartbeat] = useState(null);
  const [logs, setLogs] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Subscribe to heartbeat
  useEffect(() => {
    try {
      const db = getDatabase();
      const heartbeatRef = ref(db, "/system/heartbeat");

      const unsub = onValue(heartbeatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setHeartbeat(data);
          setLastUpdate(new Date());
        }
      });

      return () => unsub();
    } catch (e) {
      console.warn("[LiveFlowMonitor] Firebase not available:", e.message);
    }
  }, []);

  // Subscribe to logs (last 50)
  useEffect(() => {
    try {
      const db = getDatabase();
      const logsRef = query(
        ref(db, "/system/logs"),
        orderByKey(),
        limitToLast(50),
      );

      const unsub = onValue(logsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const entries = Object.entries(data)
            .map(([key, val]) => ({ id: key, ...val }))
            .reverse();
          setLogs(entries);
        }
      });

      return () => unsub();
    } catch (e) {
      console.warn("[LiveFlowMonitor] Firebase logs not available:", e.message);
    }
  }, []);

  const services = heartbeat?.services || {};
  const overall = heartbeat?.overall || "unknown";
  const overallColor = STATUS_COLORS[overall] || STATUS_COLORS.unknown;

  return (
    <div className="live-flow-monitor">
      {/* Overall Status Banner */}
      <div className="flow-overall" style={{ borderColor: overallColor }}>
        <span className="flow-overall-emoji">{STATUS_EMOJI[overall]}</span>
        <span className="flow-overall-text">
          Sistema:{" "}
          <strong style={{ color: overallColor }}>
            {overall.toUpperCase()}
          </strong>
        </span>
        {lastUpdate && (
          <span className="flow-overall-time">
            Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
          </span>
        )}
      </div>

      {/* Flow Diagram */}
      <div className="flow-diagram">
        {SERVICE_NODES.map((node) => {
          const svc = services[node.id] || services.firebase; // firebase fallback for rtdb
          return (
            <StatusNode
              key={node.id}
              node={node}
              status={svc?.status || "unknown"}
              latency={svc?.latency_ms}
            />
          );
        })}
      </div>

      {/* Live Logs */}
      <div className="flow-logs-section">
        <h3 className="flow-logs-title">📜 Logs ao Vivo ({logs.length})</h3>
        <div className="flow-logs-list">
          {logs.length === 0 ? (
            <div className="flow-logs-empty">
              Nenhum log ainda. Os logs aparecem quando o GAS processa requests.
            </div>
          ) : (
            logs.map((entry) => <LiveLogEntry key={entry.id} entry={entry} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default PFLiveFlowMonitor;
