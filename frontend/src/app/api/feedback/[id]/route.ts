// src/app/api/feedback/[id]/route.ts
// Proxies PATCH and DELETE for individual feedback records to backend
import { NextRequest, NextResponse } from "next/server";

async function proxy(
  req: NextRequest,
  method: string,
  id: string
): Promise<NextResponse> {
  try {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:4000";
    const auth = req.headers.get("authorization") || "";

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (auth) headers["authorization"] = auth;

    const init: RequestInit = { method, headers };

    if (["PATCH", "PUT", "POST"].includes(method)) {
      const body = await req.text();
      if (body) init.body = body;
    }

    const res = await fetch(`${backendUrl}/api/feedback/${id}`, init);
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxy(req, "PATCH", id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxy(req, "DELETE", id);
}
