import React from 'react';

/**
 * 🐼 Jam Header
 * Top bar with logo and actions
 */
function JamHeader({ onStoreClick }) {
  return (
    <header className="jam-header">
      <div className="jam-header-logo">
        <span>🐼</span>
        <span>Panda Jam</span>
      </div>
      
      <div className="jam-header-actions">
        <button className="jam-header-btn" onClick={onStoreClick}>
          📦 Store
        </button>
        <button className="jam-header-btn">
          ⬚ Fullscreen
        </button>
        <button className="jam-header-btn">
          ⧉ Pop-out
        </button>
        <button className="jam-header-btn">
          ⚙️
        </button>
      </div>
    </header>
  );
}

export default JamHeader;
