"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [isTypingOnPhone, setIsTypingOnPhone] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        setIsTypingOnPhone(true);
      }
    };
    const handleFocusOut = () => {
      setIsTypingOnPhone(false);
    };
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

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

  if (!visible || isTypingOnPhone) return null;

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-[10002] bg-[#1B222C]/95 backdrop-blur-md text-white border border-white/15 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3.5 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-2 rounded-xl bg-white/10 shrink-0">
        <Download className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 text-xs sm:text-sm">
        <p className="font-bold leading-snug">Install M&F Technologies to your home screen</p>
        <p className="text-white/70 text-[11px] mt-0.5">Quick access for micro-lending & system audit tools.</p>
      </div>
      <button
        onClick={handleInstall}
        className="text-xs font-bold bg-white text-[#1B222C] hover:bg-white/90 px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer shadow-md active:scale-95"
      >
        Install
      </button>
      <button onClick={handleClose} aria-label="Dismiss" className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
        <X className="h-4 w-4 text-white/70 hover:text-white" />
      </button>
    </div>
  );
}
