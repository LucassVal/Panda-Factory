---
tool_context: panda/files
description: Catálogo de arquivos — auditado 2026-03-03 LP05 inline→CSS migration
version: 7.5.0
updated: 2026-03-03
ssot: CONTEXT.md §5 (Sistema Montesquieu)
cross_ref: [PF_MASTER_ARCHITECTURE.md, PF_SDK_REFERENCE.md, PF_UI_REFERENCE.md]
---

# 📁 PF_FILE_REGISTRY - Catálogo de Arquivos

> **Versão:** 7.5.0 | **Atualizado:** 2026-03-03 (LP05 inline styles → CSS files)
> **Propósito:** Inventário COMPLETO de todos os arquivos do Panda Factory (auditado via fs scan)

---

## 📊 Resumo Auditado (2026-02-19)

> ⚠️ Contagens REAIS verificadas via `git ls-files` + `Get-ChildItem` em 2026-02-19.
> PLANNED/MOCK files estão marcados inline — contam no total mas com ⚠️.
> 🟢 = PUBLIC (tracked no GitHub) | 🔒 = PRIVATE (gitignored)

| Extensão | Qtd | Domínio Principal          | Nota                       |
| -------- | --- | -------------------------- | -------------------------- |
| `.gs`    | 20  | Backend GAS                | 10 core + 10 domains       |
| `.rs`    | 8   | Rust Agent                 | ⚠️ MOCKS (Phase 2)         |
| `.md`    | 30  | Documentação + README      | 20 PF\_ + 10 outros        |
| `.js`    | 79  | Frontend/SDK/Tentacles     | +facebook-messenger+tiktok |
| `.jsx`   | 37  | React Components           | 35 PF + i18n + useAuth     |
| `.html`  | 24  | UI/Components/Modules      | +CRM+IG+WA+Agenda+PDV+Est  |
| `.css`   | 23  | Estilos (+ pf.css 4423 ln) | +PFDefendPanel+MiningPanel |
| `.json`  | 11  | Config                     |                            |
| `.py`    | 28  | Scripts/Automação          |                            |
| imagens  | 24  | Logos, ícones, favicons    |                            |
| outros   | 19  | .bat, .ps1, .sh, .yml, etc |                            |

---

## 🔧 Backend GAS (18 arquivos — 10 core + 8 domains)

### Core

| Arquivo                  | Caminho           | Descrição                                                                                       | v     | Mod        |
| ------------------------ | ----------------- | ----------------------------------------------------------------------------------------------- | ----- | ---------- |
| `PF_Dispatcher.gs`       | `1.core/1.1.gas/` | Router principal (doGet/doPost) + Brain AI + Store + Wallet RTDB + rtdbFetch() + Scoped Locking | 2.0.0 | 2026-02-22 |
| `PF_Config.gs`           | `1.core/1.1.gas/` | Configurações globais (endpoint URL v22)                                                        | 1.2.0 | 2026-02-23 |
| `appsscript.json`        | `1.core/1.1.gas/` | GAS manifest (access: ANYONE_ANONYMOUS)                                                         | 1.1.0 | 2026-02-23 |
| `PF_Setup.gs`            | `1.core/1.1.gas/` | Setup & bootstrap (Stripe keys, env)                                                            | 1.0.0 | 2026-02-20 |
| `PF_App_Init.gs`         | `1.core/1.1.gas/` | Inicialização do app                                                                            | 1.0.0 | 2026-01-15 |
| `PF_Core_AI.gs`          | `1.core/1.1.gas/` | Dispatcher AI multimodal                                                                        | 1.0.0 | 2026-01-26 |
| `PF_Core_Oracle.gs`      | `1.core/1.1.gas/` | Cotação USD/BRL                                                                                 | 1.0.0 | 2026-01-15 |
| `PF_Core_Webhooks.gs`    | `1.core/1.1.gas/` | Webhooks B2B (Kiwify, Hotmart, Stripe)                                                          | 1.1.0 | 2026-02-19 |
| `PF_Brain_Core.gs`       | `1.core/1.1.gas/` | Core do Brain AI                                                                                | 1.0.0 | 2026-01-26 |
| `PF_Moltbook.gs`         | `1.core/1.1.gas/` | Integração Moltbook                                                                             | 1.0.0 | 2026-01-15 |
| `PF_PAT_Core.gs`         | `1.core/1.1.gas/` | Panda Council (Governança)                                                                      | 1.0.0 | 2026-02-03 |
| `PF_Heartbeat_Agents.gs` | `1.core/1.1.gas/` | 💓 6 monitoring agents + cron + log cleanup                                                     | 1.0.0 | 2026-02-21 |

### Finance

| Arquivo        | Caminho                       | Descrição                                | v     | Mod        |
| -------------- | ----------------------------- | ---------------------------------------- | ----- | ---------- |
| `PF_Wallet.gs` | `1.core/1.2.domains/finance/` | Carteira Panda Coin (RTDB via rtdbFetch) | 1.1.0 | 2026-02-22 |
| `PF_Crypto.gs` | `1.core/1.2.domains/finance/` | Pagamentos crypto (USDC/SOL)             | 1.0.0 | 2026-01-26 |
| `PF_Fiat.gs`   | `1.core/1.2.domains/finance/` | Pagamentos fiat (Stripe/PIX)             | 1.0.0 | 2026-01-26 |

### Store

| Arquivo             | Caminho                     | Descrição                     | v     | Mod        |
| ------------------- | --------------------------- | ----------------------------- | ----- | ---------- |
| `PF_Sales.gs`       | `1.core/1.2.domains/store/` | Vendas e Split (52/25/15/5/3) | 1.1.0 | 2026-02-18 |
| `PF_Registry.gs`    | `1.core/1.2.domains/store/` | Registro de módulos           | 1.0.0 | 2026-01-15 |
| `PF_Marketplace.gs` | `1.core/1.2.domains/store/` | Medusa Store backend          | 1.0.0 | 2026-01-26 |

