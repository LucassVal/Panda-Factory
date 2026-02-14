# 🐼 DOSSIÊ DE VIABILIDADE — PANDA FACTORY

## Conselho Supremo Panda · Análise Estratégica Consolidada v7.0 · 2026-02-14

> **Classificação:** PAT/STRATEGY · **Status:** ✅ Viável — Executar com Disciplina
> **Fontes (TODAS lidas do disco):** CONTEXT.md, PF_BACKEND_REFERENCE.md (1015L), PF_GEMINI_REFERENCE.md (673L), PF_COLAB_REFERENCE.md (357L), PF_ECONOMY_REFERENCE.md (1968L), PF_MCP_REFERENCE.md (618L), PF_P2P_REFERENCE.md (593L), PF_MASTER_ARCHITECTURE.md, PF_SECURITY_REFERENCE.md, PF_SDK_REFERENCE.md, PF_MEDUSA_REFERENCE.md + 6 rodadas de pesquisa web
> **Corpus SSoT analisado:** ~6.300+ linhas de documentação técnica

---

## RESUMO EXECUTIVO

O Panda Factory **é viável** como **plataforma universal para desenvolvedores**, limitada apenas pelo SDK — não por nicho. A base técnica (hooks bidirecionais, multi-window MCP, mining Rust-only, GAS user-side, DePIN, 16 módulos Rust, Gemini 3 nativo, Colab BYOC, P2P 5-tier compute) é significativamente mais sofisticada do que análises superficiais revelam.

A abordagem **Documentation-First com DDD** (Domain-Driven Design via MCP headers, fragmentação SSoT, cross-references enforced) **É a estratégia correta** — construir alinhamento documental perfeito ANTES de executar código garante que cada linha escrita serve à arquitetura, não cria dívida técnica. O roadmap é: **alinhar docs → CNPJ → hooks → código de produção**.

O desafio é **disciplina de priorização** — não over-engineerar Phase 1 (tokens, DePIN) antes de product-market fit, mas a arquitetura sustenta a ambição de longo prazo.

---

## 📋 Índice

