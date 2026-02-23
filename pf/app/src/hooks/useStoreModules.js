import { useState, useEffect, useCallback } from "react";

/**
 * 📦 useStoreModules — Fetch registered modules for Bundle Creator
 *
 * Attempts to load modules from GAS Store API.
 * Falls back to built-in Panda native modules when GAS is unavailable.
 *
 * @reference PF_MEDUSA_REFERENCE.md §10.5 (Casulo/Encapsulado)
 * @ticket #41 — BundleCreator MVP
 */

// ── Built-in Panda native modules (always available, custo zero) ──
const NATIVE_MODULES = [
  {
    id: "@panda/crm",
    name: "Panda CRM",
    icon: "📱",
    category: "productivity",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description: "CRM completo integrado ao ecossistema Panda",
  },
  {
    id: "@panda/brain",
    name: "Panda Brain",
    icon: "🧠",
    category: "ai",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description: "AI multimodal com Gemini — chat, análise, geração",
  },
  {
    id: "@panda/trading",
    name: "Trading Hub",
    icon: "📊",
    category: "trading",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description: "Dashboard trading com sinais e análise técnica",
  },
  {
    id: "@panda/analytics",
    name: "Analytics Dashboard",
    icon: "📈",
    category: "analytics",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description: "Métricas unificadas de todos os módulos",
  },
  {
    id: "@panda/social",
    name: "Social Manager",
    icon: "💬",
    category: "social",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description: "Gestão unificada de redes sociais",
  },
  {
    id: "@panda/store",
    name: "Panda Store",
    icon: "🏪",
    category: "productivity",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description: "Marketplace de módulos e tentáculos",
  },
];

// ── Community mock modules (dev testing) ──
const COMMUNITY_MODULES = [
  {
    id: "@dev1/ifood-connect",
    name: "iFood Connect",
    icon: "🍕",
    category: "automation",
    price_pc: 5000,
    author: { name: "Dev Fulano", namespace: "@dev1" },
    native: false,
    description: "Integração direta com painel iFood",
  },
  {
    id: "@dev2/cardapio-digital",
    name: "Cardápio Digital",
    icon: "📋",
    category: "productivity",
    price_pc: 3000,
    author: { name: "Dev Beltrano", namespace: "@dev2" },
    native: false,
    description: "Cardápio online com QR Code",
  },
  {
    id: "@dev3/whatsapp-bot",
    name: "WhatsApp Bot",
    icon: "💚",
    category: "automation",
    price_pc: 8000,
    author: { name: "Dev Ciclano", namespace: "@dev3" },
    native: false,
    description: "Atendimento automatizado via WhatsApp",
  },
  {
    id: "@dev4/instagram-insights",
    name: "Instagram Insights",
    icon: "📸",
    category: "social",
    price_pc: 4000,
    author: { name: "Dev Silva", namespace: "@dev4" },
    native: false,
    description: "Analytics avançado para Instagram Business",
  },
];

// ── PC ↔ USD conversion (1 PC = R$0.01 ≈ $0.002) ──
export const PC_TO_USD = 0.002;
export const pcToUSD = (pc) => (pc * PC_TO_USD).toFixed(2);

/**
 * @returns {{ modules: Array, loading: boolean, error: string|null, refresh: Function }}
 */
export function useStoreModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try GAS first — will be wired in Phase 4
      if (window.Panda?.callGAS) {
        const result = await window.Panda.callGAS("STORE", "GET_MODULES");
        if (result?.modules?.length > 0) {
          setModules(result.modules);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("📦 useStoreModules: GAS unavailable, using fallback", e);
    }

    // Fallback: native + community mocks
    setModules([...NATIVE_MODULES, ...COMMUNITY_MODULES]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, refresh: fetchModules };
}

export default useStoreModules;
