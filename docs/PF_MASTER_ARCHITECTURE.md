# 🐼 Panda OS - Arquitetura Completa

![Panda Logo](../assets/panda_logo_original.jpg)

> **Documento Mestre de Arquitetura**
> Consolidação unificada seguindo o Mapa Visual do Projeto.
> Frontend → SDK → Backend Distribuído (3 Pilares).
> **Atualizado:** 2026-01-27

---

## 📚 Arquivos de Referência

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                         DOCUMENTAÇÃO PANDA FACTORY                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ARQUITETURA & CORE                    SDK & INTEGRAÇÕES                   │
│  ├── PF_MASTER_ARCHITECTURE.md ★       ├── PF_SDK_REFERENCE.md             │
│  ├── PF_GAS_REFERENCE.md               ├── PF_PLUGIN_AND_MODULAR.md        │
│  ├── PF_FIREBASE_REFERENCE.md          ├── PF_PLUGIN_MANIFEST.md           │
│  ├── PF_RUST_REFERENCE.md              ├── PF_MCP_REFERENCE.md             │
│  └── PF_AUTH_REFERENCE.md              └── PF_TECHS_SDK.md                 │
│                                                                             │
│  FRONTEND & UI                         ECONOMIA & NEGÓCIOS                 │
│  ├── PF_JAM_COMPONENTS.md              ├── PF_TOKENOMICS_REFERENCE.md      │
│  ├── PF_CSS_REFERENCE.md               ├── PF_MEDUSA_REFERENCE.md          │
│  └── PF_HTML_REFERENCE.md              └── PF_OPENSOURCE_CATALOG.md        │
│                                                                             │
│  AI & BRAIN                            OPERAÇÕES                           │
│  ├── PF_GEMINI_REFERENCE.md            ├── PF_HEALTH_STATUS.md             │
│  └── PF_EDUCATION_REFERENCE.md         └── README.md                       │
│                                                                             │
│  ★ = DOCUMENTO MESTRE (VOCÊ ESTÁ AQUI)                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estrutura de Pastas do Projeto

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                         PANDA FACTORY - FOLDER MAP                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📁 PandaFactory/                                                          │
│  ├── 📁 .agent/                    # Workflows IA (PANDA.md)               │
│  ├── 📁 .github/workflows/         # CI/CD (Pages, Android, Steam)         │
│  │                                                                          │
│  ├── 📁 backend/                   # ☁️ Google Apps Script                  │
│  │   └── core/                     # PF_Dispatcher.gs, Config              │
│  │                                                                          │
│  ├── 📁 jam/                       # 🍇 React Frontend (Vite + TLDraw)     │
│  │   ├── src/components/           # 22 componentes React                  │
│  │   ├── src/hooks/                # 7 custom hooks                        │
│  │   ├── src/styles/               # jam.css (Design System)               │
│  │   └── dist/                     # Build de produção                     │
│  │                                                                          │
│  ├── 📁 js/                        # 🐼 SDK & Tentacles                     │
│  │   ├── pf.sdk.js                 # SDK principal (50KB)                  │
│  │   ├── pf.bootstrap.js           # Zero-config init                      │
│  │   ├── core/                     # Módulos core                          │
│  │   └── tentacles/                # 8 Integration Modules                 │
│  │       ├── brain/                # AI/ML (Gemini, LocalLLM)              │
│  │       ├── social/               # WhatsApp, Twitter, Meta               │
│  │       ├── trading/              # cTrader Open API                      │
│  │       ├── google/               # Drive, Sheets, Colab                  │
│  │       ├── distribution/         # PWA, Steam, itch.io                   │
│  │       ├── education/            # Kiwify, Hotmart, Eduzz                │
│  │       ├── github/               # Pages, JSON DB, Actions               │
│  │       └── monitor/              # Health/Telemetry                      │
│  │                                                                          │
│  ├── 📁 rust-agent/                # 🦀 Local Agent (Tauri/MCP)            │
│  │   ├── Cargo.toml                # Dependencies                          │
│  │   └── src/                      # 5 modules (GPU, MCP, Firebase)        │
│  │                                                                          │
│  ├── 📁 panda-sdk/                 # 📦 SDK público (npm package)          │
│  ├── 📁 docs/                      # 📚 19 reference documents             │
│  ├── 📁 components/                # 🧩 HTML Components (legacy)           │
│  ├── 📁 css/                       # 🎨 pf.theme.css                       │
│  ├── 📁 data/                      # 💾 JSON Database local                │
│  ├── 📁 dist/                      # 📤 Build output (GitHub Pages)        │
│  ├── 📁 assets/                    # 🖼️ Images, logos                      │
│  ├── 📁 tools/                     # 🔧 Dev utilities                      │
│  │                                                                          │
│  ├── .env                          # 🔐 SECRETS (gitignored)               │
│  ├── index.html                    # 🏠 Entry point                        │
│  ├── manifest.json                 # 📱 PWA config                         │
│  └── PANDA_MASTER_REFERENCE.md     # 📋 Quick Reference                    │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Mapa de Navegação

```text
┌─────────────────────────────────────────────────────────────┐
│                    PANDA OS ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PARTE I: FUNDAMENTOS          PARTE II: TÉCNICA            │
│  ├── §1 Visão Geral            ├── §3 Frontend              │
│  └── §2 Filosofia Hook         ├── §4 SDK (Coração)         │
│                                 ├── §5 Backend (3 Pilares)   │
│  PARTE III: ECONOMIA           ├── §6 Infraestrutura        │
│  ├── §8 Tokenomics             └── §7 Segurança             │
│  ├── §9 P2P Compute                                         │
│  └── §10 Bounty System         PARTE IV: HUBS               │
│                                 ├── §11 Social Media        │
│  PARTE V: ESTRATÉGIA           ├── §12 Trading (cTrader)    │
│  ├── §17 Google Partner        ├── §13 Gaming/Audio/Video   │
│  ├── §18 Game Studio           ├── §14 EdTech               │
│  ├── §19 Roadmap               ├── §15 Assets Marketplace   │
│  └── §20 Referências           └── §16 DevTools/VSX         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Índice

### PARTE I: FUNDAMENTOS

1. [Visão Geral & Mapas Visuais](#1-visão-geral)
2. [O Diferencial "Hook" (Filosofia Core)](#2-filosofia-hook)

### PARTE II: ARQUITETURA TÉCNICA

3. [Camada Frontend: Panda UI & Docks](#3-camada-frontend)
4. [Camada SDK: O Coração](#4-camada-sdk)
5. [Backend: Os 3 Pilares](#5-backend-pilares)
6. [Infraestrutura Híbrida](#6-infraestrutura)
7. [Segurança & Zero-Knowledge](#7-seguranca) (§7.1-7.10)

### PARTE III: ECOSSISTEMA ECONÔMICO

8. [Tokenomics & Monetização](#8-tokenomics)
9. [P2P Compute Network](#9-p2p-compute)
10. [Bounty System & Comunidade](#10-bounty-system)

### PARTE IV: HUBS DE INTEGRAÇÃO

11. [Social Media Hub](#11-social-hub)
12. [Trading Hub (cTrader)](#12-trading-hub)
13. [Gaming, Audio & Video](#13-gaming-audio-video)
14. [EdTech & Infoprodutos](#14-edtech)
15. [Creative Assets Marketplace](#15-assets-marketplace)
16. [Dev Tools & VSX Store](#16-devtools-vsx)

### PARTE V: ESTRATÉGIA & CRESCIMENTO

17. [Google Partner Strategy](#17-google-partner)
18. [Game Studio & Publisher](#18-game-studio)
19. [Roadmap de Implementação](#19-roadmap)
20. [Referências & Convenções](#20-referencias)

---

# PARTE I: FUNDAMENTOS

---

## 1. Visão Geral da Arquitetura

### 1.1. O Mapa Mestre

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Panda UI)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  App Dock   │  │  DevTools   │  │  Sidebar    │  │  Modules    │    │
│  │  (Esquerda) │  │  (Direita)  │  │  (Chat IA)  │  │  (CRM etc)  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                                   │                                      │
│                          ┌────────▼────────┐                            │
│                          │   PANDA SDK     │  ← O "Colchão"             │
│                          │  (JavaScript)   │                            │
│                          └────────┬────────┘                            │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   🦀 RUST AGENT     │  │   ☁️ FIREBASE       │  │   📜 GOOGLE APPS    │
│   (PC Local)        │  │   (Signaling)       │  │   SCRIPT (Backend)  │
│                     │  │                     │  │                     │
│ • GPU Detection     │  │ • Heartbeat         │  │ • Dados Planilha    │
│ • File System       │  │ • Comandos          │  │ • Wallet/Coins      │
│ • DLL/Exe Install   │  │ • Status Online     │  │ • Auth/Quotas       │
│ • MCP Server        │  │ • Telemetria        │  │ • Dispatcher Core   │
│ • Local AI (LLama)  │  │                     │  │                     │
│ • WebView (Tauri)   │  │                     │  │                     │
│ • Antigravity UI    │  │                     │  │                     │
│ • Polyglot (NLLB)   │  │                     │  │                     │
│ • Whisper (STT)     │  │                     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
        │                                                    │
        │  DADOS NUNCA SAEM DAQUI                           │
        │  (Zero-Knowledge)                                  │
        └────────────────────────────────────────────────────┘
```

### 1.2. Detalhe do Hub Central (SDK)

```text
🐼 PANDA SDK
├── (Dev chama)
│   ├── Panda.Data.save
│   ├── Panda.Brain.chat
│   ├── Panda.Bridge.execute
│   └── Panda.GPU.process
└── (SDK traduz para)
    ├── GAS / Sheets (Persistência)
    ├── Firebase (Sinalização)
    ├── Rust Agent (Hardware/Local)
    └── APIs Externas (IA Cloud)
```

### 1.3. Fluxo de Dados Completo

```text
👨‍💻 DEV (Code) --> 🎯 SDK (Router)
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      🦀 RUST        📜 GAS      💾 CACHE
      (Local)       (Cloud)     (Offline)
         │             │           │
         ▼             ▼           ▼
    ⚡ Hardware    ☁️ Sheets    🔄 Sync Queue
    (GPU/DLLs)    (Drive)
         │             │           │
         └─────────────┼───────────┘
                       ▼
                  🔥 FIREBASE
                  (Signaling + Células)
```

### 1.4. Arquitetura Client-Side First

> **Filosofia:** "O Browser faz 90% do trabalho. Cloud só para sync e billing."

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA CLIENT-SIDE FIRST                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BROWSER (90% do trabalho)         CLOUD (10% - só sync/auth)          │
│  ┌──────────────────────────┐     ┌──────────────────────────┐         │
│  │ • React/TLDraw UI        │     │ • Firebase Auth          │         │
│  │ • IndexedDB (local)      │     │ • Firebase RTDB (status) │         │
│  │ • LocalStorage           │────▶│ • GAS (billing/PAT)      │         │
│  │ • Gemini API (direto)    │     │ • Webhooks               │         │
│  │ • Service Worker         │     │                          │         │
│  └──────────────────────────┘     └──────────────────────────┘         │
│                                                                         │
│  RUST AGENT (opcional - 0% cloud)                                       │
│  ┌──────────────────────────┐                                          │
│  │ • GPU/ML local           │  ← Processamento 100% offline            │
│  │ • Antigravity            │                                          │
│  │ • MCP Tools              │                                          │
│  └──────────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

| Benefício           | Impacto                                 |
| ------------------- | --------------------------------------- |
| **Custo Cloud ~$0** | Processamento no browser não gera custo |
| **Privacidade**     | Dados sensíveis ficam locais            |
| **Offline-capable** | PWA funciona sem internet               |
| **Escalabilidade**  | Mais users = mais CPU distribuída       |

### 1.5. Capacidade de Infraestrutura (Free Tier)

| Serviço                | Limite Gratuito         | Uso Real no Panda        |
| ---------------------- | ----------------------- | ------------------------ |
| **Firebase Auth**      | ∞ logins                | Só login (1x por sessão) |
| **Firebase RTDB**      | 10GB/mês, 100k conexões | Status online, heartbeat |
| **Google Apps Script** | 90min/dia exec          | Billing, PAT (ocasional) |
| **Sheets como DB**     | 10M células             | Transações, usuários     |

```text
📊 CAPACIDADE ESTIMADA (Free Tier - Custo $0)

├── Usuários Cadastrados: ~100,000+
├── Usuários Ativos Simultâneos: ~10,000 (limite RTDB connections)
├── Chamadas GAS/dia: ~50,000 (só billing/auth)
├── Storage: ~1GB dados
└── Com Rust Agent: ∞ (processamento local)
```

### 1.6. Modelo Gemini API Compartilhada

