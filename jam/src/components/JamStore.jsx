import React from 'react';

/**
 * 🐼 Jam Store
 * Marketplace for plugins
 * - Panda Factory (official)
 * - Community Devs (52/48 split)
 * - Open Source (GitHub linked)
 */

// Mock store data (in production: fetch from Firebase)
const STORE_ITEMS = [
  {
    id: 'crm',
    name: 'Panda CRM',
    icon: '📱',
    description: 'Gerencie contatos, leads e vendas',
    price: 0,
    category: 'panda-factory',
    author: 'Panda Factory'
  },
  {
    id: 'trading',
    name: 'Trading Hub',
    icon: '📊',
    description: 'cTrader, sinais e estratégias',
    price: 0,
    category: 'panda-factory',
    author: 'Panda Factory'
  },
  {
    id: 'brain',
    name: 'Panda Brain',
    icon: '🧠',
    description: 'AI assistente multi-modelo',
    price: 0,
    category: 'panda-factory',
    author: 'Panda Factory'
  },
  {
    id: 'social',
    name: 'Social Manager',
    icon: '💬',
    description: 'WhatsApp, Instagram, Twitter',
    price: 100,
    category: 'community',
    author: '@dev_example'
  },
  {
    id: 'analytics',
    name: 'Analytics Pro',
    icon: '📈',
    description: 'Dashboards e relatórios avançados',
    price: 50,
    category: 'community',
    author: '@analytics_dev'
  },
  {
    id: 'theme-dark',
    name: 'Dark Theme Pro',
    icon: '🌙',
    description: 'Tema escuro premium',
    price: 0,
    category: 'open-source',
    author: 'github:user/repo'
  }
];

function JamStore({ onClose, onInstall }) {
  const [filter, setFilter] = React.useState('all');

  const filteredItems = filter === 'all' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(i => i.category === filter);

  return (
    <div className="jam-store-overlay" onClick={onClose}>
      <div className="jam-store" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="jam-store-header">
          <h2 className="jam-store-title">📦 Panda Store</h2>
          <button className="jam-store-close" onClick={onClose}>×</button>
        </div>

        {/* Filters */}
        <div style={{ padding: '12px 24px', display: 'flex', gap: '8px' }}>
          {['all', 'panda-factory', 'community', 'open-source'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 12px',
                background: filter === cat ? '#e94560' : '#2a2a4e',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {cat === 'all' && '🌐 Todos'}
              {cat === 'panda-factory' && '🐼 Panda Factory'}
              {cat === 'community' && '👥 Community'}
              {cat === 'open-source' && '🔓 Open Source'}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="jam-store-content">
          <div className="jam-store-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="jam-store-card">
                <div className="jam-store-card-icon">{item.icon}</div>
                <div className="jam-store-card-name">{item.name}</div>
                <div className="jam-store-card-desc">{item.description}</div>
                <div className="jam-store-card-footer">
                  <span className="jam-store-card-price">
                    {item.price === 0 ? 'Grátis' : `${item.price} PC`}
                  </span>
                  <button 
                    className="jam-store-card-btn"
                    onClick={() => onInstall(item)}
                  >
                    Instalar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JamStore;
