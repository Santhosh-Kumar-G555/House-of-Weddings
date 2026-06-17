import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // getToken parses the JWT using Edge-compatible Web Crypto
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  });
  const role = token?.role as string | undefined;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  // If a user tries to access /admin but isn't an ADMIN or SUPER_ADMIN, kick them to the homepage
  // if (isAdminRoute) {
  //   if (!token || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }
  // }

  return NextResponse.next();
}

// Only run this middleware on the admin routes to keep the rest of the site fast
export const config = {
  matcher: ["/admin/:path*"]
};
