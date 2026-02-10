---
tool_context: panda/oss
description: Catálogo de bibliotecas open source aprovadas - 32 libs MIT/Apache
version: 1.1.0
updated: 2026-02-08
---

# 🧩 Panda Factory - Catálogo Open Source

> **Última Atualização:** 2026-02-08  
> **Decisão:** TLDraw com watermark aprovado ✅

---

## 📊 Resumo por Categoria

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    OPEN SOURCE CATALOG                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 🎨 Panda Jam │  │ 🦀 Rust Agent│  │ 🤖 AI Local  │              │
│  │   (3 libs)   │  │   (5 libs)   │  │   (5 libs)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 🔌 MCP Server│  │ 🛒 E-Commerce│  │ 🔥 Firebase  │              │
│  │   (6 libs)   │  │   (3 libs)   │  │   (3 libs)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                            │                                        │
│                   ┌──────────────────┐                             │
│                   │  📦 32+ libs     │                             │
│                   │  MIT/Apache 2.0  │                             │
│                   └──────────────────┘                             │
└─────────────────────────────────────────────────────────────────────┘
```

| Categoria          | Quantidade | Status      |
| ------------------ | ---------- | ----------- |
| 🎨 Panda Jam (UI)  | 3          | ✅ Aprovado |
| 🦀 Rust Agent      | 5          | ✅ Aprovado |
| 🤖 AI Local        | 5          | ✅ Aprovado |
| 🔌 MCP Servers     | 6          | ✅ Aprovado |
| 🛒 E-Commerce      | 3          | ✅ Aprovado |
| 🔥 Google/Firebase | 3          | ✅ Aprovado |
| 📦 Utilitários     | 7          | ✅ Aprovado |
| **TOTAL**          | **32**     | ✅          |

---

## 🎨 PANDA JAM (UI Canvas)

| Biblioteca           | Versão | Licença      | Instalação                          | Uso                  |
| -------------------- | ------ | ------------ | ----------------------------------- | -------------------- |
| **TLDraw** ⭐        | v2     | Apache 2.0\* | `npm i @tldraw/tldraw`              | Canvas infinito      |
| **FlexLayout-React** | 0.8+   | MIT          | `npm i flexlayout-react`            | Multi-window docking |
| **Yjs**              | 13+    | MIT          | `npm i yjs y-websocket y-indexeddb` | Colaboração CRDT     |

> ✅ **TLDraw:** Watermark integrado ao rodapé: "Panda Factory - TLDraw"  
> ⚠️ **dockbar** removido — dock customizado implementado em `PFDock.jsx`

### Instalação Completa

```bash
npm i @tldraw/tldraw flexlayout-react yjs y-websocket y-indexeddb
```

---

## 🦀 RUST AGENT (Desktop)

| Biblioteca           | Versão | Licença    | Instalação             | Uso              |
| -------------------- | ------ | ---------- | ---------------------- | ---------------- |
| **Tauri** ⭐         | v2     | MIT/Apache | `cargo add tauri@2`    | WebView desktop  |
| **RIG Framework** ⭐ | 0.6+   | MIT        | `cargo add rig`        | Multi-LLM agents |
| **whisper-rs**       | 0.10+  | MIT        | `cargo add whisper-rs` | STT bindings     |
| **wry**              | 0.45+  | MIT        | `cargo add wry`        | WebView nativo   |
| **tao**              | 0.30+  | MIT        | `cargo add tao`        | Windowing        |

### Cargo.toml

```toml
[dependencies]
tauri = "2"
rig = "0.6"
whisper-rs = "0.10"
wry = "0.45"
tao = "0.30"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

---

## 🤖 AI LOCAL (LLM/STT/Tradução)

