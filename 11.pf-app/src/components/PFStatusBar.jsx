import React, { useState, useEffect } from "react";
import { useHealthStatus } from "../hooks/useHealthStatus";
import PFLanguageSelector from "./PFLanguageSelector";
import { useI18n } from "../i18n/i18n";

/**
 * PF Status Bar v6.3 — PIN + White Label
 *
 * - PIN: small toggle at far-right, toggles auto-hide
 * - When unpinned: bar slides up, thin hover strip shows panda-icon
 * - Logo: panda-logo.png (Store logo) in brand area
 * - panda-icon.png (circular panda) used for collapsed strip
 * - White Label: reads brandName/logoUrl from localStorage
 * - UPPERCASE text standard
 */
function PFStatusBar({
  onFullscreen,
  onSettingsClick,
  onStoreClick,
  onFounderClick,
  onMiningClick,
  onDefendClick,
  onTreasuryClick,
  onNotificationsClick,
  onPinChange,
  isFounder = false,
}) {
  const { t } = useI18n();
  const [time, setTime] = useState("");
  const [energy, setEnergy] = useState(100);
  const [userName, setUserName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("panda_user"));
      return u?.displayName || "GUEST";
    } catch { return "GUEST"; }
  });
  const [sessionStart] = useState(() => new Date());
  const [sessionDuration, setSessionDuration] = useState("00:00");

  // PIN state (default: pinned/visible)
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem("panda_statusbar_pinned");
    return saved !== "false";
  });
  const [isHovered, setIsHovered] = useState(false);

  // White Label
  const [whiteLabel, setWhiteLabel] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("panda_white_label") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        setWhiteLabel(
          JSON.parse(localStorage.getItem("panda_white_label") || "null"),
        );
      } catch {}
    };
    window.addEventListener("storage", handler);
    window.addEventListener("panda-whitelabel-change", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("panda-whitelabel-change", handler);
    };
  }, []);

  // Status indicators — live from useHealthStatus
  const { services: healthServices } = useHealthStatus("jam");
  const statuses = {};
  healthServices.forEach((svc) => {
    statuses[svc.name] = svc.isHealthy ? "online" : svc.status === "unavailable" ? "unavailable" : svc.status === "offline" ? "offline" : "warning";
  });

  // Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("panda_theme");
    return saved !== "light";
  });

  useEffect(() => {
    document.body.classList.toggle("light-mode", !isDarkMode);
    localStorage.setItem("panda_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // PIN persist
  useEffect(() => {
    localStorage.setItem("panda_statusbar_pinned", String(isPinned));
    if (onPinChange) onPinChange(isPinned);
  }, [isPinned]);

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      );
      const diff = Math.floor((now - sessionStart) / 1000);
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      // Energy degrades: 100% → 50% over 8h, minimum 10%
      const hoursElapsed = diff / 3600;
      setEnergy(Math.max(10, Math.round(100 - (hoursElapsed / 8) * 50)));
      if (hours > 0) {
        setSessionDuration(`${hours}h ${mins.toString().padStart(2, "0")}m`);
      } else {
        setSessionDuration(
          `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
        );
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  // SVG arc
  const circumference = 125.6;
  const strokeDashoffset = circumference - (energy / 100) * circumference;

  const statusPills = [
    { id: "firebase", label: "FB", title: "FIREBASE REALTIME" },
    { id: "gas", label: "GA", title: "GOOGLE APPS SCRIPT" },
    { id: "rust", label: "RU", title: "RUST AGENT" },
    { id: "mcp", label: "AI", title: "AI / MCP BRIDGE" },
    { id: "gpu", label: "GP", title: "LOCAL GPU" },
  ];

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    if (onFullscreen) onFullscreen();
  };

  // Brand: Store logo in status bar, panda-icon for collapsed strip
  const brandName = whiteLabel?.brandName || "PANDA FABRICS";
  const brandLogo = whiteLabel?.logoUrl || "./panda-icon.png";
  const pandaIcon = "./panda-icon.png";

  const isExpanded = isPinned || isHovered;

  return (
    <>
      {/* Full status bar — in document flow, no position:fixed */}
      <header
        className={`pf-status-bar ${isDarkMode ? "dark" : "light"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="banner"
        aria-label="Panda Fabrics status bar"
        style={{
          display: isExpanded ? "flex" : "none",
        }}
      >
        {/* LEFT: Store Logo + Brand */}
        <div
          className="pf-brand-container"
          onClick={onStoreClick}
          title={t("statusBar.openStore", "OPEN STORE")}
        >
          <img
            src={brandLogo}
            alt={brandName}
            className="pf-brand-logo"
          />
          <span className="pf-brand-text">{brandName}</span>
        </div>

        {/* CENTER: Status Pills */}
        <div className="pf-status-group">
          <div className="pf-status-pills" role="status" aria-live="polite" aria-label="Service status">
            {statusPills.map((pill) => (
              <div
                key={pill.id}
                className="pf-status-pill"
                title={`${pill.title} — ${(statuses[pill.id] || "unknown").toUpperCase()}`}
                aria-label={`${pill.title}: ${(statuses[pill.id] || "unknown").toUpperCase()}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const s = statuses[pill.id] || "unknown";
                  const emoji = s === "online" ? "🟢" : s === "warning" ? "🟡" : s === "offline" ? "🔴" : "⚪";
                  alert(`${emoji} ${pill.title}\n\nStatus: ${s.toUpperCase()}`);
                }}
              >
                <span className="pf-status-label">{pill.label}</span>
                <span className={`pf-status-dot ${statuses[pill.id]}`} aria-hidden="true" />
              </div>
            ))}
          </div>

          <button
            className="pf-theme-toggle pf-header-btn"
            onClick={toggleTheme}
            title={isDarkMode ? t("statusBar.lightMode", "LIGHT MODE") : t("statusBar.darkMode", "DARK MODE")}
            aria-label={isDarkMode ? t("statusBar.lightMode", "LIGHT MODE") : t("statusBar.darkMode", "DARK MODE")}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* RIGHT: Controls — same order as original */}
        <div className="pf-header-controls">
          {/* Language Selector */}
          <PFLanguageSelector />

          {/* Arc Energy */}
          <div className="pf-arc-energy" title={`${energy}% ${t("statusBar.energy", "ENERGY")}`} aria-label={`${t("statusBar.session", "SESSION")} ${t("statusBar.energy", "ENERGY")}: ${energy}%`}>
            <svg width="40" height="40" viewBox="0 0 48 48">
              <defs>
                <linearGradient
                  id="energyGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <circle className="pf-arc-bg" cx="24" cy="24" r="20" />
              <circle
                className="pf-arc-fill"
                cx="24"
                cy="24"
                r="20"
                stroke="url(#energyGradient)"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="pf-arc-text">{energy}%</span>
          </div>

          {/* Treasury */}
          <div
            className="pf-treasury"
            title={t("statusBar.treasury", "TREASURY — OPEN PAT COUNCIL")}
            onClick={onTreasuryClick}
            style={{ cursor: onTreasuryClick ? "pointer" : "default" }}
          >
            <span>🏦</span>
            <span className="pf-treasury-score">
              {healthServices.length > 0
                ? Math.round((healthServices.filter(s => s.isHealthy).length / healthServices.length) * 100)
                : 0}%
            </span>
          </div>

          {/* User */}
          <div className="pf-user-status" title={`${t("statusBar.session", "SESSION")}: ${sessionDuration}`}>
            <span className="pf-user-avatar">👤</span>
            <div className="pf-user-info">
              <span className="pf-user-name">{userName}</span>
              <span className="pf-session-time">{sessionDuration}</span>
            </div>
          </div>

          {/* Notifications */}
          <button
            className="pf-header-btn"
            onClick={onNotificationsClick}
            title={t("statusBar.notifications", "NOTIFICATIONS")}
            aria-label={t("statusBar.notifications", "NOTIFICATIONS")}
          >
            🔔
          </button>

          {/* Mining Dashboard — available to all users */}
          <button
            className="pf-header-btn"
            onClick={onMiningClick}
            title={t("statusBar.mining", "MY MINING")}
            aria-label={t("statusBar.mining", "MY MINING")}
          >
            ⛏️
          </button>

          {/* Panda Defend — available to all users */}
          <button
            className="pf-header-btn"
            onClick={onDefendClick}
            title={t("statusBar.defend", "PANDA DEFEND")}
            aria-label={t("statusBar.defend", "PANDA DEFEND")}
          >
            🛡️
          </button>

          {/* Founder Dashboard */}
          {(isFounder || onFounderClick) && (
            <button
              className="pf-header-btn founder-btn"
              onClick={onFounderClick}
              title={t("statusBar.founder", "FOUNDER DASHBOARD")}
            >
              🏭
            </button>
          )}

          {/* Settings */}
          <button
            className="pf-header-btn"
            title={t("statusBar.settings", "SETTINGS")}
            onClick={onSettingsClick}
            aria-label={t("statusBar.settings", "SETTINGS")}
          >
            ⚙️
          </button>

          {/* Exit / Logout */}
          <button
            className="pf-header-btn"
            title={t("statusBar.logout", "LOGOUT")}
            aria-label={t("statusBar.logoutConfirm", "Log out of Panda Fabrics?")}
            onClick={() => {
              if (window.confirm(t("statusBar.logoutConfirm", "Log out of Panda Fabrics?"))) {
                sessionStorage.removeItem("panda_auth");
                sessionStorage.removeItem("panda_auth_token");
                localStorage.removeItem("panda_user");
                localStorage.removeItem("panda_token");
                localStorage.removeItem("panda_founder_mode");
                localStorage.removeItem("pf_chat_welcomed");
                localStorage.removeItem("panda_onboarding_complete");
                window.location.reload();
              }
            }}
            style={{ color: "#ef4444" }}
          >
            ✕
          </button>

          {/* Clock */}
          <span className="pf-clock">{time}</span>

          {/* PIN — last item, small, doesn't break flow */}
          <button
            className="pf-header-btn pf-pin-btn"
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? t("statusBar.unpinBar", "UNPIN BAR") : t("statusBar.pinBar", "PIN BAR")}
            aria-label={isPinned ? t("statusBar.unpinBar", "UNPIN BAR") : t("statusBar.pinBar", "PIN BAR")}
            aria-pressed={isPinned}
            style={{
              opacity: isPinned ? 1 : 0.4,
              fontSize: 12,
              marginLeft: 4,
              transition: "opacity 0.2s ease",
            }}
          >
            📌
          </button>
        </div>
      </header>

      {/* When unpinned + hidden: thin hover trigger strip */}
      {!isExpanded && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 5001,
            cursor: "pointer",
            background:
              "linear-gradient(180deg, rgba(10,10,26,0.5) 0%, transparent 100%)",
          }}
        />
      )}
    </>
  );
}

export default PFStatusBar;
