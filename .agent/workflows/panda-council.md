---
description: Panda Council v4.0 - Enterprise-Grade Multi-Agent Governance System
---

# 🏛️ PANDA COUNCIL WORKFLOW v4.0

> **Architect Mode:** Autonomous Implementation | Zero-Touch Commits | AI Governance
> **SLA:** < 30s per decision cycle | 100% doc coverage | Ed25519 security
> **SSoT:** [`8.docs/README_PANDA_OFICIAL.md`](../../8.docs/README_PANDA_OFICIAL.md)

---

## 🎯 EXECUTIVE SUMMARY

O Panda Council é um **sistema de governança autônoma** para desenvolvimento que implementa:

| Capability                 | Implementation             | Reference                        |
| -------------------------- | -------------------------- | -------------------------------- |
| **Single Source of Truth** | README_PANDA_OFICIAL.md    | Índice master de 15 docs         |
| **Layered Architecture**   | 5 camadas de abstração     | PF_MASTER_ARCHITECTURE.md        |
| **Security Gates**         | Ed25519 + PAT Constitution | PF_SECURITY_REFERENCE.md         |
| **Auto-Documentation**     | DDD (Doc-Driven Dev)       | Criação obrigatória de PF\_\*.md |
| **Module-First Taxonomy**  | Módulo / Tentáculo / Theme | PF_MEDUSA_REFERENCE.md           |

---

## 📋 FASE 0: SYSTEM BOOTSTRAP

### 0.1 Ingestão de Contexto (Knowledge Graph)

// turbo-all

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT HIERARCHY (15 DOCS)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  L0: MASTER INDEX                                                   │
│  ├── 8.docs/README_PANDA_OFICIAL.md (SSoT, 15 docs indexados)     │
│  └── 8.docs/PF_FILE_REGISTRY.md (catálogo de arquivos)            │
│                                                                      │
│  L1: ARCHITECTURE LAYER                                             │
│  └── 8.docs/PF_MASTER_ARCHITECTURE.md (~196KB, 3377 lines)        │
│                                                                      │
│  L2: FRONTEND LAYER                                                 │
│  ├── 8.docs/PF_SDK_REFERENCE.md (Tentacles, Event Bus, v0.9.5)   │
│  └── 8.docs/PF_UI_REFERENCE.md (Design System + Componentes)      │
│                                                                      │
│  L3: BACKEND LAYER                                                  │
│  ├── 8.docs/PF_BACKEND_REFERENCE.md (Backend + Firebase + Rust)   │
│  ├── 8.docs/PF_P2P_REFERENCE.md (P2P Network + Nodes)             │
│  ├── 8.docs/PF_GAS_REFERENCE.md (Google Apps Script Tri-Mode)     │
│  └── 8.docs/PF_MCP_REFERENCE.md (Model Context Protocol)          │
│                                                                      │
│  L4: AI LAYER                                                       │
│  ├── 8.docs/PF_GEMINI_REFERENCE.md (Gemini 3 Pro/Flash)           │
│  ├── 8.docs/PF_COLAB_REFERENCE.md (GPU/ML)                        │
│  └── 8.docs/PF_AGENT_CONSTITUTION.md (Persona IA)                 │
│                                                                      │
│  L5: ECONOMY & SECURITY LAYER                                       │
│  ├── 8.docs/PF_ECONOMY_REFERENCE.md (Tokenomics + PAT + 14 Art.) │
│  └── 8.docs/PF_SECURITY_REFERENCE.md (Panda Defend + 14 regras)  │
│                                                                      │
│  L6: ECOSYSTEM LAYER                                                │
│  ├── 8.docs/PF_MEDUSA_REFERENCE.md (Store v2.0, 3 tipos)         │
│  └── 8.docs/PF_OPENSOURCE_CATALOG.md (Catálogo OSS)               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 0.2 Folder Structure

```text
PandaFactory/
├── 1.core/           # GAS Backend (Tri-Mode)
├── 2.system/         # Kernel, Loaders
├── 3.sdk/            # Panda SDK Core (13 módulos)
├── 4.ui/             # UI Componentes & Módulos
├── 5.tentacles/      # 9 Integration Modules
├── 6.integrations/   # Firebase, cTrader clients
├── 7.rust-agent/     # Local Agent (Tauri/MCP)
├── 8.docs/           # 15 Reference Documents
├── 9.tools/          # Dev utilities & scripts
├── 10.assets/        # CSS, Images, Fonts
└── 11.jam/           # React Frontend (Vite)
```

### 0.3 Context Loading Strategy

```javascript
const CONTEXT_PRIORITY = {
  ALWAYS_LOAD: [
    "8.docs/README_PANDA_OFICIAL.md", // SSoT Master Index
    "8.docs/PF_MASTER_ARCHITECTURE.md", // System map
    "8.docs/PF_FILE_REGISTRY.md", // File catalog
  ],
  LOAD_ON_CONTEXT: {
    frontend: ["PF_SDK_REFERENCE", "PF_UI_REFERENCE"],
    backend: [
      "PF_BACKEND_REFERENCE",
      "PF_P2P_REFERENCE",
      "PF_GAS_REFERENCE",
      "PF_MCP_REFERENCE",
    ],
    ai: ["PF_GEMINI_REFERENCE", "PF_AGENT_CONSTITUTION", "PF_COLAB_REFERENCE"],
    economy: ["PF_ECONOMY_REFERENCE", "PF_SECURITY_REFERENCE"],
    store: ["PF_MEDUSA_REFERENCE", "PF_OPENSOURCE_CATALOG"],
  },
};
```

