import { auth0 } from "@/lib/auth0";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // pathname will be /api/auth/login, /api/auth/logout, /api/auth/callback, etc.
  if (pathname.endsWith("/login")) {
    return auth0.handleLogin(req);
  }

  if (pathname.endsWith("/logout")) {
    return auth0.handleLogout(req);
  }

  if (pathname.endsWith("/callback")) {
    return auth0.handleCallback(req);
  }

  // Optional: you can support /api/auth/profile as an alias, etc.
  // Default: not found for unknown subroutes
  return new Response("Not found", { status: 404 });
}
