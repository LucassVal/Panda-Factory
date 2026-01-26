# 🐼 Panda Factory - Tech Stack SDK

> **Version:** 1.0.0  
> **Date:** 2026-01-25

---

## 1. Arquitetura de Dependências

```text
┌─────────────────────────────────────────────────────────────────┐
│                      🔒 CORE (Imutável)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Firebase    │  │ Google Apps │  │ Ed25519     │              │
│  │ Auth/DB     │  │ Script (GAS)│  │ Assinatura  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                      📦 SDK (Padrão + Extensível)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ React       │  │ TLDraw      │  │ Yjs         │              │
│  │ (UI Base)   │  │ (Canvas)    │  │ (Collab)    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                      🔌 Add-ons (Usuário Escolhe)                │
│  AI: Gemini | OpenAI | Claude | Ollama                          │
│  Storage Extra: S3 | R2 | Supabase                              │
│  💰 PAGAMENTOS LOJA: APENAS PANDA COIN (PC)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Tecnologias por Prioridade

### 🔒 P0: CORE (NÃO MUDA)

| Tech                   | Uso                      | Por que é Core                        |
| ---------------------- | ------------------------ | ------------------------------------- |
| **Firebase**           | Auth, Firestore, Storage | Toda autenticação e dados passam aqui |
| **Google Apps Script** | Backend, Sheets          | Integração Google Workspace, logs     |
| **Ed25519**            | Assinatura Founder       | Segurança das decisões críticas       |

> ⚠️ **NUNCA substitua o Core.** Conectores adicionais são para EXTENSÕES, não substituição.

---

### ⭐ P1: SDK Base (Incluído por padrão)

| Tech             | Uso              | Por que incluir                        |
| ---------------- | ---------------- | -------------------------------------- |
| **React 18**     | UI Jam           | 70% dos devs conhecem, TLDraw precisa  |
| **TLDraw**       | Canvas infinito  | Única lib com canvas + collab built-in |
| **GoldenLayout** | Multi-monitor    | Pop-out nativo, layout persistente     |
| **Yjs**          | Colaboração CRDT | Sync offline-first, integra Firebase   |
| **Vite**         | Build tool       | Mais rápido que Webpack, hot reload    |

---

### 📌 P2: Recomendado (Dev pode ignorar)

| Tech            | Uso         | Por que recomendar                  |
| --------------- | ----------- | ----------------------------------- |
| **TypeScript**  | Tipagem     | Menos bugs, autocomplete            |
| **Zod**         | Validação   | Schemas tipados, runtime validation |
| **React Query** | Fetch/cache | Cache inteligente, retry automático |

---

### 🔌 P3: Add-ons (Dev escolhe)

| Categoria         | Padrão Panda     | Alternativas                 |
| ----------------- | ---------------- | ---------------------------- |
| **AI Models**     | Gemini           | OpenAI, Claude, Ollama, Groq |
| **Storage Extra** | Firebase Storage | S3, R2, Supabase             |

> ⚠️ **PAGAMENTOS NA LOJA:** Apenas Panda Coin (PC). NÃO Stripe, NÃO MercadoPago.

---

### 💰 Hooks Externos (Consomem PC)

```text
USUÁRIO USA HOOK → Consome X PC por chamada
                    │
                    └── Script salvo no Firebase do usuário
                    └── Panda ganha no consumo

GANHO DUPLO:
1. Venda de PC → Usuário compra coins
2. Consumo de PC → Usuário usa hooks
```

| Hook          | Custo Sugerido |
| ------------- | -------------- |
| WhatsApp msg  | 1 PC           |
| AI chat       | 5 PC           |
| cTrader order | 10 PC          |

---

## 3. O que NÃO Incluímos (e por quê)

| Tech             | Por que NÃO                          |
| ---------------- | ------------------------------------ |
| **Tailwind CSS** | Verboso, polui HTML, opcional        |
| **Redux**        | Complexo, Zustand/Jotai mais simples |
| **Next.js**      | Overkill, Vite suficiente            |
| **Prisma**       | Não usamos SQL direto (Firestore)    |

---

## 4. Como Usar Conectores

```javascript
// Core SEMPRE ativo
await Panda.Auth.login(); // Firebase Auth
await Panda.DB.save(data); // Firestore

