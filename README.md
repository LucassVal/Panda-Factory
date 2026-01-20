# 🐼 PANDA FABRICS CORE - Sistema de Gestão Inteligente

**Versão:** 2.0 (Fusão Panda Core + TitanGestão)  
**Status:** Produção  
**Repositório:** [github.com/LucassVal/SAAS](https://github.com/LucassVal/SAAS)

---

## 📌 O Que É

Sistema PWA híbrido de gestão empresarial (CRM + PDV + Estoque + Financeiro) com **Agente de IA integrado** e **economia própria (Panda Coin)**.

### 🎯 Diferenciais

- ✅ Funciona **offline** após primeiro login (PWA + IndexedDB)
- ✅ Dados no **Google Drive do cliente** (privacidade total)
- ✅ IA com **cobrança por uso** ($PC - Panda Coin)
- ✅ Backend **serverless** (Google Apps Script)
- ✅ Multi-dispositivo sincronizado

---

## 💰 Modelo Econômico (Panda Coin)

| Item                 | Valor               |
| :------------------- | :------------------ |
| **Lifetime (Motor)** | R$ 149,90 único     |
| **Bônus Inicial**    | 100 PC incluídos    |
| **Recarga**          | Conforme uso        |
| **Margem**           | 20% sobre custo API |

### Custos de Serviço

| Serviço         | Custo USD | ~Custo PC |
| :-------------- | :-------- | :-------- |
| Texto (Gemini)  | $0.0005   | ~0.003 PC |
| Imagem (DALL-E) | $0.04     | ~0.28 PC  |
| Vídeo (Runway)  | $0.50     | ~3.5 PC   |
| Leitura Drive   | $0.001    | ~0.007 PC |

---

## 🏗️ Arquitetura

```
Frontend (PWA)              Backend (GAS)
┌──────────────┐            ┌──────────────┐
│   CRM.html   │───HTTP────▶│   Code.gs    │
│   (6400+ L)  │◀───JSON────│   (Unified)  │
└──────────────┘            └──────────────┘
       │                           │
       ▼                           ▼
┌──────────────┐            ┌──────────────┐
│  IndexedDB   │            │ Google Drive │
│  (Offline)   │            │ (Cloud Sync) │
└──────────────┘            └──────────────┘
```

### Estrutura de Arquivos

```
CRM/
├── CRM.html              # Frontend PWA completo
├── backend/
│   └── Code.gs           # Backend unificado (v2.0)
├── js/core/
│   └── Repository.js     # Abstração IndexedDB
├── secrets.js            # Credenciais (gitignored)
├── .gitignore            # Proteção de segredos
└── README.md             # Este arquivo
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/LucassVal/SAAS.git
cd SAAS

# 2. Servidor local
python -m http.server 8080
# Abra: http://localhost:8080/CRM.html

# 3. Deploy Backend (GAS)
cd backend
clasp push
clasp deploy --description "v2.0 Panda Core"
```

---

## 📡 API Endpoints

**Base URL:** `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`

| Método | Action/Type           | Descrição                |
| :----- | :-------------------- | :----------------------- |
| GET    | `?action=status`      | Verifica status da API   |
| GET    | `?action=setup`       | Configura pasta no Drive |
| POST   | `action: GET_BALANCE` | Retorna saldo em PC      |
| POST   | `action: RECHARGE`    | Adiciona créditos        |
| POST   | `type: TEXT_GEN`      | Gera texto (Gemini)      |
| POST   | `type: DRIVE_READ`    | Lê arquivo do Drive      |
| POST   | `type: SHEET_CREATE`  | Cria planilha            |

---

## 🔒 Segurança

Arquivos protegidos pelo `.gitignore`:

- `secrets.js` - Chaves de API
- `.clasp.json` - Configuração CLASP
- `.clasprc.json` - Token de acesso (PERIGO!)
- `credentials.json` - Credenciais Google

---

## 📞 Contato

**Desenvolvedor:** Lucas Valério  
**GitHub:** [@LucassVal](https://github.com/LucassVal)

---

© 2026 Panda Fabrics Core - Todos os direitos reservados
