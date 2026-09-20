// src/app/news/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { NewsClient } from "./NewsClient";

export const metadata = {
  title: "News & Insights — M&F Technologies",
  description: "Official news, announcements, and press releases from M&F Technologies.",
};

export default function NewsPage() {
  return (
    <>
      <Nav />
      <NewsClient />
      <Footer />
    </>
  );
}
