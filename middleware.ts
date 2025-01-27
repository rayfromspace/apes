import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/learning",
  "/projects",
  "/settings",
  "/explore",
];

const authPaths = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );
    const isAuthPath = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    // Handle auth paths
    if (isAuthPath) {
      if (session) {
        // If user is signed in, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      // Allow access to auth pages if not signed in
      return res;
    }

    // Check auth for protected paths
    if (isProtectedPath) {
      if (!session) {
        // If no session, redirect to login
        const redirectUrl = new URL("/auth/login", request.url);
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Allow access to protected paths if signed in
      return res;
    }

    // Allow access to public paths
    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};