# 📦 Scripts Python - CRM

Scripts para automação de importação de dados do Guia da Construção.

## 📁 Arquivos

### `scraper_guia_automatico.py` ⭐ (PRINCIPAL)

Scraper completo que:

- Faz login automático no Guia da Construção
- Aplica filtros (M², Estágio, Regiões)
- Extrai dados dos clientes
- Salva HTML, screenshot e JSON
- **Uso:** `python scraper_guia_automatico.py`

### `importar_guia_construcao.py`

Parser de HTML do Guia da Construção:

- Lê arquivo HTML salvo manualmente
- Extrai dados estruturados
- Gera JSON compatível com CRM

### `extrair_clientes.py`

Utilitário legado para extração de dados.

### `organize_relatorio.py`

Organiza e processa relatórios HTML.

## ⚙️ Configuração

### Instalar Dependências

```powershell
pip install playwright
python -m playwright install chromium
```

### Personalizar Filtros

Editar `scraper_guia_automatico.py`:

```python
# Credenciais
USERNAME = "seu_usuario"
PASSWORD = "sua_senha"

# Filtros de busca
M2_INICIAL = 150
M2_FINAL = 300
ESTAGIO = "Acabamento"  # ou "Estrutura", "Fundacao", etc.
```

## 🚀 Execução

### Via PowerShell

```powershell
cd "C:\Users\Lucas Valério\Desktop\CRM\scripts"
python scraper_guia_automatico.py
```

### Saída Esperada

```
Arquivos salvos:
- ../dados/guia_construcao_relatorio_YYYYMMDD.html
- ../dados/guia_construcao_screenshot_YYYYMMDD.png
- ../dados/clientes_crm_v2_YYYYMMDD.json
```

## 📂 Estrutura de Saída

Arquivos salvos em `../dados/`:

- **JSON**: Dados estruturados para o CRM
- **HTML**: Backup do relatório completo
- **PNG**: Screenshot para conferência visual

## 🔧 Troubleshooting

### Erro: Playwright não instalado

```powershell
pip install playwright
python -m playwright install chromium
```

### Erro: Login falhou

- Verificar credenciais no código
- Site pode ter mudado estrutura
- Verificar se sua conta está ativa

### Erro: Sem dados extraídos

- Filtros muito restritivos (nenhum resultado)
- Alterar M2_INICIAL, M2_FINAL ou ESTAGIO

## ⏱️ Tempo de Execução

- Login: ~5-10 segundos
- Aplicar filtros: ~5 segundos
- Extração de dados: ~30-60 segundos
- **Total:** 2-5 minutos

## 📊 Formato JSON Gerado

```json
[
  {
    "id": "123456",
    "nome": "Nome da Construtora",
    "cidade": "São Paulo/SP",
    "fonte": "GC",
    "telefones": ["(11) 99999-9999"],
    "metragem": "250",
    "endereco": "Rua Exemplo, 123",
    "bairro": "Centro",
    "estagio": "Acabamento",
    "status": "nao_acompanhando",
    "anotacoes": [],
    "retornos": []
  }
]
```

---

**⚠️ IMPORTANTE:**

- Não compartilhar credenciais
- Executar apenas 1x por dia (evitar sobrecarga no site)
- Sempre fazer backup dos dados antes de rodar
