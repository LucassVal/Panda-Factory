# 📐 PF_UI_REFERENCE - Panda Fabrics UI Layout System

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-02
> **Referência:** `11.jam/src/styles/jam.css` (1933 linhas)
> **Cross-Ref:** [PF_MASTER_ARCHITECTURE.md §3](PF_MASTER_ARCHITECTURE.md#3-camada-frontend)

---

## 📋 Índice

1. [Layout Grid](#1-layout-grid)
2. [Z-Index Hierarchy](#2-z-index-hierarchy)
3. [Core Measurements](#3-core-measurements)
4. [Header/Status Bar](#4-headerstatus-bar)
5. [Dock System](#5-dock-system)
6. [Modal System](#6-modal-system)
7. [Chat System](#7-chat-system)
8. [Canvas Area](#8-canvas-area)
9. [Theme Modes](#9-theme-modes)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Layout Grid

### Master Layout Structure

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    STATUS BAR (56px, fixed top)                     │
│  [Logo][Brand] │ [v5.0][Pills][🌙] │ [90%][92%][User][btns][🕐]    │
├───────┬─────────────────────────────────────────────────────┬───────┤
│       │                                                     │       │
│ LEFT  │               CANVAS AREA                           │ RIGHT │
│ DOCK  │               (TLDraw)                              │ TOOLS │
│       │                                                     │       │
│ 68px  │            flex: 1, margin-top: 56px                │ 260px │
│       │                                                     │ (when │
│       │                                                     │ open) │
│       │                                                     │       │
├───────┴─────────────────────────────────────────────────────┴───────┤
│                    CHAT FAB (bottom-right floating)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Viewport Rules

```css
html,
body,
#root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.jam-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
}
```

---

## 2. Z-Index Hierarchy

> **REGRA:** Nunca ultrapassar a camada superior sem necessidade crítica.

| Layer        | Z-Index | Component           | Classe CSS                         |
| ------------ | ------- | ------------------- | ---------------------------------- |
| **Base**     | 0       | Canvas/TLDraw       | `.jam-canvas-wrapper`              |
| **Grid**     | 999     | Canvas grid overlay | `::after` pseudoelement            |
| **Docks**    | 1000    | Left/Right Sidebars | `.jam-left-dock`                   |
| **Header**   | 2000    | Status Bar          | `.jam-status-bar`                  |
| **Chat**     | 3000    | Floating Chat       | `.jam-chat-fab`, `.jam-chat-panel` |
| **Store**    | 2000    | Store overlay       | `.jam-store-overlay`               |
| **Settings** | 5000    | Settings modal      | `.jam-settings-overlay`            |
| **Login**    | 10000   | Auth gate           | `.login-gate`                      |
| **Panic**    | 9999    | Kill Switch         | `.login-logout-btn` (deprecated)   |

### Conflict Prevention

```css
/* ❌ NUNCA FAZER */
.my-component {
  z-index: 99999;
}

/* ✅ USAR LAYER CORRETO */
.my-modal {
  z-index: 5000;
} /* Modal layer */
.my-overlay {
  z-index: 4999;
} /* Behind modal */
```

---

## 3. Core Measurements

### Spacing System

| Token    | Value   | Use Case          |
| -------- | ------- | ----------------- |
| `gap-xs` | 4px     | Icon spacing      |
| `gap-sm` | 6-8px   | Button groups     |
| `gap-md` | 10-12px | Section gaps      |
| `gap-lg` | 16-20px | Container padding |

### Border Radius

| Component      | Radius |
| -------------- | ------ |
| Buttons        | 6-8px  |
| Cards          | 12px   |
| Dock items     | 13px   |
| Dock container | 18px   |
| Modals         | 16px   |
| Full circle    | 50%    |

### Shadows

```css
--jam-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); /* Dark mode */
--jam-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* Light mode */
```

---

## 4. Header/Status Bar

### Dimensions

```css
.jam-status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px; /* ⚠️ FIXED HEIGHT */
  padding: 0 20px;
  z-index: 2000;
  backdrop-filter: blur(20px);
}
```

### Header Layout (3 Sections)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                           STATUS BAR (56px)                              │
├────────────────┬──────────────────────────┬──────────────────────────────┤
│    BRAND       │        STATUS GROUP      │      HEADER CONTROLS         │
│  (flex-start)  │       (flex-center)      │       (flex-end)             │
├────────────────┼──────────────────────────┼──────────────────────────────┤
│ [Logo 50px]    │ [v5.0]                   │ [Energy 40px]                │
│ [Text 22px]    │ [FB●][GA●][RU●][AI●][GP●]│ [Treasury 92%]               │
│                │ [🌙 Theme Toggle 32px]   │ [User Status]                │
│                │                          │ [🔳][🪟][⚙️] 32x32px each     │
│                │                          │ [Clock]                      │
└────────────────┴──────────────────────────┴──────────────────────────────┘
```

### Component Specs

| Component     | Width     | Height | Class                         |
| ------------- | --------- | ------ | ----------------------------- |
| Brand Logo    | auto      | 50px   | `.jam-brand-logo`             |
| Brand Text    | auto      | -      | `.jam-brand-text` (22px font) |
| Version Badge | auto      | -      | `.jam-version` (12px font)    |
| Status Pill   | auto      | -      | `.jam-status-pill`            |
| Status Dot    | 12px      | 12px   | `.jam-status-dot`             |
| Theme Toggle  | 32px      | 32px   | `.jam-theme-toggle`           |
| Header Button | 32x32px\* | 32px   | `.jam-header-btn`             |
| Energy Arc    | 40px      | 40px   | `.jam-arc-energy`             |

### Header Controls Container

```css
.jam-header-controls {
  display: flex;
  align-items: center;
  gap: 10px; /* ⚠️ SPACING BETWEEN ITEMS */
}
```

**⚠️ CRITICAL:** All header buttons should be in flex flow. Do NOT use `position: fixed` for buttons inside header.

---

## 5. Dock System

### Left Dock

```css
.jam-left-dock {
  position: fixed; /* Assumed - actual positioning in component */
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.jam-dock-items {
  padding: 10px;
  border-radius: 18px;
  backdrop-filter: blur(20px);
}

.jam-dock-item {
  width: 46px;
  height: 46px;
  font-size: 22px;
  border-radius: 13px;
}

.jam-dock-separator {
  height: 1px;
  margin: 4px 0;
}
```

### Dock Total Width Calculation

```text
Dock item: 46px
Padding: 10px × 2 = 20px
Border: 1px × 2 = 2px
─────────────────
Total: ~68px
```

### Right Toolbar (Tools Panel)

```css
.jam-right-toolbar {
  position: fixed;
  top: 56px; /* Below header */
  right: 0;
  width: 260px; /* When open */
  height: calc(100vh - 56px);
  z-index: 1000;
  padding: 16px;
}
```

### 5.1 Role-Based Dock Items

> **Decisão:** UI varia conforme `Panda.Auth.getRole()`

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    DOCK POR ROLE                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TODOS (Role 1, 2, 3):                                                  │
│  ├── 🎨 Ferramentas → abre Right Toolbar (TLDraw)                       │
│  ├── 📁 Catálogo → abre modal de catálogo                               │
│  └── 🧩 Plugins → plugins instalados do usuário                         │
│                                                                          │
│  DEV (Role ≤ 2):                                                        │
│  └── 🔧 Dev Mode → abre JamDevPanel                                     │
│       ├── 🧰 MCP Browser (ver tools disponíveis)                        │
│       ├── 🦀 RIG Status (Rust Agent + GPU)                              │
│       └── 📊 Plugin Status (validação panda.mcp.json)                   │
│                                                                          │
│  FOUNDER (Role = 1):                                                    │
│  └── 👑 Admin → abre JamAdminPanel                                      │
│       ├── 📊 Dashboard (stats do ecossistema)                           │
│       ├── 🏦 Treasury (wallet + mint/burn)                              │
│       ├── ⚖️ Constitution (regras da IA)                                │
│       ├── 🛡️ Panda Defend (review + kill switch)                        │
│       ├── 🦀 RIG Control (GPU pool)                                     │
│       └── 📈 Analytics (custos, projeções)                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

| Role        | Valor | Vê no Dock     |
| ----------- | :---: | -------------- |
| **Founder** |   1   | Tudo + 🔧 + 👑 |
| **Dev**     |   2   | Tudo + 🔧      |
| **User**    |   3   | Apenas base    |

#### Implementação

```jsx
// JamDock.jsx
const role = Panda.Auth.getRole();

return (
  <>
    <DockItem icon="🎨" onClick={onToolsClick} />
    <DockItem icon="📁" onClick={onCatalogClick} />
    <DockItem icon="🧩" onClick={onPluginsClick} />

    {role <= 2 && <DockItem icon="🔧" onClick={onDevModeClick} />}
    {role === 1 && <DockItem icon="👑" onClick={onAdminClick} />}
  </>
);
```

---

## 6. Modal System

### Standard Modal Structure

```css
.jam-settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 5000;
}

.jam-settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  border-radius: 16px;
}
```

### Modal Dimensions

| Modal    | Max Width | Max Height |
| -------- | --------- | ---------- |
| Settings | 900px     | 85vh       |
| Store    | 900px     | 80vh       |
| Catalog  | 900px     | 80vh       |
| Login    | 400px     | auto       |

### Modal Anatomy

```text
┌───────────────────────────────────────┐
│ SIDEBAR (200px)  │  CONTENT (flex:1)  │
│                  │                    │
│ [Nav Items]      │  [Active Section]  │
│                  │                    │
│                  │                    │
└───────────────────────────────────────┘
```

---

## 7. Chat System

### Floating Action Button (FAB)

```css
.jam-chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  z-index: 3000;
}
```

### Chat Panel (Expanded)

```css
.jam-chat-panel {
  position: fixed;
  bottom: 90px; /* Above FAB */
  right: 24px;
  width: 380px;
  max-height: 500px;
  border-radius: 16px;
  z-index: 3000;
}
```

### Chat Layout

```text
┌─────────────────────────────────┐
│ Header (Logo, Stats, GEMs)      │
├─────────────────────────────────┤
│ Model Selector Bar              │
├─────────────────────────────────┤
│                                 │
│ Messages Area (flex: 1)         │
│                                 │
├─────────────────────────────────┤
│ Input Area                      │
└─────────────────────────────────┘
```

---

## 8. Canvas Area

### Layout

```css
.jam-main {
  flex: 1;
  position: relative;
  overflow: hidden;
  margin-top: 56px; /* ⚠️ HEADER HEIGHT */
}

.jam-canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  isolation: isolate;
}
```

### Grid Overlay

```css
.jam-canvas-wrapper.show-grid::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  background-size: 40px 40px;
}
```

---

## 9. Theme Modes

### CSS Variables

| Variable           | Dark Mode           | Light Mode             |
| ------------------ | ------------------- | ---------------------- |
| `--jam-bg`         | #1a1a2e             | #f5f5f7                |
| `--jam-surface`    | #16213e             | #ffffff                |
| `--jam-text`       | #eaeaea             | #1a1a2e                |
| `--jam-text-muted` | #8a8a9a             | #6a6a7a                |
| `--jam-border`     | #2a2a4e             | #e0e0e5                |
| `--jam-dock-bg`    | rgba(22,33,62,0.95) | rgba(255,255,255,0.95) |

### Toggle Method

```javascript
// Toggle dark/light mode
document.body.classList.toggle("light-mode");

// Check current mode
const isLight = document.body.classList.contains("light-mode");
```

---

## 10. Troubleshooting

### Common Issues

| Problema                 | Causa                    | Solução                       |
| ------------------------ | ------------------------ | ----------------------------- |
| Elementos sobrepondo     | z-index incorreto        | Verificar tabela de layers    |
| Header cortando conteúdo | margin-top ausente       | Adicionar `margin-top: 56px`  |
| Dock atrás do header     | z-index < 2000           | Dock deve ser z-index: 1000   |
| Modal atrás de outros    | z-index baixo            | Modal deve ser z-index: 5000+ |
| Botão fora do fluxo      | position: fixed indevido | Usar flex dentro do container |

### Debug Checklist

```text
□ Header height = 56px
□ Canvas margin-top = 56px
□ Left dock z-index = 1000
□ Modals z-index = 5000
□ Chat z-index = 3000
□ Login gate z-index = 10000
```

---

## Links Relacionados

- CSS Design System (consolidado abaixo - PARTE B)
- Jam React Components (consolidado abaixo - PARTE D)
- [jam.css](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/11.jam/src/styles/jam.css)
- [PANDA.md](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/.agent/PANDA.md)

---

# PARTE B: CSS Design System

> **Consolidado de:** `PF_CSS_REFERENCE.md` | **Fonte:** `css/pf.theme.css`

## B.1 Cores Base

```css
/* Cores Primárias */
--accent-primary: #3b82f6; /* Azul principal */
--accent-primary-hover: #2563eb;
--accent-primary-light: rgba(59, 130, 246, 0.1);

/* Status */
--accent-success: #22c55e; /* Verde */
--accent-warning: #f59e0b; /* Amarelo */
--accent-error: #ef4444; /* Vermelho */
--accent-info: #3b82f6; /* Azul info */
```

## B.2 Fundos

```css
/* Light Mode */
--bg-app: #f0f4f8; /* Fundo principal */
--bg-card: #ffffff; /* Cards */
--bg-panel: rgba(255, 255, 255, 0.8); /* Glassmorphism */
--bg-input: #f8fafc; /* Inputs */
--bg-hover: rgba(0, 0, 0, 0.04); /* Hover */
--bg-selected: rgba(59, 130, 246, 0.1); /* Selecionado */

/* Header */
--header-bg: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
--header-height: 48px;
```

## B.3 Texto

```css
--text-primary: #1e293b; /* Texto principal */
--text-secondary: #64748b; /* Texto secundário */
--text-muted: #94a3b8; /* Texto desabilitado */
--text-inverted: #ffffff; /* Texto em fundo escuro */
--text-link: #3b82f6; /* Links */
```

## B.4 Bordas e Sombras

```css
/* Bordas */
--border-subtle: rgba(0, 0, 0, 0.08);
--border-default: rgba(0, 0, 0, 0.12);
--border-focus: #3b82f6;
--border-error: #ef4444;

/* Sombras */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-dock: 0 8px 25px rgba(0, 0, 0, 0.15);
--shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);
```

## B.5 Sizing & Spacing

```css
/* Border Radius */
--radius-sm: 6px;
--radius-btn: 8px;
--radius-card: 12px;
--radius-modal: 16px;
--radius-full: 9999px;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
```

## B.6 Animações

```css
/* Transitions */
--transition-fast: 0.15s ease;
--transition-normal: 0.2s ease;
--transition-slow: 0.3s ease;

/* Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

## B.7 Dark Mode

```css
body.dark-mode {
  --bg-app: #0f172a;
  --bg-card: #1e293b;
  --bg-panel: rgba(30, 41, 59, 0.9);
  --bg-input: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-default: rgba(255, 255, 255, 0.12);
}
```

## B.8 Componentes Padrão

```css
/* Card */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-subtle);
  padding: var(--space-md);
}

/* Botão Primário */
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverted);
  border-radius: var(--radius-btn);
  padding: var(--space-sm) var(--space-md);
  transition: var(--transition-fast);
}
.btn-primary:hover {
  background: var(--accent-primary-hover);
}

/* Input */
.input {
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-btn);
  padding: var(--space-sm) var(--space-md);
}
.input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-primary-light);
}

