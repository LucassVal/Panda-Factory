# 🐼 Panda Factory

> **Runtime Minimalista + Module-First + IA Nativa (MCP)**

<p align="center">
  <img src="LOGO/logo%20git%20hub.png" alt="Panda Factory" width="250">
</p>

---

## ✨ O que é o Panda Factory?

Um **runtime minimalista** onde plugins IA-first rodam:

- 🐼 **Core Enxuto** — Shell mínimo, tudo via módulos e tentáculos
- 🤖 **MCP Obrigatório** — Toda tool é entendida pela IA nativamente
- 🛒 **Medusa Store** — Marketplace de módulos, tentáculos e themes
- 🔌 **Zero Barrier** — Devs integram grátis, monetização no usuário final
- 🚀 **Multi-Plataforma** — Web, Desktop (Tauri), Mobile (PWA)
- 🔄 **SDK Bidirecional** — Hooks inbound (Kiwify, Hotmart) e outbound (PlayStore, Steam)
- ⚡ **GAS Tri-Mode** — Backend único: JSON API + WEB pages + MCP manifest
- 🔍 **Verification System** — 13 agentes health 3-state (Healthy/Degraded/Unhealthy)
- 📊 **Founder Dashboard** — Painel exclusivo com visão total do sistema em tempo real

---

## 🗂️ Estrutura de Pastas (Numerada)

```text
PandaFactory/
├── 1.core/           # ☁️ Google Apps Script (17 arquivos GAS)
│   ├── 1.1.gas/      #    9 core modules
│   ├── 1.2.domains/  #    finance, store, automation, p2p
│   └── 1.3.sdks/     #    Stripe, PagSeguro
├── 2.system/         # 🔧 System-level (kernel, loader, verification)
├── 3.sdk/            # 🐼 Panda SDK Core (17 namespaces)
├── 4.ui/             # 🎨 UI Componentes & Módulos (HTML)
├── 5.tentacles/      # 🔌 9 Integration Modules
│   ├── 5.1.brain/    #    AI/ML (Gemini, LocalLLM)
│   ├── 5.2.google/   #    Drive, Sheets, Colab
│   ├── 5.3.social/   #    WhatsApp, Twitter, Meta
│   ├── 5.4.trading/  #    cTrader Open API
│   ├── 5.5.distribution/ # PWA, Steam, itch.io
│   ├── 5.6.education/#   Kiwify, Hotmart, Eduzz
│   ├── 5.7.github/   #    Pages, JSON DB, Actions
│   ├── 5.8.p2p/      #    🌐 P2P Compute Network
│   └── 5.9.monitor/  #    Health/Telemetry
├── 6.integrations/   # 🔗 (vazio — placeholder)

├── 7.rust-agent/     # 🦀 Local Agent (Tauri/MCP, 8 modules)
├── 8.docs/           # 📚 16 reference documents (MCP Manifest)
├── 9.tools/          # 🔧 Dev utilities & scripts
├── 10.assets/        # 🖼️ CSS, Images, Fonts
└── 11.jam/           # 🍇 React Frontend (Vite + TLDraw)
```

---

## 🔌 Integrações (Medusa Tentacles)

| Categoria            | Conexões                                       | Status     |
| -------------------- | ---------------------------------------------- | ---------- |
| 💬 **Social**        | WhatsApp, Telegram, Twitter, Instagram, TikTok | 🚧 Q2 2026 |
| 📺 **Conteúdo**      | YouTube, Twitch, Spotify                       | 🚧 Q3 2026 |
| 💰 **Pagamentos**    | Kiwify, Hotmart, Stripe, Pix                   | 🚧 Q2 2026 |
| 📈 **Trading**       | cTrader, Binance                               | 🚧 Q3 2026 |
| 🎮 **Games**         | Godot, Unity, Steam                            | 🚧 Q3 2026 |
| ☁️ **Google**        | Drive, Sheets, Colab, Ads, Analytics           | ✅ Active  |
| 🐙 **GitHub**        | Pages, Actions, API                            | ✅ Active  |
| 🌐 **Landing Pages** | Drag-and-drop builder via TLDraw               | 🚧 Q2 2026 |
| ⛽ **Gasômetro**     | Dashboard de uso do GAS                        | 🚧 Q2 2026 |
| 📱 **Google Play**   | App mobile distribution                        | 🚧 Q3 2026 |

### 🥝 Kiwify & 🔥 Hotmart — Infoprodutos ($3.2B/ano)