### Automation & P2P

| Arquivo       | Caminho                          | Descrição                        | v     | Mod        |
| ------------- | -------------------------------- | -------------------------------- | ----- | ---------- |
| `PF_Bots.gs`  | `1.core/1.2.domains/automation/` | Automação de tarefas             | 1.0.0 | 2026-01-15 |
| `PF_P2P.gs`   | `1.core/1.2.domains/p2p/`        | 🌐 Node registry, tasks, rewards | 1.1.0 | 2026-02-18 |
| `PF_Usage.gs` | `1.core/1.2.domains/billing/`    | 📈 Usage tracking & metering     | 1.0.0 | 2026-02-18 |

### Payment SDKs (1.core/1.3.sdks/)

| Arquivo            | Status  | Descrição                               | v     | Mod        |
| ------------------ | ------- | --------------------------------------- | ----- | ---------- |
| `SDK_PagSeguro.js` | 🟡 MOCK | PagSeguro payment SDK                   | 0.1.0 | 2026-01-15 |
| `SDK_Stripe.js`    | 🟢 REAL | Stripe Checkout + webhook (PC packages) | 1.0.0 | 2026-02-20 |

---

## 🦀 Rust Agent (8 .rs + Cargo.toml) — ⚠️ PLANNED (not implemented)

> **Status:** Todos os arquivos são **MOCKS** criados como placeholders.
> O Rust Agent está planejado para Phase 2 2026.
>
> ⚠️ **Nota:** Existem DUAS pastas no disco: `7.rust-agent/` (código real/mocks originários)
> e `7.7.rust-agent/` (cópia com files diferentes). O cânonico é `7.rust-agent/`.
> A pasta `7.7.rust-agent/` precisa ser investigada/removida.

| Arquivo       | Caminho             | Descrição                | v     | Mod        |
| ------------- | ------------------- | ------------------------ | ----- | ---------- |
| `Cargo.toml`  | `7.rust-agent/`     | Dependências Rust (MOCK) | 0.1.0 | 2026-02-14 |
| `main.rs`     | `7.rust-agent/src/` | Entry point (MOCK)       | 0.1.0 | 2026-02-14 |
| `crypto.rs`   | `7.rust-agent/src/` | Crypto engine (MOCK)     | 0.1.0 | 2026-02-14 |
| `gpu.rs`      | `7.rust-agent/src/` | GPU compute (MOCK)       | 0.1.0 | 2026-02-14 |
| `health.rs`   | `7.rust-agent/src/` | Health checks (MOCK)     | 0.1.0 | 2026-02-14 |
| `mcp.rs`      | `7.rust-agent/src/` | MCP bridge (MOCK)        | 0.1.0 | 2026-02-14 |
| `mining.rs`   | `7.rust-agent/src/` | Mining engine (MOCK)     | 0.1.0 | 2026-02-14 |
| `moltbook.rs` | `7.rust-agent/src/` | Moltbook bridge (MOCK)   | 0.1.0 | 2026-02-14 |
| `node.rs`     | `7.rust-agent/src/` | P2P node (MOCK)          | 0.1.0 | 2026-02-14 |

---

## 📚 Documentação (32 arquivos em 8.docs/)

| Arquivo                          | Descrição                                  | v     | Mod        |
| -------------------------------- | ------------------------------------------ | ----- | ---------- |
| `PF_MASTER_ARCHITECTURE.md`      | 🌟 Arquitetura completa (~192KB)           | 3.0.0 | 2026-02-14 |
| `PF_FILE_REGISTRY.md`            | 📁 Este arquivo (catálogo)                 | 3.0.0 | 2026-02-14 |
| `PF_SDK_REFERENCE.md`            | SDK, Tentacles, Social, Plugins            | 1.5.0 | 2026-02-14 |
| `PF_UI_REFERENCE.md`             | Design System + Componentes                | 6.6.0 | 2026-02-15 |
| `PF_BACKEND_REFERENCE.md`        | Backend geral + Firebase + Rust            | 2.1.0 | 2026-02-14 |
| `PF_P2P_REFERENCE.md`            | P2P + Partner + Nodes + Mining             | 2.1.0 | 2026-02-14 |
| `PF_GAS_REFERENCE.md`            | Google Apps Script (Tri-Mode)              | 1.3.0 | 2026-02-14 |
| `PF_MCP_REFERENCE.md`            | Model Context Protocol                     | 1.0.0 | 2026-02-14 |
| `PF_GEMINI_REFERENCE.md`         | Gemini 2.0/3.0 Flash                       | 3.0.0 | 2026-02-14 |
| `PF_COLAB_REFERENCE.md`          | Google Colab BYOC                          | 1.0.0 | 2026-02-14 |
| `PF_AGENT_CONSTITUTION.md`       | Persona IA pública                         | 1.1.0 | 2026-02-14 |
| `PF_ECONOMY_REFERENCE.md`        | Panda Coin + Tokenomics                    | 2.0.0 | 2026-02-14 |
| `PF_SECURITY_REFERENCE.md`       | 🛡️ Pipeline + Panda Defend                 | 1.1.0 | 2026-02-14 |
| `PF_MEDUSA_REFERENCE.md`         | Marketplace Store                          | 2.0.0 | 2026-02-14 |
| `PF_OPENSOURCE_CATALOG.md`       | Catálogo OSS                               | 1.2.0 | 2026-02-14 |
| `PF_PAT_FOUNDER_CONSTITUTION.md` | Constituição PAT + Founder                 | 1.1.0 | 2026-02-14 |
| `council_viability_report.md`    | Relatório de viabilidade Council           | 1.0.0 | 2026-02-14 |
| `_BACKEND_FIREBASE.md`           | Insert: Firebase backend                   | 1.0.0 | 2026-02-14 |
| `_BACKEND_POLYGLOT_B5.md`        | Insert: Polyglot B5                        | 1.0.0 | 2026-02-14 |
| `_DUAL_PURPOSE_INSERT.md`        | Insert: Dual purpose                       | 1.0.0 | 2026-02-14 |
| `_TENTACLE_INSERT.md`            | Insert: Tentacle system                    | 1.0.0 | 2026-02-14 |
| `PF_KIWIFY_GATEWAY.md`           | 🥝 Kiwify taxas + webhook + flow           | 1.0.0 | 2026-02-18 |
| `PF_HOTMART_GATEWAY.md`          | 🔥 Hotmart taxas + webhook v2.0 + API REST | 1.0.0 | 2026-02-18 |
| `PF_STRIPE_GATEWAY.md`           | 💳 Stripe Checkout + PC packages + webhook | 1.0.0 | 2026-02-18 |
| `PF_GOOGLE_SUITE.md`             | 🌐 Google Workspace integration guide      | 1.0.0 | 2026-02-18 |
| `PF_GITHUB_REFERENCE.md`         | 🐙 GitHub Strategy + Panda Git App         | 1.0.0 | 2026-02-21 |
| `PF_MODULE_AGENDA.md`            | 📅 Módulo Agenda — SSoT (MOD-05)           | 1.0.0 | 2026-02-21 |
| `PF_MODULE_PDV.md`               | 🍽️ Módulo PDV — SSoT (MOD-06)              | 1.0.0 | 2026-02-21 |
| `PF_MODULE_ESTOQUE.md`           | 📦 Módulo Estoque — SSoT (MOD-07)          | 1.0.0 | 2026-02-21 |
| `SPRINT_ETAPA1.md`               | 🏃 Sprint E1 Phase 1 planning              | 1.4.0 | 2026-02-23 |
| `SPRINT_ETAPA1_FASE2.md`         | 🏃 Sprint E1 Phase 2 planning              | 1.0.0 | 2026-02-19 |
| `council_flywheel_analysis.md`   | 🐼 Council DR-008 Flywheel & Roadmap 2026  | 1.0.0 | 2026-02-20 |
| `PF_DEPLOYMENT_CHANGELOG.md`     | 📦 Deploy history (GAS/RTDB/Frontend)      | 1.0.0 | 2026-02-23 |
| `PF_PERFORMANCE_BASELINES.md`    | ⚡ Performance baselines (GAS v3.2.1)      | 1.0.0 | 2026-02-23 |

