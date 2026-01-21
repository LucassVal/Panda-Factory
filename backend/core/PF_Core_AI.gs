/**
 * PANDA CORE - AI_DISPATCHER.js
 * Roteador Multimodal: decide qual IA chamar e cobra o usuário.
 * Integra Tool Calling (Drive/Sheets) com serviços de IA (Gemini/DALL-E).
 *
 * @version 1.0.0
 */

/**
 * Processa o pedido, chama a IA correta e cobra o usuário.
 * @param {string} userId - ID do usuário
 * @param {string} requestType - Tipo de serviço (TEXT_GEN, IMAGE_GEN, DRIVE_READ, etc)
 * @param {Object} payload - Dados do pedido (prompt, fileId, etc)
 */
function dispatchRequest(userId, requestType, payload) {
  let apiCostUSD = CONFIG.SERVICE_COSTS[requestType] || 0.001;
  let resultData = {};

  // 1. SELECTOR DE SERVIÇO
  switch (requestType) {
    case "TEXT_GEN":
      resultData = handleTextGeneration(payload);
      break;

    case "IMAGE_GEN":
      resultData = handleImageGeneration(payload);
      break;

    case "VIDEO_GEN":
      resultData = handleVideoGeneration(payload);
      break;

    case "DRIVE_READ":
      resultData = handleDriveRead(payload);
      break;

    case "SHEET_CREATE":
      resultData = handleSheetCreate(payload);
      break;

    case "TOOL_CALL":
      resultData = handleToolCall(payload);
      break;

    default:
      throw new Error("Serviço desconhecido: " + requestType);
  }

  // 2. CÁLCULO FINANCEIRO
  const pandaPrice = calculatePandaPrice(apiCostUSD);

  // 3. COBRANÇA
  const transaction = debitWallet(userId, pandaPrice, requestType);

  if (!transaction.success) {
    return {
      status: "INSUFFICIENT_FUNDS",
      message: transaction.message,
      requiredPC: pandaPrice,
      currentBalance: transaction.newBalance,
    };
  }

  // 4. RETORNO
  return {
    status: "SUCCESS",
    data: resultData,
    meta: {
      service: requestType,
      cost_usd: apiCostUSD,
      charged_pc: pandaPrice,
      new_balance: transaction.newBalance,
      usd_rate: getUsdRate(),
    },
  };
}

// ========== HANDLERS DE SERVIÇO ==========

function handleTextGeneration(payload) {
  const GEMINI_KEY =
    getSecret("GEMINI_API_KEY") || "AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

  const body = {
    contents: [{ parts: [{ text: payload.prompt }] }],
  };

  const response = UrlFetchApp.fetch(url, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(body),
  });

  const json = JSON.parse(response.getContentText());
  return {
    text: json.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta",
  };
}

function handleImageGeneration(payload) {
  // TODO: Integrar DALL-E ou Imagen
  return { url: "https://placeholder.com/generated-image.png", status: "mock" };
}

function handleVideoGeneration(payload) {
  // TODO: Integrar Runway/Luma
  return { url: "https://placeholder.com/generated-video.mp4", status: "mock" };
}

function handleDriveRead(payload) {
  const file = DriveApp.getFileById(payload.fileId);
  const blob = file.getBlob();
  return {
    name: file.getName(),
    mimeType: blob.getContentType(),
    size: blob.getBytes().length,
    content: blob.getDataAsString(), // Apenas para texto
  };
}

function handleSheetCreate(payload) {
  const ss = SpreadsheetApp.create(payload.nome || "Nova Planilha");
  const sheet = ss.getActiveSheet();

  if (payload.dados && Array.isArray(payload.dados)) {
    sheet
      .getRange(1, 1, payload.dados.length, payload.dados[0].length)
      .setValues(payload.dados);
  }

  return {
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    sheetName: sheet.getName(),
  };
}

function handleToolCall(payload) {
  // Tool Calling genérico para agentes ativos
  const toolName = payload.tool;
  const args = payload.args;

  switch (toolName) {
    case "listaArquivosPasta":
      const folder = DriveApp.getFolderById(args.folderId);
      const files = folder.getFiles();
      const list = [];
      while (files.hasNext()) {
        const f = files.next();
        list.push({ id: f.getId(), name: f.getName() });
      }
      return { files: list };

    case "lerConteudoArquivo":
      return handleDriveRead({ fileId: args.fileId });

    case "criarPlanilhaComDados":
      return handleSheetCreate(args);

    default:
      throw new Error("Tool não encontrada: " + toolName);
  }
}
