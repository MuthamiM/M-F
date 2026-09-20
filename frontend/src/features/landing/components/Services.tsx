// src/features/landing/components/Services.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES } from "../data/services";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";

export type { Service } from "../data/services";
export { SERVICES } from "../data/services";

export function Services() {
  return (
    <section id="services" className="w-full px-0 py-20 bg-white sm:py-28 overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <ScrollAnimate delay={0.1}>
          <h2 className="text-center font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl">
            What we build
          </h2>
          <p className="text-center text-slate mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Explore the specialized modules, target deliverables, and technology stacks behind our custom financial software.
          </p>
        </ScrollAnimate>

        {/* 3x Larger Service Cards Layout */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
          {SERVICES.map((service, idx) => (
            <ScrollAnimate key={service.slug} delay={idx * 0.08}>
              <Link
                href={`/services/${service.slug}`}
                className="group block w-full rounded-2xl border border-fog/40 bg-white p-8 sm:p-12 md:p-14 min-h-[360px] sm:min-h-[440px] flex flex-col justify-between transition-all hover:shadow-xl hover:border-slate hover:-translate-y-1 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2"
              >
                <div>
                  {/* Service Illustration */}
                  <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-[#F4F6F8] border border-fog/20 mb-6 relative">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Title & Icon Header */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display font-bold text-graphite text-2xl sm:text-3xl tracking-tight leading-snug transition-colors">
                      {service.title}
                    </h3>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-fog/30 flex items-center justify-center shrink-0 transition-all group-hover:bg-graphite group-hover:text-white">
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Core Description */}
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate font-medium">
                    {service.desc}
                  </p>

                  {/* Key Deliverables Bullet Points */}
                  <div className="mt-6 border-t border-fog/20 pt-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate/70 mb-3">
                      Target Deliverables
                    </h4>
                    <ul className="space-y-2.5">
                      {service.deliverables.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate">
                          <CheckCircle2 className="h-4.5 w-4.5 text-[#3E4C59] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="mt-8 pt-4 border-t border-fog/20 flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-md bg-[#F4F6F8] text-[#3E4C59] border border-fog/20"
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
  );
}
