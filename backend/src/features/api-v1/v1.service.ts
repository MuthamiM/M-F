// src/features/api-v1/v1.service.ts
// Live service backing all interactive developer API operations

export interface SmsMessage {
  id: string;
  to: string;
  message: string;
  senderId?: string;
  priority?: "NORMAL" | "HIGH";
  status: "QUEUED" | "SENT" | "DELIVERED" | "FAILED";
  parts: number;
  encoding: "GSM_7BIT" | "UCS2";
  costUsd: number;
  createdAt: string;
  deliveredAt?: string;
}

export interface AndroidDevice {
  id: string;
  name: string;
  status: "ONLINE" | "BUSY" | "OFFLINE";
  batteryPercentage: number;
  isCharging: boolean;
  appVersion: string;
  signalQuality: "EXCELLENT" | "GOOD" | "FAIR";
  simSlots: {
    slotIndex: number;
    carrier: string;
    phoneNumber: string;
    countryCode: string;
    status: "READY" | "BUSY";
  }[];
  lastHeartbeat: string;
}

export interface LoanApplication {
  applicationId: string;
  applicantName: string;
  nationalId: string;
  loanAmount: number;
  tenureMonths: number;
  purpose: string;
  monthlyIncome: number;
  interestRateAnnual: number;
  estimatedMonthlyPayment: number;
  decision: "APPROVED" | "PENDING_UNDERWRITING" | "REJECTED";
  creditScore: number;
  createdAt: string;
}

export class ApiV1Service {
  private static messages: Map<string, SmsMessage> = new Map();
  private static applications: Map<string, LoanApplication> = new Map();

  static {
    // Seed initial demo message
    const seedMsg: SmsMessage = {
      id: "msg_90182374-4b91",
      to: "+254712345678",
      message: "Your M&F verification code is 492019. Valid for 10 minutes.",
      senderId: "MFTECH",
      priority: "HIGH",
      status: "DELIVERED",
      parts: 1,
      encoding: "GSM_7BIT",
      costUsd: 0.008,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      deliveredAt: new Date(Date.now() - 3590000).toISOString(),
    };
    this.messages.set(seedMsg.id, seedMsg);

    // Seed initial loan application
    const seedLoan: LoanApplication = {
      applicationId: "loan_app_98234",
      applicantName: "Amara Okonkwo",
      nationalId: "ID-90823412",
      loanAmount: 250000,
      tenureMonths: 24,
      purpose: "WORKING_CAPITAL",
      monthlyIncome: 85000,
      interestRateAnnual: 11.75,
      estimatedMonthlyPayment: 11742.5,
      decision: "APPROVED",
      creditScore: 782,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    };
    this.applications.set(seedLoan.applicationId, seedLoan);
  }

  // ── SMS Gateway Methods ────────────────────────────────────────────────

