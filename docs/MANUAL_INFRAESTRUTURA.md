# 🐼 PANDA FABRICS - Arquitetura Estratégica

**Versão:** 2.0  
**Missão:** Democratizar infraestrutura Google para desenvolvedores

---

## 📌 Visão: O Canvas Aberto

> "Ganhamos na quantidade. Ajudamos os pequenos a crescerem."

| Pilar           | Descrição                     |
| :-------------- | :---------------------------- |
| **Baixo Custo** | Infra Google = quase zero     |
| **Volume**      | Centavos × milhares de devs   |
| **Autonomia**   | Cada dev tem sua loja própria |

---

## 🦴 Espinha Dorsal: Arquitetura Hub

#### Estratégia Comercial para Devs (B2B)

> **"Compre no Atacado, Venda no Varejo (ou Embutido)"**

#### 1. Desconto de Atacado (Dev Packs)

O desenvolvedor precisa de "combustível" barato para testar e para criar ofertas imbatíveis.
| Pacote | Volume | Desconto | Preço Unitário |
|:---|:---|:---|:---|
| **Starter** | 1.000 PC | 0% | 1.2x |
| **Pro** | 10.000 PC | 20% | 0.96x |
| **Business** | 100.000 PC | **50%** | **0.60x** |

> _Dev compra 100k PC com 50% OFF e usa para revender embutido em seus produtos._

#### 2. Venda Embutida (Bundled Launch)

O Dev vende seu produto em plataformas externas (Kiwify, Hotmart) e entrega Panda Coins como bônus.

**Cenário:**

- Dev lança "Curso de Python para Traders" por R$ 297.
- **Oferta:** "Ganhe 5.000 Panda Coins para rodar seus primeiros bots".
- **Bastidores:**
  1. Cliente compra na Kiwify.
  2. Webhook avisa o Panda Fabrics.
  3. Sistema debita 5k PC da carteira do Dev (que ele pagou barato no atacado).
  4. Sistema credita 5k PC na carteira do Aluno.

#### 3. Split em Módulos Gratuitos

Mesmo se o módulo for grátis na Store, o Dev ganha no consumo de energia.

- Usuário baixa módulo Grátis.
- Usuário gasta 100 PC de energia.
- **Split:** 70% Panda (Infra) / 30% Dev (Comissão).

---

### Modelo Centralizado + Descentralizado

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
│  │ (Seguro)        │            │ (Dados cliente) │        │
│  ├─────────────────┤            ├─────────────────┤        │
│  │ Panda Coins     │            │ Execução        │        │
│  │ (Economia)      │            │ (Processamento) │        │
│  └─────────────────┘            └─────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                    ↕ Google Auth (OAuth) ↕
```

### Por Que Google Auth é Obrigatório

| Componente   | Localização      | Motivo                     |
| :----------- | :--------------- | :------------------------- |
| **Frontend** | Nosso servidor   | Atualizações centralizadas |
| **Scripts**  | Nosso DB         | Segurança + Versionamento  |
| **Backend**  | GAS do cliente   | Zero custo para nós        |
| **Dados**    | Drive do cliente | Privacidade total          |
| **Economia** | Panda Coins      | Monetização                |

### Fluxo de Atualização

```
1. Lançamos nova versão HTML/EXE
2. Cliente baixa automaticamente
3. Scripts atualizados do nosso DB
4. Execução no GAS do cliente
5. Cobrança em Panda Coins
```

## 🚀 Desburocratização Cloud

### O Problema Tradicional

```
Dev → Criar Conta AWS → VPC → IP → VM → SSL → Billing → 😵
```

### A Solução Panda Fabrics

```
Dev → Compra $PC → Usa API → Pronto! 🐼
```

| Complexidade | Nossa Solução          |
| :----------- | :--------------------- |
| VM/VPS       | Serverless (GAS/Colab) |
| IP Fixo      | URL Apps Script        |
| SSL          | Google gerencia        |
| Billing      | Panda Coin             |
| Scaling      | Automático             |
| Deploy       | `clasp push`           |

## 🛡️ Pilar 1: Segurança

### Google Cloud Armor

Proteção DDoS/invasão via infraestrutura nativa Google. Zero custo extra.

### Arquitetura Headless (Proteção IP)

```
Código Secreto (Bot/Estratégia) → Servidor (GAS/Rust)
                                      ↓
                              Cliente vê só resultado
