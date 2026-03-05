import React, { useState, useEffect } from "react";
import usePWAInstall from "../hooks/usePWAInstall";

const STATUS_EMOJI = { ok: "🟢", degraded: "🟡", critical: "🔴" };

/**
 * Jam Header
 * Top bar with logo, actions, and live heartbeat badge
 */
function PFHeader({ onStoreClick }) {
  const [hbStatus, setHbStatus] = useState("unknown");
  const { isInstallable, installPWA } = usePWAInstall();

  useEffect(() => {
    try {
      const { getDatabase, ref, onValue } = require("firebase/database");
      const db = getDatabase();
      const hbRef = ref(db, "/system/heartbeat/overall");
      const unsub = onValue(hbRef, (snap) => {
        if (snap.val()) setHbStatus(snap.val());
      });
      return () => unsub();
    } catch (e) {
      /* Firebase not loaded yet */
    }
  }, []);

  return (
    <header className="pf-header">
      <div className="pf-header-logo">
        <span>
          <img
            src="./panda-icon.png"
            alt="Panda"
            style={{ width: "28px", height: "28px", verticalAlign: "middle" }}
          />
        </span>
        <span>Panda Fabrics</span>
      </div>

      <div className="pf-header-actions">
        <div
          className="pf-header-heartbeat"
          data-status={hbStatus}
          title={`Sistema: ${hbStatus}`}
        >
          {STATUS_EMOJI[hbStatus] || "⚪"}{" "}
          <span style={{ fontSize: "10px", color: "#888" }}>{hbStatus}</span>
        </div>
        <button className="pf-header-btn" onClick={onStoreClick}>
          📦 Store
        </button>
        {isInstallable && (
          <button
            className="pf-header-btn pf-pwa-btn"
            onClick={installPWA}
            style={{
              color: "#00FF9D",
              fontWeight: "bold",
              border: "1px solid #00FF9D22",
              background: "#00FF9D11",
            }}
          >
            ⬇ Instalar App
          </button>
        )}
        <button className="pf-header-btn">⬚ Fullscreen</button>
        <button className="pf-header-btn">⧉ Pop-out</button>
        <button className="pf-header-btn">⚙️</button>
      </div>
    </header>
  );
}

export default PFHeader;
