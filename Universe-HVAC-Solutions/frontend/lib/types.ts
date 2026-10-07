import type { ACType, BookingStatus, ServiceId, TimeSlot } from "./constants";

export interface Booking {
  id: string;
  booking_id: string;
  customer_name: string;
  phone: string;
  email: string;
  service: ServiceId;
  ac_type: ACType;
  ac_brand: string;
  number_of_units: number;
  preferred_date: string;
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

export interface BlockedSlot {
  id: string;
  date: string;
  time_slot: TimeSlot | null;
  reason: string | null;
  created_at: string;
}

export interface SlotAvailability {
  time_slot: TimeSlot;
  available: boolean;
  reason: "booked" | "blocked" | null;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_name: string;
  service: ServiceId | null;
  rating: number;
  comment: string;
  published: boolean;
  created_at: string;
}

export type { ACType, BookingStatus, ServiceId, TimeSlot } from "./constants";
export { AC_BRANDS, AC_TYPES, BOOKING_STATUSES, SERVICES, TIME_SLOTS } from "./constants";
