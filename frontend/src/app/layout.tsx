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
  interactiveWidget: "resizes-content",
};

export const metadata: import("next").Metadata = {
  metadataBase: new URL("https://mftechnologies.org"),
  title: {
    default: "M&F Technologies — Lending Technology for Banks & Credit Unions",
    template: "%s | M&F Technologies",
  },
  description: "Institutional-grade lending technology, credit scoring frameworks, and secure transactional middleware for modern financial institutions.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-v2.ico", sizes: "any" },
      { url: "/favicon-v2.svg", type: "image/svg+xml" },
      { url: "/icon-v2-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-v2-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-v2-144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-v2-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-v2-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon-v2.ico"],
    apple: [
      { url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "M&F Technologies — Lending Technology for Banks & Credit Unions",
    description: "Institutional-grade lending technology, credit scoring frameworks, and secure transactional middleware.",
    url: "https://mftechnologies.org",
    siteName: "M&F Technologies",
    images: [
      {
        url: "https://mftechnologies.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "M&F Technologies Logo",
      },
      {
        url: "https://mftechnologies.org/icon-512.png",
        width: 512,
        height: 512,
        alt: "M&F Technologies Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M&F Technologies",
    description: "Lending technology for banks and credit unions.",
    images: ["https://mftechnologies.org/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mftechnologies.org/#organization",
        "name": "M&F Technologies",
        "url": "https://mftechnologies.org",
        "logo": {
          "@type": "ImageObject",
          "url": "https://mftechnologies.org/icon-v2-512.png",
          "width": 512,
          "height": 512,
          "caption": "M&F Technologies Logo"
        },
        "image": "https://mftechnologies.org/og-image.png",
        "sameAs": [
          "https://mftechnologies.org"
        ]
      },
      {
        "@type": "FinancialService",
        "@id": "https://mftechnologies.org/#service",
        "name": "M&F Technologies",
        "url": "https://mftechnologies.org",
        "logo": "https://mftechnologies.org/icon-v2-512.png",
        "image": "https://mftechnologies.org/og-image.png",
        "description": "Institutional-grade lending technology, credit scoring frameworks, and secure transactional middleware.",
        "telephone": "+254748329410",
        "email": "info@mftechnologies.org",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "KE",
          "addressLocality": "Nairobi"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "17:00"
          }
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1759034301918367"
          crossOrigin="anonymous"
        ></script>
        <link rel="icon" href="/favicon-v2.ico" sizes="any" />
        <link rel="icon" href="/favicon-v2.svg" type="image/svg+xml" />
        <link rel="icon" sizes="48x48" href="/icon-v2-48.png" type="image/png" />
        <link rel="icon" sizes="96x96" href="/icon-v2-96.png" type="image/png" />
        <link rel="icon" sizes="144x144" href="/icon-v2-144.png" type="image/png" />
        <link rel="icon" sizes="192x192" href="/icon-v2-192.png" type="image/png" />
        <link rel="icon" sizes="512x512" href="/icon-v2-512.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-v2.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="M&F Technologies" />
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
