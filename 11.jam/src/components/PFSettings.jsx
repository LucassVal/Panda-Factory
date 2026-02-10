import React, { useState, useEffect } from "react";
import "./PFSettings.css";

/**
 * 🐼 Jam Settings Modal v5.1
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
const PANDA_LOGO = "🐼";

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

function PFSettings({ isOpen, onClose }) {
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
    } catch { return { displayName: "CONVIDADO", email: "—", userType: "user" }; }
  })();

  // Estados com localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("panda_dark_mode");
    return saved !== null ? JSON.parse(saved) : true;
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

  // Aplicar dark mode ao carregar
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }, [darkMode]);

  // Aplicar cor de destaque
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor);
  }, [accentColor]);

  if (!isOpen) return null;

  const sections = [
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "appearance", icon: "🎨", label: "Appearance" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
    { id: "ai", icon: "🧠", label: "AI Settings" },
    { id: "wallet", icon: "💰", label: "Wallet" },
    { id: "security", icon: "🔒", label: "Security" },
    { id: "integrations", icon: "🔌", label: "Integrations" },
    { id: "developer", icon: "🛠️", label: "Developer" },
    { id: "about", icon: "ℹ️", label: "About" },
  ];

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("panda_dark_mode", JSON.stringify(newMode));
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

  return (
    <div className="pf-settings-overlay" onClick={onClose}>
      <div className="pf-settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="pf-settings-sidebar">
          <div className="pf-settings-user">
            <div className="pf-settings-avatar">{PANDA_LOGO}</div>
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

        {/* Content */}
        <div className="pf-settings-content">
          <button className="pf-settings-close" onClick={onClose}>
            ×
          </button>

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="pf-settings-section">
              <h2>👤 Profile</h2>
              <p>Manage your account information</p>
              <div className="pf-settings-card">
                <div className="pf-settings-row">
                  <div>
                    <div className="pf-settings-label">Username</div>
                    <div className="pf-settings-sublabel">{userData.displayName.toLowerCase().replace(/\s+/g, '.')}</div>
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

          {/* Appearance Section */}
          {activeSection === "appearance" && (
            <div className="pf-settings-section">
              <h2>🎨 Appearance</h2>
              <p>Personalize o visual (White-Label)</p>

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
                  Escolha a cor principal do sistema
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
                    <div className="pf-settings-label">
                      Notificações por Email
                    </div>
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
                    <div className="pf-settings-sublabel">
                      Alertas no navegador
                    </div>
                  </div>
                  <div
                    className={`pf-toggle ${notifications.push ? "active" : ""}`}
                    onClick={() => toggleNotification("push")}
                  />
                </div>
                <div className="pf-settings-row">
                  <div>
                    <div className="pf-settings-label">Sons</div>
                    <div className="pf-settings-sublabel">
                      Sons de notificação
                    </div>
                  </div>
                  <div
                    className={`pf-toggle ${notifications.sounds ? "active" : ""}`}
                    onClick={() => toggleNotification("sounds")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Settings Section - GEMINI ONLY */}
          {activeSection === "ai" && (
            <div className="pf-settings-section">
              <h2>🧠 AI Settings</h2>
              <p>Configure o Google Gemini</p>

              <div className="pf-settings-card">
                <div className="pf-settings-label">Modelo Padrão</div>
                <div className="pf-settings-sublabel">
                  Powered by Google Gemini
                </div>
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
            <div className="pf-settings-section">
              <h2>💰 Wallet</h2>
              <p>Gerencie seus Panda Coins</p>

              <div className="pf-settings-card pf-wallet-hero">
                <div className="pf-wallet-balance">
                  <div className="pf-wallet-icon">🐼</div>
                  <div className="pf-wallet-amount">500 PC</div>
                  <div className="pf-wallet-usd">≈ R$ 5,00 BRL</div>
                </div>
                <div className="pf-wallet-actions">
                  <button className="pf-btn-primary">💳 Comprar PC</button>
                  <button className="pf-btn-secondary">📤 Transferir</button>
                </div>
              </div>

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
                    <div className="pf-settings-sublabel">
                      100 PC grátis/mês
                    </div>
                  </div>
                  <span className="pf-status-badge online">Disponível</span>
                </div>
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
                  <span className="pf-status-badge online">
                    11 Regras Ativas
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Section - MCP */}
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

          {/* Developer Section */}
          {activeSection === "developer" && (
            <div className="pf-settings-section">
              <h2>🛠️ Developer</h2>
              <p>Ferramentas para desenvolvedores</p>

              <div className="pf-settings-card">
                <div className="pf-settings-row">
                  <div>
                    <div className="pf-settings-label">Dev Mode</div>
                    <div className="pf-settings-sublabel">
                      Ativar console e debug
                    </div>
                  </div>
                  <div className="pf-toggle" />
                </div>
                <div className="pf-settings-row">
                  <div>
                    <div className="pf-settings-label">API Key</div>
                    <div className="pf-settings-sublabel">
                      pf_live_••••••••
                    </div>
                  </div>
                  <button className="pf-btn-secondary">Copiar</button>
                </div>
              </div>

              <div className="pf-settings-card">
                <div className="pf-settings-label">📦 SDK & APIs</div>
                <div className="pf-settings-sublabel">Panda SDK v5.0</div>
                <div className="pf-code-block">
                  <code>npm install @panda-factory/sdk</code>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === "about" && (
            <div className="pf-settings-section">
              <h2>ℹ️ About</h2>
              <p>Panda Fabrics Information</p>
              <div className="pf-settings-card">
                <div className="pf-about-logo">{PANDA_LOGO}</div>
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
      </div>
    </div>
  );
}

export default PFSettings;
