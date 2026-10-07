import type { Metadata } from "next";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Leave a Review | Universe HVAC Solutions",
  description: "Share your experience with Universe HVAC Solutions using your booking ID and phone number."
};

export default function ReviewsPage() {
  return (
    <section className="bg-frost py-14 sm:py-20">
      <div className="container-content">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700">
            Leave a Review
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            Tell us how we did
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate">
            Enter your booking ID and the mobile number used for the booking. Every review is checked
            against a real booking, and shows on the site once approved.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
