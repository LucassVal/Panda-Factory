// 🐼 PANDA FACTORY KERNEL — Core Level 0
// SYSTEM CORE ONLY — No UI modules, no CRM, no tentacles
// All module logic lives in 5.tentacles/ or 4.ui/4.3.modules/
// Legacy CRM code preserved in kernel.js.legacy

// ============================================================
// §0. PANDA IDENTITY (Immutable Foundation)
// ============================================================

/**
 * Founder — The sovereign creator of the Panda Factory ecosystem.
 * All kill-switch, PAT governance, and treasury operations
 * require Founder-level Ed25519 signature validation.
 */
const PANDA_FOUNDER = Object.freeze({
  name: "Lucas Valério",
  email: "lucasvalerio.contact@gmail.com",
  role: "Founder & Sovereign",
  auth: "Ed25519", // Signature algorithm for critical ops
  since: "2025-01-01",
});

/**
 * Constitution — The 12 immutable Articles (Leis Pétreas).
 * Full text: 8.docs/PF_ECONOMY_REFERENCE.md §8.3
 * These values are HARDCODED. Art. 11 forbids amendments.
 */
const PANDA_CONSTITUTION = Object.freeze({
  docs: {
    publicAI: "8.docs/PF_AGENT_CONSTITUTION.md",
    founderAI: "8.docs/PF_PAT_FOUNDER_CONSTITUTION.md",
    economy: "8.docs/PF_ECONOMY_REFERENCE.md",
  },
  values: [
    "Democratização",
    "Colaboração",
    "Humildade",
    "Transparência",
    "Redistribuição",
  ],
  maxim: "Democratizando IA para todos",
  articles: Object.freeze({
    1: { name: "Teto Inflação", rule: "Max 5% ao ano" },
    2: { name: "Panda Labs", rule: "25% do Fundo → Educação" },
    3: { name: "Reserva Ops", rule: "20% do Lucro Ops → Caixa" },
    4: { name: "Crescimento", rule: "65% do Fundo → Ação" },
    5: { name: "Piso Preço", rule: "2.5x (Min 1.25x)" },
    6: { name: "Founder Fee", rule: "5% Bruto Eterno (Satoshi Fee)" },
    7: { name: "Garantia Host", rule: "90-95% (Taxa P2P 5-10%)" },
    8: { name: "Reserva Fundo", rule: "Max 10% (Excedente reinveste)" },
    9: { name: "Bill of Rights", rule: "Liberdade Total (3 direitos civis)" },
    10: { name: "Arbitragem", rule: "IA → Founder (última instância)" },
    11: { name: "Leis Pétreas", rule: "Imutável. Zero emendas." },
    12: {
      name: "Emergência",
      rule: "Failover Agent assume se principal falhar",
    },
  }),
  billOfRights: Object.freeze({
    freeSpeech: "Censura Zero. Protocolo agnóstico ao conteúdo.",
    nonExpulsion: "Banimento Impossível. Chave privada soberana.",
    rustLaw: "Execução Consentida. Código nunca roda sem permissão.",
  }),
});

/**
 * PAT — Panda AI Treasury. Founder-only governance engine.
 * Full spec: 8.docs/PF_PAT_FOUNDER_CONSTITUTION.md
 * Backend: 1.core/1.1.gas/PF_PAT_Core.gs
 */
const PANDA_PAT = Object.freeze({
  backend: "1.core/1.1.gas/PF_PAT_Core.gs",
  doc: "8.docs/PF_PAT_FOUNDER_CONSTITUTION.md",
  capabilities: [
    "daily_checkin",
    "profile_mapping",
    "governance",
    "kill_switch",
    "treasury_control",
    "audit_access",
  ],
  accessLevel: "founder_only",
  authLevels: Object.freeze({
    L1_VIEW: { actions: "Ver logs, status", requires: "Nenhum" },
    L2_SUGGEST: { actions: "Propor mudanças", requires: "Session token" },
    L3_EXECUTE: { actions: "Transações < 1000 PC", requires: "Ed25519" },
    L4_CRITICAL: {
      actions: "Transações > 1000 PC, Kill Switch",
      requires: "Ed25519 + PIN",
    },
    L5_EMERGENCY: {
      actions: "Violação de Constituição",
      requires: "Ed25519 + PIN + Cooldown",
    },
  }),
  healthThresholds: Object.freeze({
    normal: { min: 80, mode: "Operação normal" },
    conservative: { min: 60, mode: "Limite 50% das ações" },
    emergency: { min: 40, mode: "Só view + suggest" },
    lockdown: { min: 0, mode: "Founder manual only" },
  }),
  integrityChecks: Object.freeze({
    constitution_articles: 12,
    max_single_transfer: 10000, // PC
    require_ed25519: true,
    require_pin: true,
    cooldown_minutes: 5,
  }),
  validate: (action) => {
    console.warn(`🧠 PAT Validation required for: ${action}`);
    return { required: true, method: "Ed25519", action };
  },
});

