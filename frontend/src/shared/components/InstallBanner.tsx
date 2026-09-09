"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";

/**
 * Detects if the user is on iOS Safari (not already in standalone PWA mode).
 * iOS Chrome/Firefox/Edge all use WebKit under the hood but don't support
 * Add to Home Screen — only Safari does.
 */
function getIsIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iP(hone|od|ad)/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // CriOS = Chrome, FxiOS = Firefox, EdgiOS = Edge, OPiOS = Opera — none support A2HS
  const isSafari = !/(CriOS|FxiOS|EdgiOS|OPiOS)/.test(ua);
  const isStandalone = ("standalone" in navigator && (navigator as any).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches;
  return isIos && isSafari && !isStandalone;
}

function getIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as any).standalone);
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isTypingOnPhone, setIsTypingOnPhone] = useState(false);

  // Hide banner when user is actively typing on mobile (keyboard obscures it)
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

  // Android/Chrome: listen for the beforeinstallprompt event
  useEffect(() => {
    const dismissed = localStorage.getItem("mf-install-dismissed");
    if (dismissed) return;

    // Don't show if already running as installed PWA
    if (getIsStandalone()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // iOS Safari: show instructional banner since beforeinstallprompt doesn't exist
  useEffect(() => {
    const dismissed = localStorage.getItem("mf-install-dismissed");
    if (dismissed) return;

    if (getIsIosSafari()) {
      setIsIos(true);
      // Small delay so the page has time to render before the banner appears
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
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

  // ─── iOS Safari: instructional banner ───
  if (isIos) {
    return (
      <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-[10002] bg-[#1B222C]/95 backdrop-blur-md text-white border border-white/15 rounded-2xl shadow-2xl px-4 py-3.5 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-bold leading-snug">Install M&F Technologies</p>
            <p className="text-white/70 text-[11px] mt-0.5">Add to your home screen for quick access.</p>
          </div>
          <button onClick={handleClose} aria-label="Dismiss" className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
            <X className="h-4 w-4 text-white/70 hover:text-white" />
          </button>
        </div>
        {/* Step-by-step instructions */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3 text-[11px] sm:text-xs text-white/80">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-[10px] font-bold shrink-0">1</span>
            <span>Tap</span>
            <Share className="h-4 w-4 text-[#007AFF] shrink-0" />
            <span className="font-semibold">Share</span>
          </div>
          <svg className="h-3 w-3 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-[10px] font-bold shrink-0">2</span>
            <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Android/Chrome: native install prompt ───
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
