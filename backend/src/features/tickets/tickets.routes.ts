import { Router } from "express";
import {
  getTicketsHandler,
  getTicketByIdHandler,
  updateTicketHandler,
  getStatsHandler,
  getMessagesHandler,
  sendMessageHandler,
  clientSendMessageHandler,
  logCallHandler,
  closeTicketHandler,
} from "./tickets.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateTicketSchema, sendMessageSchema, clientSendMessageSchema, logCallSchema } from "./tickets.schema";

export const ticketsRouter = Router();

// Public chat endpoints for website visitors/chatbot UI
ticketsRouter.get("/:id/messages", getMessagesHandler);
ticketsRouter.post("/:id/messages", validate(clientSendMessageSchema), clientSendMessageHandler);
ticketsRouter.post("/:id/client-close", closeTicketHandler);

// Apply auth protection to all administrative ticket endpoints
ticketsRouter.use(requireAuth);

ticketsRouter.get("/", getTicketsHandler);
ticketsRouter.get("/stats", getStatsHandler);
ticketsRouter.get("/:id", getTicketByIdHandler);
ticketsRouter.patch("/:id", validate(updateTicketSchema), updateTicketHandler);
ticketsRouter.post("/:id/agent-messages", validate(sendMessageSchema), sendMessageHandler);
ticketsRouter.post("/:id/calls", validate(logCallSchema), logCallHandler);
// Admin: explicitly close a ticket (e.g., no response from client)
ticketsRouter.post("/:id/close", closeTicketHandler);


