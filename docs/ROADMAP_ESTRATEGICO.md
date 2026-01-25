# 🗺️ ROADMAP ESTRATÉGICO - Panda Factory

> **Última Atualização:** 2026-01-24  
> **Validação:** PANDA.md, PF_MASTER_ARCHITECTURE.md, PF_TOKENOMICS_REFERENCE.md  
> **Visão:** Google Partner Showcase + P2P Compute Network

---

## 📊 Status Geral por Categoria

| #   | Categoria                  | Implementado | Pendente | Prioridade | Fase |
| --- | -------------------------- | ------------ | -------- | ---------- | ---- |
| 1   | **Shell/Frontend**         | ✅ 95%       | 5%       | ✅ Feito   | 0    |
| 2   | **SDK Core**               | ✅ 85%       | 15%      | ✅ Feito   | 0    |
| 3   | **Firebase/GAS Backend**   | ✅ 90%       | 10%      | ✅ Feito   | 0    |
| 4   | **Tentacles Architecture** | ✅ 100%      | -        | ✅ Feito   | 0    |
| 5   | **Rust Agent**             | 🟡 20%       | 80%      | 🔴 Alta    | 1    |
| 6   | **GPU/NVIDIA**             | 🟡 10%       | 90%      | 🔴 Alta    | 1    |
| 7   | **Medusa Store**           | ❌ 0%        | 100%     | 🔴 Alta    | 1    |
| 8   | **3 AI Cores**             | 🟡 30%       | 70%      | 🔴 Alta    | 1    |
| 9   | **Google Tentacle**        | ❌ 0%        | 100%     | 🔴 Alta    | 1    |
| 10  | **Tokenomics/PC**          | 🟡 40%       | 60%      | 🔴 Alta    | 1    |
| 11  | **Segurança (Ed25519)**    | 🟡 50%       | 50%      | 🔴 Alta    | 1    |
| 12  | **P2P Compute Network**    | ❌ 0%        | 100%     | 🟡 Média   | 2    |
| 13  | **VSX/Plugin Store**       | ❌ 0%        | 100%     | 🟡 Média   | 2    |
| 14  | **Social Hub**             | 🟡 30%       | 70%      | 🟡 Média   | 2    |
| 15  | **Trading Hub (cTrader)**  | ❌ 5%        | 95%      | 🟡 Média   | 2    |
| 16  | **EdTech/Infoprodutos**    | ❌ 0%        | 100%     | 🟢 Baixa   | 3    |
| 17  | **Creative Marketplace**   | ❌ 0%        | 100%     | 🟢 Baixa   | 3    |
| 18  | **Gaming/Audio/Video**     | ❌ 5%        | 95%      | 🟢 Baixa   | 3    |

---

## ✅ FASE 0: Foundation (FEITO)

> **Status:** 95% Completo | **Data:** Jan/2026

### 0.1. Shell Frontend

| Item              | Status   | Arquivo                  |
| ----------------- | -------- | ------------------------ |
| PandaFactory.html | ✅ Feito | `PandaFactory.html`      |
| AppDock           | ✅ Feito | `Comp_AppDock.html`      |
| DevToolsDock      | ✅ Feito | `Comp_DevToolsDock.html` |
| Sidebar (Chat IA) | ✅ Feito | `Comp_Sidebar.html`      |
| Header            | ✅ Feito | `Comp_Header.html`       |
| Theme System      | ✅ Feito | `pf.theme.css`           |

### 0.2. SDK Core

| Módulo       | Status   | Descrição             |
| ------------ | -------- | --------------------- |
| Panda.Auth   | ✅ Feito | Firebase Auth         |
| Panda.Data   | ✅ Feito | CRUD Sheets/Firestore |
| Panda.UI     | ✅ Feito | Modais, toasts, dock  |
| Panda.Bridge | 🟡 90%   | Comunicação Rust      |
| Panda.Wallet | ✅ Feito | Saldo PC              |
| Panda.Brain  | 🟡 70%   | IA headless           |
| Panda.GPU    | ❌ 10%   | GPU detection         |

### 0.3. Backend GAS

