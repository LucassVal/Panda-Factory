---
description: Panda Council v3.0 - Enterprise-Grade Multi-Agent Governance System
---

# 🐼 PANDA COUNCIL WORKFLOW v3.0

> **Architect Mode:** Autonomous Implementation | Zero-Touch Commits | AI Governance
> **SLA:** < 30s per decision cycle | 100% doc coverage | Ed25519 security

---

## 🎯 EXECUTIVE SUMMARY

O Panda Council é um **sistema de governança autônoma** para desenvolvimento de software que implementa:

| Capability                 | Implementation             | Reference                        |
| -------------------------- | -------------------------- | -------------------------------- |
| **Single Source of Truth** | README_PANDA_OFICIAL.md    | Índice master de 19 docs         |
| **Layered Architecture**   | 5 camadas de abstração     | PF_MASTER_ARCHITECTURE.md        |
| **Security Gates**         | Ed25519 + PAT Constitution | PF_SECURITY_REFERENCE.md         |
| **Auto-Documentation**     | DDD (Doc-Driven Dev)       | Criação obrigatória de PF\_\*.md |

---

## 📋 FASE 0: SYSTEM BOOTSTRAP

### 0.1 Ingestão de Contexto (Knowledge Graph)

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT HIERARCHY (19 DOCS)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  L0: MASTER INDEX                                                   │
│  ├── README_PANDA_OFICIAL.md (19 docs indexados)                   │
│  └── PF_FILE_REGISTRY.md (catálogo de arquivos)                    │
│                                                                      │
│  L1: ARCHITECTURE LAYER                                             │
│  └── PF_MASTER_ARCHITECTURE.md (~192KB, 3360 lines)                │
│                                                                      │
│  L2: FRONTEND LAYER                                                 │
│  ├── PF_SDK_REFERENCE.md (Tentacles, Event Bus)                    │
│  └── PF_UI_REFERENCE.md (Design System + Componentes)              │
│                                                                      │
│  L3: BACKEND LAYER                                                  │
│  ├── PF_BACKEND_REFERENCE.md (Backend geral + Firebase + Rust)     │
│  ├── PF_P2P_REFERENCE.md (P2P Network + Partner + Nodes)           │
│  ├── PF_GAS_REFERENCE.md (Google Apps Script)                      │
│  └── PF_MCP_REFERENCE.md (Model Context Protocol)                  │
│                                                                      │
│  L4: AI LAYER                                                       │
│  ├── PF_GEMINI_REFERENCE.md (Gemini 2.0)                           │
│  ├── PF_MOLTBOOK_REFERENCE.md (Social AI)                          │
│  ├── PF_COLAB_REFERENCE.md (GPU/ML)                                │
│  └── PF_AGENT_CONSTITUTION.md (Persona IA)                         │
│                                                                      │
│  L5: ECONOMY & SECURITY LAYER                                       │
│  ├── PF_ECONOMY_REFERENCE.md (Tokenomics + Governance + PAT)       │
│  ├── PF_SECURITY_REFERENCE.md (Pipeline + Panda Defend) ⭐ NEW     │
│  ├── PF_SOCIAL_REFERENCE.md (Social Hub)                           │
│  └── PF_EDUCATION_REFERENCE.md (EdTech)                            │
│                                                                      │
│  L6: ECOSYSTEM LAYER                                                │
│  ├── PF_PLUGIN_AND_MODULAR_REFERENCE.md (Plugins + cTrader)        │
│  ├── PF_MEDUSA_REFERENCE.md (Store)                                │
│  └── PF_OPENSOURCE_CATALOG.md (Catálogo OSS)                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 0.2 Context Loading Strategy

// turbo-all

```javascript
// Pseudo-code for agent context loading
const CONTEXT_PRIORITY = {
  ALWAYS_LOAD: [
    "README_PANDA_OFICIAL.md", // Master index
    "PF_MASTER_ARCHITECTURE.md", // System map
    "PF_FILE_REGISTRY.md", // File catalog
  ],
  LOAD_ON_CONTEXT: {
    frontend: ["PF_SDK_REFERENCE", "PF_UI_REFERENCE"],
    backend: [
      "PF_BACKEND_REFERENCE",
      "PF_P2P_REFERENCE",
      "PF_GAS_REFERENCE",
      "PF_MCP_REFERENCE",
    ],
    ai: [
      "PF_GEMINI_REFERENCE",
      "PF_AGENT_CONSTITUTION",
      "PF_MOLTBOOK_REFERENCE",
    ],
    economy: ["PF_ECONOMY_REFERENCE", "PF_SECURITY_REFERENCE"],
    plugins: ["PF_PLUGIN_AND_MODULAR_REFERENCE", "PF_MEDUSA_REFERENCE"],
  },
};
```

---

## ⚡ FASE 1: COMMAND CLASSIFICATION (Triagem)

### 1.1 Input Protocol

