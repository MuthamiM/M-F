// src/features/contact/contact.controller.ts
import { Request, Response, NextFunction } from "express";
import * as contactService from "./contact.service";
import { ContactInput } from "./contact.schema";

export async function submitContactHandler(
  req: Request<unknown, unknown, ContactInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await contactService.submitContactForm(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
