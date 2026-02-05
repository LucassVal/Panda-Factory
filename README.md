<p align="center">
  <img src="logo.png" alt="Panda Factory" width="180">
</p>

<h1 align="center">🐼 Panda Factory</h1>

<p align="center">
  <strong>"Do PhD ao Favelado"</strong> — Democratizing AI-Powered Software
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Built_on-Google_Cloud-4285F4?logo=google-cloud" alt="Google Cloud">
  <img src="https://img.shields.io/badge/AI-Gemini_2.0-8E75B2?logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase" alt="Firebase">
  <img src="https://img.shields.io/badge/Backend-Apps_Script-34A853?logo=google" alt="GAS">
  <img src="https://img.shields.io/badge/Infra_Cost-$0/month-00D4AA" alt="Zero Cost">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Desktop-Tauri_Rust-B7410E?logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/Canvas-TLDraw-FF6F61" alt="TLDraw">
  <img src="https://img.shields.io/badge/Collab-Yjs-5C5CFF" alt="Yjs">
  <img src="https://img.shields.io/badge/Protocol-MCP-8E75B2" alt="MCP">
  <img src="https://img.shields.io/badge/Translation-NLLB_200-00A67E" alt="NLLB">
  <img src="https://img.shields.io/badge/Speech-Whisper-74AA9C" alt="Whisper">
</p>

---

## 📋 Table of Contents

