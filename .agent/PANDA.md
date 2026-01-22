# 🐼 PANDA FACTORY - CODEX CENTRAL

> **Documento de Contexto Unificado para IA Antigravity**
> Use: `@.agent/PANDA.md [tarefa]`

---

## 1. IDENTIDADE DO PROJETO

**Panda Factory (PF)** é um Sistema Operacional Modular para Desenvolvedores.

| Campo            | Valor                              |
| ---------------- | ---------------------------------- |
| **Fundador**     | Lucas Valério (5% eterno)          |
| **Mascote**      | Panda 🐼                           |
| **Plano Google** | AI Ultra (Gemini 3 Pro, Veo 3)     |
| **SDK Versão**   | 0.7.0                              |
| **Missão**       | Democratizar infraestrutura Google |

---

## 2. MAPA ARQUITETURAL

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Panda UI)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  App Dock   │  │  DevTools   │  │  Sidebar    │  │  Modules    │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         └────────────────┴────────────────┴────────────────┘            │
│                                   │                                      │
│                          ┌────────▼────────┐                            │
│                          │   PANDA SDK     │  ← O "Colchão"             │
│                          │  (pf.sdk.js)    │                            │
│                          └────────┬────────┘                            │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   🦀 RUST AGENT     │  │   🔥 FIREBASE       │  │   📜 GOOGLE APPS    │
│   (futuro)          │  │   (Signaling)       │  │   SCRIPT (Backend)  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 3. INVENTÁRIO DE ARQUIVOS JS

### 🐼 SDK & Core (js/)

| Arquivo                        | Descrição               | Global        |
| ------------------------------ | ----------------------- | ------------- |
| **pf.sdk.js**                  | SDK Mock Oficial v0.7.0 | `Panda.*`     |
| **core/pf.ai-core.js**         | PAT (Panda AI Treasury) | `PandaAI.*`   |
| **core/pf.firebase-bridge.js** | Firebase Signaling      | `PandaBridge` |

### 🎨 UI Controllers (js/ui/)

| Arquivo             | Descrição                           | Global            |
| ------------------- | ----------------------------------- | ----------------- |
| **pf.omnibar.js**   | Search, Chat, Commands              | `PandaOmni.*`     |
| **pf.settings.js**  | Modal configurações                 | `PandaSettings.*` |
| **pf.dock-drag.js** | Drag & drop para docks              | `PandaDock.*`     |
| **pf.modal-pin.js** | Pin/Pop-out modais                  | `PandaModal.*`    |
| **pf.devtools.js**  | DevTools dock + functions           | `window.*`        |
| **pf.dock.js**      | DockController class                | `export class`    |
| **pf.drag.js**      | ⚠️ DUPLICADO (usar pf.dock-drag.js) | -                 |

### 🔧 Kernel (js/kernel/)

| Arquivo              | Descrição          | Global             |
| -------------------- | ------------------ | ------------------ |
| **pf.loader.js**     | ModuleLoader class | `PandaLoader`      |
| **pf.components.js** | Component fetcher  | `loadComponents()` |

### 📁 Features (js/features/)

| Arquivo            | Descrição             | Global          |
| ------------------ | --------------------- | --------------- |
| **AiAssistant.js** | Chat flutuante legado | `AiAssistant.*` |

### 🗑️ Removíveis

| Arquivo           | Motivo                        |
| ----------------- | ----------------------------- |
| **dock-utils.js** | Stub vazio (2 linhas)         |
| **pf.drag.js**    | Duplicado por pf.dock-drag.js |
| **sw.js**         | Service Worker desatualizado  |

---

## 4. SDK MÓDULOS (pf.sdk.js)

```javascript
window.Panda = {
  // Autenticação & Segurança
  Auth: { login, logout, getUser, isAdmin, isLoggedIn, signCommand, isFounder },
  Crypto: { FOUNDER_PUBLIC_KEY, verify, hash, status },

  // Dados
  Data: { get, list, save, delete },
  Storage: { upload, download, delete },

  // Economia
  Wallet: { getBalance, getHistory },

  // IA
  Brain: { chat, analyze },
  GPU: { isAvailable, process },

  // Comunicação
  Bridge: { execute, isConnected, _mockConnect },

  // UI
  UI: { toast, modal, loading },

  // Governança
  Governance: { getConstitution, getArticle, getSplits, validate },
  PAT: { getStatus, execute },

  // Eventos
  on, off, emit,

  // Config
  Config, version, setMode
};
```

