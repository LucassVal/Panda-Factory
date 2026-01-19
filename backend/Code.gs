/**
 * 🚀 TITANGESTÃO PRO - BACKEND SERVER (v1.0)
 * 
 * Responsabilidade: Sincronização, Autenticação e Shadow Database
 * Deploy: Publicar como Web App (Executar como: Eu / Acesso: Qualquer um)
 */

// ============================================================================
// 1. CONFIG & CONSTANTES
// ============================================================================
const CONFIG = {
  APP_NAME: 'TitanGestao_Backend',
  VERSION: '1.0.0',
  LOCK_TIMEOUT: 10000, // 10s para evitar deadlocks
  MASTER_FOLDER_NAME: 'TitanGestao_Data_v1' // Pasta no Drive do Cliente
};

// ============================================================================
// 2. ENTRY POINTS (API)
// ============================================================================

/**
 * GET: Keep-Alive e Verificação de Status
 */
function doGet(e) {
  // Fallback para Debug no Editor (Simula e)
  if (!e) e = { parameter: { action: 'ping' } };
  
  const action = e.parameter.action || 'ping';

  // 1. Keep-Alive (Simples e Rápido)
  if (action === 'ping') {
    return ContentService.createTextOutput('pong');
  }

  // 2. Setup Inicial (Cria pasta no Drive)
  if (action === 'setup') {
    return handleSetup(e);
  }

  return responseJSON({ error: 'Ação inválida' }, 400);
}

/**
 * POST: Sincronização e Operações de Escrita
 * Payload: JSON { action, storeId, data, ... }
 */
function doPost(e) {
  // Fallback para Debug no Editor
  if (!e) return responseJSON({ error: 'Execução direta no editor não suportada para POST sem payload.' });

  // Lock Global para evitar Race Conditions (Edição simultânea)
  const lock = LockService.getScriptLock();
  
  try {
    // Tenta obter lock por 10s
    if (!lock.tryLock(CONFIG.LOCK_TIMEOUT)) {
      return responseJSON({ error: 'Servidor ocupado. Tente novamente.' }, 503);
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const storeId = payload.storeId || '1'; // Default v1.0

    // Roteador de Ações
    switch (action) {
      case 'SYNC_PULL': // Cliente pede dados novos
        return handleSyncPull(storeId, payload.lastSyncTime);
        
      case 'SYNC_PUSH': // Cliente envia mudanças
        return handleSyncPush(storeId, payload.changes);
        
      case 'WAKE_UP':
        return responseJSON({ status: 'awake', timestamp: Date.now() });

      case 'WHATSAPP_HOOK': // Webhook do WhatsApp
        return handleWhatsAppWebhook(payload);

      default:
        // Verifica se é webhook direto (sem action no body, mas query param?)
        if (e.parameter.source === 'whatsapp') {
             return handleWhatsAppWebhook(JSON.parse(e.postData.contents));
        }
        return responseJSON({ error: 'Ação desconhecida' }, 400);
    }

  } catch (error) {
    Logger.log("ERRO CRÍTICO: " + error.toString());
    return responseJSON({ error: error.toString() }, 500);
  } finally {
    lock.releaseLock(); // Sempre solta o lock
  }
}

// ============================================================================
// 3. CORE LOGIC (HANDLERS)
// ============================================================================

function handleSetup(e) {
  try {
    // Verifica/Cria pasta no Drive
    const folders = DriveApp.getFoldersByName(CONFIG.MASTER_FOLDER_NAME);
    let folder;
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(CONFIG.MASTER_FOLDER_NAME);
    }

    // Cria arquivos vazios se não existirem
    const files = ['clientes.json', 'produtos.json', 'vendas.json', 'sys_logs.json'];
    files.forEach(fileName => {
      const f = folder.getFilesByName(fileName);
      if (!f.hasNext()) {
        folder.createFile(fileName, '[]', MimeType.PLAIN_TEXT);
      }
    });

    return responseJSON({ 
      status: 'success', 
      folderId: folder.getId(),
      message: 'Ambiente configurado com sucesso!'
    });

  } catch (err) {
    return responseJSON({ error: 'Erro no Setup: ' + err.toString() }, 500);
  }
}

function handleSyncPush(storeId, changes) {
  // changes = [{ table: 'clientes', data: {...}, operation: 'SAVE/DELETE' }]
  if (!changes || changes.length === 0) return responseJSON({ status: 'no_changes' });

  const folder = getMasterFolder();
  const results = [];

  // Agrupar mudanças por tabela para minimizar I/O
  const changesByTable = {};
  
  changes.forEach(change => {
    if (!changesByTable[change.table]) changesByTable[change.table] = [];
    changesByTable[change.table].push(change);
  });

  // Processar cada tabela
  Object.keys(changesByTable).forEach(tableName => {
    const file = getFile(folder, tableName + '.json');
    let dbData = JSON.parse(file.getBlob().getDataAsString());
    
    changesByTable[tableName].forEach(change => {
      const item = change.data;
      
      // IDEMPOTÊNCIA E AUDITORIA
      item._synced_at = new Date().toISOString();
      
      // Merge: Remove anterior se existir e adiciona novo
      dbData = dbData.filter(d => d.id !== item.id);
      dbData.push(item);
      
      results.push({ id: item.id, status: 'synced' });
    });

    // Salva arquivo atualizado
    file.setContent(JSON.stringify(dbData));
  });

  return responseJSON({ status: 'success', results: results });
}

