import { Router } from "express";
import { ZodError } from "zod";
import { bookingSchema, statusUpdateSchema } from "../validation";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookingStats,
  listBookings,
  updateBookingStatus
} from "../db/bookingsStore";
import { getAvailabilityForDate } from "../db/availability";
import { notifyNewBooking } from "../notifications";
import { requireAdmin } from "../middleware/requireAdmin";
import type { BookingFilters } from "../types";

const router = Router();

// POST /api/bookings — public: customers submit a new booking
router.post("/", async (req, res) => {
  try {
    const parsed = bookingSchema.parse(req.body);

    // Re-check availability server-side too, in case two customers submit
    // the same slot at almost the same moment — the form already hides
    // taken slots, but this is the authoritative check.
    const availability = await getAvailabilityForDate(parsed.preferred_date);
    const slot = availability.find((a) => a.time_slot === parsed.preferred_time);
    if (!slot?.available) {
      return res.status(409).json({
        error: "That time slot was just taken or is unavailable. Please choose another slot."
      });
    }

    const booking = await createBooking({
      customer_name: parsed.customer_name,
      phone: parsed.phone,
      email: parsed.email,
      service: parsed.service as never,
      ac_type: parsed.ac_type as never,
      ac_brand: parsed.ac_brand,
      number_of_units: parsed.number_of_units,
      preferred_date: parsed.preferred_date,
      preferred_time: parsed.preferred_time as never,
      address: parsed.address,
      area: parsed.area,
      city: parsed.city,
      pincode: parsed.pincode,
      message: parsed.message?.trim() || null
    });

    // Booking is already saved at this point. Notification failures are
    // logged but must never undo the booking or fail this request.
    notifyNewBooking(booking).catch((err) =>
      console.error(`[bookings] Unexpected notification error for ${booking.booking_id}:`, err)
    );

    return res.status(201).json({ booking });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: err.flatten().fieldErrors });
    }
    console.error("[POST /api/bookings] error:", err);
    return res.status(500).json({ error: "Something went wrong while saving your booking. Please try again." });
  }
});

// GET /api/bookings — admin only: list + search + filter bookings
router.get("/", requireAdmin, async (req, res) => {
  const filters: BookingFilters = {
    status: (req.query.status as BookingFilters["status"]) || "ALL",
    service: (req.query.service as BookingFilters["service"]) || "ALL",
    date: (req.query.date as string) || undefined,
    search: (req.query.search as string) || undefined,
    sort: (req.query.sort as BookingFilters["sort"]) || "latest"
  };

  try {
    const bookings = await listBookings(filters);
    return res.json({ bookings });
  } catch (err) {
    console.error("[GET /api/bookings] error:", err);
    return res.status(500).json({ error: "Failed to load bookings." });
  }
});

// GET /api/bookings/stats — admin only: dashboard summary cards
router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const stats = await getBookingStats();
    return res.json({ stats });
  } catch (err) {
    console.error("[GET /api/bookings/stats] error:", err);
    return res.status(500).json({ error: "Failed to load booking stats." });
  }
});

// GET /api/bookings/:id — admin only
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    return res.json({ booking });
  } catch (err) {
    console.error("[GET /api/bookings/:id] error:", err);
    return res.status(500).json({ error: "Failed to load booking." });
  }
});

// PATCH /api/bookings/:id — admin only: update status
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = statusUpdateSchema.parse(req.body);
    const booking = await updateBookingStatus(req.params.id, status);
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    return res.json({ booking });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: err.flatten().fieldErrors });
    }
    console.error("[PATCH /api/bookings/:id] error:", err);
    return res.status(500).json({ error: "Failed to update booking." });
  }
});

// DELETE /api/bookings/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteBooking(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Booking not found." });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/bookings/:id] error:", err);
    return res.status(500).json({ error: "Failed to delete booking." });
  }
});

export default router;
