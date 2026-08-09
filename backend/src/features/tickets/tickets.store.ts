import { Ticket } from "./tickets.schema";
import { isRedisHealthy, setTicketRaw, delKey, getAllTicketValues } from "../../lib/redisClient";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { logger } from "../../config/logger";

class TicketStore {
  private tickets = new Map<string, Ticket>();
  private readonly persistencePath = join(process.cwd(), "data", "tickets.json");
  private writeQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.seed();
  }

  // Load persisted tickets before accepting traffic. Redis is optional; the local file
  // keeps the ticket system durable during development and when Redis is unavailable.
  public async initFromPersistence() {
    if (isRedisHealthy()) {
      const vals = await getAllTicketValues();
      if (vals.length > 0) {
        this.replaceTickets(vals.map((raw) => JSON.parse(raw) as Ticket));
        return;
      }
    }

    try {
      const raw = await readFile(this.persistencePath, "utf8");
      this.replaceTickets(JSON.parse(raw) as Ticket[]);
      logger.info(`Loaded ${this.tickets.size} ticket(s) from local storage`);
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        // Persist the initial ticket set so future restarts have a durable file.
        this.persistToDisk();
      } else {
        logger.warn(`Unable to load local ticket storage: ${(err as Error).message}`);
      }
    }
  }

  public get(id: string): Ticket | undefined {
    return this.tickets.get(id);
  }

  public getAll(): Ticket[] {
    return Array.from(this.tickets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  public set(id: string, ticket: Ticket): void {
    this.tickets.set(id, ticket);
    void setTicketRaw(`ticket:${id}`, JSON.stringify(ticket));
    this.persistToDisk();
  }

  public delete(id: string): boolean {
    const removed = this.tickets.delete(id);
    if (removed) {
      void delKey(`ticket:${id}`);
      this.persistToDisk();
    }
    return removed;
  }

  private replaceTickets(tickets: Ticket[]) {
    this.tickets.clear();
    for (const ticket of tickets) {
      ticket.createdAt = new Date(ticket.createdAt);
      ticket.updatedAt = new Date(ticket.updatedAt);
      ticket.notes = ticket.notes.map((note) => ({ ...note, createdAt: new Date(note.createdAt) }));
      ticket.messages = ticket.messages.map((message) => ({ ...message, timestamp: new Date(message.timestamp) }));
      ticket.callLogs = ticket.callLogs.map((call) => ({ ...call, calledAt: new Date(call.calledAt) }));
      this.tickets.set(ticket.id, ticket);
    }
  }

  private persistToDisk() {
    const snapshot = JSON.stringify(this.getAll(), null, 2);
    this.writeQueue = this.writeQueue
      .then(async () => {
        await mkdir(dirname(this.persistencePath), { recursive: true });
        const temporaryPath = `${this.persistencePath}.tmp`;
        await writeFile(temporaryPath, snapshot, "utf8");
        await rename(temporaryPath, this.persistencePath);
      })
      .catch((err: Error) => {
        logger.error(`Unable to persist tickets locally: ${err.message}`);
      });
  }

  private seed() {
    const now = new Date();
    
    const seedData: Ticket[] = [
      {
        id: "TKT-1001",
        type: "demo",
        name: "Sylvia Kamau",
        email: "skamau@equatorunion.co.ke",
        phone: "+254 722 123456",
        company: "Equator Sacco & Credit Union",
        message: "Automating loan underwriting workflow and connecting local credit scoring bureau databases.",
        status: "open",
        priority: "high",
        assignedAgent: "Jane Mwangi",
        notes: [],
        messages: [],
        callLogs: [],
        createdAt: new Date(now.getTime() - 20 * 60 * 1000), // 20 mins ago
        updatedAt: new Date(now.getTime() - 20 * 60 * 1000),
      },
      {
        id: "TKT-1002",
        type: "chatbot",
        name: "David Ochieng",
        email: "d.ochieng@towerfinance.com",
        phone: "+254 733 987654",
        company: "ChatBot — Agent Callback",
        message: "Agent callback requested.\nPhone: +254 733 987654\nRequest: Interested in integration APIs for core lending ledger systems.",
        status: "open",
        priority: "medium",
        assignedAgent: undefined,
        notes: [],
        messages: [],
        callLogs: [],
        createdAt: new Date(now.getTime() - 4 * 60 * 1000), // 4 mins ago
        updatedAt: new Date(now.getTime() - 4 * 60 * 1000),
      },
      {
        id: "TKT-1003",
        type: "demo",
        name: "Marcus Aurelius",
        email: "m.aurelius@apexcap.com",
        phone: "+254 711 555666",
        company: "Apex Capital Bank",
        message: "Requesting a live architectural walk-through of the double-entry transaction database schema for SOC2 audit compliance.",
        status: "in_progress",
        priority: "high",
        assignedAgent: "Jane Mwangi",
        notes: [
          {
            id: "note-1",
            text: "Emailed Marcus to confirm meeting time. Waiting for confirmation on calendar invite.",
            createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          }
        ],
        messages: [],
        callLogs: [],
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        id: "TKT-1004",
        type: "contact",
        name: "Brenda Wambui",
        email: "bwambui@centralcredit.or.ke",
        phone: "+254 700 444555",
        company: "Central Credit Partners",
        message: "General inquiry: Do you support multi-tenant instances on AWS regional centers in East Africa?",
        status: "resolved",
        priority: "low",
        assignedAgent: "Peter Koech",
        notes: [
          {
            id: "note-2",
            text: "Confirmed that we support AWS regional hosting in Cape Town and local Nairobi hybrid nodes.",
            createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          }
        ],
        messages: [],
        callLogs: [],
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
      {
        id: "TKT-1005",
        type: "chatbot",
        name: "Amos Rotich",
        email: "arotich@kenyashield.co.ke",
        phone: "+254 799 888777",
        company: "ChatBot — Agent Callback",
        message: "Agent callback requested.\nPhone: +254 799 888777\nRequest: Emergency response needed. Scoring scoring pipeline error on sandbox system.",
        status: "open",
        priority: "high",
        assignedAgent: undefined,
        notes: [],
        messages: [],
        callLogs: [],
        createdAt: new Date(now.getTime() - 1 * 60 * 1000), // 1 min ago
        updatedAt: new Date(now.getTime() - 1 * 60 * 1000),
      }
    ];

    for (const ticket of seedData) {
      this.tickets.set(ticket.id, ticket);
    }
  }
}

export const ticketStore = new TicketStore();
