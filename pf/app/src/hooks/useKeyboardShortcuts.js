import { useEffect, useCallback } from "react";

export default function useKeyboardShortcuts({
  onToggleDevTools, onToggleChat, onOpenSettings, onOpenStore, onEscape,
}) {
  const handleKeyDown = useCallback((e) => {
    const tag = e.target.tagName;
    if (tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT") return;
    if (e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "d": e.preventDefault(); onToggleDevTools?.(); break;
        case "/": e.preventDefault(); onToggleChat?.(); break;
        case ",": e.preventDefault(); onOpenSettings?.(); break;
        case "k": e.preventDefault(); onOpenStore?.(); break;
        default: break;
      }
      return;
    }
    if (e.key==="Escape") { onEscape?.(); }
  }, [onToggleDevTools, onToggleChat, onOpenSettings, onOpenStore, onEscape]);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
