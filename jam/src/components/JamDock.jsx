import React from 'react';

/**
 * 🐼 Jam Dock
 * macOS-style dock at the bottom
 * Uses magnification effect on hover
 */
function JamDock({ onStoreClick, plugins }) {
  // Base dock items
  const dockItems = [
    { id: 'home', icon: '🏠', label: 'Home', action: () => {} },
    { id: 'store', icon: '📦', label: 'Store', action: onStoreClick },
  ];

  // Add installed plugins to dock
  const pluginItems = plugins.map(p => ({
    id: p.id,
    icon: p.icon || '🧩',
    label: p.name,
    action: () => console.log('Open plugin:', p.id)
  }));

  const allItems = [...dockItems, ...pluginItems];

  return (
    <nav className="jam-dock">
      {allItems.map(item => (
        <button
          key={item.id}
          className="jam-dock-item"
          onClick={item.action}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}

export default JamDock;