| Biblioteca         | Versão | Licença    | Download                                                     | Uso            |
| ------------------ | ------ | ---------- | ------------------------------------------------------------ | -------------- |
| **Whisper.cpp** ⭐ | Latest | MIT        | [GitHub](https://github.com/ggerganov/whisper.cpp)           | Speech-to-Text |
| **NLLB-200**       | 1.3B   | CC-BY-NC\* | [HuggingFace](https://huggingface.co/facebook/nllb-200-1.3B) | 200 idiomas    |
| **Ollama** ⭐      | Latest | MIT        | [ollama.ai](https://ollama.ai)                               | LLM local      |
| **LM Studio**      | Latest | Free       | [lmstudio.ai](https://lmstudio.ai)                           | UI para LLMs   |
| **candle**         | 0.4+   | MIT        | `cargo add candle-core`                                      | ML em Rust     |

> ⚠️ **NLLB-200:** CC-BY-NC, uso como feature interna (não venda direta)

### Modelos Recomendados

| Modelo             | Tamanho | Uso           |
| ------------------ | ------- | ------------- |
| whisper-base       | ~140MB  | STT rápido    |
| whisper-medium     | ~1.5GB  | STT qualidade |
| nllb-200-distilled | ~600MB  | Tradução leve |
| llama3.2:3b        | ~2GB    | Chat local    |

---

## 🔌 MCP SERVERS (Model Context Protocol)

| Server         | Fonte     | Instalação | Uso                   |
| -------------- | --------- | ---------- | --------------------- |
| **Filesystem** | Anthropic | Built-in   | `fs_read`, `fs_write` |
| **Git**        | Anthropic | Built-in   | Git operations        |
| **GitHub**     | Community | npm        | Repo/PR management    |
| **PostgreSQL** | Archived  | npm        | DB queries            |
| **Puppeteer**  | Archived  | npm        | Browser automation    |
| **Memory**     | Anthropic | Built-in   | Knowledge graph       |

### Referência

- [MCP Servers GitHub](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)

---

## 🛒 E-COMMERCE (Medusa Store)

| Biblioteca              | Versão | Licença | Instalação                  | Uso              |
| ----------------------- | ------ | ------- | --------------------------- | ---------------- |
| **MedusaJS** ⭐         | v2     | MIT     | `npx create-medusa-app`     | Headless store   |
| **@medusajs/admin-sdk** | v2     | MIT     | `npm i @medusajs/admin-sdk` | Admin widgets    |
| **medusa-plugin-\*\***  | -      | MIT     | npm                         | Plugins diversos |

### Setup Rápido

```bash
npx create-medusa-app@latest ./panda-store
cd panda-store
npm run dev
```

---

## 🔥 GOOGLE / FIREBASE

| Biblioteca                    | Versão | Licença    | Instalação                           | Uso             |
| ----------------------------- | ------ | ---------- | ------------------------------------ | --------------- |
| **Firebase SDK**              | 10+    | Apache 2.0 | `npm i firebase`                     | Auth, Firestore |
| **@types/google-apps-script** | 0+     | MIT        | `npm i -D @types/google-apps-script` | GAS types       |
| **clasp**                     | 2.4+   | Apache 2.0 | `npm i -g @google/clasp`             | Deploy GAS      |

### Instalação

```bash
npm i firebase
npm i -D @types/google-apps-script
npm i -g @google/clasp
clasp login
```

---

## 📦 UTILITÁRIOS

| Biblioteca      | Versão | Licença | Instalação                    | Uso                             |
| --------------- | ------ | ------- | ----------------------------- | ------------------------------- |
| **React**       | 18+    | MIT     | `npm i react react-dom`       | Core UI framework               |
| **Zod**         | 3+     | MIT     | `npm i zod`                   | Validação schemas               |
| **React Query** | 5+     | MIT     | `npm i @tanstack/react-query` | Fetch/cache                     |
| **Zustand**     | 5+     | MIT     | `npm i zustand`               | State management                |
| **lz-string**   | 1.5+   | MIT     | `npm i lz-string`             | Compressão strings/localStorage |
| **Vite**        | 5+     | MIT     | `npm create vite`             | Build tool (dev)                |

### Instalação

```bash
npm i zod @tanstack/react-query zustand lz-string
```

---

## ⚡ INSTALAÇÃO COMPLETA

### Frontend (npm) — executar em `11.pf-app/`

```bash
# Core UI
npm i react react-dom @tldraw/tldraw flexlayout-react yjs y-websocket y-indexeddb

# Firebase
npm i firebase

# Utilitários
npm i zod @tanstack/react-query zustand lz-string

# Dev
npm i -D @types/google-apps-script @vitejs/plugin-react vite
```

### Rust Agent (Cargo.toml)

```toml
[dependencies]
tauri = "2"
rig = "0.6"
whisper-rs = "0.10"
wry = "0.45"
tao = "0.30"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
ed25519-dalek = "2"
```

### E-Commerce (separado)

```bash
npx create-medusa-app@latest ./panda-store
```

---

## 📋 LICENÇAS - RESUMO

| Tipo             | Bibliotecas | Ação                  |
| ---------------- | ----------- | --------------------- |
| **MIT**          | 25          | ✅ Livre total        |
| **Apache 2.0**   | 3           | ✅ Livre + crédito    |
| **Apache 2.0\*** | 1 (TLDraw)  | ✅ Watermark aprovado |
| **CC-BY-NC**     | 1 (NLLB)    | ⚠️ Uso interno ok     |

---

## 🔗 Links Úteis

| Recurso       | URL                             |
| ------------- | ------------------------------- |
| TLDraw Docs   | https://tldraw.dev              |
| Tauri v2      | https://v2.tauri.app            |
| RIG Framework | https://rig.rs                  |
| MedusaJS      | https://medusajs.com            |
| Yjs Docs      | https://yjs.dev                 |
| MCP Protocol  | https://modelcontextprotocol.io |

---

> 📝 **Atualizado por:** AI Assistant  
> 📅 **Data:** 2026-02-08
