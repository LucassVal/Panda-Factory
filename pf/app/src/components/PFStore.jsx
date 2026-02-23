import React, { useState, useEffect } from "react";
import { CheckoutModal } from "./PFCheckoutModal";
import PFProductDetail from "./PFProductDetail";
import useLicenses from "../hooks/useLicenses";
import { Store, gasPost } from "../services/callGAS";

/**
 * 🏪 Panda Store v4.0 — Medusa Distribution UI
 * Marketplace for Extensions (Modules, Tentacles & Themes)
 *
 * NOTE: Medusa taxonomy (Module/Tentacle/Theme) is INTERNAL (SDK/dev).
 * Users see "extensions" — taxonomy is transparent.
 *
 * Implements USD-FIRST pricing from PF_MASTER_ARCHITECTURE.md §26.3
 * @see PF_MEDUSA_REFERENCE.md §2, §10.3 (PDP)
 *
 * v5.0 — License-aware install flow (TICKET-12: RTDB licenses)
 */

// Exchange rate: 1 PC = $0.10 USD
const PC_TO_USD = 0.1;

// Tier badge config — §10.5 PF_MEDUSA_REFERENCE.md
const TIER_CONFIG = {
  oss: { badge: "🟢 OSS", color: "#10b981", border: "rgba(16,185,129,0.3)" },
  freemium: {
    badge: "🔵 FREE+",
    color: "#3b82f6",
    border: "rgba(59,130,246,0.3)",
  },
  byol: { badge: "🟡 BYOL", color: "#f59e0b", border: "rgba(245,158,11,0.3)" },
  pro: { badge: "🟣 PRO", color: "#8b5cf6", border: "rgba(139,92,246,0.3)" },
};

