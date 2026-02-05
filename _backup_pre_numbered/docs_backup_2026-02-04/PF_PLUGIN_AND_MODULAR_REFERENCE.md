# 🧩 Panda Factory - Plugin & Modular Reference

> **Versão:** 1.0.0 | **Última Atualização:** 2026-01-24

---

## 📋 Índice

1. [Arquitetura Modular](#arquitetura-modular)
2. [Plugins Oficiais](#plugins-oficiais)
3. [Como Criar um Plugin](#como-criar-um-plugin)
4. [Marketplace](#marketplace)
5. [Integração SDK](#integração-sdk)

---

## 1. Arquitetura Modular

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      PANDA FACTORY SHELL                            │
│                   (PandaFactory.html + SDK)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  📱 Social   │  │  📈 Trading  │  │  🔧 Dev      │              │
│  │     Hub      │  │     Hub      │  │    Tools     │              │
│  │  (6 plugins) │  │  (cTrader)   │  │  (built-in)  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  📋 CRM      │  │  🤖 Workflow │  │  🏪 Store    │              │
│  │    Module    │  │   Builder    │  │  (marketplace│              │
│  │  (clientes)  │  │  (automação) │  │    futuro)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Princípios

| Princípio        | Descrição                            |
| ---------------- | ------------------------------------ |
| **Isolamento**   | Cada plugin opera em sandbox próprio |
| **Lazy Loading** | Plugins carregam sob demanda         |
| **Monetização**  | Venda via Panda Coins ($PC)          |
| **SDK Hooks**    | Todos usam `Panda.*` para integração |

---

## 2. Plugins Oficiais

### 📱 Social Media Hub

| Plugin        | Arquivo                 | Preço  | Features                    |
| ------------- | ----------------------- | ------ | --------------------------- |
| **Core**      | `pf.social-core.js`     | GRÁTIS | CRM, Agenda, Generators     |
| **YouTube**   | `pf.social-youtube.js`  | 499 PC | SEO, Thumbnails AI, Scripts |
| **TikTok**    | `pf.social-tiktok.js`   | 399 PC | Trends, Viral Captions      |
| **Meta**      | `pf.social-meta.js`     | 599 PC | Posts, Stories, Ads         |
| **Twitter/X** | `pf.social-twitter.js`  | 299 PC | Threads, Hooks, Spaces      |
| **WhatsApp**  | `pf.social-whatsapp.js` | 799 PC | Broadcast, Leads, Flows     |

### 📈 Trading Hub

| Plugin            | Arquivo               | Preço       | Features                      |
| ----------------- | --------------------- | ----------- | ----------------------------- |
| **cTrader API**   | `pf.ctrader-api.js`   | GRÁTIS\*    | WebSocket, Orders, Positions  |
| **cTrader OAuth** | `pf.ctrader-oauth.js` | GRÁTIS\*    | User Auth, Multi-Account      |
| **AI Signals**    | (integrado)           | 50 PC/sinal | Market Analysis, Entry Points |

> \*Grátis para conexão, sinais AI consomem $PC

### 🤖 Automation

| Plugin               | Arquivo                  | Preço          | Features              |
| -------------------- | ------------------------ | -------------- | --------------------- |
| **Workflow Builder** | `pf.workflow-builder.js` | GRÁTIS         | Criar workflows       |
| **AI Adaptive**      | (integrado)              | 10 PC/sugestão | Sugestões automáticas |

### 🐼 Plugins Gratuitos do Founder

> **Filosofia:** Core minimalista. Ferramentas essenciais são plugins gratuitos.

| Plugin           | ID                    | MCP Tools                                 | Descrição                   |
| ---------------- | --------------------- | ----------------------------------------- | --------------------------- |
| **Draw Tools**   | `@panda/draw-tools`   | `draw_shape`, `export_canvas`, `set_tool` | Canvas TLDraw completo      |
| **AI Chat**      | `@panda/ai-chat`      | `send_message`, `get_history`             | Interface de chat com Brain |
| **File Manager** | `@panda/file-manager` | `upload`, `download`, `list`              | Gerenciador de arquivos     |

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    PLUGINS FOUNDER = CORE EXTENSÍVEL                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CORE (Shell mínimo):           PLUGINS FOUNDER (gratuitos):        │
│  ├── Plugin Slot                ├── @panda/draw-tools               │
│  ├── Event Bus                  ├── @panda/ai-chat                  │
│  └── MCP Runtime                └── @panda/file-manager             │
│                                                                      │
│  Usuário abre Panda → Baixa plugins que precisa via Medusa Store   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Como Criar um Plugin

### Estrutura Básica

```javascript
/**
 * 🐼 PANDA PLUGIN - Meu Plugin
 * @version 1.0.0
 * @price 199 PC
 */

(function (window) {
  "use strict";

  // ============================================
  // METADATA (obrigatório)
  // ============================================
  const PLUGIN_META = {
    id: "meu-plugin",
    name: "Meu Plugin Incrível",
    version: "1.0.0",
    author: "Seu Nome",
    price: 199, // em Panda Coins
    category: "productivity",
    requires: ["pf.sdk"], // dependências
    icon: "🚀",
  };

  // ============================================
  // PLUGIN CORE
  // ============================================
  const MeuPlugin = {
    meta: PLUGIN_META,

    // Inicialização
    async init() {
      console.log(`[${PLUGIN_META.name}] Inicializando...`);

      // Verificar licença
      const licensed = await this.checkLicense();
      if (!licensed) {
        Panda.UI.toast("Plugin não licenciado", "error");
        return false;
      }

      return true;
    },

    // Verificar se usuário comprou
    async checkLicense() {
      // Em produção: verificar via Panda.Data
      return true; // mock
    },

    // Features do plugin
    async minhaFeature(params) {
      // Cobrar PC se for feature premium
      const charged = await Panda.Wallet._charge(10, "minha-feature");
      if (!charged) return null;

      // Lógica da feature...
      return { success: true };
    },
  };

  // ============================================
  // REGISTRO NO SDK
  // ============================================
  window.Panda = window.Panda || {};
  window.Panda.Plugins = window.Panda.Plugins || {};
  window.Panda.Plugins[PLUGIN_META.id] = MeuPlugin;

  // Auto-init
  if (document.readyState === "complete") {
    MeuPlugin.init();
  } else {
    window.addEventListener("load", () => MeuPlugin.init());
  }

  console.log(`[${PLUGIN_META.id}] Plugin carregado`);
})(window);
```

### Checklist de Plugin

- [ ] Metadata completa (id, name, version, price)
- [ ] Verificação de licença
- [ ] Uso de `Panda.*` para todas operações
- [ ] Cobrança de PC em features premium
- [ ] Tratamento de erros
- [ ] JSDoc em todas funções públicas
- [ ] Não usar CSS inline (usar classes)

---

## 4. Marketplace

### Categorias

| Categoria      | Exemplos                       |
| -------------- | ------------------------------ |
| `social`       | YouTube, TikTok, Meta, Twitter |
| `trading`      | cTrader, MT4/5, Signals        |
| `productivity` | CRM, Agenda, Docs              |
| `automation`   | Workflows, Bots, Scrapers      |
| `analytics`    | Dashboards, Reports            |
| `ai`           | Models, Assistants, Generators |

### Preços Sugeridos

| Complexidade | Faixa de Preço (PC) |
| ------------ | ------------------- |
| Simples      | 99 - 299            |
| Médio        | 299 - 599           |
| Avançado     | 599 - 999           |
| Enterprise   | 999 - 2999          |

### Revenue Split

```text
┌────────────────────────────────────────┐
│         VENDA DE PLUGIN                │
│              100 PC                    │
├────────────────────────────────────────┤
│  Dev (Criador)    │  52 PC (52%)       │
│  Panda Educação   │  25 PC (25%)       │
│  Panda Ops        │  15 PC (15%)       │
│  Founder          │   5 PC (5%)        │
│  Gateway/Taxas    │   3 PC (3%)        │
└────────────────────────────────────────┘
```

---

## 5. Integração SDK

### Registrar Plugin

```javascript
// O SDK detecta automaticamente via:
window.Panda.Plugins["meu-plugin"] = MeuPlugin;

// Listar plugins instalados
const plugins = Object.keys(Panda.Plugins);
```

### Eventos de Plugin

```javascript
// Emitir evento do plugin
Panda.emit("plugin:meu-plugin:acao", { data: "valor" });

// Ouvir evento
Panda.on("plugin:meu-plugin:acao", (data) => {
  console.log("Ação recebida:", data);
});
```

### Storage Isolado

```javascript
// Usar prefixo do plugin
localStorage.setItem("panda_meuPlugin_config", JSON.stringify(config));

// Ou via SDK (recomendado)
await Panda.Data.save("meuPlugin_settings", config);
```

### UI Integration

```javascript
// Adicionar item ao Dock
Panda.UI.addToDock({
  id: "meu-plugin",
  icon: "🚀",
  label: "Meu Plugin",
  onClick: () => MeuPlugin.open(),
});

// Abrir modal
Panda.UI.modal({
  title: "Meu Plugin",
  content: "<div>Conteúdo aqui</div>",
  width: 800,
});
```

---

## 6. cTrader Open API Reference

> **Fonte:** [cTrader Open API Docs](https://help.ctrader.com/open-api/)

### 6.1. Visão Geral

cTrader Open API permite criar aplicações que enviam/recebem dados do backend cTrader.

**Casos de Uso:**

- Trading app customizado
- Bot Telegram/Discord
- App mobile com AI
- Integração com Panda Factory

**Formato de Dados:**

| Porta    | Formato          |
| -------- | ---------------- |
| **5035** | Protocol Buffers |
| **5036** | JSON             |

> ⚠️ **Panda usa porta 5036 (JSON)** para simplicidade.

### 6.2. Conexão

**Endpoints WebSocket:**

| Ambiente | URL                              |
| -------- | -------------------------------- |
| **Demo** | `wss://demo.ctraderapi.com:5036` |
| **Live** | `wss://live.ctraderapi.com:5036` |

**Rate Limits:**

- Normal requests: 50/segundo por conexão
- Historical data: 5/segundo por conexão

### 6.3. Autenticação

**Fluxo OAuth:**

```text
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   Usuário    │───────►│   Panda App  │───────►│   cTrader    │
│              │  OAuth │              │  Token │   Backend    │
└──────────────┘        └──────────────┘        └──────────────┘
```

**Credenciais Panda (Antigravity App):**

| Chave         | Variável .env           |
| ------------- | ----------------------- |
| Client ID     | `CTRADER_CLIENT_ID`     |
| Client Secret | `CTRADER_SECRET`        |
| Access Token  | `CTRADER_ACCESS_TOKEN`  |
| Refresh Token | `CTRADER_REFRESH_TOKEN` |

**Fluxo:**

1. App Auth (2100 → 2101)
2. List Accounts (2149 → 2150)
3. Account Auth (2102 → 2103)

### 6.4. Mensagens

**Formato JSON:**

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

**PayloadTypes Principais:**

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

### 6.5. Market Data

**Subscribe Spots (Preços Real-time):**

```json
{
  "payloadType": 2123,
  "payload": {
    "ctidTraderAccountId": 45208457,
    "symbolId": [1]
  }
}
```

**Períodos Disponíveis:**
`M1, M2, M3, M4, M5, M10, M15, M30, H1, H4, H12, D1, W1, MN1`

### 6.6. Trading

**Nova Ordem (Market):**

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

**Order Types:**

| Tipo       | Descrição         |
| ---------- | ----------------- |
| MARKET     | Execução imediata |
| LIMIT      | Preço limite      |
| STOP       | Stop order        |
| STOP_LIMIT | Stop com limite   |

**Trade Sides:**

| Side | Descrição     |
| ---- | ------------- |
| BUY  | Compra (long) |
| SELL | Venda (short) |

**Volume:**

- Volume em **centavos** (10000 = 0.01 lote)
- 100000 = 0.1 lote
- 1000000 = 1.0 lote

### 6.7. Uso no SDK

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
await Panda.CTrader.trade(
  {
    symbolId: 1,
    type: "MARKET",
    side: "BUY",
    volume: 10000,
  },
  45208457,
);

// AI Analysis
const analysis = await Panda.CTrader.AISignals.generate("EURUSD");
```

**Contas Disponíveis (Antigravity):**

| ID       | Tipo | Status      |
| -------- | ---- | ----------- |
| 45208457 | Demo | ✅ Testado  |
| 45208965 | Live | Não testado |
| 45208968 | Live | Não testado |

### Links cTrader

- [Documentação Oficial](https://help.ctrader.com/open-api/)
- [Mensagens Reference](https://help.ctrader.com/open-api/messages/)
- [Portal de Apps](https://openapi.ctrader.com/apps/)

---

## Arquivos Relacionados

| Arquivo                          | Descrição          |
| -------------------------------- | ------------------ |
| `js/social/pf.social-*.js`       | Plugins Social Hub |
| `js/trading/pf.ctrader-*.js`     | Plugins Trading    |
| `js/integrations/pf.*.js`        | Integrations SDK   |
| `js/core/pf.workflow-builder.js` | Workflow Builder   |
| `js/pf.sdk.js`                   | SDK principal      |

---

> 📖 **Referências:**
>
> - [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) - API do SDK
> - [PF_TOKENOMICS_REFERENCE.md](PF_TOKENOMICS_REFERENCE.md) - Economia PC
> - [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md) - Arquitetura completa
> - [PANDA.md](../.agent/PANDA.md) - Codex Central
