# 🌐 PF_P2P_REFERENCE - Rede de Compute Distribuído

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-05
> **Cross-Ref:** [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) | [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Node Tiers](#2-node-tiers)
3. [Recursos Locáveis](#3-recursos-locáveis)
4. [Mineração & Rewards](#4-mineração--rewards)
5. [Task Fractionation Standard](#5-task-fractionation-standard)
6. [Fundo de Incentivo](#6-fundo-de-incentivo)
7. [Split de Receita](#7-split-de-receita)
8. [Segurança & Penalidades](#8-segurança--penalidades)
9. [Implementação](#9-implementação)

---

## 1. Visão Geral

O **P2P Compute Network** permite que usuários:

- 🖥️ **Locem poder computacional** (CPU/GPU/RAM/Storage)
- ⛏️ **Minerem Panda Coins** proporcionalmente à contribuição
- 💰 **Recebam 95%** da receita gerada pelo seu nó

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    P2P COMPUTE NETWORK                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   [Node A]──┐                                                       │
│   [Node B]──┼──▶ [Task Scheduler] ──▶ [Job Queue] ──▶ [Results]    │
│   [Node C]──┘         │                                             │
│                       ▼                                             │
│              [Reward Distributor]                                   │
│                       │                                             │
│        ┌──────────────┼──────────────┐                             │
│        ▼              ▼              ▼                             │
│   [Node Wallet]  [Panda Ops]   [Fundo Incentivo]                   │
│      95%            4%              1%                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Node Tiers

### Tabela de Tiers

| Tier | Nome       | RAM Min | Cores Min | GPU          | Multiplier | Prioridade  |
| ---- | ---------- | ------- | --------- | ------------ | ---------- | ----------- |
| 🌱 1 | **Seed**   | 4 GB    | 2         | ❌           | 1.0x       | Baixa       |
| 🌿 2 | **Sprout** | 8 GB    | 4         | ❌           | 1.5x       | Normal      |
| 🌳 3 | **Tree**   | 16 GB   | 8         | ✅ Qualquer  | 2.5x       | Alta        |
| 🌲 4 | **Forest** | 32 GB   | 12        | ✅ RTX 30+   | 4.0x       | Prioritária |
| 🏔️ 5 | **Titan**  | 64 GB+  | 16+       | ✅ Multi-GPU | 8.0x       | Enterprise  |

### Benefícios por Tier

```text
Seed    → Tarefas básicas, sem GPU, queue normal
Sprout  → +50% rewards, tarefas médias
Tree    → GPU tasks, +150% rewards, queue prioritária
Forest  → Enterprise ready, SLA 99.9%, +300% rewards
Titan   → AI training, rendering, +700% rewards
```

### Requisitos de Uptime

| Tier   | Uptime Mínimo | Penalidade por Downtime |
| ------ | ------------- | ----------------------- |
| Seed   | 90%           | -10% rewards/mês        |
| Sprout | 95%           | -15% rewards/mês        |
| Tree+  | 99%           | -20% rewards/mês        |

---

## 3. Recursos Locáveis

### Preços Base

| Recurso       | Unidade        | Preço Base | Exemplo               |
| ------------- | -------------- | ---------- | --------------------- |
| **CPU**       | vCore/hora     | 0.5 PC     | 8 cores × 24h = 96 PC |
| **GPU**       | TFLOPS/hora    | 5 PC       | RTX 4090 × 1h = 82 PC |
| **RAM**       | GB/hora        | 0.1 PC     | 32 GB × 24h = 76.8 PC |
| **Storage**   | GB/mês         | 0.05 PC    | 1 TB = 50 PC/mês      |
| **Bandwidth** | GB transferido | 0.02 PC    | 100 GB = 2 PC         |

### GPU Reference

| GPU      | TFLOPS | PC/hora |
| -------- | ------ | ------- |
| GTX 1660 | 5.0    | 25 PC   |
| RTX 3060 | 12.7   | 64 PC   |
| RTX 3090 | 35.6   | 178 PC  |
| RTX 4090 | 82.6   | 413 PC  |

---

## 4. Mineração & Rewards

### Como Funciona

1. **Registro do Nó** → Benchmark automático determina tier
2. **Heartbeat** → Nó reporta disponibilidade a cada 60s
3. **Job Assignment** → Scheduler distribui tasks por tier
4. **Execução** → Nó processa e retorna resultado
5. **Verificação** → Hash do resultado é validado
6. **Reward** → PC creditado proporcionalmente

### Fórmula de Reward

```javascript
reward = (basePrice × resourceUsage × tierMultiplier × uptimeBonus)

// Exemplo: Tree node, 8 cores, 24h, 99.5% uptime
reward = (0.5 × 8 × 24 × 2.5 × 1.01) = 242.4 PC/dia
```

### Mining Phases

| Fase          | Período  | Característica                |
| ------------- | -------- | ----------------------------- |
| **Bootstrap** | Mês 1-3  | Rewards 2x (incentivo)        |
| **Growth**    | Mês 4-12 | Rewards normais               |
| **Mature**    | Mês 13+  | Supply limitado, demand-based |

---

## 5. Task Fractionation Standard

> ⚠️ **OBRIGATÓRIO:** Todas as tarefas DEVEM ser fracionadas conforme este padrão.

### Padrão de Fracionamento

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    TASK FRACTIONATION STANDARD                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   [Big Task] ──▶ [Splitter] ──▶ [Chunk 1] ──┐                       │
│                              ──▶ [Chunk 2] ──┼──▶ [Aggregator] ──▶ ✅│
│                              ──▶ [Chunk N] ──┘                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Interface de Task

```typescript
interface PandaTask {
  id: string;              // UUID único
  type: TaskType;          // CPU | GPU | STORAGE | MIXED
  priority: 1-5;           // 1=baixa, 5=crítica

  // Fracionamento
  splittable: boolean;     // Pode dividir?
  minChunkSize: number;    // Bytes mínimos por chunk
  maxChunks: number;       // Máximo de partes

  // Recursos
  estimatedCores: number;
  estimatedRamGB: number;
  estimatedGPU: boolean;
  estimatedDurationSec: number;

  // Payload
  input: TaskInput;
  outputSchema: OutputSchema;
}

interface TaskChunk {
  taskId: string;
  chunkIndex: number;
  totalChunks: number;
  payload: Buffer;
  deadline: Date;
}
```

### Tipos de Task Padrão

| Tipo             | Chunk Pattern       | Agregação        |
| ---------------- | ------------------- | ---------------- |
| **AI_INFERENCE** | Por batch de tokens | Concatenação     |
| **IMAGE_RENDER** | Por tile/região     | Composição       |
| **VIDEO_ENCODE** | Por frame range     | Sequenciamento   |
| **DATA_PROCESS** | Por row range       | Merge            |
| **TRAINING**     | Por epoch/batch     | Checkpoint merge |

### Exemplo: AI Inference

```javascript
// Task original: 10000 tokens
const task = {
  type: "AI_INFERENCE",
  input: { prompt: "...", maxTokens: 10000 },
  splittable: true,
  minChunkSize: 500, // 500 tokens mínimo
  maxChunks: 20, // Máximo 20 nós
};

// Fracionado em 10 chunks de 1000 tokens
// Cada nó processa 1000 tokens
// Aggregator monta resposta final
```

---

## 6. Fundo de Incentivo

### Propósito

O **Fundo de Incentivo (1%)** serve para:

1. 🎁 **Bootstrap rewards** - 2x durante primeiros 3 meses
2. 🏆 **Loyalty bonuses** - Nós com >6 meses
3. 🚀 **Referral program** - Indicar novos nós
4. 💎 **Enterprise grants** - Atrair empresas

### Distribuição do Fundo

| Uso       | % do Fundo | Descrição                    |
| --------- | ---------- | ---------------------------- |
| Bootstrap | 40%        | Rewards aumentados no início |
| Loyalty   | 30%        | Bônus por tempo de serviço   |
| Referral  | 20%        | Indicação de novos nós       |
| Reserve   | 10%        | Emergências/oportunidades    |

### Loyalty Tiers

| Tempo Ativo | Bônus Mensal |
| ----------- | ------------ |
| 3 meses     | +5%          |
| 6 meses     | +10%         |
| 12 meses    | +20%         |
| 24 meses    | +35%         |

---

## 7. Split de Receita

### Tabela Oficial

| Destino             | P2P Off-chain | P2P On-Chain |
| ------------------- | ------------- | ------------ |
| **Node Host**       | 95%           | 95%          |
| **Panda Ops**       | 4%            | 1%           |
| **Fundo Incentivo** | 1%            | 1%           |
| **Gateway/GAS**     | 0%            | 3%           |

### Hardcoded Minimums

```javascript
const P2P_SPLIT = {
  // IMUTÁVEL - Blindagem do Host
  hostMin: 0.9, // Host NUNCA recebe menos de 90%

  // Fase Off-chain (sem gas)
  offchain: {
    host: 0.95,
    ops: 0.04,
    fund: 0.01,
  },

  // Fase On-chain (com gas)
  onchain: {
    host: 0.95,
    ops: 0.01,
    fund: 0.01,
    gateway: 0.03,
  },
};
```

---

## 8. Segurança & Penalidades

### Verificação de Nó

| Check     | Frequência  | Ação                     |
| --------- | ----------- | ------------------------ |
| Benchmark | No registro | Determina tier           |
| Heartbeat | 60 segundos | Confirma disponibilidade |
| Sampling  | Aleatório   | Verifica resultado       |
| Audit     | Mensal      | Review completo          |

### Penalidades

| Violação               | Penalidade              |
| ---------------------- | ----------------------- |
| Downtime não anunciado | -10% rewards do período |
| Resultado incorreto    | Suspensão 24h           |
| Fraude de recursos     | Ban permanente          |
| Resultado atrasado     | -5% do job              |

---

## 9. Implementação

### Arquivos Necessários

| Arquivo                                  | Tipo | Descrição           |
| ---------------------------------------- | ---- | ------------------- |
| `rust-agent/src/node.rs`                 | Rust | Node manager        |
| `rust-agent/src/mining.rs`               | Rust | Mining/heartbeat    |
| `rust-agent/src/task.rs`                 | Rust | Task fractionation  |
| `backend/domains/compute/PF_Nodes.gs`    | GAS  | Node registry       |
| `backend/domains/compute/PF_Mining.gs`   | GAS  | Reward distribution |
| `backend/domains/compute/PF_Tasks.gs`    | GAS  | Task scheduler      |
| `js/tentacles/compute/pf.node-parent.js` | JS   | Node SDK            |

### API Endpoints

```javascript
// Node Management
POST /node/register    → Registrar nó
POST /node/benchmark   → Executar benchmark
GET  /node/stats       → Estatísticas do nó
POST /node/withdraw    → Sacar rewards

// Task Management
GET  /task/available   → Listar tasks disponíveis
POST /task/accept      → Aceitar task
POST /task/submit      → Submeter resultado
GET  /task/status/:id  → Status de task
```

---

## 📎 Arquivos Relacionados

| Arquivo                                            | Descrição           |
| -------------------------------------------------- | ------------------- |
| [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) | Splits e tokenomics |
| [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md) | Rust Agent          |
| [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md)         | SDK Integration     |

---

> 📖 **Versão:** 1.0.0 | **Status:** Planejado
> **Mantido por:** Panda Council (PAT)
