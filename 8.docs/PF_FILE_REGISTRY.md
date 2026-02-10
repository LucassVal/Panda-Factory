---
tool_context: panda/files
description: Catálogo de arquivos - 220+ arquivos GAS, Rust, JS, HTML, CSS, MD
version: 2.5.0
updated: 2026-02-10
---

# 📁 PF_FILE_REGISTRY - Catálogo de Arquivos

> **Versão:** 2.5.0 | **Atualizado:** 2026-02-10
> **Propósito:** Inventário COMPLETO de todos os arquivos do Panda Factory

---

## 📊 Resumo Atualizado

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    FILE REGISTRY - 220+ ARQUIVOS                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 📜 17 .gs    │  │ 🦀 8 .rs     │  │ 📄 25+ .md   │              │
│  │  Backend GAS │  │  Rust Agent  │  │ Documentação │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 💻 98 .js/.jsx│  │ 🌐 18 .html  │  │ 🎨 15 .css   │              │
│  │ SDK/Tentacles│  │  UI/Modules  │  │   Estilos    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │ ⚙️ 15+ .json │  │ 🐍 25+ .py   │                                │
│  │   Config     │  │   Scripts    │                                │
│  └──────────────┘  └──────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
```

| Extensão | Quantidade | Domínio Principal      |
| -------- | ---------- | ---------------------- |
| `.gs`    | 17         | Backend GAS            |
| `.rs`    | 8          | Rust Agent             |
| `.md`    | 25+        | Documentação           |
| `.js`    | 72         | Frontend/SDK/Tentacles |
| `.jsx`   | 26         | React Components       |
| `.html`  | 18         | UI/Components/Modules  |
| `.css`   | 15         | Estilos                |
| `.json`  | 10         | Config                 |
| `.py`    | 28         | Scripts/Automação      |

---

## 🔧 Backend GAS (17 arquivos)

### Core

| Arquivo               | Caminho           | Descrição                                  |
| --------------------- | ----------------- | ------------------------------------------ |
| `PF_Dispatcher.gs`    | `1.core/1.1.gas/` | Router principal (doGet/doPost) - Tri-Mode |
| `PF_Config.gs`        | `1.core/1.1.gas/` | Configurações globais                      |
| `PF_App_Init.gs`      | `1.core/1.1.gas/` | Inicialização do app                       |
| `PF_Core_AI.gs`       | `1.core/1.1.gas/` | Dispatcher AI multimodal                   |
| `PF_Core_Oracle.gs`   | `1.core/1.1.gas/` | Cotação USD/BRL                            |
| `PF_Core_Webhooks.gs` | `1.core/1.1.gas/` | Webhooks B2B (Kiwify, Hotmart, etc.)       |
| `PF_Brain_Core.gs`    | `1.core/1.1.gas/` | Core do Brain AI                           |
| `PF_Moltbook.gs`      | `1.core/1.1.gas/` | Integração Moltbook                        |
| `PF_PAT_Core.gs`      | `1.core/1.1.gas/` | Panda Council (Governança)                 |

### Finance

| Arquivo        | Caminho                   | Descrição                    |
| -------------- | ------------------------- | ---------------------------- |
| `PF_Wallet.gs` | `1.core/domains/finance/` | Carteira Panda Coin          |
| `PF_Crypto.gs` | `1.core/domains/finance/` | Pagamentos crypto (USDC/SOL) |
| `PF_Fiat.gs`   | `1.core/domains/finance/` | Pagamentos fiat (Stripe/PIX) |

### Store

| Arquivo             | Caminho                 | Descrição                     |
| ------------------- | ----------------------- | ----------------------------- |
| `PF_Sales.gs`       | `1.core/domains/store/` | Vendas e Split (52/25/15/5/3) |
| `PF_Registry.gs`    | `1.core/domains/store/` | Registro de módulos           |
| `PF_Marketplace.gs` | `1.core/domains/store/` | Medusa Store backend          |

### Automation & P2P

| Arquivo      | Caminho                      | Descrição                        |
| ------------ | ---------------------------- | -------------------------------- |
| `PF_Bots.gs` | `1.core/domains/automation/` | Automação de tarefas             |
| `PF_P2P.gs`  | `1.core/domains/p2p/`        | 🌐 Node registry, tasks, rewards |

### Payment SDKs (1.core/1.3.sdks/)

| Arquivo            | Status  | Descrição             |
| ------------------ | ------- | --------------------- |
| `SDK_PagSeguro.js` | 🟡 MOCK | PagSeguro payment SDK |
| `SDK_Stripe.js`    | 🟡 MOCK | Stripe payment SDK    |

---

## 🦀 Rust Agent (8 arquivos)

| Arquivo       | Caminho             | Descrição                   |
| ------------- | ------------------- | --------------------------- |
| `main.rs`     | `7.rust-agent/src/` | Entry point, CLI dispatcher |
| `mcp.rs`      | `7.rust-agent/src/` | MCP Server (4 tools)        |
| `crypto.rs`   | `7.rust-agent/src/` | Ed25519 Founder Auth        |
| `gpu.rs`      | `7.rust-agent/src/` | NVIDIA/CUDA detection       |
| `health.rs`   | `7.rust-agent/src/` | Health monitoring           |
| `moltbook.rs` | `7.rust-agent/src/` | Moltbook client             |
| `node.rs`     | `7.rust-agent/src/` | 🌐 P2P Node Manager         |
| `mining.rs`   | `7.rust-agent/src/` | ⛏️ Mining & Partner Mode    |
| `Cargo.toml`  | `7.rust-agent/`     | Dependências Rust           |

---

## 📚 Documentação (18 arquivos em 8.docs/)

| Arquivo                          | Descrição                        |
| -------------------------------- | -------------------------------- |
| `PF_MASTER_ARCHITECTURE.md`      | 🌟 Arquitetura completa (~192KB) |
| `PF_FILE_REGISTRY.md`            | 📁 Este arquivo (catálogo)       |
| `PF_SDK_REFERENCE.md`            | SDK, Tentacles, Social, Plugins  |
| `PF_UI_REFERENCE.md`             | Design System + Componentes      |
| `PF_BACKEND_REFERENCE.md`        | Backend geral + Firebase + Rust  |
| `PF_P2P_REFERENCE.md`            | P2P + Partner + Nodes + Mining   |
| `PF_GAS_REFERENCE.md`            | Google Apps Script (Tri-Mode)    |
| `PF_MCP_REFERENCE.md`            | Model Context Protocol           |
| `PF_GEMINI_REFERENCE.md`         | Gemini 2.0/3.0 Flash             |
| `PF_COLAB_REFERENCE.md`          | Google Colab BYOC                |
| `PF_AGENT_CONSTITUTION.md`       | Persona IA pública               |
| `PF_ECONOMY_REFERENCE.md`        | Panda Coin + Tokenomics          |
| `PF_SECURITY_REFERENCE.md`       | 🛡️ Pipeline + Panda Defend       |
| `PF_MEDUSA_REFERENCE.md`         | Marketplace Store                |
| `PF_OPENSOURCE_CATALOG.md`       | Catálogo OSS                     |
| `PF_PAT_FOUNDER_CONSTITUTION.md` | Constituição PAT + Founder       |
| `README_PANDA_OFICIAL.md`        | README principal do projeto      |
| `NPM_INSTALL_LIST.md`            | Lista de dependências npm        |

---

## 💻 Frontend SDK & JS

### SDK (3.sdk/) — 12 arquivos, 17 namespaces

> 🏷️ **Status:** 🟢 REAL (callGAS/funcional) | 🟡 MOCK (setTimeout/placeholder) | 🔵 HYBRID (misto) | ⚪ STATIC (lógica local)

| Arquivo                  | Status    | Descrição                                 |
| ------------------------ | --------- | ----------------------------------------- |
| `pf.sdk.js`              | 🔵 HYBRID | 🌟 SDK principal — 17 namespaces (v1.0.0) |
| `pf.app-init.js`         | 🟡 MOCK   | Boot orchestrator (setTimeout no init)    |
| `pf.loader.js`           | 🟢 REAL   | Module Loader v2.0 (numbered paths)       |
| `pf.components.js`       | 🟢 REAL   | Component Loader v2.0 (numbered paths)    |
| `pf.module-loader.js`    | 🟢 REAL   | Module loader (Medusa Store install)      |
| `pf.ai-core.js`          | ⚪ STATIC | PAT/Treasury logic (depende de Brain)     |
| `pf.firebase-bridge.js`  | 🟡 MOCK   | Firebase bridge (setTimeout simula conn)  |
| `pf.i18n.js`             | 🟢 REAL   | i18n funcional (PT/EN/ES, DOM binding)    |
| `pf.drm.js`              | 🔵 HYBRID | DRM (callGAS + setTimeout fallback)       |
| `pf.kill-switch.js`      | 🟢 REAL   | Kill switch (callGAS Founder auth)        |
| `pf.agent-telemetry.js`  | 🟢 REAL   | Telemetria event-based (Founder-only)     |
| `pf.workflow-builder.js` | 🟢 REAL   | Workflows (IndexedDB, AI learning)        |

### Kernel (2.system/core/)

| Arquivo              | Status  | Descrição                            |
| -------------------- | ------- | ------------------------------------ |
| `kernel.js`          | 🟢 REAL | Kernel v2.1.0 — Constitution + Boot  |
| `loader.js`          | 🟢 REAL | Component Loader (REGISTRY)          |
| `pf.verification.js` | 🟢 REAL | Verification Agents (3-state health) |

### UI Modules (4.ui/)

| Arquivo           | Status    | Descrição       |
| ----------------- | --------- | --------------- |
| `pf.devtools.js`  | 🟢 REAL   | DevTools panel  |
| `pf.dock-drag.js` | 🟡 MOCK   | Dock drag       |
| `pf.dock.js`      | ⚪ STATIC | Dock manager    |
| `pf.drag.js`      | ⚪ STATIC | Drag utilities  |
| `pf.modal-pin.js` | ⚪ STATIC | Modal pin       |
| `pf.omnibar.js`   | 🟡 MOCK   | Omnibar/Command |
| `pf.settings.js`  | ⚪ STATIC | Settings panel  |

### Lazy-Loaded Modules (4.ui/4.3.modules/)

| Arquivo                      | Status  | Descrição                          |
| ---------------------------- | ------- | ---------------------------------- |
| `Mod_Analytics_View.html`    | 🟡 MOCK | Analytics dashboard (4 charts)     |
| `Mod_Store_View.html`        | 🟡 MOCK | Medusa Store (search + grid)       |
| `Mod_Founder_Dashboard.html` | 🟢 REAL | Founder Dashboard (8-agent health) |

### Data Assets (10.assets/data/)

| Arquivo            | Status  | Descrição          |
| ------------------ | ------- | ------------------ |
| `seed_system.json` | 🟢 REAL | System seed config |
| `auto_import.js`   | 🟢 REAL | Auto-import script |

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

| Arquivo              | Caminho           | Status    | Descrição          |
| -------------------- | ----------------- | --------- | ------------------ |
| `pf.brain-parent.js` | `brain/`          | ⚪ STATIC | Brain orchestrator |
| `gemini.js`          | `brain/children/` | 🔵 HYBRID | Gemini AI          |
| `gpu.js`             | `brain/children/` | 🟡 MOCK   | GPU compute        |
| `local-llm.js`       | `brain/children/` | 🔵 HYBRID | Local LLM (Ollama) |

### P2P Tentacle

| Arquivo            | Caminho | Status    | Descrição           |
| ------------------ | ------- | --------- | ------------------- |
| `pf.p2p-parent.js` | `p2p/`  | ⚪ STATIC | 🌐 P2P orchestrator |

### Distribution Tentacle

| Arquivo                     | Caminho                  | Status    | Descrição    |
| --------------------------- | ------------------------ | --------- | ------------ |
| `pf.distribution-parent.js` | `distribution/`          | 🟢 REAL   | Orchestrator |
| `google-play.js`            | `distribution/children/` | 🔵 HYBRID | Play Store   |
| `steam.js`                  | `distribution/children/` | 🟡 MOCK   | Steam        |
| `pwa.js`                    | `distribution/children/` | 🔵 HYBRID | PWA deploy   |
| `vscode.js`                 | `distribution/children/` | 🟡 MOCK   | VSCode ext   |
| `npm.js`                    | `distribution/children/` | 🟡 MOCK   | NPM publish  |
| `arcade.js`                 | `distribution/children/` | 🟡 MOCK   | Arcade       |
| `itch.js`                   | `distribution/children/` | 🟡 MOCK   | Itch.io      |

### Education Tentacle

| Arquivo                  | Caminho               | Status    | Descrição        |
| ------------------------ | --------------------- | --------- | ---------------- |
| `pf.education-parent.js` | `education/`          | ⚪ STATIC | Orchestrator     |
| `kiwify.js`              | `education/children/` | 🟡 MOCK   | Kiwify webhooks  |
| `hotmart.js`             | `education/children/` | 🟡 MOCK   | Hotmart webhooks |
| `eduzz.js`               | `education/children/` | 🟡 MOCK   | Eduzz webhooks   |

### GitHub Tentacle

| Arquivo               | Caminho            | Status    | Descrição      |
| --------------------- | ------------------ | --------- | -------------- |
| `pf.github-parent.js` | `github/`          | 🟢 REAL   | Orchestrator   |
| `actions.js`          | `github/children/` | 🔵 HYBRID | GitHub Actions |
| `database.js`         | `github/children/` | 🟡 MOCK   | GitHub DB      |
| `pages.js`            | `github/children/` | 🟡 MOCK   | GitHub Pages   |

### Google Tentacle

| Arquivo               | Caminho            | Status  | Descrição           |
| --------------------- | ------------------ | ------- | ------------------- |
| `pf.google-parent.js` | `google/`          | 🟢 REAL | Orchestrator        |
| `calendar.js`         | `google/children/` | 🟢 REAL | Google Calendar     |
| `colab.js`            | `google/children/` | 🟢 REAL | Google Colab        |
| `docs.js`             | `google/children/` | 🟢 REAL | Google Docs         |
| `drive.js`            | `google/children/` | 🟢 REAL | Google Drive        |
| `gmail.js`            | `google/children/` | 🟢 REAL | Gmail               |
| `sheets.js`           | `google/children/` | 🟢 REAL | Google Sheets       |
| `youtube.js`          | `google/children/` | 🟢 REAL | YouTube Data API v3 |

### Social Tentacle

| Arquivo               | Caminho            | Status    | Descrição         |
| --------------------- | ------------------ | --------- | ----------------- |
| `pf.social-parent.js` | `social/`          | ⚪ STATIC | Orchestrator      |
| `meta.js`             | `social/children/` | 🟡 MOCK   | Meta (FB+IG)      |
| `twitter.js`          | `social/children/` | 🟡 MOCK   | Twitter/X         |
| `whatsapp.js`         | `social/children/` | 🔵 HYBRID | WhatsApp          |
| `youtube.js`          | `social/children/` | 🟡 MOCK   | YouTube (mock+PC) |

### Trading Tentacle

| Arquivo                | Caminho             | Status    | Descrição    |
| ---------------------- | ------------------- | --------- | ------------ |
| `pf.trading-parent.js` | `trading/`          | ⚪ STATIC | Orchestrator |
| `ctrader.js`           | `trading/children/` | 🟡 MOCK   | cTrader      |

### Monitor

| Arquivo                  | Caminho    | Status    | Descrição        |
| ------------------------ | ---------- | --------- | ---------------- |
| `pf.tentacle-monitor.js` | `monitor/` | ⚪ STATIC | Tentacle Monitor |

---

## 🌐 HTML (18 arquivos)

### Main

| Arquivo                  | Descrição          |
| ------------------------ | ------------------ |
| `PandaFactory.html`      | App principal      |
| `index.html`             | Landing page       |
| `11.jam/index.html`      | Vite entry point   |
| `founder-dashboard.html` | Dashboard fundador |

### Pitch Decks

| Arquivo              | Descrição     |
| -------------------- | ------------- |
| `pitch-deck.html`    | Pitch (PT-BR) |
| `pitch-deck-pt.html` | Pitch PT      |
| `pitch-deck-en.html` | Pitch EN      |

### Components (4.ui/)

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

### Modules (4.ui/4.3.modules/)

| Arquivo                      | Descrição         |
| ---------------------------- | ----------------- |
| `Mod_Analytics_View.html`    | Módulo Analytics  |
| `Mod_Store_View.html`        | Módulo Store      |
| `Mod_Founder_Dashboard.html` | Founder Dashboard |

### React Frontend (11.jam/src/) — Padronizado PF\*

> **Build:** Vite 5.4.21 | 933 modules | 1.34MB JS + 153KB CSS

#### Core Layout

| Arquivo               | Descrição                                              |
| --------------------- | ------------------------------------------------------ |
| `App.jsx`             | Container principal v6.5 (+GasometerPanel, Store v3.2) |
| `main.jsx`            | Entry point React                                      |
| `PFCanvas.jsx`        | TLDraw canvas infinito + WelcomeOverlay                |
| `PFDock.jsx`          | Dock esquerda v6.2 (🎨📁🐼⚙️🛠️ — 5 itens, lean dock)   |
| `PFNotifications.jsx` | Centro de notificações v1.0 (slide-in panel, 4 tipos)  |
| `PFStatusBar.jsx`     | Header: logo, status pills, energy, treasury           |
| `PFHeader.jsx`        | Header alternativo                                     |
| `PFRightToolbar.jsx`  | Ferramentas de desenho + DevTools                      |
| `PFChat.jsx`          | Floating AI Chat + external toggle event               |

#### Modals

| Arquivo                      | Descrição                                                    |
| ---------------------------- | ------------------------------------------------------------ |
| `PFSettings.jsx`             | Configurações (10 seções)                                    |
| `PFStore.jsx`                | Loja Medusa v3.2 (12 extensões, EN, +Kiwify/Hotmart/Landing) |
| `PFCatalog.jsx`              | Catálogo de plugins instalados                               |
| `FounderDashboard.jsx`       | Dashboard Founder (307 linhas)                               |
| `FounderDashboardModal.jsx`  | Modal wrapper do Dashboard                                   |
| `FounderDashboardPopout.jsx` | Pop-out Document PiP                                         |
| `CheckoutModal.jsx`          | Checkout v2.0 (Medusa type badge, ratings, USD-FIRST)        |
| `LoginGate.jsx`              | Gate de autenticação                                         |
| `LoginModal.jsx`             | Modal de login                                               |
| `DevModePanel.jsx`           | DevTools (Console, MCP, API Tester)                          |
| `PATCouncilPanel.jsx`        | 🏛️ Panda Council (PAT Governance)                            |
| `BundleCreator.jsx`          | Criador de bundles                                           |
| `PluginManifestEditor.jsx`   | Editor de panda.mcp.json                                     |
| `PandaDefendDashboard.jsx`   | Dashboard de segurança                                       |
| `PanicButton.jsx`            | Botão de pânico                                              |
| `FinancePanel.jsx`           | Painel financeiro                                            |
| `GasometerPanel.jsx`         | ⛽ Gasômetro — GAS usage dashboard v1.0                      |
| `FloatingAppWindow.jsx`      | Multi-window FlexLayout                                      |

#### Hooks

| Arquivo                | Descrição            |
| ---------------------- | -------------------- |
| `useAuth.jsx`          | Autenticação         |
| `useFirebase.js`       | Firebase RTDB + Auth |
| `useGAS.js`            | GAS endpoints        |
| `useHealthStatus.js`   | Health polling       |
| `useFounderMetrics.js` | Métricas Founder     |
| `useMarketplace.js`    | Marketplace hooks    |
| `useCheckout.js`       | Checkout hooks       |
| `useLandingPage.js`    | Landing page hooks   |
| `useGasometer.js`      | ⛽ GAS quota monitor |

#### Services

| Arquivo        | Descrição         |
| -------------- | ----------------- |
| `uiContext.js` | Context global UI |

#### Styles

| Arquivo                      | Descrição                              |
| ---------------------------- | -------------------------------------- |
| `pf.css`                     | Design system principal (~2560 linhas) |
| `PFSettings.css`             | Estilos Settings modal                 |
| `DevModePanel.css`           | Estilos DevTools                       |
| `PATCouncilPanel.css`        | Estilos Panda Council panel            |
| `FounderDashboard.css`       | Estilos Founder                        |
| `FounderDashboardModal.css`  | Estilos modal Founder                  |
| `FounderDashboardPopout.css` | Estilos popout                         |
| `CheckoutModal.css`          | Estilos checkout                       |
| `LoginModal.css`             | Estilos login                          |
| `BundleCreator.css`          | Estilos bundle                         |
| `PandaDefendDashboard.css`   | Estilos segurança                      |
| `PanicButton.css`            | Estilos panic                          |
| `FinancePanel.css`           | Estilos finance                        |
| `PluginManifestEditor.css`   | Estilos manifest                       |
| `GasometerPanel.css`         | Estilos Gasômetro                      |

---

## 🎨 CSS (css/)

> ⚠️ **Nota:** O design system principal foi migrado de `css/pf.theme.css` para `11.jam/src/styles/pf.css` (1961 linhas, namespace `--pf-*`).
> Os arquivos em `css/` são legados do Shell HTML.

---

## ⚙️ Config Files

| Arquivo                       | Descrição         |
| ----------------------------- | ----------------- |
| `manifest.json`               | PWA manifest      |
| `package.json`                | NPM dependencies  |
| `package-lock.json`           | NPM lock          |
| `jsconfig.json`               | JS/TS config      |
| `PandaFactory.code-workspace` | VS Code workspace |
| `sw.js`                       | Service Worker    |
| `vite.config.js`              | Vite build config |

---

## 🐼 Moltbook Integration (12.moltbook/) — ⚠️ ARQUIVADO

> **Status:** Diretório movido para `_backup_pre_numbered/moltbook/`. Os arquivos listados abaixo existem apenas no backup.

| Arquivo                           | Descrição            |
| --------------------------------- | -------------------- |
| `credentials.json`                | Credenciais Moltbook |
| `MOLTBOOK_library.md`             | Biblioteca           |
| `MOLTBOOK_PROTOCOL.md`            | Protocolo            |
| `README_PF_MOLTBOOK.md`           | README               |
| `temp_post.json`                  | Post temporário      |
| `skills/12.moltbook/SKILL.md`     | Skill definition     |
| `skills/12.moltbook/HEARTBEAT.md` | Heartbeat skill      |
| `skills/12.moltbook/MESSAGING.md` | Messaging skill      |
| `skills/12.moltbook/package.json` | Skill package        |

---

## 🛠️ Scripts (9.tools/) - 39 arquivos

### Automação

| Arquivo                       | Descrição             |
| ----------------------------- | --------------------- |
| `publish-sdk.ps1`             | Publish SDK (Windows) |
| `publish-sdk.sh`              | Publish SDK (Unix)    |
| `scraper_guia_automatico.py`  | Web scraper           |
| `extrair_clientes.py`         | Extrator clientes     |
| `importar_guia_construcao.py` | Importador            |

### Refactoring

| Arquivo                 | Descrição        |
| ----------------------- | ---------------- |
| `cleanup_ui.py`         | UI cleanup       |
| `complete_cleanup.py`   | Complete cleanup |
| `extract_core.py`       | Extract core     |
| `extract_modals.py`     | Extract modals   |
| `extract_modules.py`    | Extract modules  |
| `extract_modules_v2.py` | Extract v2       |
| `final_cleanup.py`      | Final cleanup    |

### Fixes

| Arquivo                 | Descrição       |
| ----------------------- | --------------- |
| `fix_header.py`         | Fix header      |
| `fix_omni_bar.py`       | Fix omni bar    |
| `fix_omni_layout.py`    | Fix omni layout |
| `fix_settings_modal.py` | Fix settings    |

### Injections

| Arquivo                     | Descrição       |
| --------------------------- | --------------- |
| `inject_dock_fix.py`        | Inject dock fix |
| `inject_firebase_bridge.py` | Inject Firebase |
| `inject_settings_modal.py`  | Inject settings |
| `inject_status_monitor.py`  | Inject monitor  |
| `inject_theme_fix.py`       | Inject theme    |

---

## 🔧 Tools (9.tools/)

| Arquivo                 | Descrição           |
| ----------------------- | ------------------- |
| `backup_auto.bat`       | Auto backup         |
| `Importar_Clientes.bat` | Importar clientes   |
| `Iniciar_CRM.bat`       | Iniciar CRM         |
| `INICIAR_SISTEMA.bat`   | Iniciar sistema     |
| `panda_orchestrator.py` | Orchestrator Python |
| `requirements.txt`      | Python requirements |

---

## 🖼️ Assets (LOGO/)

| Arquivo                                       | Descrição   |
| --------------------------------------------- | ----------- |
| `logo git hub.png`                            | Logo GitHub |
| `logo STORE git hub2.png`                     | Logo Store  |
| `panda_logo.jpg`                              | Logo JPG    |
| `Gemini_Generated_Image_56rqs556rqs556rq.jpg` | AI Generate |
| `Gemini_Generated_Image_56rqs556rqs556rq.png` | AI Generate |

---

## 📦 Dependências (Não listadas individualmente)

| Pasta                    | Conteúdo      | Regenerar            |
| ------------------------ | ------------- | -------------------- |
| `node_modules/`          | ~50k NPM deps | `npm install`        |
| `11.jam/node_modules/`   | Jam deps      | `cd 11.jam && npm i` |
| `7.7.rust-agent/target/` | Build cache   | `cargo build`        |

---

> 📖 **Mantido por:** Panda Council (PAT)
> **Última atualização:** 2026-02-09 v2.4.0
