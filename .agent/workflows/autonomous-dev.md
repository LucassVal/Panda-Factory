---
description: Autonomous Multi-Agent Development Pipeline with Debate and Handoff
---

# 🤖 AUTONOMOUS MULTI-AGENT WORKFLOW

## Overview

This workflow orchestrates multiple AI agents (Gemini, Claude Sonnet, Claude Opus) working autonomously with debate, critique, and handoff - no human intervention until final delivery.

---

## Usage

```
/autonomous-dev [PROJECT_NAME] [BRIEF_DESCRIPTION]
```

Example:

```
/autonomous-dev "Trading Bot" "Um bot de trading em Python com análise técnica"
```

---

## 📋 WORKFLOW STEPS

### STEP 1: PLANNING (Architect Agent)

**Agent:** @Gemini_3_Pro or Lead Architect

**Input:**

- Project description
- Files in `/docs` folder
- Any protocol files

**Actions:**

1. Read all protocol/context files
2. Design complete architecture
3. Create file structure
4. Define interfaces and data flow

**Output:**

```
📄 architecture.md
   - System overview
   - Component diagram (ASCII/Mermaid)
   - File structure
   - API contracts
   - Data models
```

**Handoff:** "✅ STEP 1 COMPLETE. @Auditor, critique this architecture."

---

### STEP 2: AUDIT (Critic Agent)

**Agent:** @Claude_Sonnet or Senior Reviewer

**Input:**

- `architecture.md`

**Actions:**

1. Review for logic flaws
2. Check security vulnerabilities
3. Analyze performance bottlenecks
4. Validate scalability

**Decision Tree:**

```
IF critical_issues > 0:
   → Tag: "🔴 REFAZER" + detailed feedback
   → Return to STEP 1

ELSE IF minor_issues > 0:
   → Tag: "🟡 APROVADO COM RESSALVAS"
   → Create test_plan.md with caveats
   → Proceed to STEP 3

ELSE:
   → Tag: "🟢 APROVADO"
   → Create test_plan.md
   → Proceed to STEP 3
```

**Output:**

```
📄 test_plan.md
   - Unit test cases
   - Integration test scenarios
   - Edge cases
   - Performance benchmarks
```

**Handoff:** "✅ STEP 2 COMPLETE. @Executor, build this."

---

### STEP 3: EXECUTION (Builder Agent)

**Agent:** @Claude_Opus or Implementation Specialist

**Input:**

- `architecture.md`
- `test_plan.md`

**Actions:**

1. Create all source files
2. Implement all functions
3. Add error handling
4. Include inline comments
5. Create README with usage

**Output:**

```
📄 src/*.py (or appropriate language)
📄 tests/*.py
📄 README.md
📄 requirements.txt (if applicable)
```

**Final Delivery:** "✅ STEP 3 COMPLETE. Code ready for review."

---

## 🔄 ITERATION PROTOCOL

If any step fails:

```
STEP N fails → Return to STEP N-1 with tag "RETRY" + reason
Max retries per step: 2
If max retries exceeded: Escalate to human
```

---

## 📁 EXPECTED FILE STRUCTURE

```
project-name/
├── docs/
│   ├── architecture.md    (Step 1 output)
│   ├── test_plan.md       (Step 2 output)
│   └── audit_log.md       (Review notes)
├── src/
│   ├── main.py
│   ├── core/
│   └── utils/
├── tests/
│   ├── test_main.py
│   └── test_core.py
├── README.md
└── requirements.txt
```

---

## 🏷️ COMMUNICATION TAGS

| Tag                  | Meaning                             |
| -------------------- | ----------------------------------- |
| `✅ STEP N COMPLETE` | Step finished successfully          |
| `🔴 REFAZER`         | Critical issues, redo previous step |
| `🟡 RESSALVAS`       | Minor issues, proceed with caution  |
| `🟢 APROVADO`        | Fully approved                      |
| `🔄 RETRY`           | Retry current step                  |
| `🚨 ESCALATE`        | Needs human intervention            |

---

## 💡 TIPS

1. **Be specific** in project description
2. **Include context files** in /docs before starting
3. **Define success criteria** upfront
4. **Set constraints** (language, framework, etc.)

---

## TEMPLATE: Initial Prompt

```markdown
OBJECTIVE: Develop [PROJECT_NAME]
BRIEF: [2-3 sentence description]
CONSTRAINTS:

- Language: [Python/JS/Rust]
- Framework: [if any]
- Must include: [requirements]

MODE: Autonomous Debate & Handoff

CONTEXT FILES:

- /docs/protocol.md
- /docs/examples/

START: Step 1 with @Architect
```
