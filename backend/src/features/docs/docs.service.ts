import { GetDocInput, SearchDocInput } from "./docs.schema";

export interface DocArticle {
  category: string;
  slug: string;
  title: string;
  description: string;
  content: string;
}

const DOCS_DATABASE: DocArticle[] = [
  {
    category: "getting-started",
    slug: "introduction",
    title: "Introduction",
    description: "Welcome to M&F Technologies Developer Platform.",
    content: `# Introduction

Welcome to the M&F Technologies API documentation. Our platform is designed to provide secure, robust, and highly configurable lending infrastructure for banks, credit unions, microfinance institutions, and fast-growing fintech startups.

By integrating with M&F Technologies, you can automate your entire lending lifecycle: from customer acquisition and digital onboarding, to credit scoring, automated underwriting, disbursals, loan servicing, collections, and audit logs.

### Core Modules Available
- **Loan Management System (LMS) API**: Manage loan applications, calculate schedules, trigger disbursals, and record repayments.
- **Credit Scoring Platform API**: Run real-time credit scoring calculations using custom machine learning algorithms and local credit bureaus.
- **CRM & Collections API**: Track borrower accounts, communications, follow-ups, and automated collections queues.

> [!NOTE]
> All requests must be sent over HTTPS using TLS 1.3. Non-secure requests will be rejected by our API gateway.

### Base URLs
- **Staging / Sandbox**: \`https://sandbox.api.mftechnologies.com/v1\`
- **Production**: \`https://api.mftechnologies.com/v1\`
`
  },
  {
    category: "getting-started",
    slug: "authentication",
    title: "Authentication & API Keys",
    description: "Learn how to authenticate your API requests.",
    content: `# Authentication

The M&F Technologies API uses JSON Web Tokens (JWT) or API Keys to authenticate requests. 

For server-to-server operations (like Core Banking integrations), we recommend using **API Keys**. For client-facing applications (like mobile lending apps), you must authenticate users and use **Bearer Tokens**.

### Method 1: Server API Key
Add your API key to the header of all outgoing requests:
\`\`\`http
X-API-Key: mf_live_ab12cd34ef56gh78ij90kl
\`\`\`

### Method 2: Bearer Tokens
For authenticated customer operations, retrieve a token via the \`/auth/login\` endpoint, then pass it as a Bearer Token:
\`\`\`http
Authorization: Bearer <your_jwt_token>
\`\`\`

> [!WARNING]
> Keep your API keys secret. Never expose them in client-side code, git repositories, or mobile app binaries. If an API key is compromised, revoke it immediately in the administrator portal.
`
  },
  {
    category: "getting-started",
    slug: "errors",
    title: "Errors & Rate Limits",
    description: "Understanding error formats and API rate limits.",
    content: `# Errors & Rate Limits

Our API utilizes standard HTTP status codes to indicate the outcome of API requests. 

### HTTP Status Codes
- \`200 OK\`: Request completed successfully.
- \`201 Created\`: Resource created successfully.
- \`400 Bad Request\`: Validation failed or missing parameters.
- \`401 Unauthorized\`: Authentication failed or missing keys.
- \`403 Forbidden\`: Authenticated but lacks permissions for the action.
- \`429 Too Many Requests\`: Rate limit exceeded.
- \`500 Internal Error\`: An unexpected server error occurred.

### Error Response Schema
All error responses return a JSON object containing details:
\`\`\`json
{
  "success": false,
  "error": {
    "message": "Validation Error",
    "details": [
      {
        "field": "body.amount",
        "message": "Loan amount must be greater than 100"
      }
    ]
  }
}
\`\`\`

### Rate Limiting
API requests are limited to prevent abuse and protect system stability.
- **Sandbox Limit**: 60 requests per minute per IP.
- **Production Limit**: Custom based on service level agreements (SLAs).

When a rate limit is exceeded, the server responds with HTTP \`429\` and includes headers indicating limit resets:
\`\`\`http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1722336000
\`\`\`
`
  },
  {
    category: "lending",
    slug: "applications",
    title: "Loan Applications API",
    description: "Submit and check status of loan applications.",
    content: `# Loan Applications

The Loan Applications API allows you to submit credit requests, check application progress, and manage supporting documents.

### Submit an Application
- **Method**: \`POST\`
- **Endpoint**: \`/lending/applications\`
- **Headers**:
  - \`Content-Type: application/json\`
  - \`X-API-Key: your_api_key\`

#### Request Payload
\`\`\`json
{
  "customerId": "cust_99810",
  "amount": 25000.00,
  "tenorMonths": 12,
  "productCode": "SALARY_ADVANCE_01",
  "purpose": "Business Expansion"
}
\`\`\`

#### Successful Response (201 Created)
\`\`\`json
{
  "success": true,
  "data": {
    "applicationId": "app_lms_9827361",
    "customerId": "cust_99810",
    "status": "UNDERGOING_UNDERWRITING",
    "amount": 25000.00,
    "interestRate": 14.5,
    "monthlyInstallment": 2250.78,
    "createdAt": "2026-07-30T10:49:00Z"
  }
}
\`\`\`
`
  },
  {
    category: "scoring",
    slug: "scoring",
    title: "Credit Scoring API",
    description: "Evaluate borrower risk and calculate scores.",
    content: `# Credit Scoring Platform

Our machine learning-driven Credit Scoring Platform compiles financial history, behavioral metadata, and credit bureau records to output a normalized risk score.

### Evaluate Credit Score
- **Method**: \`POST\`
- **Endpoint**: \`/scoring/evaluate\`

#### Request Payload
\`\`\`json
{
  "nationalId": "KE_29384756",
  "monthlyIncome": 8500.00,
  "monthlyExpenses": 3200.00,
  "existingDebt": 12000.00,
  "consent": true
}
\`\`\`

#### Successful Response (200 OK)
\`\`\`json
{
  "success": true,
  "data": {
    "scoreId": "scr_90182",
    "score": 725,
    "grade": "EXCELLENT",
    "recommendedLimit": 15000.00,
    "defaultProbability": 0.012,
    "calculatedAt": "2026-07-30T10:50:00Z"
  }
}
\`\`\`
`
  },
  {
    category: "crm",
    slug: "crm-api",
    title: "CRM & Collections API",
    description: "Manage borrower accounts and collections queues.",
    content: `# CRM & Collections

Synchronize borrower communication logs and trigger automated collections workflows for delinquent accounts.

### Get Collections Queue
- **Method**: \`GET\`
- **Endpoint**: \`/collections/queue\`

#### Response Payload (200 OK)
\`\`\`json
{
  "success": true,
  "data": [
    {
      "loanId": "ln_3384",
      "borrowerName": "Jane Doe",
      "daysOverdue": 14,
      "amountOverdue": 450.00,
      "riskCategory": "MEDIUM",
      "lastContact": "2026-07-28T09:00:00Z"
    }
  ]
}
\`\`\`
`
  },
  {
    category: "references",
    slug: "changelog",
    title: "API Changelog",
    description: "History of API changes and updates.",
    content: `# API Changelog

Track all releases, deprecations, and improvements to the M&F Technologies suite.

### Version 1.2.0 (July 2026)
- **Added**: Interactive API Playground support in documentation.
- **Added**: Endpoints for credit bureau request logs.
- **Improved**: Latency of the loan schedule calculator.

### Version 1.1.0 (March 2026)
- **Added**: Multi-currency capabilities for loan disbursals.
- **Improved**: Support for TLS 1.3 across all environments.
- **Fixed**: Formatting of rates in payment schedules.
`
  },
  {
    category: "references",
    slug: "implementation-plan",
    title: "System Implementation Plan",
    description: "M&F Technologies website and docs design plan.",
    content: `# M&F Technologies Website & API Docs Implementation Plan

This implementation plan outlines the architecture, design, and technical structure for the M&F Technologies corporate website and API documentation portal. The goal is to build an enterprise-grade, secure, and boardroom-credible digital presence that appeals to CTOs, VPs of Engineering, and financial institution leaders.

---

## 1. Site Architecture

### Sitemap (Marketing Site)
The marketing site will reside on the primary domain and consist of the following pages:
- **Home (\`/\`)**: Main portal showcasing value proposition, high-level products, trust signals, and direct paths to the API docs or sales.
- **Products & Solutions (\`/products\`)**: Comprehensive overview of services:
  - Custom Loan Management Systems (LMS)
  - Mobile Apps & Web Portals
  - Core Lending & Credit Scoring
  - Collections, CRM, and Workflow Automation
- **Security & Compliance (\`/security\`)**: Dedicated page detailing the SOC 2 Type II path, data encryption (AES-256/TLS 1.3), audit logs, and infrastructure SLAs (Azure/AWS).
- **Company / About (\`/about\`)**: Story, executive team, mission, and career paths.
- **Contact / Demo Request (\`/contact\`)**: Lead capture optimized for enterprise decision-makers.

### Structure (API Docs Section - \`/docs\`)
The API docs section will provide a technical, developer-centric guide:
- **Getting Started**:
  - Introduction (\`/docs/getting-started/introduction\`)
  - Authentication & API Keys (\`/docs/getting-started/authentication\`)
  - Errors & Rate Limits (\`/docs/getting-started/errors\`)
  - SDKs & Libraries (\`/docs/getting-started/sdks\`)
- **Core Lending API**:
  - Loan Applications (\`/docs/lending/applications\`)
  - Underwriting & Approvals (\`/docs/lending/underwriting\`)
  - Disbursals & Repayments (\`/docs/lending/repayments\`)
- **Credit Scoring API**:
  - Score Calculations (\`/docs/scoring/scoring\`)
  - Data Sources & Integration (\`/docs/scoring/data-sources\`)
- **CRM & Collections API**:
  - Customer Accounts (\`/docs/crm/accounts\`)
  - Collections Workflows (\`/docs/crm/collections\`)
- **Changelog**: Release history (\`/docs/changelog\`)

### Routing Strategy: Subfolder (\`/docs\`)
We recommend using a subfolder \`/docs\` rather than a subdomain \`docs.mftechnologies.com\` for the following reasons:
1. **SEO Link Equity**: All backlinks to technical docs directly boost the authority of the main marketing domain (\`mftechnologies.com\`).
2. **Simplified Deployment**: A single Next.js project handles both marketing and docs, eliminating multi-domain routing setups, SSL configuration overhead, and shared session/state challenges.
3. **Consistent Styling**: Tailwind styles and custom components are shared directly without importing packages across repos.

---

## 2. Landing Page Breakdown

The homepage will be structured to establish immediate credibility, showcase security compliance, and present clear technical capabilities.

### Section-by-Section Design
1. **Hero Section**
   - **Visuals**: A clean, high-contrast headline, subtle micro-animations showing an API request/response flow, and an background grid representing secure data pipelines.
   - **Content/Copy**:
     - *Headline*: Enterprise Lending Infrastructure, Built for Scale.
     - *Subheadline*: Custom loan management systems, real-time credit scoring, and secure portals designed for banks, credit unions, and fintech leaders.
     - *CTAs*: \`Request Developer Access\` (Primary) and \`Talk to an Expert\` (Secondary).
   - **Conversion Goal**: Drive clicks to documentation or contact forms.
2. **Key Trust Indicators & Client Badging**
   - **Visuals**: Monochrome logos of partner banks/fintechs, with small highlights on security badges (e.g., SOC 2 Type II compliant path).
   - **Content/Copy**: "Trusted by leading financial institutions to power over $1B in loan disbursements."
   - **Conversion Goal**: Establish instant credibility.
3. **Core Services / Product Grid**
   - **Visuals**: Bento-grid layout of services with clean icons and interactive hover cards.
   - **Content/Copy**: Detail LMS, Mobile Apps, Credit Scoring, and Collections. Brief descriptions focused on speed, customization, and reliability.
   - **Conversion Goal**: Educate on product breadth.
4. **Security & Infrastructure (The Boardroom Shield)**
   - **Visuals**: Graphical representation of end-to-end security layers (encryption at rest/in transit, SOC 2 compliance, audit logs).
   - **Content/Copy**: "Bank-Grade Security. Zero Compromises." Highlight AES-256, TLS 1.3, multi-tenant/single-tenant hosting on AWS/Azure, and 99.99% uptime SLA.
   - **Conversion Goal**: Alleviate risk concerns for bank compliance officers.
5. **Technical Core / Developer Section**
   - **Visuals**: Split-screen showing a mock API request in JavaScript/Python/C# alongside a live-rendered visual response card.
   - **Content/Copy**: "Built by developers, for developers." Clear explanation of restful architecture, webhooks, and sandbox testing.
   - **Conversion Goal**: Direct developers to \`/docs\`.
6. **CTA & Lead Capture**
   - **Visuals**: Clean, structured input form with minimal friction.
   - **Content/Copy**: "Schedule a technical deep dive."
   - **Conversion Goal**: Capture email, organization name, and system requirements.

---

## 3. API Docs Plan

### Recommended Framework: Fumadocs
We recommend **Fumadocs** for the API documentation sub-application.
- **Why Fumadocs?**
  - Built specifically for Next.js App Router.
  - Exceptionally fast, clean layout styled out-of-the-box with Tailwind CSS.
  - Native search integration (Local search or Algolia).
  - Rich MDX components (tabs, callouts, steps, code blocks with copy buttons).
  - Highly extensible for custom branding to match the "Developer Gray" theme.

### Product API Structure
Each core API (Lending, Scoring, CRM) will follow a standardized page template:
1. **API Reference Table**: Summary of HTTP verbs, endpoints, and authentication scopes.
2. **Parameters Schema**: Type details, validation limits, and whether fields are required.
3. **Code Tabs**: Example requests in \`curl\`, \`C#\`, \`Python\`, and \`JavaScript\`.
4. **Response Examples**: Clean JSON payloads showing successful responses (\`200 OK\`, \`201 Created\`) and error formats (\`400 Bad Request\`, \`401 Unauthorized\`, \`429 Too Many Requests\`).

### Interactive API Explorer (Playground)
We will implement a lightweight, client-side API Explorer where users can test endpoints against a mock or live sandbox:
- **Implementation**: Custom interactive React panels nested inside the MDX layout.
- **Requirements**:
  - Text inputs for query parameters and headers (like \`X-API-Key\`).
  - JSON text editor for request bodies.
  - Mock backend integration to return realistic success and error payloads.

---

## 4. Design System

To match the **Developer Gray** brand direction, we will establish a high-end, boardroom-credible color palette and typography layout.

### Color Palette & Theme
- **Theme**: Unified Dark-Mode by default, with a toggle option for a clean Light-Mode.
- **Palette**:
  - \`Neutral Slate (Background)\`: HSL \`#0f172a\` (slate-900) or rich dark gray \`#0b0f19\` for dark mode; \`#f8fafc\` (slate-50) for light mode.
  - \`Surface Gray\`: HSL \`#1e293b\` (slate-800) or \`#111827\` (gray-900) to separate cards/nav.
  - \`Enterprise Accent\`: Ice Blue / Steel Blue \`#38bdf8\` (sky-400) or Royal Indigo \`#6366f1\` (indigo-500) to guide action items without looking like a consumer tech startup.
  - \`Success/Security\`: Mint Green \`#10b981\` (emerald-500) representing uptime and compliance.
  - \`Text\`: High-contrast slate-200 / slate-400.

### Typography
- **Headings**: \`Outfit\` or \`Inter\` (Sans-Serif) for modern, clean corporate structure.
- **Body Text**: \`Inter\` for clean readability.
- **Code Fonts**: \`JetBrains Mono\` or \`Fira Code\` for terminal output and API schemas.

### Component Inventory
- **Navbars**: Multi-tier header supporting marketing routes, doc searches, and external portal links.
- **Bento Card**: Rounded grid cards with subtle hover borders (using CSS gradients/borders).
- **Codeblock Widget**: Custom component with line highlights, syntax highlighting (via Prism or Shiki), and a quick-copy button.
- **Status Badge**: Small pills indicating status (e.g., \`Active\`, \`Deprecated\`, \`SOC 2 Type II\`).
- **Interactive Steps**: Visual trackers for onboarding steps.

---

## 5. Technical Setup

### Project Structure (Next.js App Router)
\`\`\`text
/
├── app/
│   ├── (marketing)/       # Group for public pages (layout, home, security, contact)
│   │   ├── page.tsx
│   │   ├── security/
│   │   └── contact/
│   ├── docs/             # API Docs folder (using Fumadocs or MDX layout)
│   │   ├── [[...slug]]/  # Dynamic catch-all for MDX/Fumadocs routing
│   │   └── layout.tsx
│   ├── layout.tsx        # Global shell, fonts, and HTML wrappers
│   └── globals.css       # Design tokens & custom CSS components
├── content/              # MDX files containing document text
│   ├── lending/
│   ├── scoring/
│   └── crm/
├── components/           # Reusable UI elements (Buttons, Cards, Nav)
│   ├── ui/               # Radix/custom base components
│   └── docs/             # Docs-specific UI components
└── public/               # Static assets (logos, security seals, robots.txt)
\`\`\`

### Key Dependencies
- \`tailwindcss\` & \`postcss\`: Custom styling.
- \`fumadocs-ui\` & \`fumadocs-core\`: Documentation engine.
- \`lucide-react\`: Developer-focused icons.
- \`framer-motion\`: Subtle micro-animations (e.g., card hovers, API response expansions).
- \`shiki\`: High-fidelity, theme-accurate syntax highlighting for API code blocks.
- \`zod\`: Client-side input validation for contact/playground forms.

### SEO & Performance
- **Metadata API**: Set up page-specific title templates (e.g., \`[Page] | M&F Technologies\`).
- **OpenGraph & Twitter Cards**: Add default preview banners showcasing security/API trust vectors.
- **Sitemap**: Configured via \`app/sitemap.ts\` to automatically crawl marketing and MDX paths.
- **Performance**:
  - Font optimization using \`next/font\` to eliminate layout shifts (CLS).
  - Responsive, WebP/AVIF format images with predefined dimensions.
  - Code-splitting on large playground elements to protect Core Web Vitals on mobile.

---

## 6. Build Phases

### Phase 1: Foundation & Design System (Scope: Framework Setup)
- Initialize Next.js project.
- Configure Tailwind, fonts, and theme (Dark/Light mode provider).
- Implement basic design tokens, layout shell, navbar, and footers.

### Phase 2: Marketing Pages (Scope: Core Public Content)
- Build Homepage with Hero, Bento Grid, Security showcase, and Lead generation.
- Build dedicated Security/Compliance page and Contact page.
- Integrate validation on contact/demo requests.

### Phase 3: Docs Scaffold (Scope: Engine Integration)
- Integrate Fumadocs core engine and routing.
- Implement responsive layout with sidebar navigation and search.
- Configure Shiki syntax highlighting for code blocks.

### Phase 4: API Content & Playground (Scope: Documentation Text & Sandbox)
- Draft markdown pages for authentication, lending APIs, scoring APIs, and CRM APIs.
- Build interactive API Playground components for testing.
- Write sample response data structures.

### Phase 5: SEO, Optimization & Deployment (Scope: Final Polish)
- Configure \`sitemap.ts\`, \`robots.txt\`, and metadata tags.
- Run Core Web Vitals check.
- Set up automated deployment on Vercel or Cloudflare Pages.
`
  }
];

