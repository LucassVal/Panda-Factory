# 🐼 Panda Factory - Dual Repository Architecture

# ================================================

#

# Este documento explica como funciona a estratégia de dois repos:

# - SAAS (privado): Código completo com secrets

# - panda-sdk (público): SDK e tentacles para comunidade

#

## 📁 Estrutura

```
PRIVADO: github.com/LucassVal/SAAS
├── js/
│   ├── core/                    ← 🔒 NUNCA SAI (PAT, Kill Switch, DRM)
│   ├── tentacles/               ← 🌐 Vai para público
│   ├── ui/                      ← 🌐 Vai para público
│   ├── pf.sdk.js                ← 🌐 Vai para público
│   └── pf.bootstrap.js          ← 🌐 Vai para público
├── rust-agent/                  ← 🔒 NUNCA SAI (Ed25519)
├── backend/                     ← 🔒 NUNCA SAI (GAS)
├── .agent/                      ← 🔒 NUNCA SAI (Codex)
├── data/secrets/                ← 🔒 NUNCA SAI
└── scripts/
    └── publish-sdk.ps1          ← Script de publicação

PÚBLICO: github.com/LucassVal/panda-sdk
├── pf.sdk.js                    ← SDK público
├── pf.bootstrap.js              ← Bootstrap
├── tentacles/                   ← Todos os tentacles
├── css/                         ← Estilos
├── index.html                   ← Landing page
├── docs/                        ← Documentação
└── data/                        ← Dados públicos (JSON DB)
    ├── users/
    └── projects/
```

## 🔄 Workflow de Publicação

1. **Desenvolva no SAAS** (repo privado)
2. **Teste localmente**
3. **Execute o script de publicação:**
   ```powershell
   cd C:\Users\Lucas Valério\Desktop\CRM
   .\scripts\publish-sdk.ps1
   ```
4. **Automático:** Script copia apenas arquivos públicos
5. **GitHub Pages:** Site fica em `lucassval.github.io/panda-sdk`

## 🔒 O que NÃO é publicado

| Arquivo/Pasta    | Motivo                            |
| ---------------- | --------------------------------- |
| `js/core/*`      | PAT, Kill Switch, DRM, Governance |
| `rust-agent/*`   | Chaves Ed25519, código crítico    |
| `backend/*`      | Google Apps Script (backend)      |
| `.agent/*`       | PANDA.md (contexto interno)       |
| `data/secrets/*` | Tokens, API keys                  |

## ⚙️ Configuração Inicial

### 1. Criar repo público

```bash
gh repo create LucassVal/panda-sdk --public --description "🐼 Panda Factory SDK"
```

### 2. Ativar GitHub Pages

1. Vá em `github.com/LucassVal/panda-sdk/settings/pages`
2. Source: **GitHub Actions**
3. Pronto!

### 3. Executar primeira publicação

```powershell
.\scripts\publish-sdk.ps1
```

## 🌐 URLs Finais

| O Quê        | URL                                            |
| ------------ | ---------------------------------------------- |
| Site Público | https://lucassval.github.io/panda-sdk          |
| Repo Público | https://github.com/LucassVal/panda-sdk         |
| Repo Privado | https://github.com/LucassVal/SAAS (só você vê) |

## 💰 Custo

**$0/mês** - Totalmente grátis no GitHub Free!
