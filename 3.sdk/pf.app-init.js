/**
 * 🐼 Panda Factory — App Initialization v2.1.0
 * Boot orchestrator: loading screen, theme, component loader, SDK boot.
 *
 * Boot chain:
 *   1. Loading screen appears
 *   2. Saved theme applies
 *   3. DOMContentLoaded fires → Panda.Loader.init() runs boot steps
 *   4. Components load via pf.components.js
 *   5. Panda.emit("app:ready") signals full readiness
 *   6. Loading screen hides
 */

// ============================================
// 1. LOADING SCREEN
// ============================================
window.addEventListener("load", () => {
  const loader = document.getElementById("panda-loading");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 500);
    }, 1000);
  }
});

// ============================================
// 2. THEME MANAGEMENT
// ============================================
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("pandaDarkMode", isDark ? "dark" : "light");

  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  if (window.Panda) Panda.emit("theme:changed", { dark: isDark });
}

// Auto-load saved theme
(function () {
  const saved = localStorage.getItem("pandaDarkMode");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = "☀️";
  }
})();

// ============================================
// 3. WINDOW CLICK HANDLER
// ============================================
window.addEventListener("click", function (event) {
  // Close modals on backdrop click
  if (event.target.classList.contains("modal")) {
    const modalId = event.target.id;
    if (window.pinnedModals && window.pinnedModals[modalId]) return;
    if (typeof fecharModal === "function") fecharModal();
  }

  // Close omnibar overlay
  if (event.target.id === "omni-overlay") {
    if (typeof toggleOmniBar === "function") toggleOmniBar();
  }
});

// ============================================
// 4. BOOT SEQUENCE
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🐼 Boot: DOMContentLoaded — starting boot sequence...");

  // Step 1: Run boot through Panda.Loader (SDK orchestrator)
  if (window.Panda && Panda.Loader && typeof Panda.Loader.init === "function") {
    try {
      await Panda.Loader.init();
      console.log("🐼 Boot: SDK boot sequence complete ✅");
    } catch (err) {
      console.error("🐼 Boot: SDK boot failed:", err);
    }
  } else {
    console.warn("🐼 Boot: Panda.Loader not available — SDK not loaded");
  }

  // Step 2: Signal app ready
  if (window.Panda) {
    Panda.emit("app:ready", { timestamp: Date.now() });
  }

  // Step 3: Hide loading screen (fallback if window.load didn't fire)
  const loader = document.getElementById("panda-loading");
  if (loader && loader.style.display !== "none") {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 500);
  }
});

console.log("🐼 pf.app-init.js loaded v2.1.0");
