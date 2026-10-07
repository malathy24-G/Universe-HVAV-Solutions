import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours
export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION_SECONDS;

interface AdminSessionPayload {
  email: string;
  role: "admin";
}

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_JWT_SECRET is not set. Generate one with `openssl rand -base64 48` and add it to backend/.env."
    );
  }
  return secret;
}

/** Verifies admin credentials against ADMIN_EMAIL and the bcrypt hash in ADMIN_PASSWORD_HASH. */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !hash) {
    throw new Error(
      "Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in backend/.env."
    );
  }

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return false;
  }

  return bcrypt.compare(password, hash);
}

/** Issues a signed JWT for the admin. The frontend stores this and sends it
 *  back as `Authorization: Bearer <token>` on every admin request — no
 *  cookies are used, so there is nothing cross-origin to configure when the
 *  frontend and backend are deployed on different domains. */
export function createAdminSessionToken(email: string): string {
  const payload: AdminSessionPayload = { email, role: "admin" };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_DURATION_SECONDS });
}

export function verifyAdminSessionToken(token: string): AdminSessionPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminSessionPayload;
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}
