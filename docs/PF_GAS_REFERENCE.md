# 🐼 Panda GAS Backend - Referência

> **Versão:** 1.0.0 | **Runtime:** Google Apps Script | **Pasta:** `backend/`

---

## 📋 Índice

1. [Estrutura de Arquivos](#estrutura-de-arquivos)
2. [Dispatcher (Router)](#dispatcher)
3. [Módulos de Serviço](#módulos-de-serviço)
4. [Segurança](#segurança)
5. [Deploy](#deploy)

---

## 1. Estrutura de Arquivos

```text
backend/
├── .clasp.json           # Config CLASP
├── appsscript.json       # Manifesto GAS
├── core/
│   ├── PF_Dispatcher.gs  # Router principal (doPost/doGet)
│   ├── PF_Config.gs      # Configurações centrais
│   ├── PF_App_Init.gs    # Inicialização
│   ├── PF_Core_AI.gs     # Serviço de IA
│   ├── PF_Core_Oracle.gs # Cotação USD/BRL
│   └── PF_Core_Webhooks.gs # Webhooks externos
├── domains/
│   ├── auth/             # Autenticação
│   ├── wallet/           # Carteira Panda Coin
│   ├── data/             # CRUD dados
│   └── store/            # Marketplace
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

### doGet - Health Check

```javascript
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "online",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}
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

## 4. Segurança

### Token JWT (Simplificado)

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

### Ações que Requerem Auth

```javascript
const AUTH_REQUIRED = [
  "wallet.balance",
  "wallet.charge",
  "data.save",
  "data.delete",
];

function requiresAuth(action) {
  return AUTH_REQUIRED.includes(action);
}
```

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
