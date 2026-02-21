import React, { useState, useRef, useEffect } from "react";
import { useI18n, LOCALES } from "../i18n/i18n.jsx";

/**
 * PFLanguageSelector v1.0 — Status Bar Language Picker
 *
 * Compact dropdown with flags: 🇧🇷 PT-BR | 🇺🇸 ENG | 🇪🇸 ESP
 * Designed to sit in the status bar area.
 */
function PFLanguageSelector() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LOCALES[locale] || LOCALES["pt-BR"];

  return (
    <div className="pf-lang-selector" ref={ref}>
      <button
        className="pf-lang-trigger pf-header-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={`Language: ${current.name}`}
        aria-label={`Current language: ${current.name}. Click to change.`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="pf-lang-flag">{current.flag}</span>
        <span className="pf-lang-code">{current.label}</span>
      </button>

      {isOpen && (
        <div className="pf-lang-dropdown" role="listbox" aria-label="Select language">
          {Object.entries(LOCALES).map(([key, val]) => (
            <button
              key={key}
              className={`pf-lang-option ${key === locale ? "active" : ""}`}
              onClick={() => {
                setLocale(key);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={key === locale}
            >
              <span className="pf-lang-flag">{val.flag}</span>
              <span className="pf-lang-name">{val.name}</span>
              <span className="pf-lang-code">{val.label}</span>
              {key === locale && <span className="pf-lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PFLanguageSelector;
