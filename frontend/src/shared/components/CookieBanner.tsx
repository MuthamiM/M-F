// src/shared/components/CookieBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("mf_cookie_consent");
      if (!consent) {
        setVisible(true);
      }
    } catch {
      // Storage blocked
    }
  }, []);

  const collectSessionData = (mode: string) => {
    try {
      localStorage.setItem("mf_cookie_consent", mode);
      sessionStorage.setItem(
        "mf_session_telemetry",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          consentMode: mode,
          sessionActive: true,
        })
      );
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9000] border-t border-[#3E4C59]/40 bg-[#1B222C] text-white px-4 py-3 sm:px-6 shadow-2xl">
      <div className="mx-0 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#9AA5B1]">
          <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            We collect session telemetry and operational cookies to ensure platform uptime and bank-grade security.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => collectSessionData("preferences")}
            className="text-xs font-semibold text-[#9AA5B1] hover:text-white transition-colors cursor-pointer py-1.5 px-3 border border-[#3E4C59] rounded"
          >
            Preferences
          </button>

          <button
            type="button"
            onClick={() => collectSessionData("accept_all")}
            className="rounded bg-white px-4 py-1.5 text-xs font-semibold text-[#1B222C] hover:bg-[#E4E7EB] transition-colors cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
