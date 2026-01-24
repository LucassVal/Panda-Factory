# 🐼 Panda Factory - HTML & Component Reference

> **Versão:** 1.0 | **Status:** Active | **Última Atualização:** 2026-01-23

---

## 📋 Índice

1. [Arquitetura de Componentes](#arquitetura-de-componentes)
2. [Principal (PandaFactory.html)](#principal-pandafactoryhtml)
3. [Catálogo de Componentes](#catálogo-de-componentes)
4. [Sistema de Carregamento](#sistema-de-carregamento)
5. [Padrões de Código](#padrões-de-código)
6. [Containers & Slots](#containers--slots)
7. [Convenções de Nomenclatura](#convenções-de-nomenclatura)

---

## Arquitetura de Componentes

O sistema usa **composição dinâmica** onde o HTML principal define containers vazios que são preenchidos em runtime.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        PandaFactory.html                             │
│                        (Shell Principal)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ #header-container        ← Comp_HeaderStatus.html            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────┐  ┌─────────────────────────────────────────┐   │
│  │ #sidebar-left  │  │ #canvas (Área de trabalho)              │   │
│  │ Comp_Sidebar   │  │                                         │   │
│  └────────────────┘  │                                         │   │
│                      │                                         │   │
│                      └─────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ #app-dock-container      ← Comp_AppDock.html                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ #modals-container        ← Modais carregados sob demanda     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Principal (PandaFactory.html)

O arquivo principal serve como **shell** e orquestrador:

### Estrutura Base

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <!-- META -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- PWA -->
    <link rel="manifest" href="manifest.json" />

    <!-- CSS (Design System) -->
    <link rel="stylesheet" href="css/pf.theme.css" />

    <!-- JS: Carregamento em ordem -->
    <script src="js/pf.sdk.js" defer></script>
    <!-- SDK primeiro -->
    <script src="js/core/pf.i18n.js" defer></script>
    <!-- i18n -->
    <script src="js/kernel/pf.components.js" defer></script>
    <!-- Loader -->
    <script src="js/kernel/pf.app-init.js" defer></script>
    <!-- Init -->
  </head>
  <body>
    <div class="container">
      <!-- Containers vazios - preenchidos em runtime -->
      <div id="header-container"></div>
      <div id="app-dock-container"></div>
      <div id="sidebar-left"></div>
      <div id="canvas"></div>
      <div id="modals-container"></div>
    </div>
  </body>
</html>
```

### Ordem de Carregamento de Scripts

| Ordem | Arquivo            | Responsabilidade             |
| ----- | ------------------ | ---------------------------- |
| 1     | `pf.sdk.js`        | SDK Mock (Panda.\*)          |
| 2     | `pf.i18n.js`       | Sistema de tradução          |
| 3     | `pf.components.js` | Loader de componentes        |
| 4     | `pf.app-init.js`   | Inicialização e orquestração |
| 5     | `pf.dock-drag.js`  | Drag & drop do dock          |

---

## Catálogo de Componentes

### `components/` Directory

| Componente   | Arquivo                       | Tamanho | Descrição                        |
| ------------ | ----------------------------- | ------- | -------------------------------- |
| **Header**   | `Comp_HeaderStatus.html`      | ~11KB   | Status pills, logo, settings btn |
| **AppDock**  | `Comp_AppDock.html`           | ~12KB   | Dock inferior com apps           |
| **Sidebar**  | `Comp_Sidebar.html`           | ~6KB    | Navegação lateral                |
| **Settings** | `Comp_SettingsModal.html`     | ~43KB   | Modal 11 seções                  |
| **Treasury** | `Comp_TreasuryDashboard.html` | ~13KB   | Dashboard PAXG/USDC              |
| **DevTools** | `Comp_DevToolsDock.html`      | ~6KB    | Ferramentas dev                  |

---

### Comp_HeaderStatus.html

**Função:** Barra superior com status do sistema

```html
<header class="pf-header">
  <div class="header-left">
    <img src="assets/panda_logo.png" class="header-logo" />
  </div>

  <div class="header-center">
    <!-- Status Pills -->
    <div class="status-pill" id="firebase-status">
      <span class="pulse"></span> Firebase
    </div>
    <div class="status-pill" id="rust-status">
      <span class="pulse offline"></span> Rust
    </div>
    <div class="status-pill" id="gpu-status">
      <span class="pulse"></span> GPU
    </div>
  </div>

  <div class="header-right">
    <!-- Arc Energy Bar -->
    <div class="arc-energy" id="arcEnergy"></div>

    <!-- Treasury Health -->
    <button class="treasury-btn" onclick="PandaTreasury.open()">
      🏦 <span id="health-score">92%</span>
    </button>

    <!-- Settings -->
    <button class="settings-btn" onclick="PandaSettings.open()">⚙️</button>
  </div>
</header>
```

---

### Comp_AppDock.html

**Função:** Dock inferior estilo macOS

```html
<div class="pf-dock" id="appDock">
  <div class="dock-items">
    <!-- Apps fixos -->
    <div
      class="dock-item"
      data-app="catalog"
      onclick="PandaDock.open('catalog')"
    >
      📁
      <span class="dock-label">Catálogo</span>
    </div>
    <div class="dock-item" data-app="store" onclick="PandaDock.open('store')">
      🏪
      <span class="dock-label">Store</span>
    </div>
    <div class="dock-item" data-app="dev" onclick="PandaDock.open('dev')">
      🛠️
      <span class="dock-label">Dev</span>
    </div>

    <!-- Separador -->
    <div class="dock-separator"></div>

    <!-- Apps dinâmicos (instalados) -->
    <div id="dynamic-apps"></div>
  </div>
</div>
```

**Features:**

- Drag & drop para reordenar
- Right-click context menu
- Animação hover (bounce)
- Apps dinâmicos da Store

---

### Comp_SettingsModal.html

**Função:** Modal de configurações (11 seções)

| Seção         | Ícone | Conteúdo                 |
| ------------- | ----- | ------------------------ |
| Profile       | 👤    | Username, Email, Role    |
| Appearance    | 🎨    | Theme, Accent, Language  |
| Translation   | 🌐    | Auto-translate, NLLB-200 |
| Notifications | 🔔    | Email, Push, Desktop     |
| AI Settings   | 🧠    | Model, Temperature       |
| Wallet        | 💰    | Balance, History         |
| Performance   | ⚡    | GPU, Cache               |
| Security      | 🔒    | 2FA, Sessions            |
| Integrations  | 🔌    | MCP, APIs                |
| Developer     | 📊    | Console, Logs            |
| About         | ℹ️    | Version, Credits         |

**Estrutura:**

```html
<div class="settings-overlay" id="settingsOverlay">
  <div class="settings-modal">
    <!-- Sidebar -->
    <div class="settings-sidebar">
      <div class="settings-nav-item" data-section="profile">👤 Profile</div>
      <!-- ... outros items ... -->
    </div>

    <!-- Content -->
    <div class="settings-content">
      <div class="settings-section" id="section-profile">
        <!-- Conteúdo da seção -->
      </div>
    </div>
  </div>
</div>
```

**Controller:**

```javascript
window.PandaSettings = {
  open()           // Abre modal
  close()          // Fecha modal
  showSection(id)  // Navega para seção
  toggleTheme()    // Light/Dark
  setAccent(color) // Cor de destaque
  // ... mais métodos
};
```

---

### Comp_TreasuryDashboard.html

**Função:** Dashboard do Treasury (PAXG/USDC)

```html
<div class="treasury-modal" id="treasuryModal">
  <div class="treasury-header">
    <h2>🏦 Treasury Dashboard</h2>
    <span class="health-badge">92% Healthy</span>
  </div>

  <div class="treasury-grid">
    <!-- Reserve Breakdown -->
    <div class="treasury-card">
      <h3>Reserve Breakdown</h3>
      <div class="reserve-bar">
        <div class="paxg-bar" style="width: 70%">PAXG 70%</div>
        <div class="usdc-bar" style="width: 30%">USDC 30%</div>
      </div>
    </div>

    <!-- Metrics -->
    <div class="treasury-card">
      <div class="metric">
        <span class="label">Backing Ratio</span>
        <span class="value">102%</span>
      </div>
      <div class="metric">
        <span class="label">Runway</span>
        <span class="value">14 months</span>
      </div>
    </div>

    <!-- On-Chain Audit -->
    <div class="treasury-card">
      <h3>Latest Snapshot</h3>
      <a href="https://solscan.io/tx/..." target="_blank"> View on Solscan </a>
    </div>
  </div>
</div>
```

---

## Sistema de Carregamento

### pf.components.js

O loader busca componentes via `fetch()` e injeta no DOM:

```javascript
window.PandaComponents = {
  async load(containerId, componentPath) {
    const container = document.getElementById(containerId);
    const response = await fetch(`components/${componentPath}`);
    const html = await response.text();
    container.innerHTML = html;

    // Executa scripts inline
    this.executeScripts(container);
  },

  executeScripts(container) {
    container.querySelectorAll("script").forEach((script) => {
      const newScript = document.createElement("script");
      newScript.textContent = script.textContent;
      document.body.appendChild(newScript);
    });
  },
};
```

### pf.app-init.js

Orquestra o carregamento inicial:

```javascript
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Carrega componentes principais
  await PandaComponents.load("header-container", "Comp_HeaderStatus.html");
  await PandaComponents.load("app-dock-container", "Comp_AppDock.html");

  // 2. Carrega modais (sob demanda)
  // Settings, Treasury, etc. são lazy-loaded

  // 3. Inicializa SDK
  if (typeof Panda !== "undefined") {
    await Panda.Auth.login("demo@panda.io", "demo");
  }

  // 4. Dispara evento ready
  window.dispatchEvent(new CustomEvent("pf:ready"));
});
```

---

## Padrões de Código

### Estrutura de Componente

Todo componente segue este padrão:

```html
<!-- ============================================= -->
<!-- COMPONENT NAME v1.0                           -->
<!-- Description of what this component does       -->
<!-- ============================================= -->
<style>
  /* Estilos SCOPED (prefixados) */
  .comp-name-element {
  }
</style>

<div class="comp-name-container">
  <!-- HTML do componente -->
</div>

<script>
  // Controller do componente
  window.CompNameController = {
    init() {},
    // métodos...
  };

  // Auto-init quando carregado
  if (document.readyState === "complete") {
    CompNameController.init();
  } else {
    document.addEventListener("DOMContentLoaded", CompNameController.init);
  }
</script>
```

### CSS Scoping

Prefixe classes com o nome do componente:

```css
/* ✅ Correto */
.settings-modal {
}
.settings-sidebar {
}
.settings-nav-item {
}

/* ❌ Evitar */
.modal {
}
.sidebar {
}
.nav-item {
}
```

### JavaScript Controllers

Cada componente expõe um controller global:

| Componente | Controller      | Métodos Principais                   |
| ---------- | --------------- | ------------------------------------ |
| Header     | `PandaHeader`   | `updateStatus()`, `setUser()`        |
| Dock       | `PandaDock`     | `open()`, `addApp()`, `removeApp()`  |
| Settings   | `PandaSettings` | `open()`, `close()`, `showSection()` |
| Treasury   | `PandaTreasury` | `open()`, `refresh()`, `getHealth()` |

---

## Containers & Slots

### Containers Padrão no Shell

| ID                   | Componente   | Carregamento |
| -------------------- | ------------ | ------------ |
| `header-container`   | HeaderStatus | Automático   |
| `app-dock-container` | AppDock      | Automático   |
| `sidebar-left`       | Sidebar      | Automático   |
| `canvas`             | Área de apps | Dinâmico     |
| `modals-container`   | Modais       | Lazy         |

### Slots Dinâmicos

Apps podem injetar conteúdo em slots específicos:

```javascript
// App injeta botão no header
PandaSlots.inject("header-actions", "<button>Meu Botão</button>");

// App adiciona item ao dock
PandaDock.addApp({
  id: "meu-app",
  icon: "🚀",
  label: "Meu App",
  onClick: () => openMyApp(),
});
```

---

## Convenções de Nomenclatura

### Arquivos

| Tipo       | Padrão                 | Exemplo                   |
| ---------- | ---------------------- | ------------------------- |
| Componente | `Comp_PascalCase.html` | `Comp_SettingsModal.html` |
| JS Core    | `pf.kebab-case.js`     | `pf.app-init.js`          |
| CSS        | `pf.kebab-case.css`    | `pf.theme.css`            |

### IDs HTML

| Tipo      | Padrão            | Exemplo            |
| --------- | ----------------- | ------------------ |
| Container | `kebab-case`      | `header-container` |
| Seção     | `section-kebab`   | `section-profile`  |
| Toggle    | `camelCaseToggle` | `themeToggle`      |
| Button    | `kebab-btn`       | `settings-btn`     |

### Classes CSS

| Tipo       | Padrão              | Exemplo                |
| ---------- | ------------------- | ---------------------- |
| Componente | `.prefixo-elemento` | `.settings-modal`      |
| Estado     | `.estado`           | `.active`, `.disabled` |
| Tema       | `.dark-mode`        | `body.dark-mode`       |
| Utilitário | `.u-nome`           | `.u-hidden`            |

### JavaScript

| Tipo          | Padrão            | Exemplo           |
| ------------- | ----------------- | ----------------- |
| Controller    | `PandaPascalCase` | `PandaSettings`   |
| Função Global | `camelCase`       | `toggleOmniBar()` |
| Evento        | `pf:kebab-case`   | `pf:ready`        |

---

## Referências

- **SDK:** [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md)
- **CSS:** [PF_CSS_REFERENCE.md](PF_CSS_REFERENCE.md)
- **Arquitetura:** [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md)
- **Codex:** [.agent/PANDA.md](../.agent/PANDA.md)

---

> 📖 **Panda Factory - HTML & Component Reference v1.0**
