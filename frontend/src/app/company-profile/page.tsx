// src/app/company-profile/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { CompanyProfileClient } from "./CompanyProfileClient";

export const metadata = {
  title: "Company Profile & Institutional Capabilities — M&F Technologies",
  description: "Download and review the official M&F Technologies corporate profile, architecture specifications, audited operational metrics, SOC 2 compliance, and institutional lending modules.",
  openGraph: {
    title: "M&F Technologies — Corporate Profile & Institutional Capabilities",
    description: "Institutional lending infrastructure, automated credit decisioning, and secure transactional middleware for commercial banks and microfinance institutions.",
    url: "https://mftechnologies.org/company-profile",
  }
};

export default function CompanyProfilePage() {
  return (
    <>
      <Nav />
      <CompanyProfileClient />
      <Footer />
    </>
  );
}
