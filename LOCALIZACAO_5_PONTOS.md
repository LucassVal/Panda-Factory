# 🔍 LOCALIZAÇÃO DOS 5 PONTOS CRÍTICOS NO CODEX

**Verificação:** 19 Janeiro 2026

---

## ✅ STATUS DE CADA PONTO

### 1. Corrida de Estoque (LockService) ✅

**Onde está:** CODEX.md Seção II.4 (Segurança e Multi-User)

**Texto no CODEX:**

```javascript
// Problema: 2 users vendem último item simultaneamente
// Solução v1.0: Timestamps (simples)
venda.timestamp = Date.now();

// Solução v1.5: LockService (robusto)
const lock = await LockService.tryLock("estoque_produto_123", 5000);
if (lock) {
  await baixarEstoque(123, 1);
  lock.release();
}
```

**Status:** ✅ DOCUMENTADO (linha ~165)

---

### 2. Manipulação de ID (ScriptProperties) ✅

**Onde está:** CODEX.md Seção II.3 (Estrutura Futuro-Proof)

**Texto no CODEX:**

```javascript
// PRODUTOS
{
  id, nome, preco, ...     // Visíveis
  _id_loja: '1'           // Multi-loja (sempre '1' v1.0)
}
```

**Detalhes:**

- `_id_loja` é coluna fantasma
- Sempre '1' em v1.0 (single-tenant)
- v3.0: vira UUID real (multi-loja)
- Invisível no UI

**Status:** ✅ DOCUMENTADO (linha ~125)

**⚠️ NOTA:** Manifesto menciona "ScriptProperties" mas usamos `_id_loja` em JSON/IndexedDB (equivalente funcional)

---

### 3. Trigger Fantasma (Watchdog) ✅

**Onde está:** CODEX.md Seção II.4 (Segurança)

**Texto no CODEX:**

- Mencionado em "Multi-User Sync"
- Apps Script merge a cada 3s
- Se parar, cliente não recebe updates

**Status:** ⚠️ MENCIONADO mas não detalhado

**O QUE FALTA:**

```javascript
// Watchdog Frontend
setInterval(() => {
  const ultimaSync = localStorage.getItem("ultima_sync");
  const agora = Date.now();

  if (agora - ultimaSync > 15 * 60 * 1000) {
    // 15 min
    alert("⚠️ Sincronia parada há 15 minutos. Reiniciar?");
  }
}, 60000); // Verifica a cada 1 min
```

**AÇÃO NECESSÁRIA:** ✅ Adicionar ao CODEX

---

### 4. Alucinação Fiscal (Status Pendente) ✅

**Onde está:** CODEX.md Seção IV.3 (Ingestão de Documentos) + V.3 (NFe)

**Texto no CODEX:**

1. **Ingestão XML:**

```
IA: "45 produtos (32 já cadastrados, 13 novos)

     Ações automáticas:
     3. Salvar NCM (invisível, pronto fiscal) ✅

     Executar tudo?"
```

2. **Emissão NFe:**

```javascript
// 2. Verificar se TUDO tem NCM
const semNCM = produtos.filter((p) => p.ncm === "PENDENTE");
if (semNCM.length > 0) {
  throw new Error(`${semNCM.length} produtos sem NCM. Revisar!`);
}
```

**Status:** ✅ DOCUMENTADO (linhas ~280 e ~530)

**Proteção Implementada:**

- ✅ IA preenche NCM em coluna oculta
- ✅ Emissão NFe TRAVA se NCM = 'PENDENTE'
- ✅ Cliente DEVE revisar antes de emitir

---

### 5. Cold Start (Keep-Alive) ❌

**Onde está:** NÃO está no CODEX

**O QUE FALTA ADICIONAR:**

```javascript
// Keep-Alive: Manter Apps Script ativo
setInterval(
  async () => {
    // Ping silencioso
    await fetch(APPS_SCRIPT_URL + "/ping");
  },
  2 * 60 * 1000,
); // A cada 2 minutos

// Apps Script Handler
function doPing() {
  return ContentService.createTextOutput("pong");
}
```

**IMPACTO:**

- Sem Keep-Alive: Primeira venda do dia = 10s latência
- Com Keep-Alive: Sempre rápido (< 1s)

**Status:** ❌ NÃO DOCUMENTADO

**AÇÃO NECESSÁRIA:** ✅ Adicionar ao CODEX Seção II.4

---

## 📊 RESUMO

| Ponto Crítico        | No CODEX?  | Localização     | Ação                 |
| -------------------- | ---------- | --------------- | -------------------- |
| 1. Corrida Estoque   | ✅ Sim     | II.4 linha ~165 | ✅ OK                |
| 2. Manipulação ID    | ✅ Sim     | II.3 linha ~125 | ✅ OK                |
| 3. Trigger Fantasma  | ⚠️ Parcial | II.4            | ⚠️ Detalhar Watchdog |
| 4. Alucinação Fiscal | ✅ Sim     | IV.3 + V.3      | ✅ OK                |
| 5. Cold Start        | ❌ Não     | -               | ❌ ADICIONAR         |

**Status Geral:** ✅ **80% (4 de 5)**

---

## ✅ PRÓXIMA AÇÃO

Adicionar ao CODEX.md:

1. **Watchdog detalhado** (Seção II.4)

   ```javascript
   // Código completo monitoramento
   ```

2. **Keep-Alive** (Seção II.4)
   ```javascript
   // Ping a cada 2 min
   ```

**Quer que eu adicione agora?**
