import type { Metadata } from "next";
import Image from "next/image";
import { UserRound, HeartHandshake, Wrench, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Universe HVAC Solutions",
  description:
    "Learn about Universe HVAC Solutions, an AC service and maintenance company founded by P. Gowtham, serving Chennai."
};

const APPROACH = [
  {
    icon: Wrench,
    title: "Professional Service Approach",
    description:
      "Every booking is handled through a clear process — from confirming your request to completing the job at your location."
  },
  {
    icon: HeartHandshake,
    title: "Customer-Focused Service",
    description:
      "We keep customers informed at each step, from booking confirmation to service completion."
  },
  {
    icon: UserRound,
    title: "One Person, Every Job",
    description:
      "Every visit — installation, repair, or maintenance — is carried out personally, with no subcontracted work."
  },
  {
    icon: ShieldCheck,
    title: "Quality Workmanship & Reliable Support",
    description:
      "We aim to do the job properly the first time, and remain reachable for any follow-up support."
  }
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-frost">
        <div className="container-content py-14 sm:py-20">
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700">
            About Us
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            A Chennai-based AC service company built around dependable work
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate">
            Universe HVAC Solutions provides AC installation, repair, maintenance and
            servicing for homes and businesses across Chennai city — inverter and
            non-inverter units alike — with a focus on professional, customer-focused
            service.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-content grid gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div className="mx-auto w-full max-w-xs">
            <div className="relative mx-auto aspect-square w-full rounded-full bg-frost p-6 shadow-panel">
              <Image
                src="/logo/logo-circle.png"
                alt="Universe HVAC Solutions"
                fill
                sizes="320px"
                className="rounded-full object-contain p-8"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-mist bg-white p-8 shadow-card">
            <h2 className="text-xl font-bold text-navy">Founder &amp; CEO</h2>
            <p className="mt-3 text-2xl font-semibold text-navy-700">P. Gowtham</p>
            <p className="mt-4 text-sm leading-relaxed text-slate">
              Universe HVAC Solutions is founded and led by P. Gowtham, focused on delivering
              professional AC installation, repair, maintenance and servicing to customers in
              Chennai.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-frost py-14 sm:py-20">
        <div className="container-content">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">Our Approach</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {APPROACH.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-white p-6 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
