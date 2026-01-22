---
description: Workflow padrão para desenvolvimento no Panda Factory
---

# 🚀 Workflow de Desenvolvimento - Panda Factory

> Execute este workflow antes de começar qualquer tarefa de desenvolvimento.

---

## Passo 1: Carregar Contexto

Antes de qualquer coisa, leia o contexto do projeto:

```
Leia .agent/workflows/project-context.md
```

---

## Passo 2: Verificar Servidor Local

// turbo

```bash
# Verificar se servidor está rodando na porta 8080
curl -s http://localhost:8080/PandaFactory.html > /dev/null && echo "✅ Servidor OK" || echo "❌ Iniciar: python -m http.server 8080"
```

---

## Passo 3: Identificar Camada de Trabalho

Determine qual camada você vai modificar:

| Se você vai...           | Arquivos a modificar                     |
| ------------------------ | ---------------------------------------- |
| Mudar visual/estilo      | `css/pf.theme.css`                       |
| Adicionar interatividade | `js/ui/*.js`                             |
| Modificar SDK            | `js/pf.sdk.js` + `docs/SDK_REFERENCE.md` |
| Criar componente         | `components/Comp_*.html`                 |
| Backend/API              | `backend/domains/*.gs`                   |
| Documentar               | `README.md` ou `docs/*.md`               |

---

## Passo 4: Verificar Existência

Antes de criar algo novo:

```javascript
// No console do navegador
console.log(Object.keys(Panda)); // Módulos SDK existentes
```

Verifique:

- Existe função similar no SDK?
- Existe componente similar em `/components/`?
- Existe classe CSS similar em `pf.theme.css`?

---

## Passo 5: Implementar Seguindo Padrões

### Para CSS:

```css
/* Use variáveis do tema */
.meu-componente {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}

/* Sempre adicione Dark Mode se usar cores específicas */
body.dark-mode .meu-componente {
  /* ajustes para dark */
}
```

### Para JavaScript:

```javascript
// Use módulo IIFE
(function () {
  "use strict";

  // Use log padronizado
  const log = (msg, data) => console.log(`[MEU_MODULO] ${msg}`, data || "");

  // Inicialize no DOMContentLoaded
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    log("Initialized");
  }
})();
```

### Para Componentes HTML:

```html
<!-- components/Comp_MeuComponente.html -->
<!-- ============================================= -->
<!-- MEU COMPONENTE - v1.0 -->
<!-- ============================================= -->
<div class="meu-componente">
  <!-- Use classes do pf.theme.css -->
  <h2 class="settings-section-title">Título</h2>
  <p class="settings-section-desc">Descrição</p>
</div>
```

---

## Passo 6: Testar

// turbo

```bash
# Hard refresh no navegador
# Windows: Ctrl+Shift+R
# Mac: Cmd+Shift+R
```

Verificar:

- [ ] Funciona em Light Mode?
- [ ] Funciona em Dark Mode?
- [ ] Console sem erros?
- [ ] Responsivo (tela pequena)?

---

## Passo 7: Documentar

Se modificou SDK, atualizar:

- `docs/SDK_REFERENCE.md`
- Changelog no `README.md`

Se criou componente:

- Adicionar na estrutura do `README.md`

---

## Passo 8: Commit Atômico

```bash
git add <arquivos_específicos>
git commit -m "[MODULO] Descrição clara"
```

Exemplos:

- `[CSS] Add glassmorphism to modular docks`
- `[SDK] Add Crypto.verify() method`
- `[UI] Fix header icons spacing`
- `[DOCS] Update SDK_REFERENCE with Crypto module`

---

## 📋 Quick Reference

### Comandos Úteis no Console:

```javascript
// Status do SDK
Panda.version(); // "0.7.0"

// Simular Agent Online
Panda.Bridge._mockConnect(true);

// Testar Governança
Panda.Governance.validate("expel_user");

// Testar Crypto
await Panda.Auth.signCommand({ action: "test" });

// Reset Docks
PandaDock.reset();
```

### Variáveis CSS Mais Usadas:

```css
/* Fundos */
var(--bg-app)        /* Fundo principal */
var(--bg-card)       /* Fundo de cards */
var(--bg-panel)      /* Fundo glassmorphism */

/* Texto */
var(--text-primary)  /* Texto principal */
var(--text-secondary)/* Texto secundário */

/* Bordas */
var(--border-subtle) /* Bordas leves */
var(--border-focus)  /* Bordas hover */

/* Cores */
var(--accent-success)/* Verde */
var(--accent-error)  /* Vermelho */
var(--accent-warning)/* Amarelo */
```

---

**Use `/dev` no chat para executar este workflow.**
