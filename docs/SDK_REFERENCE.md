# 🐼 Panda SDK - Referência da Biblioteca

> **Versão:** 0.5.1 | **Status:** Mock (Development) | **Arquivo:** `js/pf.sdk.js`

---

## 📋 Índice

1. [Instalação](#instalação)
2. [Módulos Públicos](#módulos-públicos)
3. [Event Bus](#event-bus)
4. [Classificação de Segurança](#classificação-de-segurança)
5. [Changelog](#changelog)

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

## Módulos Públicos

### 🔐 Panda.Auth

Gerenciamento de identidade e sessão.

| Método                   | Retorno            | Descrição                                                   |
| ------------------------ | ------------------ | ----------------------------------------------------------- |
| `login(email, password)` | `Promise<User>`    | Autentica usuário. Use `password='erro'` para testar falha. |
| `logout()`               | `Promise<boolean>` | Encerra sessão                                              |
| `getUser()`              | `User \| null`     | Retorna usuário atual (síncrono)                            |
| `isAdmin()`              | `boolean`          | Verifica se é admin                                         |
| `isLoggedIn()`           | `boolean`          | Verifica se está logado                                     |

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

Inteligência Artificial (Gemini/Claude/GPT).

| Método                    | Retorno                         | Descrição        |
| ------------------------- | ------------------------------- | ---------------- |
| `chat(message, options?)` | `Promise<{response, tokens}>`   | Chat com IA      |
| `analyze(data)`           | `Promise<{sentiment, summary}>` | Análise de dados |

```javascript
const { response } = await Panda.Brain.chat("Analise minhas vendas");
```

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

---

### 🎨 Panda.UI

Helpers de interface padronizados.

| Método                         | Retorno                | Descrição         |
| ------------------------------ | ---------------------- | ----------------- |
| `toast(msg, type?, duration?)` | `void`                 | Exibe notificação |
| `modal(options)`               | `Promise<{confirmed}>` | Modal com Promise |
| `loading(show, msg?)`          | `void`                 | Indicador global  |

**Tipos de toast:** `'info'`, `'success'`, `'error'`, `'warning'`

```javascript
Panda.UI.toast("Salvo com sucesso!", "success");

const result = await Panda.UI.modal({
  title: "Confirmar",
  message: "Deletar item?",
});
if (result.confirmed) {
  /* ... */
}
```

> ⚠️ **Contrato Modal:** A UI deve emitir `Panda.emit('ui:modal:response', { confirmed: true/false })` ao fechar o modal.

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

---

## Changelog

### [0.5.1] - 2026-01-22

- **Security:** `Wallet.charge/credit` agora são internos
- **Feature:** `Wallet.getHistory()` adicionado
- **Fix:** Modal timeout de 30s para evitar Promise eterna
- **Fix:** LocalStorage persistence para Auth

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