```

### DevSecOps

```bash
# .gitignore obrigatório
.clasprc.json    # Token (PERIGO!)
secrets.js       # Chaves API
credentials.json

# Segredos no servidor (não no código)
PropertiesService.getScriptProperties()
```

### Escudo Jurídico

> "Plataforma = Solo. Usuário = Agricultor. Responsabilidade do uso é do usuário."

---

## ⚡ Pilar 2: GAS (Orquestrador Serverless)

### API Gateway

```javascript
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  return jsonResponse(dispatchRequest(payload));
}
```

### Ledger Financeiro

```
Custo PC = (Custo API × Dólar × 1.20)
```

### Dispatcher Multimodal

| Tipo                | Modelo            | Custo                    |
| :------------------ | :---------------- | :----------------------- |
| **Standard (Free)** | Gemini Flash 2.5  | 0 PC (até 1M tokens/dia) |
| **Model Garden**    | GLM-4 / Llama 3   | Sob demanda (Vertex AI)  |
| **Imagem**          | Imagen 3 / DALL-E | Por imagem               |
| **Pesado**          | Colab GPU         | Por minuto               |

> **Nota:** O tier gratuito (1 milhão de tokens/dia) é compartilhado globalmente. Para uso intensivo, recomendamos upgrade para Tier Pro.

### 🚦 Fila Inteligente (Fair Queue)

Todos os clientes pagantes têm prioridade máxima. Não privilegiamos "baleias" em detrimento do pequeno dev que gera caixa rápido.

| Prioridade   | Perfil                 | Saldo   | Comportamento                                 |
| :----------- | :--------------------- | :------ | :-------------------------------------------- |
| **Priority** | **Pagante (Qualquer)** | > 10 PC | **Fast Lane.** Execução imediata (FIFO).      |
| **Economy**  | Free Tier              | < 10 PC | **Background.** Só roda quando há ociosidade. |

> **Filosofia:** "O pequeno desenvolvedor (Varejo) traz liquidez e é tratado como VIP."
> O usuário que tem 100k PC não fura a fila do usuário que acabou de comprar 250 PC.

### 🖥️ Interface: A "Omni-Bar" (Acesso Universal)

Uma barra suspensa (Spotlight-style) permite ao usuário chamar qualquer inteligência do Garden.

**Comportamento:**

1.  **Default (Always-On):** `Gemini Flash` (Grátis, Rápido, 1M tokens/dia).
2.  **Top 5 Picks (Atalhos):** personalizáveis (ex: GPT-4o, Claude 3.5, Imagen 3).
3.  **Search Garden:** Digite para buscar entre +130 modelos ("Llama...", "Mistral...").

> **UX:** O usuário não perde tempo configurando. Ele abre e já está rodando no Free Tier. Se precisar de "força bruta", troca o modelo na barra com 1 clique.

### Vertex AI Model Garden (Catalogo Completo)

Acesso a +130 modelos Foundation via Google Cloud:

| Família       | Modelos Principais                     | Uso              |
| :------------ | :------------------------------------- | :--------------- |
| **Google**    | Gemini 1.5 Pro/Flash, PaLM 2, Imagen 3 | Geral / Visão    |
| **Meta**      | Llama 3 (8B/70B), Code Llama           | Open Weights     |
| **Mistral**   | Mistral Large, Mixtral 8x7B            | Alta performance |
| **Anthropic** | Claude 3.5 Sonnet/Haiku                | Raciocínio       |
| **Zhipu AI**  | GLM-4                                  | Multilíngue      |

```javascript
// Exemplo chamada Universal (Model Garden)
const modelId = "publishers/anthropic/models/claude-3-5-sonnet";
const result = callVertexAI(modelId, prompt);
```

🔗 [Catálogo Completo Vertex AI](https://console.cloud.google.com/vertex-ai/model-garden)

### NoSQL Grátis

Drive + JSON = MongoDB-like sem custo.

---

## 💰 Economia Panda Coin (Modelo Sustentável)

### Pricing Tier (Margem vs Volume)

Para sustentar descontos de 50%, precisamos subir a régua do varejo.

> **Lógica:** Usuário comum paga pela conveniência (2.5x). Dev paga pelo volume (1.2x).

| Perfil                | Margem    | Preço  | Custo p/ Nós | Lucro   |
| :-------------------- | :-------- | :----- | :----------- | :------ |
| **Varejo (Standard)** | **2.5x**  | 250 PC | 100 PC       | ✅ 150% |
| **Atacado (Devs)**    | **1.25x** | 125 PC | 100 PC       | ✅ 25%  |

### Desconto de Atacado (Dev Packs)

| Pacote       | Volume     | Desconto    | Preço Final |
| :----------- | :--------- | :---------- | :---------- |
| **Starter**  | 1.000 PC   | 0% (Varejo) | 2.5x        |
| **Pro**      | 10.000 PC  | 30% OFF     | 1.75x       |
| **Business** | 100.000 PC | **50% OFF** | **1.25x**   |

> **Segurança:** Mesmo com 50% de desconto, **nunca** vendemos abaixo do custo + 25%.

### Inflação Dinâmica

```javascript
// Valor do PC baseado em watts/token disponível
const valorPC = Math.max(
  1.25, // Floor seguro subiu para 1.25x
  (demandaAtual / ofertaDisponivel) * baseRate,
);
```

### Taxa Marketplace Interno (5%)

| Tipo                        | Taxa | Destino          |
| :-------------------------- | :--- | :--------------- |
| **C2C** (Cliente → Cliente) | 5%   | Fundo Comunidade |
| **B2B** (Dev → Dev)         | 5%   | Inclusão Social  |

### Uso das Taxas

```
5% Marketplace → Fundo Comunidade
                      ↓
        ┌─────────────┴─────────────┐
        ↓                           ↓
   [Inclusão]              [Apoio Devs]
   Pequenos negócios       Projetos OSS
