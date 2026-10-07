import { randomUUID } from "crypto";
import { isSupabaseConfigured, getSupabaseServerClient } from "./supabase";
import { readLocal, writeLocal } from "./localFile";
import type { Booking, BookingFilters, BookingStatus, NewBookingInput } from "../types";

/**
 * This module is the ONLY place that talks to booking storage. Every route
 * calls these functions instead of touching Supabase or the filesystem
 * directly, so swapping the storage backend never requires touching the
 * route layer.
 */

const FILE = "bookings.json";

/** Generates a human-friendly unique booking ID, e.g. UHVAC-20260920-4F2A */
export function generateBookingId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `UHVAC-${y}${m}${d}-${rand}`;
}

function applyFilters(bookings: Booking[], filters: BookingFilters): Booking[] {
  let result = [...bookings];

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((b) => b.status === filters.status);
  }
  if (filters.service && filters.service !== "ALL") {
    result = result.filter((b) => b.service === filters.service);
  }
  if (filters.date) {
    result = result.filter((b) => b.preferred_date === filters.date);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(q) ||
          b.phone.includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.booking_id.toLowerCase().includes(q)
      );
    }
  }

  result.sort((a, b) => {
    const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return filters.sort === "oldest" ? diff : -diff;
  });

  return result;
}

export async function createBooking(input: NewBookingInput): Promise<Booking> {
  const now = new Date().toISOString();
  const booking: Booking = {
    id: randomUUID(),
    booking_id: generateBookingId(),
    status: "NEW",
    created_at: now,
    updated_at: now,
    ...input
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("bookings").insert(booking).select().single();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as Booking;
  }

  const bookings = readLocal<Booking>(FILE);
  bookings.push(booking);
  writeLocal(FILE, bookings);
  return booking;
}

export async function listBookings(filters: BookingFilters = {}): Promise<Booking[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    let query = supabase.from("bookings").select("*");

    if (filters.status && filters.status !== "ALL") query = query.eq("status", filters.status);
    if (filters.service && filters.service !== "ALL") query = query.eq("service", filters.service);
    if (filters.date) query = query.eq("preferred_date", filters.date);
    if (filters.search) {
      const q = filters.search.trim();
      if (q) {
        query = query.or(
          `customer_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,booking_id.ilike.%${q}%`
        );
      }
    }
    query = query.order("created_at", { ascending: filters.sort === "oldest" });

    const { data, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as Booking[];
  }

  const bookings = readLocal<Booking>(FILE);
  return applyFilters(bookings, filters);
}

export async function getBookingById(idOrBookingId: string): Promise<Booking | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`id.eq.${idOrBookingId},booking_id.eq.${idOrBookingId}`)
      .maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data as Booking) ?? null;
  }

  const bookings = readLocal<Booking>(FILE);
  return bookings.find((b) => b.id === idOrBookingId || b.booking_id === idOrBookingId) ?? null;
}

export async function updateBookingStatus(
  idOrBookingId: string,
  status: BookingStatus
): Promise<Booking | null> {
  const updated_at = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .update({ status, updated_at })
      .or(`id.eq.${idOrBookingId},booking_id.eq.${idOrBookingId}`)
      .select()
      .maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data as Booking) ?? null;
  }

  const bookings = readLocal<Booking>(FILE);
  const idx = bookings.findIndex((b) => b.id === idOrBookingId || b.booking_id === idOrBookingId);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], status, updated_at };
  writeLocal(FILE, bookings);
  return bookings[idx];
}

export async function deleteBooking(idOrBookingId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { error, count } = await supabase
      .from("bookings")
      .delete({ count: "exact" })
      .or(`id.eq.${idOrBookingId},booking_id.eq.${idOrBookingId}`);
    if (error) throw new Error(`Database error: ${error.message}`);
    return (count ?? 0) > 0;
  }

  const bookings = readLocal<Booking>(FILE);
  const next = bookings.filter((b) => b.id !== idOrBookingId && b.booking_id !== idOrBookingId);
  const changed = next.length !== bookings.length;
  if (changed) writeLocal(FILE, next);
  return changed;
}

export async function getBookingStats() {
  const bookings = await listBookings();
  return {
    total: bookings.length,
    new: bookings.filter((b) => b.status === "NEW").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length
  };
}

/** Every non-cancelled booking for a given date — used by the availability
 *  endpoint to work out which time slots are already taken. */
export async function listActiveBookingsForDate(date: string): Promise<Booking[]> {
  const bookings = await listBookings({ date });
  return bookings.filter((b) => b.status !== "CANCELLED");
}
