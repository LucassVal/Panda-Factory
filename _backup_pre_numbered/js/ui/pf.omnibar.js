/**
 * 🐼 Panda Fabrics - OmniBar Controller
 * Unified search, AI chat, and command palette
 * Version: 2.0.0
 */

(function () {
  "use strict";

  // ==========================================
  // STATE
  // ==========================================
  let isOmniOpen = false;
  let currentModelIndex = 0;

  const MODELS = [
    {
      id: "gemini-3.0-flash",
      name: "Gemini 3.0 Flash",
      icon: "fa-bolt",
      free: true,
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      icon: "fa-brain",
      free: false,
    },
    { id: "gpt-4o", name: "GPT-4o", icon: "fa-robot", free: false },
    {
      id: "claude-3.5-sonnet",
      name: "Claude 3.5",
      icon: "fa-feather",
      free: false,
    },
    { id: "imagen-3", name: "Imagen 3", icon: "fa-image", free: false },
  ];

  // ==========================================
  // DOM ELEMENTS (Lazy Init)
  // ==========================================
  let omniInput, omniResults, modelBadge, omniChatArea;

  function initElements() {
    omniInput = document.getElementById("omni-input");
    omniResults = document.getElementById("omni-results");
    modelBadge = document.getElementById("current-model-badge");
    omniChatArea = document.getElementById("omni-chat-expansion");
  }

  // ==========================================
  // TOGGLE OMNI BAR
  // ==========================================
  function toggleOmniBar() {
    const bar = document.getElementById("omni-trigger");
    const fab = document.getElementById("panda-fab");

    if (!bar) return;

    if (bar.style.display === "none") {
      // Show bar, hide FAB
      if (fab) {
        fab.style.transform = "scale(0)";
        setTimeout(() => (fab.style.display = "none"), 200);
      }

      bar.style.display = "flex";
      setTimeout(() => {
        bar.style.opacity = "1";
        bar.style.transform = "translateX(-50%)";
      }, 50);

      setTimeout(() => omniInput?.focus(), 100);
      isOmniOpen = true;
    } else {
      minimizeOmniBar();
    }
  }

  function minimizeOmniBar() {
    const bar = document.getElementById("omni-trigger");
    if (!bar) return;

    bar.style.opacity = "0";
    bar.style.transform = "translate(-50%, 20px) scale(0.95)";

    setTimeout(() => {
      bar.style.display = "none";
      const fab = document.getElementById("panda-fab");
      if (fab) {
        fab.style.display = "flex";
        fab.style.transform = "scale(0)";
        setTimeout(() => (fab.style.transform = "scale(1)"), 50);
      }
    }, 200);

    isOmniOpen = false;
  }

  // ==========================================
  // MODEL CYCLING
  // ==========================================
  function cycleModel() {
    currentModelIndex = (currentModelIndex + 1) % MODELS.length;
    const model = MODELS[currentModelIndex];

    if (modelBadge) {
      modelBadge.innerHTML = `<i class="fas ${model.icon}"></i> ${model.name}`;
    }

    localStorage.setItem("panda_preferred_model", model.id);
  }

  // ==========================================
  // SEARCH & RESULTS
  // ==========================================
  function handleSearch(query) {
    if (!query || !omniResults) {
      if (omniResults) omniResults.innerHTML = "";
      return;
    }

    const allResults = [
      {
        title: "Analisar Contrato",
        desc: "Use Gemini para ler PDF",
        icon: "fa-file-contract",
        type: "AI",
      },
      {
        title: "Criar Imagem",
        desc: "Gerar assets visuais",
        icon: "fa-paint-brush",
        type: "AI",
      },
      {
        title: "Financeiro",
        desc: "Abrir Dashboard Financeiro",
        icon: "fa-chart-line",
        type: "Nav",
      },
      {
        title: "Novo Cliente",
        desc: "Cadastrar lead",
        icon: "fa-user-plus",
        type: "Action",
      },
      {
        title: "Governança",
        desc: "Ver Constituição Panda",
        icon: "fa-landmark",
        type: "System",
      },
      {
        title: "Configurações",
        desc: "Ajustes do sistema",
        icon: "fa-cog",
        type: "Nav",
      },
    ];

    const results = allResults.filter(
      (r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.desc.toLowerCase().includes(query.toLowerCase()),
    );

    renderResults(results);
  }

  function renderResults(list) {
    if (!omniResults) return;

    omniResults.innerHTML = list
      .map(
        (item) => `
      <div class="omni-item" onclick="PandaOmni.executeAction('${item.title}')">
        <div class="omni-item-icon"><i class="fas ${item.icon}"></i></div>
        <div class="omni-item-content">
          <div class="omni-item-title">${item.title}</div>
          <div class="omni-item-desc">${item.desc}</div>
        </div>
        <div class="omni-shortcut">↵</div>
      </div>
    `,
      )
      .join("");
  }

  // ==========================================
  // CHAT EXPANSION
  // ==========================================
  function handleChatSubmit(message) {
    if (!omniChatArea) return;

    omniChatArea.style.display = "block";

    const userMsg = document.createElement("div");
    userMsg.innerHTML = `
      <div style="text-align:right; margin-bottom:10px;">
        <span style="background:var(--accent-primary); color:white; padding:6px 12px; border-radius:12px 12px 0 12px; font-size:14px;">
          ${message}
        </span>
      </div>`;
    omniChatArea.appendChild(userMsg);

    setTimeout(() => {
      const reply = document.createElement("div");
      reply.innerHTML = `
        <div style="text-align:left; margin-bottom:10px; display:flex; gap:8px;">
          <div style="font-size:20px;">🐼</div>
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); padding:8px 12px; border-radius:12px 12px 12px 0; font-size:14px; color:var(--text-primary);">
            Processando... <span style="font-size:11px; opacity:0.7;">(${MODELS[currentModelIndex].name})</span>
          </div>
        </div>`;
      omniChatArea.appendChild(reply);
      omniChatArea.scrollTop = omniChatArea.scrollHeight;
    }, 600);
  }

  // ==========================================
  // ACTION EXECUTOR
  // ==========================================
  function executeAction(action) {
    console.log("🐼 OmniBar: Executing action:", action);

    switch (action.toLowerCase()) {
      case "novo cliente":
        if (typeof abrirModalNovoCliente === "function")
          abrirModalNovoCliente();
        break;
      case "configurações":
        if (typeof abrirSettings === "function") abrirSettings();
        break;
      case "governança":
        console.log(
          "📜 Constitution:",
          window.Panda?.Governance?.getConstitution?.() || "SDK not loaded",
        );
        break;
      default:
        console.log(`Action "${action}" not implemented yet`);
    }

    minimizeOmniBar();
  }

  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================
  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toggleOmniBar();
      }
      if (e.key === "Escape" && isOmniOpen) {
        minimizeOmniBar();
      }
    });
  }

  // ==========================================
  // INPUT HANDLERS
  // ==========================================
  function setupInputHandlers() {
    if (!omniInput) return;

    omniInput.addEventListener("input", (e) => handleSearch(e.target.value));
    omniInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.value.trim()) {
        handleChatSubmit(e.target.value.trim());
        e.target.value = "";
      }
    });
  }

  // ==========================================
  // RESIZE HANDLER (Merged from old file)
  // ==========================================
  function setupResizeHandler() {
    const chatArea = document.getElementById("omni-chat-expansion");
    if (!chatArea) return;

    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "omni-resize-handle";
    resizeHandle.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0; height: 12px;
      cursor: ns-resize; z-index: 10; display: flex; align-items: center; justify-content: center;
    `;

    const handleBar = document.createElement("div");
    handleBar.style.cssText = `
      width: 40px; height: 4px; background: var(--text-secondary);
      border-radius: 2px; opacity: 0.3; transition: opacity 0.2s;
    `;
    resizeHandle.appendChild(handleBar);

    resizeHandle.addEventListener(
      "mouseenter",
      () => (handleBar.style.opacity = "0.6"),
    );
    resizeHandle.addEventListener("mouseleave", () => {
      if (!isResizing) handleBar.style.opacity = "0.3";
    });

    resizeHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isResizing = true;
      startY = e.clientY;
      startHeight = chatArea.offsetHeight;
      handleBar.style.opacity = "0.8";
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const deltaY = startY - e.clientY;
      const newHeight = Math.max(200, Math.min(600, startHeight + deltaY));
      chatArea.style.height = newHeight + "px";
    });

    window.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        handleBar.style.opacity = "0.3";
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    });

    chatArea.insertBefore(resizeHandle, chatArea.firstChild);
  }

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    initElements();
    setupKeyboardShortcuts();
    setupInputHandlers();
    setupResizeHandler();

    const savedModel = localStorage.getItem("panda_preferred_model");
    if (savedModel) {
      const idx = MODELS.findIndex((m) => m.id === savedModel);
      if (idx >= 0) currentModelIndex = idx;
    }

    console.log("🔍 PandaOmni v2.0: Initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.PandaOmni = {
    toggle: toggleOmniBar,
    minimize: minimizeOmniBar,
    cycleModel,
    executeAction,
    search: handleSearch,
  };

  window.toggleOmniBar = toggleOmniBar;
  window.cycleModel = cycleModel;
})();
