/**
 * 🐼 Panda Fabrics - Settings Controller
 * Settings modal navigation and GPU toggle logic
 * Version: 1.0.0
 */

(function () {
  "use strict";

  // ==========================================
  // SECTION NAVIGATION
  // ==========================================
  function mudarSecaoSettings(sectionId) {
    // Update sidebar active state
    document.querySelectorAll(".settings-nav-item").forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-section") === sectionId) {
        item.classList.add("active");
      }
    });

    // Hide all sections
    document.querySelectorAll(".settings-section").forEach((sec) => {
      sec.style.display = "none";
    });

    // Show target section with animation
    const target = document.getElementById("settings-" + sectionId);
    if (target) {
      target.style.display = "block";
      target.style.opacity = "0";
      target.style.transform = "translateY(10px)";

      setTimeout(() => {
        target.style.opacity = "1";
        target.style.transform = "translateY(0)";
      }, 50);
    }
  }

  // ==========================================
  // GPU TOGGLE (Mock)
  // ==========================================
  function toggleGPU() {
    const toggle = document.getElementById("gpuToggle");
    if (!toggle) return;

    toggle.classList.toggle("active");
    const isActive = toggle.classList.contains("active");

    const badge = document.getElementById("gpuBadge");
    if (badge) {
      if (isActive) {
        badge.className = "gpu-badge online";
        badge.innerHTML = "<span>⚡</span> RTX 3060 (Simulated)";
      } else {
        badge.className = "gpu-badge offline";
        badge.innerHTML = "<span>⚠️</span> Nenhuma GPU detectada";
      }
    }

    // Update Panda SDK Bridge status
    if (window.Panda?.Bridge) {
      window.Panda.Bridge._mockConnect(isActive);
    }
  }

  // ==========================================
  // OPEN/CLOSE SETTINGS
  // ==========================================
  function abrirSettings() {
    const overlay = document.getElementById("settingsOverlay");
    if (overlay) {
      overlay.classList.add("active");
    }
  }

  function fecharSettings() {
    const overlay = document.getElementById("settingsOverlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
  }

  // ==========================================
  // LANGUAGE SWITCHER
  // ==========================================
  function toggleLangMenu() {
    const dropdown = document.getElementById("langDropdown");
    if (!dropdown) return;

    dropdown.classList.toggle("show");

    const closeLang = (e) => {
      if (!e.target.closest(".lang-switcher-wrapper")) {
        dropdown.classList.remove("show");
        document.removeEventListener("click", closeLang);
      }
    };

    document.addEventListener("click", closeLang);
  }

  function changeLanguage(lang) {
    const btn = document.getElementById("langBtn");
    const map = { pt: "🇧🇷", en: "🇺🇸", es: "🇪🇸" };

    if (btn) {
      btn.innerHTML = `<span style="font-size: 16px;">${map[lang]}</span>`;
    }

    localStorage.setItem("panda_language", lang);
    console.log("🌐 Language changed to:", lang);
  }

  // ==========================================
  // DARK MODE TOGGLE
  // ==========================================
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    const themeIcon = document.getElementById("themeIcon");
    if (themeIcon) {
      themeIcon.textContent = isDark ? "☀️" : "🌙";
    }

    localStorage.setItem("panda_dark_mode", isDark ? "1" : "0");
  }

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    // Restore dark mode preference
    if (localStorage.getItem("panda_dark_mode") === "1") {
      document.body.classList.add("dark-mode");
      const themeIcon = document.getElementById("themeIcon");
      if (themeIcon) themeIcon.textContent = "☀️";
    }

    // Restore language preference
    const savedLang = localStorage.getItem("panda_language");
    if (savedLang) {
      changeLanguage(savedLang);
    }

    console.log("⚙️ PandaSettings: Initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.PandaSettings = {
    open: abrirSettings,
    close: fecharSettings,
    changeSection: mudarSecaoSettings,
    toggleGPU,
    toggleDarkMode,
    changeLanguage,
  };

  // Legacy compat
  window.abrirSettings = abrirSettings;
  window.fecharSettings = fecharSettings;
  window.mudarSecaoSettings = mudarSecaoSettings;
  window.toggleGPU = toggleGPU;
  window.toggleDarkMode = toggleDarkMode;
  window.toggleLangMenu = toggleLangMenu;
  window.changeLanguage = changeLanguage;
})();
