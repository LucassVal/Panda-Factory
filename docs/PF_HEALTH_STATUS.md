# 🏥 PF_HEALTH_STATUS - Sistema de Status

> **Versão:** 1.0.0 | **Atualizado:** 2026-01-26

---

## 1. Visão Geral

Sistema de health check para monitorar todos os serviços do Panda Factory.

---

## 2. StatusBars por Contexto

| Contexto     | Indicadores                     |
| ------------ | ------------------------------- |
| **Jam**      | Rust, Firebase, GAS, GPU, MCP   |
| **Store**    | GitHub, Payment, CDN, Analytics |
| **DevTools** | VSX, MCP, Debugger, Terminal    |
| **Admin**    | Firestore, GAS, BigQuery, Users |

---

## 3. Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    HEALTH SYSTEM                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  RUST AGENT                      REACT UI                           │
│  ┌──────────────────┐           ┌──────────────────┐               │
│  │ health.rs        │           │ useHealthStatus  │               │
│  │ GET /health      │◀─────────▶│ (hook)           │               │
│  │ JSON response    │   HTTP    │                  │               │
│  └──────────────────┘           └──────────────────┘               │
│           │                              │                          │
│           ▼                              ▼                          │
│  ┌──────────────────┐           ┌──────────────────┐               │
│  │ Services:        │           │ StatusBar.jsx    │               │
│  │ • MCP            │           │ • Indicators     │               │
│  │ • GPU            │           │ • Tooltips       │               │
│  │ • Firebase       │           │ • Polling 5s     │               │
│  └──────────────────┘           └──────────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Status Codes

| Status           | Cor | Significado  |
| ---------------- | :-: | ------------ |
| `ready`          | 🟢  | Pronto       |
| `connected`      | 🟢  | Conectado    |
| `available`      | 🟢  | Disponível   |
| `degraded`       | 🟡  | Parcial      |
| `unavailable`    | 🔴  | Indisponível |
| `error`          | 🔴  | Erro         |
| `notinitialized` | ⚪  | Não iniciado |

---

## 5. API Response

```json
{
  "version": "0.2.0",
  "uptime_secs": 8100,
  "status": "healthy",
  "services": {
    "mcp": { "status": "ready", "details": { "tools": "5" } },
    "gpu": { "status": "available", "details": { "name": "RTX 4090" } },
    "firebase": { "status": "connected", "latency_ms": 45 }
  }
}
```

---

## 6. Uso no React

```javascript
import { useHealthStatus } from "@/hooks/useHealthStatus";

function MyComponent() {
  const { health, isConnected, refresh } = useHealthStatus("jam");

  return <div>{health?.services.rust.status}</div>;
}
```

---

## 7. Links

- [StatusBar.jsx](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/jam/src/components/StatusBar.jsx)
- [health.rs](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/rust-agent/src/health.rs)
