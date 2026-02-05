# 📁 PF_FILE_REGISTRY - Catálogo de Arquivos

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-05
> **Propósito:** Inventário completo de todos os arquivos do Panda Factory para manutenção DDD

---

## 📊 Resumo

| Extensão | Quantidade | Domínio Principal |
| -------- | ---------- | ----------------- |
| `.gs`    | 16         | Backend GAS       |
| `.rs`    | 6          | Rust Agent        |
| `.md`    | 18         | Documentação      |
| `.js`    | 73+        | Frontend/SDK      |
| `.html`  | 35         | UI/Components     |
| `.css`   | 27         | Estilos           |
| `.json`  | 11         | Config            |

---

## 🔧 Backend GAS (16 arquivos)

### Core

| Arquivo               | Caminho         | Descrição                                  |
| --------------------- | --------------- | ------------------------------------------ |
| `PF_Dispatcher.gs`    | `backend/core/` | Router principal (doGet/doPost) - Tri-Mode |
| `PF_Config.gs`        | `backend/core/` | Configurações globais                      |
| `PF_App_Init.gs`      | `backend/core/` | Inicialização do app                       |
| `PF_Core_AI.gs`       | `backend/core/` | Dispatcher AI multimodal                   |
| `PF_Core_Oracle.gs`   | `backend/core/` | Cotação USD/BRL                            |
| `PF_Core_Webhooks.gs` | `backend/core/` | Webhooks B2B (Kiwify, Hotmart, etc.)       |
| `PF_Brain_Core.gs`    | `backend/core/` | Core do Brain AI                           |
| `PF_Moltbook.gs`      | `backend/core/` | Integração Moltbook                        |
| `PF_PAT_Core.gs`      | `backend/core/` | Panda Council (Governança)                 |

### Finance

| Arquivo        | Caminho                    | Descrição                    |
| -------------- | -------------------------- | ---------------------------- |
| `PF_Wallet.gs` | `backend/domains/finance/` | Carteira Panda Coin          |
| `PF_Crypto.gs` | `backend/domains/finance/` | Pagamentos crypto (USDC/SOL) |
| `PF_Fiat.gs`   | `backend/domains/finance/` | Pagamentos fiat (Stripe/PIX) |

### Store

| Arquivo             | Caminho                  | Descrição                     |
| ------------------- | ------------------------ | ----------------------------- |
| `PF_Sales.gs`       | `backend/domains/store/` | Vendas e Split (52/25/15/5/3) |
| `PF_Registry.gs`    | `backend/domains/store/` | Registro de módulos           |
| `PF_Marketplace.gs` | `backend/domains/store/` | Medusa Store backend          |

### Automation

| Arquivo      | Caminho                       | Descrição            |
| ------------ | ----------------------------- | -------------------- |
| `PF_Bots.gs` | `backend/domains/automation/` | Automação de tarefas |

---

## 🦀 Rust Agent (6 arquivos)

| Arquivo       | Caminho           | Descrição                   |
| ------------- | ----------------- | --------------------------- |
| `main.rs`     | `rust-agent/src/` | Entry point, CLI dispatcher |
| `mcp.rs`      | `rust-agent/src/` | MCP Server (4 tools)        |
| `crypto.rs`   | `rust-agent/src/` | Ed25519 Founder Auth        |
| `gpu.rs`      | `rust-agent/src/` | NVIDIA/CUDA detection       |
| `health.rs`   | `rust-agent/src/` | Health monitoring           |
| `moltbook.rs` | `rust-agent/src/` | Moltbook client             |

---

## 📚 Documentação (18 arquivos)

### Core Docs

| Arquivo                     | Descrição                        |
| --------------------------- | -------------------------------- |
| `PF_MASTER_ARCHITECTURE.md` | 🌟 Arquitetura completa (~208KB) |
| `PF_FILE_REGISTRY.md`       | 📁 Este arquivo (catálogo)       |

### Frontend & UI

| Arquivo               | Descrição                               |
| --------------------- | --------------------------------------- |
| `PF_SDK_REFERENCE.md` | SDK, Tentacles, Event Bus, Bidirecional |
| `PF_UI_REFERENCE.md`  | Design System + Componentes             |

### Backend

| Arquivo                   | Descrição                       |
| ------------------------- | ------------------------------- |
| `PF_BACKEND_REFERENCE.md` | Backend geral + Firebase + Rust |
| `PF_PARTNER_REFERENCE.md` | Partner Mode + Mining + Phantom |
| `PF_GAS_REFERENCE.md`     | Google Apps Script (Tri-Mode)   |
| `PF_MCP_REFERENCE.md`     | Model Context Protocol          |

