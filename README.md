# 🐼 Panda Fabrics Core - Master Documentation

> **Single Source of Truth** | Versão 2.2 | [Repositório Oficial](https://github.com/LucassVal/SAAS)

Bem-vindo ao **Cérebro do Ecossistema**. Este arquivo consolida toda a inteligência, regras e protocolos do Panda Fabrics.

---

## 📑 Índice Mestre (Cache & Navegação)

Use este índice para navegar rapidamente.

### 1. 🏗️ Arquitetura & Visão

- [Missão & Estratégia](#11-missão--estratégia)
- [Arquitetura Hub (Central + Descentralizado)](#12-arquitetura-hub)
- [Pilar 1: Segurança (Armor/Shield)](#13-pilar-1-segurança)
- [Pilar 2: GAS Serverless](#14-pilar-2-gas-serverless)
- [Pilar 3: Sistema Híbrido (Offline-First)](#15-pilar-3-sistema-híbrido)

### 2. 🛠️ Engenharia Core

- [Geo-Spatial Engine](#21-geo-spatial-engine)
- [Workflow Automation](#22-workflow-automation)
- [Cognitive Core (RAG/AI)](#23-cognitive-core)
- [Data Warehouse (BigQuery)](#24-data-warehouse)
- [Omni-Bar (Frontend)](#25-omni-bar)

### 3. 💰 Economia & Pricing

- [Panda Coin ($PC)](#31-panda-coin-pc)
- [Tabela de Preços (Varejo vs Atacado)](#32-tabela-de-preços)
- [Gateways (PagSeguro, Stripe, Crypto)](#33-gateways-de-pagamento)
- [Revenue Share (Devs)](#34-revenue-share)

### 4. 📦 Store & Protocolo de Módulos

- [Manifesto `manifest.json`](#41-manifesto-do-módulo)
- [Tipos de Módulos (App, Ext, Lib)](#42-tipos-de-módulos)
- [Segurança (Sandbox/JEA)](#43-segurança-da-store)
- [Instalação (One-Click)](#44-fluxo-de-instalação)

### 5. 🔌 Plugins & SDKs

- [Plugins Nativos (YouTube, Meta, WhatsApp)](#51-plugins-nativos)
- [SDKs de Terceiros (Canva, Stripe)](#52-sdks-de-terceiros)
- [Multi-Window HUD](#53-multi-window-hud)
- [Web PowerShell Studio](#54-web-powershell-studio)

### 6. 🏆 Gamificação (Badges)

- [Comunidade & XP](#61-comunidade--xp)
- [Marketplace (Seller/Buyer)](#62-marketplace-badges)
- [Developer Achievements](#63-developer-badges)
- [Uso & Energia](#64-uso--energia)

### 7. 📋 Auditoria & Compliance

- [Legal & Contábil](#71-legal--contábil)
- [Checklist de Risco](#72-checklist-de-risco)

---

# 1. 🏗️ Arquitetura & Visão

### 1.1 Missão & Estratégia

**"Democratizar a infraestrutura Google para desenvolvedores."**
Transformamos a complexidade de Cloud (AWS/GCP) em uma moeda simples: **Panda Coin (PC)**. O Dev não configura servidor, ele apenas "abastece" e usa.

### 1.2 Arquitetura Hub

Modelo **Híbrido Centralizado/Descentralizado**:

- **Hub Central:** Gerencia contas, Panda Coins, Segurança e Atualizações de Frontend.
- **Cliente (Descentralizado):** O código roda no Google Apps Script (GAS) do cliente e os dados ficam no Google Drive do cliente.
- **Vantagem:** Custo de infraestrutura próximo a ZERO para nós (Serverless).

### 1.3 Pilar 1: Segurança

- **Cloud Armor:** Proteção nativa Google contra DDoS.
- **Headless:** O cliente nunca vê o código-fonte sensível (bots), apenas o resultado via API.
- **DevSecOps:** Segredos gerenciados via `PropertiesService`, nunca hardcoded.

### 1.4 Pilar 2: GAS Serverless

- **API Gateway:** `doPost(e)` centraliza todas as chamadas.
- **Ledger:** Cada milissegundo de execução debita $PC da carteira.
- **Dispatcher:** Roteia para Gemini Flash (Free), Pro ou GPT-4o conforme saldo.

### 1.5 Pilar 3: Sistema Híbrido

- **PWA Offline-First:** Funciona sem internet (Read-only + Queue).
- **Sync:** Quando online, faz Push/Pull das ações pendentes.
- **Agente Local:** (Futuro v4.0) Desktop app em Rust para alta performance.

---

# 2. 🛠️ Engenharia Core

### 2.1 Geo-Spatial Engine

Otimização de rotas e normalização de endereços para Logística (Last Mile). Integração nativa Maps SDK.

### 2.2 Workflow Automation

Conectores OAuth2 prontos para Gmail, Calendar e Drive. "If This Then That" nativo do ecossistema.

### 2.3 Cognitive Core

**RAG (Retrieval Augmented Generation):** O sistema lê PDFs e planilhas do usuário no Drive para dar contexto à IA.
**Modelos:** Suporte a Gemini 1.5/3.0, GPT-4o, Claude 3.5.

### 2.4 Data Warehouse

Exportação de Sheets para **BigQuery** para lidar com milhões de linhas. Conector para Looker Studio/PowerBI.

### 2.5 Omni-Bar

Frontend unificado (`CRM.html`). Uma barra de comando (Ctrl+K) estilo Spotlight para invocar qualquer ferramenta ou IA do sistema.

---

# 3. 💰 Economia & Pricing

### 3.1 Panda Coin ($PC)

A moeda de troca de energia.

- **Base:** 1 USD = ~1000 PC.
- **Consumo:** Texto (~0.5 PC), Imagem (~40 PC), Vídeo (~500 PC).

### 3.2 Tabela de Preços

| Perfil      | Margem | Preço  | Objetivo                       |
| :---------- | :----- | :----- | :----------------------------- |
| **Varejo**  | 2.5x   | 250 PC | Cliente Final (Conveniência)   |
| **Atacado** | 1.25x  | 125 PC | Desenvolvedor (Volume/Revenda) |

> **Promoção B2B:** Devs compram "Pacotes Business" (100k PC) com **50% OFF** para revender embutido em cursos/softwares.

### 3.3 Gateways de Pagamento

- **PagSeguro:** Brasil (PIX/Cartão). Checkout transparente.
- **Stripe:** Global (USD). Cartões internacionais.
- **Crypto:** Solana/USDC (Chain Blocks). Pagamentos via Blockchain.
- **B2B Webhooks:** Integração com Kiwify/Hotmart para venda de Bundles (Curso + Moedas).

### 3.4 Revenue Share

Se um Dev cria um módulo e outro usuário usa:

- **Panda:** Cobra custo infra + base.
- **Dev:** Define markup (lucro) em cima da energia. Ganha passivamente sempre que o módulo roda.

---

# 4. 📦 Store & Protocolo de Módulos

### 4.1 Manifesto do Módulo

Todo módulo deve ter um `manifest.json`.

```json
{
  "id": "com.dev.trader",
  "permissions": ["DRIVE_READ", "EXTERNAL_API"],
  "price": { "module": 0, "energy_fee": 1 }
}
```

### 4.2 Tipos de Módulos

1. **App:** Aplicação completa com UI.
2. **Library:** Bibliotecas de código (ex: MathUtils).
3. **Extension:** Habilidades para a IA (ex: "Saber ler gráficos").

### 4.3 Segurança da Store

- **Assinatura Digital:** Hash verificado na instalação.
- **Sandbox:** O módulo só acessa o que pediu no manifesto.
- **Audit:** Code review automatizado para detectar malwares.

### 4.4 Fluxo de Instalação

One-Click Install via Loja Oficial ou `panda install <url>` para repositórios privados (GitHub/Gist).

---

# 5. 🔌 Plugins & SDKs

### 5.1 Plugins Nativos

Bibliotecas pré-instaladas para acelerar o desenvolvimento:

- **YouTube:** Search, Upload, Analytics.
- **Meta (FB/IG):** Graph API para posts e métricas.
- **WhatsApp:** Integração via Evolution API.

### 5.2 SDKs de Terceiros

- **Canva:** Embed do editor de design.
- **Stripe:** Checkout elements.

### 5.3 Multi-Window HUD

Sistema de janelas flutuantes (`window.open`) que se comunicam via `postMessage`. Permite setups multi-monitor (Ex: Gráfico na tela 1, Chat na tela 2).

### 5.4 Web PowerShell Studio

IDE Web para criar e assinar scripts de automação que rodam no Agente Local.

---

# 6. 🏆 Gamificação (Badges)

Recompensas para engajar a comunidade.

### 6.1 Comunidade & XP

- **Hello World:** Primeiro Post.
- **Guru:** 100 Respostas Úteis.
- **Bug Hunter:** Reportar falhas (Vale PC!).

### 6.2 Marketplace Badges

- **Merchant:** 10 Vendas.
- **Tycoon:** 100 Vendas (Taxa Reduzida 4%).
- **Unicorn:** 10k Vendas (Taxa Reduzida 2%).

### 6.3 Developer Badges

- **Scripter:** 10 Deploys.
- **Full Stack:** Usar GAS + HTML.
- **Open Sourcer:** Publicar código aberto (Taxa Zero).

### 6.4 Uso & Energia

- **Spark:** Queimar 100 PC.
- **Sun:** Queimar 1M PC (VIP).
- **Green Energy:** Usar na madrugada (Desconto).

---

# 7. 📋 Auditoria & Compliance

### 7.1 Legal & Contábil

- **Modelo:** Service Provider (Infraestrutura).
- **Responsabilidade:** O usuário é responsável pelo conteúdo/uso das APIs (Termos de Uso).
- **Tributação:** Venda de licença de uso/crédito (SaaS).

### 7.2 Checklist de Risco

- [x] Termos de Uso (Neutralidade).
- [x] Segredos em Vault (PropertiesService).
- [x] HTTPS Only.
- [x] Backup em Cold Storage (Drive).

---

> **Panda Fabrics Core** - _Building the Developer Soil._
