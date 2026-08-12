import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isDbAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Optional Role Check: If user is logged in but not an ADMIN, send to homepage
    if (isDbAdminRoute && token?.role !== "ADMIN" && token?.role !== "admin") {
      // If you want all logged-in users to access /admin regardless of role, 
      // comment out the line below:
      // return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Grant access if token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Unauthenticated users trying to access /admin will go to /login
      signIn: "/login",
    },
  }
);

// Matcher configuration to protect both /admin and /admin/* exact subpaths
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};