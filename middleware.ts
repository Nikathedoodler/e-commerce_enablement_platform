import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Replace with Supabase auth session checking
// This is a placeholder until we implement Supabase authentication
export function middleware(request: NextRequest) {
  // For now, allow all requests
  // Later: Check Supabase session and protect /dashboard routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
