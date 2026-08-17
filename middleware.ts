// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isDbAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Enforce ADMIN role check
    if (isDbAdminRoute && token?.role !== "ADMIN" && token?.role !== "admin") {
      // Uncomment to redirect non-admin users to homepage:
      // return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow public image streaming and static files
        if (req.nextUrl.pathname.startsWith("/images")) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Matcher protects /admin routes while ignoring images and Next.js internals
export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
  ],
};