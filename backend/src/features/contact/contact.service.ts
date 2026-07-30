// src/features/contact/contact.service.ts
import { logger } from "../../config/logger";
import { ContactInput } from "./contact.schema";

export async function submitContactForm(input: ContactInput) {
  // Honeypot tripped → pretend success, drop silently. Don't tell bots
  // their submission was rejected, or they adapt.
  if (input.website) {
    logger.info("Honeypot triggered, dropping submission", { email: input.email });
    return { received: true };
  }

  // Replace with: send email (e.g. via a transactional email API),
  // and/or persist to DB / CRM for follow-up.
  logger.info("Contact form submitted", {
    name: input.name,
    email: input.email,
    company: input.company,
  });

  return { received: true };
}
