/**
 * 📦 SDK Registry (The "Store" Handler)
 * 
 * Este arquivo gerencia a carga e disponibilidade de SDKs no sistema.
 * Ele prepara o sistema para "receber" novos módulos.
 */

var SDKContext = {
  plugins: {},
  
  /**
   * Registra um novo SDK no sistema.
   * Chamado pelo próprio arquivo do SDK quando ele é carregado (Pattern: Self-Registration).
   */
  register: function(id, sdkInstance) {
    if (this.plugins[id]) {
      console.warn('⚠️ SDK substituído: ' + id);
    }
    this.plugins[id] = sdkInstance;
    console.log('✅ SDK Carregado: ' + id);
  },

  /**
   * Obtém um SDK para uso.
   * Ex: SDKContext.use('STRIPE').charge(...)
   */
  use: function(id) {
    if (!this.plugins[id]) {
      throw new Error("❌ SDK não instalado ou não encontrado: " + id);
    }
    return this.plugins[id];
  },

  /**
   * Lista todos os SDKs instalados (Para mostrar na Loja/Config).
   */
  listInstalled: function() {
    return Object.keys(this.plugins);
  }
};

/**
 * Hook para "Instalar" via código (se necessário upload dinâmico).
 * Em GAS, isso geralmente é feito via Library ID, mas aqui simulamos localmente.
 */
function installSDK(scriptContent) {
  // Em um ambiente Node.js, usaríamos eval() ou require().
  // No Apps Script, os arquivos .gs são carregados globalmente, 
  // então basta soltar o arquivo na pasta /sdks.
  return "Para instalar, adicione o arquivo .gs na pasta backend/sdks";
}
