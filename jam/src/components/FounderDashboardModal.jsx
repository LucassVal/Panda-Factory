import React from "react";
import { FounderDashboard } from "./FounderDashboard";
import "./FounderDashboardModal.css";

/**
 * FounderDashboardModal - Modal wrapper for Founder Dashboard
 * Only visible for Founder users
 */
export function FounderDashboardModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="founder-modal-overlay" onClick={onClose}>
      <div className="founder-modal" onClick={(e) => e.stopPropagation()}>
        <button className="founder-modal-close" onClick={onClose}>
          ✕
        </button>
        <FounderDashboard />
      </div>
    </div>
  );
}

export default FounderDashboardModal;
