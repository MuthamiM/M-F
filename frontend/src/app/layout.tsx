// src/app/layout.tsx
import "../shared/theme/tokens.css"; // generated — see scripts/build-tokens.js
import "./globals.css";
import type { Viewport } from "next";
import { CookieBanner } from "@/shared/components/CookieBanner";
import { ChatWidget } from "@/shared/components/ChatWidget";
import { ServiceWorkerRegister } from "@/shared/components/ServiceWorkerRegister";
import { InstallBanner } from "@/shared/components/InstallBanner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export const metadata = {
  title: "M&F Technologies",
  description: "Lending technology for banks and credit unions.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "M&F Technologies",
    "url": "https://mftechnologies.org",
    "logo": "https://mftechnologies.org/icon-192.png",
    "image": "https://mftechnologies.org/icon-512.png",
    "description": "Institutional-grade lending technology, credit scoring frameworks, and secure transactional middleware.",
    "telephone": "+254748329410",
    "email": "info@mftechnologies.org",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "24",
      "bestRating": "5"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8361234221044798"
          crossOrigin="anonymous"
        ></script>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body text-graphite">
        {children}
        <CookieBanner />
        <ChatWidget />
        <ServiceWorkerRegister />
        <InstallBanner />
      </body>
    </html>
  );
}
