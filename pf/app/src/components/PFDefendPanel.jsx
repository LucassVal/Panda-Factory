import React, { useState, useCallback, useMemo } from "react";
import { PanicButton } from "./PFPanicButton";
import "./PFDefendPanel.css";

/**
 * 🛡️ Panda Defend — User Security Panel v1.0
 *
 * User-facing security dashboard.
 * Ref: PF_SECURITY_REFERENCE.md §1.6 (Panda Defend)
 *
 * Sections:
 * - Global Defend Score
 * - Installed Modules health + permission levels
 * - Activity Monitor (security events)
 * - Permissions Review (expandable)
 *
 * All data is mock — Rust Agent integration pending.
 */

// ── Module and event data — populated by Rust Agent at runtime ──
// Initial state is empty (fresh OS boot)
const INITIAL_MODULES = [];
const INITIAL_SCORE_DETAILS = {};
const INITIAL_EVENTS = [];
const GOLDEN_RULES = [];

// ── Risk helpers ──
const RISK_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};
const RISK_LABELS = {
  low: "🟢 Baixo",
  medium: "🟡 Médio",
  high: "🔴 Alto",
};
const STATUS_LABELS = {
  approved: "✅ Aprovado",
  review: "🟡 Em Revisão",
  suspended: "🔴 Suspenso",
};

function getPermRisk(perm) {
  if (perm.includes("wallet") || perm.includes("auth.modify")) return "high";
  if (
    perm.includes("write") ||
    perm.includes("state") ||
    perm.includes("bridge")
  )
    return "medium";
  return "low";
}