// Store data — only REAL items that exist or are in active development
// Exported for Casulo manifest generation
export const STORE_ITEMS = [
  {
    id: "crm",
    name: "Panda CRM",
    icon: "📱",
    description: "Manage contacts, leads and sales with integrated AI",
    fullDescription:
      "Complete CRM solution built into the Panda ecosystem.\nManage your contacts, track leads through a visual Kanban pipeline, and close sales faster with AI-powered insights.\n\nFeatures:\n• Contact management with smart search\n• Kanban board for sales pipeline\n• AI-generated follow-up suggestions\n• WhatsApp integration for direct messaging\n• Export reports in PDF and CSV",
    priceUSD: 0,
    price: 0,
    tier: "oss",
    storeCategory: "productivity",
    category: "panda-factory",
    author: "Panda Factory",
    version: "2.1.0",
    popular: true,
    embedLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
      { type: "github", url: "https://github.com/LucassVal/Panda-Factory" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    description: "Manage posts, stories and Instagram metrics",
    fullDescription:
      "Connect your Instagram business account and manage everything from within Panda.\nSchedule posts, analyze story performance, and track follower growth with beautiful dashboards.\n\nFeatures:\n• Post scheduling with AI captions\n• Story analytics and engagement metrics\n• Hashtag research and suggestions\n• Content calendar view",
    priceUSD: 4.99,
    price: 50,
    tier: "pro",
    storeCategory: "social",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [
      { type: "instagram", url: "https://instagram.com/p/example123" },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "👤",
    description: "Pages, groups and Facebook campaigns",
    fullDescription:
      "Manage your Facebook presence directly from the Panda workspace.\nCreate and schedule posts, monitor page insights, and run campaigns — all without leaving your design canvas.\n\nFeatures:\n• Page management and analytics\n• Group interactions\n• Ad campaign monitoring\n• Audience insights",
    priceUSD: 4.99,
    price: 50,
    tier: "pro",
    storeCategory: "social",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶️",
    description: "Channel, videos, analytics and comments",
    fullDescription:
      "YouTube Studio inside Panda. Monitor your channel performance, manage comments, and analyze video metrics.\n\nFeatures:\n• Channel analytics dashboard\n• Video performance tracking\n• Comment moderation\n• Thumbnail A/B testing suggestions",
    priceUSD: 4.99,
    price: 50,
    tier: "pro",
    storeCategory: "social",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    description: "Profile management, videos and trends",
    fullDescription:
      "Stay on top of TikTok trends and manage your creator profile from Panda.\n\nFeatures:\n• Trending sounds and hashtags\n• Video performance analytics\n• Posting schedule\n• Competitor analysis",
    priceUSD: 4.99,
    price: 50,
    tier: "pro",
    storeCategory: "social",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [],
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "🐦",
    description: "Tweets, threads, analytics and engagement",
    fullDescription:
      "Compose tweets, build threads, and track engagement — all from your Panda workspace.\n\nFeatures:\n• Tweet composer with AI suggestions\n• Thread builder\n• Engagement analytics\n• Mention monitoring",
    priceUSD: 4.99,
    price: 50,
    tier: "pro",
    storeCategory: "social",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    icon: "📢",
    description: "Campaigns, metrics and optimization via webview",
    fullDescription:
      "Monitor and optimize your Google Ads campaigns directly inside Panda.\nGet AI-powered recommendations for better ROAS.\n\nFeatures:\n• Campaign overview dashboard\n• Performance metrics (CTR, CPC, ROAS)\n• AI optimization suggestions\n• Budget alerts",
    priceUSD: 9.99,
    price: 100,
    tier: "pro",
    storeCategory: "analytics",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [],
  },
  {
    id: "meta-business",
    name: "Meta Business Suite",
    icon: "Ⓜ️",
    description: "Facebook + Instagram Ads unified via webview",
    fullDescription:
      "Unified Meta advertising dashboard. Manage Facebook and Instagram ads from a single view inside Panda.\n\nFeatures:\n• Unified ad management\n• Cross-platform analytics\n• Audience builder\n• Creative insights",
    priceUSD: 9.99,
    price: 100,
    tier: "pro",
    storeCategory: "analytics",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [],
  },
  {
    id: "analytics-dashboard",
    name: "Analytics Dashboard",
    icon: "📊",
    description: "Visual dashboards and reports for your data",
    fullDescription:
      "Beautiful, customizable dashboards for all your business data.\nConnect multiple data sources and create stunning reports.\n\nFeatures:\n• Drag-and-drop chart builder\n• Multiple data source support\n• Scheduled report generation\n• Export to PDF/PNG",
    priceUSD: 4.99,
    price: 50,
    tier: "freemium",
    storeCategory: "analytics",
    category: "community",
    author: "@analytics_dev",
    version: "1.2.0",
    embedLinks: [
      {
        type: "github",
        url: "https://github.com/analytics_dev/panda-dashboard",
      },
    ],
  },
  {
    id: "kiwify",
    name: "Kiwify",
    icon: "🥝",
    description:
      "Sell digital products — courses, ebooks, memberships via Kiwify",
    fullDescription:
      "Integrate your Kiwify store with Panda Factory.\nTrack sales, manage digital products, and automate customer communication.\n\nFeatures:\n• Sales dashboard with real-time updates\n• Product management\n• Customer communication automation\n• Revenue analytics",
    priceUSD: 9.99,
    price: 100,
    tier: "pro",
    storeCategory: "automation",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    popular: true,
    embedLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
  },
  {
    id: "hotmart",
    name: "Hotmart",
    icon: "🔥",
    description:
      "Infoproduct marketplace — courses, subscriptions, affiliate sales",
    fullDescription:
      "Hotmart integration for infoproduct sellers.\nManage your courses, track subscriptions, and monitor affiliate performance.\n\nFeatures:\n• Course management dashboard\n• Subscription tracking\n• Affiliate performance analytics\n• Revenue reports",
    priceUSD: 9.99,
    price: 100,
    tier: "pro",
    storeCategory: "automation",
    category: "community",
    author: "Panda Factory",
    version: "1.0.0",
    embedLinks: [],
  },
  {
    id: "landing-pages",
    name: "Landing Pages",
    icon: "🌐",
    description:
      "Drag-and-drop page builder with AI copy — publish to GitHub Pages",
    fullDescription:
      "Build stunning landing pages with a visual drag-and-drop editor.\nAI writes your copy, you publish directly to GitHub Pages — zero hosting cost.\n\nFeatures:\n• Visual page builder\n• AI-powered copywriting\n• One-click deploy to GitHub Pages\n• Mobile-responsive templates\n• Analytics integration",
    priceUSD: 4.99,
    price: 50,
    tier: "freemium",
    storeCategory: "design",
    category: "panda-factory",
    author: "Panda Factory",
    version: "1.1.0",
    popular: true,
    embedLinks: [
      { type: "github", url: "https://github.com/LucassVal/Panda-Factory" },
      { type: "youtube", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
  },
  {
    id: "founder-hub",
    name: "Founder Hub",
    icon: "🚀",
    description:
      "Central de afiliados — materiais Drive, links UTM, dashboard de vendas",
    fullDescription:
      "Seu painel de comando para vendas via Kiwify e Hotmart.\nGerencie materiais de afiliados no Google Drive, gere links UTM rastreáveis, e acompanhe cada venda em tempo real.\n\nFeatures:\n• Navegação de arquivos no Google Drive\n• Gerador de links com UTM para afiliados\n• Dashboard de vendas com códigos de ativação\n• Logs de webhook Kiwify/Hotmart\n• Compartilhamento de materiais com 1 clique",
    priceUSD: 0,
    price: 0,
    tier: "oss",
    storeCategory: "productivity",
    category: "panda-factory",
    author: "Panda Factory",
    version: "1.0.0",
    popular: true,
    embedLinks: [
      { type: "github", url: "https://github.com/LucassVal/Panda-Factory" },
    ],
  },
];

function PFStore({
  onClose,
  onInstall,
  userPcBalance = 500,
  userTier = "user",
  embedded = false,
  selectionMode = false,
  selectedIds = new Set(),
  onSelectionChange,
}) {
  const [filter, setFilter] = useState("all");
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isLicensed, refresh: refreshLicenses } = useLicenses();

  // Sponsored items from RTDB (TICKET-09)
  const [sponsoredIds, setSponsoredIds] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    gasPost("GET_FEATURED", {})
      .then((res) => {
        if (!cancelled && res.featured && res.featured.length > 0) {
          const ids = new Set(res.featured.map((f) => f.moduleId));
          setSponsoredIds(ids);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Featured: static popular OR RTDB sponsored (merged, deduplicated)
  const featuredItems = STORE_ITEMS.filter(
    (i) => i.popular || sponsoredIds.has(i.id),
  );

  const filteredItems = STORE_ITEMS.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      item.storeCategory === filter ||
      item.category === filter ||
      item.type === filter;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleInstall = async (item) => {
    if (isLicensed(item.id)) return; // Already installed
    if (item.priceUSD > 0) {
      setCheckoutItem(item);
    } else {
      console.log("📦 Installing free:", item.name);
      try {
        await Store.purchase(item.id);
        refreshLicenses();
      } catch (_) {
        /* offline fallback */
      }
      onInstall && onInstall(item);
    }
  };

  const formatPrice = (item) => {
    if (item.priceUSD === 0) return "Free";
    return `$${item.priceUSD.toFixed(2)}`;
  };

  // Category filters — §10.6 PF_MEDUSA_REFERENCE.md
  const categories = [
    { id: "all", label: "🌐 Todos", count: STORE_ITEMS.length },
    {
      id: "productivity",
      label: "📋 Productivity",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "productivity")
        .length,
    },
    {
      id: "social",
      label: "📱 Social",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "social").length,
    },
    {
      id: "analytics",
      label: "📊 Analytics",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "analytics").length,
    },
    {
      id: "automation",
      label: "🤖 Automation",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "automation").length,
    },
    {
      id: "design",
      label: "🎨 Design",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "design").length,
    },
    {
      id: "ai",
      label: "🧠 AI",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "ai").length,
    },
    {
      id: "trading",
      label: "📈 Trading",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "trading").length,
    },
    {
      id: "devtools",
      label: "🔧 DevTools",
      count: STORE_ITEMS.filter((i) => i.storeCategory === "devtools").length,
    },
  ].filter((c) => c.id === "all" || c.count > 0);

  const storeContent = (
    <>
      <div
        className="pf-store"
        style={
          embedded
            ? { position: "relative", width: "100%", height: "100%" }
            : {}
        }
        onClick={(e) => (embedded ? null : e.stopPropagation())}
      >
        {/* Header */}
        <div className="pf-store-header">
          <div className="store-header-left">
            <h2 className="pf-store-title">
              {selectionMode ? "📦 Selecionar Módulos" : "🏪 Panda Store"}
            </h2>
            {selectionMode ? (
              <span
                className="store-balance"
                style={{ color: selectedIds.size > 0 ? "#10b981" : "#64748b" }}
              >
                ✓ {selectedIds.size} selecionado
                {selectedIds.size !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="store-balance">
                💰 {userPcBalance.toLocaleString()} PC
              </span>
            )}
          </div>
          {!embedded && (
            <button className="pf-store-close" onClick={onClose}>
              ×
            </button>
          )}
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
                  onClick={() => setSelectedProduct(item)}
                >
                  <span className="featured-icon">{item.icon}</span>
                  {sponsoredIds.has(item.id) && (
                    <span className="featured-sponsored-badge">
                      🎯 Promoted
                    </span>
                  )}
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

        {/* Grid or PDP */}
        <div className="pf-store-content">
          {selectedProduct && !selectionMode ? (
            <PFProductDetail
              item={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onInstall={handleInstall}
              formatPrice={formatPrice}
            />
          ) : (
            <>
              <div className="pf-store-grid">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`pf-store-card ${item.popular ? "popular" : ""}`}
                    style={
                      item.tier && TIER_CONFIG[item.tier]
                        ? { borderColor: TIER_CONFIG[item.tier].border }
                        : {}
                    }
                  >
                    {/* Badge Stack — wraps all badges in a flex-column container */}
                    <div className="card-badges">
                      {item.popular && (
                        <span className="card-badge">⭐ Popular</span>
                      )}
                      {sponsoredIds.has(item.id) && (
                        <span
                          className="card-badge"
                          style={{
                            background: "rgba(234,179,8,0.2)",
                            color: "#eab308",
                            borderColor: "rgba(234,179,8,0.3)",
                          }}
                        >
                          🎯 Sponsored
                        </span>
                      )}
                      {item.tier && TIER_CONFIG[item.tier] && (
                        <span
                          className="card-badge"
                          style={{
                            background: TIER_CONFIG[item.tier].border,
                            color: TIER_CONFIG[item.tier].color,
                            borderColor: TIER_CONFIG[item.tier].border,
                          }}
                        >
                          {TIER_CONFIG[item.tier].badge}
                        </span>
                      )}
                    </div>

                    <div
                      className="pf-store-card-clickable"
                      onClick={() =>
                        selectionMode
                          ? onSelectionChange?.(item.id)
                          : setSelectedProduct(item)
                      }
                    >
                      <div className="pf-store-card-icon">{item.icon}</div>
                      <div className="pf-store-card-name">{item.name}</div>
                      <div className="pf-store-card-desc">
                        {item.description}
                      </div>
                      <div className="pf-store-card-author">{item.author}</div>
                    </div>

                    <div className="pf-store-card-footer">
                      <div className="pf-store-card-price">
                        <span className="price-usd">{formatPrice(item)}</span>
                        {item.price > 0 && (
                          <span className="price-pc">({item.price} PC)</span>
                        )}
                      </div>
                      {selectionMode ? (
                        <button
                          className={`pf-store-card-btn ${selectedIds.has(item.id) ? "installed" : "free"}`}
                          onClick={() => onSelectionChange?.(item.id)}
                        >
                          {selectedIds.has(item.id)
                            ? "✓ Selecionado"
                            : "+ Selecionar"}
                        </button>
                      ) : (
                        <button
                          className={`pf-store-card-btn ${isLicensed(item.id) ? "installed" : item.priceUSD === 0 ? "free" : "paid"}`}
                          onClick={() => handleInstall(item)}
                          disabled={isLicensed(item.id)}
                        >
                          {isLicensed(item.id)
                            ? "Instalado ✓"
                            : item.priceUSD === 0
                              ? "Instalar"
                              : "Comprar"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="store-empty">
                  <span style={{ fontSize: 48 }}>🐙</span>
                  <p>Marketplace em construção</p>
                  <p style={{ fontSize: 12, opacity: 0.5 }}>
                    Extensões aparecerão aqui conforme forem publicadas
                  </p>
                </div>
              )}
            </>
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

  // Embedded: render content directly, no overlay
  if (embedded) {
    return storeContent;
  }

  // Standalone: wrap in overlay
  return (
    <div className="pf-store-overlay" onClick={onClose}>
      {storeContent}
    </div>
  );
}

export default PFStore;
