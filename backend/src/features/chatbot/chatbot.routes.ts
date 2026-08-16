// src/features/chatbot/chatbot.routes.ts
import { Router } from "express";
import { startChatHandler, sendMessageHandler } from "./chatbot.controller";

export const chatbotRouter = Router();

// POST /api/chatbot/start — creates a session with a ticket number
chatbotRouter.post("/start", startChatHandler);

// POST /api/chatbot/message — sends a user message and gets an AI response
chatbotRouter.post("/message", sendMessageHandler);
