export default function WhereWeAre() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-cloud border-b border-fog/20">
        <div className="mx-0 max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl">Where we are</h1>
          <p className="mt-3 text-sm text-slate max-w-2xl">We are a remote-first team with offices and partners globally.</p>
        </div>
      </section>

      <section className="mx-0 max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="prose">
          <p>Headquarters: Remote-first (registered in UK)</p>
          <p>Partner offices: London, Nairobi, Lagos</p>
        </div>
      </section>
    </main>
  );
}
