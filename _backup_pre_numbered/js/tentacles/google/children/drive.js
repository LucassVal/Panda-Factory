/**
 * 🐼 Google Drive Child
 * =====================
 * Operações de arquivo no Google Drive
 *
 * @version 1.0.0
 * @parent google
 * @scope https://www.googleapis.com/auth/drive
 */

(function (window) {
  "use strict";

  const CHILD_NAME = "Drive";
  const GoogleParent = window.GoogleParent;

  // ==========================================
  // 📂 DRIVE API
  // ==========================================
  const DriveAPI = {
    /**
     * Lista arquivos em uma pasta
     * @param {string} folderId - ID da pasta (ou 'root')
     * @param {object} options - Opções de filtro
     * @returns {Promise<Array>} Lista de arquivos
     */
    async list(folderId = "root", options = {}) {
      const { mimeType, maxResults = 100 } = options;

      // Via GAS Backend
      const result = await window.Panda.callGAS("drive_list", {
        folderId,
        mimeType,
        maxResults,
      });

      return result.files || [];
    },

    /**
     * Upload de arquivo
     * @param {File|Blob} file - Arquivo para upload
     * @param {string} folderId - Pasta destino
     * @param {function} onProgress - Callback de progresso
     * @returns {Promise<object>} Metadados do arquivo criado
     */
    async upload(file, folderId = "root", onProgress = null) {
      // Converte para base64
      const base64 = await this._fileToBase64(file);

      // Envia via GAS
      const result = await window.Panda.callGAS("drive_upload", {
        name: file.name,
        mimeType: file.type,
        content: base64,
        folderId,
      });

      if (onProgress) onProgress(100);

      return result;
    },

    /**
     * Download de arquivo
     * @param {string} fileId - ID do arquivo
     * @returns {Promise<Blob>} Conteúdo do arquivo
     */
    async download(fileId) {
      const result = await window.Panda.callGAS("drive_download", {
        fileId,
      });

      // Converte base64 para Blob
      const byteChars = atob(result.content);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      return new Blob([byteArray], { type: result.mimeType });
    },

    /**
     * Cria pasta
     * @param {string} name - Nome da pasta
     * @param {string} parentId - Pasta pai
     * @returns {Promise<object>} Metadados da pasta criada
     */
    async createFolder(name, parentId = "root") {
      const result = await window.Panda.callGAS("drive_create_folder", {
        name,
        parentId,
      });

      return result;
    },

    /**
     * Move arquivo/pasta
     * @param {string} fileId - ID do item
     * @param {string} targetFolderId - Nova pasta
     * @returns {Promise<boolean>}
     */
    async move(fileId, targetFolderId) {
      const result = await window.Panda.callGAS("drive_move", {
        fileId,
        targetFolderId,
      });

      return result.success;
    },

    /**
     * Deleta arquivo (move para lixeira)
     * @param {string} fileId - ID do arquivo
     * @returns {Promise<boolean>}
     */
    async trash(fileId) {
      const result = await window.Panda.callGAS("drive_trash", {
        fileId,
      });

      return result.success;
    },

    /**
     * Busca arquivos
     * @param {string} query - Termo de busca
     * @returns {Promise<Array>}
     */
    async search(query) {
      const result = await window.Panda.callGAS("drive_search", {
        query,
      });

      return result.files || [];
    },

    /**
     * Obtém link de compartilhamento
     * @param {string} fileId - ID do arquivo
     * @param {string} role - 'reader', 'writer', 'owner'
     * @returns {Promise<string>} Link de compartilhamento
     */
    async getShareLink(fileId, role = "reader") {
      const result = await window.Panda.callGAS("drive_share", {
        fileId,
        role,
      });

      return result.shareLink;
    },

    // ==========================================
    // 🔧 HELPERS
    // ==========================================

    /**
     * Converte File para Base64
     * @param {File} file
     * @returns {Promise<string>}
     */
    _fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
    },
  };

  // ==========================================
  // 🔗 REGISTER WITH PARENT
  // ==========================================
  if (GoogleParent) {
    GoogleParent.registerChild(CHILD_NAME, DriveAPI);
  } else {
    console.warn("[Drive] GoogleParent not found, registering standalone");
    window.PandaDrive = DriveAPI;
  }
})(window);
