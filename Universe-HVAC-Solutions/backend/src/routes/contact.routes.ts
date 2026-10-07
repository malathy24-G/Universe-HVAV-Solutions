import { Router } from "express";
import { ZodError } from "zod";
import { Resend } from "resend";
import { contactSchema } from "../validation";

const router = Router();

// POST /api/contact — public: general enquiry form on the Contact page.
// Sent straight to the admin's email/WhatsApp rather than stored in the
// database, since it isn't a booking.
router.post("/", async (req, res) => {
  try {
    const parsed = contactSchema.parse(req.body);

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ADMIN_NOTIFICATION_EMAIL;
    const from = process.env.EMAIL_FROM;

    if (apiKey && to && from) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from,
          to,
          subject: "New Contact Enquiry - Universe HVAC Solutions",
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;">
              <h2 style="color:#123A5C;">New contact enquiry</h2>
              <p><strong>Name:</strong> ${parsed.name}</p>
              <p><strong>Phone:</strong> ${parsed.phone}</p>
              <p><strong>Message:</strong><br/>${parsed.message}</p>
            </div>`
        });
      } catch (err) {
        console.error("[contact] Failed to send enquiry email:", err);
      }
    } else {
      console.log(`[contact] Email not configured. Enquiry from ${parsed.name} (${parsed.phone}) logged only.`);
    }

    return res.status(201).json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: err.flatten().fieldErrors });
    }
    console.error("[POST /api/contact] error:", err);
    return res.status(500).json({ error: "Failed to send your message. Please try again." });
  }
});

export default router;
