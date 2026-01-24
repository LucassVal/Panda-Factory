# 🐼 cTrader Open API Reference

> **Versão:** 1.0.0 | **Fonte:** [cTrader Open API Docs](https://help.ctrader.com/open-api/)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Conexão](#2-conexão)
3. [Autenticação](#3-autenticação)
4. [Mensagens](#4-mensagens)
5. [Market Data](#5-market-data)
6. [Trading](#6-trading)
7. [Integração Panda](#7-integração-panda)

---

## 1. Visão Geral

cTrader Open API permite criar aplicações que enviam/recebem dados do backend cTrader.

### Casos de Uso

- Trading app customizado
- Bot Telegram/Discord
- App mobile com AI
- Integração com Panda Factory

### Formato de Dados

| Porta    | Formato          |
| -------- | ---------------- |
| **5035** | Protocol Buffers |
| **5036** | JSON             |

> ⚠️ **Panda usa porta 5036 (JSON)** para simplicidade.

---

## 2. Conexão

### Endpoints WebSocket

| Ambiente | URL                              |
| -------- | -------------------------------- |
| **Demo** | `wss://demo.ctraderapi.com:5036` |
| **Live** | `wss://live.ctraderapi.com:5036` |

### Rate Limits

- **Normal requests:** 50/segundo por conexão
- **Historical data:** 5/segundo por conexão

---

## 3. Autenticação

### Fluxo OAuth

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   Usuário    │───────►│   Panda App  │───────►│   cTrader    │
│              │  OAuth │              │  Token │   Backend    │
└──────────────┘        └──────────────┘        └──────────────┘
```

### Credenciais Panda (Antigravity App)

| Chave         | Variável .env           |
| ------------- | ----------------------- |
| Client ID     | `CTRADER_CLIENT_ID`     |
| Client Secret | `CTRADER_SECRET`        |
| Access Token  | `CTRADER_ACCESS_TOKEN`  |
| Refresh Token | `CTRADER_REFRESH_TOKEN` |

### Fluxo de Autenticação

1. **App Auth** (2100 → 2101)
2. **List Accounts** (2149 → 2150)
3. **Account Auth** (2102 → 2103)

---

## 4. Mensagens

### Formato JSON

```json
{
  "clientMsgId": "unique_id",
  "payloadType": 2100,
  "payload": {
    "clientId": "...",
    "clientSecret": "..."
  }
}
```

### PayloadTypes Principais

| Código | Nome                                  | Descrição           |
| ------ | ------------------------------------- | ------------------- |
| 2100   | ProtoOAApplicationAuthReq             | Auth da app         |
| 2101   | ProtoOAApplicationAuthRes             | Resposta auth app   |
| 2102   | ProtoOAAccountAuthReq                 | Auth da conta       |
| 2103   | ProtoOAAccountAuthRes                 | Resposta auth conta |
| 2114   | ProtoOASymbolByIdReq                  | Info do símbolo     |
| 2123   | ProtoOASubscribeSpotsReq              | Subscribe preços    |
| 2124   | ProtoOASpotEvent                      | Evento de preço     |
| 2126   | ProtoOANewOrderReq                    | Nova ordem          |
| 2127   | ProtoOAExecutionEvent                 | Evento execução     |
| 2128   | ProtoOAClosePositionReq               | Fechar posição      |
| 2130   | ProtoOAAmendPositionSLTPReq           | Modificar SL/TP     |
| 2132   | ProtoOAReconcileReq                   | Listar posições     |
| 2134   | ProtoOAGetTrendbarsReq                | Dados históricos    |
| 2142   | ProtoOAErrorRes                       | Resposta de erro    |
| 2149   | ProtoOAGetAccountListByAccessTokenReq | Listar contas       |
| 2150   | ProtoOAGetAccountListByAccessTokenRes | Resposta contas     |

---

## 5. Market Data

### Subscribe Spots (Preços Real-time)

```json
{
  "payloadType": 2123,
  "payload": {
    "ctidTraderAccountId": 45208457,
    "symbolId": [1]
  }
}
```

### Dados Históricos (Trendbars)

```json
{
  "payloadType": 2134,
  "payload": {
    "ctidTraderAccountId": 45208457,
    "symbolId": 1,
    "period": "H1",
    "fromTimestamp": 1737676800000,
    "toTimestamp": 1737763200000
  }
}
```

### Períodos Disponíveis

`M1, M2, M3, M4, M5, M10, M15, M30, H1, H4, H12, D1, W1, MN1`

---

## 6. Trading

### Nova Ordem (Market)

```json
{
  "payloadType": 2126,
  "payload": {
    "ctidTraderAccountId": 45208457,
    "symbolId": 1,
    "orderType": "MARKET",
    "tradeSide": "BUY",
    "volume": 10000,
    "stopLoss": 1.083,
    "takeProfit": 1.092,
    "comment": "Panda Trading"
  }
}
```

### Order Types

| Tipo       | Descrição         |
| ---------- | ----------------- |
| MARKET     | Execução imediata |
| LIMIT      | Preço limite      |
| STOP       | Stop order        |
| STOP_LIMIT | Stop com limite   |

### Trade Sides

| Side | Descrição     |
| ---- | ------------- |
| BUY  | Compra (long) |
| SELL | Venda (short) |

### Volume

- Volume em **centavos** (10000 = 0.01 lote)
- 100000 = 0.1 lote
- 1000000 = 1.0 lote

### Fechar Posição

```json
{
  "payloadType": 2128,
  "payload": {
    "ctidTraderAccountId": 45208457,
    "positionId": 12345678,
    "volume": 10000
  }
}
```

---

## 7. Integração Panda

### Arquivos Relacionados

| Arquivo                                                            | Descrição                |
| ------------------------------------------------------------------ | ------------------------ |
| [pf.ctrader-api.js](../js/trading/pf.ctrader-api.js)               | Conector WebSocket       |
| [Comp_TradingHub.html](../components/trading/Comp_TradingHub.html) | UI de Trading            |
| [ctrader-test.html](../test/ctrader-test.html)                     | Página de teste          |
| [.env](../.env)                                                    | Credenciais (gitignored) |

### Uso no SDK

```javascript
// Configurar
Panda.CTrader.configure(
  process.env.CTRADER_CLIENT_ID,
  process.env.CTRADER_SECRET,
  process.env.CTRADER_ACCESS_TOKEN,
);

// Conectar
await Panda.CTrader.connect(true); // true = demo

// Trading
await Panda.CTrader.placeOrder(
  {
    symbolId: 1,
    type: "MARKET",
    side: "BUY",
    volume: 10000,
  },
  45208457,
);

// AI Analysis
const analysis = await Panda.CTrader.AI.analyzeMarket("EURUSD");
```

### Contas Disponíveis (Antigravity)

| ID       | Tipo | Status      |
| -------- | ---- | ----------- |
| 45208457 | Demo | ✅ Testado  |
| 45208965 | Live | Não testado |
| 45208968 | Live | Não testado |

---

## Links Úteis

- [Documentação Oficial](https://help.ctrader.com/open-api/)
- [Mensagens Reference](https://help.ctrader.com/open-api/messages/)
- [Portal de Apps](https://openapi.ctrader.com/apps/)
- [Suporte Telegram](https://t.me/ctrader_open_api_support)
- [GitHub Spotware](https://github.com/spotware)

---

> 📖 **Arquitetura Completa:** [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md)
