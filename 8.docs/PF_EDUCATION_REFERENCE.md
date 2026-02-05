# 📚 PF_EDUCATION_REFERENCE - Education Tentacle

> **Versão:** 1.0.0 | **Atualizado:** 2026-01-26

---

## 1. Visão Geral

Tentacle para integração com plataformas de infoprodutos e cursos.

---

## 2. Estrutura

```text
5.tentacles/education/
├── pf.education-parent.js    # Parent API
└── children/
    ├── kiwify.js             # Kiwify hook
    ├── hotmart.js            # Hotmart hook
    └── eduzz.js              # Eduzz hook
```

---

## 3. API Principal

### Panda.Education

| Método                                  | Descrição             | Custo |
| --------------------------------------- | --------------------- | ----- |
| `configure(platform, creds)`            | Configura credenciais | -     |
| `processWebhook(platform, payload)`     | Processa webhook      | 0 PC  |
| `grantAccess(productId, email, tx)`     | Libera acesso         | 10 PC |
| `revokeAccess(productId, email)`        | Revoga acesso         | 5 PC  |
| `checkAccess(productId, email)`         | Verifica acesso       | -     |
| `generateCertificate(productId, email)` | Gera certificado      | 50 PC |
| `listCourses(email)`                    | Lista cursos do user  | -     |
| `getAnalytics(productId, period)`       | Analytics agregado    | -     |

---

## 4. Webhooks

### 4.1 Kiwify

| Evento                  | Ação         |
| ----------------------- | ------------ |
| `order_approved`        | grantAccess  |
| `order_refunded`        | revokeAccess |
| `subscription_created`  | grantAccess  |
| `subscription_canceled` | revokeAccess |

### 4.2 Hotmart

| Evento                      | Ação               |
| --------------------------- | ------------------ |
| `PURCHASE_COMPLETE`         | grantAccess        |
| `PURCHASE_REFUNDED`         | revokeAccess       |
| `PURCHASE_CHARGEBACK`       | revokeAccess + log |
| `SUBSCRIPTION_CANCELLATION` | revokeAccess       |

### 4.3 Eduzz

| Evento               | Ação         |
| -------------------- | ------------ |
| `invoice.paid`       | grantAccess  |
| `invoice.refunded`   | revokeAccess |
| `contract.cancelled` | revokeAccess |

---

## 5. Uso

```javascript
// Configurar plataforma
await Panda.Education.configure("kiwify", {
  webhookSecret: "secret",
  apiKey: "api_key",
});

// Processar webhook (chamado pelo GAS)
const result = await Panda.Education.processWebhook("kiwify", {
  body: webhookPayload,
  headers: requestHeaders,
});

// Verificar acesso
const { hasAccess } = await Panda.Education.checkAccess(
  "prod_123",
  "user@email.com",
);

// Gerar certificado
const { certificate } = await Panda.Education.generateCertificate(
  "prod_123",
  "user@email.com",
);
```

---

## 6. Fluxo de Compra

```text
┌─────────────┐      ┌───────────────┐      ┌─────────────┐
│  Kiwify/    │      │  GAS Webhook  │      │  Education  │
│  Hotmart    │─────▶│  Endpoint     │─────▶│  Parent     │
│  Eduzz      │      │               │      │             │
└─────────────┘      └───────────────┘      └─────────────┘
                                                   │
                     ┌─────────────────────────────┼─────────────────────────────┐
                     ▼                             ▼                             ▼
              ┌─────────────┐              ┌─────────────┐              ┌─────────────┐
              │ Validate    │              │ Parse       │              │ Grant       │
              │ Signature   │              │ Purchase    │              │ Access      │
              └─────────────┘              └─────────────┘              └─────────────┘
```

---

## 7. Links

- [pf.education-parent.js](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/5.tentacles/education/pf.education-parent.js)
- [kiwify.js](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/5.tentacles/education/children/kiwify.js)
- [hotmart.js](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/5.tentacles/education/children/hotmart.js)
- [eduzz.js](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/5.tentacles/education/children/eduzz.js)
- [PF_MASTER_ARCHITECTURE.md §17](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/docs/PF_MASTER_ARCHITECTURE.md)


