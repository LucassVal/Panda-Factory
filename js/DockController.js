// ============================================
// MODULAR DOCKS - Universal Controller
// ============================================

// Module Registry (App Dock)
const moduleRegistry = {
  dashboard: () => {
    console.log('📊 Opening Dashboard...');
    window.PandaLoader?.loadModule('dashboard');
  },
  crm: () => {
    console.log('👥 Opening CRM...');
    window.PandaLoader?.loadModule('crm');
  },
  analytics: () => {
    console.log('📈 Opening Analytics...');
    window.PandaLoader?.loadModule('analytics');
  }
};

// DevTool Registry (DevTools Dock)
const devToolRegistry = {
  extensions: () => alert('🧩 Extension Marketplace - Open VSX integration coming soon!'),
  console: () => console.log('💻 Developer Console opened'),
  api: () => alert('🔌 API Tester - Coming soon!'),
  database: () => alert('🗄️ Database Explorer - Coming soon!'),
  editor: () => alert('📝 Code Editor (Monaco) - Coming soon!'),
  ai: () => alert('🤖 AI Assistant Panel - Coming soon!')
};

// Universal Module Opener
window.openModule = function(moduleName) {
  const handler = moduleRegistry[moduleName];
  if (handler) {
    handler();
  } else {
    console.warn`Module "${moduleName}" not found in registry`);
  }
};

// Universal DevTool Opener
window.openDevTool = function(toolName) {
  const handler = devToolRegistry[toolName];
  if (handler) {
    handler();
  } else {
    console.warn(`DevTool "${toolName}" not found in registry`);
  }
};

console.log('✅ Modular Docks initialized');
