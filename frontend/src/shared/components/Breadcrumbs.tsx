// src/shared/components/Breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mftechnologies.org",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: item.href ? `https://mftechnologies.org${item.href}` : undefined,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs text-[#6B7684]">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-[#1B222C] transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div key={idx} className="flex items-center space-x-2">
              <ChevronRight className="h-3 w-3 text-[#9AA5B1]" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[#1B222C] truncate max-w-[200px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#1B222C] transition-colors truncate max-w-[150px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
