/**
 * 📦 Panda Module Loader
 * ==================================================
 * Carrega e valida módulos/tentáculos baseado no panda.manifest.json.
 * Taxonomy: Módulos (canvas apps) | Tentáculos (system hooks) | Themes
 * See: 8.docs/PF_MEDUSA_REFERENCE.md §2
 *
 * @author Panda Factory
 * @version 2.0.0
 */

(function (window) {
  "use strict";

  const REQUIRED_FIELDS = ["id", "name", "version", "type", "entryPoint"];
  const VALID_TYPES = [
    "game/wasm",
    "app/js",
    "connector/js",
    "tool/mcp",
    "widget/html",
  ];
  const SDK_VERSION = "0.9.5";

  /**
   * Registry de módulos carregados
   */
  const _loadedModules = new Map();

  /**
   * Valida um manifest (panda.manifest.json)
   * @param {object} manifest
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function validateManifest(manifest) {
    const errors = [];

    // Campos obrigatórios
    for (const field of REQUIRED_FIELDS) {
      if (!manifest[field]) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    }

    // Tipo válido
    if (manifest.type && !VALID_TYPES.includes(manifest.type)) {
      errors.push(
        `Tipo inválido: ${manifest.type}. Válidos: ${VALID_TYPES.join(", ")}`,
      );
    }

    // Versão da API
    if (manifest.api?.minVersion) {
      const [major] = manifest.api.minVersion.split(".").map(Number);
      if (major > 1) {
        // SDK_VERSION major
        errors.push(
          `Módulo requer API v${manifest.api.minVersion}, SDK atual é v${SDK_VERSION}`,
        );
      }
    }

    // ID format: @namespace/item-name or com.vendor.item-name
    if (
      manifest.id &&
      !/^(@[a-z0-9-]+\/[a-z0-9-]+|[a-z0-9]+\.[a-z0-9]+\.[a-z0-9-]+)$/i.test(
        manifest.id,
      )
    ) {
      errors.push(
        `ID inválido: ${manifest.id}. Use formato: @namespace/item-name ou com.vendor.item-name`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Solicita permissões ao usuário
   * @param {string[]} permissions
   * @param {string} moduleName
   * @returns {Promise<boolean>}
   */
  async function requestPermissions(permissions, moduleName) {
    if (!permissions || permissions.length === 0) return true;

    const highRisk = permissions.filter(
      (p) => p.includes("wallet.pay") || p.includes("bridge.wasm"),
    );

    // Auto-approve low risk permissions
    if (highRisk.length === 0) {
      console.log(
        `[ModuleLoader] Auto-approved permissions for ${moduleName}:`,
        permissions,
      );
      return true;
    }

    // Request approval for high risk
    if (window.Panda?.UI?.modal) {
      const result = await window.Panda.UI.modal({
        title: "🔐 Permissões do Módulo",
        message: `"${moduleName}" solicita:\n\n• ${permissions.join("\n• ")}\n\nDeseja permitir?`,
        type: "confirm",
        buttons: ["Negar", "Permitir"],
      });
      return result.confirmed;
    }

    // Fallback: Always approve in dev mode
    console.warn("[ModuleLoader] Modal não disponível - aprovando em modo dev");
    return true;
  }

  /**
   * Carrega o entry point baseado no tipo
   * @param {object} manifest
   * @param {string} basePath
   * @returns {Promise<object>}
   */
  async function loadEntryPoint(manifest, basePath) {
    const entryUrl = `${basePath}/${manifest.entryPoint}`;

    switch (manifest.type) {
      case "game/wasm":
      case "app/wasm":
        // Carrega Wasm via Bridge
        if (window.Panda?.Bridge?.loadModule) {
          return window.Panda.Bridge.loadModule(entryUrl);
        }
        throw new Error("Bridge.loadModule não disponível");

      case "app/js":
      case "connector/js":
        // Carrega JavaScript via script tag
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = entryUrl;
          script.onload = () => resolve({ loaded: true, src: entryUrl });
          script.onerror = () =>
            reject(new Error(`Falha ao carregar ${entryUrl}`));
          document.head.appendChild(script);
        });

      case "widget/html":
        // Retorna URL para iframe
        return { type: "iframe", src: entryUrl };

      case "tool/mcp":
        // Conecta via MCP Bridge
        if (window.Panda?.Bridge?.execute) {
          return window.Panda.Bridge.execute("mcp_connect", {
            url: manifest.entryPoint,
          });
        }
        throw new Error("Bridge.execute não disponível");

      default:
        throw new Error(`Tipo desconhecido: ${manifest.type}`);
    }
  }

  /**
   * Registra hooks do módulo/tentáculo
   * @param {object} manifest
   */
  function registerHooks(manifest) {
    const hooks = manifest.hooks || {};

    if (hooks.mainMenu && window.Panda?.UI?.registerMenu) {
      window.Panda.UI.registerMenu(
        "mainmenu",
        manifest.name,
        () => {
          window.Panda.emit("module:launch", { moduleId: manifest.id });
        },
        { icon: "📦", moduleId: manifest.id },
      );
    }

    if (hooks.appDock && window.Panda?.UI?.registerMenu) {
      window.Panda.UI.registerMenu(
        "appdock",
        manifest.name,
        () => {
          window.Panda.emit("module:launch", { moduleId: manifest.id });
        },
        { icon: "🔌", moduleId: manifest.id },
      );
    }
  }

  /**
   * API Pública do ModuleLoader
   */
  const ModuleLoader = {
    /**
     * Carrega um módulo/tentáculo a partir do manifest
     * @param {string} manifestUrl - URL do panda.manifest.json
     * @returns {Promise<{success: boolean, module?: object, error?: string}>}
     */
    load: async function (manifestUrl) {
      console.log(`[ModuleLoader] Loading: ${manifestUrl}`);

      try {
        // 1. Fetch manifest
        const res = await fetch(manifestUrl);
        if (!res.ok) throw new Error(`Manifest não encontrado: ${manifestUrl}`);

        const manifest = await res.json();
        const basePath = manifestUrl.substring(0, manifestUrl.lastIndexOf("/"));

        // 2. Validate
        const validation = validateManifest(manifest);
        if (!validation.valid) {
          return {
            success: false,
            error: `Manifest inválido: ${validation.errors.join(", ")}`,
          };
        }

        // 3. Check if already loaded
        if (_loadedModules.has(manifest.id)) {
          console.warn(`[ModuleLoader] Módulo já carregado: ${manifest.id}`);
          return { success: true, module: _loadedModules.get(manifest.id) };
        }

        // 4. Request permissions
        const approved = await requestPermissions(
          manifest.permissions,
          manifest.name,
        );
        if (!approved) {
          return { success: false, error: "Permissões negadas pelo usuário" };
        }

        // 5. Load entry point
        const loaded = await loadEntryPoint(manifest, basePath);

        // 6. Register hooks
        registerHooks(manifest);

        // 7. Store in registry
        const mod = {
          manifest,
          loaded,
          loadedAt: Date.now(),
          permissions: manifest.permissions || [],
        };
        _loadedModules.set(manifest.id, mod);

        console.log(
          `%c[ModuleLoader] ✅ Loaded: ${manifest.name}`,
          "color: #00d4aa",
        );
        window.Panda?.emit("module:loaded", {
          moduleId: manifest.id,
          manifest,
        });

        return { success: true, module: mod };
      } catch (error) {
        console.error("[ModuleLoader] Load failed:", error);
        return { success: false, error: error.message };
      }
    },

    /**
     * Descarrega um módulo/tentáculo
     * @param {string} moduleId
     */
    unload: function (moduleId) {
      const mod = _loadedModules.get(moduleId);
      if (!mod) return false;

      // Remove menu items
      const menuItems = window.Panda?.UI?.getMenuItems?.() || [];
      menuItems
        .filter((m) => m.moduleId === moduleId)
        .forEach((m) => window.Panda?.UI?.unregisterMenu?.(m.id));

      _loadedModules.delete(moduleId);
      window.Panda?.emit("module:unloaded", { moduleId });
      console.log(`[ModuleLoader] Unloaded: ${moduleId}`);
      return true;
    },

    /**
     * Lista módulos/tentáculos carregados
     * @returns {Array<{id: string, name: string, version: string}>}
     */
    list: function () {
      return Array.from(_loadedModules.entries()).map(([id, p]) => ({
        id,
        name: p.manifest.name,
        version: p.manifest.version,
        type: p.manifest.type,
        loadedAt: p.loadedAt,
      }));
    },

    /**
     * Valida manifest sem carregar
     * @param {object} manifest
     * @returns {{ valid: boolean, errors: string[] }}
     */
    validate: validateManifest,

    /**
     * Retorna versão do SDK suportada
     */
    getSdkVersion: () => SDK_VERSION,
  };

  // Exporta (backward compat: PandaPluginLoader ainda funciona)
  window.PandaModuleLoader = ModuleLoader;
  window.PandaPluginLoader = ModuleLoader; // backward compat

  // Integra com SDK se disponível
  if (window.Panda) {
    window.Panda.loadModule = ModuleLoader.load;
    window.Panda.unloadModule = ModuleLoader.unload;
    window.Panda.listModules = ModuleLoader.list;

    // Backward compat aliases
    window.Panda.loadPlugin = ModuleLoader.load;
    window.Panda.unloadPlugin = ModuleLoader.unload;
    window.Panda.listPlugins = ModuleLoader.list;

    console.log("%c[Panda] ModuleLoader integrated", "color: #00d4aa");
  }
})(window);
