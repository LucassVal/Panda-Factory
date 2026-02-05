/**
 * 🛒 MedusaJS Connector - Panda Factory
 * ==================================================
 * Connector para integração com MedusaJS (e-commerce headless).
 * Traduz produtos Medusa → Panda Product Format.
 *
 * @author Panda Factory
 * @version 1.0.0
 * @see https://medusajs.com/
 */

(function (window) {
  "use strict";

  /**
   * @typedef {Object} PandaProduct
   * @property {string} id - ID único no formato "source:originalId"
   * @property {string} name - Nome do produto
   * @property {number} price - Preço em Panda Coins
   * @property {string} currency - Moeda (sempre 'PC')
   * @property {string} image - URL da thumbnail
   * @property {string} source - Origem ('medusa', 'steam', 'unreal', etc)
   * @property {object} metadata - Dados extras da fonte original
   */

  class MedusaConnector {
    /**
     * @param {string} backendUrl - URL do backend MedusaJS
     * @param {object} options - { apiKey, region }
     */
    constructor(backendUrl, options = {}) {
      this.url = backendUrl.replace(/\/$/, ""); // Remove trailing slash
      this.apiKey = options.apiKey || null;
      this.region = options.region || "default";
      this.type = "connector";
      this.source = "medusa";

      console.log(`%c[MedusaConnector] Initialized`, "color: #9b59b6", {
        url: this.url,
      });
    }

    /**
     * Traduz produto Medusa → Panda Product Format
     * @param {object} medusaProduct
     * @returns {PandaProduct}
     */
    _translateProduct(p) {
      const variant = p.variants?.[0];
      const price =
        variant?.prices?.find((pr) => pr.currency_code === "brl") ||
        variant?.prices?.[0];

      return {
        id: `medusa:${p.id}`,
        name: p.title,
        description: p.description || "",
        price: price ? price.amount / 100 : 0, // Medusa usa centavos
        currency: "PC",
        image: p.thumbnail || p.images?.[0]?.url || "",
        source: "medusa",
        category: p.collection?.title || "general",
        tags: p.tags?.map((t) => t.value) || [],
        inStock: variant?.inventory_quantity > 0,
        metadata: {
          originalId: p.id,
          handle: p.handle,
          variants: p.variants?.length || 1,
          createdAt: p.created_at,
        },
      };
    }

    /**
     * Busca produtos do MedusaJS
     * @param {object} options - { category, limit, offset }
     * @returns {Promise<PandaProduct[]>}
     */
    async getProducts(options = {}) {
      const params = new URLSearchParams({
        limit: options.limit || 20,
        offset: options.offset || 0,
      });

      if (options.category) {
        params.append("collection_id", options.category);
      }

      try {
        const res = await fetch(`${this.url}/store/products?${params}`);
        const data = await res.json();

        return (data.products || []).map((p) => this._translateProduct(p));
      } catch (error) {
        console.error("[MedusaConnector] getProducts failed:", error);
        return [];
      }
    }

    /**
     * Busca produto único
     * @param {string} productId - ID no formato "medusa:xxx"
     * @returns {Promise<PandaProduct|null>}
     */
    async getProduct(productId) {
      const medusaId = productId.replace("medusa:", "");

      try {
        const res = await fetch(`${this.url}/store/products/${medusaId}`);
        const data = await res.json();

        return data.product ? this._translateProduct(data.product) : null;
      } catch (error) {
        console.error("[MedusaConnector] getProduct failed:", error);
        return null;
      }
    }

    /**
     * Cria carrinho e adiciona items
     * @param {Array<{productId: string, quantity: number}>} items
     * @returns {Promise<{cartId: string, total: number}>}
     */
    async createCart(items) {
      try {
        // Cria carrinho
        const cartRes = await fetch(`${this.url}/store/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ region_id: this.region }),
        });
        const { cart } = await cartRes.json();

        // Adiciona items
        for (const item of items) {
          const medusaId = item.productId.replace("medusa:", "");
          // Busca variant_id
          const product = await this.getProduct(item.productId);
          const variantId = product?.metadata?.variants?.[0]?.id;

          if (variantId) {
            await fetch(`${this.url}/store/carts/${cart.id}/line-items`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                variant_id: variantId,
                quantity: item.quantity,
              }),
            });
          }
        }

        return {
          cartId: cart.id,
          total: cart.total / 100,
        };
      } catch (error) {
        console.error("[MedusaConnector] createCart failed:", error);
        throw error;
      }
    }

    /**
     * Processa checkout (envia para Medusa)
     * @param {string} cartId
     * @param {object} paymentInfo - { pandaTxId }
     * @returns {Promise<{orderId: string, status: string}>}
     */
    async checkout(cartId, paymentInfo) {
      console.log(`[MedusaConnector] Checkout cart: ${cartId}`, paymentInfo);

      // Em produção: Completa payment session no Medusa
      // Por agora: Mock
      return {
        orderId: `order_${Date.now()}`,
        status: "completed",
        pandaTxId: paymentInfo.pandaTxId,
      };
    }

    /**
     * Verifica conexão com backend
     * @returns {Promise<boolean>}
     */
    async healthCheck() {
      try {
        const res = await fetch(`${this.url}/store/products?limit=1`);
        return res.ok;
      } catch {
        return false;
      }
    }
  }

  // Exporta para window
  window.MedusaConnector = MedusaConnector;

  // Registra como Panda Connector (se SDK disponível)
  if (window.Panda) {
    window.Panda._connectors = window.Panda._connectors || {};
    window.Panda._connectors.medusa = MedusaConnector;
    console.log("%c[Panda] MedusaConnector registered", "color: #00d4aa");
  }
})(window);
