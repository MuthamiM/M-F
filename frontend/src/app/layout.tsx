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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
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
