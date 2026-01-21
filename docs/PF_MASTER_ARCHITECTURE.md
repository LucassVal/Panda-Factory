# 🐼 Panda OS - Arquitetura Completa

> **Documento Mestre de Arquitetura**
> Consolidação unificada seguindo o Mapa Visual do Projeto.
> Frontend → SDK → Backend Distribuído (3 Pilares).

---

## 📋 Índice

1. [Visão Geral (Mapas Visuais)](#1-visão-geral)
2. [Camada Frontend: Panda UI & Docks](#2-camada-frontend)
3. [Camada de Abstração: Panda SDK](#3-camada-sdk)
4. [Backend Pilar 1: Rust Agent (Hardware)](#4-pilar-rust)
5. [Backend Pilar 2: Firebase Colmeia (Signaling)](#5-pilar-firebase)
6. [Backend Pilar 3: GAS Backend (Serverless)](#6-pilar-gas)
7. [Segurança & Zero-Knowledge](#7-segurança)
8. [Ecossistema: Store, Monetização & Comunidade](#8-ecossistema)
9. [Roadmap de Implementação](#9-roadmap)
10. [Referências & Convenções](#10-referencias)

---

## 1. Visão Geral da Arquitetura

### 1.1. O Mapa Mestre

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Panda UI)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  App Dock   │  │  DevTools   │  │  Sidebar    │  │  Modules    │    │
│  │  (Esquerda) │  │  (Direita)  │  │  (Chat IA)  │  │  (CRM etc)  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                                   │                                      │
│                          ┌────────▼────────┐                            │
│                          │   PANDA SDK     │  ← O "Colchão"             │
│                          │  (JavaScript)   │                            │
│                          └────────┬────────┘                            │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   🦀 RUST AGENT     │  │   ☁️ FIREBASE       │  │   📜 GOOGLE APPS    │
│   (PC Local)        │  │   (Signaling)       │  │   SCRIPT (Backend)  │
│                     │  │                     │  │                     │
│ • GPU Detection     │  │ • Heartbeat         │  │ • Dados Planilha    │
│ • File System       │  │ • Comandos          │  │ • Wallet/Coins      │
│ • DLL/Exe Install   │  │ • Status Online     │  │ • Auth/Quotas       │
│ • MCP Server        │  │ • Telemetria        │  │ • Dispatcher Core   │
│ • Local AI (LLama)  │  │                     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
        │                                                    │
        │  DADOS NUNCA SAEM DAQUI                           │
        │  (Zero-Knowledge)                                  │
        └────────────────────────────────────────────────────┘
```

### 1.2. Detalhe do Hub Central (SDK)

```text
🐼 PANDA SDK
├── (Dev chama)
│   ├── Panda.Data.save
│   ├── Panda.Brain.chat
│   ├── Panda.Bridge.execute
│   └── Panda.GPU.process
└── (SDK traduz para)
    ├── GAS / Sheets (Persistência)
    ├── Firebase (Sinalização)
    ├── Rust Agent (Hardware/Local)
    └── APIs Externas (IA Cloud)
```

### 1.3. Fluxo de Dados Completo

```text
👨‍💻 DEV (Code) --> 🎯 SDK (Router)
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      🦀 RUST        📜 GAS      💾 CACHE
      (Local)       (Cloud)     (Offline)
         │             │           │
         ▼             ▼           ▼
    ⚡ Hardware    ☁️ Sheets    🔄 Sync Queue
    (GPU/DLLs)    (Drive)
         │             │           │
         └─────────────┼───────────┘
                       ▼
                  🔥 FIREBASE
                  (Signaling + Células)
```

---

## 2. Camada Frontend: Panda UI & Docks

A interface do Panda OS é composta por "Docks" flutuantes que vivem sobre a aplicação.

### 2.1. Estrutura do DevTools Dock

As 3 Abas do Desenvolvedor:

```text
┌─────────────────────────────────────────────┐
│  🧩 Extensions  │  💻 Console  │  🤖 Brain  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📦 PostgreSQL Connector    [Ativo]  │   │
│  │    Permite IA ler bancos locais     │   │
│  ├─────────────────────────────────────┤   │
│  │ 📄 PDF Parser              [Ativo]  │   │
│  │    Extrai texto de documentos       │   │
│  ├─────────────────────────────────────┤   │
│  │ 📈 MetaTrader Bridge       [Baixar] │   │
│  │    Conecta com MT4/MT5              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [+ Explorar Loja]                         │
└─────────────────────────────────────────────┘
```

### 2.2. Janelas Pop-out (Multi-Monitor)

O sistema suporta destacar docks para janelas separadas:

```javascript
// Core_Dock.js
const PandaDock = {
  popups: { console: null, brain: null, extensions: null },

  popout: function (type) {
    if (this.popups[type] && !this.popups[type].closed) {
      return this.popups[type].focus();
    }

    const win = window.open("", `Panda_${type}`, "width=500,height=700");

    // Injeta o conteúdo e mantém conexão com a janela pai
    win.document.write(`
            <html>
            <head><link rel="stylesheet" href="_system/styles.css"></head>
            <body>
                <div id="popout-root"></div>
                <script>
                    const Panda = window.opener.Panda;
                    // Agora o popup tem acesso total ao SDK!
                </script>
            </body>
            </html>
        `);

    this.popups[type] = win;
  },
};
```

---

## 3. Camada de Abstração: Panda SDK

### A Regra de Ouro

> **"O Módulo NUNCA fala com o Servidor. O Módulo fala com o Panda, e o Panda fala com o Servidor."**

### 3.1. Estrutura Global `Panda`

```javascript
window.Panda = {
    Data:   { get, save, list, delete },  // Abstração de Banco (Sheets/SQL)
    Wallet: { getBalance, charge },       // Economia (Panda Coins)
    Brain:  { chat, analyze, tools },     // IA (Gemini/Local)
    Bridge: { execute, readFile },        // Rust Agent (Hardware)
    GPU:    { process, isAvailable },     // Aceleração Gráfica
    UI:     { notify, modal, toast },     // Interface
    on/emit: (event, data) => {}          // Event Bus
};
```

### 3.2. Arquitetura de Slots & Adapters

```text
🔌 SDK SLOTS
├── (Core Protegido)
│   ├── Panda.use()
│   ├── Panda.version
│   └── Sandbox
├── (Slot Data)
│   ├── Default: Sheets
│   └── Adapters: MongoDB, Supabase, IndexedDB
├── (Slot Brain)
│   ├── Default: Gemini
│   └── Adapters: Claude, GPT-4, Local Llama
├── (Slot GPU)
│   ├── Default: Cloud
│   └── Adapters: CUDA, WebGPU
└── (Slot Render/Audio/Network)
    └── Adapters variados
```

---

## 4. Backend Pilar 1: Rust Agent (Hardware)

Este é o "Corpo Físico" do sistema no PC do usuário. Obrigatório para operações locais.

### 4.1. Mapa de Capacidades

```text
🦀 RUST AGENT
├── (Papel)
│   ├── Cache Manager
│   ├── MCP Server (Tools para IA)
│   └── Hardware Bridge
├── (Capacidades)
│   ├── GPU (CUDA/ROCm)
│   ├── Files (Read/Write)
│   ├── DLLs (MetaTrader/Drivers)
│   ├── Automation (Mouse/Keyboard/OCR)
│   └── Network (Proxy/VPN)
└── (Comunicação)
    └── Firebase Signaling (Heartbeat)
```

### 4.2. Deep Dive: MCP (Model Context Protocol)

O Rust expõe "Tools" que a IA pode invocar:

```rust
// pf_mcp.rs - Tools disponíveis
pub enum McpTool {
    // Filesystem
    FsRead { path: String },
    FsWrite { path: String, content: String },
    FsList { directory: String },

    // GPU
    GpuCheck,
    GpuProcess { model: String, input: Vec<f32> },

    // Automation (Bot/Farm)
    MouseMove { x: i32, y: i32 },
    KeyboardType { text: String },
    ScreenCapture { region: Option<Rect> },

    // Network
    RotateIp,
    GetFingerprint,
}
```

### 4.3. RIG Framework (Agentes Complexos)

```rust
// pf_rig.rs - Suporte multi-provider
use rig::providers::{gemini, anthropic, openai};

pub struct AgentRunner {
    providers: HashMap<String, Box<dyn Provider>>,
}

impl AgentRunner {
    pub async fn chat(&self, config: AgentConfig) -> Result<String> {
        let provider = self.providers.get(&config.provider)?;
        let agent = provider.agent(&config.model)
            .tool(McpToolset::new())
            .build();

        let (response, usage) = agent.chat(&config.input).await?;
        meter::track_usage(usage).await; // Billing
        Ok(response)
    }
}
```

### 4.4. Token Meter & Economy (pf_meter.rs)

Contagem e billing de tokens por provider:

```rust
pub async fn track_usage(user: &str, provider: &str, model: &str,
                         tokens_in: u64, tokens_out: u64) {
    let (_, rate_in, rate_out) = RATES.iter()
        .find(|(m, _, _)| *m == model)
        .unwrap_or(&("default", 0.05, 0.20));

    let cost = (tokens_in as f64 / 1000.0) * rate_in
             + (tokens_out as f64 / 1000.0) * rate_out;

    // Envia para Firebase
    firebase::push(&format!("pf_cells/{}/usage", user), &TokenUsage {
        cost_pc: cost,
        timestamp: chrono::Utc::now().timestamp(),
        // ...
    }).await;
}
```

### 4.5. Suporte Multi-User (Sessões Isoladas)

```rust
// pf_multiuser.rs
pub struct MultiUserSession {
    sessions: HashMap<String, UserSession>,
}

// Cada request identifica o usuário
pub async fn handle_request(user_id: &str, command: McpTool) -> Result<Response> {
    let session = sessions.get_session(user_id).ok_or("Auth failed")?;

    // Executa no contexto do usuário
    let result = execute_in_context(session, command).await?;

    // Billing para o usuário correto
    meter::track(session, &result.usage).await;

    Ok(result)
}
```

### 4.6. GPU Detection Flow & Economy

```mermaid
graph TD
    A[Start] --> B{Agent Online?}
    B -->|Yes| C[Check GPU]
    C -->|NVIDIA/AMD| D[LOCAL MODE (0 PC/h)]
    C -->|None| E[CLOUD MODE (30 PC/h)]
    B -->|No| E
```

---

## 5. Backend Pilar 2: Firebase Colmeia (Signaling)

O Firebase atua APENAS como canal de sinalização e sincronia em tempo real. Não armazena dados persistentes de negócio.

### 5.1. Estrutura Colmeia (Cells)

```text
🔥 FIREBASE
├── (Core Zone)
│   └── Version/Status
├── (Células Isoladas)
│   ├── Developer Cell (Sandbox)
│   └── Client Cell (Dados Privados + Quotas)
└── (Signaling)
    ├── command_queue (Browser -> Rust)
    ├── response_stream (Rust -> Browser)
    └── agent_status
```

### 5.2. Segurança da Colmeia

Rules garantem que `auth.uid === cell_id`. Um cliente nunca acessa a célula de outro.

---

## 6. Backend Pilar 3: GAS Backend (Serverless)

O Google Apps Script (GAS) é o "Cérebro Lógico" e Banco de Dados (Sheets).

### 6.1. Estrutura DDD (Domain Driven Design)

Organizamos o backend em "Domínios" (Chapéus) para escalar:

```text
📜 GAS BACKEND
├── core/                   # Kernel do Sistema
│   ├── PF_Dispatcher.gs    # O "Porteiro" (Entry Point)
│   ├── PF_Config.gs        # Configurações Globais
│   ├── PF_Services.gs      # AI, Webhooks
│
├── domains/                # Os "Chapéus"
│   ├── finance/
│   │   ├── PF_Wallet.gs    # Ledger (Voltímetro)
│   │   ├── PF_Fiat.gs      # Gateways (Stripe)
│   │   └── PF_Crypto.gs    # Blockchain
│   ├── store/
│   │   ├── PF_Registry.gs  # Catálogo
│   │   └── PF_Sales.gs     # Split
│   └── automation/
│       └── PF_Bots.gs      # Farms
└── integrations/
    ├── Gmail, Calendar, Drive
    └── Webhooks (Hotmart/Kiwify)
```

### 6.2. O Dispatcher Único (PF_Dispatcher.gs)

Todo request passa por aqui:

```javascript
function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const user = PF_Auth.validate(req.token); // Autenticação Central

    // Roteamento DDD
    switch (req.domain) {
      case "FINANCE":
        return PF_Finance.handle(req.action, req.payload, user);
      case "STORE":
        return PF_Store.handle(req.action, req.payload, user);
      // ...
    }
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: err.message }),
    );
  }
}
```

### 6.3. Backend Multi-User (PF_Core_MultiUser.gs)

```javascript
// Obtém tenant do usuário atual
function getCurrentTenant() {
  const user = Session.getActiveUser().getEmail();
  const row = getTenantSheet().createTextFinder(user).findNext();

  if (!row) throw new Error("User not in any tenant");

  return {
    tenantId: row.getValues()[0][0],
    role: row.getValues()[0][2],
    quotas: JSON.parse(row.getValues()[0][3]),
  };
}

// Escrita isolada
function saveData(collection, data) {
  const tenant = getCurrentTenant();
  data.__tenant_id__ = tenant.tenantId; // Stamp forçado

  const sheet = SpreadsheetApp.openById(tenant.tenantId).getSheetByName(
    collection,
  );
  sheet.appendRow(Object.values(data));
}
```

---

## 7. Segurança & Zero-Knowledge

### 7.1. Princípio Fundamental

> **"A Panda Fabrics não vê seus dados. O processamento é Local ou na Nuvem privada do Tenant."**

### 7.2. Camadas de Segurança (Layers)

```text
LAYER 1: FRONTEND (Input Validation)
      ▼
LAYER 2: TRANSPORTE (HTTPS + Firebase Auth)
      ▼
LAYER 3: BACKEND GAS (Cell Isolation + DDD)
      ▼
LAYER 4: RUST AGENT (Assinatura Digital + Sandbox)
      ▼
LAYER 5: ADMIN (Audit + Kill Switch)
```

### 7.3. Estratégia Open Core (Anti-Fork)

O `pf-agent` é Open Source, mas a compilação oficial (`official_build`) inclui chaves proprietárias para acessar a Store e a Nuvem Panda. Forks não conseguem se conectar ao ecossistema oficial.

---

## 8. Ecossistema: Store, Monetização & Comunidade

### 8.1. Visão Geral da Store

Marketplace onde devs publicam módulos.

- **Fontes:** GitHub (tag `panda-sdk`).
- **Review:** Automático (Lint/Security).

### 8.2. Fluxo: Dev → Store → Cliente

```text
[👨‍💻 DEV] --> (Desenvolve/Testa) --> [📦 CÉLULA DEV]
    │
    ▼
[🏪 STORE] <-- (Busca GitHub)
    │
    ├── (Venda: 70% Dev / 30% Panda)
    ▼
[👤 CLIENTE] --> (Compra/Instala) --> [Cache Local Rust]
```

### 8.3. Modelos de Monetização

1.  **Venda Direta:** Preço fixo (ex: 500 PC).
2.  **Energy Fee:** Markup sobre consumo de API (ex: User gasta 100 PC, paga 120 PC. Dev ganha 20).
3.  **B2B Bundle:** Venda externa (Kiwify) com Webhook creditando PCs.
4.  **Afiliados:** % perpétua sobre indicados.

### 8.4. Tabela de Custos (Exemplo)

| Modelo          | Custo Base/1k Tokens | Preço Varejo (x2.5) |
| :-------------- | :------------------- | :------------------ |
| Gemini Flash    | 0.03 PC              | 0.07 PC             |
| GPT-4o          | 0.60 PC              | 1.50 PC             |
| **Local Llama** | **0.00 PC**          | **0.00 PC**         |

---

## 9. Roadmap de Implementação

### Cronograma Visual (12 Semanas)

```text
        Semana  1   2   3   4   5   6   7   8   9  10  11  12
                │   │   │   │   │   │   │   │   │   │   │   │
RUST AGENT  ════█═══█═══█═══┐
PF-SDK                      └═══█═══█═══█═══┐
PF-FACTORY                                  └═══█═══█═══█═══┐
PF-STORE                                                    └═══█═══█═══█
```

- **Fase 1 (Rust):** Conexão Firebase, GPU Detect, MCP Básico.
- **Fase 2 (SDK):** Slots, Adapters, Offline Sync.
- **Fase 3 (Factory):** UI Components, Docks, Module Loader.
- **Fase 4 (Store):** GitHub Registry, Pagamentos, Webhooks.

---

## 10. Referências & Convenções

### 10.1. Convenção de Nomes (PF)

- **GitHub Repos:** `pf-sdk`, `pf-agent`, `pf-registry`
- **GAS Scripts:** `PF_Dispatcher`, `PF_Wallet`
- **JS Internal:** `PF._cache`
- **JS Public:** `Panda.Data`
- **Eventos:** `pf:ready`
- **CSS Vars:** `--pf-primary`

### 10.2. Mapa da Documentação

- `PF_MASTER_ARCHITECTURE.md`: Este arquivo (A Bíblia).
- `ARCHITECTURE_FIREBASE_RUST.md`: Spec técnica profunda do Rust.
- `README.md`: Entry point para devs novatos.

---

## 11. Resumo Visual Final

```text
    [🖥️ FRONTEND]              [☁️ BACKEND]              [🌐 EXTERNOS]

    Panda UI ─────────────────► GAS (DDD) ───────────► Gemini API
       │                           │                   GitHub Store
       ▼                           ▼                   Webhooks
    SDK JS ══════════════════► Firebase
       │                           ▲
       │ (WebSocket/Http)          │ (Sync)
       ▼                           │
    [🖥️ LOCAL PC]                  │
                                   │
    🦀 RUST AGENT ═════════════════╝
       │
       ├── GPU Process (CUDA/Metal)
       ├── Cache Local (Files)
       └── DLLs (Drivers)
```

> _Panda Fabrics - Arquitetura Refatorada 2026_