1. [Vision](#-vision)
2. [Google-First Architecture](#-google-first-architecture)
3. [Core Concepts](#-core-concepts)
4. [Technical Stack](#-technical-stack)
5. [MCP Protocol Integration](#-mcp-protocol-integration)
6. [Partner Mode (P2P Compute)](#-partner-mode-p2p-compute)
7. [SDK Architecture](#-sdk-architecture)
8. [Tentacle System](#-tentacle-system)
9. [Roadmap](#-roadmap)
10. [Contact](#-contact)

---

## 🎯 Vision

**Panda Factory** is a minimalist AI-powered runtime that democratizes software access. Our philosophy:

> **"The Browser does 90% of the work. Cloud only for sync and billing."**

We maximize Google infrastructure usage while minimizing costs through:

- **Client-side processing** (user's browser/GPU)
- **Google Free Tier** for backend (GAS, Firebase, Gemini)
- **P2P Compute Network** for heavy tasks (Partner Mode)

### Target Audience

| Segment             | Description                                  |
| ------------------- | -------------------------------------------- |
| **90% Web Users**   | Zero install, PWA experience, Gemini-powered |
| **10% Power Users** | Desktop app with local AI, GPU mining, RPA   |
| **Developers**      | Plugin creators earning revenue via store    |

### Why Google as Backbone?

Panda Factory is designed so that **Google services ARE the platform**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GOOGLE AS BACKBONE: Every User = Google Services Consumer                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Opens Panda → Firebase Auth (login) → GAS (operations) → Gemini (AI) │
│       ↓                    ↓                     ↓                ↓        │
│  Creates Plugin → Sheets (DB) + Drive (storage) + Colab (ML) + Ads (reach) │
│       ↓                    ↓                     ↓                ↓        │
│  Shares Work   → YouTube (content) + Gmail (notify) + Calendar (schedule)  │
│                                                                              │
│  🎯 RESULT: Each Panda user actively uses 8-12 Google services              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Metric                   | Value          | Google Impact                        |
| ------------------------ | -------------- | ------------------------------------ |
| **Target Users**         | 100K in Year 1 | 100K new Google service activations  |
| **Gemini Calls**         | ~50M/year      | API usage demonstrating Gemini value |
| **GAS Executions**       | ~2B/year       | Serverless adoption                  |
| **Sheets Rows**          | ~500M/year     | Workspace engagement                 |
| **Firebase Connections** | 10K concurrent | RTDB scale demonstration             |

> **For Google:** Each Panda Factory user is a power user of Google services, creating organic demand and demonstrating real-world use cases for Gemini, GAS, Firebase, and Workspace.

---

## 🔷 Google-First Architecture

Our entire stack prioritizes Google services, generating demand while maintaining $0 infrastructure cost:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE-FIRST ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  🌐 WEB LAYER (Browser - PWA)                                        │   │
│  │  ├── manifest.json (PWA config, offline cache)                       │   │
│  │  ├── panda.mcp.json (MCP tools registry)                             │   │
│  │  ├── React + TLDraw (Canvas UI)                                      │   │
│  │  └── Yjs (Real-time collaboration)                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                              ↓ HTTPS                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  ☁️ GOOGLE APPS SCRIPT (Backend - Serverless)                        │   │
│  │  ├── Brain.gs → Gemini API routing + billing                         │   │
│  │  ├── PAT.gs → Treasury autonomous logic                              │   │
│  │  ├── Wallet.gs → Panda Coin transactions                             │   │
│  │  └── Dispatcher.gs → MCP tools execution                             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                              ↓ REST API                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  🔥 FIREBASE (Realtime + Auth)                                       │   │
│  │  ├── Authentication (Google Sign-In, magic links)                    │   │
│  │  ├── Realtime Database (P2P signaling, presence)                     │   │
│  │  └── Hosting (Static assets, PWA shell)                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                              ↓ Optional                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  🦀 RUST AGENT (Desktop - Optional)                                  │   │
│  │  ├── Local GPU processing (CUDA, Vulkan, WebGPU)                     │   │
│  │  ├── Whisper + NLLB (Offline AI models)                              │   │
│  │  ├── Partner Mode (P2P compute mining)                               │   │
│  │  └── Native MCP Server (fs, terminal, screen)                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Google Services Demand Generation

Every Panda Factory user generates demand for Google services:

| Google Service         | Usage in Panda Factory             | User Action → Google Demand     |
| ---------------------- | ---------------------------------- | ------------------------------- |
| **Gemini API**         | AI chat, analysis, code generation | Every message = API call        |
| **Google Apps Script** | Serverless backend, billing        | Every operation = GAS execution |
| **Google Sheets**      | Database, transaction logs         | Every save = Sheets row         |
| **Firebase Auth**      | User authentication                | Every signup = new user         |
| **Firebase RTDB**      | Real-time presence, P2P signaling  | Active = connection             |
| **Google Colab**       | Heavy ML tasks (BYOC model)        | GPU sessions                    |
| **Google Drive**       | File storage, exports              | Storage consumption             |

### Free Tier Limits We Operate Within

| Service        | Free Tier             | Our Usage                |
| -------------- | --------------------- | ------------------------ |
| GAS Executions | 6M/month              | ~200k estimated          |
| Firebase Auth  | Unlimited             | All users                |
| Firebase RTDB  | 1GB + 10GB/month      | Signaling only           |
| Gemini Flash   | 1500 req/day          | Distributed across users |
| Sheets         | 10M cells/spreadsheet | Sharded by month         |

---

## 🧠 Core Concepts

### 1. Plugin-First Runtime

Minimal core (~50KB). Everything is a plugin:

```
┌─────────────────────────────────────────────────────────────────┐
│  PANDA FACTORY SHELL                                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Core Shell    │  │   Plugin A      │  │   Plugin B      │  │
│  │   (~50KB)       │  │   (CRM)         │  │   (Trading)     │  │
│  │   ├── Auth      │  │   + MCP tools   │  │   + MCP tools   │  │
│  │   ├── Billing   │  │   + UI views    │  │   + UI views    │  │
│  │   └── Events    │  │   + Styles      │  │   + Styles      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                              ↓                                   │
│                    panda.mcp.json (AI understands all)          │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Web-First (Zero Install)

**90% of users never install anything:**

| Mode         | Install           | Features                                                                                     | Cost     |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------- | -------- |
| **Web-Only** | Zero (PWA)        | AI Chat, Canvas, Data, Store, Wallet, MCP Tools                                              | $0/month |
| **Desktop**  | ~30MB + AI models | + NLLB Translation (200 langs), Whisper STT, GPU/CUDA, Partner Mode, RPA, Multi-Window (PiP) | $0/month |

### 3. AI-Native (MCP Protocol)

Every tool is described for AI comprehension:

```json
// panda.mcp.json example
{
  "name": "panda-crm",
  "tools": [
    {
      "name": "crm_list_clients",
      "description": "List all clients with optional filters",
      "parameters": {
        "status": { "type": "string", "enum": ["active", "inactive"] }
      }
    }
  ]
}
```

**Result:** Users speak naturally, AI executes tools.

---

## 🛠 Technical Stack

### Priority Hierarchy

| Priority | Category         | Technologies                           |
| -------- | ---------------- | -------------------------------------- |
| **P0**   | Core (Immutable) | Firebase Auth, GAS, Ed25519 signatures |
| **P1**   | SDK Base         | React 18, TLDraw, Yjs, Vite            |
| **P2**   | Recommended      | TypeScript, Zod, React Query           |
| **P3**   | Add-ons          | Gemini/OpenAI/Claude, Ollama, WebGPU   |

### Language Distribution

```
JavaScript/TypeScript  ████████████████████  78%
Rust (Agent)           ████                  15%
Google Apps Script     ██                     5%
Python (Colab)         █                      2%
```

### Key Files

| File             | Purpose                     |
| ---------------- | --------------------------- |
| `manifest.json`  | PWA config, offline caching |
| `panda.mcp.json` | MCP tools registry for AI   |
| `pf.sdk.js`      | Browser SDK (~200KB)        |
| `Brain.gs`       | GAS backend, Gemini routing |
| `main.rs`        | Rust Agent entry point      |

---

## 🔌 MCP Protocol Integration

**Model Context Protocol (MCP)** is our core differentiator:

```
┌─────────────────────────────────────────────────────────────────┐
│  MCP FLOW: User → AI → Tool → Result                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User: "Add João to my CRM"                                      │
│         ↓                                                        │
│  Gemini: [Reads panda.mcp.json] → Identifies: crm_create_client  │
│         ↓                                                        │
│  Dispatcher: Execute crm_create_client({ name: "João" })         │
│         ↓                                                        │
│  GAS Backend: Sheets.appendRow(["João", ...])                    │
│         ↓                                                        │
│  Response: "✅ João added to CRM"                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### MCP Tool Categories

| Category          | Examples                        | Execution      |
| ----------------- | ------------------------------- | -------------- |
| **Web Tools**     | crm*\*, sheets*\_, wallet\_\_   | Via GAS        |
| **AI Tools**      | brain_chat, brain_analyze       | Via Gemini API |
| **Desktop Tools** | fs*read, screen_capture, gpu*\* | Via Rust Agent |

### Plugin Publishing Requirements

All plugins MUST have `panda.mcp.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "tools": [...],
  "permissions": ["sheets", "brain"],
  "defendScore": 85  // Minimum 70 to publish
}
```

---

## 🤝 Partner Mode (P2P Compute)

**Partner Mode** allows users to share idle resources and earn:

```
┌─────────────────────────────────────────────────────────────────┐
│  P2P COMPUTE NETWORK                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Partner A (GPU Idle)      Task Queue        Partner B (Request) │
│  ┌─────────────────┐      ┌──────────┐      ┌─────────────────┐  │
│  │ RTX 3060        │ ←──→ │ Firebase │ ←──→ │ Needs Whisper   │  │
│  │ Mining = ON     │      │ RTDB     │      │ transcription   │  │
│  │ Earns: 50 PC/hr │      │ Signaling│      │ Pays: 10 PC     │  │
│  └─────────────────┘      └──────────┘      └─────────────────┘  │
│                                                                  │
│  SUPPORTED TASKS:                                                │
│  ├── Whisper transcription (audio → text)                        │
│  ├── NLLB translation (200 languages)                            │
│  ├── Image generation (Stable Diffusion)                         │
│  └── Custom ML inference                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Partner Mode Phases

| Phase         | Feature                        | Status          |
| ------------- | ------------------------------ | --------------- |
| **Pre-Chain** | Firebase signaling, PC credits | Planned Q1 2026 |
| **On-Chain**  | Solana anchoring, USDC bridge  | Planned Q3 2026 |

---

## 📦 SDK Architecture

### Module Hierarchy (Tentacles)

```
Panda (Global)
├── Auth         → Firebase Auth wrapper
├── Data         → Google Sheets CRUD
├── Storage      → Google Drive files
├── Wallet       → Internal credits (read-only)
├── Brain        → AI module
│   ├── Gemini   → 6 specialized GEMs (Writer, Analyst, Coder, Designer, Planner, Researcher)
│   ├── GPU      → WebGPU/WebGL detection + benchmarking
│   └── LocalLLM → Ollama/LM Studio integration
├── Bridge       → Rust Agent communication (MCP native)
├── UI           → Toast, Modal, Popout (Document PiP API)
├── Polyglot     → NLLB Translation (200 languages, requires Rust)
└── Google       → Workspace integration tentacle
    ├── Drive    → File operations
    ├── Sheets   → Database operations
    ├── Colab    → GPU compute tasks
    ├── Calendar → Event management
    ├── Docs     → Document creation
    ├── Gmail    → Email automation
    └── YouTube  → Video upload/management
```

### Usage Example

```javascript
// AI Chat with billing
const { text } = await Panda.Brain.Gemini.chat("Hello!", {
  gem: "writer",
  temperature: 0.7,
});

// Data CRUD
await Panda.Data.save("clients", { name: "João", email: "joao@email.com" });

// GPU Detection
const caps = await Panda.Brain.GPU.detect();
console.log(caps.webgpu); // true/false

// Partner Mode status
const isPartner = await Panda.Bridge.isConnected();
```

---

## 🐙 Tentacle System

Modular integration architecture with parent-child hierarchy:

### Core Tentacles

| Tentacle         | Children                                             | Google Integration | Status         |
| ---------------- | ---------------------------------------------------- | ------------------ | -------------- |
| **Brain**        | Gemini (6 GEMs), GPU, LocalLLM                       | Gemini API, Colab  | ✅ Implemented |
| **Google**       | Drive, Sheets, Colab, Calendar, Docs, Gmail, YouTube | Full Workspace     | ✅ Implemented |
| **Social**       | WhatsApp, Twitter, YouTube, Meta, Telegram, TikTok   | YouTube Data API   | ✅ Implemented |
| **Distribution** | PWA, itch.io, Panda Arcade, Google Play              | Play Console       | ✅ Implemented |
| **Education**    | Kiwify, Hotmart, Eduzz                               | Classroom API      | 🚧 Planned     |
| **Gaming**       | Godot, Bevy, ThreeJS, PixiJS                         | Play Games         | 🚧 Planned     |

### Hooks Architecture (Revenue Distribution)

Every tentacle can hook into e-commerce and monetization:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HOOKS & E-COMMERCE INTEGRATION                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Plugin/Tool Execution                                                       │
│         ↓                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  HOOK LAYER (Automatic Revenue Tracking)                             │    │
│  │  ├── Usage Hook: Track API calls, tokens, compute time              │    │
│  │  ├── Billing Hook: Debit credits, log transaction                   │    │
│  │  ├── Analytics Hook: Google Analytics 4 events                      │    │
│  │  └── Affiliate Hook: Track referrals, distribute commissions        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         ↓                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  E-COMMERCE LAYER                                                    │    │
│  │  ├── Plugin Store (Medusa): Buy/sell plugins                        │    │
│  │  ├── Subscription: Pro tiers, enterprise                            │    │
│  │  ├── Marketplace: User-generated templates, assets                  │    │
│  │  └── Affiliate Program: 10% referral commission                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Google Workspace Deep Integration

| Google Service    | Panda Module            | Use Case                          |
| ----------------- | ----------------------- | --------------------------------- |
| **Sheets**        | `Panda.Data`            | Database for CRM, inventory, logs |
| **Drive**         | `Panda.Storage`         | File uploads, exports, backups    |
| **Gemini**        | `Panda.Brain.Gemini`    | AI chat, analysis, code gen       |
| **Colab**         | `Panda.Google.Colab`    | Heavy ML, free GPU (T4)           |
| **Firebase Auth** | `Panda.Auth`            | Google Sign-In, magic links       |
| **Firebase RTDB** | `Panda.Bridge`          | P2P signaling, presence           |
| **Calendar**      | `Panda.Google.Calendar` | Scheduling, reminders             |
| **Gmail**         | `Panda.Google.Gmail`    | Automated emails                  |
| **YouTube**       | `Panda.Google.YouTube`  | Video content management          |
| **Analytics**     | Hooks                   | Usage tracking, conversion        |
| **Ads**           | Planned                 | Monetization, user acquisition    |

---

## 🗺 Roadmap

| Phase | Timeline    | Focus                                  | Google Services       |
| ----- | ----------- | -------------------------------------- | --------------------- |
| **0** | ✅ Jan 2026 | Foundation: Shell, SDK, GAS, Docs      | GAS, Firebase, Gemini |
| **1** | 🚧 Feb 2026 | Day 1: Rust Agent, Partner Mode, Store | + Colab integration   |
| **2** | Q2 2026     | Scale: P2P Network, VSX Store          | + Cloud Run, BigQuery |
| **3** | Q3 2026     | Expansion: EdTech, Marketplace         | + Google Ads          |

### Current Status (Phase 0 - 95% Complete)

- ✅ 17 Technical Documents (~200KB total)
- ✅ SDK with 10+ modules fully integrated with Google
- ✅ GAS backend fully functional (Brain.gs, Wallet.gs, Dispatcher.gs)
- ✅ Firebase Auth + RTDB integration
- ✅ Google Tentacle with 7 children (Drive, Sheets, Colab, etc)
- 🚧 Rust Agent (in development)
- 🚧 Partner Mode (planned)

---

## 📂 This Repository

```
Panda-Factory/
├── README.md       ← Architecture & Concepts (you are here)
├── pitch-deck.html ← Interactive 8-slide presentation
├── logo.png        ← Main logo
└── LOGO/           ← High-resolution variants
```

> **Note:** This is a showcase repository for concept documentation and pitch materials.  
> The full implementation is developed privately following Google-First best practices.

---

## 📬 Contact

**Lucas Valério** — Founder & Solo Developer

- 🐙 GitHub: [@LucassVal](https://github.com/LucassVal)
- 📧 Open to Google for Startups partnership discussions
- 🌐 pandafactory.dev (coming soon)

---

<p align="center">
  <strong>🐼 Panda Factory</strong><br>
  <em>Built on Google. Built for everyone.</em><br><br>
  <img src="https://img.shields.io/badge/Status-Active_Development-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Phase-0_Foundation-blue" alt="Phase">
  <img src="https://img.shields.io/badge/Docs-17_files-purple" alt="Docs">
</p>
