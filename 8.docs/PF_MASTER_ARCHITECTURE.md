---
tool_context: panda/architecture
description: Master Architecture - Full system design, hubs, infrastructure, and technical specifications
version: 3.6.0
updated: 2026-03-04
ssot: CONTEXT.md §5 (Sistema Montesquieu)
cross_ref:
  [
    PF_FILE_REGISTRY.md,
    PF_SDK_REFERENCE.md,
    PF_UI_REFERENCE.md,
    PF_GOOGLE_SUITE.md,
    PF_GITHUB_REFERENCE.md,
    PF_MODULE_AGENDA.md,
    PF_MODULE_PDV.md,
    PF_MODULE_ESTOQUE.md,
  ]
---

# 🐼 Panda OS - Arquitetura Completa

![Panda Logo](../10.assets/panda_logo_original.jpg)

> **Documento Mestre de Arquitetura**
> Consolidação unificada seguindo o Mapa Visual do Projeto.
> Frontend → SDK → Backend Distribuído (3 Pilares).
> **Atualizado:** 2026-02-22 | JAM UI v6.5 | Vite Deploy Ready

---

## §0.1 🧭 GPS DO PROJETO — Mega Mindmap

> **Leia primeiro. Qualquer IA que abrir este doc saberá em 30 segundos onde cada coisa está.**

```text
🐼 PANDA FACTORY — MAPA COMPLETO DO ECOSSISTEMA
══════════════════════════════════════════════════════════════════════════

📦 CORE ─────────────────────────────────────────────────────────────────
│
├── 🐼 SDK (18 namespaces, 37 arquivos)
│   ├── Panda.Brain        → AI multi-model (Gemini, BYOL)
│   ├── Panda.Canvas       → TLDraw 2D design
│   ├── Panda.Store        → Medusa marketplace
│   ├── Panda.Bridge       → Rust Agent MCP
│   ├── Panda.P2P          → Compute network
│   ├── Panda.Mining       → Crypto + Web Mining
│   ├── Panda.Hooks        → Webhooks bidirecionais
│   ├── Panda.Events       → Multi-window sync
│   ├── Panda.Polyglot     → 200 idiomas offline
│   ├── Panda.Colab        → GPU HPC via Google
│   ├── Panda.Cache        → Offline sync + TTL jitter + staleWhileRevalidate
│   └── +7 (Wallet, Auth, DRM, i18n, Workflow, Firebase, Telemetry)
│   📄 PF_SDK_REFERENCE.md (83KB) │ Keywords: namespace, tentacle, hook, callGAS
│
├── 🎨 UI / Design System
│   ├── JAM Layout (sidebar + canvas + dock)
│   ├── CSS tokens (--pf-*), Dark/Light themes
│   ├── 23 React components + 8 custom hooks
│   └── Responsive PWA (offline-first)
│   📄 PF_UI_REFERENCE.md │ Keywords: token, CSS, componente, tema
│
└── 🧠 Brain / Gemini 3
    ├── 3 modelos (Flash, Pro, Deep Think)
    ├── 5 thinking levels (none → max)
    ├── GAS → Gemini API → Pandômetro → PC billing
    └── MCP native tools (grounding, code exec, search)
    📄 PF_GEMINI_REFERENCE.md (673L) │ Keywords: model, thinking, billing, GEM

🔧 INFRAESTRUTURA ───────────────────────────────────────────────────────
│
├── ☁️ GAS Backend (18 .gs files, Tri-Mode Dispatcher)
│   ├── PF_Dispatcher.gs → Router (mode: ai | operation | admin)
│   ├── 9 core modules + 4 domain modules + SDKs pagamento
│   └── Teto: ~50-100K users (user-side GAS)
│   📄 PF_GAS_REFERENCE.md │ Keywords: dispatcher, doPost, endpoint, GAS
│   📄 PF_BACKEND_REFERENCE.md │ Keywords: fallback, circuit-breaker, PWA
│
├── 🔥 Firebase (Validation Hub — Control Plane)
│   ├── Auth: Email + Google sign-in (unlimited)
│   ├── RTDB: itens validados, dev updates, heartbeat
│   └── NÃO é main compute → client-side é o data plane
│   📄 PF_BACKEND_REFERENCE.md §7 │ Keywords: RTDB, auth, validation
│
├── 🦀 Rust Agent (Tauri + MCP, 16 módulos)
│   ├── Core (6): Crypto, GPU, Health, Main, MCP, Mining
│   ├── Ext (9): AI/ML, Financeiro, RPA, IoT, Polyglot, RIG, Token, MultiUser, Cache
│   ├── ❌ B.5 Local AI Brain REMOVIDO (compete com Gasômetro)
│   └── ✅ B.6 Polyglot (NLLB-200 tradução + Whisper STT)
│   📄 PF_BACKEND_REFERENCE.md §A-B │ Keywords: Tauri, Rust, MCP, GPU, mining
│
└── 🔌 MCP (Model Context Protocol, Dual-Mode)
    ├── Web: GAS-backed (health, wallet, catalog)
    ├── Rust: native (gpu_info, sign, verify, public_key)
    ├── 3-tier access (basic, extended, partner)
    └── Offline fallback chain → IndexedDB → graceful degradation
    📄 PF_MCP_REFERENCE.md (618L) │ Keywords: tool, resource, prompt, offline

💰 ECONOMIA ─────────────────────────────────────────────────────────────
│
├── 🪙 Panda Coin (PC) — Tokenomics
│   ├── Emissão: mining (Web + HW), aquisição, gamificação
│   ├── Queima: Store compras, AI billing, premium, Colab
│   ├── Break-even: 3 consumidores : 1 minerador
│   └── Inflation control: Auto-throttle, SLA suspend
│   📄 PF_ECONOMY_REFERENCE.md (94KB) │ Keywords: PC, mint, burn, split, tier
│
├── 🐍 Medusa Store (Marketplace)
│   ├── Split Store: 70/25/5 | Usage (PC): 40/55/5 (Split Master v3.1)
│   ├── Modelo C (Híbrido): native store + external hooks
│   ├── MoR via Paddle (46 países sem CNPJ)
│   └── Lifecycle: upload → validate → publish → monetize
│   📄 PF_MEDUSA_REFERENCE.md │ Keywords: publish, split, marketplace, scoring
│
├── ⛏️ Mining + P2P Compute
│   ├── 5-tier nodes: Seed (CPU) → Sprout → Sapling → Oak → Titan (4x GPU)
│   ├── DUAL-PURPOSE: mining + task allocation simultâneos (70/20/10 split)
│   ├── Task Fractionation: AI_INFERENCE, IMAGE_RENDER, VIDEO_ENCODE, etc.
│   ├── P2P rental: 95% owner / 5% Panda
│   └── Vector clocks para event sync distribuído
│   📄 PF_P2P_REFERENCE.md (593L) │ Keywords: node, tier, mining, task, chunk
│
└── 🔬 Colab HPC (BYOC — Bring Your Own Compute)
    ├── Free: user traz conta Google (T4 grátis)
    ├── Premium: templates avançados por PC
    └── 6 notebooks template (ML, data, image, voice, video, build)
    📄 PF_COLAB_REFERENCE.md (357L) │ Keywords: notebook, GPU, template, BYOC

🐙 TENTACLES (Extensibilidade) ─────────────────────────────────────────
│
├── 5 Parents Implementados:
│   ├── social     → WhatsApp, Twitter, YouTube, Meta, Telegram, TikTok
│   ├── trading    → cTrader
│   ├── brain      → Gemini (6 GEMs), GPU
│   ├── google     → Drive, Sheets, Colab, Calendar, Docs, Gmail, YouTube
│   └── distribution → itch.io, PWA, Panda Arcade
│
├── 6 Parents Planejados:
│   ├── education, gaming, audio, video, compute, custom
│   └── custom = dev cria parent novo (registerTentacle)
│
├── Manifest: panda.manifest.json (type: module | tentacle | theme)
│   📄 PF_SDK_REFERENCE.md §Tentacle │ Keywords: registerChild, registerTentacle
│   📄 PF_MEDUSA_REFERENCE.md §8-9 │ Keywords: manifest, publish, validate
│
└── Fluxo: Dev cria → manifest → publica Medusa → users instalam → TentacleMonitor integra

🛡️ SEGURANÇA ────────────────────────────────────────────────────────────
│
├── Panda Defend (3 camadas: Pre-pub, Post-pub, User-side)
│   ├── 14 Semgrep rules documentadas
│   ├── Ed25519 Kill Switch (Founder-only)
│   └── Plugin Sandbox (30s timeout — PLANEJADO)
│   📄 PF_SECURITY_REFERENCE.md │ Keywords: defend, semgrep, kill-switch, sandbox
│
├── Constituição (14 Artigos)
│   ├── Founder soberania, splits imutáveis, red lines
│   └── 🔴 NUNCA alterar sem aprovação explícita do Founder
│   📄 PF_PAT_FOUNDER_CONSTITUTION.md │ Keywords: artigo, soberania, veto
│
└── ✅ P0 Gaps Addressed: CSP Headers ✅, Firebase Rules ✅, HMAC webhooks [/]

📴 RESILIÊNCIA OFFLINE / CACHE (P0 — Diferencial Guerrilha) ───────────
│
├── 🔧 Service Worker (sw.js) — Stale-While-Revalidate
│   ├── Cacheia: HTML shell, SDK, CSS, Chart.js, manifest.json
│   ├── Estratégia: retorna cache + busca rede em background
│   └── Resultado: app carrega INSTANTÂNEO mesmo sem internet
│
├── 💾 IndexedDB (Client-Side Persistence)
│   ├── MCP manifests, user data, tentacle states
│   ├── Panda.Cache module (TTL jitter + staleWhileRevalidate)
│   └── Catálogo Medusa + módulos já instalados
│
├── 🔗 MCP Offline Fallback Chain (PF_MCP_REFERENCE.md §D)
│   ├── REQUEST → GAS (Cloud) → FAIL
│   ├──                        → RUST AGENT (Local) → FAIL
│   ├──                                              → INDEXED_DB (Cache)
│   └──                                              → GRACEFUL DEGRADATION
│
├── 🔄 Sync on Reconnect (Automático)
│   ├── 1. Flush pending operations queue
│   ├── 2. Invalidate stale caches
│   └── 3. Refresh critical data (wallet, oracle)
│
├── 🎯 ARGUMENTO DE VENDA GUERRILHA:
│   ├── "Caiu a internet? Seu app continua rodando."
│   ├── UI + dados funcionais via SW cache client-side
│   ├── MCP/IA pausa e retoma automaticamente ao reconectar
│   └── Zero perda de trabalho — tudo sincroniza depois
│   📄 PF_MCP_REFERENCE.md §C.3 + §D │ Keywords: cache, offline, fallback, SW
│   📄 PF_SDK_REFERENCE.md §Panda.Cache │ Keywords: TTL, jitter, strategy
│
└── ⚠️ O que NÃO funciona offline:
    ├── Gemini AI (cloud-only — pausa com aviso visual)
    ├── Novas compras de PC (requer Stripe/webhook)
    └── P2P Compute (requer rede)

🚀 DISTRIBUIÇÃO & ESTRATÉGIA ────────────────────────────────────────────
│
├── 📋 Catálogo OSS & Compliance
│   📄 PF_OPENSOURCE_CATALOG.md │ Keywords: licença, npm, dependência
│
├── 📁 File Registry (274+ arquivos catalogados)
│   📄 PF_FILE_REGISTRY.md │ Keywords: arquivo, versão, status, diretório
│
├── 🤖 Persona IA (constituição do agente público)
│   📄 PF_AGENT_CONSTITUTION.md │ Keywords: persona, tom, regras, conselho
│
├── 🌐 Google Suite (Ecossistema Google completo)
│   ├── ADK, A2A, Gemini 3 pricing, Firebase Studio, Cloud Free Tier
│   ├── PWA Tooling, Vertex AI, Workspace APIs, Distribution Channels
│   └── Programas: GEAR, GDE, Accelerator, GSoC
│   📄 PF_GOOGLE_SUITE.md │ Keywords: ADK, A2A, GenAI, GEAR, Gemini
│
├── 🌍 Universal Platform Vision
│   ├── NÃO é nicho moveleiro — é plataforma universal
│   ├── 9+ verticals possíveis (moveleiro é bootstrap)
│   └── SDK define capacidades; mercado define uso
│
└── 📜 Documentation-First (DDD + MCP headers)
    ├── 17 docs SSoT, cross-ref enforced, CONTEXT.md router
    └── Caminho: Alinhar docs → CNPJ → hooks → código produção

══════════════════════════════════════════════════════════════════════════
LEGENDA: 📄 = Doc SSoT  |  ✅ = Implementado  |  📋 = Planejado  |  ❌ = Gap/Removido
17 DOCS: MASTER_ARCH, SDK, UI, BACKEND, GAS, GEMINI, MCP, P2P, COLAB,
         ECONOMY, MEDUSA, SECURITY, PAT_CONST, AGENT_CONST, OPENSOURCE, FILE_REG,
         GOOGLE_SUITE
══════════════════════════════════════════════════════════════════════════
```

---

## §0.2 🗺️ ROADMAP MASTER — O Mapa Vivo

> **Filosofia:** O roadmap vive onde a arquitetura vive. Cada task referencia a seção e linhas exatas onde sua especificação está definida.
> **Modelo:** Foundation ✅ → Founder Solo 🚧 → Guerrilha 🎯 → Flywheel ⏳ → Escala ⏳
> **SSoT complementar:** `PF_ECONOMY_REFERENCE.md` (splits), `PF_SECURITY_REFERENCE.md` (defend), `PF_MEDUSA_REFERENCE.md` (store)
> **Pagamento:** Stripe Brasil Direto (CPF, sem CNPJ, MoR via Managed Payments) + Paddle (fallback)
> **Regra:** Append-only. Nunca remover tasks — apenas atualizar status.

```text
LEGENDA DE STATUS:
  [x] = Concluído    [/] = Em Progresso    [ ] = Pendente    [~] = Mock/Parcial
```

### PARTE I — FUNDAMENTOS (§1-§2)

| Status | #   | Task                                       | Etapa  | Seção Ref          | Linhas               | Doc SSoT         |
| ------ | --- | ------------------------------------------ | ------ | ------------------ | -------------------- | ---------------- |
| [x]    | 2   | Firebase Auth (Email + Google providers)   | E1-S1A | §1. Visão Geral    | 381-816              | `CONTEXT.md §11` |
| [x]    | 5   | SDK Auth wiring (mock→Firebase Auth real)  | E1-S1A | §2. Hook / §4. SDK | 817-1002 / 1386-1434 | `SDK_REF §Auth`  |
| [x]    | 16  | Google Sign-in real (remover "Soon" badge) | E1-S1D | §1. Visão Geral    | 381-816              | `CONTEXT.md §11` |

### PARTE II — ARQUITETURA TÉCNICA (§3-§7)

