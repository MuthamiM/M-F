// src/features/landing/components/Services.tsx
const SERVICES = [
  { title: "Core Lending Systems", desc: "Loan origination, servicing, and lifecycle management." },
  { title: "Credit Scoring Platforms", desc: "Configurable models for risk-based decisioning." },
  { title: "Collections Management", desc: "Workflow-driven recovery and delinquency handling." },
  { title: "Web Portals", desc: "Client and borrower-facing portals, built on your API." },
  { title: "Mobile Apps", desc: "Native and cross-platform apps for borrowers and staff." },
  { title: "CRM", desc: "Relationship and pipeline management for your lending team." },
  { title: "Document Management", desc: "Secure storage, e-signature, and audit trails." },
  { title: "Workflow Automation", desc: "Remove manual steps from underwriting and servicing." },
  { title: "API Development & Integration", desc: "Connect core systems to bureaus, payments, and partners." },
  { title: "Cloud Hosting & Support", desc: "Managed infrastructure with defined uptime SLAs." },
  { title: "System Maintenance & Training", desc: "Ongoing support and team onboarding." },
];

export function Services() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-bold text-graphite">
          What we build
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-lg border border-fog/40 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-graphite">{service.title}</h3>
              <p className="mt-2 text-sm text-slate">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
