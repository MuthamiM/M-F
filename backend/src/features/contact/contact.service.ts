import { logger } from "../../config/logger";
import { ContactInput } from "./contact.schema";
import { createTicket, sendMessage } from "../tickets/tickets.service";
import { sendMail } from "../../lib/mailer";
import { lookupGeo } from "../../lib/visitLogger";

export async function submitContactForm(input: ContactInput, clientIp?: string) {
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
    ip: clientIp,
  });

  // Fire-and-forget: a failed email must never block ticket creation
  sendMail({
    subject: `New contact form submission from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      input.company ? `Company: ${input.company}` : null,
      clientIp ? `IP: ${clientIp}` : null,
      `Message: ${input.message}`,
    ].filter(Boolean).join("\n"),
  });

  // Geo lookup if IP is available
  let geoLat = input.latitude;
  let geoLon = input.longitude;
  let geoCity: string | undefined;
  let geoCountry: string | undefined;
  let geoRegion: string | undefined;

  if (clientIp) {
    try {
      const geo = await lookupGeo(clientIp);
      if (geoLat === undefined) geoLat = geo.lat;
      if (geoLon === undefined) geoLon = geo.lon;
      geoCity = geo.city;
      geoCountry = geo.country;
      geoRegion = geo.region;
    } catch (e: any) {
      logger.warn(`Geo lookup failed for contact submission: ${e.message}`);
    }
  }

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
    latitude: geoLat,
    longitude: geoLon,
    ipAddress: clientIp || undefined,
    geoCity,
    geoCountry,
    geoRegion,
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
