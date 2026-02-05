/**
 * 🐼 Panda Fabrics - Module Loader v1.0
 * Handles dynamic loading/unloading of apps (modules) and Dock management.
 */
export class ModuleLoader {
  constructor() {
    this.container = document.getElementById("inicio-view"); // Default container (Canvas)
    this.dockContainer = document.getElementById("appDockItems");
    this.activeModule = null;

    // 📋 Module Registry (The "OS" Installed Apps)
    // devs: locked=true prevents the user from closing the app from the dock.
    this.registry = [
      { id: "home", name: "Início", icon: "🏠", locked: true, url: null }, // System
      {
        id: "crm",
        name: "Contatos",
        icon: "📋",
        locked: false,
        url: "modules/crm/index.html",
      },
      {
        id: "agenda",
        name: "Agenda",
        icon: "📅",
        locked: false,
        url: "modules/agenda/index.html",
      },
      {
        id: "reports",
        name: "Relatórios",
        icon: "📊",
        locked: false,
        url: "modules/reports/index.html",
      },
      {
        id: "store",
        name: "Loja",
        icon: "🏪",
        locked: false,
        url: "modules/store/index.html",
      },
    ];

    this.init();
  }

  init() {
    console.log("🐼 ModuleLoader: Initializing...");
    this.renderDock();

    // Auto-load Home
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

      // Icon
      item.innerHTML = `<span>${mod.icon}</span>`;

      // Close Badge (X) - Only if NOT locked
      if (!mod.locked) {
        const closeBtn = document.createElement("div");
        closeBtn.className = "dock-close-badge";
        closeBtn.innerHTML = "×";
        closeBtn.title = "Fechar Aplicativo";
        closeBtn.onclick = (e) => {
          e.stopPropagation(); // Prevent opening while closing
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

    // 1. Update UI
    this.activeModule = moduleId;
    this.renderDock(); // Re-render to update active state

    // 2. Clear Container (or hide current)
    // For this version, we replace content. In V2 we might use tabs/iframes.
    // Special case: Home (Clean Canvas)
    if (moduleId === "home") {
      this.container.innerHTML = `
                <!-- OMNI-BAR (Unified & Integrated) -->
                <!-- BARRA FLUTUANTE UNIFICADA (Arrastável) -->
                <div style="text-align:center; margin-top:20vh; color:#ccc;">
                    <h1>🐼</h1>
                    <p>Canvas Limpo</p>
                </div>
            `;
      return;
    }

    const mod = this.registry.find((m) => m.id === moduleId);
    if (!mod || !mod.url) {
      console.error(`Module ${moduleId} not found or no URL.`);
      return;
    }

    // 3. Fetch Content
    try {
      this.container.innerHTML = `<div class="panda-loading-spinner">🐼 Carregando ${mod.name}...</div>`;

      const response = await fetch(mod.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();

      // 4. Inject
      // Wrap in a specific container to ensure CSS isolation if needed
      this.container.innerHTML = `<div id="module-${moduleId}" class="module-view fade-in">${html}</div>`;

      // 5. Re-hydrate Scripts (Simple version)
      // HTML injected via innerHTML doesn't execute script tags automatically.
      // We need to parse and run them if the modules have inline scripts.
      this.executeScripts(this.container);

      // 6. Module-specific initialization hooks
      if (moduleId === "crm" && typeof window.carregarDados === "function") {
        console.log("🐼 Initializing CRM module data...");
        await window.carregarDados();
      }
    } catch (err) {
      console.error("Failed to load module:", err);
      this.container.innerHTML = `<div class="error-state">❌ Erro ao carregar ${mod.name}</div>`;
    }
  }

  unloadModule(moduleId) {
    console.log(`🐼 Unloading Module: ${moduleId}`);

    // Remove from registry? Or just hide?
    // User said: "fechar o icone e a aplicação"
    // So we effectively "uninstall" it from the Dock for this session?
    // Or just stop running it?
    // If I remove from registry, it disappears.

    // Let's filter it out of registry (Soft Unload)
    this.registry = this.registry.filter((m) => m.id !== moduleId);

    // If it was valid, switch to Home
    if (this.activeModule === moduleId) {
      this.loadModule("home");
    } else {
      this.renderDock();
    }
  }

  executeScripts(container) {
    // Find all script tags in the injected content
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");

      // Copy attributes
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );

      // Copy content
      newScript.textContent = oldScript.textContent;

      // Execute
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
}

// Instantiate
document.addEventListener("DOMContentLoaded", () => {
  window.PandaLoader = new ModuleLoader();
});