---

## 💻 Frontend SDK & JS

### SDK (3.sdk/) — 12 arquivos, 17 namespaces

> 🏷️ **Status:** 🟢 REAL (callGAS/funcional) | 🟡 MOCK (setTimeout/placeholder) | 🔵 HYBRID (misto) | ⚪ STATIC (lógica local)

| Arquivo                  | Status    | Descrição                                 | v     | Mod        |
| ------------------------ | --------- | ----------------------------------------- | ----- | ---------- |
| `pf.sdk.js`              | 🔵 HYBRID | 🌟 SDK principal — 17 namespaces (v1.1.0) | 1.1.0 | 2026-02-19 |
| `pf.app-init.js`         | 🟡 MOCK   | Boot orchestrator (setTimeout no init)    | 1.0.0 | 2026-01-15 |
| `pf.loader.js`           | 🟢 REAL   | Module Loader v2.0 (numbered paths)       | 2.0.0 | 2026-02-06 |
| `pf.components.js`       | 🟢 REAL   | Component Loader v2.0 (numbered paths)    | 2.0.0 | 2026-02-06 |
| `pf.module-loader.js`    | 🟢 REAL   | Module loader (Medusa Store install)      | 1.0.0 | 2026-01-26 |
| `pf.ai-core.js`          | ⚪ STATIC | PAT/Treasury logic (depende de Brain)     | 1.1.0 | 2026-02-18 |
| `pf.firebase-bridge.js`  | 🟡 MOCK   | Firebase bridge (setTimeout simula conn)  | 0.1.0 | 2026-01-15 |
| `pf.i18n.js`             | 🟢 REAL   | i18n funcional (PT/EN/ES, DOM binding)    | 1.0.0 | 2026-01-26 |
| `pf.drm.js`              | 🔵 HYBRID | DRM (callGAS + setTimeout fallback)       | 1.0.0 | 2026-01-26 |
| `pf.kill-switch.js`      | 🟢 REAL   | Kill switch (callGAS Founder auth)        | 1.0.0 | 2026-02-06 |
| `pf.agent-telemetry.js`  | 🟢 REAL   | Telemetria event-based (Founder-only)     | 1.0.0 | 2026-02-06 |
| `pf.workflow-builder.js` | 🟢 REAL   | Workflows (IndexedDB, AI learning)        | 1.0.0 | 2026-01-26 |

### Kernel (2.system/core/)

| Arquivo              | Status  | Descrição                            | v     | Mod        |
| -------------------- | ------- | ------------------------------------ | ----- | ---------- |
| `kernel.js`          | 🟢 REAL | Kernel v2.2.0 — Constitution + Boot  | 2.2.0 | 2026-02-18 |
| `loader.js`          | 🟢 REAL | Component Loader (REGISTRY)          | 1.0.0 | 2026-01-26 |
| `pf.verification.js` | 🟢 REAL | Verification Agents (3-state health) | 1.0.0 | 2026-02-06 |

### UI Modules (4.ui/)

| Arquivo           | Status    | Descrição      | v     | Mod        |
| ----------------- | --------- | -------------- | ----- | ---------- |
| `pf.devtools.js`  | 🟢 REAL   | DevTools panel | 1.0.0 | 2026-01-26 |
| `pf.dock-drag.js` | ⚪ STATIC | Dock drag v1.0 | 1.0.0 | 2026-01-15 |
| `pf.dock.js`      | ⚪ STATIC | Dock manager   | 1.0.0 | 2026-01-26 |
| `pf.drag.js`      | ⚪ STATIC | Drag utilities | 1.0.0 | 2026-01-15 |
| `pf.modal-pin.js` | ⚪ STATIC | Modal pin      | 1.0.0 | 2026-01-15 |
| `pf.omnibar.js`   | ⚪ STATIC | Omnibar v2.0   | 2.0.0 | 2026-01-15 |
| `pf.settings.js`  | ⚪ STATIC | Settings panel | 1.0.0 | 2026-01-15 |

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

