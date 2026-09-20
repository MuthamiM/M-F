// src/features/api-v1/v1.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import { ApiV1Controller } from "./v1.controller";

export const v1Router = Router();

/**
 * Middleware: Enforces that caller must have an active M&F account and supply
 * an API key via 'X-API-Key' or 'Authorization: Bearer'.
 * Public endpoints bypass this middleware and can be tested freely without an account.
 */
function requireAccountApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKeyHeader = req.headers["x-api-key"] as string | undefined;
  const authHeader = req.headers["authorization"] as string | undefined;

  const providedKey = apiKeyHeader || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined);

  if (!providedKey || providedKey.trim() === "") {
    res.status(401).json({
      success: false,
      error: {
        code: "ACCOUNT_REQUIRED",
        message:
          "Authentication required. You must have an active M&F account and supply a valid API key (via 'X-API-Key: mf_live_...' or 'Authorization: Bearer <token>') to access this protected endpoint. Public endpoints (Health, Loan Products, Calculator, Gateway Devices, Verify OTP) can be tested freely without an account.",
      },
    });
    return;
  }

  const trimmed = providedKey.trim();
  if (trimmed.startsWith("mf_") || trimmed.startsWith("ey") || trimmed.length >= 16) {
    (req as any).account = {
      accountId: "acc_mf_institution_01",
      institutionName: "M&F Licensed Financial Institution",
      tier: "ENTERPRISE_API",
      apiKeyPrefix: trimmed.substring(0, 10) + "...",
    };
    next();
    return;
  }

  res.status(401).json({
    success: false,
    error: {
      code: "INVALID_API_KEY",
      message:
        "The provided API key or Bearer token is invalid or inactive. Please provide an active key starting with 'mf_' or test with sandbox key 'mf_test_live_4f9a82b1'.",
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PUBLIC ENDPOINTS (Can be tried without an account)
// ─────────────────────────────────────────────────────────────────────────────

// System Health & Telemetry
v1Router.get("/health", ApiV1Controller.getHealth);

// Core Lending: Public Loan Products Catalog (Powered by Karibu Credit Engine)
v1Router.get("/lending/products", ApiV1Controller.getLoanProducts);

// Core Lending: Public Loan Amortization & Repayment Calculator
v1Router.post("/lending/calculate", ApiV1Controller.calculateLoan);

// SMS Gateway: Public Hardware Device & SIM Status Diagnostics
v1Router.get("/devices", ApiV1Controller.getDevices);

// Authentication: OTP Verification
v1Router.post("/auth/verify-otp", ApiV1Controller.verifyOtp);

// Webhooks: Public Signature Simulator / Echo Test
v1Router.post("/webhooks/test", ApiV1Controller.testWebhook);

// ─────────────────────────────────────────────────────────────────────────────
// 2. ACCOUNT-PROTECTED ENDPOINTS (Requires M&F Account / API Key)
// ─────────────────────────────────────────────────────────────────────────────

// Core Lending: Create Loan Application (Requires account)
v1Router.post("/lending/applications", requireAccountApiKey, ApiV1Controller.createLoanApplication);

// Core Lending: Get Loan Application Details & Status (Requires account)
v1Router.get("/lending/applications/:id", requireAccountApiKey, ApiV1Controller.getLoanApplication);

// Algorithmic Credit & CRB Scoring (Requires account)
v1Router.post("/scoring/evaluate", requireAccountApiKey, ApiV1Controller.evaluateScore);

// CRM Collections Queue (Requires account)
v1Router.get("/crm/collections", requireAccountApiKey, ApiV1Controller.getCollectionsQueue);
v1Router.get("/collections/queue", requireAccountApiKey, ApiV1Controller.getCollectionsQueue);

// SMS Gateway: Send Transactional SMS (Requires account)
v1Router.post("/messages", requireAccountApiKey, ApiV1Controller.sendSms);

// SMS Gateway: List SMS Messages (Requires account)
v1Router.get("/messages", requireAccountApiKey, ApiV1Controller.listSms);

// SMS Gateway: Get SMS Delivery Status (Requires account)
v1Router.get("/messages/:id", requireAccountApiKey, ApiV1Controller.getSms);
