import type { NextFunction, Request, Response } from "express";
import { verifyAdminSessionToken } from "../auth";

export interface AdminRequest extends Request {
  admin?: { email: string };
}

/** Reads `Authorization: Bearer <token>`, verifies it, and attaches
 *  req.admin. Responds 401 if the token is missing or invalid. */
export function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const session = verifyAdminSessionToken(token);
  if (!session) {
    return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }

  req.admin = { email: session.email };
  next();
}