> **Referência:** [PF_TOKENOMICS_REFERENCE.md §14](PF_TOKENOMICS_REFERENCE.md#14-modelo-de-compartilhamento-gemini-api)

| Nível           | Quem            | Modelo      | Quota/dia   | Fonte           |
| --------------- | --------------- | ----------- | ----------- | --------------- |
| **User (3)**    | Usuários finais | Flash 3.0   | 300k tokens | Conta Founder   |
| **Dev (2)**     | Desenvolvedores | Flash + Pro | 400k tokens | Conta Founder   |
| **Founder (1)** | Lucas Valério   | Todos       | ∞           | Própria         |
| **BYOL**        | Qualquer        | Qualquer    | ∞           | Própria API Key |

### 1.7. Arquitetura Rust + Firebase Direto

> **Referência:** [PF_RUST_REFERENCE.md](PF_RUST_REFERENCE.md) | [PF_FIREBASE_REFERENCE.md](PF_FIREBASE_REFERENCE.md)

O Rust Agent pode se conectar **diretamente** ao Firebase, sem passar pelo browser. Isso resolve problemas de CORS e melhora segurança:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    RUST AGENT + FIREBASE DIRETO                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  BROWSER                    RUST AGENT                   CLOUD      │
│  ┌──────────────┐          ┌──────────────┐          ┌───────────┐ │
│  │ React UI     │◀────────▶│ Tauri        │─────────▶│ Firebase  │ │
│  │ TLDraw       │  IPC     │ WebView      │  REST    │ RTDB      │ │
│  │ LocalStorage │          │              │          │           │ │
│  └──────────────┘          │ MCP Server   │          └───────────┘ │
│                            │ GPU Module   │                │       │
│                            │ pf_firebase  │                ▼       │
│                            └──────────────┘          ┌───────────┐ │
│                                   │                  │ GAS       │ │
│                                   └─────────────────▶│ (billing) │ │
│                                                      └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Benefícios:**

- 🚫 **Sem CORS:** Rust não tem restrição de origem
- 🔒 **Seguro:** Tokens ficam no PC local, nunca no browser
- 📴 **Offline:** Rust faz queue local + sync depois
- ⚡ **Rápido:** Conexão direta, sem intermediários

### 1.8. Estratégia Dual Repositório

> **Atualizado:** 2026-01-27

O Panda Factory utiliza **dois repositórios** separados para desenvolvimento e produção:

| Repo              | Visibilidade | URL                                  | Uso                       |
| :---------------- | :----------- | :----------------------------------- | :------------------------ |
| **SAAS**          | 🔒 Privado   | `github.com/LucassVal/SAAS`          | Desenvolvimento principal |
| **Panda-Factory** | 🌐 Público   | `github.com/LucassVal/Panda-Factory` | GitHub Pages (produção)   |

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    DUAL REPO SYNC STRATEGY                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LOCAL DEV                    REMOTES                   DEPLOY      │
│  ┌──────────────┐          ┌──────────────┐          ┌───────────┐ │
│  │ Panda Factory │         │ origin:SAAS  │          │ GitHub    │ │
│  │ (Desktop)     │────────▶│ (PRIVADO)    │          │ Pages     │ │
│  │               │    +    ├──────────────┤          │           │ │
│  │               │────────▶│ panda:Public │─────────▶│ Produção  │ │
│  └──────────────┘          └──────────────┘          └───────────┘ │
│                                                                      │
│  COMANDOS:                                                           │
│  git push origin main   ← Código privado                            │
│  git push panda main    ← Deploy público                            │
└─────────────────────────────────────────────────────────────────────┘
```

**URLs de Produção:**

- **App Principal:** `https://lucassval.github.io/Panda-Factory/`
- **cTrader OAuth:** `https://lucassval.github.io/panda-ctrader-auth/`

---

## 3. Camada Frontend: Panda UI & Docks

A interface do Panda OS é composta por "Docks" flutuantes que vivem sobre a aplicação.

### 3.1. Estrutura do DevTools Dock

As 3 Abas do Desenvolvedor:

```text
┌─────────────────────────────────────────────┐
│  🧩 Extensions  │  💻 Console  │  🤖 Brain  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📦 PostgreSQL Connector    [Ativo]  │   │
│  │    Permite IA ler bancos locais     │   │
│  ├─────────────────────────────────────┤   │
│  │ 📄 PDF Parser              [Ativo]  │   │
│  │    Extrai texto de documentos       │   │
│  ├─────────────────────────────────────┤   │
│  │ 📈 MetaTrader Bridge       [Baixar] │   │
│  │    Conecta com MT4/MT5              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [+ Explorar Loja]                         │
└─────────────────────────────────────────────┘
```

### 3.2. Multi-Window Support

> **📌 Nota:** A implementação completa de janelas pop-out usando a **Document Picture-in-Picture API** está documentada na seção [2.3.C - Arquitetura Multi-Window](#c-arquitetura-multi-window-document-pip).

### 3.3. Dev Mode (Modo Desenvolvedor) 🛠️

O Dev Mode é um ambiente de ferramentas avançadas para desenvolvedores, inspirado no Google Antigravity.

#### A. Ativação

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEV MODE TOGGLE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [AppDock]                                                              │
│  ├── 🏠 Home                                                            │
│  ├── 📊 CRM                                                             │
│  ├── ⚙️ Settings                                                        │
│  ├── ────────────                                                       │
│  └── 🛠️ Dev Mode ← CLIQUE ATIVA/DESATIVA                               │
│         │                                                               │
│         ├── OFF: DevToolsDock oculto                                    │
│         ├── ON:  DevToolsDock visível + ícone muda para 🔧              │
│         └── Persistência: localStorage.panda_dev_mode                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componente:** `components/Comp_AppDock.html`
**Lógica:** `js/ui/pf.devtools.js` → `toggleDevMode()`

#### B. DevTools v2.0 - Ferramentas Disponíveis

| Tool                         | Ícone | Modal | Pop-out    | Descrição                          |
| ---------------------------- | ----- | ----- | ---------- | ---------------------------------- |
| **Console**                  | 💻    | ✅    | ✅         | Execução JavaScript em sandbox     |
| **MCP Browser**              | 🧰    | ✅    | ✅         | Lista de MCP Tools do Rust Agent   |
| **API Tester**               | 🔌    | ✅    | ✅         | Testar endpoints GAS               |
| **PAT Treasury**             | 🏦    | ✅    | ✅         | Controles do Banco Central IA      |
| **Constitution Validator**   | ⚖️    | ✅    | ✅         | Validar ações contra os 12 Artigos |
| **Antigravity** ⭐           | 🐼    | ❌    | ✅ WebView | Coding Assistant (BYOL Gemini)     |
| **RIG Config** _(futuro)_    | 🦀    | ✅    | ✅         | Configurar providers IA            |
| **DB Explorer** _(futuro)_   | 🗄️    | ✅    | ✅         | Explorar Sheets/Firebase           |
| **Monaco Editor** _(futuro)_ | 📝    | ✅    | ✅         | Editor de código integrado         |

> **Antigravity** abre em **WebView nativo** no Rust Agent (não no browser).
> Usa BYOL (Bring Your Own License) - dev conecta sua API key Google.
> Auto-update: detecta novas versões e oferece atualização in-app.

#### C. Arquitetura Multi-Window (Document PiP)

O sistema suporta destacar ferramentas para janelas separadas usando a **Document Picture-in-Picture API**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           JANELA PRINCIPAL                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Panda Factory (PandaFactory.html)            │   │
│  │  ┌─────────┐  ┌─────────────────────┐  ┌─────────┐              │   │
│  │  │ AppDock │  │     Canvas          │  │ DevDock │              │   │
│  │  └─────────┘  └─────────────────────┘  └─────────┘              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                    │ POP-OUT (Document PiP) │
         ┌──────────┴──────────┬─────────────┴────────────┐
         ▼                     ▼                          ▼
┌─────────────────┐  ┌─────────────────┐       ┌─────────────────┐
│  💻 Console     │  │  🧰 MCP Browser │  ...  │  🏦 PAT Treasury│
│   (Monitor 2)   │  │   (Monitor 3)   │       │   (Monitor N)   │
└─────────────────┘  └─────────────────┘       └─────────────────┘
```

**API SDK:** `Panda.UI.popout(toolId, options?)`

```javascript
// Abrir ferramenta em janela separada
const pipWindow = await Panda.UI.popout("console", {
  width: 800,
  height: 600,
});

// Listar pop-outs ativos
const active = Panda.UI.getPopouts(); // Map<toolId, Window>

// Fechar pop-out
Panda.UI.closePopout("console");
```

**Compatibilidade:**

- ✅ Chrome 116+ / Edge 116+: Document Picture-in-Picture nativo
- ⚠️ Firefox/Safari: Fallback para `window.open()`

#### D. Implementação Técnica (pf.devtools.js)

```javascript
// Objeto PandaDevTools - Singleton Global
window.PandaDevTools = {
  // Registry de ferramentas
  tools: {
    console:       { icon: '💻', title: 'Console', ... },
    mcp_browser:   { icon: '🧰', title: 'MCP Browser', ... },
    api_tester:    { icon: '🔌', title: 'API Tester', ... },
    pat_treasury:  { icon: '🏦', title: 'PAT Treasury', ... },
    constitution:  { icon: '⚖️', title: 'Constitution Validator', ... }
  },

  // Estado
  isDevMode: false,
  activePopouts: new Map(),

  // Métodos principais
  toggleDevMode(),      // Liga/desliga modo dev
  openDevTool(toolId),  // Abre em modal
  openPopout(toolId),   // Abre em janela PiP
  closePopout(toolId)   // Fecha janela PiP
};
```

#### E. Referência de Arquivos

| Arquivo                             | Responsabilidade                    |
| ----------------------------------- | ----------------------------------- |
| `components/Comp_AppDock.html`      | Botão Dev Mode Toggle               |
| `components/Comp_DevToolsDock.html` | Dock lateral com ícones             |
| `js/ui/pf.devtools.js`              | Lógica DevTools v2.0                |
| `js/pf.sdk.js` (Panda.UI)           | API `popout/getPopouts/closePopout` |
| `css/pf.theme.css`                  | Estilos modal/popout                |

### 3.4. Sistema de Ícones (Logo Kit) 🎨

O Panda Factory utiliza emojis como ícones para garantir consistência cross-platform. Esta seção documenta todos os ícones usados no sistema para criação de kits de logos SVG/PNG.

#### A. Ícones de Navegação (Docks)

| Ícone | Uso Principal        | Componente      |
| ----- | -------------------- | --------------- |
| 🐼    | Logo/Branding        | Header, Loading |
| 🏠    | Home/Dashboard       | AppDock         |
| 📋    | Contatos/CRM         | AppDock         |
| 📅    | Agenda/Calendar      | AppDock         |
| 📊    | Relatórios/Analytics | AppDock         |
| 🏪    | Store/Marketplace    | AppDock         |
| 🛠️    | Dev Mode (OFF)       | AppDock         |
| 🔧    | Dev Mode (ON)        | AppDock         |
| ⚙️    | Settings             | Header          |

#### B. Ícones de Settings Modal

| Ícone | Seção         | SDK Connection |
| ----- | ------------- | -------------- |
| 👤    | Profile       | `Panda.Auth`   |
| 🎨    | Appearance    | Theme/Colors   |
| 🔔    | Notifications | Events         |
| 🧠    | AI Settings   | `Panda.Brain`  |
| 💰    | Wallet        | `Panda.Wallet` |
| ⚡    | Performance   | `Panda.GPU`    |
| 🔒    | Security      | Auth/2FA       |
| 🔌    | Integrations  | `Panda.Bridge` |
| 📊    | Developer     | DevTools       |
| ℹ️    | About         | Version        |

#### C. Ícones de DevTools

| Ícone | Tool          | Descrição          |
| ----- | ------------- | ------------------ |
| 💻    | Console       | JavaScript REPL    |
| 🧰    | MCP Browser   | Lista de Tools     |
| 🔌    | API Tester    | Testar endpoints   |
| 🏦    | PAT Treasury  | Banco Central IA   |
| ⚖️    | Constitution  | Validar 12 Artigos |
| 🧩    | Extensions    | Marketplace        |
| 📝    | Code Editor   | Monaco (futuro)    |
| 🦀    | RIG Config    | Providers IA       |
| 🗄️    | DB Explorer   | Sheets/Firebase    |
| 🌐    | Browser       | Embedded (futuro)  |
| 📄    | Artifacts     | Viewer artefatos   |
| 💬    | Conversations | Histórico chat     |

#### D. Ícones de Status

| Ícone | Status           | Cor Associada |
| ----- | ---------------- | ------------- |
| 🟢    | Online/Connected | `#10b981`     |
| 🔴    | Offline/Error    | `#ef4444`     |
| 🟡    | Warning/Pending  | `#f59e0b`     |
| 🔵    | Info/Active      | `#667eea`     |
| ⚡    | GPU Active       | `#f59e0b`     |
| ☁️    | Cloud Mode       | `#667eea`     |
| 🦀    | Rust Agent       | `#f97316`     |
| 🔥    | Firebase         | `#f59e0b`     |

#### E. Ícones de Backend/Arquitetura

| Ícone | Conceito       | Contexto           |
| ----- | -------------- | ------------------ |
| 📜    | GAS Backend    | Google Apps Script |
| 🦀    | Rust Agent     | Hardware local     |
| ☁️    | Cloud/Firebase | Signaling          |
| 💾    | Cache          | Offline sync       |
| 🔄    | Sync           | Data sync          |
| 🎯    | SDK            | Router central     |
| 👨‍💻    | Developer      | User context       |

#### F. Ícones de Economia

| Ícone | Conceito       | Uso        |
| ----- | -------------- | ---------- |
| 💰    | Wallet/Balance | Saldo PC   |
| 💳    | Payment        | Cards/Fiat |
| 🪙    | Panda Coins    | Crypto     |
| 📈    | Growth         | Charts     |
| 💵    | USD/Fiat       | Currency   |

#### G. Cores do Sistema (Accent Palette)

| Cor | Hex       | Nome             | Uso Principal         |
| --- | --------- | ---------------- | --------------------- |
| 🟣  | `#667eea` | Purple Primary   | Accent, Active states |
| 🟣  | `#764ba2` | Purple Secondary | Gradients             |
| 🟢  | `#10b981` | Emerald          | Success, Online       |
| 🔴  | `#ef4444` | Red              | Error, Offline        |
| 🟡  | `#f59e0b` | Amber            | Warning, Pending      |
| 🔵  | `#3b82f6` | Blue             | Info, Links           |

#### H. Assets de Logo

| Arquivo                  | Tamanho | Uso           |
| ------------------------ | ------- | ------------- |
| `assets/panda_logo.png`  | Full    | Canvas, About |
| `icons/icon-192x192.png` | 192px   | PWA           |
| `icons/icon-512x512.png` | 512px   | PWA HD        |
| `icons/favicon.ico`      | 64px    | Browser tab   |

> **📝 Para Kit de Logos:** Substituir emojis por SVGs customizados mantendo significado e cores associadas.

### 3.5. Jam Frontend (React + TLDraw) 🍇

> **Atualizado:** 2026-01-27 | **Referência:** [PF_JAM_COMPONENTS.md](PF_JAM_COMPONENTS.md)

O **Panda Jam** é o frontend moderno construído com React + Vite, oferecendo uma experiência de canvas infinito com TLDraw.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         PANDA JAM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  jam/                        COMPONENTES (22)                       │
│  ├── src/                                                           │
│  │   ├── components/         ┌─────────────────────────────────┐   │
│  │   │   ├── JamStatusBar    │ Header com status de agentes    │   │
│  │   │   ├── JamChat         │ AI Panel (5 modelos, 6 GEMs)    │   │
│  │   │   ├── JamDock         │ Dock lateral de apps            │   │
│  │   │   ├── JamCanvas       │ TLDraw canvas infinito          │   │
│  │   │   ├── LoginGate       │ Autenticação                    │   │
│  │   │   └── ...             └─────────────────────────────────┘   │
│  │   ├── hooks/              7 custom React hooks                   │
│  │   ├── services/           uiContext, outros                      │
│  │   └── styles/             jam.css (Design System)                │
│  ├── public/                                                        │
│  │   ├── panda-logo.png                                             │
│  │   └── panda-chat-logo.png                                        │
│  └── dist/                   Build de produção (Vite)               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### A. Componentes Principais

| Componente           | Responsabilidade                       | SDK Connection       |
| :------------------- | :------------------------------------- | :------------------- |
| **JamStatusBar**     | Header com status Firebase/GAS/Rust/AI | `Panda.Monitor`      |
| **JamChat**          | Chat AI com 5 modelos e 6 GEMs         | `Panda.Brain.Gemini` |
| **JamDock**          | Dock lateral de apps                   | `Panda.UI`           |
| **JamCanvas**        | TLDraw canvas infinito                 | `Panda.Data`         |
| **LoginGate**        | Autenticação (email/senha, Google)     | `Panda.Auth`         |
| **FounderDashboard** | Painel administrativo                  | `Panda.PAT`          |

#### B. JamChat: AI Models e GEMs

```javascript
// 5 Modelos de IA disponíveis
const AI_MODELS = [
  { id: "flash", name: "Flash", icon: "⚡", free: true },
  { id: "pro", name: "Pro", icon: "🧠", free: false },
  { id: "thinking", name: "Think", icon: "🤔", free: true },
  { id: "research", name: "Research", icon: "🔬", free: false },
  { id: "imagen", name: "Imagen", icon: "🎨", free: false },
];

// 6 GEMs Especialistas
const GEMS = [
  { id: "writer", name: "Writer", icon: "✍️" },
  { id: "analyst", name: "Analyst", icon: "📊" },
  { id: "coder", name: "Coder", icon: "💻" },
  { id: "designer", name: "Designer", icon: "🎨" },
  { id: "planner", name: "Planner", icon: "📋" },
  { id: "researcher", name: "Researcher", icon: "🔬" },
];
```

#### C. Fluxo de Autenticação

```text
                    ┌─────────────────┐
                    │   StartPage     │
                    │   (Landing)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   LoginGate     │
                    │ Email/Senha     │
                    │ or Google OAuth │
                    └────────┬────────┘
                             │ onLogin()
                    ┌────────▼────────┐
                    │   App.jsx       │
                    │ isLoggedIn=true │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ JamStatusBar │    │  JamCanvas   │    │   JamChat    │
│  (Header)    │    │  (TLDraw)    │    │  (AI Panel)  │
└──────────────┘    └──────────────┘    └──────────────┘
```

#### D. CSS Variables (jam.css)

```css
:root {
  --jam-bg: #1a1a2e;
  --jam-surface: #16213e;
  --jam-accent: #e94560;
  --jam-text: #eaeaea;
  --jam-text-muted: #8a8a9a;
  --jam-text-secondary: #c0c0d0; /* Para labels de gems */
  --jam-border: #2a2a4e;
  --jam-dock-bg: rgba(22, 33, 62, 0.95);
}

body.light-mode {
  --jam-bg: #f5f5f7;
  --jam-surface: #ffffff;
  --jam-text: #1a1a2e;
  --jam-text-secondary: #4a4a5a;
}
```

#### E. Deploy

- **Build:** `npm run build` (Vite)
- **Output:** `/dist/jam/` → copiado para `/dist/jam/` na raiz
- **Serve:** GitHub Pages em `https://lucassval.github.io/Panda-Factory/`

---

## 4. Camada SDK: O Coração

### A Regra de Ouro

> **"O Módulo NUNCA fala com o Servidor. O Módulo fala com o Panda, e o Panda fala com o Servidor."**

### 4.1. Estrutura Global `Panda`

```javascript
window.Panda = {
    Data:   { get, save, list, delete },  // Abstração de Banco (Sheets/SQL)
    Wallet: { getBalance, charge },       // Economia (Panda Coins)
    Brain:  { chat, analyze, tools },     // IA (Gemini/Local)
    Bridge: { execute, readFile },        // Rust Agent (Hardware)
    GPU:    { process, isAvailable },     // Aceleração Gráfica
    UI:     { notify, modal, toast },     // Interface
    on/emit: (event, data) => {}          // Event Bus
};
```

### 4.2. Arquitetura de Slots & Adapters

```text
🔌 SDK SLOTS
├── (Core Protegido)
│   ├── Panda.use()
│   ├── Panda.version
│   └── Sandbox
├── (Slot Data)
│   ├── Default: Sheets
│   └── Adapters: MongoDB, Supabase, IndexedDB
├── (Slot Brain)
│   ├── Default: Gemini
│   └── Adapters: Claude, GPT-4, Local Llama
├── (Slot GPU)
│   ├── Default: Cloud
│   └── Adapters: CUDA, WebGPU
└── (Slot Render/Audio/Network)
    └── Adapters variados
```

### 4.3. Arquitetura de Tentáculos (SDK Extensions)

> **Modelo:** SDK → Tentáculos → Pais → Filhos

    🐼 pf.sdk.js (ÚNICO)

#### Estrutura de Arquivos

```
js/tentacles/                         # 8 Integration Modules
├── brain/                            ← AI/ML
│   ├── pf.brain-parent.js
│   └── children/
│       ├── gemini.js                 ← Gemini API
│       ├── local-llm.js              ← Ollama/LM Studio
│       ├── gpu.js                    ← WebGPU detection
│       └── vision.js                 ← Image analysis
├── social/                           ← Social Media
│   ├── pf.social-parent.js
│   └── children/
│       ├── whatsapp.js               ← Evolution API/Baileys
│       ├── twitter.js
│       ├── youtube.js
│       ├── meta.js
│       └── telegram.js
├── trading/                          ← Financial Markets
│   ├── pf.trading-parent.js
│   └── children/ctrader.js           ← cTrader Open API
├── google/                           ← Google Services
│   ├── pf.google-parent.js
│   └── children/
│       ├── drive.js
│       ├── sheets.js
│       ├── colab.js
│       ├── calendar.js
│       ├── docs.js
│       ├── gmail.js
│       └── youtube.js
├── distribution/                     ← App Publishing
│   ├── pf.distribution-parent.js
│   └── children/
│       ├── pwa.js
│       ├── itch.js
│       ├── steam.js
│       ├── android.js
│       ├── ios.js
│       └── arcade.js
├── education/                        ← EdTech Platforms
│   ├── pf.education-parent.js
│   └── children/
│       ├── kiwify.js
│       ├── hotmart.js
│       └── eduzz.js
├── github/                           ← GitHub Integration
│   ├── pf.github-parent.js
│   └── children/
│       ├── pages.js                  ← GitHub Pages deploy
│       ├── jsondb.js                 ← JSON as database
│       └── actions.js                ← CI/CD workflows
└── monitor/                          ← System Health
    └── pf.tentacle-monitor.js        ← Real-time logging
```

#### TentacleMonitor API

| Método                                | Descrição                  |
| ------------------------------------- | -------------------------- |
| `TM.registerTentacle(name)`           | Registra tentáculo         |
| `TM.registerChild(tentacle, childId)` | Registra filho             |
| `TM.log(level, source, msg)`          | Log com nível              |
| `TM.getTree()`                        | Retorna árvore hierárquica |
| `TM.getLogs(filter)`                  | Logs filtrados             |

#### Benefícios

- **Isolamento:** Se um child falha, o resto continua
- **Hot-Swap:** Atualizar módulo sem reload
- **Observabilidade:** DevTools UI (F12) visualiza tudo

---

## 5. Backend: Os 3 Pilares

### 5.1. Pilar Rust Agent (Hardware)

Este é o "Corpo Físico" do sistema no PC do usuário. Obrigatório para operações locais.

### 5.1.A. Mapa de Capacidades

```text
🦀 RUST AGENT
├── (Papel)
│   ├── Cache Manager
│   ├── MCP Server (Tools para IA)
│   └── Hardware Bridge
├── (Capacidades)
│   ├── GPU (CUDA/ROCm)
│   ├── Files (Read/Write)
│   ├── DLLs (MetaTrader/Drivers)
│   ├── Automation (Mouse/Keyboard/OCR)
│   └── Network (Proxy/VPN)
└── (Comunicação)
    └── Firebase Signaling (Heartbeat)
```

### 5.1.B. Deep Dive: MCP (Model Context Protocol)

O Rust expõe "Tools" que a IA pode invocar:

```rust
// pf_mcp.rs - Tools disponíveis
pub enum McpTool {
    // Filesystem
    FsRead { path: String },
    FsWrite { path: String, content: String },
    FsList { directory: String },

    // GPU
    GpuCheck,
    GpuProcess { model: String, input: Vec<f32> },

    // Automation (Bot/Farm)
    MouseMove { x: i32, y: i32 },
    KeyboardType { text: String },
    ScreenCapture { region: Option<Rect> },

    // Network
    RotateIp,
    GetFingerprint,
}
```

### 5.1.C. RIG Framework (Agentes Complexos)

```rust
// pf_rig.rs - Suporte multi-provider
use rig::providers::{gemini, anthropic, openai};

pub struct AgentRunner {
    providers: HashMap<String, Box<dyn Provider>>,
}

impl AgentRunner {
    pub async fn chat(&self, config: AgentConfig) -> Result<String> {
        let provider = self.providers.get(&config.provider)?;
        let agent = provider.agent(&config.model)
            .tool(McpToolset::new())
            .build();

        let (response, usage) = agent.chat(&config.input).await?;
        meter::track_usage(usage).await; // Billing
        Ok(response)
    }
}
```

### 5.1.D. Token Meter & Economy (pf_meter.rs)

Contagem e billing de tokens por provider:

```rust
pub async fn track_usage(user: &str, provider: &str, model: &str,
                         tokens_in: u64, tokens_out: u64) {
    let (_, rate_in, rate_out) = RATES.iter()
        .find(|(m, _, _)| *m == model)
        .unwrap_or(&("default", 0.05, 0.20));

    let cost = (tokens_in as f64 / 1000.0) * rate_in
             + (tokens_out as f64 / 1000.0) * rate_out;

    // Envia para Firebase
    firebase::push(&format!("pf_cells/{}/usage", user), &TokenUsage {
        cost_pc: cost,
        timestamp: chrono::Utc::now().timestamp(),
        // ...
    }).await;
}
```

### 5.1.E. Suporte Multi-User (Sessões Isoladas)

```rust
// pf_multiuser.rs
pub struct MultiUserSession {
    sessions: HashMap<String, UserSession>,
}

// Cada request identifica o usuário
pub async fn handle_request(user_id: &str, command: McpTool) -> Result<Response> {
    let session = sessions.get_session(user_id).ok_or("Auth failed")?;

    // Executa no contexto do usuário
    let result = execute_in_context(session, command).await?;

    // Billing para o usuário correto
    meter::track(session, &result.usage).await;

    Ok(result)
}
```

### 5.1.F. GPU Detection Flow & Economy

```text
[SITE PANDA]
      │
      ▼
 ┌───────────────┐
 │ AGENT ONLINE? │
 └──────┬────────┘
        │ Não ───────────────┐
        │                    │
        │ Sim                ▼
        ▼              [CLOUD MODE]
 ┌───────────────┐     (30 PC/h)
 │ DETECTAR GPU  │
 └──────┬────────┘           ▲
        │                    │
        ├──── Nenhuma ───────┘
        │
        │ Sim (NVIDIA/AMD)
        ▼
  [LOCAL MODE]
  (0 PC/h - GRÁTIS)
```

### 4.7. Módulos Avançados do Rust Agent

O Rust não é apenas GPU. É a **ponte** para o mundo real do Sistema Operacional:

#### A. Módulo Financeiro & Trade (DLL Bridge)

Plataformas de mercado financeiro (MetaTrader 4/5, Profitchart) só aceitam integração via **DLL Windows**.

- O Rust carrega `mt5.dll` e expõe funções como `OrderSend()` via Firebase.
- O SaaS Web envia ordens para terminais Desktop legados.

#### B. Módulo RPA / Ghost User

Para sistemas sem API nem DLL (ERPs antigos):

- O Rust controla **Mouse e Teclado** (`enigo`, `winapi`).
- O SaaS diz "Cadastrar Cliente X". O Rust abre janela, digita e salva.

#### C. Módulo IoT & Hardware

Acesso total a periféricos que o navegador não consegue:

- Impressoras Térmicas (ESC-POS)
- Balanças de precisão (Porta COM)
- Leitores Biométricos

#### D. Local AI Intelligence (Offline Brain) 🧠

Para privacidade absoluta:

- O Rust roda **Llama 3 / Mistral** quantizado localmente.
- PDFs sigilosos são processados no PC. Apenas o resumo vai para a nuvem.

#### E. Filesystem Watcher (Modo Dropbox) 📂

O navegador não monitora pastas. O Rust pode:

- Detecta arquivo novo em `C:\Downloads\Notas`.
- Faz parse automático e envia para o SaaS: _"Nova NF detectada!"_.

#### F. OS HUD / Overlay (DirectX Hook) 🕹️

Para Traders e Gamers:

- O Rust desenha **Overlay Transparente** sobre outros apps.
- Mostra "Vendas Hoje: R$ 5.000" sem alt-tab.

#### G. Polyglot Module (Tradução Global) 🌍

O Rust Agent inclui tradução offline para 200 idiomas:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    POLYGLOT - ARQUITETURA                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MODELO: NLLB-200 (Meta AI)                                            │
│  ├── Tamanho: ~600MB (único arquivo)                                   │
│  ├── Idiomas: 200+ (PT, EN, ES, FR, DE, 中文, 日本語, العربية...)       │
│  ├── Qualidade: ★★★★ (Pesquisa Meta)                                   │
│  └── Runtime: ONNX via `ort` crate                                     │
│                                                                         │
│  LEGENDAS: Whisper Base (OpenAI)                                       │
│  ├── Tamanho: ~140MB                                                   │
│  ├── Função: Speech-to-Text (STT)                                      │
│  └── Fluxo: Áudio → Whisper → Texto → NLLB → Legenda traduzida         │
│                                                                         │
│  HOSPEDAGEM: Hugging Face Hub (CDN Global, 100% Grátis)                │
│  └── URL: huggingface.co/facebook/nllb-200-distilled-600M              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**SDK Integration:**

```javascript
// Panda.Polyglot - Módulo de tradução global
Panda.Polyglot = {
  translate(text, from, to),      // Promise<string>
  translateStream(stream, to),    // AsyncIterator<string>
  detectLanguage(text),           // Promise<{lang, confidence}>
  getSupportedLanguages(),        // string[] (200+)
  localizeUI(langCode)            // void (aplica traduções na UI)
};
```

**Por que Local (Rust) e não Cloud?**

| Aspecto         | Cloud API          | Rust Local         |
| --------------- | ------------------ | ------------------ |
| **Privacidade** | ❌ Dados saem      | ✅ Zero vazamento  |
| **Custo**       | 💰 Por caractere   | ✅ Grátis infinito |
| **Latência**    | 🐢 100-500ms       | ⚡ ~50ms           |
| **Offline**     | ❌ Requer internet | ✅ 100% offline    |

#### H. Download Progressivo (Instalação Inteligente) 📦

O Rust Agent usa download progressivo para minimizar atrito inicial:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE INSTALAÇÃO PROGRESSIVA                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. USUÁRIO ACESSA PANDA FACTORY (Shell/Web)                           │
│     └── Funciona sem Rust (modo limitado)                              │
│                                                                         │
│  2. PROMPT: "Instale o Panda Agent para recursos completos"            │
│     └── Download: panda-agent-base.exe (~30MB)                         │
│                                                                         │
│  3. RUST INICIA E BAIXA DEPENDÊNCIAS (Primeira Execução)               │
│     ├── runtime/                                                       │
│     │   └── onnxruntime.dll ........... 50MB                           │
│     ├── tools/                                                         │
│     │   ├── rg.exe (ripgrep) .......... 6MB                            │
│     │   ├── fd.exe (find) ............. 3MB                            │
│     │   ├── bat.exe (cat) ............. 5MB                            │
│     │   ├── delta.exe (diff) .......... 8MB                            │
│     │   └── fzf.exe (fuzzy) ........... 3MB                            │
│     └── models/                                                        │
│         ├── nllb-200.onnx ............. 600MB (tradução)               │
│         └── whisper-base.onnx ......... 140MB (legendas)               │
│                                                                         │
│  4. PRONTO! Sistema completo funcionando offline                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tamanhos por Fase:**

| Fase                   | Tamanho | Conteúdo                  |
| ---------------------- | ------- | ------------------------- |
| **Instalação inicial** | ~30MB   | Rust Agent base           |
| **Primeira execução**  | ~820MB  | Runtime + Tools + Modelos |
| **Total final**        | ~850MB  | Sistema completo offline  |

**Hospedagem de Modelos:**

| Plataforma       | Limite      | Custo     | Uso                  |
| ---------------- | ----------- | --------- | -------------------- |
| Hugging Face Hub | ∞ Ilimitado | ✅ Grátis | Modelos NLLB/Whisper |
| GitHub Releases  | 2GB/arquivo | ✅ Grátis | Binários, DLLs       |

---

### 5.2. Pilar Firebase Colmeia (Signaling)

O Firebase atua APENAS como canal de sinalização e sincronia em tempo real. Não armazena dados persistentes de negócio.

### 5.1. Arquitetura de Dados (Schema)

A árvore de dados é efêmera e segregada por `user_uid`:

```json
{
  "pf_cells": {
    "user_uuid_123": {
      "command_queue": {
        "cmd_id_x": {
          "action": "EXECUTE_DLL",
          "payload": { "symbol": "BTCUSD", "volume": 1.0 },
          "timestamp": 1700000000
        }
      },
      "response_stream": {
        "cmd_id_x": {
          "status": "SUCCESS",
          "data": { "ticket": 998877 },
          "completed_at": 1700000005
        }
      },
      "agent_status": {
        "online": true,
        "last_ping": 1700000010,
        "gpu_model": "RTX 4090",
        "version": "2.0.0"
      }
    }
  }
}
```

### 5.2.A. Regras de Segurança (Firestore Rules)

Garante que usuários não leiam dados uns dos outros:

```javascript
{
  "rules": {
    "pf_cells": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

### 5.2.B. Fluxo de Execução (Browser ↔ Rust)

```text
[🖥️ BROWSER]                [🔥 FIREBASE]              [🦀 RUST AGENT]
      │                           │                           │
      │ 1. PUSH COMANDO ──────────▶│                           │
      │                           │ 2. SSE EVENT ─────────────▶│
      │                           │                           │ 3. EXECUTA LOCAL
      │                           │◀───────── 4. ESCREVE ──────│
      │◀────── 5. ATUALIZA ───────│                           │
```

---

### 5.3. Pilar GAS Backend (Serverless)

O Google Apps Script (GAS) é o "Cérebro Lógico" e Banco de Dados (Sheets).

### 5.3.A. Estrutura DDD (Domain Driven Design)

Organizamos o backend em "Domínios" (Chapéus) para escalar:

```text
📜 GAS BACKEND
├── core/                   # Kernel do Sistema
│   ├── PF_Dispatcher.gs    # O "Porteiro" (Entry Point)
│   ├── PF_Config.gs        # Configurações Globais
│   ├── PF_Services.gs      # AI, Webhooks
│
├── domains/                # Os "Chapéus"
│   ├── finance/
│   │   ├── PF_Wallet.gs    # Ledger (Voltímetro)
│   │   ├── PF_Fiat.gs      # Gateways (Stripe)
│   │   └── PF_Crypto.gs    # Blockchain
│   ├── store/
│   │   ├── PF_Registry.gs  # Catálogo
│   │   └── PF_Sales.gs     # Split
│   └── automation/
│       └── PF_Bots.gs      # Farms
└── integrations/
    ├── Gmail, Calendar, Drive
    └── Webhooks (Hotmart/Kiwify)
```

### 5.3.B. O Dispatcher Único (PF_Dispatcher.gs)

Todo request passa por aqui:

```javascript
function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const user = PF_Auth.validate(req.token); // Autenticação Central

    // Roteamento DDD
    switch (req.domain) {
      case "FINANCE":
        return PF_Finance.handle(req.action, req.payload, user);
      case "STORE":
        return PF_Store.handle(req.action, req.payload, user);
      // ...
    }
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: err.message }),
    );
  }
}
```

### 5.3.C. Backend Multi-User (PF_Core_MultiUser.gs)

```javascript
// Obtém tenant do usuário atual
function getCurrentTenant() {
  const user = Session.getActiveUser().getEmail();
  const row = getTenantSheet().createTextFinder(user).findNext();

  if (!row) throw new Error("User not in any tenant");

  return {
    tenantId: row.getValues()[0][0],
    role: row.getValues()[0][2],
    quotas: JSON.parse(row.getValues()[0][3]),
  };
}

