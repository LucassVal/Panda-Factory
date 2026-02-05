/**
 * 🧠 UI Context Provider - Auto Context Injection
 *
 * Captura o estado da UI automaticamente e envia
 * para o Brain junto com cada mensagem (modo User).
 *
 * SUPERCOMPACTAÇÃO:
 * - Usa abreviações para economizar tokens
 * - Remove dados redundantes
 * - Limita profundidade de objetos
 */

// Abreviações para supercompactação
const ABBR = {
  canvas: "c",
  panels: "p",
  plugins: "pl",
  activePlugin: "ap",
  selection: "s",
  tools: "t",
  user: "u",
  settings: "st",
  theme: "th",
  language: "lg",
  shapes: "sh",
  count: "n",
  type: "ty",
  id: "i",
  name: "nm",
  open: "o",
  active: "a",
  position: "pos",
  size: "sz",
};

/**
 * Supercompact - Reduz objeto para formato mínimo
 * @param {object} obj - Objeto original
 * @param {number} maxDepth - Profundidade máxima (default: 2)
 * @returns {object} - Objeto compactado
 */
function supercompact(obj, maxDepth = 2, currentDepth = 0) {
  if (currentDepth >= maxDepth) {
    if (Array.isArray(obj)) return `[${obj.length}]`;
    if (typeof obj === "object" && obj !== null) return "{...}";
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length > 10) {
      return {
        _type: "array",
        _n: obj.length,
        _sample: obj
          .slice(0, 3)
          .map((i) => supercompact(i, maxDepth, currentDepth + 1)),
      };
    }
    return obj.map((i) => supercompact(i, maxDepth, currentDepth + 1));
  }

  if (typeof obj === "object" && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const abbr = ABBR[key] || key;
      result[abbr] = supercompact(value, maxDepth, currentDepth + 1);
    }
    return result;
  }

  return obj;
}

/**
 * Get current UI context from JAM
 * @returns {object} - Compacted UI state
 */
export function getUIContext() {
  const context = {
    // Timestamp
    ts: Date.now(),

    // Canvas/Editor state (if TLDraw available)
    canvas: getCanvasContext(),

    // Open panels
    panels: getPanelState(),

    // Active plugins
    plugins: getPluginState(),

    // User preferences
    user: getUserContext(),

    // Current selection
    selection: getSelectionContext(),
  };

  return supercompact(context);
}

/**
 * Get canvas context from TLDraw editor
 */
function getCanvasContext() {
  try {
    // Try to get TLDraw editor from window
    const editor = window.__tldrawEditor || window.editor;
    if (!editor) return { available: false };

    const shapes = editor.getCurrentPageShapes?.() || [];
    const camera = editor.getCamera?.() || {};

    return {
      available: true,
      shapes: {
        count: shapes.length,
        types: [...new Set(shapes.map((s) => s.type))],
      },
      camera: {
        x: Math.round(camera.x || 0),
        y: Math.round(camera.y || 0),
        z: (camera.z || 1).toFixed(2),
      },
      tool: editor.getCurrentToolId?.() || "select",
    };
  } catch (e) {
    return { available: false, error: e.message };
  }
}

/**
 * Get open panels state
 */
function getPanelState() {
  const panels = [];

  // Check common panel elements
  const panelSelectors = {
    store: ".jam-store",
    catalog: ".jam-catalog",
    settings: ".jam-settings",
    chat: ".jam-chat-panel",
    dock: ".jam-left-dock",
    toolbar: ".jam-right-toolbar",
  };

  for (const [name, selector] of Object.entries(panelSelectors)) {
    const el = document.querySelector(selector);
    if (el && getComputedStyle(el).display !== "none") {
      panels.push(name);
    }
  }

  return panels;
}

/**
 * Get installed plugins state
 */
function getPluginState() {
  try {
    // Try to get from React state or window
    const plugins = window.__installedPlugins || [];
    return {
      count: plugins.length,
      active: plugins.filter((p) => p.active).map((p) => p.id),
    };
  } catch (e) {
    return { count: 0 };
  }
}

/**
 * Get user preferences context
 */
function getUserContext() {
  return {
    theme: document.body.classList.contains("light-mode") ? "light" : "dark",
    lang: navigator.language?.split("-")[0] || "en",
    devMode: document.body.classList.contains("dev-mode") || false,
  };
}

/**
 * Get current selection context
 */
function getSelectionContext() {
  try {
    const editor = window.__tldrawEditor || window.editor;
    if (!editor) return null;

    const selected = editor.getSelectedShapes?.() || [];
    if (selected.length === 0) return null;

    return {
      count: selected.length,
      types: [...new Set(selected.map((s) => s.type))],
      ids: selected.slice(0, 5).map((s) => s.id.substring(0, 8)),
    };
  } catch (e) {
    return null;
  }
}

/**
 * Format context as minimal string for prompt injection
 * @param {object} context - UI context object
 * @returns {string} - Compressed context string
 */
export function formatContextForPrompt(context) {
  if (!context) return "";

  const lines = [];

  // Canvas
  if (context.c?.available !== false) {
    const c = context.c;
    lines.push(`[Canvas: ${c.sh?.n || 0} shapes, tool=${c.tool}]`);
  }

  // Panels
  if (context.p?.length) {
    lines.push(`[Panels: ${context.p.join(",")}]`);
  }

  // Selection
  if (context.s) {
    lines.push(`[Seleção: ${context.s.n} itens (${context.s.ty?.join(",")})]`);
  }

  // Theme/Mode
  if (context.u) {
    lines.push(
      `[${context.u.th === "dark" ? "🌙" : "☀️"} ${context.u.devMode ? "DEV" : "USER"}]`,
    );
  }

  return lines.length ? `\n---\nCONTEXTO UI:\n${lines.join("\n")}\n---\n` : "";
}

/**
 * Inject context into message before sending
 * @param {string} message - User message
 * @returns {string} - Message with context
 */
export function injectContext(message) {
  const context = getUIContext();
  const contextStr = formatContextForPrompt(context);

  // Prepend context to message (hidden from user, visible to AI)
  return contextStr + message;
}

export default {
  getUIContext,
  formatContextForPrompt,
  injectContext,
  supercompact,
};
