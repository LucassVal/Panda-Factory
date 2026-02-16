/**
 * PF i18n — Lightweight Internationalization (v1.0)
 *
 * Supports: pt-BR (default), en, es
 * Uses React context for reactivity.
 * Persists locale in localStorage.
 * Detects browser locale on first visit.
 */
import React, { createContext, useContext, useState, useCallback } from "react";

import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

// Available locales
export const LOCALES = {
  "pt-BR": { label: "PT-BR", flag: "🇧🇷", name: "Português" },
  en: { label: "ENG", flag: "🇺🇸", name: "English" },
  es: { label: "ESP", flag: "🇪🇸", name: "Español" },
};

const LOCALE_DATA = {
  "pt-BR": ptBR,
  en: en,
  es: es,
};

const STORAGE_KEY = "panda_locale";

/**
 * Detect best locale from browser.
 * Falls back to pt-BR.
 */
function detectLocale() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && LOCALE_DATA[saved]) return saved;

  const browserLang = navigator.language || navigator.userLanguage || "pt-BR";
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("en")) return "en";
  return "pt-BR";
}

// --- Context ---

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detectLocale);

  const setLocale = useCallback((newLocale) => {
    if (LOCALE_DATA[newLocale]) {
      setLocaleState(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
      // Emit event so non-React consumers can react
      window.dispatchEvent(
        new CustomEvent("panda-locale-change", { detail: newLocale })
      );
    }
  }, []);

  /**
   * Translation function.
   * Supports dot-notation keys: t("login.tagline")
   * Supports array access: t("login.features") returns the array
   */
  const t = useCallback(
    (key, fallback) => {
      const data = LOCALE_DATA[locale] || LOCALE_DATA["pt-BR"];
      const parts = key.split(".");
      let result = data;
      for (const part of parts) {
        if (result == null) return fallback || key;
        result = result[part];
      }
      return result != null ? result : fallback || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook: useI18n()
 * Returns { locale, setLocale, t }
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for usage outside provider (shouldn't happen, but safe)
    return {
      locale: "pt-BR",
      setLocale: () => {},
      t: (key) => key,
    };
  }
  return ctx;
}

export default { I18nProvider, useI18n, LOCALES };