| §   | Seção                                         | Status               |
| --- | --------------------------------------------- | -------------------- |
| 1   | [Mercado](#1-mercado)                         | ✅ Data-backed       |
| 2   | [BigTech Defense](#2-bigtech)                 | ✅ 6 dimensões       |
| 3   | [Developer Experience](#3-dx)                 | ⚠️ Pipeline P0       |
| 4   | [Segurança](#4-segurança)                     | 🔴 Paper-only        |
| 5   | [Hooks Bidirecionais](#5-hooks)               | ✅ Core mechanic     |
| 6   | [Multi-Window MCP](#6-multi-window)           | ✅ Killer feature    |
| 7   | [Mineração Rust](#7-mineração)                | ✅ Arch sólida       |
| 8   | [GAS User-Side](#8-gas)                       | ✅ Escala linear     |
| 9   | [Google Partner](#9-google)                   | ⚠️ Não formalizado   |
| 10  | [DePIN Ghost Fleet](#10-depin)                | 🔴 P4 Paper          |
| 11  | [Deployment Tiers](#11-tiers)                 | ✅ Shell/Hybrid/Full |
| 12  | [Revenue Split](#12-split)                    | ✅ Reframed          |
| 13  | [☁️ Cloud Fomentation](#13-cloud)             | **NOVO**             |
| 14  | [🖥️ Processing Nodes](#14-nodes)              | **NOVO**             |
| 15  | [🦀 Rust Agent Deep Dive](#15-rust)           | **NOVO**             |
| 16  | [🤖 Gemini 3 Integration](#16-gemini)         | **NOVO**             |
| 17  | [🔬 Colab HPC (BYOC)](#17-colab)              | **NOVO**             |
| 18  | [🌍 Universal Platform Vision](#18-universal) | **NOVO**             |
| 19  | [📡 MCP Offline-First](#19-mcp-offline)       | **NOVO**             |
| 20  | [Matriz de Risco & Veredicto](#20-veredicto)  | ✅ Updated           |

---

## 1. Mercado: "Isso dá dinheiro?" {#1-mercado}

| Métrica              | Dado Real                          | Fonte                         |
| -------------------- | ---------------------------------- | ----------------------------- |
| AI Agent Market 2025 | **$7.6B–$9.8B**                    | Fortune Business / Precedence |
| Projeção 2033        | **$183B** (CAGR 49.6%)             | Multiple analysts             |
| CX Agent spend 2025  | **$1.3B** (→$6.6B 2027)            | National Technology           |
| MCP Adoption         | **28% Fortune 500** testando       | AAIF/Linux Foundation         |
| A2A Protocol         | **150+ orgs** (Google, Salesforce) | Google A2A Launch             |

O dinheiro está em: **orquestração de workflows**, **verticais especializadas**, e **dev tools que removem fricção**.

> [!IMPORTANT]
> **Desprioritizar token economy para v2.0.** v1.0: Store funcional + PIX/Stripe simples. v1.5: PC crédito interno. v2.0: PAT, Treasury, Governance.

---

## 2. BigTech: "Vão me engolir?" {#2-bigtech}

| Dimensão        | Microsoft/Apple          | Panda Factory                    |
| --------------- | ------------------------ | -------------------------------- |
| **Target**      | Massa (100M+ users)      | Power users, devs, nichos        |
| **AI Model**    | Próprios (Copilot)       | **BYOL** — qualquer modelo       |
| **Compliance**  | Políticas restritivas    | **Zero censura** (Art. 9)        |
| **Revenue cut** | 30%                      | **5-10%** P2P / **48% Store**    |
| **Privacy**     | Cloud-first (telemetria) | **Client-Side First, $0**        |
| **Agent Types** | General purpose, "safe"  | **Grey hat** — trading, scraping |

> O Panda compete no **deserto** — onde Big Techs **não querem ou não podem entrar** por risco de compliance/imagem.

Nichos defensáveis: Social Media Automation (⭐⭐⭐⭐), Trading Bots (⭐⭐⭐⭐), Dev Tooling MCP (⭐⭐⭐), EdTech IA (⭐⭐).

---

## 3. Developer Experience {#3-dx}

### Gargalos Reais

```text
1. GAS Backend: 6 min/exec, 90 min/dia → VIÁVEL ~50-100K users (user-side)
2. Sheets como DB: 10M células → VIÁVEL ~12 meses
3. Gemini API: 300K tokens/dia → BYOL obrigatório dia 1
4. Firebase RTDB: 100K conn simultâneas → suficiente Phase 1-2
```

> [!WARNING]
> **O maior risco NÃO é técnico — é a ausência do loop dev→publish→earn.** Sem isso, marketplace é mausoléu.

**Roadmap DX — P0:**

| Sprint         | Entrega                                   | Impacto                  |
| -------------- | ----------------------------------------- | ------------------------ |
| **S1 (2 sem)** | Plugin template `npx create-panda-plugin` | Dev começa em 5 min      |
| **S2 (2 sem)** | Local sandbox `npm run panda:test`        | Dev testa sem deploy     |
| **S3 (2 sem)** | Medusa publish `git push → auto-validate` | Plugin vai pro Store     |
| **S4 (2 sem)** | Payment integration PIX via Stripe        | Dev recebe dinheiro real |

---

## 4. Segurança {#4-segurança}

```text
✅ PROJETADO (spec completa):
├── Panda Defend 3 camadas (Pre-pub, Post-pub, User-side)
├── 14 Semgrep rules, Ed25519 Kill Switch, Idempotency Keys

❌ NÃO IMPLEMENTADO:
├── Firebase Rules → NÃO configuradas
├── CSP Headers → NÃO implementados
├── Sandbox 30s → NÃO existe
├── Ed25519 real → Mocked no Rust Agent
```

> [!CAUTION]
> **P0 antes de qualquer user:** Firebase Rules (2h), CSP Headers (1h), Semgrep CI (3h), Ed25519 real (2 sprints), Plugin sandbox (3 sprints).

---

## 5. 🔄 Hooks — O Sangue do Ecossistema {#5-hooks}

```text
┌───────────────────────────────────────────────────────────┐
│  📥 INBOUND HOOKS              📤 OUTBOUND HOOKS         │
│  (Market → Panda)              (Panda → Market)          │
│  Kiwify ─── webhook ──▶ SDK ◀── publish ──── PlayStore   │
│  Hotmart ─────────────▶ 🐼  ◀────────────── Steam       │
│  Gumroad ─────────────▶     ◀────────────── Apple Store  │
└───────────────────────────────────────────────────────────┘
```

- **Inbound** (Phase 1): Kiwify `purchase.approved`, Hotmart `PURCHASE.APPROVED`, Gumroad `sale.completed` — sifona receita, data gravity = lock-in
- **Outbound** (Roadmap): `Panda.Publish.toPlayStore()`, `toSteam()` — build once, deploy everywhere
- **Medusa Modelo C** (Híbrido): 52% dev native Store / $1.99+5% external hooks

> [!WARNING]
> 🔴 **Risco P0:** Webhooks GAS não validam HMAC — replay attack possível. Implementar validação antes de produção.

---

## 6. 🖥️ Multi-Window MCP {#6-multi-window}

Document Picture-in-Picture API + BroadcastChannel + Firebase RTDB sync cross-device.

| Use Case    | Monitor 1             | Monitor 2         | Sync             |
| ----------- | --------------------- | ----------------- | ---------------- |
| **PDV**     | Operador (backoffice) | Cliente (display) | BroadcastChannel |
| **Vitrine** | Admin                 | Display loja      | Firebase RTDB    |
| **Totem**   | —                     | Standalone kiosk  | MCP read-only    |

**Diferencial:** Nenhum SaaS concorrente suporta dual-screen nativo via browser API. **Limitação:** Chrome/Edge 116+.

---

## 7. ⛏️ Mineração — Rust Engine + Web Dashboard {#7-mineração}

Mineração **NÃO roda no browser**. Browser é painel de controle remoto do Rust Agent.

**Fator fixo x0.60:** User 60% (PC via Oracle) · Impostos ~18% · Ops ~10% · Hold Reserve ~7% · Treasury ~5%.

| Perfil                 | GPU | PC/dia | R$/mês |
| ---------------------- | --- | ------ | ------ |
| 🌱 Seed (i5)           | ❌  | ~25    | ~R$9   |
| 🌿 Sprout (i7+GTX1660) | ✅  | ~65    | ~R$24  |
| 🌳 Tree (i7+RTX3060)   | ✅  | ~130   | ~R$40  |
| 🌲 Forest (i9+RTX4080) | ✅  | ~300   | ~R$60  |

**Fiscal Sovereignty:** Panda PJ minera legalmente, user cede hardware, recebe Energy Credits (PC) — zero carga tributária user.

**Mining Zero Contingency:** Se mining cai a zero, receita remanescente (Store R$3k + AI R$2.5k + P2P R$1.5k + Enterprise R$500) = R$7.5k/mês survival. Projeto sobrevive.

**Web Mining** (Phase 2-3): Browser mode via WebGPU/WASM, fator x0.40 (gateway de onboarding → conversão pro Rust Agent).

---

## 8. ⚡ GAS User-Side — O Teto Que Se Move {#8-gas}

| Modo            | Quem paga quota?     | Limite                  |
| --------------- | -------------------- | ----------------------- |
| **Server-side** | Panda PJ             | 90 min/dia centralizado |
| **User-side**   | User (OAuth pessoal) | 90 min/dia **por user** |

```text
1.000 users → 1.500 horas/dia
10.000 users → 15.000 horas/dia
```

| Cenário                      | Teto Real          |
| ---------------------------- | ------------------ |
| Backend puro                 | ~5-10K users       |
| Híbrido (server + user-side) | **~50-100K users** |
| Full user-side + Rust Agent  | Sem teto GAS       |

Migração Cloud Run é **P2, não P0**.

---

## 9. 🤝 Google Partner Strategy {#9-google}

O Panda é literalmente um **funil de onboarding** para serviços Google: GAS, Firebase, Gemini, Sheets, Drive, Cloud Spot VMs, BigQuery.

| Audiência     | Pitch                        | Mensagem                        |
| ------------- | ---------------------------- | ------------------------------- |
| 🤝 Comunidade | "Do PhD ao Favelado"         | Democratização, inclusão        |
| 💼 B2B/Google | "Google Partner Facilitator" | TCO reduction, GCP funnel       |
| 👨‍💻 Devs       | "Crie → Publique → Ganhe"    | Pipeline funcional, zero config |

**Ação P2:** Aplicar para Google Cloud Partner Program (tier Technology Partner).

---

## 10. 🏗️ DePIN — Ghost Fleet & Swarm {#10-depin}

| Feature                    | Descrição                                         | Status   |
| -------------------------- | ------------------------------------------------- | -------- |
| **Ghost Fleet (Spot VMs)** | VMs efêmeras 70-90% desconto, Safety Net Protocol | 🔴 Paper |
| **BYOD Swarm**             | Edge computing residencial, IPs residenciais      | 🔴 Paper |
| **BYOL Hollow Shell**      | User injeta software + licença no metal Panda     | 🔴 Paper |

**Prioridade:** P4 — posterior ao P2P network.

---

## 11. 📦 Deployment Tiers {#11-tiers}

| Tier       | Inclui                                                      | Target           |
| ---------- | ----------------------------------------------------------- | ---------------- |
| **Shell**  | GAS + Chrome. SDK Core, Wallet, Brain Cloud, UI             | Dev SaaS simples |
| **Hybrid** | + GPU auto-switch, MCP read-only, File Watcher              | Dev com IA Cloud |
| **Full**   | + GPU Local (CUDA/ROCm), MCP R/W, RPA, DLL Bridge, Local AI | Power User       |

White Label embutido no Shell: dev cria SaaS com Panda invisível ("Powered by Panda" obrigatório).

---

## 12. 💰 Revenue Split — Comunicação {#12-split}

| Plataforma      | Split Dev | CNPJ?         | Hosting?  | Billing?  | IA?    | Barreira         |
| --------------- | --------- | ------------- | --------- | --------- | ------ | ---------------- |
| Apple Store     | 70%       | Sim           | Apple     | Apple     | ❌     | $99/ano + review |
| Chrome Store    | 70%       | Não           | Você      | Você      | ❌     | Review months    |
| **Panda Store** | **52%**   | **NÃO** (MoR) | **Panda** | **Panda** | **✅** | **`git push`**   |

> _"70% da Apple exige $99/ano, CNPJ, meses de review. 52% do Panda exige git push."_

**MoR via Paddle** — venda em 46 países sem CNPJ internacional = democratização real pro dev BR.

---

## 13. ☁️ Cloud Fomentation — Infraestrutura de Nós {#13-cloud}

> **Fonte primária:** PF_BACKEND_REFERENCE.md §7-10, PF_ECONOMY_REFERENCE.md §16.13, PF_COLAB_REFERENCE.md §3-5

### 13.1 Google Free Tier como Bootstrap ($0)

O Panda consome **5 serviços Google gratuitamente** como infraestrutura base:

| Serviço           | Free Tier              | Uso Panda                                                       | Teto                       |
| ----------------- | ---------------------- | --------------------------------------------------------------- | -------------------------- |
| **GAS**           | 90 min/dia/user        | Backend + Dispatcher + PAT                                      | ~50-100K users (user-side) |
| **Firebase RTDB** | 1GB storage, 100K conn | **Validation hub**: itens validados, updates de devs, heartbeat | ~10K users Phase 1         |
| **Firebase Auth** | Unlimited users        | Email + Google sign-in                                          | Sem limite                 |
| **Sheets**        | 10M células            | Catálogos, configs                                              | ~12 meses                  |
| **Drive**         | 15GB/user              | Módulo hosting (Medusa)                                         | Escala com users           |

> [!IMPORTANT]
> **Firebase = Hub de Validação e Distribuição, NÃO main compute.** O Firebase armazena itens validados para focar e distribuir atualizações que devs fazem. Todo o **grosso de uso roda híbrido via client-side** (browser + Rust Agent). Firebase é o **control plane**, não o data plane.

### 13.1b Barreira de Conta Google: ZERO

**Pesquisa (Feb 2026):** ~4.97 bilhões de pessoas usam serviços Google globalmente (electroiq.com, joingenius.com). Com população mundial de ~8.3B = **~60% do globo**. Criar conta Google não requer documento nem telefone.

| Métrica                     | Dado                         |
| --------------------------- | ---------------------------- |
| Usuários Google (2025)      | **4.97 bilhões**             |
| % da população global       | **~60%**                     |
| Gmail MAU                   | **1.8 bilhão**               |
| Requisitos para criar conta | Email alternativo (qualquer) |

> **Conclusão:** Conta Google NÃO é barreira. É commodity global.

### 13.2 Estratégia de Fallback (5 Tiers)

Fonte: PF_BACKEND_REFERENCE.md §8.3 + §9.1

```text
TIER 0: Google Free Tier ($0/mês)
├── GAS + Firebase + Sheets + Drive
├── Limitações: 6min/exec, 30 concurrent, 10M cells
└── Alvo: 0-5K users

TIER 1: Firebase Blaze ($25-100/mês)
├── Pay-as-you-go, sem limites de conexão
└── Alvo: 5K-20K users

TIER 2: Cloud Run ($50-200/mês)
├── Containers auto-scale, GAS como fallback
└── Alvo: 20K-100K users

TIER 3: Kubernetes GKE ($200-500/mês)
├── Multi-região, HA, enterprise SLA
└── Alvo: 100K+ users

TIER 4: Hybrid P2P
├── Edge computing via Partner Nodes
├── GAS apenas para billing/governance
└── Alvo: Escala ilimitada
```

**Custo operacional Phase 1:** R$0 (Firebase Free) + R$50 (domínio) + R$100 (misc) = **R$150/mês**.

### 13.3 Circuit Breaker + Offline-First

Fonte: PF_BACKEND_REFERENCE.md §8.1

O sistema usa **Circuit Breaker pattern** para resiliência (CLOSED→OPEN→HALF_OPEN, threshold 3 falhas, timeout 30s). A cadeia de fallback: **GAS → Rust Agent → IndexedDB Cache → Graceful Degradation (Offline Mode)**.

```text
PWA Offline-First:
├── Service Worker: HTML + SDK + CSS (assets estáticos)
├── IndexedDB: dados de usuário, catálogos, configs
├── LocalStorage: auth tokens, preferences
└── Sync on Reconnect: flush queue + invalidate stale + refresh critical
```

### 13.4 Alternativas (Fallback Non-Google)

| Alternativa            | Uso                 | Quando                            |
| ---------------------- | ------------------- | --------------------------------- |
| **Supabase**           | PostgreSQL + Auth   | Se Firebase pricing escala demais |
| **Neon**               | Serverless Postgres | Cold-start workloads              |
| **VPS self-hosted**    | Full control        | Se Google Terms mudam             |
| **Cloudflare Workers** | Edge compute        | Latência crítica                  |

> [!NOTE]
> O projeto é **Google-only por escolha estratégica** (não dependência). A documentação DDD com MCP headers garante que trocar provider é substituição modular, não rewrite.

---

## 14. 🖥️ Processing Node Ecosystem {#14-nodes}

> **Fonte primária:** PF_P2P_REFERENCE.md (593 linhas completas), PF_ECONOMY_REFERENCE.md §16.13-16.16

### 14.1 5-Tier Node System

| Tier | Nome       | RAM    | Cores | GPU          | Multiplier | Prioridade  |
| ---- | ---------- | ------ | ----- | ------------ | ---------- | ----------- |
| 🌱 1 | **Seed**   | 4 GB   | 2     | ❌           | 1.0x       | Baixa       |
| 🌿 2 | **Sprout** | 8 GB   | 4     | ❌           | 1.5x       | Normal      |
| 🌳 3 | **Tree**   | 16 GB  | 8     | ✅ Qualquer  | 2.5x       | Alta        |
| 🌲 4 | **Forest** | 32 GB  | 12    | ✅ RTX 30+   | 4.0x       | Prioritária |
| 🏔️ 5 | **Titan**  | 64 GB+ | 16+   | ✅ Multi-GPU | 8.0x       | Enterprise  |

**Benchmark automático** determina tier no registro. Heartbeat a cada 60s confirma disponibilidade.

### 14.2 Reward Formula

```
reward = basePrice × resourceUsage × tierMultiplier × uptimeBonus
```

Tree node, 8 cores, 24h, 99.5% uptime = **242.4 PC/dia**.

**SLA Uptime Rewards** (fator progressivo): <50% = x0.60 base → 50-75% = x0.62 → 75-90% = x0.65 → 90-99% = x0.68 → **99%+ = x0.70 (elite 24/7)**.

### 14.3 P2P Compute (Machine Rental)

```text
USER A (GPU ociosa)              USER B (precisa GPU)
├── Rust Agent detecta           ├── Submete task via SDK
├── Marca como disponível        ├── Panda seleciona node
└────────── MATCH ───────────────┘
              │
        95% → User A (host)
         5% → Panda (ops)
```

| Recurso             | Google Cloud | Panda P2P | Saving |
| ------------------- | ------------ | --------- | ------ |
| GPU hora (RTX 3060) | ~$0.50/h     | ~$0.30/h  | ~40%   |
| CPU vCore/hora      | ~$0.04/h     | ~$0.02/h  | ~50%   |
| Storage GB/mês      | ~$0.02       | ~$0.01    | ~50%   |

> **Rigs remotas** são bem-vindas — sem limites de farms. Modelo Uber: Panda é a plataforma, user fornece o ativo (hardware).

### 14.3b Nós Dual-Purpose: Mining + Task Allocation

> [!IMPORTANT]
> **Os mesmos nodes que mineram TAMBÉM executam tasks de terceiros.** Não é "ou mineração ou compute" — é **ambos simultaneamente**, com alocação dinâmica de recursos.

```text
NODE OWNER (minerando)
├── 70% GPU → XMRig/T-Rex (mining)
├── 20% GPU → Task Queue (rendering, AI inference para outros users)
└── 10% GPU → Reserva (burst / própria)

Quando task chega:
├── Dispatcher avalia prioridade
├── Se task paga mais que mining atual → pausa mining parcial
└── Task fracionada via Splitter → Chunks distribuídos → Aggregator monta resultado
```

**Cenários de uso interno (task allocation):**

| Task Type     | Quem Pede          | Quem Executa              | Payment       |
| ------------- | ------------------ | ------------------------- | ------------- |
| AI Inference  | User B (sem GPU)   | Node A (minerando)        | PC por token  |
| Image Render  | Dev C (módulo 3D)  | Nodes A+D (tile split)    | PC por tile   |
| Video Encode  | User E (editor)    | Nodes A+B+C (frame range) | PC por frame  |
| Build/Compile | Dev F (Rust build) | Node com CPU ocioso       | PC por minuto |

> **Nada impede** que parte do poder de mineração vá para alocação de tarefas internas. O node owner define o split via config, o Dispatcher respeita.

### 14.4 Task Fractionation Standard

Todas as tarefas P2P são fracionáveis:

| Tipo             | Chunk Pattern       | Agregação        |
| ---------------- | ------------------- | ---------------- |
| **AI_INFERENCE** | Por batch de tokens | Concatenação     |
| **IMAGE_RENDER** | Por tile/região     | Composição       |
| **VIDEO_ENCODE** | Por frame range     | Sequenciamento   |
| **DATA_PROCESS** | Por row range       | Merge            |
| **TRAINING**     | Por epoch/batch     | Checkpoint merge |

### 14.5 Event Synchronization (Vector Clocks)

Nós paralelos usam **Vector Clocks** para ordenação causal de eventos distribuídos. Conflict resolution: Same result → Accept first / Different → Majority vote / Timeout → Retry + Penalty / Hash mismatch → Disqualify + Audit.

### 14.6 PAT Inflation Control

| Ferramenta            | Trigger                | Efeito                         |
| --------------------- | ---------------------- | ------------------------------ |
| **Inflation Monitor** | GAS cron semanal       | Calcula ratio emissão/queima   |
| **Auto-throttle**     | Ratio <3:1 por 30 dias | Reduz fator mining em 5%       |
| **Decimal shift**     | Inflação persistente   | Ajusta casas decimais do PC    |
| **SLA suspend**       | Inflação >5%           | Suspende bônus, todos em x0.60 |

Break-even: **3 users ativos consumidores : 1 minerador** (cada ativo queima ~300 PC/mês via Store+AI, cada minerador emite ~900 PC/mês).

---

## 15. 🦀 Rust Agent Deep Dive — 16 Módulos {#15-rust}

> **Fonte:** PF_BACKEND_REFERENCE.md §A-B (1015 linhas completas)

### 15.1 Core Modules (6)

| Módulo     | Arquivo     | Função                                                                        |
| ---------- | ----------- | ----------------------------------------------------------------------------- |
| **Crypto** | `crypto.rs` | Ed25519 (ring crate), key gen, sign/verify, kill switch                       |
| **GPU**    | `gpu.rs`    | NVML detection, VRAM/temp/clock, CUDA/Vulkan/WebGPU                           |
| **Health** | `health.rs` | Heartbeat 60s, CPU/RAM/disk status → Firebase RTDB                            |
| **Main**   | `main.rs`   | Tauri app, CLI, auto-update                                                   |
| **MCP**    | `mcp.rs`    | 4 MCP tools: `gpu_info`, `sign_message`, `verify_signature`, `get_public_key` |
| **Mining** | `mining.rs` | XMRig/T-Rex wrapper, pool config, hashrate monitor                            |

### 15.2 Extension Modules (10)

| Módulo                 | Função                                                             | Libs                       |
| ---------------------- | ------------------------------------------------------------------ | -------------------------- |
| **B.1 AI/ML Local**    | GPU inference local (ONNX), cloud fallback 30 PC/h                 | `ort`, `candle`            |
| **B.2 Financeiro**     | DLL Bridge MetaTrader 4/5, `OrderSend()` via Firebase              | `mt5.dll`, `winapi`        |
| **B.3 RPA Ghost User** | Mouse/Teclado automação (ERPs sem API)                             | `enigo`, `winapi`          |
| **B.4 IoT/Hardware**   | Impressoras térmicas (ESC-POS), balanças (COM), biometria          | SDK nativo                 |
| ~~B.5 Local AI Brain~~ | ~~Llama 3 / Mistral quantizado offline~~                           | **❌ REMOVIDO**            |
| **B.6 Polyglot**       | NLLB-200 (200 idiomas, ~600MB) + Whisper STT (140MB)               | `ort`, ONNX                |
| **B.7 RIG Framework**  | Multi-provider agents (Gemini, Anthropic, OpenAI)                  | `rig` crate                |
| **B.8 Token Meter**    | Billing por provider/model, custo → Firebase                       | `chrono`                   |
| **B.9 Multi-User**     | Session isolation, per-user context                                | `HashMap<String, Session>` |
| **B.10 Cache**         | TTL Jitter (±25%), stale-while-revalidate, thunder herd prevention | `rand`, IndexedDB          |

### 15.3 B.5 Local AI Brain — REMOVIDO

> [!CAUTION]
> **Decisão do Founder:** B.5 (Llama 3 / Mistral local) **NÃO faz parte do projeto**. Compete diretamente com o Gasômetro (billing Gemini por PC). A monetização depende do fluxo Brain → Gemini API → Pandômetro → PC consumidos. LLM local gratuito bypassa esse loop.

**O que permanece:** `B.6 Polyglot` — é **utilitário**, não substituto de Brain:

- Traduzir o sistema inteiro (UI, docs, chat)
- **Chat interno user↔user** (multi-idioma automático)
- **Fórum comunitário** (posts auto-traduzidos 200 idiomas)
- STT para acessibilidade

### 15.4 Polyglot — Diferencial Competitivo

| Aspecto         | Cloud API          | Rust Local         |
| --------------- | ------------------ | ------------------ |
| **Privacidade** | ❌ Dados vazam     | ✅ Zero vazamento  |
| **Custo**       | 💰 Por caractere   | ✅ Grátis infinito |
| **Latência**    | 🐢 100-500ms       | ⚡ ~50ms           |
| **Offline**     | ❌ Requer internet | ✅ 100% offline    |

---

## 16. 🤖 Gemini 3 Integration {#16-gemini}

> **Fonte:** PF_GEMINI_REFERENCE.md (673 linhas completas)

### 16.1 Modelos Disponíveis

| Modelo    | Contexto  | Thinking | Output | Uso                 |
| --------- | --------- | -------- | ------ | ------------------- |
| **Flash** | 1M tokens | ✅ Sim   | 65K    | Chat rápido, bulk   |
| **Pro**   | 1M tokens | ✅ Sim   | 65K    | Raciocínio complexo |
| **Image** | —         | —        | 4K img | Geração de imagens  |

### 16.2 Thinking Levels (Controle de Custo)

| Level    | Tokens pensamento | Custo  | Quando                  |
| -------- | ----------------- | ------ | ----------------------- |
| `none`   | 0                 | Mínimo | Tradução, formatação    |
| `low`    | ~1K               | Baixo  | Classificação, extração |
| `medium` | ~8K               | Médio  | Código, análise         |
| `high`   | ~32K              | Alto   | Matemática, raciocínio  |

### 16.3 Native Tools

- **Google Search**: dados em tempo real dentro do prompt
- **Code Execution**: sandbox Python server-side
- **Function Calling**: schema JSON → modelo invoca funções do dev
- **MCP nativo**: `mcpToTool(mcpClient)` converte MCP tools em ferramentas Gemini
- **Image Generation**: até 4K, texto legível, multi-step editing

### 16.4 Pandômetro (Billing)

```text
Custo por request = (tokensIn/1000 × rateIn) + (tokensOut/1000 × rateOut)
```

Metered via `pf_meter.rs` no Rust Agent → custo em PC → Firebase.

---

## 17. 🔬 Colab HPC (BYOC — Bring Your Own Compute) {#17-colab}

> **Fonte:** PF_COLAB_REFERENCE.md (357 linhas completas)

### 17.1 Modelo Híbrido

| Tier            | Acesso                          | GPU       | Custo       |
| --------------- | ------------------------------- | --------- | ----------- |
| **Free (BYOC)** | User usa conta Google própria   | T4 (free) | $0          |
| **Premium**     | Templates avançados, prioridade | T4/A100   | Panda Coins |

O user traz compute — o Panda traz templates + orquestração.

### 17.2 Catálogo de Notebooks

| Template            | GPU | Função                              | PC custo |
| ------------------- | --- | ----------------------------------- | -------- |
| `panda-ml-train`    | T4  | Fine-tuning modelos PyTorch/TF      | 50 PC    |
| `panda-data-clean`  | CPU | ETL e limpeza de datasets           | 10 PC    |
| `panda-image-gen`   | T4  | Geração de imagens Stable Diffusion | 30 PC    |
| `panda-voice-clone` | T4  | Clonagem de voz TTS                 | 40 PC    |
| `panda-video-edit`  | T4  | Edição e rendering de vídeo         | 60 PC    |
| `panda-build-rust`  | CPU | Compilação Rust Agent               | 5 PC     |

### 17.3 Compliance Colab ToS

- ✅ Uso educacional/pesquisa (templates de ML)
- ✅ Templates pagos como "premium educational content"
- ❌ Proibido: mining de cripto, scraping massivo, uso comercial direto de compute

### 17.4 Receita Colab

| Feature                     | Revenue      | Destino          |
| --------------------------- | ------------ | ---------------- |
| Templates premium           | 100% Panda   | Educação + Ops   |
| GPU hours via Panda Coins   | PC queimados | Deflação natural |
| Tutoriais/cursos integrados | Split 52/48  | Dev + Panda      |

---

## 18. 🌍 Universal Platform Vision {#18-universal}

> **Correção de escopo:** Análises anteriores focavam no "nicho moveleiro". Isso é **errado**. O Panda Factory é uma **plataforma universal para desenvolvedores**, limitada apenas pelo SDK.

### 18.1 O Que o SDK Permite (17 Namespaces)

| Namespace        | Capacidade                           | Potencial                  |
| ---------------- | ------------------------------------ | -------------------------- |
| `Panda.Brain`    | AI multi-model (Gemini, local, BYOL) | Qualquer vertical AI       |
| `Panda.Canvas`   | TLDraw 2D design                     | Design, CAD, whiteboard    |
| `Panda.Store`    | Marketplace Medusa                   | Qualquer módulo/plugin     |
| `Panda.Bridge`   | Rust Agent MCP                       | Desktop automation, IoT    |
| `Panda.P2P`      | Compute network                      | GPU rental, AI inference   |
| `Panda.Mining`   | Crypto + Web Mining                  | Revenue passiva            |
| `Panda.Hooks`    | Bidirectional webhooks               | Integração qualquer market |
| `Panda.Events`   | Multi-window sync                    | PDV, vitrines, totems      |
| `Panda.Polyglot` | 200 idiomas offline                  | SaaS global                |
| `Panda.Colab`    | GPU HPC via Google                   | ML, training, rendering    |

### 18.2 Verticals Possíveis (Sem Limite)

| Vertical              | Módulos SDK                   | Exemplo                          |
| --------------------- | ----------------------------- | -------------------------------- |
| **Móveis planejados** | Canvas + Store + PDV          | Projeto 3D + orçamento           |
| **Trading**           | Brain + Bridge (DLL) + Mining | Bot MT5 + sinais IA              |
| **Social Media**      | Brain + Hooks + Store         | Automação Instagram/TikTok       |
| **EdTech**            | Brain + Colab + Store         | Cursos IA + GPU prática          |
| **IoT Industrial**    | Bridge (ESC-POS, COM) + P2P   | Monitoramento + automação        |
| **Healthcare**        | Brain + Polyglot              | Laudos IA + multi-idioma         |
| **Legal**             | Brain + fs_read               | Análise contratual com IA        |
| **Governo**           | Tentacle custom + API pública | Integração gov.br, SEFAZ, DETRAN |
| **Enterprise**        | Tentacle custom + API própria | ERP/CRM via hooks                |

> O moveleiro é o **vertical de bootstrap** — não o limite da plataforma.

### 18.3 🐙 Tentacle Extensibility — Dev Escolhe Onde Plugar

> **Fonte:** PF_SDK_REFERENCE.md §Tentacle Architecture + PF_MEDUSA_REFERENCE.md §8-9

Quando um dev publica na Medusa Store, ele escolhe um dos **3 tipos** (`panda.manifest.json → type`):

| Tipo       | O Que É                          | Entry Point  | Exemplo                          |
| ---------- | -------------------------------- | ------------ | -------------------------------- |
| `module`   | App no canvas container          | `index.html` | Orçamentista 3D, Editor de vídeo |
| `tentacle` | Hook de sistema que estende APIs | `index.js`   | Integração gov.br, API Shopify   |
| `theme`    | Tema visual (CSS)                | `theme.css`  | Dark mode premium                |

**O fluxo do dev que cria um tentacle:**

```text
1. Dev cria pasta @fulano/meu-tentaculo/
   ├── panda.manifest.json (type: "tentacle")
   ├── index.js (registra no TentacleMonitor)
   └── README.md

2. No index.js, escolhe QUAL tentáculo pai:
   TentacleMonitor.registerChild('google', 'meu-servico');  // Estende Google
   TentacleMonitor.registerChild('social', 'nova-rede');    // Estende Social
   // OU cria um tentáculo NOVO:
   TentacleMonitor.registerTentacle('governo', { ... });    // Novo tentáculo!

3. Publica via Medusa → aparece em tentacles.json no registry
4. Users instalam → TentacleMonitor integra na árvore
```

**5 tentacles implementados (Jan/2026) + 6 planejados:**

| Status | Tentáculo        | Children                                             |
| ------ | ---------------- | ---------------------------------------------------- |
| ✅     | **social**       | WhatsApp, Twitter, YouTube, Meta, Telegram, TikTok   |
| ✅     | **trading**      | cTrader                                              |
| ✅     | **brain**        | Gemini (6 GEMs), GPU                                 |
| ✅     | **google**       | Drive, Sheets, Colab, Calendar, Docs, Gmail, YouTube |
| ✅     | **distribution** | itch.io, PWA, Panda Arcade                           |
| 📋     | **education**    | Kiwify, Hotmart, Eduzz                               |
| 📋     | **gaming**       | Godot, Bevy, ThreeJS, PixiJS                         |
| 📋     | **audio**        | ToneJS, ElevenLabs, Whisper, Suno                    |
| 📋     | **video**        | FFmpeg, Remotion, Veo                                |
| 📋     | **compute**      | Colab, P2P Hosts                                     |
| 🆕     | **custom**       | **Qualquer API — dev cria o parent**                 |

> [!TIP]
> **O poder dos tentáculos custom:** Um dev cria `@fulano/gov-br` → `registerTentacle('governo')` com children `sefaz`, `receita`, `detran`. Outro cria `@empresa/erp-sap` → `registerTentacle('enterprise')` com children `sap`, `oracle`, `salesforce`. **O SDK cresce organicamente via devs, não via core team.**

### 18.4 Documentation-First = Strategic Advantage

A abordagem DDD com MCP headers e fragmentação SSoT **NÃO é atraso** — é **acelerador**:

| Sem DDD                                | Com DDD (Panda)                              |
| -------------------------------------- | -------------------------------------------- |
| Código first → refactor 6 meses depois | Doc-aligned → código correto na primeira vez |
| 1 monolito → vendor lock-in            | 16 docs modulares → trocar provider é swap   |
| Onboarding dev: "leia o código"        | Onboarding dev: "leia o MCP header"          |
| Cross-ref manual → drift inevitável    | Cross-ref enforced → CONTEXT.md router       |

**O caminho correto:** Alinhar docs → CNPJ → hooks → código de produção. O investimento em planejamento **reduz** o time-to-market real porque elimina retrabalho.

---

## 19. 📡 MCP Offline-First Architecture {#19-mcp-offline}

> **Fonte:** PF_MCP_REFERENCE.md Parts C-D (618 linhas completas)

### 19.1 Dual-Mode MCP

| Aspecto       | 🌐 Web MCP Server | 🦀 Rust MCP Server |
| ------------- | ----------------- | ------------------ |
| **Transport** | HTTPS             | stdio              |
| **Auth**      | Firebase Auth     | Ed25519 local      |
| **Cache**     | IndexedDB         | SQLite             |
| **Offline**   | SW + IDB          | 100% local         |

### 19.2 MCP Registry Central (Firebase Firestore)

```text
/mcp_registry/{pluginId}
├── manifests[]     (todos os plugins registrados)
├── capabilities[]  (tools/resources/prompts)
└── versions[]      (versionamento de schemas)
```

### 19.3 MCP Manifest (panda.mcp.json)

Todo plugin **DEVE** ter manifest com: `name`, `version`, `mcp.tools[]`, `pricing`, `permissions`. Validação **Panda Defend**: parse JSON → validar tools → validar permissões → sandbox test 30s → score mínimo 70/100.

### 19.4 Offline Fallback Chain

```text
REQUEST →  GAS (Cloud) → FAIL
                           ↓
                    RUST AGENT (Local) → FAIL
                                          ↓
                                  INDEXED_DB (Cache) → FAIL
                                                        ↓
                                                GRACEFUL DEGRADATION
```

**Cache Strategy:** TTL Jitter (Config 7d, Profile 1h±25%, Balance 5min±50%, Prices 1min±30%) + stale-while-revalidate + sync on reconnect.

### 19.5 Context Injection + Supercompaction

Toda mensagem ao Brain inclui contexto UI automaticamente (canvas shapes, panels, selection, theme). **Supercompactação** reduz tokens: abreviações (`canvas`→`c`), limite 2 níveis profundidade, sampling arrays (>10 → 3 samples + count). **Resultado:** 1200 chars → 120 chars (90% redução).

### 19.6 3-Tier Access Matrix (13 Tools)

| Tool                                                    | User (3) | Dev (2) | Founder (1) |
| ------------------------------------------------------- | -------- | ------- | ----------- |
| screen_capture, click, fs_read/write, notify, gpu_check | ✅       | ✅      | ✅          |
| code_edit, terminal, git, debug                         | ❌       | ✅      | ✅          |
| pat_checkin, governance, treasury                       | ❌       | ❌      | ✅          |

---

## 20. Matriz de Risco & Veredicto Final {#20-veredicto}

### Riscos

| #   | Risco                       | Prob.  | Impacto    | Mitigação                       |
| --- | --------------------------- | ------ | ---------- | ------------------------------- |
| ①   | Breach segurança pré-launch | 🟡 50% | 🔴 Crítico | Firebase Rules + CSP ANTES      |
| ②   | Devs não vêm (chicken-egg)  | 🔴 80% | 🔴 Alto    | Pipeline dev→publish→earn 8 sem |
| ③   | BigTech comoditiza          | 🟡 60% | 🟡 Médio   | Nichos grey hat                 |
| ④   | GAS escala                  | 🟢 30% | 🟡 Médio   | User-side até ~100K             |
| ⑤   | Mining inviável             | 🟡 40% | 🟡 Médio   | Mining Zero contingency         |
| ⑥   | Hold crypto volatilidade    | 🟡 50% | 🟡 Médio   | Liquidação automática rules     |

### Prioridade de Implementação

```text
 IMPACTO
   ▲
 9 │ [1] DX Pipeline (dev→publish→earn)         ← FEATURE #1
   │ [2] Firebase Rules + CSP                   ← P0 segurança
   │ [3] SDK/UI refinement                      ← Em andamento
 6 │ [4] Hooks Inbound (Kiwify/Hotmart)         ← Lock-in mechanics
   │ [5] Google Partnership formal              ← Strategic
   │ [6] Dual Pitch docs                        ← B2B + Community
 3 │ [7] Multi-Window PiP                       ← Parcialmente feito
   │ [8] Mining Rust Agent                      ← Phase 2
   │ [9] P2P Compute Network                   ← Phase 2
   │ [10] DePIN Ghost Fleet                     ← Phase 3+
   │ [11] Token On-chain + DEX                  ← Phase 2
   └──────────────────────────────────────────▶ URGÊNCIA
```

### O Projeto Deve Continuar? **SIM — com disciplina.**

**3 vantagens que ninguém mais oferece juntas:**

1. **$0 infrastructure cost** (Client-Side First + GAS User-Side)
2. **Zero censorship** (Bill of Rights Art. 9 — trading, scraping, grey hat)
3. **BYOL** (não depende de vendor lock-in de modelo AI)

**+ 8 pilares arquiteturais que sustentam a tese:**

4. **Hooks bidirecionais** → lock-in via data gravity
5. **Multi-Window PiP** → diferencial real (PDV dual-screen)
6. **Mining fiscal sovereignty** → isolamento tributário do user
7. **GAS user-side** → escala linear sem custo infra
8. **Google Partner natural** → funnel de onboarding GCP
9. **16 módulos Rust Agent** → capacidades desktop impossíveis no browser
10. **Gemini 3 nativo** → thinking levels + function calling + MCP
11. **P2P 5-tier compute** → DePIN com task fractionation + vector clocks

### Top 3 Decisões AGORA

| #     | Decisão                                     | Racional                       |
| ----- | ------------------------------------------- | ------------------------------ |
| **1** | **Pipeline dev→publish→earn funcional**     | Sem isso, marketplace é ficção |
| **2** | **Segurança básica (Firebase Rules + CSP)** | 6 horas que protegem anos      |
| **3** | **Concluir alinhamento DDD → CNPJ → hooks** | Base sólida antes de código    |

### O Que NÃO Mudar

- ✅ Documentation-First DDD com MCP headers — é acelerador, não atraso
- ✅ Modelo 90/10 (Web/Desktop), Rust Agent power-user, Medusa dual-channel
- ✅ 14 Artigos da Constituição (implementar gradualmente)
- ✅ Hooks bidirecionais como core mechanic do SDK
- ✅ 3 Deployment Tiers (Shell/Hybrid/Full) com white-label
- ✅ Plataforma universal — SDK é o limite, não o nicho

---

## 🐼 COUNCIL REPORT v7.0

**Timestamp:** 2026-02-14T12:30:00-03:00
**Classification:** PAT/STRATEGY
**Status:** ✅ Viável — Executar com Disciplina
**SSoT Coverage:** 8/8 documentos lidos na íntegra (~6.300+ linhas)

| Cadeira         | Voto | Comentário                                       |
| --------------- | ---- | ------------------------------------------------ |
| 🎨 UX           | ⚠️   | DX inexistente — pipeline é feature #1           |
| 📣 MKT          | ✅   | Dual Pitch definido + universal positioning      |
| 💼 SALES        | ✅   | Revenue reframe via MoR funciona                 |
| 🏗️ DEV          | ✅   | 11 pilares arquiteturais defensáveis             |
| ⚡ GAS          | ✅   | User-side resolve até ~100K users                |
| 🔥 CLOUD        | 🔴   | Firebase Rules NÃO configuradas — P0             |
| 🦀 SEC          | 🔴   | Segurança 100% no papel — P0                     |
| 🪙 DEFI         | ⚠️   | Token economy → Phase 2                          |
| 🔄 HOOKS        | ✅   | Core bidirecional — lock-in real                 |
| ⛏️ MINING       | ✅   | Arch sólida + fiscal sovereignty + contingency   |
| 🖥️ PiP          | ✅   | Diferencial competitivo real                     |
| 🤝 PARTNER      | ⚠️   | Natural fit, zero partnership formal             |
| ☁️ CLOUD FOMENT | ✅   | **5-tier fallback + $0 bootstrap**               |
| 🖥️ NODES        | ✅   | **5-tier Seed→Titan + task fractionation**       |
| 🦀 RUST         | ✅   | **16 módulos — coverage desktop completo**       |
| 🤖 GEMINI       | ✅   | **3 modelos + thinking + MCP nativo**            |
| 🔬 COLAB        | ✅   | **BYOC GPU T4 + 6 templates**                    |
| 🌍 UNIVERSAL    | ✅   | **SDK é o limite, não o nicho**                  |
| 📡 MCP-OFFLINE  | ✅   | **Dual-mode + fallback chain + supercompaction** |

**Final Verdict:**

- Constitution Compliance: ✅ Passed
- Security Gate: 🔴 **FAILED** (Firebase Rules + CSP pendentes)
- Strategic Viability: ✅ **Viável — Executar com Disciplina**
- Architectural Depth: ✅ **11 pilares defensáveis confirmados**
- SSoT Coverage: ✅ **8/8 documentos analisados integralmente**
- Documentation-First: ✅ **DDD com MCP headers é acelerador estratégico**

> **O Panda Factory tem o planejamento certo. O alinhamento DDD→CNPJ→hooks→código é o caminho que transforma 16 docs em produto real sem dívida técnica.**
