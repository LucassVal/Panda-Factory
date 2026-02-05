/**
 * ⚓ Panda Fabrics - Dock Controller v1.2
 * Manages the App Dock, DevTools Dock, and SDK integrations.
 */
export class DockController {
  constructor(loader) {
    this.loader = loader;
    this.status = {
      agentConnected: false,
      modulesLoaded: 0,
      activeModule: null,
    };
    this.initRegistries();
    this.initSDKSync();
  }

  initRegistries() {
    this.moduleRegistry = {
      dashboard: () => this.loader.loadModule("dashboard"),
      crm: () => this.loader.loadModule("crm"),
      analytics: () => this.loader.loadModule("analytics"),
      store: () => this.loader.loadModule("store"),
      treasury: () => this.openTreasury(),
    };

    this.devToolRegistry = {
      extensions: () =>
        alert("🧩 Extension Marketplace - Open VSX integration coming soon!"),
      console: () => console.log("💻 Developer Console opened"),
      api: () => alert("🔌 API Tester - Coming soon!"),
      database: () => alert("🗄️ Database Explorer - Coming soon!"),
      ai: () => alert("🐼 AI Assistant Panel - Coming soon!"),
    };
  }

  /**
   * Sync with SDK for real-time status updates
   */
  initSDKSync() {
    if (typeof Panda === "undefined") {
      console.warn("⚓ DockController: SDK not available, using mock data");
      return;
    }

    // Listen for agent status changes
    Panda.on("agent:status", (data) => {
      this.status.agentConnected = data.connected;
      this.updateDockIndicators();
    });

    // Listen for module loading events
    Panda.on("module:loaded", (data) => {
      this.status.modulesLoaded++;
      this.status.activeModule = data.name;
      console.log(`⚓ Module loaded: ${data.name}`);
    });

    // Initial sync
    this.syncWithSDK();
  }

  async syncWithSDK() {
    try {
      if (typeof Panda !== "undefined" && Panda.Bridge) {
        this.status.agentConnected = Panda.Bridge.isConnected();
        this.updateDockIndicators();
      }
    } catch (e) {
      console.warn("⚓ SDK sync failed:", e.message);
    }
  }

  updateDockIndicators() {
    const agentPill = document.querySelector('[data-dock-status="agent"]');
    if (agentPill) {
      agentPill.classList.toggle("active", this.status.agentConnected);
      agentPill.textContent = this.status.agentConnected
        ? "🟢 Agent"
        : "🔴 Agent";
    }
  }

  openModule(moduleName) {
    const handler = this.moduleRegistry[moduleName];
    if (handler) {
      handler();
      this.status.activeModule = moduleName;
      if (typeof Panda !== "undefined") {
        Panda.emit("module:opened", {
          name: moduleName,
          timestamp: Date.now(),
        });
      }
    } else {
      console.warn(`Module "${moduleName}" not found in registry`);
    }
  }

  openDevTool(toolName) {
    const handler = this.devToolRegistry[toolName];
    if (handler) handler();
    else console.warn(`DevTool "${toolName}" not found in registry`);
  }

  openTreasury() {
    if (typeof PandaTreasury !== "undefined") {
      PandaTreasury.open();
    } else {
      console.warn("⚓ PandaTreasury not loaded");
    }
  }

  getStatus() {
    return { ...this.status };
  }
}
