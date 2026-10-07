"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, Quote } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Review } from "@/lib/types";
import { SERVICES } from "@/lib/constants";

function serviceName(id: string | null) {
  if (!id) return null;
  return SERVICES.find((s) => s.id === id)?.name ?? null;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ reviews: Review[] }>("/api/reviews", { auth: false })
      .then((data) => setReviews(data.reviews))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  // No fake reviews: if nothing has been approved yet, the section quietly
  // invites the first real one instead of showing placeholder content.
  if (!loading && reviews.length === 0) {
    return null;
  }

  return (
    <section className="bg-frost py-16 sm:py-24">
      <div className="container-content">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">What Customers Say</h2>
            <p className="mt-3 text-slate">
              Real reviews from customers across Chennai, verified against their booking.
            </p>
          </div>
          <Link
            href="/reviews"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            Leave a Review
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate">Loading reviews…</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="flex h-full flex-col rounded-2xl border border-mist bg-white p-6 shadow-card">
                <Quote size={20} className="text-sky-300" />
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-mist"}
                    />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{review.comment}</p>
                <div className="mt-4 border-t border-mist pt-3">
                  <p className="text-sm font-semibold text-navy">{review.customer_name}</p>
                  {serviceName(review.service) && (
                    <p className="text-xs text-slate">{serviceName(review.service)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
