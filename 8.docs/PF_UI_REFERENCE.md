---
tool_context: panda/ui
description: UI Layout System - Panda Fabrics, CSS Variables, Components
version: 6.6.0
updated: 2026-02-15
ssot: CONTEXT.md §5 (Sistema Montesquieu)
cross_ref: [PF_MASTER_ARCHITECTURE.md, PF_FILE_REGISTRY.md, PF_SDK_REFERENCE.md]
---

# 📐 PF_UI_REFERENCE - Panda Fabrics UI Layout System

> **Versão:** 6.6.0 | **Atualizado:** 2026-02-15
> **Referência:** `11.pf-app/src/styles/pf.css` (~2560 linhas)
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
11. [Footer](#11-footer-v65)
12. [Status Indicator States](#12-status-indicator-states-v63)
13. [LoginGate v8.0](#13-logingate-v80)
14. [Welcome Wizard v2.0](#14-welcome-wizard-v20)

---

## 1. Layout Grid

### Master Layout Structure

```text
┌─────────────────────────────────────────────────────────────────────┐
│         STATUS BAR (56px, document flow, NO position:fixed)         │
│  [Logo][Brand] │ [v6.3][Pills][☀/🌙] │ [90%][🏦92%][User][⚙✕🕐📌]│
├───────┬─────────────────────────────────────────────────────────────┤
│       │         CANVAS / FLEXLAYOUT TABS                           │
│ DOCK  │  ┌────────┐┌────────────┐┌────────────┐                   │
│ ~50px │  │ CANVAS ││ APP TAB ✕  ││ APP TAB ✕  │ ← tabs            │
│       │  └────────┘└────────────┘└────────────┘                   │
│       │         ACTIVE TAB CONTENT (flex: 1)                       │
│       │                                                            │
├───────┴─────────────────────────────────────────────────────────────┤
│              CHAT FAB (bottom-right floating)                      │
│              FOOTER (watermark)                                    │
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

.pf-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
}

/* ⚠️ .pf-main NÃO TEM margin-top (StatusBar está no document flow) */
.pf-main {
  flex: 1;
  position: relative;
  overflow: hidden;
}
```

---

## 2. Z-Index Hierarchy

> **REGRA:** Nunca ultrapassar a camada superior sem necessidade crítica.

| Layer           | Z-Index | Component                | Classe CSS                       |
| --------------- | ------- | ------------------------ | -------------------------------- |
| **Base**        | 0       | Canvas/TLDraw            | `.pf-canvas-wrapper`             |
| **Welcome**     | 100     | Welcome Overlay          | `.pf-welcome-overlay`            |
| **Grid**        | 999     | Canvas grid overlay      | `::after` pseudoelement          |
| **Docks**       | 1000    | Left/Right Sidebars      | `.pf-left-dock`                  |
| **Header**      | 2000    | Status Bar (PFStatusBar) | `.pf-status-bar`                 |
| **Chat**        | 3000    | Floating Chat            | `.pf-chat-fab`, `.pf-chat-panel` |
| **Store**       | 2000    | Store overlay            | `.pf-store-overlay`              |
| **Hover Strip** | 5001    | Collapsed bar trigger    | inline style (fixed top)         |
| **Settings**    | 5000    | Settings modal           | `.pf-settings-overlay`           |
| **Login**       | 10000   | Auth gate                | `.login-gate`                    |

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

## 4. Header/Status Bar (PFStatusBar v6.3)

> **Arquivo:** `11.pf-app/src/components/PFStatusBar.jsx` (369 linhas)
> **CSS:** `pf.css` linhas 580-665

### Dimensions

```css
.pf-status-bar {
  /* ⚠️ NO position:fixed — está no document flow */
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--pf-dock-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--pf-border);
  z-index: 2000;
  flex-shrink: 0; /* ← não encolhe */
}
```

### Header Layout (3 Sections)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                     PFStatusBar v6.3 (56px, document flow)               │
├────────────────┬──────────────────────────┬──────────────────────────────┤
│    BRAND       │        STATUS GROUP      │      HEADER CONTROLS         │
│  (flex-start)  │       (flex-center)      │       (flex-end)             │
├────────────────┼──────────────────────────┼──────────────────────────────┤
│ [Logo 50px]    │ [v6.3]                   │ [Energy 40px arc]            │
│ [Text 22px]    │ [FB●][GA●][RU●][AI●][GP●]│ [🏦 Treasury X%] (live)      │
│ "PANDA FABRICS"│ [☀/🌙 Theme Toggle]      │ [👤 User + Session] (dynamic)│
│  (click=Store) │                          │ [🏭 Founder] (if founder)    │
│                │                          │ [⚙️ Settings]                │
│                │                          │ [✕ SAIR] (red, logout)       │
│                │                          │ [🕐 Clock]                   │
│                │                          │ [📌 PIN] (far right, small)  │
└────────────────┴──────────────────────────┴──────────────────────────────┘
```

### Component Specs

| Component     | Size  | Class              | Notas                                          |
| ------------- | ----- | ------------------ | ---------------------------------------------- |
| Brand Logo    | 32×32 | `.pf-brand-logo`   | `panda-logo.png` (cropped, `object-fit:cover`) |
| Brand Text    | 22px  | `.pf-brand-text`   | Aurora gradient animado                        |
| Version Badge | 12px  | `.pf-version`      | Hardcoded "v6.5"                               |
| Status Pill   | auto  | `.pf-status-pill`  | FB, GA, RU, AI(=mcp), GP                       |
| Theme Toggle  | 32px  | `.pf-theme-toggle` | ☀️/🌙 + `.pf-header-btn`                       |
| Energy Arc    | 40px  | `.pf-arc-energy`   | SVG gradient (degrada sessão)                  |
| Treasury      | auto  | `.pf-treasury`     | 🏦 + `onTreasuryClick` → PAT Council           |
| User Status   | auto  | `.pf-user-status`  | 👤 + name(localStorage) + time                 |
| Founder Btn   | auto  | `.founder-btn`     | 🏭 `onFounderClick` (only if isFounder)        |
| Mining Btn    | auto  | `.pf-header-btn`   | ⛏️ `onMiningClick` → MiningPanel tab           |
| Defend Btn    | auto  | `.pf-header-btn`   | 🛡️ `onDefendClick` → DefendPanel tab           |
| Settings Btn  | auto  | `.pf-header-btn`   | ⚙️                                             |
| Exit Btn      | auto  | `.pf-header-btn`   | ✕ red — clears ALL auth tokens                 |
| Clock         | auto  | `.pf-clock`        | HH:MM format                                   |
| PIN           | 12px  | `.pf-pin-btn`      | 📌 — toggle auto-hide                          |

### PIN Behavior

| State    | Bar Visible | Hover Strip | localStorage key         |
| -------- | ----------- | ----------- | ------------------------ |
| Pinned   | ✅ always   | hidden      | `panda_statusbar_pinned` |
| Unpinned | ❌ hidden   | 6px fixed   | `panda_statusbar_pinned` |
| Hovered  | ✅ temp     | hidden      | (transient)              |

### Exit Button (SAIR) — Logout Logic

```javascript
// Clears ALL auth tokens and reloads:
sessionStorage.removeItem("panda_auth");
sessionStorage.removeItem("panda_auth_token");
localStorage.removeItem("panda_user");
localStorage.removeItem("panda_token");
localStorage.removeItem("panda_founder_mode");
window.location.reload();
```

> [!WARNING]
> **NÃO** há botão Fullscreen visível (🔳) — removido da UI. Usuário usa F11.
> ⚠️ A prop `onFullscreen` ainda existe no código para uso programático, mas **não renderiza botão**.
> **NÃO** existe StatusBar.jsx separada — DELETADA (era redundante).
> **NÃO** existe login-logout-btn (🚪) no LoginGate — REMOVIDO.

**⚠️ CRITICAL:** All header buttons in flex flow. Do NOT use `position: fixed` for elements inside header.

---

## 5. Dock System (PFDock v6.2)

> **Arquivo:** `11.pf-app/src/components/PFDock.jsx` (~364 linhas)
> **CSS:** `pf.css` linhas 260-395
> **Atualizado:** 2026-02-13 — Dock com 5 itens core (🔔 Notificações está na StatusBar, NÃO no Dock)

### Left Dock

```css
/* ⚠️ VALORES AUDITADOS 2026-02-09 contra pf.css */
.pf-dock-items {
  padding: 6px;
  border-radius: 14px;
  backdrop-filter: blur(20px);
  gap: 4px;
}

.pf-dock-item {
  width: 36px;
  height: 36px;
  font-size: 18px;
  border-radius: 10px;
}

.pf-dock-item.tool {
  width: 32px; /* sub-items menores */
  height: 32px;
  font-size: 15px;
}

.pf-dock-separator {
  height: 1px;
  margin: 4px 0;
}
```

### Dock Items (5 core)

```text
┌────────────────────────────────────────────────────┐
│           LEFT DOCK (PFDock v6.2)                   │
│           ⚠️ DRAGGABLE — position: fixed + drag     │
├────────────────────────────────────────────────────┤
│  ⋮⋮ (drag handle)                                   │
│  CORE TOOLS:                                        │
│  ├── 🎨 Ferramentas → onToolsClick (Right Toolbar)  │
│  ├── 📁 Catálogo    → onCatalogClick (modal)         │
│  ─── separator ─────────────────────────────────      │
│  QUICK ACCESS:                                       │
│  ├── [panda-logo 24×24] Panda Store → onStoreClick   │
│  ─── separator ─────────────────────────────────      │
│  SYSTEM:                                             │
│  ├── ⚙️ Settings    → onSettingsClick (modal)        │
│  └── 🛠️ Dev Mode    → onDevModeToggle (panel)       │
│  ─── separator (if plugins) ───────────────────      │
│  PLUGINS (dynamic):                                  │
│  └── [...] right-click: ABRIR/FECHAR/DESINSTALAR     │
└────────────────────────────────────────────────────┘
```

> [!NOTE]
> 💬 **Chat NÃO está no Dock.** O chat é acessível via FAB (floating action button)
> no canto inferior direito do footer. Veja §7 Chat System.

| #   | Ícone | Label         | Prop Handler      | Ação                              |
| --- | ----- | ------------- | ----------------- | --------------------------------- |
| 1   | 🎨    | Ferramentas   | `onToolsClick`    | Abre Right Toolbar (Drawing-only) |
| 2   | 📁    | Catálogo      | `onCatalogClick`  | Abre modal catálogo               |
| 3   | 🐼    | Panda Store   | `onStoreClick`    | Abre modal loja                   |
| 4   | ⚙️    | Configurações | `onSettingsClick` | Abre modal settings               |
| 5   | 🛠️    | Dev Mode      | `onDevModeToggle` | Toggle JamDevPanel                |

### Dock Total Width Calculation

```text
Dock item: 36px
Padding: 6px × 2 = 12px
Border: 1px × 2 = 2px
─────────────────
Total: ~50px
```

### Right Toolbar (Tools Panel) — Drawing Only

> **v6.5.1 (2026-02-13):** DevTools tab removido do Right Toolbar.
> Ferramentas agora contém **apenas** ferramentas de desenho (TLDraw).
> DevTools foram movidos para o `PFDevModePanel` (acessível via 🛠️ Dev Mode no Dock).

```css
.pf-right-toolbar {
  position: fixed;
  top: 56px; /* Below header */
  right: 0;
  width: 260px; /* When open */
  height: calc(100vh - 56px);
  z-index: 1000;
  padding: 16px;
}
```

### 5.1 Role-Based Dock Visibility

> **Decisão (v6.5.1, 2026-02-13):** Dev Mode está disponível para **TODOS** os usuários.
> Apenas o **Founder Dashboard** e **PAT Council** são exclusivos `isFounder`.

| Role        | Valor | Vê no Dock                       |
| ----------- | :---: | -------------------------------- |
| **Founder** |   1   | 5 itens core + DevMode + plugins |
| **Dev**     |   2   | 5 itens core + DevMode + plugins |
| **User**    |   3   | 5 itens core + DevMode + plugins |

#### Implementação Atual

```jsx
// PFDock.jsx — 5 core items (v6.5) — DRAGGABLE
function PFDock({
  onCatalogClick,
  onToolsClick,
  onStoreClick,
  // ⚠️ NÃO tem onChatClick — Chat é via FAB (§7)
  onSettingsClick,
  onDevModeToggle,
  devMode,
  isFounder, // ← usado para gating futuro; todos vêem DevMode hoje
  plugins,
  onPluginOpen,
  onPluginClose,
  onPluginUninstall,
}) {
  // Posição persistida em localStorage.panda_dock_position
  // Drag com threshold de 5px para evitar cliques acidentais
  const dockStyle = {
    position: "fixed",
    left: `${position.x}px`,
    top: position.y !== null ? `${position.y}px` : "50%",
    transform: position.y !== null ? "none" : "translateY(-50%)",
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <nav className="pf-left-dock" style={dockStyle}>
      <div className="pf-dock-drag-handle">⠿⠿</div>
      {/* CORE TOOLS */}
      <button onClick={onToolsClick} title="FERRAMENTAS">
        🎨
      </button>
      <button onClick={onCatalogClick} title="CATÁLOGO">
        📁
      </button>
      <div className="pf-dock-separator" />
      {/* STORE */}
      <button onClick={onStoreClick} title="PANDA STORE">
        🐼
      </button>
      <div className="pf-dock-separator" />
      {/* SYSTEM */}
      <button onClick={onSettingsClick} title="CONFIGURAÇÕES">
        ⚙️
      </button>
      <button onClick={() => onDevModeToggle(!devMode)} title="DEV MODE">
        {devMode ? "🔧" : "🛠️"}
      </button>
      {/* PLUGINS (dynamic, right-click context menu) */}
    </nav>
  );
}
```

### 5.2 Event Wiring (App.jsx v6.5)

```jsx
// App.jsx v6.5 — Connecting dock to state
// ⚠️ NÃO passa onChatClick — Chat abre via FAB popup no footer
<PFDock
  onToolsClick={() => {
    const next = !showRightToolbar;
    setShowRightToolbar(next);
    if (next) setShowSettings(false);
  }}
  onCatalogClick={() => setShowCatalog(true)}
  onStoreClick={() => setShowStore(true)}
  onSettingsClick={() => setShowSettings(true)}
  onDevModeToggle={(isActive) => {
    setDevMode(isActive);
    if (isActive) openAppWindow("devtools");
  }}
  plugins={installedPlugins}
  devMode={devMode}
/>
```

---

## 6. Modal System

### Standard Modal Structure

```css
.pf-settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 5000;
}

.pf-settings-modal {
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
| PDP      | 900px     | 80vh       |
| Catalog  | 900px     | 80vh       |
| Login    | 400px     | auto       |

### Settings Sections (v6.5.1)

> **Atualizado 2026-02-13:** Seção "Developer" **REMOVIDA** do PFSettings.
> DevTools e configurações de dev agora são acessíveis via `PFDevModePanel` (🛠️ no Dock).

| #   | Seção         | Ícone | Descrição                  |
| --- | ------------- | ----- | -------------------------- |
| 1   | Profile       | 👤    | Nome, avatar, role         |
| 2   | Appearance    | 🎨    | Tema, cores, layout        |
| 3   | Notifications | 🔔    | Preferências de alertas    |
| 4   | AI Settings   | 🧠    | Modelos, tokens, prompts   |
| 5   | Wallet        | 💰    | Carteira PAT/PAXG          |
| 6   | Mining        | ⛏️    | Configuração de mineração  |
| 7   | Security      | 🔒    | 2FA, sessões, logs         |
| 8   | Integrations  | 🔌    | APIs, webhooks, 3rd party  |
| 9   | About         | ℹ️    | Versão, créditos, licenças |

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
.pf-chat-fab {
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
.pf-chat-panel {
  position: fixed;
  bottom: 90px; /* Above FAB */
  right: 24px;
  width: 380px;
  max-height: 500px;
  border-radius: 16px;
  z-index: 3000;
}
```

### External Toggle (v6.0)

> **Novo:** O chat pode ser aberto/fechado externamente via Custom Event.
> Usado pelo Dock (💬) e pelo Welcome Overlay.

```javascript
// Abrir/fechar chat de qualquer componente:
window.dispatchEvent(new CustomEvent("panda:chat-toggle-internal"));

// PFChat.jsx escuta:
useEffect(() => {
  const handleToggle = () => setIsOpen((prev) => !prev);
  window.addEventListener("panda:chat-toggle-internal", handleToggle);
  return () =>
    window.removeEventListener("panda:chat-toggle-internal", handleToggle);
}, []);
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
.pf-main {
  flex: 1;
  position: relative;
  overflow: hidden;
  /* ⚠️ SEM margin-top — StatusBar está no document flow */
}

.pf-canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  isolation: isolate;
}
```

### 8.1 Welcome Overlay (v6.0)

> **Arquivo:** `PFCanvas.jsx` (componente `WelcomeOverlay` inline)
> **CSS:** `pf.css` — seção `.pf-welcome-overlay`
> **Z-Index:** 100 (acima do canvas, abaixo de tudo)

Aparece **somente** quando o canvas está vazio E não foi descartado na sessão.

```text
┌──────────────────────────────────────────────┐
│            WELCOME OVERLAY (z:100)            │
│                                               │
│   🐼 Logo (animação bounce)                   │
│   "Bem vindo ao Panda Fabrics!"               │
│                                               │
│   ┌──────┐  ┌──────────┐  ┌──────────┐       │
│   │DESENHAR│  │PANDA STORE│  │ PANDA AI │      │
│   │  🎨   │  │    🏪     │  │   💬     │      │
│   └──────┘  └──────────┘  └──────────┘       │
│                                               │
│   [Skip] (dismiss, salva em sessionStorage)   │
└──────────────────────────────────────────────┘
```

**Ações dos cards:**
| Card | Ação |
| ------------ | ------------------------------------------- |
| DESENHAR | Seleciona tool "draw" no TLDraw editor |
| PANDA STORE | `dispatch('panda:open-store')` → abre Store |
| PANDA AI | `dispatch('panda:toggle-chat')` → toggle AI |

**Persistência:** `sessionStorage.setItem('panda_welcome_dismissed', 'true')`

### Grid Overlay

```css
/* Dark mode grid */
.pf-canvas-wrapper.dark.show-grid::after {
  background-image:
    linear-gradient(rgba(102, 126, 234, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 126, 234, 0.25) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 999;
}

/* Light mode grid */
.pf-canvas-wrapper.light.show-grid::after {
  background-image:
    linear-gradient(rgba(180, 180, 190, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(180, 180, 190, 0.4) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 999;
}
```

---

## 9. Theme Modes

### CSS Variables

| Variable          | Dark Mode           | Light Mode             |
| ----------------- | ------------------- | ---------------------- |
| `--pf-bg`         | #1a1a2e             | #f5f5f7                |
| `--pf-surface`    | #16213e             | #ffffff                |
| `--pf-text`       | #eaeaea             | #1a1a2e                |
| `--pf-text-muted` | #8a8a9a             | #6a6a7a                |
| `--pf-border`     | #2a2a4e             | #e0e0e5                |
| `--pf-dock-bg`    | rgba(22,33,62,0.95) | rgba(255,255,255,0.95) |

### Toggle Method

```javascript
// Toggle dark/light mode
document.body.classList.toggle("light-mode");

// Check current mode
const isLight = document.body.classList.contains("light-mode");
```

### 9.1 DevModePanel Light Mode (v6.5.1)

> **Atualizado 2026-02-13:** `PFDevModePanel.css` expandido com ~130 linhas de
> overrides `body.light-mode` cobrindo **todos** os sub-painéis:

| Sub-painel       | Seletor light mode                           |
| ---------------- | -------------------------------------------- |
| Close button     | `body.light-mode .devmode-header .btn-close` |
| Section labels   | `body.light-mode .section-label`             |
| MCP toggle       | `body.light-mode .mcp-toggle-compact`        |
| Tool view header | `body.light-mode .tool-view-header`          |
| Tool content     | `body.light-mode .tool-content`              |
| MCP items        | `body.light-mode .mcp-tool-item`             |
| Constitution     | `body.light-mode .constitution-article`      |
| Treasury         | `body.light-mode .treasury-stat`             |
| Console          | `body.light-mode .console-output`            |
| API tester       | `body.light-mode .api-section`               |
| Publish section  | `body.light-mode .publish-section`           |
| Footer           | `body.light-mode .devmode-footer`            |

---

## 10. Troubleshooting

### Common Issues

| Problema                 | Causa                    | Solução                               |
| ------------------------ | ------------------------ | ------------------------------------- |
| Elementos sobrepondo     | z-index incorreto        | Verificar tabela de layers            |
| Header cortando conteúdo | StatusBar não no flow    | StatusBar DEVE estar no document flow |
| Dock atrás do header     | z-index < 2000           | Dock deve ser z-index: 1000           |
| Modal atrás de outros    | z-index baixo            | Modal deve ser z-index: 5000+         |
| Botão fora do fluxo      | position: fixed indevido | Usar flex dentro do container         |
| Duas barras de status    | StatusBar.jsx duplicada  | DELETADA — só PFStatusBar existe      |
| Botão 🚪 top-left        | LoginGate logout btn     | REMOVIDO — logout está no ✕ da bar    |
| Founder tab não abre     | activeTabset null        | Fallback p/ tabset 'main' (v6.2.1)    |

### Debug Checklist

```text
□ Header height = 56px (pf-status-bar)
□ Canvas SEM margin-top (StatusBar no document flow)
□ Dock items = 36x36px, padding 6px, radius 14px (5 itens)
□ Left dock z-index = 1000
□ Modals z-index = 5000
□ Chat z-index = 3000
□ Login gate z-index = 10000
□ NÃO existe StatusBar.jsx (deletada)
□ NÃO existe login-logout-btn (removido do LoginGate)
□ NÃO existe botão fullscreen (removido)
```

## 11. Footer (v6.5)

> **CSS:** `pf.css` — seção `.pf-footer`
> **JSX:** `App.jsx` — watermark + TLDraw + Medusa attribution
> **⚠️ Posicionamento:** Document flow (`flex-shrink: 0`), NÃO `position: fixed`

```css
/* ⚠️ AUDITADO 2026-02-12 — footer está no document flow, NÃO é fixed */
.pf-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 16px;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--pf-text-muted);
  opacity: 0.5;
  background: var(--pf-elevation-0, #1a1a2e);
  border-top: 1px solid var(--pf-border);
  flex-shrink: 0;
  text-transform: uppercase;
}
```

**Conteúdo:** `• 🐼 PANDA FABRICS • POWERED BY TLDRAW • 🐙 MEDUSA • v6.5`

| Classe               | Função                             |
| -------------------- | ---------------------------------- |
| `.pf-footer-accent`  | Dot decorativo (4px, gradient)     |
| `.pf-footer-version` | Badge de versão (fundo azul sutil) |

---

## 12. Status Indicator States (v6.3)

> **CSS:** `pf.css` — seção `.pf-status-dot`
> **Hook:** `useHealthStatus.js` → mapeia status → classe CSS

| Estado          | Classe CSS     | Cor       | Glow            | Uso                       |
| --------------- | -------------- | --------- | --------------- | ------------------------- |
| **Online**      | `.online`      | `#10b981` | green glow 8px  | Serviço conectado         |
| **Warning**     | `.warning`     | `#f59e0b` | amber glow 8px  | Latência alta / degraded  |
| **Offline**     | `.offline`     | `#ef4444` | red glow 8px    | Serviço caiu / erro       |
| **Unavailable** | `.unavailable` | `#6b7280` | grey subtle 4px | Recurso não presente (GP) |

```css
/* GP "unavailable" — grey pulsing dot, distinct from red "offline" */
.pf-status-dot.unavailable {
  background: #6b7280;
  animation: pf-pulse-grey 3s ease-in-out infinite;
}
```

---

## 13. LoginGate v8.0

> **Arquivo:** `PFLoginGate.jsx` (~305 linhas)
> **CSS:** `pf.css` — seção `.login-*`
> **Z-Index:** 10000 (acima de tudo)
> **Atualizado:** 2026-02-15

### Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│                   LOGIN GATE (z:10000, full viewport)            │
├───────────────────────────────┬──────────────────────────────────┤
│        HERO SECTION           │         FORM SECTION             │
│  (gradient background)        │   (glass card, max-width 400px)  │
├───────────────────────────────┼──────────────────────────────────┤
│ 🐼 Logo (bounce animation)    │  "Welcome back"                  │
│ "Panda Factory"               │  "Sign in to access..."          │
│ "Your AI-Powered Creative..." │                                  │
│                               │  [Google Sign-in] (disabled)     │
│ Product description (3 lines) │  ──── or ────                    │
│                               │  [Email input]                   │
│ ┌─────┬──────┬──────┬──────┐  │  [Password input]                │
│ │Open │6 AI  │12+   │  ∞   │  │  [SIGN IN] (gradient button)    │
│ │Src  │Models│Ext   │Canvas│  │  🔓 Free to explore...           │
│ └─────┴──────┴──────┴──────┘  │  [Forgot password?]              │
│                               │                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐   │  ▸ Demo Credentials (collapsible)│
│ │Canvas│ │ AI   │ │Store │   │                                  │
│ │  🎨  │ │ 🤖  │ │ 🏪  │   │  Footer: Panda Fabrics 2026      │
│ ├──────┤ ├──────┤ ├──────┤   │                                  │
│ │Mining│ │Modular│ │Sync │   │                                  │
│ │  ⛏  │ │ 🧩  │ │ 🔄  │   │                                  │
│ └──────┘ └──────┘ └──────┘   │                                  │
│                               │                                  │
│ [React][Gemini][Firebase]...  │                                  │
│ [v6.5 — MVP] (green badge)    │                                  │
└───────────────────────────────┴──────────────────────────────────┘
```

### Hero Features

| Feature            | Classe CSS             | Descrição                                                   |
| ------------------ | ---------------------- | ----------------------------------------------------------- |
| Tagline            | `.login-tagline`       | "Your AI-Powered Creative Studio"                           |
| Description        | `.login-description`   | 3-line product description                                  |
| Stats Row          | `.login-stats`         | 4-card grid: Open Source, 6 AI, 12+ Ext, ∞ Canvas           |
| Feature Cards (×6) | `.login-features`      | 2-col grid: Canvas, AI, Store, Mining, Modular, Sync        |
| Tech Badges        | `.login-tech-badges`   | React, Gemini AI, Firebase, tldraw, GitHub Actions, Ed25519 |
| Version Badge      | `.login-version-badge` | Green pill: `v6.5 — MVP`                                    |

### Form Features

| Feature          | Classe CSS            | Descrição                           |
| ---------------- | --------------------- | ----------------------------------- |
| Google Sign-in   | `.login-google-btn`   | Disabled (Coming Soon badge)        |
| Email/Password   | `.login-form`         | Standard inputs with error display  |
| Trust Signal     | `.login-free-hint`    | 🔓 Free to explore — no credit card |
| Forgot Password  | `.login-forgot-btn`   | Placeholder (alert on click)        |
| Demo Credentials | `.login-demo-details` | Collapsible `<details>` element     |
| Footer           | `.login-form-footer`  | © Panda Fabrics 2026                |

---

## 14. Welcome Wizard v2.0

> **Arquivo:** `PFWelcomeWizard.jsx` (~290 linhas)
> **CSS:** `PFWelcomeWizard.css` (~110 linhas)
> **Z-Index:** 15000 (acima do LoginGate)
> **Atualizado:** 2026-02-15

### Structure

```text
┌──────────────────────────────────────────────────────┐
│ ✕ (close btn, top-right, glassmorphism)       z:15000│
├──────────────────────────────────────────────────────┤
│                                                      │
│  Step N / 4                                          │
│  ┌────────────────────────────────────────────────┐  │
│  │           STEP CONTENT (animated)              │  │
│  │ Step 1: Welcome + overview                     │  │
│  │ Step 2: Canvas tools + drawing                 │  │
│  │ Step 3: AI chat + store overview               │  │
│  │ Step 4: 3 CTA cards (Canvas | Store | Chat)    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ● ● ● ● (step indicators)                          │
│                                                      │
│  [← BACK]   [SKIP / CLOSE]   [NEXT → / FINISH ✓]   │
└──────────────────────────────────────────────────────┘
```

### Controls

| Control        | Classe CSS              | Comportamento                            |
| -------------- | ----------------------- | ---------------------------------------- |
| ✕ Close        | `.pf-wizard-close-btn`  | Always visible, glassmorphism, top-right |
| SKIP / CLOSE   | `.pf-wizard-skip-btn`   | "SKIP" steps 1-3, "CLOSE" on step 4      |
| BACK           | `.pf-wizard-back-btn`   | Visible from step 2 onward               |
| NEXT →         | `.pf-wizard-next-btn`   | Steps 1-3 only                           |
| FINISH ✓       | `.pf-wizard-finish-btn` | Step 4 only, green gradient              |
| ESC key        | (keyboard)              | Closes wizard from any step              |
| ← → Arrow keys | (keyboard)              | Navigate between steps                   |

### Persistence

```javascript
// Wizard completion persisted in localStorage:
localStorage.setItem("panda_wizard_completed", "true");
// Display logic:
// Shows ONLY on first login (wizard not completed) AND after LoginGate auth passes
```

> [!NOTE]
> **Phase 2 (deferred):** First-use pulsing dot tooltips on Chat FAB, Dock, Settings, Store icon.

---

## Links Relacionados

- CSS Design System (consolidado abaixo - PARTE B)
- Jam React Components (consolidado abaixo - PARTE D)
- [pf.css](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/11.pf-app/src/styles/pf.css)
- [PANDA.md](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/.agent/PANDA.md)

---

# PARTE B: CSS Design System

> **Status:** ✅ Totalmente implementado em `pf.css` — namespace `--pf-*`
> **Consolidado de:** `PF_CSS_REFERENCE.md` | **Fonte:** `11.pf-app/src/styles/pf.css`
>
> Tokens B.1–B.8 todos implementados: cores, spacing, radius, shadows, elevation, motion, skeleton, focus, animations, components.

## B.1 Cores Base

```css
/* Cores Primárias */
--accent-primary: #0f172a; /* Navy (light mode) */
--accent-primary-hover: #1e293b; /* Navy lighter */
--accent-primary-light: rgba(15, 23, 42, 0.1);

/* Status */
--accent-success: #10b981; /* Verde */
--accent-warning: #f59e0b; /* Amarelo */
--accent-error: #ef4444; /* Vermelho */
--accent-info: #3b82f6; /* Azul info */
--accent-glow: 0 0 15px rgba(102, 126, 234, 0.3);
```

## B.2 Fundos

```css
/* Light Mode */
--bg-app: #f0f2f5; /* Fundo principal */
--bg-card: #ffffff; /* Cards */
--bg-panel: rgba(255, 255, 255, 0.7); /* Glassmorphism */
--bg-input: #ffffff; /* Inputs */
--bg-secondary: #f9fafb; /* Secundário */
--bg-card-hover: var(--gray-100); /* Hover */

/* Header */
--header-bg: rgba(240, 242, 245, 0.85); /* Glassmorphism */
--header-height: 56px; /* ⚠️ FIXED - NÃO MUDAR */
```

## B.3 Texto

```css
--text-primary: #111827; /* Texto principal */
--text-secondary: #4b5563; /* Texto secundário */
--text-inverted: #ffffff; /* Texto em fundo escuro */
```

## B.4 Bordas e Sombras

```css
/* Bordas */
--border-subtle: rgba(0, 0, 0, 0.08);
--border-default: rgba(0, 0, 0, 0.12);
--border-focus: #3b82f6;
--border-error: #ef4444;

/* Sombras (dark mode defaults — light mode overrides abaixo) */
--pf-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
--pf-shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
--pf-shadow-dock: 0 8px 25px rgba(0, 0, 0, 0.4);
--pf-shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
--pf-shadow-glow: 0 0 20px rgba(102, 126, 234, 0.3);
```

## B.5 Sizing & Spacing

```css
/* Border Radius */
--pf-radius-sm: 6px;
--pf-radius-btn: 8px;
--pf-radius-card: 12px;
--pf-radius-modal: 16px;
--pf-radius-full: 9999px;

/* Spacing */
--pf-space-xs: 4px;
--pf-space-sm: 8px;
--pf-space-md: 16px;
--pf-space-lg: 24px;
--pf-space-xl: 32px;
```

## B.6 Animações

```css
/* Composite Transitions (--pf- namespace) */
--pf-transition-fast: var(--pf-duration-fast) var(--pf-ease-default);
--pf-transition-base: var(--pf-duration-base) var(--pf-ease-default);
--pf-transition-slow: var(--pf-duration-slow) var(--pf-ease-out);

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

> **ATENÇÃO:** O JAM React usa `body.light-mode` (padrão escuro). As vars abaixo são do HTML legacy.

```css
body.dark-mode {
  /* HTML legacy — JAM usa body.light-mode */
  --bg-app: #0a0a0a;
  --bg-card: #111111;
  --bg-panel: rgba(20, 20, 20, 0.7);
  --bg-input: #000000;
  --bg-secondary: #111111;
  --text-primary: #ededed;
  --text-secondary: #888888;
  --text-inverted: #000000;
  --border-subtle: #333333;
  --border-focus: #555555;
  --border-color: #333333;
  --header-bg: rgba(10, 10, 10, 0.8);
  --accent-primary: #ededed;
  --bg-card-hover: #1a1a1a;
}
```

### B.7.1 Elevation Tokens (P1 - Design System)

> **Inspiração:** IBM Carbon Design System
> **Filosofia:** No dark mode, usar **cores** para indicar elevação, NÃO sombras.

```css
/* ANTES (tradicional - não usar em dark mode) */
.modal-old {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

/* DEPOIS (elevation by color - IBM Carbon style) */
body.light-mode {
  /* Light Mode - Sombras OK */
  --pf-elevation-0: #ffffff;
  --pf-elevation-1: #f6f8fa;
  --pf-elevation-2: #ffffff;
  --pf-elevation-3: #ffffff;
}

:root {
  /* Dark Mode (default) - Cores progressivas (mais claras = mais alto) */
  --pf-elevation-0: #1a1a2e; /* Base */
  --pf-elevation-1: #16213e; /* Cards */
  --pf-elevation-2: #1e2a4a; /* Modals, Dropdowns */
  --pf-elevation-3: #2a3a5e; /* Tooltips, Popovers */
}

/* Uso */
.card {
  background: var(--pf-elevation-1);
  border: 1px solid var(--pf-border);
}

.modal {
  background: var(--pf-elevation-2);
  border: 1px solid var(--pf-border);
}

.tooltip {
  background: var(--pf-elevation-3);
}
```

| Nível | Componente         | Cor Light | Cor Dark  |
| ----- | ------------------ | --------- | --------- |
| **0** | App background     | `#ffffff` | `#1a1a2e` |
| **1** | Cards, Panels      | `#f6f8fa` | `#16213e` |
| **2** | Modals, Dropdowns  | `#ffffff` | `#1e2a4a` |
| **3** | Tooltips, Popovers | `#ffffff` | `#2a3a5e` |

> **Regra:** Em dark mode, NUNCA usar `box-shadow` para indicar elevação. Usar apenas `--pf-elevation-N` tokens.

### B.7.2 Transition Tokens (Motion System)

> **Inspiração:** Material Design 3 + Vercel Geist
> **Filosofia:** Animações sutis e performáticas. Usar `cubic-bezier` para naturalidade.

```css
:root {
  /* Duration Tokens */
  --pf-duration-instant: 50ms; /* Micro-feedback (hover states) */
  --pf-duration-fast: 150ms; /* Botões, toggles */
  --pf-duration-base: 250ms; /* Cards, modals appearing */
  --pf-duration-slow: 350ms; /* Page transitions */

  /* Easing Tokens */
  --pf-ease-default: cubic-bezier(0.4, 0, 0.2, 1); /* Standard */
  --pf-ease-in: cubic-bezier(0.4, 0, 1, 1); /* Entering */
  --pf-ease-out: cubic-bezier(0, 0, 0.2, 1); /* Exiting */
  --pf-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful */

  /* Composite Tokens (recomendado) */
  --pf-transition-fast: var(--pf-duration-fast) var(--pf-ease-default);
  --pf-transition-base: var(--pf-duration-base) var(--pf-ease-default);
  --pf-transition-slow: var(--pf-duration-slow) var(--pf-ease-out);
}

/* Uso Padrão */
.btn {
  transition:
    background-color var(--pf-transition-fast),
    transform var(--pf-transition-fast),
    box-shadow var(--pf-transition-fast);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

.card {
  transition:
    transform var(--pf-transition-base),
    box-shadow var(--pf-transition-base);
}

.card:hover {
  transform: translateY(-2px);
}
```

| Token                | Duração | Uso                  |
| -------------------- | ------- | -------------------- |
| `--duration-instant` | 50ms    | Micro-feedback       |
| `--duration-fast`    | 150ms   | Botões, inputs       |
| `--duration-base`    | 250ms   | Cards, modals        |
| `--duration-slow`    | 350ms   | Transições de página |

### B.7.3 Skeleton Loaders (Loading States)

> **Filosofia:** Enquanto carrega, mostrar placeholder animado. Melhora percepção de velocidade.

```css
/* Skeleton Base */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--pf-elevation-1) 25%,
    var(--pf-elevation-2) 50%,
    var(--pf-elevation-1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite ease-in-out;
  border-radius: var(--pf-radius-btn);
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Variants */
.skeleton-text {
  height: 1em;
  margin-bottom: 0.5em;
}

.skeleton-title {
  height: 1.5em;
  width: 60%;
  margin-bottom: 1em;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-card {
  height: 200px;
  border-radius: var(--pf-radius-card);
}
```

**Uso em HTML:**

```html
<!-- Skeleton Card Example -->
<div class="card">
  <div class="skeleton skeleton-avatar"></div>
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text" style="width: 80%"></div>
  <div class="skeleton skeleton-text" style="width: 60%"></div>
</div>
```

### B.7.4 Focus States (Acessibilidade)

> **Obrigatório:** Todo elemento interativo DEVE ter `:focus-visible` visível.
> **WCAG 2.1 AA:** Contraste mínimo 3:1 para indicadores de foco.

```css
/* Focus Ring Global */
:focus-visible {
  outline: 2px solid var(--accent-info);
  outline-offset: 2px;
}

/* Remove outline padrão do browser */
:focus:not(:focus-visible) {
  outline: none;
}

/* Focus específico por componente */
.btn:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}

.form-input:focus-visible {
  border-color: var(--accent-info);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.card:focus-visible {
  outline: 2px solid var(--accent-info);
  outline-offset: 2px;
}

/* Skip Link (acessibilidade) */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent-primary);
  color: var(--text-inverted);
  padding: 8px 16px;
  z-index: 10000;
  transition: top var(--pf-transition-fast);
}

.skip-link:focus {
  top: 0;
}
```

| Componente | Focus Ring | Offset |
| ---------- | ---------- | ------ |
| Botões     | 2px solid  | 2px    |
| Inputs     | 3px shadow | 0      |
| Cards      | 2px solid  | 2px    |
| Links      | underline  | -      |

### B.7.5 Micro-animations (Polish)

> **Filosofia:** Animações sutis que dão feedback e tornam a UI viva.

```css
/* Hover animations para interativos */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--pf-shadow-modal);
}

/* Button press feedback */
.btn:active {
  transform: scale(0.98);
}

/* Icon spin (loading) */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.icon-loading {
  animation: spin 1s linear infinite;
}

/* Fade in on mount */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in var(--pf-duration-base) var(--pf-ease-out);
}

/* Pulse for attention */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Scale in (modals) */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal {
  animation: scale-in var(--pf-duration-base) var(--pf-ease-out);
}
```

| Animação | Uso                  | Classe             |
| -------- | -------------------- | ------------------ |
| Fade In  | Elementos aparecendo | `.animate-fade-in` |
| Pulse    | Chamar atenção       | `.animate-pulse`   |
| Spin     | Loading icons        | `.icon-loading`    |
| Scale In | Modals               | Automático         |

---

## B.8 Componentes Padrão

```css
/* Card */
.card {
  background: var(--pf-elevation-1);
  border-radius: var(--pf-radius-card);
  box-shadow: var(--pf-shadow-card);
  border: 1px solid var(--pf-border);
  padding: var(--pf-space-md);
}

/* Botão Primário */
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverted);
  border-radius: var(--pf-radius-btn);
  padding: var(--pf-space-sm) var(--pf-space-md);
  transition: var(--pf-transition-fast);
}
.btn-primary:hover {
  background: var(--accent-primary-hover);
}

/* Input */
.input {
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--pf-radius-btn);
  padding: var(--pf-space-sm) var(--pf-space-md);
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

| Componente          | Arquivo                       | Descrição                  |
| ------------------- | ----------------------------- | -------------------------- |
| **Header**          | `Comp_HeaderStatus.html`      | Status pills, logo         |
| **AppDock**         | `Comp_AppDock.html`           | Dock lateral esquerda      |
| **Sidebar**         | `Comp_Sidebar.html`           | Sidebar navegação          |
| **Settings**        | `Comp_SettingsModal.html`     | Modal 12 seções (React: 9) |
| **Treasury**        | `Comp_TreasuryDashboard.html` | Dashboard PAXG/USDC        |
| **DevTools**        | `Comp_DevToolsDock.html`      | Ferramentas dev            |
| **LoginOverlay**    | `Comp_LoginOverlay.html`      | Auth gate overlay          |
| **TentacleMonitor** | `Comp_TentacleMonitor.html`   | Monitor de integrações     |

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
11.pf-app/src/
├── main.jsx                     # Entry point React
├── App.jsx                      # Main app v6.5
├── components/
│   ├── PFCanvas.jsx              # tldraw wrapper
│   ├── PFDock.jsx                # 5 itens v6.2
│   ├── PFStatusBar.jsx           # Top bar v6.3
│   ├── PFStore.jsx               # Medusa Store v4.0
│   ├── PFSettings.jsx + .css     # Configurações
│   ├── PFChat.jsx                # AI Chat (Gemini)
│   ├── PFCatalog.jsx             # Apps instalados
│   ├── PFRightToolbar.jsx        # Toolbar direita (drawing tools)
│   ├── PFNotifications.jsx + .css # Centro de notificações
│   ├── PFWindowManager.jsx       # FlexLayout multi-window
│   ├── PFHeader.jsx              # (legacy header)
│   ├── PFFounderDashboard.jsx + .css # Founder dashboard
│   ├── PFFounderModal.jsx + .css  # Founder modal
│   ├── PFFounderPopout.jsx + .css # Popout variant
│   ├── PFFinancePanel.jsx + .css  # Treasury/finance
│   ├── PFGasometerPanel.jsx + .css # GAS usage monitor
│   ├── PFMiningPanel.jsx           # ⛏️ Mining panel (PAT mining config)
│   ├── PFDevModePanel.jsx + .css  # Dev mode panel (+ Publish pipeline)
│   ├── PFDefendPanel.jsx          # 🛡️ Panda Defend user security panel
│   ├── PFCouncilPanel.jsx + .css  # PAT Council
│   ├── PFDefendDashboard.jsx + .css # Security dashboard
│   ├── PFBundleCreator.jsx + .css # Bundle creation
│   ├── PFCheckoutModal.jsx + .css # Checkout v2.0 (Medusa badges)
│   ├── PFProductDetail.jsx + .css # Product Detail Page
│   ├── PFPluginEditor.jsx + .css  # Plugin manifest editor
│   ├── PFPanicButton.jsx + .css   # Kill switch
│   ├── PFLoginModal.jsx + .css    # Auth modal
│   └── PFLoginGate.jsx            # Auth gate
└── hooks/
    ├── useAuth.jsx               # Auth provider
    ├── useFirebase.js            # Firebase connection
    ├── useGAS.js                 # GAS endpoints
    ├── useHealthStatus.js        # Health polling
    ├── useFounderMetrics.js      # Dashboard metrics
    ├── useMarketplace.js         # Marketplace hooks
    ├── useCheckout.js            # Checkout hooks
    ├── useGasometer.js           # GAS usage hooks
    └── useLandingPage.js         # Landing page hooks
```

> [!IMPORTANT]
> `StatusBar.jsx` e `StatusBar.css` foram **DELETADOS** 2026-02-08.
> As status pills já existem no `PFStatusBar.jsx`.

## D.2 Componentes por Categoria

### Core Layout

| Componente            | Função                       |
| --------------------- | ---------------------------- |
| `App.jsx`             | Container principal v6.5     |
| `PFCanvas.jsx`        | Canvas tldraw wrapper        |
| `PFDock.jsx`          | Dock esquerda v6.2 (5 itens) |
| `PFStatusBar.jsx`     | Status bar topo v6.3         |
| `PFRightToolbar.jsx`  | Toolbar direita (draw tools) |
| `PFNotifications.jsx` | Centro de notificações v1.0  |
| `PFWindowManager.jsx` | Multi-window (flexlayout)    |

### Modals & Panels

| Componente               | Função                                        |
| ------------------------ | --------------------------------------------- |
| `PFSettings.jsx`         | Configurações (9 seções)                      |
| `PFStore.jsx`            | Loja Medusa v4.0 (12 extensões, PDP + embeds) |
| `PFProductDetail.jsx`    | Product Detail Page com embed links           |
| `PFCatalog.jsx`          | Catálogo instalados                           |
| `PFCheckoutModal.jsx`    | Checkout v2.0 (Medusa badges)                 |
| `PFFounderDashboard.jsx` | Dashboard founder                             |
| `PFFounderModal.jsx`     | Founder modal wrapper                         |
| `PFFounderPopout.jsx`    | Document PiP pop-out                          |
| `PFLoginModal.jsx`       | Login Google/Email                            |
| `PFGasometerPanel.jsx`   | Monitor de uso GAS                            |
| `PFFinancePanel.jsx`     | Treasury/finance panel                        |
| `PFDevModePanel.jsx`     | DevTools panel (Console, MCP, API, Publish)   |
| `PFCouncilPanel.jsx`     | PAT Council (Constitution + Treasury)         |
| `PFMiningPanel.jsx`      | ⛏️ Mining panel (PAT mining config)           |
| `PFDefendPanel.jsx`      | 🛡️ Panda Defend (user security)               |
| `PFBundleCreator.jsx`    | Criador de bundles                            |
| `PFPanicButton.jsx`      | Kill switch (emergência)                      |
| `PFPluginEditor.jsx`     | Editor de manifest de plugins                 |

### Hooks

| Hook                   | Versão | Função                             |
| ---------------------- | ------ | ---------------------------------- |
| `useAuth.jsx`          | v1.1   | Autenticação                       |
| `useFirebase.js`       | v1.0   | Firebase RTDB + Auth               |
| `useGAS.js`            | v1.1   | GAS endpoints + Fault Isolation    |
| `useHealthStatus.js`   | v1.1   | Health polling (live no StatusBar) |
| `useFounderMetrics.js` | v1.1   | Dashboard + Telemetry              |
| `useMarketplace.js`    | v1.0   | Marketplace hooks                  |
| `useCheckout.js`       | v1.0   | Checkout flow                      |
| `useGasometer.js`      | v1.0   | GAS usage monitor hooks            |
| `useLandingPage.js`    | v1.0   | Landing page state                 |

## D.3 App.jsx v6.5 Structure

```jsx
<AuthProvider>
  <LoginGate>
    <AppContent>
      <PFStatusBar />{" "}
      {/* Top — onMiningClick, onDefendClick, onTreasuryClick */}
      <PFWindowManager>
        {/* FlexLayout tabs — componentFactory below */}
        <PFCanvas /> {/* Default tab */}
      </PFWindowManager>
      <PFDock /> {/* Left — isFounder prop passed */}
      <PFRightToolbar /> {/* Right (Drawing-only, when open) */}
      <PFChat /> {/* Floating FAB */}
      <PFSettings /> {/* Modal */}
      <PFCatalog /> {/* Modal */}
      <PFStore /> {/* Modal (conditional) */}
      <PFNotifications /> {/* Panel */}
      <GasometerPanel /> {/* Modal (conditional) */}
      <footer /> {/* Watermark */}
    </AppContent>
  </LoginGate>
</AuthProvider>
```

### componentFactory (FlexLayout tabs)

| componentType       | Componente                | Notas                          |
| ------------------- | ------------------------- | ------------------------------ |
| `founder-dashboard` | `<FounderDashboard />`    | Founder-only                   |
| `pat-council`       | `<PATCouncilPanel />`     | Treasury/Constitution sub-tool |
| `devtools`          | `<DevModePanel />`        | Console, MCP, API, Publish     |
| `settings`          | `<PFSettings embedded />` | Embedded variant               |
| `store`             | `<PFStore embedded />`    | Embedded variant               |
| `catalog`           | `<PFCatalog embedded />`  | Embedded variant               |
| `bundle-creator`    | `<BundleCreator />`       | Bundle creation                |
| `finance-panel`     | `<FinancePanel />`        | Treasury/finance               |
| `gasometer`         | `<GasometerPanel />`      | GAS usage                      |
| `mining-panel`      | `<MiningPanel />`         | PAT mining config              |
| `defend-panel`      | `<PFDefendPanel />`       | User security panel            |

> [!NOTE]
> `FounderDashboard`, `DevModePanel`, `PATCouncilPanel` abrem como **tabs no canvas** via `openAppWindow()`, não como componentes diretos no JSX.

> [!WARNING]
> **`<StatusBar />`** foi removido. Não re-adicionar.

## D.4 LoginGate v1.5 (2-Layer Access)

> **v1.5 (2026-02-13):** LoginGate atualizado com modelo de 2 camadas de acesso.
> Credenciais simples de teste adicionadas para dev/testing.

### Credenciais

| Usuário         | Senha        | userType  | DevTools | Founder Dashboard |
| --------------- | ------------ | --------- | -------- | ----------------- |
| `founder`       | `founder`    | `founder` | ✅       | ✅                |
| `dev`           | `dev`        | `dev`     | ✅       | ❌                |
| `Lucassvalerio` | `U@g1232025` | `founder` | ✅       | ✅                |
| `admin`         | `admin`      | `admin`   | ✅       | ❌                |

### Storage Tokens

| Token              | Storage        | Fonte                          |
| ------------------ | -------------- | ------------------------------ |
| `panda_auth`       | sessionStorage | Login direto no Jam            |
| `panda_auth_token` | sessionStorage | Login via index.html           |
| `panda_user`       | localStorage   | **LoginGate (v1.5)** + useAuth |

## D.5 Build Info

```text
✓ 933 modules transformed
✓ 1.34MB JS (399KB gzip)
✓ Built in 8.49s (Vite 5.4.21)
```

> **v2.1.0 changes:** TLDraw colorScheme API, Founder tab fallback, live health pills, PIN connected.

---

> 📖 **PF_UI_REFERENCE v2.9.0** | Consolidado: UI Layout + CSS Design System + HTML Components + Jam React

---

# PARTE E: DevTools & Developer Experience

> **Consolidado de:** PF_MASTER_ARCHITECTURE.md §3.3

## E.1 Dev Mode Toggle

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEV MODE TOGGLE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  [PFDock v6.2 — 5 itens]                                                │
│  ├── 🎨 Ferramentas  → Right Toolbar                                    │
│  ├── 📁 Catálogo     → Modal catálogo                                   │
│  ├── ────────────                                                       │
│  ├── [🐼] Store      → Modal Panda Store                                │
│  ├── ────────────                                                       │
│  ├── ⚙️ Settings     → Modal configurações                              │
│  └── 🛠️ Dev Mode ← CLIQUE ATIVA/DESATIVA                               │
│         │                                                               │
│         ├── OFF: DevModePanel oculto                                    │
│         ├── ON:  DevModePanel visível + ícone muda para 🔧              │
│         └── Persistência: localStorage.panda_dev_mode                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componente:** `components/Comp_AppDock.html`
**Lógica:** `4.ui/pf.devtools.js` → `toggleDevMode()`

## E.2 DevTools v2.0 - Ferramentas Disponíveis

| Tool                       | Ícone | Modal | Pop-out | Descrição                          |
| -------------------------- | ----- | ----- | ------- | ---------------------------------- |
| **Console**                | 💻    | ✅    | ✅      | Execução JavaScript em sandbox     |
| **MCP Browser**            | 🧰    | ✅    | ✅      | Lista de MCP Tools do Rust Agent   |
| **API Tester**             | 🔌    | ✅    | ✅      | Testar endpoints GAS               |
| **PAT Treasury**           | 🏦    | ✅    | ✅      | Controles do Banco Central IA      |
| **Constitution Validator** | ⚖️    | ✅    | ✅      | Validar ações contra os 12 Artigos |

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

## E.4 FlexLayout-React — Multi-Window Docking (v6.0)

> **Implementado em:** 2026-02-08 | **Lib:** `flexlayout-react@0.8.18` (MIT)

O sistema multi-janela utiliza `flexlayout-react` para abrir apps **DENTRO** do canvas como abas dockáveis.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         STATUS BAR (v6.3)                           │
├──────┬──────────────────────────────────────────────────────────────┤
│      │  ┌──────────┐ ┌──────────────┐ ┌──────────────┐             │
│ DOCK │  │ 🎨 CANVAS│ │ 🏭 FOUNDER  ✕│ │ 📁 DRIVE   ✕│  ← TABS    │
│      │  ├──────────┴─┴──────────────┴─┴──────────────┘             │
│  🎨  │  │                                                          │
│  📁  │  │              ACTIVE TAB CONTENT                          │
│  🛠️  │  │              (Canvas / App / Plugin)                     │
│      │  │                                                          │
│ [+]  │  │                                                          │
├──────┴──┴──────────────────────────────────────────────────────────┤
│              FOOTER (watermark)                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Componentes

| Arquivo               | Componente        | Função                                     |
| --------------------- | ----------------- | ------------------------------------------ |
| `PFWindowManager.jsx` | `PFWindowManager` | Layout docking (flexlayout-react)          |
| `App.jsx`             | `AppContent`      | Wiring factory + handlers                  |
| `PFCatalog.jsx`       | `PFCatalog`       | Lista apps instalados (vazio por padrão)   |
| `PFDock.jsx`          | `PFDock`          | Context menu: ABRIR / FECHAR / DESINSTALAR |

### SDK API (v6.0)

```javascript
import { openAppWindow, closeAppWindow } from "./components/PFWindowManager";

// Abrir app como aba no canvas
openAppWindow("google-drive");
openAppWindow("founder-dashboard");
openAppWindow("meu-plugin", { name: "Meu Plugin", icon: "🧩" });

// Fechar aba (sem desinstalar)
closeAppWindow("google-drive");
```

### Regras

1. **Catálogo inicia VAZIO** — Tudo vem da Store
2. **Google-First** — Apenas Google Drive + Canva (sem Dropbox)
3. **Pop-out ≠ Multi-janela** — Pop-out é Document PiP (monitor separado), multi-janela são tabs dentro do canvas
4. **Dock/Chat ficam apenas na janela principal** — Não aparecem em pop-outs

---

## F. PADRÃO DE TEXTO

> **Regra:** Todo texto visível segue hierarquia de capitalização.

| Nível      | Formato      | Exemplo                  | Uso                          |
| ---------- | ------------ | ------------------------ | ---------------------------- |
| **TÍTULO** | `UPPERCASE`  | `PANDA FABRICS`          | Brand, headers, tabs, botões |
| **Sub**    | `Title Case` | `Founder Dashboard`      | Subtítulos, nomes de apps    |
| **Texto**  | `Normal`     | `Seus arquivos na nuvem` | Descrições, tooltips         |

### Implementação CSS

```css
/* Títulos e botões */
.pf-brand-text,
.pf-dock-item[title],
.pf-catalog-name {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

---

> 📖 **Versão:** 2.9.0 | **Atualizado:** 2026-02-13 | **Auditado contra:** `pf.css` (~3030 linhas), `PFStatusBar.jsx` (v6.3 +🔔), `PFDock.jsx` (v6.2, 5 itens), `App.jsx` (v6.5), 44 arquivos (28 JSX + 16 CSS), 9 hooks

---

## Changelog

| Versao | Data       | Alteracoes                                     |
| ------ | ---------- | ---------------------------------------------- |
| 6.6.0  | 2026-02-15 | §13 LoginGate v8.0 + §14 Welcome Wizard v2.0   |
| 6.5.0  | 2026-02-14 | MCP header padronizado, versao unificada       |
| 6.5.0  | 2026-02-13 | Atualizacao Layout Grid, z-index, modal system |
| 2.9.0  | 2026-02-08 | Panda Fabrics CSS Variables, theme modes       |
| 2.0.0  | 2026-01-26 | Criacao do UI Reference                        |
