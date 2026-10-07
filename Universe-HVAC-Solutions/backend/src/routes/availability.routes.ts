import { Router } from "express";
import { ZodError } from "zod";
import { blockedSlotSchema } from "../validation";
import { getAvailabilityForDate } from "../db/availability";
import { createBlockedSlot, deleteBlockedSlot, listBlockedSlots } from "../db/blockedSlotsStore";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// GET /api/availability?date=YYYY-MM-DD — public: which time slots the
// booking form should offer the customer for that date.
router.get("/", async (req, res) => {
  const date = req.query.date as string;
  if (!date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "A valid ?date=YYYY-MM-DD query parameter is required." });
  }

  try {
    const slots = await getAvailabilityForDate(date);
    return res.json({ date, slots });
  } catch (err) {
    console.error("[GET /api/availability] error:", err);
    return res.status(500).json({ error: "Failed to load availability." });
  }
});

// GET /api/availability/blocked?date=YYYY-MM-DD — admin only: this is the
// technician's own schedule — days off / blocked slots they've set.
router.get("/blocked", requireAdmin, async (req, res) => {
  try {
    const date = (req.query.date as string) || undefined;
    const blockedSlots = await listBlockedSlots(date);
    return res.json({ blockedSlots });
  } catch (err) {
    console.error("[GET /api/availability/blocked] error:", err);
    return res.status(500).json({ error: "Failed to load your schedule." });
  }
});

// POST /api/availability/blocked — admin only: block a whole day (omit
// time_slot) or a specific slot on a date, e.g. a personal appointment.
router.post("/blocked", requireAdmin, async (req, res) => {
  try {
    const parsed = blockedSlotSchema.parse(req.body);
    const blockedSlot = await createBlockedSlot({
      date: parsed.date,
      time_slot: (parsed.time_slot as never) ?? null,
      reason: parsed.reason?.trim() || null
    });
    return res.status(201).json({ blockedSlot });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: err.flatten().fieldErrors });
    }
    console.error("[POST /api/availability/blocked] error:", err);
    return res.status(500).json({ error: "Failed to update your schedule." });
  }
});

// DELETE /api/availability/blocked/:id — admin only: re-open a slot/day
router.delete("/blocked/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteBlockedSlot(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found." });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/availability/blocked/:id] error:", err);
    return res.status(500).json({ error: "Failed to update your schedule." });
  }
});

export default router;