| Status | #   | Task                                                             | Etapa  | Seção Ref                   | Linhas                | Doc SSoT              |
| ------ | --- | ---------------------------------------------------------------- | ------ | --------------------------- | --------------------- | --------------------- |
| [x]    | 1   | Firebase RTDB Rules + Schema                                     | E1-S1A | §5.2 Firebase RTDB          | 1559-1692             | `BACKEND_REF §7`      |
| [x]    | 3   | GAS Deploy como Web App (doPost público)                         | E1-S1A | §5.1 GAS Backend            | 1435-1558             | `GAS_REF`             |
| [x]    | 4   | GAS Webhook handler Kiwify/Hotmart (funcional)                   | E1-S1A | §5.1 GAS Backend            | 1435-1558             | `SDK_REF`, `ECON_REF` |
| [x]    | 6   | SDK Wallet wiring (mock→RTDB real)                               | E1-S1A | §4. SDK / §5.2 Firebase     | 1386-1434 / 1559-1692 | `SDK_REF §Wallet`     |
| [x]    | 7   | CSP + SRI + CORS security headers                                | E1-S1A | §7. Segurança               | 2157-2496             | `SECURITY_REF`        |
| [x]    | 12  | Chat AI funcional (Gemini 3.0 endpoint real)                     | E1-S1C | §1.3 Brain / §5.1 GAS       | 58-63 / 1435-1558     | `GEMINI_REF`          |
| [/]    | 13  | PWA real (vite-plugin-pwa, SW funcional)                         | E1-S1C | §3. Frontend                | 1003-1385             | `CONTEXT.md §9`       |
| [/]    | 14  | Mobile/Responsive (CSS breakpoints)                              | E1-S1C | §3. Frontend                | 1003-1385             | `UI_REF`              |
| [x]    | 15  | GAS Heartbeat + Cron triggers                                    | E1-S1C | §5.2 Firebase (Heartbeat)   | 1709-1730             | `GAS_REF`             |
| [x]    | 17  | Onboarding pulsing dots (Phase 2 Wizard)                         | E1-S1D | §3. Frontend                | 1003-1385             | `CONTEXT.md §11`      |
| [ ]    | 17a | Sub: Ativação Encapsulado pós-compra (Hotmart→link→Panda→ativar) | E1-S1D | §3. Frontend / §10.5        | —                     | `MEDUSA_REF §10.5`    |
| [ ]    | 23  | MCP IPC Bridge (Rust ↔ SDK)                                      | E2-S2A | §5.3 Rust Agent / §6. Infra | 1777-1857 / 1858-2156 | `MCP_REF`             |
| [ ]    | 37  | Security Hardening full (SRI + Firebase Rules)                   | E3     | §7. Segurança               | 2157-2496             | `SECURITY_REF`        |

### PARTE III — ECOSSISTEMA ECONÔMICO (§8-§10)

| Status | #   | Task                                              | Etapa  | Seção Ref                     | Linhas                | Doc SSoT        |
| ------ | --- | ------------------------------------------------- | ------ | ----------------------------- | --------------------- | --------------- |
| [x]    | 8   | PC Economy Real — compra de pacotes ($20-$5K)     | E1-S1B | §8. Tokenomics                | 2497-2739             | `ECON_REF §9.1` |
| [x]    | 9   | Store Purchases Real — PC debit ao instalar       | E1-S1B | §8.4 Mercado / §11. Tentacles | 2605-2627 / 2765-2849 | `MEDUSA_REF`    |
| [x]    | 10  | Anúncios para PC na Store (Featured/Sponsored)    | E1-S1B | §8. Tokenomics                | 2497-2739             | `MEDUSA_REF P4` |
| [ ]    | 11  | Listing Kiwify/Hotmart — produto live + afiliados | E1-S1B | §8. Tokenomics                | 2497-2739             | —               |
| [ ]    | 18  | Store 12 extensões com preço real em PC           | E1-S1D | §11. Tentacles / §8. Token    | 2765-2849 / 2497-2739 | `MEDUSA_REF`    |
| [ ]    | 25  | Usage Split real (40% dev no consumo)             | E2-S2B | §8.2 Splits                   | 2540-2604             | `ECON_REF`      |
| [ ]    | 26  | Escrow system (7d Store / 90d Kiwify)             | E2-S2B | §8.2 Splits                   | 2540-2604             | `ECON_REF`      |
| [ ]    | 27  | Top 100 Devs desconto progressivo (10-30%)        | E2-S2B | §8.2 Splits                   | 2540-2604             | `ECON_REF §D`   |
| [ ]    | 28  | Referral Boost (1.2x mining 30d / 1.1x 15d)       | E2-S2B | §8. Tokenomics                | 2497-2739             | `ECON_REF`      |
| [ ]    | 29  | Co-produção split (85/10/5)                       | E2-S2B | §8.2 Splits                   | 2540-2604             | `ECON_REF`      |
| [ ]    | 30  | Panda Oracle real (spot price API)                | E3     | §8.1 Panda Coin               | 2497-2539             | `ECON_REF`      |
| [ ]    | 31  | Web Mining alpha (WASM, Smart Throttle, WebGPU)   | E3     | §9. P2P Compute               | 3592-3689             | `P2P_REF`       |
| [ ]    | 32  | Partner Mode Mining (XMRig/T-Rex via Rust)        | E3     | §9. P2P Compute               | 3592-3689             | `P2P_REF`       |
| [ ]    | 33  | Phantom Protocol (CPU limiter + auto-pause)       | E3     | §9. P2P Compute               | 3592-3689             | `P2P_REF`       |
| [ ]    | 34  | P2P Network alpha (WebRTC discovery)              | E3     | §9. P2P Compute               | 3592-3689             | `P2P_REF`       |
| [ ]    | 38  | Token Pipeline (off-chain PC → on-chain)          | E4     | §8. Tokenomics                | 2497-2739             | `ECON_REF`      |
| [ ]    | 39  | P2P Network real (libp2p, task routing, 5 tiers)  | E4     | §9. P2P Compute               | 3592-3689             | `P2P_REF`       |

### PARTE IV — HUBS DE INTEGRAÇÃO & DEV ECOSYSTEM (§11-§21)

| Status | #   | Task                                                     | Etapa  | Seção Ref                | Linhas                | Doc SSoT            |
| ------ | --- | -------------------------------------------------------- | ------ | ------------------------ | --------------------- | ------------------- |
| [ ]    | 19  | SDK Dev Portal público                                   | E2-S2A | §20. Dev Ecosystem       | 3218-3379             | `SDK_REF`           |
| [ ]    | 20  | Tutorial "Crie módulo em 2h" (built-in)                  | E2-S2A | §20. Dev Ecosystem       | 3218-3379             | `MEDUSA_REF`        |
| [ ]    | 21  | GitHub Actions panda-publish.yml template                | E2-S2A | §21. Pipeline Publicação | 3381-3586             | `MEDUSA_REF §4`     |
| [ ]    | 22  | Google Drive publish pipeline                            | E2-S2A | §21. Pipeline Publicação | 3381-3586             | `MEDUSA_REF §5`     |
| [ ]    | 24  | Featured Modules + Analytics na Store                    | E2-S2A | §21. Pipeline Publicação | 3381-3586             | `MEDUSA_REF P4`     |
| [/]    | 35  | i18n 100% (pt-BR, en, es)                                | E3     | §3. Frontend / §4. SDK   | 1003-1385 / 1386-1434 | `SDK_REF §i18n`     |
| [ ]    | 36  | MCP Multi-Monitor (PDV, totem, vitrine)                  | E3     | §20. Dev Ecosystem       | 3218-3379             | `MCP_REF`           |
| [ ]    | 40  | Publish Multi-Store (PlayStore, Apple, Steam)            | E4     | §15. App Factory         | 2905-3064             | `SDK_REF §Publish`  |
| [/]    | 41  | Casulo/BundleCreator MVP (Encapsulado — now in DevTools) | E1-S1B | §15. App Factory / §10.5 | 2905-3064             | `MEDUSA_REF §10.5`  |
| [ ]    | 42  | Colab HPC real (BYOC GPU dispatch)                       | E4     | §6.4 Hybrid Infra        | 1858-2156             | `COLAB_REF`         |
| [x]    | 43  | MCP Orchestrator + AI Context Injection                  | E1-S1D | §4.1 MCP / §17 UI        | MCP_REF §4.1          | `MCP_REF`, `UI_REF` |

### 🗓️ Cronograma Macro

```text
2026 — CRONOGRAMA GUERRILHA (Recalibrado 2026-02-20)
══════════════════════════════════════════════════════════════════════
  JAN         FEV              MAR              ABR              MAI
  ├───────────┼────────────────┼────────────────┼────────────────┤
  │ ETAPA 0   │ E1 LOTE 1-2   │ E1 LOTE 3-5   │ E1 LOTE 6     │
  │Foundation │ GAS Deploy ✅  │ Auth+Wallet   │ Chat+Store    │
  │  ✅ DONE  │ RTDB Rules     │ Webhook+Chat  │ PWA+Monitor   │
  │           │ Auth wiring    │ Economy       │ PRODUTO LIVE! │
  ├───────────┼────────────────┼────────────────┼────────────────┤

  MAI         JUN              JUL-AGO          SET-DEZ
  ├───────────┼────────────────┼────────────────┼────────────────┤
  │ E1 FASE2  │ E2 GUERRILHA   │ E2 GUERRILHA   │ E3 FLYWHEEL   │
  │ WhatsApp  │ 10 users       │ CRM+Agenda     │ Mining alpha  │
  │ CRM       │ Afiliados      │ 50 users       │ P2P discovery │
  │ Instagram │ R$2K/mês       │ R$5K/mês       │ 1K users      │
  ├───────────┼────────────────┼────────────────┼────────────────┤

  META ABR:   PRODUTO VENDÁVEL NO HOTMART (1ª VENDA REAL)
  META JUN:   10 USERS PAGANTES + 5 AFILIADOS + R$2K/MÊS
  META AGO:   50 USERS + 10 MÓDULOS + CRM FUNCIONAL + R$5K/MÊS
  META DEZ:   1K USERS + MINING ALPHA + P2P DISCOVERY
══════════════════════════════════════════════════════════════════════
```

### 📊 KPIs por Etapa

| Etapa               | Período    | Tasks  | KPI Principal                                       |
| ------------------- | ---------- | ------ | --------------------------------------------------- |
| **E0** Foundation   | Jan/26     | —      | ✅ Demo funcional + 17 docs SSoT                    |
| **E1** Founder Solo | Fev-Abr/26 | #1-18  | 1ª venda real + Chat AI + PWA + Anúncios PC         |
| **E2** Guerrilha    | Mai-Jul/26 | #19-29 | 10-20 afiliados convertidos + 10 módulos + R$5K/mês |
| **E3** Flywheel     | Q3-Q4/26   | #30-37 | 1K users + Mining alpha + P2P discovery             |
| **E4** Escala       | 2027+      | #38-42 | 10K users + Token pipeline + P2P real               |

### 🎯 Momento Guerrilha — Foco Absoluto (Decisão 2026-02-20)

> **"Guerrilha = só o que gera receita. O resto congela."**

**ESSENCIAL para 1ª venda (Lotes 1-3 do Sprint ETAPA1):**

| Prioridade | Ticket | O que faz           | Por quê                            |
| ---------- | ------ | ------------------- | ---------------------------------- |
| 🔴 P0      | #1     | RTDB Rules + Schema | ✅ **DONE** (deployed 2026-02-20)  |
| 🔴 P0      | #3     | GAS Deploy          | ✅ **DONE** (v13, 2026-02-20)      |
| 🔴 P0      | #4     | Webhook Hotmart     | Sem webhook, zero receita          |
| 🔴 P0      | #5     | SDK Auth wiring     | Sem auth, user ghost               |
| 🔴 P0      | #12    | Chat AI funcional   | Kill feature — razão do user pagar |
| 🟡 P1      | #6     | Wallet real         | Sem wallet, sem economia           |

**CONGELADO até ter receita (E3/E4):**

| Congelado | O que é                   | Por quê congela          |
| --------- | ------------------------- | ------------------------ |
| #31-34    | Mining + P2P              | Queima tempo sem receita |
| #38-39    | Token Pipeline + P2P real | Escala ≠ guerrilha       |
| #42       | Colab HPC                 | Luxo pra depois          |
| #40-41    | Multi-Store + Casulo      | Distribuição avançada    |

> [!IMPORTANT]
> **💎 Argumento Guerrilha #1 — Offline Resilience:**
> "Caiu a internet? Seu app continua rodando." — Service Worker + IndexedDB mantêm UI + dados 100% funcionais client-side. MCP/IA pausam com aviso visual e retomam automaticamente ao reconectar. **Zero perda de trabalho.** Nenhum SaaS concorrente oferece isso no free tier.
> 📄 Ref: `PF_MCP_REFERENCE.md §D` | `sw.js` | `PF_SDK_REFERENCE.md §Panda.Cache`

**Canal de venda único:** Hotmart (híbrido R$197 + R$29/mês) → Kiwify depois.

### 🎯 GTM: Flywheel de 3 Fases (Decisão Founder 2026-02-20)

> **Cross-Ref:** [PF_ECONOMY_REFERENCE.md §9.5](PF_ECONOMY_REFERENCE.md) — Flywheel Economy completo com split e métricas

```text
FLYWHEEL PANDA FACTORY — 3 FASES
═══════════════════════════════════════════════════════════════════

  FASE 1: FOUNDER SOLO (Fev-Abr)    FASE 2: DEV ECOSYSTEM (Mai-Jul)
  ┌────────────────────────┐         ┌──────────────────────────┐
  │ Founder produz         │         │ Devs criam módulos       │
  │ Encapsulados ──────────┼────►    │ GitHub/GDrive → Medusa   │
  │ Afiliados Hot/Kiwi     │  $$$    │ Freemium = bomba de PC   │
  │ vendem ────────────────┼────►    │ PDP = Landing automática │
  │ Receita fiat → Fase 2  │         │ Multi-hook: Store+Hot+   │
  └────────────────────────┘         │ Stripe                   │
                                     └──────────┬───────────────┘
                                                │
                                     FASE 3: FLYWHEEL (Q3-Q4)
                                     ┌──────────▼───────────────┐
                                     │  Devs = Afiliados        │
                                     │  Economia gira sozinha   │
                                     │  PC é moeda dominante    │
                                     │  PAT regula inflação     │
                                     └──────────────────────────┘

  CICLO VIRTUOSO:
                    ┌──────────────┐
              ┌────►│  MAIS DEVS   │────┐
              │     └──────────────┘    │
              │                         ▼
     ┌────────────────┐       ┌────────────────┐
     │  MAIS MÓDULOS  │       │  MAIS AFILIADOS│
     │  na Store      │       │  vendendo      │
     └────────────────┘       └────────────────┘
              ▲                         │
              │     ┌──────────────┐    │
              └────◄│ MAIS RECEITA │◄───┘
                    │  (PC circula)│
                    └──────────────┘

═══════════════════════════════════════════════════════════════════
```

**Conceito-chave: Encapsulado (Casulo)**

| Conceito        | O que é                                            | Quem cria                |
| --------------- | -------------------------------------------------- | ------------------------ |
| **Módulo**      | App standalone que roda no canvas container        | Devs + Core              |
| **Tentáculo**   | Hook que estende APIs do sistema                   | Core + Comunidade        |
| **Encapsulado** | Pacote vendável = N módulos + tentáculos agrupados | Founder (F1), Devs (F2+) |

> **Fase 1:** Founder cria encapsulados, salva IP no **Git SAAS** (repo privado), lista no Hotmart via exército de afiliados.
> **Fase 2:** Devs externos criam módulos/encapsulados. Multi-dev encapsulados **só vendem via Panda Store** (split automático). PDP = landing page automática.
> **Fase 3:** Devs viram afiliados, PC circula, PAT regula. Economia auto-sustentável.

**Por que o foco em afiliados (não direto ao infoprodutor):**

| Razão                         | Detalhe                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| **Já mora no Hotmart/Kiwify** | Canal de venda = canal de distribuição do Panda                 |
| **Zero custo de aquisição**   | Afiliados promovem sem Panda investir em ads                    |
| **Multiplica alcance**        | 1 encapsulado → N afiliados → N² end-users                      |
| **Valida product-market fit** | Se afiliados vendem, produto tem market fit                     |
| **Transição natural**         | Afiliado bom → vira dev → cria módulo → vira produtor (Fase 2+) |

