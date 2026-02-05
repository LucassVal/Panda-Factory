import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * 🐼 Jam Dock v4.2 - Draggable Left Sidebar
 *
 * Features:
 * - DRAGGABLE position (anywhere on screen)
 * - Drawing tools (from TLDraw)
 * - Fixed items: Catalog, Store, Dev Mode
 * - Auto-expand on new items
 * - Position persisted to localStorage
 */
function JamDock({
  onCatalogClick,
  onToolsClick,
  plugins = [],
  onDevModeToggle,
  devMode,
}) {
  const [activeToolSection, setActiveToolSection] = useState(null);
  const [devModeActive, setDevModeActive] = useState(false);
  const [activeTool, setActiveTool] = useState("select");
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: null }); // null = centered
  const dockRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

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

  // Drag handlers
  const handleMouseDown = useCallback((e) => {
    // Only drag from dock background, not buttons
    if (e.target.closest(".jam-dock-item")) return;

    e.preventDefault();
    setIsDragging(true);

    const rect = dockRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      // Constrain to viewport
      const maxX = window.innerWidth - (dockRef.current?.offsetWidth || 70);
      const maxY = window.innerHeight - (dockRef.current?.offsetHeight || 200);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Drawing tools
  const drawingTools = [
    { id: "select", icon: "👆", label: "Selecionar", tool: "select" },
    { id: "hand", icon: "✋", label: "Mover", tool: "hand" },
    { id: "draw", icon: "✏️", label: "Desenhar", tool: "draw" },
    { id: "eraser", icon: "🧹", label: "Apagar", tool: "eraser" },
    { id: "arrow", icon: "➡️", label: "Seta", tool: "arrow" },
    { id: "text", icon: "🔤", label: "Texto", tool: "text" },
    { id: "note", icon: "📝", label: "Nota", tool: "note" },
    { id: "frame", icon: "🖼️", label: "Frame", tool: "frame" },
  ];

  // App items (Catalog only - Store is in header)
  const appItems = [
    {
      id: "catalog",
      icon: "📁",
      label: "Meu Catálogo",
      action: onCatalogClick,
    },
  ];

  // Set tool in TLDraw
  const setTLDrawTool = (toolId) => {
    setActiveTool(toolId);
    const editor = window.TLDrawEditor;
    if (editor) {
      editor.setCurrentTool(toolId);
    }
  };

  // Dev mode
  const handleDevMode = () => {
    setDevModeActive(!devModeActive);
    if (onDevModeToggle) onDevModeToggle(!devModeActive);
  };

  // Toggle section
  const toggleSection = (section) => {
    setActiveToolSection(activeToolSection === section ? null : section);
  };

  // Plugin items
  const pluginItems = plugins.map((p) => ({
    id: p.id,
    icon: p.icon || "🧩",
    label: p.name,
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
    <nav
      className={`jam-left-dock ${isDragging ? "dragging" : ""}`}
      ref={dockRef}
      style={dockStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle */}
      <div className="jam-dock-handle" title="Arraste para mover">
        ⋮⋮
      </div>

      <div className="jam-dock-items">
        {/* Drawing Tools - Opens Right Toolbar */}
        <button
          className="jam-dock-item section-toggle"
          onClick={onToolsClick}
          title="🎨 Ferramentas"
        >
          🎨
        </button>

        <div className="jam-dock-separator" />

        {/* App Items */}
        {appItems.map((item) => (
          <button
            key={item.id}
            className="jam-dock-item"
            onClick={item.action || (() => console.log(item.id))}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}

        <div className="jam-dock-separator" />

        {/* Dev Mode */}
        <button
          className={`jam-dock-item dev-toggle ${devModeActive ? "active" : ""}`}
          onClick={handleDevMode}
          title="🛠️ Dev Mode"
        >
          {devModeActive ? "🔧" : "🛠️"}
        </button>

        {/* Dynamic Plugins */}
        {pluginItems.length > 0 && (
          <>
            <div className="jam-dock-separator" />
            <div className="jam-dock-dynamic">
              {pluginItems.map((item) => (
                <button
                  key={item.id}
                  className="jam-dock-item dynamic"
                  onClick={() => console.log("Open:", item.id)}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default JamDock;
