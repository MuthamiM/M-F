"use client";

import { useState } from "react";

const LINKS = [
  { label: "Home", index: 0 },
  { label: "About", index: 1 },
  { label: "Services", index: 2 },
  { label: "Contact", href: "#contact" },
];

interface NavProps {
  active: number;
  setActive: (index: number) => void;
}

export function Nav({ active, setActive }: NavProps) {
  const [dark, setDark] = useState(false);

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2">
        <span className="relative flex h-8 w-8 items-center justify-center">
          <span className="absolute h-8 w-8 rounded-full bg-slate" />
          <span className="absolute right-0 h-4 w-4 rounded-full bg-graphite" />
        </span>
        <span className="text-lg font-semibold text-graphite">
          M&amp;F <span className="font-normal text-silver">Technologies</span>
        </span>
      </div>

      <nav className="hidden items-center gap-10 md:flex">
        {LINKS.map((link) => {
          if (link.index !== undefined) {
            const isActive = active === link.index;
            return (
              <button
                key={link.label}
                onClick={() => setActive(link.index)}
                className={`text-sm font-semibold transition-colors cursor-pointer focus:outline-none ${
                  isActive ? "text-graphite border-b-2 border-graphite" : "text-slate hover:text-graphite"
                }`}
              >
                {link.label}
              </button>
            );
          } else {
            return (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate transition-colors hover:text-graphite"
              >
                {link.label}
              </a>
            );
          }
        })}
      </nav>

      <button
        type="button"
        role="switch"
        aria-checked={dark}
        onClick={() => setDark((d) => !d)}
        className="relative h-7 w-14 rounded-full bg-graphite transition-colors cursor-pointer"
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            dark ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>
    </header>
  );
}
