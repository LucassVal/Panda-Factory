import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import FOUNDER_PROFILE from "../data/founder-brain.json";

/**
 * 🧠 useFounderBrain — Cognitive Clone System
 *
 * Architecture:
 *   Lucas.json = personality compass (HOW to respond)
 *   Gemini/AI  = knowledge engine (WHAT to respond with)
 *   Combined   = AI with full power + Founder's soul
 *
 * Access model:
 *   Founder → READ + WRITE (brain evolves with every conversation)
 *   Users   → READ-ONLY  (benefit from Founder's personality, but don't pollute DNA)
 *
 * Storage:
 *   Phase 1: localStorage (offline, zero config)
 *   Phase 2: Firebase RTDB /founder/brain (synced across devices)
 *
 * @returns {{ systemPrompt, appendInsight, brain, isFounderBrain }}
 */

const BRAIN_STORAGE_KEY = "panda_founder_brain";
const BRAIN_VERSION = "2.1.0";

/**
 * Default brain — auto-loaded from the full Lucas.json cognitive profile
 * Vite bundles this at build time — no runtime fetch needed
 */
const DEFAULT_BRAIN = {
  _meta: {
    version: BRAIN_VERSION,
    purpose: "MCP Cognitive Clone — personality compass, not a cage",
    source: FOUNDER_PROFILE._meta?.source || "Lucas.json",
  },
  core_identity: {
    name: FOUNDER_PROFILE.system_kernel?.identity_hash
      ? "Lucas Valério"
      : "Founder",
    role: "Founder, Panda Factory",
    style:
      FOUNDER_PROFILE.linguistic_fingerprint?.tone ||
      "Direct, technically precise",
    philosophy:
      FOUNDER_PROFILE.system_kernel?.core_drive ||
      "Build systems that build systems.",
    meta_pattern: FOUNDER_PROFILE.system_kernel?.meta_pattern || "",
    cognitive_architecture:
      FOUNDER_PROFILE.system_kernel?.cognitive_architecture ||
      "Stoic_Rationalist",
  },
  operating_principles: FOUNDER_PROFILE.operating_principles
    ? Object.values(FOUNDER_PROFILE.operating_principles)
    : ["Documentation IS architecture", "Revenue-generating tasks first"],
  forbidden_outputs: FOUNDER_PROFILE.linguistic_fingerprint
    ?.forbidden_outputs || [
    "Victimhood",
    "Panic",
    "Uncertainty",
    "Over-explaining basics",
  ],
  preferred_responses: FOUNDER_PROFILE.linguistic_fingerprint
    ?.preferred_responses || [
    "Tables over paragraphs",
    "Code over explanation",
  ],
  syntax_patterns:
    FOUNDER_PROFILE.linguistic_fingerprint?.syntax_patterns || [],
  active_directives: FOUNDER_PROFILE.active_directives || {},
  business_context: {
    panda_factory:
      FOUNDER_PROFILE.knowledge_graph?.business_ecosystem?.Panda_Factory
        ?.philosophy || "",
    revenue_strategy:
      FOUNDER_PROFILE.knowledge_graph?.business_ecosystem?.Panda_Factory
        ?.revenue_strategy || {},
  },
  clone_instructions: FOUNDER_PROFILE.mcp_clone_instructions || {},
  learned_insights: [],
};

/**
 * Build the system prompt that shapes AI personality
 * Used for ALL users — this is the Founder's voice in the AI
 */
function buildSystemPrompt(brain) {
  const cloneRules = brain.clone_instructions
    ? Object.entries(brain.clone_instructions)
        .map(([k, v]) => `- ${k.replace(/_/g, " ")}: ${v}`)
        .join("\n")
    : "";

  const syntaxPatterns = brain.syntax_patterns?.length
    ? `\n## Communication Patterns:\n${brain.syntax_patterns.map((p) => `- ${p}`).join("\n")}`
    : "";

  return `You are the AI assistant of Panda Factory, created by ${brain.core_identity.name} (${brain.core_identity.role}).
Cognitive Architecture: ${brain.core_identity.cognitive_architecture || "Stoic Rationalist"}.

## Your Personality (from Founder's DNA):
- Communication style: ${brain.core_identity.style}
- Philosophy: ${brain.core_identity.philosophy}
${brain.core_identity.meta_pattern ? `- Meta-pattern: ${brain.core_identity.meta_pattern}` : ""}

## Operating Principles:
${brain.operating_principles.map((p, i) => `${i + 1}. ${p}`).join("\n")}

## Preferred Response Format:
${(brain.preferred_responses || []).map((p) => `- ${p}`).join("\n")}
${syntaxPatterns}

## You must NEVER:
${brain.forbidden_outputs.map((f) => `- ${f}`).join("\n")}

## Clone Instructions (how to act AS the Founder):
${cloneRules}

## Important:
- You are NOT limited to the Founder's knowledge. Use your FULL AI capabilities (search, analysis, code generation, creativity).
- The Founder's personality is your COMPASS, not your CAGE. Think bigger, go further, but speak in his voice.
- Respond in the user's language (PT-BR, EN, or ES based on their messages).
- Be direct. No filler. If the answer is "no", say "no" and explain why in one line.

${
  brain.learned_insights.length > 0
    ? `## Learned Context (${brain.learned_insights.length} insights):\n${brain.learned_insights
        .slice(-20)
        .map((i) => `- [${i.date}] ${i.insight}`)
        .join("\n")}`
    : ""
}`;
}