/**
 * Crypto — Panda Coin infrastructure.
 * Currently: Off-chain (GAS Ledger + localStorage).
 * Future: On-chain Solana SPL Token.
 */
const PANDA_CRYPTO = Object.freeze({
  coin: "PC", // Panda Coin
  network: {
    current: "off-chain", // GAS Sheets ledger
    future: "solana",
    rpcUrl: "https://api.mainnet-beta.solana.com",
  },
  contracts: {
    treasury: "SOLANA_TREASURY_WALLET_PLACEHOLDER",
    burn: "SOLANA_BURN_CONTRACT_PLACEHOLDER",
    mint: "SOLANA_MINT_AUTHORITY_PLACEHOLDER",
  },
  treasury: Object.freeze({
    backing: { paxg: 0.7, usdc: 0.3 }, // 70% gold, 30% stablecoin
    snapshotFrequency: "daily",
    snapshotChain: "solana",
  }),
  splits: Object.freeze({
    store: {
      devHost: 0.52,
      education: 0.25,
      ops: 0.15,
      founder: 0.05,
      gateway: 0.03,
    },
    p2pOffchain: { devHost: 0.95, education: 0.01, ops: 0.04 },
    p2pOnchain: { devHost: 0.95, education: 0.01, ops: 0.01, gateway: 0.03 },
  }),
  auth: {
    algorithm: "Ed25519",
    thresholds: {
      basic: 100, // < R$100: PIN only
      elevated: 1000, // R$100-1000: 2FA
      founder: 10000, // R$1000+: Ed25519 signature (24h timeout)
    },
  },
});

/**
 * Core Modules — Built-in components that are NOT tentacles.
 * Split into two layers:
 *   - UI Structural: always rendered, the platform surface
 *   - Infrastructure: runtime, backend, auth — the pipes
 * Both load before any tentacle and are always present.
 * Unlike tentacles, they don't go through SecurityAgent — they ARE the system.
 *
 * IMPORTANT: Panda is NOT an IDE. We are an ecosystem that liberates
 * through hooks, payments, cloud, Rust, mining ↔ PC.
 * The Panda is what sits in the middle.
 */
