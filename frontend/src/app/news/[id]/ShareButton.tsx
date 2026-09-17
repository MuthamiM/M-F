// src/app/news/[id]/ShareButton.tsx
"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Share article link"
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#9AA5B1]/30 bg-[#F4F6F8] px-3.5 py-1.5 text-xs font-semibold text-[#1B222C] hover:bg-[#E4E7EB] transition-all cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-700">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-[#1B222C]" />
          <span>Share Article</span>
        </>
      )}
    </button>
  );
}
