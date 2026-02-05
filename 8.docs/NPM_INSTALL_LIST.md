# 📦 PANDA FACTORY - LISTA COMPLETA DE DEPENDÊNCIAS

> **Fonte:** `docs/PF_OPENSOURCE_CATALOG.md`  
> **30 bibliotecas aprovadas** ✅

---

## ⚡ INSTALAÇÃO RÁPIDA (PowerShell)

### 1️⃣ JAM CANVAS (Principal)

```powershell
cd "C:\Users\Lucas Valério\Desktop\Panda Factory\jam"
npm install
npm run dev
```

### 2️⃣ RAIZ (Opcional - já tem medusa)

```powershell
cd "C:\Users\Lucas Valério\Desktop\Panda Factory"
npm install
```

---

## 🎨 PANDA JAM (UI Canvas)

```bash
npm i @tldraw/tldraw flexlayout-react yjs y-websocket y-indexeddb dockbar
```

| Pacote            | Uso                  |
| :---------------- | :------------------- |
| @tldraw/tldraw    | Canvas infinito      |
| flexlayout-react  | Multi-window docking |
| yjs + y-websocket | Colaboração CRDT     |
| dockbar           | Dock macOS style     |

---

## 🔥 FIREBASE / GOOGLE

```bash
npm i firebase
npm i -D @types/google-apps-script
npm i -g @google/clasp
```

---

## 📦 UTILITÁRIOS

```bash
npm i zod @tanstack/react-query zustand
```

| Pacote                | Uso               |
| :-------------------- | :---------------- |
| zod                   | Validação schemas |
| @tanstack/react-query | Fetch/cache       |
| zustand               | State management  |

---

## 🛒 E-COMMERCE (Medusa - Separado)

```bash
npx create-medusa-app@latest ./panda-store
```

---

## 🦀 RUST AGENT (Cargo.toml)

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

---

## 🤖 AI LOCAL (Downloads)

| Modelo             | Tamanho | URL                                   |
| :----------------- | :------ | :------------------------------------ |
| whisper-base       | ~140MB  | huggingface.co/openai/whisper-base    |
| nllb-200-distilled | ~600MB  | huggingface.co/facebook/nllb-200-1.3B |
| llama3.2:3b        | ~2GB    | ollama.ai                             |

---

## 📋 COMANDO COMPLETO (TUDO DE UMA VEZ)

```powershell
# 1. Jam Canvas
cd "C:\Users\Lucas Valério\Desktop\Panda Factory\jam"
npm install

# 2. Extras (opcional, após jam funcionar)
npm i firebase zod @tanstack/react-query zustand
npm i -D @types/google-apps-script

# 3. Clasp global (deploy GAS)
npm i -g @google/clasp

# 4. Rodar
npm run dev
```

---

**Atualizado:** 2026-01-26 02:00

