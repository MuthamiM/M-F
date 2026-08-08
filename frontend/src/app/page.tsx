// src/app/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Hero } from "@/features/landing/components/Hero";
import { About } from "@/features/landing/components/About";
import { Services } from "@/features/landing/components/Services";
import { Footer } from "@/features/landing/components/Footer";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";

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
      </main>
      <Footer />
    </>
  );
}
