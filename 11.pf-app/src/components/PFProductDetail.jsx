import React from "react";
import "./PFProductDetail.css";

/**
 * 🏪 Product Detail Page (PDP) v1.0
 *
 * Full product view inside the Medusa Store modal.
 * Shows: fullDescription, embed links (whitelisted), badge, price.
 *
 * @see PF_MEDUSA_REFERENCE.md §10.3
 */

// ── Embed Whitelist ──
const EMBED_WHITELIST = [
  {
    type: "youtube",
    icon: "▶️",
    label: "YouTube",
    match: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    toEmbed: (id) => `https://www.youtube.com/embed/${id}`,
    isIframe: true,
  },
  {
    type: "instagram",
    icon: "📸",
    label: "Instagram",
    match: /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
    toEmbed: (id) => `https://www.instagram.com/p/${id}/embed`,
    isIframe: true,
  },
  {
    type: "tiktok",
    icon: "🎵",
    label: "TikTok",
    match: /tiktok\.com\/@[^/]+\/video\/(\d+)/,
    toEmbed: (id) =>
      `https://www.tiktok.com/embed/v2/${id}`,
    isIframe: true,
  },
  {
    type: "twitter",
    icon: "🐦",
    label: "Twitter / X",
    match: /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    toEmbed: null,
    isIframe: false,
  },
  {
    type: "linkedin",
    icon: "💼",
    label: "LinkedIn",
    match: /linkedin\.com/,
    toEmbed: null,
    isIframe: false,
  },
  {
    type: "github",
    icon: "🐙",
    label: "GitHub",
    match: /github\.com\/([^/]+\/[^/]+)/,
    toEmbed: null,
    isIframe: false,
  },
  {
    type: "telegram",
    icon: "📱",
    label: "Telegram",
    match: /t\.me\//,
    toEmbed: null,
    isIframe: false,
  },
  {
    type: "whatsapp",
    icon: "💬",
    label: "WhatsApp",
    match: /wa\.me\//,
    toEmbed: null,
    isIframe: false,
  },
];

function resolveEmbed(link) {
  const url = typeof link === "string" ? link : link.url;
  const explicitType = typeof link === "object" ? link.type : null;

  for (const rule of EMBED_WHITELIST) {
    if (explicitType && explicitType === rule.type) {
      const match = url.match(rule.match);
      return { ...rule, url, id: match?.[1] || null };
    }
    const match = url.match(rule.match);
    if (match) {
      return { ...rule, url, id: match[1] || null };
    }
  }
  // Not whitelisted — render as generic link card
  return {
    type: "external",
    icon: "🔗",
    label: new URL(url).hostname.replace("www.", ""),
    url,
    id: null,
    isIframe: false,
  };
}

function EmbedCard({ link }) {
  const embed = resolveEmbed(link);

  if (embed.isIframe && embed.toEmbed && embed.id) {
    return (
      <div className="pdp-embed-card pdp-embed-iframe">
        <iframe
          src={embed.toEmbed(embed.id)}
          title={embed.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <div className="pdp-embed-label">
          <span className="pdp-embed-icon">{embed.icon}</span>
          <span>{embed.label}</span>
        </div>
      </div>
    );
  }

  // Link card (non-iframe)
  return (
    <a
      href={embed.url}
      target="_blank"
      rel="noopener noreferrer"
      className="pdp-embed-card pdp-embed-link"
    >
      <span className="pdp-embed-icon-large">{embed.icon}</span>
      <span className="pdp-embed-link-label">{embed.label}</span>
      <span className="pdp-embed-arrow">↗</span>
    </a>
  );
}

function PFProductDetail({ item, onBack, onInstall, formatPrice }) {
  if (!item) return null;

  const isOfficial =
    item.author === "Panda Factory" || item.id?.startsWith("@panda/");
  const embeds = item.embedLinks || [];
  const fullDesc = item.fullDescription || item.description;

  return (
    <div className="pdp-container">
      {/* Header */}
      <div className="pdp-header">
        <button className="pdp-back" onClick={onBack}>
          ← Voltar
        </button>
      </div>

      {/* Product Hero */}
      <div className="pdp-hero">
        <div className="pdp-hero-icon">{item.icon}</div>
        <div className="pdp-hero-info">
          <div className="pdp-hero-title-row">
            <h2 className="pdp-title">{item.name}</h2>
            <span
              className={`pdp-badge ${isOfficial ? "official" : "community"}`}
            >
              {isOfficial ? "✅ Oficial" : "⚠️ Comunidade"}
            </span>
          </div>
          <div className="pdp-meta">
            <span className="pdp-author">por {item.author}</span>
            {item.version && (
              <span className="pdp-version">• v{item.version}</span>
            )}
            {item.popular && <span className="pdp-popular">• ⭐ Popular</span>}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="pdp-description">
        <h3 className="pdp-section-title">📋 Sobre</h3>
        <div className="pdp-desc-text">
          {fullDesc.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Embed Links */}
      {embeds.length > 0 && (
        <div className="pdp-embeds">
          <h3 className="pdp-section-title">🔗 Links & Media</h3>
          <div className="pdp-embeds-grid">
            {embeds.map((link, i) => (
              <EmbedCard key={i} link={link} />
            ))}
          </div>
        </div>
      )}

      {/* Community disclaimer */}
      {!isOfficial && (
        <div className="pdp-disclaimer">
          ⚠️ Módulos não-verificados são de responsabilidade exclusiva do
          desenvolvedor. A Panda Factory não se responsabiliza por conteúdo,
          funcionalidade ou segurança de extensões da comunidade.
        </div>
      )}

      {/* Footer / CTA */}
      <div className="pdp-footer">
        <div className="pdp-price-area">
          <span className="pdp-price-main">{formatPrice(item)}</span>
          {item.price > 0 && (
            <span className="pdp-price-pc">({item.price} PC)</span>
          )}
        </div>
        <button
          className={`pdp-install-btn ${item.priceUSD === 0 ? "free" : "paid"}`}
          onClick={() => onInstall(item)}
        >
          {item.priceUSD === 0 ? "📦 Instalar Grátis" : "🛒 Comprar"}
        </button>
      </div>
    </div>
  );
}

export default PFProductDetail;
