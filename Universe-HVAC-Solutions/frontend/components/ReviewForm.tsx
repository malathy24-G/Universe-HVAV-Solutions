"use client";

import { useState, type FormEvent } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";

const INITIAL = { booking_id: "", phone: "", rating: 5, comment: "" };

export default function ReviewForm() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setGeneralError(null);

    try {
      await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify(values),
        auth: false
      });
      setStatus("success");
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        setErrors(Object.fromEntries(Object.entries(err.details).map(([k, v]) => [k, v[0]])));
      } else if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-mist bg-white p-8 text-center shadow-card">
        <CheckCircle2 size={36} className="text-sky-600" />
        <h3 className="text-lg font-semibold text-navy">Thank you!</h3>
        <p className="text-sm text-slate">
          Your review has been submitted and will appear on the site once it&apos;s approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-mist bg-white p-6 shadow-card sm:p-8">
      {generalError && <p className="mb-4 text-sm text-red-600">{generalError}</p>}
      <div className="grid gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Booking ID</label>
          <input
            value={values.booking_id}
            onChange={(e) => setValues((v) => ({ ...v, booking_id: e.target.value }))}
            placeholder="e.g. UHVAC-20260920-4F2A"
            className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            required
          />
          {errors.booking_id && <p className="mt-1 text-xs text-red-600">{errors.booking_id}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Mobile Number used for the booking</label>
          <input
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            inputMode="numeric"
            className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            required
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setValues((v) => ({ ...v, rating: n }))}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star size={26} className={n <= values.rating ? "fill-amber-400 text-amber-400" : "text-mist"} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Drop Your Review</label>
          <textarea
            rows={4}
            value={values.comment}
            onChange={(e) => setValues((v) => ({ ...v, comment: e.target.value }))}
            className="w-full resize-none rounded-xl border border-mist px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            placeholder="How was the service?"
            required
          />
          {errors.comment && <p className="mt-1 text-xs text-red-600">{errors.comment}</p>}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
        >
          {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
          Submit Review
        </button>
      </div>
    </form>
  );
}
