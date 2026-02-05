# 📁 PF_FILE_REGISTRY - Catálogo de Arquivos

> **Versão:** 2.0.0 | **Atualizado:** 2026-02-05
> **Propósito:** Inventário COMPLETO de todos os arquivos do Panda Factory

---

## 📊 Resumo Atualizado

| Extensão | Quantidade | Domínio Principal      |
| -------- | ---------- | ---------------------- |
| `.gs`    | 17         | Backend GAS            |
| `.rs`    | 8          | Rust Agent             |
| `.md`    | 25+        | Documentação           |
| `.js`    | 85+        | Frontend/SDK/Tentacles |
| `.html`  | 40+        | UI/Components/Modules  |
| `.css`   | 10+        | Estilos                |
| `.json`  | 15+        | Config                 |
| `.py`    | 25+        | Scripts/Automação      |

---

## 🔧 Backend GAS (17 arquivos)

### Core

| Arquivo               | Caminho         | Descrição                                  |
| --------------------- | --------------- | ------------------------------------------ |
| `PF_Dispatcher.gs`    | `1.core/core/` | Router principal (doGet/doPost) - Tri-Mode |
| `PF_Config.gs`        | `1.core/core/` | Configurações globais                      |
| `PF_App_Init.gs`      | `1.core/core/` | Inicialização do app                       |
| `PF_Core_AI.gs`       | `1.core/core/` | Dispatcher AI multimodal                   |
| `PF_Core_Oracle.gs`   | `1.core/core/` | Cotação USD/BRL                            |
| `PF_Core_Webhooks.gs` | `1.core/core/` | Webhooks B2B (Kiwify, Hotmart, etc.)       |
| `PF_Brain_Core.gs`    | `1.core/core/` | Core do Brain AI                           |
| `PF_Moltbook.gs`      | `1.core/core/` | Integração Moltbook                        |
| `PF_PAT_Core.gs`      | `1.core/core/` | Panda Council (Governança)                 |

### Finance

| Arquivo        | Caminho                    | Descrição                    |
| -------------- | -------------------------- | ---------------------------- |
| `PF_Wallet.gs` | `1.core/domains/finance/` | Carteira Panda Coin          |
| `PF_Crypto.gs` | `1.core/domains/finance/` | Pagamentos crypto (USDC/SOL) |
| `PF_Fiat.gs`   | `1.core/domains/finance/` | Pagamentos fiat (Stripe/PIX) |

### Store

| Arquivo             | Caminho                  | Descrição                     |
| ------------------- | ------------------------ | ----------------------------- |
| `PF_Sales.gs`       | `1.core/domains/store/` | Vendas e Split (52/25/15/5/3) |
| `PF_Registry.gs`    | `1.core/domains/store/` | Registro de módulos           |
| `PF_Marketplace.gs` | `1.core/domains/store/` | Medusa Store backend          |

### Automation & P2P

| Arquivo      | Caminho                       | Descrição                        |
| ------------ | ----------------------------- | -------------------------------- |
| `PF_Bots.gs` | `1.core/domains/automation/` | Automação de tarefas             |
| `PF_P2P.gs`  | `1.core/domains/p2p/`        | 🌐 Node registry, tasks, rewards |

---

## 🦀 Rust Agent (8 arquivos)

| Arquivo       | Caminho           | Descrição                   |
| ------------- | ----------------- | --------------------------- |
| `main.rs`     | `7.7.rust-agent/src/` | Entry point, CLI dispatcher |
| `mcp.rs`      | `7.7.rust-agent/src/` | MCP Server (4 tools)        |
| `crypto.rs`   | `7.7.rust-agent/src/` | Ed25519 Founder Auth        |
| `gpu.rs`      | `7.7.rust-agent/src/` | NVIDIA/CUDA detection       |
| `health.rs`   | `7.7.rust-agent/src/` | Health monitoring           |
| `moltbook.rs` | `7.7.rust-agent/src/` | Moltbook client             |
| `node.rs`     | `7.7.rust-agent/src/` | 🌐 P2P Node Manager         |
| `mining.rs`   | `7.7.rust-agent/src/` | ⛏️ Mining & Partner Mode    |
| `Cargo.toml`  | `7.7.rust-agent/`     | Dependências Rust           |