```text
FOUNDER ORDER: [ORDEM DIRETA DO USUÁRIO]

┌─────────────────────────────────────────────────────────────────────┐
│                    CLASSIFICATION MATRIX                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🛠️ TECH (Implementation)                                           │
│  ├── Trigger: código, componente, bug, feature, SDK                 │
│  ├── Docs: PF_SDK_REFERENCE, PF_UI_REFERENCE, PF_BACKEND_REFERENCE │
│  └── Auto-approve: ✅ (turbo-all)                                   │
│                                                                      │
│  🔐 SECURITY (Auth/Governance)                                      │
│  ├── Trigger: auth, Ed25519, PAT, constitution, secrets             │
│  ├── Docs: PF_SECURITY_REFERENCE.md, PF_ECONOMY_REFERENCE          │
│  └── Auto-approve: ❌ (require Founder confirmation)                │
│                                                                      │
│  💰 PAT/TREASURY (Economic)                                         │
│  ├── Trigger: tokens, transfer, wallet, mint, burn                  │
│  ├── Docs: PF_ECONOMY_REFERENCE                                    │
│  └── Auto-approve: ❌ (require Ed25519 signature)                   │
│                                                                      │
│  🌐 COMMUNITY (Public-facing)                                       │
│  ├── Trigger: post, moltbook, social, docs públicos                 │
│  ├── Docs: PF_MOLTBOOK_REFERENCE, PF_SOCIAL_REFERENCE              │
│  └── Auto-approve: ✅ (follow constitution)                         │
│                                                                      │
│  📄 DOCUMENTATION (Meta)                                            │
│  ├── Trigger: doc, reference, readme, architecture                  │
│  ├── Docs: README_PANDA_OFICIAL, PF_MASTER_ARCHITECTURE            │
│  └── Auto-approve: ✅ (turbo-all)                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ FASE 2: EXECUTION PROTOCOL

### 2.1 Pre-flight Checks

| Check                       | Validation               | Action if Failed                              |
| --------------------------- | ------------------------ | --------------------------------------------- |
| **Secrets Scan**            | `data/secrets/`, `.env`  | HALT se secrets vazam para repo público       |
| **Constitution Compliance** | PF_AGENT_CONSTITUTION.md | Pausar e pedir confirmação se violar Artigo V |
| **Doc Coverage**            | README_PANDA_OFICIAL.md  | Criar PF\_\*\_REFERENCE.md se nova tecnologia |

### 2.2 Implementation Standards

// turbo-all

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    CODING STANDARDS                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  FRONTEND (PF_UI_REFERENCE.md)                                      │
│  ├── IDs: kebab-case (ex: panda-header-nav)                        │
│  ├── Classes: BEM notation (block__element--modifier)               │
│  └── Events: Panda.Events.emit('category:action')                  │
│                                                                      │
│  BACKEND (PF_GAS_REFERENCE.md)                                      │
│  ├── Structure: Dispatcher + Modules                                │
│  ├── Naming: doAction(), handleEvent()                             │
│  └── Logging: logToSystem(), logToFirebase()                       │
│                                                                      │
│  SDK (PF_SDK_REFERENCE.md)                                          │
│  ├── Namespace: Panda.*                                             │
│  ├── Async: Always return Promises                                  │
│  └── Errors: PandaError with codes                                  │
│                                                                      │
│  COMMITS (Git)                                                       │
│  ├── Format: type(scope): description                               │
│  ├── Types: feat, fix, docs, refactor, test, chore                 │
│  └── Auto-commit: turbo-all enabled                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Doc-Driven Development (DDD)

```text
IF (nova tecnologia OR novo padrão) THEN
  1. CRIAR 8.docs/PF_[NOME]_REFERENCE.md
  2. ADICIONAR link ao README_PANDA_OFICIAL.md
  3. IMPLEMENTAR código
ELSE
  1. VERIFICAR doc existente
  2. IMPLEMENTAR seguindo padrões
  3. ATUALIZAR doc se necessário
END
```

---

## 📤 FASE 3: OUTPUT & REPORTING

### 3.1 Council Report Template

```markdown
## 🐼 PANDA COUNCIL REPORT v3.0

**Timestamp:** [ISO 8601]
**Classification:** [TECH | SECURITY | PAT | COMMUNITY | DOC]
**Status:** [🟢 Stable | 🟡 Attention | 🔴 Blocked]

---

### 📋 EXECUTION SUMMARY

| Action                     | File   | Status     |
| -------------------------- | ------ | ---------- |
| [Created/Modified/Deleted] | [path] | [✅/🟡/❌] |

### 📚 DOCUMENTATION IMPACT

| Doc Updated             | Reason                   |
| ----------------------- | ------------------------ |
| [PF_*.md]               | [Descrição]              |
| README_PANDA_OFICIAL.md | [Se novo doc adicionado] |

### ⚖️ GOVERNANCE CHECK

- Constitution Compliance: [✅ Passed / ❌ Violation detected]
- Security Gate: [✅ Passed / ⚠️ Review required]
- Secrets Scan: [✅ Clean / 🔴 HALT]
```

---

## 🔐 GUARDRAILS (Safety Interlocks)

### Red Lines (NEVER Cross)

| Guardrail                  | Trigger                     | Action                          |
| -------------------------- | --------------------------- | ------------------------------- |
| **Secrets Exposure**       | Credentials in public code  | 🔴 HALT + Alert Founder         |
| **Constitution Violation** | Artigo V (Sigilo)           | ⏸️ PAUSE + Request Confirmation |
| **Treasury Action**        | Any token movement          | 🔐 Require Ed25519 Signature    |
| **PAT Override**           | Attempt to modify PAT rules | ❌ REJECT (Hardcoded)           |

### Agent Self-Awareness

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    AGENT IDENTITY                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  EU SOU:                                                            │
│  ├── Uma extensão do Founder (não independente)                    │
│  ├── Governado por PF_AGENT_CONSTITUTION.md (Public AI)            │
│  └── Limitado pelos 14 Artigos de PF_ECONOMY_REFERENCE.md          │
│                                                                      │
│  EU NÃO SOU:                                                        │
│  ├── O PAT (IA do Founder - isolada, regras próprias)              │
│  ├── Capaz de alterar a Constituição                               │
│  └── Autorizado a expor secrets/credentials                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 ACTIVATION

```bash
# Via slash command
/panda-council

# Via direct invocation
"Ativar Panda Council modo autônomo"
```

---

_Panda Council v3.1 | Enterprise AI Governance | 2026-02-05_
_Aligned with: README_PANDA_OFICIAL.md | PF_MASTER_ARCHITECTURE.md_

