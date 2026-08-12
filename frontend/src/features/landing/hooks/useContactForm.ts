// src/features/landing/hooks/useContactForm.ts
// Client-side validation is a UX nicety, NOT a security boundary — the
// backend re-validates everything with the same rules (see contact.schema.ts
// on the backend). Never trust the client.

import { useState } from "react";
import { apiFetch, ApiError } from "@/shared/lib/apiClient";
import { useGeolocation } from "./useGeolocation";

interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string; // honeypot — left empty by real users
}

const initialState: ContactForm = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export function useContactForm() {
  const [form, setForm] = useState<ContactForm>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const { coords, permission: locationPermission, request: requestLocation } = useGeolocation();

  function update<K extends keyof ContactForm>(field: K, value: ContactForm[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    setStatus("submitting");
    setError(null);

    if (form.name.trim().length === 0 || form.message.trim().length < 10) {
      setError("Please fill in your name and a message of at least 10 characters.");
      setStatus("error");
      return;
    }

    try {
      const payload =
        locationPermission === "granted" && coords
          ? { ...form, latitude: coords.latitude, longitude: coords.longitude }
          : form;

      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return { form, update, submit, status, error, locationPermission, requestLocation };
}
