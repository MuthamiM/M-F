import { About } from "../../features/landing/components/About";
import Link from "next/link";

export default function WhereWeAre() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 sm:px-6">
          <div className="mx-0 max-w-6xl px-0 py-12 sm:py-20">
            <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl">Who We Are</h1>
            <p className="mt-3 text-sm text-slate max-w-2xl">Learn about M&amp;F Technologies' mission, values, and the team building institutional financial infrastructure.</p>
            <div className="mt-4">
              <Link href="/" className="text-sm font-semibold text-[#3E4C59] hover:text-[#1B222C]">← Back to home</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reuse the About section component */}
      <About />

      <section className="mx-0 max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="prose">
          <h2>Where we are</h2>
          <p>We are a remote-first team with registered presence and partner offices globally.</p>
          <p>Headquarters: Remote-first (registered in UK)</p>
          <p>Partner offices: London, Nairobi, Lagos</p>
        </div>
      </section>
    </main>
  );
}
