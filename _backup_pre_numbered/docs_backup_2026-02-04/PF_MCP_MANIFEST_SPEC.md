# 🔌 PF_MCP_MANIFEST_SPEC - Especificação MCP para Plugins

> **Versão:** 1.0.0 | **Status:** Ativo | **Atualizado:** 2026-02-04

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Filosofia Zero Barreira](#2-filosofia-zero-barreira)
3. [Estrutura panda.mcp.json](#3-estrutura-pandamcpjson)
4. [Integração com Plugins Founder](#4-integração-com-plugins-founder)
5. [Exemplos Completos](#5-exemplos-completos)

---

## 1. Visão Geral

**MCP (Model Context Protocol)** é **obrigatório** para todos os plugins do Panda Factory. Isso permite:

- IA entende o plugin automaticamente (zero manual)
- Integração "plug and play" entre plugins
- Dev não precisa escrever documentação de API

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    MCP-FIRST: A IA É O MANUAL                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ANTES (modo tradicional):                                              │
│  Dev lê manual → Entende API → Escreve código → Testa                   │
│                                                                          │
│  AGORA (MCP-First):                                                     │
│  Dev pergunta pra IA → IA lê MCP → IA usa o plugin                      │
│                                                                          │
│  RESULTADO: Zero documentação = Zero barreira                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Filosofia Zero Barreira

> **Decisão do Founder:** Devs não pagam NADA. Apenas usuário final paga.

### Modelo de Monetização

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FUNIL DE MONETIZAÇÃO                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. DEV INTEGRA (GRÁTIS)                                                │
│     └── Acesso livre a todos plugins oficiais via MCP                   │
│                                                                          │
│  2. USUÁRIO COMPRA PLUGIN (MÓDICO)                                      │
│     └── Plugins oficiais: Preço baixo para atrair                       │
│                                                                          │
│  3. USUÁRIO CONSOME SERVIÇOS                                            │
│     └── Gemini, GPU Cloud, mais plugins = mais PC consumido             │
│                                                                          │
│  SPLIT QUANDO USUÁRIO COMPRA:                                           │
│  ├── Dev do plugin: 52%                                                 │
│  ├── Panda Educação: 25%                                                │
│  ├── Panda Ops: 15%                                                     │
│  ├── Founder: 5%                                                        │
│  └── Gateway: 3%                                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

| Quem        | Paga?  | Razão                           |
| ----------- | :----: | ------------------------------- |
| **Dev**     | ❌ NÃO | Zero barreira para integrar     |
| **Usuário** | ✅ SIM | Preço módico + consome serviços |

---

## 3. Estrutura panda.mcp.json

Todo plugin **DEVE** ter um `panda.mcp.json` na raiz:

```json
{
  "name": "panda-crm",
  "version": "1.0.0",
  "description": "CRM integrado ao Panda Factory",
  "author": {
    "name": "Lucas Valério",
    "github": "LucassVal"
  },
  "mcp": {
    "tools": [
      {
        "name": "addLead",
        "description": "Adiciona um novo lead ao CRM",
        "parameters": {
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "Nome do lead" },
            "phone": { "type": "string", "description": "Telefone" },
            "email": { "type": "string", "description": "Email (opcional)" }
          },
          "required": ["name", "phone"]
        }
      },
      {
        "name": "getLead",
        "description": "Busca um lead por ID",
        "parameters": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "description": "ID do lead" }
          },
          "required": ["id"]
        }
      },
      {
        "name": "listLeads",
        "description": "Lista todos os leads",
        "parameters": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": ["new", "contacted", "qualified", "won", "lost"]
            },
            "limit": { "type": "number", "default": 50 }
          }
        }
      }
    ],
    "resources": [
      {
        "uri": "leads://",
        "name": "Leads Database",
        "description": "Acesso aos leads do CRM",
        "mimeType": "application/json"
      },
      {
        "uri": "templates://whatsapp",
        "name": "WhatsApp Templates",
        "description": "Templates de mensagem",
        "mimeType": "application/json"
      }
    ],
    "prompts": [
      {
        "name": "qualify_lead",
        "description": "Prompt para qualificar um lead usando IA",
        "arguments": [
          { "name": "lead_id", "description": "ID do lead a qualificar" }
        ]
      }
    ]
  },
  "pricing": {
    "model": "premium",
    "price_pc": 99
  },
  "dependencies": {
    "panda-sdk": ">=1.0.0"
  },
  "permissions": ["storage.read", "storage.write", "bridge.mcp"]
}
```

---

### 3.1 Campos Obrigatórios

| Campo       | Tipo   | Descrição                            |
| ----------- | ------ | ------------------------------------ |
| `name`      | string | ID único do plugin (ex: `panda-crm`) |
| `version`   | string | Versão semântica                     |
| `mcp.tools` | array  | Lista de ferramentas expostas        |

### 3.2 Tools (Ferramentas)

Cada tool representa uma ação que a IA pode invocar:

```json
{
  "name": "sendWhatsApp",
  "description": "Envia mensagem WhatsApp para um lead",
  "parameters": {
    "type": "object",
    "properties": {
      "lead_id": { "type": "string" },
      "template_id": { "type": "string" },
      "variables": { "type": "object" }
    },
    "required": ["lead_id", "template_id"]
  }
}
```

### 3.3 Resources (Recursos)

Dados que a IA pode ler:

```json
{
  "uri": "analytics://monthly",
  "name": "Monthly Analytics",
  "description": "Relatório mensal de vendas",
  "mimeType": "application/json"
}
```

### 3.4 Prompts (Templates de Prompt)

Prompts pré-definidos para IA:

```json
{
  "name": "generate_proposal",
  "description": "Gera proposta comercial para lead",
  "arguments": [
    { "name": "lead_id", "required": true },
    { "name": "product_ids", "required": true }
  ]
}
```

---

## 4. Integração com Plugins Founder

### Plugins Oficiais Disponíveis (Grátis para Devs)

| Plugin       | MCP Name         | Preço User | Descrição            |
| ------------ | ---------------- | :--------: | -------------------- |
| **CRM**      | `panda-crm`      |   99 PC    | Gestão de leads      |
| **Agenda**   | `panda-agenda`   |   49 PC    | Calendário integrado |
| **WhatsApp** | `panda-whatsapp` |   149 PC   | Automação WhatsApp   |
| **Trading**  | `panda-trading`  |   299 PC   | Integração cTrader   |

### Como Dev Integra (Exemplo)

```javascript
// No plugin do Dev
import { mcpToTool } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client";

// Conectar ao CRM do Founder (GRÁTIS)
const crmClient = new Client({
  name: "my-plugin",
  version: "1.0.0",
});

await crmClient.connect(
  new StdioClientTransport({
    command: "panda-agent",
    args: ["mcp", "panda-crm"],
  }),
);

// Agora a IA do Dev pode usar: addLead, getLead, listLeads, etc.
```

---

## 5. Exemplos Completos

### 5.1 Plugin de Automação (Dev Terceiro)

```json
{
  "name": "automation-flows",
  "version": "1.0.0",
  "description": "Automação de fluxos de trabalho",
  "mcp": {
    "tools": [
      {
        "name": "createFlow",
        "description": "Cria novo fluxo de automação",
        "parameters": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "trigger": {
              "type": "string",
              "enum": ["schedule", "webhook", "manual"]
            },
            "actions": { "type": "array" }
          },
          "required": ["name", "trigger", "actions"]
        }
      }
    ],
    "resources": [
      {
        "uri": "flows://",
        "name": "Flows Database",
        "mimeType": "application/json"
      }
    ]
  },
  "dependencies": {
    "panda-sdk": ">=1.0.0",
    "panda-crm": ">=1.0.0"
  },
  "pricing": {
    "model": "premium",
    "price_pc": 199
  }
}
```

### 5.2 Como IA Usa o Plugin

```javascript
// Usuário pergunta: "Cria um fluxo que adiciona leads do site no CRM"

// IA automaticamente:
// 1. Lê panda.mcp.json do automation-flows
// 2. Lê panda.mcp.json do panda-crm
// 3. Entende: createFlow + addLead
// 4. Executa:

await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Cria um fluxo que adiciona leads do site no CRM",
  config: {
    tools: [mcpToTool(automationClient), mcpToTool(crmClient)],
  },
});

// IA chama: createFlow({ trigger: 'webhook', actions: [{ tool: 'addLead' }] })
```

---

## 6. Validação e Segurança (Panda Defend)

> O sistema **Panda Defend** filtra todos plugins antes de publicar na Store.

### 6.1 Fluxo de Validação MCP

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    VALIDAÇÃO MCP (Pré-Publicação)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. PARSE panda.mcp.json                                                │
│     ├── JSON válido?                                                    │
│     ├── Campos obrigatórios (name, version, mcp.tools)?                 │
│     └── Versão semântica correta?                                       │
│                                                                          │
│  2. VALIDAÇÃO DE TOOLS                                                  │
│     ├── Cada tool tem name + description + parameters?                  │
│     ├── Parameters seguem JSON Schema válido?                           │
│     └── Não há tools com nomes reservados?                              │
│                                                                          │
│  3. VALIDAÇÃO DE PERMISSÕES (vs Panda Defend)                           │
│     ├── Permissões declaradas correspondem ao código?                   │
│     ├── Não usa eval(), document.write(), etc?                          │
│     └── Score mínimo 70/100                                             │
│                                                                          │
│  4. SANDBOX TEST                                                        │
│     ├── Executa em ambiente isolado 30s                                 │
│     ├── Testa cada tool declarada                                       │
│     └── Monitora acessos não autorizados                                │
│                                                                          │
│  RESULTADO: ✅ Aprovado (publica) | ❌ Rejeitado (feedback)              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Regras Específicas MCP

| Regra       | Descrição                          | Score |
| ----------- | ---------------------------------- | :---: |
| **MCP_001** | `panda.mcp.json` presente e válido |  +20  |
| **MCP_002** | Todas tools têm description        |  +15  |
| **MCP_003** | Parameters com JSON Schema válido  |  +15  |
| **MCP_004** | Não acessa APIs não declaradas     |  +25  |
| **MCP_005** | Passa no sandbox test              |  +25  |

> **Mínimo para publicar:** 70/100
> Ver [PF_MASTER_ARCHITECTURE.md §26.6](PF_MASTER_ARCHITECTURE.md#266-panda-defend---sistema-de-segurança) para sistema completo.

### 6.3 Tools Reservadas (Não Permite Sobrescrever)

| Tool Name  | Razão                             |
| ---------- | --------------------------------- |
| `auth_*`   | Reservado para autenticação Panda |
| `wallet_*` | Reservado para transações PC      |
| `admin_*`  | Reservado para Founder            |
| `system_*` | Reservado para core do SDK        |

---

## 📚 Referências

- [PF_PLUGIN_MANIFEST.md](PF_PLUGIN_MANIFEST.md) - Especificação plugin.json
- [PF_MCP_REFERENCE.md](PF_MCP_REFERENCE.md) - Arquitetura MCP
- [PF_GEMINI_REFERENCE.md](PF_GEMINI_REFERENCE.md) - Integração Gemini + MCP
- [PF_RUST_REFERENCE.md](PF_RUST_REFERENCE.md) - Rust Agent MCP Server

---

> 📖 **Versão:** 1.0.0 | **Status:** Ativo | **Mantido por:** Panda Factory
