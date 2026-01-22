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
7. [Infraestrutura Híbrida: VMs & BYOD](#7-infraestrutura-hibrida)
8. [Segurança & Zero-Knowledge](#8-segurança)
9. [Ecossistema: Tokenomics & Monetização](#9-ecossistema)
10. [Roadmap de Implementação](#10-roadmap)
11. [Referências & Convenções](#11-referencias)

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

```text
[SITE PANDA]
      │
      ▼
 ┌───────────────┐
 │ AGENT ONLINE? │
 └──────┬────────┘
        │ Não ───────────────┐
        │                    │
        │ Sim                ▼
        ▼              [CLOUD MODE]
 ┌───────────────┐     (30 PC/h)
 │ DETECTAR GPU  │
 └──────┬────────┘           ▲
        │                    │
        ├──── Nenhuma ───────┘
        │
        │ Sim (NVIDIA/AMD)
        ▼
  [LOCAL MODE]
  (0 PC/h - GRÁTIS)
```

### 4.7. Módulos Avançados do Rust Agent

O Rust não é apenas GPU. É a **ponte** para o mundo real do Sistema Operacional:

#### A. Módulo Financeiro & Trade (DLL Bridge)

Plataformas de mercado financeiro (MetaTrader 4/5, Profitchart) só aceitam integração via **DLL Windows**.

- O Rust carrega `mt5.dll` e expõe funções como `OrderSend()` via Firebase.
- O SaaS Web envia ordens para terminais Desktop legados.

#### B. Módulo RPA / Ghost User

Para sistemas sem API nem DLL (ERPs antigos):

- O Rust controla **Mouse e Teclado** (`enigo`, `winapi`).
- O SaaS diz "Cadastrar Cliente X". O Rust abre janela, digita e salva.

#### C. Módulo IoT & Hardware

Acesso total a periféricos que o navegador não consegue:

- Impressoras Térmicas (ESC-POS)
- Balanças de precisão (Porta COM)
- Leitores Biométricos

#### D. Local AI Intelligence (Offline Brain) 🧠

Para privacidade absoluta:

- O Rust roda **Llama 3 / Mistral** quantizado localmente.
- PDFs sigilosos são processados no PC. Apenas o resumo vai para a nuvem.

#### E. Filesystem Watcher (Modo Dropbox) 📂

O navegador não monitora pastas. O Rust pode:

- Detecta arquivo novo em `C:\Downloads\Notas`.
- Faz parse automático e envia para o SaaS: _"Nova NF detectada!"_.

#### F. OS HUD / Overlay (DirectX Hook) 🕹️

Para Traders e Gamers:

- O Rust desenha **Overlay Transparente** sobre outros apps.
- Mostra "Vendas Hoje: R$ 5.000" sem alt-tab.

---

## 5. Backend Pilar 2: Firebase Colmeia (Signaling)

O Firebase atua APENAS como canal de sinalização e sincronia em tempo real. Não armazena dados persistentes de negócio.

### 5.1. Arquitetura de Dados (Schema)

A árvore de dados é efêmera e segregada por `user_uid`:

```json
{
  "pf_cells": {
    "user_uuid_123": {
      "command_queue": {
        "cmd_id_x": {
          "action": "EXECUTE_DLL",
          "payload": { "symbol": "BTCUSD", "volume": 1.0 },
          "timestamp": 1700000000
        }
      },
      "response_stream": {
        "cmd_id_x": {
          "status": "SUCCESS",
          "data": { "ticket": 998877 },
          "completed_at": 1700000005
        }
      },
      "agent_status": {
        "online": true,
        "last_ping": 1700000010,
        "gpu_model": "RTX 4090",
        "version": "2.0.0"
      }
    }
  }
}
```

### 5.2. Regras de Segurança (Firestore Rules)

Garante que usuários não leiam dados uns dos outros:

```javascript
{
  "rules": {
    "pf_cells": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

### 5.3. Fluxo de Execução (Browser ↔ Rust)

```text
[🖥️ BROWSER]                [🔥 FIREBASE]              [🦀 RUST AGENT]
      │                           │                           │
      │ 1. PUSH COMANDO ──────────▶│                           │
      │                           │ 2. SSE EVENT ─────────────▶│
      │                           │                           │ 3. EXECUTA LOCAL
      │                           │◀───────── 4. ESCREVE ──────│
      │◀────── 5. ATUALIZA ───────│                           │
```

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

## 7. Infraestrutura Híbrida: O Tecido (The Fabric)

> **Filosofia:** "Hardware é commodity. A inteligência está na Orquestração."

A Panda Fabrics opera uma arquitetura **DePIN (Decentralized Physical Infrastructure Network)** que estende a robustez da Google Cloud até a borda (Edge). Essa abordagem híbrida nos posiciona estrategicamente como parceiros de eficiência, oferecendo **SLA Enterprise com Custo de Hobby**.

### 7.1. Panda Cloud VM: A "Frota Fantasma" (Ghost Fleet)

Utilizamos arbitragem de preços de computação para criar máquinas virtuais efêmeras, resilientes e alinhadas ao ecossistema Google.

- **Google Cloud Spot Instances:** Consumimos capacidade ociosa de Data Centers do Google com 70-90% de desconto. Isso gera volume de uso para nossa parceria (Google Partner) enquanto reduz o TCO para o cliente.
- **The Safety Net Protocol (Resiliência):**
  1.  O **Panda Orchestrator** sobe uma instância Spot barata (ex: Google e2-standard-4).
  2.  O **Rust Agent** roda nela e inicia o processamento.
  3.  Se o Google envia o sinal de desligamento (SIGTERM - 30s de aviso):
      - O Agente "congela" o estado da memória (Snapshot em tempo real).
      - O estado é transferido instantaneamente para outra Spot ou para o **PC Local** do usuário.
      - O processamento continua sem perda de dados (Zero-Downtime aparente).

### 7.2. BYOD: Panda Swarm (Google-Managed Edge)

Estendemos o alcance da nuvem Google para a borda. O Panda Factory atua como o **Control Plane** (hospedado no GCP) que orquestra recursos descentralizados para cargas de trabalho específicas que não exigem SLA de Data Center.

#### A. Edge Computing Complementar

Capturamos cargas de trabalho que tradicionalmente não iriam para a nuvem (devido a custo ou latência) e as integramos ao ecossistema.

- **Data Gravity:** Embora o processamento ocorra na borda, os dados gerados (logs, resultados, datasets) são sincronizados de volta para o **Google Cloud Storage** e **BigQuery**, gerando valor de dados para o cliente.

#### B. Casos de Uso Específicos (Non-Cloud Native)

Focamos a Swarm em tarefas onde a nuvem pública não é a melhor ferramenta:

- **Residencial IP Mesh:** Para coleta de dados pública onde IPs de Data Center são bloqueados.
- **Hyper-Local Latency:** Processamento em tempo real próximo ao usuário final.

#### C. Caminho para a Nuvem (Upsell Nativo)

A Swarm serve como ambiente de desenvolvimento e teste de baixo custo. Quando a aplicação exige escala e confiabilidade, o Panda Factory oferece **migração "One-Click" para Google Cloud Spot (Tier 3)**, atuando como um funil de aquisição de novos workloads para o GCP.

### 7.3. BYOL: Bring Your Own License (O Escudo Jurídico)

Resolvemos o complexo problema de licenciamento de software proprietário em nuvem através da técnica de **Injeção em Tempo de Execução**.

- **Arquitetura "Hollow Shell" (Casca Oca):**
  - A Panda fornece apenas a infraestrutura (CPU, RAM, OS Base, Drivers).
  - A Panda **NÃO** hospeda, vende ou distribui binários de terceiros (ex: MetaTrader, Photoshop).
- **Processo de Injeção:**
  1.  O usuário conecta seu cofre pessoal (Storage Privado).
  2.  No boot da VM (Cloud ou Local), o script do Panda injeta o executável e a licença do usuário na memória volátil.
  3.  O software roda legitimamente sob a licença do usuário final.
- **Compliance:** Atuamos estritamente como provedor de "Metal", isentando a plataforma de passivos de propriedade intelectual.

### 7.4. Resumo Visual da Orquestração

```text
       [ GOOGLE CLOUD PLATFORM (Control Plane) ]
       (Orquestrador + Auth + Database + AI)
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
    [ TIER 2: EDGE ]      [ TIER 3: CORE ]
      Panda Swarm           Google Spot VM
    (Custo & Alcance)      (SLA & Potência)
           │                     │
           └──────────┬──────────┘
                      ▼
             [ DATA INGESTION ]
          (BigQuery / Cloud Storage)
```

> **Tier 1 (Local):** Hardware do usuário, latência zero, grátis.
> **Tier 2 (Edge):** Swarm residencial, IPs valiosos, pago em Coins.
> **Tier 3 (Core):** Google Spot VMs, SLA enterprise, pago em Fiat/Coins.

---

## 8. Segurança & Zero-Knowledge

### 8.1. Princípio Fundamental

> **"A Panda Fabrics não vê seus dados. O processamento é Local ou na Nuvem privada do Tenant."**

### 8.2. Camadas de Segurança (Layers)

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

### 8.3. Estratégia Open Core (Anti-Fork)

O `pf-agent` é Open Source, mas a compilação oficial (`official_build`) inclui chaves proprietárias para acessar a Store e a Nuvem Panda. Forks não conseguem se conectar ao ecossistema oficial.

### 8.4. Modelo de Permissões "Android-Style" 🛡️

O Rust **NUNCA** executa ações perigosas silenciosamente:

- **Request:** O site pede: "Ler pasta C:\Notas".
- **Pop-up Desktop:** "O App Panda CRM deseja ler sua pasta de Notas. [Permitir] [Bloquear]".
- **Persistência:** O usuário aceita explicitamente. Isso isenta a Panda de responsabilidade.

### 8.5. Assinatura Digital de Plugins (Code Signing) ✍️

Para evitar uso malicioso:

- O Rust só carrega DLLs/Plugins com **Assinatura Criptográfica da Panda Fabrics**.
- Drivers não assinados são bloqueados: _"Assinatura Inválida"_.
- **Review:** Equipe audita código antes de assinar e publicar na Store.

### 8.6. Termos de Uso (Isenção)

> "O Panda Agent é uma ferramenta de automação passiva. A Panda Fabrics **não se responsabiliza** por perda de dados, ordens financeiras erradas ou mau uso. O usuário detém controle total e responsabilidade final sobre as permissões concedidas."

### 8.7. Botão de Pânico (Kill Switch) 🚨

Se detectarmos vulnerabilidade global:

- Firebase envia sinal `EMERGENCY_STOP`.
- **Todos** os Agents entram em "Modo Seguro" (leitura apenas) instantaneamente.

### 8.8. Ed25519 Founder Authentication (O Anel do Rei) 👑

> **STATUS: PRONTO (Não Ativo)** - Arquitetura documentada, implementação mock no SDK.

O sistema distingue o **Founder (Deus)** dos **Mortais (Usuários)** usando **Criptografia Assimétrica Ed25519**.

#### A. Conceito: Assinatura Digital como "Crachá Infalsificável"

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     FLUXO DE AUTENTICAÇÃO FOUNDER                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [RUST AGENT]              [FIREBASE]              [GAS BACKEND]        │
│  (PC do Lucas)             (Signaling)             (Verificação)        │
│       │                        │                        │               │
│       │ 1. ASSINA COMANDO ─────┤                        │               │
│       │    (Private Key)        │                        │               │
│       │                        │ 2. TRANSMITE ──────────┤               │
│       │                        │    (payload+sig)       │               │
│       │                        │                        │ 3. VERIFICA   │
│       │                        │                        │    (Public    │
│       │                        │                        │    Key)       │
│       │                        │                        │       │       │
│       │                        │◀────── 4. OK ──────────│       │       │
│       │                        │                        │               │
└─────────────────────────────────────────────────────────────────────────┘

🔐 Private Key: Nunca sai do PC do Lucas (OS Keychain)
🔓 Public Key: Hardcoded no Backend (imutável)
```

#### B. Tecnologia: Por que Ed25519?

| Característica    | Ed25519                       | RSA            |
| ----------------- | ----------------------------- | -------------- |
| **Segurança**     | 128-bit equivalent            | 112-bit (2048) |
| **Velocidade**    | ~10x mais rápido              | Lento          |
| **Tamanho Chave** | 32 bytes (público)            | 256 bytes      |
| **Usado por**     | SSH, Signal, Solana, SSH Keys | Legacy         |

**Bibliotecas:**

- **JavaScript:** `tweetnacl` (TweetNaCl.js)
- **Rust:** `ed25519-dalek`
- **GAS:** Via Rust Agent (GAS não tem crypto nativo)

#### C. Implementação: Geração de Chaves (One-Time)

```javascript
// Script local (Node.js) - Executar UMA VEZ no PC do Founder
const nacl = require("tweetnacl");
const fs = require("fs");

const keyPair = nacl.sign.keyPair();

// 1. SECREDO ABSOLUTO - Salvar em local seguro (OS Keychain)
const privateKey = Buffer.from(keyPair.secretKey).toString("hex");
fs.writeFileSync("./.panda/lucas_god_key.secret", privateKey);

// 2. PÚBLICO - Hardcode no Backend
const publicKey = Buffer.from(keyPair.publicKey).toString("hex");
console.log("FOUNDER_PUBLIC_KEY:", publicKey);
// Ex: "a1b2c3d4e5f6..."
```

#### D. SDK Integration (Mock - Pronto para Produção)

```javascript
// js/pf.sdk.js - Módulo Panda.Auth (v0.7+)
Panda.Auth.signCommand = async (payload) => {
  // 1. Serializa o payload
  const message = JSON.stringify(payload);

  // 2. Requisita assinatura ao Rust Agent via Bridge
  const result = await Panda.Bridge.execute("sign_payload", { message });

  // 3. Retorna payload + signature + timestamp
  return {
    payload,
    signature: result.signature, // hex string
    timestamp: Date.now(),
    signer: "FOUNDER",
  };
};

// Verificação (Client-side - informativo)
Panda.Crypto = {
  FOUNDER_PUBLIC_KEY: "a1b2c3d4...", // Hardcoded
  verify: (message, signature) => {
    // TweetNaCl verification
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      hexToUint8(signature),
      hexToUint8(Panda.Crypto.FOUNDER_PUBLIC_KEY),
    );
  },
};
```

#### E. Rust Agent: Assinatura Segura

```rust
// pf_crypto.rs - Signing com chave do OS Keychain
use ed25519_dalek::{Signer, SigningKey};
use keyring::Entry;

pub fn sign_payload(payload: &str) -> Result<String, CryptoError> {
    // 1. Carrega chave privada do OS Keychain (não arquivo)
    let entry = Entry::new("panda_fabrics", "founder_key")?;
    let secret_hex = entry.get_password()?;
    let secret_bytes = hex::decode(secret_hex)?;

    // 2. Reconstrói a SigningKey
    let signing_key = SigningKey::from_bytes(&secret_bytes)?;

    // 3. Assina o payload
    let signature = signing_key.sign(payload.as_bytes());

    // 4. Retorna hex da assinatura
    Ok(hex::encode(signature.to_bytes()))
}
```

#### F. Backend Verification (GAS)

```javascript
// PF_Auth.gs - Verificação no Servidor
const FOUNDER_PUBLIC_KEY_HEX = "a1b2c3d4e5f6..."; // HARDCODED

function verifyFounderAction(payload, signatureHex) {
  // Delega verificação ao Rust Agent (GAS não tem nacl)
  const result = callRustAgent("verify_signature", {
    message: JSON.stringify(payload),
    signature: signatureHex,
    publicKey: FOUNDER_PUBLIC_KEY_HEX,
  });

  if (!result.valid) {
    throw new Error("🚨 ALERTA: Assinatura Founder INVÁLIDA! Ação bloqueada.");
  }
  return true;
}

function isFounderAction(request) {
  return (
    request.signature && verifyFounderAction(request.payload, request.signature)
  );
}
```

#### G. Defesa em Profundidade (4 Barreiras)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     CAMADAS DE PROTEÇÃO CONTRA REBELIÃO                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BARREIRA 1: READ-ONLY CORE                                             │
│  ├── Binário do Rust Agent é ASSINADO                                   │
│  └── IA não pode reescrever o próprio código                            │
│                                                                         │
│  BARREIRA 2: WASM SANDBOX                                               │
│  ├── Plugins rodam em WebAssembly isolado                               │
│  └── Sem acesso a fs/network exceto injetado                            │
│                                                                         │
│  BARREIRA 3: OS KEYCHAIN (Secure Enclave)                               │
│  ├── Chave privada NUNCA em arquivo de texto                            │
│  ├── Windows: Credential Manager                                        │
│  └── macOS: Keychain Access                                             │
│                                                                         │
│  BARREIRA 4: HUMAN-IN-THE-LOOP                                          │
│  ├── Ações críticas exigem POP-UP de confirmação                        │
│  └── Transferências, Deletes, Admin = Founder aprova                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### H. Compatibilidade Blockchain (Futuro)

O Ed25519 é **nativamente compatível** com:

| Blockchain   | Curva     | Compatibilidade         |
| ------------ | --------- | ----------------------- |
| **Solana**   | Ed25519   | ✅ Mesma curva (direto) |
| **Ethereum** | secp256k1 | ⚠️ Conversão necessária |
| **Polkadot** | Ed25519   | ✅ Nativo               |

> **Roadmap:** Quando migrar para on-chain, a chave Ed25519 do Founder pode virar uma Wallet Solana real.

---

## 9. Ecossistema: Tokenomics & Monetização

> **Filosofia:** "O Token é Energia. Quem produz, ganha. Quem consome, paga. O Fundador recebe eternamente."

### 9.1. Estrutura de Valor do Panda Coin (PC)

O PC é **Energy Credit** lastrado em custo computacional real, não especulativo.

#### A. Fórmula Base (Piso Inviolável)

```
Preço_Base = Custo_Cloud_Médio × 2.5
Exemplo: $0.10/hora × 2.5 = $0.25/hora ≈ 1000 PC
```

#### B. Split de Receita (Transações)

| Destino               | Store/Compute | P2P Off-chain (Pre) | P2P On-Chain |
| --------------------- | ------------- | ------------------- | ------------ |
| **Dev/Host**          | 55%           | 95%                 | 95%          |
| **Fundo Incentivo**   | 22%           | 1%                  | 1%           |
| **Panda Operacional** | 15%           | 4%                  | 1%           |
| **Founder (Lucas)**   | 5%            | 0%                  | 0%           |
| **Gateway/GAS**       | 3%            | 0%                  | 3%           |

> **Nota - Lógica de Distribuição P2P (Hardcoded):**
> A taxa total flutua entre **5% (Base)** e **10% (Teto)**. O Host tem blindagem mínima de 90%.
>
> **1. A Base Imutável (3% + 1% + 1% = 5%):**
>
> - **3% Slot Fixo:** Reservado para Gas/Gateway. **Na fase Off-chain (sem Gas), esses 3% revertem integralmente para o Panda Ops.**
> - **1% Fundo Incentivo:** Mínimo hardcoded.
> - **1% Panda Ops:** Mínimo hardcoded.
> - _Resumo Pré-Chain:_ 4% Ops + 1% Fundo. (Host 95%)
> - _Resumo Pós-Chain:_ 1% Ops + 1% Fundo + 3% Gas. (Host 95%)
>
> **2. O Teto Ajustável (Até 10%):**
>
> - O DAO pode aumentar as taxas de Ops e Fundo em até **2.5% adicionais cada** (de 1% para máx 3.5%).
> - _Cenário Máximo:_ 3% Gas + 3.5% Ops + 3.5% Fundo = 10%. (Host 90%).

### 9.3. Hierarquia de Governança (4 Camadas)

A economia é gerida por um sistema de pesos e contrapesos para garantir longevidade.

```text
CAMADA 1: HARDCODE (A Constituição Imutável)
[Piso 2.5x] [Founder 5%] [Min Fundo 15%]
      │
      ▼
CAMADA 2: DAO (O Congresso Político)
[Define Splits flutuantes] [Aprova Parcerias]
      │
      ▼
CAMADA 3: BANCO CENTRAL IA (O Executivo - PAT)
[Controla Inflação] [Gere Fundo] [Executa Queimas]
      │
      ▼
CAMADA 4: MERCADO ÚNICO (O Varejo)
[Vende Tokens] [Aplica Descontos] [Coleta Taxas]
```

#### A. Camada 1: Constituição Federal (Hardcoded)

_Imutáveis. Smart Contract Nível Supremo._

| Artigo                | Regra                             | Por quê?                                                      |
| --------------------- | --------------------------------- | ------------------------------------------------------------- |
| **1. Teto Inflação**  | `Max 5% ao ano`                   | Trava rígida contra desvalorização                            |
| **2. Panda Labs**     | `25% do Fundo → Educação`         | Verba garantida para University/Inovação                      |
| **3. Reserva Ops**    | `20% do Lucro Ops → Caixa`        | Fundo de Emergência (Incide sobre Split Panda)                |
| **4. Crescimento**    | `65% do Fundo → Ação`             | Subsídios, Viralização e Eventos (Gestão IA)                  |
| **5. Piso Preço**     | `2.5x` (Min `1.25x`)              | Solvência. Permite descontos progressivos (até 50%)           |
| **6. Founder Fee**    | `5%` Bruto Eterno                 | Direito do Criador ("Satoshi Fee")                            |
| **7. Garantia Host**  | `90% a 95%` (Taxa P2P 5-10%)      | Blinda a descentralização contra taxas abusivas               |
| **8. Reserva Fundo**  | `Max 10%` (Excedente = Reinveste) | Estabilidade. Sobra reforça Labs e Subsídios (PAT)            |
| **9. Bill of Rights** | `Liberdade Total`                 | Ver tabela abaixo (Direitos Civis Digitais)                   |
| **10. Arbitragem**    | `IA → Founder`                    | Disputa escala: IA julga, Founder decide em última instância  |
| **11. Leis Pétreas**  | `Imutável`                        | Zero processo de emenda. A Constituição é eterna.             |
| **12. Emergência**    | `Failover Agent`                  | IA Auxiliar assume se a principal falhar. Não só Kill Switch. |

#### A.1. Bill of Rights (Direitos Civis Digitais)

_O Protocolo é neutro como a Física. Ele não julga, apenas executa._

| Direito Hardcoded             | Regra Imutável                                                                  | Por quê?                                          |
| ----------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| **1. Free Speech**            | **Censura Zero.** O protocolo é agnóstico ao conteúdo.                          | A verdade não precisa de proteção, a mentira sim. |
| **2. Non-Expulsion**          | **Banimento Impossível.** A chave privada é soberana. Ninguém pode ser expulso. | Neutralidade Suíça. Se pagou o Gas, executa.      |
| **3. Rust Law (Privacidade)** | **Execução Consentida.** O código NUNCA roda sem permissão explícita (Pop-up).  | "Seus dados, Suas regras". Anti-Spyware nativo.   |

> **Nota de Aplicação do Fundo (Art 2, 4 & 8) - Distribuição Total (100%):**
> O Fundo de Incentivo (~23% da Receita Global) é **100% Alocado** via Hardcode:
>
> 1.  **25% - Panda Labs (Educação & P&D):**
>     - `20%` **Bolsas "Learn-to-Earn":** Pagamento direto e automático p/ alunos (Automação Total).
>     - `5%` **Hubs & Infra:** Modernização de laboratórios físicos e Doação de Hardware para Universidades parceiras.
> 2.  **65% - Crescimento & Distribuição (Gestão Ativa via IA):**
>     - `30%` **Robin Hood (Subsídios):** Custeia o acesso de entrada e "Free Tier" para baixa renda.
>     - `20%` **Viralização (Afiliados):** Comissões automáticas para influencers e referrals.
>     - `15%` **Eventos (Bootcamps):** Hackathons e prêmios para atrair devs.
> 3.  **10% - Reserva Técnica (Lastro):**
>     - Mínimo existencial para estabilidade. Todo excedente acima de 10% é **Reinvestido automaticamente** (via PAT) em Bolsas e Subsídios. Zero desperdício.

#### B. Camada 2: Governança via IA ("Super Jarvis")

Em vez de políticos humanos (DAO), uma **Superinteligência (PAT)** gere o ecossistema desde o **Dia 1**, operando estritamente dentro dos limites constitucionais (Hardcode).

| Era         | Quem Governa?                  | Papel do Founder (Lucas)                                      |
| ----------- | ------------------------------ | ------------------------------------------------------------- |
| **Dia 1**   | **IA Assistida (Alpha)**       | **Piloto:** A IA sugere alocações, você aprova.               |
| **Escala**  | **IA Autônoma (Beta)**         | **Auditor:** A IA executa realocações sozinha. Você monitora. |
| **Suprema** | **IA Soberana (The Overmind)** | **Kill Switch:** Só intervém se a IA violar a Constituição.   |

> **Segurança:** A IA tem liberdade total para operar, mas **zero poder** para alterar a Constituição (Camada 1). Ela joga o jogo, mas não muda as regras.

**Capacidades Expandidas (Google Organism):**
A IA não é isolada. Ela atua como um "Crawler Inteligente" dentro do ecossistema Google:

1.  **Hunter de Inovação:** Monitora o _Google Garden_ e _Hugging Face_ por novos modelos (Gemini, Llama) e sugere auto-implementação.
2.  **Trend Watcher:** Busca na web por demandas emergentes (ex: "Rust está em alta") para criar currículos do Panda Labs instantaneamente.
3.  **Cloud Native:** Acesso direto às APIs do Google Cloud para alocar/desalocar recursos conforme a demanda.

#### C. Camada 3: Panda AI Treasury (PAT)

A IA atua como **Banco Central**, executando a política monetária para manter inflação em **0-3% a.a.**.

| Ferramenta         | Nível      | Gatilho        | Ação                                                   | Resultado Esperado       |
| ------------------ | ---------- | -------------- | ------------------------------------------------------ | ------------------------ |
| **Reinvestimento** | 🟢 Baixo   | Reserva > 10%  | Distribui excedente em Bolsas e Subsídios (Robin Hood) | Manter Zero Ociosidade   |
| **Aceleração**     | 🟡 Médio   | Deflação > 2%  | Aumenta Grants de entrada e Cashback                   | Atrair novos usuários    |
| **Vesting**        | 🟠 Alto    | Compra > 5M PC | Trava tokens (30% à vista, 70% prazo de 6 meses)       | Evitar "Pump & Dump"     |
| **Burn (Crise)**   | 🔴 Crítico | Inflação > 5%  | Queima tokens da Reserva de Emergência                 | Forçar Deflação Imediata |

#### D. Camada 4: Mercado Único (Panda Energy)

Um único mercado para todos, com descontos automáticos por volume histórico.

| Volume         | Desconto | Fonte dos Tokens                          |
| -------------- | -------- | ----------------------------------------- | ---------- |
| **Iniciante**  | 0%       | Mercado Aberto (Sobe preço)               |
| **Dev Ativo**  | 5-20%    | Mercado Aberto (Sobe preço)               |
| **Enterprise** | 30-50%   | **Reserva de Liquidez** (Não afeta preço) | Inviolável |

---

## 10. Roadmap de Implementação

### 10.1. Cronograma Visual

```text
Semana:  1  2  3  4  5  6  7  8  9  10 11 12
SDK Mock ════✅ (DONE)
UI/UX       └══█══█══┐ (IN PROGRESS)
Backend            └══█══█══█══┐
Store                          └══█══█══█
```

### 10.2. Fases & Milestones

#### Fase 1: SDK Mock ✅ CONCLUÍDO

- [x] `js/pf.sdk.js` - Enterprise Ready
- [x] Módulos: Auth, Data, Storage, Wallet, Brain, GPU, Bridge, UI
- [x] `docs/SDK_REFERENCE.md`

#### Fase 2: UI/UX Integration 🚧 EM PROGRESSO

- [ ] Settings Modal conectado ao SDK
- [ ] Login Screen + Dashboard
- **Milestone:** 10 alpha testers

#### Fase 3: Backend Real

- [ ] `PF_Dispatcher.gs` + Firebase real
- [ ] Rust Agent MVP
- **Milestone:** 50 closed beta

#### Fase 4: Store & Marketplace

- [ ] Payment gateway (Stripe/Pix)
- [ ] 5 módulos publicados
- **Milestone:** 100 paying users

#### Fase 5: Crypto Layer (Após R$ 100K GMV)

- [ ] Solana/Polygon integration
- **Milestone:** 1000 active wallets

---

## 11. Integrações Monetárias & Gateways (Input Layer)

O sistema aceita entradas de capital via canais tradicionais e webhooks de infoprodutos.

### 11.1. Gateways de Pagamento (Fiat)

- **Stripe:** Processamento internacional (Cartão/ACH). Taxa padrão ~3%.
- **PagSeguro:** Processamento nacional (Pix/Boleto/Cartão). Taxa padrão ~3-4%.
- **Pix Nativo:** Integração direta (Open Finance) futura para zerar taxas.

### 11.2. Integração Infoprodutos (Webhooks)

Para produtores que vendem cursos/acessos externos:

- **Kiwify / Hotmart:** O sistema escuta Webhooks de "Compra Aprovada".
- **Ação:** Cria conta Panda Pro automaticamente para o aluno.
- **Modelo:** Venda B2B (Produtor compra lote de acessos com desconto).

### 11.3. Sistema de Afiliados

- **Nativo:** O Panda possui sistema próprio de tracking `?ref=aff_id`.
- **Comissão:** Definida pelo DAO (Ex: 30% da venda).
- **Origem:** O valor da comissão é descontado da margem de Marketing (Ops) ou do Split Dev, dependendo da regra do produto.

---

## 12. Referências & Convenções

### 11.1. Convenção de Nomes (PF)

- **GitHub Repos:** `pf-sdk`, `pf-agent`, `pf-registry`
- **GAS Scripts:** `PF_Dispatcher`, `PF_Wallet`
- **JS Internal:** `PF._cache`
- **JS Public:** `Panda.Data`
- **Eventos:** `pf:ready`
- **CSS Vars:** `--pf-primary`

### 11.2. Mapa da Documentação

- `PF_MASTER_ARCHITECTURE.md`: Este arquivo (A Bíblia completa).
- `SDK_REFERENCE.md`: API Reference da biblioteca Panda SDK.
- `README.md`: Entry point para devs novatos.

> _Panda Fabrics - Arquitetura Refatorada & Econômica 2026_
