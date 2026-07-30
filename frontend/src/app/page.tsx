// src/app/page.tsx
// Routes stay thin — they assemble feature components, no logic of their own.

import { Hero } from "@/features/landing/components/Hero";
import { Services } from "@/features/landing/components/Services";
import { ContactForm } from "@/features/landing/components/ContactForm";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <section className="bg-cloud px-6 py-20">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-graphite">
          Let&apos;s talk
        </h2>
        <ContactForm />
      </section>
    </main>
  );
}
