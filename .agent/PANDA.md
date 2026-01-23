# 🐼 PANDA FACTORY - CODEX CENTRAL v4.0

> **LEIA ANTES DE QUALQUER TAREFA**
> Use: `@.agent/PANDA.md [sua tarefa]`

---

## ⚠️ WORKFLOW OBRIGATÓRIO

### 1. Antes de Implementar

```
→ DEBATER a abordagem com o usuário
→ AGUARDAR confirmação para prosseguir
→ NÃO implementar sem aprovação
```

### 2. Ao Final de QUALQUER Tarefa

```
→ Atualizar documentação afetada (ver tabela abaixo)
→ git add -A && git commit -m "[MODULO] Descrição"
→ git push
```

### 3. Tabela de Atualização Obrigatória

| Se Modificou...    | Atualizar                        |
| ------------------ | -------------------------------- |
| `pf.sdk.js`        | `docs/SDK_REFERENCE.md`          |
| `css/pf.theme.css` | `docs/CSS_REFERENCE.md`          |
| Componentes HTML   | `README.md` (estrutura)          |
| Arquitetura        | `docs/PF_MASTER_ARCHITECTURE.md` |
| JS files novos     | `.agent/PANDA.md` (inventário)   |
| Security/Hooks     | `PF_MASTER_ARCHITECTURE.md` § 8  |
| Backend GAS        | `backend/` e README              |
| Tokenomics         | `docs/PF_FINANCIAL_5Y.md`        |

---

## 📚 ARQUIVOS DE LEITURA POR FASE

### 🔴 SEMPRE (Qualquer tarefa):

| Arquivo           | Motivo                       |
| ----------------- | ---------------------------- |
| `.agent/PANDA.md` | Este arquivo (pilar central) |

### 🟠 SDK/Backend:

| Arquivo                          | Motivo                        |
| -------------------------------- | ----------------------------- |
| `js/pf.sdk.js`                   | Módulos disponíveis, API mock |
| `docs/PF_MASTER_ARCHITECTURE.md` | Arquitetura completa          |
| `docs/SDK_REFERENCE.md`          | Referência API                |
| `backend/core/PF_Dispatcher.gs`  | Entry point GAS               |

### 🟡 UI/Frontend:

| Arquivo                 | Motivo                |
| ----------------------- | --------------------- |
| `PandaFactory.html`     | Estrutura HTML mestra |
| `css/pf.theme.css`      | Design tokens         |
| `docs/CSS_REFERENCE.md` | Referência CSS        |
| `js/ui/pf.omnibar.js`   | Padrão IIFE           |

### 🟢 Componentes HTML:

| Arquivo                              | Motivo         |
| ------------------------------------ | -------------- |
| `components/Comp_HeaderStatus.html`  | Exemplo padrão |
| `components/Comp_SettingsModal.html` | Modal complexo |
| `js/kernel/pf.components.js`         | Como carregar  |

### 🔵 Economia/Tokenomics:

| Arquivo                              | Motivo               |
| ------------------------------------ | -------------------- |
| `docs/PF_FINANCIAL_5Y.md`            | Projeção 5 anos      |
| `docs/PF_MASTER_ARCHITECTURE.md § 9` | Tokenomics detalhado |

---

## 1. IDENTIDADE DO PROJETO

| Campo            | Valor                              |
| ---------------- | ---------------------------------- |
| **Nome**         | Panda Factory (PF)                 |
| **Fundador**     | Lucas Valério (5% eterno)          |
| **Plano Google** | AI Ultra (Gemini 3 Pro, Veo 3)     |
| **SDK Versão**   | 0.7.0                              |
| **Missão**       | Democratizar infraestrutura Google |
| **Repositório**  | github.com/LucassVal/SAAS          |

---

## 2. ESTRUTURA DE CONTAINERS (PandaFactory.html)

