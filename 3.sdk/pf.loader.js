/**
 * 🐼 Panda Factory — Module Loader v2.0
 *
 * Handles dynamic loading/unloading of app modules (views) and Dock management.
 * Consumes module definitions from PandaKernel or a local fallback registry.
 *
 * Integration points:
 *   - PandaKernel.CORE_MODULES   → Core module definitions
 *   - Panda.emit("module:loaded") → EventBus notification
 *   - Panda.emit("module:error")  → Error notification
 *
 * Paths resolve relative to the base URL of the served app.
 */

class ModuleLoader {
  constructor() {
    this.container = document.getElementById("inicio-view");
    this.dockContainer = document.getElementById("appDockItems");
    this.activeModule = null;

    // Build registry from kernel or use fallback
    this.registry = this._buildRegistry();

    this.init();
  }

  /**
   * Build module registry from PandaKernel if available.
   * Falls back to a static default if kernel isn't loaded yet.
   * @returns {Array<{id: string, name: string, icon: string, locked: boolean, url: string|null}>}
   */
  _buildRegistry() {
    // System modules (always present)
    const modules = [
      { id: "home", name: "Início", icon: "🏠", locked: true, url: null },
    ];

    // App modules — paths aligned with numbered folder structure
    const appModules = [
      {
        id: "analytics",
        name: "Analytics",
        icon: "📊",
        locked: false,
        url: "4.ui/4.3.modules/Mod_Analytics_View.html",
      },
      {
        id: "store",
        name: "Loja",
        icon: "🏪",
        locked: false,
        url: "4.ui/4.3.modules/Mod_Store_View.html",
      },
    ];

    // Add Founder Dashboard if user has founder access
    try {
      const user = JSON.parse(localStorage.getItem("panda_user") || "{}");
      if (
        user.role === "founder" ||
        localStorage.getItem("panda_founder_mode")
      ) {
        appModules.push({
          id: "founder-dash",
          name: "System Health",
          icon: "🔍",
          locked: false,
          url: "4.ui/4.3.modules/Mod_Founder_Dashboard.html",
        });
      }
    } catch (e) {
      // Silently skip — no user data
    }

    return [...modules, ...appModules];
  }

  init() {
    console.log(
      `🐼 ModuleLoader: Initializing (${this.registry.length} modules)...`,
    );
    this.renderDock();
    this.loadModule("home");
  }

  renderDock() {
    if (!this.dockContainer) return;

    this.dockContainer.innerHTML = "";

    this.registry.forEach((mod) => {
      const item = document.createElement("div");
      item.className = `nav-item ${this.activeModule === mod.id ? "active" : ""}`;
      item.title = mod.name;
      item.onclick = () => this.loadModule(mod.id);

      item.innerHTML = `<span>${mod.icon}</span>`;

      if (!mod.locked) {
        const closeBtn = document.createElement("div");
        closeBtn.className = "dock-close-badge";
        closeBtn.innerHTML = "×";
        closeBtn.title = "Fechar Aplicativo";
        closeBtn.onclick = (e) => {
          e.stopPropagation();
          this.unloadModule(mod.id);
        };
        item.appendChild(closeBtn);
      }

      this.dockContainer.appendChild(item);
    });
  }

  async loadModule(moduleId) {
    if (this.activeModule === moduleId) return;

    console.log(`🐼 Loading Module: ${moduleId}`);

    this.activeModule = moduleId;
    this.renderDock();

    // Home = clean canvas
    if (moduleId === "home") {
      this.container.innerHTML = `
        <div style="text-align:center; margin-top:20vh; color:#ccc;">
          <h1>🐼</h1>
          <p>Canvas Limpo</p>
        </div>
      `;
      if (window.Panda) Panda.emit("module:loaded", { id: "home" });
      return;
    }

    const mod = this.registry.find((m) => m.id === moduleId);
    if (!mod || !mod.url) {
      console.error(`Module ${moduleId} not found or no URL.`);
      if (window.Panda)
        Panda.emit("module:error", { id: moduleId, error: "not_found" });
      return;
    }

    try {
      this.container.innerHTML = `<div class="panda-loading-spinner">🐼 Carregando ${mod.name}...</div>`;

      const response = await fetch(mod.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      this.container.innerHTML = `<div id="module-${moduleId}" class="module-view fade-in">${html}</div>`;

      // Re-hydrate scripts
      this.executeScripts(this.container);

      // Module-specific hooks
      if (moduleId === "crm" && typeof window.carregarDados === "function") {
        console.log("🐼 Initializing CRM module data...");
        await window.carregarDados();
      }

      if (window.Panda) Panda.emit("module:loaded", { id: moduleId });
    } catch (err) {
      console.error("Failed to load module:", err);
      this.container.innerHTML = `<div class="error-state">❌ Erro ao carregar ${mod.name}</div>`;
      if (window.Panda)
        Panda.emit("module:error", { id: moduleId, error: err.message });
    }
  }

  unloadModule(moduleId) {
    console.log(`🐼 Unloading Module: ${moduleId}`);
    this.registry = this.registry.filter((m) => m.id !== moduleId);

    if (this.activeModule === moduleId) {
      this.loadModule("home");
    } else {
      this.renderDock();
    }

    if (window.Panda) Panda.emit("module:unloaded", { id: moduleId });
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
}

// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.PandaLoader = new ModuleLoader();
});
