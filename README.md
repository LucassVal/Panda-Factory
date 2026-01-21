# 🐼 Panda Factory (PF) - Modular Operating System

> **Single Source of Truth** | Versão 4.0.0 | [Repositório Oficial](https://github.com/LucassVal/SAAS)

**Sistema operacional modular para desenvolvedores.** Infraestrutura Google simplificada, IA integrada, marketplace de módulos.

> [!TIP]
> **v4.0.0:** Arquitetura PF completa, Rust Agent MCP+RIG, Multi-User, Token Billing. [Ver Changelog](#-changelog)

---

## 📚 Enciclopédia - Índice Mestre

### Documentação Técnica

| Doc                       | Descrição                         | Link                                                        |
| ------------------------- | --------------------------------- | ----------------------------------------------------------- |
| **📖 Arquitetura Mestre** | Documento completo (~2300 linhas) | [PF_MASTER_ARCHITECTURE.md](docs/PF_MASTER_ARCHITECTURE.md) |

### Navegação Rápida (Hierarquia Visual)

| Camada              | Conteúdo                    | Ir para                                         |
| ------------------- | --------------------------- | ----------------------------------------------- |
| 🎯 **Visão Geral**  | O que é o Panda Factory     | [#visão-geral](#-visão-geral)                   |
| 🎨 **Frontend**     | UI, Docks e Layout          | [#frontend](#-camada-frontend)                  |
| 📜 **SDK**          | Abstração e Slots           | [#panda-sdk](#-camada-sdk-panda-sdk)            |
| 🦀 **Backend Rust** | Agent, MCP, GPU, Onboarding | [#rust-agent](#-backend-pilar-1-rust-agent)     |
| 🔥 **Backend Fire** | Colmeia, Signaling          | [#firebase](#-backend-pilar-2-firebase-colmeia) |
| 📜 **Backend GAS**  | Serverless, DDD             | [#gas-backend](#-backend-pilar-3-gas-backend)   |
| 🌍 **Ecossistema**  | Store, Coin, Afiliados      | [#ecossistema](#-ecossistema-de-negócio)        |
| 🚀 **Roadmap**      | Cronograma de 12 semanas    | [#roadmap](#-roadmap)                           |

---

## 🎯 Visão Geral

**Missão:** Democratizar infraestrutura Google para desenvolvedores.

> "Ganhamos na quantidade. Ajudamos os pequenos a crescerem."

**Proposta de valor:** GAS e Firebase são gratuitos/baratos. Repassamos a economia e cobramos pela **inteligência e conveniência** (SDK + Agent).

```text
┌─────────────────────────────────────────────────────────────┐
│                    PANDA FACTORY                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🖥️ BROWSER                  🦀 RUST AGENT                  │
│  ├── Panda UI                ├── 🧠 RIG (Cérebro IA)        │
│  ├── Módulos                 ├── Cache Manager              │
│  └── SDK JavaScript          ├── MCP Server                 │
│           │                  ├── GPU Detection              │
│           │                  └── Multi-User                 │
│           │                         │                       │
│           └────────┬────────────────┘                       │
│                    │                                        │
│           ┌────────▼────────┐                               │
│           │   PANDA SDK     │  ← Tradutor Universal         │
│           └────────┬────────┘                               │
│                    │                                        │
│      ┌─────────────┼─────────────┐                          │
│      ▼             ▼             ▼                          │
│  ┌───────┐    ┌───────┐    ┌───────┐                       │
│  │ GAS   │    │Firebase│    │ APIs  │                       │
│  │Backend│    │Signaling│   │Externas│                      │
│  └───────┘    └───────┘    └───────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

⭐ Rust é INFRAESTRUTURA (Cache, GPU, MCP) + CÉREBRO (RIG Multi-Provider)
```

📖 **Detalhes:** [Seção 1 - Arquitetura](docs/PF_MASTER_ARCHITECTURE.md#1-visão-geral)

---

## 🎨 Camada Frontend

A interface do usuário do Panda OS, focada em "Docks" e modularidade.

### 🏗️ Arquitetura Web

| Centralizado (Panda) | Descentralizado (Cliente) |
| -------------------- | ------------------------- |
| HTML/Updates         | GAS Backend               |
| Panda Coins (Ledger) | Drive Storage             |
| Store/Registry       | Processamento             |

### 📁 Estrutura de Pastas Client

```text
📁 PandaFactory/
├── 📁 components/ui/             # Componentes Web Globais
├── 📁 js/
│   ├── 📁 kernel/                # Event Bus & Loader
│   └── 📁 ui/                    # Controllers de Interface
└── PandaFactory.html             # Entry Point
```

---

## 📜 Camada SDK (Panda SDK)

O "colchão" que abstrai toda a complexidade e conecta o Frontend aos Backends (Rust, GAS, APIs).

### Slots Modulares

| Slot        | Default       | Adapters Premium              |
| ----------- | ------------- | ----------------------------- |
| **Data**    | Google Sheets | MongoDB, PostgreSQL, Supabase |
| **Brain**   | Gemini Flash  | Claude, GPT-4, Llama Local    |
| **GPU**     | Cloud         | CUDA, ROCm, WebGPU            |
| **Render**  | -             | Three.js, Babylon, PixiJS     |
| **Network** | Fetch         | Proxy Pool, VPN               |

### Exemplo de Uso

```javascript
// Simples assim:
Panda.Data.save('clients', data);
Panda.Brain.chat('Analise isso');
Panda.Bridge.execute('gpu_process', {...});
```

📖 **Detalhes:** [Seção 3 - SDK](docs/PF_MASTER_ARCHITECTURE.md#3-camada-de-abstração-panda-sdk)

---

## 🦀 Backend Pilar 1: Rust Agent

O motor local que roda no PC do cliente. Obrigatório para Privacy-First.

### Funcionalidades Core

| Feature           | Descrição                                        |
| ----------------- | ------------------------------------------------ |
| **MCP Tools**     | fs_read, fs_write, gpu_check, notify, automation |
| **RIG Framework** | Multi-provider (Gemini, Claude, OpenAI)          |
| **Token Meter**   | Contagem e billing por provider                  |
| **Multi-User**    | Sessões isoladas por usuário                     |
| **Self-Update**   | Atualização automática                           |
| **GPU Detection** | NVIDIA CUDA, AMD ROCm, Intel, Apple Metal        |

### 🚀 Onboarding (The Gate)

```text
1. Cadastro Web → 2. The Gate → 3. Download → 4. Desbloqueio
```

> **Sem trial.** O Agent é o coração do sistema (Open Source e Auditável).

### 🤖 Automação & Bot Services

100% **client-side** - Panda não vê o que você faz.

| Capability         | Uso                                  |
| ------------------ | ------------------------------------ |
| **IP Rotation**    | Proxy Pool, WireGuard VPN (Anti-ban) |
| **Fingerprinting** | Multi-account isolado                |
| **Overlay HUD**    | Dashboard transparente sobre games   |
| **Automation**     | Mouse, Keyboard, OCR                 |

### 🔐 Open Core (GitHub Strategy)

| Aspecto          | Detalhe                              |
| ---------------- | ------------------------------------ |
| **Repo Público** | `panda-core` - Código auditável      |
| **Repo Privado** | `panda-proprietary` - Lógica secreta |
| **Fork**         | Build não-oficial = Não inicia       |

📖 **Detalhes:** [Seção 4 - Rust Agent](docs/PF_MASTER_ARCHITECTURE.md#4-backend-pilar-1-rust-agent-hardware)

---

## 🔥 Backend Pilar 2: Firebase Colmeia

Arquitetura "Colmeia" com células isoladas. Usado apenas para **Signaling** (Sinalização em Tempo Real).

### Estrutura

```json
{
  "pf_core": { "version": "1.0.0", "status": "ONLINE" },
  "pf_cells": {
    "user_001": { "profile": {}, "usage": {}, "data": {} },
    "user_002": { "profile": {}, "usage": {}, "data": {} }
  }
}
```

📖 **Detalhes:** [Seção 5 - Firebase](docs/PF_MASTER_ARCHITECTURE.md#5-backend-pilar-2-firebase-colmeia-signaling)

---

## 📜 Backend Pilar 3: GAS Backend

Backend serverless usando Google Apps Script. Cérebro Lógico e Persistência.

### Estrutura de Pastas DDD

```text
📁 backend/                   # Google Apps Script (DDD)
├── 📁 core/                  # Dispatcher & Config
└── 📁 domains/               # "Chapéus" de Negócio
    ├── 📁 finance/           # Wallet, Fiat, Crypto
    ├── 📁 store/             # Registry, Sales
    └── 📁 automation/        # Bots, Farms
```

### Multi-Tenant (Ghost Cells)

> **Definição:** Planilhas onde o cliente vê apenas seus dados, mas o sistema vê todos (Ghost Cells).

📖 **Detalhes:** [Seção 6 - GAS](docs/PF_MASTER_ARCHITECTURE.md#6-backend-pilar-3-gas-backend-serverless)

---

## 🌍 Ecossistema de Negócio

### 🏪 Store & Módulos

Marketplace onde devs publicam módulos.

- **Venda Direta:** Preço fixo (Panda Coins).
- **Energy Fee:** Dev ganha % sobre consumo de API (Renda Passiva).
- **Bundle Externo:** Integração Hotmart/Kiwify.

### 💰 Economia & Pricing

| Plano        | Preço          | Tokens/mês |
| ------------ | -------------- | ---------- |
| **Free**     | R$ 0           | 100K       |
| **Starter**  | R$ 9,90/mês    | 500K       |
| **Pro**      | R$ 29,90/mês   | 2M         |
| **Lifetime** | R$ 150 (único) | 500K/mês   |

### 🤝 Programa de Afiliados

- **Indicação direta:** 5% sobre vendas do indicado.
- **Perpétuo:** Ganha em TODAS as vendas futuras.

📖 **Detalhes:** [Seção 8 - Ecossistema](docs/PF_MASTER_ARCHITECTURE.md#8-ecossistema-store-monetização--comunidade)

---

## 🚀 Roadmap

### 12 Semanas para v1.0

```text
Semana:  1  2  3  4  5  6  7  8  9  10 11 12
RUST  ═══█══█══█══┐
SDK              └══█══█══█══┐
FACTORY                      └══█══█══█══┐
STORE                                    └══█══█══█
```

1. **Rust Agent** (Infra base)
2. **PF-SDK** (Abstração)
3. **PF-Factory** (UI/Modules)
4. **PF-Store** (Vendas)

📖 **Detalhes:** [Seção 9 - Roadmap](docs/PF_MASTER_ARCHITECTURE.md#9-roadmap-de-implementação)

---

## 🏷️ Convenção PF

Prefixos padronizados em todo o ecossistema.

| Contexto      | Prefixo  | Exemplo              |
| ------------- | -------- | -------------------- |
| Repos GitHub  | `pf-`    | `pf-sdk`, `pf-agent` |
| Arquivos JS   | `pf.`    | `pf.core.js`         |
| Arquivos GAS  | `PF_`    | `PF_Core_Auth.gs`    |
| CSS Variables | `--pf-`  | `--pf-primary`       |
| API Pública   | `Panda.` | `Panda.Data`         |

---

## 📋 Changelog

### [4.0.0] - 2026-01-21

#### 🚀 Arquitetura Completa

- **PF_MASTER_ARCHITECTURE.md**: Documento unificado (~2300 linhas)
- **Rust Agent Deep Dive**: MCP + RIG + Multi-User + Token Meter
- **Firebase Colmeia**: Arquitetura de células isoladas
- **SDK Modular**: Sistema de slots e adapters
- **Economia Completa**: Planos, tokens, billing

#### 🏷️ Convenção PF

- Prefixos padronizados (`pf-`, `PF_`, `--pf-`, `Panda.`)
- Estrutura de pastas documentada
- Naming conventions para código

#### 📊 Pricing

- Modelo híbrido: 100K grátis + planos
- Lifetime R$ 150
- Dev Split 70/30

---

### [3.0.0] - 2026-01-20

#### 🚀 Novo

- **Panda Factory**: Rename de "CRM" para sistema modular
- **Kernel Isolado**: `js/panda.core.js`
- **Module Loader**: Sistema dinâmico
- **Store Module**: Marketplace integrado

---

### [2.4.0] - 2026-01-20

#### 🎨 Adicionado

- Premium Header (Glassmorphism)
- Omni Search Bar integrada
- Gradient Background Radial

---

## 🔗 Links Úteis

| Recurso                  | Link                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| **Arquitetura Completa** | [docs/PF_MASTER_ARCHITECTURE.md](docs/PF_MASTER_ARCHITECTURE.md) |
| **Repositório GitHub**   | [github.com/LucassVal/SAAS](https://github.com/LucassVal/SAAS)   |

---

© 2026 Panda Fabrics (PF) - **Building the Developer Soil.**
