import React, { useState, useEffect, useCallback } from "react";
import { useFounderMetrics } from "../hooks/useFounderMetrics";
import "./PFFounderPopout.css";

/**
 * 🏭 Founder Dashboard Pop-Out
 *
 * Janela independente que pode ser arrastada para outro monitor.
 * Herda sessão do Panda (Ed25519 já validado).
 *
 * @see PF_MASTER_ARCHITECTURE.md §26.4
 */
export function FounderDashboardPopout() {
  const { metrics, loading, error, refresh } = useFounderMetrics();
  const [activeTab, setActiveTab] = useState("overview");
  const [realtimeFeed, setRealtimeFeed] = useState([]);

  // Mock realtime feed (replace with SSE/WebSocket)
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        type: "purchase",
        msg: "Plugin X vendido por 50 PC",
        time: new Date(),
      },
      {
        id: 2,
        type: "info",
        msg: "Re-scan concluído: 234 plugins OK",
        time: new Date(),
      },
    ];
    setRealtimeFeed(mockEvents);
  }, []);

  const tabs = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "treasury", icon: "🏦", label: "Treasury" },
    { id: "store", icon: "📦", label: "Store" },
    { id: "realtime", icon: "🔥", label: "Realtime" },
    { id: "defend", icon: "🛡️", label: "Defend" },
    { id: "controls", icon: "⚙️", label: "Controls" },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  const handleKillSwitch = () => {
    if (
      confirm("⚠️ KILL SWITCH: Isso irá pausar TODAS as operações. Confirmar?")
    ) {
      console.log("🔴 KILL SWITCH ATIVADO");
      // TODO: Implement kill switch API
    }
  };

  const handleBroadcast = () => {
    const msg = prompt("Mensagem para todos os usuários:");
    if (msg) {
      console.log("📢 BROADCAST:", msg);
      // TODO: Implement broadcast API
    }
  };

  return (
    <div className="founder-popout">
      {/* Header */}
      <header className="popout-header">
        <div className="popout-title">
          <span className="popout-icon">🏭</span>
          <h1>Founder Dashboard</h1>
        </div>
        <div className="popout-actions">
          <button onClick={refresh} className="btn-refresh" title="Atualizar">
            🔄
          </button>
          <span className="status-dot online"></span>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="popout-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="popout-content">
        {loading && <div className="loading">Carregando...</div>}
        {error && <div className="error">Erro: {error}</div>}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="tab-panel overview">
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-icon">👥</span>
                <span className="metric-value">
                  {formatNumber(metrics?.users?.total || 1234)}
                </span>
                <span className="metric-label">Users Total</span>
              </div>
              <div className="metric-card">
                <span className="metric-icon">📈</span>
                <span className="metric-value">
                  {formatNumber(metrics?.users?.dau || 89)}
                </span>
                <span className="metric-label">DAU</span>
              </div>
              <div className="metric-card">
                <span className="metric-icon">💰</span>
                <span className="metric-value">
                  {formatNumber(metrics?.pc?.circulating || 50000)}
                </span>
                <span className="metric-label">PC Circulante</span>
              </div>
              <div className="metric-card highlight">
                <span className="metric-icon">💵</span>
                <span className="metric-value">
                  ${formatNumber(metrics?.revenue?.month || 1250)}
                </span>
                <span className="metric-label">Revenue (30d)</span>
              </div>
            </div>
          </div>
        )}

        {/* TREASURY TAB */}
        {activeTab === "treasury" && (
          <div className="tab-panel treasury">
            <div className="treasury-header">
              <h2>🏦 Treasury Status</h2>
              <div className="health-score">
                <span className="score-value">92%</span>
                <span className="score-label">Health Score</span>
              </div>
            </div>
            <div className="treasury-breakdown">
              <div className="treasury-item">
                <span className="item-icon">🟡</span>
                <span className="item-label">PAXG (Ouro)</span>
                <span className="item-value">$3,500</span>
                <span className="item-percent">35%</span>
              </div>
              <div className="treasury-item">
                <span className="item-icon">🟢</span>
                <span className="item-label">USDC (Stable)</span>
                <span className="item-value">$4,500</span>
                <span className="item-percent">45%</span>
              </div>
              <div className="treasury-item">
                <span className="item-icon">🔵</span>
                <span className="item-label">Ops Fund</span>
                <span className="item-value">$2,000</span>
                <span className="item-percent">20%</span>
              </div>
            </div>
            <div className="runway-info">
              <span className="runway-label">Runway:</span>
              <span className="runway-value">18 meses</span>
            </div>
          </div>
        )}

        {/* STORE TAB */}
        {activeTab === "store" && (
          <div className="tab-panel store">
            <div className="store-stats">
              <div className="stat-item">
                <span className="stat-value">234</span>
                <span className="stat-label">Plugins</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">12</span>
                <span className="stat-label">Vendas Hoje</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">89</span>
                <span className="stat-label">Vendas Semana</span>
              </div>
            </div>
            <h3>Top Sellers</h3>
            <div className="top-sellers">
              <div className="seller-item">
                <span className="rank">#1</span>
                <span className="name">AI Image Generator</span>
                <span className="sales">45 vendas</span>
              </div>
              <div className="seller-item">
                <span className="rank">#2</span>
                <span className="name">Code Formatter Pro</span>
                <span className="sales">32 vendas</span>
              </div>
              <div className="seller-item">
                <span className="rank">#3</span>
                <span className="name">Doc Translator</span>
                <span className="sales">28 vendas</span>
              </div>
            </div>
          </div>
        )}

        {/* REALTIME TAB */}
        {activeTab === "realtime" && (
          <div className="tab-panel realtime">
            <h2>🔥 Live Feed</h2>
            <div className="feed-list">
              {realtimeFeed.map((event) => (
                <div key={event.id} className={`feed-item ${event.type}`}>
                  <span className="feed-type">
                    {event.type === "purchase"
                      ? "💰"
                      : event.type === "error"
                        ? "🚨"
                        : "ℹ️"}
                  </span>
                  <span className="feed-msg">{event.msg}</span>
                  <span className="feed-time">
                    {event.time.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEFEND TAB */}
        {activeTab === "defend" && (
          <div className="tab-panel defend">
            <h2>🛡️ Panda Defend</h2>
            <div className="defend-metrics">
              <div className="defend-stat">
                <span className="stat-value good">12</span>
                <span className="stat-label">Aprovados Hoje</span>
              </div>
              <div className="defend-stat">
                <span className="stat-value warning">1</span>
                <span className="stat-label">Pendentes</span>
              </div>
              <div className="defend-stat">
                <span className="stat-value bad">2</span>
                <span className="stat-label">Rejeitados</span>
              </div>
            </div>
            <h3>Alertas Recentes</h3>
            <div className="alerts-list">
              <div className="alert-item critical">
                <span className="alert-icon">🔴</span>
                <span className="alert-msg">
                  plugin-xyz: eval() detectado - BLOQUEADO
                </span>
              </div>
              <div className="alert-item warning">
                <span className="alert-icon">🟡</span>
                <span className="alert-msg">
                  plugin-abc: fetch() não declarado - PENDENTE
                </span>
              </div>
              <div className="alert-item info">
                <span className="alert-icon">🟢</span>
                <span className="alert-msg">
                  plugin-123: Score 85/100 - APROVADO
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CONTROLS TAB */}
        {activeTab === "controls" && (
          <div className="tab-panel controls">
            <h2>⚙️ Founder Controls</h2>
            <div className="control-buttons">
              <button className="control-btn danger" onClick={handleKillSwitch}>
                🔴 Kill Switch
              </button>
              <button className="control-btn warning">🟡 Pause Queue</button>
              <button className="control-btn primary" onClick={handleBroadcast}>
                📢 Broadcast
              </button>
              <button className="control-btn secondary">📊 Export CSV</button>
            </div>
            <div className="pat-override">
              <h3>PAT Override</h3>
              <p>Ajuste manual do AI Treasury Manager</p>
              <div className="pat-controls">
                <label>
                  <input type="checkbox" /> Pausar decisões automáticas
                </label>
                <label>
                  <input type="checkbox" /> Modo conservador
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="popout-footer">
        <span>Panda Fabrics Founder Edition</span>
        <span>Last update: {new Date().toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}

/**
 * Open Founder Dashboard in Pop-Out Window
 * Saves and restores position for multi-monitor support
 */
export function openFounderDashboardPopout() {
  const saved = localStorage.getItem("founder_dashboard_pos");
  const pos = saved ? JSON.parse(saved) : { x: 100, y: 100, w: 900, h: 700 };

  const popup = window.open(
    "/founder-dashboard.html",
    "FounderDashboard",
    `width=${pos.w},height=${pos.h},left=${pos.x},top=${pos.y},resizable=yes,scrollbars=yes`,
  );

  if (popup) {
    // Save position when popup closes
    const savePosition = () => {
      try {
        localStorage.setItem(
          "founder_dashboard_pos",
          JSON.stringify({
            x: popup.screenX,
            y: popup.screenY,
            w: popup.innerWidth,
            h: popup.innerHeight,
          }),
        );
      } catch (e) {
        console.warn("Could not save popup position:", e);
      }
    };

    popup.addEventListener("beforeunload", savePosition);

    // Also save periodically while open
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
      } else {
        savePosition();
      }
    }, 5000);
  }

  return popup;
}

export default FounderDashboardPopout;
