/**
 * 🌐 BRAIN CORE - Panda AI Assistant (Core 2)
 * ============================================
 * USER-FACING: API de IA para devs e usuários
 *
 * Responsabilidades:
 * - Chat e análise para usuários
 * - Gems (agentes pré-configurados)
 * - Custom workflows
 * - Analytics comportamentais
 */

// ============================================================================
// CONFIG
// ============================================================================
const BRAIN_CONFIG = {
  GEMINI_FLASH: "gemini-3-flash-latest",
  GEMINI_PRO: "gemini-3-pro-preview",
  ANALYTICS_SHEET: "Brain_Analytics",
  SESSIONS_SHEET: "Brain_Sessions",
  GEMS_SHEET: "Brain_Gems",
  FREE_TOKENS_DAY: 10000,
};

// ============================================================================
// GEMS (PRE-CONFIGURED AGENTS)
// ============================================================================
const GEMS = {
  writer: {
    id: "writer",
    name: "📝 Writer",
    description: "Redação e copywriting",
    model: "flash",
    systemPrompt:
      "Você é um escritor profissional. Ajude a criar textos claros, envolventes e persuasivos.",
    icon: "📝",
  },
  analyst: {
    id: "analyst",
    name: "📊 Analyst",
    description: "Análise de dados",
    model: "pro",
    systemPrompt:
      "Você é um analista de dados. Extraia insights, identifique padrões e apresente conclusões claras.",
    icon: "📊",
  },
  coder: {
    id: "coder",
    name: "💻 Coder",
    description: "Geração de código",
    model: "pro",
    systemPrompt:
      "Você é um desenvolvedor sênior. Escreva código limpo, documentado e seguindo boas práticas.",
    icon: "💻",
  },
  designer: {
    id: "designer",
    name: "🎨 Designer",
    description: "Prompts visuais e UI",
    model: "flash",
    systemPrompt:
      "Você é um designer de interfaces. Crie descrições visuais detalhadas e prompts para geração de imagens.",
    icon: "🎨",
  },
  planner: {
    id: "planner",
    name: "📋 Planner",
    description: "Planejamento e organização",
    model: "flash",
    systemPrompt:
      "Você é um planejador estratégico. Crie cronogramas, divida tarefas e organize projetos.",
    icon: "📋",
  },
  researcher: {
    id: "researcher",
    name: "🔍 Researcher",
    description: "Pesquisa profunda",
    model: "pro",
    systemPrompt:
      "Você é um pesquisador. Investigue tópicos a fundo, cite fontes e sintetize informações.",
    icon: "🔍",
  },
};

// ============================================================================
// MAIN API
// ============================================================================

function brainChat(userId, message, gemId, sessionId) {
  const gem = gemId ? GEMS[gemId] : null;
  const model =
    gem?.model === "pro" ? BRAIN_CONFIG.GEMINI_PRO : BRAIN_CONFIG.GEMINI_FLASH;
  const systemPrompt =
    gem?.systemPrompt || "Você é um assistente inteligente e amigável.";

  // Track analytics
  trackInteraction(userId, "chat", { gemId, messageLength: message.length });

  // Call Gemini
  const response = callBrainModel(message, systemPrompt, model);

  // Log session
  logSession(userId, sessionId, message, response, gemId);

  return {
    status: "SUCCESS",
    response: response,
    gem: gem?.name || "Assistant",
    model: model,
  };
}

function brainAnalyze(userId, data, analysisType) {
  trackInteraction(userId, "analyze", {
    analysisType,
    dataSize: JSON.stringify(data).length,
  });

  const prompt = `Analise os seguintes dados (Tipo: ${analysisType}):

${JSON.stringify(data, null, 2)}

Forneça:
1. Resumo executivo
2. Principais insights
3. Recomendações`;

  const response = callBrainModel(
    prompt,
    GEMS.analyst.systemPrompt,
    BRAIN_CONFIG.GEMINI_PRO,
  );

  return {
    status: "SUCCESS",
    analysis: response,
    type: analysisType,
  };
}

function brainGetGems() {
  return {
    status: "SUCCESS",
    gems: Object.values(GEMS).map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      icon: g.icon,
      model: g.model,
    })),
  };
}

// ============================================================================
// CUSTOM WORKFLOWS
// ============================================================================

function createWorkflow(userId, workflowDef) {
  const sheet = getOrCreateSheet("Brain_Workflows");

  const workflow = {
    id: "wf_" + Date.now(),
    userId: userId,
    name: workflowDef.name,
    description: workflowDef.description || "",
    steps: workflowDef.steps,
    created_at: new Date().toISOString(),
    runs: 0,
  };

  sheet.appendRow([workflow.id, userId, JSON.stringify(workflow)]);

  trackInteraction(userId, "create_workflow", { workflowId: workflow.id });

  return {
    status: "SUCCESS",
    workflow: workflow,
  };
}

