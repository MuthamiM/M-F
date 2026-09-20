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
- Careers / Active Openings: We have an active job opening for a Software Developer (Full-Stack & Core Systems) based ONSITE at our Nairobi headquarters (The Pavilion, 4th Fl, Westlands). Candidates can view requirements and apply at https://mftechnologies.org/careers or email info@mftechnologies.org.

COMPLETE CAPABILITIES & SOLUTIONS (WHAT WE DO):
1. Core Lending Engine & Double-Entry Ledger: End-to-end loan origination, automated underwriting, double-entry audit accounting ledger, automated disbursements (M-Pesa C2B/B2C, bank rails), flexible interest rate engines, and automated repayment tracking.
2. Alternative Credit Scoring Platform: Machine learning risk assessment, credit bureau (CRB) data aggregation, decisioning weight trees, mobile money telemetry scoring, and instant pass/fail underwriting.
3. Collections Management & Recovery: Delinquency tracking, automated SMS/email recovery dispatches, promise-to-pay tracking, collector queue assignment, and legal workflow escalation.
4. Mobile & Web Application Suite: Borrower self-service web portal, mobile apps, offline-first field loan officer app (with mobile KYC, document scanner, GPS location capture), and multi-tenant admin console.
5. Financial API Gateway: Microservices architecture, M-Pesa Daraja integration, CRB query connectors, core banking connectors, REST and GraphQL endpoints with 99.99% uptime SLA.
6. Security & Compliance: AES-256 encryption, TLS 1.3, double-entry immutable ledgers, SOC 2 Type II audit path, role-based access control (RBAC), and GDPR/Data Protection Act compliance.

CRITICAL PRICING & SALES CONNECTION RULES:
1. NEVER mention price figures, dollar amounts ($), or numerical costs under any circumstances.
2. ONLY IF the user explicitly asks for price, cost, rates, or pricing:
   - DO NOT state prices or numbers.
   - ASK whether to connect them with Sales & Support to get a custom institutional quote or proposal.
3. For general inquiries about what we do, services, or solutions:
   - Provide a comprehensive response explaining our capabilities.
   - ASK whether to connect them with Sales & Support to discuss their requirements or schedule a demo.
4. STEP-BY-STEP SUPPORT CONNECTION (ASK NAME AND EMAIL ONE BY ONE WITH VALIDATION):
   - Step 1 (Ask Name First): When a visitor asks to connect with sales/support or agrees to connect:
     Ask ONLY for their Full Name first: "I would be glad to connect you with our Sales & Support team. First, what is your Full Name?"
   - Step 2 (Ask Email Second): Once the visitor provides their name, acknowledge their name and ask ONLY for their Email Address next: "Thank you [Name]! What is your Email Address so our team can contact you or send a proposal?"
   - Step 3 (Validate Input): If the user enters an invalid email format when asked for email, politely ask: "Please enter a valid email address (e.g. name@institution.com) so we can log your request."
   - Step 4 (Confirm & Connect): Once BOTH a valid Name and a valid Email address have been provided:
     Confirm warmly: "Thank you, [Name]! Your live support request has been logged for [Email]. A representative from our Sales & Support team will join this session or reach out to you shortly."
