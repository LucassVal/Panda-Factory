# 🎨 CSS Design System - Panda Factory

> **Referência:** `css/pf.theme.css` (1500+ linhas)
> **Última Atualização:** 2026-01-22

---

## 📋 Índice

1. [Cores Base](#cores-base)
2. [Fundos (Backgrounds)](#fundos)
3. [Texto](#texto)
4. [Bordas](#bordas)
5. [Sombras](#sombras)
6. [Sizing & Spacing](#sizing)
7. [Animações](#animações)
8. [Dark Mode](#dark-mode)
9. [Componentes Padrão](#componentes)

---

## Cores Base

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

---

## Fundos

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

---

## Texto

```css
--text-primary: #1e293b; /* Texto principal */
--text-secondary: #64748b; /* Texto secundário */
--text-muted: #94a3b8; /* Texto desabilitado */
--text-inverted: #ffffff; /* Texto em fundo escuro */
--text-link: #3b82f6; /* Links */
```

---

## Bordas

```css
--border-subtle: rgba(0, 0, 0, 0.08); /* Bordas leves */
--border-default: rgba(0, 0, 0, 0.12); /* Bordas padrão */
--border-focus: #3b82f6; /* Focus ring */
--border-error: #ef4444; /* Erro */
```

---

## Sombras

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-dock: 0 8px 25px rgba(0, 0, 0, 0.15);
--shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);
```

---

## Sizing

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

---

## Animações

```css
/* Transitions */
--transition-fast: 0.15s ease;
--transition-normal: 0.2s ease;
--transition-slow: 0.3s ease;

/* Animations disponíveis */
@keyframes fadeIn { ... }
@keyframes slideUp { ... }
@keyframes pulse { ... }
@keyframes spin { ... }
```

---

## Dark Mode

Ativar: `document.body.classList.add('dark-mode')`

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

---

## Componentes

### Card Padrão

```css
.card {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-subtle);
  padding: var(--space-md);
}
```

### Botão Primário

```css
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
```

### Input

```css
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
```

### Glassmorphism

```css
.glass {
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
}
```

---

## Uso Rápido

```html
<!-- Card com título -->
<div class="card">
  <h3 style="color: var(--text-primary)">Título</h3>
  <p style="color: var(--text-secondary)">Descrição</p>
</div>

<!-- Botão -->
<button class="btn-primary">Ação</button>

<!-- Status badges -->
<span style="color: var(--accent-success)">● Online</span>
<span style="color: var(--accent-error)">● Offline</span>
```

---

## Docks (App & Dev)

### AppDock (Esquerda)

```css
.left-dock {
  position: fixed;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);

  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-dock);

  padding: var(--space-sm);
  z-index: 1000;
}

.dock-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: var(--transition-fast);
}

.dock-item:hover {
  background: var(--bg-hover);
  transform: scale(1.1);
}

.dock-item.active {
  background: var(--accent-primary-light);
  color: var(--accent-primary);
}

.dock-separator {
  height: 1px;
  background: var(--border-subtle);
  margin: var(--space-sm) 0;
}
```

### DevToolsDock (Direita)

```css
.right-dock {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);

  /* Mesmo estilo do AppDock */
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-dock);
}

/* Tooltip on hover */
.dock-item[title]:hover::after {
  content: attr(title);
  position: absolute;
  right: 60px;

  background: var(--accent-primary);
  color: var(--text-inverted);
  padding: 6px 12px;
  font-size: 12px;
  border-radius: var(--radius-btn);
  white-space: nowrap;
  z-index: 10000;
}
```

---

## DevTools Modal

### Overlay

```css
.devtools-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9998;
  animation: fadeIn 0.2s ease-out;
}
```

### Container

```css
.devtools-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 90vw;
  max-width: 900px;
  max-height: 80vh;

  background: var(--bg-card);
  border-radius: var(--radius-modal);
  box-shadow: var(--shadow-modal);

  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;

  animation: slideUp 0.3s ease-out;
}
```

### Header

```css
.devtools-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-panel);
}

.devtools-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
}

.devtools-actions {
  display: flex;
  gap: var(--space-xs);
}

.devtools-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.devtools-btn:hover {
  background: var(--bg-hover);
}
```

### Body

```css
.devtools-body {
  flex: 1;
  padding: var(--space-md);
  overflow-y: auto;
}
```

---

## Pop-out Windows (PiP)

### Container Base

```css
/* Estilos aplicados dentro da janela PiP */
.popout-container {
  font-family:
    "Inter",
    -apple-system,
    sans-serif;
  background: var(--bg-app);
  color: var(--text-primary);
  min-height: 100vh;
  padding: var(--space-md);
}
```

### Header Compacto

```css
.popout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: var(--space-sm) var(--space-md);
  background: var(--header-bg);
  color: var(--text-inverted);
  border-radius: var(--radius-btn);
  margin-bottom: var(--space-md);
}

.popout-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 500;
}
```

---

## Status Pills (Header)

```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;

  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--text-inverted);
}

.status-pill.online::before {
  content: "";
  width: 6px;
  height: 6px;
  background: var(--accent-success);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-pill.offline::before {
  content: "";
  width: 6px;
  height: 6px;
  background: var(--accent-error);
  border-radius: 50%;
}
```

---

## Animações Chave

```css
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

@keyframes floatPanda {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## Classes Utilitárias

```css
/* Flexbox */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-sm {
  gap: var(--space-sm);
}
.gap-md {
  gap: var(--space-md);
}

/* Spacing */
.p-sm {
  padding: var(--space-sm);
}
.p-md {
  padding: var(--space-md);
}
.m-0 {
  margin: 0;
}

/* Text */
.text-primary {
  color: var(--text-primary);
}
.text-secondary {
  color: var(--text-secondary);
}
.text-muted {
  color: var(--text-muted);
}
.text-success {
  color: var(--accent-success);
}
.text-error {
  color: var(--accent-error);
}

/* Hidden */
.hidden {
  display: none !important;
}
```

---

**Arquivo Fonte:** `css/pf.theme.css`
**Referência PANDA.md:** `.agent/PANDA.md` §6
