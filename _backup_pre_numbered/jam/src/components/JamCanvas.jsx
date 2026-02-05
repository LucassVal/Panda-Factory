import React, { useCallback, useEffect, useState } from "react";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

/**
 * 🐼 Jam Canvas
 * Infinite canvas using TLDraw v2
 * - Hidden native UI (tools moved to our dock)
 * - Theme-aware (follows body.light-mode)
 * - Grid background option
 * - Persistent via localStorage key
 * - Exposes editor for external tool control
 */
function JamCanvas({ plugins, roomId = "panda-jam-default", onEditorMount }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first (synced with StatusBar)
    const saved = localStorage.getItem("panda_theme");
    return saved !== "light"; // default dark
  });
  const [showGrid, setShowGrid] = useState(true);
  const [editor, setEditor] = useState(null);

  // Sync TLDraw when theme changes
  const syncTheme = useCallback(
    (dark) => {
      if (editor) {
        try {
          editor.user.updateUserPreferences({ isDarkMode: dark });
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
      toggleGrid: () => setShowGrid((prev) => !prev),
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
      console.log("🐼 TLDraw Editor mounted");

      setEditor(editorInstance);

      // Set initial dark mode
      const isLight = document.body.classList.contains("light-mode");
      try {
        editorInstance.user.updateUserPreferences({ isDarkMode: !isLight });
      } catch (e) {
        console.log("Initial theme set error:", e);
      }

      // Expose editor globally for dock integration
      window.TLDrawEditor = editorInstance;

      // Notify parent component
      if (onEditorMount) {
        onEditorMount(editorInstance);
      }
    },
    [onEditorMount],
  );

  return (
    <div
      className={`jam-canvas-wrapper ${showGrid ? "show-grid" : ""} ${isDarkMode ? "dark" : "light"}`}
    >
      <Tldraw
        persistenceKey={roomId}
        components={components}
        onMount={handleMount}
      />

      {/* Plugin overlay (future) */}
      {plugins && plugins.length > 0 && (
        <div className="jam-plugins-indicator">
          {plugins.length} plugin(s) ativo(s)
        </div>
      )}
    </div>
  );
}

export default JamCanvas;