// Escrita isolada
function saveData(collection, data) {
  const tenant = getCurrentTenant();
  data.__tenant_id__ = tenant.tenantId; // Stamp forçado

  const sheet = SpreadsheetApp.openById(tenant.tenantId).getSheetByName(
    collection,
  );
  sheet.appendRow(Object.values(data));
}
```

---

## 6. Infraestrutura Híbrida

> **Filosofia:** "Hardware é commodity. A inteligência está na Orquestração."

A Panda Fabrics opera uma arquitetura **DePIN (Decentralized Physical Infrastructure Network)** que estende a robustez da Google Cloud até a borda (Edge). Essa abordagem híbrida nos posiciona estrategicamente como parceiros de eficiência, oferecendo **SLA Enterprise com Custo de Hobby**.

### 6.1. Panda Cloud VM: A "Frota Fantasma" (Ghost Fleet)

Utilizamos arbitragem de preços de computação para criar máquinas virtuais efêmeras, resilientes e alinhadas ao ecossistema Google.

- **Google Cloud Spot Instances:** Consumimos capacidade ociosa de Data Centers do Google com 70-90% de desconto. Isso gera volume de uso para nossa parceria (Google Partner) enquanto reduz o TCO para o cliente.
- **The Safety Net Protocol (Resiliência):**
  1. O **Panda Orchestrator** sobe uma instância Spot barata (ex: Google e2-standard-4).
  2. O **Rust Agent** roda nela e inicia o processamento.
  3. Se o Google envia o sinal de desligamento (SIGTERM - 30s de aviso):
     - O Agente "congela" o estado da memória (Snapshot em tempo real).
     - O estado é transferido instantaneamente para outra Spot ou para o **PC Local** do usuário.
     - O processamento continua sem perda de dados (Zero-Downtime aparente).

### 6.2. BYOD: Panda Swarm (Google-Managed Edge)

Estendemos o alcance da nuvem Google para a borda. O Panda Factory atua como o **Control Plane** (hospedado no GCP) que orquestra recursos descentralizados para cargas de trabalho específicas que não exigem SLA de Data Center.

#### A. Edge Computing Complementar

Capturamos cargas de trabalho que tradicionalmente não iriam para a nuvem (devido a custo ou latência) e as integramos ao ecossistema.

- **Data Gravity:** Embora o processamento ocorra na borda, os dados gerados (logs, resultados, datasets) são sincronizados de volta para o **Google Cloud Storage** e **BigQuery**, gerando valor de dados para o cliente.

#### B. Casos de Uso Específicos (Non-Cloud Native)

Focamos a Swarm em tarefas onde a nuvem pública não é a melhor ferramenta:

- **Residencial IP Mesh:** Para coleta de dados pública onde IPs de Data Center são bloqueados.
- **Hyper-Local Latency:** Processamento em tempo real próximo ao usuário final.

#### C. Caminho para a Nuvem (Upsell Nativo)

A Swarm serve como ambiente de desenvolvimento e teste de baixo custo. Quando a aplicação exige escala e confiabilidade, o Panda Factory oferece **migração "One-Click" para Google Cloud Spot (Tier 3)**, atuando como um funil de aquisição de novos workloads para o GCP.

### 6.3. BYOL: Bring Your Own License (O Escudo Jurídico)

Resolvemos o complexo problema de licenciamento de software proprietário em nuvem através da técnica de **Injeção em Tempo de Execução**.

- **Arquitetura "Hollow Shell" (Casca Oca):**
  - A Panda fornece apenas a infraestrutura (CPU, RAM, OS Base, Drivers).
  - A Panda **NÃO** hospeda, vende ou distribui binários de terceiros (ex: MetaTrader, Photoshop).
- **Processo de Injeção:**
  1. O usuário conecta seu cofre pessoal (Storage Privado).
  2. No boot da VM (Cloud ou Local), o script do Panda injeta o executável e a licença do usuário na memória volátil.
  3. O software roda legitimamente sob a licença do usuário final.
- **Compliance:** Atuamos estritamente como provedor de "Metal", isentando a plataforma de passivos de propriedade intelectual.

### 6.4. Resumo Visual da Orquestração

```text
       [ GOOGLE CLOUD PLATFORM (Control Plane) ]
       (Orquestrador + Auth + Database + AI)
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
    [ TIER 2: EDGE ]      [ TIER 3: CORE ]
      Panda Swarm           Google Spot VM
    (Custo & Alcance)      (SLA & Potência)
           │                     │
           └──────────┬──────────┘
                      ▼
             [ DATA INGESTION ]
          (BigQuery / Cloud Storage)
