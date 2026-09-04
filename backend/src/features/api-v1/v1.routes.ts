// src/features/api-v1/v1.routes.ts
import { Router } from "express";
import { ApiV1Controller } from "./v1.controller";

export const v1Router = Router();

// Health
v1Router.get("/health", ApiV1Controller.getHealth);

// SMS Gateway
v1Router.post("/messages", ApiV1Controller.sendSms);
v1Router.get("/messages", ApiV1Controller.listSms);
v1Router.get("/messages/:id", ApiV1Controller.getSms);
v1Router.get("/devices", ApiV1Controller.getDevices);
v1Router.post("/auth/verify-otp", ApiV1Controller.verifyOtp);

// Core Lending API
v1Router.post("/lending/applications", ApiV1Controller.createLoanApplication);
v1Router.get("/lending/applications/:id", ApiV1Controller.getLoanApplication);

// Algorithmic Credit Scoring
v1Router.post("/scoring/evaluate", ApiV1Controller.evaluateScore);

// CRM Collections Queue
v1Router.get("/crm/collections", ApiV1Controller.getCollectionsQueue);
v1Router.get("/collections/queue", ApiV1Controller.getCollectionsQueue);

// Webhooks
v1Router.post("/webhooks/test", ApiV1Controller.testWebhook);
