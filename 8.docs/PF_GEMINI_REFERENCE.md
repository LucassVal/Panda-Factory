# 🧠 PF_GEMINI_REFERENCE v3.0

> **Referência Completa da Integração Google Gemini 3 no Panda Factory**
> SDK: `@google/genai` (Biblioteca Recomendada - Janeiro 2026)
> Baseado em: [Gemini 3 Guide](https://ai.google.dev/gemini-api/docs/gemini-3?hl=pt-br)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Modelos Gemini 3](#2-modelos-gemini-3)
3. [SDK @google/genai](#3-sdk-googlegenai)
4. [Thinking Levels](#4-thinking-levels)
5. [Ferramentas Nativas](#5-ferramentas-nativas)
6. [Function Calling](#6-function-calling)
7. [MCP (Model Context Protocol)](#7-mcp-model-context-protocol)
8. [Geração de Imagens](#8-geracao-de-imagens)
9. [Multimodal](#9-multimodal)
10. [Pandometro (Billing)](#10-pandometro-billing)
11. [Implementação Panda](#11-implementacao-panda)

---

## 1. Visão Geral

O Panda Factory usa a **biblioteca recomendada `@google/genai`** (não a legada `@google/generativeai`).

### Bibliotecas

| Linguagem             | Biblioteca Legada ❌   | Biblioteca Recomendada ✅ |
| --------------------- | ---------------------- | ------------------------- |
| JavaScript/TypeScript | `@google/generativeai` | **`@google/genai`**       |
| Python                | `google-generativeai`  | **`google-genai`**        |

### Stack de IA Panda

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     PANDA AI STACK (Gemini 3)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MODELOS DE TEXTO                                                       │
│  ├── ⚡ gemini-3-flash-preview     → Chat rápido, alta capacidade      │
│  ├── 🧠 gemini-3-pro-preview       → Conhecimento amplo, raciocínio    │
│  └── 🎨 gemini-3-pro-image-preview → Geração de imagens 4K             │
│                                                                         │
│  FERRAMENTAS NATIVAS                                                    │
│  ├── 🔍 google_search    → Pesquisa em tempo real                      │
│  ├── 🔗 url_context      → Leitura de URLs                             │
│  ├── 💻 code_execution   → Executar código                             │
│  └── 📞 function_calling → Chamar suas funções                         │
│                                                                         │
│  PROTOCOLOS                                                             │
│  └── 🔌 MCP (Model Context Protocol) → Integração com ferramentas      │
│                                                                         │
│  AGENTES                                                                │
│  └── 🔬 deep-research-pro-preview-12-2025 → Pesquisa aprofundada       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Modelos Gemini 3

### 2.1. Modelos Disponíveis

| Modelo                 | ID API                       | Ícone | Descrição                                  |
| ---------------------- | ---------------------------- | :---: | ------------------------------------------ |
| **Gemini 3 Pro**       | `gemini-3-pro-preview`       |  🧠   | Conhecimento amplo + raciocínio avançado   |
| **Gemini 3 Flash**     | `gemini-3-flash-preview`     |  ⚡   | Inteligência Pro na velocidade/preço Flash |
| **Gemini 3 Pro Image** | `gemini-3-pro-image-preview` |  🎨   | Geração de imagens até 4K                  |

### 2.2. Agentes Especializados

| Agente            | ID API                              | Ícone | Descrição                         |
| ----------------- | ----------------------------------- | :---: | --------------------------------- |
| **Deep Research** | `deep-research-pro-preview-12-2025` |  🔬   | Pesquisa aprofundada com citações |

### 2.3. Ícones do Chat

```text
┌──────┬──────┬──────┬──────┬──────┐
│  ⚡  │  🧠  │  🤔  │  🔬  │  🎨  │
│Flash │ Pro  │Think │Resear│Imagen│
└──────┴──────┴──────┴──────┴──────┘
```

> **Nota:** Todos os modelos Gemini 3 estão em **pré-lançamento**.

---

## 3. SDK @google/genai

### 3.1. Instalação

```bash
npm install @google/genai
```

### 3.2. Configuração Básica

```javascript
import { GoogleGenAI } from "@google/genai";

// Inicializar cliente (API key via env ou parâmetro)
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});
```

### 3.3. Geração Simples

```javascript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Explique React hooks em 3 frases.",
});

console.log(response.text);
```

### 3.4. Dois Modos de API

O SDK oferece dois modos:

| API              | Método                        | Descrição             | Uso              |
| ---------------- | ----------------------------- | --------------------- | ---------------- |
| **models**       | `ai.models.generateContent()` | Stateless, simples    | Chat básico      |
| **interactions** | `ai.interactions.create()`    | Stateful, server-side | Conversas longas |

---

## 4. Thinking Levels

O Gemini 3 usa **raciocínio dinâmico** controlado por `thinkingConfig`.

### 4.1. Níveis Disponíveis

| Nível     | Suportado Por | Descrição                     | Latência       |
| --------- | ------------- | ----------------------------- | -------------- |
| `minimal` | Flash only    | "Sem pensar", mínima latência | ⚡ Ultra baixa |
| `low`     | Pro & Flash   | Instruções simples, chat      | ⚡ Baixa       |
| `medium`  | Flash only    | Pensamento balanceado         | 🔄 Média       |
| `high`    | Pro & Flash   | Raciocínio profundo (padrão)  | 🐢 Alta        |

### 4.2. Exemplo JavaScript

```javascript
const response = await ai.models.generateContent({
  model: "gemini-3-pro-preview",
  contents: "Como funciona a IA?",
  config: {
    thinkingConfig: {
      thinkingLevel: "low", // "minimal" | "low" | "medium" | "high"
    },
  },
});

console.log(response.text);
```

### 4.3. Assinaturas de Pensamento

Para gerenciar histórico de conversas manualmente, use `thoughtSignature`:

```javascript
// String fictícia para ignorar validação estrita
"thoughtSignature": "context_engineering_is_the_way_to_go"
```

---

## 5. Ferramentas Nativas

O Gemini 3 suporta **ferramentas integradas** que podem ser combinadas com saídas estruturadas.

### 5.1. Ferramentas Disponíveis

| Ferramenta           | ID                     | Descrição                 |
| -------------------- | ---------------------- | ------------------------- |
| **Google Search**    | `googleSearch`         | Pesquisa em tempo real    |
| **URL Context**      | `urlContext`           | Ler conteúdo de URLs      |
| **Code Execution**   | `codeExecution`        | Executar código Python    |
| **Function Calling** | `functionDeclarations` | Suas funções customizadas |

### 5.2. Exemplo com Múltiplas Ferramentas

```javascript
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({});

// Schema de resposta estruturada
const matchSchema = z.object({
  winner: z.string().describe("Nome do vencedor"),
  score: z.string().describe("Placar final"),
  scorers: z.array(z.string()).describe("Artilheiros"),
});

const response = await ai.models.generateContent({
  model: "gemini-3-pro-preview",
  contents: "Busque detalhes da última final da Copa.",
  config: {
    tools: [
      { googleSearch: {} }, // Pesquisa Google
      { urlContext: {} }, // Leitura de URLs
    ],
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(matchSchema),
  },
});

const match = matchSchema.parse(JSON.parse(response.text));
console.log(match);
```

---

## 6. Function Calling

### 6.1. Definir Função

```javascript
const weatherTool = {
  functionDeclarations: [
    {
      name: "get_weather",
      description: "Obtém o clima de uma cidade",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Cidade, ex: São Paulo",
          },
        },
        required: ["location"],
      },
    },
  ],
};
```

### 6.2. Chamar com Função

```javascript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Qual o clima em Paris?",
  config: {
    tools: [weatherTool],
  },
});

// Verificar se há chamada de função
for (const part of response.candidates[0].content.parts) {
  if (part.functionCall) {
    console.log(`Função: ${part.functionCall.name}`);
    console.log(`Args: ${JSON.stringify(part.functionCall.args)}`);

    // Executar sua função
    const result = await myGetWeather(part.functionCall.args.location);

    // Enviar resultado de volta
    const finalResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: "Qual o clima em Paris?" }] },
        { role: "model", parts: [{ functionCall: part.functionCall }] },
        {
          role: "user",
          parts: [
            {
              functionResponse: {
                name: part.functionCall.name,
                response: result,
              },
            },
          ],
        },
      ],
    });

    console.log(finalResponse.text);
  }
}
```

### 6.3. Chamada Paralela e Composicional

O Gemini 3 suporta:

- **Chamadas Paralelas**: Múltiplas funções ao mesmo tempo
- **Chamadas Composicionais**: Resultado de uma função usada em outra

---

## 7. MCP (Model Context Protocol)

O Gemini 3 tem **suporte nativo ao MCP** para conectar a ferramentas externas.

### 7.1. Instalação

```bash
npm install @modelcontextprotocol/sdk
```

### 7.2. Exemplo com MCP

```javascript
import { GoogleGenAI, mcpToTool } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Servidor MCP (ex: weather)
const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@philschmid/weather-mcp"],
});

const mcpClient = new Client({
  name: "panda-client",
  version: "1.0.0",
});

const ai = new GoogleGenAI({});

// Conectar ao servidor MCP
await mcpClient.connect(transport);

// Usar ferramentas MCP
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `Qual o clima em Londres hoje ${new Date().toLocaleDateString()}?`,
  config: {
    tools: [mcpToTool(mcpClient)], // Converte MCP para ferramenta Gemini
    // automaticFunctionCalling: { disable: true }  // Desabilitar auto-call
  },
});

console.log(response.text);

await mcpClient.close();
```

### 7.3. Limitações MCP Integrado

- ⚠️ Somente **ferramentas** (não recursos nem comandos)
- ⚠️ Disponível para Python e JavaScript
- ⚠️ Recurso **experimental**

---

## 8. Geração de Imagens

### 8.1. Gemini 3 Pro Image

O modelo `gemini-3-pro-image-preview` gera imagens até 4K com:

- **Texto legível** em imagens
- **Embasamento** via Google Search (gráficos em tempo real)
- **Edição conversacional** multi-etapa

### 8.2. Exemplo

```javascript
const response = await ai.models.generateContent({
  model: "gemini-3-pro-image-preview",
  contents: "Gere um infográfico do clima atual em São Paulo.",
  config: {
    tools: [{ googleSearch: {} }], // Busca dados em tempo real
    imageConfig: {
      aspectRatio: "16:9", // "1:1", "16:9", "9:16", "4:3"
      imageSize: "4K", // "2K", "4K"
    },
  },
});

// Extrair imagem
const imagePart = response.candidates[0].content.parts.find(
  (p) => p.inlineData,
);

if (imagePart) {
  const base64 = imagePart.inlineData.data;
  // Salvar ou exibir
}
```

---

## 9. Multimodal

O Gemini 3 aceita múltiplos tipos de entrada.

### 9.1. Tipos de Input

| Tipo         | Exemplo                               | Descrição              |
| ------------ | ------------------------------------- | ---------------------- |
| `text`       | `{ text: "..." }`                     | Texto                  |
| `inlineData` | `{ inlineData: { mimeType, data } }`  | Base64 (imagem, áudio) |
| `fileData`   | `{ fileData: { mimeType, fileUri } }` | Arquivo via URI        |

### 9.2. Exemplo Multimodal

```javascript
// Análise de imagem
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { text: "Descreva esta imagem:" },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageString,
      },
    },
  ],
});

console.log(response.text);
```

### 9.3. Resolução de Mídia

O Gemini 3 suporta `mediaResolution` para controlar qualidade:

```javascript
config: {
  mediaResolution: "medium"; // "low" | "medium" | "high"
}
```

---

## 10. Pandometro (Billing)

### 10.1. Estrutura de Uso

```javascript
// Resposta inclui uso detalhado
response.usageMetadata = {
  promptTokenCount: 50,
  candidatesTokenCount: 100,
  totalTokenCount: 150,
  thoughtsTokenCount: 20, // Tokens de raciocínio
};
```

### 10.2. Cálculo de Custo PC

```javascript
// 3.sdk/pf.meter.js
const RATES = {
  "gemini-3-flash-preview": { in: 0, out: 0 }, // GRÁTIS
  "gemini-3-pro-preview": { in: 0.015, out: 0.06 }, // 15/60 PC per 1k
  "gemini-3-pro-image-preview": { perImage: 50 }, // 50 PC/imagem
  "deep-research": { in: 0.04, out: 0.16 }, // 40/160 PC per 1k
};

const calculateCost = (model, usage) => {
  const rate = RATES[model] || RATES["gemini-3-flash-preview"];

  if (rate.perImage) {
    return rate.perImage;
  }

  return (
    (usage.promptTokenCount / 1000) * rate.in +
    (usage.candidatesTokenCount / 1000) * rate.out +
    ((usage.thoughtsTokenCount || 0) / 1000) * rate.in * 2
  );
};
```

---

## 11. Implementação Panda

### 11.1. Estrutura de Arquivos

```text
11.jam/src/
├── services/
│   └── gemini.js           # Cliente Gemini @google/genai
├── components/
│   └── JamChat.jsx         # Chat com seletor de modelo
└── styles/
    └── jam.css             # Estilos do seletor
```

### 11.2. Cliente Gemini (gemini.js)

```javascript
// 11.jam/src/services/gemini.js
import { GoogleGenAI, mcpToTool } from "@google/genai";

class GeminiService {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({ apiKey });
    this.conversationHistory = [];
  }

  async chat(message, options = {}) {
    const {
      model = "gemini-3-flash-preview",
      thinkingLevel = "low",
      tools = [],
      useSearch = false,
    } = options;

    // Adicionar ao histórico
    this.conversationHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Configurar ferramentas
    const configTools = [...tools];
    if (useSearch) {
      configTools.push({ googleSearch: {} });
    }

    // Fazer requisição
    const response = await this.ai.models.generateContent({
      model,
      contents: this.conversationHistory,
      config: {
        thinkingConfig: { thinkingLevel },
        tools: configTools.length > 0 ? configTools : undefined,
      },
    });

    // Adicionar resposta ao histórico
    this.conversationHistory.push({
      role: "model",
      parts: [{ text: response.text }],
    });

    return {
      text: response.text,
      usage: response.usageMetadata,
      model,
    };
  }

  async generateImage(prompt, options = {}) {
    const {
      aspectRatio = "1:1",
      imageSize = "2K",
      useSearch = false,
    } = options;

    const config = {
      imageConfig: { aspectRatio, imageSize },
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config,
    });

    const imagePart = response.candidates[0].content.parts.find(
      (p) => p.inlineData,
    );

    return {
      base64: imagePart?.inlineData?.data,
      mimeType: imagePart?.inlineData?.mimeType,
      usage: response.usageMetadata,
    };
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default GeminiService;
```

### 11.3. Uso no JamChat

```javascript
import GeminiService from "../services/gemini";

const gemini = new GeminiService(process.env.GOOGLE_AI_API_KEY);

// Chat simples
const response = await gemini.chat("Olá!", {
  model: "gemini-3-flash-preview",
  thinkingLevel: "low",
});

// Com pesquisa Google
const searchResponse = await gemini.chat("Qual a cotação do dólar hoje?", {
  model: "gemini-3-pro-preview",
  useSearch: true,
});

// Gerar imagem
const image = await gemini.generateImage("Logo minimalista de um panda", {
  aspectRatio: "1:1",
  imageSize: "2K",
});
```

---

## 📚 Referências Oficiais

- [Gemini 3 Developer Guide](https://ai.google.dev/gemini-api/docs/gemini-3?hl=pt-br)
- [Function Calling](https://ai.google.dev/gemini-api/docs/function-calling?hl=pt-br)
- [MCP Integration](https://ai.google.dev/gemini-api/docs/function-calling?hl=pt-br#mcp)
- [SDK Libraries](https://ai.google.dev/gemini-api/docs/libraries?hl=pt-br)
- [Interactions API](https://ai.google.dev/gemini-api/docs/interactions?hl=pt-br)

---

> **Documento mantido pelo Panda Factory**  
> Versão: 3.0 | SDK: `@google/genai` | Data: Janeiro 2026

