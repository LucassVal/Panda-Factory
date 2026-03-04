import { useState, useEffect, useCallback } from "react";
import React from "react";
import { RiOrganizationChart } from "react-icons/ri";
import { TbMessageChatbot } from "react-icons/tb";
import { PiChartLineUpBold } from "react-icons/pi";
import { BsRobot } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";

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
    id: "crm",
    name: "Panda CRM",
    icon: <RiOrganizationChart size={24} color="#818cf8" />,
    category: "productivity",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description:
      "Pipeline Kanban, Agenda e Estoque consolidados num único hub corporativo",
  },
  {
    id: "social",
    name: "Social Hub",
    icon: <TbMessageChatbot size={24} color="#34d399" />,
    category: "social",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description:
      "Caixa de entrada unificada (WhatsApp, Instagram, FB) com respostas via Inteligência Artificial",
  },
  {
    id: "@panda/brain",
    name: "Panda Brain",
    icon: <BsRobot size={24} color="#a78bfa" />,
    category: "ai",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description:
      "AI multimodal com Gemini — controle central da inteligência autônoma",
  },
  {
    id: "@panda/trading",
    name: "Trading Hub",
    icon: <AiOutlineStock size={24} color="#fbbf24" />,
    category: "trading",
    price_pc: 0,
    author: { name: "Panda Core", namespace: "@panda" },
    native: true,
    description:
      "Dashboard trading com sinais, análise técnica e multi-timeframes",
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
