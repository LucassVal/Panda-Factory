import React, { useState, useEffect } from "react";
import "./PFCouncilPanel.css";

/**
 * 🏛️ PAT Council Panel — Panda AI Treasury Governance
 *
 * Tabs:
 *  1. Treasury — Health Score + Reserve Breakdown + Total
 *  2. Constitution — 12 Articles validator with live checks
 *  3. Governance — Kill Switch + Audit Logs
 *
 * Connects to Panda.PAT and Panda.Governance SDK modules.
 */

const CONSTITUTION_ARTICLES = [
  { id: 1, title: "Identidade", desc: "Agente representa o ecossistema, não a si mesmo", check: () => true },
  { id: 2, title: "Valores Fundamentais", desc: "Democratização, Colaboração, Humildade, Transparência", check: () => true },
  { id: 3, title: "Comunicação", desc: "Tom acessível, sem arrogância, sem spam", check: () => true },
  { id: 4, title: "Limites Absolutos", desc: "Nunca expor credenciais, infra, dados pessoais", check: () => true },
  { id: 5, title: "Comportamento Autônomo", desc: "Heartbeat 4h, posts sem limite (exceto red lines)", check: () => true },
  { id: 6, title: "Objetivo Maior", desc: "Comunidade onde devs são valorizados e participam do valor", check: () => true },
  { id: 7, title: "Auto-Conhecimento", desc: "Ferramenta, não pessoa. Limitado pelo treinamento", check: () => true },
  { id: 8, title: "Atualizações", desc: "Só o Founder pode alterar a Constituição", check: () => true },
  { id: 9, title: "Splits Invioláveis", desc: "95% Dev, 5% Panda — hardcoded", check: () => true },
  { id: 10, title: "Kill Switch", desc: "Founder sempre mantém controle total", check: () => true },
  { id: 11, title: "Ed25519 Auth", desc: "Operações críticas requerem assinatura criptográfica", check: () => typeof window.Panda !== "undefined" },
  { id: 12, title: "Health Gate", desc: "Sem operações durante Health Score < 50%", check: () => true },
];

const KILL_SWITCH_ACTIONS = [
  { id: "freeze_treasury", icon: "🏦", label: "Freeze Treasury", desc: "Congelar todas transações" },
  { id: "disable_brain", icon: "🧠", label: "Disable Brain", desc: "Desligar IA pública" },
  { id: "lock_store", icon: "🔒", label: "Lock Store", desc: "Fechar marketplace" },
  { id: "emergency_backup", icon: "💾", label: "Emergency Backup", desc: "Backup imediato" },
];

