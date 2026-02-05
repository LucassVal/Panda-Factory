/**
 * 🐼 Panda Fabrics - Modal Pin & Pop-out Logic
 * Allows modals to be pinned (stay open while using HUD) or popped out (PiP)
 * Version: 1.0.0
 */

(function () {
  "use strict";

  // ==========================================
  // STATE
  // ==========================================
  const pinnedModals = {};

  // ==========================================
  // TOGGLE PIN
  // ==========================================
  function togglePinModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const isPinned = !!pinnedModals[modalId];
    pinnedModals[modalId] = !isPinned;

    const btnFn = modal.querySelector(".pin-btn");
    const content = modal.querySelector(".modal-content");

    if (pinnedModals[modalId]) {
      // ACTIVATE PIN
      modal.style.backgroundColor = "transparent";
      modal.style.pointerEvents = "none";

      if (content) {
        content.style.pointerEvents = "auto";
        content.style.border = "2px solid #3b82f6";
        content.style.boxShadow = "0 0 15px rgba(59, 130, 246, 0.3)";
      }

      if (btnFn) {
        btnFn.innerHTML = "🔒";
        btnFn.title = "Desafixar (Voltar ao modo Modal)";
        btnFn.style.background = "#e2e8f0";
      }
    } else {
      // DEACTIVATE PIN
      modal.style.backgroundColor = "";
      modal.style.pointerEvents = "";

      if (content) {
        content.style.pointerEvents = "";
        content.style.border = "";
        content.style.boxShadow = "";
      }

      if (btnFn) {
        btnFn.innerHTML = "🔓";
        btnFn.title = "Fixar (Permitir uso do HUD)";
        btnFn.style.background = "transparent";
      }
    }
  }

  // ==========================================
  // NATIVE POP-OUT (Picture-in-Picture)
  // ==========================================
  async function togglePopOut(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const content = modal.querySelector(".modal-content");

    if (!window.documentPictureInPicture) {
      alert(
        "Seu navegador não suporta Pop-out Nativo (Document PiP). Use Chrome ou Edge atualizado.",
      );
      return;
    }

    try {
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: content?.offsetWidth || 800,
        height: content?.offsetHeight || 600,
      });

      // Copy styles
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

      // Move content to PiP window
      pipWindow.document.body.append(content);
      modal.style.display = "none";

      // Return content when PiP closes
      pipWindow.addEventListener("pagehide", () => {
        const modalRef = document.getElementById(modalId);
        if (modalRef && content) {
          modalRef.style.display = "flex";
          modalRef.appendChild(content);
          pinnedModals[modalId] = false;
          modalRef.style.backgroundColor = "";
          modalRef.style.pointerEvents = "";
          content.style.border = "";
        }
      });
    } catch (err) {
      console.error("Erro ao abrir Pop-out:", err);
    }
  }

  // ==========================================
  // CLICK OUTSIDE HANDLER
  // ==========================================
  function setupClickOutside() {
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        const modalId = e.target.id;
        if (pinnedModals[modalId]) return;

        if (typeof fecharModal === "function") {
          fecharModal();
        }
      }

      if (e.target.id === "omni-overlay") {
        if (typeof toggleOmniBar === "function") {
          toggleOmniBar();
        }
      }
    });
  }

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    setupClickOutside();
    console.log("📌 PandaModalPin: Initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.PandaModal = {
    pin: togglePinModal,
    popout: togglePopOut,
    isPinned: (id) => !!pinnedModals[id],
  };

  // Legacy compat
  window.togglePinModal = togglePinModal;
  window.togglePopOut = togglePopOut;
})();
