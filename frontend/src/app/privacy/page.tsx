// src/app/privacy/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { PrivacyClient } from "./PrivacyClient";

export const metadata = {
  title: "Privacy Policy — M&F Technologies",
  description: "Learn how M&F Technologies collects, protects, and handles institutional data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <PrivacyClient />
      <Footer />
    </>
  );
}
