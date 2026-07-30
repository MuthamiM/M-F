// src/app/layout.tsx
import "../shared/theme/tokens.css"; // generated — see scripts/build-tokens.js
import "./globals.css";

export const metadata = {
  title: "M&F Technologies",
  description: "Lending technology for banks and credit unions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body text-graphite">{children}</body>
    </html>
  );
}
