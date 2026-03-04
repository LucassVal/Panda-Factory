import React, { useState, useCallback, useRef, useEffect } from "react";
import PFCanvas from "./components/PFCanvas";
import PFDock from "./components/PFDock";
import PFStatusBar from "./components/PFStatusBar";
import PFOrchestrator from "./components/PFOrchestrator";
import useMCPRegistry from "./hooks/useMCPRegistry";
import PFStore from "./components/PFStore";
import PFCatalog from "./components/PFCatalog";
import PFChat from "./components/PFChat";
import PFSettings from "./components/PFSettings";
import PFRightToolbar from "./components/PFRightToolbar";
import PFNotifications from "./components/PFNotifications";
import LoginGate from "./components/PFLoginGate";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { I18nProvider } from "./i18n/i18n.jsx";

import { FounderDashboard } from "./components/PFFounderDashboard";
import { DevModePanel } from "./components/PFDevModePanel";
import { PATCouncilPanel } from "./components/PFCouncilPanel";
import {
  PFWindowManager,
  openAppWindow,
  closeAppWindow,
} from "./components/PFWindowManager";
import { BundleCreator } from "./components/PFBundleCreator";
import { FinancePanel } from "./components/PFFinancePanel";
import { GasometerPanel } from "./components/PFGasometerPanel";
import { MiningPanel } from "./components/PFMiningPanel";
import { PFDefendPanel } from "./components/PFDefendPanel";
import PFWelcomeWizard from "./components/PFWelcomeWizard";
import PluginManifestEditor from "./components/PFPluginEditor";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import PandaCRM from "./modules/crm";
import FounderHub from "./modules/founder";
import PandaSocial from "./modules/social";
import PFDiagnosticDashboard from "./components/PFDiagnosticDashboard";
import PFErrorBoundary from "./components/PFErrorBoundary";

/**
 * PANDA FABRICS — MAIN APPLICATION v6.6
 *
 * Multi-window via flexlayout-react (MIT).
 * Apps open INSIDE the canvas as dockable tabs.
 *
 * Google-First. No Dropbox, no Microsoft.
 * Catalog starts EMPTY — everything from the Store.
 *
 * TEXT STANDARD: UPPERCASE for titles/labels.
 *
 * v6.5 — +GasometerPanel, Store v3.2 (12 extensions, EN)
 */