> **Nota:** `6.medusa/` contém 12 manifests em `manifests/`. Todas as integrações estão em `5.tentacles/` com arquitetura parent/children.

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
| `pf.education-parent.js` | `education/`          | 🔵 HYBRID | Orchestrator     | 1.0.0 | 2026-01-26 |
| `kiwify.js`              | `education/children/` | 🔵 HYBRID | Kiwify webhooks  | 1.0.0 | 2026-01-26 |
| `hotmart.js`             | `education/children/` | 🔵 HYBRID | Hotmart webhooks | 1.0.0 | 2026-01-26 |
| `eduzz.js`               | `education/children/` | 🔵 HYBRID | Eduzz webhooks   | 1.0.0 | 2026-01-26 |

### GitHub Tentacle

| Arquivo               | Caminho            | Status    | Descrição      | v     | Mod        |
| --------------------- | ------------------ | --------- | -------------- | ----- | ---------- |
| `pf.github-parent.js` | `github/`          | 🟢 REAL   | Orchestrator   | 1.0.0 | 2026-01-26 |
| `actions.js`          | `github/children/` | 🔵 HYBRID | GitHub Actions | 1.0.0 | 2026-02-06 |
| `database.js`         | `github/children/` | 🟢 REAL   | GitHub JSON DB | 1.0.0 | 2026-01-15 |
| `pages.js`            | `github/children/` | 🟢 REAL   | GitHub Pages   | 1.0.0 | 2026-01-15 |

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

| Arquivo                 | Caminho            | Status    | Descrição                                  | v     | Mod        |
| ----------------------- | ------------------ | --------- | ------------------------------------------ | ----- | ---------- |
| `pf.social-parent.js`   | `social/`          | ⚪ STATIC | Orchestrator                               | 1.0.0 | 2026-01-26 |
| `meta.js`               | `social/children/` | 🟡 MOCK   | Meta (FB+IG posts)                         | 0.1.0 | 2026-01-15 |
| `facebook-messenger.js` | `social/children/` | 🟡 MOCK   | Messenger DMs (MOD-08) — ⚠️ no GAS handler | 1.0.0 | 2026-02-21 |
| `tiktok.js`             | `social/children/` | 🟡 MOCK   | TikTok API (MOD-09) — ⚠️ no GAS handler    | 1.0.0 | 2026-02-21 |
| `twitter.js`            | `social/children/` | 🟡 MOCK   | Twitter/X                                  | 0.1.0 | 2026-01-15 |
| `whatsapp.js`           | `social/children/` | 🔵 HYBRID | WhatsApp                                   | 1.0.0 | 2026-01-26 |
| `youtube.js`            | `social/children/` | 🟡 MOCK   | YouTube v2 (MOD-10) — ⚠️ no GAS handler    | 2.0.0 | 2026-02-21 |

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
| `pf/app/index.html`      | Vite entry point   | 1.0.0 | 2026-01-26 |
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

| Arquivo                      | Status  | Descrição                          | v     | Mod        |
| ---------------------------- | ------- | ---------------------------------- | ----- | ---------- |
| `Mod_Analytics_View.html`    | 🟡 MOCK | Analytics dashboard (4 charts)     | 0.1.0 | 2026-01-15 |
| `Mod_Store_View.html`        | 🟡 MOCK | Medusa Store (search + grid)       | 0.1.0 | 2026-01-26 |
| `Mod_Founder_Dashboard.html` | 🟢 REAL | Founder Dashboard (8-agent health) | 1.0.0 | 2026-02-06 |
| `Mod_CRM_Tentacle.html`      | 🟢 REAL | Webview CRM (MOD-04)               | 1.0.0 | 2026-02-21 |
| `Mod_Instagram.html`         | 🟢 REAL | Webview Instagram (MOD-02)         | 1.0.0 | 2026-02-21 |
| `Mod_WhatsApp.html`          | 🟢 REAL | Webview WhatsApp (MOD-01)          | 1.0.0 | 2026-02-21 |
| `Mod_Agenda.html`            | 🟢 REAL | Webview Agenda (MOD-05)            | 1.0.0 | 2026-02-21 |
| `Mod_PDV.html`               | 🟢 REAL | Webview PDV (MOD-06)               | 1.0.0 | 2026-02-21 |
| `Mod_Estoque.html`           | 🟢 REAL | Webview Estoque (MOD-07)           | 1.0.0 | 2026-02-21 |

### React Frontend (pf/app/src/) — Padronizado PF\*

> **Build:** Vite 5.4.21 | 970 modules | 1.84MB JS + 240KB CSS

#### Core Layout

