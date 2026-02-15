import React, { useState, useEffect, useCallback } from "react";
import "./PFDefendDashboard.css";

/**
 * 🛡️ Panda Defend Dashboard
 *
 * Security monitoring and plugin approval system.
 * Integrates with 11 security rules (R1-R11) defined in PF_MASTER_ARCHITECTURE.md §26.6
 *
 * Features:
 * - Real-time security metrics
 * - Plugin approval queue
 * - Alert management
 * - Kill Switch / Suspend / Force Approve controls
 */
export function PandaDefendDashboard({ isPopout = false }) {
  const [activeView, setActiveView] = useState("overview");
  const [queue, setQueue] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    suspended: 0,
    totalScans: 0,
    avgScore: 0,
  });

  // Mock data - will be replaced with real API
  useEffect(() => {
    // Mock queue
    setQueue([
      {
        id: "plugin-abc-123",
        name: "AI Chat Enhancer",
        author: "dev@example.com",
        version: "1.2.0",
        score: 72,
        status: "pending",
        violations: [],
        warnings: ["fetch() para URL externa não declarada"],
        submittedAt: new Date(Date.now() - 3600000),
      },
      {
        id: "plugin-xyz-456",
        name: "Code Formatter Pro",
        author: "coder@panda.com",
        version: "2.0.1",
        score: 45,
        status: "review",
        violations: ["eval() com input dinâmico detectado"],
        warnings: ["Math.random() usado para token"],
        submittedAt: new Date(Date.now() - 7200000),
      },
      {
        id: "plugin-def-789",
        name: "Theme Switcher",
        author: "design@panda.com",
        version: "1.0.0",
        score: 95,
        status: "approved",
        violations: [],
        warnings: [],
        submittedAt: new Date(Date.now() - 86400000),
      },
    ]);

    // Mock alerts
    setAlerts([
      {
        id: 1,
        level: "critical",
        rule: "R1",
        msg: "plugin-xyz: eval() dinâmico bloqueado",
        time: new Date(),
        dismissed: false,
      },
      {
        id: 2,
        level: "warning",
        rule: "R5",
        msg: "plugin-abc: fetch() não declarado",
        time: new Date(Date.now() - 1800000),
        dismissed: false,
      },
      {
        id: 3,
        level: "info",
        rule: "R10",
        msg: "plugin-def: Nenhum secret hardcoded ✓",
        time: new Date(Date.now() - 3600000),
        dismissed: true,
      },
    ]);

    // Mock stats
    setStats({
      approved: 234,
      pending: 3,
      rejected: 12,
      suspended: 2,
      totalScans: 1456,
      avgScore: 78,
    });
  }, []);

  // Security Rules Reference
  const securityRules = [
    {
      id: "R1",
      name: "Dynamic eval",
      severity: "critical",
      desc: "eval(), Function() com input dinâmico",
    },
    {
      id: "R2",
      name: "document.write",
      severity: "critical",
      desc: "HTML injection via document.write",
    },
    {
      id: "R3",
      name: "Unsafe innerHTML",
      severity: "critical",
      desc: "innerHTML com variáveis não sanitizadas",
    },
    {
      id: "R4",
      name: "Cross-origin storage",
      severity: "critical",
      desc: "Acesso a localStorage de outros domínios",
    },
    {
      id: "R5",
      name: "Undeclared fetch",
      severity: "warning",
      desc: "fetch() para domínios não declarados",
    },
    {
      id: "R6",
      name: "Frame access",
      severity: "critical",
      desc: "window.parent/opener access",
    },
    {
      id: "R7",
      name: "Crypto mining",
      severity: "critical",
      desc: "WebAssembly mining patterns",
    },
    {
      id: "R8",
      name: "Obfuscation",
      severity: "critical",
      desc: "Código com entropy > 6.5",
    },
    {
      id: "R9",
      name: "Prototype pollution",
      severity: "critical",
      desc: "__proto__, constructor.prototype",
    },
    {
      id: "R10",
      name: "Hardcoded secrets",
      severity: "critical",
      desc: "API keys, tokens no código",
    },
    {
      id: "R11",
      name: "Insecure crypto",
      severity: "warning",
      desc: "Math.random() para segurança",
    },
  ];

  // Actions
  const handleApprove = (pluginId) => {
    setQueue(
      queue.map((p) => (p.id === pluginId ? { ...p, status: "approved" } : p)),
    );
    console.log("✅ APPROVED:", pluginId);
  };

  const handleReject = (pluginId) => {
    setQueue(
      queue.map((p) => (p.id === pluginId ? { ...p, status: "rejected" } : p)),
    );
    console.log("❌ REJECTED:", pluginId);
  };

  const handleSuspend = (pluginId) => {
    setQueue(
      queue.map((p) => (p.id === pluginId ? { ...p, status: "suspended" } : p)),
    );
    console.log("⏸️ SUSPENDED:", pluginId);
  };

  const handleKillSwitch = () => {
    if (
      confirm(
        "🚨 KILL SWITCH: Isso irá suspender TODOS os plugins não-core. Confirmar?",
      )
    ) {
      console.log("🔴 KILL SWITCH ATIVADO");
      // TODO: API call to suspend all plugins
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(
      alerts.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)),
    );
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "good";
    if (score >= 50) return "warning";
    return "bad";
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { icon: "✅", class: "success" },
      pending: { icon: "⏳", class: "pending" },
      review: { icon: "👁️", class: "review" },
      rejected: { icon: "❌", class: "danger" },
      suspended: { icon: "⏸️", class: "warning" },
    };
    return badges[status] || badges.pending;
  };

  const formatTime = (date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "agora";
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  return (
    <div className={`panda-defend ${isPopout ? "popout" : ""}`}>
      {/* Header */}
      <header className="defend-header">
        <h2>🛡️ Panda Defend</h2>
        <div className="defend-header-actions">
          <button
            className="btn-refresh"
            onClick={() => window.location.reload()}
          >
            🔄
          </button>
          <span className="status-indicator online">ONLINE</span>
        </div>
      </header>

      {/* Navigation */}
      <nav className="defend-nav">
        <button
          className={`nav-btn ${activeView === "overview" ? "active" : ""}`}
          onClick={() => setActiveView("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`nav-btn ${activeView === "queue" ? "active" : ""}`}
          onClick={() => setActiveView("queue")}
        >
          📋 Queue (
          {
            queue.filter((p) => p.status === "pending" || p.status === "review")
              .length
          }
          )
        </button>
        <button
          className={`nav-btn ${activeView === "alerts" ? "active" : ""}`}
          onClick={() => setActiveView("alerts")}
        >
          🚨 Alerts ({alerts.filter((a) => !a.dismissed).length})
        </button>
        <button
          className={`nav-btn ${activeView === "rules" ? "active" : ""}`}
          onClick={() => setActiveView("rules")}
        >
          📜 Rules
        </button>
        <button
          className={`nav-btn ${activeView === "controls" ? "active" : ""}`}
          onClick={() => setActiveView("controls")}
        >
          ⚙️ Controls
        </button>
      </nav>

      {/* Content */}
      <main className="defend-content">
        {/* OVERVIEW */}
        {activeView === "overview" && (
          <div className="view-overview">
            <div className="stats-grid">
              <div className="stat-card good">
                <span className="stat-value">{stats.approved}</span>
                <span className="stat-label">Aprovados</span>
              </div>
              <div className="stat-card pending">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">Pendentes</span>
              </div>
              <div className="stat-card danger">
                <span className="stat-value">{stats.rejected}</span>
                <span className="stat-label">Rejeitados</span>
              </div>
              <div className="stat-card warning">
                <span className="stat-value">{stats.suspended}</span>
                <span className="stat-label">Suspensos</span>
              </div>
            </div>

            <div className="metrics-row">
              <div className="metric-box">
                <span className="metric-label">Total Scans</span>
                <span className="metric-value">
                  {stats.totalScans.toLocaleString()}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Score Médio</span>
                <span
                  className={`metric-value ${getScoreColor(stats.avgScore)}`}
                >
                  {stats.avgScore}/100
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Regras Ativas</span>
                <span className="metric-value">{securityRules.length}</span>
              </div>
            </div>

            <h3>Alertas Recentes</h3>
            <div className="alerts-preview">
              {alerts
                .filter((a) => !a.dismissed)
                .slice(0, 3)
                .map((alert) => (
                  <div key={alert.id} className={`alert-item ${alert.level}`}>
                    <span className="alert-rule">{alert.rule}</span>
                    <span className="alert-msg">{alert.msg}</span>
                    <span className="alert-time">{formatTime(alert.time)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* QUEUE */}
        {activeView === "queue" && (
          <div className="view-queue">
            <h3>Plugin Approval Queue</h3>
            <div className="queue-list">
              {queue.map((plugin) => (
                <div key={plugin.id} className={`queue-item ${plugin.status}`}>
                  <div className="queue-header">
                    <span className="plugin-name">{plugin.name}</span>
                    <span
                      className={`score-badge ${getScoreColor(plugin.score)}`}
                    >
                      {plugin.score}/100
                    </span>
                  </div>
                  <div className="queue-meta">
                    <span>v{plugin.version}</span>
                    <span>•</span>
                    <span>{plugin.author}</span>
                    <span>•</span>
                    <span>{formatTime(plugin.submittedAt)}</span>
                  </div>

                  {plugin.violations.length > 0 && (
                    <div className="violations">
                      <strong>🚨 Violações:</strong>
                      {plugin.violations.map((v, i) => (
                        <span key={i} className="violation">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {plugin.warnings.length > 0 && (
                    <div className="warnings">
                      <strong>⚠️ Avisos:</strong>
                      {plugin.warnings.map((w, i) => (
                        <span key={i} className="warning">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="queue-actions">
                    <span
                      className={`status-badge ${getStatusBadge(plugin.status).class}`}
                    >
                      {getStatusBadge(plugin.status).icon}{" "}
                      {plugin.status.toUpperCase()}
                    </span>
                    {(plugin.status === "pending" ||
                      plugin.status === "review") && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(plugin.id)}
                        >
                          ✅ Aprovar
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(plugin.id)}
                        >
                          ❌ Rejeitar
                        </button>
                        <button
                          className="btn-suspend"
                          onClick={() => handleSuspend(plugin.id)}
                        >
                          ⏸️ Suspender
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTS */}
        {activeView === "alerts" && (
          <div className="view-alerts">
            <h3>Security Alerts</h3>
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`alert-card ${alert.level} ${alert.dismissed ? "dismissed" : ""}`}
                >
                  <div className="alert-header">
                    <span className={`level-badge ${alert.level}`}>
                      {alert.level === "critical"
                        ? "🔴"
                        : alert.level === "warning"
                          ? "🟡"
                          : "🟢"}
                      {alert.level.toUpperCase()}
                    </span>
                    <span className="alert-rule-badge">{alert.rule}</span>
                    <span className="alert-time">{formatTime(alert.time)}</span>
                  </div>
                  <p className="alert-message">{alert.msg}</p>
                  {!alert.dismissed && (
                    <button
                      className="btn-dismiss"
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      Dispensar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RULES */}
        {activeView === "rules" && (
          <div className="view-rules">
            <h3>11 Security Rules (Panda Defend)</h3>
            <div className="rules-list">
              {securityRules.map((rule) => (
                <div key={rule.id} className={`rule-card ${rule.severity}`}>
                  <div className="rule-header">
                    <span className="rule-id">{rule.id}</span>
                    <span className="rule-name">{rule.name}</span>
                    <span className={`severity-badge ${rule.severity}`}>
                      {rule.severity === "critical" ? "🔴" : "🟡"}
                    </span>
                  </div>
                  <p className="rule-desc">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTROLS */}
        {activeView === "controls" && (
          <div className="view-controls">
            <h3>Founder Controls</h3>

            <div className="control-section danger-zone">
              <h4>⚠️ Danger Zone</h4>
              <button className="btn-kill" onClick={handleKillSwitch}>
                🔴 KILL SWITCH - Suspender Todos
              </button>
              <p className="control-desc">
                Suspende imediatamente todos os plugins não-core. Requer
                reaprovação manual.
              </p>
            </div>

            <div className="control-section">
              <h4>🔧 Configurações</h4>
              <label className="control-item">
                <input type="checkbox" defaultChecked /> Auto-approve score ≥70
              </label>
              <label className="control-item">
                <input type="checkbox" defaultChecked /> Auto-reject score
                &lt;50
              </label>
              <label className="control-item">
                <input type="checkbox" /> Modo paranóico (review manual p/
                todos)
              </label>
            </div>

            <div className="control-section">
              <h4>📤 Exportar</h4>
              <button className="btn-export">📊 Exportar Relatório CSV</button>
              <button className="btn-export">📋 Exportar Queue JSON</button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="defend-footer">
        <span>Panda Defend v1.0 - 11 Rules Active</span>
        <span>Last scan: {new Date().toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}

export default PandaDefendDashboard;
