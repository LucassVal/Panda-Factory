import React, { useState, useCallback, useRef, useEffect } from "react";
import PFCanvas from "./components/PFCanvas";
import PFDock from "./components/PFDock";
import PFStatusBar from "./components/PFStatusBar";
import PFStore from "./components/PFStore";
import PFCatalog from "./components/PFCatalog";
import PFChat from "./components/PFChat";
import PFSettings from "./components/PFSettings";
import PFRightToolbar from "./components/PFRightToolbar";
import PFNotifications from "./components/PFNotifications";
import LoginGate from "./components/PFLoginGate";
import { AuthProvider, useAuth } from "./hooks/useAuth";

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

/**
 * 🐼 PANDA FABRICS — MAIN APPLICATION v6.5
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

  const { isFounder } = useAuth();

  // Global event listeners for Welcome Overlay & Catalog actions
  useEffect(() => {
    const handleOpenStore = () => setShowStore(true);
    const handleToggleChat = () => {
      window.dispatchEvent(new CustomEvent("panda:chat-toggle-internal"));
    };
    const handleOpenGasometer = () => setShowGasometer(true);

    window.addEventListener("panda:open-store", handleOpenStore);
    window.addEventListener("panda:toggle-chat", handleToggleChat);
    window.addEventListener("panda:open-gasometer", handleOpenGasometer);
    return () => {
      window.removeEventListener("panda:open-store", handleOpenStore);
      window.removeEventListener("panda:toggle-chat", handleToggleChat);
      window.removeEventListener("panda:open-gasometer", handleOpenGasometer);
    };
  }, []);

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
  const componentFactory = useCallback(
    (componentType, config) => {
      switch (componentType) {
        case "founder-dashboard":
          return <FounderDashboard />;
        case "pat-council":
          return (
            <PATCouncilPanel
              isOpen={true}
              onClose={() => {}}
              activeTool={config?.activeTool || "treasury"}
              embedded={true}
            />
          );
        case "devtools":
          return (
            <DevModePanel isOpen={true} onClose={() => {}} embedded={true} />
          );
        case "settings":
          return (
            <PFSettings isOpen={true} onClose={() => {}} embedded={true} />
          );
        case "store":
          return (
            <PFStore
              onClose={() => {}}
              onInstall={handleInstallPlugin}
              embedded={true}
            />
          );
        case "catalog":
          return (
            <PFCatalog
              isOpen={true}
              onClose={() => {}}
              plugins={installedPlugins}
              onPluginUninstall={handleUninstallPlugin}
              onOpenApp={handleOpenApp}
              embedded={true}
            />
          );
        default: {
          // Check for known extra modules
          if (componentType === "bundle-creator") {
            return <BundleCreator onClose={() => {}} embedded={true} />;
          }
          if (componentType === "finance-panel") {
            return <FinancePanel onClose={() => {}} embedded={true} />;
          }
          if (componentType === "gasometer") {
            return <GasometerPanel onClose={() => {}} embedded={true} />;
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
      {/* STATUS BAR (Top) */}
      <PFStatusBar
        onStoreClick={() => setShowStore(true)}
        onSettingsClick={() => setShowSettings(true)}
        onNotificationsClick={() => setShowNotifications(true)}
        onFounderClick={
          isFounder
            ? () => openAppWindow("founder-dashboard")
            : undefined
        }
        onTreasuryClick={() =>
          openAppWindow("pat-council", { activeTool: "treasury" })
        }
        onPinChange={setIsPinned}
        isFounder={isFounder}
      />

      {/* MAIN CANVAS */}
      <main className="pf-main">
        <PFWindowManager
          canvasComponent={canvasComponent}
          componentFactory={componentFactory}
        />
      </main>

      {/* DOCK (Left Side) — Only in main window, NOT in pop-outs */}
      <PFDock
        onCatalogClick={() => setShowCatalog(true)}
        onToolsClick={() => setShowRightToolbar(!showRightToolbar)}
        onStoreClick={() => setShowStore(true)}
        onSettingsClick={() => setShowSettings(true)}
        onDevModeToggle={setDevMode}
        onPluginOpen={handleOpenPlugin}
        onPluginClose={handleClosePlugin}
        onPluginUninstall={handleUninstallPlugin}
        plugins={installedPlugins}
        devMode={devMode}
      />

      {/* RIGHT TOOLBAR (Drawing Tools) */}
      <PFRightToolbar
        isOpen={showRightToolbar}
        onClose={() => setShowRightToolbar(false)}
        devMode={devMode}
        onDevToolOpen={(toolId) => {
          if (["treasury", "constitution", "rig"].includes(toolId)) {
            openAppWindow("pat-council", { activeTool: toolId });
          } else {
            openAppWindow("devtools");
          }
        }}
      />

      {/* FLOATING AI CHAT (Bottom Right) — Only in main window */}
      <PFChat />

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



      {/* WATERMARK — Panda Fabrics branding + Medusa */}
      <footer className="pf-footer">
        <span className="pf-footer-accent" />
        🐼 PANDA FABRICS
        <span className="pf-footer-accent" />
        POWERED BY TLDRAW • 🐙 MEDUSA
        <span className="pf-footer-version">v6.5 • {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

// Wrap with AuthProvider
function App() {
  return (
    <AuthProvider>
      <LoginGate>
        <AppContent />
      </LoginGate>
    </AuthProvider>
  );
}

export default App;
