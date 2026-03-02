import React, { useState, useCallback, useMemo } from "react";
import { PanicButton } from "./PFPanicButton";

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

// ── Styles ──
const S = {
  container: {
    padding: "24px 32px",
    maxWidth: 900,
    margin: "0 auto",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "var(--pf-text, #e2e8f0)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: { fontSize: 24, fontWeight: 700, margin: 0 },
  subtitle: {
    color: "var(--pf-text-muted, #94a3b8)",
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    background: "var(--pf-surface, rgba(30,41,59,0.7))",
    border: "1px solid var(--pf-border, rgba(100,116,139,0.2))",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  scoreBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: "20px 0",
  },
  scoreBig: {
    fontSize: 56,
    fontWeight: 800,
    lineHeight: 1,
  },
  moduleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 6,
    cursor: "pointer",
    transition: "background .15s",
  },
  permTag: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    marginRight: 4,
    marginBottom: 4,
  },
  eventRow: {
    padding: "8px 12px",
    borderRadius: 6,
    marginBottom: 4,
    fontSize: 13,
    lineHeight: 1.5,
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  eventTime: {
    color: "#64748b",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    minWidth: 44,
    marginTop: 2,
  },
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
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <span style={{ fontSize: 28 }}>🛡️</span>
        <h1 style={S.title}>Panda Defend</h1>
      </div>
      <p style={S.subtitle}>
        Monitoramento de segurança — módulos instalados, permissões e atividade
      </p>

      {/* ────── Global Score ────── */}
      <div style={S.card}>
        <div style={S.scoreBox}>
          <div style={{ textAlign: "center" }}>
            <div style={{ ...S.scoreBig, color: scoreColor }}>
              {globalScore}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
              DEFEND SCORE
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.8 }}>
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
            <div style={{ color: "#64748b", marginTop: 4, fontSize: 11 }}>
              Último scan: hoje 12:34
            </div>
          </div>
        </div>
      </div>

      {/* ────── Installed Modules ────── */}
      <div style={S.card}>
        <div style={S.sectionTitle}>
          <span>📦</span> Módulos Instalados ({modules.length})
        </div>
        {modules.map((mod) => (
          <div key={mod.id}>
            <div
              style={{
                ...S.moduleRow,
                background:
                  expandedModule === mod.id
                    ? "rgba(100,116,139,0.15)"
                    : "rgba(100,116,139,0.06)",
              }}
              onClick={() => toggleModule(mod.id)}
            >
              <span style={{ fontSize: 20 }}>{mod.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{mod.name}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>
                  {mod.id} •{" "}
                  {mod.type === "tentacle" ? "🐙 Tentáculo" : "📦 Módulo"}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  minWidth: 48,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
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
                <div style={{ fontSize: 9, color: "#64748b" }}>SCORE</div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: `${RISK_COLORS[mod.risk]}15`,
                  color: RISK_COLORS[mod.risk],
                  border: `1px solid ${RISK_COLORS[mod.risk]}30`,
                }}
              >
                {RISK_LABELS[mod.risk]}
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                {STATUS_LABELS[mod.status]}
              </span>
              <span
                style={{
                  fontSize: 12,
                  transform:
                    expandedModule === mod.id ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform .2s",
                }}
              >
                ▼
              </span>
            </div>

            {/* Expanded permissions */}
            {expandedModule === mod.id && (
              <div
                style={{
                  padding: "12px 20px 16px 48px",
                  borderBottom: "1px solid rgba(100,116,139,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 8,
                    color: "#94a3b8",
                  }}
                >
                  PERMISSÕES CONCEDIDAS:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {mod.permissions.map((perm) => {
                    const r = getPermRisk(perm);
                    return (
                      <span
                        key={perm}
                        style={{
                          ...S.permTag,
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
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    marginTop: 8,
                  }}
                >
                  Último scan: {mod.lastScan}
                </div>
                {mod.type === "tentacle" && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: "rgba(245,158,11,0.08)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      fontSize: 12,
                      color: "#f59e0b",
                    }}
                  >
                    ⚠️ <strong>Tentáculo</strong> — acessa APIs do sistema via
                    Proxy SDK. Sandbox forte + permissões explícitas
                    obrigatórias.
                  </div>
                )}

                {/* ── Score Breakdown ── */}
                {INITIAL_SCORE_DETAILS[mod.id] && (
                  <div style={{ marginTop: 10 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#94a3b8",
                        marginBottom: 6,
                      }}
                    >
                      📊 SCORE BREAKDOWN:
                    </div>
                    {INITIAL_SCORE_DETAILS[mod.id].bonus.map((b, i) => (
                      <div
                        key={`b-${i}`}
                        style={{
                          fontSize: 11,
                          color: "#10b981",
                          paddingLeft: 8,
                        }}
                      >
                        + {b}
                      </div>
                    ))}
                    {INITIAL_SCORE_DETAILS[mod.id].penalty.map((p, i) => (
                      <div
                        key={`p-${i}`}
                        style={{
                          fontSize: 11,
                          color: "#ef4444",
                          paddingLeft: 8,
                        }}
                      >
                        − {p}
                      </div>
                    ))}
                    {INITIAL_SCORE_DETAILS[mod.id]?.bonus.length === 0 &&
                      INITIAL_SCORE_DETAILS[mod.id]?.penalty.length === 0 && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            paddingLeft: 8,
                          }}
                        >
                          Nenhum detalhe disponível
                        </div>
                      )}
                  </div>
                )}

                {/* ── Module Actions ── */}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReport(mod.id);
                    }}
                    disabled={reportedModules.has(mod.id)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: reportedModules.has(mod.id)
                        ? "rgba(100,116,139,0.1)"
                        : "rgba(245,158,11,0.1)",
                      color: reportedModules.has(mod.id)
                        ? "#64748b"
                        : "#f59e0b",
                      border: `1px solid ${reportedModules.has(mod.id) ? "rgba(100,116,139,0.2)" : "rgba(245,158,11,0.25)"}`,
                      cursor: reportedModules.has(mod.id)
                        ? "default"
                        : "pointer",
                    }}
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
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.25)",
                      cursor: "pointer",
                    }}
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
      <div style={S.card}>
        <div
          style={{
            ...S.sectionTitle,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>📊</span> Monitor de Atividade
          </div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            style={{
              background: "rgba(100,116,139,0.15)",
              border: "1px solid rgba(100,116,139,0.2)",
              borderRadius: 6,
              color: "var(--pf-text, #e2e8f0)",
              padding: "4px 8px",
              fontSize: 11,
            }}
          >
            <option value="all">Todos ({INITIAL_EVENTS.length})</option>
            <option value="block">🔴 Bloqueios</option>
            <option value="warning">🟡 Alertas</option>
            <option value="scan">🔍 Scans</option>
            <option value="info">✅ Info</option>
          </select>
        </div>
        <div
          style={{
            maxHeight: 260,
            overflowY: "auto",
            background: "var(--pf-bg, rgba(0,0,0,0.2))",
            borderRadius: 8,
            padding: 8,
          }}
        >
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              style={{
                ...S.eventRow,
                background:
                  evt.type === "block"
                    ? "rgba(239,68,68,0.06)"
                    : evt.type === "warning"
                      ? "rgba(245,158,11,0.06)"
                      : "transparent",
              }}
            >
              <span style={S.eventTime}>{evt.time}</span>
              <span>{evt.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ────── 14 Golden Rules (Collapsed) ────── */}
      <div style={S.card}>
        <div
          style={{
            ...S.sectionTitle,
            cursor: "pointer",
            justifyContent: "space-between",
          }}
          onClick={() => setRulesExpanded((prev) => !prev)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>📋</span> 14 Regras de Ouro (Bloqueio Automático)
          </div>
          <span
            style={{
              fontSize: 12,
              transform: rulesExpanded ? "rotate(180deg)" : "rotate(0)",
              transition: "transform .2s",
            }}
          >
            ▼
          </span>
        </div>
        {rulesExpanded && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                fontSize: 12,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "4px 8px",
                      color: "#94a3b8",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "4px 8px",
                      color: "#94a3b8",
                    }}
                  >
                    Regra
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "4px 8px",
                      color: "#94a3b8",
                    }}
                  >
                    Risco
                  </th>
                </tr>
              </thead>
              <tbody>
                {GOLDEN_RULES.map((r) => (
                  <tr
                    key={r.id}
                    style={{ borderBottom: "1px solid rgba(100,116,139,0.08)" }}
                  >
                    <td
                      style={{
                        padding: "4px 8px",
                        fontWeight: 700,
                        color: "#ef4444",
                        fontFamily: "monospace",
                      }}
                    >
                      {r.id}
                    </td>
                    <td style={{ padding: "4px 8px" }}>{r.rule}</td>
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: 11,
                        color: "#f59e0b",
                      }}
                    >
                      {r.risk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                marginTop: 8,
                padding: "0 8px",
              }}
            >
              Ref:{" "}
              <code
                style={{
                  fontSize: 10,
                  background: "rgba(100,116,139,0.15)",
                  padding: "1px 4px",
                  borderRadius: 3,
                }}
              >
                PF_SECURITY_REFERENCE.md §1.6.B
              </code>
            </div>
          </div>
        )}
      </div>

      {/* ────── About ────── */}
      <div
        style={{
          ...S.card,
          background: "rgba(102,126,234,0.06)",
          border: "1px solid rgba(102,126,234,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 22 }}>ℹ️</span>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 4,
                color: "var(--accent-color, #667eea)",
              }}
            >
              Como funciona o Panda Defend
            </div>
            <div style={{ color: "var(--pf-text-muted, #94a3b8)" }}>
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
