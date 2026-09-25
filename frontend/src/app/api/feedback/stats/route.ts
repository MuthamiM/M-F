// src/app/api/feedback/stats/route.ts
// Proxies GET /api/feedback/stats to backend
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:4000";
    const auth = req.headers.get("authorization") || "";

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (auth) headers["authorization"] = auth;

    const res = await fetch(`${backendUrl}/api/feedback/stats`, { headers });
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy error" },
      { status: 502 }
    );
  }
}
