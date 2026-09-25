// src/app/faq/page.tsx
import type { Metadata } from "next";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { FaqClient } from "./FaqClient";
import { FAQ_ITEMS } from "@/shared/data/faqData";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) — Lending Infrastructure & Scoring",
  description:
    "Comprehensive answers regarding M&F Technologies core lending systems, credit scoring models, credit reference bureau (CRB) integrations, security standards, and 99.95% uptime SLAs.",
  alternates: {
    canonical: "https://mftechnologies.org/faq",
  },
  openGraph: {
    title: "FAQ — M&F Technologies Institutional Lending Platform",
    description:
      "Find answers to common questions about core lending systems, credit scoring frameworks, security compliance, and core banking integrations.",
    url: "https://mftechnologies.org/faq",
    siteName: "M&F Technologies",
    images: [
      {
        url: "https://mftechnologies.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "M&F Technologies FAQ",
      },
    ],
  },
};

export default function FaqPage() {
  // Generate Schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${item.answer} ${
          item.bulletPoints ? item.bulletPoints.map((b) => `• ${b}`).join(" ") : ""
        }`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav />
      <main className="overflow-x-hidden pt-16 sm:pt-20">
        <FaqClient />
      </main>
      <Footer />
    </>
  );
}
