// src/app/about/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { AboutClient } from "./AboutClient";

export const metadata = {
  title: "About Us — M&F Technologies",
  description: "Learn about M&F Technologies — our mission, leadership, and commitment to building institutional-grade lending technology for banks and credit unions worldwide.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <AboutClient />
      <Footer />
    </>
  );
}
