// src/features/careers/careers.service.ts
import crypto from "crypto";
import path from "path";
import { logger } from "../../config/logger";
import { sendMail } from "../../lib/mailer";
import { pgPool } from "../../db/pgClient";
import type { PendingUpload } from "./careers.upload";

interface ApplicationInput {
  name: string;
  email: string;
  phone: string;
  experience: string;
  portfolio: string;
  coverNote: string;
}

export async function submitApplication(
  input: ApplicationInput,
  upload: { cv: PendingUpload; resume: PendingUpload },
  clientIp?: string
) {
  logger.info("Submitting job application", {
    name: input.name,
    email: input.email,
    phone: input.phone,
    experience: input.experience,
    hasCv: !!upload.cv,
    hasResume: !!upload.resume,
    ip: clientIp,
  });

  const attachments: { filename: string; content: Buffer }[] = [];
  const applicationId = `career_${crypto.randomBytes(10).toString("hex")}`;
  const safeCandidateName =
    input.name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_") || "Candidate";

  const cvExt = path.extname(upload.cv.originalName).toLowerCase();
  const safeCvName = `CV_${safeCandidateName}${cvExt}`;
  attachments.push({ filename: safeCvName, content: upload.cv.content });

  const resumeExt = path.extname(upload.resume.originalName).toLowerCase();
  const safeResumeName = `Resume_${safeCandidateName}${resumeExt}`;
  attachments.push({ filename: safeResumeName, content: upload.resume.content });

  const client = await pgPool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO career_applications
        (id, name, email, phone, experience, portfolio, cover_note, client_ip)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        applicationId,
        input.name,
        input.email,
        input.phone,
        input.experience,
        input.portfolio || null,
        input.coverNote,
        clientIp || null,
      ]
    );
    await client.query(
      `INSERT INTO career_application_documents
        (application_id, kind, original_name, stored_name, mime_type, file_size, content)
       VALUES
        ($1, 'cv', $2, $3, $4, $5, $6),
        ($1, 'resume', $7, $8, $9, $10, $11)`,
      [
        applicationId,
        upload.cv.originalName,
        safeCvName,
        upload.cv.mimeType,
        upload.cv.size,
        upload.cv.content,
        upload.resume.originalName,
        safeResumeName,
        upload.resume.mimeType,
        upload.resume.size,
        upload.resume.content,
      ]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  // Build attachment summary lines
  const fileLines: string[] = [];
  fileLines.push(`• CV: ${upload.cv.originalName} (${(upload.cv.size / 1024).toFixed(1)} KB)`);
  fileLines.push(
    `• Resume/Cover Letter: ${upload.resume.originalName} (${(upload.resume.size / 1024).toFixed(1)} KB)`
  );

  const textBody = [
    "═══════════════════════════════════════",
    "  JOB APPLICATION — Software Developer",
    "  (Backend & Core Systems)",
    "═══════════════════════════════════════",
    "",
    `Candidate:       ${input.name}`,
    `Email:           ${input.email}`,
    `Phone:           ${input.phone}`,
    `Experience:      ${input.experience}`,
    `Portfolio/Links: ${input.portfolio || "Not provided"}`,
    `Submitted from:  ${clientIp || "Unknown IP"}`,
    "",
    "── Candidate Summary & Qualifications ──",
    "",
    input.coverNote,
    "",
    "── Attachments Included ──",
    ...fileLines,
    "",
    "═══════════════════════════════════════",
    "This application was submitted via the M&F Technologies careers page.",
  ].join("\n");

  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a2e; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0; font-size: 18px; font-weight: 600;">New Job Application</h2>
    <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.8;">Software Developer (Backend &amp; Core Systems)</p>
  </div>
  <div style="border: 1px solid #e5e5e5; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 8px 0; color: #666; width: 130px;">Candidate</td><td style="padding: 8px 0; font-weight: 600;">${input.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${input.email}" style="color: #1a1a2e;">${input.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;"><a href="tel:${input.phone}" style="color: #1a1a2e;">${input.phone}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Experience</td><td style="padding: 8px 0;">${input.experience}</td></tr>
      ${input.portfolio ? `<tr><td style="padding: 8px 0; color: #666;">Portfolio</td><td style="padding: 8px 0;"><a href="${input.portfolio}" style="color: #1a1a2e;">${input.portfolio}</a></td></tr>` : ""}
    </table>
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;">
    <h3 style="font-size: 14px; color: #1a1a2e; margin: 0 0 8px;">Summary &amp; Qualifications</h3>
    <p style="font-size: 13px; color: #333; line-height: 1.6; white-space: pre-wrap;">${input.coverNote.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;">
    <h4 style="font-size: 13px; color: #1a1a2e; margin: 0 0 6px;">Attached Documents:</h4>
    <ul style="font-size: 12px; color: #333; padding-left: 20px; margin: 0;">
      ${fileLines.map((l) => `<li>${l}</li>`).join("")}
    </ul>
    <p style="font-size: 11px; color: #bbb; margin-top: 16px;">Submitted from IP: ${clientIp || "Unknown"}</p>
  </div>
</div>`;

  const emailSent = await sendMail({
    subject: `Job Application: ${input.name} — Software Developer`,
    text: textBody,
    html: htmlBody,
    attachments,
  });

  if (!emailSent) {
    logger.error("Failed to send application email", {
      name: input.name,
      email: input.email,
    });
  }
  await pgPool.query("UPDATE career_applications SET email_sent = $1 WHERE id = $2", [
    emailSent,
    applicationId,
  ]);

  return {
    applicationId,
    status: "received",
    message:
      "Thank you for your application. Our recruitment team will review your documents and reach out to qualified candidates.",
    emailSent,
  };
}
