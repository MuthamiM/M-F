// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:4000";

    const clientIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";

    const userAgent = req.headers.get("user-agent") || "";

    const res = await fetch(`${backendUrl}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cf-connecting-ip": clientIp,
        "x-forwarded-for": clientIp,
        "user-agent": userAgent,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to record feedback." },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
