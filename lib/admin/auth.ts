import { SignJWT, jwtVerify } from "jose";
import type { EditorIdentity } from "./types";

/**
 * Shared-password JWT auth for the admin. Edge-runtime compatible because middleware
 * runs on Edge — `jose` is the only JWT lib that works on both Edge and Node.
 *
 * On login (POST /api/admin/auth):
 *   • The request body's password is compared, with a 200 ms artificial delay (the route
 *     handler enforces this) to slow brute-force and avoid timing-leak surface.
 *   • On success the route sets `bamboo_admin_session` as httpOnly+Secure+SameSite=Lax,
 *     30-day expiry, signed with ADMIN_JWT_SECRET.
 *
 * The cookie payload identifies the editor for the "Last edited by" audit line. There's
 * only one shared password but Beverly and Jan each get a different password in practice
 * (or the same — both legit users). Right now `username` lives in the cookie payload
 * and defaults to "jan"; route below leaves room to expand later (multiple passwords →
 * different identities) without touching the cookie surface.
 */

export const SESSION_COOKIE = "bamboo_admin_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

interface SessionPayload {
  /** Identity for audit log purposes. */
  username: EditorIdentity;
  /** Issued-at timestamp (seconds since epoch). */
  iat: number;
}

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    // Don't crash at module-load — middleware imports this on every request, and
    // failing to import would 500 the whole site. Surface the misconfiguration when
    // someone actually tries to verify a token.
    throw new Error(
      "ADMIN_JWT_SECRET env var is missing or too short (need 32+ chars / 32 bytes hex)."
    );
  }
  return new TextEncoder().encode(secret);
}

/** Build a signed JWT. Used by /api/admin/auth on successful login. */
export async function signSession(
  username: EditorIdentity
): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(secret);
}

/** Verify a session token. Returns the payload on success, null on any failure. */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.username !== "string" ||
      (payload.username !== "beverly" && payload.username !== "jan")
    ) {
      return null;
    }
    return {
      username: payload.username as EditorIdentity,
      iat: typeof payload.iat === "number" ? payload.iat : 0,
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SEC,
};
