import React, { useState } from "react";
import { useHealthStatus } from "../hooks/useHealthStatus";
import { useFounderMetrics } from "../hooks/useFounderMetrics";
import { useHeartbeat } from "../hooks/useHeartbeat";
import { PanicButton } from "./PFPanicButton";
import { FinancePanel } from "./PFFinancePanel";
import { PandaDefendDashboard } from "./PFDefendDashboard";
import { PFLiveFlowMonitor } from "./PFLiveFlowMonitor";
import PFDiagnosticDashboard from "./PFDiagnosticDashboard";
import { PATCouncilPanel } from "./PFCouncilPanel";
import "./PFLiveFlowMonitor.css";
import "./PFFounderDashboard.css";

/**
 * FounderDashboard - Exclusive Founder control panel
 * Protected by Ed25519 signature verification
 * v6.7 — Consolidated to 8 tabs (Heartbeat, Flow, Diagnostics merged into Overview)
 */
export function FounderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { health, services, isConnected } = useHealthStatus("admin");
  const { metrics, isLoading } = useFounderMetrics();
  const heartbeat = useHeartbeat({ interval: 300000, enabled: true });

  return (
    <div className="founder-dashboard">
      {/* Header */}
      <header className="founder-header">
        <div className="founder-title">
          <span className="founder-logo">
            <img
              src="./panda-icon.png"
              alt="Panda"
              style={{ width: "48px", height: "48px" }}
            />
          </span>
          <h1>FOUNDER DASHBOARD</h1>
        </div>
        <div className="founder-actions">
          <PanicButton />
          <div className="founder-badge">
            <span className="founder-name">Lucas Valério</span>
            <span className="founder-percent">5%</span>
          </div>
        </div>
      </header>

      {/* Status Summary */}
      <div className="status-summary">
        {services.map((service) => (
          <StatusPill key={service.name} {...service} />
        ))}
        <StatusPill
          name="Users"
          status="connected"
          value={metrics?.users?.total || "..."}
          icon="👥"
        />
      </div>

      {/* Tab Navigation */}
      <nav className="founder-tabs">
        <Tab
          id="overview"
          label="📊 Overview"
          active={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          id="finance"
          label="💰 Finance"
          active={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          id="defend"
          label="🛡️ Defend"
          active={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          id="users"
          label="👥 Users"
          active={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          id="services"
          label="🔧 Services"
          active={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          id="mining"
          label="⛏️ Mining"
          active={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          id="logs"
          label="📜 Logs"
          active={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          id="council"
          label="🏛️ Council"
          active={activeTab}
          onClick={setActiveTab}
        />
      </nav>

      {/* Content */}
      <div className="founder-content">
        {activeTab === "overview" && (
          <OverviewPanel
            metrics={metrics}
            services={services}
            heartbeat={heartbeat}
          />
        )}
        {activeTab === "finance" && <FinancePanel metrics={metrics} />}
        {activeTab === "defend" && <PandaDefendDashboard />}
        {activeTab === "users" && <UsersPanel metrics={metrics} />}
        {activeTab === "services" && <ServicesPanel services={services} />}
        {activeTab === "mining" && <MiningPanel />}
        {activeTab === "logs" && <PFLiveFlowMonitor />}
        {activeTab === "council" && (
          <PATCouncilPanel isOpen={true} embedded={true} />
        )}
      </div>
    </div>
  );
}

/**
 * Status Pill - Individual status indicator
 */
function StatusPill({ name, status, value, icon }) {
  const statusColor = {
    ready: "green",
    connected: "green",
    available: "green",
    degraded: "yellow",
    unavailable: "red",
    error: "red",
  };

  const color = statusColor[status?.toLowerCase()] || "gray";

  return (
    <div className={`status-pill status-${color}`}>
      {icon && <span className="pill-icon">{icon}</span>}
      <span className={`pill-dot dot-${color}`} />
      <span className="pill-name">{name}</span>
      {value && <span className="pill-value">{value}</span>}
    </div>
  );
}

/**
 * Tab Component
 */
function Tab({ id, label, active, onClick }) {
  return (
    <button
      className={`founder-tab ${active === id ? "active" : ""}`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );
}

/**
 * Overview Panel - Main metrics cards
 */
function OverviewPanel({ metrics, services, heartbeat }) {
  const { agents = [], lastCheck, alerts = [] } = heartbeat || {};
  const onlineCount = agents.filter((a) => a.status === "online").length;
  const totalAgents = agents.length;
  const criticalAlerts = alerts.filter((a) => a.level === "critical").length;

  return (
    <div className="overview-panel">
      <div className="metrics-grid">
        <MetricCard
          title="💰 Treasury"
          items={[
            { label: "PC Balance", value: metrics?.treasury?.pc || "..." },
            { label: "PAT Holders", value: metrics?.treasury?.pat || "..." },
            { label: "USD Value", value: metrics?.treasury?.usd || "..." },
          ]}
        />
        <MetricCard
          title="👥 Users"
          items={[
            { label: "Total", value: metrics?.users?.total || "..." },
            { label: "Online", value: metrics?.users?.online || "..." },
            { label: "New (24h)", value: metrics?.users?.newToday || "..." },
          ]}
        />
        <MetricCard
          title="📊 Usage"
          items={[
            { label: "API Calls", value: metrics?.usage?.apiCalls || "..." },
            { label: "MCP Tools", value: metrics?.usage?.mcpCalls || "..." },
            { label: "GPU Hours", value: metrics?.usage?.gpuHours || "..." },
          ]}
        />
        <MetricCard
          title="🔥 Errors"
          items={[
            { label: "24h", value: metrics?.errors?.last24h || "0" },
            { label: "Open", value: metrics?.errors?.open || "0" },
            { label: "Critical", value: metrics?.errors?.critical || "0" },
          ]}
          variant={metrics?.errors?.critical > 0 ? "danger" : "default"}
        />
      </div>

      {/* Services Status */}
      <div className="services-summary">
        <h3>Services Status</h3>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.name} className="service-row">
              <span
                className={`service-dot dot-${service.isHealthy ? "green" : "red"}`}
              />
              <span className="service-name">{service.name}</span>
              <span className="service-status">{service.status}</span>
              {service.latency_ms && (
                <span className="service-latency">{service.latency_ms}ms</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 💓 Heartbeat Summary (embedded from former standalone tab) */}
      <div className="services-summary" style={{ marginTop: "16px" }}>
        <h3>💓 Agent Heartbeat</h3>
        <div className="services-grid">
          <div className="service-row">
            <span
              className={`service-dot dot-${onlineCount === totalAgents ? "green" : onlineCount > 0 ? "yellow" : "red"}`}
            />
            <span className="service-name">Agents Online</span>
            <span className="service-status">
              {onlineCount}/{totalAgents}
            </span>
          </div>
          <div className="service-row">
            <span className="service-dot dot-gray" />
            <span className="service-name">Last Check</span>
            <span className="service-status">
              {lastCheck ? new Date(lastCheck).toLocaleTimeString() : "—"}
            </span>
          </div>
          {criticalAlerts > 0 && (
            <div className="service-row">
              <span className="service-dot dot-red" />
              <span className="service-name">⚠️ Critical Alerts</span>
              <span className="service-status" style={{ color: "#ef4444" }}>
                {criticalAlerts}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🌐 Flow Monitor (embedded compact) */}
      <div className="services-summary" style={{ marginTop: "16px" }}>
        <h3>🌐 Live Flow</h3>
        <PFLiveFlowMonitor compact={true} />
      </div>

      {/* 🩺 Diagnostics (embedded compact) */}
      <div className="services-summary" style={{ marginTop: "16px" }}>
        <h3>🩺 Diagnostics</h3>
        <PFDiagnosticDashboard compact={true} isFounder={true} />
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({ title, items, variant = "default" }) {
  return (
    <div className={`metric-card metric-${variant}`}>
      <h4>{title}</h4>
      <div className="metric-items">
        {items.map((item, i) => (
          <div key={i} className="metric-item">
            <span className="metric-label">{item.label}</span>
            <span className="metric-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Users Panel
 */
function UsersPanel({ metrics }) {
  return (
    <div className="users-panel">
      <h3>User Analytics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{metrics?.users?.total || "..."}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{metrics?.users?.online || "..."}</span>
          <span className="stat-label">Online Now</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{metrics?.users?.premium || "..."}</span>
          <span className="stat-label">Premium</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{metrics?.users?.devs || "..."}</span>
          <span className="stat-label">Developers</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Services Panel
 */
function ServicesPanel({ services }) {
  return (
    <div className="services-panel">
      <h3>Services Detail</h3>
      <table className="services-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th>Latency</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.name}>
              <td>{service.name}</td>
              <td>
                <span
                  className={`status-badge badge-${service.isHealthy ? "green" : "red"}`}
                >
                  {service.status}
                </span>
              </td>
              <td>{service.latency_ms ? `${service.latency_ms}ms` : "-"}</td>
              <td>{service.message || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Mining Panel - Founder-exclusive mining network overview
 * All data is mock — Rust Agent backend not yet implemented
 */
function MiningPanel() {
  // Mock data — will be replaced by Rust Agent API
  const networkStats = {
    activeMiners: 47,
    totalHashrate: "128.4 KH/s",
    pcDistributedToday: 3842,
    pcDistributedMonth: 94120,
    avgUptimePercent: 87,
  };

  const revenueSplit = [
    {
      label: "👤 Users (60%)",
      percent: 60,
      color: "#10b981",
      amount: "2,305 PC",
    },
    {
      label: "🏛️ Impostos BR (18%)",
      percent: 18,
      color: "#ef4444",
      amount: "692 PC",
    },
    {
      label: "⚙️ Ops/Infra (10%)",
      percent: 10,
      color: "#f59e0b",
      amount: "384 PC",
    },
    {
      label: "🔒 Hold Reserve (7%)",
      percent: 7,
      color: "#8b5cf6",
      amount: "269 PC",
    },
    {
      label: "🏦 Treasury (5%)",
      percent: 5,
      color: "#667eea",
      amount: "192 PC",
    },
  ];

  const topMiners = [
    {
      user: "node-alpha-01",
      tier: "🌲 Forest",
      hashrate: "4.2 KH/s",
      earned: "312 PC",
      gpu: "RTX 4080",
    },
    {
      user: "node-beta-07",
      tier: "🌳 Tree",
      hashrate: "2.8 KH/s",
      earned: "198 PC",
      gpu: "RTX 3060",
    },
    {
      user: "node-gamma-12",
      tier: "🌿 Sprout",
      hashrate: "1.1 KH/s",
      earned: "78 PC",
      gpu: "GTX 1660",
    },
    {
      user: "node-delta-03",
      tier: "🌱 Seed",
      hashrate: "0.6 KH/s",
      earned: "42 PC",
      gpu: "—",
    },
    {
      user: "node-epsilon-19",
      tier: "🌳 Tree",
      hashrate: "2.5 KH/s",
      earned: "185 PC",
      gpu: "RTX 3070",
    },
  ];

  const payoutHistory = [
    {
      date: "2026-02-13",
      amount: "3,842 PC",
      cryptoPrice: "$142.30 XMR",
      status: "✅ Pago",
    },
    {
      date: "2026-02-12",
      amount: "4,019 PC",
      cryptoPrice: "$143.80 XMR",
      status: "✅ Pago",
    },
    {
      date: "2026-02-11",
      amount: "3,651 PC",
      cryptoPrice: "$139.50 XMR",
      status: "✅ Pago",
    },
    {
      date: "2026-02-10",
      amount: "3,988 PC",
      cryptoPrice: "$141.20 XMR",
      status: "✅ Pago",
    },
    {
      date: "2026-02-09",
      amount: "3,724 PC",
      cryptoPrice: "$140.60 XMR",
      status: "✅ Pago",
    },
  ];

  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "16px",
  };

  const statBoxStyle = {
    textAlign: "center",
    padding: "16px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
    flex: 1,
    minWidth: "140px",
  };

  return (
    <div className="mining-panel">
      <h3>⛏️ Mining Network — Founder View</h3>

      {/* ── Network Stats ── */}
      <div style={cardStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "12px",
            color: "#f59e0b",
          }}
        >
          📊 Network Stats
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "24px", fontWeight: 700, color: "#10b981" }}
            >
              {networkStats.activeMiners}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
              Mineradores Ativos
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#f59e0b",
                fontFamily: "monospace",
              }}
            >
              {networkStats.totalHashrate}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
              Hashrate Total
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "24px", fontWeight: 700, color: "#667eea" }}
            >
              {networkStats.pcDistributedToday.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
              PC Distribuído Hoje
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "24px", fontWeight: 700, color: "#8b5cf6" }}
            >
              {networkStats.pcDistributedMonth.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
              PC Distribuído (Mês)
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "24px", fontWeight: 700, color: "#10b981" }}
            >
              {networkStats.avgUptimePercent}%
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
              Uptime Médio
            </div>
          </div>
        </div>
      </div>

      {/* ── Revenue Split ── */}
      <div style={cardStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "12px",
            color: "#f59e0b",
          }}
        >
          💰 Revenue Split (x0.60)
        </div>
        {/* Visual bar */}
        <div
          style={{
            display: "flex",
            height: "28px",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "12px",
          }}
        >
          {revenueSplit.map((s, i) => (
            <div
              key={i}
              style={{
                width: `${s.percent}%`,
                background: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {s.percent}%
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
          {revenueSplit.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: s.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ opacity: 0.8 }}>{s.label}</span>
              <span style={{ fontWeight: 600 }}>{s.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Miners ── */}
      <div style={cardStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "12px",
            color: "#f59e0b",
          }}
        >
          🏆 Top Miners Hoje
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                textAlign: "left",
              }}
            >
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Node
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Tier
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                GPU
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Hashrate
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Earned
              </th>
            </tr>
          </thead>
          <tbody>
            {topMiners.map((m, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td
                  style={{
                    padding: "8px 12px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                >
                  {m.user}
                </td>
                <td style={{ padding: "8px 12px" }}>{m.tier}</td>
                <td style={{ padding: "8px 12px", opacity: 0.7 }}>{m.gpu}</td>
                <td
                  style={{
                    padding: "8px 12px",
                    fontFamily: "monospace",
                    fontWeight: 600,
                  }}
                >
                  {m.hashrate}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    fontWeight: 600,
                    color: "#f59e0b",
                  }}
                >
                  {m.earned}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Payout History ── */}
      <div style={cardStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "12px",
            color: "#f59e0b",
          }}
        >
          📋 Payout History
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                textAlign: "left",
              }}
            >
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Data
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Total
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Preço Cripto
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {payoutHistory.map((p, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>
                  {p.date}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    fontWeight: 600,
                    color: "#10b981",
                  }}
                >
                  {p.amount}
                </td>
                <td style={{ padding: "8px 12px", opacity: 0.7 }}>
                  {p.cryptoPrice}
                </td>
                <td style={{ padding: "8px 12px" }}>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Oracle Status ── */}
      <div style={cardStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "12px",
            color: "#f59e0b",
          }}
        >
          🔮 Panda Oracle Status
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "11px", opacity: 0.5, marginBottom: "4px" }}
            >
              XMR Spot
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              $142.30
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "11px", opacity: 0.5, marginBottom: "4px" }}
            >
              ETH Spot
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              $2,847
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "11px", opacity: 0.5, marginBottom: "4px" }}
            >
              Fator Conversão
            </div>
            <div
              style={{ fontSize: "18px", fontWeight: 700, color: "#f59e0b" }}
            >
              x0.60
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "11px", opacity: 0.5, marginBottom: "4px" }}
            >
              Hold Reserve
            </div>
            <div
              style={{ fontSize: "18px", fontWeight: 700, color: "#8b5cf6" }}
            >
              7.2%
            </div>
          </div>
          <div style={statBoxStyle}>
            <div
              style={{ fontSize: "11px", opacity: 0.5, marginBottom: "4px" }}
            >
              Último Payout
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              23:59 UTC
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: "11px",
          opacity: 0.4,
          marginTop: "8px",
          textAlign: "center",
        }}
      >
        ⚠️ Dados simulados — Rust Agent backend não implementado. Dashboard
        demonstra a UI planejada.
      </div>
    </div>
  );
}

