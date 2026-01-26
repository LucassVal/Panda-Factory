# 📋 PF_JAM_COMPONENTS - Jam UI Components Reference

> **Versão:** 1.0.0 | **Atualizado:** 2026-01-26

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
    ├── useAuth.js               # Auth provider + methods
    ├── useFirebase.js           # Firebase connection
    ├── useGAS.js                # GAS endpoints
    ├── useHealthStatus.js       # Health polling
    └── useFounderMetrics.js     # Dashboard metrics
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

| Hook                   | Função               |
| ---------------------- | -------------------- |
| `useAuth.js`           | Autenticação         |
| `useFirebase.js`       | Firebase RTDB + Auth |
| `useGAS.js`            | Google Apps Script   |
| `useHealthStatus.js`   | Health polling       |
| `useFounderMetrics.js` | Métricas dashboard   |
| `useMarketplace.js`    | Marketplace hooks    |
| `useLandingPage.js`    | Landing page builder |

---

## 4. App.jsx v5.2 Structure

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

## 5. Links

- [App.jsx](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/jam/src/App.jsx)
- [PF_AUTH_REFERENCE.md](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/docs/PF_AUTH_REFERENCE.md)
- [PF_HEALTH_STATUS.md](file:///c:/Users/Lucas%20Valério/Desktop/Panda%20Factory/docs/PF_HEALTH_STATUS.md)
