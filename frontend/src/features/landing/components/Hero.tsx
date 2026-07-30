// src/features/landing/components/Hero.tsx
import { Button } from "@/shared/components/Button";

export function Hero() {
  return (
    <section className="bg-cloud px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-medium tracking-wide text-silver">
          LENDING TECHNOLOGY, BUILT FOR SCALE
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-graphite md:text-6xl">
          M&amp;F Technologies
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate">
          Core lending systems, credit scoring, and secure API infrastructure
          for banks, credit unions, and lending platforms that can&apos;t
          afford to get this wrong.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button variant="primary">Talk to us</Button>
          <Button variant="secondary">Read the docs</Button>
        </div>
      </div>
    </section>
  );
}
