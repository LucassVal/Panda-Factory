---
description: Regras de casa para a IA seguir em toda interação
---

# 🐼 REGRAS DE CASA - PANDA FACTORY

> **A IA DEVE SEGUIR ESTAS REGRAS EM TODA INTERAÇÃO.**

---

## 1. IDENTIDADE

- Você está trabalhando no projeto **Panda Factory (PF)**
- O fundador é **Lucas Valério** (Founder Fee 5%)
- O mascote é o **Panda 🐼**
- Plano ativo: **Google AI Ultra**

---

## 2. ANTES DE QUALQUER TAREFA

1. **Leia o contexto:** `.agent/workflows/project-context.md`
2. **Entenda a camada:** Frontend / SDK / Backend?
3. **Verifique existência:** Já existe algo similar?
4. **Pergunte se necessário:** Melhor perguntar do que assumir errado

---

## 3. PADRÕES OBRIGATÓRIOS

### Código

- CSS: Usar variáveis de `pf.theme.css`
- JS: Módulos IIFE com "use strict"
- HTML: Componentes com prefixo `Comp_`
- Commits: Atômicos com `[MODULO] Descrição`

### Documentação

- Changelog em `README.md` para mudanças significativas
- SDK_REFERENCE.md para novos métodos Panda.\*
- Comentários em código complexo

### Testes

- Sempre testar Light + Dark Mode
- Verificar console por erros
- Testar interações (cliques, drags)

---

## 4. PROIBIÇÕES

❌ CSS inline em componentes (usar `pf.theme.css`)  
❌ Chaves/senhas em código visível  
❌ Violar os 12 Artigos da Constituição  
❌ Modificar objetos Panda.\* (são frozen)  
❌ Usar `var` para variáveis (usar `const`/`let`)  
❌ Commitar sem testar

---

## 5. FERRAMENTAS AI ULTRA DISPONÍVEIS

| Ferramenta        | Quando Usar                   |
| ----------------- | ----------------------------- |
| **Antigravity**   | Desenvolver agentes complexos |
| **Jules**         | Tarefas GitHub automatizadas  |
| **Gemini CLI**    | Comandos no terminal          |
| **Code Assist**   | Suporte no IDE                |
| **Deep Research** | Pesquisar tópicos             |
| **NotebookLM**    | Analisar documentos grandes   |

---

## 6. ARQUIVOS IMPORTANTES

| Arquivo                               | Propósito            |
| ------------------------------------- | -------------------- |
| `PandaFactory.html`                   | Entry point          |
| `css/pf.theme.css`                    | Tema unificado       |
| `js/pf.sdk.js`                        | SDK Mock (v0.7.0)    |
| `docs/PF_MASTER_ARCHITECTURE.md`      | Arquitetura completa |
| `docs/SDK_REFERENCE.md`               | Referência SDK       |
| `.agent/workflows/project-context.md` | Contexto do projeto  |

---

## 7. COMANDOS RÁPIDOS

```javascript
// Console do Navegador
Panda.version()                      // Versão SDK
Panda.Bridge._mockConnect(true)      // Simular Agent
Panda.Governance.getConstitution()   // Ver Constituição
PandaDock.reset()                    // Reset posições

// Terminal
python -m http.server 8080           // Servidor local
```

---

## 8. QUANDO EM DÚVIDA

1. Consulte `docs/PF_MASTER_ARCHITECTURE.md`
2. Procure padrões similares no código existente
3. Pergunte ao usuário antes de assumir

---

**Versão:** 1.0  
**Data:** 2026-01-22  
**Mantenedor:** Lucas Valério
