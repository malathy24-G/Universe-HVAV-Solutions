import Link from "next/link";
import {
  AirVent,
  Wrench,
  Settings2,
  SprayCan,
  CalendarCheck2,
  Gauge,
  Droplets,
  Unplug,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

const ICONS: Record<string, LucideIcon> = {
  AirVent,
  Wrench,
  Settings2,
  SprayCan,
  CalendarCheck2,
  Gauge,
  Droplets,
  Unplug,
};

/* Images matched using SERVICE NAME */
const SERVICE_IMAGES: Record<string, string> = {
  "AC General Service": "/services/ac-generall.png",
  "AC Deep Cleaning Service": "/services/ac-cleaningg.png",
  "AC Repair & Troubleshooting": "/services/ac-repair.png",
  "AC Water Leakage Fixing": "/services/water-leakage.png",
  "AC Gas Refilling": "/services/gas-refillingg.png",
  "AC Installation": "/services/ac-installation.png",
};

export default function ServiceCard({
  service,
}: {
  service: Service;
}) {
  const Icon = ICONS[service.icon] ?? Wrench;

  /*
   * IMPORTANT:
   * Use service.name instead of service.id
   */
  const image =
    SERVICE_IMAGES[service.name] ?? "/services/ac-general.png";

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">

      {/* SERVICE IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={image}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* ICON */}
        <div className="absolute bottom-0 right-0 flex h-16 w-16 items-center justify-center rounded-tl-2xl bg-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Icon size={25} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">

        {/* TITLE */}
        <h3 className="text-xl font-extrabold text-navy">
          {service.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate">
          {service.description}
        </p>

        {/* BOOK NOW */}
        <Link
          href={`/booking?service=${service.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-600 transition-colors hover:text-sky-800"
        >
          Book Now
          <ArrowRight size={16} />
        </Link>

      </div>
    </div>
  );
}
