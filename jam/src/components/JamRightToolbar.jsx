import React, { useState, useEffect } from "react";

/**
 * 🐼 Jam Right Toolbar
 * Appears when clicking the drawing tools button on dock
 * Contains all TLDraw tools + DevTools
 *
 * Features:
 * - All drawing tools in one place
 * - DevTools section (when Dev Mode ON)
 * - Collapsible
 * - Position: Right side of screen
 */
function JamRightToolbar({ isOpen, onClose, onToolSelect, devMode = false }) {
  const [activeTool, setActiveTool] = useState("select");
  const [activeSection, setActiveSection] = useState("draw");
  const [gridEnabled, setGridEnabled] = useState(true);

  const toggleGrid = () => {
    setGridEnabled(!gridEnabled);
    if (window.PandaCanvas) {
      window.PandaCanvas.toggleGrid();
    }
  };

  const drawingTools = [
    { id: "select", icon: "👆", label: "Selecionar" },
    { id: "hand", icon: "✋", label: "Mover Canvas" },
    { id: "draw", icon: "✏️", label: "Desenho Livre" },
    { id: "eraser", icon: "🧹", label: "Borracha" },
    { id: "arrow", icon: "➡️", label: "Seta" },
    { id: "line", icon: "📏", label: "Linha" },
    { id: "rectangle", icon: "⬜", label: "Retângulo" },
    { id: "ellipse", icon: "⭕", label: "Círculo" },
    { id: "triangle", icon: "🔺", label: "Triângulo" },
    { id: "text", icon: "🔤", label: "Texto" },
    { id: "note", icon: "📝", label: "Nota Adesiva" },
    { id: "frame", icon: "🖼️", label: "Frame" },
    { id: "image", icon: "🏞️", label: "Imagem" },
  ];

  const devTools = [
    { id: "console", icon: "💻", label: "Console" },
    { id: "mcp", icon: "🧰", label: "MCP Browser" },
    { id: "api", icon: "🔌", label: "API Tester" },
    { id: "treasury", icon: "🏦", label: "PAT Treasury" },
    { id: "constitution", icon: "⚖️", label: "Constitution" },
    { id: "rig", icon: "🦀", label: "RIG Config" },
  ];

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);

    // Set TLDraw tool
    const editor = window.TLDrawEditor;
    if (editor) {
      editor.setCurrentTool(toolId);
    }

    if (onToolSelect) onToolSelect(toolId);
  };

  if (!isOpen) return null;

  return (
    <div className="jam-right-toolbar">
      {/* Header */}
      <div className="jam-toolbar-header">
        <span>🎨 Ferramentas</span>
        <button className="jam-toolbar-close" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Section Tabs */}
      <div className="jam-toolbar-tabs">
        <button
          className={`jam-toolbar-tab ${activeSection === "draw" ? "active" : ""}`}
          onClick={() => setActiveSection("draw")}
        >
          ✏️ Desenho
        </button>
        {devMode && (
          <button
            className={`jam-toolbar-tab ${activeSection === "dev" ? "active" : ""}`}
            onClick={() => setActiveSection("dev")}
          >
            🛠️ DevTools
          </button>
        )}
      </div>

      {/* Drawing Tools */}
      {activeSection === "draw" && (
        <div className="jam-toolbar-section">
          <div className="jam-toolbar-grid">
            {drawingTools.map((tool) => (
              <button
                key={tool.id}
                className={`jam-toolbar-item ${activeTool === tool.id ? "active" : ""}`}
                onClick={() => handleToolClick(tool.id)}
                title={tool.label}
              >
                <span className="jam-toolbar-icon">{tool.icon}</span>
                <span className="jam-toolbar-label">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Canvas Options */}
          <div className="jam-toolbar-divider">
            <span>Opções do Canvas</span>
          </div>

          <div className="jam-toolbar-options">
            <button
              className={`jam-toolbar-option ${gridEnabled ? "active" : ""}`}
              onClick={toggleGrid}
              title="Mostrar/Ocultar Grid"
            >
              <span className="jam-toolbar-icon">📐</span>
              <span className="jam-toolbar-label">Grid</span>
              <span
                className={`jam-toggle-mini ${gridEnabled ? "on" : ""}`}
              ></span>
            </button>
          </div>
        </div>
      )}

      {/* DevTools */}
      {activeSection === "dev" && devMode && (
        <div className="jam-toolbar-section">
          <div className="jam-toolbar-grid">
            {devTools.map((tool) => (
              <button
                key={tool.id}
                className="jam-toolbar-item"
                onClick={() => console.log("DevTool:", tool.id)}
                title={tool.label}
              >
                <span className="jam-toolbar-icon">{tool.icon}</span>
                <span className="jam-toolbar-label">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JamRightToolbar;
