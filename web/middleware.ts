// middleware.ts
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";

type Role = "USER" | "PRACTITIONER" | "ADMIN";

export default withAuth(
  (req: NextRequestWithAuth) => {
    const { nextUrl } = req;
    const path = nextUrl.pathname;

    const token = req.nextauth.token as (JWT & { role?: Role }) | null;
    const isLoggedIn = Boolean(token);
    const role = token?.role;

    if (path.startsWith("/account") && !isLoggedIn) {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }
    if (path.startsWith("/practitioners") && !["PRACTITIONER", "ADMIN"].includes(role ?? "")) {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }

    return NextResponse.next();
  },
  {
    // We handle auth/redirects manually here
    callbacks: { authorized: () => true },
  },
);

export const config = {
  matcher: ["/account/:path*", "/practitioners/:path*", "/admin/:path*"],
} as const;
