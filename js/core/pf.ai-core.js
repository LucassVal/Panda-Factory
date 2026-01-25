/**
 * 🐼 PANDA AI CORE (PAT - Panda AI Treasury)
 * The AI Governor that operates within Constitutional bounds
 *
 * This is the Core AI that:
 * - Monitors system state (inflation, reserves, deflation)
 * - Executes treasury operations (reinvest, accelerate, vesting, burn, buyback)
 * - Enforces the 14 Constitutional Articles
 * - Tracks GitHub communities and ranks contributors
 * - Connects to GitHub for version control and self-improvement
 *
 * Version: 1.0.0
 * Architecture: Runs in Browser → Can be upgraded to Rust Agent
 *
 * ==========================================
 * 🚀 PHASE ROADMAP
 * ==========================================
 *
 * PHASE BETA (Atual):
 * ├── ✅ Splits (55/22/15/5/3)
 * ├── ✅ Pandômetro (usage tracking)
 * ├── ✅ Constitution (14 Articles - read-only)
 * └── ❌ PAT Operations (disabled)
 *
 * PHASE 1.0 (Futuro):
 * ├── ✅ PAT Operations (reinvest, accelerate, vesting, burn, buyback)
 * ├── ✅ CommunityTracker (contributor ranking)
 * ├── ✅ MindMap (Founder memory)
 * ├── ✅ Interview System
 * └── ✅ Full Tokenomics automation
 *
 * PHASE 2.0 (Cripto):
 * ├── ✅ ON_CHAIN mode (Solana)
 * ├── ✅ Smart contracts
 * └── ✅ Burn on-chain
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
      {
        id: 13,
        name: "Developer First",
        rule: "Desconto 10% (2.5x→2.25x) quando sustentável OU deflação",
        details: {
          principle: "O foco são os devs. Quando sustentável, reduzir custos.",

          // Ativação por SUSTENTABILIDADE (todas obrigatórias)
          activationSustainable: {
            mau: 1000, // Monthly Active Users mínimo
            health: 80, // Health Score mínimo
            revenue: 10000, // Receita mensal mínima (R$)
            runway: 12, // Meses de runway mínimo
          },

          // Ativação por DEFLAÇÃO (alternativa - combate deflação)
          activationDeflation: {
            deflationRate: 2.0, // Se deflação > 2%, ativa desconto
            purpose: "Incentivar uso para aumentar volume de transações",
          },

          benefit: {
            maxDiscount: 0.1, // 10% máximo
            defaultMultiplier: 2.5,
            discountedMultiplier: 2.25, // 2.5 * 0.9 = 2.25
          },

          protected: ["split", "fundo", "educação", "bootcamps"],
          note: "Split 55/22/15/5/3 NUNCA muda. PAT também usa para combater deflação.",
        },
      },
      {
        id: 14,
        name: "Buyback Automático",
        rule: "PAT compra tokens quando inflação>5% (reduz supply)",
        details: {
          principle: "Controle de inflação via recompra e queima de tokens.",

          // Gatilho de ativação
          trigger: {
            inflationRate: 5.0, // Inflação > 5% por 30 dias
            consecutiveDays: 30,
          },

          // Limites de segurança
          limits: {
            maxMonthly: 0.1, // Máx 10% da Reserva de Liquidez/mês
            maxPerOrder: 10000, // Máx R$10.000 por ordem
            priceDiscount: 0.02, // Compra a 98% do preço (2% incentivo)
          },

          // Destino dos tokens comprados
          destination: {
            burn: 0.7, // 70% queimados
            reserve: 0.3, // 30% para reserva
          },

          // Aprovação escalonada
          approval: {
            auto: 1000, // < R$1.000: PAT auto-approve
            founder: 10000, // R$1.000-10.000: Ed25519 (24h timeout)
            manual: Infinity, // > R$10.000: Review manual obrigatório
          },

          // 🔄 MODO DUAL (Switch para migração)
          mode: "OFF_CHAIN", // "OFF_CHAIN" ou "ON_CHAIN"

          offChain: {
            enabled: true,
            payment: "PIX", // Via Open Finance
            storage: "Firestore", // Tokens marcados como burned
            masterAccount: "OPEN_FINANCE_MASTER_ID",
          },

          onChain: {
            enabled: false, // Ativar quando migrar
            network: "solana",
            burnContract: "SOLANA_BURN_CONTRACT_ADDRESS",
            wallet: "SOLANA_TREASURY_WALLET_ADDRESS",
          },

          note: "Switch mode de OFF_CHAIN para ON_CHAIN quando migrar para cripto",
        },
      },
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

    // ==========================================
    // 💰 BUYBACK (Art. 14 - Dual Mode)
    // ==========================================
    buybackConfig: {
      mode: "OFF_CHAIN", // 🔄 SWITCH: "OFF_CHAIN" ou "ON_CHAIN"

      // OFF-CHAIN (PIX/Open Finance) - AGORA
      offChain: {
        enabled: true,
        masterAccountId: "OPEN_FINANCE_MASTER_ID",
        paymentMethod: "PIX",
        burnStorage: "firestore", // Marca como burned no DB
      },

      // ON-CHAIN (Solana) - FUTURO
      onChain: {
        enabled: false,
        network: "solana",
        rpcUrl: "https://api.mainnet-beta.solana.com",
        treasuryWallet: "SOLANA_TREASURY_WALLET_PLACEHOLDER",
        burnContract: "SOLANA_BURN_CONTRACT_PLACEHOLDER",
        tokenMint: "PANDA_COIN_MINT_PLACEHOLDER",
      },
    },

    /**
     * Executa buyback de tokens (Art. 14)
     * @param {number} amountBRL - Valor em BRL para comprar
     * @param {object} options - { forceMode, skipApproval }
     */
    async buyback(amountBRL, options = {}) {
      const art14 = Constitution.articles.find((a) => a.id === 14);
      const mode = options.forceMode || this.buybackConfig.mode;

      log("BUYBACK", `Iniciando buyback de R$${amountBRL} (modo: ${mode})`);

      // 1. Validar gatilho (inflação > 5%)
      if (aiState.inflation <= 5.0 && !options.force) {
        log("BUYBACK", "Inflação sob controle, buyback não necessário");
        return {
          success: false,
          reason: "Inflação <= 5%",
          inflation: aiState.inflation,
        };
      }

      // 2. Validar limite por ordem
      const maxPerOrder = art14?.details?.limits?.maxPerOrder || 10000;
      if (amountBRL > maxPerOrder) {
        return { success: false, reason: `Máximo por ordem: R$${maxPerOrder}` };
      }

      // 3. Verificar aprovação
      const approvalLevels = art14?.details?.approval || {
        auto: 1000,
        founder: 10000,
      };
      let approvalType = "auto";
      if (amountBRL > approvalLevels.auto) approvalType = "founder";
      if (amountBRL > approvalLevels.founder) approvalType = "manual";

      log("BUYBACK", `Aprovação necessária: ${approvalType}`);

      // 4. Executar baseado no modo
      let result;
      if (mode === "OFF_CHAIN") {
        result = await this._buybackOffChain(amountBRL, approvalType);
      } else {
        result = await this._buybackOnChain(amountBRL, approvalType);
      }

      if (result.success) {
        // 5. Registrar ação
        aiState.lastAction = {
          type: "buyback",
          amount: amountBRL,
          mode,
          tokensBurned: result.tokensBurned,
          time: Date.now(),
        };

        // 6. Ajustar inflação (simular impacto)
        aiState.inflation = Math.max(0, aiState.inflation - 0.3);
      }

      return result;
    },

    /**
     * Buyback OFF-CHAIN (PIX/Open Finance)
     * @private
     */
    async _buybackOffChain(amountBRL, approvalType) {
      log("BUYBACK", "[OFF-CHAIN] Executando via PIX...");

      // Mock: Em produção, integra com Open Finance API
      const mockTokenPrice = 0.01; // R$0.01 por PC
      const tokensToBuy = Math.floor(amountBRL / mockTokenPrice);
      const tokensToBurn = Math.floor(tokensToBuy * 0.7); // 70% burn
      const tokensToReserve = tokensToBuy - tokensToBurn; // 30% reserve

      // Simular ordem no P2P
      const order = {
        id: "BUY_" + Date.now().toString(16),
        type: "BUYBACK",
        amountBRL,
        tokensRequested: tokensToBuy,
        pricePerToken: mockTokenPrice * 0.98, // 2% desconto
        status: "OPEN",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
        mode: "OFF_CHAIN",
        createdAt: Date.now(),
      };

      log(
        "BUYBACK",
        `[OFF-CHAIN] Ordem criada: ${order.id}, ${tokensToBuy} PC`,
      );

      return {
        success: true,
        mode: "OFF_CHAIN",
        order,
        tokensBought: tokensToBuy,
        tokensBurned: tokensToBurn,
        tokensToReserve: tokensToReserve,
        payment: "PIX_PENDING",
        message: "Ordem de compra criada. Aguardando vendedores.",
      };
    },

    /**
     * Buyback ON-CHAIN (Solana)
     * @private
     */
    async _buybackOnChain(amountBRL, approvalType) {
      log("BUYBACK", "[ON-CHAIN] Executando via Solana...");

      const config = this.buybackConfig.onChain;

      if (!config.enabled) {
        return {
          success: false,
          reason:
            "Modo ON-CHAIN não habilitado. Altere buybackConfig.onChain.enabled = true",
        };
      }

      // Placeholder: Em produção, integra com Solana SDK
      // const connection = new Connection(config.rpcUrl);
      // const tx = await burnTokens(config.treasuryWallet, amount);

      log(
        "BUYBACK",
        "[ON-CHAIN] Placeholder - implementar quando migrar para cripto",
      );

      return {
        success: false,
        mode: "ON_CHAIN",
        reason: "Solana integration not implemented yet",
        hint: "Switch to OFF_CHAIN or implement Solana SDK",
      };
    },

    /**
     * Migrar modo de buyback
     * @param {'OFF_CHAIN' | 'ON_CHAIN'} newMode
     */
    switchBuybackMode(newMode) {
      const oldMode = this.buybackConfig.mode;
      this.buybackConfig.mode = newMode;

      if (newMode === "ON_CHAIN") {
        this.buybackConfig.offChain.enabled = false;
        this.buybackConfig.onChain.enabled = true;
      } else {
        this.buybackConfig.offChain.enabled = true;
        this.buybackConfig.onChain.enabled = false;
      }

      log("BUYBACK", `Modo alterado: ${oldMode} → ${newMode}`);
      return { oldMode, newMode, config: this.buybackConfig };
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
  // 🏆 COMMUNITY TRACKER (Contributor Ranking)
  // Powers the rotative Beta Founder licenses
  // ==========================================
  const CommunityTracker = {
    // Repositories to track
    repos: [
      { owner: "LucassVal", repo: "SAAS", weight: 1.0 },
      { owner: "LucassVal", repo: "panda-sdk", weight: 1.0 },
      { owner: "LucassVal", repo: "panda-sdk-community", weight: 0.8 },
    ],

    // Scoring configuration (matches §9.4)
    scoring: {
      PR_MERGED: 50,
      ISSUE_CLOSED: 20,
      DOCUMENTATION: 30,
      BUG_REPORT: 10,
      COMMUNITY_HELP: 5,
      PLUGIN_PUBLISHED: 100,
      REFERRAL: 15,
    },

    // In-memory contributor data (production: Firestore)
    contributors: new Map(),
    lastSync: null,

    /**
     * Sync contributors from all tracked repositories
     */
    async syncAll() {
      if (!GitHub.token) {
        log("COMMUNITY", "GitHub token not set, cannot sync");
        return { success: false, reason: "No token" };
      }

      log("COMMUNITY", "Starting full contributor sync...");
      const startTime = Date.now();

      for (const repo of this.repos) {
        await this._syncRepo(repo.owner, repo.repo, repo.weight);
      }

      this.lastSync = new Date().toISOString();
      const elapsed = Date.now() - startTime;

      log(
        "COMMUNITY",
        `Sync complete. ${this.contributors.size} contributors. ${elapsed}ms`,
      );

      return {
        success: true,
        contributors: this.contributors.size,
        elapsed,
        lastSync: this.lastSync,
      };
    },

    /**
     * Sync a single repository
     */
    async _syncRepo(owner, repo, weight = 1.0) {
      try {
        // Fetch PRs
        const prs = await this._fetchPRs(owner, repo);
        for (const pr of prs) {
          if (pr.merged_at) {
            this._addPoints(
              pr.user.login,
              pr.user.id,
              this.scoring.PR_MERGED * weight,
              "PR_MERGED",
              pr.title,
            );
          }
        }

        // Fetch Issues (closed by author = contributor)
        const issues = await this._fetchIssues(owner, repo);
        for (const issue of issues) {
          if (!issue.pull_request) {
            // Exclude PRs
            if (issue.state === "closed") {
              this._addPoints(
                issue.user.login,
                issue.user.id,
                this.scoring.ISSUE_CLOSED * weight,
                "ISSUE_CLOSED",
                issue.title,
              );
            } else {
              this._addPoints(
                issue.user.login,
                issue.user.id,
                this.scoring.BUG_REPORT * weight,
                "BUG_REPORT",
                issue.title,
              );
            }
          }
        }

        log("COMMUNITY", `Synced ${owner}/${repo}`);
      } catch (error) {
        log(
          "COMMUNITY_ERROR",
          `Failed to sync ${owner}/${repo}: ${error.message}`,
        );
      }
    },

    /**
     * Fetch PRs from GitHub
     */
    async _fetchPRs(owner, repo) {
      try {
        const response = await fetch(
          `${AI_CONFIG.github.apiBase}/repos/${owner}/${repo}/pulls?state=all&per_page=100`,
          {
            headers: {
              Authorization: `token ${GitHub.token}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        );
        if (!response.ok) return [];
        return await response.json();
      } catch {
        return [];
      }
    },

    /**
     * Fetch Issues from GitHub
     */
    async _fetchIssues(owner, repo) {
      try {
        const response = await fetch(
          `${AI_CONFIG.github.apiBase}/repos/${owner}/${repo}/issues?state=all&per_page=100`,
          {
            headers: {
              Authorization: `token ${GitHub.token}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        );
        if (!response.ok) return [];
        return await response.json();
      } catch {
        return [];
      }
    },

    /**
     * Add points to a contributor
     */
    _addPoints(username, githubId, points, type, description) {
      if (!this.contributors.has(username)) {
        this.contributors.set(username, {
          username,
          githubId,
          points: 0,
          contributions: [],
          tier: "STANDARD",
        });
      }

      const contributor = this.contributors.get(username);
      contributor.points += points;
      contributor.contributions.push({
        type,
        points,
        description: description?.substring(0, 50),
        timestamp: Date.now(),
      });
    },

    /**
     * Add manual points (community help, plugins, referrals)
     */
    addManualPoints(username, githubId, type, description = "") {
      const points = this.scoring[type] || 0;
      if (points > 0) {
        this._addPoints(username, githubId, points, type, description);
        log("COMMUNITY", `Manual points: ${username} +${points} (${type})`);
        return { success: true, username, points, type };
      }
      return { success: false, reason: "Invalid type" };
    },

    /**
     * Get ranked contributors (Top N)
     */
    getRanking(limit = 100) {
      const sorted = Array.from(this.contributors.values())
        .sort((a, b) => b.points - a.points)
        .slice(0, limit);

      // Update tiers based on ranking
      sorted.forEach((c, index) => {
        c.rank = index + 1;
        c.tier = index < 100 ? "BETA_FOUNDER" : "STANDARD";
      });

      return sorted;
    },

    /**
     * Get Top 100 for Beta Founder eligibility
     */
    getTop100() {
      return this.getRanking(100);
    },

    /**
     * Check if user qualifies for Beta Founder
     */
    isBetaFounder(username) {
      const top100 = this.getTop100();
      return top100.some((c) => c.username === username);
    },

    /**
     * Get contributor details
     */
    getContributor(username) {
      return this.contributors.get(username) || null;
    },

    /**
     * Get summary stats
     */
    getStats() {
      const all = Array.from(this.contributors.values());
      return {
        totalContributors: all.length,
        totalPoints: all.reduce((sum, c) => sum + c.points, 0),
        top10: this.getRanking(10).map((c) => ({
          username: c.username,
          points: c.points,
        })),
        betaFounderSlots: {
          used: Math.min(all.length, 100),
          available: Math.max(0, 100 - all.length),
        },
        lastSync: this.lastSync,
      };
    },
  };

  // ==========================================
  // 🧠 FOUNDER MINDMAP (Memory System)
  // ==========================================
  const MindMap = {
    // In-memory storage (production: Firestore)
    data: {
      values: [], // Core values/beliefs
      decisions: [], // Past decision patterns
      preferences: [], // Style preferences
      redlines: [], // Hard limits (never cross)
    },

    /**
     * Add a value/belief to the mindmap
     */
    addValue(value, source = "interview") {
      this.data.values.push({
        value,
        source,
        timestamp: Date.now(),
        weight: 1.0,
      });
      log("MINDMAP", `Value added: "${value.substring(0, 50)}..."`);
      this._persist();
    },

    /**
     * Record a decision pattern
     */
    recordDecision(context, decision, reasoning) {
      this.data.decisions.push({
        context,
        decision,
        reasoning,
        timestamp: Date.now(),
      });
      log("MINDMAP", `Decision recorded: ${decision}`);
      this._persist();
    },

    /**
     * Add a red line (never cross)
     */
    addRedline(rule, severity = "critical") {
      this.data.redlines.push({
        rule,
        severity,
        timestamp: Date.now(),
        immutable: true,
      });
      log("MINDMAP", `Redline added: "${rule}"`);
      this._persist();
    },

    /**
     * Query mindmap for relevant context
     */
    async query(topic) {
      const relevant = {
        values: this.data.values.filter((v) =>
          v.value.toLowerCase().includes(topic.toLowerCase()),
        ),
        decisions: this.data.decisions.filter((d) =>
          d.context.toLowerCase().includes(topic.toLowerCase()),
        ),
        redlines: this.data.redlines.filter((r) =>
          r.rule.toLowerCase().includes(topic.toLowerCase()),
        ),
      };
      return relevant;
    },

    /**
     * Check if action violates any redline
     */
    checkRedlines(action) {
      const violations = this.data.redlines.filter((r) => {
        const keywords = r.rule.toLowerCase().split(" ");
        return keywords.some((k) => action.toLowerCase().includes(k));
      });
      return {
        allowed: violations.length === 0,
        violations,
      };
    },

    /**
     * Get summary of mindmap
     */
    getSummary() {
      return {
        valuesCount: this.data.values.length,
        decisionsCount: this.data.decisions.length,
        redlinesCount: this.data.redlines.length,
        lastUpdate: Math.max(
          ...this.data.values.map((v) => v.timestamp),
          ...this.data.decisions.map((d) => d.timestamp),
          0,
        ),
      };
    },

    /**
     * Persist to localStorage + Firestore (if available)
     */
    async _persist() {
      // Local storage (always)
      try {
        localStorage.setItem("panda_pat_mindmap", JSON.stringify(this.data));
      } catch (e) {
        log("MINDMAP_ERROR", "LocalStorage failed: " + e.message);
      }

      // Cloud sync (if Panda.Data available)
      try {
        if (window.Panda?.Data?.save) {
          const userId =
            (await window.Panda?.Auth?.getUser?.()?.uid) || "founder";
          await window.Panda.Data.save("pat_mindmaps", {
            id: `mindmap_${userId}`,
            userId,
            data: this.data,
            updatedAt: Date.now(),
            version: this._version || 1,
          });
          this._version = (this._version || 1) + 1;
          log("MINDMAP", "Synced to cloud");
        }
      } catch (e) {
        log("MINDMAP_WARN", "Cloud sync failed: " + e.message);
      }
    },

    /**
     * Load from localStorage + Firestore merge
     */
    async _load() {
      let localData = null;
      let cloudData = null;

      // Load from localStorage
      try {
        const stored = localStorage.getItem("panda_pat_mindmap");
        if (stored) {
          localData = JSON.parse(stored);
        }
      } catch (e) {
        log("MINDMAP_ERROR", "LocalStorage load failed: " + e.message);
      }

      // Load from cloud
      try {
        if (window.Panda?.Data?.get) {
          const userId =
            (await window.Panda?.Auth?.getUser?.()?.uid) || "founder";
          const cloud = await window.Panda.Data.get(
            "pat_mindmaps",
            `mindmap_${userId}`,
          );
          if (cloud?.data) {
            cloudData = cloud.data;
            this._version = cloud.version || 1;
          }
        }
      } catch (e) {
        log("MINDMAP_WARN", "Cloud load failed: " + e.message);
      }

      // Merge strategy: cloud wins for newer, merge arrays
      if (cloudData && localData) {
        this.data = this._mergeData(localData, cloudData);
        log("MINDMAP", "Merged local + cloud data");
      } else if (cloudData) {
        this.data = cloudData;
        log("MINDMAP", "Loaded from cloud");
      } else if (localData) {
        this.data = localData;
        log("MINDMAP", "Loaded from localStorage");
      }

      log(
        "MINDMAP",
        `Loaded: ${this.getSummary().valuesCount} values, ${this.getSummary().decisionsCount} decisions, ${this.getSummary().redlinesCount} redlines`,
      );
    },

    /**
     * Merge local and cloud data (deduplication)
     */
    _mergeData(local, cloud) {
      const merged = {
        values: this._mergeArray(local.values || [], cloud.values || []),
        decisions: this._mergeArray(
          local.decisions || [],
          cloud.decisions || [],
        ),
        preferences: this._mergeArray(
          local.preferences || [],
          cloud.preferences || [],
        ),
        redlines: this._mergeArray(local.redlines || [], cloud.redlines || []),
      };
      return merged;
    },

    /**
     * Merge arrays by timestamp (dedupe)
     */
    _mergeArray(arr1, arr2) {
      const combined = [...arr1, ...arr2];
      const seen = new Set();
      return combined
        .filter((item) => {
          const key = `${item.timestamp || 0}_${JSON.stringify(item).substring(0, 50)}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    },

    /**
     * Export mindmap for backup
     */
    async export() {
      return {
        exported: new Date().toISOString(),
        version: this._version || 1,
        data: this.data,
      };
    },

    /**
     * Import mindmap from backup
     */
    async import(backup) {
      if (!backup?.data) {
        throw new Error("Invalid backup format");
      }
      this.data = backup.data;
      await this._persist();
      log("MINDMAP", "Imported backup");
      return this.getSummary();
    },
  };

  // ==========================================
  // 🎙️ FOUNDER INTERVIEW SYSTEM
  // ==========================================
  const Interview = {
    currentSession: null,
    questions: [
      // Core Values
      {
        id: 1,
        category: "values",
        q: "O que te motivou a criar o Panda Factory?",
      },
      {
        id: 2,
        category: "values",
        q: "Qual é o maior valor que você quer que o Panda represente?",
      },
      {
        id: 3,
        category: "values",
        q: "O que você NUNCA permitiria que o Panda fizesse?",
      },

      // Decision Making
      {
        id: 4,
        category: "decisions",
        q: "Quando você tem que escolher entre lucro e usuário, qual prioriza?",
      },
      {
        id: 5,
        category: "decisions",
        q: "Como você lida com críticas ao projeto?",
      },
      {
        id: 6,
        category: "decisions",
        q: "Qual seria uma razão válida para mudar a Constituição?",
      },

      // Red Lines
      {
        id: 7,
        category: "redlines",
        q: "Existe alguma ação que você NUNCA tomaria, mesmo que fosse lucrativa?",
      },
      {
        id: 8,
        category: "redlines",
        q: "Quais comportamentos de usuário/dev são inaceitáveis?",
      },

      // Legacy
      {
        id: 9,
        category: "legacy",
        q: "Se você não pudesse mais gerenciar o Panda, o que a IA deveria preservar?",
      },
      {
        id: 10,
        category: "legacy",
        q: "Qual seria o maior sucesso do Panda daqui a 10 anos?",
      },
    ],

    /**
     * Start interview session
     */
    startSession() {
      this.currentSession = {
        startedAt: Date.now(),
        responses: [],
        currentQuestion: 0,
      };
      log("INTERVIEW", "Session started");
      return this.getNextQuestion();
    },

    /**
     * Get current question
     */
    getNextQuestion() {
      if (!this.currentSession) return null;

      const idx = this.currentSession.currentQuestion;
      if (idx >= this.questions.length) {
        return { complete: true, message: "Entrevista completa! Obrigado." };
      }

      return {
        complete: false,
        progress: `${idx + 1}/${this.questions.length}`,
        ...this.questions[idx],
      };
    },

    /**
     * Submit answer to current question
     */
    submitAnswer(answer) {
      if (!this.currentSession) return { error: "No active session" };

      const question = this.questions[this.currentSession.currentQuestion];

      // Record response
      this.currentSession.responses.push({
        questionId: question.id,
        category: question.category,
        question: question.q,
        answer,
        timestamp: Date.now(),
      });

      // Process into MindMap based on category
      switch (question.category) {
        case "values":
        case "legacy":
          MindMap.addValue(answer, "interview");
          break;
        case "decisions":
          MindMap.recordDecision(question.q, answer, "founder_interview");
          break;
        case "redlines":
          MindMap.addRedline(answer, "critical");
          break;
      }

      // Advance to next
      this.currentSession.currentQuestion++;

      return this.getNextQuestion();
    },

    /**
     * End session and save
     */
    endSession() {
      if (!this.currentSession) return null;

      const session = {
        ...this.currentSession,
        endedAt: Date.now(),
        responsesCount: this.currentSession.responses.length,
      };

      log("INTERVIEW", `Session ended: ${session.responsesCount} responses`);
      this.currentSession = null;

      return session;
    },

    /**
     * Add custom question
     */
    addQuestion(category, question) {
      const id = this.questions.length + 1;
      this.questions.push({ id, category, q: question });
      log("INTERVIEW", `Question added: "${question.substring(0, 30)}..."`);
      return id;
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

    // ==========================================
    // MINDMAP (Founder Memory System)
    // ==========================================
    mindMap: {
      addValue: (value, source) => MindMap.addValue(value, source),
      recordDecision: (ctx, dec, reason) =>
        MindMap.recordDecision(ctx, dec, reason),
      addRedline: (rule, severity) => MindMap.addRedline(rule, severity),
      query: (topic) => MindMap.query(topic),
      checkRedlines: (action) => MindMap.checkRedlines(action),
      getSummary: () => MindMap.getSummary(),
      load: () => MindMap._load(),
    },

    // ==========================================
    // INTERVIEW (Founder Training)
    // ==========================================
    interview: {
      start: () => Interview.startSession(),
      next: () => Interview.getNextQuestion(),
      answer: (response) => Interview.submitAnswer(response),
      end: () => Interview.endSession(),
      addQuestion: (cat, q) => Interview.addQuestion(cat, q),
      getQuestions: () => [...Interview.questions],
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
