/**
 * PANDA CORE - MAIN.js (API Gateway)
 * Expõe o sistema como Web App (HTTP Endpoint).
 *
 * @version 1.0.0
 */

/**
 * Recebe chamadas POST do Frontend (CRM.html) ou Agentes externos.
 * Estrutura esperada: { userId, type, payload }
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const userId = params.userId || Session.getEffectiveUser().getEmail();

    // Ações especiais
    if (params.action === "GET_BALANCE") {
      return jsonResponse({
        status: "SUCCESS",
        balance: getUserBalance(userId),
        unit: CONFIG.ECONOMY.CURRENCY_UNIT,
        usdRate: getUsdRate(),
      });
    }

    if (params.action === "RECHARGE") {
      const newBalance = creditWallet(userId, params.amount, "RECARGA_MANUAL");
      return jsonResponse({
        status: "SUCCESS",
        newBalance: newBalance,
        message: `Recarga de ${params.amount} PC efetuada com sucesso!`,
      });
    }

    // Roteamento padrão (IA/Tools)
    const response = dispatchRequest(userId, params.type, params.payload);
    return jsonResponse(response);
  } catch (error) {
    return jsonResponse({
      status: "ERROR",
      message: error.toString(),
    });
  }
}

/**
 * GET simples para verificar status da API.
 */
function doGet(e) {
  const action = e?.parameter?.action;

  if (action === "ping") {
    return ContentService.createTextOutput("pong");
  }

  if (action === "status") {
    return jsonResponse({
      status: "ONLINE",
      app: CONFIG.APP_NAME,
      version: CONFIG.VERSION,
      usdRate: getUsdRate(),
    });
  }

  return ContentService.createTextOutput(
    `🐼 ${CONFIG.APP_NAME} v${CONFIG.VERSION} - API Online`,
  );
}

/**
 * Helper para respostas JSON padronizadas.
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
