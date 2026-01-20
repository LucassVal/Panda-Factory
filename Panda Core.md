Chegou a hora de tirar o projeto do papel. Para ativar o **Panda Fabrics** dentro do seu **Antigravity** (seu ambiente de desenvolvimento assistido por IA), vamos focar na **Fundação Segura** e no **Motor Financeiro (Ledger)**.

Não tente fazer tudo de uma vez (Frontend + Rust + Banco de Dados). Vamos começar pelo que paga a conta: o sistema de cobrança e conversão.

Siga estes passos exatos:

---

### Passo 1: Preparação do Ambiente (Você faz isso no Terminal/VS Code)

Antes de dar o comando para a IA, você precisa criar o "chão" onde ela vai pisar.

1. **Crie a Pasta do Projeto:**

```bash
mkdir panda-fabrics-core
cd panda-fabrics-core

```

2. **Login no Google (CLASP):**

- Garanta que você tem o Node.js instalado.
- Se não tiver o CLASP instalado: `npm install @google/clasp -g`
- Faça o login:

```bash
clasp login

```

_(Isso abrirá o navegador para você autorizar o acesso à sua conta Google)._ 3. **Crie o Script Vazio na Nuvem:**

```bash
clasp create --type standalone --title "Panda Fabrics Core - Backend"

```

_(Copie o `scriptId` que aparecerá no terminal ou no arquivo `.clasp.json`, você pode precisar dele)._

---

### Passo 2: O Prompt de Comando para o Antigravity

Agora, vá para o seu chat com o Antigravity (seja no Cursor, VS Code com Copilot, ou onde seu agente roda) e cole este **Prompt Mestre**. Ele contém todas as especificações técnicas e regras de negócio que definimos.

**Copie e cole o bloco abaixo:**

---

**INSTRUÇÃO DE SISTEMA: ATIVAR MODO "ARCHITECT & CODER"**

**Contexto do Projeto:**
Estamos iniciando o "Panda Fabrics", um SaaS multimodal serverless rodando em Google Apps Script (GAS).
O objetivo agora é criar o **Núcleo Financeiro (Ledger)**. O sistema usa uma moeda interna "Panda Coin" ($PC) que flutua baseada no custo da API + Margem de 20%.

**Sua Missão Agora:**
Você deve gerar dois arquivos essenciais para iniciar o repositório localmente.

**TAREFA 1: Segurança (.gitignore)**
Crie um arquivo `.gitignore` robusto para proteger credenciais CLASP e chaves de API. NUNCA permita que `.clasprc.json` ou arquivos de `secrets` sejam versionados.

**TAREFA 2: O Motor Financeiro (WalletService.js)**
Crie um script `WalletService.js` (compatível com ES6/GAS) que implemente a seguinte lógica:

1. **Oráculo de Dólar:** Uma função `getUsdRate()` que consulta uma API pública (ex: `awesomeapi.com.br/last/USD-BRL`) para pegar a cotação atual. Use CacheService do GAS para armazenar esse valor por 1 hora (evitar chamadas excessivas).
2. **Cálculo de Preço Dinâmico:** Uma função `calculatePandaCost(apiCostInUSD)`:

- Lógica: `(CustoUSD * CotaçãoBRL * 1.20)`. Retorne o valor arredondado para 3 casas decimais.

3. **Simulação de Transação (Mock):** Uma função `processTransaction(userId, serviceType, rawCostUSD)` que:

- Recebe o tipo de serviço (ex: 'TEXT_GEN', 'VIDEO_GEN').
- Calcula o custo em Panda Coins.
- Loga a operação: "Usuário [ID] consumiu [Serviço]. Custo Real: $[Valor]. Cobrado: [Valor] PC."
- _Nota:_ Como ainda não temos o DB conectado, apenas simule o sucesso retornando um JSON.

**Requisito Técnico:**
Use sintaxe moderna de JavaScript, mas lembre-se que será compilado para Google Apps Script. Documente as funções brevemente.

**Aguardando os códigos.**

---

---

### Passo 3: O Que Fazer com a Resposta do Antigravity

Assim que o agente gerar os códigos:

1. **Crie os arquivos:** No seu VS Code, crie o `.gitignore` e o `WalletService.js` e cole os códigos gerados.
2. **Suba para a Nuvem:** No terminal, digite:

