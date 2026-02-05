# 📱 PF_SOCIAL_REFERENCE - Social Media Hub

> **Versão:** 1.0.0 | **Atualizado:** 2026-02-03
> **Cross-Ref:** [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) | [PF_PLUGIN_AND_MODULAR_REFERENCE.md](PF_PLUGIN_AND_MODULAR_REFERENCE.md)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Plugins](#3-plugins)
4. [SDK API](#4-sdk-api)
5. [Preços](#5-preços)

---

## 1. Visão Geral

O **Social Media Hub** integra múltiplas plataformas sociais via SDK.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      SOCIAL MEDIA HUB                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 📱 WhatsApp  │  │ 🐦 Twitter   │  │ 📺 YouTube   │              │
│  │              │  │    /X        │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ 📘 Meta      │  │ ✈️ Telegram  │  │ 🎵 TikTok   │              │
│  │ (FB + IG)    │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                            │                                        │
│                            ▼                                        │
│                   ┌──────────────────┐                             │
│                   │  Panda.Social    │                             │
│                   │  (SDK Parent)    │                             │
│                   └──────────────────┘                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitetura

### 2.1 Estrutura de Arquivos

```text
js/tentacles/social/
├── pf.social-parent.js      # Parent API
└── children/
    ├── whatsapp.js          # WhatsApp Business
    ├── twitter.js           # Twitter/X
    ├── youtube.js           # YouTube Data API
    ├── meta.js              # Meta (Facebook + Instagram)
    ├── telegram.js          # Telegram Bot
    └── tiktok.js            # TikTok
```

### 2.2 Parent Pattern

```javascript
// Parent controla, children implementam
Panda.Social = {
  // Parent methods
  configure(platform, credentials) { ... },
  getStats(platform) { ... },

  // Children (loaded on demand)
  WhatsApp: null,   // lazy loaded
  Twitter: null,
  YouTube: null,
  Meta: null,
  Telegram: null,
  TikTok: null
};
```

---

## 3. Plugins

### 3.1 Catálogo

| Plugin        | Arquivo                 | Preço  | Features                    |
| ------------- | ----------------------- | ------ | --------------------------- |
| **Core**      | `pf.social-core.js`     | GRÁTIS | CRM básico, Agenda          |
| **YouTube**   | `pf.social-youtube.js`  | 499 PC | SEO, Thumbnails AI, Scripts |
| **TikTok**    | `pf.social-tiktok.js`   | 399 PC | Trends, Viral Captions      |
| **Meta**      | `pf.social-meta.js`     | 599 PC | Posts, Stories, Ads         |
| **Twitter/X** | `pf.social-twitter.js`  | 299 PC | Threads, Hooks, Spaces      |
| **WhatsApp**  | `pf.social-whatsapp.js` | 799 PC | Broadcast, Leads, Flows     |
| **Telegram**  | `pf.social-telegram.js` | 299 PC | Bots, Channels              |

### 3.2 Features por Plugin

**📱 WhatsApp (799 PC)**

- Broadcast para listas
- Lead capture automatizado
- Flows conversacionais
- Integração CRM

**📺 YouTube (499 PC)**

- SEO automático (títulos, tags)
- Thumbnails com AI
- Scripts de vídeo
- Analytics dashboard

**🐦 Twitter/X (299 PC)**

- Threads generator
- Hook writing AI
- Spaces scheduling
- Engagement analytics

**📘 Meta (599 PC)**

- Cross-post FB + IG
- Stories automation
- Ads manager
- Audience insights

**🎵 TikTok (399 PC)**

- Trend detection
- Caption generator
- Hashtag optimizer
- Sound suggestions

---

## 4. SDK API

### 4.1 Configuração

```javascript
// Configurar plataforma
await Panda.Social.configure("youtube", {
  apiKey: "YOUR_API_KEY",
  channelId: "YOUR_CHANNEL_ID",
});

await Panda.Social.configure("twitter", {
  apiKey: "...",
  apiSecret: "...",
  accessToken: "...",
  accessSecret: "...",
});
```

### 4.2 WhatsApp

```javascript
// Enviar mensagem
await Panda.Social.WhatsApp.send({
  to: "+5511999999999",
  message: "Olá! 🐼",
  template: "welcome", // opcional
});

// Broadcast para lista
await Panda.Social.WhatsApp.broadcast({
  listId: "leads_janeiro",
  message: "Novidade para você!",
  media: "https://...", // opcional
});

// Capturar lead
await Panda.Social.WhatsApp.captureLead({
  phone: "+5511999999999",
  name: "João",
  source: "landing_page",
});
```

### 4.3 YouTube

```javascript
// Otimizar vídeo
const optimized = await Panda.Social.YouTube.optimize({
  title: "Meu vídeo sobre...",
  description: "Descrição atual...",
  tags: ["tag1", "tag2"],
});
// Returns: { title: 'Otimizado...', tags: [...], score: 85 }

// Gerar thumbnail
const thumbnail = await Panda.Social.YouTube.generateThumbnail({
  videoId: "abc123",
  style: "vibrant", // 'vibrant' | 'minimal' | 'custom'
});

// Script de vídeo
const script = await Panda.Social.YouTube.generateScript({
  topic: "Como fazer X",
  duration: "10min",
  style: "educational",
});
```

### 4.4 Twitter/X

```javascript
// Gerar thread
const thread = await Panda.Social.Twitter.generateThread({
  topic: "AI no desenvolvimento",
  tweets: 5,
  includeHook: true,
});

// Postar thread
await Panda.Social.Twitter.postThread(thread);

// Agendar post
await Panda.Social.Twitter.schedule({
  content: "Post agendado 🐼",
  datetime: "2026-02-05T10:00:00Z",
});
```

### 4.5 Meta (Facebook + Instagram)

```javascript
// Cross-post
await Panda.Social.Meta.crossPost({
  platforms: ["facebook", "instagram"],
  content: "Novidade! 🎉",
  media: ["image1.jpg", "image2.jpg"],
});

// Story
await Panda.Social.Meta.postStory({
  platform: "instagram",
  media: "story.mp4",
  stickers: ["poll", "countdown"],
});
```

---

## 5. Preços

### 5.1 Custo por Ação

| Ação                         | Custo PC |
| ---------------------------- | -------- |
| WhatsApp msg                 | 1 PC     |
| WhatsApp broadcast (por msg) | 0.5 PC   |
| YouTube SEO                  | 10 PC    |
| YouTube thumbnail            | 20 PC    |
| Twitter thread               | 15 PC    |
| Meta cross-post              | 5 PC     |
| TikTok caption               | 5 PC     |

### 5.2 Revenue Split (Plugin Sales)

```text
┌────────────────────────────────────────┐
│         VENDA DE PLUGIN                │
│              499 PC                    │
├────────────────────────────────────────┤
│  Dev (Criador)    │  260 PC (52%)      │
│  Panda Educação   │  125 PC (25%)      │
│  Panda Ops        │   75 PC (15%)      │
│  Founder          │   25 PC (5%)       │
│  Gateway/Taxas    │   15 PC (3%)       │
└────────────────────────────────────────┘
```

---

## 📎 Arquivos Relacionados

| Arquivo                                    | Descrição                |
| ------------------------------------------ | ------------------------ |
| `js/tentacles/social/pf.social-parent.js`  | Parent API               |
| `js/tentacles/social/children/*.js`        | Platform implementations |
| [PF_SDK_REFERENCE.md](PF_SDK_REFERENCE.md) | SDK completo             |

---

> 📖 **Versão:** 1.0.0 | **Status:** Planejado