| Arquivo                 | Descrição                                                                  | v     | Mod        |
| ----------------------- | -------------------------------------------------------------------------- | ----- | ---------- |
| `App.jsx`               | Container principal v6.5 (+GasometerPanel, Store v3.2)                     | 6.5.0 | 2026-02-13 |
| `main.jsx`              | Entry point React                                                          | 1.0.0 | 2026-01-26 |
| `PFCanvas.jsx`          | TLDraw canvas infinito + WelcomeOverlay                                    | 1.0.0 | 2026-02-06 |
| `PFDock.jsx`            | Dock esquerda v6.3 (🎨📁🐼⚙️🛠️ — 5 itens, lean dock, 📦 Casulo removido)   | 6.3.0 | 2026-02-23 |
| `PFNotifications.jsx`   | Centro de notificações v1.0 (slide-in panel, 4 tipos)                      | 1.0.0 | 2026-01-26 |
| `PFStatusBar.jsx`       | Header v6.4: logo, pills (mapped to health keys), energy, treasury, logout | 6.4.0 | 2026-02-25 |
| `PFHeader.jsx`          | Header + heartbeat status badge (🟢🟡🔴 RTDB)                              | 1.1.0 | 2026-02-21 |
| `PFRightToolbar.jsx`    | Ferramentas de desenho + DevTools                                          | 1.0.0 | 2026-02-06 |
| `PFStore.jsx`           | Panda Store v5.1 (license-aware, RTDB featured/ads)                        | 5.1.0 | 2026-02-21 |
| `PFLiveFlowMonitor.jsx` | 🌐 Live service flow diagram (7 nodes + live logs)                         | 1.0.0 | 2026-02-21 |
| `PFErrorBoundary.jsx`   | 🛡️ Error Boundary v1.0 (crash screen, retry, clear)                        | 1.0.0 | 2026-02-21 |
| `i18n.jsx`              | Internacionalização + provider                                             | 1.0.0 | 2026-02-06 |

#### Modals

| Arquivo                  | Descrição                                                        | v     | Mod        |
| ------------------------ | ---------------------------------------------------------------- | ----- | ---------- |
| `PFSettings.jsx`         | Configurações (10 seções) + WalletSection real-time              | 5.2.0 | 2026-02-20 |
| `PFStore.jsx`            | Loja Medusa v3.2 (12 extensões, EN, +Kiwify/Hotmart/Landing)     | 3.2.0 | 2026-02-13 |
| `PFCatalog.jsx`          | Catálogo de plugins instalados                                   | 1.0.0 | 2026-01-26 |
| `PFFounderDashboard.jsx` | Dashboard Founder + Flow tab (Live Monitor)                      | 1.1.0 | 2026-02-21 |
| `PFFounderModal.jsx`     | Modal wrapper do Dashboard                                       | 1.0.0 | 2026-02-06 |
| `PFFounderPopout.jsx`    | Pop-out Document PiP                                             | 1.0.0 | 2026-02-06 |
| `PFCheckoutModal.jsx`    | Checkout v3.0 (Stripe PC packages, Medusa badge, ratings)        | 3.0.0 | 2026-02-20 |
| `PFBuyPC.jsx`            | 💳 PC Purchase modal (5 tiers, Stripe checkout)                  | 1.0.0 | 2026-02-20 |
| `PFLoginGate.jsx`        | Gate de autenticação v9.0 (redirect, auto-login guard localhost) | 9.0.0 | 2026-02-23 |
| `PFLoginModal.jsx`       | Modal de login                                                   | 1.0.0 | 2026-01-26 |
| `PFDevModePanel.jsx`     | DevTools v3.0 (Console, MCP, API, Publish, 📦 Casulo Creator)    | 3.0.0 | 2026-02-23 |
| `PFDefendPanel.jsx`      | 🛡️ Panda Defend — Security dashboard (Score, Rules, Actions)     | 1.1.0 | 2026-03-03 |
| `PFCouncilPanel.jsx`     | 🏛️ Panda Council (PAT Governance)                                | 1.0.0 | 2026-02-06 |
| `PFBundleCreator.jsx`    | Criador de bundles                                               | 1.0.0 | 2026-01-26 |
| `PFPluginEditor.jsx`     | Editor de panda.mcp.json                                         | 1.0.0 | 2026-02-06 |
| `PFDefendDashboard.jsx`  | Dashboard de segurança                                           | 1.0.0 | 2026-02-06 |
| `PFPanicButton.jsx`      | Botão de pânico                                                  | 1.0.0 | 2026-02-06 |
| `PFFinancePanel.jsx`     | Painel financeiro                                                | 1.0.0 | 2026-02-06 |
| `PFGasometerPanel.jsx`   | ⛽ Gasômetro — GAS usage dashboard v2.0 (Live/Mock badge)        | 2.0.0 | 2026-02-20 |
| `PFWindowManager.jsx`    | Multi-window FlexLayout                                          | 1.0.0 | 2026-02-06 |
| `PFEmptyCanvas.jsx`      | Overlay canvas vazio (Welcome alternative)                       | 1.0.0 | 2026-02-06 |
| `PFMiningPanel.jsx`      | ⛏️ Painel de mineração PAT                                       | 1.1.0 | 2026-03-03 |
| `PFProductDetail.jsx`    | Detalhes do produto (PDP) na Store                               | 1.0.0 | 2026-02-03 |
| `PFWelcomeWizard.jsx`    | Wizard de boas-vindas v2 (✕ close, FINISH ✓, ESC/arrows)         | 2.0.0 | 2026-02-15 |
| `PFLanguageSelector.jsx` | Seletor de idioma (PT/EN/ES)                                     | 1.0.0 | 2026-02-15 |

#### Hooks

| Arquivo                   | Descrição                                        | v     | Mod        |
| ------------------------- | ------------------------------------------------ | ----- | ---------- |
| `useAuth.jsx`             | Autenticação + logout consolidado (SSoT cleanup) | 2.0.0 | 2026-02-23 |
| `useFirebase.js`          | Firebase RTDB + Auth                             | 1.0.0 | 2026-01-26 |
| `useGAS.js`               | GAS endpoints                                    | 1.0.0 | 2026-01-26 |
| `useHealthStatus.js`      | Health polling (+rust_agent, +gpu stubs)         | 1.1.0 | 2026-02-25 |
| `useFounderMetrics.js`    | Métricas Founder (GAS primary + mock fallback)   | 1.1.0 | 2026-02-21 |
| `useMarketplace.js`       | Marketplace hooks                                | 1.0.0 | 2026-01-26 |
| `useCheckout.js`          | Checkout hooks (Stripe PC flow)                  | 2.0.0 | 2026-02-20 |
| `useLandingPage.js`       | Landing page hooks                               | 1.0.0 | 2026-01-26 |
| `useFounderBrain.js`      | 🧠 Founder AI brain + analytics                  | 1.0.0 | 2026-02-19 |
| `useHeartbeat.js`         | 💓 System heartbeat + uptime monitor             | 1.0.0 | 2026-02-18 |
| `useWallet.js`            | 💰 Wallet RTDB subscription + mock fallback      | 1.0.0 | 2026-02-20 |
| `useGasometer.js`         | ⛽ GAS quota monitor v2.0 (real+mock, 60s poll)  | 2.0.0 | 2026-02-20 |
| `useKeyboardShortcuts.js` | ⌨️ Atalhos de teclado                            | 1.0.0 | 2026-02-06 |
| `useLicenses.js`          | 📜 Module licenses (RTDB query + localStorage)   | 1.0.0 | 2026-02-21 |

