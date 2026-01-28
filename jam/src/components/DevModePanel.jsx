import React, { useState, useEffect } from "react";
import "./DevModePanel.css";

/**
 * 🛠️ Dev Mode Panel
 *
 * Developer tools panel with MCP toggle and console viewer.
 * Based on PF_MASTER_ARCHITECTURE.md §25.4
 *
 * Features:
 * - MCP Mode toggle (Internal/External)
 * - Console log viewer
 * - vscode.dev launcher
 * - Quick actions for developers
 */

export function DevModePanel({ isOpen, onClose }) {
  const [mcpMode, setMcpMode] = useState("internal");
  const [logs, setLogs] = useState([]);
  const [showConsole, setShowConsole] = useState(true);
  const [filter, setFilter] = useState("all");

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (type, args) => {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg),
        )
        .join(" ");

      setLogs((prev) => [
        ...prev.slice(-99),
        {
          id: Date.now(),
          type,
          message,
          time: new Date(),
        },
      ]);
    };

    console.log = (...args) => {
      addLog("log", args);
      originalLog.apply(console, args);
    };
    console.warn = (...args) => {
      addLog("warn", args);
      originalWarn.apply(console, args);
    };
    console.error = (...args) => {
      addLog("error", args);
      originalError.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const handleMcpToggle = () => {
    const newMode = mcpMode === "internal" ? "external" : "internal";

    if (newMode === "external") {
      if (
        !confirm(
          "⚠️ Modo EXTERNO permite acesso ao seu PC.\nO agente pedirá permissão 1x.\n\nContinuar?",
        )
      ) {
        return;
      }
    }

    setMcpMode(newMode);
    console.log(`🔧 MCP Mode: ${newMode.toUpperCase()}`);
  };

  const openVSCode = () => {
    const repo = prompt("Digite o repositório GitHub (user/repo):");
    if (repo) {
      const url = `https://vscode.dev/github/${repo}`;
      window.open(url, "_blank");
      console.log(`🔵 Abrindo VS Code: ${url}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const filteredLogs =
    filter === "all" ? logs : logs.filter((l) => l.type === filter);

  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="devmode-overlay" onClick={onClose}>
      <div className="devmode-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="devmode-header">
          <h2>🛠️ Dev Mode</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </header>

        {/* MCP Toggle */}
        <section className="devmode-section">
          <h3>🤖 MCP Mode (Agent Access)</h3>
          <div className="mcp-toggle">
            <div
              className={`mcp-option ${mcpMode === "internal" ? "active" : ""}`}
            >
              <span className="option-icon">🏠</span>
              <span className="option-name">INTERNO</span>
              <span className="option-desc">Sandbox Panda</span>
            </div>
            <button className="toggle-btn" onClick={handleMcpToggle}>
              {mcpMode === "internal" ? "→" : "←"}
            </button>
            <div
              className={`mcp-option ${mcpMode === "external" ? "active" : ""}`}
            >
              <span className="option-icon">💻</span>
              <span className="option-name">EXTERNO</span>
              <span className="option-desc">Acesso PC</span>
            </div>
          </div>
          <p className="mcp-status">
            Status: <span className={mcpMode}>{mcpMode.toUpperCase()}</span>
            {mcpMode === "external" && " (Aprovação única)"}
          </p>
        </section>

        {/* Quick Actions */}
        <section className="devmode-section">
          <h3>⚡ Ações Rápidas</h3>
          <div className="quick-actions">
            <button className="action-btn" onClick={openVSCode}>
              <span>🔵</span> Abrir VS Code
            </button>
            <button
              className="action-btn"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <span>🐙</span> GitHub
            </button>
            <button
              className="action-btn"
              onClick={() => console.log("🧪 Test log from Dev Panel")}
            >
              <span>🧪</span> Test Log
            </button>
            <button
              className="action-btn"
              onClick={() => {
                localStorage.clear();
                console.log("🗑️ LocalStorage cleared");
              }}
            >
              <span>🗑️</span> Clear Storage
            </button>
          </div>
        </section>

        {/* Console */}
        <section className="devmode-section console-section">
          <div className="console-header">
            <h3>📟 Console</h3>
            <div className="console-controls">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="log">Logs</option>
                <option value="warn">Warnings</option>
                <option value="error">Errors</option>
              </select>
              <button className="btn-clear" onClick={clearLogs}>
                🗑️ Limpar
              </button>
              <button
                className={`btn-toggle ${showConsole ? "active" : ""}`}
                onClick={() => setShowConsole(!showConsole)}
              >
                {showConsole ? "▼" : "▶"}
              </button>
            </div>
          </div>

          {showConsole && (
            <div className="console-output">
              {filteredLogs.length === 0 ? (
                <div className="console-empty">Nenhum log ainda...</div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className={`console-line ${log.type}`}>
                    <span className="log-time">{formatTime(log.time)}</span>
                    <span className="log-type">{log.type}</span>
                    <span className="log-msg">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="devmode-footer">
          <span>🐼 Panda Fabrics Dev Tools v1.0</span>
        </footer>
      </div>
    </div>
  );
}

export default DevModePanel;
