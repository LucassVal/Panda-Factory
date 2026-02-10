/**
 * 🛠️ Panda DevTools - Developer Mode Controller
 * Multi-window support, MCP browser, Console, API Tester
 * Version: 2.0.0
 */

(function () {
  "use strict";

  // ==========================================
  // STATE
  // ==========================================
  let devModeEnabled = localStorage.getItem("panda_dev_mode") === "true";

  // ==========================================
  // DEV TOOLS REGISTRY (with Access Levels)
  // minRole: 1=Founder, 2=Dev, 3=User
  // ==========================================
  const DEVTOOLS = {
    extensions: {
      icon: "🧩",
      title: "Extensions",
      description: "Gerenciar extensões (Nativas, GitHub, VSX)",
      minRole: 3, // Everyone
    },
    console: {
      icon: "💻",
      title: "Console",
      description: "Console de desenvolvedor",
      minRole: 2, // Dev+
    },
    api: {
      icon: "🔌",
      title: "API Tester",
      description: "Testar endpoints GAS",
      minRole: 2, // Dev+
    },
    database: {
      icon: "🗄️",
      title: "DB Explorer",
      description: "Explorar Sheets/Firebase",
      minRole: 2, // Dev+
    },

    ai: {
      icon: "🤖",
      title: "AI Agents",
      description: "Gerenciar agentes IA",
      minRole: 2, // Dev+
    },
    mcp: {
      icon: "🧰",
      title: "MCP Browser",
      description: "Ver MCP Tools disponíveis",
      minRole: 2, // Dev+
    },
    rig: {
      icon: "🦀",
      title: "RIG Config",
      description: "Configurar providers IA",
      minRole: 2, // Dev+
    },
    pat: {
      icon: "🏦",
      title: "PAT Treasury",
      description: "Controles do tesouro",
      minRole: 1, // Founder ONLY
    },
    founderDash: {
      icon: "📊",
      title: "Founder Dashboard",
      description: "Health 3-state + visão total do sistema",
      minRole: 1, // Founder ONLY
      module: "Mod_Founder_Dashboard.html",
    },
    constitution: {
      icon: "⚖️",
      title: "Constitution",
      description: "Validar ações vs 12 Artigos",
      minRole: 1, // Founder ONLY
    },
  };

  // Active pop-out windows
  const activeWindows = new Map();

  // ==========================================
  // DEV MODE TOGGLE
  // ==========================================
  function toggleDevMode() {
    devModeEnabled = !devModeEnabled;
    localStorage.setItem("panda_dev_mode", devModeEnabled.toString());

    const devDock = document.getElementById("devDock");
    const toggleBtn = document.getElementById("devModeToggle");

    if (devDock) {
      devDock.style.display = devModeEnabled ? "flex" : "none";
    }

    if (toggleBtn) {
      toggleBtn.classList.toggle("active", devModeEnabled);
      toggleBtn.innerHTML = devModeEnabled ? "🔧" : "🛠️";
      toggleBtn.title = devModeEnabled
        ? "Modo Dev ATIVO (clique para desativar)"
        : "Modo Desenvolvedor (Beta)";
    }

    console.log(`🛠️ Dev Mode: ${devModeEnabled ? "ENABLED" : "DISABLED"}`);

    // Emit event
    if (window.Panda?.emit) {
      window.Panda.emit("devmode:change", { enabled: devModeEnabled });
    }
  }

  // ==========================================
  // OPEN DEV TOOL (Modal or Pop-out)
  // With 3-Layer Access Control
  // ==========================================
  function openDevTool(toolId, forcePopout = false) {
    const tool = DEVTOOLS[toolId];
    if (!tool) {
      console.warn(`DevTool "${toolId}" not found`);
      return;
    }

    // 🔐 ACCESS GATE - Check user role
    const userRole = window.Panda?.Auth?.getRole?.() ?? 3;
    const minRole = tool.minRole ?? 3;

    if (userRole > minRole) {
      const roleNames = { 1: "Founder", 2: "Dev", 3: "User" };
      console.warn(
        `🔒 Access denied to ${toolId}. Requires: ${roleNames[minRole]}, User is: ${roleNames[userRole]}`,
      );

      if (window.Panda?.UI?.toast) {
        window.Panda.UI.toast(
          `🔒 Acesso restrito (requer ${roleNames[minRole]})`,
          "error",
        );
      }
      return;
    }

    if (forcePopout || !document.hasFocus()) {
      return openPopout(toolId, tool);
    }

    // Open in modal
    return openModal(toolId, tool);
  }

  // ==========================================
  // MODAL VIEW
  // ==========================================
  function openModal(toolId, tool) {
    // Check if modal already exists
    let modal = document.getElementById(`devtool-modal-${toolId}`);

    if (modal) {
      modal.style.display = "flex";
      return;
    }

    // Create modal
    modal = document.createElement("div");
    modal.id = `devtool-modal-${toolId}`;
    modal.className = "devtool-modal";
    modal.innerHTML = `
      <div class="devtool-modal-content">
        <div class="devtool-modal-header">
          <span>${tool.icon} ${tool.title}</span>
          <div class="devtool-modal-actions">
            <button onclick="PandaDevTools.popout('${toolId}')" title="Pop-out">🪟</button>
            <button onclick="PandaDevTools.closeModal('${toolId}')" title="Fechar">✖</button>
          </div>
        </div>
        <div class="devtool-modal-body" id="devtool-body-${toolId}">
          ${getToolContent(toolId)}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    initToolContent(toolId);
  }

  function closeModal(toolId) {
    const modal = document.getElementById(`devtool-modal-${toolId}`);
    if (modal) {
      modal.style.display = "none";
    }
  }

  // ==========================================
  // POP-OUT (Document Picture-in-Picture)
  // ==========================================
  async function openPopout(toolId, tool = null) {
    tool = tool || DEVTOOLS[toolId];
    if (!tool) return;

    // Check if already open
    if (activeWindows.has(toolId) && !activeWindows.get(toolId).closed) {
      activeWindows.get(toolId).focus();
      return activeWindows.get(toolId);
    }

    // Check for Document PiP support
    if (window.documentPictureInPicture) {
      try {
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 600,
          height: 500,
        });

        // Copy styles
        copyStylesToWindow(pipWindow);

        // Set content
        pipWindow.document.body.innerHTML = `
          <div class="devtool-popout">
            <div class="devtool-popout-header">
              <span>${tool.icon} ${tool.title}</span>
              <span class="popout-badge">POP-OUT</span>
            </div>
            <div class="devtool-popout-body" id="devtool-body-${toolId}">
              ${getToolContent(toolId)}
            </div>
          </div>
        `;

        pipWindow.document.title = `🐼 ${tool.title}`;

        // Register
        activeWindows.set(toolId, pipWindow);

        // Cleanup on close
        pipWindow.addEventListener("pagehide", () => {
          activeWindows.delete(toolId);
        });

        // Init tool
        initToolContent(toolId, pipWindow.document);

        return pipWindow;
      } catch (err) {
        console.warn("PiP failed, falling back to window.open:", err);
      }
    }

    // Fallback to window.open
    const win = window.open(
      "",
      `panda_devtool_${toolId}`,
      "width=600,height=500,menubar=no,toolbar=no",
    );

    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>🐼 ${tool.title}</title>
          <link rel="stylesheet" href="${window.location.origin}/css/pf.theme.css">
          <style>
            body { margin: 0; padding: 16px; background: var(--bg-app); color: var(--text-primary); }
            .devtool-popout-header { display: flex; justify-content: space-between; padding: 12px; background: var(--bg-panel); border-radius: 8px; margin-bottom: 16px; }
          </style>
        </head>
        <body class="dark-mode">
          <div class="devtool-popout-header">
            <span>${tool.icon} ${tool.title}</span>
            <span style="opacity:0.5">POP-OUT</span>
          </div>
          <div id="devtool-body-${toolId}">
            ${getToolContent(toolId)}
          </div>
          <script>
            const Panda = window.opener?.Panda;
          </script>
        </body>
        </html>
      `);

      activeWindows.set(toolId, win);

      win.onunload = () => activeWindows.delete(toolId);
    }

    return win;
  }

  // ==========================================
  // TOOL CONTENT GENERATORS
  // ==========================================
  function getToolContent(toolId) {
    switch (toolId) {
      case "console":
        return `
          <div class="console-wrapper">
            <div class="console-output" id="consoleOutput"></div>
            <div class="console-input-wrapper">
              <span class="console-prompt">❯</span>
              <input type="text" id="consoleInput" placeholder="Execute JavaScript..." />
            </div>
          </div>
        `;

      case "mcp":
        return `
          <div class="mcp-browser">
            <div class="mcp-header">
              <h3>🧰 MCP Tools Disponíveis</h3>
              <span class="mcp-status" id="mcpStatus">● Verificando...</span>
            </div>
            <div class="mcp-list" id="mcpList">
              <div class="mcp-loading">Carregando tools...</div>
            </div>
          </div>
        `;

      case "api":
        return `
          <div class="api-tester">
            <div class="api-form">
              <select id="apiMethod">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input type="text" id="apiEndpoint" placeholder="action=ping" />
              <button onclick="PandaDevTools.testAPI()">Enviar</button>
            </div>
            <div class="api-response" id="apiResponse">
              <pre>// Resposta aparecerá aqui</pre>
            </div>
          </div>
        `;

      case "extensions":
        return `
          <div class="extensions-panel">
            <div class="extensions-tabs">
              <button class="ext-tab active" data-tab="native">🐼 Nativas</button>
              <button class="ext-tab" data-tab="community">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                Comunidade
              </button>
              <button class="ext-tab" data-tab="marketplace">🧩 Marketplace</button>
            </div>
            <div class="extensions-content" id="extensionsContent">
              <p style="opacity:0.5">Selecione uma categoria</p>
            </div>
          </div>
        `;

      case "pat":
        return `
          <div class="pat-controls">
            <h3>🏦 PAT Treasury Controls</h3>
            <div class="pat-status" id="patStatus">
              <div class="pat-stat"><span>Inflação:</span> <b id="patInflation">--</b></div>
              <div class="pat-stat"><span>Reserva:</span> <b id="patReserve">--</b></div>
              <div class="pat-stat"><span>Deflação:</span> <b id="patDeflation">--</b></div>
            </div>
            <div class="pat-actions">
              <button onclick="PandaDevTools.patExecute('reinvest')">🔄 Reinvest</button>
              <button onclick="PandaDevTools.patExecute('accelerate')">⚡ Accelerate</button>
              <button onclick="PandaDevTools.patExecute('burn')" class="danger">🔥 Burn</button>
            </div>
          </div>
        `;

      case "constitution":
        return `
          <div class="constitution-validator">
            <h3>⚖️ Constitution Validator</h3>
            <div class="validator-form">
              <input type="text" id="actionToValidate" placeholder="Ex: expel_user, exceed_inflation" />
              <button onclick="PandaDevTools.validateAction()">Validar</button>
            </div>
            <div class="validator-result" id="validatorResult"></div>
          </div>
        `;

      default:
        return `
          <div class="devtool-placeholder">
            <p style="opacity:0.5">${DEVTOOLS[toolId]?.description || "Em desenvolvimento..."}</p>
          </div>
        `;
    }
  }

  function initToolContent(toolId, doc = document) {
    switch (toolId) {
      case "console":
        initConsole(doc);
        break;
      case "mcp":
        loadMCPTools(doc);
        break;
      case "pat":
        loadPATStatus(doc);
        break;
    }
  }

  // ==========================================
  // CONSOLE IMPLEMENTATION
  // ==========================================
  function initConsole(doc) {
    const input = doc.getElementById("consoleInput");
    const output = doc.getElementById("consoleOutput");

    if (!input || !output) return;

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        const code = input.value.trim();

        // Log input
        output.innerHTML += `<div class="console-line input">❯ ${escapeHtml(code)}</div>`;

        try {
          const result = eval(code);
          output.innerHTML += `<div class="console-line output">${formatResult(result)}</div>`;
        } catch (err) {
          output.innerHTML += `<div class="console-line error">❌ ${err.message}</div>`;
        }

        input.value = "";
        output.scrollTop = output.scrollHeight;
      }
    });
  }

  // ==========================================
  // MCP BROWSER
  // ==========================================
  async function loadMCPTools(doc) {
    const list = doc.getElementById("mcpList");
    const status = doc.getElementById("mcpStatus");

    if (!list) return;

    // Mock MCP tools (will be replaced with real data from Rust Agent)
    const mcpTools = [
      { name: "fs_read", category: "Filesystem", desc: "Read file contents" },
      { name: "fs_write", category: "Filesystem", desc: "Write to file" },
      { name: "fs_list", category: "Filesystem", desc: "List directory" },
      { name: "gpu_check", category: "GPU", desc: "Check GPU availability" },
      { name: "gpu_process", category: "GPU", desc: "Process with GPU" },
      {
        name: "mouse_move",
        category: "Automation",
        desc: "Move mouse cursor",
      },
      { name: "keyboard_type", category: "Automation", desc: "Type text" },
      {
        name: "screen_capture",
        category: "Automation",
        desc: "Capture screen",
      },
    ];

    if (status) {
      status.innerHTML = window.Panda?.Bridge?.isConnected()
        ? '<span style="color:var(--accent-success)">● Agent Online</span>'
        : '<span style="color:var(--accent-error)">● Agent Offline</span>';
    }

    list.innerHTML = mcpTools
      .map(
        (tool) => `
      <div class="mcp-tool">
        <div class="mcp-tool-name">${tool.name}</div>
        <div class="mcp-tool-category">${tool.category}</div>
        <div class="mcp-tool-desc">${tool.desc}</div>
      </div>
    `,
      )
      .join("");
  }

  // ==========================================
  // PAT TREASURY
  // ==========================================
  async function loadPATStatus(doc) {
    if (!window.Panda?.PAT) return;

    try {
      const status = await window.Panda.PAT.getStatus();
      const inflationEl = doc.getElementById("patInflation");
      const reserveEl = doc.getElementById("patReserve");
      const deflationEl = doc.getElementById("patDeflation");

      if (inflationEl) inflationEl.textContent = status.inflation + "%";
      if (reserveEl) reserveEl.textContent = status.reserve + "%";
      if (deflationEl) deflationEl.textContent = status.deflation + "%";
    } catch (err) {
      console.error("Failed to load PAT status:", err);
    }
  }

  async function patExecute(tool) {
    if (!window.Panda?.PAT) {
      alert("PAT não disponível");
      return;
    }

    try {
      const result = await window.Panda.PAT.execute(tool);
      alert(`✅ ${tool}: ${result.success ? "Sucesso" : "Falhou"}`);
    } catch (err) {
      alert(`❌ Erro: ${err.message}`);
    }
  }

  // ==========================================
  // CONSTITUTION VALIDATOR
  // ==========================================
  async function validateAction() {
    const input = document.getElementById("actionToValidate");
    const result = document.getElementById("validatorResult");

    if (!input || !result) return;

    const action = input.value.trim();
    if (!action) return;

    if (!window.Panda?.Governance) {
      result.innerHTML =
        '<span style="color:var(--accent-error)">Governance não disponível</span>';
      return;
    }

    try {
      const validation = await window.Panda.Governance.validate(action);

      if (validation.allowed) {
        result.innerHTML = `
          <div style="color:var(--accent-success)">
            ✅ PERMITIDO<br>
            <small>A ação "${action}" não viola a Constituição.</small>
          </div>
        `;
      } else {
        result.innerHTML = `
          <div style="color:var(--accent-error)">
            ❌ BLOQUEADO<br>
            <small>${validation.reason}</small>
          </div>
        `;
      }
    } catch (err) {
      result.innerHTML = `<span style="color:var(--accent-error)">Erro: ${err.message}</span>`;
    }
  }

  // ==========================================
  // API TESTER
  // ==========================================
  async function testAPI() {
    const method = document.getElementById("apiMethod")?.value || "GET";
    const endpoint = document.getElementById("apiEndpoint")?.value || "";
    const responseEl = document.getElementById("apiResponse");

    if (!responseEl) return;

    responseEl.innerHTML = "<pre>Enviando...</pre>";

    try {
      // Use GAS endpoint from config or mock
      const gasUrl =
        window.Panda?.Config?.gasEndpoint ||
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
      const url = `${gasUrl}?${endpoint}`;

      const response = await fetch(url, { method });
      const data = await response.json();

      responseEl.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
      responseEl.innerHTML = `<pre style="color:var(--accent-error)">Erro: ${err.message}</pre>`;
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================
  function copyStylesToWindow(pipWindow) {
    [...document.styleSheets].forEach((styleSheet) => {
      try {
        if (styleSheet.cssRules) {
          const css = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("");
          const style = document.createElement("style");
          style.textContent = css;
          pipWindow.document.head.appendChild(style);
        }
      } catch (e) {
        // Cross-origin stylesheets
        if (styleSheet.href) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      }
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatResult(result) {
    if (result === undefined)
      return '<span style="opacity:0.5">undefined</span>';
    if (result === null) return '<span style="opacity:0.5">null</span>';
    if (typeof result === "object") {
      try {
        return escapeHtml(JSON.stringify(result, null, 2));
      } catch (e) {
        return String(result);
      }
    }
    return escapeHtml(String(result));
  }

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    // Restore dev mode state
    const devDock = document.getElementById("devDock");
    const toggleBtn = document.getElementById("devModeToggle");

    if (devDock) {
      devDock.style.display = devModeEnabled ? "flex" : "none";
    }

    if (toggleBtn && devModeEnabled) {
      toggleBtn.classList.add("active");
      toggleBtn.innerHTML = "🔧";
    }

    console.log(
      `🛠️ PandaDevTools v2.0: Initialized (Dev Mode: ${devModeEnabled ? "ON" : "OFF"})`,
    );
  }

  // Wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.PandaDevTools = {
    toggle: toggleDevMode,
    open: openDevTool,
    popout: openPopout,
    closeModal,
    isEnabled: () => devModeEnabled,
    getActiveWindows: () => activeWindows,
    testAPI,
    patExecute,
    validateAction,
    tools: DEVTOOLS,
  };

  // Legacy compat
  window.toggleDevMode = toggleDevMode;
  window.openDevTool = openDevTool;
})();
