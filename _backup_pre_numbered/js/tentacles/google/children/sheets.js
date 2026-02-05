/**
 * 🐼 Google Sheets Child
 * ======================
 * Operações de planilha no Google Sheets
 *
 * @version 1.0.0
 * @parent google
 * @scope https://www.googleapis.com/auth/spreadsheets
 */

(function (window) {
  "use strict";

  const CHILD_NAME = "Sheets";
  const GoogleParent = window.GoogleParent;

  // ==========================================
  // 📊 SHEETS API
  // ==========================================
  const SheetsAPI = {
    /**
     * Lê dados de uma planilha
     * @param {string} spreadsheetId - ID da planilha
     * @param {string} range - Range A1 notation (ex: 'Sheet1!A1:D10')
     * @returns {Promise<Array<Array>>} Dados como matriz 2D
     */
    async read(spreadsheetId, range) {
      const result = await window.Panda.callGAS("sheets_read", {
        spreadsheetId,
        range,
      });

      return result.values || [];
    },

    /**
     * Escreve dados em uma planilha
     * @param {string} spreadsheetId - ID da planilha
     * @param {string} range - Range A1 notation
     * @param {Array<Array>} values - Dados como matriz 2D
     * @returns {Promise<object>} Resultado da operação
     */
    async write(spreadsheetId, range, values) {
      const result = await window.Panda.callGAS("sheets_write", {
        spreadsheetId,
        range,
        values,
      });

      return result;
    },

    /**
     * Append dados ao final de uma planilha
     * @param {string} spreadsheetId - ID da planilha
     * @param {string} range - Range A1 notation (a linha é ignorada)
     * @param {Array<Array>} values - Dados a adicionar
     * @returns {Promise<object>}
     */
    async append(spreadsheetId, range, values) {
      const result = await window.Panda.callGAS("sheets_append", {
        spreadsheetId,
        range,
        values,
      });

      return result;
    },

    /**
     * Limpa um range
     * @param {string} spreadsheetId - ID da planilha
     * @param {string} range - Range A1 notation
     * @returns {Promise<boolean>}
     */
    async clear(spreadsheetId, range) {
      const result = await window.Panda.callGAS("sheets_clear", {
        spreadsheetId,
        range,
      });

      return result.success;
    },

    /**
     * Cria nova planilha
     * @param {string} title - Título da nova planilha
     * @returns {Promise<object>} Metadados (contém spreadsheetId)
     */
    async create(title) {
      const result = await window.Panda.callGAS("sheets_create", {
        title,
      });

      return result;
    },

    /**
     * Lista abas de uma planilha
     * @param {string} spreadsheetId
     * @returns {Promise<Array>} Lista de sheets/abas
     */
    async listSheets(spreadsheetId) {
      const result = await window.Panda.callGAS("sheets_list_tabs", {
        spreadsheetId,
      });

      return result.sheets || [];
    },

    /**
     * Adiciona nova aba
     * @param {string} spreadsheetId
     * @param {string} title - Nome da nova aba
     * @returns {Promise<object>}
     */
    async addSheet(spreadsheetId, title) {
      const result = await window.Panda.callGAS("sheets_add_tab", {
        spreadsheetId,
        title,
      });

      return result;
    },

    // ==========================================
    // 🔧 HELPERS
    // ==========================================

    /**
     * Converte objeto para array de valores
     * @param {object} obj
     * @param {string[]} keys - Ordem das chaves
     * @returns {Array}
     */
    objectToRow(obj, keys) {
      return keys.map((k) => obj[k] ?? "");
    },

    /**
     * Converte array de valores para objeto
     * @param {Array} row - Linha de dados
     * @param {string[]} headers - Cabeçalhos
     * @returns {object}
     */
    rowToObject(row, headers) {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    },

    /**
     * Converte matriz 2D para array de objetos
     * (primeira linha = headers)
     * @param {Array<Array>} data
     * @returns {Array<object>}
     */
    dataToObjects(data) {
      if (!data || data.length < 2) return [];
      const [headers, ...rows] = data;
      return rows.map((row) => this.rowToObject(row, headers));
    },
  };

  // ==========================================
  // 🔗 REGISTER WITH PARENT
  // ==========================================
  if (GoogleParent) {
    GoogleParent.registerChild(CHILD_NAME, SheetsAPI);
  } else {
    console.warn("[Sheets] GoogleParent not found, registering standalone");
    window.PandaSheets = SheetsAPI;
  }
})(window);
