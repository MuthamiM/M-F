import nodemailer from "nodemailer";

const mailRecipient = process.env.CAREERS_EMAIL_TO || "info@mftechnologies.org";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true, // port 465 = implicit TLS
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 8000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 8000),
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 12000),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(opts: {
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  try {
    await transporter.sendMail({
      from: `"M&F Technologies" <${process.env.SMTP_USER}>`,
      to: mailRecipient,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      attachments: opts.attachments,
    });
    return true;
  } catch (err) {
    console.error("sendMail failed:", err);
    return false; // never throw — a failed email should never block the request
  }
}
