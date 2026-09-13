// src/app/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Hero } from "@/features/landing/components/Hero";
import { About } from "@/features/landing/components/About";
import { Services } from "@/features/landing/components/Services";
import { Footer } from "@/features/landing/components/Footer";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const operatingPrinciples = [
  {
    title: "Start with the lending journey",
    text: "We map the full path from application and identity checks through approval, disbursement, repayment, and collections. That gives every team a shared view of the customer and the controls around each decision.",
  },
  {
    title: "Make decisions explainable",
    text: "Credit policies are easier to govern when every score, rule, override, and approval has a traceable reason. Our systems keep decision data available for operations, risk, and compliance teams.",
  },
  {
    title: "Integrate without replacing everything",
    text: "Banks and credit providers can connect existing core systems, payment rails, bureaus, and identity services through well-defined APIs while modernizing the workflows that need the most attention.",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="overflow-x-hidden">
        <Hero />
        <ScrollAnimate>
          <About />
        </ScrollAnimate>
        <ScrollAnimate>
          <Services />
        </ScrollAnimate>
        <section className="bg-graphite px-4 py-20 text-white sm:px-8 sm:py-28 lg:px-12" aria-labelledby="approach-heading">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Our approach</span>
              <h2 id="approach-heading" className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Practical infrastructure for responsible growth
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-mist sm:text-base">
                Financial technology should make good decisions easier to repeat, inspect, and improve. We pair domain knowledge with dependable engineering so teams can move faster without losing control.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-mist"
              >
                Learn about M&amp;F Technologies
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="divide-y divide-white/15 border-y border-white/15">
              {operatingPrinciples.map((principle) => (
                <article key={principle.title} className="grid gap-4 py-7 sm:grid-cols-[1fr_1.5fr] sm:gap-10">
                  <h3 className="flex items-start gap-3 text-lg font-semibold text-white">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mist" aria-hidden="true" />
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mist">{principle.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