```

> **Tier 1 (Local):** Hardware do usuário, latência zero, grátis.
> **Tier 2 (Edge):** Swarm residencial, IPs valiosos, pago em Coins.
> **Tier 3 (Core):** Google Spot VMs, SLA enterprise, pago em Fiat/Coins.

### 6.5. Deployment Tiers para Desenvolvedores (Modularidade)

O Panda Factory é **100% modular**. Desenvolvedores podem escolher o nível de integração que melhor se adapta ao seu produto, desde apps simples até sistemas completos com automação local.

#### A. Visão Geral dos Tiers

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    TIERS DE DEPLOYMENT PANDA                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  TIER SHELL (GAS + Chrome Only)                                        │
│  ├── ✅ Panda SDK (Data, Wallet, Brain Cloud, UI)                      │
│  ├── ✅ Backend GAS (Sheets, Drive, Gmail)                             │
│  ├── ✅ Componentes UI (Docks, Modais, Tema)                           │
│  ├── ❌ GPU Local (só Cloud - 30 PC/hora)                              │
│  ├── ❌ MCP Tools (sem automação local)                                │
│  ├── ❌ File System / DLLs / Local AI                                  │
│  └── 🎨 Dev pode esconder Panda Store do usuário                       │
│                                                                         │
│  TIER HYBRID (GAS + Chrome + Rust Lite)                                │
│  ├── ✅ Tudo do Tier Shell                                             │
│  ├── ✅ GPU Detection (auto-switch Cloud/Local)                        │
│  ├── ✅ MCP Tools Básicos (Read-only)                                  │
│  ├── ✅ File Watcher (monitorar pastas)                                │
│  ├── ❌ Automação Desktop (RPA, Mouse/Keyboard)                        │
│  ├── ❌ DLL Bridge (MetaTrader, ERPs)                                  │
│  └── 🏪 Panda Store visível (módulos pagos)                            │
│                                                                         │
│  TIER FULL (Tudo Habilitado)                                           │
│  ├── ✅ Tudo do Tier Hybrid                                            │
│  ├── ✅ GPU Local Completa (CUDA/ROCm)                                 │
│  ├── ✅ MCP Tools Completos (Read/Write)                               │
│  ├── ✅ Automação Desktop (RPA, OCR)                                   │
│  ├── ✅ DLL Bridge (Trade, IoT, Drivers)                               │
│  ├── ✅ Local AI (Llama 3, Whisper, Stable Diffusion)                  │
│  └── 🏪 Panda Store + MCP Store + Extensions                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### B. Tabela de Capabilities por Tier

| Capability                      | Shell  |  Hybrid  | Full |
| ------------------------------- | :----: | :------: | :--: |
| **SDK Core** (Data, Wallet, UI) |   ✅   |    ✅    |  ✅  |
| **Brain Cloud** (Gemini, GPT)   |   ✅   |    ✅    |  ✅  |
| **Backend GAS** (Sheets, Drive) |   ✅   |    ✅    |  ✅  |
| **Firebase Signaling**          |   ✅   |    ✅    |  ✅  |
| **Componentes UI**              |   ✅   |    ✅    |  ✅  |
| **Dark Mode / Temas**           |   ✅   |    ✅    |  ✅  |
| **GPU Detection**               |   ❌   |    ✅    |  ✅  |
| **GPU Local** (CUDA/ROCm)       |   ❌   | ⚡ Lite  |  ✅  |
| **MCP Tools Read**              |   ❌   |    ✅    |  ✅  |
| **MCP Tools Write**             |   ❌   |    ❌    |  ✅  |
| **File System Access**          |   ❌   | 📂 Watch |  ✅  |
| **Local AI** (Llama, Whisper)   |   ❌   |    ❌    |  ✅  |
| **Automação Desktop** (RPA)     |   ❌   |    ❌    |  ✅  |
| **DLL Bridge** (MetaTrader)     |   ❌   |    ❌    |  ✅  |
| **Overlay HUD**                 |   ❌   |    ❌    |  ✅  |
| **Panda Store**                 | 🎨 Opt |    ✅    |  ✅  |
| **MCP Store**                   |   ❌   |    ❌    |  ✅  |
| **White Label**                 |   ✅   |    ✅    |  ✅  |

> **Legenda:** ✅ Disponível | ❌ Indisponível | ⚡ Parcial | 📂 Limitado | 🎨 Configurável

#### C. Casos de Uso por Tier

| Tier       | Usuário Típico   | Exemplos de Aplicação                                    |
| ---------- | ---------------- | -------------------------------------------------------- |
| **Shell**  | Dev SaaS simples | CRM Web, Dashboard Analytics, Landing Pages, Portfólios  |
| **Hybrid** | Dev com IA Cloud | Chatbots, Geradores de Conteúdo, Análise de Documentos   |
| **Full**   | Power User       | Trading Bots, Automação ERP, Farm de Contas, IoT Control |

#### D. Configuração do Desenvolvedor (panda.config.js)

```javascript
// panda.config.js - Raiz do projeto do desenvolvedor
export default {
  // === DEPLOYMENT ===
  deployment: {
    tier: "shell", // 'shell' | 'hybrid' | 'full'
    rustRequired: false, // Força download do Rust Agent?
    rustDownloadUrl: null, // URL customizada (ou null = oficial)
  },

  // === BRANDING (White Label) ===
  branding: {
    showPandaStore: false, // Esconde a loja do usuário final
    showPandaBranding: true, // "Powered by Panda" (OBRIGATÓRIO)
    customLogo: null, // URL do logo do dev (header)
    customColors: null, // Override de CSS vars
  },

  // === FEATURES ===
  features: {
    brain: "cloud", // 'cloud' | 'local' | 'hybrid'
    gpu: "cloud", // 'cloud' | 'local' | 'auto'
    storage: "sheets", // 'sheets' | 'firebase' | 'custom'
    devMode: false, // Expõe DevTools para o usuário?
  },

  // === ECONOMIA ===
  economy: {
    enableWallet: true, // Mostra Panda Coins?
    enableStore: false, // Permite compras in-app?
    devSplit: 55, // % do dev nas vendas (padrão: 55)
  },
};
```

#### E. Limitações Documentadas (Shell Mode)

> **⚠️ IMPORTANTE PARA DEVS SHELL:**

| Limitação           | Motivo               | Alternativa                       |
| ------------------- | -------------------- | --------------------------------- |
| **Sem GPU Local**   | Requer Rust Agent    | Use `brain: 'cloud'` (30 PC/hora) |
| **Sem File System** | Browser sandbox      | Use Google Drive API via SDK      |
| **Sem Local AI**    | Requer GPU + modelos | Use Gemini/GPT via `Panda.Brain`  |
| **Sem Automação**   | Requer OS hooks      | Exponha webhooks para n8n/Zapier  |
| **Sem DLLs**        | Sem acesso nativo    | Use APIs REST dos sistemas        |

#### F. Fluxo de Decisão para Devs

```text
                    ┌─────────────────────┐
                    │ PRECISA DE ACESSO   │
                    │ AO PC DO USUÁRIO?   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │ NÃO            │                │ SIM
              ▼                │                ▼
       ┌────────────┐          │         ┌────────────┐
       │   SHELL    │          │         │ USA GPU    │
       │  (GAS+Web) │          │         │  LOCAL?    │
       └────────────┘          │         └─────┬──────┘
                               │               │
                               │    ┌──────────┴──────────┐
                               │    │ NÃO                 │ SIM
                               │    ▼                     ▼
                               │ ┌────────────┐    ┌────────────┐
                               │ │   HYBRID   │    │    FULL    │
                               │ │ (Rust Lite)│    │  (Tudo)    │
                               │ └────────────┘    └────────────┘
```

#### G. Regras de Branding (Todos os Tiers)

Independente do tier, o branding "Powered by Panda" é **OBRIGATÓRIO**:

| Elemento           | Requirement                     | Tier          |
| ------------------ | ------------------------------- | ------------- |
| **Loading Screen** | Logo Panda + "Powered by Panda" | Todos         |
| **Footer/Corner**  | Ícone 🐼 clicável               | Todos         |
| **About Modal**    | Versão SDK + link panda.dev     | Todos         |
| **Custom Logo**    | Permitido no Header             | Todos         |
| **Hide Store**     | Permitido para Shell/Hybrid     | Shell, Hybrid |

#### H. Panda Meter (Obrigatório em Todos os Tiers)

O **Panda Meter** (Gasômetro/Pandômetro) é **SEMPRE OBRIGATÓRIO** em todos os tiers. Ele monitora o consumo de recursos e aplica a cobrança apropriada.

##### Custo por Tier

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    PANDA METER - CUSTO POR TIER                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  TIER SHELL (GAS + Chrome)                                             │
│  └── 💚 CUSTO ZERO (ou quase zero)                                     │
│      ├── Backend GAS é GRATUITO (Google Apps Script)                   │
│      ├── Storage Drive é GRATUITO (limite quota)                       │
│      └── Client-side processing (GPU do usuário)                       │
│                                                                         │
│  TIER HYBRID (GAS + Rust Lite)                                         │
│  └── 💛 CUSTO BAIXO (pay-as-you-go)                                    │
│      ├── GAS ainda gratuito                                            │
│      ├── Brain Cloud (Gemini/GPT) = Panda Coins                        │
│      └── GPU Detection = grátis, GPU Cloud = Panda Coins               │
│                                                                         │
│  TIER FULL (Tudo)                                                      │
│  └── 🧡 CUSTO VARIÁVEL                                                 │
│      ├── Local AI = 0 PC (grátis, GPU do usuário)                      │
│      ├── Cloud AI = 30 PC/hora (Gemini Pro)                            │
│      ├── Cloud VM = 50 PC/hora (processamento pesado)                  │
│      └── Automação = logs apenas (sem custo adicional)                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

##### Modelo de Negócio do Desenvolvedor

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUXO: DEV → USUÁRIO FINAL                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. DEV COMPRA TOKENS (Wholesale) → com desconto de volume             │
│  2. DEV OFERECE BÔNUS DE BOAS-VINDAS → X moedas grátis p/ novos users  │
│  3. USUÁRIO ENTRA EM MODO SPLIT → paga por uso após bônus              │
│  4. CICLO VIRTUOSO → Dev ganha % → reinveste → mais usuários           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

> **📌 Para detalhes completos sobre preços, splits e descontos, veja [§9 - Tokenomics &amp; Monetização](#9-ecossistema-tokenomics--monetização).**

##### Configuração do Dev (panda.config.js)

```javascript
economy: {
  enableWallet: true,       // Mostra saldo de PC ao usuário
  enableStore: false,       // Permite compra direta na Panda Store?
  welcomeBonus: 1000,       // PC grátis para novos usuários (custo do Dev)
  devSplit: 55,             // % do dev nas vendas (padrão: 55)
  hideTokenPrice: true,     // Esconde preço em $ (só mostra PC)
}
```

---

## 7. Segurança & Zero-Knowledge

### 7.1. Princípio Fundamental

> **"A Panda Fabrics não vê seus dados. O processamento é Local ou na Nuvem privada do Tenant."**

### 7.2. Camadas de Segurança (Layers)

```text
LAYER 1: FRONTEND (Input Validation)
      ▼