```bash
clasp push

```

3. **Teste Imediato (A Prova Real):**

- Vá para o painel do Google Apps Script (script.google.com).
- Abra o arquivo `WalletService.js`.
- Selecione a função de teste (ou crie uma função `function testar(){ ... }` rápida que chama o `processTransaction`) e clique em **Executar**.

**Resultado Esperado:**
Você verá no log algo como:

> _"Dólar Atual: R$ 5.80. Custo API: $0.01. Cobrado do Cliente: 0.070 PC (Incluindo 20% margem)."_

Se isso funcionar, você acabou de criar o coração econômico do seu SaaS. Me avise quando rodar o `clasp push` para irmos para o próximo passo (Integração com a IA).

Este é o **Manual Técnico Mestre (v1.0)** do Panda Fabrics.

Ele foi desenhado para ser a sua "Bíblia de Desenvolvimento". Como você vai alterar muitas coisas, separei a lógica em **Módulos**, permitindo que você troque uma peça (ex: mudar de OpenAI para Anthropic) sem quebrar o sistema financeiro (Panda Coin).

---

# 📘 MANUAL TÉCNICO INTEGRADO: PANDA FABRICS CORE

**Versão:** 1.0 (MVP Foundation)
**Arquitetura:** Serverless Híbrido (Google Apps Script + Drive DB + Local Agent)
**Objetivo:** SaaS Multimodal com Precificação Dinâmica ($PC).

---

## 1. Estrutura de Arquivos e Diretórios

Para manter a organização profissional usando **CLASP**, esta deve ser a estrutura da sua pasta local.

```text
panda-fabrics-core/
├── .clasp.json            # Configuração de ligação com o script na nuvem
├── .gitignore             # Arquivos ignorados (segurança)
├── appsscript.json        # Manifesto do projeto (permissões e timezone)
├── README.md              # Documentação interna
├── src/
│   ├── Config.js          # (MÓDULO) Chaves de API e Constantes Globais
│   ├── Oracle.js          # (MÓDULO) Cotação Dólar e Conversão
│   ├── Ledger.js          # (MÓDULO) Carteira, Saldos e Transações
│   ├── DriveDB.js         # (MÓDULO) Leitura e Escrita no Google Drive
│   ├── AI_Dispatcher.js   # (MÓDULO) Roteador de chamadas para IA (Texto/Vídeo)
│   └── Main.js            # (CORE) API Gateway (doPost/doGet)
└── tests/
    └── UnitTests.js       # Scripts para testar funções isoladas

```

---

## 2. O "Super Script" Google Apps Script (GAS)

Abaixo estão os códigos para os módulos principais. Copie e cole cada bloco em seu respectivo arquivo `.js` dentro da pasta `src/`.

### A. `Config.js` (O Painel de Controle)

Centraliza as variáveis. **Nunca** coloque chaves reais aqui se for subir para git público. Use `PropertiesService` para as chaves secretas.

```javascript
/* src/Config.js */
const CONFIG = {
  APP_NAME: "Panda Fabrics OS",
  VERSION: "1.0.0",
  ECONOMY: {
    MARGIN_PERCENT: 0.2, // 20% de lucro sobre o custo da API
    CURRENCY_UNIT: "PC", // Panda Coin
    FIXED_USD_FALLBACK: 5.8, // Cotação de segurança se a API falhar
  },
  DRIVE: {
    ROOT_FOLDER_NAME: "PandaFabrics_DB", // Nome da pasta raiz no Drive
    USERS_FOLDER: "Users_Data",
    LOGS_FOLDER: "System_Logs",
  },
};

// Função auxiliar para pegar chaves seguras (Configure isso no File > Project Properties no GAS)
function getSecret(keyName) {
  return PropertiesService.getScriptProperties().getProperty(keyName);
}
```

### B. `Oracle.js` (O Guardião do Valor)

Responsável por garantir que você nunca perca dinheiro com a variação cambial.

