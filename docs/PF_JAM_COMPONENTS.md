# 📋 PF_JAM_COMPONENTS - Jam UI Components Reference

> **Versão:** 1.1.0 | **Atualizado:** 2026-01-26

---

## 1. Visão Geral

Jam é o frontend React do Panda Factory com TLDraw canvas e componentes modulares.

---

## 2. Estrutura de Arquivos

```text
jam/src/
├── App.jsx                      # Main app v5.2
├── components/
│   ├── JamCanvas.jsx            # TLDraw canvas
│   ├── JamDock.jsx              # Left dock
│   ├── JamStatusBar.jsx         # Top status bar
│   ├── JamChat.jsx              # AI chat floating
│   ├── JamSettings.jsx          # Settings modal
│   ├── JamStore.jsx             # Store modal
│   ├── JamCatalog.jsx           # Catalog modal
│   ├── JamRightToolbar.jsx      # Drawing tools
│   ├── StatusBar.jsx            # Health status bar (bottom)
│   ├── FounderDashboard.jsx     # Founder dashboard
│   ├── FounderDashboardModal.jsx # Dashboard modal wrapper
│   ├── PanicButton.jsx          # Kill switch
│   ├── FinancePanel.jsx         # Treasury/finance
│   ├── LoginModal.jsx           # Auth modal
│   └── LoginGate.jsx            # Auth gate
└── hooks/
    ├── useAuth.jsx              # Auth provider (JSX - v1.1)
    ├── useFirebase.js           # Firebase connection
    ├── useGAS.js                # GAS endpoints (v1.1 - Fault Isolation)
    ├── useHealthStatus.js       # Health polling
    ├── useFounderMetrics.js     # Dashboard metrics (v1.1 - Telemetry)
    ├── useMarketplace.js        # Marketplace hooks (v1.1 - Fault Isolation)
    └── useLandingPage.js        # Landing page builder (v1.1 - Fault Isolation)
```

---

## 3. Componentes por Categoria

### 3.1 Core Layout

| Componente         | Função                   |
| ------------------ | ------------------------ |
| `App.jsx`          | Container principal v5.2 |
| `JamCanvas.jsx`    | TLDraw canvas            |
| `JamDock.jsx`      | Dock esquerda            |
| `JamStatusBar.jsx` | Status bar topo          |

### 3.2 Modals

| Componente                  | Função              |
| --------------------------- | ------------------- |
| `JamSettings.jsx`           | Configurações       |
| `JamStore.jsx`              | Loja de plugins     |
| `JamCatalog.jsx`            | Catálogo instalados |
| `FounderDashboardModal.jsx` | Dashboard founder   |
| `LoginModal.jsx`            | Login Google/Email  |

### 3.3 Dashboards

| Componente             | Função              |
| ---------------------- | ------------------- |
| `FounderDashboard.jsx` | Dashboard principal |
| `FinancePanel.jsx`     | Treasury + finanças |
| `PanicButton.jsx`      | Kill switch         |
| `StatusBar.jsx`        | Health indicators   |

### 3.4 Hooks

| Hook                   | Versão | Função                               |
| ---------------------- | ------ | ------------------------------------ |
| `useAuth.jsx`          | v1.1   | Autenticação (renomeado .js → .jsx)  |
| `useFirebase.js`       | v1.0   | Firebase RTDB + Auth                 |
| `useGAS.js`            | v1.1   | GAS endpoints + Fault Isolation      |
| `useHealthStatus.js`   | v1.0   | Health polling                       |
| `useFounderMetrics.js` | v1.1   | Dashboard + AgentTelemetry real-time |
| `useMarketplace.js`    | v1.1   | Marketplace + Fault Isolation        |
| `useLandingPage.js`    | v1.1   | Landing builder + Fault Isolation    |

---

## 4. Hooks v1.1 Changes (2026-01-26)

### useGAS.js - Fault Isolation Applied

```javascript
// ANTES (violava §7.6 Constituição)
throw new Error(`GAS request failed`);

// DEPOIS (§7.6 compliant)
return { success: false, error: `GAS request failed`, isolated: true };
```

### useFounderMetrics.js - AgentTelemetry Integration

```javascript
// Obtém dados reais de Panda.Telemetry
const agentMetrics = getAgentMetrics();

// Eventos real-time
Panda.on("founder:activity", handleActivity);
Panda.on("founder:error", handleError);

// Helpers disponíveis
const feed = getActivityFeed(10);
const errors = getErrorList(5, true);
const status = getTentacleStatus();
```

### useLandingPage.js & useMarketplace.js

- Throws removidos (linhas 107, 175, 156, 203)
- Retorna `{ success: false, error, isolated: true }`
- Logga via `console.error()` antes de retornar

---

## 5. App.jsx v5.2 Structure

```jsx
<AuthProvider>
  <LoginGate>
    <AppContent>
      <JamStatusBar /> {/* Top */}
      <JamCanvas /> {/* Center */}
      <JamDock /> {/* Left */}
      <JamRightToolbar /> {/* Right */}
      <JamChat /> {/* Floating */}
      <JamSettings /> {/* Modal */}
      <JamCatalog /> {/* Modal */}
      <JamStore /> {/* Modal */}
      <FounderDashboardModal /> {/* Modal */}
      <StatusBar /> {/* Bottom */}
    </AppContent>
  </LoginGate>
</AuthProvider>
```

---

## 6. Build Info

```text
✓ 925 modules transformed
✓ 1.18MB JS (356KB gzip)
✓ Built in 14.17s (Vite 5.4.21)
```

---

## 7. Links

- [App.jsx](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/jam/src/App.jsx)
- [PF_AUTH_REFERENCE.md](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/docs/PF_AUTH_REFERENCE.md)
- [PF_HEALTH_STATUS.md](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/docs/PF_HEALTH_STATUS.md)
- [PF_SDK_REFERENCE.md](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/docs/PF_SDK_REFERENCE.md)
