// src/app/api/feedback/route.ts
// Proxy all feedback API calls to backend, forwarding auth and client metadata.
import { NextRequest, NextResponse } from "next/server";

const backendUrl = () =>
  process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:4000";

function clientHeaders(req: NextRequest): Record<string, string> {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const ua = req.headers.get("user-agent") || "";
  const auth = req.headers.get("authorization") || "";

  const h: Record<string, string> = {
    "Content-Type": "application/json",
    "cf-connecting-ip": ip,
    "x-forwarded-for": ip,
    "user-agent": ua,
  };
  if (auth) h["authorization"] = auth;
  return h;
}

async function proxy(
  req: NextRequest,
  method: string,
  pathSuffix = ""
): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const qs = url.search || "";
    const target = `${backendUrl()}/api/feedback${pathSuffix}${qs}`;

    const init: RequestInit = {
      method,
      headers: clientHeaders(req),
    };

    if (["POST", "PATCH", "PUT"].includes(method)) {
      const body = await req.text();
      if (body) init.body = body;
    }

    const res = await fetch(target, init);
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

export async function POST(req: NextRequest) {
  return proxy(req, "POST");
}

export async function GET(req: NextRequest) {
  return proxy(req, "GET");
}
