# 🐼 PANDA FACTORY - CODEX CENTRAL v3.0

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

---

## 📚 ARQUIVOS DE LEITURA OBRIGATÓRIA

### Para QUALQUER tarefa:

| Arquivo           | Motivo                         |
| ----------------- | ------------------------------ |
| `.agent/PANDA.md` | Este arquivo (contexto rápido) |

### Para tarefas de SDK/Backend:

| Arquivo                          | Motivo                        |
| -------------------------------- | ----------------------------- |
| `js/pf.sdk.js`                   | Módulos disponíveis, API mock |
| `docs/PF_MASTER_ARCHITECTURE.md` | Arquitetura completa          |
| `docs/SDK_REFERENCE.md`          | Referência API                |

### Para tarefas de UI/Frontend:

| Arquivo                 | Motivo                |
| ----------------------- | --------------------- |
| `PandaFactory.html`     | Estrutura HTML mestra |
| `css/pf.theme.css`      | Design tokens         |
| `docs/CSS_REFERENCE.md` | Referência CSS        |
| `js/ui/pf.omnibar.js`   | Padrão IIFE           |

### Para Componentes:

| Arquivo                             | Motivo         |
| ----------------------------------- | -------------- |
| `components/Comp_HeaderStatus.html` | Exemplo padrão |
| `js/kernel/pf.components.js`        | Como carregar  |

---

## 1. IDENTIDADE DO PROJETO

| Campo            | Valor                              |
| ---------------- | ---------------------------------- |
| **Nome**         | Panda Factory (PF)                 |
| **Fundador**     | Lucas Valério (5% eterno)          |
| **Plano Google** | AI Ultra (Gemini 3 Pro, Veo 3)     |
| **SDK Versão**   | 0.7.0                              |
| **Missão**       | Democratizar infraestrutura Google |

---

## 2. ESTRUTURA DE CONTAINERS (PandaFactory.html)

```html
<!-- HEAD: Scripts carregados -->
<script src="js/pf.sdk.js"></script>           <!-- 🐼 SDK Mock -->
<link href="css/pf.theme.css">                  <!-- 🎨 Tema -->
<script src="js/ui/pf.omnibar.js" defer></script>
<script src="js/ui/pf.settings.js" defer></script>
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
    <div class="nav-item" title="Dashboard">🏠</div>
    <div class="nav-item" title="Contatos">📋</div>
    <div class="nav-item" title="Agenda">📅</div>
    <!-- etc -->
  </div>

  <!-- DEV TOOLS DOCK (Direita - Ferramentas dev) -->
  <div id="devToolsDock" class="dev-tools-dock">
    <div class="dev-dock-item" title="Extensions">🧩</div>
    <div class="dev-dock-item" title="Console">💻</div>
    <div class="dev-dock-item" title="API">🔌</div>
    <div class="dev-dock-item" title="Database">🗄️</div>
    <div class="dev-dock-item" title="AI">🐼</div>
  </div>

  <!-- SETTINGS MODAL -->
  <div id="settingsOverlay" class="settings-overlay">
    <div class="settings-modal">
      <div class="settings-sidebar">   <!-- Nav lateral -->
      <div class="settings-content">   <!-- Conteúdo seção -->
    </div>
  </div>
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
    FOUNDER_PUBLIC_KEY: "PLACEHOLDER...",  // Chave Ed25519
    verify(message, signature),             // Promise<boolean>
    hash(payload),                          // Promise<string> (SHA-256)
    status()                                // {enabled, version, algorithm}
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
  },

  // ==========================================
  // EVENTOS
  // ==========================================
  on(event, callback),           // Registrar listener
  off(event, callback),          // Remover listener
  emit(event, data),             // Disparar evento

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

## 4. HOOKS DE SEGURANÇA (Biblioteca)

### 4.1 Identity Hook (Ed25519)

```javascript
// SDK: Panda.Auth.signCommand()
const signedCommand = await Panda.Auth.signCommand({
  action: "treasury.burn",
  params: { amount: 10000 },
});
// Retorna:
// {
//   payload: { action, params },
//   signature: "ed25519_19432ab3_signed",
//   timestamp: 1737573600000,
//   signer: "FOUNDER"
// }
```

### 4.2 Constitutional Compliance

```javascript
// SDK: Panda.Governance.validate()
const result = await Panda.Governance.validate("expel_user");
// Retorna:
// {
//   allowed: false,
//   reason: "Viola Art 9.2: Non-Expulsion",
//   violations: [{ article: 9, clause: 2, reason: "..." }]
// }

