import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Users,
  Headset,
  BadgeCheck,
  ClipboardList,
  PhoneCall,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import ServiceCard from "@/components/ServiceCard";
import ReviewsSection from "@/components/ReviewsSection";
import { SERVICES } from "@/lib/types";

const WHY_CHOOSE_US = [
  {
    icon: BadgeCheck,
    image: "/why-choose-us/professionalService.png",
    title: "Professional Service",
    description:
      "Every visit follows a clear and professional process from booking to completion.",
  },
  {
    icon: Users,
    image: "/why-choose-us/DirectService.png",
    title: "Direct, Personal Service",
    description:
      "Every job is handled personally from booking to completion, with no unnecessary middlemen.",
  },
  {
    icon: Headset,
    image: "/why-choose-us/reliableSupport.png",
    title: "Reliable Support",
    description:
      "Reach us by phone or WhatsApp and get a quick and clear response about your service.",
  },
  {
    icon: ShieldCheck,
    image: "/why-choose-us/QualityWork.png",
    title: "Quality Work",
    description:
      "We focus on doing the job right with proper diagnosis and professional workmanship.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: ClipboardList,
    title: "Book a Service",
    description:
      "Fill out the booking form with your AC issue, preferred date and time.",
  },
  {
    step: "2",
    icon: PhoneCall,
    title: "We Contact You",
    description:
      "Our team reaches out to confirm your booking details and schedule.",
  },
  {
    step: "3",
    icon: Wrench,
    title: "Technician Visits",
    description:
      "A technician arrives at your location at the scheduled time slot.",
  },
  {
    step: "4",
    icon: CheckCircle2,
    title: "Service Completed",
    description:
      "Your AC issue is resolved and the booking is marked as completed.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-hero-swirl bg-frost">
        <div className="container-content grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr,0.9fr] lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700">
              Universe HVAC Solutions · Reliable Service. Perfect Cooling.
              Complete Comfort.
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-navy sm:text-5xl lg:text-[3.25rem]">
              Welcome to Universe HVAC Solutions
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
              Universe HVAC Solutions provides reliable AC installation,
              repair, maintenance, cleaning, and gas refilling services. Our
              experienced technicians deliver fast, affordable, and quality
              solutions to keep your home or business cool and comfortable.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-navy-700"
              >
                Book a Service
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-7 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-mist"
              >
                Contact Us
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                "Professional Service",
                "Experienced Technicians",
                "Reliable Support",
                "Quality Work",
              ].map((label) => (
                <div key={label} className="flex items-start gap-2">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-sky-500"
                  />

                  <dt className="text-sm font-medium leading-snug text-navy-700">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative mx-auto aspect-square w-full max-w-[360px] rounded-full bg-white p-6 shadow-panel">
              <Image
                src="/logo/logo-circle.png"
                alt="Universe HVAC Solutions"
                fill
                sizes="360px"
                className="rounded-full object-contain p-8"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-content">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
              Why Choose Us?
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
              We provide dependable AC services with experienced technicians,
              quick support, quality work, and customer-focused solutions.
            </p>
          </div>

          {/* Small highlights */}
          <div className="mx-auto mt-8 max-w-5xl text-center">
            <p className="text-sm font-medium leading-8 text-slate">
              <span className="text-sky-600">
                Experienced Technicians
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Fast & Reliable Service
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Affordable Pricing
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Quality AC Solutions
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Professional Cleaning
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Expert Repair & Maintenance
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Quick Leakage Fixing
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Complete AC Installation
              </span>{" "}
              <span className="text-navy">•</span>{" "}
              <span className="text-sky-600">
                Efficient Gas Refilling
              </span>
            </p>
          </div>

          {/* Why Choose Us Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map(
              ({ icon: Icon, image, title, description }) => (
                <div
                  key={title}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">

                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    {/* Title */}
                    <h3 className="mt-4 text-lg font-extrabold text-navy">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-slate">
                      {description}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="bg-frost py-16 sm:py-24">
        <div className="container-content">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                Our Services
              </h2>

              <p className="mt-3 text-slate">
                From installation to troubleshooting, we cover the full range
                of AC service needs.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              View All Services
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <ReviewsSection />

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 sm:py-24">
        <div className="container-content">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              How It Works
            </h2>

            <p className="mt-3 text-slate">
              From booking to a completed service, in four simple steps.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(
              ({ step, icon: Icon, title, description }, i) => (
                <div key={step} className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white">
                    <Icon size={20} strokeWidth={1.9} />
                  </div>

                  <span className="mt-4 block text-xs font-bold tracking-wide text-sky-600">
                    STEP {step}
                  </span>

                  <h3 className="mt-1 text-base font-semibold text-navy">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {description}
                  </p>

                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute right-[-16px] top-6 hidden h-px w-8 bg-mist lg:block" />
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Need AC Service?
          </h2>

          <p className="max-w-md text-sm text-navy-100/80 sm:text-base">
            Book a technician visit in a few minutes — choose your service,
            pick a time, and we&apos;ll take it from there.
          </p>

          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-navy shadow-card transition-transform hover:scale-[1.02]"
          >
            Book Your Service
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}