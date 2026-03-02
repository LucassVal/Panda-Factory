import React, { useState, useEffect } from "react";
import "./PFNotifications.css";

/**
 * 🔔 PFNotifications v1.0 — Notification Center
 *
 * Shows system events, plugin updates, and AI responses.
 * Opens from the 🔔 Dock icon.
 *
 * @see PF_UI_REFERENCE.md
 */

// Notifications are populated by the EventBus at runtime
// Initial state is empty — fresh OS boot

function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "NOW";
  if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
  return `${Math.floor(diff / 86400)}D AGO`;
}

function PFNotifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <div className="pf-notifications-overlay" onClick={onClose}>
      <div
        className="pf-notifications-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="pf-notifications-header">
          <h3>
            🔔 NOTIFICATIONS
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </h3>
          <div className="notif-actions">
            {unreadCount > 0 && (
              <button className="notif-btn" onClick={markAllRead}>
                ✓ READ ALL
              </button>
            )}
            {notifications.length > 0 && (
              <button className="notif-btn" onClick={clearAll}>
                🗑️ CLEAR
              </button>
            )}
            <button className="notif-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="pf-notifications-list">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <span style={{ fontSize: 32 }}>🔕</span>
              <p>NO NOTIFICATIONS</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item ${notif.read ? "read" : "unread"}`}
                onClick={() => markRead(notif.id)}
              >
                <span className="notif-icon">{notif.icon}</span>
                <div className="notif-content">
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-message">{notif.message}</div>
                </div>
                <span className="notif-time">{formatTimeAgo(notif.time)}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pf-notifications-footer">
          <span>🐙 MEDUSA EVENT BUS</span>
        </div>
      </div>
    </div>
  );
}

export default PFNotifications;
