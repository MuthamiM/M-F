// src/app/news/[id]/page.tsx
import { notFound } from "next/navigation";
import { ARTICLES } from "../articles";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { ArticleDetailClient } from "./ArticleDetailClient";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) {
    return { title: "Article Not Found" };
  }
  return {
    title: `${article.title} — M&F Technologies`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.date,
      authors: ["M&F Technologies Engineering Team"],
      url: `https://mftechnologies.org/news/${article.id}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  // Related articles: same category first or closest recent articles, excluding current
  const related = ARTICLES.filter((a) => a.id !== article.id)
    .sort((a, b) => {
      if (a.category === article.category && b.category !== article.category) return -1;
      if (a.category !== article.category && b.category === article.category) return 1;
      return 0;
    })
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "M&F Technologies",
      url: "https://mftechnologies.org",
    },
    publisher: {
      "@type": "Organization",
      name: "M&F Technologies",
      logo: {
        "@type": "ImageObject",
        url: "https://mftechnologies.org/icon-v2-512.png",
      },
    },
    mainEntityOfPage: `https://mftechnologies.org/news/${article.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <ArticleDetailClient article={article} related={related} />
      <Footer />
    </>
  );
}
