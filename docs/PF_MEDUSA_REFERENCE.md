# 🐙 PF_MEDUSA_REFERENCE - Sistema de Plugins e Contribuição

> **Versão:** 1.0.0 | **Status:** Planejado | **Atualizado:** 2026-01-26

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Panda VSX Extension](#2-panda-vsx-extension)
3. [GitHub Hooks Integration](#3-github-hooks-integration)
4. [Tipos de Material](#4-tipos-de-material)
5. [Panda Store Registry](#5-panda-store-registry)
6. [Roadmap](#6-roadmap)

---

## 1. Visão Geral

**Medusa** é o sistema de distribuição de plugins e extensões do Panda Factory. Permite que a comunidade crie e distribua materiais via GitHub.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    MEDUSA - FLUXO DE PRODUÇÃO                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DESENVOLVEDOR                   GITHUB                   MEDUSA    │
│  ┌──────────────┐              ┌─────────┐            ┌──────────┐ │
│  │ Qualquer IDE │              │ Repo    │  Webhook   │ Listener │ │
│  │ + Panda VSX  │──git push──▶│ público │──────────▶│ Valida   │ │
│  │              │              │         │            │ Publica  │ │
│  └──────────────┘              └─────────┘            └──────────┘ │
│        │                                                   │       │
│        │ MCP/RIG                                          ▼       │
│        ▼                                          ┌──────────────┐ │
│  ┌──────────────┐                                 │ PANDA STORE  │ │
│  │ Rust Agent   │                                 │ (disponível  │ │
│  │ (local)      │                                 │ para users)  │ │
│  └──────────────┘                                 └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Panda VSX Extension

### 2.1 O que é?

Extensão para **VS Code / Antigravity / Cursor** que conecta devs ao ecossistema Panda:

| Feature          | Descrição                               |
| ---------------- | --------------------------------------- |
| **MCP Client**   | Conecta a tools do Rust Agent           |
| **RIG Provider** | Multi-provider IA (Gemini, Claude, etc) |
| **Panda SDK**    | Snippets e autocomplete do SDK          |
| **Store CLI**    | Publica plugins direto da IDE           |

### 2.2 Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    PANDA VSX EXTENSION                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VS CODE / ANTIGRAVITY                                              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                                                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │ │
│  │  │ MCP Client   │  │ RIG Provider │  │ Store CLI    │        │ │
│  │  │              │  │              │  │              │        │ │
│  │  │ • gpu.check  │  │ • Gemini     │  │ • login      │        │ │
│  │  │ • fs.read    │  │ • Claude     │  │ • publish    │        │ │
│  │  │ • dll.load   │  │ • OpenAI     │  │ • update     │        │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │ │
│  │         │                 │                 │                 │ │
│  └─────────┼─────────────────┼─────────────────┼─────────────────┘ │
│            │                 │                 │                   │
│            ▼                 ▼                 ▼                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Rust Agent   │  │ APIs Cloud   │  │ Medusa API   │             │
│  │ localhost    │  │ (BYOL keys)  │  │ (GAS/Git)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Instalação

```bash
# VS Code
code --install-extension panda-factory.panda-vsx

# Antigravity (via Open VSX)
# Marketplace → Buscar "Panda VSX"
```

### 2.4 Uso

```typescript
// No código do dev (qualquer linguagem suportada)
// A extensão detecta e oferece autocomplete

// Acesso ao MCP via command palette
// Cmd+Shift+P → "Panda: MCP - GPU Check"

// RIG via chat panel
// Abre painel lateral com chat multi-provider
```

---

## 3. GitHub Hooks Integration

### 3.1 Webhooks Suportados

| Hook            | Quando          | Ação da Medusa    |
| --------------- | --------------- | ----------------- |
| `push`          | Commit em main  | Rebuild + publica |
| `release`       | Tag v1.x.x      | Atualiza versão   |
| `pull_request`  | PR opened       | Valida manifest   |
| `issue_comment` | `/panda deploy` | Deploy manual     |

### 3.2 GitHub Action Template

```yaml
# .github/workflows/panda-publish.yml
name: Panda Store Publish

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate panda.manifest.json
        run: |
          if [ ! -f panda.manifest.json ]; then
            echo "Missing panda.manifest.json"
            exit 1
          fi

      - name: Notify Medusa
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.PANDA_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"repo": "${{ github.repository }}", "tag": "${{ github.ref_name }}"}' \
            https://script.google.com/macros/s/MEDUSA_ID/exec?action=publish
```

### 3.3 Estrutura do Repo

```text
github.com/dev/panda-plugin-xyz/
├── panda.manifest.json      # Obrigatório
├── README.md                # Documentação
├── src/
│   ├── main.gs             # Plugin GAS
│   └── main.rs             # Plugin Rust
├── assets/
│   └── icon.png            # 128x128
└── .github/
    └── workflows/
        └── panda-publish.yml
```

---

## 4. Tipos de Material

### 4.1 Categorias

| Tipo              | Linguagem   | Runtime            | Exemplo          |
| ----------------- | ----------- | ------------------ | ---------------- |
| **Plugin GAS**    | JavaScript  | Google Apps Script | Automação Sheets |
| **Plugin Rust**   | Rust        | Panda Agent        | GPU tools        |
| **Extension VSX** | TypeScript  | VS Code            | UI tools         |
| **Template Web**  | HTML/CSS/JS | Browser            | Landing pages    |
| **MCP Tool**      | Rust        | Rust Agent         | Nova tool IA     |
| **Widget Jam**    | React       | TLDraw/Jam         | Componentes      |
| **Theme**         | CSS/JSON    | Panda UI           | Visual themes    |

### 4.2 Manifest Example

```json
{
  "name": "panda-plugin-ctrader",
  "version": "1.0.0",
  "type": "plugin-rust",
  "description": "Ponte MT4/MT5 para Panda",
  "author": {
    "name": "Lucas Valério",
    "github": "LucassVal"
  },
  "pricing": {
    "model": "premium",
    "price_pc": 500
  },
  "dependencies": {
    "panda-agent": ">=1.0.0"
  },
  "permissions": ["dll.load", "fs.write", "network.external"],
  "entry": {
    "rust": "src/main.rs",
    "gas": null
  }
}
```

---

## 5. Panda Store Registry

### 5.1 Estrutura

```text
PANDA STORE (hospedado em GAS/GitHub Pages)
├── registry/
│   ├── plugins.json        # Lista de plugins
│   ├── extensions.json     # Lista de VSX extensions
│   └── templates.json      # Lista de templates
├── packages/
│   └── {pkg-name}/
│       ├── manifest.json
│       ├── latest.zip
│       └── versions/
│           ├── 1.0.0.zip
│           └── 1.1.0.zip
└── api/
    └── v1/
        ├── search
        ├── install
        └── publish
```

### 5.2 API Endpoints

| Endpoint                 | Método | Descrição              |
| ------------------------ | ------ | ---------------------- |
| `/api/v1/search?q=`      | GET    | Busca plugins          |
| `/api/v1/package/{name}` | GET    | Detalhes do package    |
| `/api/v1/install/{name}` | POST   | Instala (debita PC)    |
| `/api/v1/publish`        | POST   | Publica novo (webhook) |

---

## 6. Roadmap

| Fase   | Entregas                      | Prazo    |
| ------ | ----------------------------- | -------- |
| **P1** | Panda VSX básico (MCP client) | Sprint 4 |
| **P2** | GitHub Webhook + Medusa API   | Sprint 5 |
| **P3** | Store UI + pagamentos PC      | Sprint 6 |

---

## 7. Referências

- [PF_RUST_REFERENCE.md](PF_RUST_REFERENCE.md) - Rust Agent
- [PF_PLUGIN_AND_MODULAR_REFERENCE.md](PF_PLUGIN_AND_MODULAR_REFERENCE.md) - Sistema de Plugins
- [VS Code Extension API](https://code.visualstudio.com/api)
- [MCP Specification](https://modelcontextprotocol.io/)

---

> 📖 **Versão:** 1.0.0 | **Status:** Planejado
