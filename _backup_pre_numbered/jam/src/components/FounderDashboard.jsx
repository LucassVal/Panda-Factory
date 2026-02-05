import React, { useState } from "react";
import { useHealthStatus } from "../hooks/useHealthStatus";
import { useFounderMetrics } from "../hooks/useFounderMetrics";
import { PanicButton } from "./PanicButton";
import { FinancePanel } from "./FinancePanel";
import { PandaDefendDashboard } from "./PandaDefendDashboard";
import "./FounderDashboard.css";

/**
 * FounderDashboard - Exclusive Founder control panel
 * Protected by Ed25519 signature verification
 */
export function FounderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { health, services, isConnected } = useHealthStatus("admin");
  const { metrics, isLoading } = useFounderMetrics();

  return (
    <div className="founder-dashboard">
      {/* Header */}
      <header className="founder-header">
        <div className="founder-title">
          <span className="founder-logo">🐼</span>
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
          id="logs"
          label="📜 Logs"
          active={activeTab}
          onClick={setActiveTab}
        />
      </nav>

      {/* Content */}
      <div className="founder-content">
        {activeTab === "overview" && (
          <OverviewPanel metrics={metrics} services={services} />
        )}
        {activeTab === "finance" && <FinancePanel metrics={metrics} />}
        {activeTab === "defend" && <PandaDefendDashboard />}
        {activeTab === "users" && <UsersPanel metrics={metrics} />}
        {activeTab === "services" && <ServicesPanel services={services} />}
        {activeTab === "logs" && <LogsPanel />}
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
function OverviewPanel({ metrics, services }) {
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
