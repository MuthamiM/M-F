// src/features/chatbot/chatbot.controller.ts
import type { Request, Response } from "express";
import https from "https";
import { logger } from "../../config/logger";

/* ------------------------------------------------------------------ */
/*  Ticket Counters                                                    */
/* ------------------------------------------------------------------ */
let cbCounter = 0;
let liveCounter = 0;
let lastDateStr = "";

function generateTicketNumber(prefix: "CB" | "LIVE"): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  if (dateStr !== lastDateStr) {
    cbCounter = 0;
    liveCounter = 0;
    lastDateStr = dateStr;
  }

  if (prefix === "CB") {
    cbCounter++;
    return `MFT-CB-${dateStr}-${String(cbCounter).padStart(4, "0")}`;
  } else {
    liveCounter++;
    return `MFT-LIVE-${dateStr}-${String(liveCounter).padStart(4, "0")}`;
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
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
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

  const body = JSON.stringify({
    model: "llama-3.1-8b-instant",
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
  return cleanText(raw);
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const data = await httpRequest(url, { method: "POST", headers: { "Content-Type": "application/json" } }, body);

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return cleanText(raw);
}

/* ------------------------------------------------------------------ */
/*  POST /api/chatbot/start                                            */
/* ------------------------------------------------------------------ */
export async function startChatHandler(_req: Request, res: Response) {
  const greeting = "Welcome to M&F Technologies. How can we help you today?";

  res.json({
    success: true,
    data: {
      message: greeting,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  POST /api/chatbot/message                                          */
/* ------------------------------------------------------------------ */
export async function sendMessageHandler(req: Request, res: Response) {
  const { mode, message, history, name, phone, email, reason, issue } = req.body;

  // Handle Callback Request
  if (mode === "request_callback") {
    const ticket = generateTicketNumber("CB");
    logger.info(`Callback request: ${ticket} for ${name || "Client"}`);

    const response = `Thank you ${name || "Client"}. Your callback request has been logged under Callback Ticket ${ticket}.\n\nDetails:\n- Phone: ${phone}\n- Email: ${email || "Not provided"}\n- Reason: ${reason || "General Callback"}\n\nOur engineering support team will call you within 1 business day.`;

    res.json({
      success: true,
      data: {
        ticket,
        response,
        provider: "Internal System",
      },
    });
    return;
  }

  // Handle Live Support Ticket Request
  if (mode === "request_live_agent") {
    const ticket = generateTicketNumber("LIVE");
    logger.info(`Live support ticket: ${ticket} for ${name || "Client"}`);

    const response = `Live Support Ticket ${ticket} created for ${name || "Client"}.\n\nIssue: ${issue || "Support Request"}\n\nYou are now connected to live support queue. An agent will join this session shortly. You may type your message below.`;

    res.json({
      success: true,
      data: {
        ticket,
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
      responseText = "We are currently experiencing connection delays. Please contact info@mftechnologies.org or call +254 748 329 410 for assistance.";
      usedProvider = "Fallback";
    }
  }

  res.json({
    success: true,
    data: {
      response: cleanText(responseText),
      provider: usedProvider,
    },
  });
}