### AI & Integrations

| Arquivo                    | Descrição              |
| -------------------------- | ---------------------- |
| `PF_GEMINI_REFERENCE.md`   | Gemini 2.0/3.0 Flash   |
| `PF_MOLTBOOK_REFERENCE.md` | Rede social de agentes |
| `PF_COLAB_REFERENCE.md`    | Google Colab BYOC      |
| `PF_AGENT_CONSTITUTION.md` | Persona IA pública     |

### Business & Economy

| Arquivo                     | Descrição               |
| --------------------------- | ----------------------- |
| `PF_ECONOMY_REFERENCE.md`   | Panda Coin + Tokenomics |
| `PF_SOCIAL_REFERENCE.md`    | Social Hub APIs         |
| `PF_EDUCATION_REFERENCE.md` | EdTech integration      |

### Plugins & Ecosystem

| Arquivo                              | Descrição                 |
| ------------------------------------ | ------------------------- |
| `PF_PLUGIN_AND_MODULAR_REFERENCE.md` | Sistema plugins + cTrader |
| `PF_MEDUSA_REFERENCE.md`             | Marketplace Store         |
| `PF_OPENSOURCE_CATALOG.md`           | Catálogo OSS              |

---

## 💻 Frontend SDK (73+ arquivos)

### Core SDK

| Arquivo           | Caminho | Descrição               |
| ----------------- | ------- | ----------------------- |
| `pf.sdk.js`       | `js/`   | 🌟 SDK principal (50KB) |
| `pf.bootstrap.js` | `js/`   | Bootstrap loader        |
| `pf.app-init.js`  | `js/`   | App initialization      |

### Kernel

| Arquivo            | Caminho      | Descrição          |
| ------------------ | ------------ | ------------------ |
| `pf.loader.js`     | `js/kernel/` | Module loader      |
| `pf.components.js` | `js/kernel/` | Component registry |

### Core Modules

| Arquivo                  | Caminho    | Descrição             |
| ------------------------ | ---------- | --------------------- |
| `pf.ai-core.js`          | `js/core/` | AI orchestrator       |
| `pf.drm.js`              | `js/core/` | Plugin DRM            |
| `pf.firebase-bridge.js`  | `js/core/` | Firebase integration  |
| `pf.i18n.js`             | `js/core/` | Internationalization  |
| `pf.kill-switch.js`      | `js/core/` | Emergency kill switch |
| `pf.workflow-builder.js` | `js/core/` | Workflow automation   |
| `pf.agent-telemetry.js`  | `js/core/` | Agent metrics         |
| `plugin-loader.js`       | `js/core/` | Plugin system         |

### Integrations

| Arquivo          | Caminho            | Descrição         |
| ---------------- | ------------------ | ----------------- |
| `pf.ctrader.js`  | `js/integrations/` | cTrader API       |
| `pf.youtube.js`  | `js/integrations/` | YouTube Data API  |
| `pf.twitter.js`  | `js/integrations/` | Twitter/X API     |
| `pf.whatsapp.js` | `js/integrations/` | WhatsApp Business |
| `pf.meta.js`     | `js/integrations/` | Meta (FB + IG)    |

### Social Tentacles

| Arquivo                 | Caminho      | Descrição      |
| ----------------------- | ------------ | -------------- |
| `pf.social-core.js`     | `js/social/` | Social parent  |
| `pf.social-youtube.js`  | `js/social/` | YouTube child  |
| `pf.social-twitter.js`  | `js/social/` | Twitter child  |
| `pf.social-whatsapp.js` | `js/social/` | WhatsApp child |
| `pf.social-meta.js`     | `js/social/` | Meta child     |
| `pf.social-telegram.js` | `js/social/` | Telegram child |
| `pf.social-tiktok.js`   | `js/social/` | TikTok child   |

### Brain Tentacles

| Arquivo              | Caminho                        | Descrição          |
| -------------------- | ------------------------------ | ------------------ |
| `pf.brain-parent.js` | `js/tentacles/brain/`          | Brain orchestrator |
| `gemini.js`          | `js/tentacles/brain/children/` | Gemini AI          |
| `gpu.js`             | `js/tentacles/brain/children/` | GPU compute        |
| `local-llm.js`       | `js/tentacles/brain/children/` | Local LLM (Ollama) |

### Distribution Tentacles