---

## 📚 Documentação (19+ arquivos em 8.docs/)

| Arquivo                              | Descrição                        |
| ------------------------------------ | -------------------------------- |
| `PF_MASTER_ARCHITECTURE.md`          | 🌟 Arquitetura completa (~192KB) |
| `PF_FILE_REGISTRY.md`                | 📁 Este arquivo (catálogo)       |
| `PF_SDK_REFERENCE.md`                | SDK, Tentacles, Event Bus        |
| `PF_UI_REFERENCE.md`                 | Design System + Componentes      |
| `PF_BACKEND_REFERENCE.md`            | Backend geral + Firebase + Rust  |
| `PF_P2P_REFERENCE.md`                | P2P + Partner + Nodes + Mining   |
| `PF_GAS_REFERENCE.md`                | Google Apps Script (Tri-Mode)    |
| `PF_MCP_REFERENCE.md`                | Model Context Protocol           |
| `PF_GEMINI_REFERENCE.md`             | Gemini 2.0/3.0 Flash             |
| `PF_MOLTBOOK_REFERENCE.md`           | Rede social de agentes           |
| `PF_COLAB_REFERENCE.md`              | Google Colab BYOC                |
| `PF_AGENT_CONSTITUTION.md`           | Persona IA pública               |
| `PF_ECONOMY_REFERENCE.md`            | Panda Coin + Tokenomics          |
| `PF_SECURITY_REFERENCE.md`           | 🛡️ Pipeline + Panda Defend       |
| `PF_SOCIAL_REFERENCE.md`             | Social Hub APIs                  |
| `PF_EDUCATION_REFERENCE.md`          | EdTech integration               |
| `PF_PLUGIN_AND_MODULAR_REFERENCE.md` | Sistema plugins + cTrader        |
| `PF_MEDUSA_REFERENCE.md`             | Marketplace Store                |
| `PF_OPENSOURCE_CATALOG.md`           | Catálogo OSS                     |

---

## 💻 Frontend SDK & JS (85+ arquivos)

### Core SDK (js/)

> 🏷️ **Status:** 🟢 REAL (callGAS) | 🟡 MOCK (\_delay) | 🔵 HYBRID | ⚪ STATIC

| Arquivo           | Status    | Descrição               |
| ----------------- | --------- | ----------------------- |
| `pf.sdk.js`       | 🔵 HYBRID | 🌟 SDK principal (50KB) |
| `pf.bootstrap.js` | 🟡 MOCK   | Bootstrap loader        |
| `pf.app-init.js`  | 🟡 MOCK   | App initialization      |
| `dock-utils.js`   | ⚪ STATIC | Dock utilities          |

### Kernel (js/kernel/)

| Arquivo            | Status  | Descrição          |
| ------------------ | ------- | ------------------ |
| `pf.loader.js`     | 🟢 REAL | Module loader      |
| `pf.components.js` | 🟢 REAL | Component registry |

### Core Modules (3.sdk/)

| Arquivo                  | Status    | Descrição             |
| ------------------------ | --------- | --------------------- |
| `pf.ai-core.js`          | 🟢 REAL   | AI orchestrator       |
| `pf.drm.js`              | 🔵 HYBRID | Plugin DRM            |
| `pf.firebase-bridge.js`  | 🟢 REAL   | Firebase integration  |
| `pf.i18n.js`             | 🟢 REAL   | Internationalization  |
| `pf.kill-switch.js`      | 🟢 REAL   | Emergency kill switch |
| `pf.workflow-builder.js` | 🟢 REAL   | Workflow automation   |
| `pf.agent-telemetry.js`  | 🟢 REAL   | Agent metrics         |
| `plugin-loader.js`       | 🟢 REAL   | Plugin system         |

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

### Integrations (6.integrations/)

