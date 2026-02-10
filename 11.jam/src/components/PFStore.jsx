import React, { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

/**
 * 🏪 Panda Store v3.2 — Medusa Distribution UI
 * Marketplace for Extensions (Modules, Tentacles & Themes)
 *
 * NOTE: Medusa taxonomy (Module/Tentacle/Theme) is INTERNAL (SDK/dev).
 * Users see "extensions" — taxonomy is transparent.
 *
 * Implements USD-FIRST pricing from PF_MASTER_ARCHITECTURE.md §26.3
 * @see PF_MEDUSA_REFERENCE.md §2
 *
 * v3.2 — Added Kiwify, Hotmart, Landing Pages tentacles + EN descriptions
 */

// Exchange rate: 1 PC = $0.10 USD
const PC_TO_USD = 0.1;

// Store data — only REAL items that exist or are in active development
const STORE_ITEMS = [
  {
    id: "crm",
    name: "Panda CRM",
    icon: "📱",
    description: "Manage contacts, leads and sales with integrated AI",
    priceUSD: 0,
    price: 0,
    category: "panda-factory",
    author: "Panda Factory",
    popular: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    description: "Manage posts, stories and Instagram metrics",
    priceUSD: 4.99,
    price: 50,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "👤",
    description: "Pages, groups and Facebook campaigns",
    priceUSD: 4.99,
    price: 50,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶️",
    description: "Channel, videos, analytics and comments",
    priceUSD: 4.99,
    price: 50,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    description: "Profile management, videos and trends",
    priceUSD: 4.99,
    price: 50,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "🐦",
    description: "Tweets, threads, analytics and engagement",
    priceUSD: 4.99,
    price: 50,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    icon: "📢",
    description: "Campaigns, metrics and optimization via webview",
    priceUSD: 9.99,
    price: 100,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "meta-business",
    name: "Meta Business Suite",
    icon: "Ⓜ️",
    description: "Facebook + Instagram Ads unified via webview",
    priceUSD: 9.99,
    price: 100,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "analytics-dashboard",
    name: "Analytics Dashboard",
    icon: "📊",
    description: "Visual dashboards and reports for your data",
    priceUSD: 4.99,
    price: 50,
    category: "community",
    author: "@analytics_dev",
  },
  {
    id: "kiwify",
    name: "Kiwify",
    icon: "🥝",
    description: "Sell digital products — courses, ebooks, memberships via Kiwify",
    priceUSD: 9.99,
    price: 100,
    category: "community",
    author: "Panda Factory",
    popular: true,
  },
  {
    id: "hotmart",
    name: "Hotmart",
    icon: "🔥",
    description: "Infoproduct marketplace — courses, subscriptions, affiliate sales",
    priceUSD: 9.99,
    price: 100,
    category: "community",
    author: "Panda Factory",
  },
  {
    id: "landing-pages",
    name: "Landing Pages",
    icon: "🌐",
    description: "Drag-and-drop page builder with AI copy — publish to GitHub Pages",
    priceUSD: 4.99,
    price: 50,
    category: "panda-factory",
    author: "Panda Factory",
    popular: true,
  },
];

function PFStore({
  onClose,
  onInstall,
  userPcBalance = 500,
  userTier = "user",
}) {
  const [filter, setFilter] = useState("all");
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [search, setSearch] = useState("");

  // Featured items (popular ones)
  const featuredItems = STORE_ITEMS.filter((i) => i.popular);

  const filteredItems = STORE_ITEMS.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      item.category === filter ||
      item.type === filter;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleInstall = (item) => {
    if (item.priceUSD > 0) {
      setCheckoutItem(item);
    } else {
      console.log("📦 Installing free:", item.name);
      onInstall && onInstall(item);
    }
  };

  const formatPrice = (item) => {
    if (item.priceUSD === 0) return "Free";
    return `$${item.priceUSD.toFixed(2)}`;
  };

  // Simple category filters (NO taxonomy labels for users)
  const categories = [
    { id: "all", label: "🌐 Todos", count: STORE_ITEMS.length },
    {
      id: "panda-factory",
      label: "🐼 Official",
      count: STORE_ITEMS.filter((i) => i.category === "panda-factory").length,
    },
    {
      id: "community",
      label: "👥 Community",
      count: STORE_ITEMS.filter((i) => i.category === "community").length,
    },
  ];

  return (
    <>
      <div className="pf-store-overlay" onClick={onClose}>
        <div className="pf-store" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="pf-store-header">
            <div className="store-header-left">
              <h2 className="pf-store-title">🏪 Panda Store</h2>
              <span className="store-balance">
                💰 {userPcBalance.toLocaleString()} PC
              </span>
            </div>
            <button className="pf-store-close" onClick={onClose}>
              ×
            </button>
          </div>

          {/* Search */}
          <div className="store-search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar extensões..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="store-search-input"
            />
          </div>

          {/* Filters */}
          <div className="store-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`store-filter-btn ${filter === cat.id ? "active" : ""}`}
              >
                {cat.label}
                <span className="filter-count">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Featured Section — only if popular items exist */}
          {filter === "all" && !search && featuredItems.length > 0 && (
            <div className="store-featured">
              <h3 className="store-featured-title">⭐ Em Destaque</h3>
              <div className="store-featured-grid">
                {featuredItems.map((item) => (
                  <div
                    key={`featured-${item.id}`}
                    className="store-featured-card"
                    onClick={() => handleInstall(item)}
                  >
                    <span className="featured-icon">{item.icon}</span>
                    <div className="featured-info">
                      <div className="featured-name">{item.name}</div>
                      <div className="featured-desc">{item.description}</div>
                      <div className="featured-meta">
                        <span>{formatPrice(item)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="pf-store-content">
            <div className="pf-store-grid">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`pf-store-card ${item.popular ? "popular" : ""}`}
                >
                  {item.popular && (
                    <span className="card-badge">⭐ Popular</span>
                  )}

                  <div className="pf-store-card-icon">{item.icon}</div>
                  <div className="pf-store-card-name">{item.name}</div>
                  <div className="pf-store-card-desc">{item.description}</div>
                  <div className="pf-store-card-author">{item.author}</div>

                  <div className="pf-store-card-footer">
                    <div className="pf-store-card-price">
                      <span className="price-usd">{formatPrice(item)}</span>
                      {item.price > 0 && (
                        <span className="price-pc">({item.price} PC)</span>
                      )}
                    </div>
                    <button
                      className={`pf-store-card-btn ${item.priceUSD === 0 ? "free" : "paid"}`}
                      onClick={() => handleInstall(item)}
                    >
                      {item.priceUSD === 0 ? "Instalar" : "Comprar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="store-empty">
                <span style={{ fontSize: 48 }}>🐙</span>
                <p>Marketplace em construção</p>
                <p style={{ fontSize: 12, opacity: 0.5 }}>Extensões aparecerão aqui conforme forem publicadas</p>
              </div>
            )}
          </div>

          {/* Store Footer — Medusa branding */}
          <div className="pf-store-footer">
            <span>Powered by</span>
            <span className="medusa-brand">🐙 Medusa Distribution</span>
            {STORE_ITEMS.length > 0 && (
              <span>• {STORE_ITEMS.length} extensões</span>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={!!checkoutItem}
        onClose={() => setCheckoutItem(null)}
        item={checkoutItem}
        userPcBalance={userPcBalance}
        userTier={userTier}
      />
    </>
  );
}

export default PFStore;
