# 🔒 CRM - DOCUMENTAÇÃO MESTRE DO PROJETO

> **Este é o documento ÚNICO e DEFINITIVO do projeto. Toda alteração deve consultar este arquivo primeiro.**

---

## 🚨 PARTE 1: REGRAS DE OURO (GOVERNANÇA)

### 📜 PRINCÍPIOS FUNDAMENTAIS

#### REGRA ABSOLUTA #1: Consulta Obrigatória

**Antes de QUALQUER alteração no código, o agente AI DEVE:**

1. ✅ **Consultar** este documento completo
2. ✅ **Verificar** se a mudança está alinhada com a arquitetura documentada
3. ✅ **Validar** com o usuário ANTES de implementar mudanças estruturais

**PROIBIDO (Zona Vermelha):**

- ❌ Fazer mudanças estruturais sem consulta prévia
- ❌ Ignorar a arquitetura documentada
- ❌ Remover funcionalidades existentes sem autorização explícita
- ❌ Alterar comportamento de features sem discussão com usuário

---

### 🚫 O QUE NUNCA FAZER (ZONA CRÍTICA)

#### 1. Dados do Usuário (INTOCÁVEL)

- ❌ **NUNCA** modificar a estrutura do JSON sem backup
- ❌ **NUNCA** apagar campos existentes do banco de dados
- ❌ **NUNCA** remover o sistema de salvamento automático
- ❌ **NUNCA** alterar IDs de clientes existentes

#### 2. Funcionalidades Core (PROTEGIDAS)

- ❌ **NUNCA** quebrar o sistema de importação automática
- ❌ **NUNCA** remover ou renomear IDs de elementos HTML sem verificar dependências JS
- ❌ **NUNCA** alterar a estrutura de `localStorage` sem migração de dados
- ❌ **NUNCA** quebrar compatibilidade com dados salvos

#### 3. Compatibilidade (OBRIGATÓRIA)

- ❌ **NUNCA** usar bibliotecas externas via CDN (deve ser offline)
- ❌ **NUNCA** adicionar dependências que exijam internet
- ❌ **NUNCA** quebrar compatibilidade com Chrome/Edge

---

### ✅ FLUXO OBRIGATÓRIO PARA MUDANÇAS

```
┌─────────────────────┐
│ Usuário solicita    │
│ mudança             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 1. Consultar        │
│    este documento   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Verificar        │
│    impacto global   │
└──────────┬──────────┘
           │
           ▼
      ┌─────────┐
      │Mudança  │
      │estrutu- │◄─── SIM ──┐
      │ral ou   │            │
      │afeta    │            │
      │dados?   │            │
      └────┬────┘            │
           │                 │
          NÃO         ┌──────────────┐
           │          │ PARAR e      │
           ▼          │ PERGUNTAR ao │
    ┌──────────┐     │ usuário      │
    │Implemen- │     └──────┬───────┘
    │tar com   │            │
    │documen-  │            │
    │tação     │◄───────────┘
    └────┬─────┘  Após aprovação
         │
         ▼
    [CONCLUÍDO]
```

#### Checklist Pré-Implementação

Antes de qualquer código, pergunte a si mesmo:

- [ ] Li a documentação completa?
- [ ] Entendi o impacto da mudança?
- [ ] Verifiquei se afeta dados do usuário?
- [ ] Esta mudança é reversível?
- [ ] Preciso perguntar ao usuário primeiro?
- [ ] Documentei a mudança planejada?
- [ ] **🔴 CRIEI BACKUP ANTES DE EDITAR?** ← OBRIGATÓRIO!

---

### 🔐 REGRA DE BACKUP OBRIGATÓRIO (NOVA - 2026-01-15)

> **⚠️ REGRA CRÍTICA**: NUNCA edite CRM.html sem backup primeiro!

#### Comando de Backup (PowerShell)

**ANTES DE QUALQUER EDIÇÃO**, execute:

```powershell
Copy-Item "C:\Users\Lucas Valério\Desktop\CRM\CRM.html" `
          "C:\Users\Lucas Valério\Desktop\CRM\exports\CRM_BACKUP_$(Get-Date -Format 'yyyyMMdd_HHmmss').html"
