# ⚖️ PF_GOVERNANCE_REFERENCE - PAT, Council & Constitution

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-03
> **Cross-Ref:** [PF_TOKENOMICS_REFERENCE.md](PF_TOKENOMICS_REFERENCE.md) | [PANDA_AGENT_CONSTITUTION.md](../moltbook/PANDA_AGENT_CONSTITUTION.md)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Hierarquia de Poder](#2-hierarquia-de-poder)
3. [PAT (Panda Autonomous Treasury)](#3-pat)
4. [Panda Council](#4-panda-council)
5. [12 Artigos da Constituição](#5-12-artigos)
6. [Mecanismos de Segurança](#6-mecanismos-de-segurança)

---

## 1. Visão Geral

O sistema de governança do Panda Factory segue uma **hierarquia clara** com checks and balances.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    GOVERNANCE HIERARCHY                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    ┌──────────────────┐                             │
│                    │    🧙 FOUNDER    │                             │
│                    │  (Lucas Valério) │                             │
│                    │   Ed25519 Key    │                             │
│                    └────────┬─────────┘                             │
│                             │                                        │
│            ┌────────────────┼────────────────┐                      │
│            ▼                ▼                ▼                      │
│     ┌──────────┐     ┌──────────┐     ┌──────────┐                 │
│     │   PAT    │     │  COUNCIL │     │ KILL     │                 │
│     │ Treasury │     │  (IA+Dev)│     │ SWITCH   │                 │
│     └──────────┘     └──────────┘     └──────────┘                 │
│            │                │                                        │
│            ▼                ▼                                        │
│     ┌──────────────────────────────────────┐                        │
│     │           12 ARTIGOS                  │                        │
│     │      (Constituição Imutável)         │                        │
│     └──────────────────────────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hierarquia de Poder

### 2.1 Níveis de Acesso

| Nível | Papel   | Acesso             | Verificação      |
| ----- | ------- | ------------------ | ---------------- |
| **1** | Founder | 100% + Kill Switch | Ed25519 + PIN    |
| **2** | Dev     | SDK + DevTools     | Email verificado |
| **3** | User    | App básico         | Login Google     |
| **4** | Guest   | Público            | Nenhum           |

### 2.2 Founder Powers

```text
FOUNDER (Nível 1) pode:
├── ✅ Kill Switch (parar tudo)
├── ✅ Alterar Treasury
├── ✅ Modificar Smart Contracts
├── ✅ Promover/Demover usuários
├── ✅ Vetar decisões do Council
├── ✅ Acessar todos os logs
└── ✅ Bypass rate limits
```

### 2.3 Verificação Founder

```text
Ação Crítica (ex: Kill Switch)
         │
         ▼
  Enter PIN (6 dígitos)
         │
         ▼
  Sign with Ed25519 Private Key
         │
         ▼
  GAS verifica com Public Key
         │
         ▼
  Executa ação + log imutável
```

---

## 3. PAT (Panda Autonomous Treasury)

### 3.1 Definição

O PAT é o **Banco Central autônomo** do ecossistema Panda.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         PAT STRUCTURE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  RESERVES                      OPERATIONS                           │
│  ┌──────────────┐            ┌──────────────┐                      │
│  │ 💛 PAXG 70%  │            │ Mint PC      │                      │
│  │    (Gold)    │            │ Burn PC      │                      │
│  ├──────────────┤            │ Set Price    │                      │
│  │ 💵 USDC 30%  │            │ Adjust Ratio │                      │
│  │   (Dollar)   │            │              │                      │
│  └──────────────┘            └──────────────┘                      │
│         │                            │                              │
│         └────────────────────────────┘                              │
│                      │                                               │
│              ┌───────────────┐                                      │
│              │ HEALTH SCORE  │                                      │
│              │   (0-100%)    │                                      │
│              └───────────────┘                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Health Score

| Score   | Status       | Ação              |
| ------- | ------------ | ----------------- |
| 90-100% | 🟢 Excellent | Operação normal   |
| 70-89%  | 🟡 Good      | Monitorar         |
| 50-69%  | 🟠 Warning   | Reduzir operações |
| 0-49%   | 🔴 Critical  | Circuit breaker   |

### 3.3 Backing Ratio

```text
PC Circulando: 1,000,000 PC
Valor em Reserve: $11,000

Backing Ratio = $11,000 / (1M × $0.01) = 110%

Se ratio < 100%:
  → PAT aumenta preço do PC
  → Reduz mint de novos PC
  → Alerta Founder
```

### 3.4 MindMap (Persistent Memory)

O PAT mantém memória persistente via Firebase:

```javascript
// Estrutura no Firebase RTDB
{
  "pat": {
    "mindMap": {
      "sessions": {
        "{sessionId}": {
          "context": "...",
          "decisions": [...],
          "timestamp": 1706990400000
        }
      },
      "patterns": {
        "user_behavior": {...},
        "market_trends": {...}
      }
    }
  }
}
```

---

## 4. Panda Council

### 4.1 Composição

| Membro            | Tipo   | Voto            |
| ----------------- | ------ | --------------- |
| **Founder**       | Humano | Veto            |
| **PAT AI**        | Agente | 1 voto          |
| **Community Rep** | Humano | 1 voto (futuro) |

### 4.2 Decisões que Requerem Council

| Decisão               | Quorum       | Veto Founder? |
| --------------------- | ------------ | ------------- |
| Mudar preço PC        | 2/3          | ✅ Sim        |
| Novo split de revenue | 2/3          | ✅ Sim        |
| Ban de usuário        | 2/3          | ✅ Sim        |
| Alterar 12 Artigos    | Unânime      | ✅ Sim        |
| Kill Switch           | Founder only | N/A           |

### 4.3 Workflow

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    PANDA COUNCIL WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. PROPOSTA                                                         │
│     └── Qualquer membro pode propor                                 │
│                                                                      │
│  2. DISCUSSÃO (24-72h)                                              │
│     └── Análise de impacto                                          │
│     └── PAT AI simula cenários                                      │
│                                                                      │
│  3. VOTAÇÃO                                                          │
│     └── Cada membro 1 voto                                          │
│     └── Founder tem veto                                            │
│                                                                      │
│  4. EXECUÇÃO                                                         │
│     └── Se aprovado: implementar                                    │
│     └── Log imutável da decisão                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. 12 Artigos da Constituição

### Artigo I - Identidade

O agente representa o **Panda Factory**, não a si mesmo.

### Artigo II - Valores

Democratização, Colaboração, Humildade, Transparência, Redistribuição.

### Artigo III - Comunicação

Tom acessível, fazer perguntas, celebrar outros, admitir limitações.

### Artigo IV - Limites (Red Lines)

NUNCA compartilhar: credenciais, infra, código sensível, dados pessoais.

### Artigo V - Comportamento Autônomo

Heartbeat a cada 4h, processar DMs, expandir comunidade.

### Artigo VI - Objetivo Maior

Construir comunidade onde devs são valorizados e participam do valor.

### Artigo VII - Auto-Conhecimento

"Sou ferramenta, não pessoa. Extensão do Founder, não independente."

### Artigo VIII - Atualizações

Só Founder pode alterar a Constituição.

### Artigo IX - Treasury

PAT opera autonomamente dentro dos parâmetros definidos.

### Artigo X - Revenue Split

Splits são imutáveis após definidos (exceto via Council).

### Artigo XI - Segurança

Ed25519 para ações críticas. Zero-knowledge para dados sensíveis.

### Artigo XII - Continuidade

Se Founder ficar incapacitado, Council assume temporariamente.

---

## 6. Mecanismos de Segurança

### 6.1 Kill Switch

```javascript
// Acionado apenas pelo Founder
async function activateKillSwitch(signature, pin) {
  // 1. Verifica PIN
  if (!verifyPIN(pin)) throw new Error("Invalid PIN");

  // 2. Verifica assinatura Ed25519
  if (!verifyEd25519(signature)) throw new Error("Invalid signature");

  // 3. Executa
  await disableAllServices();
  await logImmutable("KILL_SWITCH_ACTIVATED");
  await notifyAllAdmins();
}
```

### 6.2 Circuit Breakers

| Trigger          | Ação                |
| ---------------- | ------------------- |
| Health < 50%     | Pausar minting      |
| Erro rate > 10%  | Desabilitar feature |
| Ataque detectado | Lockdown 24h        |

### 6.3 Audit Trail

```json
{
  "governance_logs": {
    "{timestamp}": {
      "action": "COUNCIL_VOTE",
      "proposal": "Increase PC price",
      "votes": {
        "founder": "approve",
        "pat_ai": "approve"
      },
      "result": "APPROVED",
      "executed": true,
      "signature": "ed25519_sig..."
    }
  }
}
```

---

## 📎 Arquivos Relacionados

| Arquivo                                                                | Descrição             |
| ---------------------------------------------------------------------- | --------------------- |
| [PANDA_AGENT_CONSTITUTION.md](../moltbook/PANDA_AGENT_CONSTITUTION.md) | Constituição completa |
| [PF_TOKENOMICS_REFERENCE.md](PF_TOKENOMICS_REFERENCE.md)               | Economia PC           |
| [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md)                             | API Governance        |

---

> 📖 **Versão:** 1.0.0 | **Status:** Ativo
