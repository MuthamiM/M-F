// src/features/landing/components/Hero.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { IsometricDevice } from "./IsometricDevice";

interface Slide {
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    title: "Lending Technology",
    description: "Core lending systems, credit scoring, and secure API infrastructure for banks, credit unions, and lending platforms that can't afford to get this wrong."
  },
  {
    title: "About Us",
    description: "We design, build, and maintain institutional-grade financial modules, automating critical origination, underwriting, and collections workflows."
  },
  {
    title: "Our Services",
    description: "From custom loan management and compliance engines to portal interfaces, we deploy secure architectures optimized for maximum speed and scale."
  }
];

export function Hero() {
  const [active, setActive] = useState(0);
  const router = useRouter();

  // Auto-play slides with automatic interval reset on active change
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [active]);

  const activeSlide = SLIDES[active];

  const handleCTA = () => {
    // Navigate to the request demo page where the demo flow is implemented
    router.push("/request-demo");
  };

  return (
    <section id="home" className="relative overflow-hidden bg-white pt-6 sm:pt-10">
      <div className="relative w-full grid grid-cols-1 items-center gap-8 px-4 pb-16 pt-4 sm:px-6 sm:gap-12 sm:pb-24 sm:pt-8 md:grid-cols-2 md:pb-32">
        {/* Text content */}
        <div className="min-h-[220px] sm:min-h-[300px] flex flex-col justify-center order-2 md:order-1">
          {/* Keyed element triggers animation on active slide change */}
          <div key={active} className="flex flex-col">
            <h1 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-5xl md:text-6xl min-h-[72px] sm:min-h-[120px] animate-fade-in-up">
              {activeSlide.title}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-md text-sm sm:text-base leading-relaxed text-slate min-h-[80px] sm:min-h-[100px] animate-fade-in-up" style={{ animationDelay: "80ms" }}>
              {activeSlide.description}
            </p>
          </div>
          <div className="mt-6 sm:mt-8">
            <Button variant="primary" onClick={handleCTA} className="rounded-full px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base w-full sm:w-auto">
              Request Demo
            </Button>
          </div>

          <div className="mt-8 sm:mt-10 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer focus:outline-none ${
                  active === i ? "w-6 bg-graphite" : "w-2.5 bg-fog/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Illustration */}
          <div className="relative order-1 md:order-2">
          <div
            className="absolute -right-16 -top-16 -z-10 h-[130%] w-[130%] bg-cloud sm:-right-24 sm:-top-24 sm:h-[140%] sm:w-[140%]"
            style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div className="max-w-[280px] mx-auto sm:max-w-[360px] md:max-w-lg">
            <IsometricDevice />
          </div>
        </div>
      </div>
    </section>
  );
}
