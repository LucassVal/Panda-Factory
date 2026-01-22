---
description: Workflow de auditoria para revisão de código e arquitetura
---

# 🔍 Workflow de Auditoria - Panda Factory

> Use este workflow para revisar código existente ou planejar refatorações.

---

## Passo 1: Carregar Contexto

```
Leia .agent/workflows/project-context.md
```

---

## Passo 2: Identificar Escopo

O que você vai auditar?

| Escopo          | Arquivos a Verificar                    |
| --------------- | --------------------------------------- |
| **CSS/Estilos** | `css/pf.theme.css`, inline styles       |
| **JavaScript**  | `js/**/*.js`                            |
| **Componentes** | `components/**/*.html`                  |
| **SDK**         | `js/pf.sdk.js`, `docs/SDK_REFERENCE.md` |
| **Segurança**   | `pf.crypto.js`, `pf.ai-core.js`         |
| **Arquitetura** | `docs/PF_MASTER_ARCHITECTURE.md`        |

---

## Passo 3: Verificar Problemas Comuns

### CSS:

- [ ] Existe CSS inline que deveria estar em `pf.theme.css`?
- [ ] Todas as cores usam variáveis CSS?
- [ ] Dark Mode está funcionando?
- [ ] Responsividade está ok?

### JavaScript:

- [ ] Módulos usam IIFE?
- [ ] Variáveis usam `const`/`let` (não `var`)?
- [ ] Erros são tratados com try/catch?
- [ ] Console logs de debug foram removidos?

### Segurança:

- [ ] Chaves/senhas estão hardcoded?
- [ ] Inputs são validados?
- [ ] Constituição (12 Artigos) está sendo respeitada?

### Arquitetura:

- [ ] Código está na camada correta?
- [ ] Existe duplicação de funcionalidade?
- [ ] Documentação está atualizada?

---

## Passo 4: Gerar Relatório

Crie um relatório com:

```markdown
## 📊 Relatório de Auditoria

### ✅ Pontos Positivos

- ...

### ⚠️ Pontos de Atenção

- ...

### 🔴 Problemas Críticos

- ...

### 📋 Ações Recomendadas

1. ...
2. ...
```

---

## Passo 5: Priorizar Ações

| Prioridade | Critério                            |
| ---------- | ----------------------------------- |
| 🔴 **P0**  | Segurança, dados, produção quebrada |
| 🟠 **P1**  | Bug visível para usuário            |
| 🟡 **P2**  | Performance, UX degradada           |
| 🟢 **P3**  | Código limpo, refatoração           |

---

**Use `/audit` no chat para executar este workflow.**
