export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string | number | boolean;
}

export interface EndpointSpec {
  id: string;
  category: string;
  title: string;
  badge?: string;
  method?: HttpMethod;
  path?: string;
  description: string;
  headers?: ApiParam[];
  queryParams?: ApiParam[];
  bodyParams?: ApiParam[];
  sampleRequestBody?: Record<string, any>;
  sampleResponseSuccess: {
    status: number;
    body: Record<string, any>;
  };
  sampleResponseError?: {
    status: number;
    body: Record<string, any>;
  };
  codeExamples?: {
    curl: string;
    typescript: string;
    python: string;
    csharp: string;
  };
}

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  items: EndpointSpec[];
}

export const DOCS_DATA: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Foundational architecture, security conventions, and environments for integrating with M&F Technologies.",
    items: [
      {
        id: "overview",
        category: "getting-started",
        title: "Platform Overview",
        badge: "Guide",
        description:
          "M&F Technologies provides institutional-grade core lending engines, algorithmic credit scoring weight trees, transactional disbursement middleware, and automated collections queues for commercial banks, credit unions, SACCOs, and fintech platforms.",
        sampleResponseSuccess: {
          status: 200,
          body: {
            platform: "M&F Technologies API Gateway",
            version: "v2.4.0",
            status: "OPERATIONAL",
            securityProtocol: "TLS 1.3 / AES-256 GCM",
            uptimePercent: 99.994,
          },
        },
      },
      {
        id: "authentication",
        category: "getting-started",
        title: "Authentication & API Keys",
        badge: "Security",
        description:
          "All API requests must be transmitted over HTTPS using TLS 1.3. Authenticate server-to-server operations using an institutional API Key passed in the `X-API-Key` header. For client-facing mobile applications, pass an authenticated JWT in the `Authorization: Bearer <token>` header.",
        headers: [
          {
            name: "X-API-Key",
            type: "string",
            required: true,
            description: "Your institutional secret key generated in the M&F Administrator Portal.",
            example: "your_api_key",
          },
          {
            name: "Content-Type",
            type: "string",
            required: true,
            description: "Must be specified as `application/json` for all POST/PUT operations.",
            example: "application/json",
          },
        ],
        sampleResponseSuccess: {
          status: 200,
          body: {
            authenticated: true,
            institutionId: "inst_equity_fin_982",
            institutionName: "Apex Commercial Credit Union",
            role: "INSTITUTIONAL_ADMIN",
            tier: "ENTERPRISE_UNLIMITED",
            rateLimitRemaining: 9980,
          },
        },
        codeExamples: {
          curl: `curl -X GET "https://api.mftechnologies.org/v1/health" \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json"`,
          typescript: `import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.mftechnologies.org/v1',
  headers: {
    'X-API-Key': process.env.MF_API_KEY,
    'Content-Type': 'application/json',
  },
});

const response = await client.get('/health');
console.log(response.data);`,
          python: `import requests
import os

headers = {
    "X-API-Key": os.getenv("MF_API_KEY"),
    "Content-Type": "application/json"
}

response = requests.get("https://api.mftechnologies.org/v1/health", headers=headers)
print(response.json())`,
          csharp: `using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

var client = new HttpClient();
client.BaseAddress = new Uri("https://api.mftechnologies.org/v1/");
client.DefaultRequestHeaders.Add("X-API-Key", Environment.GetEnvironmentVariable("MF_API_KEY"));
client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

var response = await client.GetAsync("health");
var content = await response.Content.ReadAsStringAsync();
Console.WriteLine(content);`,
        },
      },
      {
        id: "idempotency-headers",
        category: "getting-started",
        title: "Idempotency & Zero-Duplicate Protection",
        badge: "Protocol",
        description:
          "To eliminate double-disbursements or duplicate repayments over unstable cellular data connections, pass an `Idempotency-Key` header with all write operations (`POST`, `PATCH`). If a network connection drops mid-flight, retrying with the same key safely returns the original response from cache without re-executing ledger charges.",
        headers: [
          {
            name: "Idempotency-Key",
            type: "string",
            required: true,
            description: "A client-generated UUID v4 unique to each transaction attempt.",
            example: "idem_9f4b38a1-c802-4632-9f1e-f3b14051a890",
          },
          {
            name: "X-Correlation-ID",
            type: "string",
            required: false,
            description: "Distributed trace identifier across microservices.",
            example: "trace_77182a0",
          },
        ],
        sampleResponseSuccess: {
          status: 201,
          body: {
            idempotencyKey: "idem_9f4b38a1-c802-4632-9f1e-f3b14051a890",
            status: "RESOLVED_FROM_ORIGINAL_TRANSACTION",
            transactionId: "tx_disb_098231",
            cachedResponse: true,
          },
        },
      },
      {
        id: "errors-rate-limits",
        category: "getting-started",
        title: "Errors & Rate Limits",
        badge: "Standards",
        description:
          "M&F returns standard HTTP response codes alongside structured RFC 7807 error envelopes. Enterprise API keys allow up to 10,000 queries per minute. Exceeding operations return `429 Too Many Requests` with a `Retry-After` reset header.",
        sampleResponseSuccess: {
          status: 429,
          body: {
            success: false,
            error: {
              code: "RATE_LIMIT_EXCEEDED",
              message: "API query ceiling exceeded for institutional tier. Please throttle requests.",
              retryAfterSeconds: 12,
              currentUsage: 10001,
              limit: 10000,
            },
          },
        },
      },
    ],
  },
  {
    id: "lending",
    title: "Core Lending API",
    description: "Endpoints for loan origination, automated underwriting, repayment schedules, and state machine updates.",
    items: [
      {
        id: "create-loan-application",
        category: "lending",
        title: "Create Loan Application",
        method: "POST",
        path: "/v1/lending/applications",
        badge: "Core",
        description:
          "Submits a new credit application into the institutional underwriting pipeline. Validates customer eligibility, calculates interest amortization, and triggers automated risk evaluation.",
        headers: [
          {
            name: "X-API-Key",
            type: "string",
            required: true,
            description: "Active API key.",
          },
          {
            name: "Idempotency-Key",
            type: "string",
            required: true,
            description: "UUID to prevent duplicate application submissions.",
          },
        ],
        bodyParams: [
          {
            name: "customerId",
            type: "string",
            required: true,
            description: "Unique borrower identifier in the core banking system.",
            example: "cust_apex_99812",
          },
          {
            name: "amount",
            type: "number",
            required: true,
            description: "Requested principal loan amount.",
            example: 150000.0,
          },
          {
            name: "currency",
            type: "string",
            required: true,
            description: "Three-letter ISO currency code.",
            example: "KES",
          },
          {
            name: "tenorMonths",
            type: "integer",
            required: true,
            description: "Repayment period in months (1 - 60).",
            example: 12,
          },
          {
            name: "productCode",
            type: "string",
            required: true,
            description: "Configured loan product template code.",
            example: "SME_WORKING_CAPITAL_V2",
          },
          {
            name: "disbursementRail",
            type: "string",
            required: true,
            description: "Target payout rail: MPESA_B2C, BANK_RTGS, PESALINK, or ACH.",
            example: "MPESA_B2C",
          },
        ],
        sampleRequestBody: {
          customerId: "cust_apex_99812",
          amount: 150000.0,
          currency: "KES",
          tenorMonths: 12,
          productCode: "SME_WORKING_CAPITAL_V2",
          purpose: "Inventory Expansion for Seasonal Agricultural Yield",
          disbursementRail: "MPESA_B2C",
        },
        sampleResponseSuccess: {
          status: 201,
          body: {
            success: true,
            data: {
              applicationId: "app_lms_9827361",
              status: "UNDERGOING_UNDERWRITING",
              customerId: "cust_apex_99812",
              amount: 150000.0,
              currency: "KES",
              annualInterestRate: 13.8,
              monthlyInstallment: 13456.72,
              totalRepayment: 161480.64,
              disbursementRail: "MPESA_B2C",
              createdAt: "2026-09-04T08:30:00Z",
              expectedDecisionEtaMs: 450,
            },
          },
        },
        sampleResponseError: {
          status: 422,
          body: {
            success: false,
            error: {
              code: "VALIDATION_FAILED",
              message: "The requested loan amount exceeds the ceiling configured for product SME_WORKING_CAPITAL_V2",
              field: "amount",
              maxAllowed: 100000.0,
            },
          },
        },
        codeExamples: {
          curl: `curl -X POST "https://api.mftechnologies.org/v1/lending/applications" \\
  -H "X-API-Key: your_api_key" \\
  -H "Idempotency-Key: idem_71829a9012c4" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerId": "cust_apex_99812",
    "amount": 150000.00,
    "currency": "KES",
    "tenorMonths": 12,
    "productCode": "SME_WORKING_CAPITAL_V2",
    "disbursementRail": "MPESA_B2C"
  }'`,
          typescript: `import { MFClient } from '@mf-technologies/sdk';

const mf = new MFClient({ apiKey: process.env.MF_API_KEY });

const application = await mf.lending.createApplication({
  customerId: 'cust_apex_99812',
  amount: 150000.00,
  currency: 'KES',
  tenorMonths: 12,
  productCode: 'SME_WORKING_CAPITAL_V2',
  disbursementRail: 'MPESA_B2C',
  idempotencyKey: 'idem_71829a9012c4'
});

console.log('Loan Application Created:', application.applicationId);`,
          python: `import requests
import json

url = "https://api.mftechnologies.org/v1/lending/applications"
headers = {
    "X-API-Key": "your_api_key",
    "Idempotency-Key": "idem_71829a9012c4",
    "Content-Type": "application/json"
}

payload = {
    "customerId": "cust_apex_99812",
    "amount": 150000.00,
    "currency": "KES",
    "tenorMonths": 12,
    "productCode": "SME_WORKING_CAPITAL_V2",
    "disbursementRail": "MPESA_B2C"
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`,
          csharp: `using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "your_api_key");
client.DefaultRequestHeaders.Add("Idempotency-Key", "idem_71829a9012c4");

var payload = new {
    customerId = "cust_apex_99812",
    amount = 150000.00,
    currency = "KES",
    tenorMonths = 12,
    productCode = "SME_WORKING_CAPITAL_V2",
    disbursementRail = "MPESA_B2C"
};

var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
var response = await client.PostAsync("https://api.mftechnologies.org/v1/lending/applications", content);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`,
        },
      },
      {
        id: "get-loan-application",
        category: "lending",
        title: "Get Application Status & Schedule",
        method: "GET",
        path: "/v1/lending/applications/{id}",
        badge: "Query",
        description:
          "Fetches real-time status of a loan application, underwriting verdict, audit timestamps, and breakdown of monthly installment amortization schedules.",
        queryParams: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "The unique loan application ID.",
            example: "app_lms_9827361",
          },
        ],
        sampleResponseSuccess: {
          status: 200,
          body: {
            success: true,
            data: {
              applicationId: "app_lms_9827361",
              status: "APPROVED_AWAITING_DISBURSAL",
              decisionScore: 785,
              approvedAmount: 150000.0,
              amortizationSchedule: [
                { installmentNo: 1, dueDate: "2026-10-04", principal: 11732.14, interest: 1724.58, balance: 138267.86 },
                { installmentNo: 2, dueDate: "2026-11-04", principal: 11867.06, interest: 1589.66, balance: 126400.8 },
                { installmentNo: 3, dueDate: "2026-12-04", principal: 12003.53, interest: 1453.19, balance: 114397.27 },
              ],
            },
          },
        },
        codeExamples: {
          curl: `curl -X GET "https://api.mftechnologies.org/v1/lending/applications/app_lms_9827361" \\
  -H "X-API-Key: your_api_key"`,
          typescript: `const app = await mf.lending.getApplication('app_lms_9827361');
console.log('Status:', app.status, 'Schedule:', app.amortizationSchedule);`,
          python: `response = requests.get(
    "https://api.mftechnologies.org/v1/lending/applications/app_lms_9827361",
    headers={"X-API-Key": "your_api_key"}
)
print(response.json())`,
          csharp: `var response = await client.GetAsync("https://api.mftechnologies.org/v1/lending/applications/app_lms_9827361");
var json = await response.Content.ReadAsStringAsync();`,
        },
      },
    ],
  },
  {
    id: "scoring",
    title: "Credit Scoring Engine",
    description: "Algorithmic risk evaluation, credit bureau queries, mobile money cashflow analysis, and recommended limits.",
    items: [
      {
        id: "evaluate-credit-score",
        category: "scoring",
        title: "Evaluate Borrower Risk",
        method: "POST",
        path: "/v1/scoring/evaluate",
        badge: "Engine",
        description:
          "Runs M&F's multi-layered scoring matrix incorporating regulatory credit bureau histories, mobile money statement cashflows, utility billing habits, and peer loan repayment discipline. Returns an explainable score (300 - 850) and recommended credit ceiling.",
        bodyParams: [
          {
            name: "nationalId",
            type: "string",
            required: true,
            description: "Borrower's official citizen registration ID or Tax Pin.",
            example: "KE_10928374",
          },
          {
            name: "monthlyIncome",
            type: "number",
            required: true,
            description: "Verified average monthly inflow across accounts.",
            example: 85000.0,
          },
          {
            name: "monthlyExpenses",
            type: "number",
            required: true,
            description: "Recurring monthly obligations and living costs.",
            example: 32000.0,
          },
          {
            name: "existingDebt",
            type: "number",
            required: true,
            description: "Total active liabilities across banking institutions.",
            example: 12000.0,
          },
          {
            name: "mobileMoneyVolume30d",
            type: "number",
            required: false,
            description: "Sum of inbound mobile money transactions in last 30 days.",
            example: 114000.0,
          },
          {
            name: "bureauConsent",
            type: "boolean",
            required: true,
            description: "Affirmative consent flag from borrower for regulatory bureau checks.",
            example: true,
          },
        ],
        sampleRequestBody: {
          nationalId: "KE_10928374",
          monthlyIncome: 85000.0,
          monthlyExpenses: 32000.0,
          existingDebt: 12000.0,
          mobileMoneyVolume30d: 114000.0,
          bureauConsent: true,
        },
        sampleResponseSuccess: {
          status: 200,
          body: {
            success: true,
            data: {
              scoreId: "scr_90182",
              score: 748,
              grade: "PRIME_PLUS",
              recommendedCreditLimit: 220000.0,
              defaultProbability: 0.0124,
              debtToIncomeRatio: 0.141,
              riskDrivers: [
                { factor: "BUREAU_HISTORY", impact: "POSITIVE", weight: 0.35, detail: "0 missed payments in 24 months" },
                { factor: "MOBILE_CASHFLOW", impact: "POSITIVE", weight: 0.3, detail: "Consistent daily merchant inflow" },
                { factor: "DEBT_SERVICE_COVERAGE", impact: "NEUTRAL", weight: 0.2, detail: "DSCR is 2.8x" },
              ],
              calculatedAt: "2026-09-04T08:31:14Z",
              scoringLatencyMs: 38,
            },
          },
        },
        codeExamples: {
          curl: `curl -X POST "https://api.mftechnologies.org/v1/scoring/evaluate" \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nationalId": "KE_10928374",
    "monthlyIncome": 85000.00,
    "monthlyExpenses": 32000.00,
    "existingDebt": 12000.00,
    "bureauConsent": true
  }'`,
          typescript: `const evaluation = await mf.scoring.evaluate({
  nationalId: 'KE_10928374',
  monthlyIncome: 85000.00,
  monthlyExpenses: 32000.00,
  existingDebt: 12000.00,
  bureauConsent: true
});

console.log('Credit Score:', evaluation.score, 'Grade:', evaluation.grade);`,
          python: `response = requests.post(
    "https://api.mftechnologies.org/v1/scoring/evaluate",
    headers={"X-API-Key": "your_api_key", "Content-Type": "application/json"},
    json={
        "nationalId": "KE_10928374",
        "monthlyIncome": 85000.00,
        "monthlyExpenses": 32000.00,
        "existingDebt": 12000.00,
        "bureauConsent": True
    }
)
print(response.json())`,
          csharp: `var scoringPayload = new {
    nationalId = "KE_10928374",
    monthlyIncome = 85000.00,
    monthlyExpenses = 32000.00,
    existingDebt = 12000.00,
    bureauConsent = true
};
var content = new StringContent(JsonSerializer.Serialize(scoringPayload), Encoding.UTF8, "application/json");
var response = await client.PostAsync("https://api.mftechnologies.org/v1/scoring/evaluate", content);`,
        },
      },
    ],
  },
  {
    id: "crm",
    title: "CRM & Collections API",
    description: "Endpoints for monitoring loan health, delinquency queues, automated reminders, and borrower recovery logs.",
    items: [
      {
        id: "get-collections-queue",
        category: "crm",
        title: "Query Collections Queue",
        method: "GET",
        path: "/v1/collections/queue",
        badge: "Recovery",
        description:
          "Retrieves accounts with overdue installments partitioned by delinquency buckets (1-30 days, 31-60 days, 90+ days). Includes automated SMS/WhatsApp dispatch triggers and collector assignment logs.",
        queryParams: [
          {
            name: "bucket",
            type: "string",
            required: false,
            description: "Delinquency bucket: `EARLY_30`, `MID_60`, `SEVERE_90`, or `ALL`.",
            example: "EARLY_30",
          },
          {
            name: "limit",
            type: "integer",
            required: false,
            description: "Max records to return (default 50).",
            example: 10,
          },
        ],
        sampleResponseSuccess: {
          status: 200,
          body: {
            success: true,
            totalDelinquentAccounts: 14,
            data: [
              {
                loanId: "ln_3384",
                borrowerName: "Joseph Kamau",
                phone: "+254712***456",
                daysOverdue: 8,
                amountOverdue: 4250.0,
                currency: "KES",
                riskCategory: "LOW_ESCALATION",
                lastContactDate: "2026-09-02T11:20:00Z",
                nextAutomatedAction: "WHATSAPP_SCHEDULED_REMINDER",
              },
              {
                loanId: "ln_3109",
                borrowerName: "Grace Muthoni",
                phone: "+254722***901",
                daysOverdue: 22,
                amountOverdue: 14800.0,
                currency: "KES",
                riskCategory: "MEDIUM_CALL_QUEUE",
                lastContactDate: "2026-08-30T14:15:00Z",
                nextAutomatedAction: "AGENT_OUTBOUND_DISPATCH",
              },
            ],
          },
        },
        codeExamples: {
          curl: `curl -X GET "https://api.mftechnologies.org/v1/collections/queue?bucket=EARLY_30&limit=10" \\
  -H "X-API-Key: your_api_key"`,
          typescript: `const queue = await mf.collections.getQueue({ bucket: 'EARLY_30', limit: 10 });
console.log('Delinquent accounts count:', queue.totalDelinquentAccounts);`,
          python: `response = requests.get(
    "https://api.mftechnologies.org/v1/collections/queue",
    params={"bucket": "EARLY_30", "limit": 10},
    headers={"X-API-Key": "your_api_key"}
)
print(response.json())`,
          csharp: `var response = await client.GetAsync("https://api.mftechnologies.org/v1/collections/queue?bucket=EARLY_30&limit=10");`,
        },
      },
    ],
  },
  {
    id: "sms",
    title: "SMS Gateway API (GatewaySms)",
    description: "High-throughput telecommunication messaging, SIM-bank hardware routing, automated OTP dispatch, and real-time delivery reports powered by GatewaySms.",
    items: [
      {
        id: "send-sms-message",
        category: "sms",
        title: "Send Transactional SMS",
        method: "POST",
        path: "/v1/messages",
        badge: "SMS",
        description:
          "Enqueues and dispatches an outbound SMS message via active Android hardware gateways or telco routes. Automatically handles character encoding (GSM 7-bit / UCS-2 Unicode), multi-part segment counting, and credit quota deductions.",
        headers: [
          {
            name: "X-API-Key",
            type: "string",
            required: true,
            description: "Institutional API Key for authentication.",
            example: "your_gateway_api_key",
          },
          {
            name: "Content-Type",
            type: "string",
            required: true,
            description: "Must be application/json.",
            example: "application/json",
          },
        ],
        bodyParams: [
          {
            name: "to",
            type: "string",
            required: true,
            description: "Recipient phone number in E.164 format (+254748329410 or local 0748329410).",
            example: "+254748329410",
          },
          {
            name: "text",
            type: "string",
            required: true,
            description: "Message content (up to 1600 characters).",
            example: "Your M&F Technologies loan payout of KES 15,000 has been approved and disbursed. Ref: TX99812.",
          },
          {
            name: "from",
            type: "string",
            required: false,
            description: "Custom alphanumeric Sender ID (e.g., MANDF_TECH).",
            example: "MANDF_TECH",
          },
          {
            name: "preferredDeviceId",
            type: "string",
            required: false,
            description: "Direct to a specific registered Android gateway hardware device ID.",
            example: "dev_samsung_a14_01",
          },
          {
            name: "simIndex",
            type: "integer",
            required: false,
            description: "SIM slot selector for dual-SIM gateway phones (0 for SIM 1, 1 for SIM 2).",
            example: 0,
          },
          {
            name: "scheduledAt",
            type: "string",
            required: false,
            description: "Optional ISO-8601 timestamp for scheduled future broadcast delivery.",
            example: "2026-09-04T12:00:00Z",
          },
        ],
        sampleRequestBody: {
          to: "+254748329410",
          text: "Dear Member, your loan application APP_9827361 has been approved. Repayment schedule is available in your portal.",
          from: "MANDF_TECH",
          simIndex: 0,
        },
        sampleResponseSuccess: {
          status: 202,
          body: {
            success: true,
            message: "Message enqueued for delivery",
            data: {
              id: "msg_90182374-4b91",
              to: "+254748329410",
              from: "MANDF_TECH",
              text: "Dear Member, your loan application APP_9827361 has been approved. Repayment schedule is available in your portal.",
              encoding: "GSM-7",
              segments: 1,
              creditsDeducted: 1,
              status: "PENDING",
              createdAt: "2026-09-04T08:35:00.000Z",
            },
          },
        },
        sampleResponseError: {
          status: 400,
          body: {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Recipient phone number is invalid E.164 format.",
            },
          },
        },
        codeExamples: {
          curl: `curl -X POST "https://gateway.mftechnologies.org/v1/messages" \\
  -H "X-API-Key: your_gateway_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+254748329410",
    "text": "Your OTP verification code is 481920. Valid for 10 minutes.",
    "from": "MANDF_TECH"
  }'`,
          typescript: `import axios from 'axios';

const response = await axios.post('https://gateway.mftechnologies.org/v1/messages', {
  to: '+254748329410',
  text: 'Your OTP verification code is 481920. Valid for 10 minutes.',
  from: 'MANDF_TECH',
}, {
  headers: {
    'X-API-Key': process.env.SMS_GATEWAY_API_KEY,
    'Content-Type': 'application/json',
  },
});

console.log('Message ID:', response.data.data.id, 'Status:', response.data.data.status);`,
          python: `import requests

url = "https://gateway.mftechnologies.org/v1/messages"
headers = {
    "X-API-Key": "your_gateway_api_key",
    "Content-Type": "application/json"
}
payload = {
    "to": "+254748329410",
    "text": "Your OTP verification code is 481920. Valid for 10 minutes.",
    "from": "MANDF_TECH"
}

res = requests.post(url, headers=headers, json=payload)
print(res.json())`,
          csharp: `using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "your_gateway_api_key");

var message = new {
    to = "+254748329410",
    text = "Your OTP verification code is 481920. Valid for 10 minutes.",
    from = "MANDF_TECH"
};

var content = new StringContent(JsonSerializer.Serialize(message), Encoding.UTF8, "application/json");
var response = await client.PostAsync("https://gateway.mftechnologies.org/v1/messages", content);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`,
        },
      },
      {
        id: "get-sms-status",
        category: "sms",
        title: "Get Message Delivery Status",
        method: "GET",
        path: "/v1/messages/{id}",
        badge: "Status",
        description:
          "Retrieves message delivery status, timestamp of transmission, telecom carrier response receipt, and error diagnostics if delivery failed.",
        queryParams: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "Message UUID returned when enqueuing the message.",
            example: "msg_90182374-4b91",
          },
        ],
        sampleResponseSuccess: {
          status: 200,
          body: {
            success: true,
            data: {
              id: "msg_90182374-4b91",
              to: "+254748329410",
              from: "MANDF_TECH",
              text: "Dear Member, your loan application APP_9827361 has been approved.",
              encoding: "GSM-7",
              segments: 1,
              status: "DELIVERED",
              deviceId: "dev_samsung_a14_01",
              simIndex: 0,
              gatewayMessageId: "gw_telco_receipt_89201",
              sentAt: "2026-09-04T08:35:02.000Z",
              deliveredAt: "2026-09-04T08:35:05.000Z",
              errorCode: null,
              errorMessage: null,
              createdAt: "2026-09-04T08:35:00.000Z",
            },
          },
        },
        codeExamples: {
          curl: `curl -X GET "https://gateway.mftechnologies.org/v1/messages/msg_90182374-4b91" \\
  -H "X-API-Key: your_gateway_api_key"`,
          typescript: `const res = await axios.get('https://gateway.mftechnologies.org/v1/messages/msg_90182374-4b91', {
  headers: { 'X-API-Key': process.env.SMS_GATEWAY_API_KEY },
});
console.log('Delivery Status:', res.data.data.status, 'Delivered At:', res.data.data.deliveredAt);`,
          python: `res = requests.get(
    "https://gateway.mftechnologies.org/v1/messages/msg_90182374-4b91",
    headers={"X-API-Key": "your_gateway_api_key"}
)
print(res.json())`,
          csharp: `var response = await client.GetAsync("https://gateway.mftechnologies.org/v1/messages/msg_90182374-4b91");`,
        },
      },
      {
        id: "list-sms-messages",
        category: "sms",
        title: "List Outbound SMS Messages",
        method: "GET",
        path: "/v1/messages",
        badge: "Query",
        description:
          "Returns a paginated list of dispatched SMS messages for the authenticated tenant with date filters, status breakdowns, and segment counters.",
        queryParams: [
          {
            name: "limit",
            type: "integer",
            required: false,
            description: "Number of records to return (1-100, default 50).",
            example: 20,
          },
          {
            name: "offset",
            type: "integer",
            required: false,
            description: "Number of records to skip for pagination.",
            example: 0,
          },
        ],
        sampleResponseSuccess: {
          status: 200,
          body: {
            success: true,
            data: [
              {
                id: "msg_90182374-4b91",
                to: "+254748329410",
                from: "MANDF_TECH",
                text: "Your OTP verification code is 481920.",
                encoding: "GSM-7",
                segments: 1,
                status: "DELIVERED",
                createdAt: "2026-09-04T08:35:00.000Z",
              },
              {
                id: "msg_88190123-11aa",
                to: "+254712345678",
                from: "MANDF_TECH",
                text: "Installment reminder: KES 4,250 due tomorrow.",
                encoding: "GSM-7",
                segments: 1,
                status: "SENT",
                createdAt: "2026-09-04T08:15:00.000Z",
              },
            ],
            pagination: {
              limit: 20,
              offset: 0,
              count: 2,
            },
          },
        },
        codeExamples: {
          curl: `curl -X GET "https://gateway.mftechnologies.org/v1/messages?limit=20&offset=0" \\
  -H "X-API-Key: your_gateway_api_key"`,
          typescript: `const messages = await axios.get('https://gateway.mftechnologies.org/v1/messages?limit=20', {
  headers: { 'X-API-Key': process.env.SMS_GATEWAY_API_KEY },
});
console.log('Total returned:', messages.data.pagination.count);`,
          python: `res = requests.get(
    "https://gateway.mftechnologies.org/v1/messages",
    params={"limit": 20, "offset": 0},
    headers={"X-API-Key": "your_gateway_api_key"}
)
print(res.json())`,
          csharp: `var response = await client.GetAsync("https://gateway.mftechnologies.org/v1/messages?limit=20&offset=0");`,
        },
      },
      {
        id: "list-sms-devices",
        category: "sms",
        title: "List Connected Gateway Devices",
        method: "GET",
        path: "/v1/devices",
        badge: "Hardware",
        description:
          "Queries the health status, telemetry, battery percentage, charging state, SIM slots, and last heartbeat timestamps of Android physical phones and cellular gateway nodes.",
        sampleResponseSuccess: {
          status: 200,
          body: {
            success: true,
            data: [
              {
                id: "dev_samsung_a14_01",
                name: "Nairobi Data Center Gateway #1",
                status: "ONLINE",
                batteryPercentage: 96,
                isCharging: true,
                appVersion: "v1.4.2",
                simSlots: [
                  { index: 0, carrier: "Safaricom KE", signalStrengthDbm: -72, status: "READY" },
                  { index: 1, carrier: "Airtel KE", signalStrengthDbm: -68, status: "READY" },
                ],
                lastHeartbeat: "2026-09-04T08:34:55.000Z",
              },
            ],
          },
        },
        codeExamples: {
          curl: `curl -X GET "https://gateway.mftechnologies.org/v1/devices" \\
  -H "X-API-Key: your_gateway_api_key"`,
          typescript: `const devices = await axios.get('https://gateway.mftechnologies.org/v1/devices', {
  headers: { 'X-API-Key': process.env.SMS_GATEWAY_API_KEY },
});
console.log('Connected Gateway Devices:', devices.data.data);`,
          python: `res = requests.get("https://gateway.mftechnologies.org/v1/devices", headers={"X-API-Key": "your_gateway_api_key"})
print(res.json())`,
          csharp: `var response = await client.GetAsync("https://gateway.mftechnologies.org/v1/devices");`,
        },
      },
      {
        id: "verify-sms-otp",
        category: "sms",
        title: "Verify SMS OTP & 2FA",
        method: "POST",
        path: "/v1/auth/verify-otp",
        badge: "Auth",
        description:
          "Validates one-time passwords sent via SMS to borrower or admin mobile devices and issues tenant authentication tokens upon successful verification.",
        bodyParams: [
          {
            name: "email",
            type: "string",
            required: true,
            description: "Registered user email address.",
            example: "musamwange2@gmail.com",
          },
          {
            name: "otp",
            type: "string",
            required: true,
            description: "6-digit code received via SMS.",
            example: "481920",
          },
        ],
        sampleRequestBody: {
          email: "musamwange2@gmail.com",
          otp: "481920",
        },
        sampleResponseSuccess: {
          status: 200,
          body: {
            success: true,
            message: "Authentication successful",
            data: {
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              user: {
                id: "usr_991823",
                email: "musamwange2@gmail.com",
                phone: "+254748329410",
                role: "TENANT_ADMIN",
              },
              tenant: {
                id: "tenant_mf_live_01",
                name: "M&F Technologies Live Gateway",
                apiKey: "your_gateway_api_key",
                credits: 14500,
              },
            },
          },
        },
        codeExamples: {
          curl: `curl -X POST "https://gateway.mftechnologies.org/v1/auth/verify-otp" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "musamwange2@gmail.com",
    "otp": "481920"
  }'`,
          typescript: `const auth = await axios.post('https://gateway.mftechnologies.org/v1/auth/verify-otp', {
  email: 'musamwange2@gmail.com',
  otp: '481920',
});
console.log('JWT Token:', auth.data.data.token, 'Remaining Credits:', auth.data.data.tenant.credits);`,
          python: `res = requests.post(
    "https://gateway.mftechnologies.org/v1/auth/verify-otp",
    json={"email": "musamwange2@gmail.com", "otp": "481920"}
)
print(res.json())`,
          csharp: `var payload = new { email = "musamwange2@gmail.com", otp = "481920" };
var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
var response = await client.PostAsync("https://gateway.mftechnologies.org/v1/auth/verify-otp", content);`,
        },
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks & Events",
    description: "Real-time asynchronous notifications for loan approvals, disbursement confirmations, and repayment captures.",
    items: [
      {
        id: "webhook-verification",
        category: "webhooks",
        title: "Signature Verification",
        badge: "Security",
        description:
          "All incoming webhooks carry an `X-MF-Signature` header computed as an HMAC-SHA-256 signature using your institutional webhook signing secret. Always verify this signature before processing payloads into your core ledger.",
        sampleResponseSuccess: {
          status: 200,
          body: {
            event: "loan.disbursed",
            eventId: "evt_910283a09b",
            timestamp: 1788510674,
            data: {
              applicationId: "app_lms_9827361",
              disbursementReference: "B2C_MPESA_QW891029",
              amountDisbursed: 150000.0,
              currency: "KES",
              destinationAccount: "+254748***410",
              disbursedAt: "2026-09-04T08:31:14Z",
            },
          },
        },
        codeExamples: {
          curl: `# Validating HMAC-SHA-256 in bash
echo -n "PAYLOAD_BODY" | openssl dgst -sha256 -hmac "YOUR_WEBHOOK_SECRET"`,
          typescript: `import crypto from 'crypto';

function verifyMfWebhook(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}`,
          python: `import hmac
import hashlib

def verify_mf_webhook(raw_payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(secret.encode(), raw_payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)`,
          csharp: `using System.Security.Cryptography;
using System.Text;

bool VerifyMfWebhook(string payload, string signature, string secret) {
    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
    var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
    var expected = "sha256=" + BitConverter.ToString(hash).Replace("-", "").ToLower();
    return CryptographicOperations.FixedTimeEquals(
        Encoding.UTF8.GetBytes(expected),
        Encoding.UTF8.GetBytes(signature)
    );
}`,
        },
      },
    ],
  },
  {
    id: "changelog",
    title: "Release Changelog",
    description: "Version history, endpoint upgrades, and API deprecation schedules.",
    items: [
      {
        id: "changelog-v2",
        category: "changelog",
        title: "Version 2.4.0 (Q3 2026)",
        badge: "v2.4.0",
        description:
          "Introduced sub-second scoring engine updates, added automated SACCO regulatory filing exports, and integrated direct M-PESA Daraja v3 disbursement rails with automated double-entry verification.",
        sampleResponseSuccess: {
          status: 200,
          body: {
            release: "v2.4.0",
            releaseDate: "2026-08-15",
            highlights: [
              "Sub-40ms algorithmic credit score latency",
              "Automated idempotent disbursement retries",
              "Webhooks v2 with replay prevention counters",
            ],
          },
        },
      },
    ],
  },
];