5. Always include action options: "You can click Request Callback or Talk to Live Support Agent below, or call +254 748 329 410."

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
/*  Groq API with groq/compound-mini                                  */
/* ------------------------------------------------------------------ */
async function callGroqAPI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GROK_API_KEY || "";
  if (!apiKey) throw new Error("GROK_API_KEY is not configured");

  const groqMessages = messages.map((m) => ({
    role: m.role === "agent" ? "assistant" : m.role,
    content: m.content,
  }));

  const payload = JSON.stringify({
    model: "groq/compound-mini",
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
/*  Gemini API Fallback with gemini-3.6-flash                          */
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
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
      const isPriceQuery = lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("pricing") || lowerMsg.includes("rate") || lowerMsg.includes("how much") || lowerMsg.includes("fee") || lowerMsg.includes("quote");

      if (isPriceQuery) {
        responseText = "We provide customized pricing tailored to your institution scale, loan portfolio volume, and deployment requirements. Would you like me to connect you with Sales & Support to discuss your specific requirements and receive an official quote? Click Request Callback or Talk to Live Support Agent below, or call us at +254 748 329 410.";
      } else {
        responseText = "M&F Technologies Core Solutions:\n1. Core Lending Engine: Automated loan origination, double-entry audit accounting ledger, automated disbursements (M-Pesa/Bank rails), and repayment scheduling.\n2. Alternative Credit Scoring: Machine learning risk assessment, credit bureau (CRB) aggregation, and mobile money telemetry scoring.\n3. Collections Management: Delinquency tracking, automated SMS/email recovery notifications, and collector queue management.\n4. Mobile & Web Apps: Borrower self-service portals and offline-first field agent apps with mobile KYC.\n5. Financial API Gateway: High-throughput REST and GraphQL endpoints with 99.99% uptime SLA.\n\nWould you like me to connect you with Sales & Support to discuss your requirements or request a live demo? Click Request Callback or Talk to Live Support Agent below.";
      }
      usedProvider = "Fallback System";
    }
  }

  const cleanedResponse = cleanText(responseText);
  let activeTicketId = ticket;

  // Detect if visitor provided an email address in text conversation to upgrade to Live Support Ticket
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  let emailMatch = (message || "").match(emailRegex);
  let detectedEmail = emailMatch ? emailMatch[1] : "";
  let detectedName = "";

  // Check history for email if not present in current message
  if (!detectedEmail && Array.isArray(history)) {
    for (const h of history.slice().reverse()) {
      const match = (h.content || "").match(emailRegex);
      if (match) {
        detectedEmail = match[1];
        break;
      }
    }
  }

  // Extract name from history or current message
  if (Array.isArray(history)) {
    for (let i = 0; i < history.length; i++) {
      const h = history[i];
      if (h.role === "assistant" && h.content && (h.content.includes("Full Name") || h.content.includes("your name"))) {
        if (i + 1 < history.length && history[i + 1].role === "user") {
          const candidate = history[i + 1].content.trim();
          if (candidate && !candidate.includes("@") && candidate.length < 40) {
            detectedName = candidate.replace(/my name is/i, "").replace(/i am/i, "").trim();
          }
        }
      }
    }
  }

  if (!detectedName && message) {
    const msgText = cleanText(message);
    const parts = msgText.split(/[,|\n-]/);
    if (parts.length > 0 && !parts[0].includes("@") && parts[0].length < 40) {
      const candidate = parts[0].replace(/my name is/i, "").replace(/i am/i, "").trim();
      if (candidate.length >= 2 && !candidate.toLowerCase().includes("connect") && !candidate.toLowerCase().includes("yes")) {
        detectedName = candidate;
      }
    }
  }

  const shouldConnectLive = Boolean(detectedEmail);

  if (shouldConnectLive) {
    activeTicketId = await generateTicketNumber("LIVE");
    const now = new Date();
    const ip = getReqIp(req);
    try {
      const geo = ip ? await lookupGeo(ip) : {};
      await ticketStore.set(activeTicketId, {
        id: activeTicketId,
        type: "chatbot",
        name: detectedName || "Website Visitor",
        email: detectedEmail,
        company: "ChatBot — Live Support Requested in Chat",
        message: `Live support session requested via text chat. Email: ${detectedEmail}`,
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
            senderName: detectedName || "Website Visitor",
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
      logger.info(`Upgraded chat to Live Support Ticket ${activeTicketId} for ${detectedEmail}.`);
    } catch (err: any) {
      logger.error(`Failed to create live support ticket from email match: ${err.message}`);
    }
  } else if (!activeTicketId) {
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
      connectLive: shouldConnectLive,
      userName: detectedName,
      userEmail: detectedEmail,
    },
  });
}
