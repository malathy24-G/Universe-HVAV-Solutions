import { TIME_SLOTS, MAX_BOOKINGS_PER_SLOT } from "../constants";
import { listActiveBookingsForDate } from "./bookingsStore";
import { listBlockedSlots } from "./blockedSlotsStore";
import type { SlotAvailability } from "../types";

/**
 * Works out, for a given date, which time slots the customer can still
 * pick. A slot is unavailable if either:
 *  - the technician has already reached MAX_BOOKINGS_PER_SLOT active
 *    bookings in it (this is a solo operator, so that's normally 1), or
 *  - the admin has explicitly blocked that slot, or the whole day, from
 *    their own schedule (a day off, travel, a job booked outside the
 *    system, etc).
 */
export async function getAvailabilityForDate(date: string): Promise<SlotAvailability[]> {
  const [bookings, blockedSlots] = await Promise.all([
    listActiveBookingsForDate(date),
    listBlockedSlots(date)
  ]);

  const wholeDayBlocked = blockedSlots.some((b) => b.time_slot === null);
  const blockedTimeSlots = new Set(blockedSlots.filter((b) => b.time_slot !== null).map((b) => b.time_slot));

  const bookingCountBySlot = new Map<string, number>();
  for (const booking of bookings) {
    bookingCountBySlot.set(booking.preferred_time, (bookingCountBySlot.get(booking.preferred_time) ?? 0) + 1);
  }

  return TIME_SLOTS.map((slot) => {
    if (wholeDayBlocked || blockedTimeSlots.has(slot)) {
      return { time_slot: slot, available: false, reason: "blocked" as const };
    }
    const count = bookingCountBySlot.get(slot) ?? 0;
    if (count >= MAX_BOOKINGS_PER_SLOT) {
      return { time_slot: slot, available: false, reason: "booked" as const };
    }
    return { time_slot: slot, available: true, reason: null };
  });
}
