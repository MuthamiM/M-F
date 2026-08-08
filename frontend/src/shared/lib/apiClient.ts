// src/shared/lib/apiClient.ts
// Single place all backend calls go through — sets consistent headers,
// timeouts, and error shape so features don't each reinvent fetch.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  // Dynamically resolve backend API address: use relative path on client (Next.js proxy)
  let apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  if (typeof window !== "undefined") {
    apiBase = "";
  }

  try {
    const res = await fetch(`${apiBase}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new ApiError(res.status, data?.error ?? "Request failed");
    }

    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}
