/**
 * PANDA CORE - CONFIG.js
 * Centraliza constantes e configurações do sistema.
 *
 * @version 1.0.0
 * @author TitanGestão PRO
 */

const CONFIG = {
  APP_NAME: "Panda Fábrica OS",
  VERSION: "1.0.0",

  // ECONOMIA PANDA COIN
  ECONOMY: {
    MARGIN_PERCENT: 0.2, // 20% de margem sobre custo API
    CURRENCY_UNIT: "PC", // Panda Coin
    FIXED_USD_FALLBACK: 5.8, // Cotação de segurança
    INITIAL_BONUS: 100, // Bônus inicial para novos usuários
  },

  // APIs
  ENDPOINTS: {
    PANDA_CORE:
      "https://script.google.com/macros/s/AKfycbxPx18ed1gP8cR08dRxEInmVheihSoSkqiucXp2icFmF5dZO_ccM6c3Q6LMvjeE2VcM/exec",
    USD_RATE: "https://economia.awesomeapi.com.br/last/USD-BRL",
  },

  // CUSTOS POR SERVIÇO (em USD)
  SERVICE_COSTS: {
    TEXT_GEN: 0.0005, // ~1k tokens Gemini Flash
    IMAGE_GEN: 0.04, // DALL-E 3
    VIDEO_GEN: 0.5, // Runway/Luma
    DRIVE_READ: 0.001, // Leitura Drive
    SHEET_CREATE: 0.002, // Criar planilha
  },

  // DRIVE FOLDERS
  DRIVE: {
    ROOT_FOLDER_NAME: "PandaFabrics_DB",
    USERS_FOLDER: "Users_Data",
    LOGS_FOLDER: "System_Logs",
  },
};

// Helper para chaves seguras (GAS PropertiesService)
function getSecret(keyName) {
  if (typeof PropertiesService !== "undefined") {
    return PropertiesService.getScriptProperties().getProperty(keyName);
  }
  // Fallback para frontend (usa secrets.js)
  return window.CREDENTIALS?.[keyName] || null;
}