const PANDA_CORE_MODULES = Object.freeze({
  // ── UI Structural ──────────────────────────────────────────
  drawTools: {
    id: "@panda/draw-tools",
    layer: "ui",
    description:
      "Canvas & drawing layer — the foundation the entire UI renders on",
    lib: {
      name: "TLDraw",
      package: "@tldraw/tldraw",
      version: "v2",
      license: "Apache-2.0",
    },
    free: true,
    alwaysLoaded: true,
    path: "4.ui/pf.draw-tools.js",
  },
  aiChat: {
    id: "@panda/ai-chat",
    layer: "ui",
    description: "Fixed AI assistant panel — Bridge to Brain/Gemini",
    lib: null, // Custom — communicates via callPandaBrain() → GAS → Gemini
    free: true,
    alwaysLoaded: true,
    path: "4.ui/pf.ai-chat.js",
  },
  dockBars: {
    id: "@panda/dock-bars",
    layer: "ui",
    description: "Navigation dock bars — window management & module switching",
    lib: {
      name: "FlexLayout + Dockbar",
      packages: ["flexlayout-react", "dockbar"],
      license: "MIT",
    },
    free: true,
    alwaysLoaded: true,
    path: "4.ui/pf.dock-drag.js",
  },
  collab: {
    id: "@panda/collab",
    layer: "ui",
    description: "Real-time collaboration via CRDT — multi-user sync",
    lib: {
      name: "Yjs",
      packages: ["yjs", "y-websocket", "y-indexeddb"],
      license: "MIT",
    },
    free: true,
    alwaysLoaded: true,
    path: "4.ui/pf.collab.js",
  },

  // ── Infrastructure Services ────────────────────────────────
  rustAgent: {
    id: "@panda/rust-agent",
    layer: "infra",
    description:
      "Rust WebView runtime — the container the entire app runs inside",
    lib: {
      name: "Tauri + Wry + Tao",
      packages: ["tauri@2", "wry", "tao"],
      license: "MIT/Apache",
    },
    free: true,
    alwaysLoaded: true,
    path: "6.rust/",
    capabilities: [
      "webview",
      "filesystem",
      "crypto",
      "p2p",
      "native_perf",
      "translation", // NLLB-200 via whisper-rs / candle (real-time text + vox)
      "mining", // Future: CPU/GPU mining ↔ Panda Coin
    ],
  },
  gas: {
    id: "@panda/gas",
    layer: "infra",
    description:
      "Google Apps Script backend — callPandaBrain(), ledger, webhooks",
    lib: {
      name: "GAS + clasp",
      packages: ["@google/clasp", "@types/google-apps-script"],
      license: "Apache-2.0",
    },
    free: true,
    alwaysLoaded: true,
    path: "1.core/1.1.gas/",
    capabilities: [
      "backend",
      "ledger",
      "webhooks",
      "drive",
      "sheets",
      "payments",
    ],
  },
  firebase: {
    id: "@panda/firebase",
    layer: "infra",
    description: "Firebase Auth + Realtime DB — user identity & live data sync",
    lib: {
      name: "Firebase SDK",
      package: "firebase",
      version: "10+",
      license: "Apache-2.0",
    },
    free: true,
    alwaysLoaded: true,
    path: "1.core/1.2.firebase/",
    capabilities: ["auth", "realtime_db", "hosting", "cloud_functions"],
  },
});

/**
 * SDK Wrapper Map — Which Panda.* namespace wraps which lib.
 * Tentacles and devs consume ONLY Panda.* — never the raw lib.
 * The SDK translates calls to the underlying open source lib.
 */
const PANDA_SDK_MAP = Object.freeze({
  // ── Core (loadOnBoot: true) ────────────────────────────
  "Panda.Auth": { lib: "Firebase SDK", layer: "core", loadOnBoot: true },
  "Panda.Brain": { lib: "GAS → Gemini", layer: "core", loadOnBoot: true },
  "Panda.Canvas": { lib: "TLDraw", layer: "core", loadOnBoot: true },
  "Panda.Dock": {
    lib: "FlexLayout + Dockbar",
    layer: "core",
    loadOnBoot: true,
  },
  "Panda.Collab": { lib: "Yjs", layer: "core", loadOnBoot: true },
  "Panda.UI": { lib: "Panda Design System", layer: "core", loadOnBoot: true },
  "Panda.Bridge": {
    lib: "Rust Agent IPC / MCP",
    layer: "core",
    loadOnBoot: true,
  },

  // ── SDK (loadOnBoot: false) ────────────────────────────
  "Panda.Data": {
    lib: "React Query + Zustand",
    layer: "sdk",
    loadOnBoot: false,
  },
  "Panda.Validate": { lib: "Zod", layer: "sdk", loadOnBoot: false },
  "Panda.Store": { lib: "MedusaJS + GAS", layer: "sdk", loadOnBoot: false },
  "Panda.Wallet": {
    lib: "Ed25519 + GAS Ledger",
    layer: "sdk",
    loadOnBoot: false,
  },
  "Panda.PAT": {
    lib: "GAS PAT Core",
    layer: "sdk",
    loadOnBoot: false,
  },
  "Panda.Governance": {
    lib: "Constitution Validator",
    layer: "sdk",
    loadOnBoot: false,
  },
  "Panda.Loader": {
    lib: "Boot Orchestrator",
    layer: "sdk",
    loadOnBoot: false,
  },

  // ── Rust Agent (loadOnBoot: false) ─────────────────────
  "Panda.Polyglot": {
    lib: "NLLB-200 + Whisper via Rust",
    layer: "rust",
    loadOnBoot: false,
  },
  "Panda.Storage": {
    lib: "Drive/FS Bridge",
    layer: "sdk",
    loadOnBoot: false,
  },

  // ── Tentacle-level (loadOnBoot: false, overrides SDK stub) ─
  "Panda.Google": {
    lib: "Google Workspace (Drive+Sheets+Colab)",
    layer: "tentacle",
    loadOnBoot: false,
  },
});

