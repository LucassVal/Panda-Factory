# 🐼 PANDA FABRICS - Manual de Infraestrutura Google

**Versão:** 1.0  
**Objetivo:** Documentar todos os recursos Google Cloud para desenvolvedores

---

## 📌 Visão Geral

Este manual documenta a infraestrutura Google que usamos para dar vida aos projetos. O Panda Fabrics utiliza o ecossistema Google para criar soluções serverless, escaláveis e com processamento acelerado por GPU.

---

## 🏗️ Stack de Infraestrutura

| Camada       | Tecnologia         | Uso                                |
| :----------- | :----------------- | :--------------------------------- |
| **Frontend** | PWA (HTML5 + JS)   | Interface offline-first            |
| **Backend**  | Google Apps Script | Serverless, grátis, escalável      |
| **Storage**  | Google Drive / GCS | Dados do cliente + Big Data        |
| **IA**       | Gemini API         | Processamento de linguagem natural |
| **GPU**      | Colab + cuDF       | Aceleração de dados massivos       |

---

## 1️⃣ Google Apps Script (GAS)

### O Que É

Backend serverless que roda na infraestrutura Google. Zero custo de servidor.

### Deploy

```bash
# Instalar CLASP
npm install @google/clasp -g

# Login
clasp login

# Criar projeto
clasp create --type standalone --title "Meu Projeto"

# Push código
clasp push

# Deploy como Web App
clasp deploy --description "v1.0"
```

### API Gateway

```javascript
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  // Processar...
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doGet(e) {
  return ContentService.createTextOutput("API Online");
}
```

---

## 2️⃣ Gemini API (IA)

### Configuração

```javascript
const GEMINI_KEY = "sua-chave-aqui";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

function callGemini(prompt) {
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  const response = UrlFetchApp.fetch(url, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(body),
  });
  return JSON.parse(response.getContentText());
}
```

### Tool Calling (Agentes Ativos)

```javascript
const TOOLS = [
  {
    function_declarations: [
      {
        name: "listaArquivos",
        description: "Lista arquivos de uma pasta",
        parameters: {
          type: "OBJECT",
          properties: {
            folderId: { type: "STRING" },
          },
        },
      },
    ],
  },
];
```

---

## 3️⃣ NVIDIA cuDF (GPU Acceleration)

### O Que É

Biblioteca que acelera pandas 100x usando GPU, **sem mudar código**.

### Ativação (Colab)

```python
# Ativar cuDF
%load_ext cudf.pandas
import pandas as pd  # Agora acelerado!

# Ler dados
df = pd.read_parquet("big_data.parquet")
```

### Profiling (Encontrar Gargalos)

```python
# Perfil por função
%%cudf.pandas.profile
df = pd.read_parquet("dados.parquet")

# Perfil linha por linha
%%cudf.pandas.line_profile
df = df.groupby(['col']).agg(['min', 'max'])
```

### CLI

```bash
python -m cudf.pandas --profile script.py
python -m cudf.pandas --line_profile script.py
```

---

## 4️⃣ Google Cloud Storage (GCS)

### Criar Bucket

```python
from google.cloud import storage
import uuid

bucket_name = f'meu-projeto-{uuid.uuid4().hex[:8]}'
client = storage.Client()
bucket = client.create_bucket(bucket_name)
```

### Leitura/Escrita (GPU Accelerated)

```python
# Escrever (acelerado por GPU)
df.to_parquet(f"gs://{bucket}/dados.parquet")

# Ler (alta velocidade)
df = pd.read_parquet(f"gs://{bucket}/dados.parquet")
```

---

## 5️⃣ Colab Enterprise

### O Que É

Runtime GPU serverless da Google. Ideal para processamento pesado.

### Quando Usar

- Datasets > 10MB
- Processamento de XMLs/PDFs em lote
- Geração de relatórios complexos
- Treinamento de modelos

