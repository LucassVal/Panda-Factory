# 📐 PF_UI_REFERENCE - Panda Fabrics UI Layout System

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-02
> **Referência:** `jam/src/styles/jam.css` (1933 linhas)
> **Cross-Ref:** [PF_MASTER_ARCHITECTURE.md §3](PF_MASTER_ARCHITECTURE.md#3-camada-frontend) | [PF_CSS_REFERENCE.md](PF_CSS_REFERENCE.md) | [PF_JAM_COMPONENTS.md](PF_JAM_COMPONENTS.md)

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

- [PF_CSS_REFERENCE.md](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/docs/PF_CSS_REFERENCE.md)
- [PF_JAM_COMPONENTS.md](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/docs/PF_JAM_COMPONENTS.md)
- [jam.css](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/jam/src/styles/jam.css)
- [PANDA.md](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/Panda%20Factory/.agent/PANDA.md)
