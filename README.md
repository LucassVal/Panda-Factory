# 🐼 PANDA FACTORY

![Panda Logo](assets/panda_logo_original.jpg)

> **v9.0.0** | Create apps, games, and businesses without code. Powered by AI.

[![GitHub Pages](https://img.shields.io/badge/Demo-Live-4cc9f0?style=flat-square&logo=github)](https://lucassval.github.io/SAAS/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](LICENSE)

---

## 🚀 Quick Start

```html
<!-- Add to your HTML -->
<script src="js/pf.sdk.js"></script>
<script src="js/pf.bootstrap.js"></script>

<script>
  // SDK ready!
  window.addEventListener("panda:ready", async () => {
    const users = await Panda.Data.list("users");
    console.log(users);
  });
</script>
```

**Zero server. Free hosting. Just push to GitHub.**

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│                       PANDA FACTORY                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐    ┌──────────────────────┐              │
│  │   MICROSOFT/GitHub   │    │      GOOGLE           │              │
│  │  ├── Hosting (Pages) │    │  ├── AI (Gemini)     │              │
│  │  ├── Database (JSON) │    │  ├── Storage (Drive) │              │
│  │  ├── Compute (Actions)│   │  ├── Sheets (Data)   │              │
│  │  └── CDN (Releases)  │    │  └── GPU (Colab)     │              │
│  └──────────────────────┘    └──────────────────────┘              │
│                                                                     │
│                    ┌───────────────────┐                           │
│                    │   PANDA SDK       │                           │
│                    │   (Abstraction)   │                           │
│                    └───────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Dual Cloud Strategy:** GitHub (Microsoft) + Google = Zero lock-in. Zero cost.

---

## ✨ Features

| Category               | Features                                              | Status  |
| ---------------------- | ----------------------------------------------------- | ------- |
| **🐙 GitHub-First**    | Pages hosting, JSON database, Actions compute         | ✅ 100% |
| **🧠 AI Cores**        | PAT (Treasury), Brain (Gemini + LocalLLM)             | ✅ 100% |
| **🌐 Google Tentacle** | Drive, Sheets, Colab, Gmail, Calendar, YouTube        | ✅ 100% |
| **📱 Distribution**    | itch.io, PWA, Panda Arcade, Google Play, NPM, VS Code | ✅ 90%  |
| **💬 Social Hub**      | WhatsApp, YouTube, Meta, TikTok, Twitter, Telegram    | ✅ 100% |
| **📈 Trading**         | cTrader Open API integration                          | ✅ 100% |
| **🔐 Security**        | Kill Switch, DRM Token, Ed25519 signatures            | ✅ 100% |
| **🦀 Rust Agent**      | Local GPU, MCP tools, offline AI                      | 🟡 60%  |

---

## 📦 SDK Modules

```javascript
// Authentication
await Panda.Auth.login(email, password);
Panda.Auth.signCommand(payload); // Ed25519 (Founder)

// Data (GitHub JSON or Sheets)
await Panda.Data.save("users", { name: "Lucas" });
await Panda.Data.list("users", { where: [["role", "==", "admin"]] });

// AI (Gemini + Local LLMs)
await Panda.Brain.Gemini.chat("Olá");
await Panda.Brain.Gemini.code("React button", "typescript");
await Panda.Brain.LocalLLM.connect(); // Ollama / LM Studio

// GPU Detection
await Panda.Brain.GPU.detect();
await Panda.Brain.GPU.canRunModel("7b");

// Distribution
await Panda.Dist.PWA.deploy(projectId);
await Panda.Dist.GooglePlay.deploy(projectId, { packageName, track });

// Social
await Panda.Social.WhatsApp.sendMessage(phone, message);
await Panda.Social.YouTube.upload(video, metadata);

// Trading
await Panda.Trading.cTrader.connect(accessToken);
await Panda.Trading.cTrader.placeMarketOrder("EURUSD", "buy", 0.01);
```

---

## 📁 Project Structure

```
📁 PandaFactory/
├── 📁 js/
│   ├── pf.sdk.js                    # Core SDK
│   ├── pf.bootstrap.js              # Zero-config init
│   ├── 📁 core/                     # Core modules
│   │   ├── pf.ai-core.js            # PAT + MindMap
│   │   ├── pf.kill-switch.js        # Security
│   │   └── pf.drm.js                # DRM Token
│   └── 📁 tentacles/                # Feature tentacles
│       ├── 📁 github/               # GitHub infrastructure
│       ├── 📁 google/               # Google services (8 children)
│       ├── 📁 brain/                # AI (Gemini, GPU, LocalLLM)
│       ├── 📁 distribution/         # App publishing (7 hooks)
│       ├── 📁 social/               # Social media (7 plugins)
│       └── 📁 trading/              # Trading (cTrader)
├── 📁 data/                         # GitHub JSON Database
│   ├── manifest.json                # DB structure
│   ├── 📁 users/                    # Users collection
│   └── 📁 projects/                 # Projects collection
├── 📁 .github/workflows/            # GitHub Actions
│   ├── pages.yml                    # Auto-deploy
│   └── android-build.yml            # Bubblewrap builds
├── 📁 docs/                         # Documentation
└── index.html                       # Landing page
```

---

## 📚 Documentation

| Doc                                                      | Description                         |
| -------------------------------------------------------- | ----------------------------------- |
| [📖 Master Architecture](docs/PF_MASTER_ARCHITECTURE.md) | Complete architecture (~2700 lines) |
| [📦 SDK Reference](docs/PF_SDK_REFERENCE.md)             | API documentation                   |
| [🎨 CSS Reference](docs/PF_CSS_REFERENCE.md)             | Design system                       |
| [🗺️ Roadmap](docs/ROADMAP_ESTRATEGICO.md)                | Strategic roadmap                   |
| [🐼 PANDA.md](.agent/PANDA.md)                           | AI Agent codex                      |

---

## 🌐 Deploy

### Option 1: GitHub Pages (Recommended)

1. Fork this repository
2. Go to **Settings → Pages**
3. Source: **GitHub Actions**
4. Push to `main` - auto-deploys!

URL: `https://YOUR_USERNAME.github.io/SAAS/`

### Option 2: Local Development

```bash
# Any static server works
npx serve .
# or
python -m http.server 8080
```

---

## 💰 Tokenomics

| Allocation     | %   | Description          |
| -------------- | --- | -------------------- |
| Dev/Host       | 55% | Value creators       |
| Incentive Fund | 22% | Subsidies, bootcamps |
| Panda Ops      | 15% | Platform maintenance |
| Founder        | 5%  | Eternal royalty      |
| Gateway        | 3%  | Payment processing   |

**Currency:** Panda Coin (PC) - 1 PC ≈ R$ 0,01

---

## 🗺️ Roadmap

| Phase        | Status     | Milestone        |
| ------------ | ---------- | ---------------- |
| SDK Mock     | ✅ Done    | Core SDK         |
| UI/UX        | ✅ Done    | 10 alpha testers |
| GitHub-First | ✅ Done    | Zero server      |
| AI Cores     | ✅ Done    | PAT + Brain 100% |
| Distribution | ✅ 90%     | 7/8 hooks        |
| Medusa Store | 🔴 Planned | E-commerce       |
| Antigravity  | 🔴 Planned | Coding assistant |

---

## 🔗 Repositories

| Repository    | Type       | URL                                                                     |
| ------------- | ---------- | ----------------------------------------------------------------------- |
| **This repo** | 🔒 Private | [SAAS](https://github.com/LucassVal/SAAS)                               |
| **panda-sdk** | 🌐 Public  | [panda-sdk](https://github.com/LucassVal/panda-sdk)                     |
| **community** | 🌐 Public  | [panda-sdk-community](https://github.com/LucassVal/panda-sdk-community) |

---

## 📋 Changelog

### [9.0.0] - 2026-01-25 (GitHub-First + AI Cores)

- **New:** GitHub Tentacle (Pages, JSON DB, Actions)
- **New:** pf.bootstrap.js - Zero-config initialization
- **New:** Brain.Gemini with 6 specialized GEMs
- **New:** Brain.GPU - WebGL/WebGPU detection
- **New:** Brain.LocalLLM - Ollama/LM Studio support
- **New:** PAT.mindMap - Firestore sync
- **New:** Distribution Tentacle (7 hooks)
- **New:** §24 Dual Cloud Strategy documentation
- **Status:** PAT 100%, Brain 100%

### [8.0.0] - 2026-01-24 (Tentacles)

- **New:** Google Tentacle (8 children)
- **New:** Social Hub (7 plugins)
- **New:** cTrader Open API
- **New:** Kill Switch + DRM Token

### [7.0.0] - 2026-01-23

- **New:** Polyglot (200 languages offline)
- **New:** Ed25519 security layer

---

## 🏷️ Conventions

| Context      | Prefix    | Example               |
| ------------ | --------- | --------------------- |
| GitHub repos | `pf-`     | `pf-sdk`              |
| GAS files    | `PF_`     | `PF_Core_Auth.gs`     |
| Public API   | `Panda.`  | `Panda.Data`          |
| Tentacles    | `pf.*.js` | `pf.github-parent.js` |

---

© 2026 Panda Factory - **Building the Developer Soil** 🐼
