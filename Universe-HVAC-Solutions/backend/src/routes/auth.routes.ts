import { Router } from "express";
import { ZodError } from "zod";
import { loginSchema } from "../validation";
import { createAdminSessionToken, verifyAdminCredentials, ADMIN_SESSION_MAX_AGE } from "../auth";
import { requireAdmin, type AdminRequest } from "../middleware/requireAdmin";

const router = Router();

// POST /api/auth/login — public: admin signs in, receives a bearer token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const valid = await verifyAdminCredentials(email, password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = createAdminSessionToken(email);
    return res.json({ token, expires_in: ADMIN_SESSION_MAX_AGE });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: err.flatten().fieldErrors });
    }
    console.error("[POST /api/auth/login] error:", err);
    return res.status(500).json({ error: "Login is not available right now. Please try again." });
  }
});

// GET /api/auth/me — admin only: lets the frontend check whether its stored
// token is still valid before rendering the dashboard.
router.get("/me", requireAdmin, (req: AdminRequest, res) => {
  res.json({ email: req.admin?.email });
});

export default router;
