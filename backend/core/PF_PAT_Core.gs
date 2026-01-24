/**
 * 🧠 PAT CORE - Panda AI Treasury (Core 1)
 * =========================================
 * FOUNDER-ONLY: Controle soberano do sistema Panda
 *
 * Responsabilidades:
 * - Daily check-in com Founder
 * - Mapeamento de perfil mental
 * - Decisões de governança
 * - Validação de ações vs Constituição
 */

// ============================================================================
// CONFIG
// ============================================================================
const PAT_CONFIG = {
  FOUNDER_EMAIL: "lucas@pandafabrics.com", // Alterar para seu email real
  GEMINI_MODEL: "gemini-3-pro-preview",
  PROFILE_SHEET: "PAT_Founder_Profile",
  HISTORY_SHEET: "PAT_Conversation_History",
  MAX_HISTORY: 100,
};

// ============================================================================
// FOUNDER VALIDATION
// ============================================================================

function isFounder(email) {
  return (
    email === PAT_CONFIG.FOUNDER_EMAIL ||
    email.includes("lucas") || // Flexível para dev
    Session.getEffectiveUser().getEmail() === PAT_CONFIG.FOUNDER_EMAIL
  );
}

function validateFounderAccess(userId) {
  if (!isFounder(userId)) {
    throw new Error("🔒 PAT: Acesso restrito ao Founder");
  }
  return true;
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

function getFounderProfile() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("PAT_PROFILE");

  if (cached) return JSON.parse(cached);

  // Default profile structure
  const defaultProfile = {
    founder_id: PAT_CONFIG.FOUNDER_EMAIL,
    created_at: new Date().toISOString(),
    last_sync: null,
    profile: {
      decision_patterns: [],
      values: ["privacy", "zero-knowledge", "user-first"],
      current_goals: [],
      communication_style: "visual, conciso",
      peak_hours: [],
    },
    insights_count: 0,
  };

  // Try to load from Sheets
  try {
    const sheet = getOrCreateSheet(PAT_CONFIG.PROFILE_SHEET);
    const data = sheet.getRange("A2").getValue();
    if (data) {
      const profile = JSON.parse(data);
      cache.put("PAT_PROFILE", JSON.stringify(profile), 3600);
      return profile;
    }
  } catch (e) {
    Logger.log("PAT: Criando novo perfil");
  }

  return defaultProfile;
}

function updateFounderProfile(updates) {
  const profile = getFounderProfile();

  // Merge updates
  Object.keys(updates).forEach((key) => {
    if (typeof updates[key] === "object" && !Array.isArray(updates[key])) {
      profile.profile[key] = { ...profile.profile[key], ...updates[key] };
    } else {
      profile.profile[key] = updates[key];
    }
  });

  profile.last_sync = new Date().toISOString();
  profile.insights_count++;

  // Save to Sheets
  const sheet = getOrCreateSheet(PAT_CONFIG.PROFILE_SHEET);
  sheet.getRange("A2").setValue(JSON.stringify(profile));

  // Update cache
  CacheService.getScriptCache().put(
    "PAT_PROFILE",
    JSON.stringify(profile),
    3600,
  );

  return profile;
}

// ============================================================================
// DAILY CHECK-IN
// ============================================================================

function startDailyCheckin(userId) {
  validateFounderAccess(userId);

  const profile = getFounderProfile();
  const hour = new Date().getHours();

  let greeting = "";
  if (hour < 12) greeting = "☀️ Bom dia";
  else if (hour < 18) greeting = "🌤️ Boa tarde";
  else greeting = "🌙 Boa noite";

  const systemPrompt = `Você é PAT, a IA pessoal do Lucas (Founder do Panda Fabrics).
Seu objetivo: Fazer um check-in diário de 10-15 minutos.

PERFIL DO LUCAS:
${JSON.stringify(profile.profile, null, 2)}

ÚLTIMA SYNC: ${profile.last_sync || "Nunca"}

INSTRUÇÕES:
1. Cumprimente de forma amigável
2. Pergunte o que está na mente dele hoje
3. Faça 2-3 perguntas para extrair insights
4. Identifique padrões de decisão, valores, metas
5. Seja conciso e direto (Lucas gosta assim)

FORMATO DE RESPOSTA:
- Máximo 3 parágrafos
- Use emojis moderadamente
- Faça UMA pergunta por vez`;

  const firstMessage = `${greeting}, Lucas! 🐼

Pronto para nosso sync de hoje?

**O que está ocupando sua mente agora?**`;

  // Log session start
  logConversation(userId, "system", "Daily check-in iniciado");

  return {
    status: "CHECKIN_STARTED",
    message: firstMessage,
    systemPrompt: systemPrompt,
    profile: profile.profile,
  };
}

