import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  signSession,
} from "@/lib/admin/auth";

/** POST /api/admin/auth — body: { password: string }. On success sets the session cookie. */
export async function POST(req: NextRequest) {
  // Per spec: 200 ms artificial delay to slow brute-force + flatten timing-leak surface.
  await new Promise((resolve) => setTimeout(resolve, 200));

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const submitted =
    typeof body.password === "string" ? body.password : "";
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected || expected.length === 0) {
    // Misconfigured server. Don't leak the misconfiguration in the response body — just
    // 500 quietly so an attacker can't tell whether the password is unset vs. wrong.
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  // Constant-time compare via UTF-8 byte-length match first, then byte-wise XOR. The 200 ms
  // delay above dominates any remaining timing leak.
  if (
    submitted.length !== expected.length ||
    !timingSafeEqual(submitted, expected)
  ) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  }

  // For now there's a single shared password and a single identity. When Beverly and Jan
  // get separate passwords, look up the identity from a map of password → identity here.
  const token = await signSession("jan");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
