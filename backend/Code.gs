/**
 * 🐼 PANDA FABRICS CORE - UNIFIED BACKEND (v2.0)
 * 
 * Fusão: TitanGestão Sync + Panda Core Economic Engine
 * Deploy: Publicar como Web App (Executar como: Eu / Acesso: Qualquer um)
 * 
 * Repositório: github.com/LucassVal/SAAS
 */

// ============================================================================
// 1. CONFIG & CONSTANTES GLOBAIS
// ============================================================================
const CONFIG = {
  APP_NAME: 'Panda Fabrics Core',
  VERSION: '2.0.0',
  
  // ECONOMIA PANDA COIN
  ECONOMY: {
    MARGIN_PERCENT: 0.20,       // 20% margem sobre custo API
    CURRENCY_UNIT: "PC",        // Panda Coin
    FIXED_USD_FALLBACK: 5.80,   // Cotação de segurança
    INITIAL_BONUS: 100,         // Bônus inicial novos usuários
  },

  // CUSTOS POR SERVIÇO (em USD)
  SERVICE_COSTS: {
    TEXT_GEN: 0.0005,
    IMAGE_GEN: 0.04,
    VIDEO_GEN: 0.50,
    DRIVE_READ: 0.001,
    SHEET_CREATE: 0.002,
  },

  // DRIVE
  DRIVE: {
    ROOT_FOLDER_NAME: 'PandaFabrics_Data_v2',
    USERS_FOLDER: 'Users_Data',
    LOGS_FOLDER: 'System_Logs',
  },

  // GEMINI
  GEMINI_MODEL: 'gemini-1.5-flash',
  
  LOCK_TIMEOUT: 10000,
};

// ============================================================================
// 2. API GATEWAY (ENTRY POINTS)
// ============================================================================

function doGet(e) {
  if (!e) e = { parameter: { action: 'ping' } };
  const action = e.parameter.action || 'status';

  switch(action) {
    case 'ping':
      return ContentService.createTextOutput('pong');
    case 'status':
      return jsonResponse({
        status: 'ONLINE',
        app: CONFIG.APP_NAME,
        version: CONFIG.VERSION,
        usdRate: getUsdRate()
      });
    case 'setup':
      return handleSetup();
    default:
      return ContentService.createTextOutput(`🐼 ${CONFIG.APP_NAME} v${CONFIG.VERSION} - API Online`);
  }
}