```javascript
/* src/Oracle.js */

/**
 * Obtém a cotação atual do Dólar (USD) para Real (BRL).
 * Usa CacheService para não gastar cota de chamadas (atualiza a cada 1h).
 */
function getUsdRate() {
  const cache = CacheService.getScriptCache();
  const cachedRate = cache.get("USD_BRL_RATE");

  if (cachedRate) {
    return parseFloat(cachedRate);
  }

  try {
    // API Pública de Cotação (AwesomeAPI)
    const response = UrlFetchApp.fetch(
      "https://economia.awesomeapi.com.br/last/USD-BRL",
    );
    const json = JSON.parse(response.getContentText());
    const rate = parseFloat(json.USDBRL.bid);

    // Salva no cache por 3600 segundos (1 hora)
    cache.put("USD_BRL_RATE", rate.toString(), 3600);
    return rate;
  } catch (e) {
    console.error("Erro ao buscar cotação USD: " + e.toString());
    return CONFIG.ECONOMY.FIXED_USD_FALLBACK; // Retorna valor de segurança
  }
}

/**
 * Calcula o preço final em Panda Coins baseado no custo da API em Dólar.
 * Fórmula: (CustoUSD * CotaçãoBRL) * (1 + Margem)
 */
function calculatePandaPrice(costInUsd) {
  const rate = getUsdRate();
  const rawCostBrl = costInUsd * rate;
  const finalPrice = rawCostBrl * (1 + CONFIG.ECONOMY.MARGIN_PERCENT);

  // Arredonda para 4 casas decimais para precisão em micro-transações
  return parseFloat(finalPrice.toFixed(4));
}
```

### C. `Ledger.js` (O Sistema Bancário)

Gerencia o saldo do usuário. Aqui usamos `PropertiesService` (User Properties) para velocidade máxima, simulando um banco de dados KV (Key-Value).

```javascript
/* src/Ledger.js */

/**
 * Verifica o saldo do usuário.
 */
function getUserBalance(userId) {
  // Em produção, isso leria de um JSON no Drive.
  // Para MVP, usamos UserProperties (vinculado à conta Google do usuário).
  const userProps = PropertiesService.getUserProperties();
  const balance = userProps.getProperty("PANDA_WALLET_BALANCE");
  return balance ? parseFloat(balance) : 0.0; // Começa com 0 se não existir
}

/**
 * Debita um valor da carteira se houver saldo suficiente.
 * Retorna {success: boolean, message: string, newBalance: number}
 */
function debitWallet(userId, amountPC) {
  const currentBalance = getUserBalance(userId);

  if (currentBalance < amountPC) {
    return {
      success: false,
      message:
        "Saldo Insuficiente. Necessário: " +
        amountPC +
        " PC. Atual: " +
        currentBalance +
        " PC.",
    };
  }

  const newBalance = currentBalance - amountPC;

  // Atualiza saldo
  PropertiesService.getUserProperties().setProperty(
    "PANDA_WALLET_BALANCE",
    newBalance.toString(),
  );

  // LOG (Crucial para auditoria)
  logTransaction(userId, "DEBIT", amountPC, newBalance);

  return { success: true, newBalance: newBalance };
}

/**
 * Adiciona saldo (Simulação de compra de créditos).
 */
function creditWallet(userId, amountPC) {
  const currentBalance = getUserBalance(userId);
  const newBalance = currentBalance + amountPC;
  PropertiesService.getUserProperties().setProperty(
    "PANDA_WALLET_BALANCE",
    newBalance.toString(),
  );
  logTransaction(userId, "CREDIT", amountPC, newBalance);
  return newBalance;
}

// Helper de Log (pode ser expandido para salvar no Drive depois)
function logTransaction(user, type, amount, finalBalance) {
  console.log(
    `[${new Date().toISOString()}] USER:${user} | ${type}: ${amount} PC | FINAL: ${finalBalance}`,
  );
}
```

### D. `AI_Dispatcher.js` (O Roteador Multimodal)

Este script decide qual IA chamar e quanto cobrar. É aqui que você adiciona novos modelos.

