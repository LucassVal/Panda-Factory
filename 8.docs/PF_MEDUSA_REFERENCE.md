> [!IMPORTANT]
> **🐼 ANTES DE QUALQUER AÇÃO:** Leia .agent/CONTEXT.md — contém estrutura, regras, nomenclatura e Panda Council.
> **Ativação:** /panda-council | **SSoT:** README_PANDA_OFICIAL.md | **Salve o que fez em Council Report.**
---
tool_context: panda/store
description: Medusa Store - Marketplace de Módulos, Tentáculos e Themes
version: 2.0.0
updated: 2026-02-07
---

# 🐙 PF_MEDUSA_REFERENCE - Sistema de Distribuição e Marketplace

> **Versão:** 3.0.0 | **Status:** Implementado (UI) | **Atualizado:** 2026-02-10

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Taxonomia oficial](#2-taxonomia-oficial)
3. [Filosofia: IDE Externa + Canais de Distribuição](#3-filosofia-ide-externa--canais-de-distribuição)
4. [GitHub Hooks Integration](#4-github-hooks-integration)
5. [Google Drive Integration](#5-google-drive-integration)
6. [Hosting Híbrido (Tiers)](#6-hosting-híbrido-tiers)
7. [Segurança e Sandbox](#7-segurança-e-sandbox)
8. [Manifest (`panda.manifest.json`)](#8-manifest-pandamanifestjson)
9. [Esqueleto do Dev](#9-esqueleto-do-dev)
10. [Panda Store Registry](#10-panda-store-registry)
11. [Diferenciais para Devs](#11-diferenciais-para-devs)
12. [Roadmap](#12-roadmap)
13. [Referências](#13-referências)

---

## 1. Visão Geral

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    MEDUSA DISTRIBUTION SYSTEM v2                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 🐙 GitHub    │  │ 📁 Drive     │  │ 🏪 Store     │              │
│  │   Hooks      │  │ Integration  │  │  Registry    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                            │                                        │
│                   ┌──────────────────┐                             │
│                   │  🐼 Panda.Store  │                             │
│                   │   SDK Parent     │                             │
│                   └──────────────────┘                             │
│                            │                                        │
│         ┌──────────────────┼──────────────────┐                    │
│         ▼                  ▼                  ▼                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 📦 Módulos   │  │ 🐙 Tentáculos│  │ 🎨 Themes    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

**Medusa** é o sistema de distribuição do Panda Factory. Permite que a comunidade crie e distribua **módulos**, **tentáculos** e **themes** via **GitHub** ou **Google Drive**, usando **qualquer IDE**.

---

## 2. Taxonomia Oficial

> **Decisão Arquitetural:** 2026-02-07 — Consolidada em debate Founder + Antigravity.

### 2.1. Definições

| Termo          | Quem cria         | O que é                          | Onde roda                     | Segurança                  |
| -------------- | ----------------- | -------------------------------- | ----------------------------- | -------------------------- |
| **Componente** | Panda Core        | Peça do shell — sempre visível   | Shell (trusted)               | Core — sem sandbox         |
| **Módulo**     | Devs + Core       | App que roda no canvas container | Canvas container              | Sandbox leve               |
| **Tentáculo**  | Core + Comunidade | Hook que estende APIs do sistema | iframe blindado via Proxy SDK | Sandbox forte + permissões |

### 2.2. Exemplos

| Tipo           | Exemplos nativos (Panda)                  | Exemplos comunidade            |
| -------------- | ----------------------------------------- | ------------------------------ |
| **Componente** | Header, Sidebar, App Dock, Dev Dock       | — (só Core)                    |
| **Módulo**     | CRM, Analytics, Founder Dashboard         | Steam Library, Fashion Agent   |
| **Tentáculo**  | WhatsApp bridge, cTrader API, GPU compute | Epic Games hook, Notion sync   |
| **Theme**      | Dark theme (padrão)                       | Cyberpunk theme, Minimal light |

### 2.3. Namespace

| Origem        | Formato          | Exemplo                               |
| ------------- | ---------------- | ------------------------------------- |
| Panda oficial | `@panda/nome`    | `@panda/ai-chat`, `@panda/draw-tools` |
| Comunidade    | `@username/nome` | `@fulano/steam-library`               |

> ⚠️ **Módulos e tentáculos são publicáveis na Store. Componentes NÃO — são exclusivos do Core.**

---

## 3. Filosofia: IDE Externa + Canais de Distribuição

> **Decisão de Arquitetura:** Desenvolvedor usa IDE externa de sua preferência. Sem extensões obrigatórias.

### Por que essa abordagem?

| Aspecto              | Benefício                        |
| -------------------- | -------------------------------- |
| **Liberdade**        | Dev usa IDE que já conhece       |
| **Zero custo**       | Sem tokens/quota nossa consumida |
| **GitHub universal** | Todo dev já sabe usar            |
| **Sem lock-in**      | Nenhuma dependência proprietária |
| **Manutenção zero**  | Não precisamos manter extensão   |

### Workflow do Desenvolvedor

O dev pode escolher **um dos dois canais** de distribuição:

#### Opção A: GitHub (Devs Técnicos)

```text
1. Dev coda localmente (qualquer IDE)
2. Testa com SDK local / Rust Agent
3. Cria panda.manifest.json (OBRIGATÓRIO)
4. git push → GitHub
5. GitHub Action dispara webhook
6. Medusa valida manifest + publica na Store
7. Users instalam e dev recebe 52% split
```

#### Opção B: Google Drive (Zero Barreira)

```text
1. Dev coda localmente (qualquer IDE)
2. Testa com SDK local / Rust Agent
3. Cria panda.manifest.json (OBRIGATÓRIO)
4. Salva pasta em Google Drive (já autenticado via Panda)
5. Agente Verificador detecta mudança
6. Consolida no Firebase da Colmeia Panda
7. Users instalam e dev recebe 52% split
```

> ⚠️ **MANIFEST OBRIGATÓRIO:** Todo módulo/tentáculo DEVE ter `panda.manifest.json`. Sem manifest = não publica.

### Filosofia Zero Barreira

| Quem        | Paga?  | Razão                                       |
| ----------- | ------ | ------------------------------------------- |
| **Dev**     | ❌ NÃO | Zero barreira para integrar                 |
| **Usuário** | ✅ SIM | Preço módico atrai, depois consome serviços |

```text
FUNIL: Dev integra grátis → User compra barato → User consome energia (Gemini, GPU)
```

---

## 4. GitHub Hooks Integration

### 4.1. Webhooks Suportados

| Hook            | Quando          | Ação da Medusa    |
| --------------- | --------------- | ----------------- |
| `push`          | Commit em main  | Rebuild + publica |
| `release`       | Tag v1.x.x      | Atualiza versão   |
| `pull_request`  | PR opened       | Valida manifest   |
| `issue_comment` | `/panda deploy` | Deploy manual     |

### 4.2. GitHub Action Template

```yaml
# .github/workflows/panda-publish.yml
name: Panda Store Publish

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate panda.manifest.json
        run: |
          if [ ! -f panda.manifest.json ]; then
            echo "Missing panda.manifest.json"
            exit 1
          fi

      - name: Notify Medusa
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.PANDA_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"repo": "${{ github.repository }}", "tag": "${{ github.ref_name }}"}' \
            https://script.google.com/macros/s/MEDUSA_ID/exec?action=publish
```

---

## 5. Google Drive Integration

> **Alternativa ao GitHub** para devs que preferem simplicidade ou não sabem usar git.

### 5.1. Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────┐
│                 FLUXO GOOGLE DRIVE → FIREBASE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DEV (já logado via Google Auth no Panda)                           │
│  └── Salva módulo em Google Drive: /PandaStore/{moduleId}/         │
│              │                                                       │
│              ▼                                                       │
│  AGENTE VERIFICADOR (GAS via Drive API Watch)                       │
│  ├── Detecta mudança via webhook do Drive                          │
│  ├── Valida panda.manifest.json                                     │
│  ├── Executa sandbox test (30s)                                    │
│  └── Se OK: consolida no Firebase                                  │
│              │                                                       │
│              ▼                                                       │
│  COLMEIA FIREBASE (Panda controla)                                  │
│  ├── Storage: /store/{id}/versions/                                │
│  ├── Firestore: metadata + sales + analytics                       │
│  └── Revenue: split 52% automático para dev                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2. Vantagens de Segurança

| Aspecto         | Benefício                                        |
| --------------- | ------------------------------------------------ |
| **Controle**    | Panda é dona do Firebase, não depende GitHub     |
| **Privacidade** | Código fica interno, não público                 |
| **Auditoria**   | Logs completos no Firebase                       |
| **Revogação**   | Pode desativar módulo/tentáculo instantaneamente |

---

## 6. Hosting Híbrido (Tiers)

> **Decisão Arquitetural:** 2026-02-07 — Modelo de 2 tiers + cache.

### 6.1. Tier 1: Panda Nativo (Firebase)

```text
Founder cria → Firebase Storage hospeda → CDN rápido → receita 100%
```

| Aspecto          | Detalhe                                |
| ---------------- | -------------------------------------- |
| **Quem cria**    | Founder / Panda Core team              |
| **Onde hospeda** | Firebase Storage + CDN                 |
| **Velocidade**   | Sempre rápida (mesmo servidor do Auth) |
| **Receita**      | 100% para Panda                        |
| **Badge**        | "Oficial Panda" na Store               |

### 6.2. Tier 2: Comunidade (Dev hospeda + Cache)

```text
Dev cria → Assets no GitHub/Drive → Panda cacheia no 1º load → Offline

1º acesso:  Medusa (manifest) → Dev hosting (assets) → Cache local (SW+IDB)
2º acesso:  Cache local (instantâneo, offline)
Fallback:   Se dev removeu → cache ainda funciona pra quem já baixou
```

| Aspecto          | Detalhe                                        |
| ---------------- | ---------------------------------------------- |
| **Quem cria**    | Comunidade                                     |
| **Onde hospeda** | GitHub Pages, Google Drive, qualquer hosting   |
| **Velocidade**   | 1º load variável, depois cache local (rápido)  |
| **Receita**      | 52% dev / 48% Panda (via PAT split)            |
| **Cache**        | Service Worker + IndexedDB (Master Arch §1.10) |

### 6.3. Resumo

| Quem criou         | Hosting        | Velocidade                      | Receita |
| ------------------ | -------------- | ------------------------------- | ------- |
| **Panda oficial**  | Firebase       | Sempre rápido                   | 100%    |
| **Dev verificado** | Dev + cache SW | 1º load variável, depois rápido | 52% dev |
| **Dev novo**       | Dev + cache SW | Igual acima                     | 52% dev |

---

## 7. Segurança e Sandbox

> **Referência:** Master Architecture §2.2 (Blindagem SDK)

### 7.1. Modelo de Execução

```text
┌─────────────── Panda Core ────────────────┐
│  Kernel → SDK → Verification Agents       │
│                                           │
│  ┌───────── Sandbox (iframe) ──────────┐  │
│  │  Módulo/Tentáculo do Dev            │  │
│  │  ❌ Não acessa Panda.* direto       │  │
│  │  ✅ Acessa PandaProxy.* (filtrado)  │  │
│  └─────────────────────────────────────┘  │
│                                           │
│  SDK decide o que o Proxy expõe:          │
│  • O que o manifest declara ✅            │
│  • O que o manifest NÃO declara ❌       │
└───────────────────────────────────────────┘
```

### 7.2. Regras da Blindagem (Master Arch §2.2)

|     | Regra                                                |
| --- | ---------------------------------------------------- |
| ❌  | `window.Panda.Auth = malicious;` (Sobrescrever Core) |
| ❌  | `window.Panda._internal = {};` (Acessar internos)    |
| ❌  | `fetch()` sem `Panda.Bridge` (Bypass proxy)          |
| ✅  | `TentacleMonitor.registerChild('epic', API);`        |
| ✅  | `Panda.emit('community:epic:connected');`            |
| ✅  | Usar qualquer API pública do SDK                     |

### 7.3. Permissões no Manifest

```json
{
  "permissions": ["panda.ui.toast", "panda.data.read", "panda.store.state"]
}
```

**Níveis de risco:**

| Nível    | Exemplo                                  | Aprovação                  |
| -------- | ---------------------------------------- | -------------------------- |
| 🟢 Baixo | `panda.ui.toast`, `panda.data.read`      | Auto-approve               |
| 🟡 Médio | `panda.data.write`, `panda.store.state`  | Auto com auditoria         |
| 🔴 Alto  | `panda.wallet.send`, `panda.auth.modify` | Founder review obrigatório |

---

## 8. Manifest (`panda.manifest.json`)

> **OBRIGATÓRIO** para publicar na Medusa Store. Sem manifest = não publica.

```json
{
  "name": "Steam Library",
  "id": "@fulano/steam-library",
  "version": "1.0.0",
  "type": "module",
  "author": {
    "name": "Dev Fulano",
    "email": "dev@email.com"
  },
  "entry": "index.html",
  "icon": "assets/icon.png",
  "description": "Veja sua biblioteca Steam dentro do Panda",
  "permissions": ["panda.ui.toast", "panda.data.read"],
  "hosting": {
    "type": "github",
    "url": "https://raw.githubusercontent.com/fulano/steam-mod/main/"
  },
  "pricing": {
    "model": "free",
    "price_pc": 0
  },
  "panda": {
    "minVersion": "1.0.0",
    "category": "gaming"
  }
}
```

### 8.1. Campos obrigatórios

| Campo              | Tipo     | Descrição                                    |
| ------------------ | -------- | -------------------------------------------- |
| `name`             | string   | Nome de exibição                             |
| `id`               | string   | Namespace: `@panda/nome` ou `@username/nome` |
| `version`          | semver   | Versão semântica                             |
| `type`             | enum     | `"module"`, `"tentacle"`, ou `"theme"`       |
| `entry`            | string   | Arquivo de entrada (ex: `index.html`)        |
| `permissions`      | string[] | Capabilities necessárias                     |
| `panda.minVersion` | semver   | Versão mínima do Panda SDK                   |

### 8.2. Campo `type`

| Valor      | Descrição                        | Entry point                 |
| ---------- | -------------------------------- | --------------------------- |
| `module`   | App que roda no canvas container | `index.html`                |
| `tentacle` | Hook de sistema que estende APIs | `index.js`                  |
| `theme`    | Tema visual (CSS + variáveis)    | `theme.css` ou `theme.json` |

---

## 9. Esqueleto do Dev

### 9.1. Módulo (type: module)

```text
@fulano/meu-modulo/
├── panda.manifest.json    ← Obrigatório
├── index.html             ← Entry point
├── style.css              ← Opcional
├── script.js              ← Opcional
└── assets/
    └── icon.png           ← 128x128
```

### 9.2. Tentáculo (type: tentacle)

```text
@fulano/meu-tentaculo/
├── panda.manifest.json    ← Obrigatório
├── index.js               ← Entry point (registra no TentacleMonitor)
├── README.md              ← Documentação
└── assets/
    └── icon.png           ← 128x128
```

### 9.3. Theme (type: theme)

```text
@fulano/meu-theme/
├── panda.manifest.json    ← Obrigatório
├── theme.css              ← Variáveis CSS
└── assets/
    ├── icon.png           ← 128x128
    └── preview.png        ← Screenshot 1280x720
```

### 9.4. Fluxo completo do dev

```text
1. Dev cria pasta seguindo esqueleto acima
2. Testa local (Panda tem modo dev que carrega de pasta local)
3. Sobe assets no GitHub / Drive
4. Publica na Medusa Store → envia manifest
5. Medusa valida manifest (schema check)
6. Agentes de verificação acessam URL e fazem scan
7. Aparece na Store → users instalam
```

---

## 10. Panda Store Registry

### 10.1. Estrutura

```text
PANDA STORE (hospedado em GAS/Firebase)
├── registry/
│   ├── modules.json          # Lista de módulos
│   ├── tentacles.json        # Lista de tentáculos
│   └── themes.json           # Lista de themes
├── packages/
│   └── {namespace}/{name}/
│       ├── manifest.json
│       └── versions/
│           ├── 1.0.0/
│           └── 1.1.0/
└── api/
    └── v1/
        ├── search
        ├── install
        └── publish
```

### 10.2. API Endpoints

| Endpoint                             | Método | Descrição                              |
| ------------------------------------ | ------ | -------------------------------------- |
| `/api/v1/search?q=&type=`            | GET    | Busca por tipo (module/tentacle/theme) |
| `/api/v1/package/{namespace}/{name}` | GET    | Detalhes do package                    |
| `/api/v1/install/{namespace}/{name}` | POST   | Instala (debita PC)                    |
| `/api/v1/publish`                    | POST   | Publica (via webhook)                  |

---

## 11. Diferenciais para Devs

| Diferencial       | Descrição                      |
| ----------------- | ------------------------------ |
| **Split 52%**     | Dev fica com 52% das vendas    |
| **GitHub nativo** | Sem plataforma proprietária    |
| **SDK simples**   | `Panda.Brain.chat()`           |
| **IA tutora**     | Tutorial automático para users |
| **Multi-window**  | Modules podem usar docks       |
| **Tokenomics**    | Monetização built-in com PC    |
| **Zero config**   | User não configura API keys    |

### Comparação

| Plataforma          | Split Dev | Barreira            | Monetização    |
| ------------------- | --------- | ------------------- | -------------- |
| **Panda**           | 52%       | 🟢 Baixa (git push) | ✅ PC built-in |
| Apple Store         | 70-85%    | 🔴 Alta ($99/ano)   | ✅             |
| Chrome Web Store    | 70%       | 🟡 Média (review)   | ⚠️ Manual      |
| VS Code Marketplace | 0%        | 🟢 Baixa            | ❌ Sem         |

### VMs e Hosts Terceiros

| Modelo                 | Descrição                       | Revenue     |
| ---------------------- | ------------------------------- | ----------- |
| **VM Rental (Google)** | Locação de VMs GCP via Panda    | 30% fee     |
| **Host Terceiro**      | Provedor externo plugado no SDK | 10-20% fee  |
| **Compute Share**      | User cede recursos → recebe PC  | Split 50/50 |

---

## 12. Roadmap

| Fase   | Entregas                                               | Prazo    |
| ------ | ------------------------------------------------------ | -------- |
| **P1** | GitHub Webhook + Medusa API                            | Sprint 4 |
| **P2** | ✅ Store UI v3.1 (9 extensões, BYOL+webview planejado) | Sprint 5 |
| **P3** | Sandbox runtime + permissions                          | Sprint 6 |
| **P4** | Featured modules + analytics                           | Sprint 7 |

---

## 13. Referências

- [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md) - Rust Agent + Backend
- [PF_MCP_REFERENCE.md](PF_MCP_REFERENCE.md) - MCP Tools + Manifest
- [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) - Economia PC/Splits
- [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) - SDK API + Tentacle Architecture
- [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md) - Blindagem SDK §2.2

---

> 📖 **Versão:** 2.0.0 | **Status:** Planejado
