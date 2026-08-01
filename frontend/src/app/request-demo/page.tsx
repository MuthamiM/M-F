import { useState } from "react";

export default function RequestDemoPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-cloud border-b border-fog/20">
        <div className="mx-0 max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl">Request a Demo</h1>
          <p className="mt-3 text-sm text-slate max-w-2xl">Tell us about your needs and we'll reach out to schedule a demo.</p>
        </div>
      </section>

      <section className="mx-0 max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-graphite">Name</label>
            <input className="mt-1 block w-full rounded-md border px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-graphite">Email</label>
            <input className="mt-1 block w-full rounded-md border px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-graphite">Company</label>
            <input className="mt-1 block w-full rounded-md border px-3 py-2" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-graphite">Message</label>
            <textarea className="mt-1 block w-full rounded-md border px-3 py-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <div>
            <button type="button" className="inline-flex items-center rounded-lg bg-graphite px-6 py-3 text-sm font-semibold text-white" onClick={() => alert('Demo request submitted.')}>Request Demo</button>
          </div>
        </form>
      </section>
    </main>
  );
}
