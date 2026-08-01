// src/app/status/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { StatusClient } from "./StatusClient";

export const metadata = {
  title: "System Status — M&F Technologies",
  description: "Live operational status and platform availability metrics for M&F Technologies.",
};

export default function StatusPage() {
  return (
    <>
      <Nav />
      <StatusClient />
      <Footer />
    </>
  );
}
