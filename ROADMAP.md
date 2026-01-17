# 🗺️ ROADMAP - TitanGestão PRO

**Lançamento:** 8 Março 2026 (8 semanas)  
**Entregas:** CRM + PDV + Estoque + PWA + Multi-User

---

## 📋 ESTRUTURA DE SPRINTS

### ✅ ORDEM CORRETA (Fundação → Features)

**CRÍTICO:** Google Apps Script ANTES de features, pois é base do multi-user!

```
Sprint 1-2: Fundação (Apps Script + PWA) ← PRIMEIRO
Sprint 3-4: Features CRM
Sprint 5: PDV + Estoque
Sprint 6-7: Integração + Testes
Sprint 8: Launch
```

---

## 🔷 Sprint 1: Infraestrutura Google (29 Jan - 4 Fev)

**Objetivo:** Apps Script + OAuth funcionando ANTES de qualquer feature

### Entregáveis

| Item                   | Descrição                        | Horas | Prioridade |
| ---------------------- | -------------------------------- | ----- | ---------- |
| **Apps Script Deploy** | Código merge engine rodando      | 12h   | P0         |
| **OAuth Setup**        | Google Cloud Project configurado | 6h    | P0         |
| **Drive API Test**     | Upload/download funcionando      | 8h    | P0         |
| **Backend Auth**       | Node.js + MongoDB (usuários)     | 10h   | P0         |

### Checklist Detalhado

**1. Google Cloud Project Setup:**

- [ ] Criar projeto no console.cloud.google.com
- [ ] Ativar Drive API
- [ ] Ativar Apps Script API
- [ ] Criar OAuth credentials (Web application)
- [ ] Configurar redirect URI: https://tocadobarbaro.com/callback

**2. Apps Script Deploy:**

- [ ] Criar projeto Apps Script (nossa conta)
- [ ] Copiar código `merge-engine.gs` (do doc APPS_SCRIPT.md)
- [ ] Testar manualmente com mock data
- [ ] Configurar trigger time-driven (3s)
- [ ] Deploy como web app

**3. Backend Node.js:**

- [ ] Setup Express + MongoDB Atlas
- [ ] Rota `/auth/google` (OAuth flow)
- [ ] Rota `/auth/callback` (recebe token)
- [ ] Salvar tokens criptografados
- [ ] Endpoint `/api/sync` (frontend chama)

**4. Teste End-to-End:**

- [ ] Frontend → OAuth → Backend → Drive
- [ ] Upload mudancas.json
- [ ] Apps Script detecta e executa merge
- [ ] Frontend baixa master.json atualizado
- [ ] **Multi-user simulado (2 abas navegador)**

**Entrega:** Sincronização funcionando localmente

---

## 🔷 Sprint 2: PWA + IndexedDB (5-11 Fev)

**Objetivo:** Sistema funciona offline após cache

### Entregáveis

| Item               | Descrição                         | Horas | Prioridade |
| ------------------ | --------------------------------- | ----- | ---------- |
| **Service Worker** | Cache offline completo            | 12h   | P0         |
| **IndexedDB**      | Migração localStorage → IndexedDB | 10h   | P0         |
| **Manifest.json**  | PWA instalável                    | 3h    | P0         |
| **Sync Queue**     | Fila mudanças offline → online    | 8h    | P0         |

### Checklist

- [ ] Service Worker cacheia app (HTML, CSS, JS, assets)
- [ ] IndexedDB schema: clientes, vendas, produtos, sync_queue
- [ ] Offline: salva em IndexedDB + adiciona sync_queue
- [ ] Online: processa sync_queue → Drive
- [ ] Manifest.json (ícones 192px, 512px)
- [ ] Testar: offline → editar → online → sync

**Entrega:** PWA instalável + sync automático

---

## 🔷 Sprint 3-4: Features CRM Core (12-25 Fev)

**Objetivo:** CRM completo e usável

### Entregáveis

| Feature          | Horas | Status |
| ---------------- | ----- | ------ |
| Tags de Captação | 12h   | 🔄     |
| Importação Excel | 15h   | ⏳     |
| White Label      | 20h   | ⏳     |
| Orçamentos PDF   | 18h   | ⏳     |
| Multi-usuário UI | 15h   | ⏳     |

### Checklist

**Tags de Captação:**

- [ ] Modal configurar fontes (CRUD)
- [ ] Aplicar tag ao cadastrar
- [ ] Filtro por fonte
- [ ] Migrar dados scraper (Guia Construção)