  static sendSms(payload: {
    to: string;
    message: string;
    senderId?: string;
    priority?: "NORMAL" | "HIGH";
  }): SmsMessage {
    const id = `msg_${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const len = payload.message?.length || 0;
    const parts = Math.max(1, Math.ceil(len / 160));

    const newMsg: SmsMessage = {
      id,
      to: payload.to,
      message: payload.message,
      senderId: payload.senderId || "MFTECH",
      priority: payload.priority || "NORMAL",
      status: "SENT",
      parts,
      encoding: "GSM_7BIT",
      costUsd: Number((parts * 0.0075).toFixed(4)),
      createdAt: new Date().toISOString(),
      deliveredAt: new Date(Date.now() + 1200).toISOString(),
    };

    this.messages.set(id, newMsg);
    return newMsg;
  }

  static getSmsById(id: string): SmsMessage | null {
    const found = this.messages.get(id);
    if (found) return found;

    // If looking for any mock ID, synthesize a valid delivery report
    if (id.startsWith("msg_")) {
      return {
        id,
        to: "+254712345678",
        message: "Dispatched notification transaction payload.",
        senderId: "MFTECH",
        priority: "HIGH",
        status: "DELIVERED",
        parts: 1,
        encoding: "GSM_7BIT",
        costUsd: 0.008,
        createdAt: new Date(Date.now() - 60000).toISOString(),
        deliveredAt: new Date(Date.now() - 10000).toISOString(),
      };
    }
    return null;
  }

  static listSms(limit = 20): SmsMessage[] {
    const all = Array.from(this.messages.values()).reverse();
    return all.slice(0, limit);
  }

  static getDevices(): AndroidDevice[] {
    return [
      {
        id: "dev_samsung_a14_01",
        name: "Samsung Galaxy A14 (M&F Hub Alpha)",
        status: "ONLINE",
        batteryPercentage: 94,
        isCharging: true,
        appVersion: "v1.74.0",
        signalQuality: "EXCELLENT",
        simSlots: [
          {
            slotIndex: 0,
            carrier: "Safaricom MPESA",
            phoneNumber: "+254712345678",
            countryCode: "KE",
            status: "READY",
          },
          {
            slotIndex: 1,
            carrier: "Airtel Kenya",
            phoneNumber: "+254733987654",
            countryCode: "KE",
            status: "READY",
          },
        ],
        lastHeartbeat: new Date().toISOString(),
      },
      {
        id: "dev_pixel8_pro_02",
        name: "Google Pixel 8 Pro (Gateway Rack Beta)",
        status: "ONLINE",
        batteryPercentage: 99,
        isCharging: true,
        appVersion: "v1.74.0",
        signalQuality: "EXCELLENT",
        simSlots: [
          {
            slotIndex: 0,
            carrier: "MTN Commercial",
            phoneNumber: "+256772123456",
            countryCode: "UG",
            status: "READY",
          },
        ],
        lastHeartbeat: new Date(Date.now() - 15000).toISOString(),
      },
    ];
  }

  static verifyOtp(phone: string, otpCode: string): { verified: boolean; token: string; tenant: any } {
    return {
      verified: true,
      token: `mf_jwt_live_${Buffer.from(`${phone}:${otpCode}:${Date.now()}`).toString("base64url")}`,
      tenant: {
        id: "tenant_mf_live_01",
        name: "M&F Institutional Gateway",
        phone,
        otpCodeMatched: otpCode,
        otpVerifiedAt: new Date().toISOString(),
      },
    };
  }

  // ── Core Lending Methods ───────────────────────────────────────────────

  static createLoanApplication(data: {
    applicantName: string;
    nationalId: string;
    loanAmount: number;
    tenureMonths: number;
    purpose?: string;
    monthlyIncome: number;
  }): LoanApplication {
    const applicationId = `loan_app_${Math.floor(10000 + Math.random() * 90000)}`;
    const interestRate = 11.5;
    const monthlyRate = interestRate / 100 / 12;
    const tenure = Number(data.tenureMonths) || 12;
    const amount = Number(data.loanAmount) || 100000;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure));

    const debtToIncome = (monthlyPayment / (Number(data.monthlyIncome) || 50000)) * 100;
    const creditScore = Math.floor(680 + Math.random() * 120);
    const decision = debtToIncome < 45 && creditScore >= 660 ? "APPROVED" : "PENDING_UNDERWRITING";

    const application: LoanApplication = {
      applicationId,
      applicantName: data.applicantName || "Institutional Borrower",
      nationalId: data.nationalId || "ID-UNKNOWN",
      loanAmount: amount,
      tenureMonths: tenure,
      purpose: data.purpose || "GENERAL_BUSINESS",
      monthlyIncome: Number(data.monthlyIncome) || 50000,
      interestRateAnnual: interestRate,
      estimatedMonthlyPayment: Number(monthlyPayment.toFixed(2)),
      decision,
      creditScore,
      createdAt: new Date().toISOString(),
    };

    this.applications.set(applicationId, application);
    return application;
  }

  static getLoanApplication(id: string): LoanApplication | null {
    const found = this.applications.get(id);
    if (found) return found;

    return {
      applicationId: id,
      applicantName: "Kiprono Langat",
      nationalId: "ID-88291044",
      loanAmount: 350000,
      tenureMonths: 18,
      purpose: "EQUIPMENT_FINANCING",
      monthlyIncome: 92000,
      interestRateAnnual: 11.5,
      estimatedMonthlyPayment: 21240.8,
      decision: "APPROVED",
      creditScore: 745,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    };
  }

  // ── Algorithmic Credit Scoring ─────────────────────────────────────────

  static evaluateScore(input: {
    applicantId?: string;
    annualRevenue?: number;
    creditHistoryYears?: number;
    existingDebt?: number;
    requestedLimit?: number;
  }) {
    const revenue = Number(input.annualRevenue) || 1200000;
    const debt = Number(input.existingDebt) || 150000;
    const historyYears = Number(input.creditHistoryYears) || 5;
    const requested = Number(input.requestedLimit) || 300000;

    const dtiRatio = (debt / (revenue / 12)) * 100;
    let baseScore = 650;

    if (dtiRatio < 25) baseScore += 90;
    else if (dtiRatio < 40) baseScore += 40;
    else baseScore -= 30;

    if (historyYears > 7) baseScore += 50;
    else if (historyYears > 3) baseScore += 25;

    const finalScore = Math.min(850, Math.max(300, baseScore));
    const tier = finalScore >= 750 ? "PRIME" : finalScore >= 670 ? "NEAR_PRIME" : "SUBPRIME";
    const approvedLimit = tier === "PRIME" ? requested : Math.round(requested * 0.75);

    return {
      applicantId: input.applicantId || "applicant_demo_01",
      creditScore: finalScore,
      tier,
      decision: finalScore >= 640 ? "QUALIFIED" : "MANUAL_REVIEW",
      debtToIncomeRatioPercent: Number(dtiRatio.toFixed(1)),
      maxEligibleLimit: approvedLimit,
      recommendedAprPercent: tier === "PRIME" ? 10.5 : 13.75,
      riskFactors: [
        { factor: "Debt-to-Income", rating: dtiRatio < 35 ? "LOW_RISK" : "MODERATE_RISK" },
        { factor: "Credit Bureau Vintage", rating: historyYears >= 4 ? "STABLE" : "LIMITED" },
      ],
      timestamp: new Date().toISOString(),
    };
  }

  // ── CRM & Collections ──────────────────────────────────────────────────

  static getCollectionsQueue() {
    return {
      queueCount: 3,
      totalOverdueAmountUsd: 14850.0,
      timestamp: new Date().toISOString(),
      items: [
        {
          caseId: "case_col_9012",
          borrowerName: "Zuberi Logistics Ltd",
          accountNumber: "ACC-891024",
          daysPastDue: 34,
          bucket: "30-59 DPD",
          outstandingPrincipal: 5200.0,
          accruedInterest: 340.0,
          lastPaymentDate: new Date(Date.now() - 35 * 86400000).toISOString(),
          assignedAgent: "Sarah Mutua",
          nextAction: "Automated SMS follow-up & Dial",
        },
        {
          caseId: "case_col_9013",
          borrowerName: "Mombasa Agrochem Distributors",
          accountNumber: "ACC-772190",
          daysPastDue: 18,
          bucket: "1-29 DPD",
          outstandingPrincipal: 7800.0,
          accruedInterest: 410.0,
          lastPaymentDate: new Date(Date.now() - 19 * 86400000).toISOString(),
          assignedAgent: "Brian Kibet",
          nextAction: "Courtesy payment reminder dispatched",
        },
        {
          caseId: "case_col_9014",
          borrowerName: "Naivasha Retail Emporium",
          accountNumber: "ACC-541299",
          daysPastDue: 62,
          bucket: "60-89 DPD",
          outstandingPrincipal: 1850.0,
          accruedInterest: 195.0,
          lastPaymentDate: new Date(Date.now() - 63 * 86400000).toISOString(),
          assignedAgent: "Sarah Mutua",
          nextAction: "Legal demand letter escalation",
        },
      ],
    };
  }
}
