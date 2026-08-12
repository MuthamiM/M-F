import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true, // port 465 = implicit TLS
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
      to: "info@mftechnologies.org",
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
