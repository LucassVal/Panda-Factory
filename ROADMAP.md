# 🐼 PANDA FACTORY — ROADMAP ESTRATÉGICO COMPLETO

> **Versão:** 1.3.0 | **Atualizado:** 2026-02-19
> **Tese:** Converter afiliados Kiwify/Hotmart em criadores vibe-code no Panda.
> **Modelo:** Founder Solo → Guerrilha → Comunidade → Escala
> **Base:** 18 PF\_ docs SSoT + CONTEXT.md (~8.000L analisadas)
> **Pagamento:** Stripe Brasil Direto (CPF, sem CNPJ, MoR via Managed Payments) + Paddle (fallback)
> **SSoT:** Este arquivo. Para referência cruzada: `council_viability_report.md §15`

---

## 📋 Índice

| Seção                                                     | Conteúdo                                |
| --------------------------------------------------------- | --------------------------------------- |
| [1. Inventário Real](#1-inventário-real)                  | O que existe vs o que falta             |
| [2. Etapa 0 — Foundation ✅](#2-etapa-0--foundation-)     | Tudo que já foi construído              |
| [3. Etapa 1 — Founder Solo 🚧](#3-etapa-1--founder-solo-) | Backend real + 1ª venda + revenue dia 1 |
| [4. Etapa 2 — Guerrilha 🎯](#4-etapa-2--guerrilha-)       | Converter afiliados em criadores        |
| [5. Etapa 3 — Flywheel ⏳](#5-etapa-3--flywheel-)         | Efeito rede + mining + P2P alpha        |
| [6. Etapa 4 — Escala ⏳](#6-etapa-4--escala-)             | Token, P2P real, multi-store publish    |
| [7. Cobertura Documental](#7-cobertura-documental)        | Mapa task ↔ doc SSoT                    |
| [8. Splits & Economia](#8-splits--economia)               | Todas as regras financeiras             |
| [9. Integrações](#9-integrações)                          | Todos os canais e conexões              |
| [10. Segurança](#10-segurança)                            | Pipeline completo de proteção           |
| [11. Cronograma Macro](#11-cronograma-macro)              | Visão timeline                          |

---

## 1. Inventário Real

### ✅ Feito (Etapa 0 — Foundation)

| Camada               | O que existe                                                                                                                                                                                                                  | Qtd               | Status         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------- |
| **Frontend**         | React App v6.5, TLDraw canvas, Multi-Window PiP (flexlayout-react), LoginGate v8.0 (6 features, stats, trust signals), Welcome Wizard v2 (4-step onboarding), Store v3.2 (12 extensões), Light/Dark mode, GitHub Pages deploy | 31 componentes PF | ✅ Live        |
| **SDK**              | 17 namespaces: Auth, Data, UI, Brain, Wallet, Store, Social, Trading, Games, P2P, MCP, Tentacle, DRM, Security, Events, i18n, Publish                                                                                         | 12 .js files      | 🟡 Mock        |
| **GAS Backend**      | Dispatcher, Core_Webhooks, Sales, Wallet, Heartbeat, MCP, P2P, AI, Config — não publicados como Web App                                                                                                                       | 9 .gs files       | 🟡 Mock        |
| **Rust Agent**       | Ed25519 (verificação licença), MCP tools (registration), mining.rs, phantom.rs                                                                                                                                                | 8 .rs files       | 🟡 Parcial     |
| **Tentacles**        | 9 parents + 28 children (brain, social, trading, games, education, devtools, monitor, community, plugins)                                                                                                                     | 37 .js files      | 🟡 Mock        |
| **Docs**             | MASTER_ARCH (201KB), SDK_REF (83KB), ECONOMY_REF (94KB), + 14 outros docs SSoT, CONTEXT.md (72KB), File Registry (274+ arquivos)                                                                                              | 17 PF\_ docs      | ✅             |
| **Economia**         | Split Master v3.0 (4 paths), PC pricing (7 pacotes $20-$5K), Top 100 Dev desconto, 3 tiers (Founder/Beta/Standard), Kiwify/Hotmart split documentado, Co-produção, Usage Split, Referral Boost                                | —                 | ✅ Documentado |
| **Medusa/Store**     | Pipeline (GitHub Actions + Google Drive publish), manifest spec (panda.manifest.json), Casulo/BundleCreator, sandbox model (iframe), namespace (@panda/ @user/)                                                               | —                 | ✅ Documentado |
| **Segurança**        | Panda Defend (3 camadas), Kill Switch (Ed25519 Founder-only), DRM spec, PAT Constitution (14 Artigos), anti-bypass rules (3 violações hardcoded)                                                                              | —                 | ✅ Documentado |
| **Governança**       | Sistema Montesquieu (3 poderes documentais), SSoT Matrix (23 tópicos), 8 Cadeiras do Council, Classification Matrix (5 tipos), Guardrails (6 safety interlocks)                                                               | —                 | ✅             |
| **Infra/CI**         | GitHub Actions (pages.yml), dual-repo (origin privado + panda público), .gitignore strategy, .antigravityignore (AI filter)                                                                                                   | —                 | ✅             |
| **Google Ecosystem** | GEAR member, Firebase Studio Community, GDG, Google for Startups (aplicado accelerator deadline 01/03), AI Studio, Cloud Ensina, ADK docs                                                                                     | 12 comunidades    | ✅ Ativo       |

### ⏳ O Que Falta — Por Prioridade

| #   | Feature                                                           | Fonte SSoT                     | Status Atual                                     | Etapa  |
| --- | ----------------------------------------------------------------- | ------------------------------ | ------------------------------------------------ | ------ |
| 1   | Firebase RTDB Rules + Schema                                      | `BACKEND_REF §7`, `CONTEXT §9` | ⏳ Projeto existe, rules/schema não configurados | E1-S1A |
| 2   | Firebase Auth providers (Email + Google)                          | `CONTEXT §9`                   | ✅ Providers habilitados (Email+Google live)     | E1-S1A |
| 3   | GAS Deploy como Web App (doPost público)                          | `GAS_REF`, `CONTEXT §9`        | 🟡 9 .gs existem, não publicados                 | E1-S1A |
| 4   | GAS Webhook handler Kiwify/Hotmart real                           | `SDK_REF`, `ECONOMY_REF`       | 🟡 Mock (handleKiwifyWebhook stub)               | E1-S1A |
| 5   | SDK Auth wiring (mock→Firebase Auth real)                         | `SDK_REF §Auth`                | 🟡 useAuth parcial (Google+Gate, RTDB pending)   | E1-S1A |
| 6   | SDK Wallet wiring (mock→RTDB real)                                | `SDK_REF §Wallet`              | 🟡 Mock balance/history                          | E1-S1A |
| 7   | CSP + SRI + CORS security headers                                 | `SECURITY_REF`, `CONTEXT §9`   | ⏳ P0 segundo CONTEXT                            | E1-S1A |
| 8   | PC Economy Real — compra de pacotes                               | `ECONOMY_REF §9.1`             | ⏳ 7 pacotes documentados, não implementados     | E1-S1B |
| 9   | Store Purchases Real — PC debit ao instalar                       | `MEDUSA_REF`                   | ⏳ Mock "installed"                              | E1-S1B |
| 10  | **Anúncios para PC** (Featured/Sponsored na Store)                | `MEDUSA_REF P4`, `AGENT_CONST` | ⏳                                               | E1-S1B |
| 11  | Listing Kiwify/Hotmart — produto live + afiliados                 | —                              | ⏳                                               | E1-S1B |
| 12  | Chat AI real (Panda.Brain.chat → Gemini 3)                        | `GEMINI_REF`, `SDK_REF §Brain` | 🟡 Mock                                          | E1-S1C |
| 13  | PWA real (vite-plugin-pwa, SW funcional)                          | `CONTEXT §9`                   | ⏳ manifest.json/sw.js legacy                    | E1-S1C |
| 14  | Mobile/Responsive (breakpoints 1024/768/480)                      | `UI_REF`, `CONTEXT §9`         | ⏳                                               | E1-S1C |
| 15  | GAS Heartbeat + Cron triggers                                     | `GAS_REF`                      | ⏳ Mock                                          | E1-S1C |
| 16  | Google Sign-in real (remover "Soon" badge)                        | `CONTEXT §11`                  | ✅ Google Sign-In funcional (cursor fixed)       | E1-S1D |
| 17  | Onboarding pulsing dots (Phase 2 Wizard)                          | `CONTEXT §11`                  | ⏳ Planejado                                     | E1-S1D |
| 18  | Store 12 extensões com preço real em PC                           | `MEDUSA_REF`                   | 🟡 Mock prices                                   | E1-S1D |
| 19  | SDK Dev Portal público                                            | `CONTEXT §9`                   | ⏳                                               | E2-S2A |
| 20  | Tutorial "Crie módulo em 2h" (built-in)                           | `MEDUSA_REF`                   | ⏳                                               | E2-S2A |
| 21  | GitHub Actions panda-publish.yml template                         | `MEDUSA_REF §4`                | ⏳ Documentado                                   | E2-S2A |
| 22  | Google Drive publish pipeline                                     | `MEDUSA_REF §5`                | ⏳ Documentado                                   | E2-S2A |
| 23  | MCP IPC Bridge (Rust ↔ SDK)                                       | `MCP_REF`, `CONTEXT §9`        | 🚧 Registration only                             | E2-S2A |
| 24  | Featured Modules + Analytics na Store                             | `MEDUSA_REF P4`                | ⏳                                               | E2-S2A |
| 25  | Usage Split real (40% dev no consumo)                             | `ECONOMY_REF`                  | ⏳                                               | E2-S2B |
| 26  | Escrow 7d (Store) / 90d (Kiwify/Hotmart)                          | `ECONOMY_REF`                  | ⏳                                               | E2-S2B |
| 27  | Top 100 Devs desconto progressivo (10-30%)                        | `ECONOMY_REF §D`               | ⏳                                               | E2-S2B |
| 28  | Referral Boost (1.2x mining 30d / 1.1x 15d)                       | `ECONOMY_REF`                  | ⏳                                               | E2-S2B |
| 29  | Co-produção split (85/10/5)                                       | `ECONOMY_REF`                  | ⏳                                               | E2-S2B |
| 30  | Panda Oracle real (spot price API)                                | `ECONOMY_REF`, `CONTEXT §9`    | ⏳ Mock conversion                               | E3     |
| 31  | Web Mining alpha (WASM, Smart Throttle, WebGPU, FPS, Battery API) | `P2P_REF`, `CONTEXT §9`        | ⏳                                               | E3     |
| 32  | Partner Mode Mining (XMRig/T-Rex via Rust)                        | `P2P_REF`, `CONTEXT §9`        | ⏳                                               | E3     |
| 33  | Phantom Protocol (CPU limiter + auto-pause)                       | `P2P_REF`, `CONTEXT §9`        | ⏳                                               | E3     |
| 34  | P2P Network alpha (WebRTC discovery)                              | `P2P_REF`, `CONTEXT §9`        | ⏳                                               | E3     |
| 35  | i18n 100% (pt-BR, en, es)                                         | `SDK_REF §i18n`                | 🟡 Selector exists, strings partial              | E3     |
| 36  | MCP Multi-Monitor (PDV, totem, vitrine)                           | `MCP_REF`                      | ⏳                                               | E3     |
| 37  | Security Hardening full (SRI + Firebase Rules audit)              | `SECURITY_REF`                 | ⏳                                               | E3     |
| 38  | Token Pipeline (off-chain PC → on-chain)                          | `ECONOMY_REF`                  | ⏳                                               | E4     |
| 39  | P2P Network real (libp2p, task routing, 5 tiers)                  | `P2P_REF`                      | ⏳                                               | E4     |
| 40  | Publish Multi-Store (PlayStore, Apple Store, Steam)               | `SDK_REF §Publish`             | 🔮 Roadmap                                       | E4     |
| 41  | Casulo/BundleCreator (cross-platform packaging)                   | `MEDUSA_REF`                   | ⏳                                               | E4     |
| 42  | Colab HPC real (BYOC GPU dispatch)                                | `COLAB_REF`                    | ⏳                                               | E4     |

---

## 2. Etapa 0 — Foundation ✅

**Status: CONCLUÍDA (Jan/2026)**

Tudo que está no inventário "✅ Feito" acima. O projeto existe, está documentado, e tem uma demo funcional em [lucassval.github.io/Panda-Factory](https://lucassval.github.io/Panda-Factory/). Nenhuma transação real acontece — tudo é mock.

---

## 3. Etapa 1 — Founder Solo 🚧

> **Missão:** Founder contra o mundo. Backend real + 1ª venda + revenue desde dia 1.
> **Período:** Fev-Abr/2026
> **KPI:** 1ª venda real no Kiwify/Hotmart + 1ª compra de PC na Store + Chat AI funcionando

### Sprint 1A — Infra Real (P0 CRÍTICO)

> _Sem isso, nada funciona. Tudo depende de Firebase + GAS estarem live._

| #   | Task                                               | Depende de | Tempo Est. | Resultado                                                                                                                            | Doc SSoT                                         |
| --- | -------------------------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| 1   | **Firebase RTDB Rules + Schema**                   | —          | 4-6h       | Dados protegidos: `/users/{uid}`, `/wallets/{uid}`, `/licenses/{uid}/{licenseId}`, `/heartbeat`, `/store/modules`, `/store/featured` | `PF_BACKEND_REFERENCE.md §7`                     |
| 2   | **Firebase Auth** (Email + Google providers)       | #1         | 1-2h       | Login real funcional, `isFounder()` via UID                                                                                          | `CONTEXT.md §11`                                 |
| 3   | **GAS Deploy como Web App** (`doPost()` público)   | —          | 2-3h       | Endpoint público recebendo POST requests                                                                                             | `PF_GAS_REFERENCE.md`                            |
| 4   | **GAS Webhook handler Kiwify/Hotmart** (funcional) | #1, #3     | 3-4h       | `purchase.approved` → credita licença no RTDB                                                                                        | `PF_SDK_REFERENCE.md`, `PF_ECONOMY_REFERENCE.md` |
| 5   | **SDK Auth wiring** (mock→Firebase Auth real)      | #2         | 2-3h       | `useAuth()` retorna Firebase token, `Panda.Auth.getUser()` funcional                                                                 | `PF_SDK_REFERENCE.md §Auth`                      |
| 6   | **SDK Wallet wiring** (mock→RTDB real)             | #1, #5     | 2-3h       | `Panda.Economy.balance()` → saldo real do RTDB                                                                                       | `PF_SDK_REFERENCE.md §Wallet`                    |
| 7   | **CSP + SRI + CORS** security headers              | —          | 2-3h       | Headers de segurança em index.html e GAS                                                                                             | `PF_SECURITY_REFERENCE.md`                       |

> **Subtotal Sprint 1A:** ~16-24h

### Sprint 1B — Revenue Dia 1

> _Monetização real desde o primeiro dia. PC como moeda interna + anúncios._

| #   | Task                                                         | Depende de | Tempo Est. | Resultado                                                                               | Doc SSoT                       |
| --- | ------------------------------------------------------------ | ---------- | ---------- | --------------------------------------------------------------------------------------- | ------------------------------ |
| 8   | **PC Economy Real** — compra de pacotes ($20-$5K)            | #6         | 3-4h       | 7 pacotes (Starter $20 → Partner $5K), desconto 0-30%, split 95/5 Ops/Founder           | `PF_ECONOMY_REFERENCE.md §9.1` |
| 9   | **Store Purchases Real** — PC debit ao instalar extensão     | #6, #8     | 3-4h       | Instalar extensão = debita PC do user, credita 70% dev                                  | `PF_MEDUSA_REFERENCE.md`       |
| 10  | **Anúncios para PC na Store** — Featured/Sponsored listings  | #9         | 2-3h       | Devs pagam PC para posição "Featured" na Store. Slot rotacional. Revenue em PC queimado | `PF_MEDUSA_REFERENCE.md P4`    |
| 11  | **Listing Kiwify/Hotmart** — produto live + afiliados ativos | #4         | 1 dia      | "Panda Factory" à venda, programa de afiliados ativo, webhook configurado               | —                              |

> **Subtotal Sprint 1B:** ~15-20h

### Sprint 1C — Killer Features Dia 1

> _Features que fazem o Panda valer o preço. Sem chat AI, sem PWA = produto incompleto._

| #   | Task                                                   | Depende de | Tempo Est. | Resultado                                                                       | Doc SSoT                 |
| --- | ------------------------------------------------------ | ---------- | ---------- | ------------------------------------------------------------------------------- | ------------------------ |
| 12  | **Chat AI funcional** (Gemini 3.0 endpoint real)       | #5         | 2-3h       | `Panda.Brain.chat()` → resposta real do Gemini. Billing via PC (Pandômetro)     | `PF_GEMINI_REFERENCE.md` |
| 13  | **PWA real** (vite-plugin-pwa, SW, manifest integrado) | —          | 3-4h       | Instalar como app no celular/desktop, funcionar offline (cached assets)         | `CONTEXT.md §9`          |
| 14  | **Mobile/Responsive** (CSS breakpoints)                | —          | 4-6h       | Breakpoints: 1024px (tablet), 768px (phone landscape), 480px (phone portrait)   | `PF_UI_REFERENCE.md`     |
| 15  | **GAS Heartbeat + Cron** (triggers configurados)       | #3         | 2-3h       | Health monitoring automático, cleanup de sessões expiradas, cron de daily stats | `PF_GAS_REFERENCE.md`    |

> **Subtotal Sprint 1C:** ~11-16h

### Sprint 1D — Polish & Ship

> _Últimos ajustes antes de anunciar pro mundo._

| #   | Task                                            | Depende de | Tempo Est. | Resultado                                                                | Doc SSoT                 |
| --- | ----------------------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------ | ------------------------ |
| 16  | **Google Sign-in real** (remover badge "Soon")  | #2         | 2-3h       | Login com conta Google funcionando, OAuth consent screen configurada     | `CONTEXT.md §11`         |
| 17  | **Onboarding pulsing dots** (Phase 2 do Wizard) | —          | 1-2h       | First-use tooltips pulsando em Chat FAB, Dock, Settings, Store icon      | `CONTEXT.md §11`         |
| 18  | **Store com preços reais em PC** (12 extensões) | #9         | 2-3h       | Cada extensão com preço em PC, botão "Install" real, transaction receipt | `PF_MEDUSA_REFERENCE.md` |

> **Subtotal Sprint 1D:** ~5-8h

### 📊 Total Etapa 1: ~47-68h de trabalho (18 tasks)

---

## 4. Etapa 2 — Guerrilha 🎯

> **Missão:** Converter afiliados de vendedores em CRIADORES. Guerrilha nos ecossistemas Kiwify/Hotmart.
> **Período:** Mai-Jul/2026
> **KPI:** 10-20 afiliados convertidos, 10+ módulos publicados, R$5K/mês revenue

### Sprint 2A — Atração de Devs

> _Dar as ferramentas para que afiliados consigam criar módulos e publicar._

| #   | Task                                            | Resultado                                                                     | Doc SSoT                    |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------- |
| 19  | **SDK Dev Portal público**                      | Documentação interativa com playground, exemplos por namespace, API reference | `PF_SDK_REFERENCE.md`       |
| 20  | **Tutorial "Crie seu 1º módulo em 2h"**         | Tutorial built-in no Panda, guiado por Panda.Brain (Gemini), step-by-step     | `PF_MEDUSA_REFERENCE.md`    |
| 21  | **GitHub Actions template** `panda-publish.yml` | Template pronto que dev cola no repo → release = publica na Store             | `PF_MEDUSA_REFERENCE.md §4` |
| 22  | **Google Drive publish pipeline**               | Zero-barrier: dev salva em GDrive → agente verificador detecta → publica      | `PF_MEDUSA_REFERENCE.md §5` |
| 23  | **MCP IPC Bridge** (Rust Agent ↔ SDK)           | Tools MCP nativas comunicando com UI React via IPC                            | `PF_MCP_REFERENCE.md`       |
| 24  | **Featured Modules + Analytics** na Store       | Page de analytics para devs: installs, revenue, ratings. Featured carousel    | `PF_MEDUSA_REFERENCE.md P4` |

### Sprint 2B — Economia de Criadores

> _Todo o sistema de rewards, splits e incentivos para reter devs._

| #   | Task                                           | Resultado                                                                      | Doc SSoT                     |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| 25  | **Usage Split real** (40% dev no consumo)      | Quando user CONSOME módulo do dev (ex: gasta PC usando feature), dev ganha 40% | `PF_ECONOMY_REFERENCE.md`    |
| 26  | **Escrow system** (7d Store / 90d Kiwify)      | Split imediato: 55% dev. Escrow: 15% dev liberado após período sem chargeback  | `PF_ECONOMY_REFERENCE.md`    |
| 27  | **Top 100 Devs desconto** progressivo (10-30%) | Ranking por revenue → top devs ganham desconto em compra de PC (até 30%)       | `PF_ECONOMY_REFERENCE.md §D` |
| 28  | **Referral Boost**                             | Indicação = 1.2x mining por 30d para quem indica, 1.1x por 15d para indicado   | `PF_ECONOMY_REFERENCE.md`    |
| 29  | **Co-produção split** (85/10/5)                | Múltiplos co-autores dividem 85% proporcional, 10% Ops, 5% Founder             | `PF_ECONOMY_REFERENCE.md`    |

### 📢 Pitch Guerrilha para Afiliados

```text
HOJE (afiliado típico):
  Afiliado → vende produto dos OUTROS → 30-50% comissão → zero propriedade

COM PANDA:
  Afiliado → aprende vibe code (1-2 dias) → CRIA módulo próprio → 70% receita
                                            → vende na Panda Store
                                            → vende no Kiwify/Hotmart próprio
                                            → ganha 40% no usage (renda passiva)
                                            → ganha Featured listing (visibilidade paga em PC)
```

> _"Você já sabe vender. Agora aprenda a CRIAR em 48 horas."_

---

## 5. Etapa 3 — Flywheel ⏳

> **Missão:** Efeito rede. Cada novo dev atrai users, cada user atrai devs.
> **Período:** Q3/2026
> **KPI:** 50-200 devs ativos, 1K+ users, revenue recorrente via Usage Split + Mining

| #   | Task                          | Resultado                                                                     | Doc SSoT                    |
| --- | ----------------------------- | ----------------------------------------------------------------------------- | --------------------------- |
| 30  | **Panda Oracle real**         | Spot price API para conversão PC ↔ USD real-time (não mock)                   | `PF_ECONOMY_REFERENCE.md`   |
| 31  | **Web Mining alpha**          | WASM-based mining in-browser, Smart Throttle (WebGPU, FPS-aware, Battery API) | `PF_P2P_REFERENCE.md`       |
| 32  | **Partner Mode Mining**       | XMRig/T-Rex integration via Rust Agent, 5 tiers de node (Sprout→Elder)        | `PF_P2P_REFERENCE.md`       |
| 33  | **Phantom Protocol**          | CPU limiter + auto-pause quando user está ativo, resume em idle               | `PF_P2P_REFERENCE.md`       |
| 34  | **P2P Network alpha**         | WebRTC peer discovery, heartbeat, task distribution básica                    | `PF_P2P_REFERENCE.md`       |
| 35  | **i18n 100%** (pt-BR, en, es) | Todas as strings traduzidas, selector funcional no LoginGate                  | `PF_SDK_REFERENCE.md §i18n` |
| 36  | **MCP Multi-Monitor**         | PDV dual-screen, totem mode, vitrine mode                                     | `PF_MCP_REFERENCE.md`       |
| 37  | **Security Hardening**        | SRI integrity check, Firebase Rules audit completo, CORS whitelist            | `PF_SECURITY_REFERENCE.md`  |

---

## 6. Etapa 4 — Escala ⏳

> **Missão:** Infraestrutura de Composição — a 4ª Camada Digital em produção global.
> **Período:** Q4/2026+
> **KPI:** 1K+ devs, 10K+ users, P2P network live, token exchange

| #   | Task                     | Resultado                                                        | Doc SSoT                       |
| --- | ------------------------ | ---------------------------------------------------------------- | ------------------------------ |
| 38  | **Token Pipeline**       | Off-chain PC → on-chain, exchange integration                    | `PF_ECONOMY_REFERENCE.md`      |
| 39  | **P2P Network real**     | libp2p full, task routing, chunk distribution, 5 tiers           | `PF_P2P_REFERENCE.md`          |
| 40  | **Publish Multi-Store**  | PlayStore, Apple Store, Steam — via `Panda.Publish.toMultiple()` | `PF_SDK_REFERENCE.md §Publish` |
| 41  | **Casulo/BundleCreator** | Cross-platform packaging: web → mobile → desktop → Steam         | `PF_MEDUSA_REFERENCE.md`       |
| 42  | **Colab HPC real**       | BYOC GPU dispatch, Colab T4 templates, rendering pipeline        | `PF_COLAB_REFERENCE.md`        |

---

## 7. Cobertura Documental

> Cada task deste roadmap está mapeada para o doc SSoT que define seus requisitos.

| Doc SSoT                         | Sigla  | Tamanho | Tasks que referencia                    |
| -------------------------------- | ------ | ------- | --------------------------------------- |
| `CONTEXT.md`                     | CTX    | 72KB    | #1,#2,#3,#5,#7,#12,#13,#14,#15,#16,#17  |
| `PF_MASTER_ARCHITECTURE.md`      | ARCH   | 201KB   | Mapa geral — cross-ref de todos         |
| `PF_SDK_REFERENCE.md`            | SDK    | 83KB    | #4,#5,#6,#8,#12,#19,#23,#35,#40         |
| `PF_ECONOMY_REFERENCE.md`        | ECON   | 94KB    | #4,#8,#25,#26,#27,#28,#29,#30,#38       |
| `PF_UI_REFERENCE.md`             | UI     | —       | #14                                     |
| `PF_BACKEND_REFERENCE.md`        | BE     | —       | #1                                      |
| `PF_GAS_REFERENCE.md`            | GAS    | —       | #3,#4,#15                               |
| `PF_GEMINI_REFERENCE.md`         | GEM    | —       | #12                                     |
| `PF_MCP_REFERENCE.md`            | MCP    | —       | #23,#36                                 |
| `PF_MEDUSA_REFERENCE.md`         | MED    | —       | #9,#10,#18,#20,#21,#22,#24,#41          |
| `PF_P2P_REFERENCE.md`            | P2P    | —       | #31,#32,#33,#34,#39                     |
| `PF_SECURITY_REFERENCE.md`       | SEC    | —       | #7,#37                                  |
| `PF_COLAB_REFERENCE.md`          | COL    | —       | #42                                     |
| `PF_PAT_FOUNDER_CONSTITUTION.md` | PAT    | —       | Guardrails de todos os splits           |
| `PF_AGENT_CONSTITUTION.md`       | AGT    | —       | #10 (ads/parcerias permitidas)          |
| `PF_FILE_REGISTRY.md`            | REG    | —       | Catálogo atualizado após cada task      |
| `PF_OPENSOURCE_CATALOG.md`       | OSS    | —       | Compliance de deps adicionadas          |
| `PF_GOOGLE_SUITE.md`             | GSUITE | —       | ADK, GEAR, Accelerator references       |
| `council_viability_report.md`    | CVR    | —       | Painel executivo — reflete este roadmap |

---

## 8. Splits & Economia

> **SSoT:** `PF_ECONOMY_REFERENCE.md` | **Guardrail:** `PF_PAT_FOUNDER_CONSTITUTION.md`

### 8.1 Split Master v3.0 — Todas as Regras

| Split Type                       | Dev                                 | Ops | Founder | Notas                                                                                    |
| -------------------------------- | ----------------------------------- | --- | ------- | ---------------------------------------------------------------------------------------- |
| **Panda Store (Path C)**         | 70% (55% imediato + 15% escrow 7d)  | 25% | 5%      | Padrão para módulos na Store                                                             |
| **Panda Distribuidora (Path A)** | 60%                                 | 35% | 5%      | Dev iniciante, Panda cuida de tudo                                                       |
| **Hook Próprio (Path B)**        | 85%                                 | 10% | 5%      | Dev consolidado, billing próprio. Enforce: Panda Defend kill switch (15% = aluguel SaaS) |
| **Co-produção**                  | 85% (prop. entre co-autores)        | 10% | 5%      | Múltiplos devs                                                                           |
| **Kiwify/Hotmart**               | 70% (55% imediato + 15% escrow 90d) | 25% | 5%      | Líquido pós-gateway afiliado                                                             |
| **Usage (PC gasto)**             | 40%                                 | 55% | 5%      | Renda passiva quando user consome                                                        |
| **Compra de PC**                 | —                                   | 95% | 5%      | Bruto (pré-gateway)                                                                      |
| **P2P Reward**                   | 95% (host)                          | 5%  | —       | Pago ao node host                                                                        |
| **P2P Mining**                   | 60% (miner, em PC via Oracle x0.60) | 35% | 5%      | Mining rewards                                                                           |

### 8.2 Pacotes de PC (Compra)

| Pacote     | USD    | PC Base | Desconto | PC Final |
| ---------- | ------ | ------- | -------- | -------- |
| Starter    | $20    | 2.000   | 0%       | 2.000    |
| Basic      | $50    | 5.000   | 5%       | 5.250    |
| Pro        | $100   | 10.000  | 10%      | 11.000   |
| Business   | $250   | 25.000  | 15%      | 28.750   |
| Enterprise | $500   | 50.000  | 20%      | 60.000   |
| Whale      | $1.000 | 100.000 | 25%      | 125.000  |
| Partner    | $5.000 | 500.000 | 30%      | 650.000  |

> **Fórmula:** `Preço_Base = Custo_Cloud_Médio × 4.0` → $0.0025/PC × 4.0 = $0.01/PC

### 8.3 Tiers de Licença

| Tier             | Multiplicador       | Perfil                    |
| ---------------- | ------------------- | ------------------------- |
| **Founder**      | 1.03x               | Lucas (eterno)            |
| **Beta Founder** | 2.8x (30% desconto) | Early adopters pré-launch |
| **Standard**     | 4.0x                | Preço normal              |

### 8.4 Top 100 Devs — Desconto Progressivo

| Ranking | Desconto PC |
| ------- | ----------- |
| 1-10    | 30%         |
| 11-25   | 25%         |
| 26-50   | 20%         |
| 51-75   | 15%         |
| 76-100  | 10%         |

### 8.5 Payout

| Método             | Região | Notas                                                           |
| ------------------ | ------ | --------------------------------------------------------------- |
| **Stripe Connect** | Global | MoR central — payout direto para **Nubank** (Pix/TED) via CPF   |
| **Paddle**         | Global | MoR fallback (jurisdições complexas: EU VAT, US Sales Tax)      |
| **Saldo em PC**    | Global | Dev opta por receber em Panda Coins (reinvestir no ecossistema) |

> ✅ **Zero Bloqueio:** Stripe Brasil aceita **Pessoa Física com CPF** — **não precisa de CNPJ**. Payout cai direto na conta **Nubank** do Founder em BRL via Pix/TED. Day 1 ready.

### 8.6 Infra de Pagamento — Gateways (`PF_MEDUSA_REFERENCE.md §10.4`)

> **Sem isso, PC é monopólio interno. Com isso, PC é moeda global.**
>
> ⚠️ **PagSeguro ABORTADO** (decisão Founder 2026-02-18).
> ✅ **Stripe Brasil Direto** — aceita CPF (Pessoa Física), sem CNPJ. Payout → Nubank.

| Gateway    | Cobertura         | Papel                                                                      | Status               |
| ---------- | ----------------- | -------------------------------------------------------------------------- | -------------------- |
| **Stripe** | 🌎 Global + 🇧🇷 BR | **MoR Primário (Day 1)** — Managed Payments. Cartão, Pix, Apple/Google Pay | ✅ Day 1 Ready (CPF) |
| **Paddle** | 🌎 Global         | **MoR Fallback** — tax compliance para EU VAT / US Sales Tax               | 📋 Proposto          |

> **Stripe Brasil (CNPJ: 22.121.209/0001-46):**
>
> - Entidade: _Stripe Brasil Soluções de Pagamento Ltda. — Instituição de Pagamento_
> - Aceita **Pessoa Física com CPF** — CNPJ é **opcional**
> - Pix nativo via parceria backend EBANX (transparente para o Founder)
> - Payout em BRL direto para conta **Nubank** via Pix/TED
> - **Stripe Managed Payments** = MoR nativo do Stripe (75+ países, 35 categorias)
> - Assume tax compliance, fraude, disputas, checkout, suporte
>
> **Nota Alipay/WeChat:** Stripe e Paddle aceitam Alipay/WeChat Pay como métodos alternativos. **Não é necessário cadastro na China.**

#### Fluxo de Checkout (Panda Store)

```text
User clica "Comprar" (Store PDP)
  └─► PFCheckoutModal.jsx (frontend)
        ├─► Verifica PC balance (RTDB via useCheckout.js)
        │     ├─ Se tem PC suficiente → debita PC direto (transação RTDB)
        │     └─ Se NÃO tem PC suficiente → abre gateway:
        │           ├─ 🇧🇷 Brasil → Stripe (Pix nativo, BRL)
        │           ├─ 🌎 Global → Stripe (Cartão/GooglePay/ApplePay)
        │           └─ 📋 Fallback → Paddle (EU VAT / US Sales Tax)
        └─► Stripe Webhook recebe confirmação
              ├─► Credita PC no RTDB (/wallets/{uid}/balance)
              ├─► Registra licença (/licenses/{uid}/{moduleId})
              ├─► Split automático (70% dev / 25% Ops / 5% Founder)
              └─► Payout → Nubank (Pix/TED em BRL)
```

#### Por que 2 Gateways (Stripe + Paddle)?

| Cenário                   | Gateway ideal           | Motivo                                           |
| ------------------------- | ----------------------- | ------------------------------------------------ |
| Dev/Founder BR sem CNPJ   | **Stripe (CPF direto)** | Stripe BR aceita Pessoa Física — zero papelada   |
| User BR quer Pix          | **Stripe**              | Pix nativo via EBANX backend (transparente)      |
| User global com cartão    | **Stripe**              | 75+ países, Apple/Google Pay, menor latência     |
| Dev quer receber em USD   | **Stripe Connect**      | Payout global direto na conta bancária do dev    |
| Dev quer receber em BRL   | **Stripe Connect**      | Payout em BRL direto na **Nubank** via Pix/TED   |
| Compliance fiscal (EU/US) | **Paddle**              | MoR calcula e paga VAT/Sales Tax automaticamente |

### 8.7 Distribution Hooks — Canais de Saída (`PF_MEDUSA_REFERENCE.md §10.4`)

> **Modelo Híbrido (Modelo C): Tool-only + MoR nativo**
> Panda **intermedia quando o dev quer** (Panda Store nativo) mas **também aceita hooks externos** para devs que já possuem infraestrutura.

#### Hooks de Entrada (como o dev submete)

| Hook        | Mecanismo                                            | Status  |
| ----------- | ---------------------------------------------------- | ------- |
| 🐙 GitHub   | `git push` → GitHub Action → Medusa valida manifest  | Roadmap |
| 📁 G. Drive | Upload em `/PandaStore/{moduleId}/` → Agente detecta | Roadmap |

#### Hooks de Saída (onde o produto é vendido)

| Canal           | Tipo     | Fee / Split                     | Responsabilidade Legal |
| --------------- | -------- | ------------------------------- | ---------------------- |
| 🐼 Panda Store  | Nativo   | Split 70% dev / 30% Panda       | Panda intermedia (MoR) |
| 🥝 Kiwify       | Hook out | Listing Fee $1.99 + 5% comissão | Dev configura          |
| 🔥 Hotmart      | Hook out | Listing Fee $1.99 + 5% comissão | Dev configura          |
| 🌐 GitHub Pages | Deploy   | Sem fee                         | Dev                    |
| 🎮 Steam        | Link ext | Sem fee                         | Dev                    |
| 📱 Play Store   | Link ext | Sem fee                         | Dev                    |
| 🍎 Apple Store  | Link ext | Sem fee                         | Dev                    |

#### Fluxo de Publicação (DevTools → Medusa)

```text
Dev preenche PUBLISH form (DevTools v3.0)
  → Seleciona hooks de saída (Panda Store + externos)
  → Medusa valida manifest + security scan (Layer 1 — Static)
  → Produto listado no Panda Store (+ hooks de saída se configurados)
  → Compra processada pelo gateway selecionado
  → Split creditado via PAT (Panda Coins) ou fiat
```

### 8.8 MoR — Democratização via Merchant of Record (`PF_MEDUSA_REFERENCE.md §10.4`)

> **O Stripe Managed Payments resolve O PROBLEMA CENTRAL: a barreira fiscal que impede devs BR de vender global.**

```text
SEM PANDA (hoje):
  Dev precisa: CNPJ → Gateway → Site → Suporte → Impostos → Infra
  Barreira: ALTA (muitos desistem ou não podem — MEI sem nota de exportação)

COM PANDA (Stripe Managed Payments):
  Dev precisa: Código → PUBLISH form → Pronto
  Panda faz:   Validação → Listagem → Pagamento → Split → Suporte → Tax Compliance
  Barreira:    ZERO (democratiza acesso ao mercado global)

ARQUITETURA MoR (SIMPLIFICADA):
  Stripe Brasil (CPF) ←→ Panda Factory ←→ Nubank (payout BRL)
  │                         │
  ├── Managed Payments      ├── Panda gerencia Store/Split/PAT
  │   (MoR nativo Stripe)   ├── Dev recebe via Stripe Connect
  ├── Pix via EBANX         └── Paddle = fallback (EU/US tax)
  │   (backend, transparente)
  ├── 75+ países, 35 categorias
  └── Tax compliance automático

  ✅ ZERO BLOQUEIO:
  Day 1 → Stripe (CPF, Pessoa Física) → Nubank (Pix/TED)
  Não precisa de CNPJ, não precisa de EBANX como intermediário
```

**Nota legal:** O Panda Factory utiliza **Stripe Managed Payments** como MoR nativo. O Stripe Brasil (CNPJ: 22.121.209/0001-46) aceita Pessoa Física com CPF — o Founder não precisa de CNPJ. Os pagamentos são processados pelo Stripe e enviados diretamente para a conta **Nubank** em BRL. O Stripe assume responsabilidade por tax compliance, fraude, disputas e chargebacks. **Paddle** é MoR fallback para jurisdições onde Stripe não oferece cobertura fiscal completa (ex: EU VAT, US Sales Tax).

| Aspecto               | Sem MoR (dev sozinho)        | Com MoR (Stripe Managed Payments)          |
| --------------------- | ---------------------------- | ------------------------------------------ |
| **CNPJ necessário?**  | ✅ Sim (MEI no mínimo)       | ❌ Não — Stripe aceita CPF (Pessoa Física) |
| **Nota fiscal?**      | Dev emite (complexo)         | Stripe emite (automático)                  |
| **Pix nativo?**       | Dev configura sozinho        | ✅ Stripe Pix nativo (via EBANX backend)   |
| **Payout?**           | Dev abre conta gateway       | ✅ Direto na **Nubank** (Pix/TED em BRL)   |
| **VAT/Sales Tax EU?** | Dev calcula e recolhe        | Stripe Managed Payments calcula e paga     |
| **Chargeback?**       | Dev assume risco             | Stripe absorve (incluso na taxa)           |
| **Câmbio USD→BRL?**   | Dev contrata corretora/banco | Stripe Connect converte e paga em BRL      |
| **Compliance GDPR?**  | Dev implementa               | Stripe garante                             |
| **Suporte ao buyer?** | Dev atende                   | Stripe + Panda atendem                     |

### 8.9 Revenue Model — Nativo vs Externo (`PF_MEDUSA_REFERENCE.md §10.4`)

> **Por que hooks externos NÃO matam a receita do Panda:**

| Fonte de receita     | Nativo (Panda Store) | Externo (Kiwify/Hotmart/etc) |
| -------------------- | -------------------- | ---------------------------- |
| **Split/Comissão**   | 48% (inclui gateway) | 5% comissão sobre vendas     |
| **Listing Fee**      | Grátis               | $1.99 taxa única             |
| **Destaque**         | Incluído em popular  | $4.99/mês "Em Destaque"      |
| **API Usage**        | Incluído no PC       | Taxa por request se usar IA  |
| **Trust Badge**      | ✅ Incluso           | $2.99/mês selo Verificado    |
| **PC como moeda**    | ✅ Circula           | ❌ Não usa                   |
| **Compute/IA/Nuvem** | ✅ User roda dentro  | ❌ Perda de compute          |

> **Moat competitivo do nativo:** _"Pessoa compra e usa no ambiente seguro do Panda"_ — sandboxed, auditado, sem risco de hack/golpe, com IA integrada. O externo é apenas para não perder quem já tem infra, mas o incentivo econômico (0% listing + PC rewards + compute incluso) **sempre puxa para o nativo.**

### 8.10 Billing Enforcement — Anti-Bypass de Receita (`PF_SECURITY_REFERENCE.md`)

> **Todo consumo de serviço pago deve passar pelo billing do Panda.** Bypass = suspensão.

```text
REGRA: Todo uso de IA/GPU/Cloud deve passar por Panda.* wrapper

❌ BLOQUEADO:
  fetch("https://api.openai.com/v1/chat", { headers: { "Authorization": "sk-..." } })
  // Bypass do billing — chamada direta a API paga

✅ PERMITIDO:
  await Panda.Brain.chat("pergunta...")
  // Billing embutido — PC debitado automaticamente

  await Panda.GPU.process(data)
  // Billing embutido — PC debitado automaticamente
```

| Proteção                 | Mecanismo                                       | Consequência                      |
| ------------------------ | ----------------------------------------------- | --------------------------------- |
| Stripe key hardcoded     | Regex scan Layer 1 (`pk_live_`, `sk_live_`)     | Score = 0, rejeição na publicação |
| API call direta (bypass) | Behavior monitor Layer 2 (intercepta `fetch()`) | Auto-suspend do módulo            |
| Serviço pago sem billing | `panda-billing-enforcement` rule                | Notificação + suspend após 24h    |
| Wallet manipulation      | Ed25519 signed transactions Layer 3             | Kill Switch ativável pelo Founder |

---

## 9. Integrações

> **SSoT:** `PF_SDK_REFERENCE.md`, `PF_MCP_REFERENCE.md Part E`

### 9.1 Canais de Integração

| Categoria         | Conexões                                       | BYOL Level | Status      |
| ----------------- | ---------------------------------------------- | ---------- | ----------- |
| 💬 **Social**     | WhatsApp, Telegram, Twitter, Instagram, TikTok | L1-L2      | 🟡 Mock     |
| 📺 **Conteúdo**   | YouTube, Twitch, Spotify                       | L1-L2      | 🟡 Mock     |
| 💰 **Pagamentos** | Kiwify, Hotmart, Stripe (Direto CPF), Paddle   | L2-L3      | Task #4,#11 |
| 📈 **Trading**    | cTrader, Binance                               | L1-L2      | 🟡 Mock     |
| 🎮 **Games**      | Godot, Unity, Steam                            | L1         | 🟡 Mock     |
| 🤖 **AI**         | Gemini 3 (Pro/Flash/Deep Think), Colab GPU     | L3         | Task #12    |
| 📊 **Analytics**  | Google Analytics, Hotjar                       | L1         | ⏳          |
| 📧 **Email**      | Gmail API, SendGrid                            | L2         | ⏳          |

### 9.2 BYOL API Bridge Levels

| Level  | Nome       | O que faz                                     | Exemplo               |
| ------ | ---------- | --------------------------------------------- | --------------------- |
| **L1** | Webview    | iframe embed, zero integração                 | Twitch player embed   |
| **L2** | API Bridge | GAS + OAuth, AI interage com dados            | Kiwify webhook → RTDB |
| **L3** | MCP Nativo | Provedor expõe MCP server, full bidirectional | Gemini API nativo     |

---

## 10. Segurança

> **SSoT:** `PF_SECURITY_REFERENCE.md`, `PF_PAT_FOUNDER_CONSTITUTION.md`

### 10.1 Panda Defend — 3 Camadas

| Camada                 | O que protege                      | Mecanismo                                    |
| ---------------------- | ---------------------------------- | -------------------------------------------- |
| **Layer 1 — Static**   | Código do módulo antes de publicar | Semgrep scan, regex (API keys, fetch bypass) |
| **Layer 2 — Runtime**  | Módulo executando no sandbox       | iframe isolation, CSP, behavior monitor      |
| **Layer 3 — Economic** | Transações e wallet                | Ed25519 signed, Founder-only kill switch     |

### 10.2 Anti-Bypass Rules (Hardcoded — Inviolável)

| Violação                | Detecção          | Consequência        |
| ----------------------- | ----------------- | ------------------- |
| API key hardcoded       | Regex scan        | Score = 0, Rejeição |
| fetch() para APIs pagas | Behavior monitor  | Auto-suspend        |
| Sem panda.manifest.json | Pre-publish check | Não publica         |

### 10.3 Kill Switch

- **Acionamento:** Founder-only via Ed25519 signature
- **Escopo:** Pode desabilitar qualquer módulo/tentáculo globalmente
- **Irreversibilidade:** Não. Pode reativar com nova assinatura.

### 10.4 Guardrails de Segurança

| Guardrail              | Trigger                       | Ação                     |
| ---------------------- | ----------------------------- | ------------------------ |
| Secrets Exposure       | Credenciais em código público | 🔴 HALT + Alert Founder  |
| Constitution Violation | 14 Artigos                    | ⏸️ PAUSE + Confirm       |
| Treasury Action        | Qualquer movimento de token   | 🔐 Ed25519 Signature     |
| PAT Override           | Tentar modificar regras PAT   | ❌ REJECT (Hardcoded)    |
| SSoT Violation         | Duplicar info entre docs      | ⚠️ Reference, don't copy |
| Security Veto          | 🦀 Sentinela vota ❌          | 🛑 BLOCK                 |

---

## 11. Cronograma Macro

```text
2026
══════════════════════════════════════════════════════════════════════

  JAN         FEV         MAR         ABR         MAI         JUN
  ├───────────┼───────────┼───────────┼───────────┼───────────┤
  │ ETAPA 0   │      ETAPA 1 — FOUNDER SOLO      │  ETAPA 2  │
  │Foundation │ S1A Infra │ S1B Rev   │ S1C Kill  │ Guerrilha │
  │  ✅ DONE  │ S1D Ship  │ Features  │ Kiwify/HM │ Afiliados │
  ├───────────┼───────────┼───────────┼───────────┼───────────┤

  JUL         AGO         SET         OUT         NOV         DEZ
  ├───────────┼───────────┼───────────┼───────────┼───────────┤
  │  ETAPA 2  │     ETAPA 3 — FLYWHEEL           │  ETAPA 4  │
  │ Guerrilha │  Mining   │   P2P     │ Oracle    │  ESCALA   │
  │ cont.     │  alpha    │   alpha   │ i18n 100% │  Token    │
  ├───────────┼───────────┼───────────┼───────────┼───────────┤

  META FEV-MAR: 1ª VENDA REAL + CHAT AI + PWA + ANÚNCIOS PC
  META JUN:     10-20 VIBE CODERS + 10 MÓDULOS + R$5K/MÊS
  META SET:     1K USERS + MINING ALPHA + P2P DISCOVERY
  META DEZ:     10K USERS + TOKEN PIPELINE + P2P REAL

══════════════════════════════════════════════════════════════════════
```

---

## 📝 Changelog

| Versão | Data       | Descrição                                                                                            |
| ------ | ---------- | ---------------------------------------------------------------------------------------------------- |
| 1.3.0  | 2026-02-19 | Firebase Auth live (#2 ✅), Google Sign-In funcional (#16 ✅), Login UI centered, cursor fix.        |
| 1.2.0  | 2026-02-18 | Stripe BR aceita CPF direto — EBANX desnecessário como intermediário. Stripe = Day 1 ready. Nubank.  |
| 1.1.0  | 2026-02-18 | PagSeguro ABORTADO. Stripe como MoR primário. Paddle = fallback.                                     |
| 1.0.0  | 2026-02-18 | Criação do ROADMAP.md com cobertura total de 18 PF\_ docs. 42 tasks, 5 etapas, 4 sprints na Etapa 1. |

---

> **Este arquivo é o SSoT do roadmap.** O `council_viability_report.md §15` faz cross-reference para cá.
> **Regra:** Append-only. Novas tasks são adicionadas ao inventário (§1) e à etapa correspondente.
