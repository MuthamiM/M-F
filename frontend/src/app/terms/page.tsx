// src/app/terms/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { TermsClient } from "./TermsClient";

export const metadata = {
  title: "Terms of Service — M&F Technologies",
  description: "Terms and conditions for using M&F Technologies software, APIs, and services.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <TermsClient />
      <Footer />
    </>
  );
}