```

#### Checklist Pré-Edição OBRIGATÓRIO

```
┌─────────────────────────────────┐
│  ANTES DE EDITAR CRM.html       │
├─────────────────────────────────┤
│ [ ] Backup criado em exports/   │
│ [ ] Nome: CRM_BACKUP_YYYYMMDD   │
│ [ ] Tamanho verificado (~185KB) │
│ [ ] Arquivo abre no navegador   │
└─────────────────────────────────┘
```

#### Por Que Isso é CRÍTICO

**2026-01-15**: Perdemos 4 funções críticas:

1. [formatarTelefone()](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/CRM.html#2052-2072) - Formatação (xx) xxxxx-xxxx
2. [aplicarFiltrosBotao()](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/CRM.html#2606-2624) - Botão ✓ de filtros
3. [abrirConfig()](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/CRM.html#4635-4650) - Modal de configurações
4. Templates WhatsApp - Sistema completo

**SEM BACKUP** = Reimplementar tudo do zero (25+ minutos perdidos)

#### Script de Backup Automático (Futuro)

Criar `backup_auto.bat`:

```batch
@echo off
set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
copy "CRM.html" "exports\CRM_BACKUP_%TIMESTAMP%.html"
echo ✅ Backup criado: CRM_BACKUP_%TIMESTAMP%.html
pause
```

---

### 📊 SISTEMA DE CLASSIFICAÇÃO DE RISCO

| Nível          | Descrição                              | Exemplos                                            | Ação Obrigatória                 |
| -------------- | -------------------------------------- | --------------------------------------------------- | -------------------------------- |
| 🟢 **BAIXO**   | Mudanças visuais sem impacto funcional | CSS, cores, espaçamentos, typos                     | Implementar direto               |
| 🟡 **MÉDIO**   | Nova funcionalidade ou UI              | Novo botão, novo filtro, nova modal                 | Explicar antes de fazer          |
| 🟠 **ALTO**    | Modificação estrutural                 | Refatorar JS, mudar estrutura de dados, novo módulo | **PERGUNTAR OBRIGATORIAMENTE**   |
| 🔴 **CRÍTICO** | Risco de perda de dados                | Mudar salvamento, deletar features, migração de DB  | **APROVAÇÃO EXPLÍCITA + BACKUP** |

---

### 🛡️ ÁREAS INTOCÁVEIS (SEM AUTORIZAÇÃO)

#### 1. Sistema de Dados

```javascript
// ZONA CRÍTICA - NÃO TOCAR
function salvarDados() {
  /* ... */
}
function carregarDados() {
  /* ... */
}
localStorage.setItem("clientesCRM" /* ... */);
localStorage.setItem("crmDados_v2" /* ... */);
```

#### 2. Importação Automática

```javascript
// CORE FEATURE - PROTEGIDA
function importarAutomatico() {
  /* ... */
}
function ativarImportacaoAutomatica() {
  /* ... */
}
```

#### 3. IDs de Elementos Críticos

```html
<!-- NÃO RENOMEAR SEM MAPEAR DEPENDÊNCIAS -->
<div id="clientsGrid"></div>
<div id="clientModal"></div>
<canvas id="statusChart"></canvas>
<div id="inicio-view"></div>
<div id="contatos-view"></div>
```

---

### 🤝 COMUNICAÇÃO COM O USUÁRIO

#### Quando Perguntar ANTES de Implementar

1. **Mudanças de Comportamento**: "Isso vai mudar como [feature] funciona. Posso prosseguir?"
2. **Refatorações Grandes**: "Vou reorganizar [módulo]. Deseja revisar o plano primeiro?"
3. **Remoção de Features**: "Esta mudança remove [funcionalidade]. Confirma?"
4. **Risco de Dados**: "Esta operação pode afetar dados salvos. Fazer backup primeiro?"

#### Modelo de Notificação Obrigatória

```
⚠️ ATENÇÃO: Mudança de Risco [NÍVEL]

**O que vou fazer:**
[Descrição clara e objetiva]

**Impacto:**
- [Lista de efeitos colaterais]
- [Arquivos/funções afetadas]

**Alternativas:**
1. [Opção A - recomendada]
2. [Opção B]

**Recomendação:** [Sua sugestão técnica]

