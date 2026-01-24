# 🐼 PANDA FABRICS - Private Dev Repository

![Panda Logo](assets/assets/panda_logo.png)

> **⚠️ DEV ONLY** | Versão 5.0.0 | Repositório Privado de Desenvolvimento

**Repositório interno de desenvolvimento do Panda Factory.** Infraestrutura Google AI Ultra, IA integrada, marketplace de módulos.

> [!TIP]
> **v5.0.0:** Docs reorganizados (PF\_ prefix), AI Cores (PAT + Brain), Dev Mode, Deployment Tiers.

### 🐙 Repositórios GitHub

| Repositório             | Tipo       | URL                                                                      |
| ----------------------- | ---------- | ------------------------------------------------------------------------ |
| **Este repo**           | 🔒 Privado | [SAAS](https://github.com/LucassVal/SAAS)                                |
| **panda-sdk**           | 🌐 Público | [Codespace Ready](https://github.com/LucassVal/panda-sdk)                |
| **panda-sdk-community** | 🌐 Público | [Extensions & Modules](https://github.com/LucassVal/panda-sdk-community) |

---

## 📚 Enciclopédia - Índice Mestre

### Documentação Técnica

| Doc                       | Descrição                         | Link                                                        |
| ------------------------- | --------------------------------- | ----------------------------------------------------------- |
| **📖 Arquitetura Mestre** | Documento completo (~1600 linhas) | [PF_MASTER_ARCHITECTURE.md](docs/PF_MASTER_ARCHITECTURE.md) |
| **📦 SDK Reference**      | API da biblioteca Panda SDK       | [PF_SDK_REFERENCE.md](docs/PF_SDK_REFERENCE.md)             |
| **🎨 CSS Reference**      | Design System                     | [PF_CSS_REFERENCE.md](docs/PF_CSS_REFERENCE.md)             |
| **🏠 HTML Reference**     | Arquitetura de Componentes        | [PF_HTML_REFERENCE.md](docs/PF_HTML_REFERENCE.md)           |
| **🐼 PANDA.md**           | Codex Central (AI Agent)          | [.agent/PANDA.md](.agent/PANDA.md)                          |

### Navegação Rápida (Hierarquia Visual)

| Camada              | Conteúdo                    | Ir para                                         |
| ------------------- | --------------------------- | ----------------------------------------------- |
| 🎯 **Visão Geral**  | O que é o Panda Factory     | [#visão-geral](#-visão-geral)                   |
| 🚀 **Quick Start**  | Instalação e Setup          | [#quick-start](#-quick-start)                   |
| 🎨 **Frontend**     | UI, Docks e Layout          | [#frontend](#-camada-frontend)                  |
| 📜 **SDK**          | Abstração e Slots           | [#panda-sdk](#-camada-sdk-panda-sdk)            |
| 🦀 **Backend Rust** | Agent, MCP, GPU, Onboarding | [#rust-agent](#-backend-pilar-1-rust-agent)     |
| 🔥 **Backend Fire** | Colmeia, Signaling          | [#firebase](#-backend-pilar-2-firebase-colmeia) |
| 📜 **Backend GAS**  | Serverless, DDD             | [#gas-backend](#-backend-pilar-3-gas-backend)   |
| 🌍 **Ecossistema**  | Tokenomics, Hosting, Store  | [#ecossistema](#-ecossistema-de-negócio)        |
| 🚀 **Roadmap**      | Cronograma de 12 semanas    | [#roadmap](#-roadmap)                           |
| 📋 **Changelog**    | Histórico de Versões        | [#changelog](#-changelog)                       |

---

## 🎯 Visão Geral

**Missão:** Democratizar infraestrutura Google para desenvolvedores.

```text
┌─────────────────────────────────────────────────────────────┐
│                    PANDA FACTORY                            │
├─────────────────────────────────────────────────────────────┤
│  🖥️ BROWSER                  🦀 RUST AGENT                  │
│  ├── Panda UI                ├── 🧠 RIG (Cérebro IA)        │
│  ├── Módulos                 ├── BYOD Hosting (Novo)        │
│  └── SDK JavaScript          ├── MCP Server                 │
│           │                  ├── GPU Detection              │
│           │                  └── Multi-User                 │
└───────────┼──────────────────┴──────────────────────────────┘
            │
   ┌────────▼────────┐
   │   PANDA SDK     │  ← Tradutor Universal
   └────────┬────────┘
            │
     ┌──────┴──────┐
     ▼             ▼
 ┌───────┐    ┌───────┐
 │ GAS   │    │Firebase│
 │Backend│    │Signaling│
 └───────┘    └───────┘
```

📖 **Detalhes:** [Seção 1 - Arquitetura](docs/PF_MASTER_ARCHITECTURE.md#1-visão-geral)

---

## 🚀 Quick Start

### 1. Instalação do Agente (Local)

O Panda Agent é necessário para funcionalidades de GPU e Filesystem.

```bash
# Baixar binário oficial
curl -sL https://panda.dev/install | bash

# Verificar conexão
panda doctor
```

### 2. Project Setup (Dev)

```bash
# Clonar Template
git clone https://github.com/pandafabrics/pf-base-template my-app
cd my-app
npm install
npm run dev
```

---

## 🎨 Camada Frontend

A interface do usuário do Panda OS, focada em "Docks" e modularidade.

### 📁 Estrutura de Pastas Client

```text
📁 PandaFactory/
├── PandaFactory.html               # 🚀 Entry Point
├── 📁 css/
│   └── pf.theme.css                # 🎨 Unified Design Tokens (1500+ lines)
├── 📁 js/
│   ├── pf.sdk.js                   # 🐼 SDK Mock v0.7.0 (Panda.*)
│   ├── 📁 core/
│   │   ├── pf.ai-core.js           # PAT (Panda AI Treasury)
│   │   └── pf.firebase-bridge.js   # Firebase Signaling
│   ├── 📁 ui/
│   │   ├── pf.omnibar.js           # Search, Chat, Commands
│   │   ├── pf.settings.js          # Modal configurações
│   │   ├── pf.dock-drag.js         # Drag & Drop + Persist
│   │   ├── pf.modal-pin.js         # Pin/Pop-out modais
│   │   └── pf.devtools.js          # DevTools dock
│   ├── 📁 kernel/
│   │   ├── pf.loader.js            # ModuleLoader class
│   │   └── pf.components.js        # Component fetcher
│   └── 📁 features/
│       └── AiAssistant.js          # Chat flutuante legado
├── 📁 components/
│   ├── Comp_HeaderStatus.html      # Header com status
│   ├── Comp_AppDock.html           # Dock principal
│   ├── Comp_DevToolsDock.html      # Dock desenvolvedor
│   ├── Comp_SettingsModal.html     # Modal config
│   └── 📁 ui/                      # Subcomponentes
├── 📁 backend/                     # GAS Backend (DDD)
│   ├── 📁 core/                    # PF_Dispatcher.gs, PF_Config.gs
│   └── 📁 domains/                 # finance/, store/, automation/
├── 📁 docs/
│   ├── PF_MASTER_ARCHITECTURE.md   # Arquitetura (1100+ lines)
│   └── SDK_REFERENCE.md            # Referência SDK
└── 📁 .agent/
    └── PANDA.md                    # 📖 CODEX CENTRAL (AI Context)
```

---

## 📜 Camada SDK (Panda SDK)

O "colchão" que abstrai toda a complexidade.

### Slots Modulares

| Slot      | Default          | Adapters Premium                |
| --------- | ---------------- | ------------------------------- |
| **Data**  | Google Sheets    | MongoDB, PostgreSQL, Supabase   |
| **Brain** | Gemini 3 Pro     | Claude 4.5, GPT-4o, Llama Local |
| **GPU**   | Cloud            | CUDA, ROCm, WebGPU              |
| **Video** | Veo 3 (AI Ultra) | Flow, Whisk Animate             |

### Exemplo de Uso

```javascript
Panda.Data.save('clients', data);
Panda.Brain.chat('Analise isso');
Panda.Bridge.execute('gpu_process', {...});
Panda.Auth.signCommand(payload); // Ed25519 Signature (Founder Only)
```

---

## 🤖 Google AI Ultra Infrastructure

> **Plano Ativo:** Google AI Ultra - Limites máximos e acesso prioritário.

### Ferramentas Disponíveis

| Tool              | Descrição                                     | Status   |
| ----------------- | --------------------------------------------- | -------- |
| **Antigravity**   | Plataforma de agentes com Gemini 3 Pro        | ✅ Ativo |
| **Jules**         | Agente de código com Gemini 2.5 Pro + GitHub  | ✅ Ativo |
| **Gemini CLI**    | Agente terminal para qualquer workflow        | ✅ Ativo |
| **Code Assist**   | IA no VS Code/JetBrains                       | ✅ Ativo |
| **Deep Research** | Pesquisa aprofundada com relatórios completos | ✅ Ativo |
| **Deep Search**   | Pesquisa web com Gemini 3 Pro (Modo IA)       | ✅ Ativo |
| **Flow**          | Produção de vídeo com Veo 3, Imagen, Gemini   | ✅ Ativo |
| **Whisk**         | Ideação visual + Whisk Animate (Veo 3)        | ✅ Ativo |
| **NotebookLM**    | Assistente de pesquisa (600 fontes, Audio)    | ✅ Ativo |

### Modelos Disponíveis (Model Garden)

| Modelo                | Provider  | Limites AI Ultra   |
| --------------------- | --------- | ------------------ |
| **Gemini 3 Pro**      | Google    | Máximo (reset 5h)  |
| **Gemini 2.5 Pro**    | Google    | Máximo             |
| **Claude 4.5 Sonnet** | Anthropic | Via Vertex AI      |
| **gpt-oss-120b**      | OpenAI    | Via Vertex AI      |
| **Veo 3**             | DeepMind  | Flow/Whisk (1080p) |

---

## 🦀 Backend Pilar 1: Rust Agent

O motor local que roda no PC do cliente. Obrigatório para Privacy-First.

### Funcionalidades Core & Hosting

| Feature           | Descrição                                        |
| ----------------- | ------------------------------------------------ |
| **MCP Tools**     | fs_read, fs_write, gpu_check, notify, automation |
| **RIG Framework** | Multi-provider (Gemini, Claude, OpenAI)          |
| **Panda Swarm**   | 🆕 Google-Managed Edge (Data → BigQuery)         |
| **Ghost Fleet**   | 🆕 Spot VMs + Safety Net Protocol                |
| **Edge IPs**      | 🆕 Residencial Mesh (anti-ban, upsell to Cloud)  |

### 🤖 Automação & Bot Services

| Capability         | Uso                                  |
| ------------------ | ------------------------------------ |
| **IP Rotation**    | Proxy Pool, WireGuard VPN (Anti-ban) |
| **Fingerprinting** | Multi-account isolado                |
| **Overlay HUD**    | Dashboard transparente sobre games   |

### 🚀 Fluxo de Detecção GPU (ASCII)

```text
[Site] → {Agent?} → Sim → {GPU?} → Sim (NVIDIA) → [LOCAL MODE 0 PC]
             ↓               ↓
             Não             Não → [CLOUD MODE 30 PC]
```

📖 **Detalhes:** [Seção 4 - Rust Agent](docs/PF_MASTER_ARCHITECTURE.md#4-backend-pilar-1-rust-agent-hardware)

---

## 🔥 Backend Pilar 2: Firebase Colmeia

Arquitetura "Colmeia" com células isoladas. Usado apenas para **Signaling**.

```json
{
  "pf_cells": {
    "user_001": { "profile": {}, "usage": {}, "data": {} }
  }
}
```

---

## 📜 Backend Pilar 3: GAS Backend

Backend serverless usando Google Apps Script.

### Estrutura de Pastas DDD

```text
📁 backend/                   # Google Apps Script (DDD)
├── 📁 core/                  # Dispatcher & Config
└── 📁 domains/               # "Chapéus" de Negócio
    ├── 📁 finance/           # Wallet, Fiat, Crypto
    ├── 📁 store/             # Registry, Sales
    └── 📁 automation/        # Bots, Farms
```

---

## 🌍 Ecossistema de Negócio

### 💰 Tokenomics & Split

| Destino             | %   | Descrição            |
| ------------------- | --- | -------------------- |
| **Dev/Host**        | 55% | Quem cria valor      |
| **Fundo Incentivo** | 22% | Subsídios, Bootcamps |
| **Panda Ops**       | 15% | Mantém plataforma    |
| **Founder**         | 5%  | Royalty eterno       |
| **Gateway**         | 3%  | Stripe/Blockchain    |

### 🏛️ Governança em 4 Camadas

1. **Hardcode:** Teto Inflação 5%, Panda Labs (25% Fundo), Reserva Ops (20%).
2. **DAO:** Política flutuante (Splits, Parcerias).
3. **Panda AI (PAT):** Banco Central (Ajustes finos).
4. **Mercado Único:** Descontos progressivos (0-50%).

> 💡 **Pisos Dinâmicos:** Split ajusta por tier (Bootstrap → Growth → Mature)

### 📦 Planos

| Plano        | Preço    | Tokens/mês |
| ------------ | -------- | ---------- |
| **Free**     | R$ 0     | 100K       |
| **Starter**  | R$ 9,90  | 500K       |
| **Pro**      | R$ 29,90 | 2M         |
| **Lifetime** | R$ 150   | 500K/mês   |

📖 **Detalhes:** [Seção 9 - Ecossistema](docs/PF_MASTER_ARCHITECTURE.md#9-ecossistema-tokenomics--monetização)

### 💳 Integrações de Pagamento

- **Fiduciário:** Stripe, PagSeguro e Pix Nativo.
- **Webhooks:** Conexão nativa com Kiwify e Hotmart para entrega automática (Infoprodutos).
- **Afiliados:** Tracking `?ref=` nativo para distribuição com comissão automática.

---

## 🚀 Roadmap

```text
Semana:  1  2  3  4  5  6  7  8  9  10 11 12
SDK Mock ════✅ (DONE)
UI/UX       └══█══█══┐ (IN PROGRESS)
Backend            └══█══█══█══┐
Store                          └══█══█══█
```

| Fase     | Status         | Milestone          |
| -------- | -------------- | ------------------ |
| SDK Mock | ✅ Done        | `pf.sdk.js` + docs |
| UI/UX    | 🚧 In Progress | 10 alpha testers   |
| Backend  | ⏳ Planned     | 50 closed beta     |
| Store    | ⏳ Planned     | 100 paying users   |

---

## 📋 Changelog

### [8.0.0] - 2026-01-23 (Polyglot & Treasury)

- **Novo:** Módulo `Panda.Polyglot` - Tradução offline (200 idiomas via NLLB-200)
- **Novo:** Seção Translation no Settings Modal (11 seções agora)
- **Novo:** Treasury Backing (PAXG 70%, USDC 30%, snapshots diários)
- **Novo:** Health Score widget no Header
- **Novo:** Download progressivo do Rust Agent (~850MB total)
- **Docs:** `PF_HTML_REFERENCE.md` - Arquitetura de componentes
- **Docs:** Polyglot, Treasury, Whisper documentados em todos os arquivos

### [7.0.0] - 2026-01-22 (Google AI Ultra + Ed25519 Security)

- **Infraestrutura:** Upgrade para **Google AI Ultra** (Gemini 3 Pro, Veo 3)
- **Ferramentas:** Integração com Antigravity, Jules, Gemini CLI, Flow, Whisk, NotebookLM
- **Segurança:** Ed25519 Digital Signature Layer (Founder Authentication)
- **SDK:** `Panda.Auth.signCommand()` - Assinatura criptográfica de comandos
- **SDK:** `Panda.Crypto` module (TweetNaCl.js integration) - PRONTO (não ativo)
- **Docs:** Arquitetura de segurança documentada em PF_MASTER_ARCHITECTURE.md

### [6.0.0] - 2026-01-22 (Governance Kernel + Constituição)

- **Novo:** Módulo `Panda.Governance` - 12 Artigos Hardcoded
- **Novo:** Módulo `Panda.PAT` - Banco Central IA (reinvest/burn/accelerate)
- **Novo:** Validação de ações contra Constituição (`validate()`)
- **Docs:** SDK_REFERENCE.md atualizado com Governance/PAT

### [5.0.0] - 2026-01-22 (Tokenomics Redesign)

- **Novo:** Split 55/22/15/5/3 (Dev/Fundo/Ops/Founder/Gateway)
- **Novo:** Sistema de Redistribuição Dinâmica (Pisos por Tier)
- **Novo:** Panda AI Treasury (PAT) - IA gestora de incentivos
- **Novo:** Modelo Satoshi de Governança (Founder 5% eterno)
- **Roadmap:** SDK Mock ✅ concluído

### [4.1.0] - 2026-01-21

- **Novo:** Tokenomics 2.0, Infraestrutura Híbrida (Swarm + Spot VMs)

### [3.0.0] - 2026-01-20

- **System:** Rename para Panda Factory.
- **Kernel:** Module Loader Isolado.
- **Store:** Integração Marketplace.

### [2.4.0] - 2026-01-20

- **UI:** Premium Header (Glassmorphism), Omni Search.

---

## 🔗 Links Úteis

| Recurso                | Link                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| **Arquitetura Mestre** | [docs/PF_MASTER_ARCHITECTURE.md](docs/PF_MASTER_ARCHITECTURE.md) |
| **Repositório GitHub** | [github.com/LucassVal/SAAS](https://github.com/LucassVal/SAAS)   |

---

## 🏷️ Convenção PF

| Contexto     | Prefixo  | Exemplo              |
| ------------ | -------- | -------------------- |
| Repos GitHub | `pf-`    | `pf-sdk`, `pf-agent` |
| Arquivos GAS | `PF_`    | `PF_Core_Auth.gs`    |
| API Pública  | `Panda.` | `Panda.Data`         |

---

© 2026 Panda Fabrics (PF) - **Building the Developer Soil.**
