// src/app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import { SERVICES } from "@/features/landing/data/services";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { ServiceDetailClient } from "./ServiceDetailClient";

// Generate static params for all service slugs
export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} — M&F Technologies`,
    description: service.desc,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Get related services (exclude current, take 3)
  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <Nav />
      <ServiceDetailClient service={service} related={related} />
      <Footer />
    </>
  );
}
