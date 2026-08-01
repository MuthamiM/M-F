// src/app/page.tsx
// Routes stay thin — they assemble feature components, no logic of their own.

import { Nav } from "@/features/landing/components/Nav";
import { Hero } from "@/features/landing/components/Hero";
import { About } from "@/features/landing/components/About";
import { Services } from "@/features/landing/components/Services";
import { Footer } from "@/features/landing/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
      </main>
      <Footer />
    </>
  );
}
