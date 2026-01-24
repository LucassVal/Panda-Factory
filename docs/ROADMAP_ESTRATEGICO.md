# 🗺️ ROADMAP ESTRATÉGICO - Panda Factory

> **Data:** 2026-01-24 | **Fonte:** Com certeza.md (70% não implementado)  
> **Validação cruzada:** PANDA.md, PF_MASTER_ARCHITECTURE.md, PF_TOKENOMICS_REFERENCE.md

---

## 📊 Status Geral

| Categoria                | Implementado | Pendente | Conflitos |
| ------------------------ | ------------ | -------- | --------- |
| Tentacles Architecture   | ✅ 100%      | -        | Nenhum    |
| Multi-Market Expansion   | ❌ 10%       | 90%      | Nenhum    |
| VSX/Plugin Store         | ❌ 0%        | 100%     | Nenhum    |
| Gaming Studio            | ❌ 5%        | 95%      | Nenhum    |
| Tokenomics               | ✅ 100%      | -        | Validado  |
| Infraestrutura Zero-Cost | ⚠️ 30%       | 70%      | -         |

---

## 🔴 FASE 1: Multi-Market Expansion (Prioridade Alta)

> **Fonte:** Com certeza.md linhas 14-40

### 1.1. EdTech & Info (Kiwify/Hotmart Hook)

| Conceito           | Status      | Implementação          |
| ------------------ | ----------- | ---------------------- |
| White-Label Cursos | ❌ Pendente | Tentacle: `education/` |
| DRM Tokenizado     | ❌ Pendente | GAS: validação wallet  |
| Webhook Kiwify     | ✅ Parcial  | `PF_Core_Webhooks.gs`  |
| Webhook Hotmart    | ❌ Pendente | Clone do Kiwify        |

**Comparativo com Tokenomics:**

- Split de Receita EdTech: **55% Dev, 22% Fundo, 15% Ops, 5% Founder** ✅ Alinhado
- DRM usa: `Panda.Wallet.getBalance()` para validar acesso

### 1.2. Creative Assets (Marketplace 3D/2D)

| Conceito              | Status      | Implementação            |
| --------------------- | ----------- | ------------------------ |
| Marketplace Assets    | ❌ Pendente | Tentacle: `marketplace/` |
| Interop Blender/Godot | ❌ Pendente | MCP Tool                 |
| Upload de Modelos     | ❌ Pendente | Storage + metadata       |

**Dependências:**

- Panda.Storage (✅ existe)
- Asset metadata schema (❌ criar)

### 1.3. Dev Tools & Plugins (VSX Store)

| Conceito           | Status      | Implementação   |
| ------------------ | ----------- | --------------- |
| VSX Compatibility  | ❌ Pendente | Parser .vsix    |
| Plugin Marketplace | ❌ Pendente | Store UI        |
| MCP Modules        | ⚠️ Parcial  | Conceito existe |

**Comparativo com PANDA.md:**

- Já existe: `Panda.Bridge.execute()` para MCP
- Falta: Runtime de extensões isoladas

---

## 🟡 FASE 2: Gaming & Entertainment (Médio Prazo)

> **Fonte:** Com certeza.md linhas 71-82

### 2.1. Panda Arcade (Loja Própria)

| Conceito           | Status      | Comparativo                  |
| ------------------ | ----------- | ---------------------------- |
| WebGPU Games       | ❌ Pendente | Alinhado com GPU tentacle    |
| Jogos sem Download | ❌ Pendente | -                            |
| Microtransações PC | ❌ Pendente | Usar `Panda.Wallet.charge()` |

### 2.2. Panda Publish (CI/CD)

| Conceito           | Status      | Implementação       |
| ------------------ | ----------- | ------------------- |
| Build para Steam   | ❌ Pendente | Google Colab        |
| Build para Android | ❌ Pendente | Google Colab        |
| Build para Apple   | ❌ Pendente | Requer Mac (futuro) |

**Estratégia Zero-Cost (validada):**

- Usar **Google Colab** como compilador (linha 722-736 Com certeza)
- Salvar em **Google Drive** do usuário
- Custo Panda: R$ 0,00

### 2.3. Engine Integration

| Engine | Modo            | Status      |
| ------ | --------------- | ----------- |
| Godot  | Nativo (Wasm)   | ❌ Pendente |
| Bevy   | Nativo (Wasm)   | ❌ Pendente |
| Unreal | Pixel Streaming | ❌ Fase 3   |
| Unity  | Pixel Streaming | ❌ Fase 3   |

---

## 🟢 FASE 3: Infraestrutura Avançada (Longo Prazo)

### 3.1. VFS (Virtual File System)

| Conceito      | Status      | Comparativo                 |
| ------------- | ----------- | --------------------------- |
| Panda Drive   | ❌ Pendente | Substituir `Panda.Storage`? |
| Versionamento | ❌ Pendente | Git-like local              |

### 3.2. VSX Sandbox Runtime

| Conceito       | Status      | Detalhes                 |
| -------------- | ----------- | ------------------------ |
| Extensões .vsx | ❌ Pendente | Parser TypeScript        |
| Sandboxing     | ⚠️ Parcial  | TentacleMonitor já isola |

### 3.3. Social & Vibe Dev

| Conceito          | Status      | Comparativo com Tokenomics               |
| ----------------- | ----------- | ---------------------------------------- |
| Matchfunding      | ❌ Pendente | **25% Fundo → Labs** ✅ Alinhado         |
| Bolsas            | ❌ Pendente | **20% Labs → Learn-to-Earn** ✅ Alinhado |
| Pipeline Base→Dev | ❌ Pendente | Modelo documentado                       |

---

## ⚠️ CONFLITOS IDENTIFICADOS

### Nenhum conflito crítico!

Os valores do `Com certeza.md` foram validados contra os docs oficiais:

| Tópico               | Com certeza.md | PF_TOKENOMICS           | Status       |
| -------------------- | -------------- | ----------------------- | ------------ |
| Fundo Redistribuição | "20%"          | **22% Fundo Incentivo** | ✅ ~Alinhado |
| Founder Fee          | Não menciona   | **5% Eterno**           | ✅ OK        |
| Reserva PAXG         | Não menciona   | **70% PAXG**            | ✅ OK        |
| Inflação Max         | Não menciona   | **5% a.a. Hardcoded**   | ✅ OK        |

**Conclusão:** O arquivo `Com certeza.md` é compatível com a Constituição estabelecida.

---

## 📋 Priorização Sugerida

| Prioridade | Item                    | Esforço | Impacto |
| ---------- | ----------------------- | ------- | ------- |
| 🔴 1       | Webhook Hotmart         | 2h      | Alto    |
| 🔴 2       | DRM Tokenizado          | 4h      | Alto    |
| 🟡 3       | Marketplace Assets (UI) | 8h      | Médio   |
| 🟡 4       | Panda Publish (Colab)   | 12h     | Alto    |
| 🟢 5       | VSX Runtime             | 20h     | Médio   |
| 🟢 6       | VFS Panda Drive         | 40h     | Baixo   |

---

## 📁 Arquivos Relacionados

- [PF_TOKENOMICS_REFERENCE.md](PF_TOKENOMICS_REFERENCE.md) - Valores estabelecidos
- [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md) - Arquitetura
- [PANDA.md](../.agent/PANDA.md) - Codex Central

---

> 📝 **Fonte arquivada:** O arquivo `Com certeza.md` foi movido para `_archive/`.
