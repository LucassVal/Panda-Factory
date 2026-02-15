import React from "react";

/**
 * Jam Header
 * Top bar with logo and actions
 */
function PFHeader({ onStoreClick }) {
  return (
    <header className="pf-header">
      <div className="pf-header-logo">
        <span><img src="/panda-icon.png" alt="Panda" style={{width:"28px",height:"28px",verticalAlign:"middle"}} /></span>
        <span>Panda Fabrics</span>
      </div>

      <div className="pf-header-actions">
        <button className="pf-header-btn" onClick={onStoreClick}>
          📦 Store
        </button>
        <button className="pf-header-btn">⬚ Fullscreen</button>
        <button className="pf-header-btn">⧉ Pop-out</button>
        <button className="pf-header-btn">⚙️</button>
      </div>
    </header>
  );
}

export default PFHeader;