**Ironia estratégica:** O afiliado usa a própria plataforma dele (Hotmart) pra vender um encapsulado que monitora a própria plataforma dele (Hotmart) via Panda. O produto se auto-distribui.

#### Bridges P0 — Prioridade Infoprodutor

> **Regra:** Bridges são escolhidos pelo DIA-A-DIA do infoprodutor, não por complexidade técnica.

| #   | Bridge             | API Base                    | Por que é P0                                 |
| --- | ------------------ | --------------------------- | -------------------------------------------- |
| 1   | `@panda/hotmart`   | Hotmart REST API + Webhook  | Ele já vende lá. Stats + affiliates + vendas |
| 2   | `@panda/kiwify`    | Kiwify REST API + Webhook   | Segunda plataforma. Mesma lógica             |
| 3   | `@panda/youtube`   | YouTube Data API v3 (OAuth) | Canal de divulgação. Métricas, SEO, schedule |
| 4   | `@panda/instagram` | Instagram Graph API (OAuth) | Funil de conteúdo. Insights, DMs, posts      |

> Esses 4 bridges atendem **100% do dia-a-dia** do infoprodutor.
> Com o Dashboard agregando esses 4, ele já tem razão pra pagar.

#### Execução: Fundação → Bridges → Dashboard

```text
FASE 1: FUNDAÇÃO (agora — Fev 2026)
├── ✅ Auth + Wallet + Webhooks
├── ✅ Store UI + 31 componentes
├── ✅ Chat AI (Gemini 3)
├── 🚧 GAS deploy + E2E test (TICKET-12)
└── 🚧 Login page GitHub Pages final

FASE 1.5: BRIDGES (Mar 2026 — P0)
├── Mapear endpoints de cada API (Hotmart, Kiwify, YouTube, Instagram)
├── Para cada: OAuth flow + 3-5 endpoints de leitura via GAS
├── MCP resource exposto pro Brain
└── Resultado: bridges funcionando = infra compartilhada

FASE 2: DASHBOARD (Abr 2026 — primeiro produto vendável)
├── Consome os bridges da fase 1.5
├── Agrega métricas de TODOS os serviços conectados
├── AI Insights via Brain ("suas vendas no Hotmart subiram 30%")
└── = PRODUTO VENDÁVEL no próprio Hotmart 🔄
```

#### Divulgação Guerrilha (pós-fundação)

| Canal                          | Audiência                     | Ação                                   |
| ------------------------------ | ----------------------------- | -------------------------------------- |
| **GitHub**                     | Devs técnicos                 | Repo público, README com demo, stars   |
| **Reddit**                     | r/SideProject, r/indiehackers | Posts mostrando o bridge reuse model   |
| **Product Hunt**               | Early adopters                | Launch com demo do Dashboard           |
| **Hotmart/Kiwify communities** | Infoprodutores                | "Venda software, não curso"            |
| **YouTube/Instagram**          | Audiência orgânica            | Tutoriais "Do zero ao módulo vendável" |

### 📋 Execução Detalhada (Sprint Docs)

> **O roadmap aqui é o MAPA. Os Sprint docs são o GPS passo-a-passo.**

| Sprint Doc                                       | Escopo                                    | Tickets         | Status         |
| ------------------------------------------------ | ----------------------------------------- | --------------- | -------------- |
| [SPRINT_ETAPA1.md](SPRINT_ETAPA1.md)             | Founder Solo — 17 tickets auditados       | #1-18           | 🚧 Em execução |
| [SPRINT_ETAPA1_FASE2.md](SPRINT_ETAPA1_FASE2.md) | Phase 2 — 14 módulos (WhatsApp, CRM, PDV) | Sub-fases 2A-2D | ⏳ Após E1     |

> Cada ticket nos Sprint docs tem: referências SSoT exatas, entregáveis numerados, e critérios de aceite com checkboxes.

### 📋 Inventário de Cobertura Documental

> Cada task está mapeada para o doc SSoT que define seus requisitos detalhados.

| Doc SSoT                   | Sigla | Tasks referenciadas                 |
| -------------------------- | ----- | ----------------------------------- |
| `CONTEXT.md`               | CTX   | #1,#2,#5,#7,#12,#13,#14,#15,#16,#17 |
| `PF_SDK_REFERENCE.md`      | SDK   | #4,#5,#6,#8,#12,#19,#23,#35,#40     |
| `PF_ECONOMY_REFERENCE.md`  | ECON  | #4,#8,#25,#26,#27,#28,#29,#30,#38   |
| `PF_BACKEND_REFERENCE.md`  | BE    | #1                                  |
| `PF_GAS_REFERENCE.md`      | GAS   | #3,#4,#15                           |
| `PF_GEMINI_REFERENCE.md`   | GEM   | #12                                 |
| `PF_MCP_REFERENCE.md`      | MCP   | #23,#36                             |
| `PF_MEDUSA_REFERENCE.md`   | MED   | #9,#10,#18,#20,#21,#22,#24,#41      |
| `PF_P2P_REFERENCE.md`      | P2P   | #31,#32,#33,#34,#39                 |
| `PF_SECURITY_REFERENCE.md` | SEC   | #7,#37                              |
| `PF_COLAB_REFERENCE.md`    | COL   | #42                                 |
| `PF_UI_REFERENCE.md`       | UI    | #14                                 |

---

## 📚 Arquivos de Referência

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                  DOCUMENTAÇÃO PANDA FACTORY (17 arquivos)                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ARQUITETURA & BACKEND                 SDK & INTEGRAÇÕES                  │
│  ├── PF_MASTER_ARCHITECTURE.md ★       ├── PF_SDK_REFERENCE.md ▸           │
│  ├── PF_BACKEND_REFERENCE.md           ├── PF_MCP_REFERENCE.md             │
│  ├── PF_GAS_REFERENCE.md               └── PF_GEMINI_REFERENCE.md          │
│  ├── PF_P2P_REFERENCE.md ▸                                                 │
│  └── PF_COLAB_REFERENCE.md                                                 │
│                                                                            │
│  FRONTEND & UI (Consolidado)           ECONOMIA (Consolidado)              │
│  └── PF_UI_REFERENCE.md ▸              ├── PF_ECONOMY_REFERENCE.md ▸       │
│      (CSS + HTML + JAM)                └── PF_MEDUSA_REFERENCE.md          │
│                                                                            │
│  GOVERNANÇA & SEGURANÇA                CATÁLOGO & ECOSYSTEM               │
│  ├── PF_AGENT_CONSTITUTION.md          ├── PF_OPENSOURCE_CATALOG.md        │
│  ├── PF_PAT_FOUNDER_CONSTITUTION.md    ├── PF_FILE_REGISTRY.md             │
│  └── PF_SECURITY_REFERENCE.md          └── PF_GOOGLE_SUITE.md ●           │
│                                                                            │
│  ★ = DOCUMENTO MESTRE    ▸ = MEGA-DOC CONSOLIDADO                          │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estrutura de Pastas do Projeto

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                         PANDA FACTORY - FOLDER MAP                          │
│                      📂 Estrutura Numerada (Padrão)                         │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📁 PandaFactory/                                                          │
│  ├── 📁 00.credentials/              # 🔒 Secrets (firebase, GAS, keys)    │
│  ├── 📁 .agent/                    # Workflows IA (PANDA.md)               │
│  ├── 📁 .github/workflows/         # CI/CD (Pages, Android, Steam)         │
│  │                                                                          │
│  ├── 📁 1.core/                    # ☁️ Google Apps Script (17 arquivos)   │
│  │   ├── 1.1.gas/                  # 9 core modules (.gs)                 │
│  │   │   ├── PF_Dispatcher.gs      # Router principal (Tri-Mode)           │
│  │   │   ├── PF_Config.gs          # Configurações                         │
│  │   │   ├── PF_Core_AI.gs         # AI Service                            │
│  │   │   ├── PF_Brain_Core.gs      # Brain orchestration                   │
│  │   │   └── PF_PAT_Core.gs        # Panda Council (Governance)            │
│  │   ├── 1.2.domains/              # 4 domain modules                      │
│  │   │   ├── finance/              # Wallet, Crypto, Fiat                  │
│  │   │   ├── store/                # Medusa Store, Registry, Sales         │
│  │   │   ├── automation/           # Bots                                  │
│  │   │   └── p2p/                  # 🌐 P2P Compute Network                │
│  │   └── 1.3.sdks/                 # SDKs pagamento (Stripe, PagSeguro)    │
│  │                                                                          │
│  ├── 📁 2.system/                  # 🔧 System-level utilities             │
│  │   ├── core/                     # kernel.js + loader.js + verification  │
│  │   └── sdk/                      # (vazio — placeholder para futuro)     │
│  │                                                                          │
│  ├── 📁 3.sdk/                     # 🐼 Panda SDK Core (12 arquivos, 17 ns) │
│  │   ├── pf.sdk.js                 # SDK principal (entry point)           │
│  │   ├── pf.ai-core.js             # AI/Gemini                            │
│  │   ├── pf.firebase-bridge.js     # Firebase Bridge                      │
│  │   ├── pf.i18n.js                # Internacionalização                   │
│  │   ├── pf.workflow-builder.js    # Workflow Builder                      │
│  │   ├── pf.drm.js                 # DRM / Kill-switch                     │
│  │   └── ...                       # +4 outros módulos                     │
│  │                                                                          │
│  ├── 📁 4.ui/                      # 🎨 UI Components & Pages              │
│  │   ├── 4.1.trading/              # Trading tools                         │
│  │   ├── 4.2.components/           # Reusable components                   │
│  │   └── 4.3.modules/              # View modules (Analytics, Store, etc)  │
│  │                                                                          │
│  ├── 📁 5.tentacles/               # 🔌 9 Integration Modules              │
│  │   ├── 5.1.brain/                # AI/ML (Gemini, LocalLLM)              │
│  │   ├── 5.2.google/               # Drive, Sheets, Colab                  │
│  │   ├── 5.3.social/               # WhatsApp, Twitter, Meta               │
│  │   ├── 5.4.trading/              # cTrader Open API                      │
│  │   ├── 5.5.distribution/         # PWA, Steam, itch.io                   │
│  │   ├── 5.6.education/            # Kiwify, Hotmart, Eduzz                │
│  │   ├── 5.7.github/               # Pages, JSON DB, Actions               │
│  │   ├── 5.8.p2p/                  # 🌐 P2P Compute Network                │
│  │   └── 5.9.monitor/              # Health/Telemetry                      │
│  │                                                                          │
│  ├── 📁 6.medusa/                  # 🐙 Medusa manifests (12 integrations)    │
│  │                                                                          │
│  ├── 📁 7.rust-agent/              # 🦀 Local Agent (Tauri/MCP)            │
│  │   ├── src/                      # 8 modules (GPU, MCP, Node, Mining)    │
│  │   └── Cargo.toml                # Dependencies                          │
│  │                                                                          │
│  ├── 📁 8.docs/                    # 📚 32 reference documents             │
│  │   ├── PF_MASTER_ARCHITECTURE.md # 🏛️ Este documento                    │
│  │   ├── PF_SDK_REFERENCE.md       # 📖 SDK API                            │
│  │   └── PF_OPENSOURCE_CATALOG.md  # 📋 Deps & Quick Install              │
│  │                                                                          │
│  ├── 📁 9.tools/                   # 🔧 Dev utilities & scripts            │
│  │   └── (39 scripts Python/PS1/Bat)                                        │
│  │                                                                          │
│  ├── 📁 10.assets/                 # 🖼️ Images, logos, media               │
│  │   ├── css/                      # pf.css (legado)                       │
│  │   ├── icons/                    # PWA icons                              │
│  │   └── pages/                    # Landing pages                          │
│  │                                                                          │
│  ├── 📁 pf/                           # 🍇 React Frontend (Vite + TLDraw)     │
│  │   ├── app/src/components/       # 23 componentes React                  │
│  │   ├── app/src/hooks/            # 8 custom hooks                        │
│  │   ├── app/src/styles/           # pf.css (Design System, 1961 linhas)   │
│  │   └── app/dist/                 # Build de produção                     │
│  │                                                                          │
│  ├── 📁 12.sandbox/                # 🧪 Experimental / playground          │
│  │                                                                          │
│  ├── .env                          # 🔐 SECRETS (gitignored)               │
│  ├── index.html                    # 🏠 Entry point                        │
│  ├── manifest.json                 # 📱 PWA config                         │
│  └── README.md                     # 📋 Quick Reference                    │
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
│  ├── §9 P2P Compute 🌐                                       │
│  └── §10 Bounty System         PARTE IV: HUBS               │
│                                 ├── §11 Social Media         │
│  PARTE V: ESTRATÉGIA           ├── §12 Gaming & Audio        │
│  ├── §17 Google Partner        ├── §13 EdTech                │
│  ├── §18 Game Studio           ├── §14 Creative Assets       │
│  └── §19 Refs & Convenções     └── §15-16 (Dev Ecosystem)    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Índice

