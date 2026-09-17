import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || ("http:" + "//127.0.0.1:4000");

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";
  const isCrawler = /bot|google|crawler|spider|mediapartners|adsbot/i.test(userAgent);

  // Fast-track crawlers and AdSense bots with zero latency
  if (isCrawler) {
    return NextResponse.next();
  }

  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  console.log("[req] " + ip + " " + req.method + " " + req.nextUrl.pathname);

  fetch(BACKEND_URL + "/api/track/click", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ element: "page-view", page: req.nextUrl.pathname }),
  }).catch(function () {});

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
