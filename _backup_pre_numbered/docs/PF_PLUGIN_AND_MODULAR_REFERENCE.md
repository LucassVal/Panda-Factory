# 🧩 Panda Factory - Plugin & Modular Reference

> **Versão:** 1.0.0 | **Última Atualização:** 2026-01-24

---

## 📋 Índice

1. [Arquitetura Modular](#1-arquitetura-modular)
2. [Plugins Oficiais](#2-plugins-oficiais)
3. [Como Criar um Plugin](#3-como-criar-um-plugin)
4. [Marketplace](#4-marketplace)
5. [Integração SDK](#5-integração-sdk)

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

## Arquivos Relacionados

| Arquivo                          | Descrição          |
| -------------------------------- | ------------------ |
| `js/social/pf.social-*.js`       | Plugins Social Hub |
| `js/integrations/pf.*.js`        | Integrations SDK   |
| `js/core/pf.workflow-builder.js` | Workflow Builder   |
| `js/pf.sdk.js`                   | SDK principal      |

---

> 📖 **Referências:**
>
> - [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) - API do SDK
> - [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) - Economia PC
> - [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md) - Arquitetura completa
