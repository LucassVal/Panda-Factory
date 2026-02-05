import React, { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

/**
 * 🐼 Jam Store (v2.0 - USD-FIRST)
 * Marketplace for plugins
 *
 * Implements USD-FIRST pricing from PF_MASTER_ARCHITECTURE.md §26.3
 * - Display price in USD first
 * - Show PC equivalent
 * - Checkout modal for purchases
 *
 * Categories:
 * - Panda Factory (official)
 * - Community Devs (55/22/23 split)
 * - Open Source (GitHub linked)
 */

// Exchange rate: 1 PC = $0.10 USD
const PC_TO_USD = 0.1;

// Mock store data with USD-FIRST pricing
const STORE_ITEMS = [
  {
    id: "crm",
    name: "Panda CRM",
    icon: "📱",
    description: "Gerencie contatos, leads e vendas",
    priceUSD: 0,
    price: 0,
    category: "panda-factory",
    author: "Panda Factory",
    popular: true,
  },
  {
    id: "trading",
    name: "Trading Hub",
    icon: "📊",
    description: "cTrader, sinais e estratégias",
    priceUSD: 0,
    price: 0,
    category: "panda-factory",
    author: "Panda Factory",
  },
  {
    id: "brain",
    name: "Panda Brain",
    icon: "🧠",
    description: "AI assistente multi-modelo",
    priceUSD: 0,
    price: 0,
    category: "panda-factory",
    author: "Panda Factory",
  },
  {
    id: "social",
    name: "Social Manager",
    icon: "💬",
    description: "WhatsApp, Instagram, Twitter",
    priceUSD: 9.99,
    price: 100,
    category: "community",
    author: "@dev_example",
    popular: true,
  },
  {
    id: "analytics",
    name: "Analytics Pro",
    icon: "📈",
    description: "Dashboards e relatórios avançados",
    priceUSD: 4.99,
    price: 50,
    category: "community",
    author: "@analytics_dev",
  },
  {
    id: "automation",
    name: "Automation Suite",
    icon: "⚡",
    description: "Automatize tarefas repetitivas",
    priceUSD: 14.99,
    price: 150,
    category: "community",
    author: "@automation_pro",
  },
  {
    id: "theme-dark",
    name: "Dark Theme Pro",
    icon: "🌙",
    description: "Tema escuro premium",
    priceUSD: 0,
    price: 0,
    category: "open-source",
    author: "github:user/repo",
  },
  {
    id: "icons-pack",
    name: "Premium Icons",
    icon: "🎨",
    description: "500+ ícones premium",
    priceUSD: 2.99,
    price: 30,
    category: "open-source",
    author: "github:icons/pack",
  },
];

function JamStore({
  onClose,
  onInstall,
  userPcBalance = 500,
  userTier = "user",
}) {
  const [filter, setFilter] = useState("all");
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [search, setSearch] = useState("");

  const filteredItems = STORE_ITEMS.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleInstall = (item) => {
    if (item.priceUSD > 0) {
      // Paid item - show checkout
      setCheckoutItem(item);
    } else {
      // Free item - install directly
      console.log("📦 Installing free:", item.name);
      onInstall && onInstall(item);
    }
  };

  const formatPrice = (item) => {
    if (item.priceUSD === 0) return "Grátis";
    return `$${item.priceUSD.toFixed(2)}`;
  };

  return (
    <>
      <div className="jam-store-overlay" onClick={onClose}>
        <div className="jam-store" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="jam-store-header">
            <div className="store-header-left">
              <h2 className="jam-store-title">📦 Panda Store</h2>
              <span className="store-balance">
                💰 {userPcBalance.toLocaleString()} PC
              </span>
            </div>
            <button className="jam-store-close" onClick={onClose}>
              ×
            </button>
          </div>

          {/* Search */}
          <div className="store-search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar plugins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="store-search-input"
            />
          </div>

          {/* Filters */}
          <div className="store-filters">
            {[
              { id: "all", label: "🌐 Todos", count: STORE_ITEMS.length },
              {
                id: "panda-factory",
                label: "🐼 Panda Factory",
                count: STORE_ITEMS.filter((i) => i.category === "panda-factory")
                  .length,
              },
              {
                id: "community",
                label: "👥 Community",
                count: STORE_ITEMS.filter((i) => i.category === "community")
                  .length,
              },
              {
                id: "open-source",
                label: "🔓 Open Source",
                count: STORE_ITEMS.filter((i) => i.category === "open-source")
                  .length,
              },
            ].map((cat) => (
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

          {/* Grid */}
          <div className="jam-store-content">
            <div className="jam-store-grid">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`jam-store-card ${item.popular ? "popular" : ""}`}
                >
                  {item.popular && (
                    <span className="card-badge">⭐ Popular</span>
                  )}
                  <div className="jam-store-card-icon">{item.icon}</div>
                  <div className="jam-store-card-name">{item.name}</div>
                  <div className="jam-store-card-desc">{item.description}</div>
                  <div className="jam-store-card-author">{item.author}</div>
                  <div className="jam-store-card-footer">
                    <div className="jam-store-card-price">
                      <span className="price-usd">{formatPrice(item)}</span>
                      {item.price > 0 && (
                        <span className="price-pc">({item.price} PC)</span>
                      )}
                    </div>
                    <button
                      className={`jam-store-card-btn ${item.priceUSD === 0 ? "free" : "paid"}`}
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
                <span>🔍</span>
                <p>Nenhum plugin encontrado</p>
              </div>
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

export default JamStore;