```html
<!-- HEAD: Scripts carregados -->
<script src="_system/sdk/repository.js"></script>   <!-- Legacy -->
<script src="_system/sdk/api.js"></script>          <!-- Legacy -->
<script src="_system/core/kernel.js"></script>      <!-- Legacy -->
<script src="js/pf.sdk.js"></script>                <!-- 🐼 SDK Mock -->
<link href="css/pf.theme.css">                       <!-- 🎨 Tema -->
<script src="js/ui/pf.omnibar.js" defer></script>
<script src="js/ui/pf.settings.js" defer></script>
<script src="js/ui/pf.modal-pin.js" defer></script>
<script src="js/core/pf.firebase-bridge.js" defer></script>
<script src="js/core/pf.ai-core.js" defer></script>
<script src="js/ui/pf.dock-drag.js" defer></script>

<!-- BODY: Containers Principais -->
<body class="dark-mode">
  <!-- HEADER STATUS BAR -->
  <header class="minimal-header">
    <div class="header-left">      <!-- Logo + Título -->
    <div class="header-center">    <!-- Status pills (Firebase, Rust, GPU) -->
    <div class="header-right">     <!-- Tema, Lang, User, Settings -->
  </header>

  <!-- MAIN CANVAS (Onde módulos são carregados) -->
  <div id="inicio-view" class="container">
    <!-- Conteúdo dinâmico via PandaLoader -->
  </div>

  <!-- OMNI BAR (Search/Chat/Commands) -->
  <div id="omni-overlay" class="omni-overlay">
    <div class="omni-bar">
      <input id="omni-input">
      <div id="omniChatArea">    <!-- Chat expandido -->
      <div id="omni-results">    <!-- Resultados busca -->
    </div>
  </div>

  <!-- APP DOCK (Esquerda - Apps principais) -->
  <div id="appDock" class="app-dock">
    <div class="dock-handle"></div>   <!-- Drag handle -->
    <div class="nav-item">🏠</div>     <!-- Dashboard -->
    <div class="nav-item">📋</div>     <!-- Contatos -->
    <div class="nav-item">📅</div>     <!-- Agenda -->
    <div class="nav-item">📊</div>     <!-- Relatórios -->
    <div class="nav-item">🏪</div>     <!-- Store -->
  </div>

  <!-- DEV TOOLS DOCK (Direita - Ferramentas dev) -->
  <div id="devToolsDock" class="dev-tools-dock">
    <div class="dev-dock-item">🧩</div>  <!-- Extensions -->
    <div class="dev-dock-item">💻</div>  <!-- Console -->
    <div class="dev-dock-item">🔌</div>  <!-- API -->
    <div class="dev-dock-item">🗄️</div>  <!-- Database -->
    <div class="dev-dock-item">🐼</div>  <!-- AI -->
  </div>

  <!-- SETTINGS MODAL -->
  <div id="settingsOverlay" class="settings-overlay">
    <div class="settings-modal">
      <div class="settings-sidebar">   <!-- Nav lateral -->
      <div class="settings-content">   <!-- Conteúdo seção -->
    </div>
  </div>

  <!-- LOGIN OVERLAY (components/ui/) -->
  <div id="loginOverlay"></div>
</body>
```

---

## 3. SDK - ESTRUTURA DO OBJETO PANDA

