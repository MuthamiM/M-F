// src/shared/data/faqData.ts

export interface FaqCategory {
  id: string;
  label: string;
  description: string;
}

export interface FaqItem {
  id: string;
  category: string;
  categoryLabel: string;
  question: string;
  answer: string;
  bulletPoints?: string[];
  keywords: string[];
  actionLink?: {
    label: string;
    href: string;
  };
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "all", label: "All Questions", description: "Comprehensive answers across our platform" },
  { id: "general", label: "General & Architecture", description: "Company overview and platform fundamentals" },
  { id: "lending", label: "Core Lending Systems", description: "Loan origination, servicing, and collections" },
  { id: "scoring", label: "Credit Scoring & Risk", description: "Automated underwriting, rules, and CRB bureaus" },
  { id: "security", label: "Security & Compliance", description: "Encryption, data residency, and central bank compliance" },
  { id: "integrations", label: "APIs & Core Banking", description: "CBS connectors, payment switches, and developer tools" },
  { id: "implementation", label: "SLAs & Implementation", description: "Onboarding timelines, uptime guarantees, and support" },
];

export const FAQ_ITEMS: FaqItem[] = [
  // ── General & Architecture ──
  {
    id: "faq-what-is-mf",
    category: "general",
    categoryLabel: "General & Architecture",
    question: "What is M&F Technologies and who are your primary clients?",
    answer: "M&F Technologies develops institutional-grade lending technology, automated credit scoring engines, and transactional middleware. We serve commercial banks, microfinance banks (MFBs), credit unions (SACCOs), digital lenders, and asset financing companies across Africa and emerging markets.",
    bulletPoints: [
      "Modular microservices architecture built for scale and high concurrency",
      "Full coverage from loan origination (LOS) to loan management (LMS) and collections",
      "Immutable double-entry bookkeeping ledger with sub-second reconciliations",
    ],
    keywords: ["what is", "about", "company", "clients", "banks", "sacco", "mfb", "overview", "who we are"],
    actionLink: { label: "Learn About M&F", href: "/about" },
  },
  {
    id: "faq-cloud-vs-onprem",
    category: "general",
    categoryLabel: "General & Architecture",
    question: "Does M&F Technologies support on-premises deployment or only cloud hosting?",
    answer: "We support both fully managed cloud hosting and on-premises private cloud deployments. To comply with central bank data sovereignty mandates, tier-1 financial institutions can host M&F within their private data centers or sovereign cloud providers with dedicated hardware security modules (HSM).",
    bulletPoints: [
      "Managed Cloud: High-availability multi-region clusters with automated failover",
      "On-Premises: Docker/Kubernetes containerized appliances for internal private clouds",
      "Hybrid: Cloud customer-facing portals connected via secure IPSec/mTLS tunnels to on-prem ledgers",
    ],
    keywords: ["cloud", "on-premise", "hosting", "data center", "deployment", "sovereignty", "datacenter", "private cloud"],
    actionLink: { label: "Explore Hosting Services", href: "/services/cloud-hosting" },
  },
  {
    id: "faq-explainable-decisions",
    category: "general",
    categoryLabel: "General & Architecture",
    question: "How does M&F ensure automated credit decisions are explainable and auditable?",
    answer: "Every automated decision—including rule evaluations, bureau score lookups, policy overrides, and tier calculations—is recorded with a cryptographic timestamp in an audit log. Compliance and risk officers can inspect the exact variables and rule weights that produced any loan approval or rejection.",
    bulletPoints: [
      "Zero 'black box' algorithms: all scoring weights and decision rules are visible to risk teams",
      "Complete historical audit trails for central bank regulatory examinations",
      "Adverse action explanation generators for customer disclosure compliance",
    ],
    keywords: ["explainable", "audit", "compliance", "transparency", "decisioning", "black box", "rules", "traceable"],
    actionLink: { label: "View Security & Governance", href: "/security" },
  },

  // ── Core Lending Systems ──
  {
    id: "faq-loan-products-supported",
    category: "lending",
    categoryLabel: "Core Lending Systems",
    question: "Which loan products and interest calculation methods does the Core Lending Engine support?",
    answer: "Our Core Lending Engine is product-agnostic and parameter-driven. You can configure consumer personal loans, salary-backed check-offs, SME asset financing, revolving credit lines, invoice discounting, and community group loans with joint liability.",
    bulletPoints: [
      "Interest methods: Reducing balance, flat rate, rule of 78, interest-only with bullet repayment",
      "Flexible tenures: Daily, weekly, bi-weekly, monthly, or customized seasonal balloon schedules",
      "Automated moratoriums, restructuring schedules, and grace period workflows",
    ],
    keywords: ["products", "interest", "reducing balance", "flat rate", "salary advance", "sme", "bnpl", "loans"],
    actionLink: { label: "Core Lending Architecture", href: "/services/core-lending-systems" },
  },
  {
    id: "faq-automated-disbursement",
    category: "lending",
    categoryLabel: "Core Lending Systems",
    question: "How does automated loan disbursement and repayment matching operate?",
    answer: "M&F integrates directly with mobile money switches (e.g., M-Pesa B2C/C2B, Airtel Money), EFT/RTGS interbank settlement systems, and card payment gateways. When a loan passes automated underwriting and verification, disbursement triggers automatically in under 5 seconds.",
    bulletPoints: [
      "Instant B2C payouts directly into customer mobile wallets or bank accounts",
      "C2B automated payment receipting with Paybill/Till instant transaction deduplication",
      "Automated split allocation: fees first, then penalty, interest, and principal reduction",
    ],
    keywords: ["disbursement", "repayment", "mpesa", "c2b", "b2c", "eft", "rtgs", "payouts", "matching", "instant"],
    actionLink: { label: "Request a Demo", href: "/request-demo" },
  },
  {
    id: "faq-delinquency-collections",
    category: "lending",
    categoryLabel: "Core Lending Systems",
    question: "How does the Collections Management module handle overdue accounts and recovery?",
    answer: "The Collections Management module orchestrates automated early intervention and recovery workflows based on days past due (DPD). It combines digital omni-channel messaging with field agent task allocation and debt restructuring pipelines.",
    bulletPoints: [
      "Early warning triggers: Automated SMS, WhatsApp, and email payment reminders before and on due date",
      "Dynamic penalty rules: Configurable statutory penalty caps and fee ceilings",
      "Escalation queues: Automatic assignment to call center queues or legal recovery partners",
    ],
    keywords: ["collections", "delinquency", "overdue", "default", "recovery", "dpd", "penalty", "sms reminders"],
    actionLink: { label: "Collections Module Details", href: "/services/collections-management" },
  },

  // ── Credit Scoring & Risk ──
  {
    id: "faq-credit-scoring-model",
    category: "scoring",
    categoryLabel: "Credit Scoring & Risk",
    question: "How does the M&F Credit Scoring Platform calculate borrower risk and credit limits?",
    answer: "Our scoring platform combines traditional credit metrics with alternative data. It ingests banking statements, mobile money transaction statements, CRB bureau reports, and borrower demographic signals to generate a credit score and recommended borrowing limit within 3 seconds.",
    bulletPoints: [
      "Alternative data ingestion: Mobile money statement parsing (M-Pesa, Airtel) for income verification",
      "Debt-to-Income (DTI) and Debt Service Coverage Ratio (DSCR) automated verification",
      "Continuous machine learning feedback loops calibrated against real portfolio repayment performance",
    ],
    keywords: ["credit scoring", "underwriting", "risk", "algorithm", "limits", "income", "alternative data"],
    actionLink: { label: "Credit Scoring Platform", href: "/services/credit-scoring-platforms" },
  },
  {
    id: "faq-crb-integration",
    category: "scoring",
    categoryLabel: "Credit Scoring & Risk",
    question: "Does M&F connect directly to regional Credit Reference Bureaus (CRB)?",
    answer: "Yes. We maintain certified, bi-directional connectors to regional Credit Reference Bureaus including TransUnion, Metropol, and Creditinfo. The platform automates both real-time credit report pulls during origination and automated monthly batch portfolio reporting.",
    bulletPoints: [
      "Real-time pull of credit scores, open facilities, and non-performing default histories",
      "Automated monthly data submission formatted to the official Central Bank CRB data specification",
      "Clearance certificate status verification directly within the loan origination workflow",
    ],
    keywords: ["crb", "transunion", "metropol", "creditinfo", "bureau", "credit report", "default", "listing"],
    actionLink: { label: "Review Integration Protocols", href: "/docs" },
  },
  {
    id: "faq-policy-rule-builder",
    category: "scoring",
    categoryLabel: "Credit Scoring & Risk",
    question: "Can our credit risk committee customize approval thresholds without writing code?",
    answer: "Yes. Our Administrative Console features a visual Credit Policy Rule Builder. Credit risk committees can update credit score cut-offs, minimum income thresholds, maximum loan-to-income multipliers, and industry exclusion filters in real time without engineering tickets.",
    bulletPoints: [
      "Immediate rollout of updated credit policy rules with no downtime",
      "Simulation sandbox: Test updated policy criteria against historical portfolio data before live deployment",
      "Granular tiering: Set different risk appetites for distinct customer segments or branch networks",
    ],
    keywords: ["policy", "rule builder", "committee", "customization", "thresholds", "risk appetite", "no code"],
    actionLink: { label: "Workflow Automation Overview", href: "/services/workflow-automation" },
  },

  // ── Security & Regulatory Compliance ──
  {
    id: "faq-data-encryption",
    category: "security",
    categoryLabel: "Security & Regulatory Compliance",
    question: "What encryption standards and security controls protect customer financial data?",
    answer: "M&F implements defense-in-depth security matching Tier-1 banking standards. All data at rest is encrypted using AES-256 with Hardware Security Module (HSM) key rotation, and data in transit is enforced via TLS 1.3 with Perfect Forward Secrecy and HSTS.",
    bulletPoints: [
      "AES-256 encryption at rest and TLS 1.3 in transit with strict certificate pinning",
      "Sensitive PII tokenization and masking on database records and administrative viewports",
      "Granular Role-Based Access Control (RBAC) with mandatory Multi-Factor Authentication (MFA)",
    ],
    keywords: ["encryption", "security", "aes-256", "tls", "hsm", "pii", "tokenization", "mfa", "rbac"],
    actionLink: { label: "Security Whitepaper", href: "/security" },
  },
  {
    id: "faq-regulatory-compliance",
    category: "security",
    categoryLabel: "Security & Regulatory Compliance",
    question: "Is M&F compliant with regional Data Protection Acts and Central Bank regulations?",
    answer: "Yes. Our architecture is designed to satisfy the Kenya Data Protection Act 2019, GDPR data privacy principles, and Central Bank prudential guidelines. We support full audit logging, automated data retention schedules, and borrower consent management.",
    bulletPoints: [
      "Strict data localization: All financial database clusters remain within sovereign regulatory borders",
      "Right to access and right to be forgotten protocol compliance with pseudonymized archives",
      "Continuous automated compliance scanning and third-party penetration testing audits",
    ],
    keywords: ["data protection act", "gdpr", "central bank", "prudential", "regulation", "sovereignty", "compliance"],
    actionLink: { label: "Regulatory Compliance Details", href: "/security" },
  },
  {
    id: "faq-disaster-recovery",
    category: "security",
    categoryLabel: "Security & Regulatory Compliance",
    question: "What are your backup, disaster recovery, and data retention specifications?",
    answer: "We maintain geographically distributed database clusters with continuous replication. Automated incremental backups run every 15 minutes, with full daily encrypted cold backups replicated to isolated disaster recovery vaults.",
    bulletPoints: [
      "Recovery Point Objective (RPO): Less than 15 minutes",
      "Recovery Time Objective (RTO): Less than 1 hour under catastrophic failover scenarios",
      "Immutable write-once-read-many (WORM) audit ledger logs preventing tampering or deletion",
    ],
    keywords: ["backup", "disaster recovery", "rpo", "rto", "retention", "failover", "resilience"],
    actionLink: { label: "System Telemetry & Status", href: "/status" },
  },

  // ── APIs & Core Banking ──
  {
    id: "faq-core-banking-connectors",
    category: "integrations",
    categoryLabel: "APIs & Core Banking",
    question: "Which Core Banking Systems (CBS) can M&F Technologies integrate with?",
    answer: "M&F provides pre-engineered adapters for major enterprise Core Banking Systems, including Temenos Transact (T24), Finacle, Oracle FLEXCUBE, and leading SACCO core management platforms. We also support direct database bridges for legacy core stacks.",
    bulletPoints: [
      "Bi-directional synchronization of customer accounts, balances, loan disbursements, and journal entries",
      "Support for RESTful JSON APIs, ISO 8583 financial transaction messaging, and SOAP/XML protocols",
      "Dedicated integration bridge that prevents core banking overload during high-volume digital loan bursts",
    ],
    keywords: ["core banking", "cbs", "temenos", "t24", "finacle", "flexcube", "sacco", "iso 8583", "connectors"],
    actionLink: { label: "Developer Protocol Documentation", href: "/docs" },
  },
  {
    id: "faq-developer-apis",
    category: "integrations",
    categoryLabel: "APIs & Core Banking",
    question: "Are developer APIs available for third-party fintechs and borrower mobile apps?",
    answer: "Yes. Our platform includes an enterprise API Gateway with developer documentation, mock environments, and SDKs. You can power your own mobile apps, agent banking POS devices, or partner marketplaces using our high-speed APIs.",
    bulletPoints: [
      "Comprehensive REST API covering loans, borrowers, KYC verification, transactions, and statements",
      "Real-time webhook notifications for payment receipts, approval decisions, and status transitions",
      "HMAC-SHA256 signature verification and granular API token scope restrictions",
    ],
    keywords: ["api", "developer", "sdk", "webhook", "endpoints", "pos", "mobile app", "gateway"],
    actionLink: { label: "Interactive API Playground", href: "/docs" },
  },

  // ── SLAs & Implementation ──
  {
    id: "faq-implementation-timeline",
    category: "implementation",
    categoryLabel: "SLAs & Implementation",
    question: "What is the typical implementation timeline for a commercial bank or SACCO?",
    answer: "Standard cloud implementations with mobile money and credit bureau rails go live in 2 to 4 weeks. Full enterprise deployments with legacy core banking integrations and bespoke credit scoring models typically take 4 to 8 weeks.",
    bulletPoints: [
      "Phase 1 (Week 1–2): Environment provisioning, policy configuration, and product definition",
      "Phase 2 (Week 3–4): CBS, payment rails, and credit bureau integration testing in sandbox",
      "Phase 3 (Week 5–6): Staff user acceptance testing (UAT), data migration, and parallel trial runs",
      "Phase 4 (Go-Live): Production cutover, real-time monitoring, and on-site go-live support",
    ],
    keywords: ["timeline", "onboarding", "implementation", "deployment", "how long", "go-live", "phases"],
    actionLink: { label: "Schedule Implementation Call", href: "/contact" },
  },
  {
    id: "faq-uptime-sla",
    category: "implementation",
    categoryLabel: "SLAs & Implementation",
    question: "What Service Level Agreement (SLA) and support hours do you provide?",
    answer: "We guarantee a contractually backed 99.95% monthly uptime SLA. Our operations and network operations center (NOC) monitor all services 24/7/365 with automated escalation and incident alerts.",
    bulletPoints: [
      "Priority 1 (Critical Outage): Response within 15 minutes, 24/7 engineering triage",
      "Priority 2 (Degraded Performance): Response within 1 hour",
      "Dedicated Technical Account Manager and quarterly architectural review meetings",
    ],
    keywords: ["sla", "uptime", "support", "response time", "24/7", "monitoring", "guarantee"],
    actionLink: { label: "Real-Time SLA Benchmark", href: "/status" },
  },
  {
    id: "faq-request-demo",
    category: "implementation",
    categoryLabel: "SLAs & Implementation",
    question: "How can our institution schedule a technical demonstration or trial sandbox?",
    answer: "You can request a tailored technical demonstration through our portal or by emailing info@mftechnologies.org. We will schedule a session with our solutions architects to walk through your lending workflows and provision a dedicated sandbox environment within 24 hours.",
    bulletPoints: [
      "Pre-loaded with representative borrower datasets and lending test scenarios",
      "Hands-on access for risk managers, credit committee members, and IT leadership",
      "Custom integration feasibility assessment included free of charge",
    ],
    keywords: ["demo", "request demo", "trial", "sandbox", "poc", "presentation", "walkthrough"],
    actionLink: { label: "Request Institutional Demo", href: "/request-demo" },
  },
];
