// App Dock - Simplified Drag (on entire body)
(function () {
  const appDock = document.getElementById("appDock");

  if (!appDock) {
    console.warn("AppDock not found");
    return;
  }

  let isDragging = false;
  let startX, startY, startBottom, startLeft;

  // Make entire dock draggable
  appDock.addEventListener(
    "mousedown",
    (e) => {
      // Ignore if clicking on nav items (they need to be clickable)
      if (e.target.closest(".nav-item")) return;

      // Prevent default to avoid text selection
      e.preventDefault();

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = appDock.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(appDock);

      // Get current position
      startBottom =
        parseInt(computedStyle.bottom) || window.innerHeight - rect.bottom;
      startLeft = parseInt(computedStyle.left) || rect.left;

      appDock.style.cursor = "grabbing";
    },
    { passive: false },
  );

  // Add mousemove listener to window
  window.addEventListener(
    "mousemove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Update position
      appDock.style.position = "fixed";
      appDock.style.bottom = startBottom - dy + "px";
      appDock.style.left = startLeft + dx + "px";
      appDock.style.transform = "none"; // Clear any transforms
    },
    { passive: false },
  );

  // Add mouseup listener to window
  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      appDock.style.cursor = "grab";
    }
  });

  console.log("✅ AppDock drag initialized");
})();