/* Glassmorphism */
.glass {
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
}
```

---

# PARTE C: HTML & Component Reference

> **Consolidado de:** `PF_HTML_REFERENCE.md` | **Shell:** `PandaFactory.html`

## C.1 Arquitetura de Componentes

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        PandaFactory.html (Shell)                     │
├─────────────────────────────────────────────────────────────────────┤
│  #header-container    ← Comp_HeaderStatus.html                      │
│  #sidebar-left        ← Comp_Sidebar.html                           │
│  #canvas              ← Área de trabalho                            │
│  #app-dock-container  ← Comp_AppDock.html                           │
│  #modals-container    ← Modais carregados sob demanda               │
└─────────────────────────────────────────────────────────────────────┘
```

## C.2 Catálogo de Componentes

| Componente   | Arquivo                       | Descrição           |
| ------------ | ----------------------------- | ------------------- |
| **Header**   | `Comp_HeaderStatus.html`      | Status pills, logo  |
| **AppDock**  | `Comp_AppDock.html`           | Dock inferior       |
| **Settings** | `Comp_SettingsModal.html`     | Modal 11 seções     |
| **Treasury** | `Comp_TreasuryDashboard.html` | Dashboard PAXG/USDC |
| **DevTools** | `Comp_DevToolsDock.html`      | Ferramentas dev     |

