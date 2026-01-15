# 🏢 CRM - Sistema de Gerenciamento de Clientes

Sistema completo de gestão de clientes com importação automatizada do Guia da Construção.

## 📂 Estrutura do Projeto

```
CRM/
├── index.html                      ← ABRIR ESTE ARQUIVO (Sistema CRM)
├── dados/                          ← Banco de dados e relatórios
│   ├── clientes_crm_v2.json       ← Banco principal (auto-save)
│   ├── clientes_crm.json          ← Backup antigo
│   └── relatorios/                ← Relatórios gerados pelo scraper
├── scripts/                        ← Scripts Python
│   ├── scraper_guia_automatico.py ← Scraper principal ⭐
│   ├── importar_guia_construcao.py
│   ├── extrair_clientes.py
│   └── organize_relatorio.py
├── exports/                        ← Exportações do CRM (CSV, JSON)
└── docs/                           ← Documentação
```

## 🚀 Como Usar

### 1️⃣ Abrir o CRM

Abra o arquivo **`index.html`** no navegador (Chrome/Edge).

### 2️⃣ Importar Clientes Automaticamente

```powershell
# Abrir PowerShell
cd "C:\Users\Lucas Valério\Desktop\CRM\scripts"

# Executar scraper
python scraper_guia_automatico.py

# Aguardar 2-5 minutos
# Arquivos serão salvos em ../dados/
```

### 3️⃣ Importar no CRM

1. No CRM, clique **"🤖 Importar Automático"**
2. Sistema busca automaticamente o arquivo mais recente em `dados/`
3. Merge seguro - não sobrescreve dados existentes

## ✨ Funcionalidades

### Gerenciamento de Clientes

- ➕ Cadastro manual com 6 fontes de captação
- ✏️ Editar clientes (mantém ID e histórico)
- 🗑️ Deletar clientes (confirmação dupla)
- 📊 5 status com cores e motivos obrigatórios
- 📝 Anotações ilimitadas
- 📞 Retornos agendados

### Importação de Dados

- 🤖 Scraper automático do Guia da Construção
- 📁 Upload manual de HTML
- 🔄 Merge inteligente (anti-duplicação)

### Visualização

- 📊 3 Gráficos dinâmicos (Chart.js)
- 🎨 Cards coloridos por status
- 🔍 Filtros e busca em tempo real
- 📈 Estatísticas no topo

## 🔧 Configuração do Scraper

Editar `scripts/scraper_guia_automatico.py`:

```python
USERNAME = "Signore"           # Seu usuário
PASSWORD = "Sig2025$"          # Sua senha

# Filtros
M2_INICIAL = 150
M2_FINAL = 300
ESTAGIO = "Acabamento"
```

## 📱 Próximos Passos

**Automação WhatsApp** - Em planejamento

- Campanhas por status
- Templates personalizáveis
- Exportação para envio
- Integração futura com API

Veja: `docs/whatsapp_automation_plan.md`

## 💾 Backup e Exportação

### LocalStorage

Dados salvos automaticamente no navegador.

### Exportação Manual

Botão **"💾 Exportar Dados"** → salva em `exports/`

### Backup Recomendado

```powershell
# Copiar pasta dados/ periodicamente
Copy-Item "dados" "dados_backup_$(Get-Date -Format 'yyyyMMdd')" -Recurse
```

## 🐛 Solução de Problemas

### Scraper não funciona?

```powershell
# Verificar Playwright
pip list | findstr playwright

# Reinstalar se necessário
pip install playwright
python -m playwright install chromium
```

### Credenciais mudaram?

Editar `scripts/scraper_guia_automatico.py` linhas 23-24.

### CRM não carrega dados?

1. Verificar se `dados/clientes_crm_v2.json` existe
2. Abrir Console do navegador (F12) e verificar erros
3. Limpar cache: Ctrl + F5

## 📊 Fontes de Captação

| Código   | Descrição              |
| -------- | ---------------------- |
| GC       | Guia da Construção     |
| APPARATO | Marcenaria Apparato    |
| APTTA    | Marcenaria Aptta       |
| SIGNORE  | Showroom Signore       |
| GOOGLE   | Google Ads             |
| META     | Facebook/Instagram Ads |

## 📞 Suporte

Sistema desenvolvido para Signore Marcenaria.

**Versão:** 2.2
**Última atualização:** Janeiro 2026

---

**Desenvolvido com ❤️ para otimizar sua gestão de prospects!**
