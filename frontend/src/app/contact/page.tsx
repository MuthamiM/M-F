import { ContactForm } from "../../features/landing/components/ContactForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RequestDemoButton from "@/shared/components/RequestDemoButton";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 sm:px-6">
          <div className="mx-0 max-w-6xl px-0 py-12 sm:py-20">
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </Link>
            </div>

            <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl">Contact Us</h1>
            <p className="mt-3 text-sm text-slate max-w-2xl">We'd love to hear from you. Use the form below to get in touch.</p>
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 py-16 sm:py-24">
        <div className="mx-0 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Contact form */}
          <div className="mx-0">
            <ContactForm />
          </div>

          {/* Right: Info panel */}
          <aside className="mx-0">
            <div className="rounded-lg border border-fog/30 bg-cloud p-6 sm:p-8 sticky top-20">
              <h3 className="text-lg font-semibold text-graphite">Get in touch</h3>
              <p className="mt-3 text-sm text-slate">Prefer to email or request a demo? Use the links below.</p>

              <div className="mt-6 space-y-4">
                <a href="mailto:musamwange2@gmail.com" className="block text-sm text-[#1B222C] font-medium hover:underline">
                  musamwange2@gmail.com
                </a>

                <a href="tel:0114945842" className="block text-sm text-[#1B222C] font-medium hover:underline">
                  0114945842
                </a>

                <div className="text-sm text-slate">
                  <div className="font-medium text-graphite">Hours</div>
                  <div className="mt-1">Mon–Fri, 09:00–17:00 GMT</div>
                </div>

                <div className="text-sm text-slate">
                  <div className="font-medium text-graphite">Location</div>
                  <div className="mt-1">Location to be disclosed soon</div>
                </div>
              </div>

              <div className="mt-6">
                <RequestDemoButton className="inline-block w-full rounded-md bg-graphite px-4 py-2 text-sm font-semibold text-white text-center hover:bg-slate" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
