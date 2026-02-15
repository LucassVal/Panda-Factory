---
tool_context: panda/files
description: Catálogo de arquivos - 274 arquivos auditados (GAS, Rust, JS, HTML, CSS, MD)
version: 4.1.0
updated: 2026-02-15
ssot: CONTEXT.md §5 (Sistema Montesquieu)
cross_ref: [PF_MASTER_ARCHITECTURE.md, PF_SDK_REFERENCE.md, PF_UI_REFERENCE.md]
---

# 📁 PF_FILE_REGISTRY - Catálogo de Arquivos

> **Versão:** 4.1.0 | **Atualizado:** 2026-02-15
> **Propósito:** Inventário COMPLETO de todos os arquivos do Panda Factory (auditado via fs scan)

---

## 📊 Resumo Auditado (2026-02-14)

```text
┌─────────────────────────────────────────────────────────────────────┐
│          FILE REGISTRY — 274 ARQUIVOS (auditado fs scan)           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 📜 17 .gs    │  │ 🦀  9 .rs    │  │ 📄 21 .md    │              │
│  │  Backend GAS │  │ Rust PLANNED│  │ Documentação │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 💻107 .js/jsx│  │ 🌐 18 .html  │  │ 🎨 20 .css   │              │
│  │ SDK/Tentacles│  │  UI/Modules  │  │   Estilos    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ ⚙️ 11 .json  │  │ 🐍 28 .py    │  │ 🖼️ 24 assets │              │
│  │   Config     │  │   Scripts    │  │  Img/Icons   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

| Extensão | Qtd | Domínio Principal          |
| -------- | --- | -------------------------- |
| `.gs`    | 17  | Backend GAS                |
| `.rs`    | 9   | Rust Agent (⚠️ PLANNED)    |
| `.md`    | 21  | Documentação + README      |
| `.js`    | 74  | Frontend/SDK/Tentacles     |
| `.jsx`   | 33  | React Components           |
| `.html`  | 18  | UI/Components/Modules      |
| `.css`   | 20  | Estilos (incl. legacy)     |
| `.json`  | 11  | Config                     |
| `.py`    | 28  | Scripts/Automação          |
| imagens  | 24  | Logos, ícones, favicons    |
| outros   | 19  | .bat, .ps1, .sh, .yml, etc |

---

## 🔧 Backend GAS (17 arquivos)

### Core

| Arquivo               | Caminho           | Descrição                                  | v     | Mod        |
| --------------------- | ----------------- | ------------------------------------------ | ----- | ---------- |
| `PF_Dispatcher.gs`    | `1.core/1.1.gas/` | Router principal (doGet/doPost) - Tri-Mode | 1.3.0 | 2026-02-08 |
| `PF_Config.gs`        | `1.core/1.1.gas/` | Configurações globais                      | 1.0.0 | 2026-01-15 |
| `PF_App_Init.gs`      | `1.core/1.1.gas/` | Inicialização do app                       | 1.0.0 | 2026-01-15 |
| `PF_Core_AI.gs`       | `1.core/1.1.gas/` | Dispatcher AI multimodal                   | 1.0.0 | 2026-01-26 |
| `PF_Core_Oracle.gs`   | `1.core/1.1.gas/` | Cotação USD/BRL                            | 1.0.0 | 2026-01-15 |
| `PF_Core_Webhooks.gs` | `1.core/1.1.gas/` | Webhooks B2B (Kiwify, Hotmart, etc.)       | 1.0.0 | 2026-01-26 |
| `PF_Brain_Core.gs`    | `1.core/1.1.gas/` | Core do Brain AI                           | 1.0.0 | 2026-01-26 |
| `PF_Moltbook.gs`      | `1.core/1.1.gas/` | Integração Moltbook                        | 1.0.0 | 2026-01-15 |
| `PF_PAT_Core.gs`      | `1.core/1.1.gas/` | Panda Council (Governança)                 | 1.0.0 | 2026-02-03 |

### Finance

| Arquivo        | Caminho                   | Descrição                    | v     | Mod        |
| -------------- | ------------------------- | ---------------------------- | ----- | ---------- |
| `PF_Wallet.gs` | `1.core/domains/finance/` | Carteira Panda Coin          | 1.0.0 | 2026-01-26 |
| `PF_Crypto.gs` | `1.core/domains/finance/` | Pagamentos crypto (USDC/SOL) | 1.0.0 | 2026-01-26 |
| `PF_Fiat.gs`   | `1.core/domains/finance/` | Pagamentos fiat (Stripe/PIX) | 1.0.0 | 2026-01-26 |

### Store

| Arquivo             | Caminho                 | Descrição                     | v     | Mod        |
| ------------------- | ----------------------- | ----------------------------- | ----- | ---------- |
| `PF_Sales.gs`       | `1.core/domains/store/` | Vendas e Split (52/25/15/5/3) | 1.0.0 | 2026-02-03 |
| `PF_Registry.gs`    | `1.core/domains/store/` | Registro de módulos           | 1.0.0 | 2026-01-15 |
| `PF_Marketplace.gs` | `1.core/domains/store/` | Medusa Store backend          | 1.0.0 | 2026-01-26 |

### Automation & P2P

| Arquivo      | Caminho                      | Descrição                        | v     | Mod        |
| ------------ | ---------------------------- | -------------------------------- | ----- | ---------- |
| `PF_Bots.gs` | `1.core/domains/automation/` | Automação de tarefas             | 1.0.0 | 2026-01-15 |
| `PF_P2P.gs`  | `1.core/domains/p2p/`        | 🌐 Node registry, tasks, rewards | 1.0.0 | 2026-01-26 |

### Payment SDKs (1.core/1.3.sdks/)

| Arquivo            | Status  | Descrição             | v     | Mod        |
| ------------------ | ------- | --------------------- | ----- | ---------- |
| `SDK_PagSeguro.js` | 🟡 MOCK | PagSeguro payment SDK | 0.1.0 | 2026-01-15 |
| `SDK_Stripe.js`    | 🟡 MOCK | Stripe payment SDK    | 0.1.0 | 2026-01-15 |

---

## 🦀 Rust Agent (9 arquivos) — ⚠️ PLANNED (not implemented)

> **Status:** Todos os arquivos são **MOCKS** criados como placeholders.
> O Rust Agent está planejado para Phase 2 2026 mas ainda não foi implementado.

| Arquivo              | Caminho               | Descrição                       | v     | Mod        |
| -------------------- | --------------------- | ------------------------------- | ----- | ---------- |
| `Cargo.toml`         | `7.7.rust-agent/`     | Dependências Rust (MOCK)        | 0.1.0 | 2026-02-14 |
| `main.rs`            | `7.7.rust-agent/src/` | Entry point (MOCK)              | 0.1.0 | 2026-02-14 |
| `config.rs`          | `7.7.rust-agent/src/` | Configuração agent (MOCK)       | 0.1.0 | 2026-02-14 |
| `gas_bridge.rs`      | `7.7.rust-agent/src/` | Bridge GAS backend (MOCK)       | 0.1.0 | 2026-02-14 |
| `firebase_bridge.rs` | `7.7.rust-agent/src/` | Bridge Firebase RTDB (MOCK)     | 0.1.0 | 2026-02-14 |
| `ai_router.rs`       | `7.7.rust-agent/src/` | Router AI multi-provider (MOCK) | 0.1.0 | 2026-02-14 |
| `p2p_node.rs`        | `7.7.rust-agent/src/` | P2P mesh node (MOCK)            | 0.1.0 | 2026-02-14 |
| `crypto_engine.rs`   | `7.7.rust-agent/src/` | PAT crypto engine (MOCK)        | 0.1.0 | 2026-02-14 |
| `tentacle_sdk.rs`    | `7.7.rust-agent/src/` | Tentacle SDK bridge (MOCK)      | 0.1.0 | 2026-02-14 |

---

## 📚 Documentação (16 arquivos em 8.docs/)

| Arquivo                          | Descrição                        | v     | Mod        |
| -------------------------------- | -------------------------------- | ----- | ---------- |
| `PF_MASTER_ARCHITECTURE.md`      | 🌟 Arquitetura completa (~192KB) | 3.0.0 | 2026-02-14 |
| `PF_FILE_REGISTRY.md`            | 📁 Este arquivo (catálogo)       | 3.0.0 | 2026-02-14 |
| `PF_SDK_REFERENCE.md`            | SDK, Tentacles, Social, Plugins  | 1.5.0 | 2026-02-14 |
| `PF_UI_REFERENCE.md`             | Design System + Componentes      | 6.6.0 | 2026-02-15 |
| `PF_BACKEND_REFERENCE.md`        | Backend geral + Firebase + Rust  | 2.1.0 | 2026-02-14 |
| `PF_P2P_REFERENCE.md`            | P2P + Partner + Nodes + Mining   | 2.1.0 | 2026-02-14 |
| `PF_GAS_REFERENCE.md`            | Google Apps Script (Tri-Mode)    | 1.3.0 | 2026-02-14 |
| `PF_MCP_REFERENCE.md`            | Model Context Protocol           | 1.0.0 | 2026-02-14 |
| `PF_GEMINI_REFERENCE.md`         | Gemini 2.0/3.0 Flash             | 3.0.0 | 2026-02-14 |
| `PF_COLAB_REFERENCE.md`          | Google Colab BYOC                | 1.0.0 | 2026-02-14 |
| `PF_AGENT_CONSTITUTION.md`       | Persona IA pública               | 1.1.0 | 2026-02-14 |
| `PF_ECONOMY_REFERENCE.md`        | Panda Coin + Tokenomics          | 2.0.0 | 2026-02-14 |
| `PF_SECURITY_REFERENCE.md`       | 🛡️ Pipeline + Panda Defend       | 1.1.0 | 2026-02-14 |
| `PF_MEDUSA_REFERENCE.md`         | Marketplace Store                | 2.0.0 | 2026-02-14 |
| `PF_OPENSOURCE_CATALOG.md`       | Catálogo OSS                     | 1.2.0 | 2026-02-14 |
| `PF_PAT_FOUNDER_CONSTITUTION.md` | Constituição PAT + Founder       | 1.1.0 | 2026-02-14 |

---

## 💻 Frontend SDK & JS

### SDK (3.sdk/) — 12 arquivos, 17 namespaces

> 🏷️ **Status:** 🟢 REAL (callGAS/funcional) | 🟡 MOCK (setTimeout/placeholder) | 🔵 HYBRID (misto) | ⚪ STATIC (lógica local)

| Arquivo                  | Status    | Descrição                                 | v     | Mod        |
| ------------------------ | --------- | ----------------------------------------- | ----- | ---------- |
| `pf.sdk.js`              | 🔵 HYBRID | 🌟 SDK principal — 17 namespaces (v1.0.0) | 1.0.0 | 2026-01-26 |
| `pf.app-init.js`         | 🟡 MOCK   | Boot orchestrator (setTimeout no init)    | 1.0.0 | 2026-01-15 |
| `pf.loader.js`           | 🟢 REAL   | Module Loader v2.0 (numbered paths)       | 2.0.0 | 2026-02-06 |
| `pf.components.js`       | 🟢 REAL   | Component Loader v2.0 (numbered paths)    | 2.0.0 | 2026-02-06 |
| `pf.module-loader.js`    | 🟢 REAL   | Module loader (Medusa Store install)      | 1.0.0 | 2026-01-26 |
| `pf.ai-core.js`          | ⚪ STATIC | PAT/Treasury logic (depende de Brain)     | 1.0.0 | 2026-01-26 |
| `pf.firebase-bridge.js`  | 🟡 MOCK   | Firebase bridge (setTimeout simula conn)  | 0.1.0 | 2026-01-15 |
| `pf.i18n.js`             | 🟢 REAL   | i18n funcional (PT/EN/ES, DOM binding)    | 1.0.0 | 2026-01-26 |
| `pf.drm.js`              | 🔵 HYBRID | DRM (callGAS + setTimeout fallback)       | 1.0.0 | 2026-01-26 |
| `pf.kill-switch.js`      | 🟢 REAL   | Kill switch (callGAS Founder auth)        | 1.0.0 | 2026-02-06 |
| `pf.agent-telemetry.js`  | 🟢 REAL   | Telemetria event-based (Founder-only)     | 1.0.0 | 2026-02-06 |
| `pf.workflow-builder.js` | 🟢 REAL   | Workflows (IndexedDB, AI learning)        | 1.0.0 | 2026-01-26 |

### Kernel (2.system/core/)

| Arquivo              | Status  | Descrição                            | v     | Mod        |
| -------------------- | ------- | ------------------------------------ | ----- | ---------- |
| `kernel.js`          | 🟢 REAL | Kernel v2.1.0 — Constitution + Boot  | 2.1.0 | 2026-02-06 |
| `loader.js`          | 🟢 REAL | Component Loader (REGISTRY)          | 1.0.0 | 2026-01-26 |
| `pf.verification.js` | 🟢 REAL | Verification Agents (3-state health) | 1.0.0 | 2026-02-06 |

### UI Modules (4.ui/)

| Arquivo           | Status    | Descrição       | v     | Mod        |
| ----------------- | --------- | --------------- | ----- | ---------- |
| `pf.devtools.js`  | 🟢 REAL   | DevTools panel  | 1.0.0 | 2026-01-26 |
| `pf.dock-drag.js` | 🟡 MOCK   | Dock drag       | 0.1.0 | 2026-01-15 |
| `pf.dock.js`      | ⚪ STATIC | Dock manager    | 1.0.0 | 2026-01-26 |
| `pf.drag.js`      | ⚪ STATIC | Drag utilities  | 1.0.0 | 2026-01-15 |
| `pf.modal-pin.js` | ⚪ STATIC | Modal pin       | 1.0.0 | 2026-01-15 |
| `pf.omnibar.js`   | 🟡 MOCK   | Omnibar/Command | 0.1.0 | 2026-01-15 |
| `pf.settings.js`  | ⚪ STATIC | Settings panel  | 1.0.0 | 2026-01-15 |

### Lazy-Loaded Modules (4.ui/4.3.modules/)

| Arquivo                      | Status  | Descrição                          | v     | Mod        |
| ---------------------------- | ------- | ---------------------------------- | ----- | ---------- |
| `Mod_Analytics_View.html`    | 🟡 MOCK | Analytics dashboard (4 charts)     | 0.1.0 | 2026-01-15 |
| `Mod_Store_View.html`        | 🟡 MOCK | Medusa Store (search + grid)       | 0.1.0 | 2026-01-26 |
| `Mod_Founder_Dashboard.html` | 🟢 REAL | Founder Dashboard (8-agent health) | 1.0.0 | 2026-02-06 |

### Data Assets (10.assets/data/)

| Arquivo                        | Status  | Descrição            | v     | Mod        |
| ------------------------------ | ------- | -------------------- | ----- | ---------- |
| `seed_system.json`             | 🟢 REAL | System seed config   | 1.0.0 | 2026-01-15 |
| `auto_import.js`               | 🟢 REAL | Auto-import script   | 1.0.0 | 2026-01-15 |
| `clientes_crm_v2.json`         | 🟢 REAL | Dados CRM v2         | 1.0.0 | 2026-01-15 |
| `clientes_import_scraper.json` | 🟢 REAL | Dados import scraper | 1.0.0 | 2026-01-15 |

> **Nota:** `6.integrations/` foi esvaziada após cleanup (2026-02-07). Todas as integrações estão em `5.tentacles/` com arquitetura parent/children.

---

## 🐙 Tentacles (5.tentacles/) - COMPLETO

> **Arquitetura DDD Panda:** Cada Tentacle é um **HUB isolado**. Se um falhar, não afeta os outros.
>
> ```text
> 🐼 PANDA CORE
>     ├── 🧷 social/        (HUB 1) → Se WhatsApp falhar, Twitter continua
>     ├── 🧷 google/        (HUB 2) → Se Drive falhar, Sheets continua
>     ├── 🧷 trading/       (HUB 3) → Isolado dos demais
>     ├── 🧷 distribution/  (HUB 4) → Steam independente de PWA
>     └── 🧷 brain/         (HUB 5) → Gemini falhar não afeta LocalLLM
> ```

### Brain Tentacle

| Arquivo              | Caminho           | Status    | Descrição          | v     | Mod        |
| -------------------- | ----------------- | --------- | ------------------ | ----- | ---------- |
| `pf.brain-parent.js` | `brain/`          | ⚪ STATIC | Brain orchestrator | 1.0.0 | 2026-01-26 |
| `gemini.js`          | `brain/children/` | 🔵 HYBRID | Gemini AI          | 1.0.0 | 2026-02-06 |
| `gpu.js`             | `brain/children/` | 🟡 MOCK   | GPU compute        | 0.1.0 | 2026-01-26 |
| `local-llm.js`       | `brain/children/` | 🔵 HYBRID | Local LLM (Ollama) | 1.0.0 | 2026-01-26 |

### P2P Tentacle

| Arquivo            | Caminho | Status    | Descrição           | v     | Mod        |
| ------------------ | ------- | --------- | ------------------- | ----- | ---------- |
| `pf.p2p-parent.js` | `p2p/`  | ⚪ STATIC | 🌐 P2P orchestrator | 1.0.0 | 2026-01-26 |

### Distribution Tentacle

| Arquivo                     | Caminho                  | Status    | Descrição    | v     | Mod        |
| --------------------------- | ------------------------ | --------- | ------------ | ----- | ---------- |
| `pf.distribution-parent.js` | `distribution/`          | 🟢 REAL   | Orchestrator | 1.0.0 | 2026-01-26 |
| `google-play.js`            | `distribution/children/` | 🔵 HYBRID | Play Store   | 1.0.0 | 2026-01-26 |
| `steam.js`                  | `distribution/children/` | 🟡 MOCK   | Steam        | 0.1.0 | 2026-01-15 |
| `pwa.js`                    | `distribution/children/` | 🔵 HYBRID | PWA deploy   | 1.0.0 | 2026-01-26 |
| `vscode.js`                 | `distribution/children/` | 🟡 MOCK   | VSCode ext   | 0.1.0 | 2026-01-15 |
| `npm.js`                    | `distribution/children/` | 🟡 MOCK   | NPM publish  | 0.1.0 | 2026-01-15 |
| `arcade.js`                 | `distribution/children/` | 🟡 MOCK   | Arcade       | 0.1.0 | 2026-01-15 |
| `itch.js`                   | `distribution/children/` | 🟡 MOCK   | Itch.io      | 0.1.0 | 2026-01-15 |

### Education Tentacle

| Arquivo                  | Caminho               | Status    | Descrição        | v     | Mod        |
| ------------------------ | --------------------- | --------- | ---------------- | ----- | ---------- |
| `pf.education-parent.js` | `education/`          | ⚪ STATIC | Orchestrator     | 1.0.0 | 2026-01-26 |
| `kiwify.js`              | `education/children/` | 🟡 MOCK   | Kiwify webhooks  | 0.1.0 | 2026-01-26 |
| `hotmart.js`             | `education/children/` | 🟡 MOCK   | Hotmart webhooks | 0.1.0 | 2026-01-26 |
| `eduzz.js`               | `education/children/` | 🟡 MOCK   | Eduzz webhooks   | 0.1.0 | 2026-01-26 |

### GitHub Tentacle

| Arquivo               | Caminho            | Status    | Descrição      | v     | Mod        |
| --------------------- | ------------------ | --------- | -------------- | ----- | ---------- |
| `pf.github-parent.js` | `github/`          | 🟢 REAL   | Orchestrator   | 1.0.0 | 2026-01-26 |
| `actions.js`          | `github/children/` | 🔵 HYBRID | GitHub Actions | 1.0.0 | 2026-02-06 |
| `database.js`         | `github/children/` | 🟡 MOCK   | GitHub DB      | 0.1.0 | 2026-01-15 |
| `pages.js`            | `github/children/` | 🟡 MOCK   | GitHub Pages   | 0.1.0 | 2026-01-15 |

### Google Tentacle

| Arquivo               | Caminho            | Status  | Descrição           | v     | Mod        |
| --------------------- | ------------------ | ------- | ------------------- | ----- | ---------- |
| `pf.google-parent.js` | `google/`          | 🟢 REAL | Orchestrator        | 1.0.0 | 2026-01-26 |
| `calendar.js`         | `google/children/` | 🟢 REAL | Google Calendar     | 1.0.0 | 2026-01-26 |
| `colab.js`            | `google/children/` | 🟢 REAL | Google Colab        | 1.0.0 | 2026-02-06 |
| `docs.js`             | `google/children/` | 🟢 REAL | Google Docs         | 1.0.0 | 2026-01-26 |
| `drive.js`            | `google/children/` | 🟢 REAL | Google Drive        | 1.0.0 | 2026-01-26 |
| `gmail.js`            | `google/children/` | 🟢 REAL | Gmail               | 1.0.0 | 2026-01-26 |
| `sheets.js`           | `google/children/` | 🟢 REAL | Google Sheets       | 1.0.0 | 2026-01-26 |
| `youtube.js`          | `google/children/` | 🟢 REAL | YouTube Data API v3 | 1.0.0 | 2026-01-26 |

### Social Tentacle

| Arquivo               | Caminho            | Status    | Descrição         | v     | Mod        |
| --------------------- | ------------------ | --------- | ----------------- | ----- | ---------- |
| `pf.social-parent.js` | `social/`          | ⚪ STATIC | Orchestrator      | 1.0.0 | 2026-01-26 |
| `meta.js`             | `social/children/` | 🟡 MOCK   | Meta (FB+IG)      | 0.1.0 | 2026-01-15 |
| `twitter.js`          | `social/children/` | 🟡 MOCK   | Twitter/X         | 0.1.0 | 2026-01-15 |
| `whatsapp.js`         | `social/children/` | 🔵 HYBRID | WhatsApp          | 1.0.0 | 2026-01-26 |
| `youtube.js`          | `social/children/` | 🟡 MOCK   | YouTube (mock+PC) | 0.1.0 | 2026-01-15 |

### Trading Tentacle

| Arquivo                | Caminho             | Status    | Descrição    | v     | Mod        |
| ---------------------- | ------------------- | --------- | ------------ | ----- | ---------- |
| `pf.trading-parent.js` | `trading/`          | ⚪ STATIC | Orchestrator | 1.0.0 | 2026-01-15 |
| `ctrader.js`           | `trading/children/` | 🟡 MOCK   | cTrader      | 0.1.0 | 2026-01-15 |

### Monitor

| Arquivo                  | Caminho    | Status    | Descrição        | v     | Mod        |
| ------------------------ | ---------- | --------- | ---------------- | ----- | ---------- |
| `pf.tentacle-monitor.js` | `monitor/` | ⚪ STATIC | Tentacle Monitor | 1.0.0 | 2026-02-06 |

---

## 🌐 HTML (18 arquivos)

### Main

| Arquivo                  | Descrição          | v     | Mod        |
| ------------------------ | ------------------ | ----- | ---------- |
| `PandaFactory.html`      | App principal      | 6.5.0 | 2026-02-13 |
| `index.html`             | Landing page       | 1.0.0 | 2026-01-15 |
| `11.pf-app/index.html`   | Vite entry point   | 1.0.0 | 2026-01-26 |
| `founder-dashboard.html` | Dashboard fundador | 1.0.0 | 2026-02-06 |

### Pitch Decks

| Arquivo              | Descrição     | v     | Mod        |
| -------------------- | ------------- | ----- | ---------- |
| `pitch-deck.html`    | Pitch (PT-BR) | 1.0.0 | 2026-01-15 |
| `pitch-deck-pt.html` | Pitch PT      | 1.0.0 | 2026-01-15 |
| `pitch-deck-en.html` | Pitch EN      | 1.0.0 | 2026-01-15 |

### Components (4.ui/)

| Arquivo                       | Descrição            | v     | Mod        |
| ----------------------------- | -------------------- | ----- | ---------- |
| `Comp_AppDock.html`           | Dock de apps         | 1.0.0 | 2026-01-26 |
| `Comp_Sidebar.html`           | Sidebar principal    | 1.0.0 | 2026-01-15 |
| `Comp_HeaderStatus.html`      | Header com status    | 1.0.0 | 2026-01-15 |
| `Comp_DevToolsDock.html`      | DevTools dock        | 1.0.0 | 2026-01-26 |
| `Comp_SettingsModal.html`     | Modal de settings    | 1.0.0 | 2026-01-15 |
| `Comp_LoginOverlay.html`      | Overlay de login     | 1.0.0 | 2026-01-15 |
| `Comp_TentacleMonitor.html`   | Monitor de tentacles | 1.0.0 | 2026-02-06 |
| `Comp_TreasuryDashboard.html` | Dashboard treasury   | 1.0.0 | 2026-02-06 |

### Modules (4.ui/4.3.modules/)

| Arquivo                      | Descrição         | v     | Mod        |
| ---------------------------- | ----------------- | ----- | ---------- |
| `Mod_Analytics_View.html`    | Módulo Analytics  | 0.1.0 | 2026-01-15 |
| `Mod_Store_View.html`        | Módulo Store      | 0.1.0 | 2026-01-26 |
| `Mod_Founder_Dashboard.html` | Founder Dashboard | 1.0.0 | 2026-02-06 |

### React Frontend (11.pf-app/src/) — Padronizado PF\*

> **Build:** Vite 5.4.21 | 933 modules | 1.34MB JS + 153KB CSS

#### Core Layout

| Arquivo               | Descrição                                              | v     | Mod        |
| --------------------- | ------------------------------------------------------ | ----- | ---------- |
| `App.jsx`             | Container principal v6.5 (+GasometerPanel, Store v3.2) | 6.5.0 | 2026-02-13 |
| `main.jsx`            | Entry point React                                      | 1.0.0 | 2026-01-26 |
| `PFCanvas.jsx`        | TLDraw canvas infinito + WelcomeOverlay                | 1.0.0 | 2026-02-06 |
| `PFDock.jsx`          | Dock esquerda v6.2 (🎨📁🐼⚙️🛠️ — 5 itens, lean dock)   | 6.2.0 | 2026-02-13 |
| `PFNotifications.jsx` | Centro de notificações v1.0 (slide-in panel, 4 tipos)  | 1.0.0 | 2026-01-26 |
| `PFStatusBar.jsx`     | Header: logo, status pills, energy, treasury           | 1.0.0 | 2026-02-06 |
| `PFHeader.jsx`        | Header alternativo                                     | 1.0.0 | 2026-01-26 |
| `PFRightToolbar.jsx`  | Ferramentas de desenho + DevTools                      | 1.0.0 | 2026-02-06 |
| `PFChat.jsx`          | Floating AI Chat + external toggle event               | 1.0.0 | 2026-02-06 |

#### Modals

| Arquivo                  | Descrição                                                    | v     | Mod        |
| ------------------------ | ------------------------------------------------------------ | ----- | ---------- |
| `PFSettings.jsx`         | Configurações (10 seções)                                    | 1.0.0 | 2026-02-06 |
| `PFStore.jsx`            | Loja Medusa v3.2 (12 extensões, EN, +Kiwify/Hotmart/Landing) | 3.2.0 | 2026-02-13 |
| `PFCatalog.jsx`          | Catálogo de plugins instalados                               | 1.0.0 | 2026-01-26 |
| `PFFounderDashboard.jsx` | Dashboard Founder (307 linhas)                               | 1.0.0 | 2026-02-06 |
| `PFFounderModal.jsx`     | Modal wrapper do Dashboard                                   | 1.0.0 | 2026-02-06 |
| `PFFounderPopout.jsx`    | Pop-out Document PiP                                         | 1.0.0 | 2026-02-06 |
| `PFCheckoutModal.jsx`    | Checkout v2.0 (Medusa type badge, ratings, USD-FIRST)        | 2.0.0 | 2026-02-03 |
| `PFLoginGate.jsx`        | Gate de autenticação v8.0 (6 features, stats, trust signals) | 8.0.0 | 2026-02-15 |
| `PFLoginModal.jsx`       | Modal de login                                               | 1.0.0 | 2026-01-26 |
| `PFDevModePanel.jsx`     | DevTools (Console, MCP, API Tester, Publish Pipeline)        | 1.0.0 | 2026-02-06 |
| `PFDefendPanel.jsx`      | 🛡️ Panda Defend — Security dashboard (Score, Rules, Actions) | 1.0.0 | 2026-02-06 |
| `PFCouncilPanel.jsx`     | 🏛️ Panda Council (PAT Governance)                            | 1.0.0 | 2026-02-06 |
| `PFBundleCreator.jsx`    | Criador de bundles                                           | 1.0.0 | 2026-01-26 |
| `PFPluginEditor.jsx`     | Editor de panda.mcp.json                                     | 1.0.0 | 2026-02-06 |
| `PFDefendDashboard.jsx`  | Dashboard de segurança                                       | 1.0.0 | 2026-02-06 |
| `PFPanicButton.jsx`      | Botão de pânico                                              | 1.0.0 | 2026-02-06 |
| `PFFinancePanel.jsx`     | Painel financeiro                                            | 1.0.0 | 2026-02-06 |
| `PFGasometerPanel.jsx`   | ⛽ Gasômetro — GAS usage dashboard v1.0                      | 1.0.0 | 2026-02-08 |
| `PFWindowManager.jsx`    | Multi-window FlexLayout                                      | 1.0.0 | 2026-02-06 |
| `PFEmptyCanvas.jsx`      | Overlay canvas vazio (Welcome alternative)                   | 1.0.0 | 2026-02-06 |
| `PFMiningPanel.jsx`      | ⛏️ Painel de mineração PAT                                   | 1.0.0 | 2026-01-26 |
| `PFProductDetail.jsx`    | Detalhes do produto (PDP) na Store                           | 1.0.0 | 2026-02-03 |
| `PFWelcomeWizard.jsx`    | Wizard de boas-vindas v2 (✕ close, FINISH ✓, ESC/arrows)     | 2.0.0 | 2026-02-15 |

#### Hooks

| Arquivo                   | Descrição             | v     | Mod        |
| ------------------------- | --------------------- | ----- | ---------- |
| `useAuth.jsx`             | Autenticação          | 1.0.0 | 2026-01-26 |
| `useFirebase.js`          | Firebase RTDB + Auth  | 1.0.0 | 2026-01-26 |
| `useGAS.js`               | GAS endpoints         | 1.0.0 | 2026-01-26 |
| `useHealthStatus.js`      | Health polling        | 1.0.0 | 2026-02-06 |
| `useFounderMetrics.js`    | Métricas Founder      | 1.0.0 | 2026-02-06 |
| `useMarketplace.js`       | Marketplace hooks     | 1.0.0 | 2026-01-26 |
| `useCheckout.js`          | Checkout hooks        | 1.0.0 | 2026-01-26 |
| `useLandingPage.js`       | Landing page hooks    | 1.0.0 | 2026-01-26 |
| `useGasometer.js`         | ⛽ GAS quota monitor  | 1.0.0 | 2026-02-06 |
| `useKeyboardShortcuts.js` | ⌨️ Atalhos de teclado | 1.0.0 | 2026-02-06 |

#### Services

| Arquivo        | Descrição         | v     | Mod        |
| -------------- | ----------------- | ----- | ---------- |
| `uiContext.js` | Context global UI | 1.0.0 | 2026-01-26 |

#### Styles

| Arquivo                  | Descrição                              | v     | Mod        |
| ------------------------ | -------------------------------------- | ----- | ---------- |
| `pf.css`                 | Design system principal (~2700 linhas) | 6.6.0 | 2026-02-15 |
| `PFSettings.css`         | Estilos Settings modal                 | 1.0.0 | 2026-02-06 |
| `PFDevModePanel.css`     | Estilos DevTools                       | 1.0.0 | 2026-02-06 |
| `PFCouncilPanel.css`     | Estilos Panda Council panel            | 1.0.0 | 2026-02-06 |
| `PFFounderDashboard.css` | Estilos Founder                        | 1.0.0 | 2026-02-06 |
| `PFFounderModal.css`     | Estilos modal Founder                  | 1.0.0 | 2026-02-06 |
| `PFFounderPopout.css`    | Estilos popout                         | 1.0.0 | 2026-02-06 |
| `PFCheckoutModal.css`    | Estilos checkout                       | 1.0.0 | 2026-02-03 |
| `PFLoginModal.css`       | Estilos login                          | 1.0.0 | 2026-01-26 |
| `PFBundleCreator.css`    | Estilos bundle                         | 1.0.0 | 2026-01-26 |
| `PFDefendDashboard.css`  | Estilos segurança                      | 1.0.0 | 2026-02-06 |
| `PFPanicButton.css`      | Estilos panic                          | 1.0.0 | 2026-02-06 |
| `PFFinancePanel.css`     | Estilos finance                        | 1.0.0 | 2026-02-06 |
| `PFPluginEditor.css`     | Estilos manifest editor                | 1.0.0 | 2026-02-06 |
| `PFGasometerPanel.css`   | Estilos Gasômetro                      | 1.0.0 | 2026-02-08 |
| `PFEmptyCanvas.css`      | Estilos canvas vazio                   | 1.0.0 | 2026-02-06 |
| `PFNotifications.css`    | Estilos notificações                   | 1.0.0 | 2026-01-26 |
| `PFProductDetail.css`    | Estilos PDP                            | 1.0.0 | 2026-02-03 |
| `PFWelcomeWizard.css`    | Estilos wizard v2 (close+finish btns)  | 2.0.0 | 2026-02-15 |

---

## 🎨 CSS (css/)

> ⚠️ **Nota:** O design system principal foi migrado de `10.assets/css/pf.theme.css` para `11.pf-app/src/styles/pf.css` (1961 linhas, namespace `--pf-*`).
> O arquivo legacy `pf.theme.css` permanece em `10.assets/css/` como referência.

| Arquivo        | Caminho          | Status    | Descrição                   | v     | Mod        |
| -------------- | ---------------- | --------- | --------------------------- | ----- | ---------- |
| `pf.theme.css` | `10.assets/css/` | ⚪ LEGACY | Legacy theme (pré-migração) | 1.0.0 | 2026-01-15 |

---

## ⚙️ Config Files

### Root Project

| Arquivo                       | Caminho | Descrição                                | v     | Mod        |
| ----------------------------- | ------- | ---------------------------------------- | ----- | ---------- |
| `manifest.json`               | `/`     | PWA manifest                             | 1.0.0 | 2026-01-15 |
| `package.json`                | `/`     | NPM dependencies (root)                  | 1.0.0 | 2026-02-06 |
| `package-lock.json`           | `/`     | NPM lock (root)                          | 1.0.0 | 2026-02-06 |
| `jsconfig.json`               | `/`     | JS/TS config                             | 1.0.0 | 2026-01-15 |
| `PandaFactory.code-workspace` | `/`     | VS Code workspace                        | 1.0.0 | 2026-01-15 |
| `sw.js`                       | `/`     | Service Worker                           | 1.0.0 | 2026-01-15 |
| `_build_shell.ps1`            | `/`     | Build script PowerShell                  | 1.0.0 | 2026-01-15 |
| `_config.yml`                 | `/`     | GitHub Pages / YAML config               | 1.0.0 | 2026-01-15 |
| `.env`                        | `/`     | 🔒 Variáveis de ambiente (não commitar!) | 1.0.0 | 2026-01-15 |
| `.gitignore`                  | `/`     | Git ignore rules                         | 1.0.0 | 2026-02-14 |
| `.antigravityignore`          | `/`     | Antigravity IDE ignore                   | 1.0.0 | 2026-02-14 |
| `README.md`                   | `/`     | README principal do projeto              | 1.0.0 | 2026-01-15 |

> 🔒 **Segurança:** `.env` está listado como referência. Seu conteúdo é sensível e DEVE estar no `.gitignore`.

### 11.pf-app Config

| Arquivo             | Caminho      | Descrição              | v     | Mod        |
| ------------------- | ------------ | ---------------------- | ----- | ---------- |
| `index.html`        | `11.pf-app/` | Vite entry HTML        | 1.0.0 | 2026-02-06 |
| `package.json`      | `11.pf-app/` | NPM dependencies (app) | 1.0.0 | 2026-02-06 |
| `package-lock.json` | `11.pf-app/` | NPM lock (app)         | 1.0.0 | 2026-02-06 |
| `vite.config.js`    | `11.pf-app/` | Vite build config      | 1.0.0 | 2026-02-06 |

### 00.credentials

| Arquivo     | Caminho           | Descrição                 | v     | Mod        |
| ----------- | ----------------- | ------------------------- | ----- | ---------- |
| `README.md` | `00.credentials/` | Instruções de credenciais | 1.0.0 | 2026-01-15 |

---

## 🐼 Moltbook Integration (12.moltbook/) — ⚠️ ARQUIVADO

> **Status:** Diretório movido para `_backup_pre_numbered/moltbook/`. Os arquivos listados abaixo existem apenas no backup.

| Arquivo                           | Descrição            | v     | Mod        |
| --------------------------------- | -------------------- | ----- | ---------- |
| `credentials.json`                | Credenciais Moltbook | 1.0.0 | 2026-01-15 |
| `MOLTBOOK_library.md`             | Biblioteca           | 1.0.0 | 2026-01-15 |
| `MOLTBOOK_PROTOCOL.md`            | Protocolo            | 1.0.0 | 2026-01-15 |
| `README_PF_MOLTBOOK.md`           | README               | 1.0.0 | 2026-01-15 |
| `temp_post.json`                  | Post temporário      | 1.0.0 | 2026-01-15 |
| `skills/12.moltbook/SKILL.md`     | Skill definition     | 1.0.0 | 2026-01-15 |
| `skills/12.moltbook/HEARTBEAT.md` | Heartbeat skill      | 1.0.0 | 2026-01-15 |
| `skills/12.moltbook/MESSAGING.md` | Messaging skill      | 1.0.0 | 2026-01-15 |
| `skills/12.moltbook/package.json` | Skill package        | 1.0.0 | 2026-01-15 |

---

## 🛠️ Scripts (9.tools/) - 39 arquivos

### Automação

| Arquivo                       | Descrição             | v     | Mod        |
| ----------------------------- | --------------------- | ----- | ---------- |
| `publish-sdk.ps1`             | Publish SDK (Windows) | 1.0.0 | 2026-01-26 |
| `publish-sdk.sh`              | Publish SDK (Unix)    | 1.0.0 | 2026-01-26 |
| `scraper_guia_automatico.py`  | Web scraper           | 1.0.0 | 2026-01-15 |
| `extrair_clientes.py`         | Extrator clientes     | 1.0.0 | 2026-01-15 |
| `importar_guia_construcao.py` | Importador            | 1.0.0 | 2026-01-15 |

### Refactoring

| Arquivo                 | Descrição        | v     | Mod        |
| ----------------------- | ---------------- | ----- | ---------- |
| `cleanup_ui.py`         | UI cleanup       | 1.0.0 | 2026-01-15 |
| `complete_cleanup.py`   | Complete cleanup | 1.0.0 | 2026-01-15 |
| `extract_core.py`       | Extract core     | 1.0.0 | 2026-01-15 |
| `extract_modals.py`     | Extract modals   | 1.0.0 | 2026-01-15 |
| `extract_modules.py`    | Extract modules  | 1.0.0 | 2026-01-15 |
| `extract_modules_v2.py` | Extract v2       | 1.0.0 | 2026-01-15 |
| `final_cleanup.py`      | Final cleanup    | 1.0.0 | 2026-01-15 |

### Fixes

| Arquivo                 | Descrição       | v     | Mod        |
| ----------------------- | --------------- | ----- | ---------- |
| `fix_header.py`         | Fix header      | 1.0.0 | 2026-01-15 |
| `fix_omni_bar.py`       | Fix omni bar    | 1.0.0 | 2026-01-15 |
| `fix_omni_layout.py`    | Fix omni layout | 1.0.0 | 2026-01-15 |
| `fix_settings_modal.py` | Fix settings    | 1.0.0 | 2026-01-15 |

### Injections

| Arquivo                     | Descrição       | v     | Mod        |
| --------------------------- | --------------- | ----- | ---------- |
| `inject_dock_fix.py`        | Inject dock fix | 1.0.0 | 2026-01-15 |
| `inject_firebase_bridge.py` | Inject Firebase | 1.0.0 | 2026-01-15 |
| `inject_settings_modal.py`  | Inject settings | 1.0.0 | 2026-01-15 |
| `inject_status_monitor.py`  | Inject monitor  | 1.0.0 | 2026-01-15 |
| `inject_theme_fix.py`       | Inject theme    | 1.0.0 | 2026-01-15 |

### UI/Visual Updates

| Arquivo                   | Descrição                    | v     | Mod        |
| ------------------------- | ---------------------------- | ----- | ---------- |
| `add_lang_switcher.py`    | Adicionar switcher de idioma | 1.0.0 | 2026-02-06 |
| `organize_relatorio.py`   | Organizar relatório          | 1.0.0 | 2026-01-15 |
| `refactor_omni.py`        | Refatorar omnibar            | 1.0.0 | 2026-02-06 |
| `refine_visuals.py`       | Refinar visuais              | 1.0.0 | 2026-02-06 |
| `release_window.py`       | Release window manager       | 1.0.0 | 2026-02-06 |
| `restore_fab_logic.py`    | Restaurar lógica FAB         | 1.0.0 | 2026-02-06 |
| `update_dock.py`          | Atualizar dock               | 1.0.0 | 2026-02-06 |
| `update_omni_features.py` | Atualizar features omni      | 1.0.0 | 2026-02-06 |

---

## 🔧 Tools (9.tools/)

| Arquivo                 | Descrição           | v     | Mod        |
| ----------------------- | ------------------- | ----- | ---------- |
| `backup_auto.bat`       | Auto backup         | 1.0.0 | 2026-01-15 |
| `Importar_Clientes.bat` | Importar clientes   | 1.0.0 | 2026-01-15 |
| `Iniciar_CRM.bat`       | Iniciar CRM         | 1.0.0 | 2026-01-15 |
| `INICIAR_SISTEMA.bat`   | Iniciar sistema     | 1.0.0 | 2026-01-15 |
| `panda_orchestrator.py` | Orchestrator Python | 1.0.0 | 2026-01-15 |
| `requirements.txt`      | Python requirements | 1.0.0 | 2026-01-15 |

---

## 🖼️ Assets (10.assets/)

> **Nota:** O projeto usa apenas **2 logos reais**: Panda Store (GitHub) e Panda Logo (circular).
> O logo circular é derivado em múltiplos formatos (favicon, ícones PWA, JPG/PNG).

### Logos (10.assets/logo/)

| Arquivo                                       | Descrição               | v     | Mod        |
| --------------------------------------------- | ----------------------- | ----- | ---------- |
| `logo git hub.png`                            | 🐼 Panda Logo (GitHub)  | 1.0.0 | 2026-01-15 |
| `logo STORE git hub2.png`                     | 🏪 Panda Store (GitHub) | 1.0.0 | 2026-01-15 |
| `panda_logo.jpg`                              | Logo circular JPG       | 1.0.0 | 2026-01-15 |
| `Gemini_Generated_Image_56rqs556rqs556rq.jpg` | AI Generate JPG         | 1.0.0 | 2026-01-15 |
| `Gemini_Generated_Image_56rqs556rqs556rq.png` | AI Generate PNG         | 1.0.0 | 2026-01-15 |

### Imagens Raíz (10.assets/)

| Arquivo              | Descrição                      | v     | Mod        |
| -------------------- | ------------------------------ | ----- | ---------- |
| `logo.png`           | Logo principal PNG             | 1.0.0 | 2026-01-15 |
| `panda_logo.jpg`     | Logo circular JPG (derivado)   | 1.0.0 | 2026-01-15 |
| `panda_logo.png`     | Logo circular PNG              | 1.0.0 | 2026-01-15 |
| `panda_logo_new.jpg` | Logo atualizada JPG            | 1.0.0 | 2026-01-15 |
| `favicon.jpg`        | Favicon JPG (derivado do logo) | 1.0.0 | 2026-01-15 |
| `crm_icon.png`       | Ícone CRM                      | 1.0.0 | 2026-01-15 |
| `import_icon.png`    | Ícone importação               | 1.0.0 | 2026-01-15 |
| `loading.jpg`        | Loading splash                 | 1.0.0 | 2026-01-15 |

### Ícones PWA (10.assets/icons/)

| Arquivo            | Descrição                  | v     | Mod        |
| ------------------ | -------------------------- | ----- | ---------- |
| `favicon.ico`      | Favicon ICO                | 1.0.0 | 2026-01-15 |
| `favicon.png`      | Favicon PNG                | 1.0.0 | 2026-01-15 |
| `icon-192x192.png` | PWA icon 192px             | 1.0.0 | 2026-01-15 |
| `icon-512x512.png` | PWA icon 512px             | 1.0.0 | 2026-01-15 |
| `panda_new.jpg`    | Logo atualizada (derivado) | 1.0.0 | 2026-01-15 |

### Páginas Estáticas (10.assets/pages/)

| Arquivo                  | Descrição              | v     | Mod        |
| ------------------------ | ---------------------- | ----- | ---------- |
| `founder-dashboard.html` | Founder Dashboard HTML | 1.0.0 | 2026-02-06 |
| `pitch-deck.html`        | Pitch Deck (original)  | 1.0.0 | 2026-01-15 |
| `pitch-deck-en.html`     | Pitch Deck (English)   | 1.0.0 | 2026-01-15 |
| `pitch-deck-pt.html`     | Pitch Deck (Português) | 1.0.0 | 2026-01-15 |

---

## 📦 Dependências (Não listadas individualmente)

| Pasta                     | Conteúdo      | Regenerar               |
| ------------------------- | ------------- | ----------------------- |
| `node_modules/`           | ~50k NPM deps | `npm install`           |
| `11.pf-app/node_modules/` | Jam deps      | `cd 11.pf-app && npm i` |
| `7.7.rust-agent/target/`  | Build cache   | `cargo build`           |

---

## 🗄️ \_archive/ — IGNORADO

> O diretório `_archive/` contém ~38 arquivos legados (backups, workflows deprecados, assets duplicados).
> Está incluído no `.pandaignore` e **NÃO faz parte do código ativo**.
> Para auditoria: existem subpastas `legacy/`, `backups/`, `exports_old/`, `agent_workflows_deprecated/`.

---

> 📖 **Mantido por:** Panda Council (PAT)
> **Última atualização:** 2026-02-15 v4.1.0

---

## Changelog

| Versao | Data       | Alteracoes                                                              |
| ------ | ---------- | ----------------------------------------------------------------------- |
| 4.1.0  | 2026-02-15 | LoginGate v8.0, Wizard v2.0, pf.css v6.6 — version+mod bumps            |
| 4.0.0  | 2026-02-14 | Auditoria fs completa: +31 MISSING, Rust Agent PLANNED, .env/.gitignore |
| 3.0.0  | 2026-02-14 | Per-file versioning (v+Mod) em TODAS as tabelas, governança MCP         |
| 2.6.0  | 2026-02-14 | MCP header, correcao contagens JSX/CSS/MD, +8 arquivos faltantes        |
| 2.5.0  | 2026-02-10 | Versao anterior com contagens desatualizadas                            |
| 2.0.0  | 2026-02-06 | Adicao de Rust files, reorganizacao                                     |
| 1.0.0  | 2026-01-15 | Criacao do catalogo inicial                                             |
