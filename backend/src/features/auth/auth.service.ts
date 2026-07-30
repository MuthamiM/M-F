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
  // placeholder — wire up to your actual user store (Postgres, etc.)
  // Providing a default mock user for demonstration/testing
  if (email.toLowerCase() === "admin@mftechnologies.com") {
    return {
      id: "user_dev_01",
      email: "admin@mftechnologies.com",
      // bcrypt hash for 'mftech2026'
      passwordHash: "$2a$10$TqyUf7d7qV9r2yG40GepH.8Lsc1.Yn8zXQ/zY0y.Psh.w/T4cZ.E2",
      role: "admin",
    };
  }
  return null;
}

export async function login({ email, password }: LoginInput) {
  const user = await findUserByEmail(email);

  // Deliberately identical error for "no user" and "wrong password" —
  // don't let an attacker use this endpoint to enumerate valid emails.
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
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
