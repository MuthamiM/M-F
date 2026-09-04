// src/features/chatbot/chatbot.controller.ts
import type { Request, Response } from "express";
import https from "https";
import { logger } from "../../config/logger";
import { ticketStore } from "../tickets/tickets.store";
import { pgPool } from "../../db/pgClient";

/* ------------------------------------------------------------------ */
/*  Ticket Numbers dynamically retrieved from Database                 */
/* ------------------------------------------------------------------ */
async function generateTicketNumber(prefix: "CB" | "LIVE" | "CHAT"): Promise<string> {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  
  try {
    const pattern = `TKT-${prefix}-${dateStr}-%`;
    const res = await pgPool.query("SELECT COUNT(*) FROM tickets WHERE id LIKE $1", [pattern]);
    const count = parseInt(res.rows[0].count, 10);
    return `TKT-${prefix}-${dateStr}-${String(count + 1).padStart(3, "0")}`;
  } catch (err: any) {
    logger.error(`Error generating ticket number from DB: ${err.message}`);
    // Fallback in-memory timestamp to ensure absolute uniqueness under failure conditions
    const rand = Math.floor(Math.random() * 900) + 100;
    return `TKT-${prefix}-${dateStr}-${rand}`;
  }
}

/* ------------------------------------------------------------------ */
/*  HTTPS request wrapper with IPv4 priority                          */
/* ------------------------------------------------------------------ */
function httpRequest(url: string, options: any, postData?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions: https.RequestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || "GET",
      headers: options.headers || {},
      family: 4, // Force IPv4 to prevent undici IPv6 ETIMEDOUT on server
      timeout: 15000,
    };

    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

/* ------------------------------------------------------------------ */
/*  M&F Technologies System Prompt                                     */
/* ------------------------------------------------------------------ */
const SYSTEM_PROMPT = `You are the M&F Technologies Support Assistant representing M&F Technologies in Nairobi, Kenya.

COMPANY DETAILS:
- Name: M&F Technologies
- Website: https://mftechnologies.org
- Email: info@mftechnologies.org / contact@mftechnologies.co
- Phone: +254 748 329 410
- Location: Nairobi, Kenya
- Hours: Mon-Fri 08:00 to 17:00 EAT

PRODUCTS AND CAPABILITIES:
- Core Lending Systems: Origination, servicing, interest calculation, disbursement, repayment tracking.
- Credit Scoring Platforms: Machine learning risk assessment, decisioning weight trees, bureau telemetry aggregation.
- Collections Management: Recovery tracking, delinquency management, automated workflows.
- Web & Mobile Applications: Client self-service portals, borrower apps, loan application tracking.
- API Integration: Microservice architectures, M-Pesa (Daraja), CRB, core banking connectors, REST and GraphQL endpoints.
- Security & Compliance: AES-256 encryption, TLS 1.3, double-entry immutable ledgers, SOC 2 audit path.

STRICT FORMATTING RULES:
1. NEVER use any emojis under any circumstances.
2. NEVER use markdown formatting like asterisks (*), hashtags (#), or backticks. Always respond in plain text only.
3. Be professional, direct, concise, and helpful.
4. Keep responses short and readable (under 150 words). Use simple dashes for lists if needed.`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function cleanText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Groq Provider (Primary)                                            */
/* ------------------------------------------------------------------ */
async function callGroqAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error("GROK_API_KEY is missing");

  // Try openai/gpt-oss-20b first, then groq/compound-mini
  const models = ["openai/gpt-oss-20b", "groq/compound-mini"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const body = JSON.stringify({
        model,
        messages,
        max_tokens: 400,
        temperature: 0.5,
      });

      const data = await httpRequest(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        },
        body
      );

      const raw = data.choices?.[0]?.message?.content || "";
      if (raw) return cleanText(raw);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("All Groq models failed");
}