### Integração com Panda Core

```
1. Frontend detecta volume grande
2. Roteia para Colab via API
3. cuDF processa com GPU
4. Resultado volta para o CRM
5. Cobra em Panda Coins
```

---

## 6️⃣ WebGPU (Browser)

### O Que É

API nativa do Chrome para processamento GPU no browser.

### Quando Usar

- Operações leves de IA
- Visualizações 3D
- Processamento de imagens

### Status

- ✅ Chrome 113+
- ⏳ Firefox (em desenvolvimento)
- ❌ Safari (limitado)

---

## 💰 Modelo Econômico

### Panda Coin ($PC)

Moeda interna que abstrai custos de API.

| Serviço        | Custo USD | ~Custo PC |
| :------------- | :-------- | :-------- |
| Texto (Gemini) | $0.0005   | 0.003 PC  |
| Imagem         | $0.04     | 0.28 PC   |
| GPU (min)      | $0.01     | 0.07 PC   |
| Leitura Drive  | $0.001    | 0.007 PC  |

### Fórmula

```
Custo PC = (Custo USD × Cotação BRL) × 1.20 (margem)
```

---

## 🏪 Marketplace de Desenvolvedores

### Modelo B2B2C

O Panda Fabrics permite que **desenvolvedores criem suas próprias lojas** usando nossa infraestrutura.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  PANDA FABRICS  │────▶│   DESENVOLVEDOR │────▶│  CLIENTE FINAL  │
│  (Atacado $PC)  │     │  (Loja própria) │     │  (Usa o SaaS)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Fluxo de Revenda

1. **Dev compra $PC em atacado** (ex: 10.000 PC por R$ 200)
2. **Dev integra via webhook** com Kiwify/Hotmart
3. **Cliente compra na loja do dev** (ex: 500 PC por R$ 29,90)
4. **Webhook credita automaticamente** a carteira do cliente
5. **Dev lucra a diferença**

### Webhooks de Pagamento

```javascript
// Exemplo: Kiwify Webhook
function handleKiwifyWebhook(payload) {
  if (payload.status === "paid") {
    const userId = payload.customer.email;
    const amount = payload.product.metadata.panda_coins; // Ex: 500
    creditWallet(userId, amount, "COMPRA_KIWIFY");
  }
}

// Exemplo: Hotmart Webhook
function handleHotmartWebhook(payload) {
  if (payload.event === "PURCHASE_COMPLETE") {
    const userId = payload.buyer.email;
    const amount = payload.product.extras.panda_coins;
    creditWallet(userId, amount, "COMPRA_HOTMART");
  }
}
```

### Pricing Atacado (para Devs)

| Pacote     | Quantidade | Preço  | Desconto |
| :--------- | :--------- | :----- | :------- |
| Starter    | 1.000 PC   | R$ 30  | 10%      |
| Growth     | 5.000 PC   | R$ 120 | 20%      |
| Scale      | 10.000 PC  | R$ 200 | 33%      |
| Enterprise | 50.000 PC  | R$ 800 | 47%      |

### Margem do Desenvolvedor

| PC Comprado | Custo | Venda Sugerida | Margem |
| :---------- | :---- | :------------- | :----- |
| 500 PC      | R$ 15 | R$ 29,90       | 99%    |
| 1.000 PC    | R$ 30 | R$ 49,90       | 66%    |
| 2.000 PC    | R$ 48 | R$ 99,90       | 108%   |

---

## 📚 Links Úteis

- [Google Apps Script](https://script.google.com)
- [Gemini API](https://ai.google.dev)
- [cuDF Docs](https://docs.rapids.ai/api/cudf/stable/)
- [Kiwify Webhooks](https://kiwify.com.br/docs/webhooks)
- [Hotmart Webhooks](https://developers.hotmart.com/docs/webhooks)

---

© 2026 Panda Fabrics - Infraestrutura para Desenvolvedores
