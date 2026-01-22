// Developer Tools Dock - Simplified Drag (on entire body)
(function () {
  const devDock = document.getElementById("devToolsDock");

  if (!devDock) {
    console.warn("DevToolsDock not found");
    return;
  }

  let isDragging = false;
  let startX, startY, startTop, startRight;

  // Make entire dock draggable
  devDock.addEventListener(
    "mousedown",
    (e) => {
      // Ignore if clicking on dev items (they need to be clickable)
      if (e.target.closest(".dev-dock-item")) return;

      // Prevent default to avoid text selection
      e.preventDefault();

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = devDock.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(devDock);

      // Get current position
      startTop = parseInt(computedStyle.top) || rect.top;
      startRight =
        parseInt(computedStyle.right) || window.innerWidth - rect.right;

      devDock.style.cursor = "grabbing";
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
      devDock.style.position = "fixed";
      devDock.style.top = startTop + dy + "px";
      devDock.style.right = startRight - dx + "px";
      devDock.style.transform = "none"; // Clear any transforms
    },
    { passive: false },
  );

  // Add mouseup listener to window
  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      devDock.style.cursor = "grab";
    }
  });

  console.log("✅ DevToolsDock drag initialized");
})();

// Placeholder functions for developer tools
function openExtensionMarketplace() {
  alert("🧩 Extension Marketplace - Open VSX integration coming soon!");
}

function openDevConsole() {
  alert("💻 Developer Console - Coming soon!");
}

function openAPITester() {
  alert("🔌 API Tester - Coming soon!");
}

function openDatabaseExplorer() {
  alert("🗄️ Database Explorer - Coming soon!");
}

function openCodeEditor() {
  alert("📝 Code Editor - Monaco integration coming soon!");
}

function openAIAssistant() {
  alert("🐼 AI Assistant Panel - Coming soon!");
}
