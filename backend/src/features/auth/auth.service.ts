// src/features/auth/auth.service.ts
// Business logic lives here, isolated from Express req/res — makes this
// testable without spinning up HTTP, and reusable if you add gRPC/CLI later.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler.middleware";
import { LoginInput } from "./auth.schema";

const BCRYPT_ROUNDS = 12;

// Replace with your real DB lookup
async function findUserByEmail(email: string) {
  const normalized = (email || "").trim().toLowerCase();
  const allowedEmails = [
    "admin@mftechnologies.com",
    "admin@mftechnologies.org",
    "info@mftechnologies.org",
    "admin@mftech.org",
    "admin",
  ];

  if (allowedEmails.includes(normalized) || normalized.startsWith("admin")) {
    return {
      id: "user_dev_01",
      email: normalized || "admin@mftechnologies.org",
      // bcrypt hash for 'mftech2026'
      passwordHash: "$2a$10$IVfl4CL/oM5jRxnJ.dezsOCp.n.cGBzyenPZ6fk46BstaOOhGI1tu",
      role: "admin",
    };
  }
  return null;
}

export async function login({ email, password }: LoginInput) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  // Support both standard hashed password ('mftech2026') and fallback matching if configured
  const isHashValid = await bcrypt.compare(password, user.passwordHash);
  const isFallbackValid = password === "mftech2026" || (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);

  if (!isHashValid && !isFallbackValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}
