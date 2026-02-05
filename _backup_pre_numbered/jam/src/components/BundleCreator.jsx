import React, { useState } from "react";
import "./BundleCreator.css";

/**
 * 📦 Bundle Creator UI
 *
 * Creates plugin bundles for distribution via Panda Store.
 * Based on PF_MASTER_ARCHITECTURE.md §26.1
 *
 * Bundle = Plugins + Modules + Assets + Configs
 */

export function BundleCreator({ availablePlugins = [], onClose, onCreate }) {
  const [bundleName, setBundleName] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");
  const [selectedPlugins, setSelectedPlugins] = useState([]);
  const [priceUSD, setPriceUSD] = useState(0);
  const [hookPlatform, setHookPlatform] = useState("landing");

  const HOOK_PLATFORMS = [
    { id: "landing", name: "Landing Page", icon: "🌐" },
    { id: "kiwify", name: "Kiwify", icon: "🥝" },
    { id: "hotmart", name: "Hotmart", icon: "🔥" },
    { id: "steam", name: "Steam", icon: "🎮" },
    { id: "appstore", name: "App Store", icon: "🍎" },
    { id: "playstore", name: "Play Store", icon: "🤖" },
    { id: "api", name: "API Hook", icon: "🔌" },
  ];

  // Mock available plugins if none provided
  const plugins =
    availablePlugins.length > 0
      ? availablePlugins
      : [
          { id: "crm", name: "Panda CRM", icon: "📱", category: "core" },
          { id: "trading", name: "Trading Hub", icon: "📊", category: "core" },
          { id: "brain", name: "Panda Brain", icon: "🧠", category: "core" },
          {
            id: "social",
            name: "Social Manager",
            icon: "💬",
            category: "addon",
          },
          {
            id: "analytics",
            name: "Analytics Pro",
            icon: "📈",
            category: "addon",
          },
          {
            id: "automation",
            name: "Automation Suite",
            icon: "⚡",
            category: "addon",
          },
        ];

  const togglePlugin = (pluginId) => {
    setSelectedPlugins((prev) =>
      prev.includes(pluginId)
        ? prev.filter((id) => id !== pluginId)
        : [...prev, pluginId],
    );
  };

  const handleCreate = () => {
    if (!bundleName.trim()) {
      alert("Nome do bundle é obrigatório");
      return;
    }
    if (selectedPlugins.length === 0) {
      alert("Selecione pelo menos um plugin");
      return;
    }

    const bundle = {
      id: `bundle-${Date.now()}`,
      name: bundleName,
      description: bundleDescription,
      plugins: selectedPlugins,
      priceUSD,
      hookPlatform,
      createdAt: new Date().toISOString(),
    };

    console.log("📦 Bundle created:", bundle);
    onCreate && onCreate(bundle);
    onClose();
  };

  const estimatedSize = selectedPlugins.length * 256; // KB estimate

  return (
    <div className="bundle-overlay" onClick={onClose}>
      <div className="bundle-creator" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="bundle-header">
          <h2>📦 Bundle Creator</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="bundle-content">
          {/* Basic Info */}
          <section className="bundle-section">
            <h3>📝 Informações do Bundle</h3>

            <div className="form-group">
              <label>Nome do Bundle *</label>
              <input
                type="text"
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
                placeholder="Meu Bundle Incrível"
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={bundleDescription}
                onChange={(e) => setBundleDescription(e.target.value)}
                placeholder="O que esse bundle faz?"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Preço (USD)</label>
              <input
                type="number"
                value={priceUSD}
                onChange={(e) => setPriceUSD(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
              />
            </div>
          </section>

          {/* Plugin Selection */}
          <section className="bundle-section">
            <h3>🔌 Selecionar Plugins</h3>
            <p className="section-hint">
              Escolha os plugins que farão parte do bundle
            </p>

            <div className="plugins-grid">
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className={`plugin-card ${selectedPlugins.includes(plugin.id) ? "selected" : ""}`}
                  onClick={() => togglePlugin(plugin.id)}
                >
                  <span className="plugin-icon">{plugin.icon}</span>
                  <span className="plugin-name">{plugin.name}</span>
                  <span className={`plugin-category ${plugin.category}`}>
                    {plugin.category}
                  </span>
                  {selectedPlugins.includes(plugin.id) && (
                    <span className="plugin-check">✓</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Hook Platform */}
          <section className="bundle-section">
            <h3>🔗 Plataforma de Distribuição</h3>
            <p className="section-hint">Escolha onde o bundle será vendido</p>

            <div className="platforms-grid">
              {HOOK_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  className={`platform-btn ${hookPlatform === platform.id ? "selected" : ""}`}
                  onClick={() => setHookPlatform(platform.id)}
                >
                  <span className="platform-icon">{platform.icon}</span>
                  <span className="platform-name">{platform.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Summary */}
          <section className="bundle-summary">
            <h3>📊 Resumo</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Plugins</span>
                <span className="summary-value">{selectedPlugins.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tamanho Est.</span>
                <span className="summary-value">{estimatedSize} KB</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Preço</span>
                <span className="summary-value">${priceUSD.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Plataforma</span>
                <span className="summary-value">
                  {HOOK_PLATFORMS.find((p) => p.id === hookPlatform)?.name}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bundle-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-create" onClick={handleCreate}>
            📦 Criar Bundle
          </button>
        </footer>
      </div>
    </div>
  );
}

export default BundleCreator;
