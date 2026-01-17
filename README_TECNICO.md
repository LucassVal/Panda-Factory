# 🚀 TitanFusion Business Suite - Documentação Técnica

> **Sistema Modular de Gestão Empresarial | 100% Offline | White Label | Multi-Usuário**

**Versão:** 2.2 (Janeiro 2026)  
**Status:** Produção Ativa (Módulo CRM) | Roadmap PDV + Estoque  
**Repositório:** [GitHub - LucassVal/TitanFusion](https://github.com/LucassVal)

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Ecossistema de Produtos](#-ecossistema-de-produtos)
3. [Arquitetura Técnica](#-arquitetura-técnica)
4. [Comparativo de Módulos](#-comparativo-de-módulos)
5. [Status de Implementação](#-status-de-implementação)
6. [Arquitetura Multi-Usuário](#-arquitetura-multi-usuário)
7. [Roadmap Detalhado](#-roadmap-detalhado)
8. [Estrutura do Projeto](#-estrutura-do-projeto)

---

## 🎯 Visão Geral

### Conceito Core

Sistema de gestão empresarial modular desenvolvido para **pequenas e médias empresas** com foco em:

- **Autonomia**: 100% offline, sem dependências de internet
- **Privacidade**: Dados criptografados localmente (AES-256)
- **Portabilidade**: Executável de pendrive sem instalação
- **Customização**: White label completo para revenda
- **Economia**: Pagamento único vs mensalidade recorrente

### Filosofia "Arroz com Feijão"

**Princípios de Design:**

- ✅ Features que 80% dos usuários usam 80% do tempo
- ✅ Interface limpa e intuitiva (curva de aprendizado < 30min)
- ✅ Performance mantida até 10.000+ registros
  -✅ Funcionalidades essenciais perfeitamente executadas
- ❌ Sem features "nice to have" que complicam UX

---

## 📦 Ecossistema de Produtos

### Estratégia Modular 3+1

| **Módulo**          | **Preço** | **Público-Alvo**                        | **Status** | **Entrega Prev.** |
| ------------------- | --------- | --------------------------------------- | ---------- | ----------------- |
| **TitanCRM**        | R$ 39,99  | Vendedores, consultores, representantes | ✅ 80%     | Fev 2026          |
| **TitanPDV**        | R$ 39,99  | Lojistas, comerciantes, prestadores     | 🔄 10%     | Abr 2026          |
| **TitanStock**      | R$ 39,99  | Lojas, distribuidoras, depósitos        | 🔄 5%      | Jun 2026          |
| **Complete 3-em-1** | R$ 99,99  | Empresas com gestão integrada           | 🔄 Roadmap | Ago 2026          |

**Economia para cliente:** R$ 119,97 → R$ 99,99 (**17% desconto**)

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico (v2.2)

```
┌─────────────────────────────────────────┐
│        Interface do Usuário             │
│  HTML5 + CSS3 + Vanilla JavaScript      │
│  (SPA - Single Page Application)        │
└──────────┬──────────────────────────────┘
           │
     ┌─────▼─────┐
     │  Browser  │
     │  Runtime  │
     └─────┬─────┘
           │
  ┌────────▼────────┐
  │  LocalStorage   │
  │  (Primary DB)   │
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │ Backup JSON     │
  │ (File System)   │
  └─────────────────┘
```

| **Camada**         | **Tecnologia**                         | **Justificativa**                             |
| ------------------ | -------------------------------------- | --------------------------------------------- |
| **Frontend**       | HTML5 + CSS3 + Vanilla JS (ES6+)       | Zero dependências, máxima compatibilidade     |
| **Styling**        | CSS Nativo (glassmorphism, gradientes) | Sem frameworks = menor payload, mais controle |
| **Banco de Dados** | LocalStorage (JSON)                    | Persistência offline, até 10MB/domínio        |
| **Backup**         | JSON File Export                       | Portabilidade de dados                        |
| **Criptografia**   | CryptoJS (AES-256)                     | Segurança de dados sensíveis                  |
| **Gráficos**       | Chart.js (local)                       | Visualização de KPIs e dashboards             |
| **Scraper**        | Python (Playwright)                    | Importação automática (uso interno)           |

### Dependências Offline

**Crítico:** Todas as bibliotecas são carregadas localmente (zero CDNs em produção)

```html
<!-- ✅ CORRETO - Assets locais -->
<script src="assets/js/crypto-js.min.js"></script>
<script src="assets/js/chart.min.js"></script>

<!-- ❌ ERRADO - CDN bloqueante -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**Bibliotecas Incluídas:**

- `crypto-js.min.js` (180KB) - Criptografia AES-256
- `chart.min.js` (245KB) - Gráficos e dashboards
- Google Fonts Offline: Inter, Poppins, Roboto, Outfit, Montserrat

---

## 🔀 Comparativo de Módulos

### 1️⃣ **TitanCRM** - Gestão de Relacionamento

**Objetivo:** Organizar clientes, leads e vendas com histórico completo

| **Feature**              | **Status** | **Descrição Técnica**                                                                                 |
| ------------------------ | ---------- | ----------------------------------------------------------------------------------------------------- |
| **Cadastro de Clientes** | ✅         | CRUD completo com 25+ campos (nome, telefone, email, endereço, m², orçamento, etc)                    |
| **Funil de Vendas**      | ✅         | 7 status customizáveis: Prospect → Qualificado → Proposta → Negociação → Fechamento → Fechado/Perdido |
| **Histórico Timeline**   | ✅         | Log cronológico de interações (notas, ligações, reuniões, mudanças de status)                         |
| **Agenda**               | ✅         | Calendário mensal com agendamentos linkados a clientes                                                |
| **Dashboard KPIs**       | ✅         | Métricas: Total clientes, taxa conversão, valor em pipeline, performance por vendedor                 |
| **Filtros Avançados**    | ✅         | 2 linhas de filtros: busca, status, localização, área m², data                                        |
| **Importação em Massa**  | 🔄         | Via Excel/CSV com preview e mapeamento de colunas                                                     |
| **Tags de Captação**     | 🔄         | Sistema configurável de fontes (ex: Google Ads, Indicação, etc)                                       |
| **Relatórios PDF**       | ⏳         | Exportação de propostas, contratos e recibos                                                          |
| **Visualização Kanban**  | ✅         | Arrastar clientes entre colunas de status                                                             |

**Estrutura de Dados (JSON):**

```javascript
{
  "id": "CLI_1737140256789",
  "nome": "João Silva Construtora",
  "telefone": "(11) 98765-4321",
  "email": "joao@construtora.com.br",
  "endereco": "Rua das Acácias, 123",
  "bairro": "Jardim Europa",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "metrosQuadrados": 350,
  "orcamento": 850000,
  "status": "proposta",
  "atendente": "admin",
  "fonteCaptacao": "fc_google_ads",
  "historico": [
    {
      "id": "hist_001",
      "tipo": "nota",
      "data": "2026-01-15T10:30:00",
      "texto": "Cliente interessado em projeto residencial",
      "autor": "admin"
    }
  ],
  "tags": ["alto_valor", "urgente"],
  "criadoEm": "2026-01-10T14:22:00",
  "atualizadoEm": "2026-01-15T10:30:00"
}
```

---

### 2️⃣ **TitanPDV** - Ponto de Venda e Financeiro

**Objetivo:** Controlar dinheiro, vendas e contas da empresa

| **Feature**               | **Status** | **Descrição Técnica**                                           |
| ------------------------- | ---------- | --------------------------------------------------------------- |
| **Controle de Caixa**     | ⏳         | Abertura/fechamento diário com conferência de valores           |
| **PDV Simplificado**      | ⏳         | Venda rápida com busca de produtos e impressão de cupom         |
| **Contas a Pagar**        | ⏳         | Gestão de fornecedores, vencimentos e baixas                    |
| **Contas a Receber**      | ⏳         | Controle de clientes, parcelas e recebimentos                   |
| **Fluxo de Caixa**        | ⏳         | Visão diária/semanal/mensal de entradas e saídas                |
| **Emissão de Orçamentos** | ⏳         | Templates personalizáveis com logo e assinatura                 |
| **Recibos/Notas**         | ⏳         | Geração de comprovantes PDF                                     |
| **Categorização**         | ⏳         | Classificação de despesas (operacional, pessoal, impostos, etc) |
| **Relatório DRE**         | ⏳         | Demonstrativo de resultados (Receitas - Despesas = Lucro)       |
| **Integração CRM**        | ⏳         | Clientes do CRM aparecem automaticamente no PDV                 |

**Estrutura Planejada:**

```javascript
{
  "movimentacoes": [
    {
      "id": "MOV_001",
      "tipo": "entrada", // ou "saida"
      "categoria": "venda",
      "valor": 1500.00,
      "descricao": "Venda produto #42",
      "clienteId": "CLI_1737140256789", // Link com CRM
      "dataHora": "2026-01-15T16:45:00",
      "formaPagamento": "pix",
      "responsavel": "admin"
    }
  ],
  "contasPagar": [...],
  "contasReceber": [...]
}
```

---

### 3️⃣ **TitanStock** - Gestão de Estoque

**Objetivo:** Controlar produtos, entradas, saídas e inventário

| **Feature**               | **Status** | **Descrição Técnica**                                    |
| ------------------------- | ---------- | -------------------------------------------------------- |
| **Cadastro de Produtos**  | ⏳         | CRUD com SKU, nome, descrição, categoria, foto           |
| **Controle de Estoque**   | ⏳         | Quantidade disponível, reservada, em trânsito            |
| **Movimentações**         | ⏳         | Registro de entradas (compras) e saídas (vendas, perdas) |
| **Estoque Mínimo**        | ⏳         | Alertas automáticos quando produto está acabando         |
| **Multi-Locais**          | ⏳         | Controle separado por depósito/loja                      |
| **Rastreamento de Lotes** | ⏳         | Validade, fornecedor, data de entrada                    |
| **Inventário Físico**     | ⏳         | Conferência de estoque com ajustes                       |
| **Precificação**          | ⏳         | Custo, margem, preço venda, descontos                    |
| **Integração PDV**        | ⏳         | Venda no PDV baixa estoque automaticamente               |
| **Relatórios**            | ⏳         | Curva ABC, giro de estoque, produtos parados             |

**Estrutura Planejada:**

```javascript
{
  "produtos": [
    {
      "id": "PROD_001",
      "sku": "MAD-OAK-200",
      "nome": "Madeira Carvalho 2m",
      "categoria": "madeiras",
      "unidade": "m²",
      "estoque": {
        "disponivel": 150,
        "reservado": 20,
        "minimo": 50
      },
      "precificacao": {
        "custo": 45.00,
        "margemPorcentagem": 60,
        "precoVenda": 72.00
      },
      "fornecedor": "Madeirinha Ltda",
      "locais": {
        "deposito_principal": 120,
        "loja_centro": 30
      }
    }
  ]
}
```

---

### 4️⃣ **TitanFusion Complete** - Sistema Integrado

**Objetivo:** Unificar CRM + PDV + Estoque com sincronização automática

| **Feature**                 | **Status** | **Descrição Técnica**                                                |
| --------------------------- | ---------- | -------------------------------------------------------------------- |
| **Dashboard Unificado**     | ⏳         | Visão 360° (vendas + finanças + estoque)                             |
| **Sincronização CRM→PDV**   | ⏳         | Cliente cadastrado no CRM já aparece no PDV                          |
| **Sincronização PDV→Stock** | ⏳         | Venda realizada baixa estoque automaticamente                        |
| **Histórico Integrado**     | ⏳         | Timeline do cliente mostra vendas, pagamentos e interações           |
| **Relatórios Cruzados**     | ⏳         | Ex: "Produtos mais vendidos por fonte de captação"                   |
| **Automações**              | ⏳         | Ex: Estoque baixo → criar nota no CRM para recompra                  |
| **Fluxo Completo**          | ⏳         | Lead (CRM) → Venda (PDV) → Baixa Estoque (Stock) → Recebimento (PDV) |

**Exemplo de Fluxo Integrado:**

```
1. Cliente "João Silva" cadastrado no CRM (fonte: Google Ads)
2. Vendedor move para "Fechado" no funil
3. Sistema pergunta: "Registrar venda no PDV?"
4. Venda R$ 1.500 criada automaticamente
5. Produtos selecionados baixam do estoque
6. Recibo gerado com dados do cliente
7. Histórico do CRM atualizado com venda
```

---

## 📊 Status de Implementação

### Matriz de Features (Janeiro 2026)

| **Módulo**   | **Funcionalidade** | **Status**         | **% Completo** | **Prioridade** |
| ------------ | ------------------ | ------------------ | -------------- | -------------- |
| **CRM**      | Cadastro clientes  | ✅ Completo        | 100%           | -              |
| **CRM**      | Funil de vendas    | ✅ Completo        | 100%           | -              |
| **CRM**      | Histórico timeline | ✅ Completo        | 100%           | -              |
| **CRM**      | Agenda             | ✅ Completo        | 95%            | P2             |
| **CRM**      | Dashboard          | ✅ Completo        | 90%            | P3             |
| **CRM**      | Filtros avançados  | ✅ Completo        | 100%           | -              |
| **CRM**      | Tags de captação   | 🔄 Desenvolvimento | 30%            | **P0**         |
| **CRM**      | Importação Excel   | 🔄 Planejamento    | 20%            | **P1**         |
| **CRM**      | White label UI     | 🔄 Planejamento    | 0%             | **P1**         |
| **CRM**      | Criptografia dados | ⏳ Pendente        | 0%             | **P0**         |
| **CRM**      | Multi-usuário      | ⏳ Pendente        | 0%             | P2             |
| **PDV**      | Todas features     | ⏳ Roadmap         | 0%             | P3             |
| **Stock**    | Todas features     | ⏳ Roadmap         | 0%             | P4             |
| **Complete** | Integração         | ⏳ Roadmap         | 0%             | P5             |

**Legenda:**

- ✅ Completo e testado
- 🔄 Em desenvolvimento ativo
- ⏳ Planejado, não iniciado
- **P0** = Crítico (1-2 semanas)
- **P1** = Alta (mês 1)
- **P2** = Média (mês 2)
- **P3** = Baixa (mês 3+)

---

## 👥 Arquitetura Multi-Usuário

### Conceito de Trabalho Colaborativo

**Cenário:** Pequena empresa com 3-10 funcionários usando o mesmo sistema

### Abordagens Possíveis

#### **Opção A: Compartilhamento de Arquivo (Atual)**

**Como funciona:**

- Arquivo CRM.html + `dados/clientes_crm_v2.json` em pasta compartilhada (rede local ou Dropbox)
- Cada usuário abre o CRM no navegador
- LocalStorage individual + sincronização manual via "Exportar/Importar"

**Prós:**

- ✅ Simples de implementar (já funciona)
- ✅ Não precisa servidor
- ✅ Dados centralizados em um JSON

**Contras:**

- ❌ Risco de conflitos (2 pessoas editando ao mesmo tempo)
- ❌ Usuário precisa "Recarregar dados" manualmente
- ❌ Sem controle de permissões

#### **Opção B: Sincronização Automática (Planejado)**

**Como funciona:**

- Polling a cada 30s: `fetch('dados/clientes_crm_v2.json')` verifica timestamp
- Se JSON mudou → recarrega dados automaticamente
- Lock de edição: Quando usuário abre ficha, "trava" registro com flag `editadoPor`

**Prós:**

- ✅ Sincronização em tempo quase-real
- ✅ Previne conflitos
- ✅ Experiência fluida

**Contras:**

- ❌ Precisa pasta compartilhada (rede local ou nuvem)
- ❌ Complexidade moderada

#### **Opção C: Servidor Local SQLite (Futuro)**

**Como funciona:**

- Python Flask + SQLite rodando em PC "servidor" da empresa
- Clientes (outros PCs) acessam via `http://192.168.1.100:5000`
- Banco de dados centralizado com controle de concorrência

**Prós:**

- ✅ Multi-usuário real
- ✅ Controle de permissões (admin vs vendedor)
- ✅ Auditoria completa (quem alterou o quê)

**Contras:**

- ❌ Precisa configurar "servidor" (PC sempre ligado)
- ❌ Quebra filosofia "100% no navegador"

### Decisão de Implementação (Proposta)

**Para v3.0 (White Label):**

- ✅ **Opção B** (Sincronização Automática)
- Pasta compartilhada: `\\servidor\crm\` ou `Dropbox\TitanCRM\`
- Lock de edição com timeout (5min sem atividade = libera)
- Notificação visual: "Dados atualizados por [Usuário]"

**Estrutura Técnica:**

```javascript
// Sincronização automática
setInterval(async () => {
  const response = await fetch("dados/clientes_crm_v2.json");
  const data = await response.json();

  if (data.timestampModificacao > ultimaAtualizacao) {
    // Dados mudaram → recarregar
    mostrarNotificacao("📥 Dados atualizados por " + data.ultimoEditor);
    carregarDados();
  }
}, 30000); // 30 segundos

// Lock de edição
function abrirCliente(id) {
  clientes[id].editadoPor = usuarioLogado;
  clientes[id].editadoEm = new Date().toISOString();
  salvarDados();
}

function fecharCliente(id) {
  delete clientes[id].editadoPor;
  salvarDados();
}
```

---

## 🗺️ Roadmap Detalhado

### **Fase 1: CRM White Label** (Jan-Fev 2026)

**Objetivo:** Finalizar módulo CRM para comercialização

| **Sprint**   | **Semana**   | **Entregas**                                | **Horas Est.** |
| ------------ | ------------ | ------------------------------------------- | -------------- |
| **Sprint 1** | 15-21 Jan    | Tags de captação configuráveis              | 12h            |
|              |              | Migração IDs (clientes importados)          | 6h             |
|              |              | Sistema de importação Excel (MVP)           | 15h            |
| **Sprint 2** | 22-28 Jan    | Interface white label (logo, cores, fontes) | 20h            |
|              |              | Criptografia AES-256 (CryptoJS)             | 10h            |
|              |              | Testes de penetração de dados               | 8h             |
| **Sprint 3** | 29 Jan-4 Fev | Relatórios PDF (jsPDF)                      | 18h            |
|              |              | Sistema de backup automático                | 6h             |
|              |              | Documentação completa usuário final         | 10h            |
| **Sprint 4** | 5-11 Fev     | Testes com usuários beta                    | 15h            |
|              |              | Correções de bugs                           | 10h            |
|              |              | Preparação para lançamento (Kiwify)         | 8h             |

**Entrega:** TitanCRM v3.0 (Comercializável)

---

### **Fase 2: TitanPDV** (Mar-Abr 2026)

| **Feature**                             | **Complexidade** | **Horas Est.** |
| --------------------------------------- | ---------------- | -------------- |
| Controle de caixa (abertura/fechamento) | Média            | 15h            |
| Contas a pagar/receber (CRUD)           | Alta             | 20h            |
| PDV simplificado (vendas rápidas)       | Baixa            | 10h            |
| Emissão de orçamentos PDF               | Média            | 12h            |
| Fluxo de caixa (gráficos)               | Baixa            | 8h             |
| Integração básica com CRM               | Alta             | 18h            |
| Testes e documentação                   | -                | 15h            |

**Total Estimado:** 98h (~3 semanas)

---

### **Fase 3: TitanStock** (Mai-Jun 2026)

| **Feature**                           | **Complexidade** | **Horas Est.** |
| ------------------------------------- | ---------------- | -------------- |
| CRUD de produtos                      | Baixa            | 10h            |
| Controle de movimentações             | Média            | 15h            |
| Alertas de estoque mínimo             | Baixa            | 6h             |
| Multi-locais (depósitos)              | Alta             | 20h            |
| Inventário físico                     | Média            | 12h            |
| Integração com PDV (baixa automática) | Alta             | 18h            |
| Relatórios (curva ABC, giro)          | Média            | 14h            |
| Testes e documentação                 | -                | 15h            |

**Total Estimado:** 110h (~4 semanas)

---

### **Fase 4: Complete 3-em-1** (Jul-Ago 2026)

| **Feature**                    | **Complexidade** | **Horas Est.** |
| ------------------------------ | ---------------- | -------------- |
| Dashboard unificado            | Alta             | 25h            |
| Sincronização CRM→PDV→Stock    | Muito Alta       | 40h            |
| Relatórios cruzados            | Média            | 18h            |
| Automações inteligentes        | Alta             | 30h            |
| Testes de integração completos | -                | 25h            |
| Documentação técnica + usuário | -                | 20h            |

**Total Estimado:** 158h (~5 semanas)

---

## 📁 Estrutura do Projeto

### Organização Atual (v2.2)

```
TitanCRM/
├── CRM.html                          ⭐ Sistema principal (165KB)
├── README_TECNICO.md                 📖 Este documento
├── DOCUMENTACAO_MESTRE.md            📜 Regras e governança
├── Iniciar_CRM.bat                   ▶️ Launcher Windows
│
├── assets/                           🎨 Recursos estáticos
│   ├── css/
│   │   └── main.css                  (inline no HTML atual)
│   ├── js/
│   │   ├── crypto-js.min.js         (180KB)
│   │   └── chart.min.js             (245KB)
│   ├── fonts/
│   │   ├── Inter.woff2
│   │   ├── Poppins.woff2
│   │   └── Roboto.woff2
│   └── img/
│       └── default-logo.png
│
├── dados/                            🔒 Banco de dados
│   ├── clientes_crm_v2.json         BASE ATIVA
│   └── relatorios/                   Outputs do scraper
│
├── scripts/                          🐍 Automação Python
│   ├── scraper_guia_automatico.py   Web scraping
│   └── importar_excel.py            (planejado)
│
├── exports/                          💾 Backups
│   └── CRM_BACKUP_*.html
│
└── docs/                             📚 Documentação
    ├── manual_usuario.md
    └── guia_desenvolvendor.md
```

### Estrutura Planejada (v3.0 Complete)

```
TitanFusion/
├── index.html                        🏠 Launcher principal
├── config.json                       ⚙️ Configuração white label
│
├── modules/                          📦 Módulos independentes
│   ├── crm/
│   │   └── crm.html
│   ├── pdv/
│   │   └── pdv.html
│   └── stock/
│       └── stock.html
│
├── shared/                           🔗 Recursos compartilhados
│   ├── core.js                       Funções comuns
│   ├── storage.js                    Abstração localStorage
│   └── theme.js                      Sistema de temas
│
├── data/                             💾 Dados centralizados
│   ├── clientes.json
│   ├── vendas.json
│   ├── produtos.json
│   ├── movimentacoes.json
│   └── logs.json                     Auditoria
│
└── plugins/                          🔌 Extensões
    ├── whatsapp/                     (futuro)
    └── pdf-generator/                (jsPDF wrapper)
```

---

## 🛡️ Regras de Desenvolvimento

### Golden Rules (do DOCUMENTACAO_MESTRE.md)

1. **Dados do Usuário são Sagrados**
   - ❌ NUNCA modificar estrutura JSON sem migração
   - ✅ SEMPRE criar backup antes de editar

2. **Compatibilidade Offline Obrigatória**
   - ❌ NUNCA usar CDN em produção
   - ✅ SEMPRE incluir assets localmente

3. **Consulta Prévia para Mudanças Estruturais**
   - ❌ NUNCA refatorar sem perguntar ao usuário
   - ✅ SEMPRE documentar impacto antes de implementar

4. **Performance Garantida**
   - ✅ Sistema deve ser fluido até 10.000 registros
   - ✅ Busca instantânea (< 300ms)
   - ✅ Carregamento inicial < 2s

---

## 💼 Modelo de Negócio

### Precificação Estratégica

| **Concorrente** | **Modelo**  | **Custo Anual** | **Limitações**                   |
| --------------- | ----------- | --------------- | -------------------------------- |
| RD Station CRM  | Mensalidade | R$ 1.188/ano    | Precisa internet, dados na nuvem |
| Pipedrive       | Mensalidade | R$ 1.800/ano    | SaaS, limite de usuários         |
| Bling ERP       | Mensalidade | R$ 720/ano      | Focado e-commerce                |
| **TitanFusion** | **Único**   | **R$ 99,99**    | **Offline, ilimitado**           |

**ROI para cliente:** Economia de R$ 600-1.700/ano

### Estratégia de Lançamento

**Canais:**

- 🛒 Kiwify (checkout + entrega digital)
- 🎓 Hotmart (marketplace + afiliados)
- 📦 Eduzz (alternativa)

**Funil de Vendas:**

1. **Isca Digital:** Planilha grátis de controle de clientes
2. **Tripwire:** TitanCRM (R$ 39,99)
3. **Core Offer:** TitanFusion Complete (R$ 99,99)
4. **Upsell:** Consultoria de implementação (R$ 197)

---

## 📞 Suporte e Contribuição

**Desenvolvedor:**  
Lucas Valério  
📧 [email]  
💻 [GitHub](https://github.com/LucassVal)

**Status do Projeto:** Ativo | Produção (CRM)  
**Licença:** Proprietário | White Label permitido  
**Última Atualização:** 17 Janeiro 2026

---

**Versão Documento:** 1.0 (Consolidado Técnico)  
**Baseado em:** DOCUMENTACAO_MESTRE.md v2.0
