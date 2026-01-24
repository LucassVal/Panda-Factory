/**
 * 🐼 PANDA SOCIAL - Twitter/X Hub Plugin
 * =======================================
 * @version 1.0.0
 * @marketplace TRUE
 * @price 2999
 * @requires pf.social-core.js
 */

(function (window) {
  "use strict";

  const PLUGIN_ID = "social-twitter";

  const COSTS = { THREAD: 20, HOOK: 10, REPLY: 2, SPACE: 50 };

  const TwitterHub = {
    id: PLUGIN_ID,
    name: "Twitter/X Hub",
    icon: "🐦",

    async generateThread(topic, tweets = 7) {
      await _charge(COSTS.THREAD, "TW_THREAD");
      return await _brain(`Thread Twitter ${tweets} tweets sobre: ${topic}`);
    },

    async generateViralHook(topic) {
      await _charge(COSTS.HOOK, "TW_HOOK");
      return await _brain(`5 hooks virais Twitter sobre: ${topic}`);
    },

    async generateReply(tweet, tone = "witty") {
      await _charge(COSTS.REPLY, "TW_REPLY");
      return await _brain(`Resposta ${tone} para: "${tweet}"`);
    },

    async summarizeSpace(transcript) {
      await _charge(COSTS.SPACE, "TW_SPACE");
      return await _brain(
        `Resuma este Twitter Space: ${transcript.substring(0, 5000)}`,
      );
    },
  };

  async function _charge(a, r) {
    const res = await window.Panda?.Wallet?.charge(a, r);
    if (!res?.success) throw new Error(`Saldo insuficiente: ${a} PC`);
  }
  async function _brain(p) {
    return (await window.Panda?.Brain?.chat(p))?.text;
  }

  if (window.Panda?.Social)
    window.Panda.Social.registerPlugin(PLUGIN_ID, TwitterHub);
  window.Panda = window.Panda || {};
  window.Panda.Twitter = TwitterHub;
})(window);
