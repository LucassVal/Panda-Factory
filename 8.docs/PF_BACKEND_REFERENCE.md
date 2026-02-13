> [!IMPORTANT]
> **🐼 ANTES DE QUALQUER AÇÃO:** Leia .agent/CONTEXT.md — contém estrutura, regras, nomenclatura e governança.
> **SSoT Master:** CONTEXT.md §5 (Sistema Montesquieu) | Cada doc tem jurisdição única.

---

tool_context: panda/backend
description: Backend Unificado - Rust Agent, MCP, Firebase, Auth, Health
version: 2.1.0
updated: 2026-02-08

---

# 🦀 PF_BACKEND_REFERENCE - Infraestrutura Backend Unificada

> **Versão:** 2.1.0 | **Atualizado:** 2026-02-08
> **Consolidado de:** PF_MCP, PF_RUST, PF_FIREBASE, PF_AUTH, PF_HEALTH

---

## 📋 Índice

- [1. Visão Geral](#1-visão-geral)
- [2. Rust Agent](#2-rust-agent)
- [3. MCP Tools](#3-mcp-tools)
- [4. Firebase](#4-firebase)
- [5. Autenticação](#5-autenticação)
- [6. Health Status](#6-health-status)
- [7. Segurança](#7-segurança)

---

## 1. Visão Geral

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA BACKEND PANDA FACTORY                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BROWSER (90%)                 DESKTOP (Local)           CLOUD (10%)   │
│  ┌──────────────┐             ┌──────────────┐         ┌───────────┐   │
│  │ React UI     │◀───IPC────▶│ Rust Agent   │◀──REST─▶│ Firebase  │   │
│  │ TLDraw       │             │ (Tauri)      │         │ RTDB      │   │
│  │ SDK          │◀───MCP────▶│ MCP Server   │───────▶ │ GAS       │   │
│  └──────────────┘             └──────────────┘         └───────────┘   │
│         │                            │                        │        │
│         └────────────────────────────┴────────────────────────┘        │
│                              ▼                                          │
│                    [Health Monitoring]                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Princípio:** "O Browser faz 90% do trabalho. Cloud só para sync e billing."

---

## 2. Rust Agent

O **Rust Agent** é o "corpo físico" do Panda Factory no PC do usuário.

### 2.1 Por que Rust?

| Critério            |   Rust    | Node/Python |  Electron   |
| ------------------- | :-------: | :---------: | :---------: |
| **Performance**     |  ⭐⭐⭐   |     ⭐      |    ⭐⭐     |
| **Tamanho binário** |   ~5MB    |    ~50MB    |   ~150MB    |
| **Sem runtime**     |    ✅     |   ❌ Node   | ❌ Chromium |
| **Memory safety**   |    ✅     |     ⚠️      |     ⚠️      |
| **GPU (CUDA/ROCm)** | ✅ Nativo | ⚠️ Binding  |     ❌      |

### 2.2 Módulos Core (NÃO Substituíveis)

| Módulo          | Crate/Service           | Função                |
| --------------- | ----------------------- | --------------------- |
| **pf_core**     | `tokio`, `serde`        | Bootstrap, config     |
| **pf_mcp**      | `rmcp`                  | MCP Server para IAs   |
| **pf_crypto**   | `ring`, `ed25519-dalek` | PC Cripto futuro      |
| **pf_wallet**   | `rusqlite` + crypto     | Ledger local          |
| **pf_firebase** | `reqwest`               | Auth, RTDB, Analytics |
| **pf_tauri**    | `tauri`                 | WebView UI            |

### 2.3 Extension Modules

| Módulo          | Default Google  | Fallback Local  |
| --------------- | --------------- | --------------- |
| **pf_stt**      | Cloud Speech    | `whisper-rs`    |
| **pf_tts**      | Cloud TTS       | `tts-rs`        |
| **pf_ocr**      | Cloud Vision    | `tesseract-rs`  |
| **pf_polyglot** | Cloud Translate | NLLB via `ort`  |
| **pf_gpu**      | Cloud GPU       | `cudarc`/`wgpu` |

### 2.4 Hardware Modules

| Módulo           | Crate           | Risco           | Mitigação               |
| ---------------- | --------------- | --------------- | ----------------------- |
| **pf_capture**   | `scap`          | Screen expose   | Permissão + notificação |
| **pf_webcam**    | `nokhwa`        | Video capture   | Indicador visual        |
| **pf_clipboard** | `arboard`       | Dados sensíveis | Permissão ativa         |
| **pf_hotkeys**   | `global-hotkey` | Keylogger       | Lista branca            |

### 2.5 Distribuição

| Target          | Tamanho | Técnicas                      |
| --------------- | ------- | ----------------------------- |
| **Windows x64** | ~5MB    | `strip`, `LTO`, `opt-level=z` |
| **Linux x64**   | ~4MB    | `musl` static                 |
| **macOS arm64** | ~4MB    | Universal binary              |

---

## 3. MCP Tools

### 3.1 Matriz de Acesso

| Tool             | User (3) | Dev (2) | Founder (1) | Descrição          |
| ---------------- | :------: | :-----: | :---------: | ------------------ |
| `screen_capture` |    ✅    |   ✅    |     ✅      | Captura tela atual |
| `click`          |    ✅    |   ✅    |     ✅      | Clica em posição   |
| `fs_read`        |    ✅    |   ✅    |     ✅      | Lê arquivos        |
| `fs_write`       |    ✅    |   ✅    |     ✅      | Escreve arquivos   |
| `notify`         |    ✅    |   ✅    |     ✅      | Notificações       |
| `gpu_check`      |    ✅    |   ✅    |     ✅      | Info GPU           |
| `code_edit`      |    ❌    |   ✅    |     ✅      | Editar código (AG) |
| `terminal`       |    ❌    |   ✅    |     ✅      | Executar comandos  |
| `git`            |    ❌    |   ✅    |     ✅      | Versionamento      |
| `debug`          |    ❌    |   ✅    |     ✅      | Debugger           |
| `pat_checkin`    |    ❌    |   ❌    |     ✅      | Check-in PAT       |
| `governance`     |    ❌    |   ❌    |     ✅      | Ações governança   |
| `treasury`       |    ❌    |   ❌    |     ✅      | Controle Treasury  |

**Legenda:**

- **User (3)**: Usuário final, só interage
- **Dev (2)**: Desenvolvedor, pode usar Dev Mode (code assistance)
- **Founder (1)**: Acesso total + governança

### 3.2 API de Tools

```javascript
// screen_capture
const screenshot = await Panda.Bridge.execute("screen_capture", {
  region: { x: 0, y: 0, width: 1920, height: 1080 },
});
// Returns: { base64, mimeType, width, height }

// fs_read
const content = await Panda.Bridge.execute("fs_read", {
  path: "/path/to/file.txt",
  encoding: "utf8",
});
// Returns: { content, size, modified }

// fs_write
await Panda.Bridge.execute("fs_write", {
  path: "/path/to/file.txt",
  content: "Hello World",
  append: false,
});

// notify
await Panda.Bridge.execute("notify", {
  title: "Panda Factory",
  body: "Tarefa concluída!",
  icon: "success", // success, error, warning, info
});

// gpu_check
const gpu = await Panda.Bridge.execute("gpu_check");
// Returns: { vendor, renderer, memory, cuda, vulkan, webgpu }
```

### 3.3 Context Injection

Toda mensagem enviada ao Brain inclui contexto da UI automaticamente:

```javascript
// uiContext.js injeta antes de enviar
const messageWithContext = injectContext(userMessage);

// Resultado:
// ---
// CONTEXTO UI:
// [Canvas: 15 shapes, tool=select]
// [Panels: dock,chat]
// [🌙 USER]
// ---
// Olá, como faço para...
```

| Categoria | Dados                         |
| --------- | ----------------------------- |
| Canvas    | Shapes, zoom, tool ativo      |
| Panels    | Quais estão abertos           |
| Selection | Itens selecionados            |
| User      | Tema, idioma, modo (dev/user) |
| Plugins   | Instalados e ativos           |

### 3.4 Supercompactação

Reduz tokens enviados ao Gemini mantendo informação útil:

1. **Abreviações**: `canvas` → `c`, `shapes` → `sh`
2. **Limite de profundidade**: Máximo 2 níveis
3. **Sampling**: Arrays > 10 itens → 3 amostras + count
4. **Omissão**: Valores null/undefined removidos

---

## 4. Firebase

### 4.1 Serviços Ativos

| Serviço               |   Status    | Uso                 |
| --------------------- | :---------: | ------------------- |
| **Authentication**    |     ✅      | Login Google        |
| **Realtime Database** |     ✅      | Status/Signaling    |
| **Firestore**         |   ❌ Off    | Não usar            |
| **Storage**           | ⚠️ Opcional | Assets públicos     |
| **Functions**         |   ❌ Off    | Custo alto          |
| **Hosting**           |   ❌ Off    | Usamos GitHub Pages |

### 4.2 Estrutura RTDB

O RTDB é usado **apenas** para signaling entre Browser e Rust Agent:

```json
{
  "pf_cells": {
    "{userId}": {
      "status": {
        "online": true,
        "lastSeen": 1706234567890,
        "rustAgent": {
          "connected": true,
          "version": "1.0.0",
          "gpu": "NVIDIA RTX 3080"
        }
      },
      "commands": {
        "{commandId}": {
          "action": "gpu.process",
          "payload": {},
          "status": "pending"
        }
      },
      "responses": {
        "{commandId}": {
          "result": {},
          "status": "completed"
        }
      }
    }
  }
}
```

### 4.3 Fluxo de Comunicação

```text
[🖥️ BROWSER]                [🔥 FIREBASE RTDB]           [🦀 RUST AGENT]
      │                             │                           │
      │ 1. PUSH COMMAND ───────────▶│                           │
      │    /pf_cells/{uid}/commands │                           │
      │                             │ 2. SSE LISTENER ─────────▶│
      │                             │    (onValue)              │
      │                             │                           │ 3. EXECUTA LOCAL
      │                             │◀─── 4. PUSH RESPONSE ─────│
      │◀── 5. SSE UPDATE ──────────│                           │
```

### 4.4 Capacidade Free Tier

| Recurso              | Limite          | Uso Estimado  |
| -------------------- | --------------- | ------------- |
| **Autenticações**    | ∞               | ~1/sessão     |
| **RTDB Connections** | 100 simultâneas | ~10,000 users |
| **RTDB Storage**     | 1GB             | < 100MB       |
| **RTDB Download**    | 10GB/mês        | < 1GB         |

---

## 5. Autenticação

### 5.1 Métodos de Login

| Método             | Uso              | Provider      |
| ------------------ | ---------------- | ------------- |
| **Google**         | Usuários normais | Firebase Auth |
| **Email/Password** | Dev/Testing      | Firebase Auth |

### 5.2 Tipos de Usuário

| Tipo        | Acesso                         | Identificação    |
| ----------- | ------------------------------ | ---------------- |
| **Founder** | Full + Dashboard + Kill Switch | Ed25519 Key      |
| **Dev**     | SDK + DevTools                 | Email verificado |
| **User**    | App básico                     | Account normal   |
| **Guest**   | Público                        | Não autenticado  |

### 5.3 Auth Flow

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTH FLOW                                         │
├─────────────────────────────────────────────────────────────────────┤
│  LoginModal                Firebase Auth              Panda Backend  │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐ │
│  │ Google OAuth │────────▶│ signIn       │────────▶│ User Record  │ │
│  │ or           │         │ Popup        │         │ + userType   │ │
│  │ Email/Pass   │         └──────────────┘         └──────────────┘ │
│  └──────────────┘                │                        │         │
│                                  ▼                        ▼         │
│                          ┌──────────────┐         ┌──────────────┐ │
│                          │ ID Token     │────────▶│ GAS Verify   │ │
│                          └──────────────┘         └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.4 Uso no React

```javascript
import { useAuth, AuthProvider } from "@/hooks/useAuth";

// Wrap app
<AuthProvider>
  <App />
</AuthProvider>;

// In components
const { user, isFounder, isDev, loginWithGoogle, loginWithEmail, logout } =
  useAuth();
```

### 5.5 Verificação Founder

```text
Founder Action (ex: Kill Switch)
        │
        ▼
Enter PIN (6 digits)
        │
        ▼
Sign with Ed25519 Private Key
        │
        ▼
Send Signature to GAS
        │
        ▼
GAS Verifies with Public Key
        │
        ▼
Execute Protected Action
```

### 5.6 Test Accounts

| Email               | Senha             | Tipo    |
| ------------------- | ----------------- | ------- |
| `founder@panda.com` | qualquer 6+ chars | Founder |
| `dev@test.com`      | qualquer 6+ chars | Dev     |
| `user@test.com`     | qualquer 6+ chars | User    |

---

## 6. Health Status

### 6.1 StatusBars por Contexto

| Contexto     | Indicadores                     |
| ------------ | ------------------------------- |
| **Jam**      | Rust, Firebase, GAS, GPU, MCP   |
| **Store**    | GitHub, Payment, CDN, Analytics |
| **DevTools** | VSX, MCP, Debugger, Terminal    |
| **Admin**    | Firestore, GAS, BigQuery, Users |

### 6.2 Status Codes

| Status           | Cor | Significado  |
| ---------------- | :-: | ------------ |
| `ready`          | 🟢  | Pronto       |
| `connected`      | 🟢  | Conectado    |
| `available`      | 🟢  | Disponível   |
| `degraded`       | 🟡  | Parcial      |
| `unavailable`    | 🔴  | Indisponível |
| `error`          | 🔴  | Erro         |
| `notinitialized` | ⚪  | Não iniciado |

### 6.3 API Response

```json
{
  "version": "0.2.0",
  "uptime_secs": 8100,
  "status": "healthy",
  "services": {
    "mcp": { "status": "ready", "details": { "tools": "5" } },
    "gpu": { "status": "available", "details": { "name": "RTX 4090" } },
    "firebase": { "status": "connected", "latency_ms": 45 }
  }
}
```

### 6.4 Uso no React

```javascript
import { useHealthStatus } from "@/hooks/useHealthStatus";

function MyComponent() {
  const { health, isConnected, refresh } = useHealthStatus("jam");
  return <div>{health?.services.rust.status}</div>;
}
```

---

## 7. Segurança

### 7.1 Validação Tripla

```text
1. SDK verifica role (client-side)
2. Rust Agent verifica novamente (desktop-side)
3. GAS valida token (server-side)
```

### 7.2 RTDB Rules

```json
{
  "rules": {
    "pf_cells": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

### 7.3 Sandbox MCP

- Tools de User não acessam fora do workspace
- fs_read/write limitados a pastas permitidas
- code_edit requer confirmação explícita

---

## 8. Padrões de Resiliência (P0 - Crítico)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P0 (Implementar imediatamente)

### 8.1 Circuit Breaker

O Circuit Breaker previne cascading failures quando serviços externos (GAS, Firebase) falham.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    CIRCUIT BREAKER STATE MACHINE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    ┌──────────────┐                                     │
│           success  │   CLOSED     │  failure                            │
│           ┌───────▶│  (Normal)    │────────┐                            │
│           │        └──────────────┘        │                            │
│           │               │                ▼                            │
│           │        failures >= 3    ┌──────────────┐                    │
│           │               │         │    OPEN      │                    │
│           │               └────────▶│  (Fail Fast) │                    │
│           │                         └──────────────┘                    │
│           │                               │                              │
│           │                        timeout (30s)                        │
│           │                               │                              │
│           │                               ▼                              │
│           │                         ┌──────────────┐                    │
│           └─────────────────────────│  HALF-OPEN   │                    │
│                                     │  (Testing)   │                    │
│                                     └──────────────┘                    │
│                                           │                              │
│                                      failure                             │
│                                           │                              │
│                                           └─────────▶ OPEN              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Implementação (pf.firebase-bridge.js):**

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.state = "CLOSED";
    this.failures = 0;
    this.threshold = options.threshold || 3;
    this.timeout = options.timeout || 30000; // 30s
    this.lastFailure = null;
  }

  async execute(fn) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailure > this.timeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit is OPEN - fail fast");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = "CLOSED";
  }

  onFailure() {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.failures >= this.threshold) {
      this.state = "OPEN";
      console.warn("[CircuitBreaker] OPEN - switching to fallback");
    }
  }
}

// Uso
Panda.Backend._circuitBreaker = new CircuitBreaker({ threshold: 3 });
```

### 8.2 Retry com Exponential Backoff

```javascript
// Estratégia de retry com jitter para evitar thunder herd
async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    jitter = true,
  } = options;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      // Exponential backoff: 1s, 2s, 4s...
      let delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

      // Adiciona jitter (±25%) para evitar thunder herd
      if (jitter) {
        delay += delay * (Math.random() * 0.5 - 0.25);
      }

      console.log(
        `[Retry] Attempt ${attempt + 1}/${maxRetries}, waiting ${delay}ms`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Uso no SDK
Panda.Backend.call = async (action, payload, options = {}) => {
  const { retries = 3, backoff = "exponential" } = options;

  return retryWithBackoff(() => executeBackendCall(action, payload), {
    maxRetries: retries,
  });
};
```

### 8.3 Offline-First / Fallback Strategy

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FALLBACK HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TIER 1: GAS (Google Apps Script)                                       │
│     │                                                                   │
│     │ 3 failures / timeout                                              │
│     ▼                                                                   │
│  TIER 2: Firebase Functions (se habilitado)                             │
│     │                                                                   │
│     │ 3 failures / timeout                                              │
│     ▼                                                                   │
│  TIER 3: Rust Agent Local                                               │
│     │                                                                   │
│     │ não disponível                                                    │
│     ▼                                                                   │
│  TIER 4: IndexedDB Cache (stale data)                                   │
│     │                                                                   │
│     │ cache miss                                                        │
│     ▼                                                                   │
│  TIER 5: Graceful Degradation (UI indica offline)                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Implementação:**

```javascript
Panda.Backend._fallbackChain = [
  { name: "GAS", fn: callGAS },
  { name: "Rust", fn: callRustAgent },
  { name: "Cache", fn: readFromCache },
];

Panda.Backend.callWithFallback = async (action, payload) => {
  for (const tier of Panda.Backend._fallbackChain) {
    try {
      console.log(`[Fallback] Trying ${tier.name}...`);
      return await Panda.Backend._circuitBreaker.execute(() =>
        tier.fn(action, payload),
      );
    } catch (error) {
      console.warn(`[Fallback] ${tier.name} failed:`, error.message);
      continue;
    }
  }

  // Graceful degradation
  Panda.UI.showOfflineMode();
  throw new Error("All backends unavailable");
};
```

### 8.4 Configuração por Ambiente

| Parâmetro          | Desenvolvimento | Produção |
| ------------------ | --------------- | -------- |
| `circuitThreshold` | 2               | 5        |
| `circuitTimeout`   | 10s             | 60s      |
| `maxRetries`       | 2               | 3        |
| `baseDelay`        | 500ms           | 1000ms   |
| `cacheStaleTime`   | 1min            | 5min     |

---

## 9. Análise de Custos — Fallback de Infraestrutura

> **Ref:** Auditoria Econômica §14.7 | Aprovado: 2026-02-13

```text
TIER 1: GOOGLE (atual) — $0/mês ← FOCO ATUAL
├── GAS: 6min execution, 90s/call, 20k calls/day FREE
├── Firebase RTDB: 1GB storage, 10GB/mês download, 100 concurrent
├── GitHub Pages: 100GB/mês bandwidth FREE
├── Deploy: zero (auto-deploy via commit)
└── RISCO: Google descontinua Free Tier

TIER 2: SUPABASE — $0-25/mês
├── Free: 500MB DB, 1GB storage, 50k auth users, 500k edge invocations
├── Pro ($25/mês): 8GB DB, 100GB storage, 2M edge invocations
├── REST API compatível (substitui GAS endpoints)
├── Tempo de migração: ~2 semanas (REST endpoints + auth)
└── RISCO: Pricing changes (startup VC-funded)

TIER 3: NEON / PLANETSCALE — $0-39/mês
├── Neon Free: 0.5GB Postgres, 3GB storage
├── Neon Pro ($19/mês): 10GB Postgres, 50GB storage
├── PlanetScale ($39/mês): MySQL serverless, branching
├── Tempo de migração: ~3 semanas (schema + ORM)
└── RISCO: PlanetScale já cortou Free Tier uma vez

TIER 4: SELF-HOST (VPS) — R$25-50/mês
├── Hetzner CX22 (2vCPU, 4GB RAM): €4.49/mês
├── Oracle Cloud Free (4 OCPU, 24GB RAM): $0/mês
├── Deploy: Docker + PostgreSQL + Express.js
├── Tempo de migração: ~4 semanas (infra + deploy pipeline)
└── RISCO: Responsabilidade por uptime, segurança, backups

TIER 5: INDEXEDDB (offline total) — $0/mês
├── Já implementado como cache layer
├── Funciona SEM internet (Offline-First architecture)
├── Limitação: sem sync entre devices
└── RISCO: orphaned data, conflito de merge
```

> [!IMPORTANT]
> **Estratégia:** Foco 100% no Tier 1 (Google Free). Quando qualquer item individual deixar de ser gratuito, analisar se compensa PAGAR pelo item ou MIGRAR o serviço inteiro. Decisão caso a caso, sem migração preventiva.

| Tier               | Custo   | Tempo Migração | Status             |
| ------------------ | ------- | -------------- | ------------------ |
| **1. Google**      | $0      | —              | ✅ ATIVO           |
| **2. Supabase**    | $0-25   | ~2 semanas     | 📋 Plano B         |
| **3. Neon/PScale** | $0-39   | ~3 semanas     | 📋 Alternativa     |
| **4. VPS**         | R$25-50 | ~4 semanas     | 📋 Último recurso  |
| **5. IndexedDB**   | $0      | —              | ✅ Já implementado |

**Monitoramento:** Check trimestral de ToS changes do Google.

---

> 📖 **Versão:** 2.2.0 | **Consolidado:** BACKEND + Módulos Avançados + Cache Jitter + Fallback Cost Analysis

---

## 📎 Links de Código

### Rust Agent

- [7.rust-agent/](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/7.rust-agent/)

### React Hooks

- [useAuth.jsx](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/11.pf-app/src/hooks/useAuth.jsx)
- [useHealthStatus.js](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/11.pf-app/src/hooks/useHealthStatus.js)
- [useFirebase.js](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/11.pf-app/src/hooks/useFirebase.js)

### Components

- [PFStatusBar.jsx](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/11.pf-app/src/components/PFStatusBar.jsx)
- [PFLoginModal.jsx](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/11.pf-app/src/components/PFLoginModal.jsx)

---

> 📖 **Ver também:** [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md), [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md)

---

# PARTE B: Módulos Avançados do Rust Agent

> **Consolidado de:** PF_MASTER_ARCHITECTURE.md §5.2

O Rust não é apenas GPU. É a **ponte** para o mundo real do Sistema Operacional.

## B.1 GPU Detection Flow

```text
[SITE PANDA]
      │
      ▼
 ┌───────────────┐
 │ AGENT ONLINE? │
 └──────┬────────┘
        │ Não ───────────────┐
        │                    │
        │ Sim                ▼
        ▼              [CLOUD MODE]
 ┌───────────────┐     (30 PC/h)
 │ DETECTAR GPU  │
 └──────┬────────┘           ▲
        │                    │
        ├──── Nenhuma ───────┘
        │
        │ Sim (NVIDIA/AMD)
        ▼
  [LOCAL MODE]
  (0 PC/h - GRÁTIS)
```

## B.2 Módulo Financeiro & Trade (DLL Bridge)

Plataformas de mercado financeiro (MetaTrader 4/5, Profitchart) só aceitam integração via **DLL Windows**.

- O Rust carrega `mt5.dll` e expõe funções como `OrderSend()` via Firebase
- O SaaS Web envia ordens para terminais Desktop legados

## B.3 Módulo RPA / Ghost User

Para sistemas sem API nem DLL (ERPs antigos):

- O Rust controla **Mouse e Teclado** (`enigo`, `winapi`)
- O SaaS diz "Cadastrar Cliente X". O Rust abre janela, digita e salva

## B.4 Módulo IoT & Hardware

Acesso total a periféricos que o navegador não consegue:

| Periférico           | Biblioteca | Exemplo          |
| -------------------- | ---------- | ---------------- |
| Impressoras Térmicas | ESC-POS    | Cupons fiscais   |
| Balanças de precisão | Porta COM  | Pesagem balcão   |
| Leitores Biométricos | SDK nativo | Validação acesso |

## B.5 Local AI Intelligence (Offline Brain) 🧠

Para privacidade absoluta:

- O Rust roda **Llama 3 / Mistral** quantizado localmente
- PDFs sigilosos são processados no PC. Apenas o resumo vai para nuvem

## B.6 Polyglot Module (Tradução Global) 🌍

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    POLYGLOT - ARQUITETURA                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MODELO: NLLB-200 (Meta AI)                                            │
│  ├── Tamanho: ~600MB (único arquivo)                                   │
│  ├── Idiomas: 200+ (PT, EN, ES, FR, DE, 中文, 日本語, العربية...)       │
│  ├── Qualidade: ★★★★ (Pesquisa Meta)                                   │
│  └── Runtime: ONNX via `ort` crate                                     │
│                                                                         │
│  LEGENDAS: Whisper Base (OpenAI)                                       │
│  ├── Tamanho: ~140MB                                                   │
│  ├── Função: Speech-to-Text (STT)                                      │
│  └── Fluxo: Áudio → Whisper → Texto → NLLB → Legenda traduzida         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**SDK Integration:**

```javascript
Panda.Polyglot = {
  translate(text, from, to),      // Promise<string>
  translateStream(stream, to),    // AsyncIterator<string>
  detectLanguage(text),           // Promise<{lang, confidence}>
  getSupportedLanguages(),        // string[] (200+)
  localizeUI(langCode)            // void (aplica traduções na UI)
};
```

| Aspecto         | Cloud API          | Rust Local         |
| --------------- | ------------------ | ------------------ |
| **Privacidade** | ❌ Dados saem      | ✅ Zero vazamento  |
| **Custo**       | 💰 Por caractere   | ✅ Grátis infinito |
| **Latência**    | 🐢 100-500ms       | ⚡ ~50ms           |
| **Offline**     | ❌ Requer internet | ✅ 100% offline    |

## B.7 RIG Framework (Agentes Complexos)

```rust
// pf_rig.rs - Suporte multi-provider
use rig::providers::{gemini, anthropic, openai};

pub struct AgentRunner {
    providers: HashMap<String, Box<dyn Provider>>,
}

impl AgentRunner {
    pub async fn chat(&self, config: AgentConfig) -> Result<String> {
        let provider = self.providers.get(&config.provider)?;
        let agent = provider.agent(&config.model)
            .tool(McpToolset::new())
            .build();

        let (response, usage) = agent.chat(&config.input).await?;
        meter::track_usage(usage).await; // Billing
        Ok(response)
    }
}
```

## B.8 Token Meter & Economy

```rust
// pf_meter.rs - Billing por provider
pub async fn track_usage(user: &str, provider: &str, model: &str,
                         tokens_in: u64, tokens_out: u64) {
    let (_, rate_in, rate_out) = RATES.iter()
        .find(|(m, _, _)| *m == model)
        .unwrap_or(&("default", 0.05, 0.20));

    let cost = (tokens_in as f64 / 1000.0) * rate_in
             + (tokens_out as f64 / 1000.0) * rate_out;

    // Envia para Firebase
    firebase::push(&format!("pf_cells/{}/usage", user), &TokenUsage {
        cost_pc: cost,
        timestamp: chrono::now(),
    }).await;
}
```

## B.9 Multi-User Session

```rust
// pf_multiuser.rs
pub struct MultiUserSession {
    sessions: HashMap<String, UserSession>,
}

pub async fn handle_request(user_id: &str, command: McpTool) -> Result<Response> {
    let session = sessions.get_session(user_id).ok_or("Auth failed")?;
    let result = execute_in_context(session, command).await?;
    meter::track(session, &result.usage).await;
    Ok(result)
}
```

## B.10 Cache Strategy (P1 - Thunder Herd Prevention)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P1
> **Problema:** Quando cache de muitos usuários expira ao mesmo tempo, todos requisitam o servidor juntos

### IndexedDB com TTL Jitter

```rust
// pf_cache.rs
pub struct CacheConfig {
    ttl: u64,           // segundos
    jitter: bool,       // ±25% variação
    stale_ok: bool,     // retornar expirado enquanto revalida
}

impl CacheConfig {
    pub fn effective_ttl(&self) -> u64 {
        if self.jitter {
            let variance = (self.ttl as f64 * 0.25) as u64;
            let offset = rand::thread_rng().gen_range(0..variance * 2);
            self.ttl - variance + offset
        } else {
            self.ttl
        }
    }
}

pub async fn get_with_cache<T>(key: &str, fetcher: impl Fn() -> T) -> T {
    if let Some(cached) = cache::get(key) {
        if !cached.expired() {
            return cached.value;
        }
        if cached.config.stale_ok {
            // Retorna stale e atualiza em background
            tokio::spawn(async move {
                let fresh = fetcher();
                cache::set(key, fresh, cached.config);
            });
            return cached.value;
        }
    }

    let value = fetcher();
    cache::set(key, value.clone(), default_config());
    value
}
```

### Estratégias por Tipo de Dado

| Dado    | TTL    | Jitter | Stale OK | Exemplo           |
| ------- | ------ | ------ | -------- | ----------------- |
| Config  | 7 dias | ❌     | ❌       | Constantes do app |
| Profile | 1 hora | ✅ 25% | ✅       | Dados de usuário  |
| Balance | 5 min  | ✅ 50% | ❌       | Saldo PC          |
| Prices  | 1 min  | ✅ 30% | ✅       | Cotação USD       |