Conexão direta com as maiores plataformas de produtos digitais do Brasil:

```
AÇÃO DO USUÁRIO                       → O QUE ACONTECE                      → RECEITA
─────────────────────────────────────────────────────────────────────────────────────
Criador builda curso no Panda        → Gemini gera conteúdo + quizzes       → —
Criador publica na Kiwify/Hotmart    → Medusa.tentacle("kiwify").publish()  → —
Comprador compra o curso             → Webhook dispara Panda Hook           → 70/20/10 split
Panda armazena assets do curso       → Salvo no Google Drive do criador     → Drive API
Gasômetro monitora execuções GAS     → Dashboard analytics em tempo real     → GAS monitoring
```

### 🌐 Landing Page Builder

Usuários criam landing pages profissionais dentro do Panda Factory:

- Drag-and-drop no TLDraw canvas (sem código)
- IA gera copy e imagens via Gemini
- Publicação direta no GitHub Pages ou domínio próprio
- Assets no Google Drive do usuário (não em servidores Panda)
- Tracking via Google Analytics tentacle
- Leads capturados no Google Sheets automaticamente

### ⛽ Gasômetro — Monitor de Uso GAS

- **Quotas diárias**: Visualiza execuções GAS restantes
- **Cost mapping**: Quais operações consomem mais quota
- **Alertas auto-scaling**: Notifica antes de atingir o free-tier
- **Sugestões IA**: Gemini recomenda estratégias de batching

### ☁️ Drive-First — O Usuário É Dono dos Dados

> **Filosofia**: O Panda nunca retém dados do usuário. Todos os arquivos são salvos no Google Drive **do próprio usuário**. O Panda faz hook nos arquivos via SDK para editar, processar com IA e distribuir — mas o usuário sempre controla seus dados.

```
SAAS TRADICIONAL                    PANDA FACTORY
─────────────────                   ─────────────
Arquivos no servidor DELES  →       Arquivos no SEU Google Drive
Exportar = pagar extra      →       Já está no seu Drive
Plataforma morre = dados    →       Dados sobrevivem pra sempre
Vendor lock-in              →       Zero lock-in
```

---

## 💎 Economia (Panda Coin)

| Tier           | Benefício                              |
| -------------- | -------------------------------------- |
| 🆓 **Free**    | 500k tokens/mês grátis                 |
| 💰 **Ganhe**   | Venda módulos/tentáculos, 70% pra você |
| 🏆 **Top 100** | 30% desconto vitalício                 |

### ⚡ Hooks — Motor de Riqueza

Cada ação significativa dispara distribuição automática de receita:

```
TODA TRANSAÇÃO:
├── 70% → Criador do Plugin (renda passiva 💰)
├── 20% → Plataforma (crescimento sustentável)
└── 10% → PAT Treasury (reserva IA autônoma)
```

| Participante              | Como Ganha                              | Passivo?    |
| ------------------------- | --------------------------------------- | ----------- |
| **Criadores de Plugin**   | 70% de cada transação                   | ✅ Sim      |
| **Operadores P2P**        | Panda Coins por compartilhar GPU/CPU    | ✅ Sim      |
| **Criadores de Conteúdo** | Medusa distribui → hooks de monetização | ✅ Sim      |
| **Usuários Ativos**       | Ganham PC por tarefas e indicações      | ❌ Ativo    |
| **PAT Treasury**          | 10% reserva, governada por IA           | ✅ Autônoma |

---

## 🗺️ ROADMAP UNIFICADO 2026

### Status Geral

| Fase               | Status  | Período  | Foco Principal              |
| ------------------ | ------- | -------- | --------------------------- |
| **0 - Foundation** | ✅ 100% | Jan/2026 | Shell, SDK, GAS Backend     |
| **1 - Dia 1**      | 🚧 95%  | Fev/2026 | Docs, System Design, UI     |
| **2 - Escala**     | ⏳ 10%  | Mar-Abr  | Tentacles Real, P2P, Medusa |
| **3 - Expansão**   | ⏳ 0%   | Q2-Q3    | EdTech, Marketplace, Mobile |

### Fase 1 - Detalhes (Fev/2026)

