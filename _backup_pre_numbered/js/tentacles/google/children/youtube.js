/**
 * 🐼 YouTube Data Child
 * =====================
 * API do YouTube Data v3
 *
 * @version 1.0.0
 * @parent google
 * @scope https://www.googleapis.com/auth/youtube.readonly
 */

(function (window) {
  "use strict";

  const CHILD_NAME = "YouTube";
  const GoogleParent = window.GoogleParent;

  // ==========================================
  // 📺 YOUTUBE API
  // ==========================================
  const YouTubeAPI = {
    /**
     * Busca vídeos
     * @param {string} query - Termo de busca
     * @param {object} options
     * @returns {Promise<Array>}
     */
    async search(query, options = {}) {
      const { maxResults = 10, type = "video" } = options;

      const result = await window.Panda.callGAS("youtube_search", {
        query,
        maxResults,
        type,
      });

      return result.items || [];
    },

    /**
     * Obtém detalhes de um vídeo
     * @param {string} videoId
     * @returns {Promise<object>}
     */
    async getVideo(videoId) {
      const result = await window.Panda.callGAS("youtube_video", { videoId });
      return result;
    },

    /**
     * Lista vídeos de um canal
     * @param {string} channelId
     * @param {number} maxResults
     * @returns {Promise<Array>}
     */
    async listChannelVideos(channelId, maxResults = 20) {
      const result = await window.Panda.callGAS("youtube_channel_videos", {
        channelId,
        maxResults,
      });

      return result.items || [];
    },

    /**
     * Obtém estatísticas de um canal
     * @param {string} channelId
     * @returns {Promise<object>}
     */
    async getChannelStats(channelId) {
      const result = await window.Panda.callGAS("youtube_channel_stats", {
        channelId,
      });

      return result;
    },

    /**
     * Lista comentários de um vídeo
     * @param {string} videoId
     * @param {number} maxResults
     * @returns {Promise<Array>}
     */
    async listComments(videoId, maxResults = 50) {
      const result = await window.Panda.callGAS("youtube_comments", {
        videoId,
        maxResults,
      });

      return result.items || [];
    },

    /**
     * Obtém transcrição (legendas) de um vídeo
     * @param {string} videoId
     * @param {string} lang - Idioma (default: 'pt')
     * @returns {Promise<string>}
     */
    async getTranscript(videoId, lang = "pt") {
      const result = await window.Panda.callGAS("youtube_transcript", {
        videoId,
        lang,
      });

      return result.transcript || "";
    },
  };

  // ==========================================
  // 🔗 REGISTER WITH PARENT
  // ==========================================
  if (GoogleParent) {
    GoogleParent.registerChild(CHILD_NAME, YouTubeAPI);
  } else {
    window.PandaYouTube = YouTubeAPI;
  }
})(window);