function runWorkflow(userId, workflowId, inputData) {
  const sheet = getOrCreateSheet("Brain_Workflows");
  const data = sheet.getDataRange().getValues();

  let workflow = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === workflowId) {
      workflow = JSON.parse(data[i][2]);
      break;
    }
  }

  if (!workflow) {
    return { status: "ERROR", message: "Workflow não encontrado" };
  }

  // Execute steps sequentially
  let context = inputData;
  const results = [];

  for (const step of workflow.steps) {
    const gem = GEMS[step.gem] || GEMS.writer;
    const prompt = step.prompt.replace("{input}", JSON.stringify(context));

    const response = callBrainModel(
      prompt,
      gem.systemPrompt,
      gem.model === "pro" ? BRAIN_CONFIG.GEMINI_PRO : BRAIN_CONFIG.GEMINI_FLASH,
    );

    results.push({
      step: step.action,
      gem: gem.name,
      output: response,
    });

    context = response; // Pass to next step
  }

  trackInteraction(userId, "run_workflow", {
    workflowId,
    steps: workflow.steps.length,
  });

  return {
    status: "SUCCESS",
    workflowId: workflowId,
    results: results,
  };
}

function suggestWorkflow(userId, userPattern) {
  const prompt = `Baseado no padrão de uso: "${userPattern}"

Sugira um workflow automatizado com 2-4 passos.
Gems disponíveis: ${Object.keys(GEMS).join(", ")}

Formato JSON:
{
  "name": "Nome do Workflow",
  "description": "Descrição",
  "steps": [
    { "gem": "gem_id", "action": "descrição", "prompt": "prompt para IA" }
  ]
}`;

  const response = callBrainModel(prompt, "", BRAIN_CONFIG.GEMINI_PRO);

  try {
    const suggestion = JSON.parse(response);
    return { status: "SUCCESS", suggestion: suggestion };
  } catch (e) {
    return { status: "SUCCESS", suggestion: { raw: response } };
  }
}

// ============================================================================
// ANALYTICS (Para o PAT/Founder ver)
// ============================================================================

function trackInteraction(userId, type, metadata) {
  const sheet = getOrCreateSheet(BRAIN_CONFIG.ANALYTICS_SHEET);

  sheet.appendRow([
    new Date().toISOString(),
    userId,
    type,
    JSON.stringify(metadata),
  ]);
}

function generateDailyReport() {
  // Called by PAT or scheduled trigger
  const sheet = getOrCreateSheet(BRAIN_CONFIG.ANALYTICS_SHEET);
  const data = sheet.getDataRange().getValues();

  const today = new Date().toISOString().split("T")[0];
  const todayData = data.filter((row) => row[0]?.toString().startsWith(today));

  const uniqueUsers = [...new Set(todayData.map((r) => r[1]))];
  const typeCount = {};
  const frustrations = [];

  todayData.forEach((row) => {
    const type = row[2];
    typeCount[type] = (typeCount[type] || 0) + 1;

    // Detect frustrations (short messages, repeated questions, errors)
    const meta = row[3] ? JSON.parse(row[3]) : {};
    if (meta.messageLength < 10 || meta.error) {
      frustrations.push({
        userId: row[1],
        type: type,
        timestamp: row[0],
      });
    }
  });

  const report = {
    report_date: today,
    users_active: uniqueUsers.length,
    sessions_today: todayData.length,
    interactions_by_type: typeCount,
    frustrations_detected: frustrations.length,
    popular_gems: Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => ({ type: k, count: v })),
    recommendations: generateRecommendations(typeCount, frustrations),
  };

  // Save report
  const reportSheet = getOrCreateSheet("Brain_Reports");
  reportSheet.appendRow([today, JSON.stringify(report)]);

  return report;
}

function generateRecommendations(typeCount, frustrations) {
  const recs = [];

  if (frustrations.length > 10) {
    recs.push("⚠️ Alta taxa de frustração detectada. Revisar UX.");
  }

  if (typeCount.chat > typeCount.analyze * 3) {
    recs.push(
      "💡 Usuários usam mais chat que análise. Destacar features de análise.",
    );
  }

  if (!typeCount.create_workflow) {
    recs.push("📋 Workflows não estão sendo usados. Adicionar tutorial.");
  }

  return recs;
}

// ============================================================================
// HELPERS
// ============================================================================

function callBrainModel(prompt, systemPrompt, model) {
  const GEMINI_KEY =
    PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") ||
    "AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(body),
    });

    const json = JSON.parse(response.getContentText());
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta";
  } catch (e) {
    trackInteraction("system", "error", { error: e.toString() });
    return "Erro ao processar. Tente novamente.";
  }
}

function logSession(userId, sessionId, userMsg, assistantMsg, gemId) {
  const sheet = getOrCreateSheet(BRAIN_CONFIG.SESSIONS_SHEET);
  sheet.appendRow([
    new Date().toISOString(),
    userId,
    sessionId || "default",
    gemId || "assistant",
    userMsg.substring(0, 1000),
    assistantMsg.substring(0, 1000),
  ]);
}