LAYER 2: TRANSPORTE (HTTPS + Firebase Auth)
      ▼
LAYER 3: BACKEND GAS (Cell Isolation + DDD)
      ▼
LAYER 4: RUST AGENT (Assinatura Digital + Sandbox)
      ▼
LAYER 5: ADMIN (Audit + Kill Switch)
```

### 7.3. Estratégia Open Core (Anti-Fork)

O `pf-agent` é Open Source, mas a compilação oficial (`official_build`) inclui chaves proprietárias para acessar a Store e a Nuvem Panda. Forks não conseguem se conectar ao ecossistema oficial.

### 7.4. Modelo de Permissões "Android-Style" 🛡️

O Rust **NUNCA** executa ações perigosas silenciosamente:

- **Request:** O site pede: "Ler pasta C:\Notas".
- **Pop-up Desktop:** "O App Panda CRM deseja ler sua pasta de Notas. [Permitir] [Bloquear]".
- **Persistência:** O usuário aceita explicitamente. Isso isenta a Panda de responsabilidade.

### 7.5. Assinatura Digital de Plugins (Code Signing) ✍️

Para evitar uso malicioso:

- O Rust só carrega DLLs/Plugins com **Assinatura Criptográfica da Panda Fabrics**.
- Drivers não assinados são bloqueados: _"Assinatura Inválida"_.
- **Review:** Equipe audita código antes de assinar e publicar na Store.

### 7.6. Termos de Uso (Isenção)

> "O Panda Agent é uma ferramenta de automação passiva. A Panda Fabrics **não se responsabiliza** por perda de dados, ordens financeiras erradas ou mau uso. O usuário detém controle total e responsabilidade final sobre as permissões concedidas."

### 7.7. Botão de Pânico (Kill Switch) 🚨

Se detectarmos vulnerabilidade global:

- Firebase envia sinal `EMERGENCY_STOP`.
- **Todos** os Agents entram em "Modo Seguro" (leitura apenas) instantaneamente.

### 7.8. Ed25519 Founder Authentication (O Anel do Rei) 👑

> **STATUS: PRONTO (Não Ativo)** - Arquitetura documentada, implementação mock no SDK.

O sistema distingue o **Founder (Deus)** dos **Mortais (Usuários)** usando **Criptografia Assimétrica Ed25519**.

#### A. Conceito: Assinatura Digital como "Crachá Infalsificável"

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     FLUXO DE AUTENTICAÇÃO FOUNDER                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [RUST AGENT]              [FIREBASE]              [GAS BACKEND]        │
│  (PC do Lucas)             (Signaling)             (Verificação)        │
│       │                        │                        │               │
│       │ 1. ASSINA COMANDO ─────┤                        │               │
│       │    (Private Key)        │                        │               │
│       │                        │ 2. TRANSMITE ──────────┤               │
│       │                        │    (payload+sig)       │               │
│       │                        │                        │ 3. VERIFICA   │
│       │                        │                        │    (Public    │
│       │                        │                        │    Key)       │
│       │                        │                        │       │       │
│       │                        │◀────── 4. OK ──────────│       │       │
│       │                        │                        │               │
└─────────────────────────────────────────────────────────────────────────┘

🔐 Private Key: Nunca sai do PC do Lucas (OS Keychain)
🔓 Public Key: Hardcoded no Backend (imutável)
```

#### B. Tecnologia: Por que Ed25519?

| Característica    | Ed25519                       | RSA            |
| ----------------- | ----------------------------- | -------------- |
| **Segurança**     | 128-bit equivalent            | 112-bit (2048) |
| **Velocidade**    | ~10x mais rápido              | Lento          |
| **Tamanho Chave** | 32 bytes (público)            | 256 bytes      |
| **Usado por**     | SSH, Signal, Solana, SSH Keys | Legacy         |

**Bibliotecas:**

- **JavaScript:** `tweetnacl` (TweetNaCl.js)
- **Rust:** `ed25519-dalek`
- **GAS:** Via Rust Agent (GAS não tem crypto nativo)

#### C. Implementação: Geração de Chaves (One-Time)

```javascript
// Script local (Node.js) - Executar UMA VEZ no PC do Founder
const nacl = require("tweetnacl");
const fs = require("fs");

const keyPair = nacl.sign.keyPair();

// 1. SECREDO ABSOLUTO - Salvar em local seguro (OS Keychain)
const privateKey = Buffer.from(keyPair.secretKey).toString("hex");
fs.writeFileSync("./.panda/lucas_god_key.secret", privateKey);

// 2. PÚBLICO - Hardcode no Backend
const publicKey = Buffer.from(keyPair.publicKey).toString("hex");
console.log("FOUNDER_PUBLIC_KEY:", publicKey);
// Ex: "a1b2c3d4e5f6..."
```

#### D. SDK Integration (Mock - Pronto para Produção)

```javascript
// js/pf.sdk.js - Módulo Panda.Auth (v0.7+)
Panda.Auth.signCommand = async (payload) => {
  // 1. Serializa o payload
  const message = JSON.stringify(payload);

  // 2. Requisita assinatura ao Rust Agent via Bridge
  const result = await Panda.Bridge.execute("sign_payload", { message });

  // 3. Retorna payload + signature + timestamp
  return {
    payload,
    signature: result.signature, // hex string
    timestamp: Date.now(),
    signer: "FOUNDER",
  };
};

// Verificação (Client-side - informativo)
Panda.Crypto = {
  FOUNDER_PUBLIC_KEY: "a1b2c3d4...", // Hardcoded
  verify: (message, signature) => {
    // TweetNaCl verification
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      hexToUint8(signature),
      hexToUint8(Panda.Crypto.FOUNDER_PUBLIC_KEY),
    );
  },
};
```

#### E. Rust Agent: Assinatura Segura

```rust
// pf_crypto.rs - Signing com chave do OS Keychain
use ed25519_dalek::{Signer, SigningKey};
use keyring::Entry;

pub fn sign_payload(payload: &str) -> Result<String, CryptoError> {
    // 1. Carrega chave privada do OS Keychain (não arquivo)
    let entry = Entry::new("panda_fabrics", "founder_key")?;
    let secret_hex = entry.get_password()?;
    let secret_bytes = hex::decode(secret_hex)?;

    // 2. Reconstrói a SigningKey
    let signing_key = SigningKey::from_bytes(&secret_bytes)?;

    // 3. Assina o payload
    let signature = signing_key.sign(payload.as_bytes());

    // 4. Retorna hex da assinatura
    Ok(hex::encode(signature.to_bytes()))
}
```

#### F. Backend Verification (GAS)

```javascript
// PF_Auth.gs - Verificação no Servidor
const FOUNDER_PUBLIC_KEY_HEX = "a1b2c3d4e5f6..."; // HARDCODED

function verifyFounderAction(payload, signatureHex) {
  // Delega verificação ao Rust Agent (GAS não tem nacl)
  const result = callRustAgent("verify_signature", {
    message: JSON.stringify(payload),
    signature: signatureHex,
    publicKey: FOUNDER_PUBLIC_KEY_HEX,
  });

  if (!result.valid) {
    throw new Error("🚨 ALERTA: Assinatura Founder INVÁLIDA! Ação bloqueada.");
  }
  return true;
}

function isFounderAction(request) {
  return (
    request.signature && verifyFounderAction(request.payload, request.signature)
  );
}
```

#### G. Defesa em Profundidade (4 Barreiras)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     CAMADAS DE PROTEÇÃO CONTRA REBELIÃO                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BARREIRA 1: READ-ONLY CORE                                             │
│  ├── Binário do Rust Agent é ASSINADO                                   │
│  └── IA não pode reescrever o próprio código                            │
│                                                                         │
│  BARREIRA 2: WASM SANDBOX                                               │
│  ├── Plugins rodam em WebAssembly isolado                               │
│  └── Sem acesso a fs/network exceto injetado                            │
│                                                                         │
│  BARREIRA 3: OS KEYCHAIN (Secure Enclave)                               │
│  ├── Chave privada NUNCA em arquivo de texto                            │
│  ├── Windows: Credential Manager                                        │
│  └── macOS: Keychain Access                                             │
│                                                                         │
│  BARREIRA 4: HUMAN-IN-THE-LOOP                                          │
│  ├── Ações críticas exigem POP-UP de confirmação                        │
│  └── Transferências, Deletes, Admin = Founder aprova                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### H. Compatibilidade Blockchain (Futuro)

O Ed25519 é **nativamente compatível** com:

| Blockchain   | Curva     | Compatibilidade         |
| ------------ | --------- | ----------------------- |
| **Solana**   | Ed25519   | ✅ Mesma curva (direto) |
| **Ethereum** | secp256k1 | ⚠️ Conversão necessária |
| **Polkadot** | Ed25519   | ✅ Nativo               |

> **Roadmap:** Quando migrar para on-chain, a chave Ed25519 do Founder pode virar uma Wallet Solana real.

### 7.9. Fault Isolation Pattern (Constituição) 🛡️

> **REGRA CONSTITUCIONAL:** Nenhum hook/tentacle pode `throw error` - falhas devem retornar graciosamente.

```javascript
// ❌ PROIBIDO - Erro propaga e trava outros hooks
throw new Error("Hook failed");

// ✅ CORRETO - Erro isolado, outros hooks continuam
return {
  success: false,
  error: error.message,
  hook: name,
  method: method,
  isolated: true,
};
```

**Requisitos Obrigatórios:**

| Requisito     | Implementação                                |
| ------------- | -------------------------------------------- |
| **Timeout**   | 30 segundos por chamada (Promise.race)       |
| **Catch-All** | try/catch em todo `_wrapChild()`             |
| **Report**    | Erros via `TM.reportError()`                 |
| **Graceful**  | Retorna `{ success: false }` em vez de throw |
| **Status**    | Marca hook como "error" no TentacleMonitor   |

**Implementação (Todos os Parents):**

```javascript
// _wrapChild em TODOS os Parents (education, social, trading, google, brain, distribution)
_wrapChild(name, childApi) {
  wrapped[method] = async (...args) => {
    try {
      const result = await Promise.race([
        childApi[method](...args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout: ${name}.${method}`)), 30000)
        ),
      ]);
      return result;
    } catch (error) {
      console.error(`🔴 [${name}] Hook error in ${method}:`, error.message);
      TM?.setStatus?.(`${TENTACLE_ID}:${name}`, "error");
      return { success: false, error: error.message, hook: name, isolated: true };
    }
  };
}
```

### 7.10. Error Registry Protocol (Constituição) 📝

> **REGRA CONSTITUCIONAL:** Todos os erros de hooks devem ser registrados para visibilidade de agentes.

**TentacleMonitor Error API:**

| Método                                           | Uso                                |
| ------------------------------------------------ | ---------------------------------- |
| `TM.reportError(source, method, error, context)` | Registrar erro de hook             |
| `TM.getErrors(filter)`                           | Consultar erros por categoria/hook |
| `TM.getErrorSummary()`                           | Agregado para dashboard            |
| `TM.resolveError(id)`                            | Marcar como resolvido              |
| `Panda.emit('monitor:error')`                    | Evento real-time                   |

**Estrutura do Erro:**

```javascript
{
  id: "err_1234567890_abc",
  timestamp: Date.now(),
  source: "education:kiwify",    // category:hook
  category: "education",
  hook: "kiwify",
  method: "validateWebhook",
  error: "Timeout: kiwify.validateWebhook",
  stack: "...",
  context: {},                   // dados adicionais
  resolved: false,
  resolvedAt: null
}
```

**Fluxo de Erro:**

```text
[Hook Falha]
     │
     ├──> 1. Catch-All captura
     │
     ├──> 2. TM.reportError() registra
     │
     ├──> 3. Panda.emit('monitor:error') notifica
     │
     └──> 4. Retorna { success: false, isolated: true }
