# M&F Technologies — Website & Platform Repository

Feature-first production application for M&F Technologies (Next.js frontend + Express TypeScript backend + PostgreSQL & Redis).

---

## 🚀 Quick Start / Emergency Disaster Recovery

If running from a fresh clone of this backup repository, you can launch everything with **Docker Compose** or directly with **Node.js**.

### Option A: Complete Stack via Docker Compose (Recommended)

1. **Clone repository:**
   ```bash
   git clone https://github.com/MuthamiM/M-F-backup.git
   cd M-F-backup
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```
   *(Update credentials inside `backend/.env` if using customized database/email configurations)*

3. **Start All Services:**
   ```bash
   docker compose up -d --build
   ```

4. **Verify running containers:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:4000
   - **Adminer DB UI:** http://localhost:8080
   - **Postgres:** `localhost:5432`
   - **Redis:** `localhost:6379`

---

### Option B: Local Node.js Development

#### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:4000
```

#### 2. Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
```

---

## 📁 Repository Structure

```
frontend/                 → Next.js 16 (App Router) + TypeScript + Tailwind v4
  ├── src/app/            → Public routes (/news, /services, /company-profile, etc.)
  ├── src/features/       → Modular landing, hero, services, and profile components
  ├── src/shared/         → Shared UI elements, tokens, and API client
  └── Dockerfile          → Standalone multi-stage production container

backend/                  → Node.js + Express + TypeScript
  ├── src/features/       → Modular features (auth, contact, newsletter, docs, health)
  ├── src/middleware/     → Security (Helmet, CORS, rate-limit, auth guard, Zod schemas)
  └── Dockerfile          → Containerized backend service

docker-compose.yml        → Full orchestration (PostgreSQL 16, Redis 7, Adminer, Backend, Frontend)
```

---

## 🛡️ Security & Reliability

- **Helmet**: Full CSP, HSTS, X-Frame-Options headers applied on every API response.
- **Strict CORS**: Restricted to authorized domains and localhost environments.
- **Rate Limiting**: Global + aggressive endpoint limiters against brute force and DDoS.
- **Fail-Safe Startup**: Robust schema validation before booting backend services.