export class DocsService {
  static getSitemap() {
    return [
      {
        category: "getting-started",
        title: "Getting Started",
        pages: [
          { slug: "introduction", title: "Introduction" },
          { slug: "authentication", title: "Authentication" },
          { slug: "errors", title: "Errors & Rate Limits" },
        ],
      },
      {
        category: "lending",
        title: "Core Lending API",
        pages: [
          { slug: "applications", title: "Loan Applications" },
        ],
      },
      {
        category: "scoring",
        title: "Credit Scoring API",
        pages: [
          { slug: "scoring", title: "Risk Scoring" },
        ],
      },
      {
        category: "crm",
        title: "CRM & Collections API",
        pages: [
          { slug: "crm-api", title: "CRM & Collections" },
        ],
      },
      {
        category: "references",
        title: "References & Meta",
        pages: [
          { slug: "changelog", title: "API Changelog" },
          { slug: "implementation-plan", title: "System Implementation Plan" },
        ],
      },
    ];
  }

  static getDocArticle(params: GetDocInput): DocArticle | null {
    const article = DOCS_DATABASE.find(
      (doc) =>
        doc.category.toLowerCase() === params.category.toLowerCase() &&
        doc.slug.toLowerCase() === params.slug.toLowerCase()
    );
    return article || null;
  }

  static searchDocs(input: SearchDocInput) {
    const query = input.q.toLowerCase();
    return DOCS_DATABASE.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query)
    ).map((doc) => ({
      category: doc.category,
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
    }));
  }
}
export default DocsService;
