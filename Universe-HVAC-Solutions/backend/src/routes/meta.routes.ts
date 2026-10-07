import { Router } from "express";
import { AC_BRANDS, AC_TYPES, SERVICES, TIME_SLOTS } from "../constants";

const router = Router();

// GET /api/meta — public reference data for the frontend's dropdowns.
// Keeping this on the backend means the frontend never hardcodes a second
// copy of the services/AC types/time slots that could drift out of sync.
router.get("/", (_req, res) => {
  res.json({
    services: SERVICES,
    acTypes: AC_TYPES,
    acBrands: AC_BRANDS,
    timeSlots: TIME_SLOTS
  });
});

export default router;
