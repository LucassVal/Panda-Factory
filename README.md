# 🐼 Panda Fabrics Core - Master Documentation

> **Single Source of Truth** | Versão 2.3 | [Repositório Oficial](https://github.com/LucassVal/SAAS)

**Nota:** Este documento consolida todo o conhecimento do ecossistema Panda Fabrics. Use o Índice para navegar.

---

## 📑 Índice Mestre (Navegação Rápida)

### [1. Manual de Infraestrutura & Estratégia](#1-manual-de-infraestrutura--estratégia)

- [Arquitetura Hub](#arquitetura-hub)
- [Segurança & Compliance](#segurança--compliance)
- [Economia Panda Coin](#economia-panda-coin)
- [Engenharia Core](#engenharia-core)

### [2. Protocolo da Store (Módulos)](#2-protocolo-da-store-módulos)

- [Manifesto JSON](#manifesto-json)
- [Tipos de Módulos](#tipos-de-módulos)
- [Modelo de Segurança](#modelo-de-segurança)
- [Instalação](#instalação)

### [3. Plugins & SDKs](#3-plugins--sdks)

- [Plugins Nativos (YouTube, Meta, WhatsApp)](#plugins-nativos-roadmap)
- [SDKs Terceiros (Stripe, Canva)](#sdks-de-terceiros)
- [Multi-Janela (HUD)](#multi-window-hud)
- [Casos de Uso (Influencer, Trader)](#caso-de-uso-agente-influencer-ia)

### [4. Gamificação & Badges](#4-gamificação--badges)

- [Comunidade & Suporte](#comunidade--suporte-social)
- [Marketplace (Seller/Buyer)](#marketplace-vendedor)
- [Developer & Coding](#developer--coding)
- [Uso & Energia](#uso--energia-consumo)

### [5. Integrações Google Workspace](#5-integrações-google-workspace)

- [Gmail, Drive, Calendar, Sheets](#gmail)
- [BigQuery & Maps](#apis-avançadas)
- [Exemplos por Vertical](#casos-de-uso-por-vertical)

### [6. Auditoria & Compliance](#6-auditoria--compliance)

- [Firewall Jurídico](#o-muro-de-compliance-firewall-jurídico)
- [Checklist de Risco](#checklist-de-risco-legal--ti)

---

---

# 1. Manual de Infraestrutura & Estratégia

_(Fonte: `docs/MANUAL_INFRAESTRUTURA.md`)_

## 🐼 PANDA FABRICS - Arquitetura Estratégica

**Versão:** 2.0  
**Missão:** Democratizar infraestrutura Google para desenvolvedores

### 📌 Visão: O Canvas Aberto

> "Ganhamos na quantidade. Ajudamos os pequenos a crescerem."

| Pilar           | Descrição                     |
| :-------------- | :---------------------------- |
| **Baixo Custo** | Infra Google = quase zero     |
| **Volume**      | Centavos × milhares de devs   |
| **Autonomia**   | Cada dev tem sua loja própria |

### 🦴 Espinha Dorsal: Arquitetura Hub

#### Estratégia Comercial para Devs (B2B)

> **"Compre no Atacado, Venda no Varejo (ou Embutido)"**

#### 1. Desconto de Atacado (Dev Packs)

O desenvolvedor precisa de "combustível" barato.
| Pacote | Volume | Desconto | Preço Unitário |
|:---|:---|:---|:---|
| **Starter** | 1.000 PC | 0% | 1.2x |
| **Pro** | 10.000 PC | 20% | 0.96x |
| **Business** | 100.000 PC | **50%** | **0.60x** |

#### 2. Venda Embutida (Bundled Launch)

O Dev vende seu produto em plataformas externas (Kiwify, Hotmart) e entrega Panda Coins como bônus via Webhooks.

#### Arquitetura Hub Central + Descentralizado

```
┌─────────────────────────────────────────────────────────────┐
│                   PANDA FABRICS (HUB)                       │
├─────────────────────────────────────────────────────────────┤
│  CENTRALIZADO (Nosso)           DESCENTRALIZADO (Cliente)  │
│  Script Database, Coins,        GAS Backend, Drive Storage  │
│  Auth, Updates                  Execução                    │
└─────────────────────────────────────────────────────────────┘
                    ↕ Google Auth (OAuth) ↕
```

### 🛡️ Pilar 1: Segurança

**Cloud Armor:** Proteção DDoS nativa.
**Headless:** Cliente vê apenas resultados, código do bot fica protegido.
**DevSecOps:** Segredos em `PropertiesService`.

### ⚡ Pilar 2: GAS (Orquestrador Serverless)

**API Gateway:** `doPost(e)` centralizado.
**Ledger:** Cobrança de PC por milissegundo de execução.
**Dispatcher:** Roteamento de IA (Gemini Flash Grátis vs Pro Pago).
**Fila Justa:** Prioridade para pagantes, Free Tier em background.

### 1.5 Pilar 3: Sistema Híbrido

- **PWA Offline-First:** Funciona sem internet (Read-only + Queue).
- **Sync:** Quando online, faz Push/Pull das ações pendentes.
- **Agente Local:** (Futuro v4.0) Desktop app em Rust para alta performance.

### 1.6 Infraestrutura de Máquinas (Ghost Architecture)

**Conceito "Ghost" (Golden Image):**
Não usamos Docker para tudo. Para ambientes Windows/Linux completos, usamos a técnica de **Ghost Imaging**:

1.  **Master Node:** Uma VM "Golden Image" com todos os softwares pré-instalados (VS Code, Python, Node, Drivers NVIDIA).
2.  **Clonagem Instantânea:** Quando o usuário precisa, o sistema "hidrata" uma cópia dessa imagem em segundos.
3.  **Hibernação:** A VM salva o estado (RAM+Disk) e dorme. Custo zero cobrado do usuário.

---

# 2. 🛠️ Engenharia Core

### 2.1 Geo-Spatial Engine

Otimização de rotas e normalização de endereços para Logística (Last Mile). Integração nativa Maps SDK.

### 2.2 Workflow Automation

Conectores OAuth2 prontos para Gmail, Calendar e Drive. "If This Then That" nativo do ecossistema.

### 2.3 Cognitive Core (IA Padrão: Gemini 3.0 Flash)

**O Cérebro Gratuito:** Todo usuário tem acesso ao **Gemini 3.0 Flash** com janela de contexto massiva e **1 Milhão de Tokens/dia gratuitos**.

- **Por que 3.0 Flash?** Baixa latência, raciocínio avançado e custo irrisório para nós.
- **Model Garden:** Se precisar de mais poder, invoca-se o Gemini 1.5 Pro, GPT-4o ou Claude 3.5 (cobrado em PC).

### 2.4 Data Warehouse

Exportação de Sheets para **BigQuery** para lidar com milhões de linhas. Conector para Looker Studio/PowerBI.

### 2.5 Omni-Bar

Frontend unificado (`CRM.html`). Uma barra de comando (Ctrl+K) estilo Spotlight para invocar qualquer ferramenta ou IA do sistema.

### 2.6 Web PowerShell Studio (VS Code-like)

Uma IDE completa no navegador para Automação de Infraestrutura.

- **Engine:** Baseado no Monaco Editor (mesmo do VS Code).
- **Funcionalidade:** Escreva scripts PowerShell/Bash com IntelliSense e Syntax Highlighting.
- **Execução:** O script é assinado na nuvem e enviado para o **Agente Local** executar na máquina do cliente (ou na VM Ghost).

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

```

### 💻 Web PowerShell Studio

IDE Web (Monaco Editor) para criar scripts que rodam no Agente Local via Rust/Tauri.

### 🎬 Caso de Uso: Agente Influencer (IA)

IA que gerencia múltiplas redes sociais (YT, Meta, TikTok), posta e responde comentários autonomamente.

---

---

# 4. Gamificação & Badges

_(Fonte: `docs/GAMIFICATION_BADGES.md`)_

## 🏆 Panda Fabrics - Catálogo de Badges

> **Sistema de Conquistas:** 100+ Milestones.

### 🌍 Comunidade & Suporte (Social)

| Badge          | Requisito            | XP/Bônus      |
| :------------- | :------------------- | :------------ |
| **Newcomer**   | Entrar na comunidade | 10 XP         |
| **Guru**       | 100 Respostas Úteis  | 2.000 XP      |
| **Bug Hunter** | Reportar Bug         | 50 a 5.000 PC |

### 🛍️ Marketplace (Vendedor)

| Badge        | Requisito     | Bônus   |
| :----------- | :------------ | :------ |
| **Merchant** | 10 Vendas     | 500 XP  |
| **Tycoon**   | 100 Vendas    | Taxa 4% |
| **Unicorn**  | 10.000 Vendas | Taxa 2% |

### 🛒 Marketplace (Comprador)

| Badge         | Requisito       | Bônus     |
| :------------ | :-------------- | :-------- |
| **Collector** | 10 Módulos      | 100 XP    |
| **Whale**     | > 100k PC Saldo | VIP Queue |

### 👨‍💻 Developer & Coding

| Badge            | Requisito        | XP/Bônus  |
| :--------------- | :--------------- | :-------- |
| **Hello GAS**    | 1º Deploy        | 50 XP     |
| **AI Master**    | Usar Brain 100x  | 500 XP    |
| **Open Sourcer** | Code Open Source | Taxa Zero |

### ⚡ Uso & Energia (Consumo)

| Badge            | Requisito     | Bônus    |
| :--------------- | :------------ | :------- |
| **Spark**        | 100 PC        | 5 XP     |
| **Sun**          | 1M PC         | Créditos |
| **Green Energy** | Uso Madrugada | 10% OFF  |

---

---

# 5. Integrações Google Workspace

_(Fonte: `docs/GOOGLE_WORKSPACE_INTEGRATIONS.md`)_

## 🔌 PANDA FABRICS - Integrações Google Workspace

Acesso nativo a todo o Google Workspace via Apps Script.

### 📧 Gmail

Enviar e-mails, ler inbox, criar rascunhos.

### 📅 Google Calendar

Criar agendamentos, listar eventos, verificar disponibilidade.

### 📊 Google Sheets

Ler e escrever dados, criar planilhas dinâmicas, dashboards.

### 📁 Google Drive

Upload de arquivos, listar pastas, gerenciar permissões.

### 📝 Google Docs

Gerar contratos a partir de templates (Find & Replace).

### 📍 Google Maps

Geocoding (Endereço -> Lat/Lon), Cálculo de rotas e distâncias.

### 🔐 APIs Avançadas

- **BigQuery:** Consultas SQL em datasets massivos.
- **YouTube:** Gestão de canal.
- **Analytics:** Métricas de acesso.

---

---

# 6. Auditoria & Compliance

_(Fonte: `docs/AUDITORIA_PRE_LANCAMENTO.md`)_

## 📋 Auditoria Pré-Lançamento & Compliance Firewall

> **Estratégia:** "Service Provider" (Infraestrutura).

### 🛡️ O Muro de Compliance (Firewall Jurídico)

1. **Segregação:** Dados ficam no Drive do cliente. Não vemos o conteúdo.
2. **Responsabilidade:** Termos de Uso (ToS) clareiam que usuário responde pelo uso das APIs.
3. **Google Partner:** Geramos receita legítima para o Google via consumo de Cloud.

### 🚨 Checklist de Risco (Legal & TI)

- [x] **Contábil:** MEI / NF de Serviço.
- [x] **Legal:** Termos de Uso com Neutralidade de Rede.
- [x] **Segurança:** Segredos em Vault, HTTPS, LGPD.

---

> **Panda Fabrics Core** - _Building the Developer Soil._
```