| Arquivo                     | Caminho                               | Descrição                 |
| --------------------------- | ------------------------------------- | ------------------------- |
| `pf.distribution-parent.js` | `js/tentacles/distribution/`          | Distribution orchestrator |
| `google-play.js`            | `js/tentacles/distribution/children/` | Play Store                |
| `steam.js`                  | `js/tentacles/distribution/children/` | Steam                     |
| `pwa.js`                    | `js/tentacles/distribution/children/` | PWA deploy                |
| `vscode.js`                 | `js/tentacles/distribution/children/` | VSCode extensions         |
| `npm.js`                    | `js/tentacles/distribution/children/` | NPM publish               |

### Education Tentacles

| Arquivo                  | Caminho                            | Descrição              |
| ------------------------ | ---------------------------------- | ---------------------- |
| `pf.education-parent.js` | `js/tentacles/education/`          | Education orchestrator |
| `kiwify.js`              | `js/tentacles/education/children/` | Kiwify webhooks        |
| `hotmart.js`             | `js/tentacles/education/children/` | Hotmart webhooks       |
| `eduzz.js`               | `js/tentacles/education/children/` | Eduzz webhooks         |

---

## 🌐 HTML (35 arquivos)

### Main

| Arquivo                  | Descrição          |
| ------------------------ | ------------------ |
| `PandaFactory.html`      | App principal      |
| `index.html`             | Landing page       |
| `founder-dashboard.html` | Dashboard fundador |

### Pitch Decks

| Arquivo              | Descrição          |
| -------------------- | ------------------ |
| `pitch-deck.html`    | Pitch deck (PT-BR) |
| `pitch-deck-pt.html` | Pitch deck PT      |
| `pitch-deck-en.html` | Pitch deck EN      |

### Components

| Arquivo                       | Descrição            |
| ----------------------------- | -------------------- |
| `Comp_AppDock.html`           | Dock de apps         |
| `Comp_Sidebar.html`           | Sidebar principal    |
| `Comp_HeaderStatus.html`      | Header com status    |
| `Comp_DevToolsDock.html`      | DevTools dock        |
| `Comp_SettingsModal.html`     | Modal de settings    |
| `Comp_LoginOverlay.html`      | Overlay de login     |
| `Comp_TentacleMonitor.html`   | Monitor de tentacles |
| `Comp_TreasuryDashboard.html` | Dashboard treasury   |
| `Comp_TradingHub.html`        | Hub de trading       |
| `Comp_AgendaDrawer.html`      | Drawer de agenda     |

---

## ⚙️ Config (11 arquivos)

| Arquivo            | Descrição            |
| ------------------ | -------------------- |
| `manifest.json`    | PWA manifest         |
| `package.json`     | NPM dependencies     |
| `jsconfig.json`    | JS/TS config         |
| `appsscript.json`  | GAS manifest         |
| `credentials.json` | Moltbook credentials |

---

## 🎨 CSS (27 arquivos)

### Core

| Arquivo        | Descrição                  |
| -------------- | -------------------------- |
| `pf.theme.css` | 🌟 Design System principal |

### Jam (TLDraw Editor)

| Arquivo                    | Descrição                |
| -------------------------- | ------------------------ |
| `jam.css`                  | Jam main styles          |
| `FounderDashboard.css`     | Founder dashboard styles |
| `CheckoutModal.css`        | Checkout modal           |
| `PandaDefendDashboard.css` | Panda Defend UI          |

---

## 📂 Estrutura de Diretórios

```text
Panda Factory/
├── backend/              # GAS Backend (16 .gs)
│   ├── core/             # Core services
│   └── domains/          # DDD domains
│       ├── finance/      # Wallet, Crypto, Fiat
│       ├── store/        # Sales, Registry
│       └── automation/   # Bots
├── js/                   # Frontend (73+ .js)
│   ├── core/             # Core modules
│   ├── kernel/           # Loaders
│   ├── integrations/     # External APIs
│   ├── social/           # Social plugins
│   └── tentacles/        # Tentacle system
│       ├── brain/        # AI tentacles
│       ├── distribution/ # App stores
│       ├── education/    # Infoproduct hooks
│       ├── github/       # GitHub integration
│       └── google/       # Google services
├── rust-agent/           # Rust binary (6 .rs)
│   └── src/              # Source files
├── docs/                 # Documentation (18 .md)
├── components/           # HTML components
├── css/                  # Stylesheets
├── jam/                  # TLDraw editor
└── modules/              # Feature modules
```

---

> 📖 **Mantido por:** Panda Council (PAT)
> **Última atualização:** 2026-02-05