/**
 * 💓 Heartbeat Panel — Real-time agent health monitor
 * Reads from useHeartbeat hook (5 min auto-refresh)
 */
function HeartbeatPanel({ heartbeat }) {
  const { agents, isChecking, lastCheck, alerts, refresh } = heartbeat;

  const statusColors = {
    online: "#10b981",
    offline: "#ef4444",
    warning: "#f59e0b",
    unknown: "#64748b",
  };

  const statusDots = {
    online: "🟢",
    offline: "🔴",
    warning: "🟡",
    unknown: "⚪",
  };

  const formatAgo = (isoStr) => {
    if (!isoStr) return "—";
    const diff = Date.now() - new Date(isoStr).getTime();
    if (diff < 60000) return `${Math.round(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
    return `${Math.round(diff / 3600000)}h ago`;
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "16px",
  };

  return (
    <div className="heartbeat-panel">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>💓 Agent Heartbeat — 5 min interval</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {lastCheck && (
            <span style={{ fontSize: "11px", opacity: 0.5 }}>
              Last: {formatAgo(lastCheck)}
            </span>
          )}
          <button
            onClick={refresh}
            disabled={isChecking}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {isChecking ? "⏳ Checking..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Agent Table */}
      <div style={cardStyle}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                textAlign: "left",
              }}
            >
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Agent
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Status
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Last Ping
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Latency
              </th>
              <th
                style={{ padding: "8px 12px", fontWeight: 600, opacity: 0.6 }}
              >
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td style={{ padding: "8px 12px" }}>
                  <span style={{ marginRight: "8px" }}>{agent.icon}</span>
                  {agent.name}
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "2px 10px",
                      borderRadius: "12px",
                      background: `${statusColors[agent.status]}22`,
                      color: statusColors[agent.status],
                      fontWeight: 600,
                      fontSize: "12px",
                    }}
                  >
                    {statusDots[agent.status]} {agent.status.toUpperCase()}
                  </span>
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  {formatAgo(agent.lastPing)}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                >
                  {agent.latency ? `${agent.latency}ms` : "—"}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  {agent.detail || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alerts */}
      <div style={cardStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "8px",
            color: "#f59e0b",
          }}
        >
          🔔 Alerts
        </div>
        {alerts.length === 0 ? (
          <div style={{ opacity: 0.5, fontSize: "13px" }}>No alerts</div>
        ) : (
          alerts.map((alert, i) => (
            <div
              key={i}
              style={{
                padding: "6px 0",
                fontSize: "13px",
                color:
                  alert.type === "error"
                    ? "#ef4444"
                    : alert.type === "warning"
                      ? "#f59e0b"
                      : "#10b981",
              }}
            >
              {alert.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Logs Panel (placeholder)
 */
function LogsPanel() {
  return (
    <div className="logs-panel">
      <h3>System Logs</h3>
      <div className="logs-placeholder">
        <p>📜 Real-time logs will appear here</p>
        <p>Connected to Firebase RTDB</p>
      </div>
    </div>
  );
}

export default FounderDashboard;
