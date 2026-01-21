// Omni-Bar Chat Resize Handler
(function () {
  const chatArea = document.getElementById("omni-chat-expansion");
  if (!chatArea) return;

  let isResizing = false;
  let startY = 0;
  let startHeight = 0;

  // Create custom resize handle
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "omni-resize-handle";
  resizeHandle.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 12px;
        cursor: ns-resize;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

  const handleBar = document.createElement("div");
  handleBar.style.cssText = `
        width: 40px;
        height: 4px;
        background: var(--text-secondary);
        border-radius: 2px;
        opacity: 0.3;
        transition: opacity 0.2s;
    `;
  resizeHandle.appendChild(handleBar);

  resizeHandle.addEventListener("mouseenter", () => {
    handleBar.style.opacity = "0.6";
  });

  resizeHandle.addEventListener("mouseleave", () => {
    if (!isResizing) handleBar.style.opacity = "0.3";
  });

  resizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isResizing = true;
    startY = e.clientY;
    startHeight = chatArea.offsetHeight;
    handleBar.style.opacity = "0.8";
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    // Calculate new height (inverted because flex-direction: column-reverse)
    const deltaY = startY - e.clientY; // Inverted
    const newHeight = Math.max(200, Math.min(600, startHeight + deltaY));

    chatArea.style.height = newHeight + "px";
  });

  window.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      handleBar.style.opacity = "0.3";
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  });

  // Insert handle at the top of chat area
  chatArea.insertBefore(resizeHandle, chatArea.firstChild);

  console.log("✅ Omni-Bar chat resize handler initialized");
})();
