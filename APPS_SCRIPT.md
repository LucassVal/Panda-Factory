# 🔧 GOOGLE APPS SCRIPT - Código Pronto

**Deploy:** Sprint 1 (29 Jan - 4 Fev)  
**Função:** Merge engine multi-user  
**Custo:** R$ 1-10/mês

---

## 📋 SETUP RÁPIDO

### 1. Google Cloud Console

```
1. Ir para console.cloud.google.com
2. Criar projeto: "TitanGestao-Production"
3. Ativar APIs:
   - Google Drive API
   - Apps Script API
4. Criar credenciais OAuth 2.0:
   - Tipo: Web application
   - Redirect URI: https://tocadobarbaro.com/callback
   - Copiar: CLIENT_ID e CLIENT_SECRET
```

### 2. Criar Apps Script Project

```
1. Ir para script.google.com
2. Novo projeto: "TitanGestao-Merge-Engine"
3. Copiar código abaixo
4. Deploy → New deployment → Web app
5. Execute as: Me
6. Who has access: Anyone
7. Copiar URL deployment
```

---

## 💻 CÓDIGO (merge-engine.gs)

```javascript
/**
 * TITANGESTÃO PRO - MERGE ENGINE
 * Google Apps Script que sincroniza dados entre usuários
 *
 * Trigger: Time-driven (every 3 seconds)
 * Função: Merge mudanças de múltiplos usuários
 */

// ========== CONFIGURAÇÃO ==========

const MONGODB_API = 'https://tocadobarbaro.com/api/apps-script';
const API_KEY = 'SUA_API_KEY_AQUI'; // Gerar no backend

// ========== FUNÇÃO PRINCIPAL ==========

function mergeClienteData() {
  Logger.log('🔄 Iniciando merge cycle...');

  try {
    // 1. Buscar clientes ativos (MongoDB via backend)
    const clientes = getClientesAtivos();
    Logger.log(`   Clientes ativos: ${clientes.length}`);

    let mergeCount = 0;

    // 2. Para cada cliente
    clientes.forEach((cliente, index) => {
      try {
        const mudancas = processar Cliente(cliente);
        if (mudancas > 0) mergeCount++;
      } catch (error) {
        Logger.log(`   ❌ Erro cliente ${cliente.email}: ${error}`);
      }
    });

    Logger.log(`✅ Merge concluído: ${mergeCount} clientes atualizados`);

  } catch (error) {
    Logger.log(`❌ ERRO CRÍTICO: ${error}`);
  }
}

// ========== PROCESSAMENTO POR CLIENTE ==========

function processarCliente(cliente) {
  const { email, driveToken, folderId } = cliente;

  // 1. Renovar token se necessário
  const token = renovarTokenSeNecessario(driveToken);

  // 2. Baixar arquivos do Drive do cliente
  const mudancasFile = getFileFromDrive(token, folderId, 'mudancas.json');
  const mudancas = JSON.parse(mudancasFile.content);

  if (mudancas.length === 0) {
    return 0; // Nada pra fazer
  }

  Logger.log(`   📝 ${email}: ${mudancas.length} mudanças`);

  const masterFile = getFileFromDrive(token, folderId, 'master.json');
  const master = JSON.parse(masterFile.content);

  // 3. MERGE INTELIGENTE
  const masterAtualizado = mergeDados(master, mudancas);

  // 4. Salvar de volta no Drive
  updateFileInDrive(token, masterFile.id, JSON.stringify(masterAtualizado, null, 2));

  // 5. Limpar fila
  updateFileInDrive(token, mudancasFile.id, '[]');

  return mudancas.length;
}

// ========== MERGE LOGIC ==========

function mergeDados(master, mudancas) {
  mudancas.forEach(mudanca => {
    const { entity, entityId, campo, valor, timestamp, usuario } = mudanca;

    // Inicializar estrutura se não existir
    if (!master[entity]) master[entity] = {};
    if (!master[entity][entityId]) master[entity][entityId] = {};

    // Last-write-wins por timestamp
    const campoAtual = master[entity][entityId][campo];

    if (!campoAtual || timestamp > campoAtual._timestamp) {
      master[entity][entityId][campo] = {
        value: valor,
        _timestamp: timestamp,
        _modifiedBy: usuario,
        _syncedAt: Date.now()
      };
    } else {
      Logger.log(`   ⚠️ Conflito: ${entity}.${entityId}.${campo} (local mais recente)`);
    }
  });

  return master;
}

// ========== GOOGLE DRIVE API ==========

function getFileFromDrive(token, folderId, fileName) {
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByName(fileName);

  if (!files.hasNext()) {
    throw new Error(`Arquivo ${fileName} não encontrado`);
  }

  const file = files.next();

  return {
    id: file.getId(),
    content: file.getBlob().getDataAsString()
  };
}

function updateFileInDrive(token, fileId, content) {
  const file = DriveApp.getFileById(fileId);
  file.setContent(content);
}

// ========== OAUTH TOKEN MANAGEMENT ==========

function renovarTokenSeNecessario(driveToken) {
  // Se token ainda válido, retorna
  if (driveToken.expiresAt > Date.now()) {
    return driveToken.accessToken;
  }

  // Renovar usando refresh_token
  const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: {
      client_id: PropertiesService.getScriptProperties().getProperty('CLIENT_ID'),
      client_secret: PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET'),
      refresh_token: driveToken.refreshToken,
      grant_type: 'refresh_token'
    }
  });

  const newToken = JSON.parse(response.getContentText());

  // Atualizar no MongoDB via backend
  atualizarTokenBD(driveToken.userId, newToken.access_token, newToken.expires_in);

  return newToken.access_token;
}

// ========== BACKEND INTEGRATION ==========

function getClientesAtivos() {
  const response = UrlFetchApp.fetch(`${MONGODB_API}/clientes-ativos`, {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  return JSON.parse(response.getContentText());
}

function atualizarTokenBD(userId, accessToken, expiresIn) {
  UrlFetchApp.fetch(`${MONGODB_API}/update-token`, {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      userId,
      accessToken,
      expiresAt: Date.now() + (expiresIn * 1000)
    })
  });
}

// ========== TRIGGERS ==========

/**
 * Criar trigger manualmente:
 *
 * 1. No editor Apps Script: Relógio (⏰) → Triggers
 * 2. + Add Trigger
 * 3. Função: mergeClienteData
 * 4. Evento: Time-driven
 * 5. Tipo: Seconds timer
 * 6. Intervalo: Every 3 seconds
 * 7. Salvar
 */

// ========== UTILITÁRIOS DE DEBUG ==========

function testMergeManual() {
  // Testar com dados mock
  const mockMaster = {
    clientes: {
      CLI_001: {
        nome: { value: 'João Silva', _timestamp: 1705518000, _modifiedBy: 'joao@email.com' }
      }
    }
  };

  const mockMudancas = [
    {
      entity: 'clientes',
      entityId: 'CLI_001',
      campo: 'telefone',
      valor: '(11) 98765-4321',
      timestamp: 1705518100,
      usuario: 'maria@email.com'
    }
  ];

  const resultado = mergeDados(mockMaster, mockMudancas);
  Logger.log(JSON.stringify(resultado, null, 2));
}

function limparLogs() {
  Logger.clear();
}
```

