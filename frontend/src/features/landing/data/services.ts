// src/features/landing/data/services.ts
// Shared service data — used by both the Services component and the service detail pages.
// This file is NOT a client component, so it can be imported by server components too.

export interface Service {
  slug: string;
  title: string;
  desc: string;
  details: string;
  deliverables: string[];
  techStack: string[];
}

export const SERVICES: Service[] = [
  { 
    slug: "core-lending-systems",
    title: "Core Lending Systems", 
    desc: "Loan origination, servicing, and lifecycle management.",
    details: "Our core lending engine handles the entire loan lifecycle from initial application and underwriting to disbursal, interest calculation, servicing, and final maturity. Built on a double-entry ledger database schema, it guarantees absolute transactional integrity, real-time auditability, and flawless integration with general ledgers.",
    deliverables: ["Loan origination module", "Interest calculation engine", "Servicing & maturity workflows", "General ledger integration", "Double-entry transactional ledger"],
    techStack: ["Node.js", "PostgreSQL", "Redis", "Docker"]
  },
  { 
    slug: "credit-scoring-platforms",
    title: "Credit Scoring Platforms", 
    desc: "Configurable models for risk-based decisioning.",
    details: "An advanced decision engine that aggregates data from traditional credit bureaus, alternative payment networks, and custom telemetry data. Operators can define configurable risk scoring weight trees, rule matrices, and cutoff thresholds to automate instant-approvals or flag high-risk accounts for manual underwriting.",
    deliverables: ["Risk scoring weight trees", "Rule matrix builder", "Bureau data aggregation", "Auto-approval engine", "Manual underwriting flagging"],
    techStack: ["Python", "TensorFlow", "PostgreSQL", "REST APIs"]
  },
  { 
    slug: "collections-management",
    title: "Collections Management", 
    desc: "Workflow-driven recovery and delinquency handling.",
    details: "Delinquency tracking system designed to optimize recovery rates. Automatically segments overdue accounts by risk tier, triggers automated reminders via SMS, email, and automated dialers, and manages agent queues with workflow escalation from soft collections to legal recovery.",
    deliverables: ["Delinquency tracker", "SMS/email automation", "Agent queue management", "Escalation workflows", "Recovery analytics"],
    techStack: ["Node.js", "RabbitMQ", "Twilio", "PostgreSQL"]
  },
  { 
    slug: "web-portals",
    title: "Web Portals", 
    desc: "Client and borrower-facing portals, built on your API.",
    details: "Responsive web portals for borrowers and credit brokers. Features include real-time application trackers, secure document upload zones, self-service loan modifications, payment scheduling (cards/mobile money), and instant balance lookups.",
    deliverables: ["Borrower self-service portal", "Application tracker", "Document upload system", "Payment scheduling", "Balance lookup dashboard"],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
  },
  { 
    slug: "mobile-apps",
    title: "Mobile Apps", 
    desc: "Native and cross-platform apps for borrowers and staff.",
    details: "Secure Android and iOS applications built for high performance and offline operations. Empowers field agents to capture KYC/KYB data on the ground, and provides borrowers with push notifications, wallet management, and biometrically secured micro-lending access.",
    deliverables: ["iOS & Android apps", "Offline-first architecture", "KYC/KYB capture", "Push notifications", "Biometric authentication"],
    techStack: ["React Native", "Expo", "SQLite", "Firebase"]
  },
  { 
    slug: "crm",
    title: "CRM", 
    desc: "Relationship and pipeline management for your lending team.",
    details: "A pipeline manager tailored for credit institutions. Tracks borrower communications, manages sales officer tasks, maps conversion rates across campaigns, and features pre-built integrations with phone systems and helpdesks.",
    deliverables: ["Sales pipeline dashboard", "Communication logs", "Campaign analytics", "Phone system integration", "Task management"],
    techStack: ["Next.js", "PostgreSQL", "WebSockets", "Redis"]
  },
  { 
    slug: "document-management",
    title: "Document Management", 
    desc: "Secure storage, e-signature, and audit trails.",
    details: "Secure, encrypted cloud storage complying with data privacy regulations. Includes integrated OCR parsing for automated ID/statement reading, version tracking, e-signature signing flows, and immutable access audit logging.",
    deliverables: ["Encrypted cloud storage", "OCR parsing engine", "E-signature workflows", "Version tracking", "Immutable audit logs"],
    techStack: ["AWS S3", "Tesseract OCR", "Node.js", "PostgreSQL"]
  },
  { 
    slug: "workflow-automation",
    title: "Workflow Automation", 
    desc: "Remove manual steps from underwriting and servicing.",
    details: "Eliminates operational bottlenecks by automating routine verification tasks. Automate AML/PEP watchlist checks, trigger income verification checks via bank APIs, and automatically route high-value files to senior credit committees.",
    deliverables: ["AML/PEP watchlist checks", "Income verification automation", "Committee routing rules", "Status notifications", "Approval chain builder"],
    techStack: ["Node.js", "Bull Queue", "REST APIs", "PostgreSQL"]
  },
  { 
    slug: "api-development",
    title: "API Development & Integration", 
    desc: "Connect core systems to bureaus, payments, and partners.",
    details: "Standardized, highly secured JSON REST and GraphQL APIs. Facilitates seamless connection of your lending stack to external ecosystem nodes including payment networks, third-party underwriting services, and corporate enterprise systems.",
    deliverables: ["REST API design", "GraphQL endpoints", "Payment gateway integration", "Bureau API connections", "Enterprise system bridges"],
    techStack: ["Node.js", "Express/Fastify", "GraphQL", "OpenAPI"]
  },
  { 
    slug: "cloud-hosting",
    title: "Cloud Hosting & Support", 
    desc: "Managed infrastructure with defined uptime SLAs.",
    details: "High-availability hosting platforms set up on premium cloud infrastructure (AWS/Azure) under a 99.99% uptime SLA. Features isolated database pools, continuous automated backups, and 24/7 security monitoring.",
    deliverables: ["AWS/Azure infrastructure", "99.99% uptime SLA", "Automated backups", "Security monitoring", "Isolated DB pools"],
    techStack: ["AWS", "Terraform", "Docker", "CloudWatch"]
  },
  { 
    slug: "system-maintenance",
    title: "System Maintenance & Training", 
    desc: "Ongoing support and team onboarding.",
    details: "Comprehensive training and enablement programs for your IT and risk officers. Ongoing support covers emergency patches, security updates, feature requests, and dedicated Slack/Teams response lines.",
    deliverables: ["Staff training programs", "Emergency patching", "Security updates", "Feature request pipeline", "Dedicated support channels"],
    techStack: ["Jira", "Confluence", "Slack", "PagerDuty"]
  },
];
