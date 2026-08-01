// src/app/status/StatusClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export function StatusClient() {
  return (
    <main className="min-h-screen bg-[#F4F6F8] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-md w-full rounded-2xl border border-[#9AA5B1]/30 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-14 w-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 mb-6">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <p className="text-base font-medium text-[#1B222C] leading-relaxed">
          You do not have permission to access this page. Please leave this page.
        </p>

        <div className="mt-8 pt-6 border-t border-[#9AA5B1]/20">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B222C] px-5 py-3 text-xs font-semibold text-white hover:bg-[#3E4C59] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
