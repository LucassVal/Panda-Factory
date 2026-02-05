# 🐼 Panda SDK - Referência da Biblioteca

> **Versão:** 0.9.5 | **Status:** Mock (Development) | **Atualizado:** 2026-01-27
> **Arquivo:** `js/pf.sdk.js`

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
9. [Changelog](#changelog)

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
<script src="js/pf.sdk.js"></script>

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

## 🐙 Tentacle Architecture (NEW)

> **Modelo:** SDK → Tentáculos → Pais → Filhos

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

> 📍 **Localização:** `js/tentacles/google/` (parent + 7 children)

---

## Changelog

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

## Tentacle Architecture

> **Consolidado de:** PF_MASTER_ARCHITECTURE.md §4.3

A arquitetura de extensões do SDK é baseada em "Tentáculos" - módulos de integração.

### Estrutura de Arquivos

```text
js/tentacles/                         # 8 Integration Modules
├── brain/                            ← AI/ML
│   ├── pf.brain-parent.js
│   └── children/
│       ├── gemini.js                 ← Gemini API
│       ├── local-llm.js              ← Ollama/LM Studio
│       ├── gpu.js                    ← WebGPU detection
│       └── vision.js                 ← Image analysis
├── social/                           ← Social Media
│   ├── pf.social-parent.js
│   └── children/
│       ├── whatsapp.js               ← Evolution API/Baileys
│       ├── twitter.js
│       ├── youtube.js
│       ├── meta.js
│       └── telegram.js
├── trading/                          ← Financial Markets
│   ├── pf.trading-parent.js
│   └── children/ctrader.js           ← cTrader Open API
├── google/                           ← Google Services
│   ├── pf.google-parent.js
│   └── children/
│       ├── drive.js
│       ├── sheets.js
│       ├── colab.js
│       ├── calendar.js
│       ├── docs.js
│       ├── gmail.js
│       └── youtube.js
├── distribution/                     ← App Publishing
│   ├── pf.distribution-parent.js
│   └── children/
│       ├── pwa.js
│       ├── itch.js
│       ├── steam.js
│       ├── android.js
│       ├── ios.js
│       └── arcade.js
├── education/                        ← EdTech Platforms
│   ├── pf.education-parent.js
│   └── children/
│       ├── kiwify.js
│       ├── hotmart.js
│       └── eduzz.js
├── github/                           ← GitHub Integration
│   ├── pf.github-parent.js
│   └── children/
│       ├── pages.js                  ← GitHub Pages deploy
│       ├── jsondb.js                 ← JSON as database
│       └── actions.js                ← CI/CD workflows
└── monitor/                          ← System Health
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
- **Observabilidade:** DevTools UI (F12) visualiza tudo

---

> 📖 **Versão:** 0.9.6 | **Consolidado:** SDK + Tentacle Architecture
