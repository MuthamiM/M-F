"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequestDemoButton({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstRef.current?.focus(), 0);
    }
  }, [open]);

  function close() {
    setOpen(false);
  }

  function submit() {
    try {
      sessionStorage.setItem("demoPrefill", JSON.stringify(form));
    } catch (e) {
      // ignore
    }
    router.push("/request-demo");
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        Request a demo
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div role="dialog" aria-modal="true" aria-label="Request a demo" className="w-full max-w-lg rounded bg-white p-6">
            <h3 className="text-lg font-semibold">Request a demo</h3>
            <p className="text-sm text-slate mt-1">Tell us a little about what you'd like to demo.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-graphite">Name</label>
                <input ref={firstRef} className="mt-1 block w-full rounded-md border px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite">Email</label>
                <input className="mt-1 block w-full rounded-md border px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite">Company (optional)</label>
                <input className="mt-1 block w-full rounded-md border px-3 py-2" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite">Message (optional)</label>
                <textarea className="mt-1 block w-full rounded-md border px-3 py-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
            </div>

            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={close} className="rounded-md border px-4 py-2">Cancel</button>
              <button onClick={submit} className="rounded-md bg-graphite px-4 py-2 text-white">Continue</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