// Add-on de AI (usuário escolhe)
Panda.AI.setProvider("openai"); // ou 'gemini', 'claude'
await Panda.AI.chat("Olá"); // Consome 5 PC

// Hooks externos (consomem PC)
await Panda.Hooks.whatsapp.send(msg); // Consome 1 PC
await Panda.Hooks.ctrader.order(data); // Consome 10 PC
```

---

## 5. Resumo de Prioridades

| Prioridade | Categoria       | Quantidade | Status          |
| ---------- | --------------- | ---------- | --------------- |
| **P0**     | Core (imutável) | 3          | ✅ Implementado |
| **P1**     | SDK Base        | 5          | ✅ Implementado |
| **P2**     | Recomendado     | 3          | 🔄 Parcial      |
| **P3**     | Add-ons         | 6+         | 📋 Planejado    |

---

## 6. Links Úteis

- [React](https://react.dev)
- [TLDraw](https://tldraw.com)
- [Firebase](https://firebase.google.com)
- [Vite](https://vitejs.dev)
- [Yjs](https://yjs.dev)

---

## 7. Google APIs - Custos

> **Princípio:** APIs de IA = User paga em PC | APIs de infra = Panda absorve

### 7.1 APIs de IA (User Paga em PC)

| API                   |  Preço Google  | Quem Paga? |
| --------------------- | :------------: | :--------: |
| **Gemini Flash**      |  ~$0.0001/req  | User (PC)  |
| **Cloud Vision**      | $1.50/1k units | User (PC)  |
| **Cloud Speech**      |   $0.024/min   | User (PC)  |
| **Cloud TTS**         |  $4/1M chars   | User (PC)  |
| **Cloud Translation** |  $20/1M chars  | User (PC)  |

> Panda cobra PC do user → paga Google → margem 4.0x

### 7.2 APIs de Infraestrutura (Panda Absorve)

| API               | Limite Grátis  | Quem Paga? |
| ----------------- | :------------: | :--------: |
| **Firebase Auth** |       ∞        |   Grátis   |
| **Firebase RTDB** | 1GB + 10GB/mês |   Panda    |
| **Firestore**     | 50k reads/dia  |   Panda    |
| **Drive API**     |       ∞        |   Grátis   |
| **Calendar API**  |       ∞        |   Grátis   |
| **BigQuery**      |    1TB/mês     |   Panda    |

---

## 8. Google Drive User Folder

Cada usuário tem pasta virtual no Google Drive:

```text
PandaFactory_User_XYZ/
├── apps/
│   ├── plugin-ctrader/
│   ├── plugin-canva/
│   └── ...
├── cache/
│   └── (arquivos temporários)
└── exports/
    └── (arquivos exportados pelo user)
```

---

## 9. Google Workspace APIs

| API          | Uso                 |    Status    |
| ------------ | ------------------- | :----------: |
| **Calendar** | Eventos, lembretes  | 📋 Planejado |
| **People**   | Contatos            | 📋 Planejado |
| **Drive**    | Arquivos            |   ✅ Core    |
| **Docs**     | Documentos          | 📋 Planejado |
| **Sheets**   | Planilhas (via GAS) |   ✅ Core    |
| **Gmail**    | Email (via GAS)     | 📋 Planejado |

---

## 10. Integrações Terceiros

| Serviço         | Categoria |    Status    |
| --------------- | --------- | :----------: |
| **Canva**       | Design    | 📋 Planejado |
| **cTrader/MT4** | Trading   | 📋 Planejado |
| **WhatsApp**    | Mensagens | 📋 Planejado |
