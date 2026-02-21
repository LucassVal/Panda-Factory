import React, { useState, useEffect } from "react";
import { GeoShapeGeoStyle } from "@tldraw/tldraw";

/**
 * Jam Right Toolbar
 * Appears when clicking the drawing tools button on dock
 * Contains all TLDraw tools + DevTools
 *
 * Features:
 * - All drawing tools in one place
 * - DevTools section (when Dev Mode ON)
 * - Collapsible
 * - Position: Right side of screen
 */
function PFRightToolbar({ isOpen, onClose, onToolSelect }) {
  const [activeTool, setActiveTool] = useState("select");
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

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);

    const editor = window.TLDrawEditor;
    if (!editor) {
      console.warn("⚠️ TLDraw editor not ready — click the CANVAS tab first");
      return;
    }

    try {
      // Map toolbar IDs to TLDraw tools
      // TLDraw v2 uses "geo" tool for shapes
      const geoShapes = {
        rectangle: "rectangle",
        ellipse: "ellipse",
        triangle: "triangle",
      };

      if (geoShapes[toolId]) {
        editor.setCurrentTool("geo");
        // TLDraw v2: set geo style for the specific shape type
        try {
          editor.setStyleForNextShapes(
            GeoShapeGeoStyle,
            geoShapes[toolId],
          );
        } catch (styleErr) {
          console.warn("Geo style set error:", styleErr.message);
        }
      } else if (toolId === "image") {
        // Open file dialog for image upload
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
              const dataUrl = reader.result;
              const assetId = `asset:${Date.now()}`;
              const img = new Image();
              img.src = dataUrl;
              img.onload = () => {
                try {
                  editor.createAssets([
                    {
                      id: assetId,
                      type: "image",
                      typeName: "asset",
                      props: {
                        src: dataUrl,
                        name: file.name,
                        w: img.width,
                        h: img.height,
                        mimeType: file.type,
                        isAnimated: false,
                      },
                    },
                  ]);
                  const center = editor.getViewportScreenCenter();
                  editor.createShape({
                    type: "image",
                    x: center.x - img.width / 4,
                    y: center.y - img.height / 4,
                    props: {
                      assetId,
                      w: img.width / 2,
                      h: img.height / 2,
                    },
                  });
                } catch (createErr) {
                  console.warn("Image create error:", createErr);
                }
              };
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } else {
        editor.setCurrentTool(toolId);
      }
    } catch (err) {
      console.warn("Tool switch error:", err.message);
    }

    if (onToolSelect) onToolSelect(toolId);
  };

  if (!isOpen) return null;

  return (
    <div className="pf-right-toolbar">
      {/* Header */}
      <div className="pf-toolbar-header">
        <span>🎨 Ferramentas</span>
        <button className="pf-toolbar-close" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Section Header */}
      <div className="pf-toolbar-tabs">
        <button className="pf-toolbar-tab active">
          ✏️ Desenho
        </button>
      </div>

      {/* Drawing Tools */}
      <div className="pf-toolbar-section">
        <div className="pf-toolbar-grid">
          {drawingTools.map((tool) => (
            <button
              key={tool.id}
              className={`pf-toolbar-item ${activeTool === tool.id ? "active" : ""}`}
              onClick={() => handleToolClick(tool.id)}
              title={tool.label}
            >
              <span className="pf-toolbar-icon">{tool.icon}</span>
              <span className="pf-toolbar-label">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Canvas Options */}
        <div className="pf-toolbar-divider">
          <span>Opções do Canvas</span>
        </div>

        <div className="pf-toolbar-options">
          <button
            className={`pf-toolbar-option ${gridEnabled ? "active" : ""}`}
            onClick={toggleGrid}
            title="Mostrar/Ocultar Grid"
          >
            <span className="pf-toolbar-icon">📐</span>
            <span className="pf-toolbar-label">Grid</span>
            <span
              className={`pf-toggle-mini ${gridEnabled ? "on" : ""}`}
            ></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PFRightToolbar;
