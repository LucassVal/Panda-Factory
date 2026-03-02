/**
 * usePWAInstall.js
 * Hook para capturar o evento beforeinstallprompt e expor um botão de instalação do PWA.
 *
 * SSoT: PF_BACKEND_REFERENCE.md §PWA / CONTEXT.md §9 / SPRINT_ETAPA1 TICKET-13
 * Versão: 1.0.0 | Sprint E1-S1C | 2026-03-02
 *
 * Uso:
 *   const { isInstallable, promptInstall } = usePWAInstall();
 *   if (isInstallable) <button onClick={promptInstall}>Instalar App</button>
 */

import { useState, useEffect } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado como PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Captura o evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Evita o prompt automático do browser
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Detecta instalação concluída
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  /**
   * Exibe o prompt de instalação nativo do browser.
   * @returns {Promise<'accepted'|'dismissed'>}
   */
  const promptInstall = async () => {
    if (!deferredPrompt) return null;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
    return outcome;
  };

  return {
    isInstallable, // true = mostrar botão de instalar
    isInstalled, // true = app já está instalado
    promptInstall, // chamar para abrir o prompt nativo
  };
}

export default usePWAInstall;
