<p align="center">
  <img src="logo.png" alt="Panda Factory" width="200">
</p>

<h1 align="center">🐼 Panda Factory</h1>

<p align="center">
  <strong>"Do PhD ao Favelado"</strong> — Democratizing Software with AI
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#key-differentiators">Differentiators</a> •
  <a href="#pitch-deck">Pitch Deck</a> •
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stage-MVP-blue" alt="Stage">
  <img src="https://img.shields.io/badge/AI-Gemini%20Powered-purple" alt="AI">
  <img src="https://img.shields.io/badge/MCP-Native-green" alt="MCP">
  <img src="https://img.shields.io/badge/License-Proprietary-orange" alt="License">
</p>

---

## 🎯 The Problem

**80% of small businesses don't automate** because software is:

- ❌ Too expensive ($50-500/month per tool)
- ❌ Too complex (steep learning curves)
- ❌ Fragmented (data silos, broken integrations)

## 💡 The Solution

**Panda Factory** is a minimalist AI-powered runtime where plugins run, orchestrated by natural language via **MCP (Model Context Protocol)**.

| Feature              | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| 🧠 **MCP-Native**    | Every tool is AI-accessible. Ask in plain language, it executes. Works on **Web AND Desktop**. |
| 🔌 **Plugin-First**  | Minimal core. Everything via installable plugins. Pay only what you use.                       |
| 🪟 **Multi-Window**  | Document Picture-in-Picture API. Pop-out any tool to separate windows/monitors.                |
| 🆓 **Free to Start** | 500k tokens/month free. Gemini Flash integrated.                                               |
| 🤝 **Partner Mode**  | Share idle CPU, earn credits. Zero cost, everyone wins.                                        |

---

## 🏗️ Architecture

Three-layer hybrid architecture for **$0 infrastructure cost**:

```
┌─────────────────────────────────────────────────────────────────────┐
│  ☁️  GOOGLE LAYER (Web-First - 90% of use cases)                    │
│      Gemini API + GAS + Firebase → $0/month                         │
│      🔌 MCP via manifest.json (PWA) - NO RUST REQUIRED              │
├─────────────────────────────────────────────────────────────────────┤
│  🐍  COLAB LAYER (Free GPU for heavy AI)                            │
│      User's Colab Account → ML, Whisper, Image Gen                  │
├─────────────────────────────────────────────────────────────────────┤
│  🦀  RUST LAYER (Partner Mode + Local Power)                        │
│      Local Tauri Agent → MCP Server, Mining, GPU Pool, RPA          │
│      🪟 Multi-Window via Document PiP API                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Innovation:**

- **Web-First:** Most users never need to install anything. MCP works via GAS/Firebase.
- **Desktop Power:** Rust Agent unlocks GPU, local AI, mining, and automation.
- **Multi-Window:** Pop-out Console, MCP Browser, Treasury to separate monitors.

---

## 🔑 Key Differentiators

### 1. MCP Everywhere (Web + Desktop)

```javascript
// Works in browser (via GAS) OR desktop (via Rust Agent)
const result = await Panda.Bridge.execute("my_tool", { params });
```

### 2. Multi-Window UI (Document PiP)

```javascript
// Pop any tool to a separate window
await Panda.UI.popout("console", { width: 800, height: 600 });
```

### 3. Zero Infrastructure Cost

```
manifest.json (PWA) → GAS Backend → Firebase Signaling → $0/month
```

### 4. Partner Mode (P2P Compute)

```
User donates idle CPU → Earns Panda Credits → Spends in Store → Circular economy
```

---

## 💰 Business Model

### Revenue Stream 1: Plugin Store (Medusa)

| Split   | Recipient                  |
| ------- | -------------------------- |
| 52%     | Developer (plugin creator) |
| 25%     | Education Fund             |
| 15%     | Operations                 |
| 5% + 3% | Platform + Gateway         |

### Revenue Stream 2: Partner Mode (Mining)

| Split | Recipient               |
| ----- | ----------------------- |
| 50%   | User (as Panda Credits) |
| 25%   | Tax Reserve             |
| 23%   | Operations              |
| 2%    | Founder                 |

---

## 📊 Pitch Deck

**[📥 View Pitch Deck (HTML)](pitch-deck.html)** — 8 slides, professional design

To convert to PDF:

1. Open in Chrome
2. Press `Ctrl+P`
3. Destination: **Save as PDF**
4. Layout: **Landscape**
5. Enable: **Background graphics**

---

## 🗺️ Roadmap

| Phase             | Timeline     | Status | Description                                 |
| ----------------- | ------------ | ------ | ------------------------------------------- |
| **0. Foundation** | Jan 2026     | ✅ 95% | Shell, SDK, GAS Backend, MCP Manifest, Docs |
| **1. Day One**    | Feb 2026     | 🚧 30% | Rust Agent, AI Cores, Partner Mode          |
| **2. Scale**      | Mar-Apr 2026 | ⏳     | P2P Compute, GPU Pool, Multi-Window polish  |
| **3. Expansion**  | Q2-Q3 2026   | ⏳     | EdTech (Panda Labs), Open Marketplace       |

---

## 📈 Traction

| Metric                  | Value                                  |
| ----------------------- | -------------------------------------- |
| Technical Documentation | 17 comprehensive docs (~200KB)         |
| Core Integrations       | 5+ (Firebase, GAS, Gemini, Colab, MCP) |
| Phase 0 Completion      | 95%                                    |

---

## 🛠️ Tech Stack

| Layer              | Technologies                                       |
| ------------------ | -------------------------------------------------- |
| **Frontend**       | Vanilla JS, React, TLDraw, Document PiP API        |
| **Backend**        | Rust (Tauri), Google Apps Script, Firebase RTDB    |
| **AI/ML**          | Gemini API, Google Colab, MCP Protocol             |
| **Infrastructure** | Google Cloud (free tier), User-contributed compute |

---

## 📬 Contact

**Lucas Valério** — Founder & Developer

- 🐙 GitHub: [@LucassVal](https://github.com/LucassVal)
- 🌐 Website: [pandafactory.dev](https://pandafactory.dev) _(coming soon)_

---

<p align="center">
  <strong>🐼 Panda Factory</strong><br>
  <em>"Do PhD ao Favelado" — Breaking barriers, one line of code at a time.</em>
</p>