export function PFDefendPanel() {
  const [expandedModule, setExpandedModule] = useState(null);
  const [eventFilter, setEventFilter] = useState("all");
  const [rulesExpanded, setRulesExpanded] = useState(false);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [reportedModules, setReportedModules] = useState(new Set());

  const globalScore = Math.round(
    modules.reduce((sum, m) => sum + m.score, 0) / (modules.length || 1),
  );
  const scoreColor =
    globalScore >= 80 ? "#10b981" : globalScore >= 60 ? "#f59e0b" : "#ef4444";

  const toggleModule = useCallback(
    (id) => setExpandedModule((prev) => (prev === id ? null : id)),
    [],
  );

  const filteredEvents =
    eventFilter === "all"
      ? INITIAL_EVENTS
      : INITIAL_EVENTS.filter((e) => e.type === eventFilter);

  const handleReport = useCallback((modId) => {
    setReportedModules((prev) => new Set([...prev, modId]));
    console.log(
      `🛡️ DEFEND: ⚠️ Módulo ${modId} reportado — denúncia registrada`,
    );
  }, []);

  const handleUninstall = useCallback((modId) => {
    setModules((prev) => prev.filter((m) => m.id !== modId));
    setExpandedModule(null);
    console.log(`🛡️ DEFEND: 🗑️ Módulo ${modId} desinstalado`);
  }, []);

  return (
    <div className="pf-defend-container">
      {/* Header */}
      <div className="pf-defend-header">
        <span className="pf-defend-header-icon">🛡️</span>
        <h1 className="pf-defend-title">Panda Defend</h1>
      </div>
      <p className="pf-defend-subtitle">
        Monitoramento de segurança — módulos instalados, permissões e atividade
      </p>

      {/* ────── Global Score ────── */}
      <div className="pf-defend-card">
        <div className="pf-defend-score-box">
          <div className="pf-defend-score-center">
            <div className="pf-defend-score-big" style={{ color: scoreColor }}>
              {globalScore}
            </div>
            <div className="pf-defend-score-label">DEFEND SCORE</div>
          </div>
          <div className="pf-defend-stats">
            <div>
              ✅ Aprovados:{" "}
              <strong>
                {modules.filter((m) => m.status === "approved").length}
              </strong>
            </div>
            <div>
              🟡 Em revisão:{" "}
              <strong>
                {modules.filter((m) => m.status === "review").length}
              </strong>
            </div>
            <div>
              🔴 Suspensos:{" "}
              <strong>
                {modules.filter((m) => m.status === "suspended").length}
              </strong>
            </div>
            <div className="pf-defend-stats-muted">Último scan: hoje 12:34</div>
          </div>
        </div>
      </div>

      {/* ────── Installed Modules ────── */}
      <div className="pf-defend-card">
        <div className="pf-defend-section-title">
          <span>📦</span> Módulos Instalados ({modules.length})
        </div>
        {modules.map((mod) => (
          <div key={mod.id}>
            <div
              className={`pf-defend-module-row${expandedModule === mod.id ? " pf-defend-module-row--expanded" : ""}`}
              onClick={() => toggleModule(mod.id)}
            >
              <span className="pf-defend-module-icon">{mod.icon}</span>
              <div className="pf-defend-module-info">
                <div className="pf-defend-module-name">{mod.name}</div>
                <div className="pf-defend-module-meta">
                  {mod.id} •{" "}
                  {mod.type === "tentacle" ? "🐙 Tentáculo" : "📦 Módulo"}
                </div>
              </div>
              <div className="pf-defend-module-score-wrap">
                <div
                  className="pf-defend-module-score-value"
                  style={{
                    color:
                      mod.score >= 80
                        ? "#10b981"
                        : mod.score >= 60
                          ? "#f59e0b"
                          : "#ef4444",
                  }}
                >
                  {mod.score}
                </div>
                <div className="pf-defend-module-score-label">SCORE</div>
              </div>
              <span
                className="pf-defend-risk-badge"
                style={{
                  background: `${RISK_COLORS[mod.risk]}15`,
                  color: RISK_COLORS[mod.risk],
                  border: `1px solid ${RISK_COLORS[mod.risk]}30`,
                }}
              >
                {RISK_LABELS[mod.risk]}
              </span>
              <span className="pf-defend-status-label">
                {STATUS_LABELS[mod.status]}
              </span>
              <span
                className={`pf-defend-chevron${expandedModule === mod.id ? " pf-defend-chevron--open" : ""}`}
              >
                ▼
              </span>
            </div>

            {/* Expanded permissions */}
            {expandedModule === mod.id && (
              <div className="pf-defend-expanded">
                <div className="pf-defend-perm-header">
                  PERMISSÕES CONCEDIDAS:
                </div>
                <div className="pf-defend-perm-list">
                  {mod.permissions.map((perm) => {
                    const r = getPermRisk(perm);
                    return (
                      <span
                        key={perm}
                        className="pf-defend-perm-tag"
                        style={{
                          background: `${RISK_COLORS[r]}12`,
                          color: RISK_COLORS[r],
                          border: `1px solid ${RISK_COLORS[r]}25`,
                        }}
                      >
                        {perm}
                      </span>
                    );
                  })}
                </div>
                <div className="pf-defend-last-scan">
                  Último scan: {mod.lastScan}
                </div>
                {mod.type === "tentacle" && (
                  <div className="pf-defend-tentacle-warning">
                    ⚠️ <strong>Tentáculo</strong> — acessa APIs do sistema via
                    Proxy SDK. Sandbox forte + permissões explícitas
                    obrigatórias.
                  </div>
                )}

                {/* ── Score Breakdown ── */}
                {INITIAL_SCORE_DETAILS[mod.id] && (
                  <div className="pf-defend-breakdown">
                    <div className="pf-defend-breakdown-header">
                      📊 SCORE BREAKDOWN:
                    </div>
                    {INITIAL_SCORE_DETAILS[mod.id].bonus.map((b, i) => (
                      <div key={`b-${i}`} className="pf-defend-breakdown-bonus">
                        + {b}
                      </div>
                    ))}
                    {INITIAL_SCORE_DETAILS[mod.id].penalty.map((p, i) => (
                      <div
                        key={`p-${i}`}
                        className="pf-defend-breakdown-penalty"
                      >
                        − {p}
                      </div>
                    ))}
                    {INITIAL_SCORE_DETAILS[mod.id]?.bonus.length === 0 &&
                      INITIAL_SCORE_DETAILS[mod.id]?.penalty.length === 0 && (
                        <div className="pf-defend-breakdown-empty">
                          Nenhum detalhe disponível
                        </div>
                      )}
                  </div>
                )}

                {/* ── Module Actions ── */}
                <div className="pf-defend-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReport(mod.id);
                    }}
                    disabled={reportedModules.has(mod.id)}
                    className="pf-defend-btn-report"
                  >
                    {reportedModules.has(mod.id)
                      ? "✅ Reportado"
                      : "⚠️ Reportar"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Desinstalar ${mod.name}? Esta ação não pode ser desfeita.`,
                        )
                      ) {
                        handleUninstall(mod.id);
                      }
                    }}
                    className="pf-defend-btn-uninstall"
                  >
                    🗑️ Desinstalar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ────── Activity Monitor ────── */}
      <div className="pf-defend-card">
        <div className="pf-defend-section-title pf-defend-section-title--between">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>📊</span> Monitor de Atividade
          </div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="pf-defend-filter-select"
          >
            <option value="all">Todos ({INITIAL_EVENTS.length})</option>
            <option value="block">🔴 Bloqueios</option>
            <option value="warning">🟡 Alertas</option>
            <option value="scan">🔍 Scans</option>
            <option value="info">✅ Info</option>
          </select>
        </div>
        <div className="pf-defend-event-log">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`pf-defend-event-row${evt.type === "block" ? " pf-defend-event-row--block" : evt.type === "warning" ? " pf-defend-event-row--warning" : ""}`}
            >
              <span className="pf-defend-event-time">{evt.time}</span>
              <span>{evt.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ────── 14 Golden Rules (Collapsed) ────── */}
      <div className="pf-defend-card">
        <div
          className="pf-defend-section-title pf-defend-section-title--between pf-defend-section-title--clickable"
          onClick={() => setRulesExpanded((prev) => !prev)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>📋</span> 14 Regras de Ouro (Bloqueio Automático)
          </div>
          <span
            className={`pf-defend-chevron${rulesExpanded ? " pf-defend-chevron--open" : ""}`}
          >
            ▼
          </span>
        </div>
        {rulesExpanded && (
          <div style={{ overflowX: "auto" }}>
            <table className="pf-defend-rules-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Regra</th>
                  <th>Risco</th>
                </tr>
              </thead>
              <tbody>
                {GOLDEN_RULES.map((r) => (
                  <tr key={r.id}>
                    <td className="pf-defend-rule-id">{r.id}</td>
                    <td>{r.rule}</td>
                    <td className="pf-defend-rule-risk">{r.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pf-defend-rules-ref">
              Ref:{" "}
              <code className="pf-defend-code-ref">
                PF_SECURITY_REFERENCE.md §1.6.B
              </code>
            </div>
          </div>
        )}
      </div>

      {/* ────── About ────── */}
      <div className="pf-defend-card pf-defend-card--info">
        <div className="pf-defend-about-row">
          <span className="pf-defend-about-icon">ℹ️</span>
          <div className="pf-defend-about-body">
            <div className="pf-defend-about-title">
              Como funciona o Panda Defend
            </div>
            <div className="pf-defend-about-text">
              O Panda Defend monitora todos os módulos e tentáculos instalados
              no seu ambiente. Cada extensão recebe um{" "}
              <strong>Score de Segurança</strong> (0-100) baseado em análise
              estática, permissões declaradas, e comportamento em sandbox.
              <br />
              <br />
              <strong>Score ≥ 70:</strong> Aprovado automaticamente.
              <br />
              <strong>Score 50-69:</strong> Requer revisão manual.
              <br />
              <strong>Score {"<"} 50:</strong> Suspenso automaticamente.
              <br />
              <br />
              Extensões suspeitas são bloqueadas em tempo real. Você sempre tem
              controle total para desinstalar qualquer módulo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PFDefendPanel;
