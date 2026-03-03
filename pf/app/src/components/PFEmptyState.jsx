import React from "react";
import "./PFEmptyState.css";

/**
 * 📦 PFEmptyState — Reusable Empty State Component
 *
 * Standardized empty state for panels, lists, tables, etc.
 * Supports: icon, title, description, and optional action button.
 *
 * @param {string}   icon        - Emoji or icon string (e.g. "📦")
 * @param {string}   title       - Main message (e.g. "Nenhum dado encontrado")
 * @param {string}   description - Optional secondary message
 * @param {string}   actionLabel - Optional button label
 * @param {function} onAction    - Optional button callback
 * @param {string}   size        - "sm" | "md" | "lg" (default: "md")
 * @param {string}   className   - Optional extra classes
 *
 * @example
 *   <PFEmptyState
 *     icon="📦"
 *     title="NENHUM APP INSTALADO"
 *     description="Visite a Panda Store para explorar extensões."
 *     actionLabel="Abrir Store"
 *     onAction={openStore}
 *   />
 */
export function PFEmptyState({
  icon = "📭",
  title = "Nenhum dado",
  description,
  actionLabel,
  onAction,
  size = "md",
  className = "",
}) {
  return (
    <div className={`pf-empty-state pf-empty-state--${size} ${className}`}>
      <div className="pf-empty-state__icon">{icon}</div>
      <p className="pf-empty-state__title">{title}</p>
      {description && <p className="pf-empty-state__desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="pf-empty-state__btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default PFEmptyState;
