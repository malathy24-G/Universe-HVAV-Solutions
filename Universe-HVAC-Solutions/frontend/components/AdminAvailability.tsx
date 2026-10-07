"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarOff, Loader2, Trash2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { TIME_SLOTS } from "@/lib/constants";
import type { BlockedSlot } from "@/lib/types";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminAvailability() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(todayIso());
  const [timeSlot, setTimeSlot] = useState(""); // "" = whole day
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ blockedSlots: BlockedSlot[] }>("/api/availability/blocked");
      setBlockedSlots(
        [...data.blockedSlots].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your schedule.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/availability/blocked", {
        method: "POST",
        body: JSON.stringify({ date, time_slot: timeSlot || null, reason: reason.trim() || null })
      });
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to block that slot.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    setError(null);
    try {
      await apiFetch(`/api/availability/blocked/${id}`, { method: "DELETE" });
      setBlockedSlots((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update your schedule.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
      <div>
        <h2 className="text-lg font-bold text-navy">Block time off</h2>
        <p className="mt-1 text-sm text-slate">
          Block a whole day (a day off, travel, personal work) or just one time slot on a date. Customers
          will never be shown a blocked slot when booking.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-2xl border border-mist bg-white p-5 shadow-card">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Date</label>
            <input
              type="date"
              min={todayIso()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Time slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            >
              <option value="">Whole day</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Reason (optional, for your own reference)</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Personal appointment"
              className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CalendarOff size={16} />}
            Block this
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-navy">Your blocked dates &amp; slots</h2>
        <div className="mt-5 space-y-3">
          {loading && <p className="text-sm text-slate">Loading…</p>}
          {!loading && blockedSlots.length === 0 && (
            <p className="rounded-2xl border border-mist bg-white p-5 text-sm text-slate shadow-card">
              Nothing blocked — every slot is open to customers.
            </p>
          )}
          {!loading &&
            blockedSlots.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-2xl border border-mist bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-semibold text-navy">{b.date}</p>
                  <p className="text-xs text-slate">{b.time_slot ?? "Whole day"}</p>
                  {b.reason && <p className="mt-1 text-xs text-slate">{b.reason}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(b.id)}
                  aria-label="Remove block"
                  className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
