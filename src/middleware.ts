import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow all requests - authentication is handled by route protection
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes except Auth0 routes and static assets
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
