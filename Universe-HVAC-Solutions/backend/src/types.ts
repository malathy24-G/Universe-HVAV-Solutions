import type { ACType, BookingStatus, ServiceId, TimeSlot } from "./constants";

export interface Booking {
  id: string; // internal UUID / row id
  booking_id: string; // human-facing unique booking ID, e.g. UHVAC-20260920-4F2A
  customer_name: string;
  phone: string;
  email: string;
  service: ServiceId;
  ac_type: ACType;
  ac_brand: string;
  number_of_units: number;
  preferred_date: string; // ISO date (YYYY-MM-DD)
  preferred_time: TimeSlot;
  address: string;
  area: string;
  city: string;
  pincode: string;
  message: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export type NewBookingInput = Omit<
  Booking,
  "id" | "booking_id" | "status" | "created_at" | "updated_at"
>;

export interface BookingFilters {
  status?: BookingStatus | "ALL";
  service?: ServiceId | "ALL";
  date?: string; // exact preferred_date match
  search?: string; // matches name, phone, email, booking_id
  sort?: "latest" | "oldest";
}

// A blocked slot is how the technician (the one person doing every job)
// marks themselves unavailable — either a specific time slot on a date,
// or the whole day (time_slot = null) for days off, travel, etc.
export interface BlockedSlot {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  time_slot: TimeSlot | null; // null = the entire day is blocked
  reason: string | null;
  created_at: string;
}

export type NewBlockedSlotInput = Omit<BlockedSlot, "id" | "created_at">;

export interface SlotAvailability {
  time_slot: TimeSlot;
  available: boolean;
  reason: "booked" | "blocked" | null;
}

// A review is only ever created by a customer who supplies the phone
// number and booking ID from a real booking (see routes/reviews.routes.ts
// for the verification check) and is not shown publicly until an admin
// approves it — this keeps the site free of fake or unmoderated reviews.
export interface Review {
  id: string;
  booking_id: string;
  customer_name: string;
  service: ServiceId | null;
  rating: number; // 1-5
  comment: string;
  published: boolean;
  created_at: string;
}

export type NewReviewInput = {
  booking_id: string;
  phone: string;
  rating: number;
  comment: string;
};
