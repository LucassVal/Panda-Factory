import React, { useState } from 'react';
import JamCanvas from './components/JamCanvas';
import JamDock from './components/JamDock';
import JamHeader from './components/JamHeader';
import JamStore from './components/JamStore';

/**
 * 🐼 Panda Jam - Main Application
 * 
 * The core UI canvas where everything runs.
 * - TLDraw for infinite canvas
 * - Dock for app launcher
 * - Store for plugins
 */
function App() {
  const [showStore, setShowStore] = useState(false);
  const [installedPlugins, setInstalledPlugins] = useState([]);

  // Install plugin from store
  const handleInstallPlugin = (plugin) => {
    setInstalledPlugins([...installedPlugins, plugin]);
    setShowStore(false);
  };

  return (
    <div className="jam-container">
      {/* Header */}
      <JamHeader onStoreClick={() => setShowStore(true)} />

      {/* Main Canvas Area */}
      <main className="jam-main">
        <JamCanvas plugins={installedPlugins} />
      </main>

      {/* Dock (Bottom) */}
      <JamDock 
        onStoreClick={() => setShowStore(true)}
        plugins={installedPlugins}
      />

      {/* Store Modal */}
      {showStore && (
        <JamStore 
          onClose={() => setShowStore(false)}
          onInstall={handleInstallPlugin}
        />
      )}

      {/* Watermark - ALWAYS VISIBLE (cannot remove) */}
      <div className="jam-watermark">
        Powered by Panda 🐼
      </div>
    </div>
  );
}

export default App;