#### Services

| Arquivo        | Descrição                                      | v     | Mod        |
| -------------- | ---------------------------------------------- | ----- | ---------- |
| `callGAS.js`   | 🔗 GAS endpoint interface (+License namespace) | 1.3.0 | 2026-02-21 |
| `uiContext.js` | Context global UI                              | 1.0.0 | 2026-01-26 |

#### Styles

| Arquivo | Descrição | v   | Mod |
| ------- | --------- | --- | --- |

#### Modules

| Arquivo                            | Descrição                                          | v     | Mod        |
| ---------------------------------- | -------------------------------------------------- | ----- | ---------- |
| `modules/crm/PandaCRM.jsx`         | 📱 Panda CRM v1.0 (Kanban + List + Form)           | 1.0.0 | 2026-02-21 |
| `modules/crm/PandaCRM.css`         | CRM dark theme styles                              | 1.0.0 | 2026-02-21 |
| `modules/crm/index.js`             | CRM module entry point                             | 1.0.0 | 2026-02-21 |
| `modules/landing/PandaLanding.jsx` | 🚀 Landing Page Builder v1.0 (3 templates, export) | 1.0.0 | 2026-02-21 |
| `modules/landing/PandaLanding.css` | Landing builder dark theme styles                  | 1.0.0 | 2026-02-21 |
| `modules/landing/index.js`         | Landing module entry point                         | 1.0.0 | 2026-02-21 |

| Arquivo                  | Descrição                              | v     | Mod        |
| ------------------------ | -------------------------------------- | ----- | ---------- |
| `pf.css`                 | Design system principal (~4423 linhas) | 6.6.0 | 2026-02-15 |
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
| `PFBuyPC.css`            | Estilos PC purchase modal              | 1.0.0 | 2026-02-20 |
| `PFLiveFlowMonitor.css`  | Flow monitor + heartbeat badge styles  | 1.0.0 | 2026-02-21 |
| `PFDefendPanel.css`      | 🛡️ Defend panel styles + light mode    | 1.0.0 | 2026-03-03 |
| `PFMiningPanel.css`      | ⛏️ Mining panel styles + light mode    | 1.0.0 | 2026-03-03 |
| `PFWelcomeWizard.css`    | Estilos wizard v2 (close+finish btns)  | 2.0.0 | 2026-02-15 |

---

## 🎨 CSS (css/)

> ⚠️ **Nota:** O design system principal foi migrado de `10.assets/css/pf.theme.css` para `pf/app/src/styles/pf.css` (4423 linhas, namespace `--pf-*`).
> O arquivo legacy `pf.theme.css` permanece em `10.assets/css/` como referência.

| Arquivo        | Caminho          | Status    | Descrição                   | v     | Mod        |
| -------------- | ---------------- | --------- | --------------------------- | ----- | ---------- |
| `pf.theme.css` | `10.assets/css/` | ⚪ LEGACY | Legacy theme (pré-migração) | 1.0.0 | 2026-01-15 |

---

## ⚙️ Config Files

### Root Project

| Arquivo                       | Caminho | Vis | Descrição                                | v     | Mod        |
| ----------------------------- | ------- | --- | ---------------------------------------- | ----- | ---------- |
| `manifest.json`               | `/`     | 🟢  | PWA manifest                             | 1.0.0 | 2026-02-13 |
| `package.json`                | `/`     | 🔒  | NPM dependencies (root) — gitignored     | 1.0.0 | 2026-02-06 |
| `package-lock.json`           | `/`     | 🟢  | NPM lock (root)                          | 1.0.0 | 2026-02-06 |
| `jsconfig.json`               | `/`     | 🔒  | JS/TS config — gitignored                | 1.0.0 | 2026-01-15 |
| `PandaFactory.code-workspace` | `/`     | 🔒  | VS Code workspace — gitignored           | 1.0.0 | 2026-01-15 |
| `sw.js`                       | `/`     | 🟢  | Service Worker                           | 1.0.0 | 2026-02-13 |
| `_build_shell.ps1`            | `/`     | 🔒  | Build script PowerShell — gitignored     | 1.0.0 | 2026-01-15 |
| `.nojekyll`                   | `/`     | 🟢  | Prevent Jekyll on GitHub Pages           | 1.0.0 | 2026-02-19 |
| `.env`                        | `/`     | 🔒  | 🔒 Variáveis de ambiente (não commitar!) | 1.0.0 | 2026-01-15 |
| `.gitignore`                  | `/`     | 🟢  | Git ignore rules                         | 1.0.0 | 2026-02-14 |
| `.pandaignore`                | `/`     | 🟢  | Panda remote ignore rules                | 1.0.0 | 2026-02-19 |
| `.antigravityignore`          | `/`     | 🔒  | Antigravity IDE ignore — gitignored      | 1.0.0 | 2026-02-14 |
| `README.md`                   | `/`     | 🟢  | README principal do projeto              | 9.1.0 | 2026-02-18 |
| `ROADMAP.md`                  | `/`     | 🟢  | Roadmap SSoT (42 tasks, 5 etapas)        | 1.3.0 | 2026-02-19 |
| `index.html`                  | `/`     | 🟢  | Landing page (links to SPA)              | 2.0.0 | 2026-02-19 |
| `PandaFactory.html`           | `/`     | 🔒  | App legado monolítico — gitignored       | 6.5.0 | 2026-02-13 |

