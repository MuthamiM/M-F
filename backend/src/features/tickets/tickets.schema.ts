import { z } from "zod";

export const ticketStatusSchema = z.enum(["open", "in_progress", "resolved", "closed"]);
export const ticketPrioritySchema = z.enum(["low", "medium", "high"]);
export const ticketTypeSchema = z.enum(["chatbot", "demo", "contact"]);

export const noteSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.date(),
});

export const chatMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(["client", "agent"]),
  senderName: z.string(),
  text: z.string(),
  timestamp: z.date(),
});

export const callLogSchema = z.object({
  id: z.string(),
  agentName: z.string(),
  phoneNumber: z.string(),
  outcome: z.enum(["answered", "no_answer", "voicemail", "busy", "callback_scheduled"]),
  durationSeconds: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  calledAt: z.date(),
});

export const ticketSchema = z.object({
  id: z.string(),
  type: ticketTypeSchema,
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: ticketStatusSchema,
  priority: ticketPrioritySchema,
  assignedAgent: z.string().optional(),
  notes: z.array(noteSchema),
  messages: z.array(chatMessageSchema),
  callLogs: z.array(callLogSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type TicketPriority = z.infer<typeof ticketPrioritySchema>;
export type TicketType = z.infer<typeof ticketTypeSchema>;
export type Note = z.infer<typeof noteSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type CallLog = z.infer<typeof callLogSchema>;
export type Ticket = z.infer<typeof ticketSchema>;

// Schema for updating a ticket
export const updateTicketSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: ticketStatusSchema.optional(),
    priority: ticketPrioritySchema.optional(),
    assignedAgent: z.string().optional(),
    noteText: z.string().min(1).optional(),
  }),
});

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>["body"];

// Schema for sending a chat message (agent-side, auth protected)
export const sendMessageSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    text: z.string().min(1),
    senderName: z.string().min(1),
  }),
});

// Schema for client sending a chat message (public, with ticketId)
export const clientSendMessageSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    text: z.string().min(1),
    senderName: z.string().min(1),
  }),
});

// Schema for logging a phone call against a ticket
export const logCallSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    agentName: z.string().min(1),
    phoneNumber: z.string().min(1),
    outcome: z.enum(["answered", "no_answer", "voicemail", "busy", "callback_scheduled"]),
    durationSeconds: z.number().int().min(0).optional(),
    notes: z.string().optional(),
  }),
});

