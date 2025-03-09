// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for the /api/test route
  if (pathname.startsWith("/api/test")) {
    return NextResponse.next();
  }

  // Your other middleware logic here

  return NextResponse.next();
}

export const config = {
  // Define matcher for all routes EXCEPT the test route
  matcher: [
    /*
     * Match all request paths except:
     * - /api/test
     * - /_next (Next.js internals)
     * - /static (static files)
     */
    "/((?!api/test|_next/static|_next/image|favicon.ico).*)",
  ],
};
