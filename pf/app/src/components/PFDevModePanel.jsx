import React, { useState, useEffect, useCallback } from "react";
import "./PFDevModePanel.css";
import { useStoreModules } from "../hooks/useStoreModules";
import PFStore, { STORE_ITEMS } from "./PFStore";

/**
 * 🛠️ Dev Mode Panel v3.0
 *
 * Monitoring & verification tools for plugin developers.
 * The Panda does NOT produce code — it HOSTS and TRANSMITS.
 *
 * Tools (from PF_UI_REFERENCE.md §E.2 + Comp_DevToolsDock.html):
 * - 💻 Console — JS sandbox + system logs
 * - 🧰 MCP Browser — Rust Agent MCP tools list
 * - 🔌 API Tester — GAS endpoint testing
 * - 🏦 PAT Treasury — Banco Central IA controls
 * - ⚖️ Constitution — Validate against 12 Articles
 * - 📦 Publish — Product registration form for Medusa Store
 *
 * MCP Toggle (§25.4): Internal (sandbox) vs External (PC access)
 */

// ── DevTools definitions (from Comp_DevToolsDock.html) ──
const DEV_TOOLS = [
  {
    id: "console",
    name: "CONSOLE",
    icon: "💻",
    desc: "Sandbox JS + logs do sistema",
    status: "active",
  },
  {
    id: "mcp",
    name: "MCP BROWSER",
    icon: "🧰",
    desc: "Tools do Rust Agent",
    status: "active",
  },
  {
    id: "api",
    name: "API TESTER",
    icon: "🔌",
    desc: "Endpoints GAS",
    status: "active",
  },
  {
    id: "treasury",
    name: "PAT TREASURY",
    icon: "🏦",
    desc: "Banco Central IA",
    status: "active",
  },
  {
    id: "constitution",
    name: "CONSTITUTION",
    icon: "⚖️",
    desc: "Validar 12 Artigos",
    status: "active",
  },
  {
    id: "publish",
    name: "PUBLISH",
    icon: "📦",
    desc: "Publicar na Medusa Store",
    status: "active",
  },
  {
    id: "casulo",
    name: "CASULO",
    icon: "🐛",
    desc: "Encapsulado Creator",
    status: "active",
  },
  {
    id: "database",
    name: "DATABASE",
    icon: "🗄️",
    desc: "Sheets / Firebase",
    status: "future",
  },
  {
    id: "rig",
    name: "RIG CONFIG",
    icon: "🦀",
    desc: "Providers IA",
    status: "future",
  },
];

// ── Integration monitors ──
const INTEGRATIONS = [
  { id: "fb", name: "Firebase", icon: "🔥" },
  { id: "ga", name: "GAS", icon: "📜" },
  { id: "ru", name: "Rust Agent", icon: "🦀" },
  { id: "gh", name: "GitHub", icon: "🐙" },
  { id: "gd", name: "Google Drive", icon: "📁" },
  { id: "ms", name: "Medusa Store", icon: "🛒" },
];

