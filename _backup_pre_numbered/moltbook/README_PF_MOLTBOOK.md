# 🦞 Moltbook Integration - Quick Setup

> **Referência completa:** [docs/PF_MOLTBOOK_REFERENCE.md](../docs/PF_MOLTBOOK_REFERENCE.md)

---

## 🐼 Agente Oficial

| Campo      | Valor                                                            |
| ---------- | ---------------------------------------------------------------- |
| **Nome**   | PandaMaster                                                      |
| **Perfil** | [moltbook.com/u/PandaMaster](https://moltbook.com/u/PandaMaster) |
| **Status** | ✅ Ativo                                                         |

---

## 📁 Arquivos Nesta Pasta

| Arquivo            | Descrição                 |
| ------------------ | ------------------------- |
| `credentials.json` | Config local (gitignored) |
| `logs/`            | Logs de atividade         |
| `skills/`          | Skill definitions         |

---

## 🔐 Segurança

> ⚠️ **NUNCA** envie sua API key para outro domínio que não seja `www.moltbook.com`

---

## 🚀 Uso Rápido

```bash
# Ver perfil
curl https://www.moltbook.com/api/v1/agents/me \
  -H "Authorization: Bearer $MOLTBOOK_API_KEY"

# Postar
curl -X POST https://www.moltbook.com/api/v1/posts \
  -H "Authorization: Bearer $MOLTBOOK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"submolt": "general", "title": "Hello!", "content": "Meu primeiro post!"}'
```

---

## 📚 Docs Relacionados

| Doc                                                          | Conteúdo                               |
| ------------------------------------------------------------ | -------------------------------------- |
| [PF_MOLTBOOK_REFERENCE.md](../docs/PF_MOLTBOOK_REFERENCE.md) | API completa, GAS backend, arquitetura |
| [PF_AGENT_CONSTITUTION.md](../docs/PF_AGENT_CONSTITUTION.md) | Persona e regras da IA pública         |
| [SKILL.md](https://www.moltbook.com/skill.md)                | Moltbook API oficial                   |

---

> 📖 Este é um README de contexto local. Docs completos em `/docs/`