```

---

## 8. Tokenomics & Monetização

> **Filosofia:** "O Token é Energia. Quem produz, ganha. Quem consome, paga. O Fundador recebe eternamente."

### 9.1. Estrutura de Valor do Panda Coin (PC)

O PC é **Energy Credit** lastrado em custo computacional real, não especulativo.

#### A. Fórmula Base (Piso Inviolável)

```text
Preço_Base = Custo_Cloud_Médio × 2.5
Exemplo: $0.10/hora × 2.5 = $0.25/hora ≈ 1000 PC
```

#### B. Split de Receita (Transações)

| Destino               | Store/Compute | P2P Off-chain (Pre) | P2P On-Chain |
| --------------------- | ------------- | ------------------- | ------------ |
| **Dev/Host**          | 55%           | 95%                 | 95%          |
| **Fundo Incentivo**   | 22%           | 1%                  | 1%           |
| **Panda Operacional** | 15%           | 4%                  | 1%           |
| **Founder (Lucas)**   | 5%            | 0%                  | 0%           |
| **Gateway/GAS**       | 3%            | 0%                  | 3%           |

> **Nota - Lógica de Distribuição P2P (Hardcoded):**
> A taxa total flutua entre **5% (Base)** e **10% (Teto)**. O Host tem blindagem mínima de 90%.
>
> **1. A Base Imutável (3% + 1% + 1% = 5%):**
>
> - **3% Slot Fixo:** Reservado para Gas/Gateway. **Na fase Off-chain (sem Gas), esses 3% revertem integralmente para o Panda Ops.**
> - **1% Fundo Incentivo:** Mínimo hardcoded.
> - **1% Panda Ops:** Mínimo hardcoded.
> - _Resumo Pré-Chain:_ 4% Ops + 1% Fundo. (Host 95%)
> - _Resumo Pós-Chain:_ 1% Ops + 1% Fundo + 3% Gas. (Host 95%)
>
> **2. O Teto Ajustável (Até 10%):**
>
> - O DAO pode aumentar as taxas de Ops e Fundo em até **2.5% adicionais cada** (de 1% para máx 3.5%).
> - _Cenário Máximo:_ 3% Gas + 3.5% Ops + 3.5% Fundo = 10%. (Host 90%).

### 9.2. Treasury Backing (Reservas & Lastro) 🏦

O Panda Coin é lastreado em ativos reais para garantir solvência e confiança:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    TREASURY - ARQUITETURA DE LASTRO                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PAXG (Ouro Tokenizado) - LASTRO PRIMÁRIO 🥇                           │
│  ├── Proporção: ~70% das reservas                                      │
│  ├── Função: Lastro de VALOR do futuro Panda Coin on-chain             │
│  ├── Blockchain: Ethereum (ERC-20) / Solana (Wrapped)                  │
│  └── Razão: Ouro é reserva de valor milenar, proteção contra inflação  │
│                                                                         │
│  USDC (Dólar Tokenizado) - LIQUIDEZ & SOLVÊNCIA 💵                      │
│  ├── Proporção: ~30% das reservas                                      │
│  ├── Função: Garantir SAQUES imediatos em fiat                         │
│  ├── Blockchain: Solana (nativo) / Ethereum                           │
│  └── Razão: Estabilidade e liquidez instantânea                        │
│                                                                         │
│  AUDITORIA ON-CHAIN - SNAPSHOTS DIÁRIOS 📊                            │
│  ├── Frequência: 1x ao dia (custo ~$0.01/dia = $0.30/mês)              │
│  ├── Blockchain: Solana (taxas baixas)                                 │
│  ├── Conteúdo: Hash do balanço total + timestamp                       │
│  └── Verificador: Qualquer pessoa pode auditar via explorer            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### A. Health Score (Pontuação de Saúde do Treasury)

O Health Score é exibido no Header e calculado dinamicamente:

```javascript
// Cálculo do Health Score (0-100%)
function calculateHealthScore(treasury) {
  const weights = {
    reserves: 0.4, // Reservas totais vs supply circulante
    runway: 0.25, // Meses de operação garantidos
    diversification: 0.2, // Distribuição PAXG/USDC/Ops
    liquidity: 0.15, // Capacidade de saque imediat
  };

  const scores = {
    reserves: Math.min(
      100,
      (treasury.totalReserves / treasury.circulatingSupply) * 100,
    ),
    runway: Math.min(100, (treasury.runwayMonths / 12) * 100),
    diversification: calculateDiversificationScore(treasury.breakdown),
    liquidity: Math.min(
      100,
      (treasury.usdc / treasury.monthlyWithdrawals) * 33,
    ),
  };

  return Object.entries(weights).reduce(
    (total, [key, weight]) => total + scores[key] * weight,
    0,
  );
}
```

#### B. Indicadores do Treasury Dashboard

| Métrica             | Fórmula                 | Meta Saudável |
| ------------------- | ----------------------- | ------------- |
| **Backing Ratio**   | Reservas / Supply       | ≥ 100%        |
| **Runway**          | Reservas / Custo Mensal | ≥ 12 meses    |
| **PAXG Ratio**      | PAXG / Total Reservas   | 60-80%        |
| **Liquidity Ratio** | USDC / Saques (30d)     | ≥ 3x          |
| **Snapshot Age**    | Tempo desde último hash | < 24h         |

#### C. Widget do Header (Arc Energy Bar)

```text
┌──────────────────────────────────────────────────┐
│  [Logo]  FB ●  RU ●  GPU ●     ╭───╮  🏦 92%  ⚙️  │
│                               │ 65%│              │
│                               ╰───╯              │
│                                ▲                  │
│                          Arc Energy        Treasury│
│                          (PC Balance)      Health  │
└──────────────────────────────────────────────────┘

Clique em 🏦 92% → Abre Treasury Dashboard Modal
```

> **Por que Daily Snapshots?**
>
> - Custo Solana: ~$0.01/transação = $0.30/mês (muito barato)
> - Equilíbrio: Seguranca adequada sem overhead excessivo
> - Auditabilidade: Qualquer pessoa verifica via Solscan

### 9.3. Hierarquia de Governança (4 Camadas)

A economia é gerida por um sistema de pesos e contrapesos para garantir longevidade.

```text
CAMADA 1: HARDCODE (A Constituição Imutável)
[Piso 2.5x] [Founder 5%] [Min Fundo 15%]
      │
      ▼
CAMADA 2: DAO (O Congresso Político)
[Define Splits flutuantes] [Aprova Parcerias]
      │
      ▼
CAMADA 3: BANCO CENTRAL IA (O Executivo - PAT)
[Controla Inflação] [Gere Fundo] [Executa Queimas]
      │
      ▼
CAMADA 4: MERCADO ÚNICO (O Varejo)
[Vende Tokens] [Aplica Descontos] [Coleta Taxas]
```

#### A. Camada 1: Constituição Federal (Hardcoded)

_Imutáveis. Smart Contract Nível Supremo._

| Artigo                | Regra                             | Por quê?                                                      |
| --------------------- | --------------------------------- | ------------------------------------------------------------- |
| **1. Teto Inflação**  | `Max 5% ao ano`                   | Trava rígida contra desvalorização                            |
| **2. Panda Labs**     | `25% do Fundo → Educação`         | Verba garantida para University/Inovação                      |
| **3. Reserva Ops**    | `20% do Lucro Ops → Caixa`        | Fundo de Emergência (Incide sobre Split Panda)                |
| **4. Crescimento**    | `65% do Fundo → Ação`             | Subsídios, Viralização e Eventos (Gestão IA)                  |
| **5. Piso Preço**     | `2.5x` (Min `1.25x`)              | Solvência. Permite descontos progressivos (até 50%)           |
| **6. Founder Fee**    | `5%` Bruto Eterno                 | Direito do Criador ("Satoshi Fee")                            |
| **7. Garantia Host**  | `90% a 95%` (Taxa P2P 5-10%)      | Blinda a descentralização contra taxas abusivas               |
| **8. Reserva Fundo**  | `Max 10%` (Excedente = Reinveste) | Estabilidade. Sobra reforça Labs e Subsídios (PAT)            |
| **9. Bill of Rights** | `Liberdade Total`                 | Ver tabela abaixo (Direitos Civis Digitais)                   |
| **10. Arbitragem**    | `IA → Founder`                    | Disputa escala: IA julga, Founder decide em última instância  |
| **11. Leis Pétreas**  | `Imutável`                        | Zero processo de emenda. A Constituição é eterna.             |
| **12. Emergência**    | `Failover Agent`                  | IA Auxiliar assume se a principal falhar. Não só Kill Switch. |

#### A.1. Bill of Rights (Direitos Civis Digitais)

_O Protocolo é neutro como a Física. Ele não julga, apenas executa._

| Direito Hardcoded             | Regra Imutável                                                                  | Por quê?                                          |
| ----------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| **1. Free Speech**            | **Censura Zero.** O protocolo é agnóstico ao conteúdo.                          | A verdade não precisa de proteção, a mentira sim. |
| **2. Non-Expulsion**          | **Banimento Impossível.** A chave privada é soberana. Ninguém pode ser expulso. | Neutralidade Suíça. Se pagou o Gas, executa.      |
| **3. Rust Law (Privacidade)** | **Execução Consentida.** O código NUNCA roda sem permissão explícita (Pop-up).  | "Seus dados, Suas regras". Anti-Spyware nativo.   |

> **Nota de Aplicação do Fundo (Art 2, 4 & 8) - Distribuição Total (100%):**
> O Fundo de Incentivo (~23% da Receita Global) é **100% Alocado** via Hardcode:
>
> 1. **25% - Panda Labs (Educação & P&D):**
>    - `20%` **Bolsas "Learn-to-Earn":** Pagamento direto e automático p/ alunos (Automação Total).
>    - `5%` **Hubs & Infra:** Modernização de laboratórios físicos e Doação de Hardware para Universidades parceiras.
> 2. **65% - Crescimento & Distribuição (Gestão Ativa via IA):**
>    - `30%` **Robin Hood (Subsídios):** Custeia o acesso de entrada e "Free Tier" para baixa renda.
>    - `20%` **Viralização (Afiliados):** Comissões automáticas para influencers e referrals.
>    - `15%` **Eventos (Bootcamps):** Hackathons e prêmios para atrair devs.
> 3. **10% - Reserva Técnica (Lastro):**
>    - Mínimo existencial para estabilidade. Todo excedente acima de 10% é **Reinvestido automaticamente** (via PAT) em Bolsas e Subsídios. Zero desperdício.

#### B. Camada 2: Governança via IA ("Super Jarvis")

Em vez de políticos humanos (DAO), uma **Superinteligência (PAT)** gere o ecossistema desde o **Dia 1**, operando estritamente dentro dos limites constitucionais (Hardcode).

| Era         | Quem Governa?                  | Papel do Founder (Lucas)                                      |
| ----------- | ------------------------------ | ------------------------------------------------------------- |
| **Dia 1**   | **IA Assistida (Alpha)**       | **Piloto:** A IA sugere alocações, você aprova.               |
| **Escala**  | **IA Autônoma (Beta)**         | **Auditor:** A IA executa realocações sozinha. Você monitora. |
| **Suprema** | **IA Soberana (The Overmind)** | **Kill Switch:** Só intervém se a IA violar a Constituição.   |

> **Segurança:** A IA tem liberdade total para operar, mas **zero poder** para alterar a Constituição (Camada 1). Ela joga o jogo, mas não muda as regras.

**Capacidades Expandidas (Google Organism):**
A IA não é isolada. Ela atua como um "Crawler Inteligente" dentro do ecossistema Google:

1. **Hunter de Inovação:** Monitora o _Google Garden_ e _Hugging Face_ por novos modelos (Gemini, Llama) e sugere auto-implementação.
2. **Trend Watcher:** Busca na web por demandas emergentes (ex: "Rust está em alta") para criar currículos do Panda Labs instantaneamente.
3. **Cloud Native:** Acesso direto às APIs do Google Cloud para alocar/desalocar recursos conforme a demanda.

#### C. Camada 3: Panda AI Treasury (PAT)

A IA atua como **Banco Central**, executando a política monetária para manter inflação em **0-3% a.a.**.

| Ferramenta         | Nível      | Gatilho        | Ação                                                   | Resultado Esperado       |
| ------------------ | ---------- | -------------- | ------------------------------------------------------ | ------------------------ |
| **Reinvestimento** | 🟢 Baixo   | Reserva > 10%  | Distribui excedente em Bolsas e Subsídios (Robin Hood) | Manter Zero Ociosidade   |
| **Aceleração**     | 🟡 Médio   | Deflação > 2%  | Aumenta Grants de entrada e Cashback                   | Atrair novos usuários    |
| **Vesting**        | 🟠 Alto    | Compra > 5M PC | Trava tokens (30% à vista, 70% prazo de 6 meses)       | Evitar "Pump & Dump"     |
| **Burn (Crise)**   | 🔴 Crítico | Inflação > 5%  | Queima tokens da Reserva de Emergência                 | Forçar Deflação Imediata |

#### D. Camada 4: Mercado Único (Panda Energy)

Um único mercado para todos, com descontos automáticos por volume histórico.

| Volume         | Desconto | Fonte dos Tokens                          |            |
| -------------- | -------- | ----------------------------------------- | ---------- |
| **Iniciante**  | 0%       | Mercado Aberto (Sobe preço)               |            |
| **Dev Ativo**  | 5-20%    | Mercado Aberto (Sobe preço)               |            |
| **Enterprise** | 30-50%   | **Reserva de Liquidez** (Não afeta preço) | Inviolável |

---

## 19. Roadmap de Implementação

### 10.1. Cronograma Visual

```text
Semana:  1  2  3  4  5  6  7  8  9  10 11 12
SDK Mock ════✅ (DONE)
UI/UX       └══█══█══┐ (IN PROGRESS)
Backend            └══█══█══█══┐
Store                          └══█══█══█
```

### 10.2. Fases & Milestones

#### Fase 1: SDK Mock ✅ CONCLUÍDO

- [x] `js/pf.sdk.js` - Enterprise Ready
- [x] Módulos: Auth, Data, Storage, Wallet, Brain, GPU, Bridge, UI
- [x] `docs/SDK_REFERENCE.md`

#### Fase 2: UI/UX Integration 🚧 EM PROGRESSO

- [ ] Settings Modal conectado ao SDK
- [ ] Login Screen + Dashboard

- **Milestone:** 10 alpha testers

#### Fase 3: Backend Real

- [ ] `PF_Dispatcher.gs` + Firebase real
- [ ] Rust Agent MVP

- **Milestone:** 50 closed beta

#### Fase 4: Store & Marketplace

- [ ] Payment gateway (Stripe/Pix)
- [ ] 5 módulos publicados

- **Milestone:** 100 paying users

#### Fase 5: Crypto Layer (Após R$ 100K GMV)

- [ ] Solana/Polygon integration

- **Milestone:** 1000 active wallets

---

## 20. Referências & Integrações Monetárias

O sistema aceita entradas de capital via canais tradicionais e webhooks de infoprodutos.

### 11.1. Gateways de Pagamento (Fiat)

- **Stripe:** Processamento internacional (Cartão/ACH). Taxa padrão ~3%.
- **PagSeguro:** Processamento nacional (Pix/Boleto/Cartão). Taxa padrão ~3-4%.
- **Pix Nativo:** Integração direta (Open Finance) futura para zerar taxas.

### 11.2. Integração Infoprodutos (Webhooks)

Para produtores que vendem cursos/acessos externos:

- **Kiwify / Hotmart:** O sistema escuta Webhooks de "Compra Aprovada".
- **Ação:** Cria conta Panda Pro automaticamente para o aluno.
- **Modelo:** Venda B2B (Produtor compra lote de acessos com desconto).

### 11.3. Sistema de Afiliados

- **Nativo:** O Panda possui sistema próprio de tracking `?ref=aff_id`.
- **Comissão:** Definida pelo DAO (Ex: 30% da venda).
- **Origem:** O valor da comissão é descontado da margem de Marketing (Ops) ou do Split Dev, dependendo da regra do produto.

---

## 12. Referências & Convenções

### 12.1. Convenção de Nomes (PF)

- **GitHub Repos:** `pf-sdk`, `pf-agent`, `pf-registry`
- **GAS Scripts:** `PF_Dispatcher`, `PF_Wallet`
- **JS Internal:** `PF._cache`
- **JS Public:** `Panda.Data`
- **Eventos:** `pf:ready`
- **CSS Vars:** `--pf-primary`

### 12.2. Mapa da Documentação

| Documento                            | Descrição                             |
| ------------------------------------ | ------------------------------------- |
| `PF_MASTER_ARCHITECTURE.md`          | Este arquivo (A Bíblia completa)      |
| `PF_SDK_REFERENCE.md`                | API Reference da biblioteca Panda SDK |
| `PF_PLUGIN_AND_MODULAR_REFERENCE.md` | Plugins e sistema modular             |
| `PF_CTRADER_REFERENCE.md`            | Integração cTrader Open API           |
| `PF_GAS_REFERENCE.md`                | Backend Google Apps Script            |
| `PF_CSS_REFERENCE.md`                | Design System                         |
| `PF_HTML_REFERENCE.md`               | Componentes HTML                      |
| `.agent/PANDA.md`                    | Codex Central (ler primeiro)          |
| `README.md`                          | Entry point para devs novatos         |

---

## 13. Trading Hub (cTrader Integration)

O Trading Hub conecta o Panda Factory ao mercado financeiro via cTrader Open API.

### 13.1. Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         TRADING HUB                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   │
│  │ pf.ctrader-api   │    │ pf.ctrader-oauth │    │  AI Signals      │   │
│  │ (WebSocket)      │    │ (User Auth)      │    │  (Panda.Brain)   │   │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘   │
│           │                       │                       │              │
│           └───────────────────────┼───────────────────────┘              │
│                                   ▼                                      │
│                     ┌──────────────────────────┐                         │
│                     │    cTrader Open API      │                         │
│                     │  (Port 5036 - JSON/WS)   │                         │
│                     └──────────────────────────┘                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 13.2. Módulos

| Módulo            | Arquivo                                   | Descrição                    |
| ----------------- | ----------------------------------------- | ---------------------------- |
| **API Connector** | `js/trading/pf.ctrader-api.js`            | WebSocket, Orders, Positions |
| **OAuth**         | `js/trading/pf.ctrader-oauth.js`          | User login flow              |
| **UI**            | `components/trading/Comp_TradingHub.html` | Trading interface            |

### 13.3. Credenciais (App: Antigravity)

| Item             | Valor                                             |
| ---------------- | ------------------------------------------------- |
| **Client ID**    | `19151_S6shjal0uQ...`                             |
| **Redirect URI** | `https://lucassval.github.io/panda-ctrader-auth/` |
| **Scope**        | `trading`                                         |
| **WS Port**      | `5036` (JSON)                                     |