Posso prosseguir? (Aguardando confirmação explícita)
```

---

## 📚 PARTE 2: ENCICLOPÉDIA DO PROJETO

### 🎯 1. Visão do Produto

#### Conceito Core

Sistema de gestão empresarial (ERP/CRM) que roda **100% offline no navegador**, sem servidor, sem mensalidades e com foco total em privacidade e portabilidade.

**Slogan:** _"Leve sua empresa no bolso. Sem mensalidades, sem nuvem, 100% seguro."_

#### Público-Alvo

- Pequenos empreendedores
- Autônomos e vendedores
- Profissionais que valorizam privacidade de dados
- Signore Marcenaria (cliente atual)

#### Diferenciais Competitivos

1. **Portabilidade Absoluta**: Roda em Pen Drive, não precisa instalar
2. **Privacidade Total**: Dados criptografados (planejado), sem envio para nuvem
3. **Sem Mensalidade**: Pagamento único vitalício
4. **Whitelabel**: Totalmente personalizável (planejado)

---

### 🏗️ 2. Arquitetura Técnica

#### Stack Atual (**v2.2 - PRODUÇÃO ATIVA**)

| Componente            | Tecnologia                  | Status         | Localização                                                                                                                        |
| --------------------- | --------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Sistema Principal** | Single HTML File (SPA)      | ✅ ATIVO       | [CRM.html](file:///c:/Users/Lucas%20Valério/Desktop/CRM/CRM.html) (165 KB)                                                         |
| **Banco de Dados**    | localStorage + JSON local   | ✅ Funcional   | [dados/clientes_crm_v2.json](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/dados/clientes_crm_v2.json)                         |
| **Gráficos**          | Chart.js (CDN)              | ✅ Ativo       | Inline no HTML                                                                                                                     |
| **UI Framework**      | Custom CSS (Gradientes)     | ✅ Premium     | Inline no HTML                                                                                                                     |
| **Scraper**           | Python + Playwright         | ✅ Operacional | [scripts/scraper_guia_automatico.py](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/scripts/scraper_guia_automatico.py) (23 KB) |
| **Importação**        | HTML Parser (BeautifulSoup) | ✅ Funcional   | [scripts/importar_guia_construcao.py](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/scripts/importar_guia_construcao.py)       |

#### Estrutura Real do Projeto

```
C:/Users/Lucas Valério/Desktop/CRM/
│
├── CRM.html                          ← ⭐ Sistema completo (165 KB)
├── README.md                         ← Documentação técnica
├── LEIA-ME.txt                       ← Guia rápido do usuário
├── Iniciar_CRM.bat                   ← Atalho de inicialização
├── Importar_Clientes.bat             ← Atalho do scraper
├── crm_icon.png                      ← Ícone da aplicação (432 KB)
├── import_icon.png                   ← Ícone de importação (468 KB)
│
├── dados/                            ← 🔒 BANCO DE DADOS (CRÍTICO)
│   ├── clientes_crm_v2.json         ← BASE PRINCIPAL (backup diário recomendado)
│   ├── clientes_crm.json            ← Backup antigo
│   └── relatorios/                  ← Relatórios do scraper
│       ├── guia_construcao_relatorio_*.html
│       └── guia_construcao_screenshot_*.png
│
├── scripts/                          ← Automação Python
│   ├── scraper_guia_automatico.py   ← ⭐ Scraper principal (23 KB)
│   ├── importar_guia_construcao.py  ← Parser de HTML
│   ├── extrair_clientes.py          ← Extrator de dados
│   ├── organize_relatorio.py        ← Organizador de relatórios
│   └── README.md                    ← Doc dos scripts
│
├── exports/                          ← Exportações do CRM
│   └── crm-export-*.json            ← Backups manuais
│
└── docs/                             ← Documentação
    ├── manual_completo.md           ← Manual de uso completo (428 linhas)
    └── whatsapp_automation_plan.md  ← Plano de automação WhatsApp (411 linhas)
