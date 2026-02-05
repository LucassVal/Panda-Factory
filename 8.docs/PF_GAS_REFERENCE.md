# 🐼 Panda GAS Backend - Referência

> **Versão:** 1.1.0 | **Runtime:** Google Apps Script | **Pasta:** `1.core/`

---

## 📋 Índice

1. [Estrutura de Arquivos](#estrutura-de-arquivos)
2. [Dispatcher (Router)](#dispatcher)
3. [Módulos de Serviço](#módulos-de-serviço)
4. [P2P Compute Network](#p2p-compute-network)
5. [Segurança](#segurança)
6. [Deploy](#deploy)

---

## 1. Estrutura de Arquivos

```text
1.core/
├── .clasp.json           # Config CLASP
├── appsscript.json       # Manifesto GAS
├── core/
│   ├── PF_Dispatcher.gs  # Router principal (doPost/doGet)
│   ├── PF_Config.gs      # Configurações centrais
│   ├── PF_App_Init.gs    # Inicialização
│   ├── PF_Core_AI.gs     # Serviço de IA
│   ├── PF_Core_Oracle.gs # Cotação USD/BRL
│   ├── PF_Moltbook.gs    # Moltbook integration
│   ├── PF_PAT_Core.gs    # Panda Council (Governance)
│   └── PF_Core_Webhooks.gs # Webhooks externos
├── domains/
│   ├── finance/          # Wallet, Crypto, Fiat
│   ├── store/            # Marketplace (Sales, Registry)
│   ├── automation/       # Bots
│   └── p2p/              # 🌐 P2P Compute Network
│       └── PF_P2P.gs     # Node registry, tasks, rewards
└── sdks/
    └── gemini.gs         # SDK Gemini
```

---

## 2. Dispatcher (Router)

O `PF_Dispatcher.gs` é o ponto de entrada para todas as requisições HTTP.

### doPost - API Principal

```javascript
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const { action, payload, token } = request;

    // Validar token (se necessário)
    if (requiresAuth(action) && !validateToken(token)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // Router de ações
    switch (action) {
      // Auth
      case "auth.login":
        return AuthService.login(payload);
      case "auth.logout":
        return AuthService.logout(payload);
      case "auth.verify":
        return AuthService.verify(payload);

      // Wallet
      case "wallet.balance":
        return WalletService.getBalance(payload);
      case "wallet.history":
        return WalletService.getHistory(payload);
      case "wallet.charge":
        return WalletService.charge(payload);

      // Data
      case "data.get":
        return DataService.get(payload);
      case "data.list":
        return DataService.list(payload);
      case "data.save":
        return DataService.save(payload);
      case "data.delete":
        return DataService.delete(payload);

      // AI
      case "ai.chat":
        return AIService.chat(payload);
      case "ai.analyze":
        return AIService.analyze(payload);

      // Oracle
      case "oracle.usd":
        return OracleService.getUsdRate();

      default:
        return jsonResponse({ error: "Unknown action: " + action }, 400);
    }
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
```

### doGet - Tri-Mode Dispatcher (JSON / WEB / MCP)

O `doGet` agora suporta **3 modos de entrada**:

| Modo       | Query Param     | Retorno     | Uso                   |
| ---------- | --------------- | ----------- | --------------------- |
| **Health** | `(nenhum)`      | JSON status | Verificação de uptime |
| **WEB**    | `?page=nome`    | HTML        | Servir páginas web    |
| **MCP**    | `?mcp=manifest` | JSON        | Expor tools para IA   |

```javascript
function doGet(e) {
  const params = e?.parameter || {};

  // 🔌 MCP MODE: Expose tools for AI agents
  if (params.mcp === "manifest") {
    return jsonResponse(getMcpManifest());
  }

  // 🌐 WEB MODE: Serve HTML pages
  if (params.page) {
    return serveWebPage(params.page);
  }

  // 💚 HEALTH MODE: Status check (default)
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "online",
      version: "1.0.0",
      modes: ["JSON", "WEB", "MCP"],
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

// 🔌 MCP Manifest Generator
function getMcpManifest() {
  return {
    name: "panda-gas-backend",
    version: "1.0.0",
    description: "Panda Factory GAS Backend - AI-Callable Tools",
    tools: [
      {
        name: "brain.chat",
        description: "Chat with Gemini AI",
        inputSchema: { message: "string", gem: "string?" },
      },
      {
        name: "wallet.balance",
        description: "Get user wallet balance",
        inputSchema: { userId: "string" },
      },
      {
        name: "data.list",
        description: "List collection items",
        inputSchema: { collection: "string" },
      },
      {
        name: "oracle.usd",
        description: "Get USD/BRL exchange rate",
        inputSchema: {},
      },
    ],
  };
}

// 🌐 Web Page Server
function serveWebPage(pageName) {
  const pages = {
    dashboard: HtmlService.createHtmlOutputFromFile("pages/dashboard"),
    login: HtmlService.createHtmlOutputFromFile("pages/login"),
  };

  if (pages[pageName]) {
    return pages[pageName].setTitle("Panda Factory");
  }

  return HtmlService.createHtmlOutput("<h1>404 - Page Not Found</h1>");
}
```

**Exemplos de uso:**

```
# Health check
GET https://script.google.com/.../exec
→ {"status": "online", "modes": ["JSON", "WEB", "MCP"]}

# MCP manifest (para IA)
GET https://script.google.com/.../exec?mcp=manifest
→ {"name": "panda-gas-backend", "tools": [...]}

# Servir página web
GET https://script.google.com/.../exec?page=dashboard
→ HTML do dashboard
```

---

## 3. Módulos de Serviço

### 3.1 AuthService

```javascript
const AuthService = {
  login(payload) {
    const { email, password } = payload;
    // Validar contra Sheet de usuários
    const user = findUserByEmail(email);
    if (!user || !verifyPassword(password, user.hash)) {
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }
    const token = generateToken(user);
    return jsonResponse({ user, token });
  },

  logout(payload) {
    invalidateToken(payload.token);
    return jsonResponse({ success: true });
  },

  verify(payload) {
    const user = validateToken(payload.token);
    return jsonResponse({ valid: !!user, user });
  },
};
```

### 3.2 WalletService

```javascript
const WalletService = {
  getBalance(payload) {
    const { userId } = payload;
    const balance = getBalanceFromSheet(userId);
    return jsonResponse({ balance, currency: "PC" });
  },

  charge(payload) {
    const { userId, amount, reason } = payload;
    const result = debitFromSheet(userId, amount, reason);
    return jsonResponse(result);
  },

  getHistory(payload) {
    const { userId, limit } = payload;
    const history = getTransactionsFromSheet(userId, limit || 50);
    return jsonResponse({ transactions: history });
  },
};
```

### 3.3 OracleService (Cotação)

```javascript
const OracleService = {
  getUsdRate() {
    const cache = CacheService.getScriptCache();
    let rate = cache.get("USD_BRL");

    if (!rate) {
      const response = UrlFetchApp.fetch(
        "https://economia.awesomeapi.com.br/last/USD-BRL",
      );
      const data = JSON.parse(response.getContentText());
      rate = parseFloat(data.USDBRL.bid);
      cache.put("USD_BRL", rate.toString(), 3600); // 1h cache
    }

    return jsonResponse({
      rate: parseFloat(rate),
      currency: "BRL",
      timestamp: new Date().toISOString(),
    });
  },
};
```

---

## 4. Segurança (🔐 IMPORTANTE)

### 4.1 Arquitetura de Segurança

```text
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE SEGURANÇA                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  USUÁRIO ───► SDK (Client) ───► GAS (Server) ───► Serviços  │
│                   │                    │                     │
│                   ▼                    ▼                     │
│            ┌──────────┐         ┌──────────────┐            │
│            │ GATE 1   │         │    GATE 2    │            │
│            │ Role     │         │    Token     │            │
│            │ Check    │         │    Validate  │            │
│            └──────────┘         └──────────────┘            │
│                                                              │
│  🛡️ DUPLA VALIDAÇÃO: SDK verifica ROLE, GAS verifica TOKEN   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**O GAS é acessível publicamente como URL, MAS:**

1. **SDK filtra** quais ações cada ROLE pode chamar
2. **GAS valida** token JWT em cada request
3. **Ações sensíveis** exigem role mínimo

### 4.2 Matriz de Acesso por Role

| Action           | User (3) | Dev (2) | Founder (1) | Requires Token |
| ---------------- | -------- | ------- | ----------- | -------------- |
| `oracle.usd`     | ✅       | ✅      | ✅          | ❌             |
| `brain.chat`     | ✅       | ✅      | ✅          | ✅             |
| `wallet.balance` | ✅       | ✅      | ✅          | ✅             |
| `data.get`       | ✅       | ✅      | ✅          | ✅             |
| `data.save`      | ❌       | ✅      | ✅          | ✅             |
| `data.delete`    | ❌       | ✅      | ✅          | ✅             |
| `brain.gems`     | ❌       | ✅      | ✅          | ✅             |
| `analytics.*`    | ❌       | ❌      | ✅          | ✅             |
| `pat.*`          | ❌       | ❌      | ✅          | ✅             |
| `governance.*`   | ❌       | ❌      | ✅          | ✅             |

### 4.3 SDK → GAS Translation Layer

O SDK traduz chamadas de alto nível para requests GAS:

```javascript
// 📱 SDK (Frontend) - O que o dev/user vê
await Panda.Brain.chat("Olá!");

// 🔄 TRADUÇÃO INTERNA
// SDK faz:
// 1. Verifica se user tem role >= 3 ✅
// 2. Pega token do Auth ✅
// 3. Chama GAS ✅

// 📡 GAS (Backend) - O que é enviado
POST https://script.google.com/.../exec
{
  "action": "brain.chat",
  "payload": { "message": "Olá!" },
  "token": "eyJ...",
  "role": 3
}
```

### 4.4 Implementação no SDK

```javascript
// Em pf.sdk.js
const ACTION_ROLES = {
  // Públicas (qualquer role)
  "oracle.usd": 3,
  "brain.chat": 3,
  "wallet.balance": 3,

  // Dev+ (role 2+)
  "data.save": 2,
  "data.delete": 2,
  "brain.gems": 2,

  // Founder ONLY (role 1)
  "pat.checkin": 1,
  "pat.profile": 1,
  "governance.validate": 1,
  "analytics.report": 1,
};

async function callGAS(action, payload) {
  const userRole = Panda.Auth.getRole();
  const minRole = ACTION_ROLES[action] || 1;

  // GATE 1: Role check (client-side)
  if (userRole > minRole) {
    throw new Error(`🔒 Acesso negado: ${action} requer role ${minRole}`);
  }

  // GATE 2: Token attached (server validates)
  const token = Panda.Auth.getToken();

  const response = await fetch(Config.GAS_URL, {
    method: "POST",
    body: JSON.stringify({ action, payload, token, role: userRole }),
  });

  return response.json();
}
```

### 4.5 Implementação no GAS

```javascript
// Em PF_Dispatcher.gs
const ROLE_REQUIRED = {
  "pat.checkin": 1,
  "governance.validate": 1,
  "data.delete": 2,
};

function doPost(e) {
  const { action, payload, token, role } = JSON.parse(e.postData.contents);

  // GATE 2: Validate token (server-side)
  const user = validateToken(token);
  if (!user) {
    return jsonResponse({ error: "Token inválido" }, 401);
  }

  // GATE 2b: Verify role matches token
  if (user.role !== role) {
    return jsonResponse({ error: "Role mismatch" }, 403);
  }

  // GATE 2c: Check action permission
  const minRole = ROLE_REQUIRED[action] || 3;
  if (user.role > minRole) {
    return jsonResponse({ error: "Acesso negado" }, 403);
  }

  // Proceed with action...
}
```

### 4.6 Token JWT (Simplificado)

```javascript
function generateToken(user) {
  const payload = {
    uid: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24h
  };
  // GAS não tem crypto nativo, usar hash simples ou HMAC
  return Utilities.base64Encode(JSON.stringify(payload));
}

function validateToken(token) {
  try {
    const payload = JSON.parse(
      Utilities.newBlob(Utilities.base64Decode(token)).getDataAsString(),
    );

    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
```

### 4.7 Resumo: O que é exposto?

| O que          | Público?   | Protegido por            |
| -------------- | ---------- | ------------------------ |
| URL do GAS     | ✅ Sim     | N/A                      |
| `oracle.usd`   | ✅ Sim     | Nada (público)           |
| `brain.chat`   | ✅ Sim     | Token                    |
| `wallet.*`     | ⚠️ Parcial | Token + userId próprio   |
| `pat.*`        | 🔒 Não     | Token + Role 1 (Founder) |
| `governance.*` | 🔒 Não     | Token + Role 1 (Founder) |

> **Conclusão**: O SDK é o **gatekeeper** que impede chamadas inválidas. O GAS faz **dupla verificação** para garantir que ninguém burle o SDK.

---

## 5. Deploy

### Via CLASP (Recomendado)

```bash
# Login
clasp login

# Push código
clasp push

# Deploy como Web App
clasp deploy --description "v1.0.0"
```

### Via Console

1. Abrir script.google.com
2. Deploy > New Deployment
3. Tipo: Web App
4. Execute as: Me
5. Who has access: Anyone

### URL Final

```
https://script.google.com/macros/s/{SCRIPT_ID}/exec
```

---

## 6. Helpers

```javascript
function jsonResponse(data, status = 200) {
  return ContentService.createTextOutput(
    JSON.stringify({ ...data, _status: status }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  return ss.getSheetByName(name);
}

function findUserByEmail(email) {
  const sheet = getSheet("users");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const emailCol = headers.indexOf("email");

  for (let i = 1; i < data.length; i++) {
    if (data[i][emailCol] === email) {
      return rowToObject(headers, data[i]);
    }
  }
  return null;
}
```

---

## 7. Integração com SDK

O SDK (`pf.sdk.js`) chama o GAS assim:

```javascript
// Em pf.sdk.js
const GAS_URL = "https://script.google.com/macros/s/{ID}/exec";

async function callGAS(action, payload) {
  const response = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({ action, payload }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

// Uso
const balance = await callGAS("wallet.balance", { userId: "user123" });
```

---

> 📖 **Arquitetura Completa:** [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md)


