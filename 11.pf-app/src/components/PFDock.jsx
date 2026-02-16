import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * PF Dock v6.3 - Extended Dock (8 items)
 *
 * Features:
 * - DRAGGABLE position (anywhere on screen)
 * - Drawing tools (opens Right Toolbar)
 * - Fixed items: Catalog, Store, Settings, Dev Mode
 * - NEW: Finance, Gasometer, Council panels
 * - Dynamic plugins with right-click: ABRIR / FECHAR / DESINSTALAR
 * - Position persisted to localStorage
 * - Text: UPPERCASE standard
 */
function PFDock({
  onCatalogClick,
  onToolsClick,
  onStoreClick,
  onSettingsClick,
  onFinanceClick,
  onGasometerClick,
  onCouncilClick,
  plugins = [],
  onPluginOpen,
  onPluginClose,
  onPluginUninstall,
  onDevModeToggle,
  devMode,
  isFounder = false,
}) {
  const [devModeActive, setDevModeActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPending, setDragPending] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: null }); // null = centered
  const [contextMenu, setContextMenu] = useState(null); // { x, y, pluginId }
  const dockRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const dragThreshold = 5; // px before drag activates

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem("panda_dock_position");
    if (saved) {
      try {
        setPosition(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save position on change
  useEffect(() => {
    if (position.y !== null) {
      localStorage.setItem("panda_dock_position", JSON.stringify(position));
    }
  }, [position]);

  // Close context menu on click outside
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [contextMenu]);

  // Drag handlers — with threshold to avoid stealing clicks
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest(".pf-dock-item") || e.target.closest("button")) return;
    e.preventDefault();
    const rect = dockRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragPending(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging && !dragPending) return;

      // Check threshold before starting drag
      if (!isDragging && dragPending) {
        const dx = Math.abs(e.clientX - dragStart.current.x);
        const dy = Math.abs(e.clientY - dragStart.current.y);
        if (dx < dragThreshold && dy < dragThreshold) return;
        setIsDragging(true);
        setDragPending(false);
      }

      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      const maxX = window.innerWidth - (dockRef.current?.offsetWidth || 70);
      const maxY = window.innerHeight - (dockRef.current?.offsetHeight || 200);
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    },
    [isDragging, dragPending],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragPending(false);
  }, []);

  useEffect(() => {
    if (isDragging || dragPending) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragPending, handleMouseMove, handleMouseUp]);

  // Handle plugin click
  const handlePluginClick = (plugin) => {
    if (onPluginOpen) {
      onPluginOpen(plugin);
    } else {
      console.log("📦 Plugin opened:", plugin.id, plugin.name);
    }
  };

  // Handle right-click on plugin
  const handlePluginContextMenu = (e, plugin) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      plugin,
    });
  };

  // Uninstall plugin
  const handleUninstall = () => {
    if (!contextMenu) return;
    const { plugin } = contextMenu;
    if (onPluginUninstall) {
      onPluginUninstall(plugin.id);
    }
    setContextMenu(null);
  };

  // Close plugin tab (without uninstalling)
  const handleCloseTab = () => {
    if (!contextMenu) return;
    const { plugin } = contextMenu;
    if (onPluginClose) {
      onPluginClose(plugin.id);
    }
    setContextMenu(null);
  };

  // Dev mode toggle - if already active, re-fire to focus tab
  const handleDevMode = () => {
    if (devModeActive) {
      if (onDevModeToggle) onDevModeToggle(true);
    } else {
      setDevModeActive(true);
      if (onDevModeToggle) onDevModeToggle(true);
    }
  };

  // Plugin items
  const pluginItems = plugins.map((p) => ({
    id: p.id,
    icon: p.icon || "🧩",
    label: p.name,
    data: p,
  }));

  // Style for position
  const dockStyle = {
    position: "fixed",
    left: `${position.x}px`,
    top: position.y !== null ? `${position.y}px` : "50%",
    transform: position.y !== null ? "none" : "translateY(-50%)",
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <>
      <nav
        className={`pf-left-dock ${isDragging ? "dragging" : ""}`}
        ref={dockRef}
        style={dockStyle}
        onMouseDown={handleMouseDown}
        role="toolbar"
        aria-label="Barra de ferramentas principal"
        aria-orientation="vertical"
      >
        {/* Drag Handle */}
        <div className="pf-dock-handle" title="ARRASTE PARA MOVER">
          ⋮⋮
        </div>

        <div className="pf-dock-items">
          {/* ── CORE TOOLS ─── */}
          
          {/* Drawing Tools - Opens Right Toolbar */}
          <button
            className="pf-dock-item section-toggle"
            onClick={onToolsClick}
            title="FERRAMENTAS"
            aria-label="Ferramentas de desenho"
          >
            🎨
          </button>

          {/* Catalog */}
          <button
            className="pf-dock-item"
            onClick={onCatalogClick}
            title="MEU CATÁLOGO"
            aria-label="Meu catálogo de apps"
          >
            📁
          </button>

          <div className="pf-dock-separator" />

          {/* ── QUICK ACCESS ─── */}

          {/* Store */}
          <button
            className="pf-dock-item"
            onClick={onStoreClick}
            title="PANDA STORE (Ctrl+K)"
            aria-label="Abrir Panda Store"
          >
            <img src="./panda-logo.png" alt="Panda Store" style={{ width: 28, height: 28 }} />
          </button>

          <div className="pf-dock-separator" />

          {/* ── ECONOMY & GOVERNANCE ─── */}

          {/* Finance */}
          <button
            className="pf-dock-item"
            onClick={onFinanceClick}
            title="FINANCE"
            aria-label="Open finance panel"
          >
            💰
          </button>

          {/* Gasometer */}
          <button
            className="pf-dock-item"
            onClick={onGasometerClick}
            title="GASOMETER"
            aria-label="Open gasometer panel"
          >
            ⛽
          </button>

          {/* Council */}
          <button
            className="pf-dock-item"
            onClick={onCouncilClick}
            title="PAT COUNCIL"
            aria-label="Open PAT Council"
          >
            🏛️
          </button>

          <div className="pf-dock-separator" />

          {/* ── SYSTEM ─── */}

          {/* Settings */}
          <button
            className="pf-dock-item"
            onClick={onSettingsClick}
            title="CONFIGURAÇÕES (Ctrl+,)"
            aria-label="Configurações"
          >
            ⚙️
          </button>

          {/* Dev Mode — Available to all users */}
          <button
            className={`pf-dock-item dev-toggle ${devModeActive ? "active" : ""}`}
            onClick={handleDevMode}
            title="DEV MODE (Ctrl+D)"
            aria-label={devModeActive ? "Fechar Dev Mode" : "Abrir Dev Mode"}
            aria-expanded={devModeActive}
            aria-pressed={devModeActive}
          >
            {devModeActive ? "🔧" : "🛠️"}
          </button>

          {/* Dynamic Plugins */}
          {pluginItems.length > 0 && (
            <>
              <div className="pf-dock-separator" />
              <div className="pf-dock-dynamic">
                {pluginItems.map((item) => (
                  <button
                    key={item.id}
                    className="pf-dock-item dynamic"
                    onClick={() => handlePluginClick(item.data)}
                    onContextMenu={(e) => handlePluginContextMenu(e, item.data)}
                    title={`${item.label?.toUpperCase()}\n(CLIQUE DIREITO → OPÇÕES)`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Context Menu for plugin uninstall */}
      {contextMenu && (
        <div
          className="pf-dock-context-menu"
          role="menu"
          aria-label={`Opções para ${contextMenu.plugin.name || 'plugin'}`}
          style={{
            position: "fixed",
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 99999,
            background: "rgba(15, 15, 30, 0.95)",
            border: "1px solid rgba(102, 126, 234, 0.3)",
            borderRadius: 8,
            padding: "4px 0",
            minWidth: 160,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "8px 16px",
              fontSize: 12,
              color: "#8b8bab",
              borderBottom: "1px solid rgba(102, 126, 234, 0.15)",
            }}
          >
            {contextMenu.plugin.icon || "🧩"} {contextMenu.plugin.name?.toUpperCase()}
          </div>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "8px 16px",
              background: "none",
              border: "none",
              color: "#e0e0ff",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13,
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(102, 126, 234, 0.15)")}
            onMouseLeave={(e) => (e.target.style.background = "none")}
            onClick={() => handlePluginClick(contextMenu.plugin)}
            role="menuitem"
          >
            📂 ABRIR
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "8px 16px",
              background: "none",
              border: "none",
              color: "#fbbf24",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13,
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(251, 191, 36, 0.15)")}
            onMouseLeave={(e) => (e.target.style.background = "none")}
            onClick={handleCloseTab}
            role="menuitem"
          >
            ✕ FECHAR
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "8px 16px",
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13,
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(239, 68, 68, 0.15)")}
            onMouseLeave={(e) => (e.target.style.background = "none")}
            onClick={handleUninstall}
            role="menuitem"
          >
            🗑️ DESINSTALAR
          </button>
        </div>
      )}
    </>
  );
}

export default PFDock;
