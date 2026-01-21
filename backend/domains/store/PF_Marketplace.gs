/**
 * 🛒 Marketplace Service (GitHub Integration)
 * Transforma o GitHub em um Marketplace Open Source para o Panda Fabrics.
 * 
 * Funcionalidade:
 * 1. Busca repositórios públicos marcados com a topic 'panda-sdk'.
 * 2. Lê o arquivo 'manifest.json' raw do repositório.
 * 3. Lista para o usuário instalar.
 */

var MarketplaceService = {
  
  /**
   * Busca SDKs disponíveis na comunidade Open Source (GitHub).
   * @return {Array} Lista de módulos encontrados.
   */
  searchCommunitySDKs: function() {
    // Busca repositórios com a tag: panda-sdk
    // Sort: updated (para pegar os mais recentes)
    const query = encodeURIComponent("topic:panda-sdk sort:updated");
    const url = "https://api.github.com/search/repositories?q=" + query;
    
    try {
      const response = UrlFetchApp.fetch(url, {
        headers: { "Accept": "application/vnd.github.v3+json" }
      });
      
      const data = JSON.parse(response.getContentText());
      return data.items.map(this._formatRepoToModule);
      
    } catch (e) {
      console.error("Erro ao buscar no GitHub:", e);
      return [];
    }
  },

  /**
   * Instala um módulo direto do GitHub.
   * (Baixa o .gs e salva no projeto - Simulação)
   */
  installFromUrl: function(rawUrl) {
    const code = UrlFetchApp.fetch(rawUrl).getContentText();
    // Em produção: DriveApp.createFile(...) ou ScriptApp (se API permitir)
    return "Módulo baixado (Simulação). Conteúdo: " + code.substring(0, 50) + "...";
  },

  _formatRepoToModule: function(repo) {
    return {
      id: repo.name,
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      author: repo.owner.login,
      url: repo.html_url,
      // URL crua para baixar o manifesto ou entrypoint principal
      installerUrl: `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/SDK.js`
    };
  }
};

/**
 * Endpoint para o Frontend listar a loja.
 */
function getMarketplaceCatalog() {
  return MarketplaceService.searchCommunitySDKs();
}
