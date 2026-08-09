// src/shared/components/CookieBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { Shield, Settings, X, Check, Lock, BarChart3, Sliders, Megaphone } from "lucide-react";

export interface CookiePreferences {
  essential: boolean; // always true
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  functional: true,
  marketing: false,
};

export function CookieBanner() {
  // Do not render cookie banner inside admin console
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
  }

  const [bannerVisible, setBannerVisible] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const consent = localStorage.getItem("mf_cookie_consent");
        return !consent;
      }
    } catch {
      // Storage blocked
    }
    return false;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    try {
      if (typeof window !== "undefined") {
        const storedPrefs = localStorage.getItem("mf_cookie_preferences");
        if (storedPrefs) {
          return JSON.parse(storedPrefs);
        }
      }
    } catch {
      // Storage blocked
    }
    return DEFAULT_PREFERENCES;
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {

    const handleOpenModal = () => {
      setModalOpen(true);
    };

    // Disable right click context menu to block inspection
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common inspector shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Cmd+Opt+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && ["i", "I", "j", "J", "c", "C"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.ctrlKey && ["u", "U"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.metaKey && e.altKey && ["i", "I", "j", "J", "c", "C"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("open_cookie_preferences", handleOpenModal);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open_cookie_preferences", handleOpenModal);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const saveConsentData = (mode: string, customPrefs?: CookiePreferences) => {
    const prefsToSave = customPrefs || (mode === "accept_all" 
      ? { essential: true, analytics: true, functional: true, marketing: true }
      : mode === "reject_optional"
      ? { essential: true, analytics: false, functional: false, marketing: false }
      : preferences);

    try {
      localStorage.setItem("mf_cookie_consent", mode);
      localStorage.setItem("mf_cookie_preferences", JSON.stringify(prefsToSave));
      sessionStorage.setItem(
        "mf_session_telemetry",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          consentMode: mode,
          preferences: prefsToSave,
          sessionActive: true,
        })
      );
    } catch {}

    setPreferences(prefsToSave);
    setBannerVisible(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setModalOpen(false);
      setSavedSuccess(false);
    }, 600);
  };

  const toggleCategory = (key: keyof Omit<CookiePreferences, "essential">) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Bottom Floating Consent Banner (Minimal Inline Straight Line with White Background) */}
      {bannerVisible && !modalOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[9000] border-t border-[#9AA5B1]/20 bg-white text-[#3E4C59] px-4 py-4 sm:px-8 lg:px-12 shadow-2xl">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-start md:items-center gap-3 text-[#3E4C59]">
              <Shield className="h-5 w-5 text-[#3E4C59] shrink-0 mt-0.5 md:mt-0" />
              <p className="leading-relaxed">
                We use security cookies and telemetry to monitor API response speeds, verify digital sessions, prevent fraud, and run system audits. You can configure custom choices or click to accept all session tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#3E4C59] transition-colors cursor-pointer py-2 px-3 border border-[#9AA5B1]/30 bg-[#F4F6F8] rounded hover:border-[#3E4C59]"
              >
                <Settings className="h-3.5 w-3.5 text-[#3E4C59]" />
                Customize Preferences
              </button>

              <button
                type="button"
                onClick={() => saveConsentData("reject_optional")}
                className="text-xs font-semibold text-[#3E4C59] hover:text-[#3E4C59] transition-colors cursor-pointer py-2 px-3"
              >
                Essential Only
              </button>

              <button
                type="button"
                onClick={() => saveConsentData("accept_all")}
                className="rounded bg-[#3E4C59] hover:bg-[#6B7684] text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Floating Panel - Opens bottom right with pointing triangle & White Background */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-end justify-end p-4 sm:p-6 md:p-8">
          <div 
            className="pointer-events-auto bg-white text-[#3E4C59] border border-[#9AA5B1]/30 rounded-xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-6 relative animate-in fade-in slide-in-from-bottom-5 duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
          >
            {/* Popover Triangle Arrow at the bottom right pointing down to the footer preference trigger */}
            <div className="absolute bottom-[-7px] right-12 w-3.5 h-3.5 bg-white border-r border-b border-[#9AA5B1]/30 rotate-45 hidden sm:block" />

            {/* Panel Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#9AA5B1]/20">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield className="h-5 w-5 text-[#3E4C59]" />
                  <h2 id="cookie-preferences-title" className="text-sm font-bold uppercase tracking-wider text-[#3E4C59]">
                    Telemetry Preferences
                  </h2>
                </div>
                <p className="text-xs text-[#3E4C59] leading-relaxed">
                  Manage the details of how your data is collected and processed during active system sessions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#3E4C59] hover:text-[#3E4C59] p-1 rounded-lg hover:bg-[#F4F6F8] transition-colors"
                aria-label="Close settings"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Category Options List */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {/* Category 1: Essential */}
              <div className="p-4 rounded-lg bg-[#F4F6F8] border border-[#9AA5B1]/20 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Lock className="h-4 w-4 text-[#3E4C59] shrink-0" />
                    <span className="text-xs font-bold text-[#3E4C59]">Strictly Necessary</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest bg-[#E4E7EB] text-[#3E4C59] border border-[#9AA5B1]/20 px-1.5 py-0.5 rounded">
                      Required
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3E4C59] leading-relaxed">
                    Essential for secure authentication, token validation, rate-limiting counters, and preventing fraudulent system access attempts. Cannot be toggled off.
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <div className="w-10 h-5.5 bg-[#E4E7EB] rounded-full flex items-center justify-end px-0.5 cursor-not-allowed">
                    <div className="w-4.5 h-4.5 bg-[#9AA5B1] rounded-full shadow" />
                  </div>
                </div>
              </div>

              {/* Category 2: Performance & Analytics */}
              <div className="p-4 rounded-lg bg-[#F4F6F8] border border-[#9AA5B1]/20 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#3E4C59] shrink-0" />
                    <span className="text-xs font-bold text-[#3E4C59]">Performance Analytics</span>
                  </div>
                  <p className="text-[11px] text-[#3E4C59] leading-relaxed">
                    Tracks sub-second API endpoint latency, payload sizes, database queries, and system uptime trends to assist engineering teams in scaling the infrastructure.
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.analytics}
                    onClick={() => toggleCategory("analytics")}
                    className={`w-11 h-6 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                      preferences.analytics ? "bg-[#3E4C59] justify-end" : "bg-[#E4E7EB] justify-start"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full shadow transition-all ${
                      preferences.analytics ? "bg-white" : "bg-[#9AA5B1]"
                    }`} />
                  </button>
                </div>
              </div>

              {/* Category 3: Functional */}
              <div className="p-4 rounded-lg bg-[#F4F6F8] border border-[#9AA5B1]/20 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-[#3E4C59] shrink-0" />
                    <span className="text-xs font-bold text-[#3E4C59]">System Personalization</span>
                  </div>
                  <p className="text-[11px] text-[#3E4C59] leading-relaxed">
                    Remembers preferences such as filter inputs, active navigation menus, regional layout specifications, and support workspace options across browser sessions.
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.functional}
                    onClick={() => toggleCategory("functional")}
                    className={`w-11 h-6 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                      preferences.functional ? "bg-[#3E4C59] justify-end" : "bg-[#E4E7EB] justify-start"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full shadow transition-all ${
                      preferences.functional ? "bg-white" : "bg-[#9AA5B1]"
                    }`} />
                  </button>
                </div>
              </div>

              {/* Category 4: Marketing */}
              <div className="p-4 rounded-lg bg-[#F4F6F8] border border-[#9AA5B1]/20 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-[#3E4C59] shrink-0" />
                    <span className="text-xs font-bold text-[#3E4C59]">Platform Newsletters</span>
                  </div>
                  <p className="text-[11px] text-[#3E4C59] leading-relaxed">
                    Allows delivery of new system feature documentation, operational change logs, developer SDK releases, and partner support alerts directly inside the portal.
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.marketing}
                    onClick={() => toggleCategory("marketing")}
                    className={`w-11 h-6 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                      preferences.marketing ? "bg-[#3E4C59] justify-end" : "bg-[#E4E7EB] justify-start"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full shadow transition-all ${
                      preferences.marketing ? "bg-white" : "bg-[#9AA5B1]"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#9AA5B1]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => saveConsentData("reject_optional")}
                  className="w-full sm:w-auto text-xs font-bold text-[#3E4C59] hover:text-[#3E4C59] transition-colors cursor-pointer py-2 px-3 border border-[#9AA5B1]/20 rounded hover:border-[#3E4C59] bg-[#F4F6F8]"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={() => saveConsentData("accept_all")}
                  className="w-full sm:w-auto text-xs font-bold text-[#3E4C59] hover:text-[#3E4C59] transition-colors cursor-pointer py-2 px-3 border border-[#9AA5B1]/20 rounded hover:border-[#3E4C59] bg-[#F4F6F8]"
                >
                  Accept All
                </button>
              </div>

              <button
                type="button"
                onClick={() => saveConsentData("custom")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded bg-[#3E4C59] text-white px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-md hover:bg-[#6B7684]"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    Preferences Saved
                  </>
                ) : (
                  "Save Choices"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
