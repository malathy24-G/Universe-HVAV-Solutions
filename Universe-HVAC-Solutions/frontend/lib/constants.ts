// Mirrors backend/src/constants.ts. Kept as a static copy here (rather
// than fetched on every render) so marketing pages like Home/Services can
// render this content instantly with no loading state. The booking form
// still calls GET /api/availability for live, date-specific slot status.

export type BookingStatus =
  | "NEW"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export const BOOKING_STATUSES: BookingStatus[] = [
  "NEW",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED"
];

export type ServiceId =
  | "ac-general-service"
  | "ac-deep-cleaning"
  | "ac-repair-troubleshooting"
  | "ac-water-leakage"
  | "ac-gas-refilling"
  | "ac-installation"
  | "ac-uninstallation"
  | "ac-annual-maintenance";

export interface ServiceDefinition {
  id: ServiceId;
  name: string;
  description: string;
  icon: string;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: "ac-general-service",
    name: "AC General Service",
    description:
      "Routine servicing — filter and coil cleaning, drainage check and a full function test — to keep your AC running efficiently.",
    icon: "Settings2"
  },
  {
    id: "ac-deep-cleaning",
    name: "AC Deep Cleaning Service",
    description:
      "Thorough jet-wash cleaning of filters, indoor and outdoor coils and drainage to restore cooling performance and air quality.",
    icon: "SprayCan"
  },
  {
    id: "ac-repair-troubleshooting",
    name: "AC Repair & Troubleshooting",
    description:
      "On-site diagnosis and repair of cooling issues, unusual noise, electrical faults and other AC problems.",
    icon: "Wrench"
  },
  {
    id: "ac-water-leakage",
    name: "AC Water Leakage Fixing",
    description:
      "Identifying and fixing the cause of water leakage from indoor units — blocked drains, bad insulation or installation issues.",
    icon: "Droplets"
  },
  {
    id: "ac-gas-refilling",
    name: "AC Gas Refilling",
    description:
      "Refrigerant level check, leak testing and gas top-up for units that have lost cooling capacity.",
    icon: "Gauge"
  },
  {
    id: "ac-installation",
    name: "AC Installation",
    description:
      "Professional installation for split, window and other AC units, done to manufacturer specification.",
    icon: "AirVent"
  },
  {
    id: "ac-uninstallation",
    name: "AC Uninstallation",
    description:
      "Safe removal of an existing AC unit — refrigerant recovery, careful dismantling — when shifting, replacing or storing it.",
    icon: "Unplug"
  },
  {
    id: "ac-annual-maintenance",
    name: "Annual Maintenance Service",
    description:
      "A scheduled maintenance plan with periodic visits through the year to catch small issues before they become costly repairs.",
    icon: "CalendarCheck2"
  }
];

export type ACType = "Split AC" | "Window AC" | "Cassette AC" | "Ductable AC" | "Other";

export const AC_TYPES: ACType[] = [
  "Split AC",
  "Window AC",
  "Cassette AC",
  "Ductable AC",
  "Other"
];

export const AC_BRANDS: string[] = [
  "LG",
  "Samsung",
  "Voltas",
  "Daikin",
  "Blue Star",
  "Hitachi",
  "Carrier",
  "Lloyd",
  "Panasonic",
  "O General",
  "Whirlpool",
  "Godrej",
  "Haier",
  "Other"
];

export type TimeSlot =
  | "09:00 AM - 11:00 AM"
  | "11:00 AM - 01:00 PM"
  | "01:00 PM - 03:00 PM"
  | "03:00 PM - 05:00 PM"
  | "05:00 PM - 07:00 PM";

export const TIME_SLOTS: TimeSlot[] = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM",
  "05:00 PM - 07:00 PM"
];