## C.3 Ordem de Carregamento

| Ordem | Arquivo            | Responsabilidade             |
| ----- | ------------------ | ---------------------------- |
| 1     | `pf.sdk.js`        | SDK Mock (Panda.\*)          |
| 2     | `pf.i18n.js`       | Sistema de tradução          |
| 3     | `pf.components.js` | Loader de componentes        |
| 4     | `pf.app-init.js`   | Inicialização e orquestração |

## C.4 JavaScript Controllers

| Componente | Controller      | Métodos Principais                   |
| ---------- | --------------- | ------------------------------------ |
| Header     | `PandaHeader`   | `updateStatus()`, `setUser()`        |
| Dock       | `PandaDock`     | `open()`, `addApp()`, `removeApp()`  |
| Settings   | `PandaSettings` | `open()`, `close()`, `showSection()` |
| Treasury   | `PandaTreasury` | `open()`, `refresh()`, `getHealth()` |

## C.5 Convenções de Nomenclatura

| Tipo       | Padrão                 | Exemplo                   |
| ---------- | ---------------------- | ------------------------- |
| Componente | `Comp_PascalCase.html` | `Comp_SettingsModal.html` |
| JS Core    | `pf.kebab-case.js`     | `pf.app-init.js`          |
| CSS        | `pf.kebab-case.css`    | `pf.theme.css`            |
| Controller | `PandaPascalCase`      | `PandaSettings`           |
| Evento     | `pf:kebab-case`        | `pf:ready`                |

