# 🐙 PF_MEDUSA_REFERENCE - Sistema de Plugins e Contribuição

> **Versão:** 1.1.0 | **Status:** Planejado | **Atualizado:** 2026-01-26

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Filosofia: IDE Externa + GitHub Hooks](#2-filosofia-ide-externa--github-hooks)
3. [GitHub Hooks Integration](#3-github-hooks-integration)
4. [Tipos de Material](#4-tipos-de-material)
5. [Panda Store Registry](#5-panda-store-registry)
6. [Diferenciais para Devs](#6-diferenciais-para-devs)
7. [Roadmap](#7-roadmap)

---

## 1. Visão Geral

**Medusa** é o sistema de distribuição de plugins e extensões do Panda Factory. Permite que a comunidade crie e distribua materiais via **GitHub**, usando **qualquer IDE**.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    MEDUSA - FLUXO DE PRODUÇÃO                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DESENVOLVEDOR                   GITHUB                   MEDUSA    │
│  ┌──────────────┐              ┌─────────┐            ┌──────────┐ │
│  │ Qualquer IDE │              │ Repo    │  Webhook   │ Listener │ │
│  │ (VS Code,    │──git push──▶│ público │──────────▶│ Valida   │ │
│  │  Cursor,     │              │         │            │ Publica  │ │
│  │  Antigravity)│              └─────────┘            └──────────┘ │
│  └──────────────┘                                          │       │
│                                                            ▼       │
│                                                   ┌──────────────┐ │
│                                                   │ PANDA STORE  │ │
│                                                   │ (disponível  │ │
│                                                   │ para users)  │ │
│                                                   └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Filosofia: IDE Externa + GitHub Hooks

> **Decisão de Arquitetura:** Desenvolvedor usa IDE externa de sua preferência. Sem extensões obrigatórias.

### Por que essa abordagem?

| Aspecto              | Benefício                        |
| -------------------- | -------------------------------- |
| **Liberdade**        | Dev usa IDE que já conhece       |
| **Zero custo**       | Sem tokens/quota nossa consumida |
| **GitHub universal** | Todo dev já sabe usar            |
| **Sem lock-in**      | Nenhuma dependência proprietária |
| **Manutenção zero**  | Não precisamos manter extensão   |

### IDEs Suportadas (qualquer uma!)

| IDE         | Funciona? | Nota              |
| ----------- | :-------: | ----------------- |
| VS Code     |    ✅     | Popular           |
| Cursor      |    ✅     | AI-first          |
| Antigravity |    ✅     | Google            |
| Zed         |    ✅     | Rápido            |
| Vim/Neovim  |    ✅     | Hardcore          |
| IntelliJ    |    ✅     | Java/Kotlin       |
| **Notepad** |    ✅     | Sim, até notepad! |

### Workflow do Desenvolvedor

```text
1. Dev coda localmente (qualquer IDE)
2. Testa com SDK local / Rust Agent
3. Cria panda.mcp.json (MCP OBRIGATÓRIO)
4. git push → GitHub
5. GitHub Action dispara webhook
6. Medusa valida MCP + publica na Store
7. Users instalam e dev recebe 52% split
```

> ⚠️ **MCP OBRIGATÓRIO:** Todo plugin DEVE ter `panda.mcp.json`. Sem MCP = não publica.
> Ver [PF_MCP_REFERENCE.md (PARTE B)](PF_MCP_REFERENCE.md) para especificação completa.

### 2.1 Filosofia Zero Barreira

| Quem        | Paga?  | Razão                                       |
| ----------- | :----: | ------------------------------------------- |
| **Dev**     | ❌ NÃO | Zero barreira para integrar plugins Founder |
| **Usuário** | ✅ SIM | Preço módico atrai, depois consome serviços |

```text
FUNIL: Dev integra grátis → User compra barato → User consome energia (Gemini, GPU)
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

| Tipo             | Linguagem   | Runtime            | Exemplo          |
| ---------------- | ----------- | ------------------ | ---------------- |
| **Plugin GAS**   | JavaScript  | Google Apps Script | Automação Sheets |
| **Plugin Rust**  | Rust        | Panda Agent        | GPU tools        |
| **Template Web** | HTML/CSS/JS | Browser            | Landing pages    |
| **MCP Tool**     | Rust        | Rust Agent         | Nova tool IA     |
| **Widget Jam**   | React       | TLDraw/Jam         | Componentes      |
| **Theme**        | CSS/JSON    | Panda UI           | Visual themes    |

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

| Endpoint                 | Método | Descrição             |
| ------------------------ | ------ | --------------------- |
| `/api/v1/search?q=`      | GET    | Busca plugins         |
| `/api/v1/package/{name}` | GET    | Detalhes do package   |
| `/api/v1/install/{name}` | POST   | Instala (debita PC)   |
| `/api/v1/publish`        | POST   | Publica (via webhook) |

---

## 6. Diferenciais para Devs

> O que faz devs escolherem Panda para publicar plugins?

| Diferencial       | Descrição                           |
| ----------------- | ----------------------------------- | --- |
| **Split 52%**     | Dev fica com 52% das vendas (Store) |     |
| **GitHub nativo** | Sem plataforma proprietária         |
| **SDK simples**   | `Panda.Brain.chat()`                |
| **IA tutora**     | Tutorial automático para users      |
| **Multi-window**  | Plugins podem usar docks            |
| **Tokenomics**    | Monetização built-in com PC         |
| **Zero config**   | User não configura API keys         |

### Comparação com Outras Plataformas

| Plataforma          | Split Dev |  Barreira Entrada   |  Monetização   |
| ------------------- | :-------: | :-----------------: | :------------: |
| **Panda**           |    52%    | 🟢 Baixa (git push) | ✅ PC built-in |
| Apple Store         |  70-85%   |  🔴 Alta ($99/ano)  |       ✅       |
| Chrome Web Store    |    70%    |  🟡 Média (review)  |   ⚠️ Manual    |
| VS Code Marketplace |    0%     |      🟢 Baixa       |     ❌ Sem     |

### 6.2 VMs e Hosts Terceiros

Além de devs individuais, empresas podem plugar infraestrutura no SDK:

| Modelo                 | Descrição                       | Revenue     |
| ---------------------- | ------------------------------- | ----------- |
| **VM Rental (Google)** | Locação de VMs GCP via Panda    | 30% fee     |
| **Host Terceiro**      | Provedor externo plugado no SDK | 10-20% fee  |
| **Compute Share**      | User cede recursos → recebe PC  | Split 50/50 |

```text
┌─────────────────────────────────────────────────────────────────────┐
│            HOSTS TERCEIROS → PANDA SDK                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  TERCEIRO (própria infra)           PANDA SDK                       │
│  ┌──────────────────────┐          ┌──────────────────────┐        │
│  │ DigitalOcean         │   Hook   │ • Billing (PC)       │        │
│  │ AWS                  │─────────▶│ • Auth (Firebase)    │        │
│  │ Azure                │          │ • Monitoring         │        │
│  │ Qualquer VPS         │          │ • User routing       │        │
│  └──────────────────────┘          └──────────────────────┘        │
│                                                                      │
│  BENEFÍCIO TERCEIRO: Acesso à base de users Panda                   │
│  BENEFÍCIO PANDA: Infra distribuída sem custo                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Roadmap

| Fase   | Entregas                     | Prazo    |
| ------ | ---------------------------- | -------- |
| **P1** | GitHub Webhook + Medusa API  | Sprint 4 |
| **P2** | Store UI + pagamentos PC     | Sprint 5 |
| **P3** | Featured plugins + analytics | Sprint 6 |

---

## 8. Referências

- [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md) - Rust Agent + Backend
- [PF_MCP_REFERENCE.md](PF_MCP_REFERENCE.md) - MCP Tools + Manifest
- [PF_ECONOMY_REFERENCE.md](PF_ECONOMY_REFERENCE.md) - Economia PC/Splits
- [GitHub Actions](https://docs.github.com/actions)

---

> 📖 **Versão:** 1.1.0 | **Status:** Planejado
