"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("mf-install-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("mf-install-dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm sm:w-96 z-[10002] bg-[#1B222C] text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
      <Download className="h-5 w-5 shrink-0" />
      <div className="flex-1 text-sm">
        <p className="font-semibold">Install M&F Technologies</p>
        <p className="text-white/70 text-xs">Add to your home screen for quick access.</p>
      </div>
      <button
        onClick={handleInstall}
        className="text-xs font-semibold bg-white text-[#1B222C] px-3 py-1.5 rounded-lg shrink-0"
      >
        Install
      </button>
      <button onClick={handleClose} aria-label="Dismiss" className="shrink-0">
        <X className="h-4 w-4 text-white/70" />
      </button>
    </div>
  );
}
