# M&F Technologies — Website Scaffold

Feature-first structure on both sides so a bug in one feature (e.g. contact form)
never requires touching unrelated code.

## Structure

```
frontend/   Next.js 16 + TypeScript + Tailwind v4
  src/app/          → routes only, no logic
  src/features/     → landing (hero, services, contact form), docs
  src/shared/       → Button, api client, design tokens
  src/middleware.ts → security headers at the edge

backend/    Node + Express + TypeScript
  src/features/     → auth, contact, docs, health — each with
                      controller (HTTP) / service (logic) / schema (validation) / routes
  src/middleware/   → security, rate-limit, auth guard, validation, error handler
  src/config/       → validated env, structured logger
```

## Getting started

```bash
# Backend
cd backend
cp .env .env.example      # fill in real secrets — JWT_SECRET, DATABASE_URL
npm install
npm run dev                # http://localhost:4000

# Frontend
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
npm run dev                # http://localhost:3000
```

## Security measures already in place

- **Helmet** — CSP, X-Frame-Options, HSTS and other headers on every response
- **CORS allowlist** — only your known frontend origins, never `*`
- **Rate limiting** — global limit + a stricter one on auth/contact (brute-force/spam targets)
- **Input validation** — Zod schemas on every request body, rejected before hitting business logic
- **JWT auth** — fails closed; missing/invalid/expired token is always 401
- **Centralized error handler** — stack traces never reach the client in production
- **Honeypot field** — silent bot-spam filter on the contact form
- **Env validation at boot** — a missing secret crashes startup, not a live request
- **Small JSON body limit** (10kb) — this API doesn't need large payloads

## What's a placeholder

- `auth.service.ts` — `findUserByEmail` needs wiring to your real user store
- `contact.service.ts` — submission logging needs wiring to email/CRM
- `DATABASE_URL` — swap for your actual Postgres/whatever connection

## Not in this scaffold

Your core lending system, credit scoring engine, and collections platform were
scoped separately as C#/.NET and Python services — this scaffold is the
public website + its own lightweight API (contact form, auth, docs), not
those core systems.
