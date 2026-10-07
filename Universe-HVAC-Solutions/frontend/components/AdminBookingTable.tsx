"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  ClipboardList,
  Sparkles,
  CheckCircle2,
  XCircle,
  BadgeCheck
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import { BOOKING_STATUSES, SERVICES } from "@/lib/constants";
import type { Booking, BookingStatus } from "@/lib/types";

type StatusFilter = BookingStatus | "ALL";
type ServiceFilter = (typeof SERVICES)[number]["id"] | "ALL";

interface Stats {
  total: number;
  new: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

function serviceName(id: string) {
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminBookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const [selected, setSelected] = useState<Booking | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (serviceFilter !== "ALL") params.set("service", serviceFilter);
      if (dateFilter) params.set("date", dateFilter);
      if (search.trim()) params.set("search", search.trim());
      params.set("sort", sort);

      const data = await apiFetch<{ bookings: Booking[] }>(`/api/bookings?${params.toString()}`);
      setBookings(data.bookings);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, serviceFilter, dateFilter, search, sort]);

  const loadStats = useCallback(async () => {
    try {
      const data = await apiFetch<{ stats: Stats }>("/api/bookings/stats");
      setStats(data.stats);
    } catch {
      // stats are non-critical; ignore silently
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const timeout = setTimeout(loadBookings, 250); // light debounce for search typing
    return () => clearTimeout(timeout);
  }, [loadBookings]);

  async function handleStatusChange(booking: Booking, status: BookingStatus) {
    setActionError(null);
    try {
      const data = await apiFetch<{ booking: Booking }>(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? data.booking : b)));
      loadStats();
      if (selected?.id === booking.id) setSelected(data.booking);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status.");
    }
  }

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await apiFetch(`/api/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setPendingDeleteId(null);
      if (selected?.id === id) setSelected(null);
      loadStats();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete booking.");
    }
  }

  const SUMMARY_CARDS = [
    { label: "Total Bookings", value: stats.total, icon: ClipboardList, tone: "text-navy bg-navy-50" },
    { label: "New Bookings", value: stats.new, icon: Sparkles, tone: "text-sky-700 bg-sky-50" },
    { label: "Confirmed", value: stats.confirmed, icon: BadgeCheck, tone: "text-amber-700 bg-amber-50" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, tone: "text-green-700 bg-green-50" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, tone: "text-red-700 bg-red-50" }
  ];

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-mist bg-white p-5 shadow-card">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
              <Icon size={18} />
            </div>
            <p className="mt-3 text-2xl font-bold text-navy">{value}</p>
            <p className="text-xs text-slate">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-mist bg-white p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-[220px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, booking ID"
            className="w-full rounded-xl border border-mist py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-xl border border-mist px-3 py-2.5 text-sm outline-none focus:border-sky-400"
        >
          <option value="ALL">All Statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value as ServiceFilter)}
          className="rounded-xl border border-mist px-3 py-2.5 text-sm outline-none focus:border-sky-400"
        >
          <option value="ALL">All Services</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-xl border border-mist px-3 py-2.5 text-sm outline-none focus:border-sky-400"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
          className="rounded-xl border border-mist px-3 py-2.5 text-sm outline-none focus:border-sky-400"
        >
          <option value="latest">Sort: Latest first</option>
          <option value="oldest">Sort: Oldest first</option>
        </select>
      </div>

      {actionError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-white shadow-card">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead>
            <tr className="border-b border-mist text-xs uppercase tracking-wide text-slate">
              <th className="px-4 py-3 font-semibold">Booking ID</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">AC Brand</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-slate">
                  Loading bookings…
                </td>
              </tr>
            )}
            {!loading && loadError && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-red-600">
                  {loadError}
                </td>
              </tr>
            )}
            {!loading && !loadError && bookings.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-slate">
                  No bookings match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              !loadError &&
              bookings.map((b) => (
                <tr key={b.id} className="border-b border-mist last:border-0 hover:bg-frost">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-navy">{b.booking_id}</td>
                  <td className="whitespace-nowrap px-4 py-3">{b.customer_name}</td>
                  <td className="whitespace-nowrap px-4 py-3">{b.phone}</td>
                  <td className="whitespace-nowrap px-4 py-3">{serviceName(b.service)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{b.ac_brand}</td>
                  <td className="whitespace-nowrap px-4 py-3">{b.preferred_date}</td>
                  <td className="whitespace-nowrap px-4 py-3">{b.preferred_time}</td>
                  <td className="max-w-[180px] truncate px-4 py-3" title={`${b.area}, ${b.city}`}>
                    {b.area}, {b.city}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                      className="rounded-lg border border-mist bg-white px-2 py-1 text-xs font-medium outline-none focus:border-sky-400"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate">{formatDateTime(b.created_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(b)}
                        aria-label={`View booking ${b.booking_id}`}
                        className="rounded-lg p-1.5 text-navy hover:bg-navy-50"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(b.id)}
                        aria-label={`Delete booking ${b.booking_id}`}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-panel">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy">{selected.booking_id}</h2>
                <div className="mt-1.5">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close booking details"
                className="rounded-lg p-1.5 text-slate hover:bg-frost"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <DetailRow label="Customer" value={selected.customer_name} />
              <DetailRow label="Phone" value={selected.phone} />
              <DetailRow label="Email" value={selected.email} full />
              <DetailRow label="Service" value={serviceName(selected.service)} />
              <DetailRow label="AC Type" value={selected.ac_type} />
              <DetailRow label="AC Brand" value={selected.ac_brand} />
              <DetailRow label="Units" value={String(selected.number_of_units)} />
              <DetailRow label="Date" value={selected.preferred_date} />
              <DetailRow label="Time" value={selected.preferred_time} />
              <DetailRow
                label="Address"
                value={`${selected.address}, ${selected.area}, ${selected.city} - ${selected.pincode}`}
                full
              />
              <DetailRow label="Message" value={selected.message || "—"} full />
              <DetailRow label="Created" value={formatDateTime(selected.created_at)} />
              <DetailRow label="Updated" value={formatDateTime(selected.updated_at)} />
            </dl>

            <div className="mt-6 flex items-center justify-between gap-3">
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected, e.target.value as BookingStatus)}
                className="rounded-xl border border-mist px-3 py-2.5 text-sm outline-none focus:border-sky-400"
              >
                {BOOKING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setPendingDeleteId(selected.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-panel">
            <h3 className="text-base font-bold text-navy">Delete this booking?</h3>
            <p className="mt-2 text-sm text-slate">
              This action cannot be undone. The booking record will be permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="rounded-xl border border-mist px-4 py-2.5 text-sm font-medium text-navy hover:bg-frost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pendingDeleteId)}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-xs uppercase tracking-wide text-slate">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