---

# PARTE D: Jam React Components

> **Consolidado de:** `PF_JAM_COMPONENTS.md` | **Versão:** 1.2.0

## D.1 Estrutura de Arquivos

```text
11.jam/src/
├── App.jsx                      # Main app v5.2
├── components/
│   ├── JamCanvas.jsx            # TLDraw canvas
│   ├── JamDock.jsx              # Left dock
│   ├── JamStatusBar.jsx         # Top status bar
│   ├── JamChat.jsx              # AI chat floating
│   ├── JamSettings.jsx          # Settings modal
│   ├── JamStore.jsx             # Store modal
│   ├── JamCatalog.jsx           # Catalog modal
│   ├── JamRightToolbar.jsx      # Drawing tools
│   ├── StatusBar.jsx            # Health status bar
│   ├── FounderDashboard.jsx     # Founder dashboard
│   ├── FinancePanel.jsx         # Treasury/finance
│   ├── LoginModal.jsx           # Auth modal
│   └── LoginGate.jsx            # Auth gate
└── hooks/
    ├── useAuth.jsx              # Auth provider
    ├── useFirebase.js           # Firebase connection
    ├── useGAS.js                # GAS endpoints
    ├── useHealthStatus.js       # Health polling
    ├── useFounderMetrics.js     # Dashboard metrics
    └── useMarketplace.js        # Marketplace hooks
```

