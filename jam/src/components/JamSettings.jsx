import React, { useState } from "react";

/**
 * 🐼 Jam Settings Modal
 * Based on Comp_SettingsModal.html v3.0 Glassmorphism Edition
 *
 * Sections:
 * - Profile, Appearance, Notifications, AI Settings
 * - Wallet, Performance, Security, Integrations
 * - Developer, About
 */
function JamSettings({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [darkMode, setDarkMode] = useState(true);

  if (!isOpen) return null;

  const sections = [
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "appearance", icon: "🎨", label: "Appearance" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
    { id: "ai", icon: "🧠", label: "AI Settings" },
    { id: "wallet", icon: "💰", label: "Wallet" },
    { id: "performance", icon: "⚡", label: "Performance" },
    { id: "security", icon: "🔒", label: "Security" },
    { id: "integrations", icon: "🔌", label: "Integrations" },
    { id: "developer", icon: "📊", label: "Developer" },
    { id: "about", icon: "ℹ️", label: "About" },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="jam-settings-overlay" onClick={onClose}>
      <div className="jam-settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="jam-settings-sidebar">
          {/* User Profile */}
          <div className="jam-settings-user">
            <div className="jam-settings-avatar">🐼</div>
            <div className="jam-settings-user-info">
              <h4>Lucas Valério</h4>
              <span>Founder</span>
            </div>
          </div>

          {/* Nav Items */}
          {sections.map((s) => (
            <div
              key={s.id}
              className={`jam-settings-nav-item ${activeSection === s.id ? "active" : ""}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span>{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="jam-settings-content">
          <button className="jam-settings-close" onClick={onClose}>
            ×
          </button>

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="jam-settings-section">
              <h2>👤 Profile</h2>
              <p>Manage your account information</p>
              <div className="jam-settings-card">
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Username</div>
                    <div className="jam-settings-sublabel">lucas.valerio</div>
                  </div>
                  <button className="jam-btn-secondary">Edit</button>
                </div>
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Email</div>
                    <div className="jam-settings-sublabel">lucas@panda.io</div>
                  </div>
                  <button className="jam-btn-secondary">Edit</button>
                </div>
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Role</div>
                    <div className="jam-settings-sublabel">Founder</div>
                  </div>
                  <span className="jam-status-badge online">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === "appearance" && (
            <div className="jam-settings-section">
              <h2>🎨 Appearance</h2>
              <p>Customize the look and feel</p>
              <div className="jam-settings-card">
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Dark Mode</div>
                    <div className="jam-settings-sublabel">
                      Switch between light and dark
                    </div>
                  </div>
                  <div
                    className={`jam-toggle ${darkMode ? "active" : ""}`}
                    onClick={toggleDarkMode}
                  />
                </div>
              </div>
              <div className="jam-settings-card">
                <div className="jam-settings-label">Accent Color</div>
                <div className="jam-color-picker">
                  <div
                    className="jam-color-dot active"
                    style={{ background: "#667eea" }}
                  />
                  <div
                    className="jam-color-dot"
                    style={{ background: "#10b981" }}
                  />
                  <div
                    className="jam-color-dot"
                    style={{ background: "#f59e0b" }}
                  />
                  <div
                    className="jam-color-dot"
                    style={{ background: "#ef4444" }}
                  />
                  <div
                    className="jam-color-dot"
                    style={{ background: "#8b5cf6" }}
                  />
                  <div
                    className="jam-color-dot"
                    style={{ background: "#ec4899" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Settings Section */}
          {activeSection === "ai" && (
            <div className="jam-settings-section">
              <h2>🧠 AI Settings</h2>
              <p>Configure your AI assistants</p>
              <div className="jam-settings-card">
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Default Provider</div>
                    <div className="jam-settings-sublabel">
                      Primary AI for chat
                    </div>
                  </div>
                  <select className="jam-settings-select">
                    <option>✨ Gemini 2.0</option>
                    <option>💻 Ollama (Local)</option>
                    <option>🔌 MCP Bridge</option>
                  </select>
                </div>
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Auto-suggestions</div>
                    <div className="jam-settings-sublabel">
                      AI helps while you work
                    </div>
                  </div>
                  <div className="jam-toggle active" />
                </div>
              </div>
            </div>
          )}

          {/* Wallet Section */}
          {activeSection === "wallet" && (
            <div className="jam-settings-section">
              <h2>💰 Wallet</h2>
              <p>Manage your Panda Coins</p>
              <div className="jam-settings-card">
                <div className="jam-wallet-balance">
                  <div className="jam-wallet-label">Current Balance</div>
                  <div className="jam-wallet-amount">500 PC</div>
                  <div className="jam-wallet-usd">≈ R$ 5,00</div>
                </div>
              </div>
              <div className="jam-settings-card">
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Free Tier</div>
                    <div className="jam-settings-sublabel">100 PC/month</div>
                  </div>
                  <span className="jam-status-badge online">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Performance Section */}
          {activeSection === "performance" && (
            <div className="jam-settings-section">
              <h2>⚡ Performance</h2>
              <p>GPU and hardware acceleration</p>
              <div className="jam-settings-card">
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">Rust Agent</div>
                    <div className="jam-settings-sublabel">
                      Local hardware acceleration
                    </div>
                  </div>
                  <span className="jam-status-badge offline">Offline</span>
                </div>
                <div className="jam-settings-row">
                  <div>
                    <div className="jam-settings-label">GPU Detection</div>
                    <div className="jam-settings-sublabel">NVIDIA CUDA</div>
                  </div>
                  <span className="jam-status-badge offline">Not detected</span>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === "about" && (
            <div className="jam-settings-section">
              <h2>ℹ️ About</h2>
              <p>Panda Jam Information</p>
              <div className="jam-settings-card">
                <div className="jam-settings-row">
                  <div className="jam-settings-label">Version</div>
                  <div className="jam-settings-sublabel">5.0.0</div>
                </div>
                <div className="jam-settings-row">
                  <div className="jam-settings-label">License</div>
                  <div className="jam-settings-sublabel">Founder Edition</div>
                </div>
                <div className="jam-settings-row">
                  <div className="jam-settings-label">TLDraw</div>
                  <div className="jam-settings-sublabel">
                    v2.x (Canvas Engine)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other sections - placeholder */}
          {["notifications", "security", "integrations", "developer"].includes(
            activeSection,
          ) && (
            <div className="jam-settings-section">
              <h2>
                {sections.find((s) => s.id === activeSection)?.icon}{" "}
                {sections.find((s) => s.id === activeSection)?.label}
              </h2>
              <p>Coming soon...</p>
              <div className="jam-settings-card">
                <div className="jam-settings-row">
                  <div className="jam-settings-label">
                    This section is under development
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JamSettings;
