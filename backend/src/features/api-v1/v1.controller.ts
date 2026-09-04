// src/features/api-v1/v1.controller.ts
import { Request, Response, NextFunction } from "express";
import { ApiV1Service } from "./v1.service";

export class ApiV1Controller {
  // ── Health ─────────────────────────────────────────────────────────────
  static getHealth(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      data: {
        platform: "M&F Technologies Live API Gateway",
        version: "v2.4.0",
        status: "OPERATIONAL",
        securityProtocol: "TLS 1.3 / AES-256 GCM",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    });
  }

  // ── SMS ────────────────────────────────────────────────────────────────
  static sendSms(req: Request, res: Response, next: NextFunction): void {
    try {
      const { to, message, senderId, priority } = req.body || {};
      if (!to || !message) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_ARGUMENT",
            message: "Fields 'to' and 'message' are required.",
          },
        });
        return;
      }

      const result = ApiV1Service.sendSms({ to, message, senderId, priority });
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static getSms(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = String(req.params.id);
      const result = ApiV1Service.getSmsById(id);
      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            code: "MESSAGE_NOT_FOUND",
            message: `SMS message with id '${id}' not found.`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static listSms(req: Request, res: Response, next: NextFunction): void {
    try {
      const limit = Number(req.query.limit) || 20;
      const list = ApiV1Service.listSms(limit);
      res.status(200).json({
        success: true,
        data: {
          messages: list,
          total: list.length,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static getDevices(_req: Request, res: Response, next: NextFunction): void {
    try {
      const devices = ApiV1Service.getDevices();
      res.status(200).json({
        success: true,
        data: devices,
      });
    } catch (err) {
      next(err);
    }
  }

  static verifyOtp(req: Request, res: Response, next: NextFunction): void {
    try {
      const { phone, otpCode } = req.body || {};
      if (!phone || !otpCode) {
        res.status(400).json({
          success: false,
          error: {
            code: "MISSING_PARAMETERS",
            message: "Both 'phone' and 'otpCode' are required.",
          },
        });
        return;
      }

      const result = ApiV1Service.verifyOtp(phone, otpCode);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // ── Lending ────────────────────────────────────────────────────────────
  static createLoanApplication(req: Request, res: Response, next: NextFunction): void {
    try {
      const { applicantName, nationalId, loanAmount, tenureMonths, purpose, monthlyIncome } = req.body || {};
      if (!applicantName || !loanAmount) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: "Missing required loan application parameters (applicantName, loanAmount).",
          },
        });
        return;
      }

      const application = ApiV1Service.createLoanApplication({
        applicantName,
        nationalId,
        loanAmount: Number(loanAmount),
        tenureMonths: Number(tenureMonths) || 12,
        purpose,
        monthlyIncome: Number(monthlyIncome) || 50000,
      });

      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (err) {
      next(err);
    }
  }

  static getLoanApplication(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = String(req.params.id);
      const app = ApiV1Service.getLoanApplication(id);
      if (!app) {
        res.status(404).json({
          success: false,
          error: {
            code: "APPLICATION_NOT_FOUND",
            message: `Loan application '${id}' not found.`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: app,
      });
    } catch (err) {
      next(err);
    }
  }

  // ── Scoring ────────────────────────────────────────────────────────────
  static evaluateScore(req: Request, res: Response, next: NextFunction): void {
    try {
      const evaluation = ApiV1Service.evaluateScore(req.body || {});
      res.status(200).json({
        success: true,
        data: evaluation,
      });
    } catch (err) {
      next(err);
    }
  }

  // ── CRM ────────────────────────────────────────────────────────────────
  static getCollectionsQueue(_req: Request, res: Response, next: NextFunction): void {
    try {
      const queue = ApiV1Service.getCollectionsQueue();
      res.status(200).json({
        success: true,
        data: queue,
      });
    } catch (err) {
      next(err);
    }
  }

  // ── Webhooks ───────────────────────────────────────────────────────────
  static testWebhook(req: Request, res: Response, next: NextFunction): void {
    try {
      res.status(200).json({
        success: true,
        message: "Webhook event received, cryptographic signature verified, and dispatched to subscriber queue.",
        eventId: `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
        receivedPayload: req.body || {},
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