| Componente           | Status  | Notas                                              |
| -------------------- | ------- | -------------------------------------------------- |
| SDK Core v1.0.0      | ✅ 100% | 17 namespaces (15 mock + Loader + EventBus)        |
| Rust Agent (8 mods)  | ✅ 100% | crypto, gpu, health, mcp, mining                   |
| Documentação (16)    | ✅ 100% | Consolidada: Social+Plugin→SDK, MCP Headers        |
| System Design P0     | ✅ 100% | Idempotency, Circuit Breaker, Events               |
| MCP Protocol         | ✅ 100% | Tri-Mode GAS integrado                             |
| Panda Defend         | ✅ 100% | 14 regras Semgrep documentadas                     |
| Mock Mode (DevTools) | ✅ 100% | Panda.Config.useMock                               |
| UI Design System     | ✅ 100% | Design System completo (`pf.css`, tokens `--pf-*`) |
| JAM React UI v6.4    | ✅ 100% | Dock 5 itens, 🔔 StatusBar, Production Build ready |
| Auth Ed25519         | 🚧 50%  | Crypto pronto, integração pendente                 |
| Medusa Store UI      | ✅ 80%  | v3.1: 9 extensões reais, sem taxonomy labels       |
| GAS Real Deploy      | ⏳ 0%   | Próximo: useMock: false                            |
| GitHub Pages Deploy  | ✅ 100% | Vite build + auto-deploy (pages.yml)               |

### Roadmap Detalhado por Etapa

**Fase 0 — Foundation** ✅ `Jan/2026`

- ✅ Shell mínimo + PF_Dispatcher (Tri-Mode GAS)
- ✅ SDK v1.0.0 (17 namespaces: Auth, Brain, Canvas, Polyglot, Storage, Google...)
- ✅ Rust Agent (8 modules: GPU, MCP, Mining, Health...)
- ✅ Firebase RTDB Backend (panda-hook-master)

**Fase 1 — Dia 1** 🚧 `Fev/2026`

- ✅ System Design P0 (Idempotency, Circuit Breaker, Events)
- ✅ MCP Protocol (Tri-Mode + Manifest Headers)
- ✅ Panda Defend (14 regras Semgrep)
- ✅ Mock Mode / DevTools (`Panda.Config.useMock`)
- ✅ Documentação consolidada (20→16 docs, MCP Headers, Diagramas)
- ✅ Social + Plugin integrados ao SDK Reference v1.5.0
- ✅ UI Design System — tokens completos, skeleton, focus, animations (`pf.css`)
- ✅ JAM React UI v6.4 — Dock v6.2 (5 itens), 🔔 na StatusBar, Store v3.1, 40+ components
- ✅ GitHub Pages Deploy — Vite production build (pages.yml reescrito)
- 🚧 Auth Ed25519 — crypto pronto, falta integração real
- ✅ Medusa Store UI v3.1 — 9 extensões (CRM, 5 redes sociais, Google Ads, Meta, Analytics)

**Fase 2 — Escala + Monetização** ⏳ `Mar-Abr/2026`

- ⏳ GAS Real Deploy (`useMock: false`)
- ⏳ PWA + GitHub Pages otimizado
- ⏳ Kiwify/Hotmart webhooks reais
- ⏳ Landing Page Builder (TLDraw → HTML export)
- ⏳ Gasômetro v1.0 (dashboard de quotas GAS)

**Fase 3 — Expansão** ⏳ `Q2-Q3/2026`

- ⏳ Google Play Store (PWA → TWA wrapper)
- ⏳ EdTech Hub completo
- ⏳ Plugin Marketplace (devs externos, revenue split)
- ⏳ Panda Coin economia real (fiat gateway)
- ⏳ Internacionalização (i18n)
- ⏳ Google One upsell integration

---

## 📚 DOCUMENTAÇÃO (16 Docs - MCP Manifest)

> **Formato MCP:** Cada doc é uma tool context que a IA pode consultar.

### 🏛️ Core (Start Here)

| Arquivo                                                | Tool Context         | Descrição                                        |
| ------------------------------------------------------ | -------------------- | ------------------------------------------------ |
| [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md) | `panda/architecture` | Diagramas, fluxos, estrutura completa do sistema |
| [PF_FILE_REGISTRY.md](PF_FILE_REGISTRY.md)             | `panda/files`        | Catálogo de todos os arquivos do projeto         |

### 💻 Frontend & SDK

| Arquivo                                    | Tool Context | Descrição                                                    |
| ------------------------------------------ | ------------ | ------------------------------------------------------------ |
| [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) | `panda/sdk`  | API dos 17 namespaces: Auth, Brain, Canvas, Store, Google... |
| [PF_UI_REFERENCE.md](PF_UI_REFERENCE.md)   | `panda/ui`   | Design System, tokens CSS, componentes, layouts              |

