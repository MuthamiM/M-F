// src/features/feedback/feedback.controller.ts
import { Request, Response, NextFunction } from "express";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackInput, UpdateFeedbackInput } from "./feedback.schema";

export async function createFeedbackHandler(
  req: Request<{}, {}, CreateFeedbackInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const ipAddress =
      (req.headers["cf-connecting-ip"] as string) ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      undefined;

    const userAgent = (req.headers["user-agent"] as string) || undefined;

    const record = await FeedbackService.create(req.body, ipAddress, userAgent);

    res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been received.",
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllFeedbackHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { status, category, search } = req.query as {
      status?: string;
      category?: string;
      search?: string;
    };

    const feedbackList = await FeedbackService.getAll({ status, category, search });

    res.json({
      success: true,
      data: feedbackList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeedbackStatsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stats = await FeedbackService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFeedbackHandler(
  req: Request<{ id: string }, {}, UpdateFeedbackInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const updated = await FeedbackService.update(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Feedback record not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFeedbackHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const deleted = await FeedbackService.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Feedback record not found",
      });
    }

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
