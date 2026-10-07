import type { BookingStatus } from "@/lib/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  NEW: "bg-sky-100 text-sky-800",
  CONFIRMED: "bg-navy-100 text-navy-700",
  ASSIGNED: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700"
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
