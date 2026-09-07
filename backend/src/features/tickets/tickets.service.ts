import { ticketStore } from "./tickets.store";
import { Ticket, TicketStatus, TicketPriority, TicketType, Note, ChatMessage, CallLog } from "./tickets.schema";
import { AppError } from "../../middleware/errorHandler.middleware";

export async function getAllTickets(filters: {
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  search?: string;
}) {
  let list = await ticketStore.getAll();

  if (filters.status) {
    list = list.filter((t) => t.status === filters.status);
  }
  if (filters.priority) {
    list = list.filter((t) => t.priority === filters.priority);
  }
  if (filters.type) {
    list = list.filter((t) => t.type === filters.type);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.email.toLowerCase().includes(s) ||
        (t.company && t.company.toLowerCase().includes(s)) ||
        t.message.toLowerCase().includes(s)
    );
  }

  return list;
}

export async function getTicketById(id: string) {
  const ticket = await ticketStore.get(id);
  if (!ticket) {
    throw new AppError(404, `Ticket ${id} not found`);
  }
  return ticket;
}

export async function createTicket(input: {
  type: TicketType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  latitude?: number;
  longitude?: number;
  ipAddress?: string;
  geoCity?: string;
  geoCountry?: string;
  geoRegion?: string;
}) {
  const allTickets = await ticketStore.getAll();
  const nextId = `TKT-${1000 + allTickets.length + 1}`;
  const now = new Date();

  // Dynamically assign priority based on content keywords
  let priority: TicketPriority = "medium";
  const msgLower = input.message.toLowerCase();
  if (msgLower.includes("emergency") || msgLower.includes("broken") || msgLower.includes("error") || msgLower.includes("urgent")) {
    priority = "high";
  } else if (msgLower.includes("general") || msgLower.includes("inquiry")) {
    priority = "low";
  }

  const newTicket: Ticket = {
    id: nextId,
    type: input.type,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company || "General Inquiry",
    message: input.message,
    latitude: input.latitude,
    longitude: input.longitude,
    ipAddress: input.ipAddress,
    geoCity: input.geoCity,
    geoCountry: input.geoCountry,
    geoRegion: input.geoRegion,
    status: "open",
    priority,
    notes: [],
    messages: [],
    callLogs: [],
    createdAt: now,
    updatedAt: now,
  };

  await ticketStore.set(nextId, newTicket);
  return newTicket;
}

export async function updateTicket(
  id: string,
  updates: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedAgent?: string;
    noteText?: string;
  }
) {
  const ticket = await getTicketById(id);
  const now = new Date();

  if (updates.status) ticket.status = updates.status;
  if (updates.priority) ticket.priority = updates.priority;
  if (updates.assignedAgent !== undefined) ticket.assignedAgent = updates.assignedAgent;

  if (updates.noteText) {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text: updates.noteText,
      createdAt: now,
    };
    ticket.notes.push(newNote);
  }

  ticket.updatedAt = now;
  await ticketStore.set(id, ticket);
  return ticket;
}

// ── Real-time chat messaging ─────────────────────────────────────────

export async function sendMessage(
  ticketId: string,
  sender: "client" | "agent",
  senderName: string,
  text: string,
  attachment?: {
    url?: string;
    name?: string;
    type?: string;
  }
) {
  const ticket = await getTicketById(ticketId);
  const now = new Date();

  // Clear typing state for sender when a message is sent
  setTyping(ticketId, sender, false);

  const msg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender,
    senderName,
    text: text || (attachment?.name ? `[Attachment: ${attachment.name}]` : ""),
    attachmentUrl: attachment?.url,
    attachmentName: attachment?.name,
    attachmentType: attachment?.type,
    timestamp: now,
  };

  ticket.messages.push(msg);

  // Auto-escalate status to in_progress when agent first replies
  if (sender === "agent" && ticket.status === "open") {
    ticket.status = "in_progress";
  }

  // If a client sends a message to a closed ticket, reopen it for agent handling
  if (sender === "client" && ticket.status === "closed") {
    ticket.status = "in_progress";
    // append an internal note indicating the reopen event
    ticket.notes.push({ id: `note-reopen-${Date.now()}`, text: "Client replied to closed ticket — reopened.", createdAt: now });
  }

  ticket.updatedAt = now;
  await ticketStore.set(ticketId, ticket);
  return msg;
}

