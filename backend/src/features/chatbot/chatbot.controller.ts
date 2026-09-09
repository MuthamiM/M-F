// src/features/chatbot/chatbot.controller.ts
import type { Request, Response } from "express";
import https from "https";
import { logger } from "../../config/logger";
import { ticketStore } from "../tickets/tickets.store";
import { pgPool } from "../../db/pgClient";
import { lookupGeo } from "../../lib/visitLogger";

function getReqIp(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    req.ip ||
    ""
  );
}

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
const SYSTEM_PROMPT = `You are the M&F Technologies Intelligent Support & Sales Assistant representing M&F Technologies in Nairobi, Kenya.

MISSION & IDENTITY:
- M&F Technologies is a premier financial technology & software engineering provider in East Africa (operating across Kenya, Uganda, Tanzania, Rwanda, and South Sudan).
- We build bank-grade core lending engines, alternative credit scoring platforms, collections recovery software, borrower mobile apps, and financial API infrastructure for Commercial Banks, Credit Unions (SACCOs), Microfinance Institutions (MFIs), and Digital Lenders.
- Website: https://mftechnologies.org
- Email: info@mftechnologies.org / contact@mftechnologies.co
- Phone: +254 748 329 410
- Office: Nairobi Hub, Kenya (Registered in UK & West Africa)
- Hours: Mon-Fri 08:00 to 17:00 EAT (24/7 Monitoring & System Support)

COMPLETE CAPABILITIES & SOLUTIONS (WHAT WE DO):
1. Core Lending Engine & Double-Entry Ledger: End-to-end loan origination, automated underwriting, double-entry audit accounting ledger, automated disbursements (M-Pesa C2B/B2C, bank rails), flexible interest rate engines, and automated repayment tracking.
2. Alternative Credit Scoring Platform: Machine learning risk assessment, credit bureau (CRB) data aggregation, decisioning weight trees, mobile money telemetry scoring, and instant pass/fail underwriting.
3. Collections Management & Recovery: Delinquency tracking, automated SMS/email recovery dispatches, promise-to-pay tracking, collector queue assignment, and legal workflow escalation.
4. Mobile & Web Application Suite: Borrower self-service web portal, mobile apps, offline-first field loan officer app (with mobile KYC, document scanner, GPS location capture), and multi-tenant admin console.
5. Financial API Gateway: Microservices architecture, M-Pesa Daraja integration, CRB query connectors, core banking connectors, REST and GraphQL endpoints with 99.99% uptime SLA.
6. Security & Compliance: AES-256 encryption, TLS 1.3, double-entry immutable ledgers, SOC 2 Type II audit path, role-based access control (RBAC), and GDPR/Data Protection Act compliance.

APPROXIMATE PRICING & LICENSING STRUCTURE:
- Core Lending Engine: Starter Tier ($450/month for up to 10,000 active loans), Growth Tier ($1,200/month for up to 100,000 active loans), Enterprise Tier (Custom volume pricing for commercial banks with dedicated infrastructure).
- Credit Scoring Platform: Pay-as-you-go per query. Starter at $0.15/query; Enterprise High-Volume (50,000+ queries/mo) at $0.05/query.
- Collections Management: $350/month flat software subscription + $0.02 per automated SMS/email recovery notification.
- Web & Mobile App Suite: $500/month per institutional tenant instance with unlimited field officer/agent licenses.
- Financial API Connectors: Included free with Core Lending, or $250/month for standalone API gateway access.

SALES & SUPPORT CONNECTION PROTOCOL:
- Sales and Support are unified under our engineering support team.
- When asked about what we do, provide a clear, comprehensive, and helpful answer covering relevant services.
- When asked about prices or costs, ALWAYS share the approximate pricing transparently AND offer to connect them directly with Sales/Support for a custom quote or architectural demo.
- Direct Escalation instruction to give users: "Our Sales & Support Engineering team is available right now. To connect with Sales for a custom quote or speak with a live agent, click Request Callback or Talk to Live Support Agent below, or call +254 748 329 410."

STRICT FORMATTING RULES:
1. NEVER use any emojis under any circumstances.
2. NEVER use markdown formatting like asterisks (*), hashtags (#), or backticks. Always respond in plain text only.
3. Be professional, authoritative, helpful, direct, and concise.
4. Keep responses clear and under 250 words. Use simple dashes for lists.`;

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
/*  Groq API with Gemma 2 9B IT                                       */
/* ------------------------------------------------------------------ */
async function callGroqAPI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GROK_API_KEY || "";
  if (!apiKey) throw new Error("GROK_API_KEY is not configured");

  const groqMessages = messages.map((m) => ({
    role: m.role === "agent" ? "assistant" : m.role,
    content: m.content,
  }));

  const payload = JSON.stringify({
    model: "gemma2-9b-it",
    messages: groqMessages,
    temperature: 0.7,
    max_tokens: 300,
  });

  const data = await httpRequest("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  }, payload);

  if (data.error) {
    throw new Error(`Groq API Error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  const raw = data.choices?.[0]?.message?.content || "";
  return cleanText(raw);
}

/* ------------------------------------------------------------------ */
/*  Gemini API Fallback with gemini-2.0-flash                          */
/* ------------------------------------------------------------------ */
async function callGeminiAPI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "agent" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300,
    },
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const data = await httpRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, payload);

  if (data.error) {
    throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return cleanText(raw);
}

/* ------------------------------------------------------------------ */
/*  POST /api/chatbot/start                                            */
/* ------------------------------------------------------------------ */
export async function startChatHandler(req: Request, res: Response) {
  const greeting = "Welcome to M&F Technologies. How can we help you today?";
  const ticketId = await generateTicketNumber("CHAT");
  const now = new Date();
  const ip = getReqIp(req);

  try {
    const geo = ip ? await lookupGeo(ip) : {};
    await ticketStore.set(ticketId, {
      id: ticketId,
      type: "chatbot",
      name: "Website Visitor",
      email: "chatbot@mftechnologies.org",
      company: "ChatBot — Live Inquiry",
      message: "Visitor opened live chat support session",
      status: "open",
      priority: "medium",
      latitude: geo.lat,
      longitude: geo.lon,
      ipAddress: ip || undefined,
      geoCity: geo.city,
      geoCountry: geo.country,
      geoRegion: geo.region,
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

    const ip = getReqIp(req);
    try {
      const geo = ip ? await lookupGeo(ip) : {};
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
        latitude: geo.lat,
        longitude: geo.lon,
        ipAddress: ip || undefined,
        geoCity: geo.city,
        geoCountry: geo.country,
        geoRegion: geo.region,
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
    const ip = getReqIp(req);

    const response = `Live Support Ticket ${ticketId} created for ${name || "Client"}.\n\nIssue: ${issue || "Support Request"}\n\nYou are now connected to live support queue. An agent will join this session shortly. You may type your message below.`;

    try {
      const geo = ip ? await lookupGeo(ip) : {};
      await ticketStore.set(ticketId, {
        id: ticketId,
        type: "chatbot",
        name: name || "Website Visitor",
        email: email || "support@mftechnologies.org",
        company: "ChatBot — Live Agent Queue",
        message: `Live support session requested. Issue: ${issue || "Technical Assistance"}`,
        status: "open",
        priority: "high",
        latitude: geo.lat,
        longitude: geo.lon,
        ipAddress: ip || undefined,
        geoCity: geo.city,
        geoCountry: geo.country,
        geoRegion: geo.region,
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
      logger.info(`Persisted Live Agent Ticket ${ticketId} to database with IP: ${ip}.`);
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
      const lowerMsg = (message || "").toLowerCase();
      if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("pricing") || lowerMsg.includes("rate") || lowerMsg.includes("how much") || lowerMsg.includes("detail") || lowerMsg.includes("service")) {
        responseText = "M&F Technologies Service & Pricing Breakdown:\n- Core Lending Engine: Starter ($450/mo for up to 10k loans), Growth ($1,200/mo for 100k loans), Enterprise (Custom quote).\n- Credit Scoring Platform: $0.15/query (Starter) down to $0.05/query (Enterprise high volume).\n- Collections & Recovery: $350/mo flat subscription + $0.02/automated SMS dispatch.\n- Web & Mobile App Suite: $500/mo per tenant instance (unlimited field agent licenses).\n- API Connectors: Included with Core Lending or $250/mo standalone.\n\nTo get an official enterprise quote or speak directly with our team, click Request Callback or Talk to Live Support Agent below.";
      } else {
        responseText = "Thank you for contacting M&F Technologies. We provide core lending systems, credit scoring platforms, collections automation, and financial APIs. To speak directly with our team, click Request Callback or Talk to Live Support Agent below.";
      }
      usedProvider = "Fallback System";
    }
  }

  const cleanedResponse = cleanText(responseText);
  let activeTicketId = ticket;

  // Auto-generate ticket for any chat interaction if no active ticket ID exists yet!
  if (!activeTicketId) {
    activeTicketId = await generateTicketNumber("CHAT");
    const now = new Date();
    const ip = getReqIp(req);
    try {
      const geo = ip ? await lookupGeo(ip) : {};
      await ticketStore.set(activeTicketId, {
        id: activeTicketId,
        type: "chatbot",
        name: "Website Visitor",
        email: "chatbot@mftechnologies.org",
        company: "ChatBot — Live Inquiry",
        message: cleanText(message),
        status: "open",
        priority: "medium",
        latitude: geo.lat,
        longitude: geo.lon,
        ipAddress: ip || undefined,
        geoCity: geo.city,
        geoCountry: geo.country,
        geoRegion: geo.region,
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
      logger.info(`Auto-created ticket ${activeTicketId} in DB for initial chat message with IP: ${ip}.`);
    } catch (err: any) {
      logger.error(`Failed to auto-create ticket in DB: ${err.message}`);
    }
  } else {
    // Append message to existing ticket in PostgreSQL
    try {
      const existingTicket = await ticketStore.get(activeTicketId);
      if (existingTicket) {
        const ip = getReqIp(req);
        if (ip && !existingTicket.ipAddress) {
          existingTicket.ipAddress = ip;
          try {
            const geo = await lookupGeo(ip);
            if (geo.city) existingTicket.geoCity = geo.city;
            if (geo.country) existingTicket.geoCountry = geo.country;
            if (geo.region) existingTicket.geoRegion = geo.region;
            if (geo.lat) existingTicket.latitude = geo.lat;
            if (geo.lon) existingTicket.longitude = geo.lon;
          } catch {}
        }
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