0. [§0.2 ROADMAP MASTER — O Mapa Vivo](#02-roadmap-master--o-mapa-vivo)

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
12. [Gaming, Audio & Video](#12-gaming-audio-video)
13. [EdTech & Infoprodutos](#13-edtech)
14. [Creative Assets Marketplace](#14-assets-marketplace)
15. [Dev Tools & VSX Store](#15-devtools-vsx)

### PARTE V: ESTRATÉGIA & CRESCIMENTO

16. [Google Partner Strategy](#16-google-partner)
17. [Game Studio & Publisher](#17-game-studio)
18. [Referências & Convenções](#18-referencias)
19. [Dual Cloud Strategy (GitHub + Google)](#19-dual-cloud-strategy)
20. [Developer Ecosystem](#20-developer-ecosystem)
21. [Pipeline de Publicação & Economia](#21-pipeline-publicacao)
22. [System Design Principles](#22-system-design-principles)

---

# PARTE I: FUNDAMENTOS

---

## 1. Visão Geral da Arquitetura 「E1 | 2 tasks | 2/2 ✅」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                       | Etapa  | Doc SSoT         |
> | ------ | --- | ------------------------------------------ | ------ | ---------------- |
> | [x]    | 2   | Firebase Auth (Email + Google providers)   | E1-S1A | `CONTEXT.md §11` |
> | [x]    | 16  | Google Sign-in real (remover "Soon" badge) | E1-S1D | `CONTEXT.md §11` |

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
│ • Dev Mode         │  │                     │  │                     │
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

### 1.4. Arquitetura Web-First (Zero Install)

> **Filosofia:** "O Browser faz 90% do trabalho. Cloud só para sync e billing."
> **Princípio:** 90% dos usuários NUNCA precisam instalar o Rust Agent.

O Panda Factory opera em **DOIS MODOS** completamente funcionais:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🌐 MODO WEB-ONLY (90% dos usuários) - INSTALAÇÃO ZERO                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Browser (PWA)              GAS Backend           Firebase             │
│  ┌──────────────────┐      ┌──────────────┐      ┌───────────┐        │
│  │ manifest.json    │─────▶│ Brain.gs     │─────▶│ RTDB      │        │
│  │ panda.mcp.json   │      │ PAT.gs       │      │ Auth      │        │
│  │ React/TLDraw UI  │      │ Billing.gs   │      │ Signaling │        │
│  └──────────────────┘      └──────────────┘      └───────────┘        │
│                                                                         │
│  ✅ FUNCIONALIDADES WEB-ONLY (100% funcional sem instalação):          │
│  ├── AI Chat (Gemini via GAS)                                          │
│  ├── Canvas TLDraw                                                     │
│  ├── Data Persistence (Sheets)                                         │
│  ├── Plugin Store (Medusa)                                             │
│  ├── Wallet & Economy (Panda Coins)                                    │
│  └── MCP Tools (via panda.mcp.json → GAS dispatcher)                   │
│                                                                         │
│  💰 CUSTO INFRAESTRUTURA: $0/mês (Free Tier Google)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  🦀 MODO DESKTOP (10% dos usuários) - PODER COMPLETO                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Rust Agent (Tauri)              +  Tudo do Modo Web                   │
│  ┌──────────────────────────┐                                          │
│  │ • MCP Server nativo      │                                          │
│  │ • GPU/CUDA local         │                                          │
│  │ • Mining / Partner Mode  │ ← RUST-ONLY (nunca browser)             │
│  │ • AI Offline (Whisper)   │                                          │
│  │ • RPA / Automação        │                                          │
│  │ • Multi-Window (PiP API) │                                          │
│  │ • Panda Oracle (preços)  │ ← Monitora crypto, calcula PC líquido   │
│  └──────────────────────────┘                                          │
│                                                                         │
│  🔓 FUNCIONALIDADES EXCLUSIVAS DESKTOP:                                │
│  ├── GPU Local (CUDA, Vulkan, WebGPU)                                  │
│  ├── Mining / Partner Mode (Rust-only, fator x0.60)                    │
│  │   ├── Executa APENAS via Rust Agent (binário nativo)                │
│  │   ├── Web UI = painel de controle remoto (não executa mining)       │
│  │   ├── Panda Oracle aplica fator x0.60 → 60% user (PC), 40% Panda   │
│  │   ├── 40% cobre: impostos BR + ops + hold reserve + treasury        │
│  │   ├── Hold Strategy: Panda não liquida 100% (reserva valoriza)      │
│  │   └── Payout: end-of-day ou a cada X horas, manual claim            │
│  ├── RPA / Automação Desktop (click, screen_capture)                   │
│  ├── AI Local Offline (Whisper, NLLB - 140MB + 600MB)                  │
│  ├── MCP Tools nativos (fs_read, fs_write, terminal)                   │
│  └── Multi-Window Pop-out (Document Picture-in-Picture API)            │
│                                                                         │
│  📖 Mining detalhado: PF_ECONOMY_REFERENCE.md §17                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Comparativo Web vs Desktop

| Aspecto           | 🌐 Modo Web                     | 🦀 Modo Desktop                 |
| ----------------- | ------------------------------- | ------------------------------- |
| **Instalação**    | Zero (PWA)                      | ~30MB + downloads               |
| **AI**            | Gemini Cloud (via GAS)          | Cloud + Local (Whisper, NLLB)   |
| **MCP**           | Via panda.mcp.json + GAS        | Nativo Rust (mais tools)        |
| **GPU**           | Apenas detecção                 | CUDA, Mining, AI local          |
| **Partner Mode**  | ❌ (Rust-only)                  | ✅ Mining x0.60 → 60% user (PC) |
| **RPA/Automação** | ❌                              | ✅ click, fs, terminal          |
| **Multi-Window**  | ❌                              | ✅ Document PiP                 |
| **Custo infra**   | $0/mês                          | $0/mês                          |
| **Offline**       | ✅ PWA+SW+IDB (UI+dados cached) | 100% (modelos locais)           |

> **📌 Importante:** O fluxo `manifest.json → PWA → GAS → Firebase` é a base do ecossistema.
> A maioria dos plugins funcionam perfeitamente no Modo Web.

````

| Benefício           | Impacto                                 |
| ------------------- | --------------------------------------- |
| **Custo Cloud ~$0** | Processamento no browser não gera custo |
| **Privacidade**     | Dados sensíveis ficam locais            |
| **Offline-capable** | PWA funciona sem internet               |
| **Escalabilidade**  | Mais users = mais CPU distribuída       |

### 1.5. Capacidade de Infraestrutura (Free Tier)

| Serviço                | Limite Gratuito                    | Uso Real no Panda        |
| ---------------------- | ---------------------------------- | ------------------------ |
| **Firebase Auth**      | ∞ logins (email/anon)              | Só login (1x por sessão) |
| **Firebase RTDB**      | 1 GiB, 10GB download/mês          | Status online, heartbeat |
| **Google Apps Script** | 90min/dia exec, 20K calls/dia      | Billing, PAT (ocasional) |
| **Sheets como DB**     | 10M células                        | Transações, usuários     |
| **Cloud Run**          | 2M req/mês, 180K vCPU-sec         | Backend overflow GAS     |
| **Cloud Functions**    | 2M invocações/mês                  | Event triggers           |
| **BigQuery**           | 1 TB queries/mês, 10 GB storage   | Analytics                |

> **📖 Free Tier completo:** [PF_GOOGLE_SUITE.md](PF_GOOGLE_SUITE.md) §1 e §7

```text
📊 CAPACIDADE ESTIMADA (Free Tier - Custo $0)

├── Usuários Cadastrados: ~100,000+
├── Usuários Ativos Simultâneos: ~10,000 (limite RTDB connections)
├── Chamadas GAS/dia: ~50,000 (só billing/auth)
├── Storage: ~1GB dados
└── Com Rust Agent: ∞ (processamento local)
````

### 1.6. Modelo Gemini API Compartilhada

> **Referência:** [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) | [PF_GOOGLE_SUITE.md](PF_GOOGLE_SUITE.md) §4

| Nível           | Quem            | Modelo             | Quota/dia   | Fonte           |
| --------------- | --------------- | ------------------ | ----------- | --------------- |
| **User (3)**    | Usuários finais | Gemini 3 Flash     | 300k tokens | Conta Founder   |
| **Dev (2)**     | Desenvolvedores | Flash + Pro        | 400k tokens | Conta Founder   |
| **Dev+ (2)**    | Power devs      | Flash + Deep Think | 200k tokens | Conta Founder   |
| **Founder (1)** | Lucas Valério   | Todos              | ∞           | Própria         |
| **BYOL**        | Qualquer        | Qualquer           | ∞           | Própria API Key |

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

> **Atualizado:** 2026-02-10

O Panda Factory utiliza **dois repositórios** separados para desenvolvimento e produção:

| Repo              | Visibilidade | URL                                  | Remote Git | Uso                       |
| :---------------- | :----------- | :----------------------------------- | :--------- | :------------------------ |
| **SAAS**          | 🔒 Privado   | `github.com/LucassVal/SAAS`          | `origin`   | Desenvolvimento principal |
| **Panda-Factory** | 🌐 Público   | `github.com/LucassVal/Panda-Factory` | `panda`    | GitHub Pages (produção)   |

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
│  git push origin main   ← Código privado (SAAS)                     │
│  git push panda main    ← Deploy público (Panda-Factory)            │
│                                                                      │
│  ⚠️  SEMPRE push origin PRIMEIRO, depois panda                      │
└─────────────────────────────────────────────────────────────────────┘
```

**URLs de Produção:**

- **App Principal:** `https://lucassval.github.io/Panda-Factory/`
- **cTrader OAuth:** `https://lucassval.github.io/panda-ctrader-auth/`

#### 1.8.1. Mapa de Segurança (.gitignore)

O arquivo `.gitignore` na raiz controla o que **NÃO** vai para o repo público Panda-Factory.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    .GITIGNORE — MAPA DE SEGURANÇA                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🔒 PRIVADO (SOMENTE SAAS)        │  🌐 PÚBLICO (VAI PRO PANDA)    │
│  ─────────────────────────────     │  ──────────────────────────     │
│  1.core/    GAS backend, PAT      │  pf/app/       JAM React source    │
│  2.system/  Kernel, governance     │  dist/jam/  Build output        │
│  3.sdk/     SDK proprietário       │  .github/   CI/CD workflows    │
│  4.ui/      UI legacy             │  README.md  Pitch público       │
│  5.tentacles/  Tentáculos int.    │  index.html Landing page        │
│  7.rust-agent/ Ed25519, Rust      │  manifest.json  PWA            │
│  8.docs/    Docs técnicos int.    │  sw.js      Service Worker      │
│  9.tools/   Tools internas        │  _config.yml GitHub Pages       │
│  10.assets/ Dados privados        │                                  │
│  _archive/  Archives legados      │                                  │
│  .agent/    Config AI agent       │                                  │
│  secrets/   Tokens, API keys      │                                  │
│                                    │                                  │
└─────────────────────────────────────────────────────────────────────┘
```

> **REGRA:** Ao criar uma nova pasta numerada, SEMPRE adicionar ao `.gitignore` ANTES de commitar.

#### 1.8.2. Workflow Git Normal

```powershell
# 1. Stage e commit
git add -A
git commit -m "feat: descrição das alterações"

# 2. Push para PRIVADO (SEMPRE primeiro!)
git push origin main

# 3. Push para PÚBLICO (deploy)
git push panda main
# → Triggera GitHub Actions → build pf/app/ → deploy dist/jam/ → GitHub Pages
```

#### 1.8.3. Emergência: Vazamento de Arquivos Sensíveis

```powershell
# 1. Atualizar .gitignore com caminhos corretos
# 2. Remover do cache git
git rm -r --cached <pasta-sensivel>/
# 3. Commit de segurança
git commit -m "🔒 SECURITY: remove sensitive files"
# 4. Force-push para panda (sobrescreve histórico público)
git push panda main --force
# 5. Push normal para origin
git push origin main
```

#### 1.8.4. GitHub Pages Deploy Flow

```text
Push panda → GitHub Actions → npm ci (pf/app/) → npm run build →
  Upload dist/jam/ → Deploy GitHub Pages →
  LIVE: lucassval.github.io/Panda-Factory/
```

### 1.9. Filosofia Core Minimalista + Module-First

> **Decisão Arquitetural:** 2026-02-04 (Atualizado: 2026-02-07)
> O Panda Factory é um **runtime minimalista** onde módulos e tentáculos MCP-first rodam.
> **Taxonomia:** Ver [PF_MEDUSA_REFERENCE.md](PF_MEDUSA_REFERENCE.md) §2 para definições oficiais.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    CORE MINIMALISTA + MODULE-FIRST                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ANTES (Monolítico):              DEPOIS (Module-First):                │
│  ┌──────────────────────┐         ┌──────────────────────┐              │
│  │ Core (tudo embutido) │         │ Shell (mínimo)       │              │
│  │ ├── TLDraw Canvas    │   ───▶  │ ├── Module Slot     │              │
│  │ ├── DevTools         │         │ ├── Event Bus        │              │
│  │ ├── Draw Tools       │         │ └── MCP Runtime      │              │
│  │ └── Components       │         └──────────┬───────────┘              │
│  └──────────────────────┘                    │                          │
│                                              ▼                          │
│                                 ┌────────────────────────┐              │
│                                 │ Medusa Store         │              │
│                                 │ ├── @panda/draw-tools  │ ← Módulo    │
│                                 │ ├── @panda/ai-chat     │ ← Módulo    │
│                                 │ ├── @dev/fashion-agent │ ← Módulo    │
│                                 │ └── @dev/steam-hook   │ ← Tentáculo  │
│                                 └────────────────────────┘              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

| Aspecto           | Antes            | Depois                        |
| ----------------- | ---------------- | ----------------------------- |
| **TLDraw/Canvas** | Embutido no core | Plugin `@panda/draw-tools`    |
| **DevTools**      | Dock lateral     | Separado por Role (Dev/Admin) |
| **Novo plugin**   | Modifica core    | Baixa da Medusa Store         |
| **MCP**           | Opcional         | Obrigatório para todos        |

**Benefícios:**

- 🐼 **Core enxuto:** Shell carrega em <100ms, sem peso desnecessário
- 🔌 **100% extensível:** Tudo que não é essencial vai para módulo/tentáculo
- 🤖 **IA entende tudo:** MCP obrigatório = toda tool é AI-native
- 💰 **Monetização clara:** Módulos e tentáculos pagos na Medusa Store

**Módulos Gratuitos do Founder:**

| Módulo                | Descrição               | MCP Tools                     |
| --------------------- | ----------------------- | ----------------------------- |
| `@panda/draw-tools`   | Canvas TLDraw completo  | `draw_shape`, `export_canvas` |
| `@panda/ai-chat`      | Chat com Brain IA       | `send_message`, `get_history` |
| `@panda/file-manager` | Gerenciador de arquivos | `upload`, `download`, `list`  |

---

### 1.10. MCP Central + Dual-Mode (Roadmap)

> **Status:** 🔴 Planejado | **Referência:** [PF_MCP_REFERENCE.md](PF_MCP_REFERENCE.md) §C

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                 📡 MCP REGISTRY CENTRAL (Firebase)                       │
│  Firestore: /mcp_registry/{pluginId}                                    │
│  - manifests[], capabilities[], versions[]                              │
└─────────────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────────────┐             ┌───────────────────────┐
│   🌐 WEB MCP SERVER   │             │   🦀 RUST MCP SERVER  │
│   (GAS + Firebase)    │             │   (panda-agent)       │
├───────────────────────┤             ├───────────────────────┤
│ Transport: HTTPS      │             │ Transport: stdio      │
│ Cache: IndexedDB      │             │ Cache: SQLite         │
│ Offline: SW + IDB     │             │ Offline: 100% local   │
└───────────────────────┘             └───────────────────────┘
```

| Primitivo     | Web (GAS)    | Rust Agent | Status   |
| ------------- | ------------ | ---------- | -------- |
| **Tools**     | ✅ Planejado | ✅ 4 tools | Parcial  |
| **Resources** | 🔴 A fazer   | 🔴 A fazer | Pendente |
| **Prompts**   | 🔴 A fazer   | 🔴 A fazer | Pendente |

**Estratégia Offline-First:**

1. **IndexedDB** → Cache de manifests MCP (instantâneo)
2. **Firebase** → Sync quando online
3. **SQLite (Rust)** → Fallback desktop

> 📖 **Detalhes completos:** [PF_MCP_REFERENCE.md](PF_MCP_REFERENCE.md) PARTE C

---

## 2. O Diferencial "Hook" (Filosofia Core) 「E1 | 1 task | 0/1 [/]」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                      | Etapa  | Doc SSoT        |
> | ------ | --- | ----------------------------------------- | ------ | --------------- |
> | [/]    | 5   | SDK Auth wiring (mock→Firebase Auth real) | E1-S1A | `SDK_REF §Auth` |

> **"O Panda Factory não compete com a Steam, a Hotmart ou o VS Code. Ele engole todos através de integrações (Hooks)."**

### 2.1. O Princípio

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

### 2.1.1. Distribution Hub - 1-Click Deploy

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
│                         ┌──────────────────┐                            │
│                         │ 📊 Analytics Hub │                            │
│                         │ Downloads, Uso   │                            │
│                         └──────────────────┘                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.1.2. API Panda.Dist (Distribution)

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

### 2.1.3. Matriz de Plataformas

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

### 2.1.4. Cenários de Uso

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

### 2.2. Blindagem do SDK

| Regra | Tentacle Comunidade                                  |
| ----- | ---------------------------------------------------- |
| ❌    | `window.Panda.Auth = malicious;` (Sobrescrever Core) |
| ❌    | `window.Panda._internal = {};` (Acessar internos)    |
| ❌    | `fetch()` sem `Panda.Bridge` (Bypass proxy)          |
| ✅    | `TentacleMonitor.registerChild('epic', API);`        |
| ✅    | `Panda.emit('community:epic:connected');`            |
| ✅    | Usar qualquer API pública do SDK                     |

### 2.3. Resumo para Paz Mental

| Princípio              | Descrição                                            |
| ---------------------- | ---------------------------------------------------- |
| **Core Estável**       | O Panda Core não muda por causa de terceiros         |
| **Drivers Isolados**   | Integrações são plugins descartáveis/substituíveis   |
| **Validação Unitária** | Teste um canal de cada vez (ex: só itch.io primeiro) |
| **Bounties**           | Deixe a comunidade preencher lacunas das APIs        |

> **APIs novas = Branches da comunidade, regulados por você, MAS NÃO são Core.**

---

## 3. Camada Frontend: Panda UI & Docks 「E1-E3 | 4 tasks | 0/4」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                     | Etapa  | Doc SSoT         |
> | ------ | --- | ---------------------------------------- | ------ | ---------------- |
> | [ ]    | 13  | PWA real (vite-plugin-pwa, SW funcional) | E1-S1C | `CONTEXT.md §9`  |
> | [ ]    | 14  | Mobile/Responsive (CSS breakpoints)      | E1-S1C | `UI_REF`         |
> | [ ]    | 17  | Onboarding pulsing dots (Phase 2 Wizard) | E1-S1D | `CONTEXT.md §11` |
> | [/]    | 35  | i18n 100% (pt-BR, en, es)                | E3     | `SDK_REF §i18n`  |

A interface do Panda OS é composta por "Docks" flutuantes que vivem sobre a aplicação.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    STATUS BAR (56px, fixed top)                     │
│  [Logo][Brand] │ [v5.0][Pills][🌙] │ [90%][92%][User][btns][🕐]    │
├───────┬─────────────────────────────────────────────────────┬───────┤
│       │                                                     │       │
│ LEFT  │               CANVAS AREA                           │ RIGHT │
│ DOCK  │               (TLDraw)                              │ TOOLS │
│       │                                                     │       │
│ 68px  │            flex: 1, margin-top: 56px                │ 260px │
├───────┴─────────────────────────────────────────────────────┴───────┤
│                    CHAT FAB (bottom-right floating)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Componentes Principais

| Componente       | Z-Index    | Descrição                  |
| ---------------- | ---------- | -------------------------- |
| Canvas/TLDraw    | 0          | Área de trabalho principal |
| Left/Right Docks | 1000       | Sidebars flutuantes        |
| Status Bar       | 2000       | Header fixo                |
| Chat Panel       | 3000       | Floating chat              |
| Modals           | 5000-10000 | Settings, Login            |

### DevTools (Dev Mode)

| Tool            | Descrição          |
| --------------- | ------------------ |
| 💻 Console      | JavaScript sandbox |
| 🧰 MCP Browser  | Rust Agent tools   |
| 🔌 API Tester   | GAS endpoints      |
| 🏦 PAT Treasury | Banco Central IA   |

> 📖 **Detalhes completos:** [PF_UI_REFERENCE.md](PF_UI_REFERENCE.md)

---

> **📌 Nota:** A implementação completa de janelas pop-out usando a **Document Picture-in-Picture API** está documentada na seção [3.3.C - Arquitetura Multi-Window](#c-arquitetura-multi-window-document-pip).

### 3.3. Dev Mode (Modo Desenvolvedor) 🛠️

O Dev Mode é um ambiente de ferramentas avançadas para desenvolvedores.

**Componente:** `components/Comp_AppDock.html`
**Lógica:** `4.ui/pf.devtools.js` → `toggleDevMode()`

#### B. DevTools v2.0 - Ferramentas Disponíveis

| Tool                       | Ícone | Modal | Pop-out | Descrição                          |
| -------------------------- | ----- | ----- | ------- | ---------------------------------- |
| **Console**                | 💻    | ✅    | ✅      | Execução JavaScript em sandbox     |
| **MCP Browser**            | 🧰    | ✅    | ✅      | Lista de MCP Tools do Rust Agent   |
| **API Tester**             | 🔌    | ✅    | ✅      | Testar endpoints GAS               |
| **PAT Treasury**           | 🏦    | ✅    | ✅      | Controles do Banco Central IA      |
| **Constitution Validator** | ⚖️    | ✅    | ✅      | Validar ações contra os 12 Artigos |
| **RIG Config** _(futuro)_  | 🦀    | ✅    | ✅      | Configurar providers IA            |
| **DB Explorer** _(futuro)_ | 🗄️    | ✅    | ✅      | Explorar Sheets/Firebase           |

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

| Arquivo                             | Responsabilidade                      |
| ----------------------------------- | ------------------------------------- |
| `components/Comp_AppDock.html`      | Botão Dev Mode Toggle                 |
| `components/Comp_DevToolsDock.html` | Dock lateral com ícones               |
| `4.ui/pf.devtools.js`               | Lógica DevTools v2.0                  |
| `js/pf.sdk.js` (Panda.UI)           | API `popout/getPopouts/closePopout`   |
| `pf/app/src/styles/pf.css`          | Design System principal (1961 linhas) |

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

| Ícone | Tool         | Descrição          |
| ----- | ------------ | ------------------ |
| 💻    | Console      | JavaScript REPL    |
| 🧰    | MCP Browser  | Lista de Tools     |
| 🔌    | API Tester   | Testar endpoints   |
| 🏦    | PAT Treasury | Banco Central IA   |
| ⚖️    | Constitution | Validar 12 Artigos |
| 🧩    | Extensions   | Marketplace        |

| 🦀 | RIG Config | Providers IA |
| 🗄️ | DB Explorer | Sheets/Firebase |
| 🌐 | Browser | Embedded (futuro) |
| 📄 | Artifacts | Viewer artefatos |
| 💬 | Conversations | Histórico chat |

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

#### E. Ícones de 1.core/Arquitetura

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

| Arquivo                    | Tamanho | Uso           |
| -------------------------- | ------- | ------------- |
| `10.assets/panda_logo.png` | Full    | Canvas, About |
| `icons/icon-192x192.png`   | 192px   | PWA           |
| `icons/icon-512x512.png`   | 512px   | PWA HD        |
| `icons/favicon.ico`        | 64px    | Browser tab   |

> **📝 Para Kit de Logos:** Substituir emojis por SVGs customizados mantendo significado e cores associadas.

### 3.5. Jam Frontend (React + TLDraw) 🍇

> **Atualizado:** 2026-01-27 | **Referência:** [PF_UI_REFERENCE.md](PF_UI_REFERENCE.md)

O **Panda Jam** é o frontend moderno construído com React + Vite, oferecendo uma experiência de canvas infinito com TLDraw.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         PANDA JAM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  pf/app/                           COMPONENTES (22)                       │
│  ├── src/                                                           │
│  │   ├── components/         ┌─────────────────────────────────┐   │
│  │   │   ├── JamStatusBar    │ Header com status de agentes    │   │
│  │   │   ├── JamChat         │ AI Panel (5 modelos, 6 GEMs)    │   │
│  │   │   ├── JamDock         │ Dock lateral de apps            │   │
│  │   │   ├── JamCanvas       │ TLDraw canvas infinito          │   │
│  │   │   ├── LoginGate       │ Autenticação                    │   │
│  │   │   └── ...             └─────────────────────────────────┘   │
│  │   ├── hooks/              8 custom React hooks                   │
│  │   ├── services/           uiContext, outros                      │
│  │   └── styles/             pf.css (Design System, 1961 linhas)      │
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
| **JamDock**          | Dock lateral de apps                   | `Panda.Dock`         |
| **JamCanvas**        | TLDraw canvas infinito                 | `Panda.Canvas`       |
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

#### D. CSS Variables (pf.css)

```css
:root {
  /* Core */
  --pf-bg: #1a1a2e;
  --pf-surface: #16213e;
  --pf-accent: #e94560;
  --pf-text: #eaeaea;
  --pf-text-muted: #8a8a9a;
  --pf-text-secondary: #c0c0d0;
  --pf-border: #2a2a4e;
  --pf-dock-bg: rgba(22, 33, 62, 0.95);

  /* Design System Tokens (B.1-B.8) */
  --pf-success/warning/error/info;   /* Status colors */
  --pf-elevation-0..3;               /* IBM Carbon layers */
  --pf-space-xs..xl;                 /* Spacing */
  --pf-radius-sm..full;              /* Border radius */
  --pf-shadow-sm..glow;              /* Shadow elevation */
  --pf-duration-instant..slow;       /* Motion duration */
  --pf-ease-default..bounce;         /* Easing curves */
  --pf-transition-fast..slow;        /* Composite transitions */
}

body.light-mode {
  --pf-bg: #f5f5f7;
  --pf-surface: #ffffff;
  --pf-text: #1a1a2e;
  --pf-elevation-0..3;               /* Light elevation overrides */
}
```

#### E. Deploy

- **Build:** `npm run build` (Vite)
- **Output:** `/dist/pf/app/` → copiado para `/dist/pf/app/` na raiz
- **Serve:** GitHub Pages em `https://lucassval.github.io/Panda-Factory/`

---

## 4. Camada SDK: O Coração 「E1 | 2 tasks | 0/2 [/]」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                      | Etapa  | Doc SSoT          |
> | ------ | --- | ----------------------------------------- | ------ | ----------------- |
> | [/]    | 5   | SDK Auth wiring (mock→Firebase Auth real) | E1-S1A | `SDK_REF §Auth`   |
> | [ ]    | 6   | SDK Wallet wiring (mock→RTDB real)        | E1-S1A | `SDK_REF §Wallet` |

### A Regra de Ouro

> **"O Módulo NUNCA fala com o Servidor. O Módulo fala com o Panda, e o Panda fala com o Servidor."**

### Estrutura Global `Panda`

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

### Módulos Principais

| Slot   | Descrição               | Custo   |
| ------ | ----------------------- | ------- |
| Data   | Persistência Sheets/SQL | GRÁTIS  |
| Wallet | Economia PC             | GRÁTIS  |
| Brain  | IA Gemini/Local         | Por uso |
| Bridge | Rust Agent              | GRÁTIS  |
| GPU    | Aceleração local        | GRÁTIS  |

### Tentacle Architecture (9 Módulos de Integração)

```text
5.tentacles/
├── 5.1.brain/      ← AI/ML (Gemini, LocalLLM)
├── 5.2.google/     ← Drive, Sheets, Colab
├── 5.3.social/     ← WhatsApp, Twitter, Meta
├── 5.4.trading/    ← cTrader Open API
├── 5.5.distribution/ ← PWA, Steam, itch.io
├── 5.6.education/  ← Kiwify, Hotmart, Eduzz
├── 5.7.github/     ← Pages, JSON DB, Actions
├── 5.8.p2p/        ← 🌐 P2P Compute Network
└── 5.9.monitor/    ← System Health
```

> 📖 **Detalhes completos:** [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md)

---

## 5. Backend: Os 3 Pilares 「E1 | 5 tasks | 0/5」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                         | Etapa  | Doc SSoT              |
> | ------ | --- | -------------------------------------------- | ------ | --------------------- |
> | [x]    | 1   | Firebase RTDB Rules + Schema                 | E1-S1A | `BACKEND_REF §7`      |
> | [x]    | 3   | GAS Deploy como Web App (doPost público)     | E1-S1A | `GAS_REF`             |
> | [ ]    | 4   | GAS Webhook handler Kiwify/Hotmart           | E1-S1A | `SDK_REF`, `ECON_REF` |
> | [ ]    | 12  | Chat AI funcional (Gemini 3.0 endpoint real) | E1-S1C | `GEMINI_REF`          |
> | [ ]    | 15  | GAS Heartbeat + Cron triggers                | E1-S1C | `GAS_REF`             |

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    OS 3 PILARES DO BACKEND                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🦀 RUST AGENT           ⚡ FIREBASE              ☁️ GOOGLE APPS SCRIPT │
│  (Hardware Local)        (Signaling)              (Persistência)        │
│  ├── GPU/CUDA            ├── Auth                 ├── Sheets DB         │
│  ├── MCP Server          ├── RTDB Heartbeat       ├── Billing           │
│  ├── DLL Bridge          └── Status               └── Dispatcher        │
│  └── Automation                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Visão Geral

| Pilar          | Responsabilidade                    | Custo     |
| -------------- | ----------------------------------- | --------- |
| **Rust Agent** | Hardware local, GPU, MCP, automação | GRÁTIS    |
| **Firebase**   | Auth, signaling, status online      | Free tier |
| **GAS**        | Persistência Sheets, billing, sync  | Free tier |

> 📖 **Detalhes completos:** [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md)

---

│ ├── Idiomas: 200+ (PT, EN, ES, FR, DE, 中文, 日本語, العربية...) │
│ ├── Qualidade: ★★★★ (Pesquisa Meta) │
│ └── Runtime: ONNX via `ort` crate │
│ │
│ LEGENDAS: Whisper Base (OpenAI) │
│ ├── Tamanho: ~140MB │
│ ├── Função: Speech-to-Text (STT) │
│ └── Fluxo: Áudio → Whisper → Texto → NLLB → Legenda traduzida │
│ │
│ HOSPEDAGEM: Hugging Face Hub (CDN Global, 100% Grátis) │
│ └── URL: huggingface.co/facebook/nllb-200-distilled-600M │
│ │
└─────────────────────────────────────────────────────────────────────────┘

````

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
````

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
│     ├── 9.tools/                                                         │
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

### 5.2. Pilar Firebase Colmeia (Signaling + Store + Heartbeat)

O Firebase atua como canal de sinalização, store/wallet persistência,
e heartbeat de agentes (5 min interval → Founder Dashboard).

### 5.1. Arquitetura de Dados (Schema) — Parent/Child

```json
{
  "users": {
    "$uid": {
      "profile": { "email": "", "tier": "user", "createdAt": "" },
      "wallet": { "balance": 250, "transactions": { "$txId": {} } },
      "licenses": { "$moduleId": { "granted": "", "version": "" } },
      "gasometer": { "$date": 0 }
    }
  },

  "store": {
    "catalog": {
      "$moduleId": {
        "name": "",
        "icon": "",
        "description": "",
        "price": 0,
        "tier": "",
        "author": "",
        "version": "",
        "mcpTools": [],
        "embedLinks": [],
        "stats": { "installs": 0 },
        "reviews": { "$uid": { "rating": 5, "timestamp": "" } }
      }
    },
    "sales": {
      "$saleId": {
        "userId": "",
        "moduleId": "",
        "amount": 0,
        "method": "",
        "timestamp": ""
      }
    }
  },

  "modules": {
    "$moduleId": {
      "manifest": { "id": "", "name": "", "entrypoint": "", "permissions": [] },
      "mcpTools": { "$toolName": { "description": "", "inputSchema": {} } },
      "status": "active"
    }
  },

  "heartbeat": {
    "agents": {
      "gas_backend": {
        "status": "online",
        "lastPing": "",
        "version": "3.0.0",
        "latency": 0
      },
      "firebase_rtdb": { "status": "online", "lastPing": "", "connections": 0 },
      "rust_agent": {
        "status": "offline",
        "lastPing": "",
        "gpu": "",
        "version": ""
      },
      "stripe": { "status": "online", "lastPing": "", "mode": "test" },
      "gasometer": {
        "status": "ok",
        "lastPing": "",
        "dailyUsed": 0,
        "percentage": 0
      }
    },
    "interval": 300000,
    "lastCheck": ""
  },

  "hooks": {
    "$hookId": {
      "moduleId": "",
      "authorUid": "",
      "createdAt": "",
      "type": "distribution"
    }
  },

  "admins": { "$uid": { "email": "", "role": "founder", "since": "" } },

  "pf_cells": {
    "$uid": {
      "command_queue": {
        "$cmdId": { "action": "", "payload": {}, "timestamp": 0 }
      },
      "response_stream": {
        "$cmdId": { "status": "", "data": {}, "completed_at": 0 }
      },
      "agent_status": {
        "online": true,
        "last_ping": 0,
        "gpu_model": "",
        "version": ""
      }
    }
  }
}
```

### 5.2.A. Regras de Segurança (Firebase RTDB Rules)

```javascript
{
  "rules": {
    "users": {
      "$uid": {
        ".read":  "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "store": {
      "catalog": {
        ".read":  true,
        ".write": "auth != null && root.child('admins/' + auth.uid).exists()"
      },
      "sales": {
        ".read":  "auth != null && root.child('admins/' + auth.uid).exists()",
        ".write": "auth != null && root.child('admins/' + auth.uid).exists()"
      }
    },
    "modules":   { ".read": true, ".write": "root.child('admins/' + auth.uid).exists()" },
    "heartbeat": { ".read": true, ".write": "root.child('admins/' + auth.uid).exists()" },
    "hooks":     { ".read": true, ".write": "auth != null" },
    "admins":    { ".read": "root.child('admins/' + auth.uid).exists()", ".write": false },
    "pf_cells":  {
      "$uid": { ".read": "auth.uid === $uid", ".write": "auth.uid === $uid" }
    }
  }
}
```

### 5.2.B. Access Matrix: Founder vs User

| Node            | Founder (admin) | User (auth)    | Public  |
| --------------- | --------------- | -------------- | ------- |
| `users/$uid`    | Próprio apenas  | Próprio apenas | ❌      |
| `store/catalog` | Read + Write    | Read           | ✅ Read |
| `store/sales`   | Read + Write    | ❌             | ❌      |
| `modules`       | Read + Write    | Read           | ✅ Read |
| `heartbeat`     | Read + Write    | Read           | ✅ Read |
| `hooks`         | Read + Write    | Write (own)    | ✅ Read |
| `admins`        | Read            | ❌             | ❌      |
| `pf_cells/$uid` | Próprio apenas  | Próprio apenas | ❌      |

### 5.2.C. Heartbeat Dashboard (Founder Only)

```text
┌──────────────────────────────────────────────────────────────────────┐
│                 🐼 FOUNDER HEARTBEAT DASHBOARD                       │
│                 Interval: 5 min │ Auto-refresh                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AGENT              STATUS    LAST PING       DETAIL                 │
│  ─────────────────────────────────────────────────────────────────── │
│  ☁️ GAS Backend     🟢 ONLINE  2m ago         v3.0.0  │ 12ms       │
│  🔥 Firebase RTDB   🟢 ONLINE  1m ago         3 conn  │ 8ms        │
│  🦀 Rust Agent      🔴 OFFLINE 45m ago        —                      │
│  💳 Stripe          🟢 ONLINE  3m ago         test mode              │
│  ⛽ Gasometer       🟡 WARN    2m ago         0.8% used              │
│  🏪 Store Catalog   🟢 ONLINE  2m ago         4 modules              │
│  💰 Wallet Ledger   🟢 ONLINE  2m ago         GAS props              │
│                                                                      │
│  ── ALERTS ─────────────────────────────────────────────             │
│  ⚠️ Rust Agent offline > 30min                                       │
│  ✅ All payment systems operational                                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.2.D. Store → Checkout → GAS → Firebase Pipeline

```text
[👤 USER]                    [🏪 STORE]                [☁️ GAS v3.0.0]        [🔥 FIREBASE]
    │                            │                           │                      │
    │ 1. Browse Catalog ─────────▶│                           │                      │
    │                            │ 2. GET store.catalog ─────▶│                      │
    │                            │                           │ 3. Return catalog ────▶│ (cache)
    │◀──────── 4. Show items ────│                           │                      │
    │                            │                           │                      │
    │ 5. Click "Buy" ────────────▶│                           │                      │
    │                            │                           │                      │
    │  ┌─── METHOD? ───────────┐ │                           │                      │
    │  │ PC:  debit wallet     │ │ 6a. POST STORE_PURCHASE ──▶│                      │
    │  │ USD: Stripe Checkout  │ │ 6b. POST CREATE_STRIPE ───▶│──▶ Stripe API        │
    │  └───────────────────────┘ │                           │                      │
    │                            │                           │ 7. Grant license ────▶│
    │                            │                           │ 8. Track gasometer ──▶│
    │◀──────── 9. SUCCESS ───────│                           │                      │
    │                            │                           │                      │
    │ 10. "Run Module" ──────────▶│                           │                      │
    │                            │ 11. Load MCP tools ───────▶│ (manifest)           │
    │◀──── 12. Module running ───│                           │                      │
```

### 5.2.E. Fluxo de Execução Original (Browser ↔ Rust)

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

## 6. Infraestrutura Híbrida 「E2-E4 | 2 tasks | 0/2」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                    | Etapa | Doc SSoT        |
> | ------ | --- | --------------------------------------- | ----- | --------------- |
> | [ ]    | 23  | CI/CD GitHub Actions p/ Firebase deploy | E2    | `CONTEXT.md §6` |
> | [ ]    | 42  | Multi-region + CDN                      | E4    | `INFRA_REF`     |

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

## 7. Segurança & Zero-Knowledge 「E1-E3 | 2 tasks | 0/2」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                       | Etapa  | Doc SSoT       |
> | ------ | --- | ------------------------------------------ | ------ | -------------- |
> | [ ]    | 7   | CSP + Security Hardening (P0 Founder Solo) | E1-S1B | `SECURITY_REF` |
> | [ ]    | 37  | Audit trail + Compliance (SOC2 prep)       | E3     | `SECURITY_REF` |

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

## 8. Tokenomics & Monetização 「E1-E4 | 13 tasks | 0/13」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                           | Etapa  | Doc SSoT                 |
> | ------ | --- | ---------------------------------------------- | ------ | ------------------------ |
> | [ ]    | 8   | Economia PC real (RTDB wallet c/ saldos reais) | E1-S1B | `ECON_REF`               |
> | [ ]    | 9   | Store purchases real (mock→PC debit + license) | E1-S1B | `ECON_REF`, `MEDUSA_REF` |
> | [ ]    | 10  | Web Mining MVP (Smart Throttle WASM)           | E1-S1B | `ECON_REF §Mining`       |
> | [ ]    | 11  | Panda Oracle (mock→real spot price API)        | E1-S1B | `ECON_REF §Oracle`       |
> | [ ]    | 18  | Kiwify/Hotmart connector (tentáculo real)      | E1-S1D | `SDK_REF`, `MEDUSA_REF`  |
> | [ ]    | 25  | Revenue split automático (Art. 6 constituição) | E2     | `ECON_REF §Revenue`      |
> | [ ]    | 26  | Stripe/PayPal gateway                          | E2     | `ECON_REF §Gateway`      |
> | [ ]    | 27  | Subscription tiers reais                       | E2     | `ECON_REF §Tiers`        |
> | [ ]    | 28  | Founder Dashboard analytics                    | E2     | `ECON_REF §Dashboard`    |
> | [ ]    | 29  | Panda Vault (cold storage PC)                  | E2     | `SECURITY_REF`           |
> | [ ]    | 30  | Anti-fraud engine                              | E2     | `SECURITY_REF`           |
> | [ ]    | 38  | Token listing (DEX exploration)                | E3     | `ECON_REF §DEX`          |
> | [ ]    | 39  | Fiat on/off ramp                               | E3     | `ECON_REF §Fiat`         |

> **Filosofia:** "O Token é Energia. Quem produz, ganha. Quem consome, paga. O Fundador recebe eternamente."

### 8.1. Estrutura de Valor do Panda Coin (PC)

O PC é **Energy Credit** lastrado em custo computacional real, não especulativo.

#### A. Fórmula Base (Piso Inviolável)

```text
Preço_Base = Custo_Cloud_Médio × 4.0
Exemplo: $0.0025/PC custo × 4.0 = $0.01/PC (1 centavo)
```

#### B. Split de Receita (Transações)

| Destino               | Store/Compute | P2P Off-chain (Pre) | P2P On-Chain |
| --------------------- | ------------- | ------------------- | ------------ |
| **Dev/Host**          | 70%           | 95%                 | 95%          |
| **Panda Ops**         | 25%           | 5%                  | 5%           |
| **Panda Operacional** | 15%           | 4%                  | 1%           |
| **Founder (Lucas)**   | 5%            | 0%                  | 0%           |
| **Gateway/GAS**       | 3%            | 0%                  | 3%           |

> **Mining Split:** Para o split de receita de Mining, ver `PF_ECONOMY_REFERENCE.md §17` — modelo canônico x0.60 (60% User + 17% Impostos + 10% Ops + 7% Hold + 5% Treasury + 1% Founder).

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

### 8.2. Treasury Backing (Reservas & Lastro) 🏦

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

### 8.3. Hierarquia de Governança (4 Camadas)

A economia é gerida por um sistema de pesos e contrapesos para garantir longevidade.

```text
CAMADA 1: HARDCODE (A Constituição Imutável)
[Piso 4.0x] [Founder 5%] [Min Fundo 15%]
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
| **2. Panda Labs**     | `Suspenso — fundo social manual`  | Fundo educação suspenso até institucionalização               |
| **3. Reserva Ops**    | `20% do Lucro Ops → Caixa`        | Fundo de Emergência (Incide sobre Split Panda)                |
| **4. Crescimento**    | `65% do Fundo → Ação`             | Subsídios, Viralização e Eventos (Gestão IA)                  |
| **5. Piso Preço**     | `4.0x` (Min `2.8x`)               | Solvência. Permite descontos progressivos (até 30%)           |
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
> 1. **Fundo Social/Educação:** Suspenso até institucionalização formal (Fev 2026). Incentivos geridos manualmente.
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

## 18. Referências & Convenções

### 18.1. Convenção de Nomes (PF)

- **GitHub Repos:** `pf-sdk`, `pf-agent`, `pf-registry`
- **GAS Scripts:** `PF_Dispatcher`, `PF_Wallet`
- **JS Internal:** `PF._cache`
- **JS Public:** `Panda.Data`
- **Eventos:** `pf:ready`
- **CSS Vars:** `--pf-primary`

### 18.2. Mapa da Documentação

| Documento                   | Descrição                            |
| --------------------------- | ------------------------------------ |
| `PF_MASTER_ARCHITECTURE.md` | Este arquivo (A Bíblia completa)     |
| `PF_SDK_REFERENCE.md`       | API Reference (inc. Social + Plugin) |
| `PF_GAS_REFERENCE.md`       | Backend Google Apps Script           |
| `PF_UI_REFERENCE.md`        | Design System (CSS + HTML + JAM)     |
| `PF_SECURITY_REFERENCE.md`  | Regras Semgrep + Defend              |
| `PF_ECONOMY_REFERENCE.md`   | Tokenomics + PAT + Governance        |
| `.agent/CONTEXT.md`         | Entry point MCP para IAs             |

---

## 11. Tentacle Ecosystem (Extensibility) 「E1-E2 | 2 tasks | 0/2」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                           | Etapa  | Doc SSoT                 |
> | ------ | --- | ---------------------------------------------- | ------ | ------------------------ |
> | [ ]    | 9   | Store purchases real (mock→PC debit + license) | E1-S1B | `ECON_REF`, `MEDUSA_REF` |
> | [ ]    | 18  | Kiwify/Hotmart connector (tentáculo real)      | E1-S1D | `SDK_REF`, `MEDUSA_REF`  |

> **Filosofia:** O Core é enxuto. Toda funcionalidade de domínio específico vive em tentáculos independentes. O Panda não é um produto — é uma plataforma que recebe tentáculos.

### 11.1. O que é um Tentáculo

Um tentáculo é um módulo independente que se conecta ao Panda via `TentacleRegistry` (kernel §7). Cada tentáculo:

- Tem seu próprio **MCP Manifest** (validado pelo `SecurityAgent` §8)
- Consome o **SDK** (`Panda.Auth`, `Panda.Data`, `Panda.Wallet`, etc.)
- É **isolado** — falha de um tentáculo não derruba o sistema
- Segue o **revenue split** constitucional (Art. 6: 5% Founder, Art. 7: 90-95% Host)

### 11.2. Governança de Criação

```text
┌─────────────────────────────────────────────────────────────┐
│                  QUEM CRIA TENTÁCULOS?                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔒 FOUNDER (Lucas)                                         │
│  ├── Cria e publica tentáculos oficiais                     │
│  ├── Concede permissão a membros da comunidade              │
│  └── Aprova publicação na Medusa Store                      │
│                                                              │
│  👥 COMUNIDADE (com permissão)                               │
│  ├── Desenvolve tentáculos em sandbox                        │
│  ├── Submete para review (SecurityAgent + Code Review)       │
│  └── Após aprovação, publica via Medusa                     │
│                                                              │
│  🚫 PROIBIDO                                                 │
│  ├── Publicar sem validação SecurityAgent                   │
│  ├── Modificar kernel ou SDK via tentáculo                  │
│  └── Violar Art. 1-12 da Constituição                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 11.3. Estrutura de um Tentáculo

```text
5.tentacles/
└── 5.N.{nome}/
    ├── manifest.json              ← MCP Manifest (validado pelo SecurityAgent)
    ├── pf.{nome}-parent.js        ← Entry point (registra no TentacleRegistry)
    ├── 5.N.1.children/            ← Sub-módulos opcionais
    │   ├── child-a.js
    │   └── child-b.js
    ├── ui/                        ← Componentes visuais (se houver)
    │   └── Mod_{Nome}_View.html
    └── docs/                      ← Documentação do tentáculo
        └── README.md
```

### 11.4. Ciclo de Vida

```text
[Manifest.json]
      │
      ├──▶ 1. SecurityAgent.validateManifest() — Verifica campos, permissões, assinatura
      │
      ├──▶ 2. TentacleRegistry.register(id, manifest, hooks) — Registra no kernel
      │
      ├──▶ 3. onLoad() hook — Tentáculo inicializa
      │
      ├──▶ 4. Runtime — Tentáculo opera consumindo SDK
      │
      └──▶ 5. onUnload() hook — Cleanup ao desregistrar
```

### 11.5. Categorias (exemplos genéricos)

| Categoria         | Tipo de tentáculo           | Exemplos                        |
| ----------------- | --------------------------- | ------------------------------- |
| **Produtividade** | CRM, automação, agenda      | Qualquer ferramenta de trabalho |
| **Criativo**      | Gaming, áudio, vídeo, 3D    | Engines, editores, geradores    |
| **Educação**      | Cursos, certificados, DRM   | Webhooks de infoprodutos        |
| **Social**        | Redes sociais, marketing    | Plugins por plataforma          |
| **Finance**       | Trading, crypto, pagamentos | Integrações de gateway          |

> 📖 **Cada tentáculo mantém sua própria documentação em `5.tentacles/5.N.{nome}/docs/`**
> O Core não documenta módulos específicos — apenas a interface genérica.

---

## 10. Bounty System & Comunidade

> **Filosofia:** Use a "Vibe Dev" e a comunidade Open Source. Não escreva integrações chatas.

### 10.1. Como Funciona

| Papel              | Responsabilidade                                                                |
| ------------------ | ------------------------------------------------------------------------------- |
| **Você (Core)**    | Constrói a Documentação da API (`Panda.Publish.Interface`)                      |
| **Bounty**         | _"Pago 5.000 PC para quem criar o Conector Epic Games seguindo essa interface"_ |
| **Dev Comunidade** | Faz a integração. Você só valida (Code Review)                                  |

### 10.2. Níveis de Tentáculos

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

### 10.3. Promoção de Tentáculos

| De         | Para       | Requisitos                           |
| ---------- | ---------- | ------------------------------------ |
| Comunidade | Oficial    | Code Review + Testes + 1 mês estável |
| Enterprise | Comunidade | Cliente autoriza open-source         |

### 10.4. Revenue Split (ref: TOKENOMICS §9.1.B)

| Destino   | Store/Compute |
| --------- | ------------- |
| Dev/Host  | 70%           |
| Panda Ops | 25%           |
| Panda Ops | 15%           |
| Founder   | 5%            |
| Gateway   | 3%            |

---

## 15. App Factory - Democratização de Tecnologia 「E1-E4 | 2 tasks | 0/2」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                            | Etapa  | Doc SSoT                                    |
> | ------ | --- | ----------------------------------------------- | ------ | ------------------------------------------- |
> | [ ]    | 40  | App Factory MVP (mobile-first builder)          | E4     | `MEDUSA_REF`                                |
> | [ ]    | 41  | Casulo/BundleCreator MVP (Encapsulado — DR-008) | E1-S1B | `MEDUSA_REF §10.5` — **Repriorizado E4→E1** |

> **"O celular é o único computador que bilhões de pessoas possuem. Quem ignora mobile ignora a maioria da humanidade."**

### 15.1. A Visão

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
│  └── IA que ensina: Dev Tools, Brain, tutoriais contextuais          │
│                                                                          │
│  3. FERRAMENTAS                                                          │
│  └── Mesmas que grandes: IA, compute, automação, distribuição          │
│                                                                          │
│  4. MERCADO                                                              │
│  └── Distribuição global: Play Store, Web, P2P Compute                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.2. PWA/TWA - Apps Android Sem Código Nativo

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

### 15.3. Público-Alvo Universal

| Segmento            | Necessidade                | Solução Panda             |
| ------------------- | -------------------------- | ------------------------- |
| **Pequeno negócio** | App de delivery/cardápio   | Template + 1-click deploy |
| **ONG**             | App de doações/voluntários | Template + Panda Wallet   |
| **Artista**         | Portfolio/loja digital     | Template + pagamentos     |
| **Educador**        | App de cursos              | DRM + gamificação         |
| **Comunidade**      | App de grupo/eventos       | Social + Calendar         |
| **Desenvolvedor**   | SaaS/ferramenta            | Full SDK + distribuição   |

### 15.4. Mobile-First por Design

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

### 15.5. Build Pipeline (Zero Custo)

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

### 15.6. Monetização

| Modelo          | Descrição          | Preço Sugerido     |
| --------------- | ------------------ | ------------------ |
| **Build única** | Gerar 1 APK/AAB    | 500 PC (~R$25)     |
| **Assinatura**  | Builds ilimitados  | 2000 PC/mês        |
| **Push Pack**   | Notificações       | 100 PC / 1k pushes |
| **White Label** | Remover branding   | 5000 PC            |
| **Analytics**   | Métricas avançadas | 1000 PC/mês        |

### 15.7. Arquivos da Feature

| Arquivo                            | Função            | Status      |
| ---------------------------------- | ----------------- | ----------- |
| `3.sdk/pf.app-factory.js`          | Core da geração   | 🔴 Pendente |
| `templates/android/`               | Templates de apps | 🔴 Pendente |
| `.github/workflows/bubblewrap.yml` | Build action      | 🔴 Pendente |
| `1.core/PF_AppFactory.gs`          | Coordenação       | 🔴 Pendente |

### 15.8. Impacto Social

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

## 19. Dual Cloud Strategy (GitHub + Google)

> **Filosofia:** Panda senta em cima de dois gigantes ao mesmo tempo.
> Custo zero no beta. Zero lock-in. Máxima redundância.

### 19.1. Visão Geral

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

### 19.2. GitHub como Infraestrutura

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

### 19.3. Google como Compute/AI

| Serviço           | Uso no Panda          | Custo Free |
| ----------------- | --------------------- | ---------- |
| **Gemini**        | IA principal (6 GEMs) | 60 req/min |
| **Drive**         | Storage grande        | 15GB       |
| **Sheets**        | Spreadsheet as DB     | ∞          |
| **Colab**         | GPU para ML           | 12h/sessão |
| **Firebase Auth** | Autenticação (futuro) | 50k/mês    |

### 19.4. Arquivos do GitHub Tentacle

```
5.tentacles/5.7.github/
├── pf.github-parent.js       (295 lines) - API Core
└── 5.7.1.children/
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

### 19.5. API Panda.GitHub

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

### 19.6. Bootstrap Zero-Config

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

### 19.7. Planos de Upgrade

| Fase       | Infra                     | Custo    |
| ---------- | ------------------------- | -------- |
| **Beta**   | GitHub Free + Google Free | $0/mês   |
| **Launch** | GitHub Pro + Gemini API   | $20/mês  |
| **Growth** | GitHub Enterprise + GCP   | $100/mês |
| **Scale**  | Multi-cloud híbrido       | Variável |

### 19.8. Migração Futura

O SDK abstrai completamente a infra. Migrar de GitHub para Firebase/Supabase:

```javascript
// Mudar o backend (SDK permanece igual!)
Panda.setBackend("firebase"); // ou "supabase", "pocketbase"

// Código do app NÃO muda
await Panda.Data.save("users", data); // Funciona igual
```

---

## 20. Developer Ecosystem 「E2-E3 | 3 tasks | 0/3」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                                            | Etapa | Doc SSoT        |
> | ------ | --- | ----------------------------------------------- | ----- | --------------- |
> | [ ]    | 19  | SDK Dev Portal (manual, modelos, boas práticas) | E2    | `SDK_REF`       |
> | [ ]    | 20  | Tentacle Marketplace (publisher flow)           | E2    | `MEDUSA_REF`    |
> | [ ]    | 36  | Open-source community program                   | E3    | `CONTEXT.md §8` |

### 20.1. Visão Geral - Dois Modos de Desenvolvimento

```text
┌─────────────────────────────────────────────────────────────────────────┐
│              MODOS DE DESENVOLVIMENTO                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔘 MODO 1: OFFLINE (Externo)         🔘 MODO 2: ONLINE (Interno)       │
│  ─────────────────────────────        ─────────────────────────────     │
│  IDE própria (VS Code local)          vscode.dev dentro do Panda        │
│  Terminal nativo ✅                   Terminal via MCP ✅               │
│  Todas extensões ✅                   Extensões web + MCP ✅            │
│  git push → GitHub                    git push → GitHub                 │
│  Hooks distribuem                     Hooks distribuem                  │
│                                                                          │
│  RESULTADO: Mesmo pipeline, mesmos hooks, mesma distribuição            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 20.2. Fluxo OFFLINE (Dev Externo - GitHub-First)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  CENÁRIO 1: DEV EXTERNO (PC do Dev)                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  👨‍💻 PC DO DEV                                                           │
│  ├── IDE própria (VS Code, Cursor, qualquer)                       │
│  ├── npm install @panda/sdk  (GitHub/NPM)                              │
│  ├── Terminal local / PowerShell ✅                                     │
│  └── git push origin → GitHub                                          │
│                       │                                                  │
│                       ▼                                                  │
│  📦 GITHUB → Webhook Trigger                                            │
│     ├── 📱 PRODUTO/GAME    → Panda Store (Medusa)                      │
│     ├── 🔌 PLUGIN/MCP      → Panda Store (Medusa)                      │
│     ├── 🧩 EXTENSÃO VSX    → Comunidade (open marketplace)             │
│     └── 🤖 ANDROID APK     → Google Play / Panda Store                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 20.3. Fluxo ONLINE (Dev Interno - Dentro do Panda)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  CENÁRIO 2: DEV INTERNO (Dentro do Panda)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🐼 PANDA UI                                                            │
│  ├── Clica "Modo Dev"                                                   │
│  └── window.open('vscode.dev/github/{user}/{repo}')                    │
│                       │                                                  │
│                       ▼                                                  │
│  🖥️ JANELA VSCODE.DEV                   🦀 RUST AGENT (MCP)            │
│  ├── Editor completo ✅                 ├── execute_command (pwsh)     │
│  ├── Git integrado ✅                   ├── read_file                   │
│  ├── Extensões web ✅                   ├── write_file                  │
│  └── Commit → GitHub                    └── list_directory              │
│                       │                        │                        │
│                       ▼                        ▼                        │
│  📦 GITHUB → Mesmos Webhooks             Terminal real no PC            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 20.4. Toggle MCP - Interno vs Externo

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  MCP TOGGLE (Aprovação do Usuário)                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────┐                            │
│  │  🔘 MCP: [ INTERNO (Panda) | EXTERNO (PC) ]                        │
│  └─────────────────────────────────────────┘                            │
│                                                                          │
│  INTERNO → Acesso apenas à área sandbox do Panda                       │
│            Sem aprovação necessária                                     │
│                                                                          │
│  EXTERNO → Usuário aprova 1x                                           │
│            MCP acessa: Desktop, Documents, área de trabalho            │
│            Operações: read_file, write_file, execute_command           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 20.5. Estratégia de Armazenamento (Storage Strategy)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  ONDE GUARDAR O QUÊ?                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TIPO DE DADO            ONDE                    POR QUÊ                │
│  ──────────────          ────                    ──────                 │
│  📁 Arquivos do Dev      Google Drive (user)     Client-side, grátis    │
│  📊 JSONs/CSVs públicos  GitHub JSON             Versionado, grátis     │
│  👤 Dados do usuário     Firebase Auth           Já existe no Panda     │
│  💾 DB client-side       IndexedDB (browser)     Offline-first          │
│  📈 Dados compartilhados Google Sheets (GAS)     Já funciona            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 20.6. Cobertura do SDK (Tentáculos Existentes)

> ✅ **Já implementado** - não precisa de novo tentáculo!

| Tipo de Dado     | Storage       | Tentáculo SDK         | Localização                           |
| :--------------- | :------------ | :-------------------- | :------------------------------------ |
| **Arquivos**     | Google Drive  | `Panda.Google.Drive`  | `tentacles/google/children/drive.js`  |
| **Planilhas**    | Google Sheets | `Panda.Google.Sheets` | `tentacles/google/children/sheets.js` |
| **Auth**         | Firebase      | `Panda.Auth`          | core sdk                              |
| **JSON público** | GitHub        | `Panda.GitHub`        | `tentacles/github/`                   |

**API Drive disponível:**

```javascript
Panda.Google.Drive.list(folderId); // Lista arquivos
Panda.Google.Drive.upload(file); // Upload
Panda.Google.Drive.download(fileId); // Download
Panda.Google.Drive.createFolder(name); // Cria pasta
Panda.Google.Drive.search(query); // Busca
```

### 20.7. Integração Jam Canvas + Google Drive

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  JAM CANVAS ↔ GOOGLE DRIVE                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐   OAuth 2.0   ┌──────────────────┐                │
│  │   JAM CANVAS     │◄─────────────►│   GOOGLE DRIVE   │                │
│  │   (Panda UI)     │               │   (do usuário)   │                │
│  └──────────────────┘               └──────────────────┘                │
│           │                                  │                           │
│  ┌────────┴────────┐                ┌────────┴────────┐                 │
│  │ TOOLBAR DEV     │                │ PASTA PANDA     │                 │
│  │ ├── 📁 Arquivos │◄──────────────►│ ├── /projetos   │                 │
│  │ ├── 📊 JSONs    │                │ ├── /assets     │                 │
│  │ └── 🎨 Assets   │                │ └── /exports    │                 │
│  └─────────────────┘                └─────────────────┘                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 20.8. Decisões Técnicas (Jan 2026)

| Item               | Decisão                                  |
| :----------------- | :--------------------------------------- |
| **MCP Rust**       | 4 tools + toggle interno/externo         |
| **IDE interna**    | vscode.dev em janela + MCP para terminal |
| **Hooks**          | GitHub → Medusa / VSX / Android          |
| **Storage Drive**  | ✅ Tentáculo já existe                   |
| **Novo tentáculo** | ❌ Não necessário                        |

---

## 21. Pipeline de Publicação & Economia 「E2 | 3 tasks | 0/3」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                               | Etapa | Doc SSoT        |
> | ------ | --- | ---------------------------------- | ----- | --------------- |
> | [ ]    | 21  | Automated testing pipeline (CI/CD) | E2    | `CONTEXT.md §6` |
> | [ ]    | 22  | Staging environment                | E2    | `CONTEXT.md §6` |
> | [ ]    | 24  | Analytics + crash reporting        | E2    | `CONTEXT.md §6` |

> **Atualizado:** 2026-01-27 | **Status:** Aprovado

### 21.1. Princípio Fundamental

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  "PUBLICAR É GRÁTIS. USAR CUSTA."                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CRIADOR: Paga ZERO para publicar                                      │
│  ├── CI/CD → Custeado pelo Panda (GitHub Actions free tier)           │
│  ├── Security Scan → Custeado pelo Panda                               │
│  └── Listing na Store → Grátis                                         │
│                                                                         │
│  COMPRADOR: Paga PC pelo uso                                           │
│  ├── Download/Instalação → X PC (definido pelo Dev)                   │
│  ├── Uso mensal (SaaS) → Y PC/mês                                     │
│  └── Recursos consumidos → Z PC (API calls, GPU, etc)                 │
│                                                                         │
│  MOTIVO: Barreira zero para criadores = mais plugins = mais valor     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 21.2. Pipeline Completo

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  PIPELINE DE PUBLICAÇÃO                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣ DEV CRIA                            CUSTO: GRÁTIS                  │
│  └── Plugin/Bundle → git push → GitHub                                 │
│                                                                         │
│  2️⃣ VALIDAÇÃO AUTOMÁTICA                CUSTO: GRÁTIS                  │
│  ├── CI/CD checks (lint, build, test)                                  │
│  ├── Security scan (dependências)                                      │
│  └── Manifest validation (panda.json)                                  │
│                                                                         │
│  3️⃣ AUTO-APPROVE                        CUSTO: GRÁTIS                  │
│  └── 100% automático (Panda absorve)                                   │
│                                                                         │
│  4️⃣ PUBLICAÇÃO                          CUSTO: GRÁTIS                  │
│  ├── Panda Store listing criado                                        │
│  ├── Hooks gerados por plataforma                                      │
│  └── Analytics tracking ativado                                        │
│                                                                         │
│  5️⃣ MONETIZAÇÃO                         SPLIT: 55/22/15/5/3            │
│  ├── Split automático                                                  │
│  └── Payout mensal via PC ou fiat                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 21.3. USD-FIRST Pricing (Anti-Especulação)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  ESTRATÉGIA DE PREÇO - "USD-FIRST"                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PROBLEMA: Se PC valoriza, preços parecem caros                        │
│  SOLUÇÃO: Preço FIXO em USD, conversão para PC no momento              │
│                                                                         │
│  COMO FUNCIONA:                                                         │
│                                                                         │
│  1. Dev define PREÇO EM USD                                            │
│     └── Exemplo: Plugin X = $5.00                                      │
│                                                                         │
│  2. Sistema CONVERTE para PC no momento da compra                      │
│     └── $5.00 ÷ (PC atual) = quantidade PC                             │
│                                                                         │
│  EXEMPLOS:                                                              │
│                                                                         │
│     PC = $0.01 (hoje)    → $5 = 500 PC                                 │
│     PC = $0.05 (5x alta) → $5 = 100 PC                                 │
│     PC = $0.001 (queda)  → $5 = 5.000 PC                               │
│                                                                         │
│  RESULTADO: Comprador SEMPRE paga $5.00 em valor real                  │
│  BENEFÍCIO: Democratização protegida                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Stakeholder      | Benefício                     |
| :--------------- | :---------------------------- |
| **Comprador**    | Preço previsível em $         |
| **Dev**          | Receita estável em valor real |
| **Hodler PC**    | Precisa menos PC se valorizar |
| **Novo usuário** | Mesmo poder de compra         |

### 21.4. Founder Dashboard Pop-Out

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  FOUNDER DASHBOARD - POP-OUT WINDOW                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  COMPORTAMENTO:                                                         │
│  ├── Botão no Header: 🏭 Founder → window.open()                       │
│  ├── Janela independente (pode arrastar para outro monitor)            │
│  ├── Sempre no topo (toggle alwaysOnTop)                               │
│  └── Estado persistente: posição e tamanho salvos                      │
│                                                                         │
│  SEÇÕES:                                                                │
│  ├── 📊 OVERVIEW: Users, DAU, PC Circulante, Revenue                  │
│  ├── 🏦 TREASURY: Health Score, PAXG/USDC, Runway                      │
│  ├── 📦 STORE: Plugins, Vendas, Top sellers                           │
│  ├── 🔥 REALTIME: Compras live, Erros, Alertas                        │
│  └── ⚙️ CONTROLS: Kill Switch, PAT Override, Broadcast                │
│                                                                         │
│  AUTH: Herda sessão do Panda (Ed25519 já validado)                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 21.5. Decisões Econômicas (Jan 2026)

| Tópico                  | Decisão                        |
| :---------------------- | :----------------------------- |
| **Publicar plugin**     | GRÁTIS para criador            |
| **Auto-approve**        | GRÁTIS (free tier)             |
| **Preço plugins**       | USD-FIRST com conversão PC     |
| **Valorização PC**      | Não afeta preços reais         |
| **Founder Hook**        | Dashboard Pop-Out centralizado |
| **Free tier comprador** | 100 PC grátis/mês (newcomers)  |
| **Preço mínimo**        | $0.50 por plugin               |

### 21.6. Panda Defend - Sistema de Segurança

> 📚 **Referência Completa:** [PF_SECURITY_REFERENCE.md](./PF_SECURITY_REFERENCE.md)
> **Inspirado em:** Google Play Protect / App Defense Alliance

#### Arquitetura de 3 Camadas

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🛡️ PANDA DEFEND - SISTEMA DE PROTEÇÃO                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CAMADA 1: PRÉ-PUBLICAÇÃO (Gate Automático)                            │
│  ├── 🔍 Static Analysis    → CodeQL + Semgrep                          │
│  ├── 📦 Dependency Scan    → Snyk + Dependabot                         │
│  ├── 🧪 Sandbox Test       → Execução isolada 30s                      │
│  ├── 📋 Manifest Audit     → Permissões vs código real                 │
│  └── ✅ Score mínimo: 70/100 para aprovar                              │
│                                                                         │
│  CAMADA 2: PÓS-PUBLICAÇÃO (Monitoramento Contínuo)                     │
│  ├── 📊 Behavior Analytics → Padrões de uso anormais                   │
│  ├── 🗳️ User Reports      → Sistema de denúncias (3 = review)         │
│  ├── 🔄 Re-scan Diário     → CVEs novas detectadas                     │
│  └── ⚡ Auto-Suspend       → Se score cair < 50                        │
│                                                                         │
│  CAMADA 3: FOUNDER OVERRIDE (Controle Manual)                          │
│  ├── 🔴 Kill Switch        → Remove instantâneo                        │
│  ├── 🟡 Suspend            → Pausa vendas pendente review              │
│  ├── 🟢 Force Approve      → Bypass manual (logado)                    │
│  └── 📝 Audit Trail        → Toda ação é registrada                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Regras de Bloqueio (Resumo)

| ID      | Regra                                | Risco       |
| :------ | :----------------------------------- | :---------- |
| R1-R3   | eval(), document.write(), innerHTML  | XSS/RCE     |
| R4-R6   | Cross-origin, fetch, frame access    | Exfiltração |
| R7-R8   | Crypto mining, obfuscação            | Malware     |
| R9-R11  | Prototype pollution, secrets, crypto | RCE/Leak    |
| R12-R14 | IA bypass, billing, MCP required     | Receita     |

> **14 regras Semgrep** documentadas em detalhes na [referência completa](./PF_SECURITY_REFERENCE.md).

#### Fluxo de Aprovação

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  FLUXO: git push → Store                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. DEV: git push                                                      │
│     │                                                                   │
│  2. GITHUB ACTIONS                                                     │
│     ├── CodeQL scan ────────┐                                          │
│     ├── Semgrep rules ──────┼──► SCORE                                │
│     ├── Snyk deps ──────────┤    CALCULADO                             │
│     └── Manifest check ─────┘                                          │
│     │                                                                   │
│  3. DECISÃO AUTOMÁTICA                                                 │
│     ├── Score ≥ 70 → ✅ AUTO-APPROVE                                  │
│     ├── Score 50-69 → 🟡 MANUAL REVIEW                                │
│     └── Score < 50 → 🔴 AUTO-REJECT                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Decisão       | Threshold   |
| :------------ | :---------- |
| Auto-approve  | Score ≥ 70  |
| Manual review | Score 50-69 |
| Auto-reject   | Score < 50  |

---

# PARTE III: ECOSSISTEMA ECONÔMICO

---

## 9. P2P Compute Network 「E3-E4 | 5 tasks | 0/5」

> 📋 **Roadmap Tasks nesta seção:**
>
> | Status | #   | Task                             | Etapa | Doc SSoT               |
> | ------ | --- | -------------------------------- | ----- | ---------------------- |
> | [ ]    | 31  | P2P Network MVP (WebRTC/libp2p)  | E3    | `P2P_REF`              |
> | [ ]    | 32  | Distributed compute orchestrator | E3    | `P2P_REF`              |
> | [ ]    | 33  | Node reputation system           | E3    | `P2P_REF`              |
> | [ ]    | 34  | GPU marketplace                  | E3    | `P2P_REF`              |
> | [ ]    | 39  | Edge computing (DePIN)           | E4    | `P2P_REF`, `INFRA_REF` |

> 📚 **Referência:** [PF_P2P_REFERENCE.md](./PF_P2P_REFERENCE.md)

### 9.1. Mindmap P2P

```text
                          ┌────────────────────────────────────┐
                          │     🌐 PANDA P2P COMPUTE NETWORK   │
                          └────────────────┬───────────────────┘
                                           │
        ┌──────────────────────────────────┼──────────────────────────────────┐
        │                                  │                                   │
        ▼                                  ▼                                   ▼
┌───────────────────┐          ┌───────────────────┐          ┌───────────────────┐
│  🖥️ PARTNER MODE  │          │  ⚡ COMPUTE POOL  │          │  💰 REWARD SYSTEM │
│  (Resource Host)  │          │  (Task Dispatch)  │          │  (PC Distribution)│
├───────────────────┤          ├───────────────────┤          ├───────────────────┤
│ • Join network    │          │ • text.gen (5 PC) │          │ • 95% → Host      │
│ • Share CPU/GPU   │          │ • image.gen (40)  │          │ • 2.5% → Panda    │
│ • Earn PC auto    │          │ • video.gen (500) │          │ • 2.5% → Incentive│
│ • Mining optional │          │ • code.compile    │          │                   │
└───────────────────┘          │ • ml.training     │          └───────────────────┘
                               └───────────────────┘
```

### 9.2. Node Tiers

| Tier      | Multiplier | RAM   | Cores | GPU       | Uptime |
| --------- | ---------- | ----- | ----- | --------- | ------ |
| 🌱 Seed   | 1.0x       | 4GB+  | 2+    | -         | 90%    |
| 🌿 Sprout | 1.5x       | 8GB+  | 4+    | -         | 95%    |
| 🌳 Tree   | 2.5x       | 16GB+ | 8+    | Any       | 99%    |
| 🌲 Forest | 4.0x       | 32GB+ | 12+   | RTX 30+   | 99%    |
| ⛰️ Titan  | 8.0x       | 64GB+ | 16+   | Multi-GPU | 99%    |

### 9.3. Fluxo de Operação

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         P2P COMPUTE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │   USER A    │    │    GAS      │    │  REGISTRY   │    │   NODE B    │ │
│  │ (Consumer)  │    │  Backend    │    │  (Matcher)  │    │   (Host)    │ │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│         │                  │                  │                  │        │
│         │  submitTask()    │                  │                  │        │
│         │─────────────────►│                  │                  │        │
│         │                  │  findNode()      │                  │        │
│         │                  │─────────────────►│                  │        │
│         │                  │                  │  match(tier)     │        │
│         │                  │                  │─────────────────►│        │
│         │                  │                  │                  │        │
│         │                  │◄─────────────────│◄─────────────────│        │
│         │                  │     nodeId       │     available    │        │
│         │                  │                  │                  │        │
│         │                  │  dispatch(task)  │                  │        │
│         │                  │────────────────────────────────────►│        │
│         │                  │                  │                  │        │
│         │                  │◄────────────────────────────────────│        │
│         │                  │     result       │                  │        │
│         │                  │                  │                  │        │
│         │  pay 95% PC      │                  │                  │        │
│         │                  │──────────────────────────credit()───►│       │
│         │                  │                  │                  │        │
│         │◄─────────────────│                  │                  │        │
│         │    result        │                  │                  │        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.4. Implementação

| Layer    | File                                   | Description                            |
| -------- | -------------------------------------- | -------------------------------------- |
| **GAS**  | `1.core/domains/p2p/PF_P2P.gs`         | P2PService (register, heartbeat, task) |
| **SDK**  | `5.tentacles/5.8.p2p/pf.p2p-parent.js` | pf.p2p.\* API                          |
| **Rust** | `7.7.rust-agent/src/node.rs`           | NodeManager, tier detection            |
| **Rust** | `7.7.rust-agent/src/mining.rs`         | Mining integration                     |

### 9.5. API Summary

```javascript
// SDK Usage
await pf.p2p.register();           // Auto-detect resources, join network
await pf.p2p.submitTask('text.gen', { prompt: 'Hello' });
await pf.p2p.getStats();           // { tier, totalPc, uptime }

// GAS Endpoints
P2P_REGISTER     → Register node
P2P_HEARTBEAT    → Keep alive (60s)
P2P_SUBMIT_TASK  → Submit compute task
P2P_COMPLETE_TASK → Complete + pay host
P2P_STATS        → Get node stats
```

---

## 22. System Design Principles (P2)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P2

### 22.1. 12-Factor App Checklist

O Panda Factory adere aos 12 fatores para aplicações cloud-native:

| #   | Fator                   | Status | Implementação PF                        |
| --- | ----------------------- | ------ | --------------------------------------- |
| 1   | **Codebase**            | ✅     | Monorepo GitHub, multi-deploy           |
| 2   | **Dependencies**        | ✅     | `package.json`, `Cargo.toml` explícitos |
| 3   | **Config**              | ✅     | `PF_Config.gs` + `.env` local           |
| 4   | **Backing Services**    | ✅     | Firebase, GAS via URLs configuráveis    |
| 5   | **Build, Release, Run** | ✅     | GitHub Actions → Dist → GH Pages        |
| 6   | **Processes**           | ✅     | Stateless (estado no Firebase)          |
| 7   | **Port Binding**        | ✅     | Rust Agent exports HTTP/WS              |
| 8   | **Concurrency**         | ✅     | Task fractionation P2P                  |
| 9   | **Disposability**       | ✅     | Fast startup, graceful shutdown         |
| 10  | **Dev/Prod Parity**     | 🟡     | Mock SDK para dev local                 |
| 11  | **Logs**                | ✅     | Event stream (console + Firebase)       |
| 12  | **Admin Processes**     | ✅     | GAS Admin actions one-off               |

### 22.2. CAP Theorem Trade-offs

O Panda Factory é um sistema **AP (Availability + Partition Tolerance)**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAP THEOREM - PANDA FACTORY                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         C (Consistency)                                  │
│                              ▲                                           │
│                             /│\                                          │
│                            / │ \                                         │
│                           /  │  \                                        │
│                          /   │   \                                       │
│                         / CA │ CP \                                      │
│                        /     │     \                                     │
│                       /      │      \                                    │
│                      /   ★ AP│       \                                   │
│                     ▼────────┴────────▼                                  │
│               A (Availability)    P (Partition)                          │
│                                                                          │
│  ★ PANDA FACTORY = AP (Eventualmente Consistente)                       │
│                                                                          │
│  MOTIVO: Preferimos que usuário continue trabalhando offline            │
│          do que falhar por falta de consistência imediata               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Trade-offs adotados:**

| Cenário           | Escolha           | Justificativa          |
| ----------------- | ----------------- | ---------------------- |
| Wallet offline    | Aceitar operações | Sync quando reconectar |
| Conflito de dados | Last-Write-Wins   | Simplicidade           |
| P2P task failure  | Retry em outro nó | Disponibilidade        |
| Brain offline     | Local AI fallback | UX contínua            |

### 22.3. Observability Stack

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY STACK                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📊 METRICS        📝 LOGS           🔗 TRACES                           │
│  ┌───────────┐    ┌───────────┐    ┌───────────┐                        │
│  │ Health    │    │ Console   │    │ Request   │                        │
│  │ Latency   │───►│ Firebase  │───►│ ID        │                        │
│  │ Errors    │    │ Stackdrv  │    │ Span      │                        │
│  └───────────┘    └───────────┘    └───────────┘                        │
│        │                │                │                               │
│        └────────────────┼────────────────┘                               │
│                         ▼                                                │
│              ┌─────────────────────┐                                     │
│              │  PANDA DASHBOARD    │                                     │
│              │  (Health Monitor)   │                                     │
│              └─────────────────────┘                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Métricas coletadas:**

```javascript
// SDK telemetry
Panda.Telemetry.track({
  name: "api.latency",
  value: 245,
  tags: { endpoint: "wallet.balance", status: "success" },
});

// Automatic collection
Panda.Telemetry.enable({
  metrics: true, // Performance metrics
  logs: true, // Console forwarding
  traces: true, // Request tracing
  sampleRate: 0.1, // 10% sampling
});
```

---

> _Panda Fabrics - Arquitetura Refatorada & Econômica 2026_

---

## Changelog

| Versao | Data       | Alteracoes                                                                                          |
| ------ | ---------- | --------------------------------------------------------------------------------------------------- |
| 3.6.0  | 2026-03-04 | +Task #43 MCP Orchestrator (useMCPRegistry, PFOrchestrator, AI context injection, 12 mods/46 tools) |
| 3.4.0  | 2026-02-21 | Sprint E1 Phase 2C: +facebook-messenger.js, +tiktok.js, youtube.js v2.0, +3 PF_MODULE docs          |
| 3.2.0  | 2026-02-19 | Roadmap-driven: badges inline em 13 seções, task tables por seção, CONTEXT.md refs atualizados      |
| 3.1.0  | 2026-02-19 | §0.2 ROADMAP MASTER fundido do ROADMAP.md (42 tasks, 5 etapas, cronograma macro)                    |
| 3.0.0  | 2026-02-14 | MCP header padronizado, +00.credentials/ na arvore                                                  |
| 3.0.0  | 2026-02-12 | Reorganizacao em 5 partes, diagramas ASCII, consolidacao                                            |
| 2.5.0  | 2026-02-06 | Adicao de Research Ranking, AI/HPC hub                                                              |
| 2.0.0  | 2026-01-25 | Estrutura numerada, indice visual                                                                   |
| 1.0.0  | 2026-01-07 | Criacao inicial do documento                                                                        |
