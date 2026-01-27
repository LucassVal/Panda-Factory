import React, { useState, useEffect } from "react";

/**
 * 🐼 Jam Status Bar (Top)
 * Based on Comp_HeaderStatus.html
 * - Status pills (FB, GA, RU, AI, GP)
 * - Arc Energy (wallet balance)
 * - Treasury Health Score
 * - Fullscreen / Pop-out buttons
 */
function JamStatusBar({
  onFullscreen,
  onPopout,
  onSettingsClick,
  onStoreClick,
}) {
  const [time, setTime] = useState("");
  const [energy, setEnergy] = useState(90);
  const [healthScore, setHealthScore] = useState(92);
  const [userName, setUserName] = useState("Lucas Valério");
  const [sessionStart] = useState(() => new Date());
  const [sessionDuration, setSessionDuration] = useState("00:00");

  // Status indicators
  const [statuses, setStatuses] = useState({
    firebase: "online",
    gas: "warning",
    rust: "offline",
    ai: "online",
    gpu: "offline",
  });

  // Theme state - persisted to localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("panda_theme");
    return saved !== "light"; // default dark
  });

  // Apply theme on mount and when changed
  useEffect(() => {
    document.body.classList.toggle("light-mode", !isDarkMode);
    localStorage.setItem("panda_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Clock + Session Timer
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      );

      // Calculate session duration
      const diff = Math.floor((now - sessionStart) / 1000);
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
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

  // Arc circumference for SVG
  const circumference = 125.6;
  const strokeDashoffset = circumference - (energy / 100) * circumference;

  const statusPills = [
    { id: "firebase", label: "FB", title: "Firebase Realtime" },
    { id: "gas", label: "GA", title: "Google Apps Script" },
    { id: "rust", label: "RU", title: "Rust Agent" },
    { id: "ai", label: "AI", title: "AI (Gemini)" },
    { id: "gpu", label: "GP", title: "Local GPU" },
  ];

  // Fullscreen toggle
  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    if (onFullscreen) onFullscreen();
  };

  // Pop-out to new window
  const handlePopout = async () => {
    // Try Picture-in-Picture first (Chrome 116+)
    if ("documentPictureInPicture" in window) {
      try {
        const pip = await window.documentPictureInPicture.requestWindow({
          width: 400,
          height: 300,
        });
        console.log("🪟 PiP window opened");
        if (onPopout) onPopout(pip);
        return;
      } catch (e) {
        console.warn("PiP failed, using window.open");
      }
    }

    // Fallback: window.open
    const win = window.open("", "panda-popout", "width=400,height=300");
    if (onPopout) onPopout(win);
  };

  return (
    <header className={`jam-status-bar ${isDarkMode ? "dark" : "light"}`}>
      {/* LEFT: Panda Logo + Brand Text (Gemini-style) */}
      <div
        className="jam-brand-container"
        onClick={onStoreClick}
        title="Abrir Store"
      >
        <img
          src="./panda-logo.png"
          alt="Panda Factory"
          className="jam-brand-logo"
        />
        <span className="jam-brand-text">Panda Factory</span>
      </div>

      {/* Version + Status Pills */}
      <div className="jam-status-group">
        <span className="jam-version">v5.0</span>
        <div className="jam-status-pills">
          {statusPills.map((pill) => (
            <div key={pill.id} className="jam-status-pill" title={pill.title}>
              <span className="jam-status-label">{pill.label}</span>
              <span className={`jam-status-dot ${statuses[pill.id]}`} />
            </div>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          className="jam-theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* RIGHT: Controls */}
      <div className="jam-header-controls">
        {/* Arc Energy */}
        <div className="jam-arc-energy" title={`${energy}% Energy`}>
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
            <circle className="jam-arc-bg" cx="24" cy="24" r="20" />
            <circle
              className="jam-arc-fill"
              cx="24"
              cy="24"
              r="20"
              stroke="url(#energyGradient)"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="jam-arc-text">{energy}%</span>
        </div>

        {/* Treasury Health */}
        <div className="jam-treasury" title="Treasury Health Score">
          <span>🏦</span>
          <span className="jam-treasury-score">{healthScore}%</span>
        </div>

        {/* User Login Status */}
        <div className="jam-user-status" title={`Sessão: ${sessionDuration}`}>
          <span className="jam-user-avatar">👤</span>
          <div className="jam-user-info">
            <span className="jam-user-name">{userName}</span>
            <span className="jam-session-time">⏱️ {sessionDuration}</span>
          </div>
        </div>

        {/* Fullscreen */}
        <button
          className="jam-header-btn"
          onClick={handleFullscreen}
          title="Fullscreen"
        >
          🔳
        </button>

        {/* Pop-out */}
        <button
          className="jam-header-btn"
          onClick={handlePopout}
          title="Pop-out"
        >
          🪟
        </button>

        {/* Settings */}
        <button
          className="jam-header-btn"
          title="Settings"
          onClick={onSettingsClick}
        >
          ⚙️
        </button>

        {/* Clock */}
        <span className="jam-clock">{time}</span>
      </div>
    </header>
  );
}

export default JamStatusBar;
