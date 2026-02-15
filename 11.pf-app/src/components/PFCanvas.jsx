import React, { useCallback, useEffect, useState } from "react";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

/**
 * Jam Canvas v6.3
 * Infinite canvas using TLDraw v2
 * - Hidden native UI (tools moved to our dock)
 * - Theme-aware (follows body.light-mode)
 * - Grid background option
 * - Persistent via localStorage key
 * - Exposes editor for external tool control
 * - Welcome Overlay when canvas is empty
 */

/* ── Welcome Overlay ─────────────────────────────── */
function WelcomeOverlay({ onAction, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  const handleAction = (action) => {
    setExiting(true);
    setTimeout(() => {
      onDismiss();
      onAction(action);
    }, 300);
  };

  const cards = [
    {
      id: "draw",
      icon: "✏️",
      title: "DRAW",
      desc: "Start creating on the infinite canvas",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "store",
      icon: "🏪",
      title: "PANDA STORE",
      desc: "Install apps and tools",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: "chat",
      icon: "🧠",
      title: "PANDA AI",
      desc: "Chat with 5 AI models",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  return (
    <div className={`pf-welcome-overlay ${exiting ? "pf-welcome-exit" : ""}`}>
      <div className="pf-welcome-content">
        <div className="pf-welcome-logo"><img src="/panda-icon.png" alt="Panda Fabrics" className="pf-logo-icon-lg" style={{width:"80px",height:"80px"}} /></div>
        <h2 className="pf-welcome-title">WELCOME TO PANDA FABRICS</h2>
        <p className="pf-welcome-subtitle">
          Your infinite workspace. Choose where to begin:
        </p>

        <div className="pf-welcome-cards">
          {cards.map((card) => (
            <button
              key={card.id}
              className="pf-welcome-card"
              onClick={() => handleAction(card.id)}
              style={{ "--card-gradient": card.gradient }}
            >
              <span className="pf-welcome-card-icon">{card.icon}</span>
              <strong className="pf-welcome-card-title">{card.title}</strong>
              <span className="pf-welcome-card-desc">{card.desc}</span>
            </button>
          ))}
        </div>

        <button className="pf-welcome-skip" onClick={() => handleAction("skip")}>
          Skip and explore freely →
        </button>
      </div>
    </div>
  );
}

/* ── Main Canvas ─────────────────────────────────── */
function PFCanvas({ plugins, roomId = "panda-pf-default", onEditorMount }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("panda_theme");
    return saved !== "light";
  });
  const [showGrid, setShowGrid] = useState(() => {
    const saved = localStorage.getItem("panda_grid_visible");
    return saved !== "false"; // default true
  });
  const [editor, setEditor] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if canvas is empty to show welcome
  useEffect(() => {
    if (!editor) return;

    const checkEmpty = () => {
      try {
        const shapes = editor.getCurrentPageShapes();
        const dismissed = sessionStorage.getItem("pf_welcome_dismissed");
        if (shapes.length === 0 && !dismissed) {
          setShowWelcome(true);
        } else {
          setShowWelcome(false);
        }
      } catch {
        // Editor not ready yet
      }
    };

    // Check after a short delay to let persistence load
    const timer = setTimeout(checkEmpty, 500);
    return () => clearTimeout(timer);
  }, [editor]);

  // Sync TLDraw when theme changes
  const syncTheme = useCallback(
    (dark) => {
      if (editor) {
        try {
          editor.user.updateUserPreferences({
            colorScheme: dark ? "dark" : "light",
          });
        } catch (e) {
          console.log("Theme sync error:", e);
        }
      }
    },
    [editor],
  );

  // Listen for theme changes from body class
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isLight = document.body.classList.contains("light-mode");
          setIsDarkMode(!isLight);
          syncTheme(!isLight);
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, [syncTheme]);

  // Sync theme when editor becomes available
  useEffect(() => {
    if (editor) {
      syncTheme(isDarkMode);
    }
  }, [editor, isDarkMode, syncTheme]);

  // Expose grid toggle globally
  useEffect(() => {
    window.PandaCanvas = {
      toggleGrid: () => setShowGrid((prev) => {
        const next = !prev;
        localStorage.setItem("panda_grid_visible", String(next));
        return next;
      }),
      isGridVisible: () => showGrid,
      setDarkMode: (dark) => {
        setIsDarkMode(dark);
        syncTheme(dark);
      },
    };
  }, [showGrid, syncTheme]);

  // Hide ALL native TLDraw UI components
  const components = {
    Toolbar: null,
    StylePanel: null,
    NavigationPanel: null,
    MainMenu: null,
    PageMenu: null,
    ActionsMenu: null,
    QuickActions: null,
    HelpMenu: null,
    ZoomMenu: null,
    ContextMenu: undefined,
    KeyboardShortcutsDialog: undefined,
  };

  // Callback when editor is ready
  const handleMount = useCallback(
    (editorInstance) => {
      console.log("TLDraw Editor mounted");
      setEditor(editorInstance);

      const isLight = document.body.classList.contains("light-mode");
      try {
        editorInstance.user.updateUserPreferences({
          colorScheme: isLight ? "light" : "dark",
        });
      } catch (e) {
        console.log("Initial theme set error:", e);
      }

      window.TLDrawEditor = editorInstance;
      if (onEditorMount) onEditorMount(editorInstance);
    },
    [onEditorMount],
  );

  // Welcome action handler
  const handleWelcomeAction = useCallback((action) => {
    switch (action) {
      case "draw":
        if (window.TLDrawEditor) {
          try { window.TLDrawEditor.setCurrentTool("draw"); } catch {}
        }
        break;
      case "store":
        // Trigger store open via global event
        window.dispatchEvent(new CustomEvent("panda:open-store"));
        break;
      case "chat":
        window.dispatchEvent(new CustomEvent("panda:toggle-chat"));
        break;
      default:
        break;
    }
  }, []);

  const handleDismissWelcome = useCallback(() => {
    sessionStorage.setItem("pf_welcome_dismissed", "1");
    setShowWelcome(false);
  }, []);

  return (
    <div
      className={`pf-canvas-wrapper ${showGrid ? "show-grid" : ""} ${isDarkMode ? "dark" : "light"}`}
    >
      <Tldraw
        persistenceKey={roomId}
        components={components}
        onMount={handleMount}
      />

      {/* Welcome Overlay (empty canvas) */}
      {showWelcome && (
        <WelcomeOverlay
          onAction={handleWelcomeAction}
          onDismiss={handleDismissWelcome}
        />
      )}

      {/* Plugin overlay (future) */}
      {plugins && plugins.length > 0 && (
        <div className="pf-plugins-indicator">
          {plugins.length} plugin(s) active
        </div>
      )}
    </div>
  );
}

export default PFCanvas;
