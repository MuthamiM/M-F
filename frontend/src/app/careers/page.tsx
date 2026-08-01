// src/app/careers/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { CareersClient } from "./CareersClient";

export const metadata = {
  title: "Careers — M&F Technologies",
  description: "Explore open positions at M&F Technologies. Join our team building institutional-grade lending technology.",
};

export default function CareersPage() {
  return (
    <>
      <Nav />
      <CareersClient />
      <Footer />
    </>
  );
}
