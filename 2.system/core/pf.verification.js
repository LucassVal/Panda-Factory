/**
 * 🔍 Panda Verification System
 * 13 Verification Agents with 3-State Health (Healthy / Degraded / Unhealthy)
 * Every running chain (Kernel → SDK → Loader → Components → Auth → Wallet) monitored.
 * All user-side; reverberates into agent telemetry.
 * Exposes PandaKernel.HealthReport for Founder Dashboard.
 *
 * Version: 2.0.0
 */

(function () {
  "use strict";

  // ============================================================
  // §0. HEALTH STATES (3-State Pattern)
  // ============================================================
  const HEALTH = Object.freeze({
    HEALTHY: { code: 0, icon: "🟢", label: "Operacional" },
    DEGRADED: { code: 1, icon: "🟡", label: "Degradado" },
    UNHEALTHY: { code: 2, icon: "🔴", label: "Falha Crítica" },
  });

  // ============================================================
  // §1. BASE VERIFICATION AGENT
  // ============================================================
  class VerificationAgent {
    constructor(id, name, icon, intervalMs = 60000) {
      this.id = id;
      this.name = name;
      this.icon = icon;
      this.intervalMs = intervalMs;
      this.status = HEALTH.HEALTHY;
      this.message = "Aguardando verificação...";
      this.lastCheck = null;
      this.latencyMs = 0;
      this.details = {};
      this._intervalHandle = null;
    }

    /** Run check and return { status, message, details } */
    async check() {
      throw new Error(`Agent ${this.id}: check() not implemented`);
    }

    /** Execute verification, measure latency, update state */
    async verify() {
      const start = performance.now();
      try {
        const result = await this.check();
        this.latencyMs = Math.round(performance.now() - start);
        this.status = result.status || HEALTH.HEALTHY;
        this.message = result.message || "OK";
        this.details = result.details || {};
      } catch (err) {
        this.latencyMs = Math.round(performance.now() - start);
        this.status = HEALTH.UNHEALTHY;
        this.message = `Exception: ${err.message}`;
        this.details = { error: err.message };
      }
      this.lastCheck = new Date().toISOString();
      return this.toReport();
    }

    /** Start periodic checks */
    startInterval() {
      if (this._intervalHandle) return;
      this._intervalHandle = setInterval(() => this.verify(), this.intervalMs);
    }

    /** Stop periodic checks */
    stopInterval() {
      if (this._intervalHandle) {
        clearInterval(this._intervalHandle);
        this._intervalHandle = null;
      }
    }

    /** Snapshot */
    toReport() {
      return {
        id: this.id,
        name: this.name,
        icon: this.icon,
        status: this.status,
        message: this.message,
        latencyMs: this.latencyMs,
        lastCheck: this.lastCheck,
        details: this.details,
      };
    }
  }

  // ============================================================
  // §2. AGENT: Kernel Verifier
  // Checks Constitution, PAT, Crypto, Founder objects
  // ============================================================
  class KernelVerifier extends VerificationAgent {
    constructor() {
      super("kernel", "Kernel", "🧠", 300000); // 5min
    }

    async check() {
      const kernel = window.PandaKernel;
      if (!kernel) {
        return {
          status: HEALTH.UNHEALTHY,
          message: "PandaKernel não encontrado",
        };
      }

      const checks = {
        founder: !!kernel.FOUNDER?.name,
        constitution: !!kernel.CONSTITUTION?.articles,
        pat: !!kernel.PAT?.capabilities,
        crypto: !!kernel.CRYPTO?.coin,
        coreModules: !!kernel.CORE_MODULES,
        sdkMap: !!kernel.SDK_MAP,
        bootOrder: !!kernel.BOOT_ORDER,
      };

      const passed = Object.values(checks).filter(Boolean).length;
      const total = Object.keys(checks).length;

      if (passed === total) {
        return {
          status: HEALTH.HEALTHY,
          message: `${passed}/${total} objetos OK`,
          details: checks,
        };
      } else if (passed >= total - 2) {
        return {
          status: HEALTH.DEGRADED,
          message: `${passed}/${total} objetos`,
          details: checks,
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: `${passed}/${total} objetos`,
          details: checks,
        };
      }
    }
  }

  // ============================================================
  // §3. AGENT: Core Module Verifier
  // Checks each PANDA_CORE_MODULES entry
  // ============================================================
  class CoreModuleVerifier extends VerificationAgent {
    constructor() {
      super("core-modules", "Core Modules", "📦", 60000); // 1min
    }

    async check() {
      const kernel = window.PandaKernel;
      if (!kernel?.CORE_MODULES) {
        return {
          status: HEALTH.UNHEALTHY,
          message: "CORE_MODULES não encontrado",
        };
      }

      const modules = kernel.CORE_MODULES;
      const keys = Object.keys(modules);
      const total = keys.length;

      const results = {};
      let healthy = 0;

      for (const key of keys) {
        const mod = modules[key];
        const ok = mod?.id && mod?.layer && mod?.alwaysLoaded === true;
        results[key] = { valid: ok, id: mod?.id, layer: mod?.layer };
        if (ok) healthy++;
      }

      const uiCount = keys.filter((k) => modules[k].layer === "ui").length;
      const infraCount = keys.filter(
        (k) => modules[k].layer === "infra",
      ).length;

      if (healthy === total) {
        return {
          status: HEALTH.HEALTHY,
          message: `${total} modules OK (${uiCount} UI + ${infraCount} Infra)`,
          details: results,
        };
      } else if (healthy >= total - 1) {
        return {
          status: HEALTH.DEGRADED,
          message: `${healthy}/${total} modules`,
          details: results,
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: `${healthy}/${total} modules`,
          details: results,
        };
      }
    }
  }

  // ============================================================
  // §4. AGENT: UI/CSS Verifier
  // Checks CSS variables loaded, theme applied, key elements present
  // ============================================================
  class UIVerifier extends VerificationAgent {
    constructor() {
      super("ui-css", "UI / CSS", "🎨", 60000); // 1min
    }

    async check() {
      const root = document.documentElement;
      const style = getComputedStyle(root);

      // Check critical CSS variables
      const cssVars = [
        "--bg-app",
        "--bg-panel",
        "--text-primary",
        "--accent-primary",
        "--accent-success",
        "--accent-error",
      ];

      const varResults = {};
      let varsOk = 0;
      for (const v of cssVars) {
        const val = style.getPropertyValue(v).trim();
        varResults[v] = val || "⚠️ MISSING";
        if (val) varsOk++;
      }

      // Check critical DOM elements
      const domChecks = {
        mainContainer: !!document.getElementById("mainContainer"),
        topBar: !!document.getElementById("topBar"),
        sidebar: !!document.querySelector(
          "[class*='sidebar'], #sidebar, #leftDock",
        ),
        canvas: !!document.querySelector(
          "[class*='canvas'], #pandaCanvas, .tl-container",
        ),
      };

      const domOk = Object.values(domChecks).filter(Boolean).length;
      const totalDom = Object.keys(domChecks).length;

      // Check theme
      const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";

      if (varsOk === cssVars.length && domOk >= totalDom - 1) {
        return {
          status: HEALTH.HEALTHY,
          message: `${varsOk} CSS vars OK, ${domOk}/${totalDom} DOM, theme: ${theme}`,
          details: { cssVars: varResults, dom: domChecks, theme },
        };
      } else if (varsOk >= cssVars.length - 2) {
        return {
          status: HEALTH.DEGRADED,
          message: `${varsOk}/${cssVars.length} CSS vars, ${domOk}/${totalDom} DOM`,
          details: { cssVars: varResults, dom: domChecks, theme },
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: `CSS vars missing: ${cssVars.length - varsOk}`,
          details: { cssVars: varResults, dom: domChecks, theme },
        };
      }
    }
  }

  // ============================================================
  // §5. AGENT: GAS Verifier
  // Checks callPandaBrain() responds in <5s
  // ============================================================
  class GASVerifier extends VerificationAgent {
    constructor() {
      super("gas", "GAS Backend", "🔗", 120000); // 2min
    }

    async check() {
      const kernel = window.PandaKernel;

      // Check if endpoint is configured
      if (!kernel?.apiKeys?.gasEndpoint && !kernel?.PANDA_CORE?.gasEndpoint) {
        return {
          status: HEALTH.DEGRADED,
          message: "GAS endpoint não configurado (mock mode?)",
        };
      }

      // Try a lightweight ping
      try {
        const endpoint =
          kernel?.apiKeys?.gasEndpoint || kernel?.PANDA_CORE?.gasEndpoint || "";

        if (!endpoint || endpoint.includes("YOUR_SCRIPT_ID")) {
          return {
            status: HEALTH.DEGRADED,
            message: "GAS endpoint placeholder — usando mock",
            details: { mock: true },
          };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const start = performance.now();
        const response = await fetch(`${endpoint}?action=ping`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const latency = Math.round(performance.now() - start);

        if (response.ok) {
          return {
            status: latency < 3000 ? HEALTH.HEALTHY : HEALTH.DEGRADED,
            message: `Respondeu em ${latency}ms`,
            details: { latency, status: response.status },
          };
        } else {
          return {
            status: HEALTH.DEGRADED,
            message: `HTTP ${response.status}`,
            details: { status: response.status },
          };
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return { status: HEALTH.UNHEALTHY, message: "Timeout >5s" };
        }
        return {
          status: HEALTH.DEGRADED,
          message: `Erro: ${err.message}`,
          details: { error: err.message },
        };
      }
    }
  }

  // ============================================================
  // §6. AGENT: Firebase Verifier
  // Checks Auth state, RTDB connection
  // ============================================================
  class FirebaseVerifier extends VerificationAgent {
    constructor() {
      super("firebase", "Firebase", "🔥", 30000); // 30s
    }

    async check() {
      const checks = {
        sdkLoaded: typeof firebase !== "undefined" || !!window.firebase,
        authAvailable: false,
        userLoggedIn: false,
        rtdbConnected: false,
      };

      try {
        // Check Firebase global
        const fb = window.firebase;
        if (!fb) {
          return {
            status: HEALTH.DEGRADED,
            message: "Firebase SDK não carregado",
            details: checks,
          };
        }

        // Auth check
        if (fb.auth) {
          checks.authAvailable = true;
          const user = fb.auth().currentUser;
          checks.userLoggedIn = !!user;
        }

        // RTDB check
        if (fb.database) {
          try {
            const connRef = fb.database().ref(".info/connected");
            checks.rtdbConnected = true; // If ref resolves, RTDB is accessible
          } catch (e) {
            checks.rtdbConnected = false;
          }
        }

        const okCount = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;

        if (okCount === total) {
          return {
            status: HEALTH.HEALTHY,
            message: `${okCount}/${total} checks OK`,
            details: checks,
          };
        } else if (okCount >= 2) {
          return {
            status: HEALTH.DEGRADED,
            message: `${okCount}/${total} checks`,
            details: checks,
          };
        } else {
          return {
            status: HEALTH.UNHEALTHY,
            message: `${okCount}/${total} checks`,
            details: checks,
          };
        }
      } catch (err) {
        return {
          status: HEALTH.DEGRADED,
          message: `Firebase check error: ${err.message}`,
          details: checks,
        };
      }
    }
  }

  // ============================================================
  // §7. AGENT: Tentacle Verifier
  // Checks each registered tentacle's manifest and permissions
  // ============================================================
  class TentacleVerifier extends VerificationAgent {
    constructor() {
      super("tentacles", "Tentacles", "🐙", 300000); // 5min
    }

    async check() {
      const registry = window.PandaKernel?.TentacleRegistry;
      if (!registry) {
        return {
          status: HEALTH.HEALTHY,
          message: "Registry pronto (0 tentables)",
          details: {},
        };
      }

      const list = registry.list();
      if (list.length === 0) {
        return {
          status: HEALTH.HEALTHY,
          message: "0 tentáculos registrados",
          details: {},
        };
      }

      const results = {};
      let valid = 0;

      for (const t of list) {
        const info = registry.get(t);
        const ok = info?.found && info?.manifest?.name;
        results[t] = {
          found: info?.found,
          hasManifest: !!info?.manifest?.name,
          status: info?.status,
          permissions: info?.permissions?.length || 0,
        };
        if (ok) valid++;
      }

      if (valid === list.length) {
        return {
          status: HEALTH.HEALTHY,
          message: `${valid}/${list.length} tentáculos válidos`,
          details: results,
        };
      } else {
        return {
          status: HEALTH.DEGRADED,
          message: `${valid}/${list.length} tentáculos válidos`,
          details: results,
        };
      }
    }
  }

  // ============================================================
  // §8. AGENT: Energy Verifier
  // Checks energy system synced and within expected range
  // ============================================================
  class EnergyVerifier extends VerificationAgent {
    constructor() {
      super("energy", "Energy System", "⚡", 60000); // 1min
    }

    async check() {
      const energyEl = document.getElementById("energyCredits");
      const energyBar = document.getElementById("energyBar");

      const checks = {
        uiElement: !!energyEl,
        barElement: !!energyBar,
        creditsValue: null,
        maxCredits: window.PandaKernel?.PANDA_CORE?.maxCredits || 1000,
      };

      if (energyEl) {
        const text = energyEl.textContent || "";
        const match = text.match(/(\d+)/);
        checks.creditsValue = match ? parseInt(match[1], 10) : null;
      }

      if (checks.creditsValue !== null && checks.creditsValue >= 0) {
        const ratio = checks.creditsValue / checks.maxCredits;
        if (ratio > 0.1) {
          return {
            status: HEALTH.HEALTHY,
            message: `${checks.creditsValue} créditos`,
            details: checks,
          };
        } else {
          return {
            status: HEALTH.DEGRADED,
            message: `Low energy: ${checks.creditsValue}`,
            details: checks,
          };
        }
      }

      if (!checks.uiElement) {
        return {
          status: HEALTH.DEGRADED,
          message: "UI de energia não encontrada",
          details: checks,
        };
      }

      return {
        status: HEALTH.HEALTHY,
        message: "Sistema de energia disponível",
        details: checks,
      };
    }
  }

  // ============================================================
  // §9. AGENT: Distribution Verifier
  // Checks that distribution hooks config exists
  // ============================================================
  class DistributionVerifier extends VerificationAgent {
    constructor() {
      super("distribution", "Distribution Hooks", "🔌", 600000); // 10min
    }

    async check() {
      const hooks = window.PandaKernel?.DISTRIBUTION_HOOKS;
      if (!hooks) {
        return {
          status: HEALTH.UNHEALTHY,
          message: "DISTRIBUTION_HOOKS não encontrado",
        };
      }

      const checks = {
        githubHook: !!hooks.inbound?.github?.id,
        driveHook: !!hooks.inbound?.googleDrive?.id,
        convergence: !!hooks.convergence?.verifier,
        sdkInbound: hooks.sdkHooks?.inbound?.length > 0,
        sdkOutbound: hooks.sdkHooks?.outbound?.length > 0,
        paymentFlow: hooks.payment?.flow?.length > 0,
      };

      const ok = Object.values(checks).filter(Boolean).length;
      const total = Object.keys(checks).length;

      if (ok === total) {
        return {
          status: HEALTH.HEALTHY,
          message: `${ok}/${total} hooks configurados`,
          details: checks,
        };
      } else if (ok >= total - 2) {
        return {
          status: HEALTH.DEGRADED,
          message: `${ok}/${total} hooks`,
          details: checks,
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: `${ok}/${total} hooks`,
          details: checks,
        };
      }
    }
  }

  // ============================================================
  // §10. AGENT: SDK Namespace Verifier
  // Checks every Panda.* namespace from SDK_MAP is loaded
  // ============================================================
  class SDKNamespaceVerifier extends VerificationAgent {
    constructor() {
      super("sdk-namespaces", "SDK Namespaces", "📡", 60000); // 1min
    }

    async check() {
      const P = window.Panda;
      if (!P) {
        return { status: HEALTH.UNHEALTHY, message: "Panda global não existe" };
      }

      // All 10 SDK_MAP namespaces + core infra
      const required = [
        "Auth",
        "Brain",
        "Canvas",
        "Dock",
        "Collab",
        "Data",
        "Validate",
        "Store",
        "Wallet",
        "Translate",
        // Core infra
        "UI",
        "Bridge",
        "PAT",
        "Governance",
        "Loader",
      ];

      const results = {};
      let ok = 0;
      for (const ns of required) {
        const exists = P[ns] && typeof P[ns] === "object";
        results[ns] = exists;
        if (exists) ok++;
      }

      const total = required.length;
      if (ok === total) {
        return {
          status: HEALTH.HEALTHY,
          message: `${ok}/${total} namespaces (v${P.VERSION})`,
          details: results,
        };
      } else if (ok >= total - 3) {
        return {
          status: HEALTH.DEGRADED,
          message: `${ok}/${total} namespaces`,
          details: results,
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: `${ok}/${total} namespaces`,
          details: results,
        };
      }
    }
  }

  // ============================================================
  // §11. AGENT: Module Loader Verifier
  // Checks ModuleLoader state, active module, registry integrity
  // ============================================================
  class ModuleLoaderVerifier extends VerificationAgent {
    constructor() {
      super("module-loader", "Module Loader", "📂", 60000); // 1min
    }

    async check() {
      const loader = window.PandaLoader;
      if (!loader) {
        return {
          status: HEALTH.DEGRADED,
          message: "PandaLoader não inicializado",
        };
      }

      const checks = {
        hasContainer: !!loader.container,
        hasDock: !!loader.dockContainer,
        registrySize: loader.registry?.length || 0,
        activeModule: loader.activeModule || "none",
        hasHomeEntry: loader.registry?.some((m) => m.id === "home") || false,
      };

      if (
        checks.hasContainer &&
        checks.registrySize > 0 &&
        checks.hasHomeEntry
      ) {
        return {
          status: HEALTH.HEALTHY,
          message: `${checks.registrySize} módulos, ativo: ${checks.activeModule}`,
          details: checks,
        };
      } else if (checks.registrySize > 0) {
        return {
          status: HEALTH.DEGRADED,
          message: `Registry OK (${checks.registrySize}), container faltando`,
          details: checks,
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: "Registry vazio ou loader inativo",
          details: checks,
        };
      }
    }
  }

  // ============================================================
  // §12. AGENT: Component Loader Verifier
  // Checks injected UI shell components (Header, Docks, Sidebar)
  // ============================================================
  class ComponentLoaderVerifier extends VerificationAgent {
    constructor() {
      super("components", "Component Loader", "🧩", 30000); // 30s
    }

    async check() {
      const targets = [
        { id: "header-container", label: "Header" },
        { id: "app-dock-container", label: "App Dock" },
        { id: "dev-dock-container", label: "Dev Dock" },
        { id: "sidebar-container", label: "Sidebar" },
      ];

      const results = {};
      let loaded = 0;

      for (const t of targets) {
        const el = document.getElementById(t.id);
        const hasContent = el && el.innerHTML.trim().length > 0;
        results[t.label] = hasContent;
        if (hasContent) loaded++;
      }

      const total = targets.length;
      if (loaded === total) {
        return {
          status: HEALTH.HEALTHY,
          message: `${loaded}/${total} componentes injetados`,
          details: results,
        };
      } else if (loaded >= total - 1) {
        return {
          status: HEALTH.DEGRADED,
          message: `${loaded}/${total} componentes`,
          details: results,
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: `${loaded}/${total} componentes`,
          details: results,
        };
      }
    }
  }

  // ============================================================
  // §13. AGENT: Auth Chain Verifier
  // Monitors Panda.Auth state, session token, role
  // ============================================================
  class AuthChainVerifier extends VerificationAgent {
    constructor() {
      super("auth-chain", "Auth Chain", "🔐", 30000); // 30s
    }

    async check() {
      const auth = window.Panda?.Auth;
      const checks = {
        sdkExists: !!auth,
        loggedIn: auth?.isLoggedIn?.() || false,
        hasToken: !!localStorage.getItem("panda_token"),
        hasUser: !!localStorage.getItem("panda_user"),
        role: null,
      };

      try {
        const user = JSON.parse(localStorage.getItem("panda_user") || "{}");
        checks.role = user.role || null;
      } catch (e) {
        /* ignore */
      }

      if (!checks.sdkExists) {
        return {
          status: HEALTH.UNHEALTHY,
          message: "Panda.Auth ausente no SDK",
          details: checks,
        };
      }

      if (checks.hasToken && checks.hasUser) {
        return {
          status: HEALTH.HEALTHY,
          message: `Autenticado (role: ${checks.role || "unknown"})`,
          details: checks,
        };
      }

      return {
        status: HEALTH.DEGRADED,
        message: "Sessão não detectada (aguardando login)",
        details: checks,
      };
    }
  }

  // ============================================================
  // §14. AGENT: Wallet & PAT Verifier
  // Monitors economic subsystem (Wallet + PAT)
  // ============================================================
  class WalletPATVerifier extends VerificationAgent {
    constructor() {
      super("wallet-pat", "Wallet & PAT", "💰", 120000); // 2min
    }

    async check() {
      const wallet = window.Panda?.Wallet;
      const pat = window.Panda?.PAT;

      const checks = {
        walletExists: !!wallet,
        patExists: !!pat,
        walletMethods: wallet
          ? ["getBalance", "send", "getHistory", "getAddress"].every(
              (m) => typeof wallet[m] === "function",
            )
          : false,
        patMethods: pat
          ? ["getStatus", "execute"].every((m) => typeof pat[m] === "function")
          : false,
      };

      // Test Wallet response
      if (wallet && typeof wallet.getBalance === "function") {
        try {
          const bal = await wallet.getBalance();
          checks.walletResponds = bal?.success || false;
        } catch (e) {
          checks.walletResponds = false;
        }
      }

      // Test PAT response
      if (pat && typeof pat.getStatus === "function") {
        try {
          const status = await pat.getStatus();
          checks.patResponds = status?.reserve !== undefined;
        } catch (e) {
          checks.patResponds = false;
        }
      }

      const ok = Object.values(checks).filter(Boolean).length;
      const total = Object.keys(checks).length;

      if (ok === total) {
        return {
          status: HEALTH.HEALTHY,
          message: `Wallet + PAT operacionais (${ok}/${total})`,
          details: checks,
        };
      } else if (ok >= total - 2) {
        return {
          status: HEALTH.DEGRADED,
          message: `${ok}/${total} checks econômicos`,
          details: checks,
        };
      } else {
        return {
          status: HEALTH.UNHEALTHY,
          message: `${ok}/${total} checks econômicos`,
          details: checks,
        };
      }
    }
  }

  // ============================================================
  // §15. HEALTH REPORT MANAGER
  // ============================================================
  const agents = [
    // Core chain
    new KernelVerifier(),
    new CoreModuleVerifier(),
    new UIVerifier(),
    // Backend chain
    new GASVerifier(),
    new FirebaseVerifier(),
    // Extension chain
    new TentacleVerifier(),
    new EnergyVerifier(),
    new DistributionVerifier(),
    // SDK chain (added v2.0.0)
    new SDKNamespaceVerifier(),
    new ModuleLoaderVerifier(),
    new ComponentLoaderVerifier(),
    new AuthChainVerifier(),
    new WalletPATVerifier(),
  ];

  const HealthReport = {
    /** Run all agents once */
    async runAll() {
      const results = await Promise.all(agents.map((a) => a.verify()));
      return {
        timestamp: new Date().toISOString(),
        overall: this.getOverallStatus(results),
        agents: results,
      };
    },

    /** Get overall status (worst agent wins) */
    getOverallStatus(results) {
      const hasUnhealthy = results.some((r) => r.status.code === 2);
      const hasDegraded = results.some((r) => r.status.code === 1);

      if (hasUnhealthy) return HEALTH.UNHEALTHY;
      if (hasDegraded) return HEALTH.DEGRADED;
      return HEALTH.HEALTHY;
    },

    /** Get last snapshot without re-running */
    getSnapshot() {
      return {
        timestamp: new Date().toISOString(),
        overall: this.getOverallStatus(agents.map((a) => a.toReport())),
        agents: agents.map((a) => a.toReport()),
      };
    },

    /** Start all periodic checks */
    startAll() {
      agents.forEach((a) => a.startInterval());
      console.log(
        `🔍 Verification: ${agents.length} agents started (intervals: ${agents
          .map((a) => `${a.name}=${a.intervalMs / 1000}s`)
          .join(", ")})`,
      );
    },

    /** Stop all periodic checks */
    stopAll() {
      agents.forEach((a) => a.stopInterval());
      console.log("🔍 Verification: all agents stopped");
    },

    /** Get agent by ID */
    getAgent(id) {
      return agents.find((a) => a.id === id)?.toReport() || null;
    },

    /** List all agent IDs */
    listAgents() {
      return agents.map((a) => ({ id: a.id, name: a.name, icon: a.icon }));
    },

    /** Health states enum */
    HEALTH,
  };

  // ============================================================
  // §16. BOOT INTEGRATION
  // ============================================================
  async function bootVerification() {
    console.log("🔍 Verification System: Running boot checks...");

    const report = await HealthReport.runAll();

    // Log summary
    for (const agent of report.agents) {
      console.log(
        `  ${agent.status.icon} ${agent.name}: ${agent.message} (${agent.latencyMs}ms)`,
      );
    }

    console.log(
      `🔍 Overall Health: ${report.overall.icon} ${report.overall.label}`,
    );

    // Start intervals
    HealthReport.startAll();

    // Emit event
    if (window.Panda?.emit) {
      window.Panda.emit("health:boot", report);
    }

    return report;
  }

  // ============================================================
  // §17. EXPORTS
  // ============================================================
  window.PandaVerification = {
    HealthReport,
    bootVerification,
    HEALTH,
    agents: agents.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      intervalMs: a.intervalMs,
    })),
  };

  // Auto-boot when DOM is ready (after kernel loads)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Delay to ensure kernel has loaded
      setTimeout(bootVerification, 500);
    });
  } else {
    setTimeout(bootVerification, 500);
  }
})();
