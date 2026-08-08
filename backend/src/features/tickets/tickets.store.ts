import { Ticket } from "./tickets.schema";

class TicketStore {
  private tickets = new Map<string, Ticket>();

  constructor() {
    this.seed();
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
  }

  public delete(id: string): boolean {
    return this.tickets.delete(id);
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