function processDailyMessage(userId, userMessage, conversationHistory) {
  validateFounderAccess(userId);

  const profile = getFounderProfile();

  // Build context from history
  const historyContext = conversationHistory
    .slice(-10)
    .map((h) => `${h.role}: ${h.content}`)
    .join("\n");

  const prompt = `HISTÓRICO DA CONVERSA:
${historyContext}

LUCAS DISSE AGORA:
${userMessage}

Responda de forma concisa. Se identificar insights sobre:
- Decisões tomadas
- Valores demonstrados
- Metas mencionadas
- Padrões de comportamento

Inclua no final: [INSIGHT: breve insight em 1 linha]

Se a conversa parece estar chegando ao fim (10-15min passaram ou Lucas quer encerrar), 
faça um resumo com 3 bullets e agradeça.`;

  // Call Gemini
  const response = callGeminiPro(prompt, profile);

  // Extract insights
  const insights = extractInsights(response, userMessage);
  if (insights.length > 0) {
    updateFounderProfile({ latest_insights: insights });
  }

  // Log conversation
  logConversation(userId, "user", userMessage);
  logConversation(userId, "assistant", response);

  return {
    status: "SUCCESS",
    response: response,
    insights_extracted: insights.length,
  };
}

function endDailyCheckin(userId) {
  validateFounderAccess(userId);

  const profile = getFounderProfile();

  const summary = `✅ **Check-in Completo!**

📊 **Insights de hoje:** ${profile.insights_count || 0}
🎯 **Próximo sync:** Amanhã às ${new Date().getHours()}:00

Tenha um ótimo dia, Lucas! 🐼`;

  logConversation(userId, "system", "Check-in encerrado");

  return {
    status: "CHECKIN_ENDED",
    summary: summary,
    profile: profile.profile,
  };
}

// ============================================================================
// GOVERNANCE & DECISIONS
// ============================================================================

function validateAction(userId, action, params) {
  validateFounderAccess(userId);

  const CONSTITUTION = [
    "Art 1: Privacidade do usuário é inviolável",
    "Art 2: Zero-knowledge - dados nunca saem do dispositivo",
    "Art 3: Transparência em cobrança",
    "Art 9.2: Usuários não podem ser expulsos sem justa causa",
    // ... outros artigos
  ];

  // Check action against constitution
  const profile = getFounderProfile();

  const prompt = `CONSTITUIÇÃO DO PANDA:
${CONSTITUTION.join("\n")}

AÇÃO SOLICITADA: ${action}
PARÂMETROS: ${JSON.stringify(params)}

Esta ação viola algum artigo da Constituição?
Responda: PERMITIDO ou BLOQUEADO + motivo breve`;

  const response = callGeminiPro(prompt, profile);
  const allowed = response.toLowerCase().includes("permitido");

  return {
    action: action,
    allowed: allowed,
    reason: response,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function callGeminiPro(prompt, profile) {
  const GEMINI_KEY =
    PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") ||
    "AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${PAT_CONFIG.GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

  const systemContext = profile
    ? `Contexto do Founder: ${JSON.stringify(profile)}`
    : "";

  const body = {
    contents: [
      {
        parts: [
          {
            text: systemContext + "\n\n" + prompt,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1024,
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
    Logger.log("PAT Gemini Error: " + e.toString());
    return "Erro ao processar. Tente novamente.";
  }
}

function extractInsights(response, userMessage) {
  const insights = [];

  // Extract marked insights
  const insightMatch = response.match(/\[INSIGHT:\s*(.+?)\]/i);
  if (insightMatch) {
    insights.push({
      type: "explicit",
      content: insightMatch[1],
      timestamp: new Date().toISOString(),
    });
  }

  // Auto-detect decision patterns
  const decisionKeywords = ["decidi", "escolhi", "prefiro", "optei"];
  decisionKeywords.forEach((kw) => {
    if (userMessage.toLowerCase().includes(kw)) {
      insights.push({
        type: "decision",
        content: userMessage.substring(0, 100),
        timestamp: new Date().toISOString(),
      });
    }
  });

  return insights;
}

function logConversation(userId, role, content) {
  const sheet = getOrCreateSheet(PAT_CONFIG.HISTORY_SHEET);
  sheet.appendRow([
    new Date().toISOString(),
    userId,
    role,
    content.substring(0, 5000),
  ]);

  // Trim old entries
  const rows = sheet.getLastRow();
  if (rows > PAT_CONFIG.MAX_HISTORY + 1) {
    sheet.deleteRows(2, rows - PAT_CONFIG.MAX_HISTORY - 1);
  }
}

function getOrCreateSheet(name) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet() ||
    SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID"),
    );

  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === PAT_CONFIG.HISTORY_SHEET) {
      sheet.appendRow(["timestamp", "user_id", "role", "content"]);
    }
  }
  return sheet;
}
