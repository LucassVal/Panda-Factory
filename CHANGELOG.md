# Changelog - TitanGestão CRM

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Unreleased] - 2026-01-19

### ✨ Adicionado (Features)

- **Módulo White Label:** Nova aba "Personalização" nas configurações. Permite alterar:
  - Nome do Sistema.
  - URL da Logo.
  - Cor Principal (Tema Dinâmico).
  - Fonte do Sistema.
- **Campos Customizados:** Sistema agora suporta a criação de novos campos dinâmicos (Texto, Data, Seleção) que são exibidos automaticamente no formulário de "Novo Cliente".
- **Acesso Remoto Fácil:** Exibição do IP local na aba de Usuários para facilitar o acesso via celular.
- **Automação de Inicialização:** Criado arquivo `INICIAR_SISTEMA.bat` para iniciar servidor e navegador com um clique.
- **Importação Manual:** Botões explícitos para importar "Dados de Seed" ou "Dados do Scraper" nas configurações.

### 🛠️ Corrigido (Fixes)

- **Scraper "Alucinação":** Corrigida lógica de parsing HTML que confundia botões de menu ("Sair", "Menu") com nomes de clientes quando a navegação falhava.
- **Scraper Validação:** Adicionada verificação rigorosa antes de salvar o HTML do relatório (busca por keywords "Metragem", "Cidade").
- **Layout de Configurações:** Corrigido bug visual que quebrava as abas e escondia conteúdo.
- **Botões Travados:** Corrigido erro de sintaxe (`async/await`) na função `salvarNovoCliente` que impedia o cadastro.

### 🔒 Segurança

- **Separação de Dados:** Scraper agora salva em `clientes_import_scraper.json` para não sobrescrever dados do sistema.
- **Proteção de Reset:** Ações destrutivas (Limpar Clientes, Factory Reset) agora exigem senha de Admin.
