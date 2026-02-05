# 🐼 PANDA FACTORY - MASTER REFERENCE

> **Documento Único e Definitivo do Projeto**  
> **Versão:** 10.0.0 | **Data:** 2026-01-25  
> **Status:** ATIVO - Consultar SEMPRE antes de qualquer alteração

---

## 📋 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Repositórios & Links](#2-repositórios--links)
3. [Credenciais & APIs](#3-credenciais--apis)
4. [Arquitetura Técnica](#4-arquitetura-técnica)
5. [SDK Reference](#5-sdk-reference)
6. [Tokenomics](#6-tokenomics)
7. [Convenções & Padrões](#7-convenções--padrões)
8. [Checklist de Desenvolvimento](#8-checklist-de-desenvolvimento)
9. [Changelog](#9-changelog)
10. [Roadmap](#10-roadmap)

---

# 1. VISÃO GERAL

## 1.1 O que é Panda Factory

Sistema operacional para desenvolvedores que permite criar apps, games e negócios sem código, usando IA. Funciona 100% no navegador com backend serverless.

**Slogan:** *"Building the Developer Soil"* 🐼

## 1.2 Stack Principal

| Camada | Tecnologia | Função |
|--------|------------|--------|
| **Frontend** | HTML/CSS/JS + PWA | Interface principal |
| **SDK** | `pf.sdk.js` | Abstração unificada |
| **Backend** | Google Apps Script | Serverless functions |
| **Database** | GitHub JSON + Sheets | Persistência |
| **AI** | Gemini + LocalLLM | Inteligência |
| **Local** | Rust Agent | GPU, MCP, Offline |

## 1.3 Dual Cloud Strategy

```text
┌─────────────────────────────────────────────────────────────────────┐
│                       PANDA FACTORY                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐    ┌──────────────────────┐              │
│  │   MICROSOFT/GitHub   │    │      GOOGLE           │              │
│  │  ├── Hosting (Pages) │    │  ├── AI (Gemini)     │              │
│  │  ├── Database (JSON) │    │  ├── Storage (Drive) │              │
│  │  ├── Compute (Actions)│   │  ├── Sheets (Data)   │              │
│  │  └── CDN (Releases)  │    │  └── GPU (Colab)     │              │
│  └──────────────────────┘    └──────────────────────┘              │
│                                                                     │
│                    ┌───────────────────┐                           │
│                    │   PANDA SDK       │                           │
│                    │   (Abstraction)   │                           │
│                    └───────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 2. REPOSITÓRIOS & LINKS

## 2.1 GitHub Repositories

| Repo | Tipo | URL | Descrição |
|------|------|-----|-----------|
| **SAAS** | 🔒 Privado | `https://github.com/LucassVal/SAAS` | Repo principal |
| **panda-sdk** | 🌐 Público | `https://github.com/LucassVal/panda-sdk` | SDK público |
| **panda-sdk-community** | 🌐 Público | `https://github.com/LucassVal/panda-sdk-community` | Plugins community |

## 2.2 Deploy URLs

| Ambiente | URL |
|----------|-----|
| **GitHub Pages** | `https://lucassval.github.io/SAAS/` |
| **cTrader OAuth** | `https://lucassval.github.io/panda-ctrader-auth/` |

## 2.3 APIs Externas

| Serviço | URL |
|---------|-----|
| **GAS Backend** | Ver seção 3.1 |
| **Cotação USD** | `https://economia.awesomeapi.com.br/last/USD-BRL` |
| **cTrader Demo** | `wss://demo.ctraderapi.com:5036` |
| **cTrader Live** | `wss://live.ctraderapi.com:5036` |

---

# 3. CREDENCIAIS & APIS

> ⚠️ **ATENÇÃO:** Credenciais sensíveis estão no arquivo `.env` (protegido pelo .gitignore)

## 3.1 Localização dos Secrets

| Arquivo | Conteúdo | Status |
|---------|----------|--------|
| `.env` | Todas as secrets ativas | ✅ ATIVO |
| `_archive/legacy/secrets.js` | Backup antigo | 📦 Arquivado |
| `backend/core/PF_Config.gs` | Config GAS | ✅ ATIVO |
| `data/config/panda.json` | Config geral | ✅ ATIVO |

## 3.2 Credenciais Ativas (Referência)

### cTrader Open API (App: Antigravity)
```
CLIENT_ID     : 19151_S6shjal0uQqcSA9jXpwiRO3FUI...
SECRET        : yzRZewNibbm8Bzu9FO7W21lINTq...
REDIRECT_URI  : https://lucassval.github.io/panda-ctrader-auth/
TOKEN_EXPIRES : 2628000 (30 dias)
```

**Contas Disponíveis:**
| ID | Tipo | Status |
|----|------|--------|
| 45208457 | Demo | ✅ Testado |
| 45208965 | Live | Não testado |
| 45208968 | Live | Não testado |

### Google APIs
```
GEMINI_API_KEY : AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw
MAPS_API_KEY   : AIzaSyAih-Jd1LzzUWKvK5dSW6oi0zixmqynil0
```

### Google Apps Script
```
GAS_URL : https://script.google.com/macros/s/AKfycbxPx18ed1gP8cR08dRxEInmVheihSoSkqiucXp2icFmF5dZO_ccM6c3Q6LMvjeE2VcM/exec
```

## 3.3 .gitignore (O que está protegido)

```gitignore
# Secrets
.env
.env.*
**/github_token*
**/ghp_*
secrets/
data/secrets/

# Build
dist/
build/
target/
*.exe

# IDE
.vscode/*
.idea/
```

---

# 4. ARQUITETURA TÉCNICA

## 4.1 Estrutura de Pastas

```
📁 PandaFactory/
├── 📁 .agent/              # Workflows e configs IA
├── 📁 .github/workflows/   # GitHub Actions
│   ├── pages.yml           # Deploy Pages
│   ├── android-build.yml   # Build Android
│   └── steam-build.yml     # Build Steam
├── 📁 backend/             # Google Apps Script
│   ├── core/
│   │   ├── PF_Dispatcher.gs
│   │   ├── PF_Config.gs
│   │   ├── PF_Core_AI.gs
│   │   ├── PF_Core_Oracle.gs
│   │   └── PF_PAT_Core.gs
│   └── domains/
├── 📁 components/          # Componentes HTML
│   ├── Comp_HeaderStatus.html
│   ├── Comp_AppDock.html
│   ├── Comp_SettingsModal.html
│   └── Comp_TreasuryDashboard.html
├── 📁 css/
│   └── pf.theme.css        # Design System
├── 📁 data/                # GitHub JSON Database
│   ├── config/panda.json
│   ├── users/
│   └── projects/
├── 📁 docs/                # Documentação
│   ├── PF_MASTER_ARCHITECTURE.md
│   ├── PF_SDK_REFERENCE.md
│   ├── PF_TOKENOMICS_REFERENCE.md
│   ├── PF_GAS_REFERENCE.md
│   ├── PF_CSS_REFERENCE.md
│   ├── PF_HTML_REFERENCE.md
│   └── PF_PLUGIN_AND_MODULAR_REFERENCE.md
├── 📁 js/
│   ├── pf.sdk.js           # SDK principal
│   ├── pf.bootstrap.js     # Zero-config init
│   ├── core/               # Módulos core
│   └── tentacles/          # Extensions
├── 📁 panda-sdk/           # SDK público
├── 📁 rust-agent/          # Rust MCP Agent
├── 📁 jam/                 # Panda Jam (Vite)
├── .env                    # ⚠️ SECRETS
├── .gitignore              # Proteções
├── index.html              # Entry point
├── manifest.json           # PWA
└── README.md               # Documentação
```

## 4.2 Backend (3 Pilares)

```text
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   🦀 RUST AGENT     │  │   ☁️ FIREBASE       │  │   📜 GOOGLE APPS    │
│   (PC Local)        │  │   (Signaling)       │  │   SCRIPT (Backend)  │
│                     │  │                     │  │                     │
│ • GPU Detection     │  │ • Heartbeat         │  │ • Dados Planilha    │
│ • File System       │  │ • Comandos          │  │ • Wallet/Coins      │
│ • DLL/Exe Install   │  │ • Status Online     │  │ • Auth/Quotas       │
│ • MCP Server        │  │ • Telemetria        │  │ • Dispatcher Core   │
│ • Local AI (LLama)  │  │                     │  │                     │
│ • Polyglot (NLLB)   │  │                     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

# 5. SDK REFERENCE

## 5.1 Módulos Disponíveis

| Módulo | Namespace | Status |
|--------|-----------|--------|
| Auth | `Panda.Auth` | ✅ 100% |
| Data | `Panda.Data` | ✅ 100% |
| Storage | `Panda.Storage` | ✅ 100% |
| Wallet | `Panda.Wallet` | ✅ 100% |
| Brain | `Panda.Brain` | ✅ 100% |
| GPU | `Panda.GPU` | ✅ 100% |
| Bridge | `Panda.Bridge` | ✅ 100% |
| UI | `Panda.UI` | ✅ 100% |
| Polyglot | `Panda.Polyglot` | ✅ 100% |
| Governance | `Panda.Governance` | ✅ 100% |
| PAT | `Panda.PAT` | ✅ 100% |

## 5.2 Tentacles (Extensions)

| Tentáculo | Parent | Children |
|-----------|--------|----------|
| **social** | `Panda.Social` | WhatsApp, Twitter, YouTube, Meta, Telegram, TikTok |
| **trading** | `Panda.Trading` | cTrader |
| **brain** | `Panda.Brain` | Gemini (6 GEMs), GPU, LocalLLM |
| **google** | `Panda.Google` | Drive, Sheets, Colab, Calendar, Docs, Gmail, YouTube |
| **distribution** | `Panda.Dist` | itch.io, PWA, Panda Arcade |

## 5.3 Uso Básico

```javascript
// Inicialização
window.addEventListener("panda:ready", async () => {
  // Auth
  const user = await Panda.Auth.login("email", "password");
  
  // Data
  const clients = await Panda.Data.list("clients");
  await Panda.Data.save("clients", { name: "Novo" });
  
  // AI
  const { text } = await Panda.Brain.Gemini.chat("Olá");
  
  // LocalLLM (grátis!)
  await Panda.Brain.LocalLLM.connect();
  const { response } = await Panda.Brain.LocalLLM.chat("Olá");
});
```

---

# 6. TOKENOMICS

## 6.1 Panda Coin (PC)

| Aspecto | Valor |
|---------|-------|
| **Fórmula Base** | Custo Cloud × 2.5 |
| **1 PC** | ≈ R$ 0,01 |
| **Free Tier** | 100 PC/mês |

## 6.2 Revenue Split (Transações)

| Destino | Store/Compute | P2P Off-chain | P2P On-Chain |
|---------|---------------|---------------|--------------|
| **Dev/Host** | 52% | 95% | 95% |
| **Fundo Incentivo** | 25% | 1% | 1% |
| **Panda Ops** | 15% | 4% | 1% |
| **Founder** | 5% | 0% | 0% |
| **Gateway** | 3% | 0% | 3% |

## 6.3 License Tiers

| Tier | Multiplier | Desconto | Limite |
|------|------------|----------|--------|
| **Founder** | 1.03x | ~59% | 1 |
| **Beta Founder** | 1.25x | 50% | 100 (rotativo) |
| **Standard** | 2.50x | 0% | ∞ |

## 6.4 Treasury Backing

- **PAXG (Ouro):** 70% das reservas
- **USDC (Dólar):** 30% das reservas
- **Snapshots:** Diários na Solana (~$0.30/mês)

---

# 7. CONVENÇÕES & PADRÕES

## 7.1 Nomenclatura de Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| GitHub repos | `pf-` | `pf-sdk` |
| GAS files | `PF_` | `PF_Core_Auth.gs` |
| JS SDK | `pf.*.js` | `pf.sdk.js` |
| Componentes | `Comp_*.html` | `Comp_AppDock.html` |
| Docs | `PF_*_REFERENCE.md` | `PF_SDK_REFERENCE.md` |

## 7.2 Prefixos CSS

```css
/* Componente-específico */
.settings-modal { }
.settings-sidebar { }
.dock-item { }

/* Cores */
--accent-primary: #3b82f6;
--accent-success: #22c55e;
--accent-error: #ef4444;
```

## 7.3 Eventos SDK

```javascript
Panda.on("auth:change", (user) => {});
Panda.on("data:change", (item) => {});
Panda.on("wallet:change", (balance) => {});
Panda.emit("custom:event", data);
```

---

# 8. CHECKLIST DE DESENVOLVIMENTO

## 8.1 Antes de Qualquer Alteração

- [ ] Consultei este documento
- [ ] Verifiquei impacto em dados do usuário
- [ ] Criei backup se necessário
- [ ] Testei localmente

## 8.2 Antes de Commit

- [ ] Código formatado (Prettier)
- [ ] Sem credenciais expostas
- [ ] .gitignore está correto
- [ ] Changelog atualizado

## 8.3 Antes de Deploy

- [ ] Build sem erros
- [ ] GitHub Actions passando
- [ ] Testado em staging

---

# 9. CHANGELOG

## [10.0.0] - 2026-01-25 (Master Consolidation)

- **New:** PANDA_MASTER_REFERENCE.md criado
- **Consolidated:** Todas as docs em um único ponto de referência
- **Updated:** Credenciais e links verificados

## [9.0.0] - 2026-01-25 (GitHub-First + AI Cores)

- **New:** GitHub Tentacle (Pages, JSON DB, Actions)
- **New:** pf.bootstrap.js - Zero-config initialization
- **New:** Brain.Gemini with 6 specialized GEMs
- **New:** Brain.GPU - WebGL/WebGPU detection
- **New:** Brain.LocalLLM - Ollama/LM Studio support
- **New:** PAT.mindMap - Firestore sync
- **New:** Distribution Tentacle (7 hooks)
- **New:** §24 Dual Cloud Strategy documentation
- **Status:** PAT 100%, Brain 100%

## [8.0.0] - 2026-01-24 (Tentacles)

- **New:** Google Tentacle (8 children)
- **New:** Social Hub (7 plugins)
- **New:** cTrader Open API
- **New:** Kill Switch + DRM Token

## [7.0.0] - 2026-01-23

- **New:** Polyglot (200 languages offline)
- **New:** Ed25519 security layer

---

# 10. ROADMAP

## Fase Atual: Beta

| Item | Status |
|------|--------|
| SDK Core | ✅ 100% |
| PAT Treasury | ✅ 100% |
| Brain (AI) | ✅ 100% |
| Social Hub | ✅ 100% |
| Trading Hub | ✅ 100% |
| Distribution | ✅ 90% |

## Próximas Fases

| Fase | Escopo | ETA |
|------|--------|-----|
| **1.0** | PAT + Tokenomics completo | Fev/2026 |
| **1.5** | Panda Jam (Canvas UI) | Mar/2026 |
| **2.0** | Cripto (Solana on-chain) | Abr/2026 |
| **3.0** | Medusa Store | Mai/2026 |

---

## 📌 REGRA DE OURO

> **"Primeiro, não causar dano. Segundo, sempre perguntar. Terceiro, documentar tudo."**

---

**Versão:** 10.0.0  
**Atualizado:** 2026-01-25  
**Autor:** Lucas Valério (Founder)  
**Este documento é a fonte única da verdade.**