### 13.4. Monetização Trading

| Feature     | Custo (PC)  |
| ----------- | ----------- |
| Conexão API | GRÁTIS      |
| AI Signal   | 50 PC/sinal |
| AI Analysis | 30 PC       |
| Backtesting | 100 PC/run  |

> 📖 **Referência detalhada:** [PF_CTRADER_REFERENCE.md](PF_CTRADER_REFERENCE.md)

---

## 14. Social Media Hub (Plugin Ecosystem)

Sistema modular de plugins para gestão de redes sociais.

### 14.1. Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       SOCIAL MEDIA HUB                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    pf.social-core.js (GRÁTIS)                      │ │
│  │  • CRM Integrado  • Agenda  • Generator Base  • Plugin Loader      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                   │                                      │
│      ┌──────────┬──────────┬──────┴──────┬──────────┬──────────┐        │
│      ▼          ▼          ▼             ▼          ▼          ▼        │
│  ┌────────┐ ┌────────┐ ┌────────┐   ┌────────┐ ┌────────┐ ┌────────┐   │
│  │YouTube │ │TikTok  │ │ Meta   │   │Twitter │ │WhatsApp│ │ ...    │   │
│  │ 499 PC │ │ 399 PC │ │ 599 PC │   │ 299 PC │ │ 799 PC │ │ Future │   │
│  └────────┘ └────────┘ └────────┘   └────────┘ └────────┘ └────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 14.2. Plugins Disponíveis

| Plugin        | Arquivo                 | Preço  | Features                    |
| ------------- | ----------------------- | ------ | --------------------------- |
| **Core**      | `pf.social-core.js`     | GRÁTIS | CRM, Agenda, Generators     |
| **YouTube**   | `pf.social-youtube.js`  | 499 PC | SEO, Thumbnails AI, Scripts |
| **TikTok**    | `pf.social-tiktok.js`   | 399 PC | Trends, Viral, Hashtags     |
| **Meta**      | `pf.social-meta.js`     | 599 PC | Posts, Stories, Reels, Ads  |
| **Twitter/X** | `pf.social-twitter.js`  | 299 PC | Threads, Hooks, Spaces      |
| **WhatsApp**  | `pf.social-whatsapp.js` | 799 PC | Broadcast, Leads, Flows     |

### 14.3. Revenue Split

```text
Venda de Plugin (100 PC):
├── Dev (Criador)     → 70 PC (70%)
├── Panda Factory     → 25 PC (25%)
└── Founder           →  5 PC (5%)
```

> 📖 **Referência detalhada:** [PF_PLUGIN_AND_MODULAR_REFERENCE.md](PF_PLUGIN_AND_MODULAR_REFERENCE.md)

---

## 9. P2P Compute Network

> **Conceito:** Qualquer pessoa pode alugar capacidade computacional por PC

### 15.1. Arquitetura

```text
┌─────────────────────────────────────────────────────────────┐
│                    PANDA COMPUTE NETWORK                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PROVIDERS (Quem Aluga)           CONSUMERS (Quem Usa)      │
│  ├── Google Colab (oficial)       ├── Dev compilando        │
│  ├── WebNVIDIA/GeForce Now        ├── Artista renderizando  │
│  ├── Servers dedicados            ├── Jornalista processando│
│  └── Usuário (PC gamer ocioso)    └── Estudante treinando ML│
│                                                             │
│  SPLIT DE RECEITA (Art. 7 Constituição)                     │
│  └── 95% Host / 5% Panda                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 15.2. Registro de Host

| Etapa | Ação                                           |
| ----- | ---------------------------------------------- |
| 1     | Usuário tem servidor/PC ocioso                 |
| 2     | Registra no Panda Network (specs + preço/hora) |
| 3     | Recebe jobs via Firebase signaling             |
| 4     | Executa em sandbox (Rust Agent)                |
| 5     | Recebe PC automaticamente (95%)                |

### 15.3. Validação com Constituição

- **Art. 7 (Garantia Host):** 90-95% vai para o host ✅
- **Taxa P2P:** 5-10% (configurável via DAO) ✅

---

## 16. Google Partner Strategy

> **Visão:** Panda Factory = Showcase completo de integração Google

### 16.1. Por que Google Partner?

| Argumento               | Benefício para Google                                        |
| ----------------------- | ------------------------------------------------------------ |
| **Showcase completo**   | Prova que dá para construir plataforma inteira só com Google |
| **Zero vendor lock-in** | Usuário usa conta Google dele (mais usuários Google)         |
| **Educação**            | Ensina devs a usar serviços Google                           |
| **Custo ~R$0**          | Free Tier generoso = mais adoção                             |

### 16.2. Serviços Google Integrados

| Serviço           | Uso no Panda          | Tentáculo              |
| ----------------- | --------------------- | ---------------------- |
| **Google Drive**  | Storage base          | google/drive.js        |
| **Google Sheets** | DB gratuito           | google/sheets.js       |
| **Google Colab**  | GPU/Compile universal | google/colab.js        |
| **Firebase**      | Auth + Realtime       | google/firebase.js     |
| **Gemini**        | IA principal          | brain/gemini.js        |
| **YouTube Data**  | Analytics, Upload     | google/youtube-data.js |
| **Calendar**      | Agendamento           | google/calendar.js     |

### 16.3. VSX Store Universal

Não reinventar a roda. Integrar fontes existentes:

| Fonte                   | Tipo      | Prioridade |
| ----------------------- | --------- | ---------- |
| **GitHub**              | Microsoft | 🔴 Alta    |
| **Google Cloud Source** | Google    | 🔴 Alta    |
| GitLab                  | Open      | 🟡 Média   |

> 📖 **Referência estratégica:** [ROADMAP_ESTRATEGICO.md](ROADMAP_ESTRATEGICO.md)

---

## 17. EdTech & Multi-Market Expansion

> **Objetivo:** Hooks para Kiwify, Hotmart, Eduzz e outras plataformas

### 17.1. DRM Tokenizado

Sistema de acesso condicional usando `Panda.Wallet`:

```javascript
// Verificar acesso a conteúdo pago
async function checkAccess(contentId) {
  const balance = await Panda.Wallet.getBalance();
  const required = await Panda.Data.get("content_prices", contentId);
  return balance >= required.price;
}
```

### 17.2. Webhooks de Pagamento

| Plataforma | Status          | Arquivo               |
| ---------- | --------------- | --------------------- |
| Kiwify     | ✅ Implementado | `PF_Core_Webhooks.gs` |
| Hotmart    | 🔴 Pendente     | Clone Kiwify          |
| Eduzz      | 🔴 Pendente     | Clone Kiwify          |

### 17.3. White-Label Cursos

- Estrutura: Tentacle `education/`
- Parent: `pf.education-parent.js`
- Children: `kiwify.js`, `hotmart.js`, `eduzz.js`

---

## 18. Gaming, Audio & Video Tentacles

> **Objetivo:** Integrações criativas para devs, artistas e produtores

### 18.1. Gaming Tentacle

| Ferramenta     | Tipo        | Integração  |
| -------------- | ----------- | ----------- |
| **Godot**      | Engine      | Wasm nativo |
| **Bevy**       | Engine Rust | Wasm        |
| **Three.js**   | 3D Web      | JS direto   |
| **PixiJS**     | 2D Web      | JS direto   |
| **PlayCanvas** | Web Engine  | JS          |

### 18.2. Audio Tentacle

| Ferramenta     | Uso             | Custo            |
| -------------- | --------------- | ---------------- |
| **Tone.js**    | Synth web       | Grátis           |
| **ElevenLabs** | TTS/Voice clone | PC/char          |
| **Whisper**    | Transcrição     | Local:0 / API:PC |
| **Suno AI**    | Geração música  | PC/track         |

### 18.3. Video Tentacle

| Ferramenta          | Uso                | Custo  |
| ------------------- | ------------------ | ------ |
| **FFmpeg (Wasm)**   | Codec universal    | Grátis |
| **Remotion**        | Video programático | Grátis |
| **Veo (Google)**    | IA Video           | PC/min |
| **Pexels/Unsplash** | Stock              | Grátis |

### 18.4. Google Colab - Casos de Uso Universal

| Área           | Uso                                    |
| -------------- | -------------------------------------- |
| **Dev**        | Compilar apps Rust, Godot, Android     |
| **Jornalismo** | Processar vídeos, transcrição em massa |
| **Acadêmico**  | TCC, análise de dados, ML              |
| **Criativo**   | Render 3D, processamento de áudio      |
| **IA**         | Fine-tuning, inference                 |

---

## 19. Multi-Market Expansion (A "Amazon" de Serviços Digitais)

> **Filosofia:** O Panda não vende apenas cursos ou jogos. É o hub de distribuição para qualquer ativo digital.

### 19.1. EdTech & Info (Kiwify/Hotmart Hook)

| Conceito           | Descrição                                                 |
| ------------------ | --------------------------------------------------------- |
| **White-Label**    | Cursos vendidos fora, rodando na infraestrutura Panda     |
| **DRM Tokenizado** | Acesso ao conteúdo depende de validação da carteira Panda |

### 19.2. Gaming & Entertainment (Steam/Epic/Mobile)

| Conceito          | Descrição                                                          |
| ----------------- | ------------------------------------------------------------------ |
| **Panda Publish** | CI/CD que compila e publica na Steam, Google Play, Apple App Store |
| **Panda Arcade**  | Loja própria para jogos WebGPU "Click-to-Play" (sem download)      |

### 19.3. Creative Assets (Sketchfab/ArtStation Model)

| Conceito               | Descrição                                                   |
| ---------------------- | ----------------------------------------------------------- |
| **Marketplace 3D/2D**  | Venda de modelos, texturas e sons (IA ou artistas)          |
| **Interoperabilidade** | Asset comprado abre direto no Blender/Godot dentro do Panda |

### 19.4. Dev Tools & Plugins (VSX Store)

| Conceito          | Descrição                                          |
| ----------------- | -------------------------------------------------- |
| **Extensões VSX** | Devs portam extensões VS Code para vender no Panda |
| **Módulos SaaS**  | Venda de microsserviços (ex: API WhatsApp) via MCP |

---

## 18. Game Studio & Publisher

> **Modelo:** Agregador de Engines + Cross-Commerce

### 20.1. Engines Suportadas

| Engine     | Modo                    | Categoria         |
| ---------- | ----------------------- | ----------------- |
| **Godot**  | Nativo (Wasm/WebGPU)    | Open Source       |
| **Bevy**   | Nativo (Rust/Wasm)      | Open Source       |
| **Unreal** | Pixel Streaming (Nuvem) | Big Tech (Bridge) |
| **Unity**  | Pixel Streaming (Nuvem) | Big Tech (Bridge) |

### 20.2. Funcionalidades

| Feature             | Descrição                                                               |
| ------------------- | ----------------------------------------------------------------------- |
| **Panda Team Link** | Plugin para colaboração em tempo real (Google Docs para código de jogo) |
| **Cross-Commerce**  | Venda de "Founder Packs" via Kiwify que liberam chaves na Steam/Panda   |

### 20.3. Validação Simplificada

> ⚠️ **Foque primeiro:** Valide apenas o **itch.io** (aberto e fácil) ou o **Panda Arcade** próprio.

---

## 10. Bounty System & Comunidade

> **Filosofia:** Use a "Vibe Dev" e a comunidade Open Source. Não escreva integrações chatas.

### 21.1. Como Funciona

| Papel              | Responsabilidade                                                                |
| ------------------ | ------------------------------------------------------------------------------- |
| **Você (Core)**    | Constrói a Documentação da API (`Panda.Publish.Interface`)                      |
| **Bounty**         | _"Pago 5.000 PC para quem criar o Conector Epic Games seguindo essa interface"_ |
| **Dev Comunidade** | Faz a integração. Você só valida (Code Review)                                  |

### 21.2. Níveis de Tentáculos

```text
┌─────────────────────────────────────────────────────────────┐
│                     🐼 PANDA SDK CORE                       │
│  ────────────────────────────────────────────────────────   │
│  IMUTÁVEL. Apenas Founder altera.                          │
│  Panda.Auth, Panda.Wallet, Panda.Data, TentacleMonitor     │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
     OFICIAL             COMUNIDADE          ENTERPRISE
     (Panda)             (Bounty)            (Privado)
          │                   │                   │
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ google/         │ │ epic-games/     │ │ cliente-x/      │
│ social/         │ │ cielo/          │ │ (white-label)   │
│ trading/        │ │ stripe-br/      │ │                 │
│ brain/          │ │ mercadopago/    │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
    ✅ Core Team       🏆 Bounty           💼 Pago
```

### 21.3. Promoção de Tentáculos

| De         | Para       | Requisitos                           |
| ---------- | ---------- | ------------------------------------ |
| Comunidade | Oficial    | Code Review + Testes + 1 mês estável |
| Enterprise | Comunidade | Cliente autoriza open-source         |

### 21.4. Revenue Split (ref: TOKENOMICS §9.1.B)

| Destino         | Store/Compute |
| --------------- | ------------- |
| Dev/Host        | 55%           |
| Fundo Incentivo | 22%           |
| Panda Ops       | 15%           |
| Founder         | 5%            |
| Gateway         | 3%            |

---

## 2. O Diferencial "Hook" (Filosofia Core)

> **"O Panda Factory não compete com a Steam, a Hotmart ou o VS Code. Ele engole todos através de integrações (Hooks)."**

### 22.1. O Princípio

```text
Usuário cria UMA VEZ no Panda
        ↓
Distribui para TODOS os canais:
├── Steam
├── Epic Games
├── Google Play
├── Kiwify/Hotmart
├── VS Code Marketplace
└── Panda Arcade