```

### Filosofia Econômica

```
"Cobrar mais do rico, incentivar a base"

Base (< 1k PC)     → 0% taxa adicional
Médio (1k-10k PC)  → 5% taxa
Alto (> 10k PC)    → 10% taxa
```

---

## 🌍 Comunidade & Gamificação

O Panda Fabrics não é apenas software, é uma **Sociedade Digital**.

### 🆔 Identidade & Login

Para fomentar a interação, suportamos logins de plataformas de dev e discussão.

- **Google:** Login Core (Obrigatório para Drive/Apps Script).
- **GitHub:** Para Devs exibirem seus portfólios e commits.
- **Reddit:** Para discussões, suporte e threads na comunidade.

### 🏆 Panda Badges (Gamificação)

Recompensamos comportamentos que geram valor para o ecossistema.

| Badge              | Requisito              | Recompensa (Bonificação)                       |
| :----------------- | :--------------------- | :--------------------------------------------- |
| **Early Adopter**  | Cadastro no Beta       | 5% Lifetime Discount na Energia                |
| **Code Ninja**     | Vender 10+ Módulos     | **1.000 XP** (Destaque Dev)                    |
| **Bug Hunter**     | Reportar falha crítica | 5.000 PC (Bounty)                              |
| **Top Seller**     | > 100k PC movimentados | Status **VIP** na Fila (mesmo com saldo baixo) |
| **Community Hero** | Top helper no Reddit   | Taxa de Marketplace reduzida (2%)              |

### 🌐 Estratégia de Domínios

O ecossistema será federado sob domínios premium para autoridade e segurança.

- **Principal:** `pandafabrics.io` (Hub, Store, Dashboard)
- **Devs:** `*.panda.dev` (Subdomínios para Apps dos usuários, ex: `trader.panda.dev`)
- **API:** `api.pandafabrics.io` (Gateway central)

---

---

## 🛠️ Panda Arsenal (Google Power-Ups)

Expandimos o escopo para cobrir todo o ecossistema Alphabet. Transformamos APIs complexas em módulos "Plug & Play".

### 1. Panda Logistics (Maps Platform) 🚚

> "Otimização de rotas e frota com IA."

- **Route Optimization API:** Cálculo de rotas multi-paradas (Traveling Salesman Problem).
- **Address Validation:** Higienização de endereços de entrega.
- **Weather API:** Previsão climática para logística agronegócio/eventos.

### 2. Panda Office (Workspace Automation) 🏢

> "Seu escritório, no piloto automático."

- **AppSheet Integration:** Criar Apps Mobile sem código a partir de planilhas.
- **Gmail/Calendar Agents:** Agendamento inteligente e triagem de emails.
- **Meet & Chat:** Bots para atas de reunião e notificações de equipe.

### 3. Panda Sales (Vertex AI Agents) 💰

> "Atendimento e Vendas 24/7."

- **Customer Agents:** Chatbots treinados com os PDFs da empresa (RAG).
- **Forms Automation:** Qualificação de leads automática via Google Forms.

### 4. Panda Data (BigQuery & Looker) 📊

> "Business Intelligence de gente grande."

- **BigQuery Connection:** Armazenamento massivo de dados (Data Warehouse) via Sheets.
- **Looker Studio:** Dashboards profissionais embutidos no CRM.

---

## ⚡ Estratégia de Caching & Performance

Para garantir velocidade de "aplicativo nativo" e aliviar o Drive (lento para leitura frequente), utilizamos uma arquitetura de 3 camadas.

### 1. Hot Layer (Firebase Realtime DB)

- **Uso:** Dados de sessão, fila de tarefas, notificações, estado do HUD.
- **Vantagem:** Latência de milissegundos. Push em tempo real.
- **Custo:** Nível gratuito generoso (Spark Plan).

### 2. Warm Layer (Chrome Cache / Service Workers)

- **Uso:** Recursos estáticos (HTML, CSS, JS), Módulos baixados, Cache de API offline.
- **Vantagem:** O sistema roda mesmo sem internet (PWA Offline-First).
- **Tecnologia:** `CacheStorage API` + `IndexedDB`.

### 3. Cold Layer (Google Drive)

- **Uso:** Persistência de longo prazo, Backups, Arquivos grandes (PDFs, Vídeos).
- **Vantagem:** Armazenamento massivo gratuito (15GB+).

### Fluxo de Dados

```
[Navegador]
    ↔ (ms) [Service Worker] (Cache Local)
    ↔ (ms) [Firebase] (Realtime Sync)
            ↓ (async backup)
          [Google Drive] (Cold Storage)
