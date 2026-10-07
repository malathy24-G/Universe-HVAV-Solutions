import { Router } from "express";
import { ZodError } from "zod";
import { newReviewSchema, reviewModerationSchema } from "../validation";
import { getBookingById } from "../db/bookingsStore";
import {
  createReview,
  deleteReview,
  listAllReviews,
  listPublishedReviews,
  setReviewPublished
} from "../db/reviewsStore";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// GET /api/reviews — public: only reviews an admin has approved
router.get("/", async (_req, res) => {
  try {
    const reviews = await listPublishedReviews();
    return res.json({ reviews });
  } catch (err) {
    console.error("[GET /api/reviews] error:", err);
    return res.status(500).json({ error: "Failed to load reviews." });
  }
});

// POST /api/reviews — public, but gated: the customer must supply the
// booking ID and phone number from a real booking. This keeps the site
// free of fake reviews without needing a customer account system. The
// review is saved as unpublished until an admin approves it.
router.post("/", async (req, res) => {
  try {
    const parsed = newReviewSchema.parse(req.body);
    const booking = await getBookingById(parsed.booking_id.trim());

    if (!booking || booking.phone !== parsed.phone) {
      return res.status(404).json({
        error: "We couldn't match that booking ID and phone number. Please check them and try again."
      });
    }

    const review = await createReview({
      booking_id: booking.booking_id,
      customer_name: booking.customer_name,
      service: booking.service,
      rating: parsed.rating,
      comment: parsed.comment
    });

    return res.status(201).json({
      review,
      message: "Thank you — your review has been submitted and will appear on the site once approved."
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: err.flatten().fieldErrors });
    }
    console.error("[POST /api/reviews] error:", err);
    return res.status(500).json({ error: "Failed to submit your review. Please try again." });
  }
});

// GET /api/reviews/all — admin only: every review, published or not
router.get("/all", requireAdmin, async (_req, res) => {
  try {
    const reviews = await listAllReviews();
    return res.json({ reviews });
  } catch (err) {
    console.error("[GET /api/reviews/all] error:", err);
    return res.status(500).json({ error: "Failed to load reviews." });
  }
});

// PATCH /api/reviews/:id — admin only: approve/hide a review
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { published } = reviewModerationSchema.parse(req.body);
    const review = await setReviewPublished(req.params.id, published);
    if (!review) return res.status(404).json({ error: "Review not found." });
    return res.json({ review });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed.", details: err.flatten().fieldErrors });
    }
    console.error("[PATCH /api/reviews/:id] error:", err);
    return res.status(500).json({ error: "Failed to update review." });
  }
});

// DELETE /api/reviews/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteReview(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Review not found." });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/reviews/:id] error:", err);
    return res.status(500).json({ error: "Failed to delete review." });
  }
});

export default router;
