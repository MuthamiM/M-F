import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-cloud border-b border-fog/20">
        <div className="mx-0 max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl">Documentation & API</h1>
          <p className="mt-3 text-sm text-slate max-w-2xl">Find product docs, integration guides, and the API reference below.</p>
          <div className="mt-4">
            <Link href="/" className="text-sm font-semibold text-[#3E4C59] hover:text-[#1B222C]">← Back to home</Link>
          </div>
        </div>
      </section>

      <section className="mx-0 max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E6EDF2] bg-white p-6">
            <h2 className="font-semibold text-graphite">Product Docs</h2>
            <p className="mt-2 text-sm text-slate">Guides, conceptual overviews, and integration instructions for M&amp;F products.</p>
            <div className="mt-4">
              <Link href="/docs/getting-started" className="text-sm font-semibold text-[#1B222C]">Getting started</Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#E6EDF2] bg-white p-6">
            <h2 className="font-semibold text-graphite">API Reference</h2>
            <p className="mt-2 text-sm text-slate">The OpenAPI reference for M&amp;F's platform is served from the backend.</p>
            <div className="mt-4">
              <a href="http://localhost:4000/api/docs/sitemap" className="text-sm font-semibold text-[#1B222C]">OpenAPI sitemap (local)</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
