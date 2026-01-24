---
description: Panda Council - Multi-Agent Governance with Gemini + Claude Sonnet reviewing, Opus implementing
---

// turbo-all

# 🏛️ PANDA COUNCIL WORKFLOW

## Agents

- **Council**: @Gemini_3_Pro + @Claude_Sonnet_4.5 (Review & Approve)
- **Implementer**: @Claude_Opus_4.5 (Code & Build)
- **Overseer**: @Lucas (Veto & Direction)

## Reference Docs (READ FIRST - In Order)

1. `docs/PF_MASTER_ARCHITECTURE.md` - Full architecture
2. `docs/PF_SDK_REFERENCE.md` - SDK API
3. `.agent/PANDA.md` - Constitution & Rules
4. `docs/PF_CSS_REFERENCE.md` - Design System (when UI)
5. `docs/PF_HTML_REFERENCE.md` - Components (when UI)

---

## 📜 CONSTITUTION

### Art 1: Hierarchy

```
FOUNDER > COUNCIL > IMPLEMENTER
```

### Art 2: Unanimity

Council must AGREE before approving.

### Art 3: Documentation

All code must have JSDoc + comments.

### Art 4: Git Discipline

```bash
git add [files] && git commit -m "[MODULE] msg" && git push
```

### Art 5: Closed Cycles

Every feature must integrate with existing modules.

### Art 6: Bug Hunting

Council must ACTIVELY search for bugs.

---

## 🔄 PHASES

### PHASE 0: Intake

- Founder defines objective
- Council reads all reference docs

### PHASE 1: Architecture (@Gemini)

- Create `architecture.md`
- Define file structure
- OUTPUT: "PHASE 1 DONE → @Sonnet review"

### PHASE 2: Council Review (@Sonnet)

- Critique architecture
- Check vs Constitution
- IF issues → "🔴 REFAZER" → PHASE 1
- IF ok → "🟢 APROVADO" + `test_plan.md` → PHASE 3

### PHASE 3: Implementation (@Opus)

- Code following architecture.md
- Git commit after each module
- OUTPUT: "PHASE 3 DONE → @Council verify"

### PHASE 4: Verification (@Both Council)

// turbo-all

- Code review line by line
- Test integrations
- Check closed cycles
- Hunt bugs actively
- IF bugs → Fix list → PHASE 3
- IF ok → "✅ RELEASE READY"

### PHASE 5: Documentation (@Council)

- Update README, CHANGELOG
- Create walkthrough.md
- Final commit + push

---

## 🏷️ TAGS

| Tag          | Meaning               |
| ------------ | --------------------- |
| 🔴 REFAZER   | Critical issues, redo |
| 🟢 APROVADO  | Approved              |
| 🐛 BUG       | Bug found             |
| ✅ COMPLETE  | Phase done            |
| 🚨 ESCALATE  | Need Founder          |
| 📦 COMMITTED | Code pushed           |

---

## ✅ COUNCIL CHECKLIST

Before approving:

- [ ] Follows SDK patterns?
- [ ] Respects Constitution?
- [ ] Integrates with existing?
- [ ] Has error handling?
- [ ] Committed to GitHub?

---

## Usage

```
@Council START objective="[DESCRIBE GOAL]"
```
