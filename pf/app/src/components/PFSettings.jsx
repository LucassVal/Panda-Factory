import React, { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { License } from "../services/callGAS";
import "./PFSettings.css";

/**
 * Jam Settings Modal v5.1
 * Panda Fabrics - White-Label System
 *
 * FIXES:
 * - Dark Mode funcional com localStorage
 * - Cores de tema white-label
 * - AI Settings: Só Gemini (Flash, Pro, Image, Video)
 * - Notifications com localStorage
 * - Seções Security, Integrations, Developer definidas
 */

// Logo atual do Panda Fabrics
const PANDA_LOGO = "./panda-icon.png";

// Cores disponíveis para white-label
const ACCENT_COLORS = [
  { id: "purple", color: "#667eea", name: "Panda Purple" },
  { id: "green", color: "#10b981", name: "Success Green" },
  { id: "orange", color: "#f59e0b", name: "Warning Orange" },
  { id: "red", color: "#ef4444", name: "Danger Red" },
  { id: "violet", color: "#8b5cf6", name: "Violet" },
  { id: "pink", color: "#ec4899", name: "Pink" },
];

// Modelos Gemini disponíveis
const GEMINI_MODELS = [
  { id: "flash", name: "⚡ Gemini 2.0 Flash", desc: "Rápido e eficiente" },
  { id: "pro", name: "🧠 Gemini 2.0 Pro", desc: "Raciocínio avançado" },
  { id: "image", name: "🎨 Gemini Imagen", desc: "Geração de imagens" },
  { id: "video", name: "🎬 Gemini Veo", desc: "Geração de vídeos" },
];

function PFSettings({ isOpen, onClose, embedded = false, uid }) {
  const [activeSection, setActiveSection] = useState("profile");

  // Dynamic user data from localStorage
  const userData = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("panda_user"));
      return {
        displayName: u?.displayName || "CONVIDADO",
        email: u?.email || "—",
        userType: u?.userType || "user",
      };
    } catch {
      return { displayName: "CONVIDADO", email: "—", userType: "user" };
    }
  })();

  // Estados com localStorage
  // Uses "panda_theme" key to stay in sync with PFStatusBar
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("panda_theme");
    return saved !== "light"; // dark is default
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("panda_accent_color") || "#667eea";
  });

  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem("panda_ai_model") || "flash";
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("panda_notifications");
    return saved !== null
      ? JSON.parse(saved)
      : {
          email: true,
          push: false,
          sounds: true,
          updates: true,
        };
  });

  // Mining / Partner Mode state
  const [miningEnabled, setMiningEnabled] = useState(() => {
    return localStorage.getItem("pandaMining") === "true";
  });
  const [gpuMining, setGpuMining] = useState(() => {
    return localStorage.getItem("pandaGpuMining") === "true";
  });
  const [cpuLimit, setCpuLimit] = useState(() => {
    return parseInt(localStorage.getItem("pandaCpuLimit") || "50");
  });

  // Apply theme — dark-first CSS, only toggle light-mode class
  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("panda_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Sync when StatusBar (or another tab) changes theme
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "panda_theme") {
        setDarkMode(e.newValue !== "light");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Aplicar cor de destaque
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor);
  }, [accentColor]);

  if (!embedded && !isOpen) return null;

  const sections = [
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "appearance", icon: "🎨", label: "Appearance" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
    { id: "ai", icon: "🧠", label: "AI Settings" },
    { id: "wallet", icon: "💰", label: "Wallet" },
    { id: "mining", icon: "⛏️", label: "Mining" },
    { id: "security", icon: "🔒", label: "Security" },
    { id: "integrations", icon: "🔌", label: "Integrations" },
    { id: "about", icon: "ℹ️", label: "About" },
  ];

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("panda_theme", newMode ? "dark" : "light");
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
    localStorage.setItem("panda_accent_color", color);
  };

  const changeModel = (modelId) => {
    setSelectedModel(modelId);
    localStorage.setItem("panda_ai_model", modelId);
  };

  const toggleNotification = (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    localStorage.setItem(
      "panda_notifications",
      JSON.stringify(newNotifications),
    );
  };

  // Mining helpers
  const toggleMining = () => {
    const next = !miningEnabled;
    setMiningEnabled(next);
    localStorage.setItem("pandaMining", next);
  };
  const toggleGpu = () => {
    const next = !gpuMining;
    setGpuMining(next);
    localStorage.setItem("pandaGpuMining", next);
  };
  const handleCpuLimit = (val) => {
    const v = parseInt(val);
    setCpuLimit(v);
    localStorage.setItem("pandaCpuLimit", v);
  };
  const estimatedPc = (() => {
    if (!miningEnabled) return 0;
    const base = Math.round(30 * (cpuLimit / 25));
    const gpuBonus = gpuMining ? Math.round(base * 0.8) : 0;
    return base + gpuBonus;
  })();
  const miningTotal = parseInt(localStorage.getItem("pandaMiningTotal") || "0");

  // ── Shared content (sidebar + content pane) ──
  const sidebar = (
    <div className="pf-settings-sidebar">
      <div className="pf-settings-user">
        <div className="pf-settings-avatar">
          <img
            src={PANDA_LOGO}
            alt="Panda"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
        </div>
        <div className="pf-settings-user-info">
          <h4>{userData.displayName}</h4>
          <span>{userData.userType}</span>
        </div>
      </div>

      {sections.map((s) => (
        <div
          key={s.id}
          className={`pf-settings-nav-item ${activeSection === s.id ? "active" : ""}`}
          onClick={() => setActiveSection(s.id)}
        >
          <span>{s.icon}</span>
          {s.label}
        </div>
      ))}
    </div>
  );

  const contentPane = (
    <div className="pf-settings-content">
      {!embedded && (
        <button className="pf-settings-close" onClick={onClose}>
          ×
        </button>
      )}

      {/* Profile Section */}
      {activeSection === "profile" && (
        <div className="pf-settings-section">
          <h2>👤 Profile</h2>
          <p>Manage your account information</p>
          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Username</div>
                <div className="pf-settings-sublabel">
                  {userData.displayName.toLowerCase().replace(/\s+/g, ".")}
                </div>
              </div>
              <button className="pf-btn-secondary">Edit</button>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Email</div>
                <div className="pf-settings-sublabel">{userData.email}</div>
              </div>
              <button className="pf-btn-secondary">Edit</button>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Role</div>
                <div className="pf-settings-sublabel">{userData.userType}</div>
              </div>
              <span className="pf-status-badge online">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Section - White Label */}
      {activeSection === "appearance" && (
        <div className="pf-settings-section">
          <h2>🎨 Appearance</h2>
          <p>Personalize o visual da sua instância (White-Label)</p>

          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Dark Mode</div>
                <div className="pf-settings-sublabel">
                  {darkMode ? "Tema escuro ativo" : "Tema claro ativo"}
                </div>
              </div>
              <div
                className={`pf-toggle ${darkMode ? "active" : ""}`}
                onClick={toggleDarkMode}
              />
            </div>
          </div>

          <div className="pf-settings-card">
            <div className="pf-settings-label">Cor de Destaque</div>
            <div className="pf-settings-sublabel">
              Cor principal usada em botões, links e elementos de destaque
            </div>
            <div className="pf-color-picker">
              {ACCENT_COLORS.map((c) => (
                <div
                  key={c.id}
                  className={`pf-color-dot ${accentColor === c.color ? "active" : ""}`}
                  style={{ background: c.color }}
                  onClick={() => changeAccentColor(c.color)}
                  title={c.name}
                />
              ))}
            </div>
            <div
              className="pf-settings-sublabel"
              style={{ marginTop: "8px", fontSize: "11px", opacity: 0.6 }}
            >
              Selecionada:{" "}
              {ACCENT_COLORS.find((c) => c.color === accentColor)?.name ||
                accentColor}
            </div>
          </div>

          <div className="pf-settings-card">
            <div className="pf-settings-label">🏷️ Logo Personalizado</div>
            <div className="pf-settings-sublabel">
              Substitua o logo padrão por um personalizado (canvas welcome,
              header)
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "12px",
                  background: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    "2px dashed " +
                    (darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"),
                }}
              >
                <img
                  src={
                    localStorage.getItem("panda_custom_logo") ||
                    "./panda-icon.png"
                  }
                  alt="Logo"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="URL do logo (ex: https://...)"
                  defaultValue={localStorage.getItem("panda_custom_logo") || ""}
                  onChange={(e) => {
                    const url = e.target.value.trim();
                    if (url) {
                      localStorage.setItem("panda_custom_logo", url);
                    } else {
                      localStorage.removeItem("panda_custom_logo");
                    }
                  }}
                  className="pf-wl-input"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: darkMode
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "1px solid rgba(0,0,0,0.15)",
                    background: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    color: darkMode ? "#e0e0e0" : "#333",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
                <div
                  style={{ marginTop: "6px", fontSize: "11px", opacity: 0.5 }}
                >
                  Cole a URL de uma imagem ou faça upload abaixo
                </div>
              </div>
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <label
                className="pf-btn-primary"
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                📁 Upload Arquivo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size < 500000) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        localStorage.setItem(
                          "panda_custom_logo",
                          ev.target.result,
                        );
                        window.location.reload();
                      };
                      reader.readAsDataURL(file);
                    } else if (file) {
                      alert("Arquivo muito grande. Máximo: 500KB");
                    }
                  }}
                />
              </label>
              <button
                className="pf-btn-secondary"
                onClick={() => {
                  localStorage.removeItem("panda_custom_logo");
                  window.location.reload();
                }}
                style={{ fontSize: "12px" }}
              >
                Restaurar Padrão
              </button>
            </div>
          </div>

          <div className="pf-settings-card">
            <div className="pf-settings-label">📝 Nome da Instância</div>
            <div className="pf-settings-sublabel">
              Nome exibido no header e welcome (white-label)
            </div>
            <input
              type="text"
              placeholder="Panda Fabrics"
              defaultValue={localStorage.getItem("panda_custom_name") || ""}
              onChange={(e) => {
                const name = e.target.value.trim();
                if (name) {
                  localStorage.setItem("panda_custom_name", name);
                } else {
                  localStorage.removeItem("panda_custom_name");
                }
              }}
              className="pf-wl-input"
              style={{
                width: "100%",
                padding: "8px 12px",
                marginTop: "10px",
                borderRadius: "8px",
                border: darkMode
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "1px solid rgba(0,0,0,0.15)",
                background: darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
                color: darkMode ? "#e0e0e0" : "#333",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <div
            className="pf-settings-info"
            style={{ fontSize: "12px", marginTop: "8px" }}
          >
            ℹ️ <strong>White-Label para devs:</strong> personalize cores, logo e
            nome. Configs persistem em <code>localStorage</code>{" "}
            (panda_accent_color, panda_custom_logo, panda_custom_name).
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === "notifications" && (
        <div className="pf-settings-section">
          <h2>🔔 Notifications</h2>
          <p>Configure suas preferências de notificação</p>
          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Notificações por Email</div>
                <div className="pf-settings-sublabel">
                  Receber updates por email
                </div>
              </div>
              <div
                className={`pf-toggle ${notifications.email ? "active" : ""}`}
                onClick={() => toggleNotification("email")}
              />
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Push Notifications</div>
                <div className="pf-settings-sublabel">Alertas no navegador</div>
              </div>
              <div
                className={`pf-toggle ${notifications.push ? "active" : ""}`}
                onClick={() => toggleNotification("push")}
              />
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Sons</div>
                <div className="pf-settings-sublabel">Sons de notificação</div>
              </div>
              <div
                className={`pf-toggle ${notifications.sounds ? "active" : ""}`}
                onClick={() => toggleNotification("sounds")}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Settings Section */}
      {activeSection === "ai" && (
        <div className="pf-settings-section">
          <h2>🧠 AI Settings</h2>
          <p>Configure o Google Gemini</p>
          <div className="pf-settings-card">
            <div className="pf-settings-label">Modelo Padrão</div>
            <div className="pf-settings-sublabel">Powered by Google Gemini</div>
            <div className="pf-model-grid">
              {GEMINI_MODELS.map((model) => (
                <div
                  key={model.id}
                  className={`pf-model-card ${selectedModel === model.id ? "active" : ""}`}
                  onClick={() => changeModel(model.id)}
                >
                  <div className="pf-model-name">{model.name}</div>
                  <div className="pf-model-desc">{model.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Auto-sugestões</div>
                <div className="pf-settings-sublabel">
                  IA ajuda enquanto você trabalha
                </div>
              </div>
              <div className="pf-toggle active" />
            </div>
          </div>
        </div>
      )}

      {/* Wallet Section */}
      {activeSection === "wallet" && (
        <WalletSection
          uid={uid}
          miningEnabled={miningEnabled}
          miningTotal={miningTotal}
        />
      )}

      {/* Mining / Partner Mode Section */}
      {activeSection === "mining" && (
        <div className="pf-settings-section">
          <h2>⛏️ Partner Mode (Mining)</h2>
          <p>Ganhe Panda Coins usando recursos ociosos do seu computador</p>
          <div
            className="pf-settings-card"
            style={{
              background: "rgba(102,126,234,0.06)",
              border: "1px solid rgba(102,126,234,0.2)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
            >
              <span style={{ fontSize: "22px" }}>ℹ️</span>
              <div style={{ lineHeight: "1.6", fontSize: "13px" }}>
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "4px",
                    color: "var(--accent-color, #667eea)",
                  }}
                >
                  Como funciona o Partner Mode
                </div>
                <div
                  className="pf-settings-sublabel"
                  style={{ lineHeight: "1.6" }}
                >
                  Quando ativado, o Panda Factory utiliza CPU/GPU ociosa do seu
                  computador para minerar criptomoeda de forma nativa (via Rust
                  Agent). Você recebe <strong>60%</strong> do valor minerado
                  convertido em Panda Coins — os outros 40% cobrem impostos,
                  conversão e infraestrutura.
                  <br />
                  <br />
                  <strong>Padrão:</strong> Sempre desligado.{" "}
                  <strong>Opt-in</strong> — você ativa manualmente.
                  <br />
                  <strong>Controle total:</strong> Desative a qualquer momento
                  aqui no Settings.
                  <br />
                  <strong>Sem surpresas:</strong> Consumo energético pode
                  aumentar levemente com GPU ativada.
                </div>
              </div>
            </div>
          </div>
          {!miningEnabled && (
            <div
              className="pf-settings-card"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "12px",
                textAlign: "center",
                padding: "24px 20px",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>⛏️</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#f59e0b",
                  marginBottom: "6px",
                }}
              >
                Mineração Desligada
              </div>
              <div
                className="pf-settings-sublabel"
                style={{
                  lineHeight: "1.6",
                  maxWidth: "420px",
                  margin: "0 auto",
                  fontSize: "13px",
                }}
              >
                Ligue o Partner Mode e ganhe Panda Coins automaticamente
                enquanto seu computador está ocioso. Sem custos extras, desative
                quando quiser.
              </div>
            </div>
          )}
          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">⛏️ Ativar Partner Mode</div>
                <div className="pf-settings-sublabel">
                  Mineração passiva com recursos ociosos (opt-in, desligado por
                  padrão)
                </div>
              </div>
              <div
                className={`pf-toggle ${miningEnabled ? "active" : ""}`}
                onClick={toggleMining}
              />
            </div>
          </div>
          <div
            className="pf-settings-card"
            style={{
              opacity: miningEnabled ? 1 : 0.45,
              pointerEvents: miningEnabled ? "auto" : "none",
            }}
          >
            <div className="pf-settings-label">Limites de Recursos</div>
            <div
              className="pf-settings-sublabel"
              style={{ marginBottom: "12px" }}
            >
              Controle quanto do seu hardware é utilizado
            </div>
            <div className="pf-settings-row">
              <div style={{ flex: 1 }}>
                <div className="pf-settings-label">Limite CPU: {cpuLimit}%</div>
                <input
                  type="range"
                  min="25"
                  max="75"
                  step="5"
                  value={cpuLimit}
                  onChange={(e) => handleCpuLimit(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    accentColor: "#f59e0b",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    opacity: 0.5,
                    marginTop: "4px",
                  }}
                >
                  <span>25% (Baixo)</span>
                  <span>50% (Equilibrado)</span>
                  <span>75% (Alto)</span>
                </div>
              </div>
            </div>
            <div className="pf-settings-row" style={{ marginTop: "8px" }}>
              <div>
                <div className="pf-settings-label">🖥️ Mineração GPU</div>
                <div className="pf-settings-sublabel">
                  Ativar GPU para ganhos maiores
                </div>
              </div>
              <div
                className={`pf-toggle ${gpuMining ? "active" : ""}`}
                onClick={toggleGpu}
              />
            </div>
          </div>
          <div className="pf-settings-card">
            <div className="pf-settings-label" style={{ marginBottom: "8px" }}>
              📊 Estatísticas de Mineração
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Status</div>
              </div>
              <span
                className={`pf-status-badge ${miningEnabled ? "online" : "offline"}`}
              >
                {miningEnabled
                  ? `⛏️ Minerando${gpuMining ? " (CPU+GPU)" : " (CPU)"}`
                  : "⏸️ Inativo"}
              </span>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Perfil de Hardware</div>
              </div>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "12px",
                  color: gpuMining ? "#10b981" : "#f59e0b",
                }}
              >
                {gpuMining
                  ? cpuLimit >= 75
                    ? "🌲 Forest"
                    : cpuLimit >= 50
                      ? "🌳 Tree"
                      : "🌿 Sprout"
                  : cpuLimit >= 50
                    ? "🌿 Sprout"
                    : "🌱 Seed"}
              </span>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Hashrate Estimado</div>
              </div>
              <span
                style={{
                  fontWeight: 600,
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              >
                {miningEnabled
                  ? `~${gpuMining ? (cpuLimit >= 75 ? "4.2" : "2.8") : cpuLimit >= 50 ? "1.1" : "0.6"} KH/s`
                  : "— KH/s"}
              </span>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Ganho Estimado</div>
              </div>
              <span style={{ fontWeight: 600, color: "#f59e0b" }}>
                ~{estimatedPc} PC/dia
              </span>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Estimativa Mensal</div>
              </div>
              <span style={{ fontWeight: 600, color: "#10b981" }}>
                ~{estimatedPc * 30} PC/mês
              </span>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Total Acumulado</div>
              </div>
              <span style={{ fontWeight: 600 }}>{miningTotal} PC</span>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Ciclo de Pagamento</div>
              </div>
              <span style={{ fontWeight: 500, fontSize: "12px" }}>
                End-of-Day (23:59 UTC)
              </span>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Uptime Hoje</div>
              </div>
              <span style={{ fontWeight: 500, fontSize: "12px" }}>
                {miningEnabled ? "0h 0m (recém ativado)" : "—"}
              </span>
            </div>
          </div>
          <div
            className="pf-settings-info"
            style={{ fontSize: "11px", marginTop: "4px", opacity: 0.6 }}
          >
            💡 Fator de conversão: x0.60 flat (60% User / 40% Panda). Válido
            para todos os tiers. Execução real requer{" "}
            <strong>Rust Agent</strong> (binário nativo) — a interface web é
            apenas o painel de controle.
          </div>
        </div>
      )}

      {/* Security Section */}
      {activeSection === "security" && (
        <div className="pf-settings-section">
          <h2>🔒 Security</h2>
          <p>Configurações de segurança da conta</p>
          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Autenticação 2FA</div>
                <div className="pf-settings-sublabel">
                  Proteção extra com Google Auth
                </div>
              </div>
              <button className="pf-btn-secondary">Configurar</button>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Sessões Ativas</div>
                <div className="pf-settings-sublabel">
                  1 dispositivo conectado
                </div>
              </div>
              <button className="pf-btn-secondary">Ver</button>
            </div>
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">Alterar Senha</div>
                <div className="pf-settings-sublabel">
                  Última alteração: nunca
                </div>
              </div>
              <button className="pf-btn-secondary">Alterar</button>
            </div>
          </div>
          <div className="pf-settings-card">
            <div className="pf-settings-label">🛡️ Panda Defend</div>
            <div className="pf-settings-sublabel">
              Sistema de proteção ativo
            </div>
            <div className="pf-defend-status">
              <span className="pf-status-badge online">11 Regras Ativas</span>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Section */}
      {activeSection === "integrations" && (
        <div className="pf-settings-section">
          <h2>🔌 Integrations</h2>
          <p>Conexões MCP (Model Context Protocol)</p>
          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div>
                <div className="pf-settings-label">🔗 MCP Server</div>
                <div className="pf-settings-sublabel">
                  Conexão com ferramentas externas
                </div>
              </div>
              <span className="pf-status-badge offline">Desconectado</span>
            </div>
          </div>
          <div className="pf-settings-card">
            <div className="pf-settings-label">Serviços Conectados</div>
            <div className="pf-integration-list">
              <div className="pf-integration-item">
                <span>📊 Google Sheets</span>
                <span className="pf-status-badge offline">—</span>
              </div>
              <div className="pf-integration-item">
                <span>📁 Google Drive</span>
                <span className="pf-status-badge offline">—</span>
              </div>
              <div className="pf-integration-item">
                <span>🗓️ Google Calendar</span>
                <span className="pf-status-badge offline">—</span>
              </div>
            </div>
          </div>
          <div className="pf-settings-info">
            ℹ️ Sistema usa MCP (sem RAG). IA powered by Gemini only.
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === "about" && (
        <div className="pf-settings-section">
          <h2>ℹ️ About</h2>
          <p>Panda Fabrics Information</p>
          <div className="pf-settings-card">
            <div className="pf-about-logo">
              <img
                src={PANDA_LOGO}
                alt="Panda Fabrics"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
            <div className="pf-about-title">Panda Fabrics</div>
            <div className="pf-about-version">v6.2 Founder Edition</div>
          </div>
          <div className="pf-settings-card">
            <div className="pf-settings-row">
              <div className="pf-settings-label">Canvas Engine</div>
              <div className="pf-settings-sublabel">TLDraw v2.x</div>
            </div>
            <div className="pf-settings-row">
              <div className="pf-settings-label">AI Engine</div>
              <div className="pf-settings-sublabel">Google Gemini</div>
            </div>
            <div className="pf-settings-row">
              <div className="pf-settings-label">License</div>
              <div className="pf-settings-sublabel">Founder Lifetime</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Embedded: render content directly, no overlay
  if (embedded) {
    return (
      <div
        className="pf-settings-modal"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {sidebar}
        {contentPane}
      </div>
    );
  }

  // Standalone: wrap in overlay
  return (
    <div className="pf-settings-overlay" onClick={onClose}>
      <div className="pf-settings-modal" onClick={(e) => e.stopPropagation()}>
        {sidebar}
        {contentPane}
      </div>
    </div>
  );
}

/**
 * 💰 WalletSection — Real-time Panda Coin Wallet
 * Uses useWallet hook for Firebase RTDB subscription.
 */
function WalletSection({ uid, miningEnabled, miningTotal }) {
  const { balance, balanceBRL, transactions, isLoading, mode, refresh } =
    useWallet(uid);
  const [purchaseCode, setPurchaseCode] = useState("");
  const [activationState, setActivationState] = useState({
    status: "idle",
    message: "",
  });

  const handleActivate = async () => {
    if (!purchaseCode.trim()) return;
    setActivationState({
      status: "loading",
      message: "Validando seu código...",
    });
    try {
      const res = await License.activate(purchaseCode.trim());
      if (res.status === "SUCCESS") {
        setActivationState({
          status: "success",
          message: "Licença ativada com sucesso! Recarregando tela...",
        });
        setPurchaseCode("");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setActivationState({
          status: "error",
          message: res.error || res.message || "Código inválido ou já ativado.",
        });
      }
    } catch (err) {
      setActivationState({ status: "error", message: err.message });
    }
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return (
      d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) +
      " " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const txIcon = (type) => (type === "credit" ? "📥" : "📤");
  const txColor = (type) => (type === "credit" ? "#10b981" : "#ef4444");

  return (
    <div className="pf-settings-section">
      <h2>
        💰 Wallet{" "}
        <span
          style={{
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "8px",
            fontWeight: 600,
            background:
              mode === "real"
                ? "rgba(16,185,129,0.15)"
                : "rgba(245,158,11,0.15)",
            color: mode === "real" ? "#10b981" : "#f59e0b",
          }}
        >
          {mode === "real" ? "🟢 Live" : "🟡 Mock"}
        </span>
      </h2>
      <p>Gerencie seus Panda Coins</p>

      {/* Hero Balance Card */}
      <div className="pf-settings-card pf-wallet-hero">
        <div className="pf-wallet-balance">
          <div className="pf-wallet-icon">
            <img
              src="./panda-icon.png"
              alt="Panda"
              style={{ width: "24px", height: "24px" }}
            />
          </div>
          <div className="pf-wallet-amount">
            {isLoading ? "..." : `${balance.toLocaleString()} PC`}
          </div>
          <div className="pf-wallet-usd">
            ≈ R${" "}
            {isLoading
              ? "—"
              : parseFloat(balanceBRL).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}{" "}
            BRL
          </div>
        </div>
        <div className="pf-wallet-actions">
          <button className="pf-btn-primary">💳 Comprar PC</button>
          <button className="pf-btn-secondary">📤 Transferir</button>
          <button
            className="pf-btn-secondary"
            onClick={refresh}
            title="Atualizar saldo"
            style={{ minWidth: "auto", padding: "6px 10px" }}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Activation Card */}
      <div
        className="pf-settings-card"
        style={{ background: "var(--bg-card-hover, rgba(0,0,0,0.02))" }}
      >
        <div
          className="pf-settings-label"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          🔑 Ativar Licença ou Encapsulado
        </div>
        <div className="pf-settings-sublabel" style={{ marginBottom: "12px" }}>
          Se você comprou um produto (Starter Pack, Extensões) no Hotmart ou
          Kiwify, insira o seu <strong>Purchase Code</strong> abaixo.
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Cole seu código aqui... (ex: a1b2c3d4...)"
            value={purchaseCode}
            onChange={(e) => setPurchaseCode(e.target.value)}
            disabled={activationState.status === "loading"}
            className="pf-wl-input"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, rgba(100,100,100,0.2))",
              background: "var(--bg-input, rgba(255,255,255,0.05))",
              color: "inherit",
              outline: "none",
              fontFamily: "monospace",
              fontSize: "13px",
            }}
          />
          <button
            className="pf-btn-primary"
            onClick={handleActivate}
            disabled={
              activationState.status === "loading" || !purchaseCode.trim()
            }
            style={{ padding: "8px 16px", borderRadius: "8px" }}
          >
            {activationState.status === "loading" ? "⏳" : "🔓 Ativar"}
          </button>
        </div>
        {activationState.message && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              fontWeight: 600,
              color: activationState.status === "error" ? "#ef4444" : "#10b981",
              padding: "8px 12px",
              borderRadius: "6px",
              background:
                activationState.status === "error"
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(16,185,129,0.1)",
            }}
          >
            {activationState.message}
          </div>
        )}
      </div>

      {/* Plan & Mining Stats */}
      <div className="pf-settings-card">
        <div className="pf-settings-row">
          <div>
            <div className="pf-settings-label">Plano Atual</div>
            <div className="pf-settings-sublabel">
              Founder Edition (Lifetime)
            </div>
          </div>
          <span className="pf-status-badge online">Ativo</span>
        </div>
        <div className="pf-settings-row">
          <div>
            <div className="pf-settings-label">Créditos Mensais</div>
            <div className="pf-settings-sublabel">100 PC grátis/mês</div>
          </div>
          <span className="pf-status-badge online">Disponível</span>
        </div>
        <div className="pf-settings-row">
          <div>
            <div className="pf-settings-label">⛏️ Mining Earned</div>
            <div className="pf-settings-sublabel">
              Total ganho via Partner Mode
            </div>
          </div>
          <span
            className="pf-status-badge"
            style={{
              background: miningEnabled
                ? "rgba(16,185,129,0.15)"
                : "rgba(255,255,255,0.05)",
              color: miningEnabled ? "#10b981" : "#888",
            }}
          >
            {miningTotal} PC {miningEnabled ? "" : "(OFF)"}
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="pf-settings-card">
        <div className="pf-settings-label" style={{ marginBottom: "12px" }}>
          📜 Histórico de Transações
        </div>
        {transactions.length === 0 ? (
          <div
            className="pf-settings-sublabel"
            style={{ textAlign: "center", padding: "16px" }}
          >
            Nenhuma transação ainda
          </div>
        ) : (
          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {transactions.slice(0, 10).map((tx) => (
              <div
                key={tx.id}
                className="pf-settings-row"
                style={{
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "14px" }}>{txIcon(tx.type)}</span>
                  <div>
                    <div
                      className="pf-settings-label"
                      style={{ fontSize: "12px" }}
                    >
                      {tx.description}
                    </div>
                    <div
                      className="pf-settings-sublabel"
                      style={{ fontSize: "10px" }}
                    >
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: txColor(tx.type),
                    fontFamily: "monospace",
                  }}
                >
                  {tx.type === "credit" ? "+" : "−"}
                  {tx.amount} PC
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PFSettings;
