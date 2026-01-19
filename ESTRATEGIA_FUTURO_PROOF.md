# 🏗️ ESTRATÉGIA ARQUITETURA FUTURO-PROOF

**Data:** 19 Janeiro 2026  
**Decisão:** Manter TitanGestão v1.0 + Preparar Esqueleto Multi-Modal

---

## 🎯 DECISÃO FINAL

**NÃO** ao "Agente Foda" completo (muito disruptivo)  
**SIM** ao TitanGestão v1.0 atual (lançar Março 2026)  
**PLUS** Esqueleto preparado para futuro (não trocar motor na corrida)

---

## 📊 O QUE MANTER (TitanGestão v1.0)

### ✅ Arquitetura Core (NÃO MUDAR)

- Apps Script centralizado (nosso controle)
- IndexedDB + Google Drive JSON
- PWA offline-first
- Single HTML (CRM.html)
- R$ 149,90 pagamento único

### ✅ Modelo Negócio (NÃO MUDAR)

- Pricing híbrido (R$ 149,90 + MRR opcional)
- Canais: Kiwify + Hotmart + Site
- Lançamento: Março 2026

### ✅ Features v1.0 (NÃO MUDAR)

- CRM + PDV + Estoque + Financeiro + Agenda
- 10 usuários incluídos
- White label
- Google Maps

---

## 🌱 O QUE ADICIONAR (Esqueleto Futuro)

### 1. Infraestrutura Sombra (Colunas Ocultas)

**Preparar para futuro SEM atrapalhar presente:**

```javascript
// Em PRODUTOS
const produtoSchema = {
  id: String,
  nome: String,
  preco: Number,
  foto: String,
  // ... campos visíveis atuais

  // 👻 COLUNAS OCULTAS (futuro)
  _metadata_fiscal: JSON, // NCM, CEST (para v2.5 fiscal)
  _atributos_extra: JSON, // Campos customizáveis extensíveis
  _id_loja: String, // Multi-loja (agora = null, futuro = UUID)
  _versao_schema: Number, // Versionamento estrutura
};
```

**Implementação v1.0:**

- Adicionar colunas com prefixo `_` (invisíveis no UI)
- Sempre `null` ou `{}` vazio
- ZERO impacto visual/performance
- Quando ativar futuro, dados JÁ ESTÃO LÁ

### 2. Repository Pattern Leve

**Abstração mínima para trocar backend depois:**

```javascript
// core/database/Repository.js (NOVO)
class Repository {
  // v1.0: IndexedDB
  // v2.0: Pode virar Sheets, SQL, etc

  async getProdutos() {
    // Hoje: return indexedDB.getAll('produtos')
    // Futuro: só mexe aqui, resto do código igual
  }

  async saveProduto(produto) {
    // Centraliza lógica de salvamento
  }
}

// Usar em TUDO:
// ❌ ERRADO: indexedDB.add('produtos', data)
// ✅ CERTO: Repository.saveProduto(data)
```

### 3. ID_LOJA Preparado (Mas Inativo)

**Multi-loja futuro:**

```javascript
// Toda função recebe storeId (sempre '1' em v1.0)
function buscarProdutos(storeId = "1") {
  // v1.0: storeId sempre '1' (single-tenant)
  // v2.0: pode ser '1', '2', '3' (multi-loja)
  return Repository.getProdutos().filter((p) => p._id_loja === storeId);
}
```

**Vantagem:** Código JÁ preparado, ativa mudando `'1'` para UUID real

### 4. Feature Flags (Config JSON)

**Ligar/desligar módulos remotamente:**

```javascript
// localStorage ou Drive
const CONFIG = {
  ENABLE_IFOOD: false, // v2.5
  ENABLE_FISCAL: false, // v2.5
  ENABLE_IA_WHATSAPP: false, // v2.0
  ENABLE_MULTI_LOJA: false, // v3.0
  ENABLE_ETIQUETAS: true, // v1.0 ativa!
};

// No código:
if (CONFIG.ENABLE_ETIQUETAS) {
  mostrarBotaoEtiqueta();
}
```

### 5. Estrutura Modular Suave

**Separar código SEM virar CLASP ainda:**

```
CRM.html (atual monolito 218KB)
       ↓ (refatorar gradual)
/js
  /modules
    crm.js         (isola CRM)
    pdv.js         (isola PDV)
    estoque.js     (isola Estoque)
    financeiro.js  (isola Financeiro)
  /core
    repository.js  (abstração dados)
    utils.js       (helpers)
  main.js          (orquestra tudo)
```

