# Changelog

Todas as alterações notáveis do Panda CRM serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [2.3.0] - 2026-01-20

### 🎨 Adicionado

- **Design System Vercel/Geist**: Tokens CSS completos extraídos de vercel.com
- **Dock Arrastável**: Barra de navegação pode ser movida para qualquer posição da tela
- **Memória de Posição**: Dock salva posição em localStorage (double-click para resetar)
- **Tooltips Animados**: Indicadores no hover dos ícones do dock
- **Panda SDK v1.0.0**: Kit de desenvolvimento com 6 módulos (Database, AI, Wallet, UI, Agent, Utils)
- **Panda Agent Docs**: Documentação do WebSocket Bridge no README
- **SDK Roadmap**: Fases 1-3 documentadas (CLI → Templates → Low Code)

### 🔧 Corrigido

- **Bug Crítico**: Tag `<script>` não fechada causava CSS renderizado como texto
- **Duplicações Header**: Removidos botões Config/Sair duplicados do header
- **Estrutura HTML**: Consolidação de estilos e verificação de tags

### 🎨 Alterado

- **Paleta de Cores**: Atualizada para padrão Vercel dark mode
- **Design Tokens**: Novos tokens `--ds-*` para backgrounds, grays, borders, shadows
- **Cards de Cliente**: Estilo refinado com hover effects suaves

### 📋 Técnico

- CSS Variables organizadas em seções (Backgrounds, Grays, Borders, Typography, Radius, Shadows)
- Suporte preparado para tema claro (variáveis `--ds-bg-100`, `--ds-bg-200`)

---

## [2.2.0] - 2026-01-15

### Adicionado

- Panda AI Assistant (Omni-Bar com Ctrl+K)
- Sistema de energia IA (Panda Coins)
- Integração Google Maps Autocomplete

### Corrigido

- Modal de cliente funcional
- Filtros por cidade e bairro
- Sincronização IndexedDB

---

## [2.1.0] - 2026-01-10

### Adicionado

- Interface dark mode
- Kanban view
- Upload de relatórios HTML

---

© 2026 Panda Fabrics - Building the Developer Soil.
