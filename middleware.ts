import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Block non-ADMIN users from accessing /admin routes
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        if (isAdminRoute) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};