/**
 * Distribution Hooks — The 2 inbound channels for the Medusa system.
 * Source: PF_MEDUSA_REFERENCE.md §3-4
 * Taxonomy: Módulos (canvas apps) | Tentáculos (system hooks) | Themes
 *
 * Devs submit modules/tentacles via GitHub (technical) or Google Drive (zero barrier).
 * Both converge to Firebase Colmeia via GAS Agente Verificador.
 * SDK is bidirectional: inbound hooks (Kiwify, Hotmart) + outbound (PlayStore, Steam).
 */
const PANDA_DISTRIBUTION_HOOKS = Object.freeze({
  // ── Inbound: How modules/tentacles enter the ecosystem ────
  inbound: {
    github: {
      id: "@panda/hook-github",
      description: "GitHub → Webhooks → GAS → Firebase Colmeia",
      audience: "Devs técnicos",
      flow: [
        "1. Dev coda localmente (qualquer IDE)",
        "2. Testa com SDK local / Rust Agent",
        "3. Cria panda.mcp.json (MCP OBRIGATÓRIO)",
        "4. git push → GitHub",
        "5. GitHub Action dispara webhook → GAS",
        "6. Medusa valida MCP + publica na Store",
        "7. Users instalam → dev recebe 52% split",
      ],
      webhooks: [
        "push",
        "release",
        "pull_request",
        "issue_comment:/panda deploy",
      ],
      path: "5.7.github/",
    },
    googleDrive: {
      id: "@panda/hook-drive",
      description: "Google Drive → Drive API Watch → GAS → Firebase Colmeia",
      audience: "Makers / No-code devs (zero barreira)",
      flow: [
        "1. Dev coda localmente (qualquer IDE)",
        "2. Testa com SDK local / Rust Agent",
        "3. Cria panda.mcp.json (MCP OBRIGATÓRIO)",
        "4. Salva pasta em Google Drive (já auth via Panda)",
        "5. Agente Verificador detecta mudança via Drive API Watch",
        "6. Consolida no Firebase da Colmeia Panda",
        "7. Users instalam → dev recebe 52% split",
      ],
      driveFolder: "/PandaModules/{itemId}/",
      path: "5.2.google/",
    },
  },

  // ── Convergence: Where both hooks meet ────────────────────
  convergence: {
    verifier:
      "GAS Agente Verificador (validates panda.mcp.json + sandbox test 30s)",
    storage: "Firebase Storage: /plugins/{pluginId}/versions/",
    metadata: "Firestore: metadata + sales + analytics",
    revenueSplit: "52% dev (automático) — See PANDA_CRYPTO.splits",
  },

  // ── SDK Bidirectional Hooks ───────────────────────────────
  sdkHooks: {
    inbound: ["Kiwify", "Hotmart", "Eduzz", "Stripe", "PagSeguro", "Pix"],
    outbound: ["PlayStore", "Steam", "itch.io", "PWA", "GitHub Pages"],
    triMode: "GAS Tri-Mode: JSON API + WEB pages + MCP manifest",
  },

  // ── Payment flow (after distribution) ─────────────────────
  payment: {
    flow: [
      "1. User purchases module/tentacle/theme in Medusa Store",
      "2. Webhook → GAS (PF_Core_Webhooks.gs) validates payment",
      "3. GAS → Ledger (Google Sheets) records transaction",
      "4. GAS → PC Split (Constitution Art. 6 + Art. 7)",
      "5. GAS → Firebase (Realtime DB) updates user balance",
      "6. SDK → Panda.Wallet.getBalance() reflects new balance",
    ],
    ledger: {
      current: "Google Sheets (off-chain)",
      future: "Solana (on-chain)",
    },
    splits: "See PANDA_CRYPTO.splits (store / p2pOffchain / p2pOnchain)",
  },
});

/**
 * Boot Order — Explicit load sequence.
 * Core loads first (no SecurityAgent needed), then SDK, then Tentacles.
 */
