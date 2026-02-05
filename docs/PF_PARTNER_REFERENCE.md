# 🤝 PF_PARTNER_REFERENCE - Economia de Energia & Partner Mode

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-05
> **Cross-Ref:** [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md) | [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Tiers de Usuário](#2-tiers-de-usuário)
3. [Protocolo Fantasma](#3-protocolo-fantasma)
4. [Mining Integration](#4-mining-integration)
5. [Dashboard & Gamificação](#5-dashboard--gamificação)
6. [Splits & Taxas](#6-splits--taxas)
7. [Compliance & Legal](#7-compliance--legal)
8. [Implementação Técnica](#8-implementação-técnica)

---

## 1. Visão Geral

O **Partner Mode** transforma hardware ocioso dos usuários em **lastro financeiro** do ecossistema Panda, criando uma economia circular onde todos ganham.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    PARTNER MODE - ECONOMIA DE ENERGIA                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [USUÁRIO]          [PANDA]             [ECOSSISTEMA]                   │
│  ┌─────────┐       ┌─────────┐         ┌─────────┐                      │
│  │ CPU/GPU │──────▶│ Pool    │────────▶│ Treasury│                      │
│  │ ociosos │ Poder │ Mining  │ Cripto  │ Panda   │                      │
│  └─────────┘       └─────────┘         └─────────┘                      │
│       ▲                                      │                           │
│       │            ┌─────────┐               │                           │
│       └────────────│ Panda   │◀──────────────┘                           │
│        PC Credits  │ Credits │   Emissão                                 │
│                    └─────────┘                                           │
│                                                                          │
│  💡 "Seu PC dorme, você ganha. O Panda nunca para."                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Por que Partner Mode?

| Benefício      | Usuário              | Panda             |
| -------------- | -------------------- | ----------------- |
| **Custo Zero** | Não paga nada        | Receita passiva   |
| **Zero Taxas** | Sem fees na Store    | Base engajada     |
| **Ganha PC**   | Créditos automáticos | Lastro financeiro |
| **Prioridade** | Fila VIP             | Fidelização       |

---

## 2. Tiers de Usuário

### 2.1 Onboarding "Escolha Forçada"

Na instalação do Rust Agent, o usuário DEVE escolher um modo:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    🐼 BEM-VINDO AO PANDA FACTORY                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  👤 VISITANTE   │  │  💎 PRO         │  │  🤝 PARTNER ★   │         │
│  │                 │  │                 │  │   (Recomendado) │         │
│  │  • Taxas padrão │  │  • R$29/mês     │  │  • Grátis!      │         │
│  │  • Cloud only   │  │  • Zero taxas   │  │  • Zero taxas   │         │
│  │                 │  │  • Suporte VIP  │  │  • Ganha PC!    │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Comparativo de Tiers

| Aspecto            | 👤 Visitante | 💎 Pro    | 🤝 Partner  |
| ------------------ | ------------ | --------- | ----------- |
| **Custo**          | $0           | R$29/mês  | $0          |
| **Taxas Store**    | 5%           | 0%        | 0%          |
| **Prioridade**     | Normal       | VIP       | VIP+        |
| **GPU Local**      | ❌           | ✅        | ✅          |
| **Ganha PC?**      | ❌           | ❌        | ✅ Auto     |
| **Suporte**        | Comunidade   | Email 24h | Email 24h   |
| **Usa CPU ocioso** | ❌           | ❌        | ✅ (10-90%) |

### 2.3 Configuração Partner

O usuário configura quanto quer contribuir:

| Parâmetro    | Range    | Default     | Descrição                |
| ------------ | -------- | ----------- | ------------------------ |
| **CPU %**    | 10-90%   | 30%         | Percentual máximo de CPU |
| **RAM %**    | 10-50%   | 20%         | Percentual máximo de RAM |
| **GPU %**    | 10-90%   | 50%         | Percentual máximo de GPU |
| **Horários** | Checkbox | Noturno+AFK | Quando contribuir        |

---

## 3. Protocolo Fantasma

### 3.1 Conceito

O Rust Agent opera em **background silencioso**, monitorando atividade e ajustando carga dinamicamente.

### 3.2 Regra dos 15%

> **NUNCA usar mais que 85% dos recursos.** Mínimo 15% sempre livre.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    RESOURCE THROTTLING                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  CPU:  [████████████████░░░░] 80%    │  Limite: 85%                     │
│  RAM:  [████████████░░░░░░░░] 60%    │  Limite: 85%                     │
│  GPU:  [██████████████████░░] 90%    │  Limite: 90%                     │
│                                                                          │
│  Status: 🟢 ATIVO (recursos dentro do limite)                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Triggers de Pausa Imediata

| Trigger                         | Ação        | Tempo |
| ------------------------------- | ----------- | ----- |
| Input detectado (mouse/teclado) | Reduz carga | 100ms |
| App fullscreen detectado        | Suspend     | 50ms  |
| Jogo executando                 | Suspend     | 50ms  |
| CPU > 85%                       | Suspend     | 200ms |
| Bateria < 20% (notebook)        | Suspend     | 100ms |
| GPU > 80°C                      | Suspend     | 100ms |

### 3.4 Hardware Compatível

| Hardware            | Suporte    | Notas                  |
| ------------------- | ---------- | ---------------------- |
| **Intel Core 6th+** | ✅ Full    | RAPL, Turbo Boost      |
| **AMD Ryzen**       | ⚠️ Parcial | Sem power control fino |
| **NVIDIA GTX 900+** | ✅ Full    | NVML, nvidia-smi       |
| **AMD Radeon**      | ⚠️ Parcial | OpenCL only            |

---

## 4. Mining Integration

### 4.1 Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    MINING FLOW                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [RUST AGENT]                                                            │
│       ├──▶ [XMRig] CPU ──▶ Unmineable ──▶ USDT                          │
│       └──▶ [T-Rex] GPU ──▶ Unmineable ──▶ USDT                          │
│                                       │                                  │
│                                       ▼                                  │
│                              [WALLET PANDA]                              │
│                                       │                                  │
│                        ┌──────────────┼──────────────┐                  │
│                        ▼              ▼              ▼                  │
│                     25%           50%+2%          23%                   │
│                   Impostos    User+Founder       Ops                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Pool: Unmineable

| Config       | Valor                   |
| ------------ | ----------------------- |
| **Pool**     | Unmineable (multi-coin) |
| **Payout**   | USDT (stablecoin)       |
| **Wallet**   | Wallet Central Panda    |
| **Tracking** | User ID no worker name  |

### 4.3 Estimativa de Ganhos

| Hardware      | PC/dia | R$/mês |
| ------------- | ------ | ------ |
| i5 + GTX 1060 | ~30    | ~R$9   |
| i7 + RTX 3060 | ~80    | ~R$24  |
| i9 + RTX 4080 | ~200   | ~R$60  |

---

## 5. Dashboard & Gamificação

### 5.1 Widget Header

```text
┌──────────────────────────────────────────────────────────────────┐
│  [Logo]  FB●  RU●  GPU●     🔋 1,234 PC     ⚡ +45 hoje     ⚙️  │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 Painel Detalhado

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🔋 SEU SALDO: 1,234 PC (≈R$12,34)                                     │
│                                                                          │
│  📊 HOJE                          🏆 RANKING                            │
│  ├── Gerado:  +45 PC              └── #234 de 5,000 Partners            │
│  ├── Gasto:   -12 PC                                                    │
│  └── Líquido: +33 PC              🎯 Próximo: 2,000 PC → Badge Bronze  │
│                                                                          │
│  📅 ÚLTIMOS 7 DIAS                                                       │
│  Seg ████████ 45    Qui ███████ 41                                      │
│  Ter ██████ 38      Sex █████████ 48                                    │
│  Qua ██████████ 52  Sáb ████ 23                                         │
│                     Dom ███████████ 56                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Badges e Milestones

| PC Acumulado | Badge                    |
| ------------ | ------------------------ |
| 500          | 🥉 Contribuidor Bronze   |
| 2,000        | 🥈 Contribuidor Prata    |
| 10,000       | 🥇 Contribuidor Ouro     |
| 50,000       | 💎 Contribuidor Diamante |
| 100,000      | 👑 Lenda Partner         |

---

## 6. Splits & Taxas

### 6.1 Split Mineração (Partner Mode)

| Destino          | %   | Nota                               |
| ---------------- | --- | ---------------------------------- |
| **Impostos Fed** | 25% | Provisão IR Cripto (Panda declara) |
| **Founder Fee**  | 2%  | Sobre bruto gerado                 |
| **Panda Ops**    | 23% | Infraestrutura                     |
| **Usuário (PC)** | 50% | Créditos automáticos               |

> ⚠️ **Importante:** O Panda é responsável por declarar as criptos. Usuário só recebe Panda Coins.

### 6.2 Diferença: Mining vs Store

| Aspecto           | Mining       | Store/Plugins       |
| ----------------- | ------------ | ------------------- |
| **Founder Fee**   | 2% (bruto)   | incluso no 5% Panda |
| **Tax structure** | 25% impostos | 3% gateway          |
| **User return**   | 50% em PC    | 52% para dev        |

---

## 7. Compliance & Legal

### 7.1 Anti-Malware

| Estratégia          | Implementação                  |
| ------------------- | ------------------------------ |
| **Code Signing**    | Certificado EV (DigiCert)      |
| **Nome processo**   | "PandaOptimizer.exe"           |
| **Mining separado** | XMRig download opt-in          |
| **Whitelist**       | Submeter para Windows Defender |

### 7.2 Consentimento

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  ☑️ Autorizo o Panda Factory a utilizar recursos ociosos               │
│  ☑️ Entendo que receberei Panda Credits como compensação               │
│  ☑️ Li os Termos de Uso do Partner Mode                                 │
│                                                                          │
│  [ATIVAR PARTNER MODE]                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Termos de Uso (Resumo)

1. Panda utiliza recursos ociosos conforme configurado
2. Utilização limitada aos parâmetros do usuário
3. Usuário recebe Panda Credits proporcionais
4. Mineração feita em nome do Panda Factory
5. **Panda é responsável por declarar a cripto gerada**
6. Desativação a qualquer momento sem penalidade

---

## 8. Implementação Técnica

### 8.1 Crates Rust

| Crate           | Função               |
| --------------- | -------------------- |
| `sysinfo`       | CPU/RAM/Disk stats   |
| `nvml-wrapper`  | NVIDIA monitoring    |
| `global-hotkey` | User input detection |
| `battery`       | Laptop battery       |

### 8.2 Fluxo de Inicialização

```text
1. Rust Agent inicia
2. Verifica tier do usuário
3. Se Partner: carrega PhantomProtocol
4. Aguarda idle (15s sem input)
5. Verifica recursos (Regra 15%)
6. Se OK: inicia mining com limites
7. Monitora continuamente
8. Input detectado? Pausa imediata
```

---

## 📎 Cross-References

- [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md) - Rust Agent core
- [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) - Tokenomics geral
- [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md) - Arquitetura completa

---

> 📖 **Versão:** 1.0.0 | **Status:** Planejado