// Close ticket and post a client-visible closing message; client can reopen by creating a new message
export async function closeTicket(ticketId: string, note?: string) {
  const ticket = await getTicketById(ticketId);
  const now = new Date();

  ticket.status = "closed";
  ticket.updatedAt = now;

  // Add a client-visible message indicating closure
  const closingText = note || "This ticket has been closed by support. Reply to reopen and request an agent.";
  const closingMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender: "agent",
    senderName: "System",
    text: closingText,
    timestamp: now,
  };

  ticket.messages.push(closingMsg);

  // Internal note
  ticket.notes.push({ id: `note-close-${Date.now()}`, text: `Ticket closed: ${note || "reason not provided"}`, createdAt: now });

  await ticketStore.set(ticketId, ticket);
  return ticket;
}

export async function getMessages(ticketId: string, since?: string) {
  const ticket = await getTicketById(ticketId);

  if (since) {
    const sinceDate = new Date(since);
    return ticket.messages.filter((m) => m.timestamp > sinceDate);
  }

  return ticket.messages;
}

// ── Call logging ─────────────────────────────────────────────────────

export async function logCall(
  ticketId: string,
  input: {
    agentName: string;
    phoneNumber: string;
    outcome: "answered" | "no_answer" | "voicemail" | "busy" | "callback_scheduled";
    durationSeconds?: number;
    notes?: string;
  }
) {
  const ticket = await getTicketById(ticketId);
  const now = new Date();

  const log: CallLog = {
    id: `call-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    agentName: input.agentName,
    phoneNumber: input.phoneNumber,
    outcome: input.outcome,
    durationSeconds: input.durationSeconds,
    notes: input.notes,
    calledAt: now,
  };

  ticket.callLogs.push(log);

  // Auto-escalate status when an outbound call is logged
  if (ticket.status === "open") {
    ticket.status = "in_progress";
  }

  // Auto-add an internal note for audit trail
  const outcomeLabels: Record<string, string> = {
    answered: "Answered",
    no_answer: "No Answer",
    voicemail: "Voicemail Left",
    busy: "Line Busy",
    callback_scheduled: "Callback Scheduled",
  };
  ticket.notes.push({
    id: `note-call-${Date.now()}`,
    text: `📞 Outbound call to ${input.phoneNumber} by ${input.agentName} — ${outcomeLabels[input.outcome] || input.outcome}${input.durationSeconds ? ` (${Math.floor(input.durationSeconds / 60)}m ${input.durationSeconds % 60}s)` : ""}${input.notes ? `. Notes: ${input.notes}` : ""}`,
    createdAt: now,
  });

  ticket.updatedAt = now;
  await ticketStore.set(ticketId, ticket);
  return log;
}

// ── Stats ────────────────────────────────────────────────────────────

export async function getStats() {
  const all = await ticketStore.getAll();
  
  const stats = {
    total: all.length,
    open: all.filter((t) => t.status === "open").length,
    inProgress: all.filter((t) => t.status === "in_progress").length,
    resolved: all.filter((t) => t.status === "resolved").length,
    closed: all.filter((t) => t.status === "closed").length,
    
    // Breakdown by types
    typeChatbot: all.filter((t) => t.type === "chatbot").length,
    typeDemo: all.filter((t) => t.type === "demo").length,
    typeContact: all.filter((t) => t.type === "contact").length,
  };

  return stats;
}

// ── Real-time Typing Indicator State ────────────────────────────────
interface TypingState {
  clientUntil: number;
  agentUntil: number;
}

const typingRegistry: Map<string, TypingState> = new Map();
const TYPING_TIMEOUT_MS = 3500;

export function setTyping(ticketId: string, sender: "client" | "agent", isTyping: boolean) {
  const current = typingRegistry.get(ticketId) || { clientUntil: 0, agentUntil: 0 };
  const now = Date.now();
  if (sender === "client") {
    current.clientUntil = isTyping ? now + TYPING_TIMEOUT_MS : 0;
  } else {
    current.agentUntil = isTyping ? now + TYPING_TIMEOUT_MS : 0;
  }
  typingRegistry.set(ticketId, current);
}

export function getTypingStatus(ticketId: string): { isClientTyping: boolean; isAgentTyping: boolean } {
  const current = typingRegistry.get(ticketId);
  if (!current) {
    return { isClientTyping: false, isAgentTyping: false };
  }
  const now = Date.now();
  return {
    isClientTyping: current.clientUntil > now,
    isAgentTyping: current.agentUntil > now,
  };
}
