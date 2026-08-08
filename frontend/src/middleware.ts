// src/middleware.ts
// Runs on every request at the edge, before any page renders.
// Sets security headers Next.js doesn't add by default.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  // Allow backend connections from the requesting host on port 4000
  const host = request.headers.get("host")?.split(":")[0] || "localhost";
  const backendOrigins = [
    `http://${host}:4000`,
    "http://localhost:4000",
    "http://127.0.0.1:4000",
  ].join(" ");

  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' ${backendOrigins} ws: wss:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;`
  );

  return response;
}

export const config = {
  matcher: "/:path*",
};