## D.2 Componentes por Categoria

### Core Layout

| Componente         | Função                   |
| ------------------ | ------------------------ |
| `App.jsx`          | Container principal v5.2 |
| `JamCanvas.jsx`    | TLDraw canvas            |
| `JamDock.jsx`      | Dock esquerda            |
| `JamStatusBar.jsx` | Status bar topo          |

### Modals

| Componente                  | Função              |
| --------------------------- | ------------------- |
| `JamSettings.jsx`           | Configurações       |
| `JamStore.jsx`              | Loja de plugins     |
| `JamCatalog.jsx`            | Catálogo instalados |
| `FounderDashboardModal.jsx` | Dashboard founder   |
| `LoginModal.jsx`            | Login Google/Email  |

### Hooks

| Hook                   | Versão | Função                          |
| ---------------------- | ------ | ------------------------------- |
| `useAuth.jsx`          | v1.1   | Autenticação                    |
| `useFirebase.js`       | v1.0   | Firebase RTDB + Auth            |
| `useGAS.js`            | v1.1   | GAS endpoints + Fault Isolation |
| `useHealthStatus.js`   | v1.0   | Health polling                  |
| `useFounderMetrics.js` | v1.1   | Dashboard + Telemetry           |

## D.3 App.jsx v5.2 Structure

```jsx
<AuthProvider>
  <LoginGate>
    <AppContent>
      <JamStatusBar /> {/* Top */}
      <JamCanvas /> {/* Center */}
      <JamDock /> {/* Left */}
      <JamRightToolbar />
      {/* Right */}
      <JamChat /> {/* Floating */}
      <JamSettings /> {/* Modal */}
      <JamCatalog /> {/* Modal */}
      <JamStore /> {/* Modal */}
      <FounderDashboardModal /> {/* Modal */}
      <StatusBar /> {/* Bottom */}
    </AppContent>
  </LoginGate>
</AuthProvider>
```

