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

// Mock notifications for initial UI — will connect to EventBus later
const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "system",
    icon: "🐼",
    title: "BEM-VINDO AO PANDA FABRICS",
    message: "Seu workspace está pronto. Explore o catálogo!",
    time: new Date(Date.now() - 1000 * 60 * 2),
    read: false,
  },
  {
    id: "n2",
    type: "store",
    icon: "🛒",
    title: "STORE ATUALIZADA",
    message: "9 extensões disponíveis — incluindo Instagram, Google Ads e mais",
    time: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: "n3",
    type: "ai",
    icon: "🧠",
    title: "BRAIN PRONTO",
    message: "Panda Brain conectado via MCP. Diga 'olá' no chat!",
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
  },
  {
    id: "n4",
    type: "security",
    icon: "🛡️",
    title: "PANDA DEFEND ATIVO",
    message: "14 regras Semgrep monitorando. Sistema seguro.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
];

function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "AGORA";
  if (diff < 3600) return `${Math.floor(diff / 60)}M ATRÁS`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}H ATRÁS`;
  return `${Math.floor(diff / 86400)}D ATRÁS`;
}

function PFNotifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
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
            🔔 NOTIFICAÇÕES
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </h3>
          <div className="notif-actions">
            {unreadCount > 0 && (
              <button className="notif-btn" onClick={markAllRead}>
                ✓ LER TODAS
              </button>
            )}
            {notifications.length > 0 && (
              <button className="notif-btn" onClick={clearAll}>
                🗑️ LIMPAR
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
              <p>NENHUMA NOTIFICAÇÃO</p>
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
