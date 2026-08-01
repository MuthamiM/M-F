// src/features/contact/contact.service.ts
import { logger } from "../../config/logger";
import { ContactInput } from "./contact.schema";

export async function submitContactForm(input: ContactInput) {
  // Honeypot tripped → pretend success, drop silently
  if (input.website && input.website.length > 0) {
    logger.warn("Honeypot tripped — dropping spam submission", { email: input.email });
    return { id: "dropped", status: "received" };
  }

  // In production: send email, push to CRM, etc.
  logger.info("New contact form submission", {
    name: input.name,
    email: input.email,
    company: input.company,
  });

  return {
    id: `contact_${Date.now()}`,
    status: "received",
    message: "Thank you! We will follow up within 24 hours.",
  };
}
