// src/features/landing/components/Services.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "../data/services";
export type { Service } from "../data/services";
export { SERVICES } from "../data/services";

export function Services() {
  return (
    <section id="services" className="w-full px-0 py-16 bg-white sm:py-20">
      <div className="w-full px-4 sm:px-6">
        <h2 className="text-center font-display text-2xl font-bold text-graphite sm:text-3xl">
          What we build
        </h2>
        <p className="text-center text-slate mt-2 max-w-lg mx-auto text-xs sm:text-sm">
          Tap any service to explore the projects, deliverables, and technologies behind it.
        </p>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SERVICES.map((service, idx) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group block w-full rounded-xl border border-fog/30 bg-white p-4 sm:p-6 transition-all hover:shadow-lg hover:border-slate hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2 animate-stagger-in"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-graphite text-base sm:text-lg leading-snug">
                  {service.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-fog shrink-0 mt-1 transition-transform group-hover:translate-x-1 group-hover:text-graphite" />
              </div>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate leading-relaxed">{service.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
