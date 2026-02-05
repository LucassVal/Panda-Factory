/**
 * 🐼 Panda Fabrics - Dock Drag Controller
 * Makes docks draggable from anywhere on their body
 * Version: 1.0.0
 */

(function () {
  "use strict";

  // ==========================================
  // STATE
  // ==========================================
  let activeDock = null;
  let dragOffset = { x: 0, y: 0 };
  let isDragging = false;

  // ==========================================
  // INIT DRAGGABLE DOCKS
  // ==========================================
  function initDraggableDocks() {
    const docks = document.querySelectorAll(
      ".modular-dock, .app-dock, #appDock, #devDock, .header",
    );

    docks.forEach((dock) => {
      // Skip if already initialized
      if (dock.dataset.draggable === "true") return;
      dock.dataset.draggable = "true";

      // Make cursor indicate draggable
      dock.style.cursor = "grab";

      // Mouse events
      dock.addEventListener("mousedown", startDrag);

      // Prevent text selection while dragging
      dock.addEventListener("selectstart", (e) => {
        if (isDragging) e.preventDefault();
      });
    });

    // Global mouse events
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);

    console.log("🎯 DockDrag: Initialized", docks.length, "docks +  header");
  }

  // ==========================================
  // DRAG HANDLERS
  // ==========================================
  function startDrag(e) {
    // Ignore if clicking on a button/item (allow clicks to work)
    if (e.target.closest(".dock-item, .nav-item, button, a, input, select"))
      return;

    const dock = e.currentTarget;
    activeDock = dock;
    isDragging = true;

    // Calculate offset from mouse to dock position
    const rect = dock.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    // Visual feedback
    dock.style.cursor = "grabbing";
    dock.classList.add("dragging");
    dock.style.transition = "none";

    // Special handling for header (convert sticky to fixed)
    if (dock.classList.contains("header")) {
      dock.style.position = "fixed";
      dock.style.width = "100%";
    }

    // Remove transform center alignment if present
    dock.style.transform = "none";

    // Set initial position based on current location
    dock.style.left = rect.left + "px";
    dock.style.top = rect.top + "px";
    dock.style.right = "auto";
    dock.style.bottom = "auto";

    e.preventDefault();
  }

  function onDrag(e) {
    if (!isDragging || !activeDock) return;

    // Calculate new position
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Boundary constraints (keep within viewport)
    const rect = activeDock.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    // Apply position
    activeDock.style.left = newX + "px";
    activeDock.style.top = newY + "px";
  }

  function endDrag() {
    if (!activeDock) return;

    activeDock.style.cursor = "grab";
    activeDock.classList.remove("dragging");
    activeDock.style.transition = "";

    // Save position to localStorage
    saveDockPosition(activeDock);

    activeDock = null;
    isDragging = false;
  }

  // ==========================================
  // POSITION PERSISTENCE
  // ==========================================
  function saveDockPosition(dock) {
    const id = dock.id || dock.className;
    const pos = {
      left: dock.style.left,
      top: dock.style.top,
    };
    localStorage.setItem(`panda_dock_pos_${id}`, JSON.stringify(pos));
  }

  function restoreDockPositions() {
    const docks = document.querySelectorAll(
      ".modular-dock, .app-dock, #appDock, #devDock, .header",
    );

    docks.forEach((dock) => {
      const id = dock.id || dock.className;
      const saved = localStorage.getItem(`panda_dock_pos_${id}`);

      if (saved) {
        try {
          const pos = JSON.parse(saved);
          dock.style.left = pos.left;
          dock.style.top = pos.top;
          dock.style.right = "auto";
          dock.style.bottom = "auto";
          dock.style.transform = "none";
          // For header, ensure it stays fixed after restoration
          if (dock.classList.contains("header")) {
            dock.style.position = "fixed";
            dock.style.width = "100%";
          }
        } catch (e) {
          console.warn("Failed to restore dock position:", id);
        }
      }
    });
  }

  // ==========================================
  // RESET POSITIONS
  // ==========================================
  function resetDockPositions() {
    const docks = document.querySelectorAll(
      ".modular-dock, .app-dock, #appDock, #devDock, .header",
    );

    docks.forEach((dock) => {
      const id = dock.id || dock.className;
      localStorage.removeItem(`panda_dock_pos_${id}`);

      // Remove inline position styles
      dock.style.left = "";
      dock.style.top = "";
      dock.style.right = "";
      dock.style.bottom = "";
      dock.style.transform = "";
      // Restore header to sticky
      if (dock.classList.contains("header")) {
        dock.style.position = "sticky";
        dock.style.width = "";
      }
    });

    console.log("🔄 Dock positions reset (including header)");
  }

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    // Wait a bit for docks to be loaded by the loader
    setTimeout(() => {
      initDraggableDocks();
      restoreDockPositions();
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Re-init when PandaReady fires (after components load)
  document.addEventListener("PandaReady", () => {
    setTimeout(initDraggableDocks, 100);
  });

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.PandaDock = {
    reset: resetDockPositions,
    reinit: initDraggableDocks,
  };
})();
