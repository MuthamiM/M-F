import { logger } from "../../config/logger";
import { ContactInput } from "./contact.schema";
import { createTicket, sendMessage } from "../tickets/tickets.service";

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

  // Keep the submitted details in the ticket conversation as well as the
  // ticket record, so the agent can see the visitor's context immediately.
  await sendMessage(
    createdTicket.id,
    "client",
    input.name,
    [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      `Request: ${input.message}`,
    ].filter(Boolean).join("\n")
  );

  return {
    id: createdTicket.id,
    status: "received",
    message: "Thank you! We will follow up within 24 hours.",
  };
}
