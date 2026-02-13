import React, { useRef, useCallback } from "react";
import * as FlexLayout from "flexlayout-react";
import "flexlayout-react/style/dark.css";

/**
 * 🪟 PFWindowManager — Multi-window docking system
 *
 * Uses flexlayout-react (MIT, already in package.json)
 * per PF_OPENSOURCE_CATALOG.md §Panda Jam
 *
 * Apps open INSIDE the canvas as dockable/draggable panels.
 * Supports: tabs, splits, maximize, float.
 *
 * @see PF_UI_REFERENCE.md §E.3 Multi-Window
 */

// Default layout: just the canvas
const DEFAULT_LAYOUT = {
  global: {
    tabEnableFloat: true,
    tabSetEnableMaximize: true,
    tabSetEnableDrag: true,
    tabSetMinWidth: 200,
    tabSetMinHeight: 150,
    borderBarSize: 30,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        id: "main",
        weight: 100,
        children: [
          {
            type: "tab",
            id: "canvas",
            name: "CANVAS",
            component: "canvas",
            enableClose: false,
          },
        ],
      },
    ],
  },
};

// App definitions for the factory
const APP_REGISTRY = {
  "google-drive": {
    icon: "📁",
    name: "Google Drive",
    url: "https://drive.google.com/embeddedfolderview?id=root#grid",
  },
  canva: {
    icon: "🎨",
    name: "Canva",
    url: "https://www.canva.com/",
  },
  "founder-dashboard": {
    icon: "🏭",
    name: "Founder Dashboard",
    component: "founder-dashboard",
  },
  "pat-council": {
    icon: "⚖️",
    name: "PAT Council",
    component: "pat-council",
  },
  devtools: {
    icon: "🛠️",
    name: "DevTools",
    component: "devtools",
  },
  settings: {
    icon: "⚙️",
    name: "Settings",
    component: "settings",
  },
  store: {
    icon: "🏪",
    name: "Store",
    component: "store",
  },
  catalog: {
    icon: "📁",
    name: "Catálogo",
    component: "catalog",
  },
  "mining-panel": {
    icon: "⛏️",
    name: "Meu Mining",
    component: "mining-panel",
  },
};

export function PFWindowManager({
  canvasComponent,
  componentFactory,
  onModelChange,
}) {
  const modelRef = useRef(FlexLayout.Model.fromJson(DEFAULT_LAYOUT));
  const layoutRef = useRef(null);

  // Factory: renders the right component for each tab
  const factory = useCallback(
    (node) => {
      const componentType = node.getComponent();
      const config = node.getConfig() || {};

      // Canvas tab
      if (componentType === "canvas") {
        return canvasComponent || <div>Canvas Loading...</div>;
      }

      // iframe-based apps (Google Drive, Canva, etc)
      if (componentType === "iframe") {
        return (
          <iframe
            src={config.url}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "#0a0a1a",
            }}
            title={node.getName()}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        );
      }

      // Delegate to parent factory for React components
      if (componentFactory) {
        return componentFactory(componentType, config, node);
      }

      return <div style={{ padding: 16 }}>Unknown: {componentType}</div>;
    },
    [canvasComponent, componentFactory],
  );

  // Public method: open an app as a new tab
  const openApp = useCallback(
    (appId, extraConfig = {}) => {
      const model = modelRef.current;
      if (!model) return;

      // Check if already open — focus it
      const existingNode = model.getNodeById(appId);
      if (existingNode) {
        model.doAction(FlexLayout.Actions.selectTab(appId));
        return;
      }

      const appDef = APP_REGISTRY[appId] || {};
      const isUrl = !!appDef.url || !!extraConfig.url;

      const newTab = {
        type: "tab",
        id: appId,
        name: `${(appDef.name || extraConfig.name || appId).toUpperCase()}`,
        component: isUrl ? "iframe" : appDef.component || appId,
        config: {
          ...extraConfig,
          url: appDef.url || extraConfig.url,
          appId,
        },
      };

      // Add next to active tabset (fallback to 'main' if none active yet)
      const activeTabset = model.getActiveTabset() || model.getNodeById("main");
      if (activeTabset) {
        model.doAction(
          FlexLayout.Actions.addNode(
            newTab,
            activeTabset.getId(),
            FlexLayout.DockLocation.CENTER,
            -1,
          ),
        );
      }
    },
    [],
  );

  // Public method: close a tab by appId
  const closeApp = useCallback(
    (appId) => {
      const model = modelRef.current;
      if (!model) return;
      const node = model.getNodeById(appId);
      if (node) {
        model.doAction(FlexLayout.Actions.deleteTab(appId));
      }
    },
    [],
  );

  // Expose openApp + closeApp method via ref-like pattern
  React.useEffect(() => {
    // Store on window for global access (matches SDK pattern)
    window.__pfWindowManager = { openApp, closeApp };
    return () => {
      delete window.__pfWindowManager;
    };
  }, [openApp, closeApp]);

  return (
    <FlexLayout.Layout
      ref={layoutRef}
      model={modelRef.current}
      factory={factory}
      onModelChange={onModelChange}
      font={{ size: "13px" }}
    />
  );
}

// Helper: open app from anywhere
export function openAppWindow(appId, config) {
  window.__pfWindowManager?.openApp(appId, config);
}

// Helper: close app tab from anywhere
export function closeAppWindow(appId) {
  window.__pfWindowManager?.closeApp(appId);
}

export default PFWindowManager;
