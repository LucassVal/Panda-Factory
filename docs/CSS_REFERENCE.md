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

**Arquivo Fonte:** `css/pf.theme.css`
