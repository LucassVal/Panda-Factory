<p align="center">
  <img src="logo.png" alt="Panda Factory" width="180">
</p>

<h1 align="center">🐼 Panda Factory</h1>

<p align="center">
  <strong>"Do PhD ao Favelado"</strong> — Democratizing Software with Google AI
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Built_on-Google_Cloud-4285F4?logo=google-cloud" alt="Google Cloud">
  <img src="https://img.shields.io/badge/AI-Gemini_Powered-8E75B2?logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase" alt="Firebase">
</p>

---

## 🎯 Vision

**Panda Factory** is a minimalist AI-powered platform that democratizes software access for underserved communities. We leverage the **Google ecosystem** as our primary infrastructure, generating demand for Google services while reducing barriers to technology adoption.

---

## 🔷 Google-First Architecture

Our entire stack is built on Google infrastructure, maximizing the ecosystem's potential:

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE-FIRST STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🧠 AI LAYER                    ☁️ BACKEND LAYER                │
│  ├── Gemini 2.0 Flash          ├── Google Apps Script          │
│  ├── Gemini Pro                ├── Google Sheets (as DB)       │
│  └── Gemini Imagen             └── Google Drive (storage)      │
│                                                                  │
│  🔐 AUTH & REALTIME            🐍 COMPUTE LAYER                 │
│  ├── Firebase Auth             ├── Google Colab (free GPU)     │
│  ├── Firebase RTDB             └── User-side processing        │
│  └── Firebase Hosting                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Services Utilized

| Google Service         | Usage                  | Demand Generation                 |
| ---------------------- | ---------------------- | --------------------------------- |
| **Gemini API**         | Core AI chat, analysis | Every user interaction = API call |
| **Google Apps Script** | Backend logic, billing | Serverless compute                |
| **Google Sheets**      | Database, transactions | Scales with users                 |
| **Firebase Auth**      | User authentication    | User acquisition                  |
| **Firebase RTDB**      | Real-time signaling    | Active connections                |
| **Google Colab**       | Heavy AI tasks (BYOC)  | GPU usage, Pro upgrades           |
| **Google Drive**       | File storage           | Storage consumption               |

---

## 💡 The Hooks Model

We integrate with multiple platforms, but **Google services are always the primary choice**:

```
PRIORITY HIERARCHY:
1️⃣ Google Services (always first)
2️⃣ User-side processing (local)
3️⃣ Third-party only when unavoidable
```

| Need         | Google Solution   | Fallback         |
| ------------ | ----------------- | ---------------- |
| AI/ML        | Gemini API        | Local (user GPU) |
| Auth         | Firebase Auth     | -                |
| Database     | Sheets + Firebase | -                |
| File Storage | Drive             | -                |
| Compute      | Colab             | User local       |
| Payments     | -                 | Stripe/PIX       |

---

## 📈 Demand Generation for Google

Every Panda Factory user generates demand for Google services:

```
USER JOURNEY → GOOGLE DEMAND

1. User signs up      → Firebase Auth (new user)
2. User chats with AI → Gemini API calls (~500k tokens/user/month)
3. User stores data   → Sheets rows + Drive files
4. User needs compute → Colab session (potential Pro conversion)
5. User builds plugin → More API calls, more storage
```

### Projected Impact (Phase 1)

| Metric                  | Estimate         |
| ----------------------- | ---------------- |
| Target users (Y1)       | 10,000           |
| Gemini calls/user/month | 500k tokens      |
| Total Gemini demand     | 5B tokens/month  |
| Firebase connections    | 1,000 concurrent |
| Colab sessions/week     | 500              |

---

## 🏗️ Core Concepts

### 1. Plugin-First Runtime

Minimal core shell. All features are plugins with **MCP (Model Context Protocol)** for AI-native interaction.

### 2. Web-First (90% Zero-Install)

Most users run entirely in browser via **PWA → GAS → Firebase**. Desktop app optional for power users.

### 3. Partner Mode (P2P Compute)

Users share idle resources → Earn credits → Spend in ecosystem. Circular economy.

### 4. AI Treasury (PAT)

Autonomous AI governs token economics following hardcoded rules (12 Articles Constitution).

---

## 🎯 Target Verticals

| Vertical          | Google Alignment                           |
| ----------------- | ------------------------------------------ |
| **EdTech**        | Colab for learning, Gemini for tutoring    |
| **SaaS for SMBs** | Sheets as backend, low-cost infrastructure |
| **AI/ML**         | Gemini-first, Colab integration            |

---

## 🗺️ Roadmap

| Phase           | Focus      | Google Services                         |
| --------------- | ---------- | --------------------------------------- |
| **0** (Current) | Foundation | GAS, Firebase, Gemini                   |
| **1** (Q1 2026) | Launch     | Scale Gemini usage, Colab templates     |
| **2** (Q2 2026) | Growth     | Cloud Run (future), BigQuery analytics  |
| **3** (Q3 2026) | Expansion  | Google Ads integration, Play Store apps |

---

## 📬 Contact

**Lucas Valério** — Founder

- 🐙 GitHub: [@LucassVal](https://github.com/LucassVal)
- 📧 Open to Google for Startups partnership discussions

---

<p align="center">
  <strong>🐼 Panda Factory</strong><br>
  <em>Built on Google. Built for everyone.</em>
</p>
