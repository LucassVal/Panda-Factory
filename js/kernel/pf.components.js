/**
 * Component Loader
 * Responsible for fetching and injecting fixed UI components (Header, Docks, Sidebar)
 */

const COMPONENTS = [
  {
    id: "header-component",
    url: "components/header-status.html",
    target: "#header-container",
  },
  {
    id: "app-dock-component",
    url: "components/app-dock.html",
    target: "#app-dock-container",
  },
  {
    id: "dev-dock-component",
    url: "components/devtools-dock.html",
    target: "#dev-dock-container",
  },
  {
    id: "settings-modal-component",
    url: "components/settings-modal.html",
    target: "#settings-modal-container",
  },
  {
    id: "sidebar-component",
    url: "components/sidebar.html",
    target: "#sidebar-container",
  },
];

async function loadComponents() {
  console.log("🔄 Loading components...");

  for (const comp of COMPONENTS) {
    try {
      const container = document.querySelector(comp.target);
      if (!container) {
        console.warn(
          `Target container ${comp.target} not found for ${comp.id}`,
        );
        continue;
      }

      const response = await fetch(comp.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      container.innerHTML = html;

      // Execute scripts inside the injected HTML (specifically for Sidebar)
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

      console.log(`✅ Loaded ${comp.id}`);
    } catch (err) {
      console.error(`❌ Failed to load ${comp.id}:`, err);
    }
  }

  // Initialize things that depend on components being loaded
  if (window.DockController) window.DockController.init();
}

// Auto-load on DOM Content Ready
document.addEventListener("DOMContentLoaded", loadComponents);
