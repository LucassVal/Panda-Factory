# 🐼 PANDA FACTORY - CODEX CENTRAL v5.0

![Panda Logo](../assets/panda_logo.png)

> **LEIA ANTES DE QUALQUER TAREFA**
> Use: `@.agent/PANDA.md [sua tarefa]`

---

## 🔗 PROTOCOLO DE CROSS-REFERENCE

> **⚠️ ANTES de editar este arquivo ou qualquer doc, VERIFIQUE os outros:**

| Documento                                                                        | Índice      | Quando Verificar                      |
| -------------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| [PF_MASTER_ARCHITECTURE.md](../docs/PF_MASTER_ARCHITECTURE.md)                   | § 1-11      | Arquitetura, SDK, Backend, Tokenomics |
| [PF_SDK_REFERENCE.md](../docs/PF_SDK_REFERENCE.md)                               | Módulos     | API Panda.\*                          |
| [PF_TOKENOMICS_REFERENCE.md](../docs/PF_TOKENOMICS_REFERENCE.md)                 | §9 Completo | PC, PAT, Treasury, Constituição       |
| [PF_CSS_REFERENCE.md](../docs/PF_CSS_REFERENCE.md)                               | Tokens      | Design System                         |
| [PF_PLUGIN_AND_MODULAR_REFERENCE.md](../docs/PF_PLUGIN_AND_MODULAR_REFERENCE.md) | Plugins     | Apps, Plugins, cTrader, Marketplace   |
| [PF_GAS_REFERENCE.md](../docs/PF_GAS_REFERENCE.md)                               | Backend     | Google Apps Script                    |
| [ROADMAP_ESTRATEGICO.md](../docs/ROADMAP_ESTRATEGICO.md)                         | Fases 1-4   | Google Partner, P2P Compute, VSX      |
| [README.md](../README.md)                                                        | Quick Start | Entry point para devs                 |

### Índice Cruzado (PANDA.md ↔ PF_MASTER_ARCHITECTURE.md)

| PANDA.md Seção           | Equivalente em PF_MASTER_ARCHITECTURE.md |
| ------------------------ | ---------------------------------------- |
| §1 Identidade + AI Cores | §1 Visão Geral, §7.5 Deployment Tiers    |
| §2 Containers            | §2 Camada Frontend                       |
| §3 SDK (Panda.\*)        | §3 Panda SDK                             |
| §4 Constituição          | §9.3 Hierarquia de Governança            |
| §5 Inventário JS         | §2 + §10 Roadmap                         |

> **REGRAS DE SINCRONIZAÇÃO:**
>
> 1. Ao editar algo aqui, verifique se existe equivalente no `PF_MASTER_ARCHITECTURE.md`
> 2. Ao editar o SDK, atualize também o `PF_SDK_REFERENCE.md`
> 3. Ao editar CSS/Design, atualize também o `PF_CSS_REFERENCE.md`
> 4. **Ao criar NOVO arquivo PF\_\*, adicione-o nesta tabela de cross-reference**

### 🐙 Repositórios GitHub

