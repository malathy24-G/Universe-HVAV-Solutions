import { z } from "zod";
import { AC_TYPES, SERVICES, TIME_SLOTS } from "./constants";

const serviceIds = SERVICES.map((s) => s.id) as [string, ...string[]];

/** Returns today's date as an ISO string (YYYY-MM-DD) in server-local time. */
function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const bookingSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
  service: z.enum(serviceIds, {
    errorMap: () => ({ message: "Please select a service." })
  }),
  ac_type: z.enum(AC_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an AC type." })
  }),
  ac_brand: z.string().trim().min(2, "Please select or enter the AC brand.").max(60),
  number_of_units: z.coerce
    .number({ invalid_type_error: "Enter the number of AC units." })
    .int("Number of units must be a whole number.")
    .min(1, "At least 1 AC unit is required.")
    .max(50, "Please contact us directly for 50+ units."),
  preferred_date: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date.")
    .refine((val) => val >= todayIso(), "Preferred date cannot be in the past."),
  preferred_time: z.enum(TIME_SLOTS as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a preferred time slot." })
  }),
  address: z.string().trim().min(5, "Enter your house/building address.").max(200),
  area: z.string().trim().min(2, "Enter your area.").max(100),
  city: z.string().trim().min(2, "Enter your city.").max(100),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode."),
  message: z.string().trim().max(1000).optional().nullable()
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password.")
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  message: z.string().trim().min(5, "Please enter a short message.").max(1000)
});

export const statusUpdateSchema = z.object({
  status: z.enum(["NEW", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
});

export const blockedSlotSchema = z.object({
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date."),
  time_slot: z.enum(TIME_SLOTS as [string, ...string[]]).nullable().optional(),
  reason: z.string().trim().max(200).optional().nullable()
});

export const newReviewSchema = z.object({
  booking_id: z.string().trim().min(3, "Enter your booking ID."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter the 10-digit mobile number used for the booking."),
  rating: z.coerce.number().int().min(1, "Choose a rating.").max(5, "Rating must be 1-5."),
  comment: z
    .string()
    .trim()
    .min(5, "Please write a short review.")
    .max(600, "Please keep your review under 600 characters.")
});

export const reviewModerationSchema = z.object({
  published: z.boolean()
});