```

---

### Taxas de Saque

| Tipo                      | Taxa           |
| :------------------------ | :------------- |
| **Interno (PC → PC)**     | 5% marketplace |
| **FIAT (PC → R$)**        | +2% adicional  |
| **Crypto (PC → SOL/ETH)** | +1% bridge     |

---

## 🖥️ NVIDIA Online (GPU Rental)

### Conceito

Locação de GPUs via Colab/Cloud para processamento pesado.

```

┌─────────────────────────────────────────┐
│ NVIDIA GPU RENTAL │
├─────────────────────────────────────────┤
│ [Cliente WebGPU] │
│ ↓ (task pesada) │
│ [Panda Core detecta] │
│ ↓ │
│ [Roteia para Colab GPU] │
│ ↓ │
│ [cuDF/CUDA processa] │
│ ↓ │
│ [Resultado volta] │
│ ↓ │
│ [Cobra em Panda Coins] │
└─────────────────────────────────────────┘

```

### Pricing GPU

| GPU        | PC/hora |
| :--------- | :------ |
| T4 (entry) | 30 PC   |
| A100 (pro) | 100 PC  |
| TPU (ML)   | 150 PC  |

### Economia de Tokens (WebGPU Local)

```

Cliente tem GPU → Processa local → 0 tokens
Cliente sem GPU → Aluga nossa → Paga PC

