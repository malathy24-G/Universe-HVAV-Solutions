import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services | Universe HVAC Solutions",
  description:
    "AC general service, deep cleaning, repair & troubleshooting, water leakage fixing, gas refilling, installation, uninstallation and annual maintenance across Chennai."
};

export default function ServicesPage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="container-content">
        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700">
          Our Services
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
          AC services for homes and businesses
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate">
          Select a service below to start your booking. We&apos;ll confirm details with you
          after you submit the form. Serving homes and businesses across Chennai.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-frost px-4 py-2.5 text-sm font-medium text-navy">
          Works on both Inverter &amp; Non-Inverter AC units
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
