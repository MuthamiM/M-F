// src/features/feedback/feedback.routes.ts
import { Router } from "express";
import {
  createFeedbackHandler,
  getAllFeedbackHandler,
  getFeedbackStatsHandler,
  updateFeedbackHandler,
  deleteFeedbackHandler,
} from "./feedback.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createFeedbackSchema, updateFeedbackSchema } from "./feedback.schema";

export const feedbackRouter = Router();

// Public endpoint: any website visitor / FAQ user can submit feedback
feedbackRouter.post("/", validate(createFeedbackSchema), createFeedbackHandler);

// Admin-only endpoints: require JWT authentication
feedbackRouter.use(requireAuth);
feedbackRouter.get("/", getAllFeedbackHandler);
feedbackRouter.get("/stats", getFeedbackStatsHandler);
feedbackRouter.patch("/:id", validate(updateFeedbackSchema), updateFeedbackHandler);
feedbackRouter.delete("/:id", deleteFeedbackHandler);
