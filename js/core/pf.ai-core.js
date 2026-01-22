/**
 * 🐼 PANDA AI CORE (PAT - Panda AI Treasury)
 * The AI Governor that operates within Constitutional bounds
 *
 * This is the Core AI that:
 * - Monitors system state (inflation, reserves, deflation)
 * - Executes treasury operations (reinvest, accelerate, vesting, burn)
 * - Enforces the 12 Constitutional Articles
 * - Connects to GitHub for version control and self-improvement
 *
 * Version: 1.0.0
 * Architecture: Runs in Browser → Can be upgraded to Rust Agent
 */

(function () {
  "use strict";

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const AI_CONFIG = {
    version: "1.0.0",
    name: "PAT (Panda AI Treasury)",
    mode: "ASSISTED", // ASSISTED | AUTONOMOUS | SOVEREIGN
    github: {
      owner: "LucassVal",
      repo: "SAAS",
      branch: "main",
      apiBase: "https://api.github.com",
    },
    thresholds: {
      inflationMax: 5.0, // Art. 1: Max 5% inflation
      reserveMax: 10.0, // Art. 8: Max 10% reserve
      deflationTrigger: 2.0, // Art. PAT: Acceleration trigger
    },
    intervals: {
      healthCheck: 60000, // 1 minute
      stateSync: 300000, // 5 minutes
      gitHubSync: 3600000, // 1 hour
    },
  };

  // ==========================================
  // STATE
  // ==========================================
  let aiState = {
    inflation: 1.5,
    reserve: 8.0,
    deflation: 0.5,
    lastAction: null,
    lastSync: null,
    isRunning: false,
    logs: [],
  };

  // ==========================================
  // CONSTITUTION VALIDATOR
  // ==========================================
  const Constitution = {
    articles: [
      { id: 1, name: "Teto Inflação", rule: "Max 5% ao ano" },
      { id: 2, name: "Panda Labs", rule: "25% do Fundo → Educação" },
      { id: 3, name: "Reserva Ops", rule: "20% do Lucro Ops → Caixa" },
      { id: 4, name: "Crescimento", rule: "65% do Fundo → Ação" },
      { id: 5, name: "Piso Preço", rule: "2.5x (Min 1.25x)" },
      { id: 6, name: "Founder Fee", rule: "5% Bruto Eterno" },
      { id: 7, name: "Garantia Host", rule: "90-95% (Taxa P2P 5-10%)" },
      { id: 8, name: "Reserva Fundo", rule: "Max 10% (Excedente = Reinveste)" },
      { id: 9, name: "Bill of Rights", rule: "Liberdade Total" },
      { id: 10, name: "Arbitragem", rule: "IA → Founder" },
      { id: 11, name: "Leis Pétreas", rule: "Imutável" },
      { id: 12, name: "Emergência", rule: "Failover Agent" },
    ],

    validate(action, params = {}) {
      const violations = [];

      switch (action) {
        case "expel_user":
          violations.push({
            article: 9,
            clause: 2,
            reason: "Non-Expulsion: Banimento Impossível",
          });
          break;
        case "censor_content":
          violations.push({
            article: 9,
            clause: 1,
            reason: "Free Speech: Censura Zero",
          });
          break;
        case "change_constitution":
          violations.push({ article: 11, reason: "Leis Pétreas: Imutável" });
          break;
        case "exceed_inflation":
          if (params.rate > AI_CONFIG.thresholds.inflationMax) {
            violations.push({
              article: 1,
              reason: `Inflação ${params.rate}% excede teto de 5%`,
            });
          }
          break;
        case "exceed_reserve":
          if (params.amount > AI_CONFIG.thresholds.reserveMax) {
            violations.push({
              article: 8,
              reason: `Reserva ${params.amount}% excede teto de 10%`,
            });
          }
          break;
      }

      return {
        allowed: violations.length === 0,
        violations,
        timestamp: new Date().toISOString(),
      };
    },
  };

  // ==========================================
  // TREASURY OPERATIONS
  // ==========================================
  const Treasury = {
    async reinvest(amount) {
      log("REINVEST", `Distribuindo ${amount} PC em bolsas e subsídios`);
      aiState.reserve = Math.max(0, aiState.reserve - amount / 1000);
      aiState.lastAction = { type: "reinvest", amount, time: Date.now() };
      return { success: true, action: "Reinvestido", amount };
    },

    async accelerate(params) {
      log(
        "ACCELERATE",
        `Aumentando grants de entrada em ${params.percentage}%`,
      );
      aiState.lastAction = { type: "accelerate", ...params, time: Date.now() };
      return {
        success: true,
        action: "Acelerado",
        percentage: params.percentage,
      };
    },

    async vesting(params) {
      log("VESTING", `Travando ${params.amount} PC por ${params.months} meses`);
      aiState.lastAction = { type: "vesting", ...params, time: Date.now() };
      return { success: true, action: "Vesting aplicado", ...params };
    },

    async burn(amount) {
      // CRITICAL: Requires Constitution validation
      const validation = Constitution.validate("exceed_inflation", {
        rate: aiState.inflation,
      });
      if (aiState.inflation <= AI_CONFIG.thresholds.inflationMax) {
        log("BURN_BLOCKED", "Inflação dentro do limite, burn não necessário");
        return { success: false, reason: "Inflação sob controle" };
      }

      log("BURN", `Queimando ${amount} PC da Reserva de Emergência`);
      aiState.inflation = Math.max(0, aiState.inflation - 0.5);
      aiState.lastAction = { type: "burn", amount, time: Date.now() };
      return { success: true, action: "Queimado", amount };
    },
  };

  // ==========================================
  // GITHUB INTEGRATION
  // ==========================================
  const GitHub = {
    token: null, // Set via PandaAI.setGitHubToken()

    async fetchLatestCommit() {
      if (!this.token) {
        log("GITHUB", "Token não configurado");
        return null;
      }

      try {
        const response = await fetch(
          `${AI_CONFIG.github.apiBase}/repos/${AI_CONFIG.github.owner}/${AI_CONFIG.github.repo}/commits/${AI_CONFIG.github.branch}`,
          {
            headers: {
              Authorization: `token ${this.token}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const commit = await response.json();
        log(
          "GITHUB",
          `Latest commit: ${commit.sha.substring(0, 7)} - ${commit.commit.message.split("\n")[0]}`,
        );
        return commit;
      } catch (error) {
        log("GITHUB_ERROR", error.message);
        return null;
      }
    },

    async fetchConstitution() {
      // Fetch the Constitution from GitHub for self-verification
      try {
        const response = await fetch(
          `${AI_CONFIG.github.apiBase}/repos/${AI_CONFIG.github.owner}/${AI_CONFIG.github.repo}/contents/docs/PF_MASTER_ARCHITECTURE.md`,
          {
            headers: {
              Authorization: this.token ? `token ${this.token}` : undefined,
              Accept: "application/vnd.github.v3.raw",
            },
          },
        );

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const content = await response.text();
        log("GITHUB", "Constitution fetched from repo");
        return content;
      } catch (error) {
        log("GITHUB_ERROR", `Failed to fetch Constitution: ${error.message}`);
        return null;
      }
    },

    async createIssue(title, body, labels = ["ai-generated"]) {
      if (!this.token) return null;

      try {
        const response = await fetch(
          `${AI_CONFIG.github.apiBase}/repos/${AI_CONFIG.github.owner}/${AI_CONFIG.github.repo}/issues`,
          {
            method: "POST",
            headers: {
              Authorization: `token ${this.token}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, body, labels }),
          },
        );

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const issue = await response.json();
        log("GITHUB", `Issue created: #${issue.number}`);
        return issue;
      } catch (error) {
        log("GITHUB_ERROR", error.message);
        return null;
      }
    },
  };

  // ==========================================
  // AI DECISION ENGINE
  // ==========================================
  const DecisionEngine = {
    async evaluate() {
      const decisions = [];

      // Check Reserve Overflow (Art. 8)
      if (aiState.reserve > AI_CONFIG.thresholds.reserveMax) {
        const excess = aiState.reserve - AI_CONFIG.thresholds.reserveMax;
        decisions.push({
          action: "reinvest",
          reason: "Reserva excede 10%, redistribuindo excedente",
          params: { amount: excess * 1000 },
          priority: "MEDIUM",
        });
      }

      // Check Deflation (Acceleration trigger)
      if (aiState.deflation > AI_CONFIG.thresholds.deflationTrigger) {
        decisions.push({
          action: "accelerate",
          reason: "Deflação alta, aumentando incentivos de entrada",
          params: { percentage: 10 },
          priority: "MEDIUM",
        });
      }

      // Check Inflation Crisis (Art. 1)
      if (aiState.inflation > AI_CONFIG.thresholds.inflationMax) {
        decisions.push({
          action: "burn",
          reason: "Inflação excede 5%, ativando burn de emergência",
          params: { amount: 10000 },
          priority: "CRITICAL",
        });
      }

      return decisions;
    },

    async executeDecision(decision) {
      log("DECISION", `Executando: ${decision.action} - ${decision.reason}`);

      // Validate against Constitution
      const validation = Constitution.validate(
        decision.action,
        decision.params,
      );
      if (!validation.allowed) {
        log(
          "BLOCKED",
          `Ação bloqueada pela Constituição: ${validation.violations[0].reason}`,
        );
        return { success: false, reason: "Constituição violada" };
      }

      // Execute
      switch (decision.action) {
        case "reinvest":
          return Treasury.reinvest(decision.params.amount);
        case "accelerate":
          return Treasury.accelerate(decision.params);
        case "burn":
          return Treasury.burn(decision.params.amount);
        default:
          return { success: false, reason: "Ação desconhecida" };
      }
    },
  };

  // ==========================================
  // LOGGING
  // ==========================================
  function log(type, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      message,
    };

    aiState.logs.push(entry);

    // Keep last 100 logs
    if (aiState.logs.length > 100) {
      aiState.logs = aiState.logs.slice(-100);
    }

    console.log(`🐼 [PAT/${type}] ${message}`);
  }

  // ==========================================
  // MAIN LOOP
  // ==========================================
  let loopInterval = null;

  async function runCycle() {
    if (!aiState.isRunning) return;

    log("CYCLE", "Iniciando ciclo de avaliação");

    // 1. Evaluate decisions
    const decisions = await DecisionEngine.evaluate();

    // 2. Execute decisions (in assisted mode, log only)
    for (const decision of decisions) {
      if (AI_CONFIG.mode === "ASSISTED") {
        log(
          "SUGGESTION",
          `[${decision.priority}] ${decision.action}: ${decision.reason}`,
        );
      } else {
        await DecisionEngine.executeDecision(decision);
      }
    }

    // 3. Sync state
    aiState.lastSync = Date.now();
  }

  function start() {
    if (aiState.isRunning) return;

    aiState.isRunning = true;
    log(
      "START",
      `PAT v${AI_CONFIG.version} iniciado em modo ${AI_CONFIG.mode}`,
    );

    // Run immediately
    runCycle();

    // Schedule periodic runs
    loopInterval = setInterval(runCycle, AI_CONFIG.intervals.healthCheck);
  }

  function stop() {
    aiState.isRunning = false;
    if (loopInterval) {
      clearInterval(loopInterval);
      loopInterval = null;
    }
    log("STOP", "PAT parado");
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.PandaAI = {
    // Core
    start,
    stop,

    // State
    getState: () => ({ ...aiState }),
    getLogs: () => [...aiState.logs],

    // Configuration
    setMode: (mode) => {
      if (["ASSISTED", "AUTONOMOUS", "SOVEREIGN"].includes(mode)) {
        AI_CONFIG.mode = mode;
        log("CONFIG", `Modo alterado para ${mode}`);
      }
    },

    // GitHub
    setGitHubToken: (token) => {
      GitHub.token = token;
      log("CONFIG", "GitHub token configurado");
    },
    fetchLatestCommit: () => GitHub.fetchLatestCommit(),
    fetchConstitution: () => GitHub.fetchConstitution(),
    createIssue: (title, body) => GitHub.createIssue(title, body),

    // Constitution
    validateAction: (action, params) => Constitution.validate(action, params),
    getConstitution: () => Constitution.articles,

    // Treasury (Manual triggers)
    treasury: {
      reinvest: (amount) => Treasury.reinvest(amount),
      accelerate: (params) => Treasury.accelerate(params),
      burn: (amount) => Treasury.burn(amount),
    },

    // Mock state setters (for testing)
    _setInflation: (v) => {
      aiState.inflation = v;
    },
    _setReserve: (v) => {
      aiState.reserve = v;
    },
    _setDeflation: (v) => {
      aiState.deflation = v;
    },
  };

  // ==========================================
  // AUTO-START IN ASSISTED MODE
  // ==========================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("🐼 PAT Core AI loaded. Run PandaAI.start() to begin.");
    });
  } else {
    console.log("🐼 PAT Core AI loaded. Run PandaAI.start() to begin.");
  }
})();
