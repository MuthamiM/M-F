// src/app/case-studies/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { CaseStudiesClient } from "./CaseStudiesClient";

export const metadata = {
  title: "Case Studies — M&F Technologies",
  description: "Institutional impact reports and financial technology case studies from M&F Technologies.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Nav />
      <CaseStudiesClient />
      <Footer />
    </>
  );
}
