import React, { useState, useEffect } from "react";

/**
 * ⛏️ PFMiningPanel — User Mining Dashboard
 *
 * Personal mining dashboard for end users.
 * Shows individual mining metrics, earnings history,
 * hardware profile, and always-present standard disclosure.
 *
 * Opens as a canvas module tab (via PFWindowManager).
 * Mining is OFF by default (opt-in).
 *
 * @see PF_ECONOMY_REFERENCE.md §16 Rust Mining Node
 */

// ── Earnings history — populated by Rust Agent API in production ──
// Initial state is empty (fresh OS boot)

export function MiningPanel({ embedded = false }) {
  const [miningEnabled, setMiningEnabled] = useState(false);
  const [gpuEnabled, setGpuEnabled] = useState(false);
  const [cpuLimit, setCpuLimit] = useState(50);
  const [sessionUptime, setSessionUptime] = useState(0);

  // Simulate uptime counter when mining
  useEffect(() => {
    if (!miningEnabled) return;
    const timer = setInterval(() => {
      setSessionUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [miningEnabled]);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Computed stats
  const hardwareProfile = gpuEnabled
    ? cpuLimit >= 75
      ? "🌲 Forest"
      : cpuLimit >= 50
        ? "🌳 Tree"
        : "🌿 Sprout"
    : cpuLimit >= 50
      ? "🌿 Sprout"
      : "🌱 Seed";

  const estimatedHashrate = gpuEnabled
    ? cpuLimit >= 75
      ? "4.2"
      : "2.8"
    : cpuLimit >= 50
      ? "1.1"
      : "0.6";

  const estimatedPcDay = gpuEnabled
    ? cpuLimit >= 75
      ? 5.2
      : 3.4
    : cpuLimit >= 50
      ? 1.3
      : 0.7;

  const earningsHistory = []; // Populated by Rust Agent
  const totalEarned = 0;
  const totalWeekEarned = "0.0";

  // ── Styles ──
  const panel = {
    padding: embedded ? "24px" : "32px",
    maxWidth: "780px",
    margin: "0 auto",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#e0e0e0",
  };

  const card = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "16px",
  };

  const statBox = {
    textAlign: "center",
    padding: "14px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
    flex: 1,
    minWidth: "130px",
  };

  const sectionTitle = {
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "12px",
    color: "#f59e0b",
  };

  return (
    <div style={panel}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
          ⛏️ Meu Mining
        </h2>
        <p
          style={{
            margin: "6px 0 0",
            opacity: 0.6,
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Painel pessoal de mineração — acompanhe seus ganhos em Panda Coins
        </p>
      </div>

      {/* ────── ALWAYS-VISIBLE: Standard Disclosure ────── */}
      <div
        style={{
          ...card,
          background: "rgba(102,126,234,0.06)",
          border: "1px solid rgba(102,126,234,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "20px" }}>ℹ️</span>
          <div style={{ lineHeight: "1.6", fontSize: "13px" }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "4px",
                color: "#667eea",
              }}
            >
              Como funciona o Partner Mode
            </div>
            <div style={{ opacity: 0.7, lineHeight: 1.6 }}>
              O Partner Mode utiliza CPU/GPU ociosa do seu computador para
              minerar criptomoeda via Rust Agent. Você recebe{" "}
              <strong style={{ color: "#10b981" }}>60%</strong> do valor
              convertido em Panda Coins. Mineração é{" "}
              <strong>sempre opt-in e desligada por padrão</strong>. Desative a
              qualquer momento.
            </div>
          </div>
        </div>
      </div>

      {/* ────── STATUS + TOGGLE ────── */}
      <div style={card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>
              {miningEnabled ? "⛏️ Minerando" : "⏸️ Mineração Desligada"}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.5, marginTop: "4px" }}>
              {miningEnabled
                ? `${gpuEnabled ? "CPU + GPU" : "Apenas CPU"} • ${cpuLimit}% limite`
                : "Ligue para ganhar PC automaticamente"}
            </div>
          </div>
          <button
            onClick={() => setMiningEnabled(!miningEnabled)}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              background: miningEnabled
                ? "rgba(239,68,68,0.15)"
                : "rgba(16,185,129,0.15)",
              color: miningEnabled ? "#ef4444" : "#10b981",
              transition: "all 0.2s",
            }}
          >
            {miningEnabled ? "⏹ Parar" : "▶ Iniciar Mining"}
          </button>
        </div>
      </div>

      {/* ────── INCENTIVE (when OFF) ────── */}
      {!miningEnabled && (
        <div
          style={{
            ...card,
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.2)",
            textAlign: "center",
            padding: "28px 20px",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>⛏️</div>
          <div style={{ fontWeight: 700, fontSize: "16px", color: "#f59e0b" }}>
            Ganhe Panda Coins Passivamente
          </div>
          <div
            style={{
              fontSize: "13px",
              opacity: 0.7,
              lineHeight: 1.6,
              maxWidth: "420px",
              margin: "8px auto 0",
            }}
          >
            Ligue o Partner Mode e ganhe Panda Coins automaticamente enquanto
            seu computador está ocioso. Sem custos extras, desative quando
            quiser.
          </div>
        </div>
      )}

      {/* ────── LIVE STATS (when ON) ────── */}
      {miningEnabled && (
        <>
          {/* Stats Cards */}
          <div style={card}>
            <div style={sectionTitle}>📊 Stats em Tempo Real</div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={statBox}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#10b981",
                  }}
                >
                  {hardwareProfile}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.5,
                    marginTop: "4px",
                  }}
                >
                  Perfil Hardware
                </div>
              </div>
              <div style={statBox}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#f59e0b",
                    fontFamily: "monospace",
                  }}
                >
                  ~{estimatedHashrate} KH/s
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.5,
                    marginTop: "4px",
                  }}
                >
                  Hashrate
                </div>
              </div>
              <div style={statBox}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#667eea",
                    fontFamily: "monospace",
                  }}
                >
                  {formatUptime(sessionUptime)}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.5,
                    marginTop: "4px",
                  }}
                >
                  Uptime Sessão
                </div>
              </div>
              <div style={statBox}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#f59e0b",
                  }}
                >
                  ~{estimatedPcDay} PC
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.5,
                    marginTop: "4px",
                  }}
                >
                  Estimado/Dia
                </div>
              </div>
            </div>
          </div>

          {/* Resource Controls */}
          <div style={card}>
            <div style={sectionTitle}>⚙️ Controle de Recursos</div>
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  marginBottom: "6px",
                }}
              >
                <span>Limite CPU</span>
                <span style={{ fontWeight: 700 }}>{cpuLimit}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="75"
                step="5"
                value={cpuLimit}
                onChange={(e) => setCpuLimit(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#f59e0b",
                  height: "6px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  opacity: 0.4,
                  marginTop: "4px",
                }}
              >
                <span>25% Baixo</span>
                <span>50% Equilibrado</span>
                <span>75% Alto</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>
                  🖥️ Mineração GPU
                </div>
                <div style={{ fontSize: "11px", opacity: 0.5 }}>
                  Ativa GPU para ganhos maiores
                </div>
              </div>
              <button
                onClick={() => setGpuEnabled(!gpuEnabled)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: gpuEnabled
                    ? "1px solid #10b981"
                    : "1px solid rgba(255,255,255,0.15)",
                  background: gpuEnabled
                    ? "rgba(16,185,129,0.15)"
                    : "transparent",
                  color: gpuEnabled ? "#10b981" : "#888",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {gpuEnabled ? "✅ Ativa" : "Desligada"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ────── EARNINGS OVERVIEW ────── */}
      <div style={card}>
        <div style={sectionTitle}>💰 Resumo de Ganhos</div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={statBox}>
            <div
              style={{ fontSize: "26px", fontWeight: 700, color: "#f59e0b" }}
            >
              {totalEarned}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "4px" }}>
              PC Total Acumulado
            </div>
          </div>
          <div style={statBox}>
            <div
              style={{ fontSize: "26px", fontWeight: 700, color: "#10b981" }}
            >
              {totalWeekEarned}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "4px" }}>
              PC Última Semana
            </div>
          </div>
          <div style={statBox}>
            <div
              style={{ fontSize: "26px", fontWeight: 700, color: "#667eea" }}
            >
              ~{(estimatedPcDay * 30).toFixed(0)}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "4px" }}>
              Estimativa Mensal
            </div>
          </div>
        </div>
      </div>

      {/* ────── EARNINGS HISTORY ────── */}
      <div style={card}>
        <div style={sectionTitle}>📋 Histórico (Últimos 7 Dias)</div>
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
                style={{
                  padding: "8px 12px",
                  fontWeight: 600,
                  opacity: 0.6,
                }}
              >
                Data
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  fontWeight: 600,
                  opacity: 0.6,
                }}
              >
                PC Ganho
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  fontWeight: 600,
                  opacity: 0.6,
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {earningsHistory.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  style={{ padding: "16px", textAlign: "center", opacity: 0.4 }}
                >
                  Sem histórico — inicie o mining para acumular dados
                </td>
              </tr>
            ) : (
              earningsHistory.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <td
                    style={{
                      padding: "8px 12px",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.date}
                  </td>
                  <td
                    style={{
                      padding: "8px 12px",
                      fontWeight: 600,
                      color: row.earned > 0 ? "#10b981" : "#666",
                    }}
                  >
                    {row.earned > 0 ? `+${row.earned} PC` : "—"}
                  </td>
                  <td style={{ padding: "8px 12px" }}>{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ────── REVENUE SPLIT INFO ────── */}
      <div style={card}>
        <div style={sectionTitle}>📐 Distribuição de Receita</div>
        <div
          style={{
            display: "flex",
            height: "24px",
            borderRadius: "6px",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "60%",
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            60% Você
          </div>
          <div
            style={{
              width: "40%",
              background: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            40% Infra
          </div>
        </div>
        <div style={{ fontSize: "11px", opacity: 0.5, lineHeight: 1.6 }}>
          Fator x0.60 flat: 60% convertido em PC para você. Os 40% restantes
          cobrem impostos (BR), infraestrutura, hold reserve e treasury.
        </div>
      </div>

      {/* ────── FOOTER ────── */}
      <div
        style={{
          fontSize: "11px",
          opacity: 0.35,
          marginTop: "8px",
          textAlign: "center",
        }}
      >
        ⚠️ Dados simulados — Execução real requer Rust Agent (binário nativo).
        Ciclo de pagamento: End-of-Day (23:59 UTC).
      </div>
    </div>
  );
}

export default MiningPanel;
