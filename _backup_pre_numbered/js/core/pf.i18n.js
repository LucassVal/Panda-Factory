/**
 * 🐼 Panda i18n - Internationalization System
 * Supports: PT, ES, EN
 */
window.PandaI18n = {
  currentLang: "pt",

  translations: {
    pt: {
      // Settings Sections
      "settings.profile": "Perfil",
      "settings.appearance": "Aparência",
      "settings.notifications": "Notificações",
      "settings.ai": "Configurações de IA",
      "settings.wallet": "Carteira",
      "settings.performance": "Performance",
      "settings.security": "Segurança",
      "settings.integrations": "Integrações",
      "settings.developer": "Desenvolvedor",
      "settings.about": "Sobre",

      // Profile
      "profile.title": "Perfil",
      "profile.desc": "Gerencie suas informações pessoais",
      "profile.username": "Nome de usuário",
      "profile.email": "Email",
      "profile.role": "Função",
      "profile.edit": "Editar",

      // Appearance
      "appearance.title": "Aparência",
      "appearance.desc": "Personalize o visual do sistema",
      "appearance.theme": "Tema",
      "appearance.theme.desc": "Alternar entre modo claro e escuro",
      "appearance.accent": "Cor de Destaque",
      "appearance.language": "Idioma",
      "appearance.language.desc": "Selecione seu idioma preferido",

      // Notifications
      "notifications.title": "Notificações",
      "notifications.desc": "Gerencie suas preferências de notificação",
      "notifications.push": "Notificações Push",
      "notifications.push.desc": "Receba notificações no navegador",
      "notifications.email": "Alertas por Email",
      "notifications.email.desc": "Receba atualizações importantes por email",
      "notifications.sound": "Efeitos Sonoros",
      "notifications.sound.desc": "Reproduzir sons para notificações",

      // AI Settings
      "ai.title": "Configurações de IA",
      "ai.desc": "Configure suas preferências de assistente IA",
      "ai.model": "Modelo Padrão",
      "ai.model.desc": "Escolha seu modelo de IA preferido",
      "ai.tokens": "Limite de Tokens",
      "ai.tokens.desc": "Máximo de tokens por requisição",
      "ai.suggest": "Auto-Sugestão",
      "ai.suggest.desc": "Sugestões de IA enquanto digita",

      // Wallet
      "wallet.title": "Carteira",
      "wallet.desc": "Gerencie seu saldo de Panda Coins",
      "wallet.balance": "Saldo Disponível",
      "wallet.recharge": "+ Recarregar",
      "wallet.today": "Gastos Hoje",
      "wallet.savings": "Economia com GPU",
      "wallet.history": "Histórico de Transações",
      "wallet.viewall": "Ver Tudo",

      // Performance
      "performance.title": "Performance",
      "performance.desc": "Otimize o desempenho do sistema",
      "performance.gpu": "Aceleração GPU",
      "performance.gpu.desc": "Use GPU local para processamento de IA",
      "performance.gpu.status": "Status da GPU",
      "performance.cache": "Controles de Cache",
      "performance.cache.desc": "Gerencie o armazenamento de cache local",
      "performance.clear": "Limpar Cache",
      "performance.optimize": "Otimizar",

      // Security
      "security.title": "Segurança",
      "security.desc": "Proteja sua conta",
      "security.2fa": "Autenticação de Dois Fatores",
      "security.2fa.desc": "Adicione uma camada extra de segurança",
      "security.sessions": "Sessões Ativas",
      "security.sessions.desc": "Gerencie dispositivos conectados",
      "security.password": "Alterar Senha",
      "security.password.desc": "Atualize a senha da sua conta",
      "security.manage": "Gerenciar",
      "security.change": "Alterar",

      // Integrations
      "integrations.title": "Integrações",
      "integrations.desc": "Conecte serviços externos",
      "integrations.firebase": "Firebase",
      "integrations.firebase.desc":
        "Banco de dados e autenticação em tempo real",
      "integrations.agent": "Panda Agent (Rust)",
      "integrations.agent.desc": "Processamento GPU local",
      "integrations.mcp": "Servidores MCP",
      "integrations.mcp.desc": "Model Context Protocol",
      "integrations.configure": "Configurar",
      "integrations.connected": "Conectado",
      "integrations.disconnected": "Desconectado",

      // Developer
      "developer.title": "Desenvolvedor",
      "developer.desc": "Opções avançadas para desenvolvedores",
      "developer.debug": "Modo Debug",
      "developer.debug.desc": "Habilitar logs detalhados",
      "developer.api": "Status da API",
      "developer.tokens": "Tokens de API",
      "developer.tokens.desc": "Gerencie seus tokens de acesso",
      "developer.console": "Abrir Console",
      "developer.console.desc": "Console e testes de desenvolvedor",
      "developer.view": "Ver Tokens",
      "developer.open": "Abrir",

      // About
      "about.title": "Sobre",
      "about.desc": "Informações do sistema",
      "about.version": "Versão",
      "about.sdk": "Versão do SDK",
      "about.design": "Design System",
      "about.license": "Licença",
      "about.viewlicense": "Ver Licença",
      "about.tagline": "Construindo o Solo do Desenvolvedor",

      // Common
      "common.active": "Ativo",
      "common.inactive": "Inativo",
      "common.online": "Online",
      "common.offline": "Offline",
      "common.ok": "OK",
      "common.cancel": "Cancelar",
      "common.save": "Salvar",
      "common.close": "Fechar",
    },

    en: {
      // Settings Sections
      "settings.profile": "Profile",
      "settings.appearance": "Appearance",
      "settings.notifications": "Notifications",
      "settings.ai": "AI Settings",
      "settings.wallet": "Wallet",
      "settings.performance": "Performance",
      "settings.security": "Security",
      "settings.integrations": "Integrations",
      "settings.developer": "Developer",
      "settings.about": "About",

      // Profile
      "profile.title": "Profile",
      "profile.desc": "Manage your personal information",
      "profile.username": "Username",
      "profile.email": "Email",
      "profile.role": "Role",
      "profile.edit": "Edit",

      // Appearance
      "appearance.title": "Appearance",
      "appearance.desc": "Customize the look and feel",
      "appearance.theme": "Theme",
      "appearance.theme.desc": "Switch between light and dark mode",
      "appearance.accent": "Accent Color",
      "appearance.language": "Language",
      "appearance.language.desc": "Select your preferred language",

      // Notifications
      "notifications.title": "Notifications",
      "notifications.desc": "Manage your notification preferences",
      "notifications.push": "Push Notifications",
      "notifications.push.desc": "Receive browser notifications",
      "notifications.email": "Email Alerts",
      "notifications.email.desc": "Receive important updates via email",
      "notifications.sound": "Sound Effects",
      "notifications.sound.desc": "Play sounds for notifications",

      // AI Settings
      "ai.title": "AI Settings",
      "ai.desc": "Configure your AI assistant preferences",
      "ai.model": "Default Model",
      "ai.model.desc": "Choose your preferred AI model",
      "ai.tokens": "Token Limit",
      "ai.tokens.desc": "Maximum tokens per request",
      "ai.suggest": "Auto-Suggest",
      "ai.suggest.desc": "AI suggestions while typing",

      // Wallet
      "wallet.title": "Wallet",
      "wallet.desc": "Manage your Panda Coins balance",
      "wallet.balance": "Available Balance",
      "wallet.recharge": "+ Recharge",
      "wallet.today": "Today's Usage",
      "wallet.savings": "GPU Savings",
      "wallet.history": "Transaction History",
      "wallet.viewall": "View All",

      // Performance
      "performance.title": "Performance",
      "performance.desc": "Optimize system performance",
      "performance.gpu": "GPU Acceleration",
      "performance.gpu.desc": "Use local GPU for AI processing",
      "performance.gpu.status": "GPU Status",
      "performance.cache": "Cache Controls",
      "performance.cache.desc": "Manage local cache storage",
      "performance.clear": "Clear Cache",
      "performance.optimize": "Optimize",

      // Security
      "security.title": "Security",
      "security.desc": "Protect your account",
      "security.2fa": "Two-Factor Authentication",
      "security.2fa.desc": "Add an extra layer of security",
      "security.sessions": "Active Sessions",
      "security.sessions.desc": "Manage logged-in devices",
      "security.password": "Change Password",
      "security.password.desc": "Update your account password",
      "security.manage": "Manage",
      "security.change": "Change",

      // Integrations
      "integrations.title": "Integrations",
      "integrations.desc": "Connect external services",
      "integrations.firebase": "Firebase",
      "integrations.firebase.desc": "Real-time database & auth",
      "integrations.agent": "Panda Agent (Rust)",
      "integrations.agent.desc": "Local GPU processing",
      "integrations.mcp": "MCP Servers",
      "integrations.mcp.desc": "Model Context Protocol",
      "integrations.configure": "Configure",
      "integrations.connected": "Connected",
      "integrations.disconnected": "Disconnected",

      // Developer
      "developer.title": "Developer",
      "developer.desc": "Advanced developer options",
      "developer.debug": "Debug Mode",
      "developer.debug.desc": "Enable verbose logging",
      "developer.api": "API Status",
      "developer.tokens": "API Tokens",
      "developer.tokens.desc": "Manage your API access tokens",
      "developer.console": "Open Console",
      "developer.console.desc": "Developer console & testing",
      "developer.view": "View Tokens",
      "developer.open": "Open",

      // About
      "about.title": "About",
      "about.desc": "System information",
      "about.version": "Version",
      "about.sdk": "SDK Version",
      "about.design": "Design System",
      "about.license": "License",
      "about.viewlicense": "View License",
      "about.tagline": "Building the Developer Soil",

      // Common
      "common.active": "Active",
      "common.inactive": "Inactive",
      "common.online": "Online",
      "common.offline": "Offline",
      "common.ok": "OK",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.close": "Close",
    },

    es: {
      // Settings Sections
      "settings.profile": "Perfil",
      "settings.appearance": "Apariencia",
      "settings.notifications": "Notificaciones",
      "settings.ai": "Config. de IA",
      "settings.wallet": "Billetera",
      "settings.performance": "Rendimiento",
      "settings.security": "Seguridad",
      "settings.integrations": "Integraciones",
      "settings.developer": "Desarrollador",
      "settings.about": "Acerca de",

      // Profile
      "profile.title": "Perfil",
      "profile.desc": "Gestiona tu información personal",
      "profile.username": "Nombre de usuario",
      "profile.email": "Correo electrónico",
      "profile.role": "Rol",
      "profile.edit": "Editar",

      // Appearance
      "appearance.title": "Apariencia",
      "appearance.desc": "Personaliza el aspecto del sistema",
      "appearance.theme": "Tema",
      "appearance.theme.desc": "Cambiar entre modo claro y oscuro",
      "appearance.accent": "Color de Acento",
      "appearance.language": "Idioma",
      "appearance.language.desc": "Selecciona tu idioma preferido",

      // Notifications
      "notifications.title": "Notificaciones",
      "notifications.desc": "Gestiona tus preferencias de notificación",
      "notifications.push": "Notificaciones Push",
      "notifications.push.desc": "Recibe notificaciones en el navegador",
      "notifications.email": "Alertas por Email",
      "notifications.email.desc":
        "Recibe actualizaciones importantes por email",
      "notifications.sound": "Efectos de Sonido",
      "notifications.sound.desc": "Reproducir sonidos para notificaciones",

      // AI Settings
      "ai.title": "Configuración de IA",
      "ai.desc": "Configura las preferencias de tu asistente IA",
      "ai.model": "Modelo Predeterminado",
      "ai.model.desc": "Elige tu modelo de IA preferido",
      "ai.tokens": "Límite de Tokens",
      "ai.tokens.desc": "Máximo de tokens por solicitud",
      "ai.suggest": "Auto-Sugerencia",
      "ai.suggest.desc": "Sugerencias de IA mientras escribes",

      // Wallet
      "wallet.title": "Billetera",
      "wallet.desc": "Gestiona tu saldo de Panda Coins",
      "wallet.balance": "Saldo Disponible",
      "wallet.recharge": "+ Recargar",
      "wallet.today": "Uso de Hoy",
      "wallet.savings": "Ahorro con GPU",
      "wallet.history": "Historial de Transacciones",
      "wallet.viewall": "Ver Todo",

      // Performance
      "performance.title": "Rendimiento",
      "performance.desc": "Optimiza el rendimiento del sistema",
      "performance.gpu": "Aceleración GPU",
      "performance.gpu.desc": "Usa GPU local para procesamiento de IA",
      "performance.gpu.status": "Estado de GPU",
      "performance.cache": "Control de Caché",
      "performance.cache.desc": "Gestiona el almacenamiento de caché local",
      "performance.clear": "Limpiar Caché",
      "performance.optimize": "Optimizar",

      // Security
      "security.title": "Seguridad",
      "security.desc": "Protege tu cuenta",
      "security.2fa": "Autenticación de Dos Factores",
      "security.2fa.desc": "Añade una capa extra de seguridad",
      "security.sessions": "Sesiones Activas",
      "security.sessions.desc": "Gestiona dispositivos conectados",
      "security.password": "Cambiar Contraseña",
      "security.password.desc": "Actualiza la contraseña de tu cuenta",
      "security.manage": "Gestionar",
      "security.change": "Cambiar",

      // Integrations
      "integrations.title": "Integraciones",
      "integrations.desc": "Conecta servicios externos",
      "integrations.firebase": "Firebase",
      "integrations.firebase.desc":
        "Base de datos y autenticación en tiempo real",
      "integrations.agent": "Panda Agent (Rust)",
      "integrations.agent.desc": "Procesamiento GPU local",
      "integrations.mcp": "Servidores MCP",
      "integrations.mcp.desc": "Model Context Protocol",
      "integrations.configure": "Configurar",
      "integrations.connected": "Conectado",
      "integrations.disconnected": "Desconectado",

      // Developer
      "developer.title": "Desarrollador",
      "developer.desc": "Opciones avanzadas para desarrolladores",
      "developer.debug": "Modo Debug",
      "developer.debug.desc": "Habilitar logs detallados",
      "developer.api": "Estado de API",
      "developer.tokens": "Tokens de API",
      "developer.tokens.desc": "Gestiona tus tokens de acceso",
      "developer.console": "Abrir Consola",
      "developer.console.desc": "Consola y pruebas de desarrollador",
      "developer.view": "Ver Tokens",
      "developer.open": "Abrir",

      // About
      "about.title": "Acerca de",
      "about.desc": "Información del sistema",
      "about.version": "Versión",
      "about.sdk": "Versión del SDK",
      "about.design": "Sistema de Diseño",
      "about.license": "Licencia",
      "about.viewlicense": "Ver Licencia",
      "about.tagline": "Construyendo el Suelo del Desarrollador",

      // Common
      "common.active": "Activo",
      "common.inactive": "Inactivo",
      "common.online": "En línea",
      "common.offline": "Desconectado",
      "common.ok": "OK",
      "common.cancel": "Cancelar",
      "common.save": "Guardar",
      "common.close": "Cerrar",
    },
  },

  // Get translation
  t(key) {
    return (
      this.translations[this.currentLang]?.[key] ||
      this.translations["en"]?.[key] ||
      key
    );
  },

  // Set language
  setLang(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem("pandaLang", lang);
      this.updateUI();
      console.log(`🐼 Language changed to: ${lang}`);
    }
  },

  // Update UI with current language
  updateUI() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = this.t(key);
    });
  },

  // Initialize
  init() {
    const saved = localStorage.getItem("pandaLang");
    if (saved && this.translations[saved]) {
      this.currentLang = saved;
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.substring(0, 2);
      if (this.translations[browserLang]) {
        this.currentLang = browserLang;
      }
    }
    this.updateUI();
  },
};

// Auto-init
document.addEventListener("DOMContentLoaded", () => PandaI18n.init());

console.log("🐼 PandaI18n loaded (PT/EN/ES)");
