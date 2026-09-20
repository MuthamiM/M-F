import { Request, Response, NextFunction } from "express";
import * as ticketsService from "./tickets.service";
import { TicketStatus, TicketPriority, TicketType } from "./tickets.schema";

export async function getTicketsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = {
      status: req.query.status as TicketStatus,
      priority: req.query.priority as TicketPriority,
      type: req.query.type as TicketType,
      search: req.query.search as string,
    };
    const tickets = await ticketsService.getAllTickets(filters);
    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    next(err);
  }
}

export async function getTicketByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ticket = await ticketsService.getTicketById(id as string);
    const typing = ticketsService.getTypingStatus(id as string);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.status(200).json({ success: true, data: { ...ticket, ...typing } });
  } catch (err) {
    next(err);
  }
}

export async function updateTicketHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updatedTicket = await ticketsService.updateTicket(id as string, req.body);
    res.status(200).json({ success: true, data: updatedTicket });
  } catch (err) {
    next(err);
  }
}

export async function getStatsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await ticketsService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getMessagesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { since } = req.query;
    const messages = await ticketsService.getMessages(id as string, since as string);
    // include ticket status and typing status for real-time interaction
    const ticket = await ticketsService.getTicketById(id as string);
    const typing = ticketsService.getTypingStatus(id as string);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.status(200).json({
      success: true,
      data: messages,
      status: ticket.status,
      isAgentTyping: typing.isAgentTyping,
      isClientTyping: typing.isClientTyping,
    });
  } catch (err) {
    next(err);
  }
}

export async function sendMessageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { text, senderName, attachmentUrl, attachmentName, attachmentType } = req.body;
    const msg = await ticketsService.sendMessage(id as string, "agent", senderName, text, {
      url: attachmentUrl,
      name: attachmentName,
      type: attachmentType,
    });
    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
}

export async function clientSendMessageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { text, senderName, attachmentUrl, attachmentName, attachmentType } = req.body;
    const msg = await ticketsService.sendMessage(id as string, "client", senderName, text, {
      url: attachmentUrl,
      name: attachmentName,
      type: attachmentType,
    });
    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
}

export async function setTypingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { sender, isTyping } = req.body;
    if (sender === "client" || sender === "agent") {
      ticketsService.setTyping(id as string, sender, Boolean(isTyping));
    }
    const typing = ticketsService.getTypingStatus(id as string);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.status(200).json({ success: true, data: typing });
  } catch (err) {
    next(err);
  }
}

export async function uploadAttachmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }
    const file = req.file;
    const fileUrl = `/uploads/${file.filename}`;
    const isImage = file.mimetype.startsWith("image/");
    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        name: file.originalname,
        type: isImage ? "image" : "document",
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logCallHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const log = await ticketsService.logCall(id as string, req.body);
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
}

export async function closeTicketHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };
    const updated = await ticketsService.closeTicket(id as string, reason);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}