| Script           | Status   | Função           |
| ---------------- | -------- | ---------------- |
| PF_Auth.gs       | ✅ Feito | Autenticação     |
| PF_Dispatcher.gs | ✅ Feito | Router principal |
| PF_Wallet.gs     | ✅ Feito | Transações PC    |
| PF_Data.gs       | ✅ Feito | CRUD Sheets      |
| PF_Brain_Core.gs | 🟡 70%   | 6 GEMS           |

---

## 🔴 FASE 1: Stack Dia 1 (EM DEV)

> **Objetivo:** Panda nasce completo: Shell + Store + GPU + AI  
> **Data Alvo:** Fev/2026

### 1.1. Estrutura Dia 1

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         STACK DIA 1                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🦀 RUST AGENT                          🔥 FIREBASE/GAS                │
│  ├── MCP Server                         ├── Auth                        │
│  ├── WebView (Tauri)                    ├── Firestore                   │
│  ├── GPU/CUDA Detection                 ├── Sheets (Configs)            │
│  ├── Polyglot (NLLB)                    └── Cloud Functions             │
│  ├── Whisper (STT)                                                      │
│  └── Antigravity UI                     🛒 MEDUSA STORE                 │
│                                         ├── Admin SDK                   │
│  🤖 3 AI CORES                          ├── White-label                 │
│  ├── PAT (Founder/Governance)           └── Plugin System               │
│  ├── Brain (Users/Devs headless)                                        │
│  └── Antigravity (Coding Assistant)     💻 GPU                          │
│                                         ├── NVIDIA Web (Cloud)          │
│                                         └── NVIDIA Local (Free)         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2. Rust Agent

| Item                 | Status | Esforço | Data Alvo |
| -------------------- | ------ | ------- | --------- |
| MCP Server (Tools)   | 🟡 60% | 8h      | Fev/2026  |
| WebView (Tauri)      | ❌ 0%  | 8h      | Fev/2026  |
| GPU Detection        | ❌ 0%  | 4h      | Fev/2026  |
| Polyglot (NLLB)      | ❌ 0%  | 8h      | Fev/2026  |
| Whisper (STT)        | ❌ 0%  | 8h      | Fev/2026  |
| Antigravity UI       | ❌ 0%  | 12h     | Fev/2026  |
| Download Progressivo | ❌ 0%  | 8h      | Fev/2026  |

### 1.3. 3 AI Cores

| Core           | Status | Esforço | Data Alvo | Descrição               |
| -------------- | ------ | ------- | --------- | ----------------------- |
| PAT (Core 1)   | 🟡 70% | 8h      | Fev/2026  | Founder/Governance      |
| Brain (Core 2) | 🟡 80% | 4h      | Fev/2026  | Users/Devs headless     |
| Antigravity    | ❌ 0%  | 16h     | Fev/2026  | Coding Assistant (BYOL) |

### 1.4. Medusa Store

| Item                  | Status | Esforço | Data Alvo |
| --------------------- | ------ | ------- | --------- |
| Base Setup            | ❌ 0%  | 4h      | Fev/2026  |
| Admin SDK Integration | ❌ 0%  | 8h      | Fev/2026  |
| White-label System    | ❌ 0%  | 16h     | Mar/2026  |
| Plugin System         | ❌ 0%  | 12h     | Mar/2026  |

### 1.5. Google Tentacle

```text
js/tentacles/google/
├── pf.google-parent.js          ← Parent nativo
└── children/
    ├── drive.js                 ← Storage base
    ├── sheets.js                ← DB gratuito
    ├── colab.js                 ← GPU/Compile universal
    ├── firebase.js              ← Auth + Realtime
    ├── calendar.js              ← Agendamento
    ├── docs.js                  ← Documentos
    ├── gmail.js                 ← Email
    └── youtube-data.js          ← API YouTube
```

| Item            | Status   | Esforço | Data Alvo |
| --------------- | -------- | ------- | --------- |
| drive.js        | ✅ Feito | -       | ✅ Jan    |
| sheets.js       | ✅ Feito | -       | ✅ Jan    |
| colab.js        | ✅ Feito | -       | ✅ Jan    |
| firebase.js     | ✅ Feito | -       | ✅ Jan    |
| calendar.js     | ✅ Feito | -       | ✅ Jan    |
| docs.js         | ✅ Feito | -       | ✅ Jan    |
| gmail.js        | ✅ Feito | -       | ✅ Jan    |
| youtube-data.js | ✅ Feito | -       | ✅ Jan    |

