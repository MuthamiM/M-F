import { Router } from "express";
import { submitContactHandler } from "./contact.controller";
import { validate } from "../../middleware/validate.middleware";
import { contactSchema } from "./contact.schema";
import { strictRateLimiter } from "../../middleware/rateLimiter.middleware";

export const contactRouter = Router();

contactRouter.post("/", strictRateLimiter, validate(contactSchema), submitContactHandler);
