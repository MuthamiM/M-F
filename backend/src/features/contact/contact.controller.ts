// src/features/contact/contact.controller.ts
import { Request, Response, NextFunction } from "express";
import * as contactService from "./contact.service";
import { ContactInput } from "./contact.schema";

export async function submitContactHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await contactService.submitContactForm(req.body as ContactInput);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
