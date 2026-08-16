// src/features/chatbot/chatbot.controller.ts
// AI-powered chatbot using xAI Grok API with fallback to Google Gemini 1.5 Flash.

import type { Request, Response } from "express";
import { logger } from "../../config/logger";

/* ------------------------------------------------------------------ */
/*  Ticket counter — resets on server restart (fine for chat support)   */
/* ------------------------------------------------------------------ */
let dailyCounter = 0;
let lastDateStr = "";

function generateTicketNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ""); // 20260816
  if (dateStr !== lastDateStr) {
    dailyCounter = 0;
    lastDateStr = dateStr;
  }
  dailyCounter++;
  const seq = String(dailyCounter).padStart(4, "0");
  return `MFT-${dateStr}-${seq}`;
}

/* ------------------------------------------------------------------ */
/*  M&F Technologies Knowledge Base — System Prompt                    */
/* ------------------------------------------------------------------ */
const SYSTEM_PROMPT = `You are the M&F Technologies AI Support Assistant. You represent M&F Technologies — a financial technology company headquartered in Nairobi, Kenya that builds institutional-grade lending software for banks, credit unions, and microfinance institutions.

COMPANY OVERVIEW:
- Full Name: M&F Technologies
- Website: https://mftechnologies.org
- Email: info@mftechnologies.org / contact@mftechnologies.co
- Phone: +254 748 329 410
- Location: Nairobi, Kenya
- Operating Hours: Monday–Friday, 08:00–17:00 EAT

CORE PRODUCTS & SERVICES:
1. Core Lending Systems — End-to-end loan lifecycle management (origination, underwriting, disbursement, repayment tracking, delinquency management)
2. Credit Scoring Platforms — Automated risk-based decisioning engines with ML-powered credit models
3. Collections Management — Workflow-driven recovery tracking and automated follow-up systems
4. Client Portals & Mobile Apps — Secure self-service borrower portals with real-time loan status
5. API Integration Layer — Secure JSON REST & GraphQL endpoints for third-party integrations
6. Transactional Middleware — Payment gateway connectors (M-Pesa, bank transfers, card processing)
7. Regulatory Compliance Tools — KYC/AML automation, audit trails, reporting

SECURITY & COMPLIANCE:
- AES-256 encryption at rest
- TLS 1.3 encryption in transit
- SOC 2 compliance readiness
- Immutable database audit trails
- Support for local data protection regulations (Kenya DPA, GDPR)
- Role-based access control (RBAC)
- Two-factor authentication (2FA)

PRICING:
- Enterprise pricing is customized based on transaction volume, database size, and deployment model
- Deployment options: Cloud-hosted SaaS (with SLA) or On-premise installation
- Contact the sales team for a tailored quotation

INTEGRATION CAPABILITIES:
- M-Pesa (Safaricom Daraja API)
- Bank transfer APIs (SWIFT, RTGS, EFT)
- Credit Reference Bureau (CRB) integrations
- Core banking system connectors
- SMS gateway integration (bulk SMS, OTP)

TARGET CLIENTS:
- Commercial banks
- Microfinance institutions (MFIs)
- SACCOs (Savings and Credit Co-operatives)
- Credit unions
- Digital lenders
- Fintechs requiring lending infrastructure

CONVERSATION RULES:
1. Be professional, helpful, and concise. Use a warm but institutional tone.
2. If you don't know something specific, say so honestly and offer to connect them with a human agent.
3. Never make up pricing — always direct pricing questions to the sales team.
4. Keep responses under 200 words unless the user asks for detailed technical information.
5. If asked about competitors, stay professional — highlight M&F's strengths without disparaging others.
6. For demo requests, encourage them to use the "Request Demo" feature on the website or offer to connect them with an agent.
7. Always remind users they can speak to a live agent if they need further assistance.
8. Format responses with clear line breaks for readability. Use bullet points where appropriate.
9. If asked about job openings, direct them to the Careers page at https://mftechnologies.org/careers
10. For technical API questions, direct them to the documentation at https://mftechnologies.org/docs`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Grok (xAI) Provider                                                */
/* ------------------------------------------------------------------ */
async function callGrokAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error("GROK_API_KEY is not defined");
  }

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-beta", // using a reliable Grok model name
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 512,
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Grok API returned status ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as any;
  return data.choices?.[0]?.message?.content?.trim() || "";
}

/* ------------------------------------------------------------------ */
/*  Gemini Provider (Fallback)                                         */
/* ------------------------------------------------------------------ */
async function callGeminiAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  // Convert system prompt and history to Gemini's format
  // Gemini expects:
  // contents: [{ role: "user" | "model", parts: [{ text: "..." }] }]
  // systemInstruction: { parts: [{ text: "..." }] }
  const contents = messages
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API returned status ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as any;
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

/* ------------------------------------------------------------------ */
/*  POST /api/chatbot/start                                            */
/* ------------------------------------------------------------------ */
export async function startChatHandler(_req: Request, res: Response) {
  const ticket = generateTicketNumber();
  const greeting = `👋 Hello! I'm the M&F Technologies AI Assistant. Your support ticket is **${ticket}**.\n\nI can help you with:\n• Our lending technology products & services\n• Security & compliance information\n• Integration capabilities (M-Pesa, APIs, etc.)\n• Scheduling a demo or callback\n• General company inquiries\n\nHow can I assist you today?`;

  logger.info(`Chatbot session started — ticket ${ticket}`);

  res.json({
    success: true,
    data: {
      ticket,
      message: greeting,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  POST /api/chatbot/message                                          */
/* ------------------------------------------------------------------ */
export async function sendMessageHandler(req: Request, res: Response) {
  const { ticket, message, history } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, error: "Message is required." });
    return;
  }

  // Build standard OpenAI/Grok format first
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (Array.isArray(history)) {
    for (const h of history.slice(-10)) {
      if (h.role === "user" || h.role === "assistant") {
        messages.push({ role: h.role, content: h.content });
      }
    }
  }

  messages.push({ role: "user", content: message.trim() });

  logger.info(`Chatbot message request [${ticket || "no-ticket"}]`);

  let responseText = "";
  let usedProvider = "";

  // Attempt Grok first
  try {
    responseText = await callGrokAPI(messages);
    usedProvider = "Grok";
  } catch (grokErr: any) {
    logger.warn(`Grok API failed: ${grokErr.message}. Falling back to Gemini...`);
    
    // Fallback to Gemini
    try {
      responseText = await callGeminiAPI(messages);
      usedProvider = "Gemini";
    } catch (geminiErr: any) {
      logger.error(`Gemini API also failed: ${geminiErr.message}`);
      responseText = "I'm having trouble connecting to my AI engines right now. Please reach out to info@mftechnologies.org or call +254 748 329 410 for help.";
      usedProvider = "None (Fallback)";
    }
  }

  logger.info(`Chatbot response generated using ${usedProvider}`);

  res.json({
    success: true,
    data: {
      ticket: ticket || null,
      response: responseText,
      provider: usedProvider,
    },
  });
}