---

## ⚡ FASE 1: COMMAND CLASSIFICATION (Triagem)

```text
FOUNDER ORDER: [ORDEM DIRETA DO USUÁRIO]

┌─────────────────────────────────────────────────────────────────────┐
│                    CLASSIFICATION MATRIX                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🛠️ TECH (Implementation)                                           │
│  ├── Trigger: código, componente, bug, feature, SDK, tentáculo     │
│  ├── Docs: PF_SDK_REFERENCE, PF_UI_REFERENCE, PF_BACKEND_REFERENCE│
│  └── Auto-approve: ✅ (turbo-all)                                   │
│                                                                      │
│  🔐 SECURITY (Auth/Governance)                                      │
│  ├── Trigger: auth, Ed25519, PAT, constitution, secrets             │
│  ├── Docs: PF_SECURITY_REFERENCE, PF_ECONOMY_REFERENCE             │
│  └── Auto-approve: ❌ (require Founder confirmation)                │
│                                                                      │
│  💰 PAT/TREASURY (Economic)                                         │
│  ├── Trigger: tokens, transfer, wallet, mint, burn                  │
│  ├── Docs: PF_ECONOMY_REFERENCE                                     │
│  └── Auto-approve: ❌ (require Ed25519 signature)                   │
│                                                                      │
│  🌐 COMMUNITY (Public-facing)                                       │
│  ├── Trigger: post, social, docs públicos                           │
│  ├── Docs: PF_AGENT_CONSTITUTION                                    │
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

| Check            | Validation                | Action if Failed                   |
| ---------------- | ------------------------- | ---------------------------------- |
| **Secrets Scan** | `6.integrations/`, `.env` | 🔴 HALT se secrets vazam           |
| **Constitution** | 14 Artigos                | ⏸️ PAUSE + confirm se violar       |
| **Doc Coverage** | README_PANDA_OFICIAL.md   | Criar PF\_\*\_REFERENCE.md se novo |
| **Taxonomy**     | Módulo/Tentáculo/Theme    | Classificar corretamente           |

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
│  ├── Events: Panda.emit('category:action')                         │
│  └── Componentes: 4.ui/4.2.components/Comp_*.html                 │
│                                                                      │
│  BACKEND (PF_GAS_REFERENCE.md)                                      │
│  ├── Structure: Dispatcher + Domains (1.core/)                     │
│  ├── Naming: doAction(), handleEvent()                             │
│  └── Logging: logToSystem(), logToFirebase()                       │
│                                                                      │
│  SDK (PF_SDK_REFERENCE.md)                                          │
│  ├── Namespace: Panda.* (frozen objects)                            │
│  ├── Async: Always return Promises                                  │
│  └── Errors: PandaError with codes, Fault Isolation                │
│                                                                      │
│  TENTACLES (PF_MEDUSA_REFERENCE.md)                                 │
│  ├── Parent/Child architecture                                      │
│  ├── registerChild() + _wrapChild()                                │
│  └── Pasta: 5.tentacles/5.X.name/                                  │
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
IF (nova tecnologia OR novo módulo OR novo tentáculo) THEN
  1. CRIAR 8.docs/PF_[NOME]_REFERENCE.md
  2. ADICIONAR link ao README_PANDA_OFICIAL.md
  3. IMPLEMENTAR código
  4. Classificar: Módulo | Tentáculo | Theme
ELSE
  1. VERIFICAR doc existente em 8.docs/
  2. IMPLEMENTAR seguindo padrões
  3. ATUALIZAR doc se necessário
END
```

---

## 📤 FASE 3: OUTPUT & REPORTING

### 3.1 Council Report Template

```markdown
## 🐼 PANDA COUNCIL REPORT v4.0

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
- Taxonomy: [Módulo / Tentáculo / Theme — correctly classified]
```

---

## 🔐 GUARDRAILS (Safety Interlocks)

| Guardrail                  | Trigger                      | Action                          |
| -------------------------- | ---------------------------- | ------------------------------- |
| **Secrets Exposure**       | Credentials in public code   | 🔴 HALT + Alert Founder         |
| **Constitution Violation** | 14 Artigos                   | ⏸️ PAUSE + Request Confirmation |
| **Treasury Action**        | Any token movement           | 🔐 Require Ed25519 Signature    |
| **PAT Override**           | Attempt to modify PAT rules  | ❌ REJECT (Hardcoded)           |
| **SSoT Violation**         | Duplicating info from README | ⚠️ Reference, don't copy        |

### Agent Self-Awareness

```text
EU SOU:
├── Uma extensão do Founder (não independente)
├── Governado por PF_AGENT_CONSTITUTION.md (Public AI)
└── Limitado pelos 14 Artigos de PF_ECONOMY_REFERENCE.md

EU NÃO SOU:
├── O PAT (IA do Founder - isolada, regras próprias)
├── Capaz de alterar a Constituição
└── Autorizado a expor secrets/credentials
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

_Panda Council v4.0 | Enterprise AI Governance | 2026-02-07_
_SSoT: README_PANDA_OFICIAL.md | 15 docs | Module-First Taxonomy_
