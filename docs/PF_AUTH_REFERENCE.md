# 🔐 PF_AUTH_REFERENCE - Sistema de Autenticação

> **Versão:** 1.0.0 | **Atualizado:** 2026-01-26

---

## 1. Visão Geral

Sistema de autenticação com suporte a Google OAuth e Email/Password.

---

## 2. Métodos de Login

| Método             | Uso              | Provider      |
| ------------------ | ---------------- | ------------- |
| **Google**         | Usuários normais | Firebase Auth |
| **Email/Password** | Dev/Testing      | Firebase Auth |

---

## 3. Tipos de Usuário

| Tipo        | Acesso                         | Identificação    |
| ----------- | ------------------------------ | ---------------- |
| **Founder** | Full + Dashboard + Kill Switch | Ed25519 Key      |
| **Dev**     | SDK + DevTools                 | Email verificado |
| **User**    | App básico                     | Account normal   |
| **Guest**   | Público                        | Não autenticado  |

---

## 4. Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTH FLOW                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LoginModal                Firebase Auth              Panda Backend  │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐ │
│  │ Google OAuth │────────▶│ signIn       │────────▶│ User Record  │ │
│  │ or           │         │ Popup        │         │ + userType   │ │
│  │ Email/Pass   │         └──────────────┘         └──────────────┘ │
│  └──────────────┘                │                        │         │
│                                  ▼                        ▼         │
│                          ┌──────────────┐         ┌──────────────┐ │
│                          │ ID Token     │────────▶│ GAS Verify   │ │
│                          └──────────────┘         └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Uso no React

```javascript
import { useAuth, AuthProvider } from "@/hooks/useAuth";

// Wrap app
<AuthProvider>
  <App />
</AuthProvider>;

// In components
const { user, isFounder, isDev, loginWithGoogle, loginWithEmail, logout } =
  useAuth();
```

---

## 6. Test Accounts

| Email               | Senha             | Tipo    |
| ------------------- | ----------------- | ------- |
| `founder@panda.com` | qualquer 6+ chars | Founder |
| `dev@test.com`      | qualquer 6+ chars | Dev     |
| `user@test.com`     | qualquer 6+ chars | User    |

---

## 7. Verificação Founder

```text
Founder Action (ex: Kill Switch)
        │
        ▼
Enter PIN (6 digits)
        │
        ▼
Sign with Ed25519 Private Key
        │
        ▼
Send Signature to GAS
        │
        ▼
GAS Verifies with Public Key
        │
        ▼
Execute Protected Action
```

---

## 8. Links

- [useAuth.js](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/jam/src/hooks/useAuth.js)
- [LoginModal.jsx](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/jam/src/components/LoginModal.jsx)
- [PF_FIREBASE_REFERENCE.md](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/docs/PF_FIREBASE_REFERENCE.md)