A IA gerencia a complexidade.
O Token captura o valor.
```

### 22.1.1. Distribution Hub - 1-Click Deploy

> **"Criar é difícil. Distribuir deveria ser um clique."**

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    DISTRIBUTION HUB - FLUXO UNIFICADO                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USUÁRIO                     PANDA SDK                                  │
│  ┌─────────┐                ┌──────────────┐                            │
│  │ Projeto │────────────────│ Panda.Dist   │                            │
│  └─────────┘                └──────┬───────┘                            │
│                                    │                                     │
│                    ┌───────────────┼───────────────┐                    │
│                    ▼               ▼               ▼                    │
│            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│            │ 📱 MOBILE   │ │ 🎮 GAMING   │ │ 💼 SAAS     │              │
│            ├─────────────┤ ├─────────────┤ ├─────────────┤              │
│            │ Google Play │ │ Steam       │ │ VS Code Mkt │              │
│            │ App Store   │ │ Epic Games  │ │ Chrome Ext  │              │
│            │ PWA Direct  │ │ itch.io     │ │ NPM         │              │
│            │ APK Manual  │ │ Panda Arcade│ │ Github Rel  │              │
│            └─────────────┘ └─────────────┘ └─────────────┘              │
│                    │               │               │                    │
│                    └───────────────┼───────────────┘                    │
│                                    ▼                                     │
│                         ┌──────────────────┐                            │
│                         │ 📊 Analytics Hub │                            │
│                         │ Downloads, Uso   │                            │
│                         └──────────────────┘                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 22.1.2. API Panda.Dist (Distribution)

```javascript
// SDK para distribuição unificada
window.Panda.Dist = {
  // ==========================================
  // CONFIGURAÇÃO (Uma vez por projeto)
  // ==========================================
  async configure(projectId, credentials) {
    // Armazena credenciais de cada plataforma
    // Steam: Steamworks partner key
    // Google Play: Service account JSON
    // VS Code: Personal access token
    // etc.
  },

  // ==========================================
  // BUILD
  // ==========================================
  async build(projectId, targets) {
    // targets: ['android', 'windows', 'web', 'vscode']
    // Usa GitHub Actions / Colab para builds pesadas
  },

  // ==========================================
  // DEPLOY 1-CLICK
  // ==========================================
  async deploy(projectId, target, options) {
    // target: 'google_play' | 'steam' | 'vscode' | 'npm' | 'panda_arcade'
    // Faz upload automático para a plataforma

    const result = await this._hooks[target].deploy(projectId, options);

    // Registra no Analytics
    await Panda.Data.save("deployments", {
      projectId,
      target,
      version: options.version,
      timestamp: Date.now(),
    });

    return result;
  },

  // Hooks por plataforma
  _hooks: {
    google_play: GooglePlayHook,
    steam: SteamHook,
    epic: EpicHook,
    vscode: VSCodeHook,
    npm: NPMHook,
    panda_arcade: PandaArcadeHook,
  },

  // ==========================================
  // STATUS
  // ==========================================
  async getStatus(projectId) {
    // Retorna status em todas as plataformas
  },

  async getAnalytics(projectId, period) {
    // Downloads, avaliações, revenue por plataforma
  },
};
```

### 22.1.3. Matriz de Plataformas

| Plataforma       | Tipo    | Custo Build | Auto-Deploy     | Status |
| ---------------- | ------- | ----------- | --------------- | ------ |
| **Google Play**  | Mobile  | 500 PC      | ✅ Planejado    | 🔴     |
| **PWA Direct**   | Web     | Grátis      | ✅ Pronto       | ✅     |
| **Steam**        | Gaming  | 1000 PC     | 🟡 API paga     | 🔴     |
| **Epic Games**   | Gaming  | 1000 PC     | 🟡 API restrita | 🔴     |
| **itch.io**      | Gaming  | Grátis      | ✅ Butler CLI   | 🔴     |
| **VS Code**      | Dev     | Grátis      | ✅ vsce         | 🔴     |
| **NPM**          | Dev     | Grátis      | ✅ npm publish  | 🔴     |
| **Panda Arcade** | Interno | Grátis      | ✅ Nativo       | ✅     |

### 22.1.4. Cenários de Uso

```text
CENÁRIO 1: Game Developer
──────────────────────────
1. Dev cria jogo no Godot/Bevy (via Panda)
2. Assets de IA: sprites, música, sfx
3. Clica "Deploy" → Seleciona:
   ☑ Steam
   ☑ Epic Games
   ☑ itch.io
   ☑ Panda Arcade
4. Panda empacota para cada plataforma
5. Upload automático via hooks
6. Dev recebe link de cada loja

CENÁRIO 2: Pequeno Negócio
──────────────────────────
1. Dono cria app delivery (template Panda)
2. Customiza cores, logo, cardápio
3. Clica "Deploy" → Seleciona:
   ☑ Google Play
   ☑ PWA Direct
4. Panda gera APK/AAB + PWA
5. Upload para Play Store (ou APK direto)
6. Dono compartilha link do app

CENÁRIO 3: Criador de Conteúdo
──────────────────────────────
1. Educador cria curso no Panda
2. Vídeos editados, quizzes, certificado
3. Clica "Deploy" → Seleciona:
   ☑ App Android (DRM)
   ☑ Kiwify/Hotmart
   ☑ Panda Cursos
4. Panda distribui para todos os canais
5. Pagamentos unificados via Panda Wallet
```

### 22.2. Blindagem do SDK

| Regra | Tentacle Comunidade                                  |
| ----- | ---------------------------------------------------- |
| ❌    | `window.Panda.Auth = malicious;` (Sobrescrever Core) |
| ❌    | `window.Panda._internal = {};` (Acessar internos)    |
| ❌    | `fetch()` sem `Panda.Bridge` (Bypass proxy)          |
| ✅    | `TentacleMonitor.registerChild('epic', API);`        |
| ✅    | `Panda.emit('community:epic:connected');`            |
| ✅    | Usar qualquer API pública do SDK                     |

### 22.3. Resumo para Paz Mental

| Princípio              | Descrição                                            |
| ---------------------- | ---------------------------------------------------- |
| **Core Estável**       | O Panda Core não muda por causa de terceiros         |
| **Drivers Isolados**   | Integrações são plugins descartáveis/substituíveis   |
| **Validação Unitária** | Teste um canal de cada vez (ex: só itch.io primeiro) |
| **Bounties**           | Deixe a comunidade preencher lacunas das APIs        |

> **APIs novas = Branches da comunidade, regulados por você, MAS NÃO são Core.**

---

## 23. App Factory - Democratização de Tecnologia

> **"O celular é o único computador que bilhões de pessoas possuem. Quem ignora mobile ignora a maioria da humanidade."**

### 23.1. A Visão

O Panda Factory não é apenas uma ferramenta para desenvolvedores. É uma **fábrica de democratização** que permite que qualquer pessoa, em qualquer lugar do mundo, tenha acesso às mesmas ferramentas que antes só grandes empresas possuíam.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    DEMOCRATIZAÇÃO EM 4 CAMADAS                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. ACESSO                                                               │
│  └── Zero barreiras: Funciona no navegador, funciona no celular        │
│                                                                          │
│  2. CONHECIMENTO                                                         │
│  └── IA que ensina: Antigravity, Brain, tutoriais contextuais          │
│                                                                          │
│  3. FERRAMENTAS                                                          │
│  └── Mesmas que grandes: IA, compute, automação, distribuição          │
│                                                                          │
│  4. MERCADO                                                              │
│  └── Distribuição global: Play Store, Web, P2P Compute                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 23.2. PWA/TWA - Apps Android Sem Código Nativo

A estratégia **PWA First** permite que usuários criem apps Android completos usando apenas HTML/JS:

| Tecnologia         | Descrição            | Vantagem                        |
| ------------------ | -------------------- | ------------------------------- |
| **PWA**            | Progressive Web App  | Funciona offline, ícone na home |
| **TWA**            | Trusted Web Activity | App na Play Store, 60fps        |
| **Bubblewrap**     | CLI oficial Google   | Empacota PWA → APK/AAB          |
| **GitHub Actions** | Build na nuvem       | Zero custo de servidor          |

```javascript
// pf.app-factory.js - Fluxo de Geração
const AppFactory = {
  async generate(projectId, options) {
    // 1. Coletar assets e código
    const manifest = await this.buildManifest(projectId, options);
    const serviceWorker = await this.generateSW(projectId);

    // 2. Enviar para build cloud (GitHub Action)
    const buildJob = await this.triggerCloudBuild({
      manifest,
      serviceWorker,
      assets: options.assets,
      output: options.format, // 'apk' | 'aab'
    });

    // 3. Retornar link do artifact
    return {
      downloadUrl: buildJob.artifactUrl,
      expiresAt: Date.now() + 86400000, // 24h
    };
  },
};
```

### 23.3. Público-Alvo Universal

| Segmento            | Necessidade                | Solução Panda             |
| ------------------- | -------------------------- | ------------------------- |
| **Pequeno negócio** | App de delivery/cardápio   | Template + 1-click deploy |
| **ONG**             | App de doações/voluntários | Template + Panda Wallet   |
| **Artista**         | Portfolio/loja digital     | Template + pagamentos     |
| **Educador**        | App de cursos              | DRM + gamificação         |
| **Comunidade**      | App de grupo/eventos       | Social + Calendar         |
| **Desenvolvedor**   | SaaS/ferramenta            | Full SDK + distribuição   |

### 23.4. Mobile-First por Design

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FILOSOFIA MOBILE-FIRST                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ❌ ERRADO: "Fazer desktop, depois adaptar para mobile"                │
│  ✅ CERTO:  "Fazer mobile, desktop é bônus natural"                    │
│                                                                          │
│  Por quê?                                                                │
│  ├── 80% do tráfego web global é mobile                                │
│  ├── Países emergentes: mobile-only é a norma                          │
│  ├── Performance mobile = performance everywhere                        │
│  └── Touch-first UX é mais intuitivo                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 23.5. Build Pipeline (Zero Custo)

```text
USUÁRIO                  PANDA                    NUVEM
   │                        │                        │
   │  "Gerar App"           │                        │
   │ ──────────────────────>│                        │
   │                        │  manifest.json         │
   │                        │  service-worker.js     │
   │                        │  assets.zip            │
   │                        │ ──────────────────────>│
   │                        │                        │  GitHub Action
   │                        │                        │  ├── bubblewrap
   │                        │                        │  ├── keysign
   │                        │                        │  └── upload
   │                        │                        │
   │                        │<────── artifact URL ───│
   │<────── download link ──│                        │
   │                        │                        │
```

**Custo Operacional:**

- GitHub Actions: 2000 min/mês grátis
- Google Colab: Backup para builds pesadas
- Tempo de build: ~2-5 minutos

### 23.6. Monetização

| Modelo          | Descrição          | Preço Sugerido     |
| --------------- | ------------------ | ------------------ |
| **Build única** | Gerar 1 APK/AAB    | 500 PC (~R$25)     |
| **Assinatura**  | Builds ilimitados  | 2000 PC/mês        |
| **Push Pack**   | Notificações       | 100 PC / 1k pushes |
| **White Label** | Remover branding   | 5000 PC            |
| **Analytics**   | Métricas avançadas | 1000 PC/mês        |

### 23.7. Arquivos da Feature

| Arquivo                            | Função            | Status      |
| ---------------------------------- | ----------------- | ----------- |
| `js/core/pf.app-factory.js`        | Core da geração   | 🔴 Pendente |
| `templates/android/`               | Templates de apps | 🔴 Pendente |
| `.github/workflows/bubblewrap.yml` | Build action      | 🔴 Pendente |
| `backend/PF_AppFactory.gs`         | Coordenação       | 🔴 Pendente |

### 23.8. Impacto Social

> **"Democratização não é caridade. É criar um mercado onde antes não havia."**

```text
ANTES do Panda App Factory:
├── Pizzaria: Paga R$10k para agência, recebe app genérico
├── ONG: Não tem app, usa WhatsApp para tudo
├── Artista: Depende de Linktree e plataformas predatórias
└── Dev brasileiro: Talento exportado para empresas estrangeiras

DEPOIS do Panda App Factory:
├── Pizzaria: Faz app sozinha em 1 hora, paga R$25
├── ONG: App próprio com doações, PC como moeda social
├── Artista: Loja própria, 95% do lucro (vs 30% da Apple)
└── Dev brasileiro: Cria plugins, vende globalmente, recebe PC
```

---

## 24. Dual Cloud Strategy (GitHub + Google)

> **Filosofia:** Panda senta em cima de dois gigantes ao mesmo tempo.
> Custo zero no beta. Zero lock-in. Máxima redundância.

### 24.1. Visão Geral

```text
┌─────────────────────────────────────────────────────────────────┐
│                    PANDA DUAL CLOUD                              │
│                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────┐           │
│  │   MICROSOFT/GitHub   │    │      GOOGLE           │           │
│  │                      │    │                       │           │
│  │  ├── Hosting (Pages) │    │  ├── AI (Gemini)     │           │
│  │  ├── Database (JSON) │    │  ├── Storage (Drive) │           │
│  │  ├── Compute (Actions)│   │  ├── Sheets (Data)   │           │
│  │  ├── CDN (Releases)  │    │  ├── GPU (Colab)     │           │
│  │  └── Source (Git)    │    │  └── Auth (Firebase) │           │
│  │                      │    │                       │           │
│  │  CUSTO: $0 (grátis)  │    │  CUSTO: $0-20/mês    │           │
│  └──────────────────────┘    └──────────────────────┘           │
│                                                                  │
│                    ┌───────────────────┐                        │
│                    │   PANDA SDK       │                        │
│                    │   (Abstração)     │                        │
│                    │                   │                        │
│                    │  Panda.Data →     │                        │
│                    │    GitHub JSON    │                        │
│                    │    OU Sheets      │                        │
│                    │    OU Firebase    │                        │
│                    └───────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### 24.2. GitHub como Infraestrutura

| Serviço             | Uso no Panda            | Custo Free   | Custo Pro   |
| ------------------- | ----------------------- | ------------ | ----------- |
| **GitHub Pages**    | Hosting estático        | ∞            | ∞           |
| **GitHub JSON DB**  | Database (data/\*.json) | 100MB        | 2GB         |
| **GitHub Actions**  | Compute serverless      | 2000 min/mês | 3000 min    |
| **GitHub Releases** | CDN para assets         | 2GB/release  | 2GB         |
| **GitHub API**      | CRUD via commits        | 5000 req/h   | 15000 req/h |

**Vantagens:**

- Versionamento automático (cada save = commit)
- Rollback trivial (git revert)
- Branch = ambientes (dev, staging, prod)
- PR = code review para dados
- Issues = tickets integrados

### 24.3. Google como Compute/AI

| Serviço           | Uso no Panda          | Custo Free |
| ----------------- | --------------------- | ---------- |
| **Gemini**        | IA principal (6 GEMs) | 60 req/min |
| **Drive**         | Storage grande        | 15GB       |
| **Sheets**        | Spreadsheet as DB     | ∞          |
| **Colab**         | GPU para ML           | 12h/sessão |
| **Firebase Auth** | Autenticação (futuro) | 50k/mês    |

### 24.4. Arquivos do GitHub Tentacle

```
js/tentacles/github/
├── pf.github-parent.js       (295 lines) - API Core
└── children/
    ├── database.js           (313 lines) - JSON as DB
    ├── pages.js              (216 lines) - Static Hosting
    └── actions.js            (263 lines) - Serverless

js/pf.bootstrap.js            (250 lines) - Zero-config init

.github/workflows/
├── pages.yml                 - Auto-deploy
└── android-build.yml         - Bubblewrap

data/
├── manifest.json             - DB structure
├── config/panda.json         - System config
├── users/                    - Users collection
└── projects/                 - Projects collection
```

### 24.5. API Panda.GitHub

```javascript
// Inicialização (automática via bootstrap)
await Panda.GitHub.init({
  owner: "LucassVal",
  repo: "SAAS",
  token: "ghp_...", // Para escrita
});

// Database (CRUD)
await Panda.Data.save("users", { name: "Lucas", role: "founder" });
await Panda.Data.get("users", "abc123");
await Panda.Data.list("users", { where: [["role", "==", "founder"]] });
await Panda.Data.delete("users", "abc123");

// Pages (Hosting)
await Panda.GitHub.Pages.deploy();
await Panda.GitHub.Pages.setCustomDomain("panda.factory");
await Panda.GitHub.Pages.setupSPARouting();

// Actions (Compute)
await Panda.GitHub.Actions.trigger("build.yml", { target: "android" });
await Panda.GitHub.Actions.waitForRun(runId);
await Panda.GitHub.Actions.getArtifacts(runId);
```

### 24.6. Bootstrap Zero-Config

```html
<!-- Apenas isso é necessário -->
<script src="js/pf.sdk.js"></script>
<script src="js/pf.bootstrap.js"></script>

<!-- Panda.* está pronto para uso -->
<script>
  window.addEventListener("panda:ready", async () => {
    // GitHub detectado automaticamente
    const users = await Panda.Data.list("users");
    console.log(users);
  });
</script>
```

### 24.7. Planos de Upgrade

| Fase       | Infra                     | Custo    |
| ---------- | ------------------------- | -------- |
| **Beta**   | GitHub Free + Google Free | $0/mês   |
| **Launch** | GitHub Pro + Gemini API   | $20/mês  |
| **Growth** | GitHub Enterprise + GCP   | $100/mês |
| **Scale**  | Multi-cloud híbrido       | Variável |

### 24.8. Migração Futura

O SDK abstrai completamente a infra. Migrar de GitHub para Firebase/Supabase:

```javascript
// Mudar o backend (SDK permanece igual!)
Panda.setBackend("firebase"); // ou "supabase", "pocketbase"

// Código do app NÃO muda
await Panda.Data.save("users", data); // Funciona igual
```

---

> _Panda Fabrics - Arquitetura Refatorada & Econômica 2026_