### 1.6. Tokenomics & Webhooks

| Item                  | Status   | Esforço | Data Alvo | Arquivo             |
| --------------------- | -------- | ------- | --------- | ------------------- |
| Panda Coin (PC) Logic | ✅ Feito | -       | ✅ Jan    | PF_Wallet.gs        |
| Dev/User Split        | ✅ Feito | -       | ✅ Jan    | PF_Tokenomics       |
| Free Tier Rules       | ✅ Feito | -       | ✅ Jan    | PF_Config.gs        |
| Webhook Kiwify        | ✅ Feito | -       | ✅ Jan    | PF_Core_Webhooks.gs |
| Webhook Hotmart       | ✅ Feito | -       | ✅ Jan    | PF_Core_Webhooks.gs |
| Webhook Eduzz         | ✅ Feito | -       | ✅ Jan    | PF_Core_Webhooks.gs |
| Webhook Landing       | ✅ Feito | -       | ✅ Jan    | PF_Core_Webhooks.gs |
| Webhook Stripe        | ✅ Feito | -       | ✅ Jan    | PF_Core_Webhooks.gs |
| Webhook Mercado Pago  | ✅ Feito | -       | ✅ Jan    | PF_Core_Webhooks.gs |
| DRM Tokenizado        | ✅ Feito | -       | ✅ Jan    | pf.drm.js           |
| Solana Migration      | ❌ 0%    | 40h     | Q2/2026   | -                   |

### 1.7. Segurança

| Item                 | Status   | Esforço | Data Alvo |
| -------------------- | -------- | ------- | --------- |
| Ed25519 Founder Auth | 🟡 50%   | 8h      | Fev/2026  |
| Cell Isolation       | ✅ Feito | -       | ✅ Jan    |
| Kill Switch          | ✅ Feito | -       | ✅ Jan    |
| WASM Sandbox         | ❌ 0%    | 8h      | Mar/2026  |

---

## 🟡 FASE 2: Escala (PLANEJADO)

> **Objetivo:** Expandir mercados e monetização  
> **Data Alvo:** Mar-Abr/2026

### 2.1. P2P Compute Network

```text
┌─────────────────────────────────────────────────────────────┐
│                    PANDA COMPUTE NETWORK                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PROVIDERS (Quem Aluga)           CONSUMERS (Quem Usa)      │
│  ├── Google Colab (oficial)       ├── Dev compilando        │
│  ├── WebNVIDIA/GeForce Now        ├── Artista renderizando  │
│  ├── Servers dedicados            ├── Jornalista processando│
│  └── Fulano (PC gamer ocioso)     └── Estudante treinando ML│
│                                                             │
│  SPLIT DE RECEITA (Art. 7 Constituição)                     │
│  └── 95% Host / 5% Panda                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Item              | Status | Esforço | Data Alvo |
| ----------------- | ------ | ------- | --------- |
| Host Registration | ❌ 0%  | 8h      | Mar/2026  |
| Job Queue System  | ❌ 0%  | 12h     | Mar/2026  |
| Payment Split     | ❌ 0%  | 8h      | Mar/2026  |
| Sandbox Execution | ❌ 0%  | 16h     | Abr/2026  |

### 2.2. VSX Store Universal + VM Network

> **Foco Principal:** Google Cloud VMs como base, com rede descentralizada de hosts/farms

```text
┌─────────────────────────────────────────────────────────────┐
│              VSX STORE + VM NETWORK                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TIER 1: GOOGLE VMS (Foco Principal)                        │
│  ├── Compute Engine (VMs on-demand)                         │
│  ├── Cloud Run (Containers)                                 │
│  └── Colab Pro (GPU/ML)                                     │
│                                                             │
│  TIER 2: REDE DESCENTRALIZADA                               │
│  ├── Hosts (usuários com PC potente)                        │
│  ├── Farms (datacenters parceiros)                          │
│  └── Ingress (usuários que querem alugar capacidade)        │
│                                                             │
│  FLUXO: User → Panda → Google VM (default) → Fallback Hosts │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Item                    | Status | Esforço | Data Alvo |
| ----------------------- | ------ | ------- | --------- |
| Google VM Integration   | ❌ 0%  | 12h     | Mar/2026  |
| GitHub Integration      | ❌ 0%  | 8h      | Mar/2026  |
| Google Cloud Source     | ❌ 0%  | 8h      | Mar/2026  |
| GitLab Integration      | ❌ 0%  | 4h      | Abr/2026  |
| Host Registration       | ❌ 0%  | 8h      | Abr/2026  |
| Farm Partnership Portal | ❌ 0%  | 12h     | Abr/2026  |
| Auto-update System      | ❌ 0%  | 8h      | Abr/2026  |

