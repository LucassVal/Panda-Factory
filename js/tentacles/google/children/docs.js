/**
 * 🐼 Google Docs Child
 * ====================
 * Operações em Google Docs
 *
 * @version 1.0.0
 * @parent google
 * @scope https://www.googleapis.com/auth/documents
 */

(function (window) {
  "use strict";

  const CHILD_NAME = "Docs";
  const GoogleParent = window.GoogleParent;

  // ==========================================
  // 📝 DOCS API
  // ==========================================
  const DocsAPI = {
    /**
     * Cria documento
     * @param {string} title
     * @returns {Promise<object>}
     */
    async create(title) {
      const result = await window.Panda.callGAS("docs_create", { title });
      return result;
    },

    /**
     * Lê conteúdo de um documento
     * @param {string} docId
     * @returns {Promise<string>} Texto do documento
     */
    async read(docId) {
      const result = await window.Panda.callGAS("docs_read", { docId });
      return result.content || "";
    },

    /**
     * Append texto ao final do documento
     * @param {string} docId
     * @param {string} text
     * @returns {Promise<boolean>}
     */
    async append(docId, text) {
      const result = await window.Panda.callGAS("docs_append", { docId, text });
      return result.success;
    },

    /**
     * Substitui texto no documento
     * @param {string} docId
     * @param {string} searchText
     * @param {string} replaceText
     * @returns {Promise<number>} Número de substituições
     */
    async replace(docId, searchText, replaceText) {
      const result = await window.Panda.callGAS("docs_replace", {
        docId,
        searchText,
        replaceText,
      });
      return result.replacements || 0;
    },

    /**
     * Exporta documento como PDF
     * @param {string} docId
     * @returns {Promise<Blob>}
     */
    async exportPDF(docId) {
      const result = await window.Panda.callGAS("docs_export_pdf", { docId });
      // Converte base64 para Blob
      const byteChars = atob(result.content);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      return new Blob([new Uint8Array(byteNumbers)], {
        type: "application/pdf",
      });
    },
  };

  // ==========================================
  // 🔗 REGISTER WITH PARENT
  // ==========================================
  if (GoogleParent) {
    GoogleParent.registerChild(CHILD_NAME, DocsAPI);
  } else {
    window.PandaDocs = DocsAPI;
  }
})(window);