> 🔒 **Segurança:** `.env` está listado como referência. Seu conteúdo é sensível e DEVE estar no `.gitignore`.
> ❌ **Removido:** `_config.yml` (Jekyll theme) deletado em 2026-02-19 — conflitava com GitHub Actions deploy.

### Firebase Config

| Arquivo                  | Caminho | Vis | Descrição                       | v     | Mod        |
| ------------------------ | ------- | --- | ------------------------------- | ----- | ---------- |
| `.firebaserc`            | `/`     | 🟢  | Firebase project alias          | 1.0.0 | 2026-02-18 |
| `firebase.json`          | `/`     | 🟢  | Firebase Hosting + rules config | 1.0.0 | 2026-02-18 |
| `firestore.rules`        | `/`     | 🟢  | Firestore security rules        | 1.0.0 | 2026-02-18 |
| `firestore.indexes.json` | `/`     | 🟢  | Firestore compound indexes      | 1.0.0 | 2026-02-18 |
| `firebase-debug.log`     | `/`     | 🔒  | Debug log — gitignored          | -     | -          |

### CI/CD — `.github/workflows/`

| Arquivo             | Vis | Descrição                                          | v     | Mod        |
| ------------------- | --- | -------------------------------------------------- | ----- | ---------- |
| `pages.yml`         | 🟢  | GitHub Pages deploy (Vite→dist/jam + VITE_GAS_URL) | 1.2.0 | 2026-02-23 |
| `android-build.yml` | 🔒  | Android APK build — gitignored                     | 0.1.0 | 2026-01-15 |
| `steam-build.yml`   | 🔒  | Steam build — gitignored                           | 0.1.0 | 2026-01-15 |

### Build Output — `dist/jam/`

> ⚠️ **Nota:** `dist/jam/` é tracked no git para servir via GitHub Pages.
> O workflow `pages.yml` também builda fresh em CI.

| Arquivo                 | Vis | Descrição            | Mod        |
| ----------------------- | --- | -------------------- | ---------- |
| `index.html`            | 🟢  | Vite-built SPA entry | 2026-02-19 |
| `assets/index-*.css`    | 🟢  | Compiled CSS bundle  | 2026-02-19 |
| `assets/index-*.js`     | 🟢  | Compiled JS bundle   | 2026-02-19 |
| `panda-*.png` (3 files) | 🟢  | Copied public assets | 2026-02-19 |

### Public Assets — `assets/`

| Arquivo                | Caminho   | Vis | Descrição          | Mod        |
| ---------------------- | --------- | --- | ------------------ | ---------- |
| `panda_logo.png`       | `assets/` | 🟢  | Circular pixel art | 2026-02-15 |
| `panda_store_logo.png` | `assets/` | 🟢  | Store logo         | 2026-02-15 |

### pf/app Config

| Arquivo             | Caminho   | Descrição                      | v     | Mod        |
| ------------------- | --------- | ------------------------------ | ----- | ---------- |
| `index.html`        | `pf/app/` | Vite entry HTML                | 1.0.0 | 2026-02-06 |
| `package.json`      | `pf/app/` | NPM dependencies (app)         | 1.0.0 | 2026-02-06 |
| `package-lock.json` | `pf/app/` | NPM lock (app)                 | 1.0.0 | 2026-02-06 |
| `vite.config.js`    | `pf/app/` | Vite build config + PWA plugin | 1.1.0 | 2026-02-21 |

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

| Pasta                  | Conteúdo      | Regenerar            |
| ---------------------- | ------------- | -------------------- |
| `node_modules/`        | ~50k NPM deps | `npm install`        |
| `pf/app/node_modules/` | Jam deps      | `cd pf/app && npm i` |
| `7.rust-agent/target/` | Build cache   | `cargo build`        |

---

## 🗄️ \_archive/ — IGNORADO

> O diretório `_archive/` contém ~38 arquivos legados (backups, workflows deprecados, assets duplicados).
> Está incluído no `.pandaignore` e **NÃO faz parte do código ativo**.
> Para auditoria: existem subpastas `legacy/`, `backups/`, `exports_old/`, `agent_workflows_deprecated/`.

---

> 📖 **Mantido por:** Panda Council (PAT)
> **Última atualização:** 2026-03-03 v7.5.0

---

## Changelog