### 2.3. Social Hub

> **Arquivos encontrados:** `js/social/` (6 arquivos) + `js/tentacles/social/children/` (4 arquivos)

| Item           | Status   | Esforço | Data Alvo | Arquivo                  |
| -------------- | -------- | ------- | --------- | ------------------------ |
| Social Core    | ✅ Feito | -       | ✅ Jan    | pf.social-core.js (11KB) |
| WhatsApp       | ✅ Feito | -       | ✅ Jan    | pf.social-whatsapp.js    |
| YouTube        | ✅ Feito | -       | ✅ Jan    | pf.social-youtube.js     |
| Instagram/Meta | ✅ Feito | -       | ✅ Jan    | pf.social-meta.js        |
| TikTok         | ✅ Feito | -       | ✅ Jan    | pf.social-tiktok.js      |
| Twitter/X      | ✅ Feito | -       | ✅ Jan    | pf.social-twitter.js     |
| Telegram       | ✅ Feito | -       | ✅ Jan    | pf.social-telegram.js    |

### 2.5. Distribution Hub (NEW - Jan/2026)

| Item         | Status   | Esforço | Data Alvo | Arquivo                   |
| ------------ | -------- | ------- | --------- | ------------------------- |
| Dist Parent  | ✅ Feito | -       | ✅ Jan    | pf.distribution-parent.js |
| itch.io Hook | ✅ Feito | -       | ✅ Jan    | children/itch.js          |
| PWA Hook     | ✅ Feito | -       | ✅ Jan    | children/pwa.js           |
| Panda Arcade | ✅ Feito | -       | ✅ Jan    | children/arcade.js        |
| Google Play  | 🟡 0%    | 8h      | Fev/2026  | children/google-play.js   |
| Steam        | ❌ 0%    | 12h     | Mar/2026  | children/steam.js         |

### 2.4. Trading Hub (cTrader)

> **Arquivos:** `js/tentacles/trading/pf.trading-parent.js` + `children/ctrader.js`

| Item                 | Status   | Esforço | Data Alvo | Arquivo              |
| -------------------- | -------- | ------- | --------- | -------------------- |
| Trading Parent       | ✅ Feito | -       | ✅ Jan    | pf.trading-parent.js |
| cTrader Connection   | ✅ Feito | -       | ✅ Jan    | children/ctrader.js  |
| Open API Integration | ✅ Feito | -       | ✅ Jan    | children/ctrader.js  |
| cBot Template        | ❌ 0%    | 12h     | Abr/2026  | -                    |
| Indicator System     | ❌ 0%    | 8h      | Abr/2026  | -                    |
| Backtesting          | ❌ 0%    | 16h     | Mai/2026  | -                    |

---

## 🟢 FASE 3: Expansão (FUTURO)

> **Objetivo:** Novos mercados verticais  
> **Data Alvo:** Q2-Q3/2026

### 3.1. EdTech & Infoprodutos

| Item                  | Status | Esforço | Data Alvo |
| --------------------- | ------ | ------- | --------- |
| Course Builder        | ❌ 0%  | 20h     | Mai/2026  |
| Hotmart/Eduzz Webhook | ❌ 0%  | 4h      | Mai/2026  |
| DRM Protection        | ❌ 0%  | 8h      | Mai/2026  |
| Certificate Generator | ❌ 0%  | 8h      | Jun/2026  |

### 3.2. Creative Marketplace

