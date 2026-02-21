import React, { useState } from "react";

/**
 * JAM CATALOG v4.0
 *
 * Shows ONLY user-installed apps (from Store).
 * Catalog starts EMPTY — everything comes from the Store.
 *
 * Google-First: Google Drive + Canva available as integrations
 * but only after installation from the Store.
 */
function PFCatalog({
  isOpen,
  onClose,
  plugins = [],
  onPluginUninstall,
  onOpenApp,
  embedded,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen && !embedded) return null;

  // Only show installed plugins — catalog is empty by default
  const filteredApps = plugins.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Open app INSIDE the canvas
  const handleOpen = (app) => {
    if (onOpenApp) {
      onOpenApp(app.id, {
        name: app.name,
        icon: app.icon,
      });
    }
  };

  // Uninstall plugin
  const handleUninstall = (e, pluginId) => {
    e.stopPropagation();
    if (onPluginUninstall) onPluginUninstall(pluginId);
  };

  const content = (
    <>
      {/* Search */}
      <div className="pf-catalog-search">
        <input
          type="text"
          placeholder="🔍 BUSCAR APPS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: 12,
          }}
        />
      </div>

      {/* Content */}
      {filteredApps.length > 0 ? (
        <div className="pf-catalog-grid">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="pf-catalog-item"
              onClick={() => handleOpen(app)}
              style={{ position: "relative" }}
            >
              <span className="pf-catalog-icon">{app.icon}</span>
              <div className="pf-catalog-info">
                <span
                  className="pf-catalog-name"
                  style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}
                >
                  {app.name}
                </span>
                <span className="pf-catalog-desc">{app.description}</span>
              </div>

              {/* Uninstall */}
              <button
                onClick={(e) => handleUninstall(e, app.id)}
                title="DESINSTALAR"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#ef4444",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(239, 68, 68, 0.3)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(239, 68, 68, 0.15)")
                }
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="pf-catalog-empty">
          <div className="pf-catalog-empty-icon">📦</div>
          <p className="pf-catalog-empty-title">NENHUM APP INSTALADO</p>
          <p className="pf-catalog-empty-desc">
            Visite a Store para descobrir ferramentas incríveis
          </p>
          <button
            className="pf-btn-primary pf-catalog-empty-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("panda:open-store"))}
          >
            🏪 IR PARA A STORE
          </button>
        </div>
      )}
    </>
  );

  // Embedded mode (inside flexlayout tab)
  if (embedded) {
    return (
      <div style={{ height: "100%", overflow: "auto", background: "#0a0a1a" }}>
        <h2
          style={{
            padding: "16px 16px 8px",
            color: "#e0e0ff",
            fontSize: 16,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          📁 MEU CATÁLOGO
        </h2>
        <p
          style={{
            padding: "0 16px 12px",
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
          }}
        >
          {plugins.length} APPS INSTALADOS
        </p>
        {content}
      </div>
    );
  }

  // Modal mode
  return (
    <div className="pf-catalog-overlay" onClick={onClose}>
      <div className="pf-catalog-modal" onClick={(e) => e.stopPropagation()}>
        <header className="pf-catalog-header">
          <div>
            <h2
              style={{
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: 16,
              }}
            >
              📁 MEU CATÁLOGO
            </h2>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                marginTop: 4,
                textTransform: "uppercase",
              }}
            >
              {plugins.length} APPS INSTALADOS
            </p>
          </div>
          <button className="pf-close-btn" onClick={onClose}>
            ×
          </button>
        </header>
        {content}
      </div>
    </div>
  );
}

export default PFCatalog;
