# 🔥 PF_FIREBASE_REFERENCE - Referência Firebase

> **Versão:** 1.0.0 | **Atualizado:** 2026-01-26

---

## 📋 Índice

1. [Filosofia Client-Side First](#1-filosofia-client-side-first)
2. [Estrutura do Firebase](#2-estrutura-do-firebase)
3. [Autenticação](#3-autenticação)
4. [Realtime Database](#4-realtime-database)
5. [Regras de Segurança](#5-regras-de-segurança)
6. [Fluxo de Comunicação](#6-fluxo-de-comunicação)
7. [Capacidade e Limites](#7-capacidade-e-limites)

---

## 1. Filosofia Client-Side First

> **"O Browser faz 90% do trabalho. Cloud só para sync e billing."**

O Firebase no Panda Factory é usado de forma **minimalista**:

| Uso           | ✅ Permitido             | ❌ Não Usar             |
| ------------- | ------------------------ | ----------------------- |
| **Auth**      | Login Google/Email       | Dados de usuário        |
| **RTDB**      | Status online, heartbeat | Armazenamento principal |
| **Storage**   | Assets públicos          | Dados sensíveis         |
| **Functions** | ❌ Off                   | Processamento           |

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA CLIENT-SIDE FIRST                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BROWSER (90% do trabalho)         CLOUD (10% - só sync/auth)          │
│  ┌──────────────────────────┐     ┌──────────────────────────┐         │
│  │ • React/TLDraw UI        │     │ • Firebase Auth          │         │
│  │ • IndexedDB (local)      │     │ • Firebase RTDB (status) │         │
│  │ • LocalStorage           │────▶│ • GAS (billing/PAT)      │         │
│  │ • Gemini API (direto)    │     │ • Webhooks               │         │
│  │ • Service Worker         │     │                          │         │
│  └──────────────────────────┘     └──────────────────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Estrutura do Firebase

### 2.1 Projeto Firebase

| Campo          | Valor                                                     |
| -------------- | --------------------------------------------------------- |
| **Project ID** | `panda-factory`                                           |
| **Console**    | https://console.firebase.google.com/project/panda-factory |
| **Região**     | `us-central1`                                             |

### 2.2 Serviços Ativos

| Serviço               |   Status    | Uso                 |
| --------------------- | :---------: | ------------------- |
| **Authentication**    |     ✅      | Login Google        |
| **Realtime Database** |     ✅      | Status/Signaling    |
| **Firestore**         |   ❌ Off    | Não usar            |
| **Storage**           | ⚠️ Opcional | Assets públicos     |
| **Functions**         |   ❌ Off    | Custo alto          |
| **Hosting**           |   ❌ Off    | Usamos GitHub Pages |

---

## 3. Autenticação

### 3.1 Provedores Habilitados

| Provedor       |   Status    |  Prioridade   |
| -------------- | :---------: | :-----------: |
| **Google**     |  ✅ Ativo   | 🔴 Principal  |
| Email/Password | ⚠️ Opcional | 🟡 Secundário |
| Anonymous      |   ❌ Off    |       -       |

### 3.2 Domínios Autorizados

```text
# Firebase Console → Authentication → Settings → Authorized domains
- localhost
- lucassval.github.io
- pandafactory.com (futuro)
```

### 3.3 Implementação no Browser

```javascript
// js/core/pf.firebase-bridge.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "panda-factory.firebaseapp.com",
  databaseURL: "https://panda-factory-default-rtdb.firebaseio.com",
  projectId: "panda-factory",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login com Google
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
```

---

## 4. Realtime Database

### 4.1 Estrutura de Dados

O RTDB é usado **apenas** para signaling entre Browser e Rust Agent:

```json
{
  "pf_cells": {
    "{userId}": {
      "status": {
        "online": true,
        "lastSeen": 1706234567890,
        "rustAgent": {
          "connected": true,
          "version": "1.0.0",
          "gpu": "NVIDIA RTX 3080"
        }
      },
      "commands": {
        "{commandId}": {
          "action": "gpu.process",
          "payload": {},
          "status": "pending",
          "createdAt": 1706234567890
        }
      },
      "responses": {
        "{commandId}": {
          "result": {},
          "status": "completed",
          "completedAt": 1706234567890
        }
      }
    }
  }
}
```

### 4.2 Dados que NÃO ficam no Firebase

| Dado                 | Onde Fica           | Motivo        |
| -------------------- | ------------------- | ------------- |
| **Dados de negócio** | Google Sheets (GAS) | Custo zero    |
| **Transações PC**    | Google Sheets       | Auditoria     |
| **Arquivos**         | Google Drive        | Sem limite    |
| **Config usuário**   | LocalStorage        | Offline-first |

---

## 5. Regras de Segurança

### 5.1 Realtime Database Rules

```json
{
  "rules": {
    "pf_cells": {
      "$uid": {
        // Usuário só acessa seus próprios dados
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid",

        "commands": {
          "$commandId": {
            // Rust Agent pode escrever respostas
            ".write": "auth != null"
          }
        }
      }
    },

    // Dados públicos (somente leitura)
    "public": {
      ".read": true,
      ".write": false
    }
  }
}
```

### 5.2 Princípios de Segurança

1. **Usuário só vê seus dados** - Isolamento total por `auth.uid`
2. **Sem admin client-side** - Nenhum usuário tem acesso de admin
3. **Validate on write** - Validação de schema no Firebase
4. **Rate limiting** - Limite de escritas por segundo

---

## 6. Fluxo de Comunicação

### 6.1 Browser ↔ Rust Agent (via Firebase)

```text
[🖥️ BROWSER]                [🔥 FIREBASE RTDB]           [🦀 RUST AGENT]
      │                             │                           │
      │ 1. PUSH COMMAND ───────────▶│                           │
      │    /pf_cells/{uid}/commands │                           │
      │                             │                           │
      │                             │ 2. SSE LISTENER ─────────▶│
      │                             │    (onValue)              │
      │                             │                           │
      │                             │                           │ 3. EXECUTA LOCAL
      │                             │                           │    (GPU/MCP/File)
      │                             │                           │
      │                             │◀─── 4. PUSH RESPONSE ─────│
      │                             │    /pf_cells/{uid}/responses
      │                             │                           │
      │◀── 5. SSE UPDATE ──────────│                           │
      │    (onValue)               │                           │
```

### 6.2 Heartbeat (Status Online)

```javascript
// Rust Agent envia heartbeat a cada 30s
const heartbeatRef = ref(db, `pf_cells/${userId}/status`);

setInterval(() => {
  set(heartbeatRef, {
    online: true,
    lastSeen: Date.now(),
    rustAgent: {
      connected: true,
      version: getPandaVersion(),
      gpu: getGpuInfo(),
    },
  });
}, 30000);

// Browser detecta desconexão
onDisconnect(heartbeatRef).set({
  online: false,
  lastSeen: Date.now(),
});
```

---

## 7. Capacidade e Limites

### 7.1 Free Tier (Spark Plan)

| Recurso              | Limite           | Uso Estimado no Panda |
| -------------------- | ---------------- | --------------------- |
| **Autenticações**    | ∞                | ~1/sessão             |
| **RTDB Connections** | 100 simultâneas  | ~10,000 users         |
| **RTDB Storage**     | 1GB              | < 100MB               |
| **RTDB Download**    | 10GB/mês         | < 1GB                 |
| **RTDB Upload**      | 20k escritas/dia | < 5k                  |

### 7.2 Escalabilidade

```text
📊 CAPACIDADE ESTIMADA (Free Tier - Custo $0)

├── Usuários Cadastrados: ~100,000+
├── Usuários Ativos Simultâneos: ~10,000 (limite RTDB connections)
├── Heartbeats/dia: ~50,000 (1 por 30s por user online)
└── Custo: $0 (dentro do Free Tier)
```

### 7.3 Quando Pagar (Blaze Plan)

Migrar para Blaze apenas se:

- > 100 conexões simultâneas frequentes
- > 10GB download/mês
- Precisa de Functions serverless

---

## 8. Referências

- [PF_MASTER_ARCHITECTURE.md §5.2](PF_MASTER_ARCHITECTURE.md) - Pilar Firebase
- [PF_GAS_REFERENCE.md](PF_GAS_REFERENCE.md) - Backend GAS
- [PF_TOKENOMICS_REFERENCE.md §13](PF_TOKENOMICS_REFERENCE.md) - Capacidade Infra
- [Firebase Documentation](https://firebase.google.com/docs)

---

> 📖 **Versão:** 1.0.0 | **Atualizado:** 2026-01-26
