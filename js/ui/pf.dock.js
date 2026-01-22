/**
 * ⚓ Panda Fabrics - Dock Controller
 * Manages the App Dock and DevTools Dock interactions.
 */
export class DockController {
  constructor(loader) {
    this.loader = loader;
    this.initRegistries();
  }

  initRegistries() {
    this.moduleRegistry = {
      dashboard: () => this.loader.loadModule("dashboard"),
      crm: () => this.loader.loadModule("crm"),
      analytics: () => this.loader.loadModule("analytics"),
      store: () => this.loader.loadModule("store"),
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

  openModule(moduleName) {
    const handler = this.moduleRegistry[moduleName];
    if (handler) handler();
    else console.warn(`Module "${moduleName}" not found in registry`);
  }

  openDevTool(toolName) {
    const handler = this.devToolRegistry[toolName];
    if (handler) handler();
    else console.warn(`DevTool "${toolName}" not found in registry`);
  }
}
