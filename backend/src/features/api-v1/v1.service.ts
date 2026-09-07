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
  productType?: string;
  purpose: string;
  monthlyIncome: number;
  interestRateAnnual: number;
  estimatedMonthlyPayment: number;
  decision: "APPROVED" | "PENDING_UNDERWRITING" | "REJECTED";
  creditScore: number;
  createdAt: string;
}

export interface LoanProduct {
  id: string;
  code: string;
  name: string;
  category: "SECURED" | "UNSECURED" | "COMMERCIAL" | "ASSET_BACKED";
  interestRateMonthlyPercent: number;
  interestRateAnnualPercent: number;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  processingFeePercent: number;
  currency: string;
  description: string;
  requirements: string[];
}

export interface LoanCalculationResult {
  principal: number;
  currency: string;
  tenureMonths: number;
  calculationMethod: "REDUCING_BALANCE" | "FLAT_RATE";
  interestRateAnnualPercent: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  processingFee: number;
  disbursementAmount: number;
  amortizationSchedule: {
    period: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
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

  static getLoanProducts(): LoanProduct[] {
    return [
      {
        id: "prod_logbook_ke",
        code: "LOGBOOK",
        name: "Logbook Asset Credit",
        category: "SECURED",
        interestRateMonthlyPercent: 3.5,
        interestRateAnnualPercent: 42.0,
        minAmount: 50000,
        maxAmount: 2500000,
        minTenureMonths: 3,
        maxTenureMonths: 24,
        processingFeePercent: 2.5,
        currency: "KES",
        description: "Fast liquidity secured against private or commercial motor vehicle logbooks with 24-hour settlement.",
        requirements: ["Original Logbook / NTSA Copy", "National ID & KRA PIN", "6 Months Bank/M-Pesa Statement", "Comprehensive Insurance"],
      },
      {
        id: "prod_sme_boost",
        code: "SME",
        name: "SME Working Capital Boost",
        category: "COMMERCIAL",
        interestRateMonthlyPercent: 2.5,
        interestRateAnnualPercent: 30.0,
        minAmount: 100000,
        maxAmount: 1500000,
        minTenureMonths: 1,
        maxTenureMonths: 12,
        processingFeePercent: 2.0,
        currency: "KES",
        description: "Working capital facility and stock financing tailored for registered Kenyan businesses and retail merchants.",
        requirements: ["Certificate of Incorporation / Business Reg", "12 Months Trading Turnover Records", "Director Guarantees"],
      },
      {
        id: "prod_salary_adv",
        code: "SALARY_ADVANCE",
        name: "Salary Advance (Check-Off)",
        category: "UNSECURED",
        interestRateMonthlyPercent: 5.0,
        interestRateAnnualPercent: 60.0,
        minAmount: 5000,
        maxAmount: 100000,
        minTenureMonths: 1,
        maxTenureMonths: 1,
        processingFeePercent: 0.0,
        currency: "KES",
        description: "Instant check-off advance for verified employees of partnered corporate institutions with direct M-Pesa push.",
        requirements: ["Latest 3 Pay Slips", "Staff Employee ID", "Employer Check-off MoU"],
      },
      {
        id: "prod_asset_machinery",
        code: "ASSET_FINANCE",
        name: "Equipment & Heavy Machinery Financing",
        category: "ASSET_BACKED",
        interestRateMonthlyPercent: 1.17,
        interestRateAnnualPercent: 14.0,
        minAmount: 200000,
        maxAmount: 5000000,
        minTenureMonths: 6,
        maxTenureMonths: 36,
        processingFeePercent: 1.5,
        currency: "KES",
        description: "Longer-term asset acquisition financing for logistics, agricultural machinery, and industrial hardware.",
        requirements: ["Proforma Invoice from Approved Vendor", "Company Financial Statements", "20% Down Payment"],
      },
      {
        id: "prod_emergency_cash",
        code: "EMERGENCY",
        name: "Karibu Emergency Instant Cash",
        category: "UNSECURED",
        interestRateMonthlyPercent: 8.0,
        interestRateAnnualPercent: 96.0,
        minAmount: 1000,
        maxAmount: 50000,
        minTenureMonths: 1,
        maxTenureMonths: 1,
        processingFeePercent: 0.0,
        currency: "KES",
        description: "Algorithmic emergency micro-cash facility disbursed within 90 seconds via automated M-Pesa B2C rail.",
        requirements: ["National ID", "Mobile Line with Active M-Pesa Record > 6 Mos"],
      },
    ];
  }

  static calculateLoanRepayment(params: {
    loanAmount: number;
    tenureMonths: number;
    interestRateAnnual?: number;
    calculationMethod?: "REDUCING_BALANCE" | "FLAT_RATE";
    currency?: string;
  }): LoanCalculationResult {
    const principal = Number(params.loanAmount) || 100000;
    const tenure = Number(params.tenureMonths) || 12;
    const annualRate = Number(params.interestRateAnnual) || 12.0;
    const method = params.calculationMethod === "FLAT_RATE" ? "FLAT_RATE" : "REDUCING_BALANCE";
    const currency = params.currency || "KES";
    const processingFee = Number((principal * 0.02).toFixed(2));

    let monthlyPayment = 0;
    let totalInterest = 0;
    const schedule: LoanCalculationResult["amortizationSchedule"] = [];

    if (method === "FLAT_RATE") {
      totalInterest = principal * (annualRate / 100) * (tenure / 12);
      const totalRepay = principal + totalInterest;
      monthlyPayment = totalRepay / tenure;

      let remaining = principal;
      const principalPerMonth = principal / tenure;
      const interestPerMonth = totalInterest / tenure;

      for (let i = 1; i <= Math.min(6, tenure); i++) {
        remaining -= principalPerMonth;
        schedule.push({
          period: i,
          payment: Number(monthlyPayment.toFixed(2)),
          principal: Number(principalPerMonth.toFixed(2)),
          interest: Number(interestPerMonth.toFixed(2)),
          remainingBalance: Math.max(0, Number(remaining.toFixed(2))),
        });
      }
    } else {
      const monthlyRate = annualRate / 100 / 12;
      monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure));
      let currentBalance = principal;

      for (let i = 1; i <= tenure; i++) {
        const interestPeriod = currentBalance * monthlyRate;
        const principalPeriod = monthlyPayment - interestPeriod;
        currentBalance -= principalPeriod;
        totalInterest += interestPeriod;

        if (i <= 6) {
          schedule.push({
            period: i,
            payment: Number(monthlyPayment.toFixed(2)),
            principal: Number(principalPeriod.toFixed(2)),
            interest: Number(interestPeriod.toFixed(2)),
            remainingBalance: Math.max(0, Number(currentBalance.toFixed(2))),
          });
        }
      }
    }

    return {
      principal,
      currency,
      tenureMonths: tenure,
      calculationMethod: method,
      interestRateAnnualPercent: annualRate,
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalRepayment: Number((principal + totalInterest).toFixed(2)),
      processingFee,
      disbursementAmount: Number((principal - processingFee).toFixed(2)),
      amortizationSchedule: schedule,
    };
  }

  static createLoanApplication(data: {
    applicantName: string;
    nationalId: string;
    loanAmount: number;
    tenureMonths: number;
    productType?: string;
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
      productType: data.productType || "SME",
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
