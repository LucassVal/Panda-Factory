/**
 * 🐼 Core_Loader.js
 * The Neural Spine of Panda OS.
 * Responsible for loading Components (Fixed) and Modules (Dynamic).
 * Handles GAS flattening, DOM Caching, and Script Execution.
 */

window.Panda = window.Panda || {};

Panda.Cache = {}; // Cache for loaded HTML strings
Panda.Modules = {}; // Registry for active module instances

Panda.Loader = {
  // --- Configuration ---

  // Maps semantic names to filesystem/GAS names
  // GAS flattens folders, so everything is at root level with prefixes.
  REGISTRY: {
    // Components (Core UI)
    header: { file: "Comp_HeaderStatus.html", target: "#header-container" },
    appDock: { file: "Comp_AppDock.html", target: "#app-dock-container" },
    devDock: { file: "Comp_DevToolsDock.html", target: "#dev-dock-container" },
    settings: {
      file: "Comp_SettingsModal.html",
      target: "#settings-modal-container",
    },
    sidebar: { file: "Comp_Sidebar.html", target: "#sidebar-container" },

    // Modules (Lazy Loaded) - Examples
    crm: { file: "Mod_CRM_View.html" },
    analytics: { file: "Mod_Analytics_View.html" },
    store: { file: "Mod_Store_View.html" },
  },

  /**
   * Initialize the Core Components
   */
  init: async function () {
    console.log("🐼 Panda Loader: Initializing Core...");

    const coreComponents = [
      "header",
      "appDock",
      "devDock",
      "settings",
      "sidebar",
    ];

    // Load in parallel
    await Promise.all(coreComponents.map((id) => this.loadComponent(id)));

    console.log("✅ Panda Core Ready");

    // Trigger generic ready event
    document.dispatchEvent(new Event("PandaReady"));

    // Init Controllers if available
    if (window.DockController) window.DockController.init();
  },

  /**
   * Load a Fixed Component into a specific container
   * @param {string} id - Component ID from REGISTRY
   */
  loadComponent: async function (id) {
    const config = this.REGISTRY[id];
    if (!config)
      return console.error(`❌ Component '${id}' not found in Registry.`);

    const container = document.querySelector(config.target);
    if (!container)
      return console.warn(
        `⚠️ Target '${config.target}' not found for '${id}'.`,
      );

    const html = await this._fetchHTML(config.file);
    if (html) {
      this._injectHTML(container, html);
      console.log(`🔹 Loaded Component: ${id}`);
    }
  },

  /**
   * Load a Dynamic Module into the Main Viewport
   * @param {string} moduleId - Module ID from REGISTRY
   */
  openModule: async function (moduleId) {
    console.log(`🚀 Opening Module: ${moduleId}`);

    // TODO: Implement Viewport Logic (Clear previous, show loading)
    // For now, just logging the intent as we focus on Components first.

    const config = this.REGISTRY[moduleId] || {
      file: `Mod_${moduleId}_View.html`,
    }; // Fallback naming

    const html = await this._fetchHTML(config.file);
    // Logic to inject into #main-app-viewport would go here
  },

  /**
   * Internal: Fetch HTML from Server (GAS) or Local (Dev)
   */
  _fetchHTML: async function (filename) {
    // 1. Check Cache
    if (Panda.Cache[filename]) {
      return Panda.Cache[filename];
    }

    try {
      let content = "";

      // Detect Environment
      const isGAS =
        typeof google !== "undefined" && google.script && google.script.run;

      if (isGAS) {
        // ☁️ Production: Call Google Apps Script Backend
        // We wrap it in a Promise because google.script.run is callback-based
        content = await new Promise((resolve, reject) => {
          google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .loadHtml(filename); // Backend function must exist!
        });
      } else {
        // 🏠 Local Dev: Fetch from filesystem
        // Since folders exist locally but flattened in GAS, we need to map paths for local dev.
        // Simple heuristic: if it starts with Comp_, look in components/
        let path = filename;
        if (filename.startsWith("Comp_")) path = `components/${filename}`;
        if (filename.startsWith("Mod_"))
          path = `modules/${filename.split("_")[1].toLowerCase()}/${filename}`; // Mod_CRM_View -> modules/crm/... (complex, simplify for now)

        // Simplified Local Path Mapping for Components
        if (filename.includes("Comp_")) path = `components/${filename}`;

        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        content = await response.text();
      }

      // Save to Cache
      Panda.Cache[filename] = content;
      return content;
    } catch (error) {
      console.error(`🔥 Failed to load ${filename}:`, error);
      return `<div class="error-box">Failed to load ${filename}<br><small>${error.message}</small></div>`;
    }
  },

  /**
   * Internal: Inject HTML and Execute Scripts safely
   */
  _injectHTML: function (container, html) {
    container.innerHTML = html;

    // ⚡ Extract and Execute Scripts
    // Browser innerHTML does not execute <script> tags for security.
    // We must manually recreate them.
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");

      // Copy Attributes (src, type, etc)
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );

      // Copy Content
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));

      // Replace
      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    });
  },
};

// Auto-boot
document.addEventListener("DOMContentLoaded", () => Panda.Loader.init());