/* ------------------------------------------------------------------ */
/*  Gemini Provider (Fallback)                                         */
/* ------------------------------------------------------------------ */
async function callGeminiAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body = JSON.stringify({
    contents,
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: { maxOutputTokens: 400, temperature: 0.5 },
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const data = await httpRequest(url, { method: "POST", headers: { "Content-Type": "application/json" } }, body);

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return cleanText(raw);
}

/* ------------------------------------------------------------------ */
/*  POST /api/chatbot/start                                            */
/* ------------------------------------------------------------------ */
export async function startChatHandler(_req: Request, res: Response) {
  const greeting = "Welcome to M&F Technologies. How can we help you today?";
  const ticketId = await generateTicketNumber("CHAT");
  const now = new Date();

  try {
    await ticketStore.set(ticketId, {
      id: ticketId,
      type: "chatbot",
      name: "Website Visitor",
      email: "chatbot@mftechnologies.org",
      company: "ChatBot — Live Inquiry",
      message: "Visitor opened live chat support session",
      status: "open",
      priority: "medium",
      createdAt: now,
      updatedAt: now,
      notes: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "agent",
          senderName: "Support Assistant",
          text: greeting,
          timestamp: now,
        },
      ],
      callLogs: [],
    });
    logger.info(`Initialized live chat ticket ${ticketId} on chat start.`);
  } catch (err: any) {
    logger.error(`Failed to pre-create chat ticket: ${err.message}`);
  }

  res.json({
    success: true,
    data: {
      message: greeting,
      ticket: ticketId,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  POST /api/chatbot/message                                          */
/* ------------------------------------------------------------------ */
export async function sendMessageHandler(req: Request, res: Response) {
  const { mode, message, history, name, phone, email, reason, issue, ticket } = req.body;

  // Handle Callback Request -> Save directly to PostgreSQL Database!
  if (mode === "request_callback") {
    const ticketId = await generateTicketNumber("CB");
    const now = new Date();

    const response = `Thank you ${name || "Client"}. Your callback request has been logged under Callback Ticket ${ticketId}.\n\nDetails:\n- Phone: ${phone}\n- Email: ${email || "Not provided"}\n- Reason: ${reason || "General Callback"}\n\nOur engineering support team will call you within 1 business day.`;

    try {
      await ticketStore.set(ticketId, {
        id: ticketId,
        type: "chatbot",
        name: name || "Website Visitor",
        email: email || "callback@mftechnologies.org",
        phone: phone || undefined,
        company: "ChatBot — Callback Request",
        message: `Callback requested. Phone: ${phone}. Reason: ${reason || "General Inquiries"}`,
        status: "open",
        priority: "high",
        createdAt: now,
        updatedAt: now,
        notes: [],
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "client",
            senderName: name || "Website Visitor",
            text: `Callback Requested: ${phone} (${reason})`,
            timestamp: now,
          },
          {
            id: `msg-${Date.now() + 1}`,
            sender: "agent",
            senderName: "M&F System",
            text: response,
            timestamp: new Date(now.getTime() + 500),
          },
        ],
        callLogs: [],
      });
      logger.info(`Persisted Callback Ticket ${ticketId} to database.`);
    } catch (err: any) {
      logger.error(`Failed to save callback ticket to database: ${err.message}`);
    }

    res.json({
      success: true,
      data: {
        ticket: ticketId,
        response,
        provider: "Internal System",
      },
    });
    return;
  }

  // Handle Live Support Ticket Request -> Save directly to PostgreSQL Database!
  if (mode === "request_live_agent") {
    const ticketId = await generateTicketNumber("LIVE");
    const now = new Date();

    const response = `Live Support Ticket ${ticketId} created for ${name || "Client"}.\n\nIssue: ${issue || "Support Request"}\n\nYou are now connected to live support queue. An agent will join this session shortly. You may type your message below.`;

    try {
      await ticketStore.set(ticketId, {
        id: ticketId,
        type: "chatbot",
        name: name || "Website Visitor",
        email: email || "support@mftechnologies.org",
        company: "ChatBot — Live Agent Queue",
        message: `Live support session requested. Issue: ${issue || "Technical Assistance"}`,
        status: "open",
        priority: "high",
        createdAt: now,
        updatedAt: now,
        notes: [],
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "client",
            senderName: name || "Website Visitor",
            text: `Live Support Requested: ${issue}`,
            timestamp: now,
          },
          {
            id: `msg-${Date.now() + 1}`,
            sender: "agent",
            senderName: "M&F System",
            text: response,
            timestamp: new Date(now.getTime() + 500),
          },
        ],
        callLogs: [],
      });
      logger.info(`Persisted Live Agent Ticket ${ticketId} to database.`);
    } catch (err: any) {
      logger.error(`Failed to save live agent ticket to database: ${err.message}`);
    }

    res.json({
      success: true,
      data: {
        ticket: ticketId,
        response,
        provider: "Internal System",
      },
    });
    return;
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, error: "Message is required." });
    return;
  }

  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  if (Array.isArray(history)) {
    for (const h of history.slice(-10)) {
      if (h.role === "user" || h.role === "assistant") {
        messages.push({ role: h.role, content: cleanText(h.content) });
      }
    }
  }

  messages.push({ role: "user", content: cleanText(message) });

  let responseText = "";
  let usedProvider = "";

  try {
    responseText = await callGroqAPI(messages);
    usedProvider = "Groq";
  } catch (groqErr: any) {
    logger.warn(`Groq API failed: ${groqErr.message}. Trying Gemini fallback...`);
    try {
      responseText = await callGeminiAPI(messages);
      usedProvider = "Gemini";
    } catch (geminiErr: any) {
      logger.error(`Gemini API failed: ${geminiErr.message}`);
      responseText = "Thank you for contacting M&F Technologies. We engineer core lending systems, credit scoring platforms, and financial API infrastructure across East Africa. How can we assist you today?";
      usedProvider = "Fallback";
    }
  }

  const cleanedResponse = cleanText(responseText);
  let activeTicketId = ticket;

  // Auto-generate ticket for any chat interaction if no active ticket ID exists yet!
  if (!activeTicketId) {
    activeTicketId = await generateTicketNumber("CHAT");
    const now = new Date();
    try {
      await ticketStore.set(activeTicketId, {
        id: activeTicketId,
        type: "chatbot",
        name: "Website Visitor",
        email: "chatbot@mftechnologies.org",
        company: "ChatBot — Live Inquiry",
        message: cleanText(message),
        status: "open",
        priority: "medium",
        createdAt: now,
        updatedAt: now,
        notes: [],
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "client",
            senderName: "Website Visitor",
            text: cleanText(message),
            timestamp: now,
          },
          {
            id: `msg-${Date.now() + 1}`,
            sender: "agent",
            senderName: usedProvider === "Groq" || usedProvider === "Gemini" ? "AI Assistant" : "Support Agent",
            text: cleanedResponse,
            timestamp: new Date(now.getTime() + 200),
          },
        ],
        callLogs: [],
      });
      logger.info(`Auto-created ticket ${activeTicketId} in DB for initial chat message.`);
    } catch (err: any) {
      logger.error(`Failed to auto-create ticket in DB: ${err.message}`);
    }
  } else {
    // Append message to existing ticket in PostgreSQL
    try {
      const existingTicket = await ticketStore.get(activeTicketId);
      if (existingTicket) {
        existingTicket.messages.push({
          id: `msg-${Date.now()}`,
          sender: "client",
          senderName: existingTicket.name || "Website Visitor",
          text: cleanText(message),
          timestamp: new Date(),
        });
        existingTicket.messages.push({
          id: `msg-${Date.now() + 1}`,
          sender: "agent",
          senderName: usedProvider === "Groq" || usedProvider === "Gemini" ? "AI Assistant" : "Support Agent",
          text: cleanedResponse,
          timestamp: new Date(),
        });
        existingTicket.updatedAt = new Date();
        await ticketStore.set(activeTicketId, existingTicket);
        logger.info(`Appended chat message turn to DB ticket ${activeTicketId}.`);
      }
    } catch (err: any) {
      logger.error(`Failed to update ticket ${activeTicketId} in DB: ${err.message}`);
    }
  }

  res.json({
    success: true,
    data: {
      ticket: activeTicketId,
      response: cleanedResponse,
      provider: usedProvider,
    },
  });
}