| Item               | Status | Esforço | Data Alvo |
| ------------------ | ------ | ------- | --------- |
| Asset Upload       | ❌ 0%  | 8h      | Jun/2026  |
| Preview System     | ❌ 0%  | 8h      | Jun/2026  |
| License Management | ❌ 0%  | 12h     | Jun/2026  |
| Creator Payouts    | ❌ 0%  | 8h      | Jul/2026  |

### 3.3. Gaming, Audio & Video

| Area   | Item           | Status | Esforço | Data Alvo |
| ------ | -------------- | ------ | ------- | --------- |
| Gaming | Godot Wasm     | ❌ 0%  | 12h     | Mai/2026  |
| Gaming | Bevy Rust      | ❌ 0%  | 16h     | Jun/2026  |
| Gaming | Three.js       | ❌ 5%  | 8h      | Mai/2026  |
| Audio  | Whisper STT    | ❌ 0%  | 8h      | Abr/2026  |
| Audio  | ElevenLabs TTS | ❌ 0%  | 4h      | Abr/2026  |
| Video  | FFmpeg Wasm    | ❌ 0%  | 8h      | Mai/2026  |
| Video  | Veo (Google)   | ❌ 0%  | 8h      | Jun/2026  |

---

## 📋 Priorização Master

| #   | Item                 | Fase | Esforço | Data Alvo | Impacto    |
| --- | -------------------- | ---- | ------- | --------- | ---------- |
| 1   | Rust Agent (MCP)     | 1    | 16h     | Fev/2026  | 🔴 Crítico |
| 2   | 3 AI Cores           | 1    | 48h     | Fev/2026  | 🔴 Crítico |
| 3   | GPU/NVIDIA           | 1    | 12h     | Fev/2026  | 🔴 Crítico |
| 4   | Medusa Store         | 1    | 40h     | Mar/2026  | 🔴 Crítico |
| 5   | Google Tentacle      | 1    | 24h     | Mar/2026  | 🔴 Crítico |
| 6   | Ed25519 Security     | 1    | 8h      | Fev/2026  | Alto       |
| 7   | Webhook Hotmart      | 1    | 2h      | Fev/2026  | Alto       |
| 8   | P2P Compute MVP      | 2    | 44h     | Abr/2026  | Alto       |
| 9   | VSX Store            | 2    | 40h     | Abr/2026  | Médio      |
| 10  | Social Hub           | 2    | 30h     | Mar/2026  | Médio      |
| 11  | Trading Hub          | 2    | 44h     | Mai/2026  | Médio      |
| 12  | EdTech               | 3    | 40h     | Jun/2026  | Médio      |
| 13  | Creative Marketplace | 3    | 36h     | Jul/2026  | Baixo      |
| 14  | Gaming/Audio/Video   | 3    | 64h     | Q3/2026   | Baixo      |

---

## ⚠️ Decisões Estratégicas

| Decisão               | Razão                                  |
| --------------------- | -------------------------------------- |
| ❌ VFS Próprio        | Foco em parceria, não concorrência     |
| ✅ Google First       | Showcase = argumento para partnership  |
| ✅ P2P Compute        | Descentralização + monetização hosts   |
| ✅ VSX Universal      | Aggregar, não duplicar                 |
| ✅ BYOL Antigravity   | Dev traz sua key, custo zero pra Panda |
| ✅ GCP on-demand      | Core 1 sem infra própria               |
| ✅ Medusa White-label | Store customizável para clientes       |

---

## 🔗 Referências

| Documento                            | Conteúdo                   |
| ------------------------------------ | -------------------------- |
| `PANDA.md`                           | Constituição (12 Artigos)  |
| `PF_MASTER_ARCHITECTURE.md`          | Como implementar tudo      |
| `PF_TOKENOMICS_REFERENCE.md`         | Panda Coin, splits, tiers  |
| `PF_SDK_REFERENCE.md`                | API do SDK JavaScript      |
| `PF_GAS_REFERENCE.md`                | Backend Google Apps Script |
| `PF_PLUGIN_AND_MODULAR_REFERENCE.md` | Sistema de plugins         |

---

> 📝 **Fonte arquivada:** `_archive/Com certeza.md`
