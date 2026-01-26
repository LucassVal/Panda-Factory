/**
 * 🐼 Gmail Child
 * ==============
 * Envio de emails via Gmail
 *
 * @version 1.0.0
 * @parent google
 * @scope https://www.googleapis.com/auth/gmail.send
 */

(function (window) {
  "use strict";

  const CHILD_NAME = "Gmail";
  const GoogleParent = window.GoogleParent;

  // ==========================================
  // 📧 GMAIL API
  // ==========================================
  const GmailAPI = {
    /**
     * Envia email
     * @param {object} email
     * @returns {Promise<object>}
     */
    async send(email) {
      const { to, subject, body, html, attachments } = email;

      const result = await window.Panda.callGAS("gmail_send", {
        to,
        subject,
        body,
        html,
        attachments,
      });

      return result;
    },

    /**
     * Envia email usando template
     * @param {string} templateId - ID do template no Drive
     * @param {object} data - Dados para merge
     * @param {string} to - Destinatário
     * @returns {Promise<object>}
     */
    async sendTemplate(templateId, data, to) {
      const result = await window.Panda.callGAS("gmail_send_template", {
        templateId,
        data,
        to,
      });

      return result;
    },

    /**
     * Cria rascunho
     * @param {object} email
     * @returns {Promise<object>}
     */
    async createDraft(email) {
      const result = await window.Panda.callGAS("gmail_draft", email);
      return result;
    },

    /**
     * Lista emails recentes
     * @param {object} options
     * @returns {Promise<Array>}
     */
    async list(options = {}) {
      const { maxResults = 20, query = "" } = options;

      const result = await window.Panda.callGAS("gmail_list", {
        maxResults,
        query,
      });

      return result.messages || [];
    },
  };

  // ==========================================
  // 🔗 REGISTER WITH PARENT
  // ==========================================
  if (GoogleParent) {
    GoogleParent.registerChild(CHILD_NAME, GmailAPI);
  } else {
    window.PandaGmail = GmailAPI;
  }
})(window);
