/**
 * 🐼 Component Loader v2.0
 * Responsible for fetching and injecting fixed UI components (Header, Docks, Sidebar).
 *
 * Paths aligned with numbered folder structure:
 *   4.ui/4.2.components/  → Fixed UI shell components
 *
 * Integration:
 *   - Panda.emit("components:loaded") → Signals all components are ready
 *   - DockController.init()           → Called after components inject
 */

const COMPONENTS = [
  {
    id: "header-component",
    url: "4.ui/4.2.components/Comp_HeaderStatus.html",
    target: "#header-container",
  },
  {
    id: "app-dock-component",
    url: "4.ui/4.2.components/Comp_AppDock.html",
    target: "#app-dock-container",
  },
  {
    id: "dev-dock-component",
    url: "4.ui/4.2.components/Comp_DevDock.html",
    target: "#dev-dock-container",
  },
  {
    id: "settings-modal-component",
    url: "4.ui/Comp_SettingsModal.html",
    target: "#settings-modal-container",
  },
  {
    id: "sidebar-component",
    url: "4.ui/4.2.components/Comp_Sidebar.html",
    target: "#sidebar-container",
  },
  {
    id: "login-overlay-component",
    url: "4.ui/4.2.components/Comp_LoginOverlay.html",
    target: "#login-overlay-container",
  },
];

async function loadComponents() {
  console.log(`🔄 Loading ${COMPONENTS.length} components...`);
  let loaded = 0;
  let failed = 0;

  for (const comp of COMPONENTS) {
    try {
      const container = document.querySelector(comp.target);
      if (!container) {
        console.warn(
          `Target container ${comp.target} not found for ${comp.id}`,
        );
        failed++;
        continue;
      }

      const response = await fetch(comp.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      container.innerHTML = html;

      // Execute scripts inside the injected HTML
      const scripts = container.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value),
        );
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        if (oldScript.parentNode) {
          oldScript.parentNode.replaceChild(newScript, oldScript);
        }
      });

      loaded++;
      console.log(`✅ Loaded ${comp.id}`);
    } catch (err) {
      failed++;
      console.error(`❌ Failed to load ${comp.id}:`, err);
    }
  }

  console.log(`🐼 Components: ${loaded} loaded, ${failed} failed`);

  // Initialize things that depend on components being loaded
  if (window.DockController) window.DockController.init();

  // Signal ready
  if (window.Panda) {
    Panda.emit("components:loaded", {
      loaded,
      failed,
      total: COMPONENTS.length,
    });
  }
}

// Auto-load on DOM Content Ready
document.addEventListener("DOMContentLoaded", loadComponents);
