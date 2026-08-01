// src/features/landing/components/ContactForm.tsx
"use client";

import { useContactForm } from "../hooks/useContactForm";
import { Button } from "@/shared/components/Button";

export function ContactForm() {
  const { form, update, submit, status, error } = useContactForm();

  if (status === "success") {
    return (
      <div className="mx-0 max-w-md rounded-lg bg-cloud p-5 sm:p-6 text-center text-sm sm:text-base text-slate">
        Thanks — we&apos;ve received your message and will follow up shortly.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="mx-0 flex max-w-md flex-col gap-3 sm:gap-4"
    >
      <input
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="Your name"
        required
        className="rounded-lg border border-fog/50 px-4 py-3 text-sm sm:text-base text-graphite focus:border-graphite focus:outline-none bg-white transition-colors"
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        placeholder="Work email"
        required
        className="rounded-lg border border-fog/50 px-4 py-3 text-sm sm:text-base text-graphite focus:border-graphite focus:outline-none bg-white transition-colors"
      />
      <input
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
        placeholder="Company (optional)"
        className="rounded-lg border border-fog/50 px-4 py-3 text-sm sm:text-base text-graphite focus:border-graphite focus:outline-none bg-white transition-colors"
      />
      <textarea
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        placeholder="What are you looking to build?"
        required
        rows={4}
        className="rounded-lg border border-fog/50 px-4 py-3 text-sm sm:text-base text-graphite focus:border-graphite focus:outline-none bg-white resize-none transition-colors"
      />

      {/* Honeypot — hidden from real users via CSS, bots that fill every
          field will trip it. Never use display:none for this (some bots
          skip hidden fields) — off-screen positioning is more effective. */}
      <input
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px]"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={status === "submitting"} className="py-3 text-sm sm:text-base rounded-lg w-full">
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