```javascript
// js/pf.sdk.js - v0.7.0
window.Panda = {
  // ==========================================
  // AUTENTICAÇÃO & SEGURANÇA
  // ==========================================
  Auth: {
    login(email, password),      // Promise<User>
    logout(),                    // Promise<boolean>
    getUser(),                   // User | null
    isAdmin(),                   // boolean
    isLoggedIn(),                // boolean
    signCommand(payload),        // Promise<{payload, signature, timestamp, signer}>
    isFounder()                  // boolean
  },

  Crypto: {
    FOUNDER_PUBLIC_KEY: "PLACEHOLDER...",
    verify(message, signature),  // Promise<boolean>
    hash(payload),               // Promise<string> (SHA-256)
    status()                     // {enabled, version, algorithm}
  },

  // ==========================================
  // DADOS
  // ==========================================
  Data: {
    get(collection, id),         // Promise<Item>
    list(collection, filter?),   // Promise<Item[]>
    save(collection, data),      // Promise<Item>
    delete(collection, id)       // Promise<boolean>
  },

  Storage: {
    upload(file, onProgress?),   // Promise<{url, size}>
    download(url),               // Promise<Blob>
    delete(url)                  // Promise<boolean>
  },

  // ==========================================
  // ECONOMIA
  // ==========================================
  Wallet: {
    getBalance(),                // Promise<{coins, currency}> (READ-ONLY)
    getHistory()                 // Promise<Transaction[]>
    // charge/credit são INTERNOS
  },

  // ==========================================
  // IA
  // ==========================================
  Brain: {
    chat(message, options?),     // Promise<{response, tokens}>
    analyze(data)                // Promise<{sentiment, summary}>
  },

  GPU: {
    isAvailable(),               // Promise<boolean>
    process(model, input)        // Promise<{result, device}>
  },

  // ==========================================
  // COMUNICAÇÃO
  // ==========================================
  Bridge: {
    execute(tool, params),       // Promise<{success, data}>
    isConnected(),               // boolean
    _mockConnect(bool)           // void (teste)
  },

  // ==========================================
  // UI
  // ==========================================
  UI: {
    toast(msg, type?, duration?), // void
    modal(options),               // Promise<{confirmed}>
    loading(show, msg?)           // void
  },

  // ==========================================
  // GOVERNANÇA (Frozen - Imutável)
  // ==========================================
  Governance: {
    getConstitution(),           // {articles[], splits, fundAllocation}
    getArticle(id),              // {id, name, rule}
    getSplits(),                 // {primary, p2pPreChain, p2pOnChain}
    validate(action, params)     // Promise<{allowed, reason, article?}>
  },

  PAT: {
    getStatus(),                 // Promise<{inflation, reserve, deflation}>
    execute(tool, params?)       // Promise<{success, action, amount?}>
    // Tools: reinvest, accelerate, vesting, burn
  },

  // ==========================================
  // EVENTOS
  // ==========================================
  on(event, callback),
  off(event, callback),
  emit(event, data),

  // ==========================================
  // CONFIG
  // ==========================================
  Config: { mode, version, debug, agentConnected },
  version(),                     // "0.7.0"
  setMode(mode)                  // 'LOCAL' | 'CLOUD'
};

// TODOS OS MÓDULOS SÃO FROZEN (Object.freeze)
```

---

## 4. EVENTOS DO SISTEMA

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
| `pat:change`       | `{inflation, reserve}`        | PAT state        |

---

## 5. HOOKS DE SEGURANÇA

### 5.1 Identity Hook (Ed25519)

```javascript
const signedCommand = await Panda.Auth.signCommand({
  action: "treasury.burn",
  params: { amount: 10000 },
});
// { payload, signature: "ed25519_...", timestamp, signer: "FOUNDER" }
```

### 5.2 Constitutional Compliance

```javascript
const result = await Panda.Governance.validate("expel_user");
// { allowed: false, reason: "Viola Art 9.2: Non-Expulsion" }

// Ações SEMPRE bloqueadas:
// - expel_user → Art 9.2 (Non-Expulsion)
// - censor_content → Art 9.1 (Free Speech)
// - change_constitution → Art 11 (Leis Pétreas)
// - exceed_inflation → Art 1 (Teto 5%)
```

### 5.3 Signature Verification

```javascript
const isValid = await Panda.Crypto.verify(JSON.stringify(payload), signature);
Panda.Crypto.status(); // { enabled: false, algorithm: "Ed25519" }
```

### 5.4 Rust Agent Hooks (Futuro)

