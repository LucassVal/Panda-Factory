/**
 * 🐼 Panda Fabrics - App Initialization
 * Consolidated inline scripts from PandaFactory.html
 * Version: 1.0.0
 */

// ============================================
// 1. LOADING SCREEN LOGIC
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
// 2. SERVICE WORKER REGISTRATION
// ============================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./sw.js")
      .then(function (registration) {
        console.log(
          "🐼 Panda CRM: ServiceWorker registrado:",
          registration.scope,
        );
      })
      .catch(function (err) {
        console.log("❌ ServiceWorker falhou:", err);
      });
  });
}

// ============================================
// 3. THEME MANAGEMENT
// ============================================
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("crmTheme", isDark ? "dark" : "light");

  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
}

// Auto-load saved theme
(function () {
  const saved = localStorage.getItem("crmTheme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = "☀️";
  }
})();

// ============================================
// 4. STATISTICS UPDATE (MVP)
// ============================================
function atualizarEstatisticas() {
  if (!window.clientes) return;

  const total = window.clientes.length;
  const fechados = window.clientes.filter((c) => c.status === "fechado").length;

  const elProspects = document.getElementById("totalProspects");
  const elFechados = document.getElementById("totalFechados");

  if (elProspects) elProspects.innerText = total;
  if (elFechados) elFechados.innerText = fechados;
}

// Polling for MVP
setInterval(atualizarEstatisticas, 2000);

// ============================================
// 5. MODAL PIN/FIX LOGIC
// ============================================
window.pinnedModals = {};

function togglePinModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const isPinned = !!pinnedModals[modalId];
  pinnedModals[modalId] = !isPinned;

  const btnFn = modal.querySelector(".pin-btn");

  if (pinnedModals[modalId]) {
    modal.style.backgroundColor = "transparent";
    modal.style.pointerEvents = "none";

    const content = modal.querySelector(".modal-content");
    if (content) {
      content.style.pointerEvents = "auto";
      content.style.border = "2px solid #3b82f6";
      content.style.boxShadow = "0 0 15px rgba(59, 130, 246, 0.3)";
    }

    if (btnFn) {
      btnFn.innerHTML = "🔒";
      btnFn.title = "Desafixar";
      btnFn.style.background = "#e2e8f0";
    }
  } else {
    modal.style.backgroundColor = "";
    modal.style.pointerEvents = "";

    const content = modal.querySelector(".modal-content");
    if (content) {
      content.style.pointerEvents = "";
      content.style.border = "";
      content.style.boxShadow = "";
    }

    if (btnFn) {
      btnFn.innerHTML = "🔓";
      btnFn.title = "Fixar";
      btnFn.style.background = "transparent";
    }
  }
}

// ============================================
// 6. NATIVE POP-OUT (Picture-in-Picture)
// ============================================
async function togglePopOut(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const content = modal.querySelector(".modal-content");

  if (!window.documentPictureInPicture) {
    alert("Navegador não suporta Pop-out Nativo. Use Chrome/Edge atualizado.");
    return;
  }

  try {
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: content.offsetWidth || 800,
      height: content.offsetHeight || 600,
    });

    // Copy styles to new window
    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join("");
        const style = document.createElement("style");
        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = styleSheet.type;
        link.media = styleSheet.media;
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    });

    pipWindow.document.body.append(content);
    modal.style.display = "none";

    pipWindow.addEventListener("pagehide", () => {
      const modalParams = document.getElementById(modalId);
      if (modalParams) {
        modalParams.style.display = "flex";
        modalParams.appendChild(content);
        pinnedModals[modalId] = false;
        modalParams.style.backgroundColor = "";
        modalParams.style.pointerEvents = "";
        content.style.border = "";
      }
    });
  } catch (err) {
    console.error("Pop-out error:", err);
  }
}

// ============================================
// 7. LANGUAGE SWITCHER
// ============================================
function toggleLangMenu() {
  const dropdown = document.getElementById("langDropdown");
  if (!dropdown) return;

  dropdown.classList.toggle("show");

  document.addEventListener("click", function closeLang(e) {
    if (!e.target.closest(".lang-switcher-wrapper")) {
      dropdown.classList.remove("show");
      document.removeEventListener("click", closeLang);
    }
  });
}

function changeLanguage(lang) {
  const btn = document.getElementById("langBtn");
  const map = { pt: "🇧🇷", en: "🇺🇸", es: "🇪🇸" };
  if (btn) btn.innerHTML = `<span style="font-size: 16px;">${map[lang]}</span>`;
  console.log("Language changed to:", lang);
}

// ============================================
// 8. SETTINGS MODAL LOGIC
// ============================================
function mudarSecaoSettings(sectionId) {
  document.querySelectorAll(".settings-nav-item").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-section") === sectionId) {
      item.classList.add("active");
    }
  });

  document.querySelectorAll(".settings-section").forEach((sec) => {
    sec.style.display = "none";
  });

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
}

// ============================================
// 9. WINDOW CLICK HANDLER
// ============================================
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    const modalId = event.target.id;
    if (pinnedModals && pinnedModals[modalId]) return;
    if (typeof fecharModal === "function") fecharModal();
  }

  if (event.target.id === "omni-overlay") {
    if (typeof toggleOmniBar === "function") toggleOmniBar();
  }
};

console.log("🐼 pf.app-init.js loaded v1.0.0");