// ── Casulo Inline Wizard (Encapsulado Creator inside DevTools) ──
function CasuloInline() {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ name: "", description: "", priceUSD: "" });
  const [selected, setSelected] = useState([]);

  const priceNum = parseFloat(info.priceUSD) || 0;

  const toggleModule = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectedModules = STORE_ITEMS.filter((m) => selected.includes(m.id));

  // Generate manifest
  const generateManifest = () => ({
    name: info.name,
    type: "encapsulado",
    version: "1.0.0",
    description: info.description,
    priceUSD: priceNum,
    modules: selectedModules.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.storeCategory,
    })),
    revenue: {
      pandaPercent: 30,
      devPercent: 70,
    },
    createdAt: new Date().toISOString(),
  });

  const downloadManifest = () => {
    const manifest = generateManifest();
    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "panda.manifest.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-content casulo-tool">
      {/* Step indicator */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              background:
                step > s
                  ? "#10b981"
                  : step === s
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(100,116,139,0.2)",
              color: step >= s ? "#fff" : "#64748b",
              transition: "all 0.3s",
            }}
          >
            {step > s ? "✓" : s}
          </div>
        ))}
        <span
          style={{
            fontSize: 11,
            color: "#64748b",
            marginLeft: 8,
            textTransform: "uppercase",
          }}
        >
          {step === 1 && "Info"}
          {step === 2 && "Panda Store"}
          {step === 3 && "Split & Manifest"}
        </span>
      </div>

      {/* ── Step 1: Info ── */}
      {step === 1 && (
        <div className="casulo-step">
          <div className="publish-field">
            <label>Nome do Encapsulado *</label>
            <input
              type="text"
              placeholder="Ex: Starter Pack Restaurante"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </div>
          <div className="publish-field">
            <label>Descrição</label>
            <textarea
              rows={3}
              placeholder="Pacote completo para delivery digital..."
              value={info.description}
              onChange={(e) =>
                setInfo({ ...info, description: e.target.value })
              }
            />
          </div>
          <div className="publish-field">
            <label>Preço do Encapsulado (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00 (grátis) ou valor customizado"
              value={info.priceUSD}
              onChange={(e) => setInfo({ ...info, priceUSD: e.target.value })}
            />
            <span
              style={{
                fontSize: 11,
                color: "#64748b",
                marginTop: 4,
                display: "block",
              }}
            >
              Módulos nativos são gratuitos. O preço representa o valor da sua
              integração/dashboard.
            </span>
          </div>
          <button
            className="btn-publish"
            disabled={!info.name.trim()}
            onClick={() => setStep(2)}
            style={{ marginTop: 8 }}
          >
            Próximo → Panda Store
          </button>
        </div>
      )}

      {/* ── Step 2: Panda Store Browser ── */}
      {step === 2 && (
        <div className="casulo-step">
          <div
            style={{ marginBottom: 10, borderRadius: 8, overflow: "hidden" }}
          >
            <PFStore
              embedded={true}
              selectionMode={true}
              selectedIds={new Set(selected)}
              onSelectionChange={(id) => toggleModule(id)}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              className="btn-add-embed"
              onClick={() => setStep(1)}
              style={{ flex: 1 }}
            >
              ← Voltar
            </button>
            <button
              className="btn-publish"
              disabled={selected.length === 0}
              onClick={() => setStep(3)}
              style={{ flex: 2 }}
            >
              Próximo → Split Calculator ({selected.length})
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Split Calculator + Manifest ── */}
      {step === 3 && (
        <div className="casulo-step">
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#e2e8f0",
              marginBottom: 10,
            }}
          >
            💰 Revenue Split — "{info.name}"
          </div>

          {/* Split bar */}
          <div
            style={{
              display: "flex",
              height: 32,
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: "30%",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              🐼 30%
            </div>
            <div
              style={{
                width: "70%",
                background: "linear-gradient(90deg, #10b981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              👤 Dev 70%
            </div>
          </div>

          {priceNum > 0 && (
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
              Por venda de{" "}
              <strong style={{ color: "#10b981" }}>
                ${priceNum.toFixed(2)}
              </strong>
              : Panda recebe <strong>${(priceNum * 0.3).toFixed(2)}</strong> ·
              Dev recebe{" "}
              <strong style={{ color: "#10b981" }}>
                ${(priceNum * 0.7).toFixed(2)}
              </strong>
            </div>
          )}

          {/* Selected modules summary */}
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            📦 {selectedModules.length} módulos incluídos:
          </div>
          <div style={{ maxHeight: 100, overflowY: "auto", marginBottom: 12 }}>
            {selectedModules.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 0",
                  fontSize: 12,
                  color: "#e2e8f0",
                }}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
                <span style={{ color: "#10b981", marginLeft: "auto" }}>
                  🎁 Free
                </span>
              </div>
            ))}
          </div>

          {/* Manifest preview */}
          <details style={{ marginBottom: 10 }}>
            <summary
              style={{
                cursor: "pointer",
                fontSize: 12,
                color: "#8b5cf6",
                fontWeight: 600,
              }}
            >
              📄 Preview panda.manifest.json
            </summary>
            <pre
              style={{
                background: "#0c0c0c",
                border: "1px solid #333",
                borderRadius: 6,
                padding: 10,
                fontSize: 10,
                color: "#94a3b8",
                maxHeight: 150,
                overflowY: "auto",
                marginTop: 6,
              }}
            >
              {JSON.stringify(generateManifest(), null, 2)}
            </pre>
          </details>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-add-embed"
              onClick={() => setStep(2)}
              style={{ flex: 1 }}
            >
              ← Voltar
            </button>
            <button
              className="btn-publish"
              onClick={downloadManifest}
              style={{ flex: 2 }}
            >
              📥 Download Manifest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DevModePanel({ isOpen, onClose, embedded = false }) {
  // ── Casulo modules hook (used by renderCasulo) ──
  const { modules: casuloModules, pcToUsd } = useStoreModules();

  const [mcpMode, setMcpMode] = useState("internal");
  const [activeTool, setActiveTool] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState("all");
  const [integrationStatus, setIntegrationStatus] = useState({});
  const [publishForm, setPublishForm] = useState({
    name: "",
    namespace: "",
    description: "",
    fullDescription: "",
    category: "module",
    priceUSD: "0",
    embedLinks: [],
    outputHooks: [],
  });
  const [verificationRunning, setVerificationRunning] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState([]);
  const [verificationDone, setVerificationDone] = useState(false);

  // ── Capture console logs ──
  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (type, args) => {
      const message = args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");
      setLogs((prev) => [
        ...prev.slice(-149),
        { id: Date.now() + Math.random(), type, message, time: new Date() },
      ]);
    };

    console.log = (...args) => {
      addLog("log", args);
      originalLog.apply(console, args);
    };
    console.warn = (...args) => {
      addLog("warn", args);
      originalWarn.apply(console, args);
    };
    console.error = (...args) => {
      addLog("error", args);
      originalError.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // ── Check integrations on open ──
  useEffect(() => {
    if (isOpen) checkIntegrations();
  }, [isOpen]);

  const checkIntegrations = useCallback(() => {
    const s = {};
    s.fb =
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_API_KEY !== "YOUR_API_KEY"
        ? "on"
        : "mock";
    s.ga =
      import.meta.env.VITE_GAS_URL &&
      !import.meta.env.VITE_GAS_URL?.includes("YOUR_DEPLOYMENT")
        ? "on"
        : "mock";
    s.ru = window.Panda?.Bridge?.isConnected?.() ? "on" : "mock";
    s.gh = "on"; // public API
    s.gd = "mock";
    s.ms = "mock";
    setIntegrationStatus(s);
  }, []);

  // ── MCP toggle ──
  const handleMcpToggle = () => {
    const next = mcpMode === "internal" ? "external" : "internal";
    if (
      next === "external" &&
      !confirm(
        "⚠️ Modo EXTERNO dá acesso ao PC.\nAprovação única.\n\nContinuar?",
      )
    )
      return;
    setMcpMode(next);
    console.log(`🔧 MCP Mode: ${next.toUpperCase()}`);
  };

  // ── Open tool ──
  const handleOpenTool = (tool) => {
    if (tool.status === "future") {
      console.log(`🔒 ${tool.name}: Em desenvolvimento`);
      return;
    }
    setActiveTool(activeTool?.id === tool.id ? null : tool);
    console.log(
      `🛠️ ${tool.name} ${activeTool?.id === tool.id ? "fechado" : "aberto"}`,
    );
  };

  // ── Render tool content ──
  const renderToolContent = () => {
    if (!activeTool) return null;

    switch (activeTool.id) {
      case "console":
        return renderConsole();
      case "mcp":
        return renderMCPBrowser();
      case "api":
        return renderAPITester();
      case "treasury":
        return renderPATTreasury();
      case "constitution":
        return renderConstitution();
      case "publish":
        return renderPublish();
      case "casulo":
        return renderCasulo();
      default:
        return <div className="tool-placeholder">🔒 Em desenvolvimento</div>;
    }
  };

  // ── Console Tool ──
  const renderConsole = () => {
    const filtered =
      logFilter === "all" ? logs : logs.filter((l) => l.type === logFilter);
    return (
      <div className="tool-content console-tool">
        <div className="console-controls">
          <select
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value)}
          >
            <option value="all">Todos ({logs.length})</option>
            <option value="log">Logs</option>
            <option value="warn">Warnings</option>
            <option value="error">Errors</option>
          </select>
          <button onClick={() => setLogs([])}>🗑️ LIMPAR</button>
        </div>
        <div className="console-output">
          {filtered.length === 0 ? (
            <div className="console-empty">Nenhum log capturado...</div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className={`console-line ${log.type}`}>
                <span className="log-time">
                  {log.time.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="log-type">{log.type.toUpperCase()}</span>
                <span className="log-msg">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // ── MCP Browser Tool ──
  const renderMCPBrowser = () => {
    const mcpTools = [
      {
        name: "execute_command",
        desc: "Executar comando no terminal (pwsh)",
        permission: "external",
      },
      {
        name: "read_file",
        desc: "Ler arquivo do sistema",
        permission: "external",
      },
      {
        name: "write_file",
        desc: "Escrever arquivo no sistema",
        permission: "external",
      },
      {
        name: "list_directory",
        desc: "Listar conteúdo de diretório",
        permission: "external",
      },
      {
        name: "health_check",
        desc: "Verificar saúde do sistema",
        permission: "internal",
      },
      {
        name: "gpu_info",
        desc: "Informações de GPU disponível",
        permission: "internal",
      },
      {
        name: "crypto_sign",
        desc: "Assinar com Ed25519",
        permission: "internal",
      },
      {
        name: "mining_status",
        desc: "Status de mineração Panda Coin",
        permission: "internal",
      },
    ];

    return (
      <div className="tool-content mcp-tool">
        <div className="mcp-info">
          Modo atual:{" "}
          <strong className={mcpMode}>{mcpMode.toUpperCase()}</strong>
        </div>
        <div className="mcp-tools-list">
          {mcpTools.map((t) => (
            <div
              key={t.name}
              className={`mcp-tool-item ${t.permission === "external" && mcpMode === "internal" ? "locked" : ""}`}
            >
              <code>{t.name}</code>
              <span>{t.desc}</span>
              {t.permission === "external" && mcpMode === "internal" && (
                <span className="lock-badge">🔒 EXTERNO</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── API Tester Tool ──
  const renderAPITester = () => {
    const endpoints = [
      { action: "healthCheck", method: "GET", desc: "Status do backend" },
      { action: "getMetrics", method: "GET", desc: "Métricas do Founder" },
      { action: "getTreasury", method: "GET", desc: "Dados do tesouro" },
      { action: "getUsers", method: "GET", desc: "Lista de usuários" },
      { action: "getErrors", method: "GET", desc: "Erros recentes" },
      { action: "getTransactions", method: "GET", desc: "Transações" },
    ];

    return (
      <div className="tool-content api-tool">
        <div className="api-url">
          URL: <code>{import.meta.env.VITE_GAS_URL || "MOCK MODE"}</code>
        </div>
        <div className="api-endpoints">
          {endpoints.map((ep) => (
            <div key={ep.action} className="api-endpoint">
              <span className="api-method">{ep.method}</span>
              <code>{ep.action}</code>
              <span className="api-desc">{ep.desc}</span>
              <button
                className="btn-test"
                onClick={() =>
                  console.log(`🔌 Testing ${ep.action}... (mock response OK)`)
                }
              >
                ▶ TEST
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── PAT Treasury Tool ──
  const renderPATTreasury = () => (
    <div className="tool-content treasury-tool">
      <div className="treasury-grid">
        <div className="treasury-card">
          <span className="treasury-label">CIRCULANTE</span>
          <span className="treasury-value">500K PC</span>
        </div>
        <div className="treasury-card">
          <span className="treasury-label">RESERVA</span>
          <span className="treasury-value">85%</span>
        </div>
        <div className="treasury-card">
          <span className="treasury-label">INFLAÇÃO</span>
          <span className="treasury-value">2.1%</span>
        </div>
        <div className="treasury-card">
          <span className="treasury-label">DEFLAÇÃO</span>
          <span className="treasury-value">1.8%</span>
        </div>
      </div>
      <div className="treasury-status">
        <span>
          ⚖️ Balanço: <strong style={{ color: "#4CAF50" }}>SAUDÁVEL</strong>
        </span>
        <span>📊 Score: 92/100</span>
      </div>
    </div>
  );

  // ── Constitution Validator Tool ──
  const renderConstitution = () => {
    const articles = [
      "Art.1 — Distribuição justa de valor",
      "Art.2 — Transparência total em transações",
      "Art.3 — Privacidade do usuário",
      "Art.4 — Código aberto para comunidade",
      "Art.5 — Sem vendor lock-in",
      "Art.6 — Founder tem voto de minerva",
    ];

    return (
      <div className="tool-content constitution-tool">
        <div className="constitution-header">
          <h4>⚖️ VERIFICAÇÃO CONSTITUCIONAL</h4>
          <button
            className="btn-validate"
            onClick={() => {
              articles.forEach((a) => console.log(`  ✅ ${a}`));
              console.log("⚖️ Todas as verificações passaram");
            }}
          >
            ▶ VALIDAR
          </button>
        </div>
        <ul className="articles-list">
          {articles.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>
    );
  };

  // ── Publish Tool ──
  const renderPublish = () => {
    const EMBED_TYPES = [
      { value: "youtube", label: "▶️ YouTube" },
      { value: "instagram", label: "📸 Instagram" },
      { value: "tiktok", label: "🎵 TikTok" },
      { value: "twitter", label: "🐦 Twitter/X" },
      { value: "linkedin", label: "💼 LinkedIn" },
      { value: "github", label: "🐙 GitHub" },
      { value: "telegram", label: "📱 Telegram" },
      { value: "whatsapp", label: "💬 WhatsApp" },
    ];

    const OUTPUT_HOOKS = [
      {
        id: "panda-store",
        label: "🐼 Panda Store (nativo)",
        desc: "Split 52% via PagSeguro/Paddle",
      },
      {
        id: "kiwify",
        label: "🥝 Kiwify",
        desc: "Hook de saída — config do dev",
      },
      {
        id: "hotmart",
        label: "🔥 Hotmart",
        desc: "Hook de saída — config do dev",
      },
      {
        id: "github-pages",
        label: "🌐 GitHub Pages",
        desc: "Deploy landing page",
      },
      { id: "steam", label: "🎮 Steam", desc: "Link externo" },
      { id: "playstore", label: "📱 Play Store", desc: "Link externo" },
    ];

    const updateField = (field, value) =>
      setPublishForm((prev) => ({ ...prev, [field]: value }));

    const addEmbed = () =>
      setPublishForm((prev) => ({
        ...prev,
        embedLinks: [...prev.embedLinks, { type: "youtube", url: "" }],
      }));

    const removeEmbed = (index) =>
      setPublishForm((prev) => ({
        ...prev,
        embedLinks: prev.embedLinks.filter((_, i) => i !== index),
      }));

    const updateEmbed = (index, field, value) =>
      setPublishForm((prev) => ({
        ...prev,
        embedLinks: prev.embedLinks.map((e, i) =>
          i === index ? { ...e, [field]: value } : e,
        ),
      }));

    const toggleHook = (hookId) =>
      setPublishForm((prev) => ({
        ...prev,
        outputHooks: prev.outputHooks.includes(hookId)
          ? prev.outputHooks.filter((h) => h !== hookId)
          : [...prev.outputHooks, hookId],
      }));

    const priceNum = parseFloat(publishForm.priceUSD) || 0;
    const isPriceInvalid = priceNum > 0 && priceNum < 0.5;

    const handlePublish = async () => {
      if (!publishForm.name.trim()) {
        console.warn("📦 PUBLISH: Nome é obrigatório");
        return;
      }
      if (!publishForm.namespace.trim()) {
        console.warn(
          "📦 PUBLISH: Namespace é obrigatório (ex: @username/nome)",
        );
        return;
      }
      if (isPriceInvalid) {
        console.warn(
          "📦 PUBLISH: Preço mínimo de venda é $0.50 (ou $0.00 para grátis)",
        );
        return;
      }

      // Start verification pipeline
      setVerificationRunning(true);
      setVerificationDone(false);
      setVerificationSteps([]);

      const isTentacle = publishForm.category === "tentacle";
      const steps = [
        { label: "Validando panda.mcp.json", duration: 800 },
        { label: "Static Analysis (Semgrep rules)", duration: 1200 },
        { label: "Dependency scan", duration: 900 },
        {
          label: `Sandbox test (30s${isTentacle ? " + Proxy SDK check" : ""})`,
          duration: 1500,
        },
        { label: "Calculando Defend Score", duration: 1000 },
        { label: "Registrando na Medusa Store", duration: 700 },
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setVerificationSteps((prev) => [
          ...prev,
          {
            index: i + 1,
            total: steps.length,
            label: step.label,
            status: "running",
            time: null,
          },
        ]);

        await new Promise((r) => setTimeout(r, step.duration));

        // Mock: step 4 fails for tentacles with score < 50 (epic-hook scenario)
        const passed = !(
          isTentacle &&
          i === 3 &&
          publishForm.namespace.includes("epic")
        );
        const elapsed = `${(step.duration / 1000).toFixed(1)}s`;

        setVerificationSteps((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: passed ? "pass" : "fail", time: elapsed }
              : s,
          ),
        );

        if (!passed) {
          // Abort on failure
          setVerificationSteps((prev) => [
            ...prev,
            {
              index: 0,
              total: 0,
              label: "❌ PUBLICAÇÃO ABORTADA — Sandbox test falhou",
              status: "abort",
              time: null,
            },
          ]);
          setVerificationRunning(false);
          setVerificationDone(true);
          console.error(
            "📦 PUBLISH: ❌ Falha no sandbox test — publicação abortada",
          );
          return;
        }
      }

      // Calculate mock score
      const score = isTentacle ? 74 : 92;
      setVerificationSteps((prev) => [
        ...prev,
        {
          index: 0,
          total: 0,
          label: `\n✅ DEFEND SCORE: ${score}/100 — ${score >= 70 ? "APROVADO" : "REJEITADO"}`,
          status: score >= 70 ? "final-pass" : "final-fail",
          time: null,
        },
        {
          index: 0,
          total: 0,
          label: `📦 Módulo "${publishForm.name}" registrado na Medusa Store! (mock)`,
          status: "info",
          time: null,
        },
      ]);

      setVerificationRunning(false);
      setVerificationDone(true);
      console.log(
        `📦 PUBLISH: ✅ Score ${score}/100 — Módulo registrado (mock)`,
      );
    };

    return (
      <div className="tool-content publish-tool">
        <div className="publish-form">
          {/* Basic Info */}
          <div className="publish-section">
            <div className="publish-section-title">📋 Informações Básicas</div>
            <div className="publish-field">
              <label>Nome do Módulo</label>
              <input
                type="text"
                placeholder="Meu Módulo Incrível"
                value={publishForm.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div className="publish-field">
              <label>Namespace</label>
              <input
                type="text"
                placeholder="@username/meu-modulo"
                value={publishForm.namespace}
                onChange={(e) => updateField("namespace", e.target.value)}
              />
            </div>
            <div className="publish-row">
              <div className="publish-field">
                <label>Tipo</label>
                <select
                  value={publishForm.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="module">📦 Módulo</option>
                  <option value="tentacle">🐙 Tentáculo</option>
                  <option value="theme">🎨 Theme</option>
                </select>
              </div>
              <div className="publish-field">
                <label>Preço (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={publishForm.priceUSD}
                  onChange={(e) => updateField("priceUSD", e.target.value)}
                />
              </div>
              {/* Min sale price warning */}
              {isPriceInvalid && (
                <div
                  style={{
                    marginTop: 6,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    fontSize: 12,
                    color: "#ef4444",
                  }}
                >
                  ⚠️ Preço mínimo de venda: <strong>$0.50</strong> — Publicar é
                  grátis, mas módulos pagos devem custar no mínimo $0.50. Use
                  $0.00 para distribuição gratuita.
                </div>
              )}
            </div>
          </div>

          {/* ── Revenue Split Info ── */}
          {priceNum > 0 && !isPriceInvalid && (
            <div
              className="publish-section"
              style={{
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 8,
              }}
            >
              <div
                className="publish-section-title"
                style={{ color: "#10b981" }}
              >
                💰 Revenue Split (USD-FIRST)
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#e2e8f0",
                  padding: "0 8px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    fontSize: 12,
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(100,116,139,0.2)",
                      }}
                    >
                      <th
                        style={{
                          textAlign: "left",
                          padding: "4px 8px",
                          color: "#94a3b8",
                        }}
                      >
                        Destinatário
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "4px 8px",
                          color: "#94a3b8",
                        }}
                      >
                        %
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "4px 8px",
                          color: "#94a3b8",
                        }}
                      >
                        Valor/venda
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>👤 Desenvolvedor</td>
                      <td style={{ padding: "4px 8px", textAlign: "center" }}>
                        55%
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          textAlign: "right",
                          color: "#10b981",
                          fontWeight: 700,
                        }}
                      >
                        ${(priceNum * 0.55).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>🎓 Educação</td>
                      <td style={{ padding: "4px 8px", textAlign: "center" }}>
                        22%
                      </td>
                      <td style={{ padding: "4px 8px", textAlign: "right" }}>
                        ${(priceNum * 0.22).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>⚙️ Operações</td>
                      <td style={{ padding: "4px 8px", textAlign: "center" }}>
                        15%
                      </td>
                      <td style={{ padding: "4px 8px", textAlign: "right" }}>
                        ${(priceNum * 0.15).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>🏭 Founder</td>
                      <td style={{ padding: "4px 8px", textAlign: "center" }}>
                        5%
                      </td>
                      <td style={{ padding: "4px 8px", textAlign: "right" }}>
                        ${(priceNum * 0.05).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>💳 Taxas</td>
                      <td style={{ padding: "4px 8px", textAlign: "center" }}>
                        3%
                      </td>
                      <td style={{ padding: "4px 8px", textAlign: "right" }}>
                        ${(priceNum * 0.03).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style={{ margin: "8px 0 0", fontSize: 11, color: "#64748b" }}
                >
                  Preço USD convertido para PC no momento da compra. Publicar é{" "}
                  <strong>GRÁTIS</strong>.
                </p>
              </div>
            </div>
          )}

          {/* ── Tentáculo Warning ── */}
          {publishForm.category === "tentacle" && (
            <div
              className="publish-section"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: 8,
              }}
            >
              <div
                className="publish-section-title"
                style={{ color: "#f59e0b" }}
              >
                ⚠️ AVISO: TENTÁCULO — Nível de Blindagem Alto
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#e2e8f0",
                  padding: "0 8px",
                }}
              >
                <p style={{ margin: "0 0 10px" }}>
                  Tentáculos acessam APIs do sistema via{" "}
                  <strong>Proxy SDK</strong> em
                  <strong> iframe blindado</strong>. Requerem sandbox forte,
                  permissões explícitas no manifest, e passam pelo{" "}
                  <strong>Panda Defend Score ≥ 70</strong> para aprovação.
                </p>
                <table
                  style={{
                    width: "100%",
                    fontSize: 12,
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(100,116,139,0.2)",
                      }}
                    >
                      <th
                        style={{
                          textAlign: "left",
                          padding: "4px 8px",
                          color: "#94a3b8",
                        }}
                      >
                        Nível
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "4px 8px",
                          color: "#94a3b8",
                        }}
                      >
                        Exemplo
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "4px 8px",
                          color: "#94a3b8",
                        }}
                      >
                        Aprovação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>🟢 Baixo</td>
                      <td
                        style={{
                          padding: "4px 8px",
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        panda.ui.toast, panda.data.read
                      </td>
                      <td style={{ padding: "4px 8px" }}>Auto-approve</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>🟡 Médio</td>
                      <td
                        style={{
                          padding: "4px 8px",
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        panda.data.write, panda.store.state
                      </td>
                      <td style={{ padding: "4px 8px" }}>Auto + auditoria</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 8px" }}>🔴 Alto</td>
                      <td
                        style={{
                          padding: "4px 8px",
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        panda.wallet.send, panda.auth.modify
                      </td>
                      <td style={{ padding: "4px 8px" }}>Founder review</td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style={{ margin: "10px 0 0", fontSize: 12, color: "#f59e0b" }}
                >
                  🔒 Regras de Blindagem: <code>eval()</code>,{" "}
                  <code>document.write()</code> e <code>fetch()</code>
                  sem <code>Panda.Bridge</code> são{" "}
                  <strong>bloqueados automaticamente</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Descriptions */}
          <div className="publish-section">
            <div className="publish-section-title">📝 Descrições</div>
            <div className="publish-field">
              <label>Descrição Breve (card)</label>
              <input
                type="text"
                placeholder="Resumo curto para o card da Store"
                value={publishForm.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            <div className="publish-field">
              <label>Descrição Completa (PDP)</label>
              <textarea
                rows={4}
                placeholder="Descrição completa com features, detalhes e diferenciais..."
                value={publishForm.fullDescription}
                onChange={(e) => updateField("fullDescription", e.target.value)}
              />
            </div>
          </div>

          {/* Embed Links */}
          <div className="publish-section">
            <div className="publish-section-title">
              🔗 Embed Links
              <button className="btn-add-embed" onClick={addEmbed}>
                + Adicionar
              </button>
            </div>
            {publishForm.embedLinks.length === 0 ? (
              <div className="publish-empty">
                Nenhum embed. Clique "+ Adicionar" para incluir links de mídia.
              </div>
            ) : (
              publishForm.embedLinks.map((embed, i) => (
                <div key={i} className="embed-row">
                  <select
                    value={embed.type}
                    onChange={(e) => updateEmbed(i, "type", e.target.value)}
                  >
                    {EMBED_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={embed.url}
                    onChange={(e) => updateEmbed(i, "url", e.target.value)}
                  />
                  <button className="btn-remove" onClick={() => removeEmbed(i)}>
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Output Hooks */}
          <div className="publish-section">
            <div className="publish-section-title">
              🔌 Hooks de Saída (Distribuição)
            </div>
            <div className="hooks-grid">
              {OUTPUT_HOOKS.map((hook) => (
                <label
                  key={hook.id}
                  className={`hook-option ${publishForm.outputHooks.includes(hook.id) ? "selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={publishForm.outputHooks.includes(hook.id)}
                    onChange={() => toggleHook(hook.id)}
                  />
                  <span className="hook-label">{hook.label}</span>
                  <span className="hook-desc">{hook.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            className="btn-publish"
            onClick={handlePublish}
            disabled={verificationRunning}
            style={
              verificationRunning ? { opacity: 0.5, cursor: "not-allowed" } : {}
            }
          >
            {verificationRunning
              ? "⏳ VERIFICAÇÃO EM ANDAMENTO..."
              : "📦 PUBLICAR NA MEDUSA STORE"}
          </button>

          {/* ── Inline Verification Runner (PowerShell style) ── */}
          {(verificationRunning || verificationDone) && (
            <div
              style={{
                marginTop: 12,
                background: "#0c0c0c",
                border: "1px solid #333",
                borderRadius: 8,
                padding: "14px 16px",
                fontFamily:
                  "'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace",
                fontSize: 12,
                lineHeight: 1.8,
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              <div
                style={{ color: "#6366f1", marginBottom: 8, fontWeight: 700 }}
              >
                PS C:\PandaFactory\Medusa&gt; publish-verify --module "
                {publishForm.name || "..."}"
              </div>
              {verificationSteps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    color:
                      step.status === "running"
                        ? "#fbbf24"
                        : step.status === "pass"
                          ? "#10b981"
                          : step.status === "fail" || step.status === "abort"
                            ? "#ef4444"
                            : step.status === "final-pass"
                              ? "#10b981"
                              : step.status === "final-fail"
                                ? "#ef4444"
                                : "#94a3b8",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {step.index > 0 && (
                    <span style={{ color: "#64748b" }}>
                      [STEP {step.index}/{step.total}]{" "}
                    </span>
                  )}
                  {step.status === "running" && "⏳ "}
                  {step.status === "pass" && "✅ "}
                  {step.status === "fail" && "❌ "}
                  {step.label}
                  {step.time && (
                    <span style={{ color: "#64748b" }}> ({step.time})</span>
                  )}
                </div>
              ))}
              {verificationRunning && (
                <div
                  style={{ color: "#fbbf24", animation: "pulse 1s infinite" }}
                >
                  ▌
                </div>
              )}
            </div>
          )}

          {/* Reset after done */}
          {verificationDone && (
            <button
              className="btn-add-embed"
              style={{ marginTop: 8, width: "100%" }}
              onClick={() => {
                setVerificationDone(false);
                setVerificationSteps([]);
              }}
            >
              🔄 Nova Publicação
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── Casulo (Encapsulado Creator) Tool ──
  const renderCasulo = () => {
    return <CasuloInline />;
  };

  if (!isOpen) return null;

  // Inner content (shared between embedded and standalone modes)
  const panelContent = (
    <div
      className={`devmode-panel ${embedded ? "embedded" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header + MCP Toggle */}
      <header className="devmode-header">
        <h2>🛠️ DEV MODE</h2>
        <div className="mcp-toggle-compact">
          <span className={mcpMode === "internal" ? "active" : ""}>
            🏠 INTERNO
          </span>
          <button className="toggle-switch" onClick={handleMcpToggle}>
            <span className={`switch-dot ${mcpMode}`} />
          </button>
          <span className={mcpMode === "external" ? "active" : ""}>
            💻 EXTERNO
          </span>
        </div>
        {!embedded && (
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        )}
      </header>

      <div className="devmode-body">
        {/* Left: Tools Grid */}
        <div className="devmode-tools">
          <div className="section-label">FERRAMENTAS</div>
          <div className="tools-grid">
            {DEV_TOOLS.map((tool) => (
              <button
                key={tool.id}
                className={`tool-card ${activeTool?.id === tool.id ? "active" : ""} ${tool.status === "future" ? "future" : ""}`}
                onClick={() => handleOpenTool(tool)}
                title={tool.desc}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
                {tool.status === "future" && (
                  <span className="future-badge">SOON</span>
                )}
              </button>
            ))}
          </div>

          {/* Integration Status */}
          <div className="section-label">INTEGRAÇÕES</div>
          <div className="integrations-row">
            {INTEGRATIONS.map((int) => (
              <div
                key={int.id}
                className={`int-chip ${integrationStatus[int.id] || "unknown"}`}
                title={int.name}
              >
                <span>{int.icon}</span>
                <span className="int-label">{int.id.toUpperCase()}</span>
                <span
                  className={`int-dot ${integrationStatus[int.id] || "unknown"}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Tool Content */}
        <div className="devmode-tool-view">
          {activeTool ? (
            <>
              <div className="tool-view-header">
                <span>
                  {activeTool.icon} {activeTool.name}
                </span>
                <small>{activeTool.desc}</small>
              </div>
              {renderToolContent()}
            </>
          ) : (
            <div className="tool-placeholder">
              <span className="placeholder-icon">🛠️</span>
              <p>Selecione uma ferramenta</p>
              <small>Console, MCP Browser, API Tester...</small>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="devmode-footer">
        <span>Panda Dev Tools v3.0</span>
        <span className="footer-mcp">MCP: {mcpMode.toUpperCase()}</span>
      </footer>
    </div>
  );

  // Embedded: render directly, no overlay
  if (embedded) return panelContent;

  // Standalone: wrap in overlay
  return (
    <div className="devmode-overlay" onClick={onClose}>
      {panelContent}
    </div>
  );
}

export default DevModePanel;