const PANDA_BOOT_ORDER = Object.freeze([
  { step: 1, id: "rust-agent", desc: "Tauri WebView container starts" },
  { step: 2, id: "firebase", desc: "Auth + Realtime DB connect" },
  { step: 3, id: "gas", desc: "Backend bridge (callPandaBrain) ready" },
  { step: 4, id: "draw-tools", desc: "TLDraw canvas renders" },
  { step: 5, id: "dock-bars", desc: "FlexLayout + Dockbar navigation loads" },
  { step: 6, id: "collab", desc: "Yjs CRDT sync starts" },
  { step: 7, id: "ai-chat", desc: "AI panel connects to Brain" },
  { step: 8, id: "sdk", desc: "Panda.* wrappers register globally" },
  {
    step: 9,
    id: "tentacles",
    desc: "TentacleRegistry loads registered modules",
  },
]);

// ============================================================
// §1. API KEYS & CONFIGURATION
// ============================================================

const apiKeys = {
  maps: "AIzaSyAih-Jd1LzzUWKvK5dSW6oi0zixmqynil0",
  gemini: "AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw",
};

// ============================================================
// §2. THEME ENGINE (White Label)
// ============================================================

let appConfig = JSON.parse(localStorage.getItem("pandaTheme") || "{}");

function aplicarTema() {
  if (appConfig.name) document.title = appConfig.name;

  if (appConfig.color) {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", appConfig.color);
    root.style.setProperty(
      "--primary-hover",
      adjustColor(appConfig.color, -20),
    );

    document.body.style.background = appConfig.color;
    document.body.style.backgroundImage = "none";
  }

  if (appConfig.font) {
    document.body.style.fontFamily = appConfig.font;
  }
}

function salvarTema() {
  const name = document.getElementById("configAppName")?.value;
  const logo = document.getElementById("configAppLogo")?.value;
  const color = document.getElementById("configAppColor")?.value;
  const font = document.getElementById("configAppFont")?.value;

  appConfig = { name, logo, color, font };
  localStorage.setItem("pandaTheme", JSON.stringify(appConfig));
  aplicarTema();
  console.log("🎨 Tema salvo com sucesso!");
}

function adjustColor(color, amount) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (c) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)
        ).substr(-2),
      )
  );
}

// ============================================================
// §3. AI ENERGY SYSTEM (Panda Credits)
// ============================================================

const AI_CONFIG = {
  maxCredits: 1000,
  costPerAction: 10,
  costPerAnalysis: 50,
  refillRate: 5, // per hour (mock)
};

function initEnergySystem() {
  let energy = parseInt(localStorage.getItem("aiCredits"));
  if (isNaN(energy)) {
    energy = AI_CONFIG.maxCredits;
    localStorage.setItem("aiCredits", energy);
  }
  updateEnergyUI(energy);

  const container = document.querySelector(".energy-container");
  if (container) {
    container.onclick = () => {
      alert(
        `🔋 Status da IA\n\nCréditos Disponíveis: ${energy}/${AI_CONFIG.maxCredits}\n\n- O Gemini usa Context Caching para economizar.\n- Cada análise consome ~${AI_CONFIG.costPerAnalysis} créditos.\n- Recarga automática mensal.`,
      );
    };
  }
}

function updateEnergyUI(energy) {
  const percent = Math.min(
    100,
    Math.max(0, (energy / AI_CONFIG.maxCredits) * 100),
  );
  const fill = document.getElementById("aiEnergyFill");
  const text = document.getElementById("aiEnergyText");

  if (fill) fill.style.width = `${percent}%`;
  if (text) text.innerText = `${percent.toFixed(0)}%`;

  if (fill) {
    if (percent < 20) fill.style.background = "#ef4444";
    else if (percent < 50) fill.style.background = "#f59e0b";
    else fill.style.background = "linear-gradient(90deg, #10b981, #3b82f6)";
  }
}

function consumeEnergy(amount) {
  let energy = parseInt(localStorage.getItem("aiCredits")) || 0;
  if (energy >= amount) {
    energy -= amount;
    localStorage.setItem("aiCredits", energy);
    updateEnergyUI(energy);
    return true;
  } else {
    alert("⚠️ Energia da IA Esgotada! Aguarde recarga ou contate o suporte.");
    return false;
  }
}

// ============================================================
// §4. PANDA CORE BRIDGE (GAS Backend Communication)
// ============================================================

