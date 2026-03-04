---
tool_context: panda/mcp
description: Model Context Protocol - Rust Agent Tools, 3 Tiers de acesso
version: 2.5.0
updated: 2026-03-04
ssot: CONTEXT.md §5 (Sistema Montesquieu)
cross_ref:
  [
    PF_MASTER_ARCHITECTURE.md,
    PF_BACKEND_REFERENCE.md,
    PF_SDK_REFERENCE.md,
    PF_GOOGLE_SUITE.md,
    PF_GITHUB_REFERENCE.md,
    PF_UI_REFERENCE.md §17,
  ]
---

# 🦀 Panda MCP Tools - Referência

> **Versão:** 2.5.0 | **Runtime:** Rust Agent (Tauri) + Web (React) | **Protocolo:** MCP

---

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Tools por Nível de Acesso](#tools-por-nível-de-acesso)
3. [API de Tools](#api-de-tools)
4. [Context Injection](#context-injection)
5. [Supercompactação](#supercompactação)

---

## 1. Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA MCP PANDA FACTORY                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  JAM UI (Browser)          Rust Agent (Desktop)        GAS (Cloud)     │
│  ┌──────────────┐          ┌──────────────────┐       ┌───────────┐    │
│  │ PFChat.jsx   │◀──MCP───▶│  panda-agent     │──────▶│ Brain.gs  │    │
│  │ uiContext.js │          │  (Tauri + Rust)  │       │ PAT.gs    │    │
│  └──────────────┘          └──────────────────┘       └───────────┘    │
│         │                           │                                   │
│         ▼                           ▼                                   │
│  Context Injection           MCP Tools                                  │
│  (Automático)               (Por nível)                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componentes:**

- **JAM UI**: Interface React que injeta contexto automaticamente
- **Rust Agent**: Desktop app com MCP tools (screen, fs, etc.)
- **GAS Backend**: Lógica de negócio, billing, PAT

---

## 2. Tools por Nível de Acesso

### Matriz de Acesso

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

### Legenda

- **User (3)**: Usuário final, só interage
- **Dev (2)**: Desenvolvedor, pode usar Dev Mode (code assistance)
- **Founder (1)**: Acesso total + governança

---

## 3. API de Tools

### screen_capture

Captura a tela atual ou região específica.

```javascript
// Via SDK
const screenshot = await Panda.Bridge.execute("screen_capture", {
  region: { x: 0, y: 0, width: 1920, height: 1080 }, // opcional
});
// Returns: { base64, mimeType, width, height }
```

### click

Simula clique em posição ou elemento.

```javascript
await Panda.Bridge.execute("click", {
  x: 500,
  y: 300,
  button: "left", // left, right, middle
});
```

### fs_read

Lê conteúdo de arquivo.

```javascript
const content = await Panda.Bridge.execute("fs_read", {
  path: "/path/to/file.txt",
  encoding: "utf8", // opcional
});
// Returns: { content, size, modified }
```

### fs_write

Escreve conteúdo em arquivo.

```javascript
await Panda.Bridge.execute("fs_write", {
  path: "/path/to/file.txt",
  content: "Hello World",
  append: false, // true para append
});
```

### notify

Exibe notificação do sistema.

```javascript
await Panda.Bridge.execute("notify", {
  title: "Panda Factory",
  body: "Tarefa concluída!",
  icon: "success", // success, error, warning, info
});
```

### gpu_check

Retorna informações da GPU.

```javascript
const gpu = await Panda.Bridge.execute("gpu_check");
// Returns: { vendor, renderer, memory, cuda, vulkan, webgpu }
```

---

## 4. Context Injection

### Como Funciona

Toda mensagem enviada ao Brain inclui contexto da UI automaticamente.

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

### Informações Capturadas

| Categoria | Dados                           |
| --------- | ------------------------------- |
| Canvas    | Shapes, zoom, tool ativo        |
| Panels    | Quais estão abertos             |
| Selection | Itens selecionados              |
| User      | Tema, idioma, modo (dev/user)   |
| Plugins   | Instalados e ativos             |
| MCP Tools | Tools dos módulos ativos (§4.1) |

---

### 4.1. MCP Tool Discovery (Orchestrator)

> **Status:** ✅ Implementado | **Versão:** 1.1.0 | **Cross-Ref:** `PF_UI_REFERENCE.md §17`

O Orchestrator descobre e injeta MCP tools no contexto da IA automaticamente.

#### Componentes

| Arquivo                | Localização                    | Descrição                                            |
| ---------------------- | ------------------------------ | ---------------------------------------------------- |
| `useMCPRegistry.js`    | `pf/app/src/hooks/`            | Hook React: registry, syncWithDock, getToolsForAI    |
| `PFOrchestrator.jsx`   | `pf/app/src/components/`       | Dashboard visual: módulos, tools, AI context preview |
| `PFOrchestrator.css`   | `pf/app/src/components/`       | Glassmorphism dark, neon accents                     |
| `*.manifest.json` (12) | `6.medusa/manifests/{module}/` | Declaração de tools por módulo                       |

#### Data Flow

```text
Dock installs module
  → App.jsx: installedPlugins updated
  → useEffect: syncWithDock(moduleIds)
  → useMCPRegistry: BUILTIN_TOOLS[id] loaded
  → useEffect: getToolsForAI()
  → CustomEvent "panda:mcp-tools-updated"
  → PFChat: mcpContext state updated
  → callBrain: [MCP Tools Available] injected before user message
```

#### BUILTIN_TOOLS (3 super-módulos, ~42 tools)

| Módulo           | ID       | Tools | Descrição                               |
| ---------------- | -------- | :---: | --------------------------------------- |
| Panda CRM (Pro)  | `crm`    |  ~17  | Contatos, Funil, Agenda, Estoque        |
| Panda Social Hub | `social` |  ~20  | Inbox unificado: WA, IG, FB, TK, TW, YT |
| Panda Pages      | `pages`  |   5   | Engine de páginas e links               |

#### Exemplo de Injeção no Prompt

```text
[MCP Tools Available]
MCP TOOLS DISPONÍVEIS:
(42 tools de 3 módulos ativos)

📱 Panda CRM:
  - crm_addContact(name, email, phone, tags): Adiciona novo contato
  - crm_listContacts(stage, search): Lista contatos com filtros

💬 WhatsApp:
  - wa_sendMessage(conversationId, message): Envia mensagem via WhatsApp

[User Message]
Olá, quero adicionar um contato novo...
```

#### API do Hook `useMCPRegistry()`

```javascript
const {
  registry, // Map<moduleId, {name, icon, tools[]}>
  tools, // Array<{name, description, parameters, moduleId}>
  toolCount, // number (total)
  activeModules, // string[] (IDs)
  loadModule, // (id) => void
  unloadModule, // (id) => void
  syncWithDock, // (dockModuleIds[]) => void
  getToolsForAI, // () => string (formatted for prompt)
  getToolByName, // (name) => tool|null
} = useMCPRegistry();
```

---

## 5. Supercompactação

### Objetivo

Reduzir tokens enviados ao Gemini mantendo informação útil.

### Técnicas

1. **Abreviações**: `canvas` → `c`, `shapes` → `sh`
2. **Limite de profundidade**: Máximo 2 níveis
3. **Sampling**: Arrays > 10 itens → 3 amostras + count
4. **Omissão**: Valores null/undefined removidos

### Exemplo

```javascript
// Antes (1200 caracteres)
{
  "canvas": {
    "available": true,
    "shapes": { "count": 150, "types": [...] },
    "camera": { "x": 0, "y": 0, "z": 1.0 }
  }
}

// Depois (120 caracteres)
{ "c": { "a": true, "sh": { "n": 150 }, "cam": { "x": 0, "y": 0 } } }
```

---

## 6. Dev Mode (Code Assistance)

### Quando Ativar

O modo Dev (code assistance) é ativado automaticamente quando:

1. Usuário tem `role === 2` (Dev) ou `role === 1` (Founder)
2. Rust Agent está conectado
3. Usuário confirma ação de codificação

### Fluxo

```text
User pergunta "Como codar X?"
    ↓
Brain responde com sugestão
    ↓
User confirma "Pode fazer"
    ↓
[DEV MODE ATIVADO]
    ↓
Brain usa code_edit, terminal, etc.
```

---

## 7. Segurança

### Validação Dupla

```text
1. SDK verifica role (client-side)
2. Rust Agent verifica novamente (desktop-side)
3. GAS valida token (server-side)
```

### Sandbox

- Tools de User não acessam fora do workspace
- fs_read/write limitados a pastas permitidas
- code_edit requer confirmação explícita

---

> 📖 **Ver também:** [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md), [PF_GAS_REFERENCE.md](PF_GAS_REFERENCE.md)

---

# PARTE B: MCP Manifest Spec

> **Consolidado de:** `PF_MCP_MANIFEST_SPEC.md` | **Versão:** 1.0.0

## B.1. Filosofia Zero Barreira

**MCP (Model Context Protocol)** é **obrigatório** para todos os plugins. Devs não pagam NADA - apenas usuário final paga.

```text
ANTES: Dev lê manual → Entende API → Escreve código → Testa
AGORA: Dev pergunta pra IA → IA lê MCP → IA usa o plugin
RESULTADO: Zero documentação = Zero barreira
```

**Split de Receita (quando usuário compra):**

- Dev do plugin: 70%
- Panda Ops: 25%
- Founder: 5%

## B.2. Estrutura panda.mcp.json

Todo plugin **DEVE** ter um `panda.mcp.json` na raiz:

```json
{
  "name": "panda-crm",
  "version": "1.0.0",
  "description": "CRM integrado ao Panda Factory",
  "mcp": {
    "tools": [
      {
        "name": "addLead",
        "description": "Adiciona um novo lead ao CRM",
        "parameters": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "phone": { "type": "string" }
          },
          "required": ["name", "phone"]
        }
      }
    ],
    "resources": [
      {
        "uri": "leads://",
        "name": "Leads Database",
        "mimeType": "application/json"
      }
    ],
    "prompts": [
      {
        "name": "qualify_lead",
        "description": "Prompt para qualificar um lead usando IA"
      }
    ]
  },
  "pricing": { "model": "premium", "price_pc": 99 },
  "permissions": ["storage.read", "storage.write", "bridge.mcp"]
}
```

### Campos Obrigatórios

| Campo       | Tipo   | Descrição                            |
| ----------- | ------ | ------------------------------------ |
| `name`      | string | ID único do plugin (ex: `panda-crm`) |
| `version`   | string | Versão semântica                     |
| `mcp.tools` | array  | Lista de ferramentas expostas        |

## B.3. Módulos Oficiais (3 super-módulos — todos FREE)

> **Modelo de negócio:** Módulos são gratuitos. Receita vem da venda de Panda Coins.
> **Encapsulado:** Valor definido livremente pelo Founder (Kiwify/Hotmart).

| Módulo               | Manifest ID | Preço | Tools | Descrição                             |
| -------------------- | ----------- | :---: | :---: | ------------------------------------- |
| **Panda CRM (Pro)**  | `crm`       | FREE  |  ~17  | Contatos, Funil, Agenda, Estoque      |
| **Panda Social Hub** | `social`    | FREE  |  ~20  | Inbox Unificado + Auto-reply por rede |
| **Panda Pages**      | `pages`     | FREE  |   5   | Builder drag-and-drop de páginas      |

## B.4. Validação (Panda Defend)

```text
1. PARSE panda.mcp.json → JSON válido? Campos obrigatórios?
2. VALIDAÇÃO DE TOOLS → Cada tool tem name + description + parameters?
3. VALIDAÇÃO DE PERMISSÕES → Permissões declaradas correspondem ao código?
4. SANDBOX TEST → Executa em ambiente isolado 30s, testa cada tool

RESULTADO: ✅ Aprovado (publica) | ❌ Rejeitado (feedback)
Mínimo para publicar: 70/100
```

### Tools Reservadas

| Tool Name  | Razão                             |
| ---------- | --------------------------------- |
| `auth_*`   | Reservado para autenticação Panda |
| `wallet_*` | Reservado para transações PC      |
| `admin_*`  | Reservado para Founder            |
| `system_*` | Reservado para core do SDK        |

---

# PARTE C: MCP Central + Dual-Mode Architecture (Roadmap)

> **Status:** 🔴 Planejado | **Prioridade:** Alta | **ETA:** Q2 2026

## C.1. Visão Geral

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                 📡 MCP REGISTRY CENTRAL (Firebase)                       │
│  Firestore: /mcp_registry/{pluginId}                                    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  - manifests[]     (todos os plugins registrados)               │    │
│  │  - capabilities[]  (tools/resources/prompts de cada plugin)     │    │
│  │  - versions[]      (versionamento de schemas)                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                           ↓ sync                                         │
│            Medusa Store / Plugins consultam aqui                         │
└─────────────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────────────┐             ┌───────────────────────┐
│   🌐 WEB MCP SERVER   │             │   🦀 RUST MCP SERVER  │
│   (GAS + Firebase)    │             │   (panda-agent)       │
├───────────────────────┤             ├───────────────────────┤
│ Transport: HTTPS      │             │ Transport: stdio      │
│ Auth: Firebase Auth   │             │ Auth: Ed25519 local   │
│ Cache: IndexedDB      │             │ Cache: SQLite         │
│ Offline: SW + IDB     │             │ Offline: 100% local   │
└───────────────────────┘             └───────────────────────┘
```

## C.2. Primitivos MCP Suportados

| Primitivo     | Web (GAS)    | Rust Agent          | Descrição               |
| ------------- | ------------ | ------------------- | ----------------------- |
| **Tools**     | ✅ Planejado | ✅ Implementado (4) | Funções executáveis     |
| **Resources** | 🔴 A fazer   | 🔴 A fazer          | Dados/arquivos expostos |
| **Prompts**   | 🔴 A fazer   | 🔴 A fazer          | Templates reusáveis     |

### Tools Atuais (Rust Agent)

| Tool               | Descrição            | Parâmetros                       |
| ------------------ | -------------------- | -------------------------------- |
| `gpu_info`         | Info GPU NVIDIA      | -                                |
| `sign_message`     | Assinar com Ed25519  | `message`                        |
| `verify_signature` | Verificar assinatura | `message`, `signature`, `pubkey` |
| `get_public_key`   | Obter chave pública  | -                                |

## C.3. Estratégia Offline-First

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                 📡 CLOUD LAYER (Online)                                  │
│  Firebase Firestore → GAS Backend → Google Drive Sync                   │
└─────────────────────────────────────────────────────────────────────────┘
                            ↓ sync quando online
┌─────────────────────────────────────────────────────────────────────────┐
│                 💾 CACHE LAYER (Offline - PWA)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐                 │
│  │ IndexedDB   │  │ LocalStorage │  │ Service Worker  │                 │
│  │ (MCP Data)  │  │ (Settings)   │  │ (Assets+HTML)   │                 │
│  └─────────────┘  └──────────────┘  └─────────────────┘                 │
│                                                                          │
│  Cache Hierarchy:                                                        │
│  1. IndexedDB: manifests, user data, tentacle states                    │
│  2. LocalStorage: auth tokens, preferences                               │
│  3. SW Cache: pf.sdk.js, components, static assets                      │
└─────────────────────────────────────────────────────────────────────────┘
                            ↓ fallback
┌─────────────────────────────────────────────────────────────────────────┐
│                 🦀 LOCAL LAYER (Rust Desktop)                            │
│  SQLite + MCP Protocol + P2P Sync                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Lógica de Resolução

```javascript
async function getMCPManifest(pluginId) {
  // 1. Tenta IndexedDB (instantâneo)
  let manifest = await idb.get("mcp_manifests", pluginId);
  if (manifest && !isStale(manifest)) return manifest;

  // 2. Se online, busca Firebase e atualiza cache
  if (navigator.onLine) {
    manifest = await firebase.get(`/mcp_registry/${pluginId}`);
    await idb.put("mcp_manifests", manifest);
    return manifest;
  }

  // 3. Se offline, retorna cache mesmo stale
  return manifest || FALLBACK_MANIFEST;
}
```

## C.4. Implementação Pendente

### Fase 1: Firebase Registry (Prioridade Alta)

| Tarefa           | Arquivo   | Descrição                       |
| ---------------- | --------- | ------------------------------- |
| Criar collection | Firestore | `/mcp_registry/{pluginId}`      |
| Schema manifest  | Firestore | tools[], resources[], prompts[] |
| API de consulta  | GAS       | `getMCPManifest(pluginId)`      |

### Fase 2: Rust Resources/Prompts

| Tarefa           | Arquivo | Descrição                    |
| ---------------- | ------- | ---------------------------- |
| `resources/list` | mcp.rs  | Listar resources disponíveis |
| `resources/read` | mcp.rs  | Ler conteúdo de resource     |
| `prompts/list`   | mcp.rs  | Listar prompts templates     |
| `prompts/get`    | mcp.rs  | Obter prompt específico      |

### Fase 3: SDK Abstraction

| Tarefa           | Arquivo   | Descrição                    |
| ---------------- | --------- | ---------------------------- |
| Runtime detector | pf.sdk.js | Detectar Web vs Rust         |
| Unified API      | pf.sdk.js | `Panda.MCP.call(tool, args)` |
| Cache layer      | pf.sdk.js | IndexedDB para Web           |

---

## C.5. Multi-Monitor & Multi-Window (Aprovado)

> **Fonte:** Ponto de Inflexão v3.1 — 2026-02-13 | **Status:** ✅ Aprovado

```text
┌─────────────────────────────────────────────────────────────────────────┐
│             🖥️ MULTI-MONITOR MCP — USE CASES                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MONITOR 1 (Principal)         MONITOR 2 (Auxiliar)                    │
│  ┌─────────────────────┐       ┌─────────────────────┐                 │
│  │  Panda OS (Jam UI)  │◀─────▶│  PDV / Totem        │                 │
│  │  Canvas + Chat      │ Events│  Cliente-facing      │                 │
│  └─────────────────────┘       └─────────────────────┘                 │
│                                                                         │
│  Sincronização via Panda.Events:                                       │
│  ├── BroadcastChannel API (mesmo navegador)                            │
│  ├── Firebase RTDB (cross-device)                                      │
│  └── Document PiP (janelas pop-out)                                    │
│                                                                         │
│  Exemplos:                                                              │
│  ├── PDV: Monitor 1 = operador, Monitor 2 = cliente                   │
│  ├── Vitrine: Monitor 1 = admin, Monitor 2 = display loja             │
│  └── Totem: Standalone kiosk mode (MCP read-only)                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**API de Sync (via Panda.Events):**

```javascript
// Monitor 1 (Backoffice) — emite evento
Panda.Events.emit("pdv:item_added", { product: "Café", price: 5.5 });

// Monitor 2 (Cliente) — recebe e renderiza
Panda.Events.subscribe("pdv:item_added", (event) => {
  updateClientDisplay(event.data);
});
```

> 📖 **Cross-ref:** `Panda.Events` definido em [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) §Events

---

## D. Local MCP Offline Mode (P0)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P0

### D.1 Filosofia Offline-First

O MCP DEVE funcionar mesmo sem conexão à internet:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    MCP OFFLINE FALLBACK CHAIN                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  REQUEST ──► GAS (Cloud) ──► FAIL                                       │
│                               │                                          │
│                               ▼                                          │
│                          RUST AGENT (Local) ──► FAIL                    │
│                                                  │                       │
│                                                  ▼                       │
│                                          INDEXED_DB (Cache)             │
│                                                  │                       │
│                                                  ▼                       │
│                                          GRACEFUL DEGRADATION           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### D.2 Cache de Tools

```javascript
// Cachear resultado de tool para uso offline
Panda.MCP.cacheResult("oracle.usd", result, {
  ttl: 3600, // 1 hora
  staleWhileRevalidate: 86400, // Permite stale por 24h
});

// Verificar se tool está disponível offline
const available = await Panda.MCP.isAvailableOffline("wallet.balance");
// true se tem cache válido ou local implementation
```

### D.3 Modo Degradado

| Funcionalidade   | Online       | Offline      | Fallback                    |
| ---------------- | ------------ | ------------ | --------------------------- |
| `oracle.usd`     | ✅ Real-time | ⚠️ Cached    | Última cotação conhecida    |
| `brain.chat`     | ✅ Cloud AI  | ⚠️ Local     | Ollama local (se instalado) |
| `wallet.balance` | ✅ Real-time | ⚠️ Cached    | Último saldo conhecido      |
| `fs_read`        | ✅ Via Agent | ✅ Via Agent | Funciona 100% local         |

### D.4 Sync on Reconnect

```javascript
// Quando conexão restaurar, sincroniza automaticamente
Panda.MCP.onReconnect(async () => {
  // 1. Flush pending operations
  await Panda.MCP.flushQueue();

  // 2. Invalidate stale caches
  await Panda.MCP.invalidateStaleCache();

  // 3. Refresh critical data
  await Panda.MCP.refresh(["wallet.balance", "oracle.usd"]);
});
```

---

> 📖 **PF_MCP_REFERENCE v2.5** | Consolidado: MCP Tools + Manifest Spec + Central Architecture + Offline Mode + Orchestrator

---

## Changelog

| Versao | Data       | Alteracoes                                                                                                                  |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| 2.5.0  | 2026-03-04 | +§4.1 MCP Tool Discovery (useMCPRegistry, Orchestrator, data flow, 12 módulos/46 tools), B.3 atualizado com 12 módulos FREE |
| 2.0.0  | 2026-02-16 | Part E — BYOL MCP Bridge Compliance adicionada                                                                              |
| 1.0.0  | 2026-02-14 | MCP header padronizado                                                                                                      |
| 1.0.0  | 2026-02-06 | Criacao com 3 Tiers de acesso                                                                                               |

---

# PARTE E: BYOL → MCP Bridge Compliance

> **Status:** 📋 Documentado | **Prioridade:** P2 (Pós-MVP) | **Cross-Ref:** `CONTEXT.md §9.1`, `PF_MEDUSA_REFERENCE.md §10.5.1`

## E.1. O Problema

Módulos BYOL (🟡) usam webview (iframe) para mostrar serviços externos como Instagram, YouTube, Google Analytics. Nesse modo, a **Panda AI não consegue interagir** com os dados — o iframe é opaco.

## E.2. A Solução: API Bridge → MCP Wrapper

```text
┌─────────────────────────────────────────────────────────────────────────┐
│            BYOL → API BRIDGE → MCP WRAPPER ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PANDA AI (Brain)                                                       │
│  └── "Show me my Instagram engagement this week"                        │
│              ↓                                                           │
│  MCP LAYER (panda.mcp.json)                                             │
│  └── tool: "instagram.getInsights" → params: { period: "7d" }           │
│              ↓                                                           │
│  API BRIDGE (GAS Backend)                                                │
│  ├── Resolve OAuth token from Firebase (per-user)                       │
│  ├── Calls Instagram Graph API: GET /me/insights?period=day&since=...  │
│  └── Returns structured JSON to Brain                                   │
│              ↓                                                           │
│  PANDA AI processes, responds, suggests actions                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## E.3. BYOL MCP Manifest Extension

BYOL módulos que suportam API Bridge adicionam um campo `bridge` ao `panda.mcp.json`:

```json
{
  "name": "panda-instagram",
  "version": "1.0.0",
  "description": "Instagram insights and posting via Graph API",
  "tier": "byol",
  "bridge": {
    "provider": "instagram",
    "authType": "oauth2",
    "scopes": [
      "instagram_basic",
      "instagram_content_publish",
      "pages_show_list"
    ],
    "tokenStorage": "firebase",
    "apiBase": "https://graph.instagram.com/v21.0"
  },
  "mcp": {
    "tools": [
      {
        "name": "getInsights",
        "description": "Get engagement insights for the connected Instagram account",
        "parameters": {
          "type": "object",
          "properties": {
            "period": { "type": "string", "enum": ["7d", "30d", "90d"] },
            "metrics": { "type": "array", "items": { "type": "string" } }
          },
          "required": ["period"]
        }
      },
      {
        "name": "postMedia",
        "description": "Publish a photo or reel to Instagram",
        "parameters": {
          "type": "object",
          "properties": {
            "mediaUrl": { "type": "string" },
            "caption": { "type": "string" },
            "mediaType": {
              "type": "string",
              "enum": ["IMAGE", "VIDEO", "CAROUSEL"]
            }
          },
          "required": ["mediaUrl", "caption"]
        }
      }
    ]
  }
}
```

## E.4. MCP Viability Matrix (Per Service)

| Serviço          |   API Pública    | MCP Bridge Viável? | Requer Review? | MCP Tools Potenciais                          |
| ---------------- | :--------------: | :----------------: | :------------: | --------------------------------------------- |
| Instagram        |   ✅ Graph API   |       🟢 Sim       |    ✅ Meta     | `getInsights`, `postMedia`, `getStories`      |
| YouTube          |  ✅ Data API v3  |       🟢 Sim       |   ✅ Google    | `getAnalytics`, `uploadVideo`, `getPlaylists` |
| Google Ads       |    ✅ Ads API    |       🟢 Sim       |   ✅ Google    | `getCampaigns`, `getBudget`, `getMetrics`     |
| Google Analytics |    ✅ GA4 API    |       🟢 Sim       |       ❌       | `getReport`, `getRealtime`, `getAudience`     |
| Meta Business    | ✅ Marketing API |       🟢 Sim       |    ✅ Meta     | `getAdSets`, `getAudiences`, `createCampaign` |
| Hotmart          |   ✅ REST API    |       🟢 Sim       |   ✅ Hotmart   | `getSales`, `getProducts`, `getAffiliates`    |
| TikTok           |    ⚠️ Limited    |     🟡 Parcial     |   ✅ TikTok    | `getAnalytics` (posting limitado)             |
| Twitter/X        |     ⚠️ Pago      |      🟡 Caro       |       ❌       | Viável mas $100+/mês — não escala no MVP      |
| Kiwify           |    ❌ Sem API    |       🔴 Não       |      N/A       | Apenas webhook de vendas (inbound only)       |

> **Regra:** Se o provedor não tem API pública, o módulo fica em **L1 (webview)**. A AI **não pode** interagir. Progresso para L2+ depende exclusivamente do provedor.

## E.5. Fluxo OAuth para BYOL Bridge

```text
PRIMEIRO USO (one-time setup):
  User abre módulo BYOL (ex: Instagram)
    ↓
  Panda mostra: "Connect your Instagram account"
    ↓
  Popup OAuth (Facebook Login for Instagram)
    ↓
  User autoriza → access_token + refresh_token
    ↓
  GAS criptografa + salva em Firebase RTDB:
    /users/{uid}/tokens/instagram = { token, refresh, expires, scopes }
    ↓
  Módulo muda de L1 (webview) para L2 (API Bridge)
    ↓
  Panda AI: "✅ Instagram connected! Ask me anything about your account."

USO CONTÍNUO:
  AI chama MCP tool → GAS resolve token → API call → response → AI analisa
  Se token expired → GAS usa refresh_token automaticamente (zero UX friction)
```

> ⚠️ **Segurança:** Tokens NUNCA ficam no frontend. GAS é o único middleware que acessa Firebase tokens. Frontend recebe apenas resultados processados.

---

# PARTE F: Tentacle API Manifests & Cross-Platform Data Intelligence

> **Status:** 📋 Documentado | **Decisão Founder:** 2026-02-19 | **Cross-Ref:** `CONTEXT.md §9.2`, `PF_BACKEND_REFERENCE.md §4.2`, `SPRINT_ETAPA1_FASE2.md`

## F.1. Filosofia: Conectar, Não Competir

> O Panda **NÃO substitui** ferramentas. Ele **se conecta** às que o usuário já usa.
> Em vez de competir com CRM/Calendar/Estoque saturados, o Panda é o **Funcionário Invisível**.

```text
Tem ferramenta? → Panda conecta via API (tentáculo) e opera
Não tem?        → Panda oferece módulo nativo básico (espinha dorsal)

RESULTADO: Usuário nunca troca nada. Panda se adapta.
```

## F.2. Arquitetura Espinha + Tentáculos

```text
                    🧠 Gemini (Cérebro)
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     📇 CRM        📅 Calendar     📦 Estoque
     (Contatos)    (Eventos)       (Produtos)
          │              │              │
          └──────────────┼──────────────┘
                         │
                   ESPINHA DORSAL
                   (RTDB nativo, auto-preenchido)
                         │
          ┌──────┬───────┼───────┬──────┐
          │      │       │       │      │
        T-01   T-02    T-03   T-06   T-07
        WhApp  Insta    ML    Shopee  iFood
                         │
                   TENTÁCULOS
                   (APIs externas via manifestos JSON)
                         │
                   📊 Dashboard Visual
                   (Canvas multiwindow, desacoplável)
```

### Três camadas:

| Camada             | O que é                                          | Onde vive                         | Quem controla                              |
| ------------------ | ------------------------------------------------ | --------------------------------- | ------------------------------------------ |
| **Espinha Dorsal** | CRM + Calendar + Estoque + Dashboard             | RTDB do Panda (nativo)            | O Panda (sempre presente, auto-preenchido) |
| **Tentáculos**     | WhatsApp, ML, Shopee, iFood, Calendar, Sheets... | APIs externas via manifestos JSON | O Panda conecta                            |
| **WebViews**       | UI emprestada (Google Calendar, Bling, etc.)     | iframe/webview no PFCanvas        | O usuário vê a ferramenta real             |

## F.3. Tentacle Manifest Spec

Cada tentáculo é definido por um `manifest-{name}.json`:

```json
{
  "name": "mercadolivre",
  "version": "1.0",
  "auth": {
    "type": "oauth2",
    "scopes": ["read", "write", "offline_access"],
    "tokenStorage": "firebase",
    "tokenPath": "/users/{uid}/tokens/mercadolivre"
  },
  "api": {
    "base_url": "https://api.mercadolibre.com",
    "rate_limit": "10000/hour"
  },
  "webview": {
    "url": "https://www.mercadolivre.com.br/vendas/",
    "openIn": "canvas_tab"
  },
  "capabilities": {
    "orders": { "read": true, "write": false, "webhook": true },
    "questions": { "read": true, "write": true, "webhook": true },
    "messages": { "read": true, "write": true },
    "products": { "read": true, "write": true }
  },
  "spine_mapping": {
    "orders → estoque": "auto_debit",
    "questions → crm": "auto_capture_lead",
    "orders → calendar": "delivery_schedule"
  },
  "mcp": {
    "tools": [
      {
        "name": "ml.getOrders",
        "description": "Lista pedidos do Mercado Livre",
        "parameters": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": ["pending", "paid", "shipped", "delivered"]
            },
            "limit": { "type": "number", "default": 50 }
          }
        }
      },
      {
        "name": "ml.answerQuestion",
        "description": "Responde uma pergunta de produto no ML",
        "parameters": {
          "type": "object",
          "properties": {
            "question_id": { "type": "string" },
            "answer": { "type": "string" }
          },
          "required": ["question_id", "answer"]
        }
      }
    ]
  }
}
```

### Campos do Manifest

| Campo           | Tipo   | Obrigatório | Descrição                                  |
| --------------- | ------ | :---------: | ------------------------------------------ |
| `name`          | string |     ✅      | ID único do tentáculo                      |
| `auth`          | object |     ✅      | Tipo de auth + storage de tokens           |
| `api.base_url`  | string |     ✅      | URL base da API externa                    |
| `webview.url`   | string |     ❌      | URL para abrir como WebView no Canvas      |
| `capabilities`  | object |     ✅      | CRUD + webhook por recurso                 |
| `spine_mapping` | object |     ✅      | **Como dados fluem para a espinha dorsal** |
| `mcp.tools`     | array  |     ✅      | MCP tools expostas ao Brain                |

> [!IMPORTANT]
> O campo `spine_mapping` é o **diferencial**. Ele declara como dados do tentáculo alimentam o CRM, Calendar e Estoque automaticamente. Sem spine_mapping, o tentáculo é uma integração morta — dados entram e saem sem inteligência.

## F.4. 💎 Joia da Coroa: Cross-Platform Data Intelligence

> **Decisão Founder 2026-02-19:** As 3 áreas de investimento máximo de energia.

Em vez de desenhar UIs para iFood ou ML, foque em:

### 1. MCP Brain (Gemini) — Raciocínio Cross-Manifesto

O Gemini recebe contexto de **todos os manifestos simultaneamente**:

```text
Brain Context (vindo de 3 tentáculos ao mesmo tempo):
  ML: 15 pedidos pendentes, 3 perguntas sem resposta
  WhatsApp: 8 conversas ativas, 2 follow-ups atrasados
  Calendar: 3 eventos amanhã, 1 conflito de horário

Gemini DECIDE:
  1. Responder perguntas ML urgentes primeiro (têm SLA de 24h)
  2. Enviar follow-up WhatsApp atrasado
  3. Alertar sobre conflito no Calendar
```

**Implementação:** O Brain recebe `spine_context` como system prompt:

```javascript
// brain.gs - antes de chamar Gemini
function buildSpineContext(userId) {
  const crm = readRTDB(`/pf_cells/${userId}/crm/summary`);
  const calendar = readRTDB(`/pf_cells/${userId}/calendar/today`);
  const estoque = readRTDB(`/pf_cells/${userId}/estoque/alerts`);
  const tentacles = readRTDB(`/pf_cells/${userId}/tentacles/status`);

  return `
SPINE STATUS:
  CRM: ${crm.total_contacts} contatos, ${crm.hot_leads} leads quentes
  Calendar: ${calendar.events_today} eventos hoje, próximo: ${calendar.next_event}
  Estoque: ${estoque.low_stock.length} itens baixos, ${estoque.critical.length} críticos
  Tentacles: ${tentacles.active.join(", ")} ativos
  `;
}
```

### 2. MCP Billing — Economia de Tokens

Cada ação do tentáculo consome PC (Panda Coins):

| Ação                                     | Custo PC | Justificativa                      |
| ---------------------------------------- | :------: | ---------------------------------- |
| Leitura simples (orders, contacts)       |   0.5    | Dado estático                      |
| Escrita (responder pergunta, enviar msg) |   1.0    | Ação que modifica estado           |
| Cross-platform reasoning                 |   2.0    | Gemini analisa múltiplos contextos |
| Schedule/follow-up automático            |   0.5    | Cron sem Gemini                    |

> **Cross-ref:** `PF_ECONOMY_REFERENCE.md` para modelo completo de billing

### 3. Cross-Platform Data — O Diferencial Real

```text
ISTO É O QUE O USUÁRIO PAGA:

  Cliente compra no Shopee
    → Estoque debita automaticamente (spine)
    → CRM registra comprador com tags (spine)
    → Calendar agenda entrega (spine)
    → WhatsApp envia rastreio proativamente (tentáculo)
    → Dashboard mostra venda em tempo real (visual)

  TUDO AUTOMÁTICO. O usuário não fez NADA.

  CRM concorrente: usuário precisaria abrir 5 apps separados
  Panda: tudo flui pela espinha dorsal sem intervenção
```

**O produto não é CRM. Não é calendar. Não é estoque.**
**O produto é a CONEXÃO entre eles — automática, invisível, inteligente.**

## F.5. Priorização por Ondas

|  Onda  | Tentáculos                                                                 | Justificativa                                    |
| :----: | -------------------------------------------------------------------------- | ------------------------------------------------ |
| **P0** | WhatsApp (Evolution), Instagram (Meta), ML, Google Calendar, Google Sheets | Canais dominantes no BR, APIs completas e grátis |
| **P1** | Shopee, iFood, Bling, Tiny, Notion/Trello                                  | Negócios locais, ERPs populares BR               |
| **P2** | Shopify, Amazon, eBay, AliExpress                                          | Expansão internacional                           |

### Viability Matrix Expandida

| Tentáculo            | API              | Auth                 | Rate Limit   | Custo              | Wave |
| -------------------- | ---------------- | -------------------- | ------------ | ------------------ | :--: |
| WhatsApp (Evolution) | REST + WebSocket | API Key              | sem limite   | grátis (self-host) |  P0  |
| Instagram DMs        | Meta Graph API   | OAuth 2.0            | 200/hora     | grátis             |  P0  |
| Mercado Livre        | REST API v2      | OAuth 2.0            | 10k/hora     | grátis             |  P0  |
| Google Calendar      | REST API v3      | OAuth 2.0            | 1M/dia       | grátis             |  P0  |
| Google Sheets        | REST API v4      | OAuth 2.0            | 300/min      | grátis             |  P0  |
| Shopee               | REST API v2      | OAuth 2.0 + HMAC-SHA | 10k/dia      | grátis             |  P1  |
| iFood                | Merchant API v2  | OAuth 2.0            | varia        | grátis (partner)   |  P1  |
| Bling                | REST API v3      | OAuth 2.0            | 3/seg        | grátis             |  P1  |
| Tiny                 | REST API         | Token fixo           | desconhecido | grátis             |  P1  |
| Shopify              | REST Admin API   | OAuth 2.0            | 40/seg       | depende do plano   |  P2  |
| Amazon               | SP-API           | OAuth 2.0 + STS      | varia        | grátis (seller)    |  P2  |

> **Pesquisa completa:** artifact `api_ecosystem_map.md` (brain)

## F.6. WebView + MCP Bridge (sem UI proprietária)

```text
Abordagem: NÃO criar UI própria para ferramentas externas
  → Google Calendar abre como WebView no Canvas
  → Bling abre como WebView no Canvas
  → ML Seller Hub abre como WebView no Canvas
  MCP lê/escreve dados por trás — zero dev de UI custom

UI própria do Panda (criar):
  → Dashboard resumo (KPIs, alertas, gráficos)
  → Chat (já existe)
  → Monitor/Heartbeat (já existe)
  → Config/Onboarding (já existe)
```

## F.7. Templates por Nicho (produto Kiwify/Hotmart)

| Template           | Tentáculos                               | Espinha dorsal                            |
| ------------------ | ---------------------------------------- | ----------------------------------------- |
| 🍕 **Restaurante** | WhatsApp + iFood + Sheets                | Pedidos, cardápio, estoque, avisos        |
| 🛒 **E-commerce**  | WhatsApp + ML + Shopee + Bling           | Perguntas, rastreio, estoque, reclamações |
| 🏥 **Clínica**     | WhatsApp + Calendar + Sheets             | Agenda, confirmação, lembrete, follow-up  |
| 🏠 **Imobiliária** | WhatsApp + Instagram + Calendar + Sheets | Leads, tour, follow-up, qualificação      |
| 🔧 **Serviços**    | WhatsApp + Calendar + Sheets             | Orçamento, agenda, cobrança               |

> **Cada template = agente pronto.** Afiliado vende, cliente conecta, Panda opera.
