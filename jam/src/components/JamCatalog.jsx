import React, { useState } from "react";

/**
 * 🐼 Jam Catalog Modal
 * Shows user's installed apps/plugins
 */
function JamCatalog({ isOpen, onClose, plugins = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Default apps (always available)
  const defaultApps = [
    {
      id: "canvas",
      icon: "🎨",
      name: "Canvas",
      description: "Infinite drawing canvas",
    },
    {
      id: "brain",
      icon: "🧠",
      name: "Brain AI",
      description: "AI Assistant (6 Gems)",
    },
    {
      id: "wallet",
      icon: "💰",
      name: "Wallet",
      description: "Panda Coins & Transactions",
    },
    {
      id: "trading",
      icon: "📈",
      name: "Trading Hub",
      description: "cTrader Integration",
    },
    {
      id: "social",
      icon: "📱",
      name: "Social Hub",
      description: "WhatsApp, Twitter, YouTube",
    },
  ];

  const allApps = [...defaultApps, ...plugins];

  const filteredApps = allApps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpen = (app) => {
    console.log("📂 Opening app:", app.id);
    // Future: integrate with PandaDock.addApp() and multi-window
    onClose();
  };

  return (
    <div className="jam-catalog-overlay" onClick={onClose}>
      <div className="jam-catalog-modal" onClick={(e) => e.stopPropagation()}>
        <header className="jam-catalog-header">
          <h2>📁 Meu Catálogo</h2>
          <button className="jam-close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="jam-catalog-search">
          <input
            type="text"
            placeholder="🔍 Buscar apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="jam-catalog-grid">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="jam-catalog-item"
              onClick={() => handleOpen(app)}
            >
              <span className="jam-catalog-icon">{app.icon}</span>
              <div className="jam-catalog-info">
                <span className="jam-catalog-name">{app.name}</span>
                <span className="jam-catalog-desc">{app.description}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="jam-catalog-empty">
            Nenhum app encontrado. Visite a 🏪 Store para instalar novos!
          </div>
        )}
      </div>
    </div>
  );
}

export default JamCatalog;
