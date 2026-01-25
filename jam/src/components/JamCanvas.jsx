import React from 'react';

/**
 * 🐼 Jam Canvas
 * Infinite canvas using TLDraw
 * Shows empty state until plugins are installed
 */
function JamCanvas({ plugins }) {
  // If no plugins, show empty state
  if (!plugins || plugins.length === 0) {
    return (
      <div className="jam-canvas-empty">
        <div className="jam-canvas-empty-icon">🐼</div>
        <div className="jam-canvas-empty-text">
          Seu Jam está vazio
        </div>
        <p style={{ color: '#8a8a9a', maxWidth: 400, textAlign: 'center' }}>
          Vá até a Store para instalar plugins e começar a construir seu workspace.
        </p>
        <button className="jam-canvas-empty-btn">
          📦 Abrir Store
        </button>
      </div>
    );
  }

  // TODO: Implement TLDraw canvas with installed plugins
  // For now, show a placeholder
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a2e'
    }}>
      {/* TLDraw will be rendered here */}
      <div style={{ color: '#8a8a9a' }}>
        {plugins.length} plugin(s) instalado(s)
        {/* In production: <Tldraw /> */}
      </div>
    </div>
  );
}

export default JamCanvas;