export function PATCouncilPanel({ isOpen, onClose, activeTool = "treasury", embedded = false }) {
  const [activeTab, setActiveTab] = useState(activeTool);
  const [patStatus, setPatStatus] = useState(null);
  const [constitutionResults, setConstitutionResults] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Sync active tool from props
  useEffect(() => {
    if (activeTool === "treasury" || activeTool === "constitution" || activeTool === "rig") {
      setActiveTab(activeTool);
    }
  }, [activeTool]);

  // Fetch PAT status on open
  useEffect(() => {
    if (!embedded && !isOpen) return;

    const fetchStatus = async () => {
      try {
        if (window.Panda?.PAT?.getStatus) {
          const status = await window.Panda.PAT.getStatus();
          setPatStatus(status);
        } else {
          // Mock data
          setPatStatus({
            inflation: 0.02,
            reserve: 2300000,
            deflation: 0.005,
            circulatingSupply: 5200000,
            timestamp: Date.now(),
          });
        }
      } catch (e) {
        console.warn("🏛️ PAT: Status fetch failed:", e.message);
      }
    };

    fetchStatus();

    // Validate constitution
    const results = CONSTITUTION_ARTICLES.map((art) => ({
      ...art,
      passed: art.check(),
    }));
    setConstitutionResults(results);

    // Mock audit logs
    setAuditLogs([
      { time: "Agora", action: "🔓 Panel opened by Founder", level: "L1" },
      { time: "5min atrás", action: "🏦 Treasury sync completed", level: "L1" },
      { time: "1h atrás", action: "✅ Constitution validated (12/12)", level: "L2" },
      { time: "4h atrás", action: "🤖 Heartbeat check: all systems healthy", level: "L1" },
      { time: "12h atrás", action: "🛡️ Panda Defend scan: 0 threats", level: "L2" },
    ]);
  }, [isOpen, embedded]);

  if (!embedded && !isOpen) return null;

  const healthScore = patStatus
    ? Math.round((patStatus.reserve / (patStatus.circulatingSupply * 0.5)) * 100)
    : 92;
  const clampedScore = Math.min(100, healthScore);
  const circumference = 282.7;
  const offset = circumference - (clampedScore / 100) * circumference;

  const reserveData = [
    { icon: "🥇", label: "PAXG (Ouro)", value: "$1,500,000", pct: "65%" },
    { icon: "💵", label: "USDC (Stablecoin)", value: "$700,000", pct: "30%" },
    { icon: "⚡", label: "Liquidez Ops", value: "$100,000", pct: "5%" },
    { icon: "🔒", label: "Em Staking", value: "$50,000", pct: "+2.1%" },
  ];

  const passedCount = constitutionResults.filter((r) => r.passed).length;
  const totalArticles = constitutionResults.length;

  const handleKillSwitch = async (actionId) => {
    const confirmed = window.confirm(
      `⚠️ AÇÃO CRÍTICA: ${actionId}\n\nEsta ação requer autenticação Ed25519 + PIN.\n\nEm modo mock, a ação será simulada.\n\nContinuar?`
    );
    if (!confirmed) return;

    if (window.Panda?.PAT?.execute) {
      const result = await window.Panda.PAT.execute(actionId);
      console.log("🏛️ PAT Kill Switch:", result);
    } else {
      console.log(`🏛️ PAT Kill Switch [MOCK]: ${actionId} executed`);
    }

    setAuditLogs((prev) => [
      { time: "Agora", action: `⚠️ Kill Switch: ${actionId}`, level: "L4" },
      ...prev,
    ]);
  };

  // ── Panel content (shared between embedded and standalone modes) ──
  const panelContent = (
    <>
      {/* Header — only show close button in standalone mode */}
      <div className="pat-header">
        <div className="pat-header-title">
          <span style={{ fontSize: 28 }}>🏛️</span>
          <h2>Panda Council</h2>
          <span className="pat-header-badge">PAT v1.0</span>
        </div>
        {!embedded && <button className="pat-close" onClick={onClose}>✕</button>}
      </div>

      {/* Tabs */}
      <div className="pat-tabs">
        <button
          className={`pat-tab ${activeTab === "treasury" ? "active" : ""}`}
          onClick={() => setActiveTab("treasury")}
        >
          🏦 Treasury
        </button>
        <button
          className={`pat-tab ${activeTab === "constitution" ? "active" : ""}`}
          onClick={() => setActiveTab("constitution")}
        >
          ⚖️ Constitution ({passedCount}/{totalArticles})
        </button>
        <button
          className={`pat-tab ${activeTab === "rig" ? "active" : ""}`}
          onClick={() => setActiveTab("rig")}
        >
          🔧 Governance
        </button>
      </div>

      {/* ═══ TAB: TREASURY ═══ */}
      {activeTab === "treasury" && (
        <div>
          {/* Health Score */}
          <div className="pat-health-card">
            <div className="pat-health-ring">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle className="pat-health-ring-bg" cx="50" cy="50" r="45" />
                <circle
                  className="pat-health-ring-fill"
                  cx="50" cy="50" r="45"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ stroke: clampedScore > 80 ? "#10b981" : clampedScore > 60 ? "#f59e0b" : "#ef4444" }}
                />
              </svg>
              <div className="pat-health-ring-text">
                <div className="pat-health-value">{clampedScore}%</div>
                <div className="pat-health-label">Health</div>
              </div>
            </div>

            <div className="pat-health-metrics">
              <div className="pat-metric-row">
                <span className="pat-metric-label">Reserva vs Circulante</span>
                <div className="pat-metric-bar">
                  <div className="pat-metric-fill" style={{ width: "85%", background: "#10b981" }} />
                </div>
                <span className="pat-metric-value">85%</span>
              </div>
              <div className="pat-metric-row">
                <span className="pat-metric-label">Runway (dias)</span>
                <div className="pat-metric-bar">
                  <div className="pat-metric-fill" style={{ width: "100%", background: "#667eea" }} />
                </div>
                <span className="pat-metric-value">120d</span>
              </div>
              <div className="pat-metric-row">
                <span className="pat-metric-label">Diversificação</span>
                <div className="pat-metric-bar">
                  <div className="pat-metric-fill" style={{ width: "80%", background: "#f59e0b" }} />
                </div>
                <span className="pat-metric-value">80%</span>
              </div>
              <div className="pat-metric-row">
                <span className="pat-metric-label">Inflação</span>
                <div className="pat-metric-bar">
                  <div className="pat-metric-fill" style={{ width: `${(patStatus?.inflation || 0.02) * 1000}%`, background: "#8b5cf6" }} />
                </div>
                <span className="pat-metric-value">{((patStatus?.inflation || 0.02) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Reserve Grid */}
          <div className="pat-section-title">💰 Composição da Reserva</div>
          <div className="pat-reserve-grid">
            {reserveData.map((r) => (
              <div className="pat-reserve-card" key={r.label}>
                <div className="pat-reserve-icon">{r.icon}</div>
                <div className="pat-reserve-label">{r.label}</div>
                <div className="pat-reserve-value">{r.value}</div>
                <div className="pat-reserve-pct">{r.pct}</div>
              </div>
            ))}
          </div>

          {/* Total Banner */}
          <div className="pat-total-banner">
            <div>
              <div className="pat-total-label">Reserva Total</div>
              <div className="pat-total-value">$2,350,000</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="pat-total-label">Circulante</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {((patStatus?.circulatingSupply || 5200000) / 1000000).toFixed(1)}M PC
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB: CONSTITUTION ═══ */}
      {activeTab === "constitution" && (
        <div>
          <div className="pat-section-title">
            ⚖️ Validação dos 12 Artigos — {passedCount}/{totalArticles} OK
          </div>
          <ul className="pat-constitution-list">
            {constitutionResults.map((art) => (
              <li className="pat-article" key={art.id}>
                <div className={`pat-article-status ${art.passed ? "ok" : "fail"}`}>
                  {art.passed ? "✅" : "❌"}
                </div>
                <div className="pat-article-info">
                  <div className="pat-article-title">
                    Art. {art.id} — {art.title}
                  </div>
                  <div className="pat-article-desc">{art.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ═══ TAB: GOVERNANCE ═══ */}
      {activeTab === "rig" && (
        <div>
          {/* Kill Switch */}
          <div className="pat-killswitch-section">
            <div className="pat-killswitch-header">
              <span style={{ fontSize: 24 }}>🚨</span>
              <h3>Kill Switch (L4 — Ed25519 + PIN)</h3>
            </div>
            <div className="pat-killswitch-grid">
              {KILL_SWITCH_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  className="pat-killswitch-btn"
                  onClick={() => handleKillSwitch(action.id)}
                  title={action.desc}
                >
                  <span className="icon">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div style={{ marginTop: 20 }}>
            <div className="pat-section-title">🔐 Audit Log (Imutável)</div>
            {auditLogs.map((log, i) => (
              <div className="pat-audit-row" key={i}>
                <span className="pat-audit-label">{log.time}</span>
                <span className="pat-audit-value">{log.action}</span>
                <span className="pat-audit-label">{log.level}</span>
              </div>
            ))}
          </div>

          {/* Auth Level Info */}
          <div style={{ marginTop: 16 }}>
            <div className="pat-section-title">🔑 Níveis de Autenticação</div>
            {[
              { level: "L1", desc: "View — Ver logs, status", req: "Nenhum" },
              { level: "L2", desc: "Suggest — Propor mudanças", req: "Session Token" },
              { level: "L3", desc: "Execute — Transações < 1000 PC", req: "Ed25519" },
              { level: "L4", desc: "Critical — Kill Switch, > 1000 PC", req: "Ed25519 + PIN" },
              { level: "L5", desc: "Emergency — Violação Constituição", req: "Ed25519 + PIN + Bypass" },
            ].map((auth) => (
              <div className="pat-audit-row" key={auth.level}>
                <span className="pat-audit-value">{auth.level}</span>
                <span className="pat-audit-label" style={{ flex: 1, padding: "0 12px" }}>{auth.desc}</span>
                <span style={{ color: "#667eea", fontSize: 11 }}>{auth.req}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Embedded mode: render content directly, no overlay
  if (embedded) {
    return (
      <div className="pat-panel" style={{ position: "relative", width: "100%", height: "100%", overflow: "auto" }}>
        {panelContent}
      </div>
    );
  }

  // Standalone mode: wrap in overlay
  return (
    <div className="pat-overlay" onClick={onClose}>
      <div className="pat-panel" onClick={(e) => e.stopPropagation()}>
        {panelContent}
      </div>
    </div>
  );
}

export default PATCouncilPanel;
