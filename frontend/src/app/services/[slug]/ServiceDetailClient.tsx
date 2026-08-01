// src/app/services/[slug]/ServiceDetailClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Service } from "@/features/landing/data/services";

interface ServiceDetailClientProps {
  service: Service;
  related: Service[];
}

export function ServiceDetailClient({ service, related }: ServiceDetailClientProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-cloud border-b border-fog/20 px-0">
        <div className="mx-0 max-w-4xl pl-4 sm:pl-6 py-12 sm:py-20">
          <Link
            href="/#services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-graphite transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Services
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl animate-fade-in-up">
            {service.title}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {service.desc}
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="mx-0 max-w-4xl pl-4 sm:pl-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-graphite sm:text-2xl">Overview</h2>
            <p className="mt-4 text-sm sm:text-base text-slate leading-relaxed">
              {service.details}
            </p>

            {/* Deliverables */}
            <h3 className="mt-10 text-lg font-bold text-graphite sm:text-xl">Key Deliverables</h3>
            <ul className="mt-4 space-y-3">
              {service.deliverables.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm sm:text-base text-slate animate-stagger-in"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-graphite shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            {/* Tech Stack */}
            <div className="rounded-xl border border-fog/30 bg-cloud p-5 sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-graphite">Technology Stack</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-block rounded-full border border-fog/40 bg-white px-3 py-1.5 text-xs font-semibold text-slate"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 rounded-xl border border-slate/20 bg-graphite p-5 sm:p-6 text-center">
              <h3 className="text-base font-bold text-white sm:text-lg">Need this solution?</h3>
              <p className="mt-2 text-xs sm:text-sm text-fog">
                Let&apos;s discuss how we can build this for your institution.
              </p>
              <Link
                href="/#contact"
                className="mt-4 inline-block w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-graphite hover:bg-cloud transition-colors"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-cloud border-t border-fog/20 px-0 py-12 sm:py-16">
        <div className="mx-0 max-w-4xl pl-4 sm:pl-6">
          <h2 className="text-xl font-bold text-graphite sm:text-2xl">Related Services</h2>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}`}
                className="group block rounded-xl border border-fog/30 bg-white p-4 sm:p-5 transition-all hover:shadow-md hover:border-slate hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-graphite text-sm sm:text-base leading-snug">
                    {rel.title}
                  </h3>
                  <ArrowRight className="h-3.5 w-3.5 text-fog shrink-0 mt-0.5 transition-transform group-hover:translate-x-1 group-hover:text-graphite" />
                </div>
                <p className="mt-1.5 text-xs text-slate line-clamp-2">{rel.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
