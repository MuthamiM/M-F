import { Ticket, Note, ChatMessage, CallLog } from "./tickets.schema";
import { pgPool, initDb } from "../../db/pgClient";
import { logger } from "../../config/logger";

class TicketStore {
  constructor() {}

  // Initialize DB tables and seed data if database is empty
  public async initFromPersistence() {
    await initDb();

    try {
      const countRes = await pgPool.query("SELECT COUNT(*) FROM tickets");
      const count = parseInt(countRes.rows[0].count, 10);
      if (count === 0) {
        logger.info("PostgreSQL database is empty. Seeding initial tickets...");
        await this.seed();
      } else {
        logger.info(`PostgreSQL database online. Loaded ${count} ticket(s) from DB.`);
      }
    } catch (err: any) {
      logger.error(`Failed to verify or seed database: ${err.message}`);
    }
  }

  public async get(id: string): Promise<Ticket | undefined> {
    const ticketRes = await pgPool.query("SELECT * FROM tickets WHERE id = $1", [id]);
    if (ticketRes.rowCount === 0) return undefined;
    const row = ticketRes.rows[0];

    const notesRes = await pgPool.query("SELECT * FROM ticket_notes WHERE ticket_id = $1 ORDER BY created_at ASC", [id]);
    const messagesRes = await pgPool.query("SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY timestamp ASC", [id]);
    const callsRes = await pgPool.query("SELECT * FROM ticket_call_logs WHERE ticket_id = $1 ORDER BY called_at ASC", [id]);

    return {
      id: row.id,
      type: row.type as any,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      company: row.company || undefined,
      message: row.message,
      status: row.status as any,
      priority: row.priority as any,
      assignedAgent: row.assigned_agent || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      notes: notesRes.rows.map((n: any) => ({
        id: n.id,
        text: n.text,
        createdAt: new Date(n.created_at),
      })),
      messages: messagesRes.rows.map((m: any) => ({
        id: m.id,
        sender: m.sender as any,
        senderName: m.sender_name,
        text: m.text,
        timestamp: new Date(m.timestamp),
      })),
      callLogs: callsRes.rows.map((c: any) => ({
        id: c.id,
        agentName: c.agent_name,
        phoneNumber: c.phone_number,
        outcome: c.outcome as any,
        durationSeconds: c.duration_seconds !== null ? c.duration_seconds : undefined,
        notes: c.notes || undefined,
        calledAt: new Date(c.called_at),
      })),
    };
  }

  public async getAll(): Promise<Ticket[]> {
    const ticketsRes = await pgPool.query("SELECT * FROM tickets ORDER BY created_at DESC");
    const notesRes = await pgPool.query("SELECT * FROM ticket_notes ORDER BY created_at ASC");
    const messagesRes = await pgPool.query("SELECT * FROM ticket_messages ORDER BY timestamp ASC");
    const callsRes = await pgPool.query("SELECT * FROM ticket_call_logs ORDER BY called_at ASC");

    const notesMap: Record<string, Note[]> = {};
    for (const n of notesRes.rows) {
      if (!notesMap[n.ticket_id]) notesMap[n.ticket_id] = [];
      notesMap[n.ticket_id].push({
        id: n.id,
        text: n.text,
        createdAt: new Date(n.created_at),
      });
    }

    const messagesMap: Record<string, ChatMessage[]> = {};
    for (const m of messagesRes.rows) {
      if (!messagesMap[m.ticket_id]) messagesMap[m.ticket_id] = [];
      messagesMap[m.ticket_id].push({
        id: m.id,
        sender: m.sender as any,
        senderName: m.sender_name,
        text: m.text,
        timestamp: new Date(m.timestamp),
      });
    }

    const callsMap: Record<string, CallLog[]> = {};
    for (const c of callsRes.rows) {
      if (!callsMap[c.ticket_id]) callsMap[c.ticket_id] = [];
      callsMap[c.ticket_id].push({
        id: c.id,
        agentName: c.agent_name,
        phoneNumber: c.phone_number,
        outcome: c.outcome as any,
        durationSeconds: c.duration_seconds !== null ? c.duration_seconds : undefined,
        notes: c.notes || undefined,
        calledAt: new Date(c.called_at),
      });
    }

    return ticketsRes.rows.map((row: any) => ({
      id: row.id,
      type: row.type as any,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      company: row.company || undefined,
      message: row.message,
      status: row.status as any,
      priority: row.priority as any,
      assignedAgent: row.assigned_agent || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      notes: notesMap[row.id] || [],
      messages: messagesMap[row.id] || [],
      callLogs: callsMap[row.id] || [],
    }));
  }

  public async set(_id: string, ticket: Ticket): Promise<void> {
    const client = await pgPool.connect();
    try {
      await client.query("BEGIN");

      // 1. Upsert ticket
      const ticketQuery = `
        INSERT INTO tickets (id, type, name, email, phone, company, message, status, priority, assigned_agent, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          priority = EXCLUDED.priority,
          assigned_agent = EXCLUDED.assigned_agent,
          updated_at = EXCLUDED.updated_at
      `;
      await client.query(ticketQuery, [
        ticket.id,
        ticket.type,
        ticket.name,
        ticket.email,
        ticket.phone || null,
        ticket.company || null,
        ticket.message,
        ticket.status,
        ticket.priority,
        ticket.assignedAgent || null,
        ticket.createdAt,
        ticket.updatedAt,
      ]);

      // 2. Sync notes
      if (ticket.notes && ticket.notes.length > 0) {
        for (const note of ticket.notes) {
          await client.query(
            `INSERT INTO ticket_notes (id, ticket_id, text, created_at)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO NOTHING`,
            [note.id, ticket.id, note.text, note.createdAt]
          );
        }
      }

      // 3. Sync messages
      if (ticket.messages && ticket.messages.length > 0) {
        for (const msg of ticket.messages) {
          await client.query(
            `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text, timestamp)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [msg.id, ticket.id, msg.sender, msg.senderName, msg.text, msg.timestamp]
          );
        }
      }

      // 4. Sync call logs
      if (ticket.callLogs && ticket.callLogs.length > 0) {
        for (const call of ticket.callLogs) {
          await client.query(
            `INSERT INTO ticket_call_logs (id, ticket_id, agent_name, phone_number, outcome, duration_seconds, notes, called_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [
              call.id,
              ticket.id,
              call.agentName,
              call.phoneNumber,
              call.outcome,
              call.durationSeconds || null,
              call.notes || null,
              call.calledAt,
            ]
          );
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  public async delete(id: string): Promise<boolean> {
    const res = await pgPool.query("DELETE FROM tickets WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  private async seed() {
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
        createdAt: new Date(now.getTime() - 20 * 60 * 1000),
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
        createdAt: new Date(now.getTime() - 4 * 60 * 1000),
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
          },
        ],
        messages: [],
        callLogs: [],
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
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
          },
        ],
        messages: [],
        callLogs: [],
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
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
        createdAt: new Date(now.getTime() - 1 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 60 * 1000),
      },
    ];

    for (const ticket of seedData) {
      await this.set(ticket.id, ticket);
    }
  }
}

export const ticketStore = new TicketStore();