**v1.0:** Tudo inline no HTML ainda (build.js concatena)  
**v1.5:** Separa em arquivos (mais fácil manter)  
**v2.0:** Pode virar CLASP se precisar

---

## 🛡️ PONTOS DE ATENÇÃO (Do Documento)

### Implementar v1.0

| Ponto                | Solução v1.0              | Quando Refinar      |
| -------------------- | ------------------------- | ------------------- |
| **Corrida Estoque**  | Timestamps (simples)      | v1.5: LockService   |
| **ID_LOJA**          | Sempre '1' (preparado)    | v2.0: UUID real     |
| **Trigger Fantasma** | Watchdog frontend simples | v1.5: Logs robustos |
| **IA Fiscal**        | NÃO em v1.0               | v2.5: IA + NCM      |
| **Cold Start**       | Keep-alive básico         | v1.5: Otimizar      |

### NÃO Implementar Agora (Complexidade Prematura)

- ❌ Apps Script distribuído (manter centralizado v1.0)
- ❌ Google Sheets como DB (manter IndexedDB + JSON)
- ❌ CLASP + VS Code (manter single HTML)
- ❌ IA core desde dia 1 (deixar v2.0 opcional)
- ❌ iFood/WhatsApp webhook (v2.5)

---

## 📋 PLANO IMPLEMENTAÇÃO

### Sprint 1-6 (Março 2026 - v1.0)

**Implementar:**

1. ✅ TitanGestão conforme docs atuais
2. ✅ Adicionar colunas ocultas (`_metadata_fiscal`, `_id_loja`, etc)
3. ✅ Repository pattern leve (wrapper IndexedDB)
4. ✅ Feature flags (CONFIG simples)
5. ✅ storeId='1' em todas funções (preparado)

**Resultado:** Sistema FUNCIONA, mas preparado para crescer

### v1.5 (Maio 2026 - Refinamento)

**Adicionar segurança:**

1. LockService (race condition)
2. Watchdog robusto
3. Logs SYS_LOGS ocultos

### v2.0 (Julho 2026 - IA)

**Ativar:**

1. IA WhatsApp (CONFIG.ENABLE_IA = true)
2. Preencher `_metadata_fiscal` automaticamente (latente)

### v2.5 (Outubro 2026 - Integrações)

**Ativar:**

1. iFood webhook
2. Fiscal (usar `_metadata_fiscal` já populado!)

### v3.0 (2027 - Multi-Loja)

**Ativar:**

1. `CONFIG.ENABLE_MULTI_LOJA = true`
2. storeId vira UUID real
3. Código JÁ PREPARADO funciona!

---

## ✅ VANTAGENS ESTRATÉGIA

**vs "Agente Foda" Puro:**

- ✅ Lança em 8 semanas (vs 24 semanas)
- ✅ R$ 149,90 mantém barreira baixa
- ✅ Simples debug (monolito vs 1000 scripts)
- ✅ Controle total (centralizado)

**vs TitanGestão Puro:**

- ✅ Preparado para multi-loja (colunas ocultas)
- ✅ Não precisa migração dados depois
- ✅ Repository = troca backend quando precisar
- ✅ Feature flags = liga módulos sem redeploy

**Melhor dos 2 mundos:**

- 🚀 Velocidade lançamento (TitanGestão)
- 🏗️ Esqueleto futuro-proof ("Agente Foda")
- 💰 Pricing vencedor (híbrido)

---

## 🎯 RESUMO EXECUTIVO

**Manter:**

- Arquitetura TitanGestão v1.0 (Apps Script centralizado, PWA, JSON)
- Pricing R$ 149,90 + MRR
- Lançamento Março 2026

**Adicionar (Invisível):**

- Colunas ocultas (`_metadata_fiscal`, `_id_loja`)
- Repository pattern leve
- Feature flags
- storeId='1' preparado

**Resultado:**

- Lança rápido v1.0 funcional
- Cresce para v2.0/v3.0 SEM trocar motor
- Cliente não vê complexidade

**Analogia:** Construir casa com fundação para 3 andares, mas começar com 1 andar só.

---

**Aprovado?** Continuo com essa estratégia ou ajustar algo?
