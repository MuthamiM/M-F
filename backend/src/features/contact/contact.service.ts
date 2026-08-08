import { logger } from "../../config/logger";
import { ContactInput } from "./contact.schema";
import { createTicket } from "../tickets/tickets.service";

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

  // Create internal ticket
  let type: "chatbot" | "demo" | "contact" = "contact";
  if (input.company?.includes("ChatBot")) {
    type = "chatbot";
  } else if (input.message.toLowerCase().includes("demo")) {
    type = "demo";
  }

  const createdTicket = await createTicket({
    type,
    name: input.name,
    email: input.email,
    phone: input.phone || input.message.match(/Phone:\s*([^\n]+)/)?.[1] || undefined,
    company: input.company,
    message: input.message,
  });

  return {
    id: createdTicket.id,
    status: "received",
    message: "Thank you! We will follow up within 24 hours.",
  };
}
