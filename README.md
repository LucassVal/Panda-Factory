# 🐼 Panda Fabrics Core - Master Documentation

> **Single Source of Truth** | Versão 2.3.0 | [Repositório Oficial](https://github.com/LucassVal/SAAS)

**Nota:** Este documento consolida **todo** o conhecimento do ecossistema Panda Fabrics: Estratégia, Código, Infraestrutura e Regras.

> [!TIP]
> **v2.3.0:** Redesign Vercel/Geist, Panda SDK v1.0.0, dock arrastável. [Ver Changelog](#10--changelog)

---

## 📑 Índice Mestre

1.  [Infraestrutura & Estratégia](#1-manual-de-infraestrutura--estratégia)
2.  [Engenharia Core & Performance](#2-%EF%B8%8F-engenharia-core--performance)
3.  [Protocolo da Store (Módulos)](#3--protocolo-da-store--segurança)
4.  [Economia & Monetização](#4--economia--pricing)
5.  [Gamificação & Badges (Catálogo Completo)](#5-gamificação--badges-catálogo-completo)
6.  [Referência Técnica: Plugins & SDKs](#6-referência-técnica-plugins--sdks)
7.  [Referência Técnica: Google Workspace](#7-referência-técnica-google-workspace)
8.  [Casos de Uso (Arquiteturas)](#8-casos-de-uso-arquiteturas)
9.  [Auditoria & Compliance](#9-auditoria--compliance)

---

---

# 1. Manual de Infraestrutura & Estratégia

_(Fonte: `MANUAL_INFRAESTRUTURA.md`)_

## 🐼 Visão: O Canvas Aberto

**Missão:** Democratizar infraestrutura Google para desenvolvedores.

> "Ganhamos na quantidade. Ajudamos os pequenos a crescerem."

## 🚀 Desburocratização Cloud

Resolvemos a dor de cabeça de configurar servidores:

| Complexidade | Nossa Solução          |
| :----------- | :--------------------- |
| **VM/VPS**   | Serverless (GAS/Colab) |
| **IP Fixo**  | URL Apps Script        |
| **SSL**      | Google gerencia        |
| **Billing**  | Panda Coin (Pré-pago)  |
| **Scaling**  | Automático             |
| **Deploy**   | `clasp push`           |

## 🦴 Arquitetura Hub Central + Descentralizado

O modelo híbrido garante privacidade e escala infinita.

```
┌─────────────────────────────────────────────────────────────┐
│                   PANDA FABRICS (HUB)                       │
├─────────────────────────────────────────────────────────────┤
│  CENTRALIZADO (Nosso)           DESCENTRALIZADO (Cliente)  │
│  ┌─────────────────┐            ┌─────────────────┐        │
│  │ HTML/EXE        │            │ GAS Backend     │        │
│  │ (Atualizações)  │            │ (Quota cliente) │        │
│  ├─────────────────┤            ├─────────────────┤        │
│  │ Script Database │            │ Drive Storage   │        │
│  │ (Seguros/Vault) │            │ (Dados Pessoais)│        │
│  ├─────────────────┤            ├─────────────────┤        │
│  │ Panda Coins     │            │ Execução        │        │
│  │ (Ledger)        │            │ (Processamento) │        │
│  └─────────────────┘            └─────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                    ↕ Google Auth (OAuth) ↕
```

### Por Que Google Auth é Obrigatório?

1.  **Frontend:** Hospedado por nós para updates globais.
2.  **Scripts:** Lidos do nosso DB autenticado (evita pirataria).
3.  **Backend:** Executado no Google do cliente (Custo zero para nós).
4.  **Dados:** Salvos no Drive do cliente (Privacidade/LGPD).

---

# 2. 🛠️ Engenharia Core & Performance

## ⚡ Estratégia de Caching (Offline-First)

Para garantir velocidade de "App Nativo" e suportar funcionamento offline:

| Camada            | Tecnologia               | Uso                                          |
| :---------------- | :----------------------- | :------------------------------------------- |
| **1. Hot Layer**  | Firebase Realtime        | Sessão, Estado do HUD, Notificações (ms).    |
| **2. Warm Layer** | CacheStorage / IndexedDB | Web App, Assets, Módulos (Funciona Offline). |
| **3. Cold Layer** | Google Drive             | Backup, Arquivos Grandes (PDFs, Vídeos).     |

### Fluxo de Dados Híbrido

```
[Navegador] ↔ (ms) Service Worker (Cache) ↔ (ms) Firebase ↔ (async) Google Drive
```

## 🖥️ Arquitetura de Processamento (Híbrida)

O Panda Fabrics permite escolher onde o código roda: na Nuvem (Alugada) ou na Máquina do Cliente (Grátis).

### 1. NVIDIA Online (GPU Rental) ☁️

Locação de GPUs sob demanda para quem **não tem** hardware.

| GPU      | Custo    | Uso Recomendado                        |
| :------- | :------- | :------------------------------------- |
| **T4**   | 30 PC/h  | Inferência Leve, Fine-tuning simples.  |
| **A100** | 100 PC/h | Treinamento LLM, Render 3D pesado.     |
| **TPU**  | 150 PC/h | Machine Learning Massivo (TensorFlow). |

### 2. NVIDIA Local (Native CUDA) 🏠

O Agente Local (Rust/Tauri) acessa o hardware do usuário. **CUSTO ZERO** de energia.

> **Economia de Tokens:**
>
> - Cliente tem GPU? → Processa local → **0 Tokens gastos.**
> - Cliente sem GPU? → Aluga a nossa → **Paga PC.**

#### Tabela de Suporte Local

| Vendor     | Suporte       | Tecnologia       | Status  |
| :--------- | :------------ | :--------------- | :------ |
| **NVIDIA** | ✅ **Nativo** | CUDA / TensorRT  | Stable  |
| **AMD**    | ✅ **v4.0**   | ROCm             | Beta    |
| **Intel**  | ⏳ Futuro     | oneAPI           | Roadmap |
| **Apple**  | ✅ **Nativo** | Metal (M1/M2/M3) | Stable  |

**Conceito "Ghost" (Golden Image):**
Para tarefas na nuvem, usamos Spot VMs que ligam, processam e hibernam.

### 3. 🐼 Panda Agent (WebSocket Bridge)

O Agente Local permite que o site execute DLLs e binários nativos no PC do usuário.

```
┌─────────────┐      WebSocket       ┌─────────────────────┐
│   CHROME    │ ◄──────────────────► │  PANDA AGENT (exe)  │
│  (Panda UI) │    localhost:9999    │  Carrega DLLs       │
└─────────────┘                      └─────────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────────┐
                                     │  MetaTrader DLL     │
                                     │  Binance SDK        │
                                     │  GPU Processing     │
                                     └─────────────────────┘
```

**Exemplo de Uso (JavaScript no site):**

```javascript
const PandaAgent = new WebSocket("ws://localhost:9999");
PandaAgent.send(JSON.stringify({ action: "trade", symbol: "BTCUSD" }));
```

**Vantagens:**

- ✅ **LGPD Compliant** - Dados não saem do PC do usuário
- ✅ **Custo Zero** - Processamento na máquina do cliente
- ✅ **Acesso a DLLs** - MetaTrader, Binance, CUDA

---

## 🛠️ SDK Roadmap (Developer Experience)

### Fase 1: CLI Mode (Hardcore Devs)

- Dev coda no VS Code
- Usa SDK básico (`panda-sdk.js`)
- Deploy via `clasp push`
- **Meta:** Validar infraestrutura

### Fase 2: Template Mode (Devs Intermediários)

- 5 modelos prontos (CRM, Bot Trade, WhatsApp, etc)
- Dev clona e modifica lógica
- **Meta:** Reduzir tempo de onboarding

### Fase 3: Low Code Visual (Futuro)

- IA gera código via texto
- Manifesto JSON → UI automática
- **Meta:** Usuário não-técnico cria apps

## 🚦 Fila Inteligente (Fair Queue)

Prioridade para pagantes e oportunidade para gratuitos.

| Prioridade   | Perfil        | Comportamento                       |
| :----------- | :------------ | :---------------------------------- |
| **Priority** | Saldo > 10 PC | **Fast Lane.** Execução imediata.   |
| **Economy**  | Free Tier     | **Background.** Roda na ociosidade. |

> **Filosofia:** "O pequeno desenvolvedor (Varejo) traz liquidez e é tratado como VIP."

---

# 3. 📦 Protocolo da Store & Segurança

_(Fonte: `STORE_PROTOCOL.md`)_

## Manifesto do Módulo (`manifest.json`)

Especificação completa exigida para qualquer plugin.

```json
{
  "id": "com.developer.trader-bot",
  "version": "1.0.0",
  "type": "EXTENSION", // APP, EXTENSION, LIBRARY
  "permissions": [
    "DRIVE_READ", // Ler arquivos
    "EXTERNAL_API: https://api.binance.com", // Whitelist URL
    "GPU_ACCESS" // Requerer processamento pesado
  ],
  "price": {
    "module": 0, // Preço de Venda (Grátis)
    "energy_fee": 1.2 // Multiplicador de Custo (Revenue Share)
  },
  "ai_capabilities": {
    "functions": ["analyze_chart"],
    "description": "Permite que a IA leia gráficos de velas."
  },
  "entrypoint": "main.gs",
  "frontend": "index.html"
}
```

## 🛡️ Modelo de Segurança (Sandbox)

1.  **JEA (Just Enough Administration):** O script roda em um container isolado.
2.  **Assinatura Digital:** Se o código for alterado localmente sem a assinatura da Panda Cloud, ele não roda.
3.  **Panda Vault:** Segredos (API Keys) nunca ficam no código. Usam `Vault.get('KEY')` injetado em tempo de execução.

## Open Registry (Descentralizado)

- **Direct URL:** Instale via GitHub (`panda install https://github.com/user/repo.zip`).
- **Federated Stores:** Empresas podem ter lojas privadas (`registry.json` próprio) para compliance.

---

# 4. 💰 Economia & Pricing

## Tabela de Preços

| Perfil      | Margem | Preço Unitário |
| :---------- | :----- | :------------- |
| **Varejo**  | 2.50x  | 250 PC         |
| **Pro**     | 1.75x  | -              |
| **Atacado** | 1.25x  | 125 PC         |

> **Promoção B2B:** Devs compram "Pacotes Business" (100k PC) com **50% OFF** (1.25x) para revender.

## Estratégias de Monetização para Devs

1.  **Smart Split (Energy Fee):** Mesmo em módulos grátis, o Dev ganha um markup sobre o consumo de energia (ex: Cliente gasta 100 PC, Dev ganha 20 PC).
2.  **Bundled Launch (Venda Embutida):**
    - Dev vende curso/ebook na Hotmart/Kiwify.
    - Via Webhook, entrega 5.000 PC de bônus ao aluno.
    - O Dev pagou "preço de atacado" nessas moedas e agregou valor de "varejo" ao curso.

---

# 5. Gamificação & Badges (Catálogo Completo)

_(Fonte: `GAMIFICATION_BADGES.md`)_

### 🌍 Comunidade & Suporte

| ID  | Badge            | Requisito                | XP/Bônus     |
| :-- | :--------------- | :----------------------- | :----------- |
| 001 | **Newcomer**     | Entrar no Discord/Reddit | 10 XP        |
| 003 | **Helper**       | 5 respostas úteis        | 100 XP       |
| 005 | **Guru**         | 100 respostas úteis      | 2.000 XP     |
| 009 | **Exterminador** | Reportar bug crítico     | **5.000 PC** |
| 013 | **Translator**   | Traduzir módulo          | 200 XP       |
| 019 | **Influencer**   | Vídeo +1k views          | 5.000 PC     |

### 🛍️ Marketplace (Vendedor)

| ID  | Badge            | Requisito            | Bônus       |
| :-- | :--------------- | :------------------- | :---------- |
| 021 | **Open Shop**    | 1º Módulo Publicado  | 50 XP       |
| 023 | **Merchant**     | 10 Vendas            | 500 XP      |
| 025 | **Tycoon**       | 100 Vendas           | **Taxa 4%** |
| 027 | **Unicorn**      | 10.000 Vendas        | **Taxa 2%** |
| 037 | **Featured Dev** | Escolha da Curadoria | Banner Home |

### 👨‍💻 Developer & Coding

| ID  | Badge            | Requisito                  | XP/Bônus      |
| :-- | :--------------- | :------------------------- | :------------ |
| 051 | **Hello GAS**    | 1º Deploy                  | 50 XP         |
| 055 | **AI Master**    | Usar `callPandaBrain` 100x | 500 XP        |
| 056 | **GPU User**     | 1º Job no Colab            | 100 XP        |
| 059 | **Open Sourcer** | Código Aberto              | **Taxa Zero** |
| 064 | **Clean Code**   | Score A em Qualidade       | Destaque      |

### ⚡ Uso & Energia

| ID  | Badge             | Requisito       | Bônus             |
| :-- | :---------------- | :-------------- | :---------------- |
| 081 | **Spark**         | Queimar 100 PC  | 5 XP              |
| 084 | **Inferno**       | Queimar 100k PC | 2.000 XP          |
| 085 | **Sun**           | Queimar 1M PC   | Créditos          |
| 086 | **Green Energy**  | Uso Madrugada   | **10% OFF**       |
| 091 | **Yearly Active** | 365 dias        | **Anuidade Free** |

---

# 6. Referência Técnica: Plugins & SDKs

_(Fonte: `PLUGINS_SDKS.md`)_

## 📹 YouTube API

```javascript
// Upload de Vídeo
YouTube.Videos.insert(
  {
    snippet: { title: "Demo", description: "Teste" },
    status: { privacyStatus: "private" },
  },
  "snippet,status",
  mediaBlob,
);
```

## 📱 Meta (Facebook/Instagram)

```javascript
// Postar no Feed
UrlFetchApp.fetch("https://graph.facebook.com/page/feed", {
  method: "POST",
  payload: { message: "Hello World", access_token: TOKEN },
});
```

## 💬 WhatsApp (Evolution API)

```javascript
UrlFetchApp.fetch("https://api.gateway.com/sendText", {
  method: "POST",
  payload: JSON.stringify({ number: "551199999999", text: "Olá!" }),
});
```

## 💳 Stripe (Pagamentos) webhook

```javascript
function doPost(e) {
  const event = JSON.parse(e.postData.contents);
  if (event.type === "payment_intent.succeeded") {
    creditWallet(event.data.object.customer_email, event.data.object.amount);
  }
}
```

## 🎓 Kiwify/Hotmart Webhook

```javascript
function handleKiwify(payload) {
  if (payload.status === "paid") {
    // Entrega automática de Panda Coins
    creditWallet(payload.email, payload.product.panda_coins_bundle);
  }
}
```

---

# 7. Referência Técnica: Google Workspace

_(Fonte: `GOOGLE_WORKSPACE_INTEGRATIONS.md`)_

## 📧 Gmail

```javascript
GmailApp.sendEmail("user@email.com", "Subject", "Body");
const threads = GmailApp.getInboxThreads(0, 10); // Ler Inbox
```

## 📅 Calendar

```javascript
CalendarApp.createEvent("Reunião", new Date(), new Date(), {
  guests: "cliente@comp.com",
  sendInvites: true,
});
```

## 📁 Drive & Files

```javascript
// Upload
DriveApp.getFolderById("FOLDER_ID").createFile(blob);
// Listar
const files = DriveApp.getFolderById("ID").getFiles();
```

## 📊 Sheets

```javascript
SpreadsheetApp.openById("ID")
  .getSheetByName("Dados")
  .getRange("A1:B10")
  .getValues();
```

## 🗺️ Maps

```javascript
const loc = Maps.newGeocoder().geocode("Av Paulista 1000");
const dist = Maps.newDirectionFinder()
  .setOrigin("A")
  .setDestination("B")
  .getDirections();
```

## ⏰ Triggers (Automação)

```javascript
// Executar a cada 5 min
ScriptApp.newTrigger("syncFunction").timeBased().everyMinutes(5).create();
```

---

# 8. Casos de Uso (Arquiteturas)

## 🎬 Agente Influencer (Autônomo)

Gerencia múltiplas redes sociais sozinho.

```
[YouTube API] + [Meta Graph] + [TikTok API]
        ⬇           ⬇            ⬇
      [Gemini IA (Cérebro Decisor)]
        ⬇           ⬇            ⬇
   [Agendar]    [Responder]   [Analytics]
```

## 📰 Repórter Workstation (HUD)

Múltiplas janelas conectadas via `postMessage`.

- **Window 1:** Mind Map (Visual)
- **Window 2:** Brainstorm (IA)
- **Window 3:** Busca em PDFs (Vector Search)

## 🔬 Pesquisador (Híbrido)

- **Local Agent:** Roda Python/Pandas na máquina do cientista (Grátis).
- **Cloud Burst:** Se faltar RAM, transborda para Colab GPU (Pago em PC).

---

# 9. Auditoria & Compliance

_(Fonte: `AUDITORIA_PRE_LANCAMENTO.md`)_

## 🛡️ O Muro de Compliance (Firewall Jurídico)

1.  **Segregação:** Dados no Drive do cliente.
2.  **Responsabilidade:** Termos de Uso (ToS) claros.
3.  **Parceria:** Geramos receita legítima para Google Cloud.

## 🚨 Checklist Pré-Lançamento

- [x] **Contábil:** MEI (CNAE 8599-6/03) + PagSeguro.
- [x] **Legal:** Termos de Uso ("Neutralidade de Rede").
- [ ] **Segurança:** Segredos em `PropertiesService`.
- [ ] **Tecnologia:** HTTPS Obrigatório.

---

# 10. 📋 Changelog

## [2.3.0] - 2026-01-20

### 🎨 Adicionado

- **Design System Vercel/Geist**: Tokens CSS completos extraídos de vercel.com
- **Dock Arrastável**: Barra de navegação pode ser movida para qualquer posição
- **Panda SDK v1.0.0**: Kit de desenvolvimento com 6 módulos (Database, AI, Wallet, UI, Agent, Utils)
- **Panda Agent Docs**: Documentação do WebSocket Bridge
- **SDK Roadmap**: Fases 1-3 documentadas (CLI → Templates → Low Code)

### 🔧 Corrigido

- **Bug Crítico**: Tag `<script>` não fechada causava CSS renderizado como texto
- **Duplicações Header**: Removidos botões Config/Sair duplicados

### 🎨 Alterado

- **Paleta de Cores**: Atualizada para padrão Vercel dark mode
- **Design Tokens**: Novos tokens `--ds-*` para themes

---

## [2.2.0] - 2026-01-15

- Panda AI Assistant (Omni-Bar com Ctrl+K)
- Sistema de energia IA (Panda Coins)
- Integração Google Maps Autocomplete

## [2.1.0] - 2026-01-10

- Interface dark mode
- Kanban view
- Upload de relatórios HTML

---

© 2026 Panda Fabrics Core - **Building the Developer Soil.**
