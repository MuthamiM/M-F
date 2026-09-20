// src/app/security/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { SecurityClient } from "./SecurityClient";

export const metadata = {
  title: "Security & Compliance — M&F Technologies",
  description: "Bank-grade security, data protection, and compliance standards at M&F Technologies.",
};

export default function SecurityPage() {
  return (
    <>
      <Nav />
      <SecurityClient />
      <Footer />
    </>
  );
}