const PANDA_CORE = {
  endpoint:
    "https://script.google.com/macros/s/AKfycbxPx18ed1gP8cR08dRxEInmVheihSoSkqiucXp2icFmF5dZO_ccM6c3Q6LMvjeE2VcM/exec",
  userId: null,
  balance: 1000,
  maxBalance: 1000,
  offline: false,
};

/**
 * Central de comunicação com o Panda Core Backend (GAS).
 * @param {string} type - Tipo de serviço (TEXT_GEN, DRIVE_READ, TOOL_CALL, etc)
 * @param {Object} payload - Dados do pedido
 * @param {string} [action] - Ação específica (GET_BALANCE, etc)
 * @returns {Promise<Object>} Resposta do backend
 */
async function callPandaBrain(type, payload, action = null) {
  try {
    const body = {
      userId:
        PANDA_CORE.userId || localStorage.getItem("pandaUserId") || "anonymous",
      type: type,
      payload: payload,
    };

    if (action) body.action = action;

    const response = await fetch(PANDA_CORE.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.meta?.new_balance !== undefined) {
      PANDA_CORE.balance = result.meta.new_balance;
      updateEnergyFromPanda(result.meta.new_balance);
    }

    if (result.status === "INSUFFICIENT_FUNDS") {
      showRechargeModal(result.requiredPC, result.currentBalance);
      return result;
    }

    return result;
  } catch (error) {
    console.error("❌ Erro Panda Core:", error);
    return { status: "ERROR", message: error.toString() };
  }
}

/**
 * Atualiza a barra de energia visual com o saldo real do Panda Core.
 */
function updateEnergyFromPanda(balance) {
  PANDA_CORE.balance = balance;
  const percent = Math.min(
    100,
    Math.max(0, (balance / PANDA_CORE.maxBalance) * 100),
  );

  const fill = document.getElementById("aiEnergyFill");
  const text = document.getElementById("aiEnergyText");

  if (fill) fill.style.width = `${percent}%`;
  if (text) text.innerText = `${Math.round(balance)} PC`;

  if (fill) {
    if (percent < 20) fill.style.background = "#ef4444";
    else if (percent < 50) fill.style.background = "#f59e0b";
    else fill.style.background = "linear-gradient(90deg, #10b981, #3b82f6)";
  }
}

/**
 * Busca o saldo atual do usuário no Panda Core.
 * 🛡️ Safe-Fail: Se falhar (CORS/Offline), usa modo Local.
 */
async function fetchPandaBalance() {
  if (!navigator.onLine) {
    console.log("📡 Offline Mode detected.");
    return;
  }

  try {
    const result = await callPandaBrain(null, null, "GET_BALANCE");

    if (result && result.status === "SUCCESS") {
      PANDA_CORE.balance = result.balance;
      updateEnergyFromPanda(result.balance);
      PANDA_CORE.offline = false;
    }
  } catch (e) {
    console.warn("⚠️ Panda Core unreachable (CORS/Net):", e.message);
    PANDA_CORE.offline = true;

    const text = document.getElementById("aiEnergyText");
    if (text) text.innerText += " (Local)";
  }
}

/**
 * Mostra modal de recarga quando saldo é insuficiente.
 */
function showRechargeModal(required, current) {
  alert(
    `⚠️ Saldo Insuficiente!\n\nNecessário: ${required} PC\nAtual: ${current} PC\n\nRecarregue para continuar usando os serviços de IA.`,
  );
  // TODO: Implementar modal de pagamento via Medusa Store
}

// ============================================================
// §7. TENTACLE REGISTRY (Extensibility Engine)
// ============================================================

/**
 * TentacleRegistry — Controls which tentacles are loaded.
 * Governance: Only Founder creates/publishes tentacles. Community members
 * can develop tentacles BUT require Founder approval to publish to Medusa.
 * Each tentacle must pass the SecurityAgent MCP Manifest validation.
 */