// Artigos que SEMPRE bloqueiam:
// - expel_user          → Art 9.2 (Non-Expulsion)
// - censor_content      → Art 9.1 (Free Speech)
// - change_constitution → Art 11 (Leis Pétreas)
// - exceed_inflation    → Art 1 (Teto 5%)
```

### 4.3 Signature Verification

```javascript
// SDK: Panda.Crypto.verify()
const isValid = await Panda.Crypto.verify(JSON.stringify(payload), signature);
// Retorna: true/false

// Status do módulo:
Panda.Crypto.status();
// { enabled: false, version: "0.1.0", algorithm: "Ed25519", library: "TweetNaCl (pending)" }
```

### 4.4 Rust Agent Hooks (Futuro)

```rust
// PF_Guard.rs - Implementação Rust
pub fn check_action(user_level: Role, action: Action) -> Result<(), SecurityError> {
    match user_level {
        Role::User => {
            // fs_permission_gate - Pop-up para arquivos sensíveis
            if action.is_sensitive() && !has_user_consent() {
                return Err(SecurityError::NeedsConsent);
            }
            // net_firewall_hook - Bloqueia domínios desconhecidos
            // resource_quota_limiter - Max 80% GPU
        },
        Role::Founder => {
            // Verifica assinatura Ed25519
            if !verify_ed25519_signature(action) {
                return Err(SecurityError::InvalidSignature);
            }
            // Valida contra Constituição
            if violates_constitution(action) {
                return Err(SecurityError::Unconstitutional);
            }
        }
    }
    Ok(())
}
```

---

## 5. CONSTITUIÇÃO (12 ARTIGOS)

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

## 6. INVENTÁRIO JS

### Core

| Arquivo                         | Global        | Descrição       |
| ------------------------------- | ------------- | --------------- |
| `js/pf.sdk.js`                  | `Panda.*`     | SDK Mock v0.7.0 |
| `js/core/pf.ai-core.js`         | `PandaAI.*`   | PAT Treasury    |
| `js/core/pf.firebase-bridge.js` | `PandaBridge` | Signaling       |

### UI Controllers

| Arquivo                 | Global            | Descrição      |
| ----------------------- | ----------------- | -------------- |
| `js/ui/pf.omnibar.js`   | `PandaOmni.*`     | Search/Chat    |
| `js/ui/pf.settings.js`  | `PandaSettings.*` | Settings modal |
| `js/ui/pf.dock-drag.js` | `PandaDock.*`     | Drag & persist |
| `js/ui/pf.modal-pin.js` | `PandaModal.*`    | Pin/Pop-out    |
| `js/ui/pf.devtools.js`  | `window.*`        | DevTools       |

### Kernel

| Arquivo                      | Global           | Descrição     |
| ---------------------------- | ---------------- | ------------- |
| `js/kernel/pf.loader.js`     | `PandaLoader`    | Module loader |
| `js/kernel/pf.components.js` | `loadComponents` | HTML fetcher  |

---

## 7. REFERÊNCIAS

| Documento            | Arquivo                          |
| -------------------- | -------------------------------- |
| Arquitetura Completa | `docs/PF_MASTER_ARCHITECTURE.md` |
| SDK Reference        | `docs/SDK_REFERENCE.md`          |
| CSS Design System    | `docs/CSS_REFERENCE.md`          |
| README               | `README.md`                      |

---

## 8. PROIBIÇÕES

❌ Implementar sem debater primeiro  
❌ CSS inline em componentes  
❌ Chaves/senhas em código  
❌ Violar os 12 Artigos  
❌ Usar `var` (usar `const`/`let`)  
❌ Modificar `Panda.*` (frozen)  
❌ Ignorar Dark Mode  
❌ Esquecer commit/push

---

**Versão:** 3.0.0 | **SDK:** 0.7.0 | **Atualizado:** 2026-01-22
