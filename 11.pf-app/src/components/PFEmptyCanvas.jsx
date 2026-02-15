import React from "react";
import "./PFEmptyCanvas.css";

function PFEmptyCanvas() {
  const cards = [
    { icon: "✏️", title: "CREATE PROJECT", desc: "Draw on the infinite canvas",
      action: () => document.querySelector(".pf-empty-canvas")?.classList.add("dismissed") },
    { icon: "🏪", title: "EXPLORE STORE", desc: "Discover apps and tools",
      action: () => window.dispatchEvent(new CustomEvent("panda:open-store")) },
    { icon: "🧠", title: "OPEN AI CHAT", desc: "Ask for help or get inspired",
      action: () => window.dispatchEvent(new CustomEvent("panda:toggle-chat")) },
  ];
  return (
    <div className="pf-empty-canvas animate-fade-in">
      <div className="pf-empty-hero">
        <span className="pf-empty-icon">{"🐼"}</span>
        <h2 className="pf-empty-title">START HERE</h2>
        <p className="pf-empty-subtitle">Choose where to begin</p>
      </div>
      <div className="pf-empty-cards">
        {cards.map((c) => (
          <button key={c.title} className="pf-empty-card" onClick={c.action} aria-label={c.title}>
            <span className="pf-empty-card-icon">{c.icon}</span>
            <strong className="pf-empty-card-title">{c.title}</strong>
            <span className="pf-empty-card-desc">{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default PFEmptyCanvas;
