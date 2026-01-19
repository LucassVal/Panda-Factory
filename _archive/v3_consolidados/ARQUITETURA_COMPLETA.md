# 🏗️ ARQUITETURA TÉCNICA - TitanGestão PRO

**Versão:** 3.0 PWA (Google-First)  
**Arquitetura:** Híbrida (Offline + Online)  
**Sincronização:** Google Apps Script  
**Preparação:** AI-Ready (Gemini API)

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitetura Google-First](#arquitetura-google-first)
4. [Fluxos Técnicos](#fluxos-técnicos)
5. [Sincronização Multi-Usuário](#sincronização-multi-usuário)
6. [Preparação para IA](#preparação-para-ia)
7. [Decisões Arquiteturais](#decisões-arquiteturais)
8. [Escalabilidade](#escalabilidade)

---

## 🎯 Visão Geral

### Princípios Fundamentais

1. **Google-First:** Máximo aproveitamento do ecossistema Google
2. **Offline-First:** Funciona sem internet, sincroniza quando possível
3. **Privacy-First:** Dados no Google Drive DO CLIENTE
4. **AI-Ready:** Preparado para agentes IA (Gemini API)
5. **Cost-Efficient:** Custo operacional mínimo (R$ 1-10/mês)

### Arquitetura em 3 Camadas

```
┌─────────────────────────────────────┐
│  CAMADA 1: Frontend (PWA)           │
│  • HTML5 + CSS3 + JavaScript ES6+   │
│  • Service Worker (cache offline)   │
│  • IndexedDB (banco local)          │
│  • Chart.js, CryptoJS (libs)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  CAMADA 2: Sincronização (Google)   │
│  • Google Drive API (storage)       │
│  • Google Apps Script (merge agent) │
│  • OAuth 2.0 (autenticação)         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  CAMADA 3: Inteligência (Futuro)    │
│  • Gemini API (agentes IA)          │
│  • Cloud Functions (automações)     │
│  • Vertex AI (ML models)            │
└─────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

### Frontend (Cliente)

| Componente       | Tecnologia         | Offline | Por quê                                           |
| ---------------- | ------------------ | ------- | ------------------------------------------------- |
| **Interface**    | HTML5 + CSS3       | ✅      | Universal, leve, PWA nativo                       |
| **Lógica**       | JavaScript ES6+    | ✅      | Sem frameworks, zero dependências                 |
| **Cache**        | Service Worker API | ✅      | PWA padrão, funciona em todos browsers            |
| **Banco Local**  | IndexedDB          | ✅      | Mais rápido que localStorage, suporta GB de dados |
| **Gráficos**     | Chart.js (local)   | ✅      | Biblioteca standalone, sem CDN                    |
| **Criptografia** | CryptoJS (local)   | ✅      | AES-256, opcional                                 |

### Backend (Google)

| Componente         | Tecnologia         | Custo       | Por quê                                 |
| ------------------ | ------------------ | ----------- | --------------------------------------- |
| **Storage**        | Google Drive API   | R$ 0\*      | Cliente paga (15GB grátis), privacidade |
| **Merge Engine**   | Google Apps Script | R$ 1-10/mês | Escala até 10k clientes, confiável      |
| **Auth**           | OAuth 2.0 (Google) | R$ 0        | Padrão Google, seguro, fácil            |
| **Database Users** | MongoDB Atlas      | R$ 0        | 512MB grátis, suficiente                |

\*Cliente usa Google Drive gratuitamente (15GB incluídos na conta Google)

### Futuro (IA)

| Componente     | Tecnologia      | Custo        | Uso                       |
| -------------- | --------------- | ------------ | ------------------------- |
| **Agente IA**  | Gemini API      | R$ 0,001/req | WhatsApp automation       |
| **Automações** | Cloud Functions | R$ 0-5/mês   | Triggers, scheduled tasks |
| **ML Models**  | Vertex AI       | R$ 0-20/mês  | Previsões, insights       |

---

## 🔷 Arquitetura Google-First

### Por Quê Google?

**Decisão Estratégica:** Máximo aproveitamento do ecossistema Google

1. **Google Drive:**
   - ✅ Privacidade (dados do cliente)
   - ✅ Custo zero (15GB grátis pra cliente)
   - ✅ Confiabilidade (99,9% uptime)
   - ✅ API madura (v3, bem documentada)

2. **Google Apps Script:**
   - ✅ Serverless (sem infraestrutura)
   - ✅ Custo baixíssimo (R$ 1-10/mês até 10k clientes)
   - ✅ Integração nativa com Drive
   - ✅ JavaScript (mesma linguagem frontend)

3. **Google OAuth:**
   - ✅ Usuários já têm conta Google
   - ✅ Login com 1 clique
   - ✅ Segurança padrão Google

4. **Gemini API (Futuro):**
   - ✅ Mesmo ecossistema (fácil integrar)
   - ✅ Modelos poderosos (IA state-of-art)
   - ✅ Preço competitivo (vs OpenAI)

### Estrutura Google Drive (Cliente)

```
Google Drive do Cliente/
│
└── TitanGestao/
    ├── master.json              (fonte da verdade)
    ├── mudancas.json            (fila de sync)
    ├── config.json              (configurações)
    │
    ├── backups/                 (automático)
    │   ├── master_20260117.json
    │   └── master_20260116.json
    │
    └── exports/                 (manuais)
        ├── clientes_backup.xlsx
        └── orcamento_001.pdf
```

---

## 🔄 Fluxos Técnicos

### Fluxo 1: Primeiro Acesso (Setup)

```
1. Cliente compra (Kiwify)
   └─> Recebe: codigo_ativacao = "TIT-ABC123-DEF456"

2. Acessa tocadobarbaro.com
   └─> Insere código de ativação

3. Backend valida código
   └─> MongoDB: { codigo: "TIT-ABC123", usado: false, email: "cliente@email.com" }
   └─> Se válido: marca como usado=true

4. Cliente cria senha
   └─> Hash bcrypt → MongoDB

5. Cliente clica "Conectar Google Drive"
   └─> OAuth 2.0 flow:
       ├─ Redirect para accounts.google.com
       ├─ Cliente autoriza "TitanGestão acessar Google Drive"
       ├─ Redirect de volta com access_token
       └─> Backend salva: { userId, driveToken, refreshToken }

6. Backend cria estrutura no Drive do cliente
   └─> Drive API:
       ├─> Criar pasta "TitanGestao"
       ├─> Criar master.json (vazio: {})
       ├─> Criar mudancas.json (vazio: [])
       └─> Retornar: folderId

7. Service Worker cacheia app
   └─> IndexedDB criado localmente
   └─> App pronto para offline

8. Cliente ve dashboard vazio
   └─> "Bem-vindo! Importe clientes ou crie o primeiro"
```

### Fluxo 2: Edição Offline

```
1. João abre sistema (sem internet)
   └─> Service Worker serve cache
   └─> IndexedDB carrega dados locais

2. João edita Cliente A
   └─> {
         id: "CLI_001",
         nome: "João Silva Construtora",
         telefone: "(11) 98765-4321"
       }

3. Sistema salva localmente
   └─> IndexedDB.put('clientes', cliente)
   └─> Marca como pendente sync:
       { _needsSync: true, _lastModified: 1705518000 }

4. João fecha sistema
   └─> Dados seguros no IndexedDB

5. João volta online
   └─> Service Worker detecta: navigator.onLine = true
   └─> Trigger: syncPendingChanges()
```

### Fluxo 3: Sincronização Online

```
1. Sistema detecta "voltou online"
   └─> Service Worker: sync event

2. IndexedDB busca pendências
   └─> const pendentes = db.getAll('clientes')
         .filter(c => c._needsSync === true)

3. Para cada mudança pendente:
   └─> Criar entrada na fila:
       {
         id: "MUD_1705518000",
         entity: "clientes",
         entityId: "CLI_001",
         campo: "nome",
         valor: "João Silva Construtora",
         timestamp: 1705518000,
         usuario: "joao@empresa.com"
       }

4. Upload para Drive: mudancas.json
   └─> Drive API (OAuth token do cliente):
       PUT /files/{mudancasFileId}
       Body: array de mudanças

5. Apps Script detecta mudança (trigger)
   └─> onEdit() ou time-driven (3s)

6. Apps Script: Merge Engine
   └─> [Ver Fluxo 4]

7. IndexedDB marca como sincronizado
   └─> { _needsSync: false, _synced: true }
```

### Fluxo 4: Merge Engine (Apps Script)

```javascript
// Apps Script (nossa conta Google)
function mergeClienteData() {
  const clientes = getClientesAtivos(); // Da tabela MongoDB

  clientes.forEach((cliente) => {
    const token = cliente.driveToken;

    // 1. Baixar arquivos do Drive do cliente
    const mudancasFile = DriveApp.getFolderById(cliente.folderId)
      .getFilesByName("mudancas.json")
      .next();
    const mudancas = JSON.parse(mudancasFile.getBlob().getDataAsString());

    if (mudancas.length === 0) return; // Nada pra fazer

    const masterFile = DriveApp.getFolderById(cliente.folderId)
      .getFilesByName("master.json")
      .next();
    const master = JSON.parse(masterFile.getBlob().getDataAsString());

    // 2. MERGE INTELIGENTE
    mudancas.forEach((mudanca) => {
      const { entity, entityId, campo, valor, timestamp, usuario } = mudanca;

      // Inicializar se não existir
      if (!master[entity]) master[entity] = {};
      if (!master[entity][entityId]) master[entity][entityId] = {};

      // Last-write-wins (por timestamp)
      const campoAtual = master[entity][entityId][campo];

      if (!campoAtual || timestamp > campoAtual._timestamp) {
        master[entity][entityId][campo] = {
          value: valor,
          _timestamp: timestamp,
          _modifiedBy: usuario,
        };
      }
    });

    // 3. Salvar master atualizado
    masterFile.setContent(JSON.stringify(master, null, 2));

    // 4. Limpar fila
    mudancasFile.setContent("[]");

    // 5. Log
    Logger.log(`✅ Merge ${cliente.email}: ${mudancas.length} mudanças`);
  });
}

// Trigger: Time-driven, every 3 seconds
```

### Fluxo 5: Multi-Usuário (João e Maria)

```
T=0s
├─ João abre sistema → Baixa master.json do Drive
└─ Maria abre sistema → Baixa master.json do Drive
   (Ambos têm mesma versão)

T=10s
└─ João edita Cliente A campo "nome"
   ├─> IndexedDB local
   ├─> Manda pra fila mudancas.json
   └─> Apps Script merge (3s depois)
       └─> master.json atualizado

T=15s
└─ Maria busca atualizações (intervalo 5s)
   ├─> Baixa master.json
   ├─> Compara timestamp local
   ├─> Detecta: master mais novo
   └─> Atualiza IndexedDB + UI
       └─> Maria VÊ mudança do João

T=20s
└─ Maria edita Cliente A campo "telefone"
   ├─> Processo igual
   └─> Apps Script faz merge
       └─> Nome (João) + Telefone (Maria) = Ambas mudanças preservadas

RESULTADO: Zero conflitos (merge por campo)
```

---

## 🧠 Preparação para IA

### Arquitetura AI-Ready

**Decisão:** Sistema preparado para agentes IA sem refatoração futura

```
┌─────────────────────────────────────┐
│  HOJE (v1.0)                        │
│  • PWA + Apps Script                │
│  • Multi-user manual                │
│  • WhatsApp manual (botão)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  FUTURO (v2.0 - Junho 2026)         │
│  • + Gemini API                     │
│  • + Cloud Functions (triggers)     │
│  • + Agente WhatsApp IA             │
└─────────────────────────────────────┘
```

### Integração Gemini API (v2.0)

**Agente IA WhatsApp:**

```javascript
// Cloud Function (trigger: novo lead no CRM)
exports.onNovoLead = functions.firestore
  .document("clientes/{clienteId}")
  .onCreate(async (snap, context) => {
    const cliente = snap.data();

    // 1. Chamar Gemini API
    const prompt = `
      Gere mensagem de boas-vindas para:
      Nome: ${cliente.nome}
      Origem: ${cliente.fonte}
      Interesse: ${cliente.interesse}
      
      Tom: Amigável, consultivo
    `;

    const response = await gemini.generateContent(prompt);
    const mensagem = response.text();

    // 2. Enviar WhatsApp automático
    await whatsappAPI.send({
      to: cliente.telefone,
      message: mensagem,
    });

    // 3. Salvar no histórico
    const mudanca = {
      entityId: cliente.id,
      campo: "historico",
      valor: {
        tipo: "whatsapp_ia",
        mensagem: mensagem,
        enviado: true,
        timestamp: Date.now(),
      },
    };

    // 4. Sincronizar com Drive (Apps Script pega)
    await uploadMudanca(cliente.driveToken, mudanca);
  });
```

**Preparação no Código Atual:**

```javascript
// CRM.html (v1.0 - já preparado)
const historico = cliente.historico || [];

historico.push({
  id: `HIST_${Date.now()}`,
  tipo: "whatsapp_manual", // v2.0 será 'whatsapp_ia'
  mensagem: mensagemTexto,
  enviado: true,
  timestamp: Date.now(),
  usuario: sessionStorage.getItem("usuarioLogado"),
});

// v2.0 adiciona campo 'ia_generated: true'
```

### Estrutura de Dados AI-Ready

**Hoje (v1.0):**

```json
{
  "clientes": {
    "CLI_001": {
      "nome": { "value": "João Silva", "_timestamp": 1705518000 },
      "telefone": { "value": "(11) 98765-4321", "_timestamp": 1705518000 }
    }
  }
}
```

**Futuro (v2.0 - compatível):**

```json
{
  "clientes": {
    "CLI_001": {
      "nome": { "value": "João Silva", "_timestamp": 1705518000 },
      "telefone": { "value": "(11) 98765-4321", "_timestamp": 1705518000 },
      "_ia_insights": {
        "probabilidade_compra": 0.85,
        "proximo_contato": "2026-01-20",
        "mensagem_sugerida": "Olá João, vamos agendar..."
      }
    }
  }
}
```

---

## 🔀 Decisões Arquiteturais

### Por quê PWA e não App Nativo?

| Critério            | PWA                | App Nativo                          |
| ------------------- | ------------------ | ----------------------------------- |
| **Desenvolvimento** | 1 codebase         | 3 codebases (iOS, Android, Desktop) |
| **Distribuição**    | URL (instant)      | App Store (review 7-14 dias)        |
| **Updates**         | Automático (cache) | Usuário precisa atualizar           |
| **Custo**           | R$ 0               | R$ 800/ano (developer accounts)     |
| **Offline**         | ✅ Service Worker  | ✅ Native                           |

**Decisão:** PWA = 90% das vantagens, 10% do custo

### Por quê IndexedDB e não localStorage?

| Critério        | IndexedDB                 | localStorage     |
| --------------- | ------------------------- | ---------------- |
| **Limite**      | GB (ilimitado)            | 5-10 MB          |
| **Performance** | Assíncrono (não trava UI) | Síncrono (trava) |
| **Estrutura**   | Objetos complexos         | String apenas    |
| **Queries**     | Index, cursor             | Manual           |

**Decisão:** IndexedDB = futureproof (10k clientes OK)

### Por quê Apps Script e não Node.js?

| Critério           | Apps Script         | Node.js                  |
| ------------------ | ------------------- | ------------------------ |
| **Custo**          | R$ 1-10/mês         | R$ 50-200/mês            |
| **Escalabilidade** | 10k clientes        | Ilimitado                |
| **Manutenção**     | Zero (Google cuida) | Alta (servidor, patches) |
| **Deploy**         | Instant (web IDE)   | CI/CD pipeline           |

**Decisão:** Apps Script até 10k clientes (depois reavaliar)

---

## 📈 Escalabilidade

### Limites Google Apps Script

**Plano Grátis:**

- 90 min/dia de execução
- 6 min por execução
- 20.000 execuções/dia

**Quantos clientes atende (grátis):**

```
Cenário Conservador:
- 200 clientes ativos simultaneamente
- Cada um gera 10 mudanças/dia
- 2.000 mudanças/dia
- 1 merge = 0.5s
- Total: 1.000s = 17 min/dia

CONCLUSÃO: 200 clientes = 17min < 90min OK ✅
```

**Plano Pago (GCP Billing):**

- Sem limite de minutos
- $0.40 por 1M invocações
- 10.000 clientes = R$ 5-10/mês

### Limites Google Drive API

**Plano Grátis:**

- 1.000 queries/100s
- 10.000 requests/dia

**Quantos clientes atende (grátis):**

```
1.000 clientes × 20 requests/dia = 20.000 requests/dia
20.000 > 10.000 = PROBLEMA ❌

SOLUÇÃO: GCP Billing
- $0.40 por 1M requests
- 20k requests/dia × 30 = 600k/mês
- 600k × $0.40 = $0.24/mês = R$ 1,20/mês ✅
```

### Plano de Escala

| Clientes     | Apps Script    | Drive API | Custo/Mês  |
| ------------ | -------------- | --------- | ---------- |
| 0-200        | Grátis         | Grátis    | R$ 0       |
| 200-1.000    | GCP            | GCP       | R$ 1-5     |
| 1.000-10.000 | GCP            | GCP       | R$ 5-50    |
| 10.000+      | Migrar Node.js | GCP       | R$ 100-200 |

---

## 🔐 Segurança

### OAuth 2.0 Flow

```
1. Cliente clica "Conectar Drive"
   └─> Redirect: https://accounts.google.com/o/oauth2/v2/auth
       ?client_id=NOSSA_CLIENT_ID
       &redirect_uri=https://tocadobarbaro.com/callback
       &scope=https://www.googleapis.com/auth/drive.file
       &response_type=code

2. Cliente autoriza
   └─>Redirect de volta com code

3. Backend troca code por access_token
   └─> POST https://oauth2.googleapis.com/token
       { code, client_id, client_secret, grant_type }
   └─> Resposta: { access_token, refresh_token, expires_in }

4. Backend salva tokens (criptografados)
   └─> MongoDB: { userId, driveToken: encrypt(access_token), refreshToken }

5. Apps Script usa refresh_token automaticamente
   └─> Quando access_token expira (1h), renova sozinho
```

### Criptografia Dados

**Opcional (v2.0):**

- AES-256 (CryptoJS)
- Senha mestra do usuário
- Drive armazena encrypted blob

**Hoje (v1.0):**

- JSON plain text (Drive do cliente é privado)
- Google já criptografa em repouso

---

## 📝 Resumo Arquitetural

**Decisões Finais:**

✅ **PWA** (offline + install)  
✅ **IndexedDB** (banco local ilimitado)  
✅ **Google Drive** (storage do cliente)  
✅ **Apps Script** (merge engine R$ 1-10/mês)  
✅ **OAuth 2.0** (auth padrão Google)  
✅ **AI-Ready** (estrutura preparada Gemini)

**Próximo:** [ROADMAP.md](ROADMAP.md) (implementação 8 sprints)

---

**Atualizado:** 17 Janeiro 2026  
**Versão:** 3.0 Final  
**Status:** Aprovado para Implementação