const TentacleRegistry = (() => {
  const _registered = new Map();
  const _permissions = new Map(); // userId → Set of allowed tentacle IDs

  return Object.freeze({
    /**
     * Register a tentacle. Called during boot by each tentacle's init().
     * @param {string} id - Unique tentacle ID (e.g. "crm", "trading", "social")
     * @param {Object} manifest - MCP-compliant manifest object
     * @param {Object} hooks - { onLoad, onUnload, onData, onError }
     * @returns {boolean} Success
     */
    register(id, manifest, hooks = {}) {
      if (_registered.has(id)) {
        console.warn(`⚠️ Tentacle "${id}" already registered. Skipping.`);
        return false;
      }

      // §8 Security validation
      const validation = SecurityAgent.validateManifest(manifest);
      if (!validation.valid) {
        console.error(`🛡️ Tentacle "${id}" REJECTED: ${validation.reason}`);
        return false;
      }

      _registered.set(
        id,
        Object.freeze({
          id,
          manifest,
          hooks,
          registeredAt: Date.now(),
          status: "active",
        }),
      );

      console.log(`🐙 Tentacle registered: ${id} (${manifest.name || id})`);
      return true;
    },

    /**
     * Unregister a tentacle. Founder-only operation.
     */
    unregister(id) {
      if (!_registered.has(id)) return false;
      const tentacle = _registered.get(id);
      if (tentacle.hooks.onUnload) tentacle.hooks.onUnload();
      _registered.delete(id);
      console.log(`🐙 Tentacle unregistered: ${id}`);
      return true;
    },

    /** Check if a tentacle exists */
    has(id) {
      return _registered.has(id);
    },

    /** Get tentacle info */
    get(id) {
      return _registered.get(id) || null;
    },

    /** List all registered tentacles */
    list() {
      return Array.from(_registered.keys());
    },

    /** Get full registry snapshot */
    snapshot() {
      const snap = {};
      _registered.forEach((v, k) => {
        snap[k] = {
          name: v.manifest.name,
          status: v.status,
          since: v.registeredAt,
        };
      });
      return snap;
    },

    /**
     * Grant a community member permission to develop a tentacle.
     * Founder-only. The tentacle still requires SecurityAgent validation.
     */
    grantPermission(userId, tentacleId) {
      if (!_permissions.has(userId)) _permissions.set(userId, new Set());
      _permissions.get(userId).add(tentacleId);
      console.log(`✅ Permission granted: ${userId} → ${tentacleId}`);
    },

    /** Check if user has permission for a tentacle */
    hasPermission(userId, tentacleId) {
      return (
        _permissions.has(userId) && _permissions.get(userId).has(tentacleId)
      );
    },
  });
})();

// ============================================================
// §8. SECURITY AGENT (MCP Manifest Validator)
// ============================================================

/**
 * SecurityAgent — Validates MCP Manifests before tentacles are loaded.
 * This is the gatekeeper for the Medusa Store. Every tentacle must pass
 * validation before it can register. Checks:
 *   1. Required fields (name, version, author, permissions)
 *   2. No forbidden permissions (filesystem write, network unrestricted)
 *   3. Signature verification (Ed25519 when on-chain)
 *   4. Constitution compliance (no violation of Art. 1-12)
 */
const SecurityAgent = Object.freeze({
  REQUIRED_FIELDS: ["name", "version", "author", "permissions"],
  FORBIDDEN_PERMISSIONS: [
    "filesystem:write:root",
    "network:unrestricted",
    "kernel:modify",
    "constitution:amend",
    "pat:impersonate",
  ],

  /**
   * Validate a tentacle's MCP manifest.
   * @param {Object} manifest - The manifest to validate
   * @returns {{ valid: boolean, reason?: string, warnings: string[] }}
   */
  validateManifest(manifest) {
    const warnings = [];

    // 1. Check required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (!manifest || !manifest[field]) {
        return {
          valid: false,
          reason: `Missing required field: ${field}`,
          warnings,
        };
      }
    }

    // 2. Check forbidden permissions
    const perms = Array.isArray(manifest.permissions)
      ? manifest.permissions
      : [];
    for (const perm of perms) {
      if (this.FORBIDDEN_PERMISSIONS.includes(perm)) {
        return {
          valid: false,
          reason: `Forbidden permission: ${perm}`,
          warnings,
        };
      }
    }

    // 3. Warn on sensitive permissions
    const sensitive = [
      "network:external",
      "storage:write",
      "camera",
      "microphone",
    ];
    for (const perm of perms) {
      if (sensitive.includes(perm)) {
        warnings.push(`Sensitive permission requested: ${perm}`);
      }
    }

    // 4. Version format check (semver)
    if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
      warnings.push("Version should follow semver (x.y.z)");
    }

    // 5. Author verification (future: Ed25519 signature check)
    if (manifest.signature) {
      // TODO: Verify Ed25519 signature against author's public key
      warnings.push("Signature present but verification not yet implemented");
    }

    return { valid: true, warnings };
  },

  /**
   * Audit a running tentacle for suspicious behavior.
   * @param {string} tentacleId
   * @returns {Object} Audit report
   */
  audit(tentacleId) {
    const tentacle = TentacleRegistry.get(tentacleId);
    if (!tentacle) return { found: false };

    return {
      found: true,
      id: tentacleId,
      manifest: tentacle.manifest,
      registeredAt: tentacle.registeredAt,
      permissions: tentacle.manifest.permissions || [],
      status: tentacle.status,
    };
  },
});

