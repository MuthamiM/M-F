interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  readTime: string;
}

export const ARTICLES: Article[] = [
  {
    id: "core-lending-engine-v2",
    title: "M&F Technologies Upgrades Core Lending Engine for Institutional Credit Operations",
    category: "Product Release",
    date: "July 28, 2026",
    summary:
      "We are proud to release version 2.4 of our Core Lending Platform, bringing real-time double-entry ledger audits, sub-100ms disbursement APIs, and enhanced automated compliance reporting.",
    readTime: "4 min read",
  },
  {
    id: "uptime-sla-benchmark",
    title: "M&F Platform Achieves 99.99% Operational Uptime Across All Partner Financial Systems",
    category: "Infrastructure",
    date: "June 14, 2026",
    summary:
      "Our infrastructure teams completed zero-downtime database cluster migrations across sub-Saharan regions, maintaining uninterrupted credit processing for over $1 Billion in disbursements.",
    readTime: "3 min read",
  },
  {
    id: "risk-scoring-engine-rollout",
    title: "Configurable Risk Decisioning Weight Trees Now Live in Production",
    category: "Engineering",
    date: "May 02, 2026",
    summary:
      "Financial institutions can now customize multi-variable risk scoring matrices with alternative credit data integration, reducing loan default rates by up to 18%.",
    readTime: "5 min read",
  },
];