function handleSyncPull(storeId, lastSyncTime) {
  const folder = getMasterFolder();
  const tables = ['clientes', 'produtos', 'vendas'];
  const diffs = {};

  tables.forEach(tableName => {
    const file = getFile(folder, tableName + '.json');
    const dbData = JSON.parse(file.getBlob().getDataAsString());
    
    // Filtra apenas o que mudou desde a última sync
    // (Em v1.0 podemos retornar tudo se for pequeno, mas vamos filtrar por _updated_at)
    if (lastSyncTime) {
      const lastSyncDate = new Date(lastSyncTime);
      diffs[tableName] = dbData.filter(item => {
        return new Date(item._updated_at) > lastSyncDate;
      });
    } else {
      diffs[tableName] = dbData; // Tudo (primeira sync)
    }
  });

  return responseJSON({ 
    status: 'success', 
    timestamp: new Date().toISOString(),
    data: diffs 
  });
}

// ============================================================================
// 4. UTILS
// ============================================================================

function getMasterFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.MASTER_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  throw new Error("Pasta Master não encontrada. Rode ?action=setup primeiro.");
}

function getFile(folder, fileName) {
  const files = folder.getFilesByName(fileName);
  if (files.hasNext()) return files.next();
  // Se não existir, cria vazio na hora (auto-healing)
  return folder.createFile(fileName, '[]', MimeType.PLAIN_TEXT);
}

function responseJSON(data, code = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 5. INTEGRAÇÕES (IMPLEMENTAÇÃO FUTURA - PLACEHOLDERS)
// ============================================================================

// ============================================================================
// 5. INTEGRAÇÕES (IMPLEMENTAÇÃO v1.5 - v2.0)
// ============================================================================

/**
 * TRIGGER: Executar a cada 5 min (Configurar no Apps Script)
 * Polling de Marketplaces (iFood, 99Food)
 */
function triggerMarketplacePolling() {
  const log = { action: 'MARKETPLACE_POLLING', status: 'start', timestamp: new Date().toISOString() };
  
  try {
    // 1. iFood Polling
    const ifoodOrders = fetchIFOODOrders();
    if (ifoodOrders.length > 0) {
      processNewOrders(ifoodOrders, 'iFood');
    }

    // 2. 99Food Polling
    const nineNineOrders = fetch99Orders();
    if (nineNineOrders.length > 0) {
      processNewOrders(nineNineOrders, '99Food');
    }

  } catch (e) {
    Logger.log("Erro Polling: " + e.toString());
  }
}

/**
 * WEBHOOK: WhatsApp (Evolution API / Meta)
 * Chamado via doPost com ?source=whatsapp
 */
function handleWhatsAppWebhook(payload) {
  // Padronizar payload (Adapter Evolution API)
  const message = {
    id: payload.data?.key?.id || Date.now().toString(),
    from: payload.data?.key?.remoteJid?.replace(/\D/g, '') || '',
    text: payload.data?.message?.conversation || payload.data?.message?.extendedTextMessage?.text || '',
    timestamp: new Date().toISOString()
  };

  if (!message.from || !message.text) return responseJSON({ error: 'Invalid Payload' });

  // 1. Salvar na caixa de entrada (inbox.json)
  // 2. Notificar frontend (via flag ou websocket futuro)
  saveToInbox(message);

  return responseJSON({ status: 'recebido' });
}

/**
 * PROCESSADOR: Fila Fiscal (Emitir NFe)
 * Trigger: A cada 10 min ou após venda
 */
function processarFilaFiscal() {
  const folder = getMasterFolder();
  const file = getFile(folder, 'vendas.json');
  const vendas = JSON.parse(file.getBlob().getDataAsString());

  // Filtrar vendas pendentes de nota
  const pendentes = vendas.filter(v => 
    v.status === 'fechado' && 
    v._metadata_fiscal && 
    v._metadata_fiscal.status === 'pendente'
  );

  pendentes.forEach(venda => {
    try {
      // Exemplo: Chamar API FocusNFe
      // const nfe = emitirNotaFiscal(venda);
      // venda._metadata_fiscal.status = 'emitida';
      // venda._metadata_fiscal.uuid_nfe = nfe.uuid;
    } catch (e) {
      venda._metadata_fiscal.status = 'erro';
      venda._metadata_fiscal.erro_log = e.toString();
    }
  });

  // Salvar atualizações
  if (pendentes.length > 0) {
    file.setContent(JSON.stringify(vendas));
  }
}


// --- HELPERS DE INTEGRAÇÃO ---

function fetchIFOODOrders() {
  // Mock ou implementação real com UrlFetchApp
  // Necessita token OAuth do iFood Merchant API
  return []; 
}

function fetch99Orders() {
  // Mock para 99Food
  return [];
}

function processNewOrders(orders, source) {
  const folder = getMasterFolder();
  const file = getFile(folder, 'vendas.json');
  let vendas = JSON.parse(file.getBlob().getDataAsString());
  
  orders.forEach(order => {
    // Evitar duplicidade
    if(vendas.some(v => v.id_externo === order.id)) return;
    
    // Converter para Schema Interno
    const novaVenda = {
      id: source + '_' + order.id,
      id_externo: order.id,
      data: new Date().toISOString(),
      cliente: { nome: order.customer.name, telefone: order.customer.phone },
      items: order.items,
      total: order.total,
      origem: source,
      _id_loja: '1',
      _ativo: true
    };
    
    vendas.push(novaVenda);
  });
  
  file.setContent(JSON.stringify(vendas));
}

function saveToInbox(msg) {
  const folder = getMasterFolder();
  const file = getFile(folder, 'whatsapp_inbox.json'); // Arquivo novo
  let msgs = JSON.parse(file.getBlob().getDataAsString());
  
  msgs.push(msg);
  file.setContent(JSON.stringify(msgs));
}
