# 🐼 Panda Factory (PF) - Modular Operating System

> **Single Source of Truth** | Versão 4.1.0 | [Repositório Oficial](https://github.com/LucassVal/SAAS)

**Sistema operacional modular para desenvolvedores.** Infraestrutura Google simplificada, IA integrada, marketplace de módulos.

> [!TIP]
> **v4.1.0:** Tokenomics Dinâmico (2.5x), Hosting Distribuído (BYOD) e suporte a VMs Spot.

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
├── 📁 components/ui/             # Componentes Web Globais
├── 📁 js/
│   ├── 📁 kernel/                # Event Bus & Loader
│   └── 📁 ui/                    # Controllers de Interface
└── PandaFactory.html             # Entry Point
```

---

## 📜 Camada SDK (Panda SDK)

O "colchão" que abstrai toda a complexidade.

### Slots Modulares

| Slot      | Default       | Adapters Premium              |
| --------- | ------------- | ----------------------------- |
| **Data**  | Google Sheets | MongoDB, PostgreSQL, Supabase |
| **Brain** | Gemini Flash  | Claude, GPT-4, Llama Local    |
| **GPU**   | Cloud         | CUDA, ROCm, WebGPU            |

### Exemplo de Uso

```javascript
Panda.Data.save('clients', data);
Panda.Brain.chat('Analise isso');
Panda.Bridge.execute('gpu_process', {...});
```

---

## 🦀 Backend Pilar 1: Rust Agent

O motor local que roda no PC do cliente. Obrigatório para Privacy-First.

### Funcionalidades Core & Hosting

| Feature           | Descrição                                        |
| ----------------- | ------------------------------------------------ |
| **MCP Tools**     | fs_read, fs_write, gpu_check, notify, automation |
| **RIG Framework** | Multi-provider (Gemini, Claude, OpenAI)          |
| **BYOD Hosting**  | 🆕 Alugue seu PC ocioso e ganhe Tokens           |
| **Panda VM**      | 🆕 Uso de Google Spot Instances (Custo Baixo)    |

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

### 🏪 Store & Módulos

- **Venda Direta:** Preço fixo.
- **Energy Fee:** Dev ganha % sobre consumo.
- **Hosting Fee:** 🆕 Dev ganha hospedando software em seu Rust Agent.

### 💰 Tokenomics 2.0 & Pricing

O Panda Coin (PC) flutua com base na oferta de hardware, mas nunca cai abaixo do custo.

1.  **Piso Inviolável (2.5x):** Valor mínimo = Custo Energia x 2.5
2.  **Inflação Simulada:** Se faltar GPU, preço sobe. Se sobrar (BYOD), preço cai.
3.  **Crypto Future:** Migração para Solana/Polygon (Roadmap L2).

| Plano        | Preço          | Tokens/mês |
| ------------ | -------------- | ---------- |
| **Free**     | R$ 0           | 100K       |
| **Starter**  | R$ 9,90/mês    | 500K       |
| **Pro**      | R$ 29,90/mês   | 2M         |
| **Lifetime** | R$ 150 (único) | 500K/mês   |

### 🤝 Programa de Afiliados

- **Indicação direta:** 5% sobre vendas do indicado.
- **Perpétuo:** Ganha em TODAS as vendas futuras.

📖 **Detalhes:** [Seção 9 - Ecossistema](docs/PF_MASTER_ARCHITECTURE.md#9-ecossistema-tokenomics--monetização)

---

## 🚀 Roadmap

```text
Semana:  1  2  3  4  5  6  7  8  9  10 11 12
RUST  ═══█══█══█══┐
SDK              └══█══█══█══┐
FACTORY                      └══█══█══█══┐
STORE                                    └══█══█══█
```

---

## 📋 Changelog

### [4.1.0] - 2026-01-21 (Tokenomics Update)

- **Novo:** Tokenomics 2.0 (Piso 2.5x, Inflação Simulada).
- **Novo:** Infraestrutura Híbrida (BYOD Hosting + Google Spot VMs).
- **Refactor:** Diagramas convertidos para ASCII Art.

### [4.0.0] - 2026-01-21

- **Arquitetura:** Documento unificado (~2300 linhas).
- **Rust:** MCP + RIG + Multi-User + Token Meter.
- **Ecossistema:** Store, Planos Híbridos, Split 70/30.

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
