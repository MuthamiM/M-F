"use client";

import { useEffect, useState } from "react";
import { X, Download, Share, Compass } from "lucide-react";

interface IosDeviceInfo {
  isIos: boolean;
  isSafari: boolean;
  isStandalone: boolean;
}

function getIosDeviceInfo(): IosDeviceInfo {
  if (typeof navigator === "undefined") {
    return { isIos: false, isSafari: false, isStandalone: false };
  }

  // Allow preview via URL query: ?preview=ios, ?ios=1, ?banner=1, etc.
  if (typeof window !== "undefined") {
    const search = window.location.search.toLowerCase();
    if (search.includes("ios") || search.includes("preview") || search.includes("banner")) {
      return { isIos: true, isSafari: true, isStandalone: false };
    }
  }

  const ua = navigator.userAgent;
  const isIos =
    /iP(hone|od|ad)/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // CriOS = Chrome, FxiOS = Firefox, EdgiOS = Edge, OPiOS = Opera on iOS
  const isOtherIosBrowser = /(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua);
  const isSafari = isIos && !isOtherIosBrowser;

  const isStandalone =
    ("standalone" in navigator && (navigator as any).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches;

  return { isIos, isSafari, isStandalone };
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [iosInfo, setIosInfo] = useState<IosDeviceInfo>({
    isIos: false,
    isSafari: false,
    isStandalone: false,
  });

  // Check iOS device status & show banner for iOS users
  useEffect(() => {
    // Expose quick trigger for testing in console: showIosBanner()
    if (typeof window !== "undefined") {
      (window as any).showIosBanner = () => {
        setIosInfo({ isIos: true, isSafari: true, isStandalone: false });
        setVisible(true);
      };
    }

    const isForced =
      typeof window !== "undefined" &&
      (window.location.search.toLowerCase().includes("ios") ||
        window.location.search.toLowerCase().includes("preview") ||
        window.location.search.toLowerCase().includes("banner") ||
        (window as any).__SHOW_IOS_BANNER === true);

    const info = getIosDeviceInfo();
    if (isForced) {
      info.isIos = true;
      info.isSafari = true;
      info.isStandalone = false;
    }
    setIosInfo(info);

    if (info.isStandalone && !isForced) return;

    const dismissed = localStorage.getItem("mf-install-dismissed");
    if (dismissed && !isForced) return;

    if (info.isIos || isForced) {
      // Show iOS banner after short delay (or instantly if forced)
      const timer = setTimeout(() => setVisible(true), isForced ? 50 : 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Android / Chromium: beforeinstallprompt listener
  useEffect(() => {
    const dismissed = localStorage.getItem("mf-install-dismissed");
    if (dismissed) return;

    const info = getIosDeviceInfo();
    if (info.isStandalone || info.isIos) return;

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

  // ─── Case 1: iOS Safari ───
  if (iosInfo.isIos && iosInfo.isSafari) {
    return (
      <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-[10002] bg-[#1B222C]/95 backdrop-blur-md text-white border border-white/15 rounded-2xl shadow-2xl px-4 py-3.5 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-bold leading-snug">Install M&F Technologies</p>
            <p className="text-white/70 text-[11px] mt-0.5">Add to home screen for fast micro-lending access.</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Dismiss"
            className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* 2-Step instructions for iOS Safari */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2.5 text-[11px] sm:text-xs text-white/80">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-[10px] font-bold">1</span>
            <span>Tap</span>
            <Share className="h-4 w-4 text-[#007AFF] shrink-0" />
            <span className="font-semibold">Share</span>
          </div>
          <svg className="h-3 w-3 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-[10px] font-bold">2</span>
            <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Case 2: Non-Safari Browser on iOS (Chrome/Firefox/Edge on iPhone) ───
  if (iosInfo.isIos && !iosInfo.isSafari) {
    return (
      <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-[10002] bg-[#1B222C]/95 backdrop-blur-md text-white border border-white/15 rounded-2xl shadow-2xl px-4 py-3.5 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <Compass className="h-5 w-5 text-[#007AFF]" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-bold leading-snug">To Install App on iPhone</p>
            <p className="text-white/70 text-[11px] mt-0.5">Please open this site in <span className="font-bold text-white">Safari</span> to add to Home Screen.</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Dismiss"
            className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-white/70 hover:text-white" />
          </button>
        </div>
      </div>
    );
  }

  // ─── Case 3: Android / Chrome native prompt ───
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
      <button
        onClick={handleClose}
        aria-label="Dismiss"
        className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <X className="h-4 w-4 text-white/70 hover:text-white" />
      </button>
    </div>
  );
}
