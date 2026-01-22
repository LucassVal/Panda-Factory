---
description: Contexto do Projeto Panda Factory - Lembre-se disso em toda interação
---

# 🐼 PANDA FACTORY - CONTEXTO MESTRE

> **Leia este arquivo SEMPRE antes de começar qualquer tarefa.**

---

## 🎯 O QUE É O PROJETO

**Panda Factory (PF)** é um Sistema Operacional Modular para Desenvolvedores que:

- Democratiza infraestrutura Google
- Integra IA (Gemini 3 Pro via AI Ultra)
- Oferece marketplace de módulos
- Funciona com backend híbrido (GAS + Firebase + Rust Agent)

---

## 🔧 STACK TECNOLÓGICA

| Camada          | Tecnologia                | Arquivo Principal               |
| --------------- | ------------------------- | ------------------------------- |
| **Frontend**    | HTML/CSS/JS Vanilla       | `PandaFactory.html`             |
| **Tema**        | CSS Variables + Dark Mode | `css/pf.theme.css`              |
| **SDK**         | Mock JavaScript           | `js/pf.sdk.js` (v0.7.0)         |
| **Backend**     | Google Apps Script (DDD)  | `backend/core/PF_Dispatcher.gs` |
| **Signaling**   | Firebase Realtime DB      | `js/core/pf.firebase-bridge.js` |
| **Agent Local** | Rust + RIG Framework      | `_rust_agent/` (futuro)         |

---

## 📁 ESTRUTURA DE PASTAS

```
CRM/                         # Raiz do Projeto
├── PandaFactory.html        # Entry Point
├── css/pf.theme.css         # 🎨 Tema Unificado (Design Tokens)
├── js/
│   ├── pf.sdk.js            # 🐼 SDK Mock (Panda.*)
│   ├── core/                # Módulos Core
│   │   ├── pf.firebase-bridge.js
│   │   ├── pf.ai-core.js    # PAT (Panda AI Treasury)
│   │   └── pf.crypto.js     # Ed25519 (futuro)
│   └── ui/                  # Controladores UI
│       ├── pf.omnibar.js
│       ├── pf.dock.js
│       ├── pf.dock-drag.js
│       └── pf.settings.js
├── components/              # HTML Modulares
│   ├── Comp_HeaderStatus.html
│   ├── Comp_AppDock.html
│   └── ui/                  # Subcomponentes
├── backend/                 # Google Apps Script (DDD)
│   ├── core/                # Dispatcher, Config
│   └── domains/             # finance/, store/, automation/
└── docs/                    # Documentação
    ├── README.md
    ├── PF_MASTER_ARCHITECTURE.md
    └── SDK_REFERENCE.md
```

---

## 🤖 GOOGLE AI ULTRA - FERRAMENTAS DISPONÍVEIS

| Ferramenta        | Uso Principal              | Como Usar                  |
| ----------------- | -------------------------- | -------------------------- |
| **Antigravity**   | Agentes com Gemini 3 Pro   | Desenvolvimento de agentes |
| **Jules**         | Tarefas GitHub automáticas | `@jules` para code tasks   |
| **Gemini CLI**    | Terminal AI                | `gemini` no terminal       |
| **Code Assist**   | AI no VS Code              | Extensão instalada         |
| **Deep Research** | Pesquisa aprofundada       | Gemini App                 |
| **Flow**          | Vídeo com Veo 3            | Criação de demos           |
| **Whisk**         | Ideação visual             | Protótipos visuais         |
| **NotebookLM**    | Análise de documentos      | Estudar codebase           |

---

## 🏛️ CONSTITUIÇÃO DO ECOSSISTEMA (12 ARTIGOS)

> **NUNCA VIOLE ESTES ARTIGOS:**

1. **Teto Inflação:** Max 5% ao ano
2. **Panda Labs:** 25% do Fundo → Educação
3. **Reserva Ops:** 20% do Lucro → Caixa
4. **Crescimento:** 65% do Fundo → Ação
5. **Piso Preço:** 2.5x (Min 1.25x)
6. **Founder Fee:** 5% Bruto Eterno (Lucas)
7. **Garantia Host:** 90-95% (Taxa P2P 5-10%)
8. **Reserva Fundo:** Max 10%
9. **Bill of Rights:** Free Speech, Non-Expulsion, Rust Law
10. **Arbitragem:** IA → Founder
11. **Leis Pétreas:** Imutável
12. **Emergência:** Failover Agent

---

## 🔐 SEGURANÇA (Ed25519)

- **Chave Privada:** NUNCA em arquivos de texto, sempre OS Keychain
- **Chave Pública:** Hardcoded no backend
- **Assinatura:** Founder assina comandos críticos via Rust Agent
- **Status:** PRONTO (mock), NÃO ATIVO em produção

```javascript
// Testar no console
await Panda.Auth.signCommand({ action: "treasury.burn" });
```

---

## 🎨 PADRÕES DE CÓDIGO

### CSS

- Usar variáveis CSS: `var(--bg-app)`, `var(--text-primary)`
- Dark Mode: Adicionar regras em `body.dark-mode { }`
- Glassmorphism: `backdrop-filter: blur(12px)`

### JavaScript

- Módulos IIFE: `(function() { "use strict"; ... })();`
- Logging: `log("MODULE", "message", data)`
- Eventos: `Panda.emit('event:name', data)`

### HTML Components

- Prefixo: `Comp_NomeDoComponente.html`
- Carregar via: `loader.js` ou `fetch()`
- Classes do tema: usar `pf.theme.css`

### Commits

- Atômicos: Uma feature por commit
- Mensagem: `[MODULO] Descrição curta`
- Exemplos:
  - `[SDK] Add Crypto module (Ed25519 mock)`
  - `[UI] Fix header spacing distribution`

---

## 📋 CHECKLIST ANTES DE CADA TAREFA

- [ ] Li o `PROJECT_CONTEXT.md`?
- [ ] Entendo qual camada vou modificar (Frontend/SDK/Backend)?
- [ ] Verifico se existe componente/função similar antes de criar?
- [ ] Uso classes do `pf.theme.css` em vez de CSS inline?
- [ ] Documento mudanças no arquivo relevante (README, SDK_REFERENCE)?
- [ ] Testo em Dark Mode E Light Mode?
- [ ] Faço commit atômico com mensagem clara?

---

## 🚫 O QUE NUNCA FAZER

1. **Nunca criar CSS inline** em componentes (usar `pf.theme.css`)
2. **Nunca hardcodar chaves/senhas** em arquivos visíveis
3. **Nunca violar a Constituição** (12 Artigos)
4. **Nunca quebrar Dark Mode** ao adicionar estilos
5. **Nunca usar `var` para variáveis** (usar `const`/`let`)
6. **Nunca modificar `Panda.*` diretamente** (são frozen)
7. **Nunca commitar sem testar** no navegador

---

## 📞 CONTATOS E RECURSOS

| Recurso                | Link                             |
| ---------------------- | -------------------------------- |
| **Arquitetura Mestre** | `docs/PF_MASTER_ARCHITECTURE.md` |
| **SDK Reference**      | `docs/SDK_REFERENCE.md`          |
| **Servidor Local**     | `python -m http.server 8080`     |
| **Login Teste**        | `admin / admin`                  |

---

**Última Atualização:** 2026-01-22
**Versão SDK:** 0.7.0
**Plano Google:** AI Ultra
