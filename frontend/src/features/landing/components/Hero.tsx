"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Nav } from "./Nav";
import { IsometricDevice } from "./IsometricDevice";

const SLIDES = 3;

export function Hero() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-white">
      <Nav />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-8 md:grid-cols-2 md:pb-32">
        <div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-graphite md:text-6xl">
            About Us
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate">
            Core lending systems, credit scoring, and secure API
            infrastructure for banks, credit unions, and lending platforms
            that can&apos;t afford to get this wrong.
          </p>
          <div className="mt-8">
            <Button variant="primary" className="rounded-full px-8 py-3">
              Learn more
            </Button>
          </div>

          <div className="mt-10 flex gap-2">
            {Array.from({ length: SLIDES }).map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  active === i ? "w-6 bg-graphite" : "w-2.5 bg-fog/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -right-24 -top-24 -z-10 h-[140%] w-[140%] bg-cloud"
            style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <IsometricDevice />
        </div>
      </div>
    </section>
  );
}