```rust
pub fn check_action(user_level: Role, action: Action) -> Result<(), SecurityError> {
    match user_level {
        Role::User => {
            // fs_permission_gate, net_firewall_hook, resource_quota_limiter
        },
        Role::Founder => {
            // verify_ed25519_signature, violates_constitution
        }
    }
}
```

---

## 6. CONSTITUIÇÃO (12 ARTIGOS)

| #   | Nome           | Regra                      | Hook                   |
| --- | -------------- | -------------------------- | ---------------------- |
| 1   | Teto Inflação  | Max 5% ao ano              | `exceed_inflation`     |
| 2   | Panda Labs     | 25% Fundo → Educação       | -                      |
| 3   | Reserva Ops    | 20% Lucro → Caixa          | -                      |
| 4   | Crescimento    | 65% Fundo → Ação           | -                      |
| 5   | Piso Preço     | 2.5x (Min 1.25x)           | -                      |
| 6   | Founder Fee    | 5% Bruto Eterno            | -                      |
| 7   | Garantia Host  | 90-95%                     | -                      |
| 8   | Reserva Fundo  | Max 10%                    | `exceed_reserve`       |
| 9   | Bill of Rights | Free Speech, Non-Expulsion | `expel_user`, `censor` |
| 10  | Arbitragem     | IA → Founder               | -                      |
| 11  | Leis Pétreas   | Imutável                   | `change_constitution`  |
| 12  | Emergência     | Failover Agent             | -                      |

---

## 7. INVENTÁRIO COMPLETO

### 🐼 SDK & Core (js/)

| Arquivo                         | Global        | Descrição       |
| ------------------------------- | ------------- | --------------- |
| `js/pf.sdk.js`                  | `Panda.*`     | SDK Mock v0.7.0 |
| `js/core/pf.ai-core.js`         | `PandaAI.*`   | PAT Treasury    |
| `js/core/pf.firebase-bridge.js` | `PandaBridge` | Signaling       |

### 🎨 UI Controllers (js/ui/)

| Arquivo           | Global            | Descrição      |
| ----------------- | ----------------- | -------------- |
| `pf.omnibar.js`   | `PandaOmni.*`     | Search/Chat    |
| `pf.settings.js`  | `PandaSettings.*` | Settings modal |
| `pf.dock-drag.js` | `PandaDock.*`     | Drag & persist |
| `pf.modal-pin.js` | `PandaModal.*`    | Pin/Pop-out    |
| `pf.devtools.js`  | `window.*`        | DevTools       |
| `pf.dock.js`      | `DockController`  | (export class) |

### 🔧 Kernel (js/kernel/)

| Arquivo            | Global           | Descrição     |
| ------------------ | ---------------- | ------------- |
| `pf.loader.js`     | `PandaLoader`    | Module loader |
| `pf.components.js` | `loadComponents` | HTML fetcher  |

### 🧩 Features (js/features/)

| Arquivo          | Global          | Descrição             |
| ---------------- | --------------- | --------------------- |
| `AiAssistant.js` | `AiAssistant.*` | Chat flutuante legado |

### 📦 Componentes HTML (components/)

| Arquivo                     | Descrição               |
| --------------------------- | ----------------------- |
| `Comp_HeaderStatus.html`    | Header com status pills |
| `Comp_AppDock.html`         | Dock principal          |
| `Comp_DevToolsDock.html`    | Dock desenvolvedor      |
| `Comp_SettingsModal.html`   | Modal configurações     |
| `Comp_Sidebar.html`         | Sidebar IA              |
| `ui/Comp_LoginOverlay.html` | Overlay de login        |
| `ui/Comp_AgendaDrawer.html` | Drawer de agenda        |

### 📜 Backend GAS (backend/)

| Arquivo                    | Descrição                     |
| -------------------------- | ----------------------------- |
| `core/PF_Dispatcher.gs`    | Entry point (doGet/doPost)    |
| `core/PF_Config.gs`        | Configurações                 |
| `core/PF_Core_AI.gs`       | IA backend                    |
| `core/PF_Core_Oracle.gs`   | Oracle de preços              |
| `core/PF_Core_Webhooks.gs` | Webhooks                      |
| `core/PF_App_Init.gs`      | Inicialização                 |
| `domains/`                 | finance/, store/, automation/ |

