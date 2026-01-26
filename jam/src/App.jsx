import React, { useState } from "react";
import JamCanvas from "./components/JamCanvas";
import JamDock from "./components/JamDock";
import JamStatusBar from "./components/JamStatusBar";
import JamStore from "./components/JamStore";
import JamCatalog from "./components/JamCatalog";
import JamChat from "./components/JamChat";
import JamSettings from "./components/JamSettings";
import JamRightToolbar from "./components/JamRightToolbar";
import LoginGate from "./components/LoginGate";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { StatusBar } from "./components/StatusBar";
import { FounderDashboard } from "./components/FounderDashboard";

/**
 * 🐼 Panda Jam - Main Application v5.1
 *
 * Complete UI with:
 * - Status Bar (top) with status pills, energy, treasury, user info
 * - TLDraw Canvas (center)
 * - Dock (left) with quick access
 * - Right Toolbar for all drawing tools
 * - Settings Modal (10 sections)
 * - Catalog modal
 * - Store modal
 * - Floating AI Chat (bottom right)
 */
function App() {
  const [showStore, setShowStore] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRightToolbar, setShowRightToolbar] = useState(false);
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [devMode, setDevMode] = useState(false);

  // Install plugin from store
  const handleInstallPlugin = (plugin) => {
    setInstalledPlugins([...installedPlugins, plugin]);
    setShowStore(false);
  };

  // Open catalog
  const handleOpenCatalog = () => {
    setShowCatalog(true);
  };

  // Toggle right toolbar (drawing tools)
  const handleToggleToolbar = () => {
    setShowRightToolbar(!showRightToolbar);
  };

  return (
    <LoginGate>
      <div className="jam-container">
        {/* Status Bar (Top) */}
        <JamStatusBar
          onStoreClick={() => setShowStore(true)}
          onSettingsClick={() => setShowSettings(true)}
        />

        {/* Main Canvas Area */}
        <main className="jam-main">
          <JamCanvas plugins={installedPlugins} />
        </main>

        {/* Dock (Left Side) */}
        <JamDock
          onCatalogClick={handleOpenCatalog}
          onToolsClick={handleToggleToolbar}
          onDevModeToggle={setDevMode}
          plugins={installedPlugins}
          devMode={devMode}
        />

        {/* Right Toolbar (Drawing Tools) */}
        <JamRightToolbar
          isOpen={showRightToolbar}
          onClose={() => setShowRightToolbar(false)}
          devMode={devMode}
        />

        {/* Floating AI Chat (Bottom Right) */}
        <JamChat />

        {/* Settings Modal */}
        <JamSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        {/* Catalog Modal */}
        <JamCatalog
          isOpen={showCatalog}
          onClose={() => setShowCatalog(false)}
          plugins={installedPlugins}
        />

        {/* Store Modal */}
        {showStore && (
          <JamStore
            onClose={() => setShowStore(false)}
            onInstall={handleInstallPlugin}
          />
        )}

        {/* Watermark - Required by TLDraw license */}
        <footer className="jam-footer">🐼 Panda Factory - TLDraw</footer>
      </div>
    </LoginGate>
  );
}

export default App;