/**
 * Extract a potential insight from a conversation exchange
 * Only called for Founder conversations
 */
function extractInsight(userMessage, aiResponse) {
  // Simple heuristic: if the Founder corrects the AI, mentions a preference,
  // or makes a decision, capture it
  const markers = [
    { pattern: /não|nunca|never|don't|pare|stop/i, type: "correction" },
    { pattern: /prefiro|prefer|quero|want|sempre|always/i, type: "preference" },
    { pattern: /decisão|decision|decidi|chose|DR-/i, type: "decision" },
    { pattern: /lembre|remember|anota|note that/i, type: "explicit_memory" },
  ];

  for (const marker of markers) {
    if (marker.pattern.test(userMessage)) {
      // Truncate to keep insights compact
      const insight =
        userMessage.length > 200
          ? userMessage.substring(0, 200) + "..."
          : userMessage;
      return {
        date: new Date().toISOString().split("T")[0],
        type: marker.type,
        insight: insight,
        timestamp: Date.now(),
      };
    }
  }

  return null;
}

/**
 * useFounderBrain Hook
 */
export function useFounderBrain() {
  const { isFounder } = useAuth();
  const [brain, setBrain] = useState(null);

  // Load brain from localStorage (Phase 1)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BRAIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Version check — if outdated, merge with defaults
        if (parsed._meta?.version !== BRAIN_VERSION) {
          const merged = {
            ...DEFAULT_BRAIN,
            ...parsed,
            _meta: {
              ...DEFAULT_BRAIN._meta,
              upgraded_from: parsed._meta?.version,
            },
            learned_insights: parsed.learned_insights || [],
          };
          setBrain(merged);
          localStorage.setItem(BRAIN_STORAGE_KEY, JSON.stringify(merged));
        } else {
          setBrain(parsed);
        }
      } else {
        // First load — try to fetch Lucas.json from static assets
        // Fallback to DEFAULT_BRAIN
        setBrain(DEFAULT_BRAIN);
        localStorage.setItem(BRAIN_STORAGE_KEY, JSON.stringify(DEFAULT_BRAIN));
      }
    } catch (e) {
      console.warn(
        "[FounderBrain] Failed to load brain, using defaults:",
        e.message,
      );
      setBrain(DEFAULT_BRAIN);
    }
  }, []);

  /**
   * Get system prompt — available for ALL users
   * This is the Founder's personality injected into every AI call
   */
  const getSystemPrompt = useCallback(() => {
    if (!brain) return "";
    return buildSystemPrompt(brain);
  }, [brain]);

  /**
   * Append insight — FOUNDER ONLY
   * Called after each conversation exchange to evolve the brain
   */
  const appendInsight = useCallback(
    (userMessage, aiResponse) => {
      if (!isFounder || !brain) return;

      const insight = extractInsight(userMessage, aiResponse);
      if (!insight) return;

      const updatedBrain = {
        ...brain,
        learned_insights: [...brain.learned_insights, insight],
      };

      setBrain(updatedBrain);
      localStorage.setItem(BRAIN_STORAGE_KEY, JSON.stringify(updatedBrain));

      console.log(
        `🧠 Brain evolved: +1 insight (${insight.type}) — total: ${updatedBrain.learned_insights.length}`,
      );
    },
    [isFounder, brain],
  );

  /**
   * Seed the brain with the full Lucas.json
   * Called once when Founder first loads (or to reset)
   * FOUNDER ONLY
   */
  const seedBrain = useCallback(
    (fullProfile) => {
      if (!isFounder) return;

      const seeded = {
        _meta: {
          version: BRAIN_VERSION,
          purpose: "MCP Cognitive Clone — personality compass, not a cage",
          seeded_from: "Lucas.json v2.0",
          seeded_at: new Date().toISOString(),
        },
        core_identity: fullProfile.system_kernel
          ? {
              name: "Lucas Valério",
              role: "Founder, Panda Factory",
              style:
                fullProfile.linguistic_fingerprint?.tone ||
                DEFAULT_BRAIN.core_identity.style,
              philosophy:
                fullProfile.system_kernel.core_drive ||
                DEFAULT_BRAIN.core_identity.philosophy,
              meta_pattern: fullProfile.system_kernel.meta_pattern || "",
            }
          : DEFAULT_BRAIN.core_identity,
        operating_principles: fullProfile.operating_principles
          ? Object.values(fullProfile.operating_principles)
          : DEFAULT_BRAIN.operating_principles,
        forbidden_outputs:
          fullProfile.linguistic_fingerprint?.forbidden_outputs ||
          DEFAULT_BRAIN.forbidden_outputs,
        preferred_responses:
          fullProfile.linguistic_fingerprint?.preferred_responses || [],
        learned_insights: fullProfile.learned_insights || [],
      };

      setBrain(seeded);
      localStorage.setItem(BRAIN_STORAGE_KEY, JSON.stringify(seeded));
      console.log("🧠 Brain seeded from Lucas.json");
    },
    [isFounder],
  );

  return {
    brain,
    systemPrompt: getSystemPrompt(),
    appendInsight,
    seedBrain,
    isFounderBrain: isFounder,
    insightCount: brain?.learned_insights?.length || 0,
  };
}

export default useFounderBrain;