### 🗄️ Legacy (\_system/)

| Pasta           | Descrição             |
| --------------- | --------------------- |
| `_system/core/` | kernel.js, loader.js  |
| `_system/sdk/`  | repository.js, api.js |

---

## 8. DOCUMENTOS DO PROJETO

| Documento         | Arquivo                          | Conteúdo                        |
| ----------------- | -------------------------------- | ------------------------------- |
| **README**        | `README.md`                      | Visão geral, roadmap, changelog |
| **Arquitetura**   | `docs/PF_MASTER_ARCHITECTURE.md` | 1100+ linhas, tudo técnico      |
| **SDK Reference** | `docs/SDK_REFERENCE.md`          | API do Panda.\*                 |
| **CSS Reference** | `docs/CSS_REFERENCE.md`          | Design tokens                   |
| **Financial**     | `docs/PF_FINANCIAL_5Y.md`        | Projeção 5 anos                 |
| **AI Context**    | `.agent/PANDA.md`                | Este arquivo                    |

---

## 9. GLOBALS DISPONÍVEIS

| Global                 | Origem                | Descrição     |
| ---------------------- | --------------------- | ------------- |
| `window.Panda`         | pf.sdk.js             | SDK principal |
| `window.PandaAI`       | pf.ai-core.js         | PAT Treasury  |
| `window.PandaBridge`   | pf.firebase-bridge.js | Firebase      |
| `window.PandaOmni`     | pf.omnibar.js         | OmniBar       |
| `window.PandaSettings` | pf.settings.js        | Settings      |
| `window.PandaDock`     | pf.dock-drag.js       | Docks         |
| `window.PandaModal`    | pf.modal-pin.js       | Modais        |
| `window.PandaLoader`   | pf.loader.js          | Modules       |
| `window.AiAssistant`   | AiAssistant.js        | Chat legado   |

---

## 10. CONSOLE QUICK REFERENCE

```javascript
// SDK
Panda.version(); // "0.7.0"
Panda.Config; // { mode, debug, ... }
Panda.Bridge._mockConnect(true); // Simular Agent

// Governança
Panda.Governance.getConstitution(); // 12 Artigos
Panda.Governance.validate("expel_user");

// PAT Treasury
await Panda.PAT.getStatus();
await Panda.PAT.execute("reinvest");

// Crypto
await Panda.Auth.signCommand({ action: "test" });
Panda.Crypto.status();

// UI Controllers
PandaDock.reset(); // Reset posições
PandaOmni.toggle(); // Toggle omnibar
PandaSettings.open(); // Abrir settings
```

---

## 11. PROIBIÇÕES

❌ Implementar sem debater primeiro  
❌ CSS inline em componentes  
❌ Chaves/senhas em código  
❌ Violar os 12 Artigos  
❌ Usar `var` (usar `const`/`let`)  
❌ Modificar `Panda.*` (frozen)  
❌ Ignorar Dark Mode  
❌ Esquecer commit/push  
❌ Esquecer atualizar docs

---

## 12. GOOGLE AI ULTRA TOOLS

| Tool              | Uso                  |
| ----------------- | -------------------- |
| **Antigravity**   | Agentes Gemini 3 Pro |
| **Jules**         | GitHub code tasks    |
| **Gemini CLI**    | Terminal AI          |
| **Code Assist**   | VS Code/JetBrains    |
| **Deep Research** | Pesquisa aprofundada |
| **Flow/Whisk**    | Vídeo Veo 3          |
| **NotebookLM**    | 600 fontes, Audio    |

---

**Versão:** 4.0.0 | **SDK:** 0.7.0 | **Atualizado:** 2026-01-22
