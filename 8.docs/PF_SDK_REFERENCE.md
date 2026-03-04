---
tool_context: panda/sdk
description: Panda SDK - Event Bus, Módulos, Tentáculos, i18n, Hooks, DRM
version: 1.8.0
updated: 2026-03-04
ssot: CONTEXT.md §5 (Sistema Montesquieu)
cross_ref: [PF_MASTER_ARCHITECTURE.md, PF_FILE_REGISTRY.md, PF_GOOGLE_SUITE.md]
---

# 🐼 Panda SDK - Referência da Biblioteca

> **Versão:** 1.7.0 | **Status:** Firebase Real (Sprint E1) | **Atualizado:** 2026-03-02
> **Arquivo:** `3.sdk/pf.sdk.js`

---

## 📋 Índice

1. [Tech Stack](#tech-stack)
2. [Instalação](#instalação)
3. [**🔄 SDK Bidirecional (Hooks)**](#-sdk-bidirecional-hooks)
4. [**⚠️ REGRAS OBRIGATÓRIAS**](#️-regras-obrigatórias-leia-antes-de-tudo)
5. [Módulos Públicos](#módulos-públicos)
6. [Tentacle Architecture](#tentacle-architecture)
7. [Event Bus](#event-bus)
8. [Classificação de Segurança](#classificação-de-segurança)
9. [**📱 Social Media Hub**](#-social-media-hub)
10. [**🧩 Plugin Development**](#-plugin-development)
11. [Changelog](#changelog)

---

## Tech Stack

> 🔗 **Consolidado de:** PF_TECHS_SDK.md

### Arquitetura de Dependências

```text
┌─────────────────────────────────────────────────────────────────┐
│                      🔒 CORE (Imutável)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Firebase    │  │ Google Apps │  │ Ed25519     │              │
│  │ Auth/DB     │  │ Script (GAS)│  │ Assinatura  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                      📦 SDK (Padrão + Extensível)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ React       │  │ TLDraw      │  │ Yjs         │              │
│  │ (UI Base)   │  │ (Canvas)    │  │ (Collab)    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                      🔌 Add-ons (Usuário Escolhe)                │
│  AI: Gemini | OpenAI | Claude | Ollama                          │
│  💰 PAGAMENTOS LOJA: APENAS PANDA COIN (PC)                      │
└─────────────────────────────────────────────────────────────────┘
```

### Tecnologias por Prioridade

| Prioridade | Categoria       | Techs                        |
| ---------- | --------------- | ---------------------------- |
| **P0**     | Core (imutável) | Firebase, GAS, Ed25519       |
| **P1**     | SDK Base        | React 18, TLDraw, Yjs, Vite  |
| **P2**     | Recomendado     | TypeScript, Zod, React Query |
| **P3**     | Add-ons         | Gemini/OpenAI/Claude, S3/R2  |

### Google APIs - Custos

| API               | Quem Paga | Limite/Custo   |
| ----------------- | --------- | -------------- |
| **Firebase Auth** | Grátis    | ∞              |
| **Firebase RTDB** | Panda     | 1GB + 10GB/mês |
| **Gemini Flash**  | User (PC) | ~$0.0001/req   |
| **Cloud Vision**  | User (PC) | $1.50/1k units |
| **Drive API**     | Grátis    | ∞              |

> ⚠️ **NUNCA substitua o Core.** Conectores adicionais são para EXTENSÕES.

---

## Instalação

```html
<!-- No HTML principal -->
<script src="3.sdk/pf.sdk.js"></script>

<script>
  // SDK disponível globalmente
  console.log(Panda.version()); // "0.5.1"
</script>
```

---

## 🔄 SDK Bidirecional (Hooks)

> **Filosofia:** O SDK conecta o Panda Factory ao mundo externo em **duas direções**.

### Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        SDK BIDIRECIONAL                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📥 INBOUND HOOKS                 📤 OUTBOUND HOOKS                     │
│  (External → Panda)               (Panda → External)                    │
│                                                                          │
│  ┌─────────────┐                  ┌─────────────┐                       │
│  │ Kiwify      │───webhook──▶     ◀──publish───│ PlayStore  │          │
│  │ Hotmart     │                                │ Apple Store│          │
│  │ Gumroad     │                                │ Steam      │          │
│  └─────────────┘                  └─────────────┘                       │
│          │                                │                              │
│          ▼                                ▼                              │
│  ┌───────────────────────────────────────────────────────┐              │
│  │               PANDA SDK (pf.sdk.js)                   │              │
│  │               Events.emit() / Events.on()             │              │
│  └───────────────────────────────────────────────────────┘              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 📥 Inbound Hooks (Marketplace → Panda)

Recebe eventos de vendas de marketplaces externos via GAS webhooks.

| Marketplace | Evento Recebido     | Handler                           |
| ----------- | ------------------- | --------------------------------- |
| **Kiwify**  | `purchase.approved` | `Panda.Hooks.onKiwifyPurchase()`  |
| **Hotmart** | `PURCHASE.APPROVED` | `Panda.Hooks.onHotmartPurchase()` |
| **Gumroad** | `sale.completed`    | `Panda.Hooks.onGumroadSale()`     |

```javascript
// GAS Webhook Handler (PF_Core_Webhooks.gs)
function handleKiwifyWebhook(payload) {
  const { email, product_id, amount } = payload;

  // Credita PC no usuário
  WalletService.credit(email, amount * 100, "Kiwify: " + product_id);

  // Emite evento para UI
  broadcastEvent("purchase:kiwify", { email, product_id });
}
```

### 📤 Outbound Hooks (Panda → App Stores)

Publica plugins/apps diretamente para lojas externas.

| Destino         | Método SDK                     | Status     |
| --------------- | ------------------------------ | ---------- |
| **PlayStore**   | `Panda.Publish.toPlayStore()`  | 🔮 Roadmap |
| **Apple Store** | `Panda.Publish.toAppleStore()` | 🔮 Roadmap |
| **Steam**       | `Panda.Publish.toSteam()`      | 🔮 Roadmap |

```javascript
// Futuro: Publicar app para múltiplas lojas
await Panda.Publish.toMultiple({
  targets: ["playstore", "steam"],
  bundle: "./dist/my-app.zip",
  metadata: { name: "Meu App", version: "1.0.0" },
});
```

> **Dev Freedom:** "Crie no Panda, distribua pra qualquer lugar."

---

## ⚠️ REGRAS OBRIGATÓRIAS (Leia Antes de Tudo)

> **Estas regras são invioláveis. Plugins que não seguirem serão rejeitados.**

### 1. MCP OBRIGATÓRIO

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🔌 TODO PLUGIN DEVE TER panda.mcp.json                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ✅ OBRIGATÓRIO:                                                        │
│  ├── Arquivo panda.mcp.json na raiz do plugin                           │
│  ├── Declarar todas tools expostas                                      │
│  ├── Descrições claras para IA entender                                 │
│  └── Passar validação Panda Defend (Score ≥70)                          │
│                                                                          │
│  ❌ SEM MCP = NÃO PUBLICA NA STORE                                      │
│                                                                          │
│  Ver: PF_MCP_REFERENCE.md (PARTE B) para especificação completa          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Por que MCP é obrigatório:**

- IA entende seu plugin automaticamente (zero documentação)
- Integração "plug and play" entre plugins
- **É o diferencial do Panda Factory**

### 2. PROTEÇÃO DE RECEITA (Anti-Bypass)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🛡️ REGRAS ANTI-BYPASS (Hardcoded - Inviolável)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔴 PROIBIDO (Rejeição Imediata):                                       │
│                                                                          │
│  1. IA EXTERNA NÃO AUTORIZADA                                           │
│     ├── Chamadas diretas a OpenAI, Anthropic, etc                       │
│     ├── Bypass do Panda.Brain                                           │
│     └── Use: Panda.Brain.chat() que roteia via billing                  │
│                                                                          │
│  2. BYPASS DE BILLING                                                   │
│     ├── Chamar APIs pagas sem debitar PC                                │
│     ├── Hardcode de API keys no código                                  │
│     └── Use: Panda.Wallet.charge() para todas transações                │
│                                                                          │
│  3. COLETA NÃO AUTORIZADA                                               │
│     ├── Tracking de usuários sem consentimento                          │
│     ├── Envio de dados para servidores externos                         │
│     └── Use: Panda.Storage apenas                                       │
│                                                                          │
│  4. TOOLS RESERVADAS                                                    │
│     ├── auth_*, wallet_*, admin_*, system_*                             │
│     └── Estes nomes são PROIBIDOS para plugins                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Detecção Automática (Panda Defend):**

| Violação                | Detecção          | Consequência        |
| ----------------------- | ----------------- | ------------------- |
| IA externa direta       | Static Analysis   | Score = 0, Rejeição |
| API key hardcoded       | Regex scan        | Score = 0, Rejeição |
| fetch() para APIs pagas | Behavior monitor  | Auto-suspend        |
| Sem panda.mcp.json      | Pre-publish check | Não publica         |

### 3. CAMINHO CORRETO

```javascript
// ❌ ERRADO - Bypass (será bloqueado)
const response = await fetch("https://api.openai.com/v1/chat", {
  headers: { Authorization: "Bearer sk-..." },
});

// ✅ CORRETO - Via Panda (billing automático)
const response = await Panda.Brain.chat("Olá!", {
  model: "gemini-3-flash-preview", // Free tier
});

// ✅ CORRETO - BYOL autorizado (usa chave do USUÁRIO, não do plugin)
const response = await Panda.Brain.chat("Olá!", {
  provider: "openai",
  byol: true, // User fornece a key nas configs
});
```

> **BYOL é permitido**, mas a KEY vem do USUÁRIO, nunca hardcoded no plugin.

---

## Módulos Públicos

### 🔐 Panda.Auth

Gerenciamento de identidade e sessão.

| Método                   | Retorno                                            | Descrição                                                   |
| ------------------------ | -------------------------------------------------- | ----------------------------------------------------------- |
| `login(email, password)` | `Promise<User>`                                    | Autentica usuário. Use `password='erro'` para testar falha. |
| `logout()`               | `Promise<boolean>`                                 | Encerra sessão                                              |
| `getUser()`              | `User \| null`                                     | Retorna usuário atual (síncrono)                            |
| `isAdmin()`              | `boolean`                                          | Verifica se é admin                                         |
| `isLoggedIn()`           | `boolean`                                          | Verifica se está logado                                     |
| `signCommand(payload)`   | `Promise<{payload, signature, timestamp, signer}>` | 🔐 Assina comando com Ed25519 (Founder only)                |
| `isFounder()`            | `boolean`                                          | Verifica se é o Founder                                     |
| `ROLES`                  | `{FOUNDER: 1, DEV: 2, USER: 3}`                    | Constantes de nível de acesso (frozen)                      |
| `getRole()`              | `number`                                           | Retorna nível atual (1=Founder, 2=Dev, 3=User)              |
| `canAccess(minRole)`     | `boolean`                                          | Verifica se usuário tem acesso ao nível mínimo              |

```javascript
// Exemplo
const user = await Panda.Auth.login("admin@test.com", "123");
console.log(user.role); // 'ADMIN'
```

---

### 💾 Panda.Data

CRUD para dados estruturados (Sheets/JSON).

| Método                      | Retorno            | Descrição         |
| --------------------------- | ------------------ | ----------------- |
| `get(collection, id)`       | `Promise<Item>`    | Busca item por ID |
| `list(collection, filter?)` | `Promise<Item[]>`  | Lista itens       |
| `save(collection, data)`    | `Promise<Item>`    | Salva novo item   |
| `delete(collection, id)`    | `Promise<boolean>` | Remove item       |

```javascript
// Exemplo
const clients = await Panda.Data.list("clients");
await Panda.Data.save("clients", { name: "Nova Empresa" });
```

---

### 📂 Panda.Storage

Upload/Download de arquivos binários (Drive/FS).

| Método                      | Retorno                | Descrição            |
| --------------------------- | ---------------------- | -------------------- |
| `upload(file, onProgress?)` | `Promise<{url, size}>` | Upload com progresso |
| `download(url)`             | `Promise<Blob>`        | Download de arquivo  |
| `delete(url)`               | `Promise<boolean>`     | Remove arquivo       |

```javascript
// Exemplo com progresso
await Panda.Storage.upload(file, (percent) => {
  console.log(`${percent}% concluído`);
});
```

---

### 💰 Panda.Wallet

Economia e saldo de tokens. **⚠️ Read-Only para segurança.**

| Método         | Retorno                      | Descrição             |
| -------------- | ---------------------------- | --------------------- |
| `getBalance()` | `Promise<{coins, currency}>` | Retorna saldo atual   |
| `getHistory()` | `Promise<Transaction[]>`     | Últimas 50 transações |

> ⚠️ `charge()` e `credit()` são **INTERNOS**. O SDK cobra automaticamente via `Brain.chat()` e `GPU.process()`.

```javascript
const { coins } = await Panda.Wallet.getBalance();
console.log(`Saldo: ${coins} PC`);
```

---

### 💸 Panda.Economy

Transferências e transações de PC. **Usa idempotency para segurança.**

| Método                           | Retorno                            | Descrição                                 |
| -------------------------------- | ---------------------------------- | ----------------------------------------- |
| `transfer(to, amount, options?)` | `Promise<{success, txId, cached}>` | Transfere PC para outro usuário           |
| `getEvents(filter?)`             | `Promise<Event[]>`                 | Lista eventos do usuário (Event Sourcing) |

**Options do transfer():**

| Opção            | Tipo     | Descrição                                                       |
| ---------------- | -------- | --------------------------------------------------------------- |
| `idempotencyKey` | `string` | Chave única para prevenir double-spend (auto-gerada se omitida) |
| `memo`           | `string` | Nota opcional para o destinatário                               |

```javascript
// Transfer com idempotency (recomendado)
const result = await Panda.Economy.transfer("user_xyz", 100, {
  idempotencyKey: "purchase_order_1234", // Mesma key = mesma transação
  memo: "Pagamento plugin XYZ",
});

// Se retry, mesma idempotencyKey retorna resultado cached
console.log(result.cached); // true se já processado
```

> **Cross-reference:** Ver [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) §9.2 para detalhes de Idempotency e Event Sourcing.

---

### 🧠 Panda.Brain

Inteligência Artificial (Gemini/Claude/GPT + Local LLMs). **Tentacle com 3 children.**

#### Brain.Gemini (Google AI + 6 GEMs)

| Método                    | Retorno                        | Descrição           |
| ------------------------- | ------------------------------ | ------------------- |
| `setApiKey(key)`          | `void`                         | Configura API key   |
| `hasApiKey()`             | `boolean`                      | Verifica config     |
| `chat(message, options?)` | `Promise<{text, tokens, gem}>` | Chat com IA         |
| `analyze(data, question)` | `Promise<{text, tokens}>`      | Analyst GEM 📊      |
| `code(task, language)`    | `Promise<{text, tokens}>`      | Coder GEM 💻        |
| `write(topic, format)`    | `Promise<{text, tokens}>`      | Writer GEM ✍️       |
| `design(concept)`         | `Promise<{text, tokens}>`      | Designer GEM 🎨     |
| `plan(objective)`         | `Promise<{text, tokens}>`      | Planner GEM 📋      |
| `research(topic)`         | `Promise<{text, tokens}>`      | Researcher GEM 🔬   |
| `generateImage(prompt)`   | `Promise<{image, success}>`    | Geração de imagem   |
| `getGems()`               | `GEM[]`                        | Lista 6 GEMs        |
| `getModels()`             | `{flash, pro, thinking}`       | Modelos disponíveis |

```javascript
// Usar GEM específica
const { text } = await Panda.Brain.Gemini.code(
  "Button component React",
  "typescript",
);

// Chat genérico
const { text } = await Panda.Brain.Gemini.chat("Olá", {
  gem: "writer",
  temperature: 0.9,
});
```

#### Brain.GPU (Detection & Acceleration)

| Método                    | Retorno                        | Descrição                  |
| ------------------------- | ------------------------------ | -------------------------- |
| `detect()`                | `Promise<{webgl, webgpu,...}>` | Detecta capabilities       |
| `getRecommendedBackend()` | `Promise<{backend, perf}>`     | Backend recomendado p/ ML  |
| `benchmark()`             | `Promise<{capabilities, ops}>` | Benchmark GPU              |
| `canRunModel(size)`       | `Promise<{canRun, reason}>`    | Verifica se suporta modelo |
| `getSummary()`            | `Promise<{gpu, vendor, apis}>` | Resumo do GPU              |

```javascript
// Verificar GPU
const caps = await Panda.Brain.GPU.detect();
console.log(caps); // { webgl: true, webgpu: true, renderer: "NVIDIA..." }

// Verificar se pode rodar modelo
const { canRun } = await Panda.Brain.GPU.canRunModel("large"); // 4GB+
```

#### Brain.LocalLLM (Ollama / LM Studio)

| Método                    | Retorno                       | Descrição                 |
| ------------------------- | ----------------------------- | ------------------------- |
| `detect()`                | `Promise<backends[]>`         | Detecta backends locais   |
| `connect(backend?)`       | `Promise<{success, models}>`  | Conecta (auto ou manual)  |
| `chat(message, options?)` | `Promise<{response, tokens}>` | Chat local (CUSTO: 0 PC)  |
| `embed(text)`             | `Promise<{embedding, dims}>`  | Embeddings locais         |
| `listModels()`            | `Promise<models[]>`           | Lista modelos disponíveis |
| `pullModel(name)`         | `Promise<{success}>`          | Pull modelo (Ollama)      |
| `getRecommendedModels()`  | `Model[]`                     | Modelos sugeridos         |
| `getStatus()`             | `{loaded, model, backend}`    | Status atual              |
| `configure(opts)`         | `Object`                      | Config URLs               |

```javascript
// Auto-detect e conectar
const { models } = await Panda.Brain.LocalLLM.connect();

// Chat grátis!
const { response } = await Panda.Brain.LocalLLM.chat("Olá", {
  model: "llama3.2:3b",
});

// Pull novo modelo
await Panda.Brain.LocalLLM.pullModel("codellama:7b");
```

> 🆓 **CUSTO ZERO:** LocalLLM roda 100% local, sem cobrar PC.

---

### ⚡ Panda.GPU

Processamento local via Rust Agent.

| Método                  | Retorno                     | Descrição               |
| ----------------------- | --------------------------- | ----------------------- |
| `isAvailable()`         | `Promise<boolean>`          | Verifica GPU disponível |
| `process(model, input)` | `Promise<{result, device}>` | Processa com GPU local  |

---

### 🦀 Panda.Bridge

Comunicação direta com Rust Agent (MCP Tools).

| Método                  | Retorno                    | Descrição               |
| ----------------------- | -------------------------- | ----------------------- |
| `execute(tool, params)` | `Promise<{success, data}>` | Executa tool MCP        |
| `isConnected()`         | `boolean`                  | Status do Agent         |
| `_mockConnect(bool)`    | `void`                     | _[Mock]_ Simula conexão |

**Tools disponíveis:** `fs_read`, `fs_write`, `gpu_check`, `screen_capture`, `notify`

```javascript
Panda.Bridge._mockConnect(true); // Simula Agent online
const result = await Panda.Bridge.execute("gpu_check");
```

> ⚠️ **Modo Web-First (Sem Rust Agent):**
> A maioria dos módulos SDK funciona 100% no browser via GAS/Firebase:
>
> | Módulo              | Web-Only   | Requer Rust |
> | ------------------- | ---------- | ----------- |
> | Auth, Data, Storage | ✅ 100%    | -           |
> | Brain.Gemini        | ✅ Via GAS | -           |
> | Wallet, UI, Events  | ✅ 100%    | -           |
> | Bridge (MCP)        | ⚠️ Parcial | ✅ Full     |
> | GPU, LocalLLM       | ❌         | ✅          |
> | Polyglot            | ❌         | ✅          |
>
> Ver: [PF_MASTER §1.4 Web-First](PF_MASTER_ARCHITECTURE.md#14-arquitetura-web-first-zero-install)

### 🎨 Panda.UI

Helpers de interface padronizados.

| Método                         | Retorno                | Descrição                |
| ------------------------------ | ---------------------- | ------------------------ |
| `toast(msg, type?, duration?)` | `void`                 | Exibe notificação        |
| `modal(options)`               | `Promise<{confirmed}>` | Modal com Promise        |
| `loading(show, msg?)`          | `void`                 | Indicador global         |
| `popout(toolId, options?)`     | `Promise<Window>`      | 🪟 Abre janela pop-out   |
| `getPopouts()`                 | `Map<string, Window>`  | Lista pop-outs ativos    |
| `closePopout(toolId)`          | `void`                 | Fecha pop-out específico |

**Tipos de toast:** `'info'`, `'success'`, `'error'`, `'warning'`

**Tools para popout:** `'console'`, `'mcp'`, `'api'`, `'extensions'`, `'ai'`, `'pat'`, `'constitution'`, `'editor'`, `'database'`, `'rig'`

```javascript
// Toast
Panda.UI.toast("Salvo com sucesso!", "success");

// Modal
const result = await Panda.UI.modal({
  title: "Confirmar",
  message: "Deletar item?",
});
if (result.confirmed) {
  /* ... */
}

// Pop-out (multi-window)
const win = await Panda.UI.popout("console", { width: 600, height: 400 });

// Listar popouts ativos
const popouts = Panda.UI.getPopouts();
console.log([...popouts.keys()]); // ['console', 'mcp']

// Fechar popout
Panda.UI.closePopout("console");
```

> ⚠️ **Contrato Modal:** A UI deve emitir `Panda.emit('ui:modal:response', { confirmed: true/false })` ao fechar o modal.

> 🪟 **Pop-out:** Requer navegador com suporte a Document Picture-in-Picture API (Chrome/Edge 116+). Fallback para `window.open()`.

---

### 🎨 Panda.Canvas

**TLDraw Canvas Wrapper.** Superfície de desenho principal do Panda Factory.

| Método              | Retorno                    | Descrição                             |
| ------------------- | -------------------------- | ------------------------------------- |
| `getEditor()`       | `Object\|null`             | Retorna instância TLDraw ativa        |
| `setEditor(editor)` | `void`                     | Define instância (chamado pelo React) |
| `exportAs(format?)` | `Promise<{success, data}>` | Exporta canvas (png/svg/json)         |
| `isReady()`         | `boolean`                  | Verifica se editor está montado       |

```javascript
// Obter editor
const editor = Panda.Canvas.getEditor();
if (Panda.Canvas.isReady()) {
  const { data } = await Panda.Canvas.exportAs("svg");
}
```

> 🖌️ **Dependência:** TLDraw v2 (Apache-2.0). Renderiza no boot via `@panda/draw-tools`.

---

### 🪟 Panda.Dock

**FlexLayout + Dockbar Wrapper.** Gerencia painéis da interface.

| Método                 | Retorno  | Descrição                                  |
| ---------------------- | -------- | ------------------------------------------ |
| `register(id, config)` | `void`   | Registra painel `{title, icon, component}` |
| `open(id)`             | `void`   | Abre painel (emite `dock:opened`)          |
| `close(id)`            | `void`   | Fecha painel (emite `dock:closed`)         |
| `getPanels()`          | `Object` | Retorna todos os painéis registrados       |

```javascript
// Registrar e abrir painel
Panda.Dock.register("mcp-tools", {
  title: "MCP Tools",
  icon: "🔧",
  component: "McpPanel",
});
Panda.Dock.open("mcp-tools");

// Listar painéis
const panels = Panda.Dock.getPanels();
```

> 📐 **Eventos:** `dock:registered`, `dock:opened`, `dock:closed`

---

### 🤝 Panda.Collab

**Yjs CRDT Wrapper.** Colaboração multi-usuário em tempo real.

| Método            | Retorno                             | Descrição                     |
| ----------------- | ----------------------------------- | ----------------------------- |
| `connect(roomId)` | `Promise<{success, roomId, peers}>` | Conecta à sala de colaboração |
| `disconnect()`    | `Promise<void>`                     | Desconecta da sala            |
| `isConnected()`   | `boolean`                           | Verifica status de conexão    |

```javascript
// Conectar a uma sala
const { peers } = await Panda.Collab.connect("projeto-alpha");
console.log(`Colaborando com ${peers} peers`);

// Verificar
if (Panda.Collab.isConnected()) {
  await Panda.Collab.disconnect();
}
```

> 🔄 **Eventos:** `collab:connected`, `collab:disconnected`
> **Dependência:** Yjs + y-websocket + y-indexeddb (MIT)

---

### ✅ Panda.Validate

**Zod Wrapper.** Validação de dados com schema declarativo.

| Método                | Retorno             | Descrição                                                       |
| --------------------- | ------------------- | --------------------------------------------------------------- |
| `check(data, schema)` | `{valid, errors[]}` | Valida data contra schema `{field: {type, required, min, max}}` |
| `isEmail(email)`      | `boolean`           | Validação rápida de e-mail                                      |

```javascript
// Validar dados
const result = Panda.Validate.check(
  { name: "Lucas", age: 17 },
  {
    name: { type: "string", required: true },
    age: { type: "number", required: true, min: 18 },
  },
);
console.log(result);
// { valid: false, errors: ["age must be >= 18"] }

// Validar e-mail
Panda.Validate.isEmail("dev@panda.com"); // true
```

---

### 🌍 Panda.Polyglot

**Tradução Global Offline (200 idiomas).** Executa via Rust Agent.

| Método                        | Retorno                       | Descrição                          |
| ----------------------------- | ----------------------------- | ---------------------------------- |
| `translate(text, from, to)`   | `Promise<string>`             | Traduz texto entre idiomas         |
| `translateStream(stream, to)` | `AsyncIterator<string>`       | Tradução em tempo real (streaming) |
| `detectLanguage(text)`        | `Promise<{lang, confidence}>` | Detecta idioma automaticamente     |
| `getSupportedLanguages()`     | `string[]`                    | Lista 200+ idiomas suportados      |
| `localizeUI(langCode)`        | `void`                        | Aplica traduções na UI (i18n)      |
| `transcribe(audioBlob)`       | `Promise<string>`             | 🎤 Áudio para texto (Whisper)      |
| `transcribeStream(stream)`    | `AsyncIterator<string>`       | 🎤 Legendas em tempo real          |

**Modelos (via Rust Agent):**

- **NLLB-200** (~600MB): Tradução de texto para 200 idiomas
- **Whisper Base** (~140MB): Speech-to-Text (legendas)

```javascript
// Tradução simples
const texto = await Panda.Polyglot.translate("Hello world", "en", "pt");
console.log(texto); // "Olá mundo"

// Detectar idioma
const { lang } = await Panda.Polyglot.detectLanguage("Bonjour");
console.log(lang); // "fr"

// Legendar áudio
const transcricao = await Panda.Polyglot.transcribe(audioBlob);
console.log(transcricao); // "Texto do áudio..."
```

> 🦀 **Requer Rust Agent** com modelos baixados (~740MB total). Funciona 100% offline.

---

### 🏛️ Panda.Governance

**Constituição Hardcoded do Ecossistema (12 Artigos).** Read-only.

| Método                     | Retorno                                | Descrição                         |
| -------------------------- | -------------------------------------- | --------------------------------- |
| `getConstitution()`        | `{articles[], splits, fundAllocation}` | Retorna toda a Constituição       |
| `getArticle(id)`           | `{id, name, rule}`                     | Retorna artigo específico         |
| `getSplits()`              | `{primary, p2pPreChain, p2pOnChain}`   | Retorna splits de receita         |
| `validate(action, params)` | `Promise<{allowed, reason, article?}>` | Valida ação contra a Constituição |

```javascript
// Exemplo: Tentar banir usuário
const result = await Panda.Governance.validate("expel_user");
console.log(result); // { allowed: false, reason: "Viola Art 9.2: Non-Expulsion..." }
```

---

### 💎 Panda.PAT

**Panda AI Treasury (Banco Central).** Política monetária gerida pela IA.

| Método                      | Retorno                                    | Descrição                          |
| --------------------------- | ------------------------------------------ | ---------------------------------- |
| `getStatus()`               | `Promise<{inflation, reserve, deflation}>` | Status econômico atual             |
| `execute(tool, params?)`    | `Promise<{success, action, amount?}>`      | Executa ferramenta monetária       |
| `_mockSetState(key, value)` | `void`                                     | _[Mock]_ Altera estado para testes |

**Tools disponíveis:** `reinvest`, `accelerate`, `vesting`, `burn`

```javascript
// Exemplo: Forçar reinvestimento de excedente
await Panda.PAT._mockSetState("reserve", 15); // Simula 15% (acima do teto 10%)
const result = await Panda.PAT.execute("reinvest");
console.log(result); // { success: true, action: "Reinvestido", amount: 5000 }
```

---

### ☁️ Panda.Google

**Google Workspace Integration.** Tentacle com 3 children (Drive, Sheets, Colab).

#### Google.Drive

| Método                          | Retorno                    | Descrição           |
| ------------------------------- | -------------------------- | ------------------- |
| `upload(file, options?)`        | `Promise<{id, url, size}>` | Upload para Drive   |
| `download(fileId)`              | `Promise<Blob>`            | Download de arquivo |
| `list(folderId?, query?)`       | `Promise<File[]>`          | Lista arquivos      |
| `share(fileId, email, role?)`   | `Promise<{success}>`       | Compartilha arquivo |
| `createFolder(name, parentId?)` | `Promise<{id, url}>`       | Cria pasta          |
| `delete(fileId)`                | `Promise<boolean>`         | Remove arquivo      |

```javascript
// Upload para pasta específica
const { url } = await Panda.Google.Drive.upload(file, {
  folderId: "1abc...",
  public: true,
});

// Listar arquivos
const files = await Panda.Google.Drive.list(null, "name contains 'report'");
```

#### Google.Sheets

| Método                        | Retorno              | Descrição           |
| ----------------------------- | -------------------- | ------------------- |
| `read(sheetId, range)`        | `Promise<any[][]>`   | Lê range de células |
| `write(sheetId, range, data)` | `Promise<{updated}>` | Escreve dados       |
| `append(sheetId, data)`       | `Promise<{row}>`     | Adiciona linha      |
| `clear(sheetId, range)`       | `Promise<boolean>`   | Limpa range         |
| `create(title)`               | `Promise<{id, url}>` | Cria nova planilha  |

```javascript
// CRUD básico
const data = await Panda.Google.Sheets.read("sheetId", "A1:D10");
await Panda.Google.Sheets.append("sheetId", [["Nome", "Email", "Data"]]);
```

#### Google.Colab

| Método                     | Retorno                  | Descrição          |
| -------------------------- | ------------------------ | ------------------ |
| `create(template?)`        | `Promise<{notebookUrl}>` | Cria notebook      |
| `run(notebookId, params?)` | `Promise<{output}>`      | Executa notebook   |
| `getTemplates()`           | `Template[]`             | Lista templates PF |

> **Cross-reference:** Ver [PF_COLAB_REFERENCE.md](PF_COLAB_REFERENCE.md) para templates GPU/ML.

---

### ⚙️ Panda.Config

**Configuração Global do SDK.** Inclui Mock Mode para desenvolvimento.

| Propriedade      | Tipo      | Default | Descrição                            |
| ---------------- | --------- | ------- | ------------------------------------ |
| `useMock`        | `boolean` | `true`  | Usa dados mock (dev) ou backend real |
| `gasUrl`         | `string`  | `null`  | URL do GAS deployment                |
| `firebaseConfig` | `object`  | `null`  | Config do Firebase                   |
| `debug`          | `boolean` | `false` | Logs detalhados                      |

```javascript
// DevTools: Toggle Mock Mode
Panda.Config.useMock = false; // Conecta ao backend real
Panda.Config.debug = true; // Habilita logs

// Verificar modo atual
if (Panda.Config.useMock) {
  console.log("⚠️ Modo Mock ativo - dados simulados");
}
```

> **DevTools Panel:** O toggle Mock Mode está disponível em `🔧 Config > Mock Mode` no DevTools Panel.

---

### 🧠 Panda.MCP (Orchestrator — MCP Tool Discovery)

> **Status:** ✅ Implementado (v1.1.0) | **Cross-Ref:** `PF_MCP_REFERENCE.md §4.1`, `PF_UI_REFERENCE.md §17`

**Registro dinâmico de MCP tools** dos módulos instalados via Dock. A IA sabe quais ferramentas estão disponíveis.

| Hook / Componente  | Descrição                                           |
| ------------------ | --------------------------------------------------- |
| `useMCPRegistry()` | React hook: registry, syncWithDock, getToolsForAI   |
| `PFOrchestrator`   | Dashboard visual: módulos ativos, tools, AI context |
| `BUILTIN_TOOLS`    | Map inline com 12 módulos e 46 tools tipadas        |

#### Data Flow

```text
Dock installs module → App.jsx sync → useMCPRegistry loads tools
  → broadcast "panda:mcp-tools-updated" → PFChat injects in prompt
  → AI knows which tools are available from active modules
```

#### Eventos

| Evento                    | Emitido por | Consumido por |
| ------------------------- | ----------- | ------------- |
| `panda:open-orchestrator` | Footer/Dock | App.jsx       |
| `panda:mcp-tools-updated` | App.jsx     | PFChat.jsx    |

```javascript
// Usar no componente React
const { tools, toolCount, syncWithDock, getToolsForAI } = useMCPRegistry();

// Sync com Dock
syncWithDock(["crm", "whatsapp", "instagram"]);

// Obter contexto para IA
const aiContext = getToolsForAI();
// → "MCP TOOLS DISPONÍVEIS:\n📱 Panda CRM:\n  - crm_addContact(...)"
```

> 📖 **Detalhes completos:** [PF_MCP_REFERENCE.md](PF_MCP_REFERENCE.md) §4.1

---

## Event Bus

Sistema de eventos para comunicação reativa.

### Métodos

| Método                       | Descrição         |
| ---------------------------- | ----------------- |
| `Panda.on(event, callback)`  | Registra listener |
| `Panda.off(event, callback)` | Remove listener   |
| `Panda.emit(event, data)`    | Dispara evento    |

### Eventos do Sistema

| Evento             | Payload                       | Disparado por    |
| ------------------ | ----------------------------- | ---------------- |
| `auth:change`      | `User \| null`                | Login/Logout     |
| `data:change`      | `{collection, action, item}`  | Data.save/delete |
| `wallet:change`    | `{balance, charged/credited}` | Transações       |
| `storage:progress` | `{file, percent}`             | Upload           |
| `agent:status`     | `{connected}`                 | Bridge           |
| `ui:toast`         | `{message, type}`             | UI.toast         |
| `ui:modal`         | `{title, message}`            | UI.modal         |
| `ui:loading`       | `{show, message}`             | UI.loading       |
| `pat:change`       | `{inflation, reserve, ...}`   | PAT state change |

```javascript
// Exemplo: Atualizar UI quando wallet mudar
Panda.on("wallet:change", ({ balance }) => {
  document.querySelector("#saldo").textContent = balance;
});
```

---

## Classificação de Segurança

| Módulo  | Nível           | Notas                             |
| ------- | --------------- | --------------------------------- |
| Auth    | ✅ Público      | Login/Logout são ações do usuário |
| Data    | ✅ Público      | CRUD padrão                       |
| Storage | ✅ Público      | Upload é ação do usuário          |
| Brain   | ✅ Público      | Cobra internamente                |
| GPU     | ✅ Público      | Cobra internamente                |
| UI      | ✅ Público      | Helpers visuais                   |
| Wallet  | ⚠️ Read-Only    | `charge/credit` são internos      |
| Bridge  | ⚠️ Semi-público | Algumas tools são sensíveis       |
| Config  | 🔒 Interno      | Não modificar em produção         |

## 🐙 Tentacle Architecture

> **Modelo:** SDK → Tentáculos → Pais → Filhos
> **Taxonomia:** Tentáculos são hooks de sistema. Módulos são apps no canvas.
> **Referência:** Ver [PF_MEDUSA_REFERENCE.md](PF_MEDUSA_REFERENCE.md) §2 para taxonomia completa.

### TentacleMonitor

Log em tempo real para hierarquia de módulos.

| Método                               | Retorno      | Descrição          |
| ------------------------------------ | ------------ | ------------------ |
| `registerTentacle(name, config)`     | `void`       | Registra tentáculo |
| `registerParent(tentacle, parentId)` | `void`       | Registra pai       |
| `registerChild(tentacle, childId)`   | `void`       | Registra filho     |
| `log(level, source, message, data)`  | `LogEntry`   | Log com nível      |
| `trace(source, method, fn)`          | `Promise<T>` | Wrap com timing    |
| `getTree()`                          | `TreeObject` | Árvore de status   |
| `getLogs(filter)`                    | `LogEntry[]` | Logs filtrados     |

````javascript
// Exemplo: Monitorar hierarquia
TentacleMonitor.log("info", "social:whatsapp", "Message sent");

// Ver árvore
console.table(TentacleMonitor.getTree());

// Filtrar logs
TentacleMonitor.getLogs({ level: "error", limit: 10 });
```---

### 🔭 Panda.Telemetry (Agent Telemetry) - NEW

**Sistema de telemetria Founder-only.** Coleta dados de todos os tentacles.

| Método                      | Retorno                            | Descrição                    |
| --------------------------- | ---------------------------------- | ---------------------------- |
| `report(source, action, data)` | `Activity`                      | Reportar atividade           |
| `reportError(source, error, ctx)` | `ErrorRecord`                | Reportar erro                |
| `alert(level, title, msg)`   | `Alert`                           | Criar alerta para Founder    |
| `getSummary()`               | `{tentacles, activities, errors}` | Dashboard data (Founder-only)|
| `getActivities(limit, filter)` | `Activity[]`                    | Feed de atividades           |
| `getErrors(limit, unresolved)` | `ErrorRecord[]`                 | Lista de erros               |
| `getTentacleStatus()`        | `{id: status}`                    | Mapa de status tentacles     |
| `resolveError(id)`           | `{success}`                       | Marcar erro como resolvido   |
| `dismissAlert(id)`           | `{success}`                       | Dispensar alerta             |
| `updateStatus(id, status)`   | `void`                            | Atualizar status tentacle    |

**Eventos Founder-Only:**

| Evento            | Payload              | Descrição              |
| ----------------- | -------------------- | ---------------------- |
| `founder:activity` | `Activity`          | Nova atividade         |
| `founder:error`    | `ErrorRecord`       | Novo erro              |
| `founder:alert`    | `Alert`             | Novo alerta            |
| `founder:status`   | `{tentacleId, ...}` | Mudança de status      |

```javascript
// Reportar atividade manualmente
Panda.Telemetry.report('custom:module', 'action', { data: 123 });

// Criar alerta crítico
Panda.Telemetry.alert('critical', 'API Down', 'Gemini API não responde');

// Obter resumo para dashboard
const summary = Panda.Telemetry.getSummary();
console.log(summary.tentacles); // { total: 6, active: 5, errors: 1 }
````

> 🔐 **Founder-Only:** Dados só visíveis para usuário verificado como Founder via `Auth.isFounder()`, localStorage `panda_founder_mode`, ou URL `?founder=1`.

---

### Tentacles Implementados (Jan/2026)

| Tentáculo        | Parent          | Children                                             |
| ---------------- | --------------- | ---------------------------------------------------- |
| **social**       | `Panda.Social`  | WhatsApp, Twitter, YouTube, Meta, Telegram, TikTok   |
| **trading**      | `Panda.Trading` | cTrader                                              |
| **brain**        | `Panda.Brain`   | Gemini (6 GEMs), GPU, LocalLLM                       |
| **google**       | `Panda.Google`  | Drive, Sheets, Colab, Calendar, Docs, Gmail, YouTube |
| **distribution** | `Panda.Dist`    | itch.io, PWA, Panda Arcade                           |

### 📊 Status Mock vs Real (37 arquivos) - Censo Fev/2026

> **Legenda:** Mock = usa `_delay()` simulado | Real = usa `callGAS()` backend

#### 🟢 Backend Real (callGAS) - 7 arquivos

| Arquivo                       | Status  | Descrição           |
| ----------------------------- | ------- | ------------------- |
| `google/children/calendar.js` | ✅ REAL | Google Calendar API |
| `google/children/colab.js`    | ✅ REAL | Google Colab API    |
| `google/children/docs.js`     | ✅ REAL | Google Docs API     |
| `google/children/drive.js`    | ✅ REAL | Google Drive API    |
| `google/children/gmail.js`    | ✅ REAL | Gmail API           |
| `google/children/sheets.js`   | ✅ REAL | Google Sheets API   |
| `google/children/youtube.js`  | ✅ REAL | YouTube Data API v3 |

#### 🟡 Mock Local (\_delay) - 13 arquivos

| Arquivo                                | Status  | Descrição                    |
| -------------------------------------- | ------- | ---------------------------- |
| `social/children/meta.js`              | 🔶 MOCK | Meta (FB+IG) simulado        |
| `social/children/twitter.js`           | 🔶 MOCK | Twitter/X simulado           |
| `social/children/whatsapp.js`          | 🔶 MOCK | WhatsApp simulado            |
| `social/children/youtube.js`           | 🔶 MOCK | YouTube (com custos PC mock) |
| `trading/children/ctrader.js`          | 🔶 MOCK | cTrader simulado             |
| `github/children/actions.js`           | 🔶 MOCK | GitHub Actions simulado      |
| `distribution/children/google-play.js` | 🔶 MOCK | Play Store simulado          |
| `distribution/children/itch.js`        | 🔶 MOCK | itch.io simulado             |
| `distribution/children/npm.js`         | 🔶 MOCK | NPM publish simulado         |
| `distribution/children/pwa.js`         | 🔶 MOCK | PWA deploy simulado          |
| `distribution/children/steam.js`       | 🔶 MOCK | Steam simulado               |
| `distribution/children/vscode.js`      | 🔶 MOCK | VSCode ext simulado          |
| `brain/children/local-llm.js`          | 🔶 MOCK | LocalLLM (Ollama) simulado   |

#### ⚪ Não Implementados - 17 arquivos

| Arquivo                                  | Status | Notas                     |
| ---------------------------------------- | ------ | ------------------------- |
| `brain/pf.brain-parent.js`               | ⬜ N/A | Orchestrator (sem lógica) |
| `brain/children/gemini.js`               | ⬜ N/A | Pendente callGAS          |
| `brain/children/gpu.js`                  | ⬜ N/A | Pendente Rust bridge      |
| `distribution/pf.distribution-parent.js` | ⬜ N/A | Orchestrator              |
| `distribution/children/arcade.js`        | ⬜ N/A | Pendente implementação    |
| `education/pf.education-parent.js`       | ⬜ N/A | Orchestrator              |
| `education/children/eduzz.js`            | ⬜ N/A | Webhook pendente          |
| `education/children/hotmart.js`          | ⬜ N/A | Webhook pendente          |
| `education/children/kiwify.js`           | ⬜ N/A | Webhook pendente          |
| `github/pf.github-parent.js`             | ⬜ N/A | Orchestrator              |
| `github/children/database.js`            | ⬜ N/A | Pendente implementação    |
| `github/children/pages.js`               | ⬜ N/A | Pendente implementação    |
| `google/pf.google-parent.js`             | ⬜ N/A | Orchestrator              |
| `monitor/pf.tentacle-monitor.js`         | ⬜ N/A | Logger (sem mock/real)    |
| `p2p/pf.p2p-parent.js`                   | ⬜ N/A | Pendente GAS P2P          |
| `social/pf.social-parent.js`             | ⬜ N/A | Orchestrator              |
| `trading/pf.trading-parent.js`           | ⬜ N/A | Orchestrator              |

### 🔄 Padrão Mock → Real (Migração)

```javascript
// ❌ ANTES (Mock - usa _delay)
async function sendMessage(to, text) {
  await _delay(500); // Simula latência
  return { success: true, mock: true, messageId: `mock_${Date.now()}` };
}

// ✅ DEPOIS (Real - usa callGAS)
async function sendMessage(to, text) {
  return await window.Panda.callGAS("whatsapp_send", { to, text });
}
```

> 📌 **Próximos passos:** Migrar os 14 mocks para `callGAS()` quando GAS endpoints estiverem prontos.

### Tentacles Planejados

| Tentáculo     | Parent            | Children Planejados                      |
| ------------- | ----------------- | ---------------------------------------- |
| **google**    | `Panda.Google`    | Drive, Sheets, Colab, Firebase, Calendar |
| **education** | `Panda.Education` | Kiwify, Hotmart, Eduzz                   |
| **gaming**    | `Panda.Gaming`    | Godot, Bevy, ThreeJS, PixiJS             |
| **audio**     | `Panda.Audio`     | ToneJS, ElevenLabs, Whisper, Suno        |
| **video**     | `Panda.Video`     | FFmpeg, Remotion, Veo                    |
| **compute**   | `Panda.Compute`   | Colab, P2P Hosts                         |

---

### 🌐 Panda.Google (Tentáculo Completo)

**Integração nativa com Google Workspace.** 7 children implementados.

#### Google.Drive

Operações de arquivo no Google Drive do usuário.

| Método                         | Retorno                 | Descrição                |
| ------------------------------ | ----------------------- | ------------------------ |
| `list(folderId?, options?)`    | `Promise<File[]>`       | Lista arquivos           |
| `upload(file, folderId?)`      | `Promise<FileMetadata>` | Upload de arquivo        |
| `download(fileId)`             | `Promise<Blob>`         | Download de arquivo      |
| `createFolder(name, parent?)`  | `Promise<Folder>`       | Cria pasta               |
| `move(fileId, targetFolderId)` | `Promise<boolean>`      | Move arquivo/pasta       |
| `trash(fileId)`                | `Promise<boolean>`      | Move para lixeira        |
| `search(query)`                | `Promise<File[]>`       | Busca arquivos           |
| `getShareLink(fileId, role?)`  | `Promise<string>`       | Link de compartilhamento |

```javascript
// Listar pasta raiz
const files = await Panda.Google.Drive.list("root");

// Upload com progresso
await Panda.Google.Drive.upload(myFile, "folderId");

// Download
const blob = await Panda.Google.Drive.download("fileId");

// Criar pasta de projeto
await Panda.Google.Drive.createFolder("Meu Projeto Panda");
```

#### Google.Sheets

CRUD em planilhas Google.

| Método                       | Retorno            | Descrição       |
| ---------------------------- | ------------------ | --------------- |
| `read(spreadsheetId, range)` | `Promise<any[][]>` | Lê células      |
| `write(id, range, values)`   | `Promise<boolean>` | Escreve células |
| `append(id, range, values)`  | `Promise<boolean>` | Adiciona linhas |
| `create(title)`              | `Promise<string>`  | Cria planilha   |

#### Google.Calendar

Gerenciamento de eventos.

| Método                           | Retorno            | Descrição     |
| -------------------------------- | ------------------ | ------------- |
| `listEvents(calendarId, opts)`   | `Promise<Event[]>` | Lista eventos |
| `createEvent(calendarId, event)` | `Promise<Event>`   | Cria evento   |
| `deleteEvent(calendarId, id)`    | `Promise<boolean>` | Remove evento |

#### Google.Docs

Criação e edição de documentos.

| Método                | Retorno            | Descrição       |
| --------------------- | ------------------ | --------------- |
| `create(title)`       | `Promise<string>`  | Cria documento  |
| `get(docId)`          | `Promise<Doc>`     | Obtém documento |
| `append(docId, text)` | `Promise<boolean>` | Adiciona texto  |

#### Google.Gmail

Envio de emails.

| Método                    | Retorno            | Descrição    |
| ------------------------- | ------------------ | ------------ |
| `send(to, subject, body)` | `Promise<boolean>` | Envia email  |
| `list(query?, max?)`      | `Promise<Email[]>` | Lista emails |

#### Google.Colab

Integração com notebooks.

| Método                | Retorno           | Descrição        |
| --------------------- | ----------------- | ---------------- |
| `create(title)`       | `Promise<string>` | Cria notebook    |
| `execute(notebookId)` | `Promise<Output>` | Executa notebook |

#### Google.YouTube

Upload e gerenciamento de vídeos.

| Método                    | Retorno            | Descrição       |
| ------------------------- | ------------------ | --------------- |
| `upload(video, metadata)` | `Promise<Video>`   | Upload de vídeo |
| `getChannel()`            | `Promise<Channel>` | Info do canal   |
| `listVideos(channelId?)`  | `Promise<Video[]>` | Lista vídeos    |

> 📍 **Localização:** `5.tentacles/5.2.google/` (parent + 7 children)

---

## Changelog

### [Roadmap] SDK Dev Portal (Q2-Q3 2026)

> **Aprovado:** Ponto de Inflexão v3.1 — 2026-02-13

O SDK é posicionado como **"a estrada e o pedágio"** — todo plugin, extensão e módulo passa pelo SDK. Para escalar o ecossistema, um **SDK Dev Portal** dedicado será criado:

| Componente              | Descrição                                  | Status                       |
| ----------------------- | ------------------------------------------ | ---------------------------- |
| **Manual Interativo**   | Documentação SDK com exemplos executáveis  | ⏳ Planejado                 |
| **Modelos & Templates** | Starter-kits para plugins (CRM, PDV, Chat) | ⏳ Planejado                 |
| **Boas Práticas**       | Guia de segurança, performance, UX         | ⏳ Planejado                 |
| **Playground**          | Sandbox executável no browser              | 🚧 Parcial (ver §Playground) |
| **MCP Guide**           | Como expor tools/resources/prompts         | ⏳ Planejado                 |

> 📖 **Cross-ref:** Roadmap unificado em `CONTEXT.md` §1 | Debate em `ponto_de_inflexao.md`

---

### [1.8.0] - 2026-03-04 (MCP Orchestrator Integration)

- **Feature:** `useMCPRegistry.js` v1.1 — MCP Tool Discovery hook (12 modules, 46 tools)
- **Feature:** `PFOrchestrator.jsx/css` — Visual dashboard for MCP registry
- **Feature:** PFChat v2.1 — MCP tools injected in AI prompt via `panda:mcp-tools-updated` event
- **Feature:** App.jsx v6.7 — Dock→MCP sync, Orchestrator panel, footer MCP counter
- **Docs:** `PF_MCP_REFERENCE.md` §4.1, `PF_UI_REFERENCE.md` §17

### [1.0.0] - 2026-03-02 (Sprint E1 — Firebase Real + Store + Economy)

- **Feature:** `useAuth.jsx` — Google Sign-In via Firebase Auth real; fallback mock para dev; mapeamento Firebase User → Panda domain model; flags `isFounder` / `isAuthenticated`
- **Feature:** `useFirebase.js` — Init Firebase real; `signIn`, `signOut`, `rtdbGet`, `rtdbSet`, `rtdbSubscribe`; helpers `walletBalance`, `walletHistory`
- **Feature:** `Panda.Store` — catálogo real do RTDB; instalação de módulo debita PC via `wallet.charge` GAS; revenue split 70% Dev / 25% Ops / 5% Founder; "Featured" modules patrocinados
- **Feature:** `Panda.Economy` — pacotes de compra de PC via Stripe Checkout (R$10/50/100/500); hook de retorno `/payment-success` atualiza saldo no RTDB
- **Fix:** Mock removido de `pf.sdk.js`; Auth e Wallet agora usam backend real
- **Docs:** Regras RTDB documentadas em §7.2; fluxo Auth em §5.3; Status Mock→Real atualizado

### [0.9.5] - 2026-01-26 (Agent Telemetry + Founder Mode)

- **Feature:** `pf.agent-telemetry.js` - Sistema de telemetria Founder-only (380 linhas)
- **Feature:** `Panda.Telemetry` - Report, alert, getSummary, getActivities
- **Feature:** Eventos `founder:activity`, `founder:error`, `founder:alert`
- **Feature:** Todos 6 tentacle parents integrados com `AT.report()` / `AT.reportError()`
- **Feature:** `useFounderMetrics.js` - Real-time event subscriptions
- **Enhancement:** `whatsapp.js` - Evolution API, bulk messaging, AI chatbot (501 linhas)
- **Fix:** Hooks fault isolation aplicado: `useGAS.js`, `useLandingPage.js`, `useMarketplace.js`
- **Fix:** `useAuth.js` → `useAuth.jsx` (JSX syntax fix)
- **Docs:** Constitutional amendments §7.6-7.10 (Fault Isolation, Error Registry)

### [0.9.3] - 2026-01-25 (AI Cores + Distribution)

- **Feature:** Brain.Gemini - 6 GEMs (Writer, Analyst, Coder, Designer, Planner, Researcher)
- **Feature:** Brain.GPU - WebGL/WebGPU detection, benchmark, ML compatibility
- **Feature:** Brain.LocalLLM - Ollama/LM Studio integration (custo 0 PC)
- **Feature:** PAT.mindMap - Firestore cloud sync, merge strategy, export/import
- **Feature:** PAT.interview - 10 questions, 4 categories
- **Feature:** Distribution Tentacle - itch.io, PWA, Panda Arcade hooks
- **Feature:** Google Tentacle - 8 children (Drive, Sheets, Colab, Calendar, Docs, Gmail, YouTube, Firebase)
- **Feature:** Social Hub - 7 children (WhatsApp, YouTube, Meta, TikTok, Twitter, Telegram)
- **Feature:** cTrader Open API integration
- **Status:** PAT Core 100%, Brain 100%

### [0.9.2] - 2026-01-24 (Roadmap Strategy)

- **Roadmap:** Google Partner Strategy definida
- **Roadmap:** P2P Compute Network planejada
- **Roadmap:** VSX Store Universal (GitHub + Google Source)
- **Planned:** Google Tentacle (`google/drive.js`, `sheets.js`, `colab.js`)

### [0.9.1] - 2026-01-24 (Tentacle Architecture)

- **Feature:** Arquitetura de Tentáculos (SDK → Parents → Children)
- **Feature:** `TentacleMonitor` - Log em tempo real
- **Feature:** Sandbox automático para children

### [0.9.0] - 2026-01-24 (SDK Audit & Sync)

- **Audit:** Cross-reference audit completa com todas as docs
- **Feature:** `Auth.ROLES` - Constantes de acesso (FOUNDER/DEV/USER)
- **Feature:** `Auth.getRole()` - Retorna nível de acesso numérico
- **Feature:** `Auth.canAccess(minRole)` - Verificação de permissão
- **Feature:** `Polyglot.getSettings()` / `setSettings()` - Configuração
- **Feature:** `Polyglot.status()` - Status do módulo
- **Docs:** Versão sincronizada em todos os arquivos

### [0.8.0] - 2026-01-23 (Polyglot & Treasury)

- **Feature:** Módulo `Polyglot` - Tradução global offline (200 idiomas)
- **Feature:** `Polyglot.translate()` - Tradução de texto via NLLB-200
- **Feature:** `Polyglot.transcribe()` - Áudio para texto via Whisper
- **Feature:** `Polyglot.detectLanguage()` - Detecção automática de idioma
- **Feature:** `Polyglot.translateStream()` - Tradução em tempo real
- **Docs:** Atualização PANDA.md, PF_MASTER_ARCHITECTURE.md
- **Architecture:** Treasury Backing (PAXG 70%, USDC 30%)
- **Architecture:** Download progressivo Rust Agent (~850MB total)

### [0.5.1] - 2026-01-22

- **Security:** `Wallet.charge/credit` agora são internos
- **Feature:** `Wallet.getHistory()` adicionado
- **Fix:** Modal timeout de 30s para evitar Promise eterna
- **Fix:** LocalStorage persistence para Auth

### [0.6.0] - 2026-01-22 (Governance Kernel)

- **Feature:** Módulo `Governance` - Constituição Hardcoded (12 Artigos)
- **Feature:** Módulo `PAT` - Panda AI Treasury (Banco Central)
- **Feature:** Método `Governance.validate(action)` para validar ações
- **Feature:** Tools PAT: `reinvest`, `accelerate`, `vesting`, `burn`
- **Docs:** Atualização SDK_REFERENCE.md

### [0.7.1] - 2026-01-23 (Multi-Window & Docs Update)

- **Feature:** `UI.popout(toolId)` - Janelas pop-out via Document PiP
- **Feature:** `UI.getPopouts()` - Lista pop-outs ativos
- **Feature:** `UI.closePopout(toolId)` - Fecha pop-out específico
- **Docs:** Arquivo renomeado para `PF_SDK_REFERENCE.md`
- **Docs:** CSS renomeado para `PF_CSS_REFERENCE.md`

### [0.7.0] - 2026-01-22 (Ed25519 Security Layer)

- **Feature:** Módulo `Crypto` - Ed25519 (PRONTO, NÃO ATIVO)
- **Feature:** `Auth.signCommand(payload)` - Assinatura criptográfica Founder
- **Feature:** `Auth.isFounder()` - Verifica se é Founder
- **Feature:** `Crypto.verify(message, signature)` - Verifica assinatura
- **Feature:** `Crypto.hash(payload)` - SHA-256 hashing
- **Feature:** `Crypto.FOUNDER_PUBLIC_KEY` - Chave pública placeholder
- **Docs:** Seção 8.8 em PF_MASTER_ARCHITECTURE.md

### [0.5.0] - 2026-01-22

- **Feature:** Módulo `Bridge` para comunicação Rust
- **Feature:** Módulo `UI` (toast, modal, loading)
- **Feature:** Event Bus completo

### [0.4.0] - 2026-01-21

- **Feature:** Módulo `Auth` com persistência
- **Feature:** Módulo `Storage` com progresso
- **Feature:** Event Bus básico

---

> 📖 **Arquitetura Completa:** [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md)

---

### Estrutura de Arquivos

```text
5.tentacles/                         # 9 Integration Modules
├── 5.1.brain/                        ← AI/ML
│   ├── pf.brain-parent.js
│   └── 5.1.1.children/
│       ├── gemini.js                 ← Gemini API
│       ├── local-llm.js              ← Ollama/LM Studio
│       └── gpu.js                    ← WebGPU detection
├── 5.2.google/                       ← Google Services
│   ├── pf.google-parent.js
│   └── 5.2.1.children/
│       ├── drive.js
│       ├── sheets.js
│       ├── colab.js
│       ├── calendar.js
│       ├── docs.js
│       ├── gmail.js
│       └── youtube.js
├── 5.3.social/                       ← Social Media
│   ├── pf.social-parent.js
│   └── 5.3.1.children/
│       ├── whatsapp.js               ← Evolution API/Baileys
│       ├── twitter.js
│       ├── youtube.js
│       └── meta.js
├── 5.4.trading/                      ← Financial Markets
│   ├── pf.trading-parent.js
│   └── 5.4.1.children/ctrader.js     ← cTrader Open API
├── 5.5.distribution/                 ← App Publishing
│   ├── pf.distribution-parent.js
│   └── 5.5.1.children/
│       ├── pwa.js
│       ├── itch.js
│       ├── steam.js
│       ├── google-play.js
│       ├── npm.js
│       ├── vscode.js
│       └── arcade.js
├── 5.6.education/                    ← EdTech Platforms
│   ├── pf.education-parent.js
│   └── 5.6.1.children/
│       ├── kiwify.js
│       ├── hotmart.js
│       └── eduzz.js
├── 5.7.github/                       ← GitHub Integration
│   ├── pf.github-parent.js
│   └── 5.7.1.children/
│       ├── pages.js                  ← GitHub Pages deploy
│       ├── database.js               ← JSON as database
│       └── actions.js                ← CI/CD workflows
├── 5.8.p2p/                          ← P2P Compute Network
│   └── pf.p2p-parent.js
└── 5.9.monitor/                      ← System Health
    └── pf.tentacle-monitor.js        ← Real-time logging
```

### TentacleMonitor API

| Método                                | Descrição                  |
| ------------------------------------- | -------------------------- |
| `TM.registerTentacle(name)`           | Registra tentáculo         |
| `TM.registerChild(tentacle, childId)` | Registra filho             |
| `TM.log(level, source, msg)`          | Log com nível              |
| `TM.getTree()`                        | Retorna árvore hierárquica |
| `TM.getLogs(filter)`                  | Logs filtrados             |

### Benefícios

- **Isolamento:** Se um child falha, o resto continua
- **Hot-Swap:** Atualizar módulo sem reload

### Tentacle Extensibility Guide

> **Como devs expandem o ecossistema Panda Factory com novos módulos e integrações.**

#### Dois Caminhos para Extensão

| Caminho                       | Quando usar                                                | API                                 | Exemplo                               |
| ----------------------------- | ---------------------------------------------------------- | ----------------------------------- | ------------------------------------- |
| **Child de Parent existente** | Integrar com serviço que se encaixa em categoria existente | `TM.registerChild(parent, childId)` | Adicionar Telegram ao parent `social` |
| **Novo Parent (Tentacle)**    | Criar categoria inteiramente nova                          | `TM.registerTentacle(name)`         | Criar parent `compute` para HPC       |

#### Criando um Child (mais comum)

```javascript
// 1. Crie o arquivo em 5.tentacles/5.3.social/5.3.1.children/telegram.js
const TelegramChild = {
  id: "telegram",
  parent: "social",
  version: "1.0.0",

  async init() {
    TM.registerChild("social", "telegram");
    TM.log("info", "telegram", "Child registrado no parent social");
  },

  async sendMessage(chatId, text) {
    return await Panda.Hooks.call("telegram.send", { chatId, text });
  },
};
```

#### Criando um Parent Novo (avançado)

```javascript
// 1. Crie a pasta 5.tentacles/5.10.compute/ + pf.compute-parent.js
const ComputeParent = {
  id: "compute",
  children: [],
  version: "1.0.0",

  async init() {
    TM.registerTentacle("compute");
    TM.log("info", "compute", "Parent registrado no TentacleMonitor");
  },

  registerChild(childId) {
    this.children.push(childId);
    TM.registerChild("compute", childId);
  },
};
```

#### Manifest (`panda.manifest.json`)

Todo módulo publicável na Medusa Store DEVE incluir:

```json
{
  "name": "pf-telegram",
  "version": "1.0.0",
  "type": "module",
  "parent": "social",
  "permissions": ["hooks.call", "events.emit"],
  "panda_defend_score": 85
}
```

| Campo `type` | Significado                                       |
| ------------ | ------------------------------------------------- |
| `module`     | Child de parent existente (ex: telegram → social) |
| `tentacle`   | Parent novo com hierarquia própria                |
| `theme`      | Pacote visual (CSS tokens + assets)               |

#### Tentacles Implementados vs Planejados

| Parent         | Status  | Children                                             | Ref |
| -------------- | ------- | ---------------------------------------------------- | --- |
| `brain`        | ✅ Impl | gemini, local-llm, gpu                               | 5.1 |
| `google`       | ✅ Impl | drive, sheets, colab, calendar, docs, gmail, youtube | 5.2 |
| `social`       | ✅ Impl | whatsapp, twitter, youtube, meta                     | 5.3 |
| `trading`      | ✅ Impl | ctrader                                              | 5.4 |
| `distribution` | ✅ Impl | pwa, itch, steam, google-play, npm, vscode, arcade   | 5.5 |
| `education`    | ✅ Impl | kiwify, hotmart, eduzz                               | 5.6 |
| `github`       | ✅ Impl | pages, database, actions                             | 5.7 |
| `p2p`          | ✅ Impl | (parent only)                                        | 5.8 |
| `gaming`       | 📋 Plan | arcade, itch.io, indie hub                           | —   |
| `audio`        | 📋 Plan | TTS, STT, music gen                                  | —   |
| `video`        | 📋 Plan | render, encode, stream                               | —   |
| `compute`      | 📋 Plan | HPC, cloud GPU, batch jobs                           | —   |
| `custom`       | 📋 Plan | dev-defined (registerTentacle)                       | —   |

#### Lifecycle: Dev → Medusa → User

```text
DEV cria módulo → panda.manifest.json → Panda Defend valida (Score >= 70)
   → Publica na Medusa Store → User instala → TentacleMonitor integra
   → Hot-Swap ativo (update sem reload)
```

> **Cross-ref:** PF_MEDUSA_REFERENCE.md §8-9 (publish flow) | PF_SECURITY_REFERENCE.md (Panda Defend)

- **Observabilidade:** DevTools UI (F12) visualiza tudo

---

## 💰 Panda.Economy (P0 - Transações Seguras)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P0 (Crítico)

### Princípio de Idempotência

Toda transação financeira DEVE incluir `idempotencyKey` para prevenir duplicações.

```javascript
// ⚠️ ERRADO - Pode duplicar se retry acontecer
await Panda.Economy.transfer({
  from: userId,
  to: recipientId,
  amount: 100,
});

// ✅ CORRETO - Idempotente
await Panda.Economy.transfer({
  from: userId,
  to: recipientId,
  amount: 100,
  idempotencyKey: `TRX-${userId}-${Date.now()}-${crypto.randomUUID()}`,
});
```

### API Completa

| Método                    | Parâmetros                                    | Retorno                   | Descrição                      |
| ------------------------- | --------------------------------------------- | ------------------------- | ------------------------------ |
| `transfer(opts)`          | `{from, to, amount, reason?, idempotencyKey}` | `Promise<TransferResult>` | Transferência PC entre wallets |
| `charge(opts)`            | `{user, amount, reason, idempotencyKey}`      | `Promise<ChargeResult>`   | Debita PC do usuário           |
| `credit(opts)`            | `{user, amount, reason, idempotencyKey}`      | `Promise<CreditResult>`   | Credita PC ao usuário          |
| `getBalance(user)`        | `string`                                      | `Promise<{pc, pat}>`      | Saldo atual                    |
| `getHistory(user, opts?)` | `string, {limit?, since?}`                    | `Promise<Transaction[]>`  | Histórico                      |

### TTL de Idempotência

| Operação   | TTL | Motivo                  |
| ---------- | --- | ----------------------- |
| `transfer` | 24h | Retry em falhas de rede |
| `charge`   | 1h  | Operação de checkout    |
| `credit`   | 24h | Recompensas/refunds     |

---

## 📜 Panda.Events (P0 - Event Sourcing)

> **Filosofia:** "Transações são eventos imutáveis. Estado é derivado."

### API

```javascript
// Registrar evento
await Panda.Events.emit("economy.transfer", {
  from: "user-a",
  to: "user-b",
  amount: 100,
  reason: "plugin_purchase",
});

// Reconstruir estado a partir de eventos
const balance = await Panda.Events.replay("user-a", {
  types: ["economy.*"],
  since: "2026-01-01",
});

// Escutar eventos em tempo real
Panda.Events.subscribe("economy.transfer", (event) => {
  console.log("Transfer:", event.data);
});
```

### Event Types (Padrão)

| Namespace      | Eventos                          | Uso                    |
| -------------- | -------------------------------- | ---------------------- |
| `economy.*`    | `transfer`, `charge`, `credit`   | Transações financeiras |
| `auth.*`       | `login`, `logout`, `role_change` | Autenticação           |
| `store.*`      | `purchase`, `refund`, `install`  | Marketplace            |
| `governance.*` | `proposal`, `vote`, `execute`    | PAT Council            |

---

## 🔄 Panda.Backend (P1 - Resiliência)

> **Padrões:** Circuit Breaker, Retry, Fallback

### Chamadas com Retry

```javascript
// Chamada básica (usa retry padrão)
const result = await Panda.Backend.call("wallet.balance", { userId });

// Chamada com opções de resiliência
const result = await Panda.Backend.call(
  "ai.chat",
  {
    message: "Olá!",
  },
  {
    retries: 3,
    backoff: "exponential", // linear | exponential | none
    timeout: 5000,
    fallback: () => ({ cached: true, response: "..." }),
  },
);
```

### Circuit Breaker States

```text
CLOSED ──(3 failures)──► OPEN ──(30s)──► HALF_OPEN
   ▲                                         │
   └──────────(success)──────────────────────┘
```

### Fallback Chain

```javascript
// Configurar cadeia de fallback
Panda.Backend.setFallbackChain([
  { name: "GAS", endpoint: "https://script.google.com/..." },
  { name: "Rust", endpoint: "ws://localhost:3030" },
  { name: "Cache", fn: () => IndexedDB.get("cache") },
]);

// Usa automaticamente
await Panda.Backend.callWithFallback("data.get", { key: "config" });
```

### Status do Circuit

```javascript
const status = Panda.Backend.getCircuitStatus();
// { state: 'CLOSED', failures: 0, lastFailure: null }
```

---

## 🗃️ Panda.Cache (P1 - Thunder Herd Prevention)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P1
> **Problema:** Quando cache de muitos usuários expira ao mesmo tempo, todos batem no servidor juntos (Thunder Herd)

### API Completa

```javascript
// SET com TTL fixo (pode causar thunder herd)
await Panda.Cache.set("key", value, { ttl: 3600 });

// SET com TTL Jitter (RECOMENDADO - evita thunder herd)
await Panda.Cache.set("key", value, {
  ttl: 3600,
  jitter: true, // Adiciona ±25% de variação
  jitterRange: 0.25, // 25% = TTL entre 2700s e 4500s
});

// GET com stale-while-revalidate
const data = await Panda.Cache.get("key", {
  staleWhileRevalidate: true, // Retorna cache expirado enquanto busca novo
  maxStale: 86400, // Máximo 24h de stale
});

// Invalidação
await Panda.Cache.delete("key");
await Panda.Cache.clear(); // Limpa tudo
await Panda.Cache.clearPattern("user:*"); // Por padrão
```

### Estratégias de Cache

| Estratégia   | Uso                              | TTL    | Jitter |
| ------------ | -------------------------------- | ------ | ------ |
| `aggressive` | Dados estáticos (assets, config) | 7 dias | ❌     |
| `balanced`   | Dados semi-estáticos (profile)   | 1 hora | ✅ 25% |
| `fresh`      | Dados dinâmicos (balance)        | 5 min  | ✅ 50% |
| `realtime`   | Sem cache                        | 0      | N/A    |

```javascript
// Configurar estratégia padrão
Panda.Cache.setStrategy("balanced");

// Usar estratégia específica
await Panda.Cache.set("balance", value, { strategy: "fresh" });
```

---

## 🎮 Developer Playground (P1 - Developer-First)

> **Filosofia:** "Docs são extensão do código" - GitHub Primer
> **Objetivo:** Exemplos executáveis direto na documentação

### Exemplos Interativos

Todos os exemplos do SDK estão disponíveis no Playground:

```text
🔗 https://panda.factory/playground

┌─────────────────────────────────────────────────────────────────────────┐
│  PANDA PLAYGROUND                                          [Run] [Fork] │
├─────────────────────────────────────────────────────────────────────────┤
│  // Exemplo: Transferência com Idempotência                             │
│  const result = await Panda.Economy.transfer({                          │
│    from: 'user-a',                                                      │
│    to: 'user-b',                                                        │
│    amount: 100,                                                         │
│    idempotencyKey: `TRX-${Date.now()}`                                  │
│  });                                                                    │
│  console.log(result);                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  OUTPUT:                                                                │
│  { success: true, transactionId: "TRX-123", balance: { from: 900 } }   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Categorias de Exemplos

| Categoria   | Exemplos                  | Dificuldade      |
| ----------- | ------------------------- | ---------------- |
| **Auth**    | Login, Logout, Role check | 🟢 Básico        |
| **Economy** | Transfer, Charge, Balance | 🟡 Intermediário |
| **Events**  | Emit, Subscribe, Replay   | 🟡 Intermediário |
| **Backend** | Circuit Breaker, Fallback | 🔴 Avançado      |
| **Cache**   | TTL Jitter, Strategies    | 🟡 Intermediário |

### Embed em Documentação

```html
<!-- Embed de exemplo no doc -->
<iframe
  src="https://panda.factory/playground/embed/economy-transfer"
  width="100%"
  height="300"
  style="border: 1px solid var(--border-subtle); border-radius: 8px;"
>
</iframe>
```

### Quick Start Copy-Paste

```javascript
// 🚀 QUICK START - Cole isso e funciona!

// 1. Autenticar
await Panda.Auth.login({ email: "dev@test.com", password: "123" });

// 2. Verificar saldo
const balance = await Panda.Economy.getBalance();
console.log(`Saldo: ${balance.pc} PC`);

// 3. Fazer transferência segura
const tx = await Panda.Economy.transfer({
  to: "partner-id",
  amount: 50,
  reason: "test",
  idempotencyKey: crypto.randomUUID(),
});

// 4. Escutar eventos
Panda.Events.subscribe("economy.*", (e) => console.log(e));
```

---

## 📊 Panda.Telemetry (P2 - Observability)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P2
> **Padrão:** Metrics, Logs, Traces (MLT)

### Configuração

```javascript
// Habilitar telemetria completa
Panda.Telemetry.enable({
  metrics: true, // Performance metrics
  logs: true, // Console forwarding
  traces: true, // Request tracing
  sampleRate: 0.1, // 10% sampling (produção)
  endpoint: "firebase", // ou 'console' para dev
});
```

### Métricas Customizadas

```javascript
// Track evento com timing
Panda.Telemetry.track({
  name: "plugin.load",
  value: 245,
  unit: "ms",
  tags: { pluginId: "xyz", source: "store" },
});

// Counter
Panda.Telemetry.increment("economy.transfer.success");
Panda.Telemetry.increment("economy.transfer.failed");

// Gauge
Panda.Telemetry.gauge("p2p.nodes.active", 42);
```

### Tracing

```javascript
// Iniciar trace de operação complexa
const trace = Panda.Telemetry.startTrace("checkout.flow");

await Panda.Economy.charge({ amount: 100 });
trace.addEvent("payment.processed");

await Panda.Store.deliverAsset(assetId);
trace.addEvent("asset.delivered");

trace.end(); // Fecha e envia trace

// Resultado: trace com timeline completa da operação
```

### Logs Estruturados

```javascript
// Logs são automaticamente capturados
Panda.Telemetry.log('info', 'User purchased plugin', {
  userId: 'user-123',
  pluginId: 'plugin-xyz',
  amount: 50
});

// Shorthand
Panda.log.info('Purchase complete', { ... });
Panda.log.warn('Low balance', { ... });
Panda.log.error('Payment failed', { ... });
```

### Health Dashboard Data

```javascript
// Dados para dashboard de health
const health = await Panda.Telemetry.getHealth();
// {
//   uptime: 86400,
//   requests: { total: 10000, errors: 5, p99: 250 },
//   services: { gas: 'healthy', firebase: 'healthy', rust: 'degraded' }
// }
```

---

## 📱 Social Media Hub

> **Integração com plataformas sociais via Tentacles**

### Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      SOCIAL MEDIA HUB                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 📱 WhatsApp  │  │ 🐦 Twitter   │  │ 📺 YouTube   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 📘 Meta      │  │ ✈️ Telegram  │  │ 🎵 TikTok   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                            │                                        │
│                   ┌──────────────────┐                             │
│                   │  Panda.Social    │                             │
│                   │  (SDK Parent)    │                             │
│                   └──────────────────┘                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Estrutura de Arquivos

```text
5.tentacles/5.3.social/
├── pf.social-parent.js      # Parent API
└── 5.3.1.children/
    ├── whatsapp.js          # WhatsApp Business
    ├── twitter.js           # Twitter/X
    ├── youtube.js           # YouTube Data API
    └── meta.js              # Meta (Facebook + Instagram)
```

### API

```javascript
// Configurar plataforma
await Panda.Social.configure("youtube", {
  apiKey: "YOUR_API_KEY",
  channelId: "YOUR_CHANNEL_ID",
});

// WhatsApp - Enviar mensagem
await Panda.Social.WhatsApp.send({
  to: "+5511999999999",
  message: "Olá! 🐼",
  template: "welcome",
});

// YouTube - Otimizar vídeo
const optimized = await Panda.Social.YouTube.optimize({
  title: "Meu vídeo sobre...",
  description: "Descrição atual...",
  tags: ["tag1", "tag2"],
});

// Twitter - Gerar thread
const thread = await Panda.Social.Twitter.generateThread({
  topic: "AI no desenvolvimento",
  tweets: 5,
  includeHook: true,
});

// Meta - Cross-post
await Panda.Social.Meta.crossPost({
  platforms: ["facebook", "instagram"],
  content: "Novidade! 🎉",
  media: ["image1.jpg"],
});
```

---

## 🧩 Plugin Development

> **Como criar e distribuir plugins no Panda Factory**

### Arquitetura Modular

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      PANDA FACTORY SHELL                            │
│                   (PandaFactory.html + SDK)                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  📱 Social   │  │  📈 Trading  │  │  🔧 Dev      │              │
│  │     Hub      │  │     Hub      │  │    Tools     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  📋 CRM      │  │  🤖 Workflow │  │  🏪 Store    │              │
│  │    Module    │  │   Builder    │  │  (Medusa)    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

### Princípios

| Princípio        | Descrição                            |
| ---------------- | ------------------------------------ |
| **Isolamento**   | Cada plugin opera em sandbox próprio |
| **Lazy Loading** | Plugins carregam sob demanda         |
| **SDK Hooks**    | Todos usam `Panda.*` para integração |

### Template de Plugin

```javascript
/**
 * 🐼 PANDA PLUGIN - Meu Plugin
 * @version 1.0.0
 */
(function (window) {
  "use strict";

  // ============================================
  // METADATA (obrigatório)
  // ============================================
  const PLUGIN_META = {
    id: "meu-plugin",
    name: "Meu Plugin Incrível",
    version: "1.0.0",
    author: "Seu Nome",
    category: "productivity",
    requires: ["pf.sdk"],
    icon: "🚀",
  };

  // ============================================
  // PLUGIN CORE
  // ============================================
  const MeuPlugin = {
    meta: PLUGIN_META,

    async init() {
      console.log(`[${PLUGIN_META.name}] Inicializando...`);
      const licensed = await this.checkLicense();
      if (!licensed) {
        Panda.UI.toast("Plugin não licenciado", "error");
        return false;
      }
      return true;
    },

    async checkLicense() {
      // Verificar via Panda.Data em produção
      return true;
    },

    async minhaFeature(params) {
      // Lógica da feature...
      return { success: true };
    },
  };

  // ============================================
  // REGISTRO NO SDK
  // ============================================
  window.Panda = window.Panda || {};
  window.Panda.Plugins = window.Panda.Plugins || {};
  window.Panda.Plugins[PLUGIN_META.id] = MeuPlugin;

  if (document.readyState === "complete") {
    MeuPlugin.init();
  } else {
    window.addEventListener("load", () => MeuPlugin.init());
  }
})(window);
```

### Checklist de Plugin

- [ ] Metadata completa (id, name, version)
- [ ] Verificação de licença
- [ ] Uso de `Panda.*` para todas operações
- [ ] Tratamento de erros
- [ ] JSDoc em todas funções públicas
- [ ] Não usar CSS inline (usar classes)

### Categorias do Marketplace

| Categoria      | Exemplos                       |
| -------------- | ------------------------------ |
| `social`       | YouTube, TikTok, Meta, Twitter |
| `trading`      | cTrader, MT4/5, Signals        |
| `productivity` | CRM, Agenda, Docs              |
| `automation`   | Workflows, Bots, Scrapers      |
| `analytics`    | Dashboards, Reports            |
| `ai`           | Models, Assistants, Generators |

### Integração SDK

```javascript
// O SDK detecta automaticamente via:
window.Panda.Plugins["meu-plugin"] = MeuPlugin;

// Listar plugins instalados
const plugins = Object.keys(Panda.Plugins);

// Emitir evento do plugin
Panda.emit("plugin:meu-plugin:acao", { data: "valor" });

// Ouvir evento
Panda.on("plugin:meu-plugin:acao", (data) => {
  console.log("Ação recebida:", data);
});

// UI Integration
Panda.UI.addToDock({
  id: "meu-plugin",
  icon: "🚀",
  label: "Meu Plugin",
  onClick: () => MeuPlugin.open(),
});
```

---

> 📖 **Versão:** 1.5.0 | **Consolidado:** SDK + System Design + DX + Observability + Social + Plugins + Canvas/Dock/Collab/Validate + Storage/Google