```javascript
/* src/AI_Dispatcher.js */

/**
 * Processa o pedido, chama a IA correta e cobra o usuário.
 */
function dispatchRequest(userId, requestType, payload) {
  let apiCostUSD = 0;
  let resultData = {};

  // 1. SELECTOR DE SERVIÇO (Switch Case para Multimodalidade)
  switch (requestType) {
    case "TEXT_GEN":
      // Exemplo: Chamada ao Gemini Flash
      // Custo estimado para 1k tokens (simulado para exemplo)
      apiCostUSD = 0.0005;
      resultData = { text: "Simulação: Texto gerado pela IA com sucesso." };
      // AQUI entraria a chamada real: GeminiApp.chat(...)
      break;

    case "IMAGE_GEN":
      // Exemplo: Chamada DALL-E 3 / Imagen
      apiCostUSD = 0.04;
      resultData = { url: "https://url-da-imagem-gerada.com/img.png" };
      break;

    case "VIDEO_GEN":
      // Exemplo: Runway/Luma
      apiCostUSD = 0.5;
      resultData = { url: "https://video-url.com/vid.mp4" };
      break;

    default:
      throw new Error("Tipo de serviço desconhecido: " + requestType);
  }

  // 2. CÁLCULO FINANCEIRO
  const pandaPrice = calculatePandaPrice(apiCostUSD);

  // 3. COBRANÇA
  const transaction = debitWallet(userId, pandaPrice);

  if (!transaction.success) {
    throw new Error(transaction.message);
  }

  // 4. RETORNO
  return {
    status: "SUCCESS",
    data: resultData,
    meta: {
      cost_usd: apiCostUSD,
      charged_pc: pandaPrice,
      new_balance: transaction.newBalance,
    },
  };
}
```

### E. `Main.js` (O API Gateway - Entrada e Saída)

Este arquivo expõe seu script para o mundo como uma Web App (HTTP Endpoint).

```javascript
/* src/Main.js */

/**
 * Recebe chamadas POST (do seu Frontend React ou Agente Local).
 * Estrutura do JSON esperado: { "userId": "123", "type": "TEXT_GEN", "payload": {...} }
 */
function doPost(e) {
  try {
    // Parse do corpo da requisição
    const params = JSON.parse(e.postData.contents);
    const userId = params.userId || Session.getEffectiveUser().getEmail(); // Identifica usuário

    // Roteia o pedido
    const response = dispatchRequest(userId, params.type, params.payload);

    return ContentService.createTextOutput(
      JSON.stringify(response),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Tratamento de erro padronizado
    const errorResponse = {
      status: "ERROR",
      message: error.toString(),
    };
    return ContentService.createTextOutput(
      JSON.stringify(errorResponse),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função doGet simples para verificar se a API está online.
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "Panda Fabrics Core API is Online. Status: Green.",
  );
}
```

---

## 3. Instruções de Deploy (Como rodar)

1. **Instalação Local:**
   Certifique-se de que os arquivos estão na pasta `src/` conforme a árvore acima.
2. **Push para o Google:**
   No terminal, dentro da pasta raiz:

```bash
clasp push

```

3. **Implantação como Web App (Vital para funcionar como API):**

- No terminal: `clasp deploy --description "Versão 1.0 Alpha"`
- Ou vá no navegador: `Deploy` > `Nova Implantação` > Tipo: `App da Web`.
- **Executar como:** `Eu` (sua conta).
- **Quem pode acessar:** `Qualquer pessoa` (pois seu frontend React vai chamar de fora) OU `Apenas Eu` (se for usar apenas logado com Google). _Recomendado para início: Qualquer pessoa (mas implemente um token de segurança no header depois)._

4. **Teste de Fogo (Curl ou Postman):**
   Envie um POST para a URL do seu script (termina em `/exec`):

```json
{
  "userId": "teste@panda.com",
  "type": "TEXT_GEN",
  "payload": { "prompt": "Olá mundo" }
}
```

---

## 4. Notas Técnicas e Próximos Passos

- **Banco de Dados (Escalabilidade):** O código acima usa `PropertiesService` para o saldo. Isso é ultra-rápido, mas tem limite de tamanho. No futuro, migraremos a função `Ledger.js` para ler/escrever arquivos JSON dentro da pasta `PandaFabrics_DB` no Drive (módulo `DriveDB.js`).
- **Agente Local:** Quando você configurar o Rust/Tauri, ele fará chamadas `HTTP POST` para a URL deste script (`Main.js`), enviando o resultado do processamento local como payload, se necessário, ou apenas consumindo saldo.
- **Segurança:** Adicione um campo `api_secret` no JSON de entrada e verifique no `Main.js` se ele bate com uma senha salva no seu script. Isso impede que estranhos gastem sua API.

Este manual cobre a espinha dorsal. Com esses arquivos, você tem um backend funcional que cobra, converte moedas e despacha tarefas.