---

## 5. HOOKS DE SEGURANÇA

| Hook                          | Nível    | Status                     |
| ----------------------------- | -------- | -------------------------- |
| **Identity Hook**             | SDK      | ✅ `Auth.signCommand()`    |
| **constitutional_compliance** | SDK      | ✅ `Governance.validate()` |
| **admin_signature_verify**    | SDK/Rust | ✅ Mock, ⏳ Rust Agent     |
| **fs_permission_gate**        | Rust     | ⏳ Futuro                  |
| **net_firewall_hook**         | Rust     | ⏳ Futuro                  |
| **resource_quota_limiter**    | Rust     | ⏳ Futuro                  |
| **database_schema_lock**      | GAS      | ⏳ Futuro                  |

---

## 6. CONSTITUIÇÃO (12 ARTIGOS)

| #   | Artigo         | Regra                                |
| --- | -------------- | ------------------------------------ |
| 1   | Teto Inflação  | Max 5% ao ano                        |
| 2   | Panda Labs     | 25% do Fundo → Educação              |
| 3   | Reserva Ops    | 20% do Lucro → Caixa                 |
| 4   | Crescimento    | 65% do Fundo → Ação                  |
| 5   | Piso Preço     | 2.5x (Min 1.25x)                     |
| 6   | Founder Fee    | 5% Bruto Eterno                      |
| 7   | Garantia Host  | 90-95% (Taxa P2P 5-10%)              |
| 8   | Reserva Fundo  | Max 10%                              |
| 9   | Bill of Rights | Free Speech, Non-Expulsion, Rust Law |
| 10  | Arbitragem     | IA → Founder                         |
| 11  | Leis Pétreas   | Imutável                             |
| 12  | Emergência     | Failover Agent                       |

---

## 7. GOOGLE AI ULTRA

| Tool            | Uso                  |
| --------------- | -------------------- |
| **Antigravity** | Agentes Gemini 3 Pro |
| **Jules**       | GitHub code tasks    |
| **Gemini CLI**  | Terminal AI          |
| **Code Assist** | VS Code/JetBrains    |
| **Flow/Whisk**  | Vídeo Veo 3          |
| **NotebookLM**  | 600 fontes           |

---

## 8. PADRÕES DE CÓDIGO

### CSS

```css
.componente {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}
```

### JavaScript (Módulo IIFE)

```javascript
(function () {
  "use strict";

  function init() {
    console.log("🐼 Module initialized");
  }

  document.addEventListener("DOMContentLoaded", init);

  window.ModuleName = {
    /* public API */
  };
})();
```

### Commits

```
[SDK] Add Crypto.verify() method
[UI] Fix header spacing
[DOCS] Update PANDA.md
```

---

## 9. QUICK REFERENCE

### Console

```javascript
Panda.version(); // "0.7.0"
Panda.Bridge._mockConnect(true); // Agent online
PandaDock.reset(); // Reset posições
await Panda.Auth.signCommand({}); // Ed25519 mock
Panda.Governance.validate("expel_user"); // Testar regra
```

### CSS Variables

```css
var(--bg-app)         var(--bg-card)       var(--bg-panel)
var(--text-primary)   var(--text-secondary)
var(--border-subtle)  var(--accent-success) var(--accent-error)
```

---

## 10. PROIBIÇÕES

❌ CSS inline em componentes  
❌ Chaves/senhas em código  
❌ Violar os 12 Artigos  
❌ Usar `var` (usar `const`/`let`)  
❌ Modificar `Panda.*` (frozen)  
❌ Ignorar Dark Mode

---

**Versão:** 2.0.0 | **SDK:** 0.7.0 | **Atualizado:** 2026-01-22
