import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/admin/auth";

/**
 * Auth gate for /admin/* and /api/admin/*.
 *
 *   • Unauthenticated /admin requests → 302 to /admin/login (preserves `next` param).
 *   • Unauthenticated /api/admin requests → 401 JSON.
 *   • /admin/login and /api/admin/auth (login submit) and /api/admin/logout are public.
 *   • Public route /api/specials/today is excluded by the matcher entirely.
 *
 * Runs on Edge — jose works there, sharp doesn't (so any sharp-using code stays in
 * `runtime = "nodejs"` route handlers, not middleware).
 */

const PUBLIC_API_PATHS = ["/api/admin/auth", "/api/admin/logout"];
const PUBLIC_ADMIN_PAGES = ["/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public endpoints inside the otherwise-guarded prefixes
  if (PUBLIC_API_PATHS.includes(pathname)) return NextResponse.next();
  if (PUBLIC_ADMIN_PAGES.includes(pathname)) return NextResponse.next();

  const isApi = pathname.startsWith("/api/admin");
  const isAdminPage = pathname.startsWith("/admin");
  if (!isApi && !isAdminPage) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    if (isApi) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
