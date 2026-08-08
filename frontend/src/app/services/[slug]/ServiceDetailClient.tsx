// src/app/services/[slug]/ServiceDetailClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Service } from "@/features/landing/data/services";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";

interface ServiceDetailClientProps {
  service: Service;
  related: Service[];
}

export function ServiceDetailClient({ service, related }: ServiceDetailClientProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-cloud border-b border-fog/20 px-0">
        <div className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          <Link
            href="/#services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-graphite transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Services
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl animate-fade-in-up leading-tight max-w-3xl">
            {service.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate max-w-3xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {service.desc}
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16 items-start">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-graphite sm:text-2xl uppercase tracking-wider text-[11px] text-[#6B7684] mb-3">Service Overview</h2>
              <p className="text-sm sm:text-base text-slate leading-relaxed">
                {service.details}
              </p>
            </div>

            <div>
              <p className="text-sm sm:text-base text-slate leading-relaxed">
                Our design processes prioritize rigorous security guidelines, high availability SLAs, and continuous integration paths. We collaborate closely with risk committees and systems administrators to ensure seamless rollout, data sovereignty compliance, and frictionless micro-lending disbursements.
              </p>
            </div>

            {/* Deliverables */}
            <div className="pt-6 border-t border-fog/20">
              <h3 className="text-lg font-bold text-graphite sm:text-xl uppercase tracking-wider text-[11px] text-[#6B7684] mb-4">Core System Deliverables</h3>
              <ul className="space-y-3.5">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tech Stack */}
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-graphite">System Technology Stack</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-block rounded-lg border border-fog/40 bg-white px-3 py-1.5 text-xs font-semibold text-slate"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-slate/20 bg-graphite p-6 sm:p-8 text-center space-y-4">
              <h3 className="text-base font-bold text-white sm:text-lg">Request Custom Architecture</h3>
              <p className="text-xs sm:text-sm text-fog leading-relaxed">
                Let&apos;s schedule a session to review how we can deploy this module to match your compliance, volume, and latency requirements.
              </p>
              <Link
                href="/contact"
                className="inline-block w-full rounded-lg bg-white px-6 py-3 text-xs font-bold text-graphite hover:bg-cloud transition-colors shadow-sm"
              >
                Connect with Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-cloud border-t border-fog/20 py-20 sm:py-28">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-graphite sm:text-3xl tracking-tight text-center lg:text-left">
            Related Modules &amp; Platforms
          </h2>
          <p className="text-sm text-slate mt-2 text-center lg:text-left mb-10 max-w-xl">
            Explore other core software systems, data portals, and automated transaction integrations built for institutional volume.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {related.map((rel, idx) => (
              <ScrollAnimate key={rel.slug} delay={idx * 0.08}>
                <Link
                  href={`/services/${rel.slug}`}
                  className="group block rounded-2xl border border-fog/30 bg-white p-8 sm:p-10 transition-all hover:shadow-xl hover:border-slate hover:-translate-y-1 active:scale-[0.99] flex flex-col justify-between min-h-[320px] sm:min-h-[380px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-bold text-graphite text-xl sm:text-2xl leading-snug transition-colors">
                        {rel.title}
                      </h3>
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-fog/30 flex items-center justify-center shrink-0 transition-all group-hover:bg-graphite group-hover:text-white">
                        <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <p className="mt-3.5 text-xs sm:text-sm text-slate leading-relaxed">
                      {rel.desc}
                    </p>

                    <div className="mt-5 border-t border-fog/10 pt-4">
                      <ul className="space-y-1.5">
                        {rel.deliverables.slice(0, 2).map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-slate">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#3E4C59] shrink-0" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-fog/10 flex flex-wrap gap-1.5">
                    {rel.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-[#F4F6F8] text-[#3E4C59] border border-fog/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