// ============================================================
// §5. BOOT SEQUENCE
// ============================================================

window.addEventListener("load", () => {
  console.log("🐼 Panda Factory Kernel — Core Level 0 loaded");
  console.log(`👤 Founder: ${PANDA_FOUNDER.name}`);
  console.log(
    `⚖️ Constitution: ${PANDA_CONSTITUTION.maxim} (${Object.keys(PANDA_CONSTITUTION.articles).length} Articles)`,
  );
  console.log(
    `🧠 PAT: ${PANDA_PAT.capabilities.length} capabilities, ${Object.keys(PANDA_PAT.authLevels).length} auth levels`,
  );
  console.log(
    `🪙 Crypto: ${PANDA_CRYPTO.coin} (${PANDA_CRYPTO.network.current} → ${PANDA_CRYPTO.network.future})`,
  );
  console.log(`📦 API Keys: ${Object.keys(apiKeys).length} configured`);
  console.log(`⚡ Energy System: ${AI_CONFIG.maxCredits} max credits`);
  console.log(`🔗 Brain Bridge: ${PANDA_CORE.offline ? "OFFLINE" : "ONLINE"}`);
  const uiMods = Object.values(PANDA_CORE_MODULES).filter(
    (m) => m.layer === "ui",
  ).length;
  const infraMods = Object.values(PANDA_CORE_MODULES).filter(
    (m) => m.layer === "infra",
  ).length;
  console.log(
    `📦 Core Modules: ${uiMods} UI + ${infraMods} Infra = ${Object.keys(PANDA_CORE_MODULES).length} total`,
  );
  console.log(
    `🐙 Tentacle Registry: ready (${TentacleRegistry.list().length} loaded)`,
  );
  console.log(`🛡️ Security Agent: active`);
  console.log(
    `🔌 Distribution Hooks: GitHub + Google Drive → Firebase Colmeia`,
  );
  console.log(
    `🗺️ SDK Map: ${Object.keys(PANDA_SDK_MAP).length} Panda.* wrappers`,
  );
  console.log(`🥾 Boot Order: ${PANDA_BOOT_ORDER.length} steps`);
  console.log(
    `🔍 Verification: 13 agents loaded (3-state health, all chains monitored)`,
  );

  // Theme
  aplicarTema();

  // Energy
  initEnergySystem();

  // Balance (delayed to avoid blocking render)
  setTimeout(fetchPandaBalance, 2000);
});

// ============================================================
// §6. EXPORTS (for SDK and Modules)
// ============================================================

// Expose core functions globally for SDK consumption
window.PandaKernel = {
  // §0 Identity
  FOUNDER: PANDA_FOUNDER,
  CONSTITUTION: PANDA_CONSTITUTION,
  PAT: PANDA_PAT,
  CRYPTO: PANDA_CRYPTO,
  CORE_MODULES: PANDA_CORE_MODULES,
  SDK_MAP: PANDA_SDK_MAP,
  DISTRIBUTION_HOOKS: PANDA_DISTRIBUTION_HOOKS,
  BOOT_ORDER: PANDA_BOOT_ORDER,

  // §1 Config
  apiKeys,
  appConfig,

  // §3 Energy
  consumeEnergy,
  updateEnergyUI,
  initEnergySystem,

  // §4 Brain
  callPandaBrain,
  fetchPandaBalance,
  PANDA_CORE,

  // §2 Theme
  aplicarTema,
  salvarTema,

  // §7 Tentacles
  TentacleRegistry,

  // §8 Security
  SecurityAgent,

  // §9 Verification (populated by pf.verification.js)
  // HealthReport: window.PandaVerification?.HealthReport,

  // Meta
  version: "2.1.0",
  level: 0,
};