function doPost(e) {
  if (!e) return jsonResponse({ error: 'Payload required' }, 400);

  const lock = LockService.getScriptLock();
  
  try {
    if (!lock.tryLock(CONFIG.LOCK_TIMEOUT)) {
      return jsonResponse({ error: 'Servidor ocupado. Tente novamente.' }, 503);
    }

    // === PROCESSO PAGSEGURO (WEBHOOK) ===
    if (e.parameter && e.parameter.notificationCode) {
      const result = processPaymentNotification(e.parameter.notificationCode);
      return ContentService.createTextOutput(result);
    }

    const payload = JSON.parse(e.postData.contents);
    
    // === PROCESSO B2B (KIWIFY/HOTMART) ===
    // Detecta assinatura do webhook (Kiwify costuma mandar header ou payload específico)
    // Se for Kiwify (exemplo simples de detecção):
    if (payload.order_id && payload.Customer) {
      const result = processB2BWebhook(payload, 'KIWIFY');
      return jsonResponse(result);
    }
    // Hotmart
    if (payload.event && payload.data && payload.data.buyer) {
      const result = processB2BWebhook(payload, 'HOTMART');
      return jsonResponse(result);
    }

    const userId = payload.userId || Session.getEffectiveUser().getEmail();
    const action = payload.action;
    const type = payload.type;

    // === AÇÕES ESPECIAIS (LEDGER & PAYMENT) ===
    if (action === 'GET_BALANCE') {
      return jsonResponse({
        status: 'SUCCESS',
        balance: getUserBalance(userId),
        unit: CONFIG.ECONOMY.CURRENCY_UNIT,
        usdRate: getUsdRate()
      });
    }

    if (action === 'CREATE_PAYMENT') {
       const checkout = createCheckout(userId, payload.amountPC, payload.priceBRL);
       return jsonResponse(checkout);
    }

    if (action === 'RECHARGE') { // MANTIDO PARA TESTES MANUAIS
      const newBalance = creditWallet(userId, payload.amount, 'RECARGA_MANUAL');
      return jsonResponse({
        status: 'SUCCESS',
        newBalance: newBalance,
        message: `Recarga de ${payload.amount} PC efetuada!`
      });
    }

    // === SYNC (LEGADO) ===
    if (action === 'SYNC_PULL') {
      return handleSyncPull(payload.storeId || '1', payload.lastSyncTime);
    }
    if (action === 'SYNC_PUSH') {
      return handleSyncPush(payload.storeId || '1', payload.changes);
    }

    // === AI DISPATCHER ===
    if (type) {
      return jsonResponse(dispatchRequest(userId, type, payload.payload));
    }

    return jsonResponse({ error: 'Ação desconhecida' }, 400);

  } catch (error) {
    Logger.log("ERRO: " + error.toString());
    return jsonResponse({ error: error.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// 3. ORACLE (COTAÇÃO USD/BRL)
// ============================================================================

function getUsdRate() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("USD_BRL_RATE");
  if (cached) return parseFloat(cached);

  try {
    const response = UrlFetchApp.fetch("https://economia.awesomeapi.com.br/last/USD-BRL");
    const json = JSON.parse(response.getContentText());
    const rate = parseFloat(json.USDBRL.bid);
    cache.put("USD_BRL_RATE", rate.toString(), 3600);
    return rate;
  } catch (e) {
    return CONFIG.ECONOMY.FIXED_USD_FALLBACK;
  }
}

function calculatePandaPrice(costInUsd) {
  const rate = getUsdRate();
  const rawCost = costInUsd * rate;
  return parseFloat((rawCost * (1 + CONFIG.ECONOMY.MARGIN_PERCENT)).toFixed(4));
}

// ============================================================================
// 4. LEDGER (CARTEIRA PANDA COIN)
// ============================================================================

function getUserBalance(userId) {
  const userProps = PropertiesService.getUserProperties();
  const balance = userProps.getProperty("PANDA_WALLET_" + userId);
  
  if (balance === null) {
    creditWallet(userId, CONFIG.ECONOMY.INITIAL_BONUS, "BONUS_INICIAL");
    return CONFIG.ECONOMY.INITIAL_BONUS;
  }
  return parseFloat(balance);
}

function debitWallet(userId, amountPC, serviceType) {
  const current = getUserBalance(userId);
  if (current < amountPC) {
    return { success: false, message: `Saldo Insuficiente. Necessário: ${amountPC} PC`, newBalance: current };
  }

  const newBalance = parseFloat((current - amountPC).toFixed(4));
  PropertiesService.getUserProperties().setProperty("PANDA_WALLET_" + userId, newBalance.toString());
  logTransaction(userId, "DEBIT", amountPC, newBalance, serviceType);
  return { success: true, newBalance: newBalance, amountCharged: amountPC };
}

function creditWallet(userId, amountPC, reason) {
  const current = getUserBalance(userId) || 0;
  const newBalance = parseFloat((current + amountPC).toFixed(4));
  PropertiesService.getUserProperties().setProperty("PANDA_WALLET_" + userId, newBalance.toString());
  logTransaction(userId, "CREDIT", amountPC, newBalance, reason);
  return newBalance;
}

function logTransaction(userId, type, amount, balance, desc) {
  Logger.log(`[LEDGER] ${userId} | ${type}: ${amount} PC | SALDO: ${balance} | ${desc}`);
}

// ============================================================================
// 5. AI DISPATCHER (ROTEADOR MULTIMODAL)
// ============================================================================

function dispatchRequest(userId, requestType, payload) {
  const apiCostUSD = CONFIG.SERVICE_COSTS[requestType] || 0.001;
  let resultData = {};

  switch (requestType) {
    case "TEXT_GEN":
      resultData = handleTextGeneration(payload);
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
      return { status: "ERROR", message: "Serviço desconhecido: " + requestType };
  }

  const pandaPrice = calculatePandaPrice(apiCostUSD);
  const transaction = debitWallet(userId, pandaPrice, requestType);

  if (!transaction.success) {
    return {
      status: "INSUFFICIENT_FUNDS",
      message: transaction.message,
      requiredPC: pandaPrice,
      currentBalance: transaction.newBalance
    };
  }

  return {
    status: "SUCCESS",
    data: resultData,
    meta: {
      service: requestType,
      cost_usd: apiCostUSD,
      charged_pc: pandaPrice,
      new_balance: transaction.newBalance,
      usd_rate: getUsdRate()
    }
  };
}

function handleTextGeneration(payload) {
  const GEMINI_KEY = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") 
    || "AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  
  const body = { contents: [{ parts: [{ text: payload.prompt }] }] };
  const response = UrlFetchApp.fetch(url, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(body)
  });
  
  const json = JSON.parse(response.getContentText());
  return { text: json.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta" };
}

function handleDriveRead(payload) {
  const file = DriveApp.getFileById(payload.fileId);
  return { name: file.getName(), content: file.getBlob().getDataAsString() };
}

function handleSheetCreate(payload) {
  const ss = SpreadsheetApp.create(payload.nome || "Nova Planilha");
  if (payload.dados) {
    ss.getActiveSheet().getRange(1, 1, payload.dados.length, payload.dados[0].length).setValues(payload.dados);
  }
  return { spreadsheetUrl: ss.getUrl(), spreadsheetId: ss.getId() };
}

function handleToolCall(payload) {
  const tool = payload.tool;
  const args = payload.args;
  
  switch(tool) {
    case "listaArquivosPasta":
      const folder = DriveApp.getFolderById(args.folderId);
      const files = folder.getFiles();
      const list = [];
      while(files.hasNext()) {
        const f = files.next();
        list.push({ id: f.getId(), name: f.getName() });
      }
      return { files: list };
    case "criarPlanilhaComDados":
      return handleSheetCreate(args);
    default:
      return { error: "Tool não encontrada: " + tool };
  }
}

// ============================================================================
// 6. SYNC (LEGADO TITANGESTÃO)
// ============================================================================

function handleSetup() {
  const folders = DriveApp.getFoldersByName(CONFIG.DRIVE.ROOT_FOLDER_NAME);
  let folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.DRIVE.ROOT_FOLDER_NAME);
  
  ['clientes.json', 'produtos.json', 'vendas.json', 'sys_logs.json'].forEach(f => {
    if (!folder.getFilesByName(f).hasNext()) folder.createFile(f, '[]');
  });

  return jsonResponse({ status: 'success', folderId: folder.getId() });
}

function handleSyncPush(storeId, changes) {
  if (!changes || !changes.length) return jsonResponse({ status: 'no_changes' });
  
  const folder = getMasterFolder();
  const results = [];
  const byTable = {};
  
  changes.forEach(c => {
    if (!byTable[c.table]) byTable[c.table] = [];
    byTable[c.table].push(c);
  });

  Object.keys(byTable).forEach(tableName => {
    const file = getFile(folder, tableName + '.json');
    let data = JSON.parse(file.getBlob().getDataAsString());
    
    byTable[tableName].forEach(change => {
      change.data._synced_at = new Date().toISOString();
      data = data.filter(d => d.id !== change.data.id);
      data.push(change.data);
      results.push({ id: change.data.id, status: 'synced' });
    });

    file.setContent(JSON.stringify(data));
  });

  return jsonResponse({ status: 'success', results: results });
}

function handleSyncPull(storeId, lastSyncTime) {
  const folder = getMasterFolder();
  const diffs = {};

  ['clientes', 'produtos', 'vendas'].forEach(t => {
    const data = JSON.parse(getFile(folder, t + '.json').getBlob().getDataAsString());
    diffs[t] = lastSyncTime 
      ? data.filter(i => new Date(i._updated_at) > new Date(lastSyncTime))
      : data;
  });

  return jsonResponse({ status: 'success', timestamp: new Date().toISOString(), data: diffs });
}

// ============================================================================
// 7. UTILS
// ============================================================================

function getMasterFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.DRIVE.ROOT_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  throw new Error("Pasta não encontrada. Rode ?action=setup");
}

function getFile(folder, fileName) {
  const files = folder.getFilesByName(fileName);
  return files.hasNext() ? files.next() : folder.createFile(fileName, '[]');
}

function jsonResponse(data, code = 200) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