```

---

### ⚙️ 3. Funcionalidades Implementadas (v2.2)

#### ✅ Módulos Ativos

##### 📊 Dashboard & Relatórios ([inicio-view](file:///c:/Users/Lucas%20Valério/Desktop/CRM/CRM.html#L918))

- **Visão Geral**: Cards de KPI (Total Prospects, Fechados, Perdidos)
- **Gráficos Visuais** (Chart.js):
  - Status dos Clientes (Donut Chart)
  - Valor por Status (Bar Chart)
  - Prospects vs Acompanhamento (Doughnut)
- **Performance por Vendedor**: Tabela dinâmica
- **Filtro de Período**: Últimos 7 dias, Este Mês, Este Ano

##### 👥 CRM & Gestão de Clientes ([contatos-view](file:///c:/Users/Lucas%20Valério/Desktop/CRM/CRM.html#L965))

- **3 Formas de Cadastro**:

  1. Manual (botão "+ Novo Cliente")
  2. Scraper Automático (Python + Playwright)
  3. Upload HTML (importação manual)

- **6 Fontes de Captação**:

  - `GC` - Guia da Construção
  - `APPARATO` - Marcenaria Apparato
  - `APTTA` - Marcenaria Aptta
  - `SIGNORE` - Showroom Signore
  - `GOOGLE` - Google Ads
  - `META` - Facebook/Instagram Ads

- **Filtros Avançados** (2 linhas):

  - **Linha 1**: Busca, Status, Cidade, Bairro, Min/Max m², Ações
  - **Linha 2**: Meus Clientes, Novos (Hoje), Atrasados, Ordenação (Nome, Bairro, Cidade, M²)

- **Visualizações**:
  - Lista de Cards (padrão)
  - Kanban Board (arrastar colunas)

##### 📅 Agenda

- **Calendário Mensal**: Navegação por mês/ano
- **Agendamentos Clicáveis**: Cada item abre a ficha do cliente
- **Day Drawer**: Painel superior com detalhes do dia selecionado

##### 🔐 Sistema de Login

- **Autenticação Local**: Sem conexão com servidor
- **Níveis de Acesso**: Admin, Vendedor
- **Sessão Persistente**: sessionStorage

##### 🎨 Ficha Unificada do Cliente

- **Tab "Atendimento"**: Status + Timeline + Ações Rápidas
- **Tab "Dados Cadastrais"**: Formulário de edição
- **Histórico Unificado**: Notas + Agendamentos + Mudanças de Status

---

### 🔴 Funcionalidades Pendentes (Roadmap)

#### Alta Prioridade (Semana 1-2)

- [ ] **Criptografia de Dados** (CRÍTICO)
  - Implementar CryptoJS para arquivo `.dat`
  - Senha mestre ao salvar/carregar

#### Média Prioridade (Semana 3-4)

- [ ] **Geração de PDF**
  - Orçamentos personalizados com logo
  - Recibos de venda
- [ ] **Whitelabel Completo**
  - Upload de logo (salvar como Base64)
  - Customização de cores via CSS Variables

#### Baixa Prioridade (Mês 2)

- [ ] **PWA (Progressive Web App)**
  - `manifest.json` para "Instalar Aplicativo"
  - Service Worker para cache offline
- [ ] **Modo Escuro**
- [ ] **Exportação Excel** (SheetJS)

---

### 💼 4. Estratégia Comercial (Futuro)

#### Modelo de Negócio

- **Preço**: R$ 69,99 (BR) / US$ 15.00 (INT)
- **Licença**: Vitalícia (compra única)
- **Comissão Afiliados**: 60%

#### Funil de Vendas

1. Venda Principal: CRM Completo
2. Order Bump: "50 Scripts de Venda Prontos" (+R$ 14,90)
3. Upsell: "Módulo Cardápio Digital" (+R$ 29,90)

---

### 🎓 5. Documentação e Recursos

#### Arquivos de Documentação

- [README.md](file:///C:/Users/Lucas%20Valério/Desktop/CRM/README.md) - Setup e troubleshooting
- [LEIA-ME.txt](file:///C:/Users/Lucas%20Valério/Desktop/CRM/LEIA-ME.txt) - Guia rápido
- [docs/manual_completo.md](file:///C:/Users/Lucas%20Valério/Desktop/CRM/docs/manual_completo.md) - Manual detalhado
- [docs/whatsapp_automation_plan.md](file:///C:/Users/Lucas%20Valério/Desktop/CRM/docs/whatsapp_automation_plan.md) - Plano WhatsApp

#### Recursos Externos Recomendados

- [CryptoJS Docs](https://cryptojs.gitbook.io/docs/)
- [jsPDF Documentation](https://artskydj.github.io/jsPDF/docs/)
- [Chart.js Guide](https://www.chartjs.org/docs/latest/)

---

## 📝 PARTE 3: HISTÓRICO DE MUDANÇAS

### Versão 2.2 (Atual - Janeiro 2026)

**Principais Implementações:**

- ✅ Navegação com 4 ícones (Início, Contatos, Agenda, Relatórios)
- ✅ Separação de views: Início (gráficos) vs Contatos (lista)
- ✅ Filtros reorganizados em 2 linhas
- ✅ Filtros rápidos funcionais
- ✅ Ficha unificada do cliente (2 tabs)
- ✅ Agenda com drawer superior
- ✅ Sistema de ordenação (Nome, Cidade, Bairro, M²)

**Correções Críticas:**

- 🐛 Corrigido erro de sintaxe JS que quebrava botões
- 🐛 Adicionadas funções [filtroRapido()](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/CRM.html#3677-3701) e [limparFiltrosRapidos()](file:///c:/Users/Lucas%20Val%C3%A9rio/Desktop/CRM/CRM.html#3730-3740)
- 🐛 Corrigido sistema de navegação com estados ativos

---

## 🎯 MANTRA DO PROJETO

> **"Primeiro, não causar dano. Segundo, sempre perguntar. Terceiro, documentar tudo."**

---

**Versão do Documento:** 2.0 (Consolidado)  
**Data de Atualização:** 2026-01-15  
**Status:** ATIVO E OBRIGATÓRIO

**Este documento é a fonte única da verdade. Consulte SEMPRE antes de qualquer alteração.**
