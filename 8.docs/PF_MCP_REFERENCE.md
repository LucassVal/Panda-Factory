> [!IMPORTANT]
> **🐼 ANTES DE QUALQUER AÇÃO:** Leia .agent/CONTEXT.md — contém estrutura, regras, nomenclatura e Panda Council.
> **Ativação:** /panda-council | **SSoT:** README_PANDA_OFICIAL.md | **Salve o que fez em Council Report.**
---
tool_context: panda/mcp
description: Model Context Protocol - Rust Agent Tools, 3 Tiers de acesso
version: 1.0.0
updated: 2026-02-06
---

# 🦀 Panda MCP Tools - Referência

> **Versão:** 1.0.0 | **Runtime:** Rust Agent (Tauri) | **Protocolo:** MCP

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

| Categoria | Dados                         |
| --------- | ----------------------------- |
| Canvas    | Shapes, zoom, tool ativo      |
| Panels    | Quais estão abertos           |
| Selection | Itens selecionados            |
| User      | Tema, idioma, modo (dev/user) |
| Plugins   | Instalados e ativos           |

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

- Dev do plugin: 52%
- Panda Educação: 25%
- Panda Ops: 15%
- Founder: 5%
- Gateway: 3%

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

## B.3. Plugins Oficiais

| Plugin       | MCP Name         | Preço User | Descrição            |
| ------------ | ---------------- | :--------: | -------------------- |
| **CRM**      | `panda-crm`      |   99 PC    | Gestão de leads      |
| **Agenda**   | `panda-agenda`   |   49 PC    | Calendário integrado |
| **WhatsApp** | `panda-whatsapp` |   149 PC   | Automação WhatsApp   |

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

## D. Local MCP Offline Mode (P1)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P1

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

> 📖 **PF_MCP_REFERENCE v2.2** | Consolidado: MCP Tools + Manifest Spec + Central Architecture + Offline Mode
