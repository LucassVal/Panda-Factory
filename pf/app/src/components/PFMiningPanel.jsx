import React, { useState, useEffect } from "react";
import "./PFMiningPanel.css";

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

  return (
    <div
      className={`pf-mining-panel${embedded ? " pf-mining-panel--embedded" : ""}`}
    >
      {/* Header */}
      <div className="pf-mining-header">
        <h2 className="pf-mining-title">⛏️ Meu Mining</h2>
        <p className="pf-mining-subtitle">
          Painel pessoal de mineração — acompanhe seus ganhos em Panda Coins
        </p>
      </div>

      {/* ────── ALWAYS-VISIBLE: Standard Disclosure ────── */}
      <div className="pf-mining-card pf-mining-card--disclosure">
        <div className="pf-mining-disclosure-row">
          <span className="pf-mining-disclosure-icon">ℹ️</span>
          <div className="pf-mining-disclosure-body">
            <div className="pf-mining-disclosure-title">
              Como funciona o Partner Mode
            </div>
            <div className="pf-mining-disclosure-text">
              O Partner Mode utiliza CPU/GPU ociosa do seu computador para
              minerar criptomoeda via Rust Agent. Você recebe{" "}
              <strong className="pf-mining-highlight-green">60%</strong> do
              valor convertido em Panda Coins. Mineração é{" "}
              <strong>sempre opt-in e desligada por padrão</strong>. Desative a
              qualquer momento.
            </div>
          </div>
        </div>
      </div>

      {/* ────── STATUS + TOGGLE ────── */}
      <div className="pf-mining-card">
        <div className="pf-mining-status-row">
          <div>
            <div className="pf-mining-status-label">
              {miningEnabled ? "⛏️ Minerando" : "⏸️ Mineração Desligada"}
            </div>
            <div className="pf-mining-status-detail">
              {miningEnabled
                ? `${gpuEnabled ? "CPU + GPU" : "Apenas CPU"} • ${cpuLimit}% limite`
                : "Ligue para ganhar PC automaticamente"}
            </div>
          </div>
          <button
            onClick={() => setMiningEnabled(!miningEnabled)}
            className={`pf-mining-btn-toggle ${miningEnabled ? "pf-mining-btn-toggle--stop" : "pf-mining-btn-toggle--start"}`}
          >
            {miningEnabled ? "⏹ Parar" : "▶ Iniciar Mining"}
          </button>
        </div>
      </div>

      {/* ────── INCENTIVE (when OFF) ────── */}
      {!miningEnabled && (
        <div className="pf-mining-card pf-mining-card--incentive">
          <div className="pf-mining-incentive-icon">⛏️</div>
          <div className="pf-mining-incentive-title">
            Ganhe Panda Coins Passivamente
          </div>
          <div className="pf-mining-incentive-text">
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
          <div className="pf-mining-card">
            <div className="pf-mining-section-title">
              📊 Stats em Tempo Real
            </div>
            <div className="pf-mining-stats-row">
              <div className="pf-mining-stat-box">
                <div className="pf-mining-stat-value pf-mining-stat-value--green">
                  {hardwareProfile}
                </div>
                <div className="pf-mining-stat-label">Perfil Hardware</div>
              </div>
              <div className="pf-mining-stat-box">
                <div className="pf-mining-stat-value pf-mining-stat-value--amber pf-mining-stat-value--mono">
                  ~{estimatedHashrate} KH/s
                </div>
                <div className="pf-mining-stat-label">Hashrate</div>
              </div>
              <div className="pf-mining-stat-box">
                <div className="pf-mining-stat-value pf-mining-stat-value--purple pf-mining-stat-value--mono">
                  {formatUptime(sessionUptime)}
                </div>
                <div className="pf-mining-stat-label">Uptime Sessão</div>
              </div>
              <div className="pf-mining-stat-box">
                <div className="pf-mining-stat-value pf-mining-stat-value--amber">
                  ~{estimatedPcDay} PC
                </div>
                <div className="pf-mining-stat-label">Estimado/Dia</div>
              </div>
            </div>
          </div>

          {/* Resource Controls */}
          <div className="pf-mining-card">
            <div className="pf-mining-section-title">
              ⚙️ Controle de Recursos
            </div>
            <div className="pf-mining-slider-wrap">
              <div className="pf-mining-slider-header">
                <span>Limite CPU</span>
                <span>
                  <strong>{cpuLimit}%</strong>
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="75"
                step="5"
                value={cpuLimit}
                onChange={(e) => setCpuLimit(Number(e.target.value))}
                className="pf-mining-slider"
              />
              <div className="pf-mining-slider-labels">
                <span>25% Baixo</span>
                <span>50% Equilibrado</span>
                <span>75% Alto</span>
              </div>
            </div>

            <div className="pf-mining-gpu-row">
              <div>
                <div className="pf-mining-gpu-label">🖥️ Mineração GPU</div>
                <div className="pf-mining-gpu-detail">
                  Ativa GPU para ganhos maiores
                </div>
              </div>
              <button
                onClick={() => setGpuEnabled(!gpuEnabled)}
                className={`pf-mining-btn-gpu${gpuEnabled ? " pf-mining-btn-gpu--active" : ""}`}
              >
                {gpuEnabled ? "✅ Ativa" : "Desligada"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ────── EARNINGS OVERVIEW ────── */}
      <div className="pf-mining-card">
        <div className="pf-mining-section-title">💰 Resumo de Ganhos</div>
        <div className="pf-mining-stats-row">
          <div className="pf-mining-stat-box">
            <div className="pf-mining-stat-value pf-mining-stat-value--large pf-mining-stat-value--amber">
              {totalEarned}
            </div>
            <div className="pf-mining-stat-label">PC Total Acumulado</div>
          </div>
          <div className="pf-mining-stat-box">
            <div className="pf-mining-stat-value pf-mining-stat-value--large pf-mining-stat-value--green">
              {totalWeekEarned}
            </div>
            <div className="pf-mining-stat-label">PC Última Semana</div>
          </div>
          <div className="pf-mining-stat-box">
            <div className="pf-mining-stat-value pf-mining-stat-value--large pf-mining-stat-value--purple">
              ~{(estimatedPcDay * 30).toFixed(0)}
            </div>
            <div className="pf-mining-stat-label">Estimativa Mensal</div>
          </div>
        </div>
      </div>

      {/* ────── EARNINGS HISTORY ────── */}
      <div className="pf-mining-card">
        <div className="pf-mining-section-title">
          📋 Histórico (Últimos 7 Dias)
        </div>
        <table className="pf-mining-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>PC Ganho</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {earningsHistory.length === 0 ? (
              <tr>
                <td colSpan="3" className="pf-mining-table-empty">
                  Sem histórico — inicie o mining para acumular dados
                </td>
              </tr>
            ) : (
              earningsHistory.map((row, i) => (
                <tr key={i}>
                  <td className="pf-mining-date-cell">{row.date}</td>
                  <td
                    style={{
                      fontWeight: 600,
                      color: row.earned > 0 ? "#10b981" : "#666",
                    }}
                  >
                    {row.earned > 0 ? `+${row.earned} PC` : "—"}
                  </td>
                  <td>{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ────── REVENUE SPLIT INFO ────── */}
      <div className="pf-mining-card">
        <div className="pf-mining-section-title">
          📐 Distribuição de Receita
        </div>
        <div className="pf-mining-split-bar">
          <div className="pf-mining-split-segment pf-mining-split-segment--user">
            60% Você
          </div>
          <div className="pf-mining-split-segment pf-mining-split-segment--infra">
            40% Infra
          </div>
        </div>
        <div className="pf-mining-split-note">
          Fator x0.60 flat: 60% convertido em PC para você. Os 40% restantes
          cobrem impostos (BR), infraestrutura, hold reserve e treasury.
        </div>
      </div>

      {/* ────── FOOTER ────── */}
      <div className="pf-mining-footer">
        ⚠️ Dados simulados — Execução real requer Rust Agent (binário nativo).
        Ciclo de pagamento: End-of-Day (23:59 UTC).
      </div>
    </div>
  );
}

export default MiningPanel;
