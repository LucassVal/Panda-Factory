# 📈 PF_TRADING_REFERENCE - Trading Hub & cTrader

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-03
> **Cross-Ref:** [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) | [PF_PLUGIN_AND_MODULAR_REFERENCE.md](PF_PLUGIN_AND_MODULAR_REFERENCE.md)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [cTrader Open API](#2-ctrader-open-api)
3. [SDK Integration](#3-sdk-integration)
4. [AI Signals](#4-ai-signals)
5. [Contas & Credenciais](#5-contas--credenciais)

---

## 1. Visão Geral

O **Trading Hub** permite integração com plataformas de trading via SDK.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                       TRADING HUB                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PANDA SDK                  cTRADER               ANALYSIS          │
│  ┌──────────────┐         ┌──────────────┐      ┌──────────────┐   │
│  │ Panda.       │         │ Open API     │      │ Gemini       │   │
│  │ Trading      │◀───────▶│ WebSocket    │      │ Analysis     │   │
│  │              │  JSON   │ Port 5036    │      │              │   │
│  └──────────────┘         └──────────────┘      └──────────────┘   │
│                                  │                     │            │
│                                  ▼                     ▼            │
│                           ┌─────────────────────────────────┐      │
│                           │     AI SIGNALS (50 PC/sinal)    │      │
│                           └─────────────────────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. cTrader Open API

### 2.1 Endpoints WebSocket

| Ambiente | URL                         | Porta       |
| -------- | --------------------------- | ----------- |
| **Demo** | `wss://demo.ctraderapi.com` | 5036 (JSON) |
| **Live** | `wss://live.ctraderapi.com` | 5036 (JSON) |

> ⚠️ **Panda usa porta 5036 (JSON)** para simplicidade.

### 2.2 PayloadTypes Principais

| Código | Nome                                    | Descrição           |
| ------ | --------------------------------------- | ------------------- |
| 2100   | `ProtoOAApplicationAuthReq`             | Auth da app         |
| 2101   | `ProtoOAApplicationAuthRes`             | Resposta auth app   |
| 2102   | `ProtoOAAccountAuthReq`                 | Auth da conta       |
| 2103   | `ProtoOAAccountAuthRes`                 | Resposta auth conta |
| 2123   | `ProtoOASubscribeSpotsReq`              | Subscribe preços    |
| 2124   | `ProtoOASpotEvent`                      | Evento de preço     |
| 2126   | `ProtoOANewOrderReq`                    | Nova ordem          |
| 2127   | `ProtoOAExecutionEvent`                 | Evento execução     |
| 2128   | `ProtoOAClosePositionReq`               | Fechar posição      |
| 2149   | `ProtoOAGetAccountListByAccessTokenReq` | Listar contas       |

### 2.3 Fluxo de Autenticação

```text
1. App Auth (2100 → 2101)
   └── Client ID + Secret

2. List Accounts (2149 → 2150)
   └── Access Token

3. Account Auth (2102 → 2103)
   └── Account ID + Token
```

### 2.4 Order Types

| Tipo         | Descrição         |
| ------------ | ----------------- |
| `MARKET`     | Execução imediata |
| `LIMIT`      | Preço limite      |
| `STOP`       | Stop order        |
| `STOP_LIMIT` | Stop com limite   |

### 2.5 Volume

- Volume em **centavos**: 10000 = 0.01 lote
- 100000 = 0.1 lote
- 1000000 = 1.0 lote

---

## 3. SDK Integration

### 3.1 Namespace

```javascript
// Panda.Trading / Panda.CTrader
window.Panda.Trading = {
  CTrader: { ... }
};
```

### 3.2 API Principal

```javascript
// Configurar credenciais
Panda.Trading.CTrader.configure({
  clientId: process.env.CTRADER_CLIENT_ID,
  clientSecret: process.env.CTRADER_SECRET,
  accessToken: process.env.CTRADER_ACCESS_TOKEN,
});

// Conectar
await Panda.Trading.CTrader.connect({
  environment: "demo", // 'demo' | 'live'
  accountId: 45208457,
});

// Listar contas
const accounts = await Panda.Trading.CTrader.getAccounts();

// Subscribe a preços
await Panda.Trading.CTrader.subscribe(["EURUSD", "XAUUSD"]);

// Eventos de preço
Panda.Trading.CTrader.on("price", (data) => {
  console.log(`${data.symbol}: ${data.bid}/${data.ask}`);
});

// Nova ordem
const order = await Panda.Trading.CTrader.trade({
  symbol: "EURUSD",
  side: "BUY",
  volume: 10000, // 0.01 lot
  stopLoss: 1.08,
  takeProfit: 1.09,
  comment: "Panda Trade",
});

// Fechar posição
await Panda.Trading.CTrader.closePosition(positionId);

// Modificar SL/TP
await Panda.Trading.CTrader.modifyPosition(positionId, {
  stopLoss: 1.081,
  takeProfit: 1.092,
});
```

### 3.3 Eventos

| Evento          | Descrição            |
| --------------- | -------------------- |
| `connected`     | Conectado ao server  |
| `disconnected`  | Desconectado         |
| `authenticated` | Conta autenticada    |
| `price`         | Atualização de preço |
| `execution`     | Ordem executada      |
| `error`         | Erro de API          |

---

## 4. AI Signals

### 4.1 Custo

| Recurso           | Custo PC    |
| ----------------- | ----------- |
| AI Signal         | 50 PC/sinal |
| Market Analysis   | 30 PC       |
| Pattern Detection | 20 PC       |

### 4.2 API

```javascript
// Gerar sinal AI
const signal = await Panda.Trading.AISignals.generate({
  symbol: 'XAUUSD',
  timeframe: 'H1',
  analysisType: 'full'  // 'quick' | 'full' | 'deep'
});

// Resposta
{
  symbol: 'XAUUSD',
  direction: 'BUY',
  confidence: 0.78,
  entry: 2045.50,
  stopLoss: 2040.00,
  takeProfit: 2055.00,
  analysis: "Strong bullish momentum...",
  patterns: ['golden_cross', 'support_bounce'],
  timestamp: '2026-02-03T12:00:00Z'
}
```

### 4.3 Análise via Gemini

O AI Signals usa Gemini para análise:

```javascript
// GAS Backend
function generateTradeSignal(symbol, timeframe) {
  const marketData = fetchMarketData(symbol, timeframe);

  const prompt = `
    Analyze ${symbol} on ${timeframe}:
    - Current price: ${marketData.price}
    - Recent candles: ${JSON.stringify(marketData.candles)}
    - Indicators: RSI=${marketData.rsi}, MACD=${marketData.macd}
    
    Provide trading recommendation with entry, SL, TP.
  `;

  return callGemini(prompt);
}
```

---

## 5. Contas & Credenciais

### 5.1 App Antigravity

| Campo             | Valor                         |
| ----------------- | ----------------------------- |
| **App Name**      | Antigravity                   |
| **Client ID**     | `CTRADER_CLIENT_ID` (em .env) |
| **Client Secret** | `CTRADER_SECRET` (em .env)    |

### 5.2 Contas Disponíveis

| Account ID | Tipo | Status         |
| ---------- | ---- | -------------- |
| 45208457   | Demo | ✅ Testado     |
| 45208965   | Live | ⚠️ Não testado |
| 45208968   | Live | ⚠️ Não testado |

### 5.3 OAuth URLs

| Endpoint      | URL                                               |
| ------------- | ------------------------------------------------- |
| **Authorize** | `https://openapi.ctrader.com/apps/auth`           |
| **Token**     | `https://openapi.ctrader.com/apps/token`          |
| **Redirect**  | `https://lucassval.github.io/panda-ctrader-auth/` |

### 5.4 Token Refresh

```javascript
// Tokens expiram em 30 dias
// Refresh automático no GAS
function refreshCTraderToken() {
  const refreshToken = PropertiesService.getScriptProperties().getProperty(
    "CTRADER_REFRESH_TOKEN",
  );

  const response = UrlFetchApp.fetch("https://openapi.ctrader.com/apps/token", {
    method: "POST",
    payload: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CTRADER_CLIENT_ID,
      client_secret: CTRADER_SECRET,
    },
  });

  const data = JSON.parse(response);
  // Salvar novos tokens...
}
```

---

## 📎 Links Úteis

| Recurso               | URL                                             |
| --------------------- | ----------------------------------------------- |
| cTrader Open API Docs | https://help.ctrader.com/open-api/              |
| Messages Reference    | https://help.ctrader.com/open-api/messages/     |
| App Portal            | https://openapi.ctrader.com/apps/               |
| OAuth Redirect        | https://lucassval.github.io/panda-ctrader-auth/ |

---

> 📖 **Versão:** 1.0.0 | **Status:** Ativo
