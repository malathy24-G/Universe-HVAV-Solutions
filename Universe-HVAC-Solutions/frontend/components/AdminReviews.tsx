"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { SERVICES } from "@/lib/constants";
import type { Review } from "@/lib/types";

function serviceName(id: string | null) {
  if (!id) return "—";
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ reviews: Review[] }>("/api/reviews/all");
      setReviews(data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublished(review: Review) {
    try {
      const data = await apiFetch<{ review: Review }>(`/api/reviews/${review.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !review.published })
      });
      setReviews((prev) => prev.map((r) => (r.id === review.id ? data.review : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review.");
    }
  }

  async function remove(id: string) {
    try {
      await apiFetch(`/api/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review.");
    }
  }

  const pending = reviews.filter((r) => !r.published);
  const published = reviews.filter((r) => r.published);

  return (
    <div>
      <p className="text-sm text-slate">
        Every review here came from a customer who entered a real booking ID and matching phone number.
        Approve one to show it on the homepage, or delete it if it isn&apos;t genuine.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-6 text-sm text-slate">Loading reviews…</p>}

      {!loading && (
        <>
          <h2 className="mb-3 mt-8 text-base font-semibold text-navy">
            Pending approval {pending.length > 0 && `(${pending.length})`}
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-slate">Nothing waiting for approval.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => (
                <ReviewRow key={r.id} review={r} onToggle={togglePublished} onDelete={remove} />
              ))}
            </div>
          )}

          <h2 className="mb-3 mt-8 text-base font-semibold text-navy">Published on the site</h2>
          {published.length === 0 ? (
            <p className="text-sm text-slate">No reviews are live yet.</p>
          ) : (
            <div className="space-y-3">
              {published.map((r) => (
                <ReviewRow key={r.id} review={r} onToggle={togglePublished} onDelete={remove} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReviewRow({
  review,
  onToggle,
  onDelete
}: {
  review: Review;
  onToggle: (r: Review) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-mist bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy">{review.customer_name}</p>
          <p className="text-xs text-slate">
            {serviceName(review.service)} · Booking {review.booking_id}
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-mist"} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggle(review)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-navy hover:bg-frost"
          >
            {review.published ? <EyeOff size={14} /> : <Eye size={14} />}
            {review.published ? "Unpublish" : "Approve"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(review.id)}
            aria-label="Delete review"
            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate">{review.comment}</p>
    </div>
  );
}