```

"Cobrar mais do rico, incentivar a base"

Base (< 1k PC) → 0% taxa adicional
Médio (1k-10k PC) → 5% taxa
Alto (> 10k PC) → 10% taxa

````

---

## 🔄 Pilar 3: Sistema Híbrido (Online/Offline)

### PWA Offline-First

```javascript
// Fila local quando offline
localStorage.setItem("pendingActions", JSON.stringify(queue));

// Sync quando volta online
window.addEventListener("online", syncPendingActions);
````

### Sync Logic

| Operação | Descrição                |
| :------- | :----------------------- |
| **Pull** | Baixa deltas do servidor |
| **Push** | Envia mudanças locais    |

### Agente Local (Rust/Tauri)

- Trade de Alta Frequência
- Treinamento de IA
- Usa CPU/GPU do cliente
- Zero latência internet

### Suporte GPU Local

| Vendor     | Suporte   | Tecnologia |
| :--------- | :-------- | :--------- |
| **NVIDIA** | ✅ Nativo | CUDA       |
| **AMD**    | ✅ v4.0   | ROCm       |
| **Intel**  | ⏳ Futuro | oneAPI     |

> "Quando o Agente Local chegar, AMD vai brilhar no hardware do cliente!" 🔴

---

## 🖥️ Pilar 4: Locação de Energia (não VM)

### Mudança de Paradigma

```
❌ "Tenho um servidor ligado 24h" (caro)
✅ "Comprei 1000 PC pra rodar script" (sob demanda)
```

### Colab Enterprise (Serverless GPU)

```python
# Liga → Processa → Desliga
%load_ext cudf.pandas
df = pd.read_parquet("big_data.parquet")
# Paga só pelos minutos usados
```

### BYOD (Bring Your Own Device)

Usar máquina do cliente = custo **ZERO** de infra.

---

## 🖼️ Multi-Monitor (Popups Independentes)

### Conceito

Cada módulo pode ser aberto em **janela separada** para multi-monitor.

```javascript
// Abrir módulo em popup independente
function abrirModuloPopup(modulo) {
  window.open(
    `CRM.html?modo=popup&modulo=${modulo}`,
    modulo,
    "width=800,height=600,menubar=no",
  );
}
```

### Uso

- Financeiro em um monitor
- CRM em outro
- Chat IA em terceiro

---

## 📊 Arquitetura Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    PANDA FABRICS CORE                           │
├─────────────────────────────────────────────────────────────────┤
│  [Frontend PWA]  ←─────→  [GAS Backend]  ←─────→  [Drive DB]   │
│       ↓                        ↓                      ↓         │
│  [IndexedDB]              [Gemini API]           [GCS]         │
│  (Offline)                (IA)                   (Big Data)    │
│       ↓                        ↓                      ↓         │
│  [Agente Local]          [Colab GPU]          [Webhooks]       │
│  (Rust/Tauri)            (cuDF)               (Kiwify)         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Próximo Passo: Sync Híbrida

Implementar:

1. `Repository.js` - Push/Pull com Drive
2. `ServiceWorker` - Cache offline
3. `SyncManager` - Fila de ações pendentes

---

© 2026 Panda Fabrics - Canvas Aberto para Desenvolvedores