### ⚙️ Backend & Infra

| Arquivo                                            | Tool Context    | Descrição                                    |
| -------------------------------------------------- | --------------- | -------------------------------------------- |
| [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md) | `panda/backend` | Circuit Breaker, Backoff, Fallback, Firebase |
| [PF_GAS_REFERENCE.md](PF_GAS_REFERENCE.md)         | `panda/gas`     | Google Apps Script - Tri-Mode (API/Web/MCP)  |
| [PF_P2P_REFERENCE.md](PF_P2P_REFERENCE.md)         | `panda/p2p`     | Rede P2P, compute nodes, mining              |
| [PF_MCP_REFERENCE.md](PF_MCP_REFERENCE.md)         | `panda/mcp`     | Model Context Protocol spec                  |

### 🤖 AI & Integrations

| Arquivo                                              | Tool Context    | Descrição                   |
| ---------------------------------------------------- | --------------- | --------------------------- |
| [PF_GEMINI_REFERENCE.md](PF_GEMINI_REFERENCE.md)     | `panda/gemini`  | Gemini 2.0, 6 GEMs          |
| [PF_COLAB_REFERENCE.md](PF_COLAB_REFERENCE.md)       | `panda/colab`   | Templates GPU/ML, notebooks |
| [PF_AGENT_CONSTITUTION.md](PF_AGENT_CONSTITUTION.md) | `panda/persona` | Persona pública da IA       |

### 💰 Economy & Security

| Arquivo                                              | Tool Context     | Descrição                               |
| ---------------------------------------------------- | ---------------- | --------------------------------------- |
| [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md)   | `panda/economy`  | Panda Coin, Idempotency, Event Sourcing |
| [PF_SECURITY_REFERENCE.md](PF_SECURITY_REFERENCE.md) | `panda/security` | Panda Defend, 14 regras Semgrep         |

### 🧩 Plugins & Ecosystem

| Arquivo                                                          | Tool Context         | Descrição                             |
| ---------------------------------------------------------------- | -------------------- | ------------------------------------- |
| [PF_MEDUSA_REFERENCE.md](PF_MEDUSA_REFERENCE.md)                 | `panda/store`        | Marketplace, Google Drive integration |
| [PF_OPENSOURCE_CATALOG.md](PF_OPENSOURCE_CATALOG.md)             | `panda/oss`          | Catálogo open source                  |
| [PF_PAT_FOUNDER_CONSTITUTION.md](PF_PAT_FOUNDER_CONSTITUTION.md) | `panda/constitution` | Constituição PAT + Founder governance |

---

## 🔗 REPOSITÓRIOS

| Repo                                                                    | Descrição        | Acesso     |
| ----------------------------------------------------------------------- | ---------------- | ---------- |
| [Panda-Factory](https://github.com/LucassVal/Panda-Factory)             | Código principal | 🔒 Privado |
| [panda-sdk](https://github.com/LucassVal/panda-sdk)                     | SDK Core         | 🔒 Privado |
| [panda-sdk-community](https://github.com/LucassVal/panda-sdk-community) | Docs, templates  | 🌐 Público |

```text
🔒 PRIVADO                      🌐 PÚBLICO
Panda-Factory + panda-sdk  ──▶  panda-sdk-community
(código, secrets)               (docs sanitizados)
```

---

## 🚀 Quick Start

```javascript
import Panda from "panda-sdk";

await Panda.Brain.chat("Analise meus dados");
await Panda.Social.WhatsApp.send("Olá!");
await Panda.Trading.CTrader.connect({ accountId: 123 });
```

---

## 🌐 Links

| Plataforma      | Link                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| 📱 **App**      | [lucassval.github.io/Panda-Factory](https://lucassval.github.io/Panda-Factory/) |
| ☁️ **Colab**    | Templates GPU/ML (ver PF_COLAB_REFERENCE)                                       |
| 🔥 **Firebase** | `panda-hook-master` (RTDB Backend)                                              |
| 📧 **GAS**      | [Script Project](https://script.google.com) (ID privado)                        |

---

## 📜 Licença

MIT License © 2026 Panda Factory

---

<p align="center">
  <strong>Feito com 🐼 por Lucas Valério</strong>
  <br><em>"Democratizando IA para todos"</em>
</p>