function AppContent() {
  const [showStore, setShowStore] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRightToolbar, setShowRightToolbar] = useState(false);
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [devMode, setDevMode] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGasometer, setShowGasometer] = useState(false);
  const [showOrchestrator, setShowOrchestrator] = useState(false);
  const [showWizard, setShowWizard] = useState(() => {
    return !localStorage.getItem("panda_onboarding_complete");
  });

  const { isFounder } = useAuth();

  // 🧠 MCP Registry — syncs with active Dock modules
  const {
    tools: mcpTools,
    toolCount: mcpToolCount,
    activeModules: mcpActiveModules,
    syncWithDock,
    getToolsForAI,
  } = useMCPRegistry();

  // Wave 3 — Global keyboard shortcuts
  useKeyboardShortcuts({
    onToggleDevTools: () => {
      setDevMode((d) => {
        const next = !d;
        if (next) openAppWindow("devtools");
        return next;
      });
    },
    onToggleChat: () =>
      window.dispatchEvent(new CustomEvent("panda:chat-toggle-internal")),
    onOpenSettings: () => setShowSettings(true),
    onOpenStore: () => setShowStore(true),
    onEscape: () => {
      setShowSettings(false);
      setShowStore(false);
      setShowCatalog(false);
      setShowNotifications(false);
      setShowGasometer(false);
      setShowOrchestrator(false);
    },
  });

  // Global event listeners for Welcome Overlay & Catalog actions
  useEffect(() => {
    const handleOpenStore = () => setShowStore(true);
    const handleToggleChat = () => {
      window.dispatchEvent(new CustomEvent("panda:chat-toggle-internal"));
    };
    const handleOpenGasometer = () => setShowGasometer(true);
    const handleOpenOrchestrator = () => setShowOrchestrator(true);

    window.addEventListener("panda:open-store", handleOpenStore);
    window.addEventListener("panda:toggle-chat", handleToggleChat);
    window.addEventListener("panda:open-gasometer", handleOpenGasometer);
    window.addEventListener("panda:open-orchestrator", handleOpenOrchestrator);
    return () => {
      window.removeEventListener("panda:open-store", handleOpenStore);
      window.removeEventListener("panda:toggle-chat", handleToggleChat);
      window.removeEventListener("panda:open-gasometer", handleOpenGasometer);
      window.removeEventListener(
        "panda:open-orchestrator",
        handleOpenOrchestrator,
      );
    };
  }, []);

  // 🧠 MCP: Sync registry with installed plugins + broadcast to PFChat
  useEffect(() => {
    const moduleIds = installedPlugins.map((p) => p.id).filter((id) => id); // only valid IDs
    if (moduleIds.length > 0) {
      syncWithDock(moduleIds);
    }
  }, [installedPlugins, syncWithDock]);

  // 📡 Broadcast MCP tools context to PFChat whenever tools change
  useEffect(() => {
    const ctx = getToolsForAI();
    if (ctx) {
      window.dispatchEvent(
        new CustomEvent("panda:mcp-tools-updated", {
          detail: { context: ctx },
        }),
      );
    }
  }, [mcpTools, getToolsForAI]);

  // Install plugin from store (prevents duplicates)
  const handleInstallPlugin = (plugin) => {
    if (installedPlugins.some((p) => p.id === plugin.id)) return;
    setInstalledPlugins([...installedPlugins, plugin]);
    setShowStore(false);
  };

  // Uninstall plugin
  const handleUninstallPlugin = (pluginId) => {
    // Also close the tab if it's open
    closeAppWindow(pluginId);
    setInstalledPlugins(installedPlugins.filter((p) => p.id !== pluginId));
  };

  // Open plugin inside canvas as a tab
  const handleOpenPlugin = (plugin) => {
    openAppWindow(plugin.id, {
      name: plugin.name,
      icon: plugin.icon,
    });
  };

  // Close plugin tab (without uninstalling)
  const handleClosePlugin = (pluginId) => {
    closeAppWindow(pluginId);
  };

  // Open app from catalog inside the canvas
  const handleOpenApp = (appId, config) => {
    openAppWindow(appId, config);
    setShowCatalog(false);
  };

  // Component factory for flexlayout-react
  // All onClose handlers call closeAppWindow(id) to properly close the tab
  const componentFactory = useCallback(
    (componentType, config) => {
      const close = () => closeAppWindow(componentType);
      switch (componentType) {
        case "founder-dashboard":
          return <FounderDashboard />;
        case "pat-council":
          return (
            <PATCouncilPanel
              isOpen={true}
              onClose={close}
              activeTool={config?.activeTool || "treasury"}
              embedded={true}
            />
          );
        case "devtools":
          return <DevModePanel isOpen={true} onClose={close} embedded={true} />;
        case "settings":
          return <PFSettings isOpen={true} onClose={close} embedded={true} />;
        case "store":
          return (
            <PFStore
              onClose={close}
              onInstall={handleInstallPlugin}
              embedded={true}
            />
          );
        case "catalog":
          return (
            <PFCatalog
              isOpen={true}
              onClose={close}
              plugins={installedPlugins}
              onPluginUninstall={handleUninstallPlugin}
              onOpenApp={handleOpenApp}
              embedded={true}
            />
          );
        default: {
          // Check for known extra modules
          const closeDefault = () => closeAppWindow(componentType);
          if (componentType === "bundle-creator") {
            return <BundleCreator onClose={closeDefault} embedded={true} />;
          }
          if (componentType === "finance-panel") {
            return <FinancePanel onClose={closeDefault} embedded={true} />;
          }
          if (componentType === "gasometer") {
            return <GasometerPanel onClose={closeDefault} embedded={true} />;
          }
          if (componentType === "mining-panel") {
            return <MiningPanel embedded={true} />;
          }
          if (componentType === "defend-panel") {
            return <PFDefendPanel />;
          }
          if (componentType === "plugin-editor") {
            return (
              <PluginManifestEditor
                onClose={closeDefault}
                onSave={(manifest) =>
                  console.log("📦 Manifest saved:", manifest)
                }
              />
            );
          }
          if (componentType === "crm") {
            return (
              <PFErrorBoundary>
                <PandaCRM userId={"founder"} onClose={closeDefault} />
              </PFErrorBoundary>
            );
          }
          if (componentType === "founder-hub") {
            return (
              <PFErrorBoundary>
                <FounderHub onClose={closeDefault} />
              </PFErrorBoundary>
            );
          }
          if (componentType === "diagnostics") {
            return (
              <PFErrorBoundary>
                <PFDiagnosticDashboard
                  onClose={closeDefault}
                  isFounder={isFounder}
                />
              </PFErrorBoundary>
            );
          }
          if (componentType === "social") {
            return (
              <PFErrorBoundary>
                <PandaSocial onClose={closeDefault} />
              </PFErrorBoundary>
            );
          }
          return (
            <div style={{ padding: 20, color: "#aaa" }}>
              📱 {config?.name || componentType} — COMING SOON
            </div>
          );
        }
      }
    },
    [installedPlugins],
  );

  // Canvas component for the main tab
  const canvasComponent = <PFCanvas plugins={installedPlugins} />;

  return (
    <div className="pf-container">
      {/* SKIP LINK (Accessibility — §B.7.4) */}
      <a className="pf-skip-link" href="#pf-main-content">
        Skip to main content
      </a>

      {/* WELCOME WIZARD (First-Time Only — Wave 2) */}
      {showWizard && (
        <PFWelcomeWizard
          onComplete={(action) => {
            setShowWizard(false);
            if (action === "store") setShowStore(true);
            if (action === "chat") {
              window.dispatchEvent(new CustomEvent("panda:toggle-chat"));
            }
          }}
          onOpenStore={() => setShowStore(true)}
        />
      )}

      {/* STATUS BAR (Top) */}
      <PFStatusBar
        onStoreClick={() => setShowStore(true)}
        onSettingsClick={() => {
          setShowSettings(true);
          setShowRightToolbar(false);
        }}
        onNotificationsClick={() => setShowNotifications(true)}
        onFounderClick={
          isFounder ? () => openAppWindow("founder-dashboard") : undefined
        }
        onMiningClick={() => openAppWindow("mining-panel")}
        onDefendClick={() => openAppWindow("defend-panel")}
        onTreasuryClick={() => openAppWindow("founder-dashboard")}
        onGasometerClick={() => openAppWindow("gasometer")}
        onPinChange={setIsPinned}
        isFounder={isFounder}
      />

      {/* MAIN CANVAS */}
      <main className="pf-main" id="pf-main-content" role="main">
        <PFWindowManager
          canvasComponent={canvasComponent}
          componentFactory={componentFactory}
        />
      </main>

      {/* DOCK (Left Side) — Only in main window, NOT in pop-outs */}
      <PFDock
        onCatalogClick={() => setShowCatalog(true)}
        onToolsClick={() => {
          const next = !showRightToolbar;
          setShowRightToolbar(next);
          if (next) setShowSettings(false);
        }}
        onStoreClick={() => setShowStore(true)}
        onSettingsClick={() => setShowSettings(true)}
        onBundleClick={() => openAppWindow("bundle-creator")}
        onDevModeToggle={(isActive) => {
          setDevMode(isActive);
          if (isActive) openAppWindow("devtools");
        }}
        onPluginOpen={handleOpenPlugin}
        onPluginClose={handleClosePlugin}
        onPluginUninstall={handleUninstallPlugin}
        plugins={installedPlugins}
        devMode={devMode}
        isFounder={isFounder}
      />

      {/* RIGHT TOOLBAR (Drawing Tools) */}
      <PFRightToolbar
        isOpen={showRightToolbar}
        onClose={() => setShowRightToolbar(false)}
      />

      {/* FLOATING AI CHAT (Bottom Right) — Only in main window */}
      <PFChat />

      {/* 🧠 ORCHESTRATOR PANEL (Right Side) */}
      {showOrchestrator && (
        <PFOrchestrator
          activeModuleIds={installedPlugins.map((p) => p.id)}
          onClose={() => setShowOrchestrator(false)}
        />
      )}

      {/* SETTINGS MODAL */}
      <PFSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* CATALOG MODAL */}
      <PFCatalog
        isOpen={showCatalog}
        onClose={() => setShowCatalog(false)}
        plugins={installedPlugins}
        onPluginUninstall={handleUninstallPlugin}
        onOpenApp={handleOpenApp}
      />

      {/* STORE MODAL */}
      {showStore && (
        <PFStore
          onClose={() => setShowStore(false)}
          onInstall={handleInstallPlugin}
        />
      )}

      {/* NOTIFICATIONS PANEL */}
      <PFNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* GASOMETER MODAL */}
      {showGasometer && (
        <GasometerPanel onClose={() => setShowGasometer(false)} />
      )}

      {/* WATERMARK — Panda Fabrics branding + Medusa + MCP */}
      <footer className="pf-footer">
        <span className="pf-footer-accent" />
        PANDA FABRICS
        <span className="pf-footer-accent" />
        POWERED BY TLDRAW • 🐙 MEDUSA
        {mcpToolCount > 0 && (
          <span
            className="pf-footer-mcp"
            title={`${mcpToolCount} MCP tools from ${mcpActiveModules.length} modules`}
            onClick={() => setShowOrchestrator(true)}
            style={{ cursor: "pointer", marginLeft: 8 }}
          >
            🧠 MCP {mcpToolCount}
          </span>
        )}
        <span className="pf-footer-version">
          v6.7 • {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

// Wrap with AuthProvider
function App() {
  return (
    <PFErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <LoginGate>
            <AppContent />
          </LoginGate>
        </AuthProvider>
      </I18nProvider>
    </PFErrorBoundary>
  );
}

export default App;