## D.4 LoginGate v1.2

| Token              | Storage        | Fonte                |
| ------------------ | -------------- | -------------------- |
| `panda_auth`       | sessionStorage | Login direto no Jam  |
| `panda_auth_token` | sessionStorage | Login via index.html |
| `panda_user`       | localStorage   | useAuth + index.html |

## D.5 Build Info

```text
✓ 925 modules transformed
✓ 1.18MB JS (356KB gzip)
✓ Built in 28.91s (Vite 5.4.21)
```

---

> 📖 **PF_UI_REFERENCE v2.0** | Consolidado: UI Layout + CSS Design System + HTML Components + Jam React

---

# PARTE E: DevTools & Developer Experience

> **Consolidado de:** PF_MASTER_ARCHITECTURE.md §3.3

## E.1 Dev Mode Toggle

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEV MODE TOGGLE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  [AppDock]                                                              │
│  ├── 🏠 Home                                                            │
│  ├── 📊 CRM                                                             │
│  ├── ⚙️ Settings                                                        │
│  ├── ────────────                                                       │
│  └── 🛠️ Dev Mode ← CLIQUE ATIVA/DESATIVA                               │
│         │                                                               │
│         ├── OFF: DevToolsDock oculto                                    │
│         ├── ON:  DevToolsDock visível + ícone muda para 🔧              │
│         └── Persistência: localStorage.panda_dev_mode                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componente:** `components/Comp_AppDock.html`
**Lógica:** `4.ui/pf.devtools.js` → `toggleDevMode()`

## E.2 DevTools v2.0 - Ferramentas Disponíveis

| Tool                       | Ícone | Modal | Pop-out    | Descrição                          |
| -------------------------- | ----- | ----- | ---------- | ---------------------------------- |
| **Console**                | 💻    | ✅    | ✅         | Execução JavaScript em sandbox     |
| **MCP Browser**            | 🧰    | ✅    | ✅         | Lista de MCP Tools do Rust Agent   |
| **API Tester**             | 🔌    | ✅    | ✅         | Testar endpoints GAS               |
| **PAT Treasury**           | 🏦    | ✅    | ✅         | Controles do Banco Central IA      |
| **Constitution Validator** | ⚖️    | ✅    | ✅         | Validar ações contra os 12 Artigos |
| **Antigravity** ⭐         | 🐼    | ❌    | ✅ WebView | Coding Assistant (BYOL Gemini)     |

> **Antigravity** abre em **WebView nativo** no Rust Agent (não no browser).

## E.3 Multi-Window (Document PiP)

O sistema suporta destacar ferramentas para janelas separadas usando a **Document Picture-in-Picture API**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           JANELA PRINCIPAL                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Panda Factory (PandaFactory.html)            │   │
│  │  ┌─────────┐  ┌─────────────────────┐  ┌─────────┐              │   │
│  │  │ AppDock │  │     Canvas          │  │ DevDock │              │   │
│  │  └─────────┘  └─────────────────────┘  └─────────┘              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                    │ POP-OUT (Document PiP) │
         ┌──────────┴──────────┬─────────────┴────────────┐
         ▼                     ▼                          ▼
┌─────────────────┐  ┌─────────────────┐       ┌─────────────────┐
│  💻 Console     │  │  🧰 MCP Browser │  ...  │  🏦 PAT Treasury│
│   (Monitor 2)   │  │   (Monitor 3)   │       │   (Monitor N)   │
└─────────────────┘  └─────────────────┘       └─────────────────┘
```

**SDK API:**

```javascript
// Abrir ferramenta em janela separada
const pipWindow = await Panda.UI.popout("console", {
  width: 800,
  height: 600,
});

// Listar pop-outs ativos
const active = Panda.UI.getPopouts(); // Map<toolId, Window>

// Fechar pop-out
Panda.UI.closePopout("console");
```

**Compatibilidade:**

| Browser      | Suporte                   |
| ------------ | ------------------------- |
| Chrome 116+  | ✅ Document PiP nativo    |
| Edge 116+    | ✅ Document PiP nativo    |
| Firefox 115+ | ⚠️ Fallback window.open() |
| Safari 17+   | ⚠️ Fallback window.open() |

---

> 📖 **Versão:** 2.1.0 | **Consolidado:** UI + CSS + HTML + DevTools + Multi-Window

