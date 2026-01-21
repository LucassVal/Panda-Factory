# 🐼 Panda Factory - Modular Operating System

> **Single Source of Truth** | Versão 3.0.0 | [Repositório Oficial](https://github.com/LucassVal/SAAS)

**Nota:** Este documento consolida **todo** o conhecimento do ecossistema Panda Factory (formerly Panda Fabrics): Estratégia, Código, Infraestrutura e Regras.

> [!TIP]
> **v3.0.0:** Refatoração Modular OS, Kernel isolado (`panda.core.js`), módulos dinâmicos, Store integrada. [Ver Changelog](#10--changelog)

---

## 💻 Estrutura da Interface (UI/UX)

A interface foi redesenhada para oferecer uma experiência "Clean Canvas" focada na produtividade.

### 1. Home View "Clean Canvas" (`#inicio-view`)

- **Loading Screen (`#panda-loading`):** Animação inicial suave do Panda.
- **Omni Search Bar (`#omni-trigger`):** Barra flutuante centralizada e arrastável.

### 2. Official App Dock (`#appDock`)

Dock flutuante (estilo macOS) na parte inferior:

- **Drag Handle:** Área para arrastar.
- **Nav Items:** Home, Contatos, Agenda, Relatórios.
- **Ações:** Configurações (⚙️) e Logout (🚪).

```html
<!-- Exemplo Dock -->
<div class="app-dock" id="appDock">
  <div class="dock-handle">...</div>
  <div class="nav-item">🏠</div>
  ...
</div>
```

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

### 🔒 Protocolo de Segurança (Data Shield V2)

Para garantir integridade e LGPD no modelo híbrido (Firebase + Drive):

1.  **Hot Layer (Firebase):** Usado apenas como **Barramento de Mensagem (Signaling)**. Dados são efêmeros (TTL curto) e criptografados (E2E).
2.  **Cold Layer (Drive):** O banco de dados real (persistência) reside no Google Drive do Cliente. A Panda Fabrics **não tem acesso**.
3.  **Client-Side Encryption:** Dados sensíveis são cifrados no navegador antes de tocar nossa infra.
4.  **Isenção:** A Panda fornece a "Estrada" (Software via GAS), o cliente dirige o "Carro" (Dados).

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

### 3. 🐼 Panda Agent (Firebase Signaling)

Evolução da arquitetura para v2.0. Em vez de WebSockets locais (frágeis), usamos o Firebase como **Signaling Server** (Barramento de Mensagens).

```
┌─────────────┐       HTTPS (SSE)       ┌─────────────────────┐
│   CHROME    │ ◄─────────────────────► │  PANDA AGENT (Rust) │
│  (Panda UI) │      via Firebase       │  (Daemon Local)     │
└─────────────┘                         └─────────────────────┘
       │                                           │
       ▼                                           ▼
┌─────────────┐                         ┌─────────────────────┐
│  FIREBASE   │                         │  MetaTrader DLL     │
│ Realtime DB │                         │  Binance SDK        │
│ (Hot Layer) │                         │  NVIDIA CUDA        │
└─────────────┘                         └─────────────────────┘
```

**Benefícios da Nova Arquitetura:**

- ✅ **Sem Problemas de Porta/Firewall:** Usa HTTPS padrão (443).
- ✅ **Persistência de Comandos:** Se o agente cair, o comando fica na fila.
- ✅ **Estado Global:** O status do agente é visível para qualquer aba aberta.

#### 🛠️ Capacidades Expandidas (Local OS Bridge)

O Rust não serve apenas para GPU. Ele atua como as "Mãos" do sistema:

1.  **Financeiro:** Ponte DLL para MetaTrader, ProfitChart e Terminais Bancários.
2.  **RPA (Ghost User):** Controle de Mouse/Teclado para operar ERPs legados.
3.  **Hardware/IoT:** Acesso nativo a Impressoras Térmicas, Balanças e Sensores USB.
4.  **Local AI:** Rodar Llama 3 offline para privacidade absoluta.

#### 🛡️ Protocolo de Segurança (CYA)

- **Permissão Explícita:** Pop-ups estilo Android para cada novo acesso ("Permitir leitura de C:\?").
- **Assinatura Digital:** Bloqueio de plugins não assinados pela Panda.
- **Kill Switch:** Desativação remota global em caso de emergência.

📄 Detalhes técnicos completos: [`ARCHITECTURE_FIREBASE_RUST.md`](./ARCHITECTURE_FIREBASE_RUST.md)

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

---

## 🎮 GPU Detection Flow

```
Site carrega → Conecta ws://localhost:9999
       │
       ├── Agent conectado?
       │   ├── SIM → Panda.Agent.execute('check_gpu')
       │   │        ├── GPU detectada → LOCAL MODE (0 PC)
       │   │        │   └── NVIDIA/AMD/Apple Metal
       │   │        └── Sem GPU → CLOUD MODE (30 PC/h)
       │   │
       │   └── NÃO → Mostra: "Instalar Panda Agent"
       │           → Fallback para Cloud (30 PC/h)
       │
Modal de Economia:
┌─────────────────────────────────────────┐
│ 🖥️ GPU Detectada: NVIDIA RTX 3080      │
│ ⚡ Modo: LOCAL (0 tokens/hora)          │
│ 💰 Economia estimada: 720 PC/dia       │
└─────────────────────────────────────────┘
```

---

## 🗄️ Arquitetura de Banco de Dados (Multi-Tenant)

### Modelo: Ghost Cells + Planilhas Modulares

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUTURA MULTI-TENANT                       │
├─────────────────────────────────────────────────────────────────┤
│  TENANT (Loja/Empresa)                                          │
│  ├── config.json          → Configurações específicas           │
│  ├── users/               → Multi-usuário por tenant            │
│  │   ├── user_001.json                                          │
│  │   └── user_002.json                                          │
│  ├── modules/             → Módulos ativados                    │
│  │   ├── fiscal/          → NFe, NFCe, SPED                     │
│  │   ├── crm/             → Clientes, Leads                     │
│  │   └── store/           → Produtos, Estoque                   │
│  └── data/                → Planilhas com Ghost Cells           │
│      ├── clientes.sheet   → [ID, Nome, ..., __ghost__]          │
│      └── vendas.sheet     → [ID, Data, ..., __ghost__]          │
└─────────────────────────────────────────────────────────────────┘
```

### Ghost Cells (Schema Extensível)

Cada planilha tem colunas reservadas para extensão futura:

| Coluna          | Tipo   | Descrição                      |
| --------------- | ------ | ------------------------------ |
| `__ghost_1__`   | ANY    | Campo customizável pelo módulo |
| `__ghost_2__`   | ANY    | Campo customizável pelo módulo |
| `__meta__`      | JSON   | Metadados extensíveis          |
| `__tenant_id__` | STRING | Isolamento multi-loja          |

### Recomendações de Banco de Dados

| Cenário               | Tecnologia                | Vantagem                  |
| --------------------- | ------------------------- | ------------------------- |
| **Offline-First**     | IndexedDB + Dexie.js      | Funciona sem internet     |
| **Multi-User Sync**   | Google Sheets API         | Colaboração em tempo real |
| **High Performance**  | Firebase Realtime         | <100ms latency            |
| **Enterprise**        | PostgreSQL + Supabase     | ACID, Row-Level Security  |
| **Fiscal/Compliance** | Google Sheets + Backup S3 | Auditoria + Criptografia  |

### Segurança (Blindagem)

```javascript
// Exemplo: Row-Level Security no Supabase
create policy "tenant_isolation" on clientes
  using (tenant_id = current_tenant());

// Criptografia de campos sensíveis
const encrypted = Panda.Crypto.encrypt(cpf, TENANT_KEY);
```

**Camadas de Proteção:**

1. **Tenant Isolation** - Cada loja só vê seus dados
2. **Field Encryption** - CPF, cartões criptografados
3. **Audit Log** - Toda alteração é registrada
4. **Backup Automático** - Google Drive + versionamento

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

## [2.4.0] - 2026-01-20 (Premium Styling & Omni-Bar)

### 🎨 Adicionado

- **Premium Header**: Design estilo "Ilha Flutuante" (Floating Island) com contam de vidro (Glassmorphism), bordas arredondadas (24px) e sombra suave.
- **Omni Search Bar Integrada**: Substituição da janela flutuante (`overlay`) por uma barra integrada na raiz (`root level`), com posição fixa e digitação direta. Zero layout jumps.
- **Estética Visual**:
  - Gradient Background Radial (Suave e Profundo) para Light/Dark mode via CSS Variables.
  - Isolamento de Gradiente no Logo (Emoji 🐼 preservado vs Texto com gradiente).
  - Dock de Apps com delineação refinada e opacidade adaptativa.
- **Header Refinement**: Reforço da borda e remoção de estilos inline opacos para suporte real a termas translúcidos.

### 🔧 Corrigido

- **Omni-Bar Jumps**: Corrigido comportamento onde clicar no gatilho saltava o layout da página.
- **CSS Encapsulation**: Corrigido bloco CSS exposto (texto cru) no Header.
- **Window Constraints**: Liberada janela de busca (`#omni-trigger`) da restrição do container pai (`#inicio-view`), permitindo flutuação livre.

## [3.0.0] - 2026-01-20

### 🚀 Novo

- **Panda Factory**: Rename de "CRM" para "Panda Factory" - sistema operacional modular
- **Kernel Isolado**: Todo código JS movido para `js/panda.core.js` (~185KB)
- **Module Loader**: Sistema dinâmico de carregamento de módulos (`js/ModuleLoader.js`)
- **Store Module**: Marketplace de apps integrado ao Dock (🏪)
- **Developer Lock**: Módulos podem ser travados (`locked: true`) para impedir fechamento
- **Dock Closeables**: Badge "X" para fechar apps não-locked

### 🎨 Alterado

- **Arquivo Principal**: `CRM.html` → `PandaFactory.html`
- **Módulos Isolados**: CRM, Agenda, Reports movidos para `modules/*/index.html`
- **Logout no Header**: Botão de sair agora fica no header (vermelho degradê)
- **Store no Dock**: Loja substituiu botão de logout no dock

### 🔧 Corrigido (CRM Module)

- **Field ID Mismatch**: `newClientNome` → `newClientName` (alinhado com core)
- **Campos Faltantes**: Adicionados `newClientData` (date) e `newClientPhone` (tel)
- **Duplicate Field**: Removido campo duplicado "Observações"
- **DOM Structure**: Removida `</div>` extra que quebrava hierarquia

## [2.4.1] - 2026-01-20

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

---

# 11. 🏗️ Arquitetura de Componentes vs Módulos

A estrutura do projeto foi dividida para separar o **Core do Sistema** (imutável/fixo) dos **Módulos Dinâmicos** (extensíveis/loja).

```text
📁 components/          ← COMPONENTES FIXOS (Core do Sistema)
│   ├── header-status.html      ✅ Status do Sistema, User, Configs
│   ├── app-dock.html           ⚠️ [Em Breve] Barra de Apps (Esquerda)
│   ├── devtools-dock.html      ⚠️ [Em Breve] Ferramentas Dev (Direita)
│   ├── settings-modal.html     ⚙️ Modal de Configurações
│   └── sidebar.html            Navigation (se aplicável)
│
📁 modules/             ← MÓDULOS DINÂMICOS (Loja de Apps)
    ├── crm/            👥 CRM Avançado (Instalável)
    ├── analytics/      📈 Dashboards (Instalável)
    └── finance/        💰 Gestão Financeira (Instalável)
```

### Diferenciação

| Tipo                  | Diretório     | Descrição                                            | Carregamento                    |
| :-------------------- | :------------ | :--------------------------------------------------- | :------------------------------ |
| **Componentes Fixos** | `components/` | Parte vital do OS (Header, Docks). Sempre presentes. | Boot Inicial (Estático/Include) |
| **Módulos Dinâmicos** | `modules/`    | Apps opcionais criados por terceiros ou pela Panda.  | On-Demand (ModuleLoader)        |