| Repositório             | Tipo       | URL                                                                                          |
| ----------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| **panda-fabrics**       | 🔒 Privado | [github.com/LucassVal/SAAS](https://github.com/LucassVal/SAAS)                               |
| **panda-sdk**           | 🌐 Público | [github.com/LucassVal/panda-sdk](https://github.com/LucassVal/panda-sdk)                     |
| **panda-sdk-community** | 🌐 Público | [github.com/LucassVal/panda-sdk-community](https://github.com/LucassVal/panda-sdk-community) |

---

## ⚠️ WORKFLOW OBRIGATÓRIO

### 1. Antes de Implementar

```text
→ DEBATER a abordagem com o usuário
→ AGUARDAR confirmação para prosseguir
→ NÃO implementar sem aprovação
```

### 2. Ao Final de QUALQUER Tarefa

```text
→ Atualizar documentação afetada (ver tabela abaixo)
→ git add -A && git commit -m "[MODULO] Descrição"
→ git push
```

### 3. Tabela de Atualização Obrigatória

| Se Modificou...    | Atualizar                                 |
| ------------------ | ----------------------------------------- |
| `pf.sdk.js`        | `docs/PF_SDK_REFERENCE.md`                |
| `css/pf.theme.css` | `docs/PF_CSS_REFERENCE.md`                |
| Componentes HTML   | `docs/PF_HTML_REFERENCE.md`               |
| Arquitetura        | `docs/PF_MASTER_ARCHITECTURE.md`          |
| JS files novos     | `.agent/PANDA.md` (inventário)            |
| Security/Hooks     | `PF_MASTER_ARCHITECTURE.md` § 8           |
| Backend GAS        | `docs/PF_GAS_REFERENCE.md`                |
| Tokenomics         | `PF_MASTER_ARCHITECTURE.md` § 9           |
| Plugins/Módulos    | `docs/PF_PLUGIN_AND_MODULAR_REFERENCE.md` |
| Trading/cTrader    | `docs/PF_CTRADER_REFERENCE.md`            |

---

## 📚 ARQUIVOS DE LEITURA POR FASE

### 🔴 SEMPRE (Qualquer tarefa)

| Arquivo           | Motivo                       |
| ----------------- | ---------------------------- |
| `.agent/PANDA.md` | Este arquivo (pilar central) |

### 🟠 SDK/Backend

| Arquivo                          | Motivo                        |
| -------------------------------- | ----------------------------- |
| `js/pf.sdk.js`                   | Módulos disponíveis, API mock |
| `docs/PF_MASTER_ARCHITECTURE.md` | Arquitetura completa          |
| `docs/PF_SDK_REFERENCE.md`       | Referência API                |
| `backend/core/PF_Dispatcher.gs`  | Entry point GAS               |

### 🟡 UI/Frontend

| Arquivo                     | Motivo                     |
| --------------------------- | -------------------------- |
| `PandaFactory.html`         | Estrutura HTML mestra      |
| `css/pf.theme.css`          | Design tokens              |
| `docs/PF_CSS_REFERENCE.md`  | Referência CSS             |
| `docs/PF_HTML_REFERENCE.md` | Arquitetura de componentes |
| `js/ui/pf.omnibar.js`       | Padrão IIFE                |

### 🟢 Componentes HTML

| Arquivo                                  | Motivo              |
| ---------------------------------------- | ------------------- |
| `components/Comp_HeaderStatus.html`      | Header + Treasury   |
| `components/Comp_SettingsModal.html`     | Modal configurações |
| `components/Comp_TreasuryDashboard.html` | Dashboard Treasury  |
| `components/Comp_AppDock.html`           | Dock v4.0           |
| `js/kernel/pf.components.js`             | Como carregar       |

### 🔵 Economia/Tokenomics

| Arquivo                              | Motivo               |
| ------------------------------------ | -------------------- |
| `docs/PF_MASTER_ARCHITECTURE.md § 9` | Tokenomics detalhado |

### 🟣 Deployment/Modularização

| Arquivo                                | Motivo                    |
| -------------------------------------- | ------------------------- |
| `docs/PF_MASTER_ARCHITECTURE.md § 7.5` | Tiers (Shell/Hybrid/Full) |
| `panda.config.js` (exemplo)            | Configuração White Label  |

### 🦀 Rust Agent

| Arquivo                                  | Motivo                      |
| ---------------------------------------- | --------------------------- |
| `docs/PF_MASTER_ARCHITECTURE.md § 4`     | Arquitetura Rust Agent      |
| `docs/PF_MASTER_ARCHITECTURE.md § 4.7.G` | Polyglot (NLLB-200/Whisper) |
| `docs/PF_MASTER_ARCHITECTURE.md § 4.7.H` | Download Progressivo        |

### 🌍 i18n / Polyglot

| Arquivo                | Motivo                        |
| ---------------------- | ----------------------------- |
| `js/core/pf.i18n.js`   | Sistema de tradução UI        |
| `Panda.Polyglot` (SDK) | Tradução global (200 idiomas) |

---

## 0. CONVENÇÕES DE NOMENCLATURA

> **REGRA:** Todos os arquivos de documentação devem ter prefixo `PF_` para identificação do projeto.

### Estrutura de Documentação

| Arquivo                          | Tipo        | Descrição                |
| -------------------------------- | ----------- | ------------------------ |
| `.agent/PANDA.md`                | Codex       | Central de regras (este) |
| `docs/PF_MASTER_ARCHITECTURE.md` | Arquitetura | Técnico completo         |
| `docs/PF_SDK_REFERENCE.md`       | Referência  | API do SDK               |
| `docs/PF_CSS_REFERENCE.md`       | Referência  | Design System CSS        |
| `README.md`                      | Entry Point | Para novos devs          |

### Nomenclatura de Arquivos JS

| Padrão               | Exemplo           | Uso              |
| -------------------- | ----------------- | ---------------- |
| `pf.<nome>.js`       | `pf.sdk.js`       | Core SDK         |
| `pf.<area>.js`       | `pf.devtools.js`  | Módulos por área |
| `pf.<area>-<sub>.js` | `pf.dock-drag.js` | Sub-módulos      |

---

## 1. IDENTIDADE DO PROJETO

| Campo            | Valor                              |
| ---------------- | ---------------------------------- |
| **Nome**         | Panda Factory (PF)                 |
| **Fundador**     | Lucas Valério (5% eterno)          |
| **Plano Google** | AI Ultra (Gemini 3 Pro, Veo 3)     |
| **SDK Versão**   | 0.7.1                              |
| **Missão**       | Democratizar infraestrutura Google |
| **Repositório**  | github.com/LucassVal/SAAS          |

### 🎯 Roadmap Estratégico

| Meta                    | Horizonte   | Status       |
| ----------------------- | ----------- | ------------ |
| **Stack Dia 1**         | **Dia 1**   | 🟢 Em Dev    |
| ├─ Rust Agent + Tauri   | Dia 1       | 🟢 Em Dev    |
| ├─ GPU/NVIDIA           | Dia 1       | 🟢 Em Dev    |
| ├─ Medusa Store         | Dia 1       | 🟡 Planejado |
| ├─ 3 AI Cores           | Dia 1       | 🟢 Em Dev    |
| └─ Firebase/GAS         | Dia 1       | ✅ Feito     |
| Google Partner          | Médio Prazo | 🟡 Planejado |
| Panda Coin → Solana     | Médio Prazo | 🟡 Planejado |
| White Label Marketplace | Curto Prazo | 🟢 Em Dev    |

### 🧠 AI Cores (Três Níveis de Inteligência)

O Panda possui **TRÊS camadas distintas de IA** com propósitos diferentes:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         AI CORES - ARQUITETURA                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  NÍVEL 1: PAT (Panda AI Treasury) - O CÉREBRO SOBERANO 🔒              │
│  ├── Propósito: REPLICAR a mente do Founder (Lucas Valério)            │
│  ├── Autonomia: Assistida → Autônoma → Soberana (3 fases)              │
│  ├── Governança: Controla DAO, Tokenomics, Decisões Estratégicas       │
│  ├── Constituição: Opera dentro dos 12 Artigos Imutáveis               │
│  ├── Legado: "Eu morro, mas ela cria asas" (Continuidade Eterna)       │
│  ├── Infra: GCP Cloud Functions (on-demand) + Firebase Triggers        │
│  ├── Storage: Firestore privado (/pat/mindmap, /pat/interviews)        │
│  └── Arquivo: js/core/pf.ai-core.js                                    │
│                                                                         │
│  NÍVEL 2: Panda.Brain - O ASSISTENTE OMNI-MODAL 🌐                     │
│  ├── Propósito: API de IA para DEVS e USUÁRIOS (headless/telemetria)   │
│  ├── Acesso Usuário: Auth + Wallet (read-only)                         │
│  ├── Acesso Dev: Full SDK (exceto áreas restritas)                     │
│  ├── Multi-Plugin: Lê TODOS os plugins → Omni-Modal via MCP + RIG      │
│  ├── 6 GEMS: writer, analyst, coder, designer, planner, researcher     │
│  ├── Cobrança: Por modelo (PC/token), Free Tier: ~500k tokens Flash    │
│  ├── Storage: Firestore (sessões/workflows), Sheets (analytics/config) │
│  └── Arquivo: js/pf.sdk.js (módulo Brain), backend/PF_Brain_Core.gs    │
│                                                                         │
│  NÍVEL 3: Antigravity - O CODING ASSISTANT 🤖                          │
│  ├── Propósito: Assistente de desenvolvimento para DEVS                │
│  ├── Ativação: F12 → Dev Mode → 🐼 no Dev Dock                         │
│  ├── Interface: WebView nativo no Rust Agent (Tauri/Wry)               │
│  ├── BYOL: Dev usa sua própria API key Google (Gemini)                 │
│  ├── MCP Tools: fs_read, fs_write, shell, git, etc                     │
│  ├── Contexto: Docs do Panda (Firebase Storage)                        │
│  ├── Auto-Update: Antigravity detecta versão e oferece update in-app   │
│  └── Tamanho: ~500KB (UI) + Rust Agent base (~30MB)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Fluxo Antigravity (Dev Mode)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    ANTIGRAVITY - ATIVAÇÃO                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Dev clica F12 ou 🛠️ Dev Mode Toggle                                │
│  2. Dev Dock aparece (direita)                                          │
│  3. Dev clica 🐼 AI Assistant                                           │
│  4. Browser envia comando → Rust Agent (WebSocket)                     │
│  5. Rust Agent abre WebView nativo (Tauri)                             │
│  6. Antigravity carrega com contexto do Panda                          │
│  7. RIG chama Gemini (BYOL - API key do dev)                           │
│  8. MCP Tools executam ações locais                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Níveis de Acesso

| Quem        | Panda.Brain     | Panda.Auth      | Panda.Wallet | Panda.Data         |
| ----------- | --------------- | --------------- | ------------ | ------------------ |
| **Usuário** | ✅ chat/analyze | ✅ login/logout | 📖 Read-only | ✅ CRUD próprio    |
| **Dev**     | ✅ Full         | ✅ Full         | 📖 Read-only | ✅ Full collection |
| **Plugin**  | ✅ Via MCP      | 🔒 Restrito     | ❌ Nenhum    | ✅ Sandbox         |

#### Multi-Plugin Omni-Modal (MCP + RIG)

```text
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Plugin A    │  │  Plugin B    │  │  Plugin C    │
│  (CRM)       │  │  (Trading)   │  │  (Docs)      │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
              ┌─────────────────────┐
              │    MCP + RIG        │ ← Orquestrador
              │  (Omni-Modal Hub)   │
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │   Panda.Brain       │ ← IA lê TODOS
              │   (Contexto Unif.)  │
              └─────────────────────┘
```

> **Dev pode restringir usuários** nos seus plugins/programas.
> **Panda Fabrics** roda multi-plugins e a IA os torna omni-modais via MCP+RIG.

#### Billing por Modelo

| Modelo          | Free Tier        | Taxa            |
| --------------- | ---------------- | --------------- |
| Gemini Flash 3  | ~500k tokens/mês | Grátis          |
| Gemini Pro      | -                | 30 PC/1k tokens |
| GPT-4o          | -                | 50 PC/1k tokens |
| Claude 3.5      | -                | 45 PC/1k tokens |
| Llama 3 (Local) | Ilimitado        | 0 PC (GPU user) |

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
// js/pf.sdk.js - v0.9.0
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
    loading(show, msg?),          // void
    popout(toolId, options?),     // 🪟 Promise<Window> (multi-window)
    getPopouts(),                 // Map<string, Window>
    closePopout(toolId)           // void
  },

  // ==========================================
  // TRADUÇÃO GLOBAL (Offline via Rust)
  // ==========================================
  Polyglot: {
    translate(text, from, to),      // Promise<string> - 200 idiomas
    translateStream(stream, to),    // AsyncIterator<string> - Tempo real
    detectLanguage(text),           // Promise<{lang, confidence}>
    getSupportedLanguages(),        // string[] (200+)
    localizeUI(langCode)            // void (aplica traduções na UI)
    // Modelo: NLLB-200 (~600MB) via Rust Agent
    // Legendas: Whisper Base (~140MB) opcional
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
| `js/pf.sdk.js`                  | `Panda.*`     | SDK Mock v0.9.0 |
| `js/core/pf.ai-core.js`         | `PandaAI.*`   | PAT Treasury    |
| `js/core/pf.firebase-bridge.js` | `PandaBridge` | Signaling       |

### 🚀 Integrations (js/integrations/) - NEW

| Arquivo          | Global           | Descrição                    |
| ---------------- | ---------------- | ---------------------------- |
| `pf.whatsapp.js` | `Panda.WhatsApp` | Bulk, Chatbot, Campaigns     |
| `pf.twitter.js`  | `Panda.Twitter`  | Threads, AI Generate         |
| `pf.youtube.js`  | `Panda.YouTube`  | Shorts, Thumbnails AI, SEO   |
| `pf.meta.js`     | `Panda.Meta`     | Reels, Carousels, Multi-post |
| `pf.ctrader.js`  | `Panda.CTrader`  | AI Signals, Backtester       |

### 🐙 Tentacles Architecture (js/tentacles/) - NEW

> **Arquitetura:** SDK → Tentáculos → Pais → Filhos

| Arquivo                          | Camada  | Descrição         |
| -------------------------------- | ------- | ----------------- |
| `monitor/pf.tentacle-monitor.js` | Monitor | Log em tempo real |
| `social/pf.social-parent.js`     | Parent  | Agrupador Social  |
| `social/children/whatsapp.js`    | Child   | API WhatsApp      |
| `trading/pf.trading-parent.js`   | Parent  | Agrupador Trading |
| `trading/children/ctrader.js`    | Child   | API cTrader       |

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

### 📱 Social Media Hub (js/social/)

| Arquivo                 | Global                  | Descrição                |
| ----------------------- | ----------------------- | ------------------------ |
| `pf.social-core.js`     | `Panda.Social`          | Core + CRM + Agenda      |
| `pf.social-youtube.js`  | `Panda.Social.YouTube`  | SEO, Thumbnails, Scripts |
| `pf.social-tiktok.js`   | `Panda.Social.TikTok`   | Trends, Viral, Hashtags  |
| `pf.social-meta.js`     | `Panda.Social.Meta`     | Posts, Stories, Ads      |
| `pf.social-twitter.js`  | `Panda.Social.Twitter`  | Threads, Hooks, Spaces   |
| `pf.social-whatsapp.js` | `Panda.Social.WhatsApp` | Broadcast, Leads, Flows  |

### 📈 Trading Hub (js/trading/)

| Arquivo               | Global               | Descrição                 |
| --------------------- | -------------------- | ------------------------- |
| `pf.ctrader-api.js`   | `Panda.CTrader`      | WebSocket API connector   |
| `pf.ctrader-oauth.js` | `Panda.CTraderOAuth` | OAuth user authentication |

### 🤖 Automation (js/core/)

| Arquivo                  | Global           | Descrição              |
| ------------------------ | ---------------- | ---------------------- |
| `pf.workflow-builder.js` | `Panda.Workflow` | Workflow + AI Adaptive |
| `pf.i18n.js`             | `Panda.i18n`     | Internacionalização    |

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
| `Comp_TradingHub.html`      | UI de Trading           |
| `ui/Comp_LoginOverlay.html` | Overlay de login        |
| `ui/Comp_AgendaDrawer.html` | Drawer de agenda        |

### 📜 Backend GAS (backend/)

| Arquivo                    | Descrição                      |
| -------------------------- | ------------------------------ |
| `core/PF_Dispatcher.gs`    | Entry point (doGet/doPost)     |
| `core/PF_Config.gs`        | Configurações                  |
| `core/PF_Core_AI.gs`       | IA backend                     |
| `core/PF_Core_Oracle.gs`   | Oracle de preços (USD/BTC/XAU) |
| `core/PF_Core_Webhooks.gs` | Webhooks (Eduzz/Kiwify)        |
| `core/PF_PAT_Core.gs`      | PAT Treasury AI                |
| `core/PF_Brain_Core.gs`    | Brain Core (6 Gems)            |
| `domains/`                 | finance/, store/, automation/  |

### 🗄️ Legacy (\_system/)

| Pasta           | Descrição             |
| --------------- | --------------------- |
| `_system/core/` | kernel.js, loader.js  |
| `_system/sdk/`  | repository.js, api.js |

---

## 8. DOCUMENTOS DO PROJETO

| Documento          | Arquivo                                   | Conteúdo                 |
| ------------------ | ----------------------------------------- | ------------------------ |
| **README**         | `README.md`                               | Visão geral, quick start |
| **Arquitetura**    | `docs/PF_MASTER_ARCHITECTURE.md`          | 93KB, tudo técnico       |
| **SDK Reference**  | `docs/PF_SDK_REFERENCE.md`                | API v0.9.0               |
| **Tokenomics**     | `docs/PF_TOKENOMICS_REFERENCE.md`         | §9 PC/PAT/Treasury       |
| **Plugins**        | `docs/PF_PLUGIN_AND_MODULAR_REFERENCE.md` | Plugins + cTrader        |
| **HTML Reference** | `docs/PF_HTML_REFERENCE.md`               | Components               |
| **GAS Reference**  | `docs/PF_GAS_REFERENCE.md`                | Backend GAS              |
| **CSS Reference**  | `docs/PF_CSS_REFERENCE.md`                | Design tokens            |
| **AI Context**     | `.agent/PANDA.md`                         | Este arquivo             |

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
Panda.version(); // "0.9.0"
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

## 12. FEATURES IMPORTANTES

### 🛠️ Dev Mode

| Aspecto          | Descrição                     |
| ---------------- | ----------------------------- |
| **Ativação**     | Botão 🛠️ no AppDock           |
| **Persistência** | `localStorage.panda_dev_mode` |
| **Efeito**       | Mostra DevToolsDock (direita) |
| **Ícone ativo**  | 🔧 (muda quando ativo)        |

```javascript
toggleDevMode(); // Toggle
PandaDevTools.isEnabled(); // boolean
PandaDevTools.open("console"); // Abrir tool
```

### 🪟 Multi-Window (Pop-out)

| Aspecto        | Descrição                       |
| -------------- | ------------------------------- |
| **API**        | `Panda.UI.popout(toolId)`       |
| **Tecnologia** | Document Picture-in-Picture API |
| **Browsers**   | Chrome/Edge 116+                |
| **Fallback**   | `window.open()`                 |
| **Uso**        | Múltiplos monitores             |

```javascript
const win = await Panda.UI.popout("console");
Panda.UI.getPopouts(); // Map de janelas
Panda.UI.closePopout("console");
```

### 🧰 DevTools v2.0

| Tool         | Ícone | Status | Descrição               |
| ------------ | ----- | ------ | ----------------------- |
| Console      | 💻    | ✅     | Execute JavaScript      |
| MCP Browser  | 🧰    | ✅     | Lista tools MCP         |
| API Tester   | 🔌    | ✅     | Testa endpoints GAS     |
| PAT Treasury | 🏦    | ✅     | Controles reinvest/burn |
| Constitution | ⚖️    | ✅     | Validar vs 12 Artigos   |
| Extensions   | 🧩    | 🟡     | Em desenvolvimento      |
| Code Editor  | 📝    | 🟡     | Monaco (futuro)         |
| RIG Config   | 🦀    | 🟡     | Providers IA            |

### 🏷️ White Label (Futuro)

| Aspecto                  | Descrição                       |
| ------------------------ | ------------------------------- |
| **O que é**              | Dev "veste" Panda com sua marca |
| **Infra usada**          | GPU Cloud + GPU P2P + GAS       |
| **Pagamento**            | Split automático                |
| **Branding obrigatório** | 🐼 no loading + canto inferior  |

### 🐙 GitHub Community

| Categoria        | URL                                                     |
| ---------------- | ------------------------------------------------------- |
| **Extensions**   | `github.com/LucassVal/panda-sdk-community/extensions`   |
| **Modules**      | `github.com/LucassVal/panda-sdk-community/modules`      |
| **Integrations** | `github.com/LucassVal/panda-sdk-community/integrations` |
| **MCP Servers**  | `github.com/LucassVal/panda-sdk-community/mcp-servers`  |
| **Themes**       | `github.com/LucassVal/panda-sdk-community/themes`       |

---

## 13. PROIBIÇÕES

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

## 14. GOOGLE AI ULTRA TOOLS

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

**Versão:** 5.0.0 | **SDK:** 0.7.0 | **Atualizado:** 2026-01-22
