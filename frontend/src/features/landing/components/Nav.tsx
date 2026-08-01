// src/features/landing/components/Nav.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/", hash: "#home" },
  { label: "About", href: "/#about", hash: "#about" },
  { label: "Services", href: "/#services", hash: "#services" },
  { label: "Careers", href: "/careers", hash: "" },
  { label: "Contact", href: "/contact", hash: "" },
];

const SERVICES_LIST = [
  { label: "Workflow Automation", href: "/services/workflow-automation" },
  { label: "Docs & API", href: "/docs" },
  { label: "Security & Compliance", href: "/security" },
  { label: "Status", href: "/status" },
];

const ABOUT_LIST = [
  { label: "About", href: "/#about" },
  { label: "Who we are", href: "/where-we-are" },
  { label: "Get involved", href: "/get-involved" },
];

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const pathname = usePathname();

  // ── Lock body scroll when drawer is open ──
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // ── Sync hash from URL on mount / route change ──
  useEffect(() => {
    const sync = () => {
      if (window.location.hash) {
        setActiveHash(window.location.hash);
      } else if (pathname === "/") {
        setActiveHash("#home");
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  // ── Handle nav click ──
  const handleNav = useCallback((href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/#")) {
      const hash = href.replace("/", "");
      setActiveHash(hash);
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // ── Active link detection ──
  const isActive = useCallback(
    (link: (typeof LINKS)[0]) => {
      if (!pathname) return false;
      if (link.href === "/careers") return pathname === "/careers";
      if (link.label === "Services") {
        if (pathname.startsWith("/services/")) return true;
        if (pathname === "/" && activeHash === "#services") {
          try {
            const el = document.querySelector("#services");
            if (el) {
              const rect = el.getBoundingClientRect();
              // consider it active only if the section is near the top of viewport
              return rect.top >= 0 && rect.top < window.innerHeight * 0.6;
            }
          } catch (e) {
            return false;
          }
        }
        return false;
      }
      if (pathname === "/" && link.hash) return activeHash === link.hash;
      return false;
    },
    [pathname, activeHash]
  );

  return (
    <>
      <header className="sticky top-0 w-full border-b border-[#9AA5B1]/20 bg-white/95 backdrop-blur-md z-40">
        <div className="mx-0 flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center">
              <span className="absolute h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#3E4C59]" />
              <span className="absolute right-0 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-[#1B222C]" />
            </span>
            <span className="text-base sm:text-lg font-semibold text-[#1B222C]">
              M&amp;F <span className="font-normal text-[#6B7684]">Technologies</span>
            </span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {LINKS.map((link) => {
              const active = isActive(link);
              // About and Services render dropdowns on hover
              if (link.label === "About") {
                return (
                  <div key={link.label} className="relative group">
                    <Link
                      href={link.href}
                      onClick={() => handleNav(link.href)}
                      className={`py-1.5 text-sm font-semibold transition-colors hover:text-[#1B222C] cursor-pointer ${
                        active ? "text-[#1B222C] font-bold underline underline-offset-4" : "text-[#3E4C59]"
                      }`}
                    >
                      {link.label}
                    </Link>

                    <div className="absolute left-0 top-full mt-2 w-56 rounded-md bg-white border border-[#E6EDF2] shadow-md z-50 hidden group-hover:block">
                      <div className="flex flex-col">
                        {ABOUT_LIST.map((s) => (
                          <Link key={s.label} href={s.href} onClick={() => handleNav(s.href)} className="px-4 py-3 text-sm text-[#3E4C59] hover:bg-cloud hover:text-[#1B222C]">
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (link.label === "Services") {
                return (
                  <div key={link.label} className="relative group">
                    <Link
                      href={link.href}
                      onClick={() => handleNav(link.href)}
                      className={`py-1.5 text-sm font-semibold transition-colors hover:text-[#1B222C] cursor-pointer ${
                        active ? "text-[#1B222C] font-bold underline underline-offset-4" : "text-[#3E4C59]"
                      }`}
                    >
                      {link.label}
                    </Link>

                    <div className="absolute left-0 top-full mt-2 w-56 rounded-md bg-white border border-[#E6EDF2] shadow-md z-50 hidden group-hover:block">
                      <div className="flex flex-col">
                        {SERVICES_LIST.map((s) => (
                          <Link key={s.label} href={s.href} onClick={() => handleNav(s.href)} className="px-4 py-3 text-sm text-[#3E4C59] hover:bg-cloud hover:text-[#1B222C]">
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`py-1.5 text-sm font-semibold transition-colors hover:text-[#1B222C] hover:underline cursor-pointer ${
                    active ? "text-[#1B222C] font-bold underline underline-offset-4" : "text-[#3E4C59]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Action ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="http://localhost:4000/api/docs/sitemap"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#1B222C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3E4C59] transition-colors"
            >
              API Reference
            </a>
          </div>

          {/* ── Mobile Hamburger Trigger (Phone only) ── */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex items-center justify-center p-2 text-[#1B222C] hover:text-[#3E4C59] focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* ── Mobile Full Screen Overlay Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col w-full h-full min-h-screen overflow-y-auto px-6 py-4 md:hidden">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#9AA5B1]/20 shrink-0">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute h-7 w-7 rounded-full bg-[#3E4C59]" />
                <span className="absolute right-0 h-3.5 w-3.5 rounded-full bg-[#1B222C]" />
              </span>
              <span className="text-base font-semibold text-[#1B222C]">
                M&amp;F <span className="font-normal text-[#6B7684]">Technologies</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 text-[#1B222C] hover:text-[#3E4C59] focus:outline-none"
            >
              <X className="h-6.5 w-6.5" />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <nav className="flex flex-col mt-4">
            {LINKS.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`text-xl font-semibold py-4 border-b border-[#9AA5B1]/15 flex items-center justify-between ${
                    active ? "text-[#1B222C]" : "text-[#3E4C59]"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-[#1B222C]" />}
                </Link>
              );
            })}

            {/* Services expanded list */}
            <div className="mt-2">
              <div className="text-sm text-[#6B7684] px-2 py-2">Services</div>
              {SERVICES_LIST.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-2 text-base py-3 border-b border-[#9AA5B1]/10 text-[#3E4C59]"
                >
                  {s.label}
                </Link>
              ))}
            </div>

            {/* Extra links */}
            <div className="mt-4">
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="pl-2 text-base py-3 border-b border-[#9AA5B1]/10 text-[#3E4C59]">
                About
              </Link>
              <Link href="/where-we-are" onClick={() => setMobileMenuOpen(false)} className="pl-2 text-base py-3 border-b border-[#9AA5B1]/10 text-[#3E4C59]">
                Where we are
              </Link>
              <Link href="/get-involved" onClick={() => setMobileMenuOpen(false)} className="pl-2 text-base py-3 border-b border-[#9AA5B1]/10 text-[#3E4C59]">
                Get involved with us
              </Link>
              <Link href="/request-demo" onClick={() => setMobileMenuOpen(false)} className="pl-2 text-base py-3 border-b border-[#9AA5B1]/10 text-[#3E4C59]">
                Request a demo
              </Link>
            </div>

            {/* Contact CTA */}
            <div className="mt-6 px-2">
              <a href="mailto:contact@mftechnologies.co" className="w-full rounded-lg bg-[#1B222C] py-3 text-center text-sm font-semibold text-white block hover:bg-[#3E4C59] transition-colors">
                Contact Us
              </a>
            </div>
          </nav>

          {/* Bottom Action */}
          <div className="mt-auto pt-8 pb-6 shrink-0">
            <a
              href="http://localhost:4000/api/docs/sitemap"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-[#1B222C] py-4 text-center text-sm font-semibold text-white block hover:bg-[#3E4C59] transition-colors"
            >
              API Reference
            </a>
          </div>
        </div>
      )}
    </>
  );
}