**Importação Excel:**

- [ ] Upload CSV/XLSX
- [ ] Preview dados
- [ ] Mapeamento colunas
- [ ] Importar em lote

**White Label:**

- [ ] Upload logo (Base64)
- [ ] Color picker
- [ ] Google Fonts select
- [ ] Preview live

**Orçamentos PDF:**

- [ ] Template HTML
- [ ] jsPDF generation
- [ ] Logo customizado
- [ ] Download/impressão

**Multi-usuário:**

- [ ] CRUD usuários
- [ ] 5 níveis permissões
- [ ] Login/logout
- [ ] Auditoria (quem alterou)

**Entrega:** CRM produção-ready

---

## 🔷 Sprint 5: PDV + Estoque (26 Fev - 4 Mar)

**Objetivo:** Módulos básicos funcionais

### PDV (15h)

- [ ] Tela vendas (busca produto, adiciona carrinho)
- [ ] Formas pagamento (dinheiro, PIX, cartão)
- [ ] Finalizar venda (gera recibo PDF)
- [ ] Controle caixa (abertura/fechamento)
- [ ] Integração: venda → baixa estoque

### Estoque (12h)

- [ ] CRUD produtos
- [ ] Movimentações (entrada/saída)
- [ ] Alertas estoque mínimo
- [ ] Relatório inventário

### Financeiro (8h)

- [ ] Contas a pagar (básico)
- [ ] Contas a receber (básico)
- [ ] DRE simplificado

**Entrega:** PDV + Estoque operacionais

---

## 🔷 Sprint 6: Integração + Dashboard (5-7 Mar)

**Objetivo:** Tudo conectado

### Integrações (10h)

- [ ] Venda PDV → Histórico CRM
- [ ] Cliente CRM → Aparece PDV
- [ ] Baixa estoque automática
- [ ] Financeiro vinculado vendas

### Dashboard Unificado (8h)

- [ ] 12 gráficos (Chart.js)
- [ ] Filtros período
- [ ] Métricas KPI
- [ ] Exportação PDF/Excel

**Entrega:** Sistema 100% integrado

---

## 🔷 Sprint 7: Testes + Polish (8-10 Mar)

**Objetivo:** Zero bugs críticos

### Beta Test (3 dias)

- [ ] 5 usuários beta
- [ ] Testar multi-user real
- [ ] Testar offline/online
- [ ] Coletar feedback

### Correções (2 dias)

- [ ] Bugs críticos
- [ ] Performance (10k clientes simulados)
- [ ] UX polish

**Entrega:** Sistema estável

---

## 🚀 Sprint 8: Launch (11-15 Mar)

### Marketing (3 dias)

- [ ] VSL gravado (5min)
- [ ] Landing page Kiwify
- [ ] Kit afiliados (emails, banners)
- [ ] Recru tar 20 afiliados

### Deploy (2 dias)

- [ ] Hospedar tocadobarbaro.com
- [ ] Apps Script produção
- [ ] MongoDB produção
- [ ] Monitoring

**LANÇAMENTO: 15 Março 2026** 🎉

---

## ⚠️ DEPENDÊNCIAS CRÍTICAS

**Apps Script ANTES de tudo:**

```
Apps Script (Sprint 1)
    ↓
PWA + IndexedDB (Sprint 2)
    ↓
Features CRM (Sprint 3-4)
    ↓
PDV + Estoque (Sprint 5)
```

**Sem Apps Script = Sem multi-user = Sem teste real**

---

## 📊 MILESTONES

| Data       | Milestone           | Validação                    |
| ---------- | ------------------- | ---------------------------- |
| **4 Fev**  | Apps Script rodando | Multi-user funciona (2 abas) |
| **11 Fev** | PWA instalável      | Funciona offline             |
| **25 Fev** | CRM completo        | 10 features OK               |
| **4 Mar**  | PDV + Estoque       | Sistema completo             |
| **10 Mar** | Beta OK             | Zero bugs críticos           |
| **15 Mar** | LANÇAMENTO          | Vendendo!                    |

---

## 🎯 PRÓXIMO PASSO IMEDIATO

**AGORA:** Criar APPS_SCRIPT.md com código pronto para deploy

**Depois:** Implementar Apps Script (Sprint 1)

**Só então:** Features CRM

---

**Atualizado:** 17 Janeiro 2026  
**Versão:** 3.0 (CORRIGIDA - Apps Script primeiro)  
**Status:** Pronto para Implementação