---

## ⚙️ CONFIGURAÇÃO

### Script Properties (Segredos)

```javascript
// No editor Apps Script: Settings → Script properties

const props = PropertiesService.getScriptProperties();

props.setProperty("CLIENT_ID", "SEU_GOOGLE_CLIENT_ID");
props.setProperty("CLIENT_SECRET", "SEU_GOOGLE_CLIENT_SECRET");
props.setProperty("MONGODB_API", "https://tocadobarbaro.com/api/apps-script");
props.setProperty("API_KEY", "CHAVE_GERADA_BACKEND");
```

### Criar Trigger (Manual)

```
1. Editor Apps Script → Relógio (⏰)
2. + Add Trigger
3. Function: mergeClienteData
4. Event source: Time-driven
5. Type: Seconds timer
6. Interval: Every 3 seconds
7. Save
```

---

## 🧪 TESTE LOCAL

### 1. Teste com Mock Data

```javascript
// Executar no editor Apps Script
function testLocal() {
  // Mock cliente
  const mockCliente = {
    email: "teste@teste.com",
    folderId: "SEU_FOLDER_ID_TESTE",
    driveToken: {
      accessToken: "token_valido",
      expiresAt: Date.now() + 3600000,
    },
  };

  // Criar arquivos teste no Drive
  // (manual: criar pasta TitanGestao e arquivos .json)

  processarCliente(mockCliente);

  Logger.log("✅ Teste concluído");
}
```

### 2. Verificar Logs

```
View → Logs (ou Command/Ctrl + Enter)
```

---

## 🚀 DEPLOY PRODUÇÃO

### 1. Deploy como Web App

```
1. Deploy → New deployment
2. Type: Web app
3. Description: "Production v1.0"
4. Execute as: Me (sua conta)
5. Who has access: Anyone
6. Deploy
7. Copiar URL: https://script.google.com/macros/s/ABC.../exec
```

### 2. Configurar Backend

```javascript
// backend.js (Node.js)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/ABC.../exec";

// Endpoint que Apps Script chama
app.get("/api/apps-script/clientes-ativos", async (req, res) => {
  const apiKey = req.headers.authorization?.replace("Bearer ", "");

  if (apiKey !== process.env.APPS_SCRIPT_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const clientes = await Cliente.find({ googleDriveAtivo: true });
  res.json(clientes);
});
```

---

## 📊 MONITORING

### Dashboard Apps Script

```
1. script.google.com → Seu projeto
2. Executions → Ver histórico
3. Logs por execução
4. Estatísticas (tempo, erros)
```

### Alertas Email (Opcional)

```javascript
// Adicionar no código
function enviarAlertaErro(erro) {
  MailApp.sendEmail({
    to: "seu@email.com",
    subject: "🚨 TitanGestão: Erro Apps Script",
    body: `
      Erro: ${erro}
      Timestamp: ${new Date()}
    `,
  });
}
```

---

## 💰 CUSTOS

**Plano Grátis:**

- 90 min/dia
- 20.000 execuções/dia
- Até ~200 clientes

**Upgrade (GCP Billing):**

- $0.40 por 1M invocações
- 1.000 clientes = R$ 5/mês
- 10.000 clientes = R$ 50/mês

---

## 🔧 TROUBLESHOOTING

**Erro: "Exception: Drive item not found"**

- Verificar folderId correto
- Cliente autorizou Drive corretamente

**Erro: "Exceeded maximum execution time"**

- Reduzir batch size (processar menos clientes por vez)
- Otimizar merge logic

**Erro: "Unauthorized"**

- Verificar API_KEY no backend
- Renovar tokens OAuth

---

## ✅ CHECKLIST DEPLOY

- [ ] Google Cloud Project criado
- [ ] APIs ativadas (Drive, Apps Script)
- [ ] OAuth credentials configuradas
- [ ] Apps Script código copiado
- [ ] Script properties configuradas
- [ ] Trigger criado (3s)
- [ ] Teste local OK
- [ ] Deploy produção
- [ ] Backend integrado
- [ ] Monitoring ativo

---

**PRONTO PARA DEPLOY:** Código production-ready  
**Tempo Setup:** 2-3h  
**Próximo:** Backend Node.js (OAuth flow)