| Versao | Data       | Alteracoes                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7.5.0  | 2026-03-03 | LP05: +`PFDefendPanel.css` v1.0 (inline→CSS + light mode), +`PFMiningPanel.css` v1.0 (inline→CSS + light mode), `PFDefendPanel.jsx` v1.1 (className migration, -57% lines), `PFMiningPanel.jsx` v1.1 (className migration, -56% lines). CSS count 21→23.                                                                                                                                                                                      |
| 7.4.0  | 2026-03-02 | Sprint E1 docs: `PF_BACKEND_REFERENCE.md` v2.4.0 (+Firebase Auth real, RTDB rules, Wallet, Heartbeat, PWA); `PF_GAS_REFERENCE.md` v1.4.0 (+GAS Web App deploy, webhooks Kiwify/Hotmart, LICENSE_ACTIVATE, wallet.charge); `PF_SDK_REFERENCE.md` [1.0.0] (+useAuth/useFirebase Firebase real, Store+Stripe, Economy PC); `PF_GEMINI_REFERENCE.md` v3.1.0 (+GAS ?mcp=manifest, Founder Live Monitor); `SPRINT_ETAPA1.md` changelogs marcados ✅ |
| 7.3.0  | 2026-02-25 | Status bar pill mapping fix: `PFStatusBar.jsx` v6.4 (pill IDs now map to health service keys, firebase aggregates auth+rtdb), `useHealthStatus.js` v1.1 (+rust_agent/gpu stubs in jam config)                                                                                                                                                                                                                                                 |
| 7.2.0  | 2026-02-24 | Audit cross-ref: `facebook-messenger.js`/`tiktok.js`/`youtube.js` HYBRID→MOCK (no GAS handlers), `useFounderMetrics.js` description corrected (mock fallback acknowledged)                                                                                                                                                                                                                                                                    |
| 7.1.0  | 2026-02-23 | GAS v22 deploy: `PF_Config.gs` v1.2.0 (endpoint URL), +`appsscript.json` v1.1.0 (ANYONE_ANONYMOUS), `pages.yml` v1.2.0 (+VITE_GAS_URL)                                                                                                                                                                                                                                                                                                        |
| 7.0.0  | 2026-02-23 | +`PF_DEPLOYMENT_CHANGELOG.md` v1.0, +`PF_PERFORMANCE_BASELINES.md` v1.0, `SPRINT_ETAPA1.md` v1.4.0 (12/19 ✅)                                                                                                                                                                                                                                                                                                                                 |
| 6.9.0  | 2026-02-21 | Sprint E1 governance: +`PF_Heartbeat_Agents.gs`, +`PFLiveFlowMonitor.jsx/css`, `PFHeader.jsx` v1.1 (heartbeat badge), `PFStore.jsx` v5.1 (RTDB featured/ads), `PFFounderDashboard.jsx` v1.1 (Flow tab), `useFounderMetrics.js` v1.1, `PF_Dispatcher.gs` v1.6 (+STORE_FEATURE/GET_FEATURED), `vite.config.js` v1.1 (PWA)                                                                                                                       |
| 6.8.0  | 2026-02-20 | DR-008: +`council_flywheel_analysis.md`, §E.2 Encapsulado Split (Economy), §10.5 Casulo (Medusa), #41 E4→E1, #17a onboarding sub-item                                                                                                                                                                                                                                                                                                         |
| 6.7.0  | 2026-02-21 | TICKET-15: +`PFErrorBoundary.jsx` v1.0, App.jsx wrapped top-level + per-module (CRM, Landing)                                                                                                                                                                                                                                                                                                                                                 |
| 6.6.0  | 2026-02-21 | TICKET-14: +`modules/landing/` (PandaLanding.jsx v1.0, PandaLanding.css, index.js), App.jsx +landing componentFactory case                                                                                                                                                                                                                                                                                                                    |
| 6.5.0  | 2026-02-21 | TICKET-13: +`modules/crm/` (PandaCRM.jsx v1.0, PandaCRM.css, index.js), App.jsx +crm componentFactory case                                                                                                                                                                                                                                                                                                                                    |
| 6.4.0  | 2026-02-21 | TICKET-12: `PFStore.jsx` v5.0 (license-aware), `PF_Dispatcher.gs` v1.5 (+LICENSE_CHECK/LIST), `callGAS.js` v1.3 (+License), +`useLicenses.js`                                                                                                                                                                                                                                                                                                 |
| 6.3.0  | 2026-02-21 | TICKET-11: `PFChat.jsx` v2.0 (callGAS.Brain primary), `PF_Dispatcher.gs` v1.5 (+BRAIN_CHAT/ANALYZE/GEMS routes), `callGAS.js` v1.2 (+Brain namespace)                                                                                                                                                                                                                                                                                         |
| 6.2.0  | 2026-02-20 | Turbo Mode Audit: +`PFBuyPC.jsx/css`, +`useFounderBrain.js`, +`useHeartbeat.js`, +`PF_Setup.gs`, +`PF_Usage.gs`, +`PF_STRIPE_GATEWAY.md`, +`PF_GOOGLE_SUITE.md`, +Sprint docs. Bumped 12+ stale dates. `SDK_Stripe.js` MOCK→REAL. Counts corrected                                                                                                                                                                                            |
| 6.1.0  | 2026-02-20 | TICKET-09: +`useWallet.js`, `callGAS.js` registered, `useGasometer.js` v2.0, `PFGasometerPanel.jsx` v2.0 (mode badge), `PFSettings.jsx` v5.2 (WalletSection)                                                                                                                                                                                                                                                                                  |
| 6.0.0  | 2026-02-19 | Deleted `_config.yml` (Jekyll conflict), added `.nojekyll`, added 🟢/🔒 visibility column, added Firebase/CI-CD/dist/jam/assets sections, added `ROADMAP.md`, `.pandaignore`, `index.html` v2.0                                                                                                                                                                                                                                               |
| 5.0.0  | 2026-02-18 | Auditoria completa fs: fix paths 1.2.domains/, Rust→7.rust-agent/, +JSX, +docs, pf.css 4423ln                                                                                                                                                                                                                                                                                                                                                 |
| 4.1.0  | 2026-02-15 | LoginGate v8.0, Wizard v2.0, pf.css v6.6 — version+mod bumps                                                                                                                                                                                                                                                                                                                                                                                  |
| 4.0.0  | 2026-02-14 | Auditoria fs completa: +31 MISSING, Rust Agent PLANNED, .env/.gitignore                                                                                                                                                                                                                                                                                                                                                                       |
| 3.0.0  | 2026-02-14 | Per-file versioning (v+Mod) em TODAS as tabelas, governança MCP                                                                                                                                                                                                                                                                                                                                                                               |
| 2.6.0  | 2026-02-14 | MCP header, correcao contagens JSX/CSS/MD, +8 arquivos faltantes                                                                                                                                                                                                                                                                                                                                                                              |
| 2.5.0  | 2026-02-10 | Versao anterior com contagens desatualizadas                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2.0.0  | 2026-02-06 | Adicao de Rust files, reorganizacao                                                                                                                                                                                                                                                                                                                                                                                                           |
| 1.0.0  | 2026-01-15 | Criacao do catalogo inicial                                                                                                                                                                                                                                                                                                                                                                                                                   |