| Arquivo          | Status  | Descrição         |
| ---------------- | ------- | ----------------- |
| `pf.ctrader.js`  | 🟡 MOCK | cTrader API       |
| `pf.youtube.js`  | 🟡 MOCK | YouTube Data API  |
| `pf.twitter.js`  | 🟡 MOCK | Twitter/X API     |
| `pf.whatsapp.js` | 🟡 MOCK | WhatsApp Business |
| `pf.meta.js`     | 🟡 MOCK | Meta (FB + IG)    |

### Trading (js/trading/)

| Arquivo               | Status    | Descrição     |
| --------------------- | --------- | ------------- |
| `pf.ctrader-api.js`   | ⚪ STATIC | cTrader API   |
| `pf.ctrader-oauth.js` | 🟢 REAL   | cTrader OAuth |

### Social (js/social/)

| Arquivo                 | Status    | Descrição      |
| ----------------------- | --------- | -------------- |
| `pf.social-core.js`     | 🟡 MOCK   | Social parent  |
| `pf.social-youtube.js`  | ⚪ STATIC | YouTube child  |
| `pf.social-twitter.js`  | ⚪ STATIC | Twitter child  |
| `pf.social-whatsapp.js` | ⚪ STATIC | WhatsApp child |
| `pf.social-meta.js`     | ⚪ STATIC | Meta child     |
| `pf.social-telegram.js` | 🔵 HYBRID | Telegram child |
| `pf.social-tiktok.js`   | ⚪ STATIC | TikTok child   |

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

## 🌐 HTML (40+ arquivos)

### Main

| Arquivo                    | Descrição          |
| -------------------------- | ------------------ |
| `PandaFactory.html`        | App principal      |
| `PandaFactory_BACKUP.html` | Backup             |
| `index.html`               | Landing page       |
| `founder-dashboard.html`   | Dashboard fundador |

### Pitch Decks

| Arquivo              | Descrição     |
| -------------------- | ------------- |
| `pitch-deck.html`    | Pitch (PT-BR) |
| `pitch-deck-pt.html` | Pitch PT      |
| `pitch-deck-en.html` | Pitch EN      |

### Components (components/)

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

### Modules (modules/)

| Arquivo              | Descrição      |
| -------------------- | -------------- |
| `agenda/index.html`  | Módulo Agenda  |
| `crm/index.html`     | Módulo CRM     |
| `reports/index.html` | Módulo Reports |
| `store/index.html`   | Módulo Store   |

### Jam (11.jam/)

| Arquivo      | Descrição     |
| ------------ | ------------- |
| `index.html` | TLDraw Editor |

### Test

| Arquivo             | Descrição    |
| ------------------- | ------------ |
| `ctrader-test.html` | cTrader Test |

---

## 🎨 CSS (css/)

| Arquivo        | Descrição                  |
| -------------- | -------------------------- |
| `pf.theme.css` | 🌟 Design System principal |

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

---

## 🐼 Moltbook Integration (12.moltbook/)

| Arquivo                        | Descrição            |
| ------------------------------ | -------------------- |
| `credentials.json`             | Credenciais Moltbook |
| `MOLTBOOK_library.md`          | Biblioteca           |
| `MOLTBOOK_PROTOCOL.md`         | Protocolo            |
| `README_PF_MOLTBOOK.md`        | README               |
| `temp_post.json`               | Post temporário      |
| `skills/12.moltbook/SKILL.md`     | Skill definition     |
| `skills/12.moltbook/HEARTBEAT.md` | Heartbeat skill      |
| `skills/12.moltbook/MESSAGING.md` | Messaging skill      |
| `skills/12.moltbook/package.json` | Skill package        |

---

## 🛠️ Scripts (scripts/) - 25+ arquivos

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

| Pasta                | Conteúdo      | Regenerar         |
| -------------------- | ------------- | ----------------- |
| `node_modules/`      | ~50k NPM deps | `npm install`     |
| `11.jam/node_modules/`  | Jam deps      | `cd jam && npm i` |
| `7.7.rust-agent/target/` | Build cache   | `cargo build`     |

---

> 📖 **Mantido por:** Panda Council (PAT)
> **Última atualização:** 2026-02-05 v2.0.0


