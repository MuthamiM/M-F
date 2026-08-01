import Link from "next/link";
import { ARTICLES } from "../news/articles";

export default function GetInvolved() {
  const preview = ARTICLES.slice(0, 2);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-cloud border-b border-fog/20">
        <div className="mx-0 max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl">Get involved with us</h1>
          <p className="mt-3 text-sm text-slate max-w-2xl">We welcome contributors, partners and collaborators. Reach out to discuss partnership opportunities.</p>
        </div>
      </section>

      <section className="mx-0 max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="prose">
          <p>If you'd like to contribute or partner, please email partnerships@mftechnologies.co or use our contact form.</p>
        </div>
      </section>

      <section className="mx-0 max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-graphite">News preview</h2>
          <Link href="/news" className="text-sm font-semibold text-[#3E4C59] hover:text-[#1B222C]">See all news</Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {preview.map((a) => (
            <article key={a.id} className="rounded-lg border border-[#E6EDF2] bg-white p-4">
              <div className="text-xs text-[#6B7684]">{a.category} · {a.date}</div>
              <h3 className="mt-2 font-semibold text-[#1B222C]">{a.title}</h3>
              <p className="mt-2 text-sm text-[#3E4C59]">{a.summary}</p>
              <div className="mt-3">
                <Link href={`/news/${a.id}`} className="text-sm font-semibold text-[#1B222C]">Read</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
