import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book a Service | Universe HVAC Solutions",
  description: "Book an AC installation, repair, maintenance or service visit with Universe HVAC Solutions."
};

export default function BookingPage() {
  return (
    <section className="bg-frost py-14 sm:py-20">
      <div className="container-content">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700">
            Book a Service
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            Schedule your AC service
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate">
            Fill in your details below. We&apos;ll confirm your booking and send you a
            booking ID right away.
          </p>
        </div>

        <div className="mt-12">
          <Suspense fallback={<div className="text-center text-sm text-slate">Loading form…</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
