"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { AC_BRANDS, AC_TYPES, SERVICES, TIME_SLOTS } from "@/lib/constants";
import type { Booking, SlotAvailability } from "@/lib/types";
import { apiFetch, ApiError } from "@/lib/api";
import StatusBadge from "./StatusBadge";

const INITIAL_VALUES = {
  customer_name: "",
  phone: "",
  email: "",
  service: "",
  ac_type: "",
  ac_brand: "",
  number_of_units: "1",
  preferred_date: "",
  preferred_time: "",
  address: "",
  area: "",
  city: "",
  pincode: "",
  message: ""
};

function todayIso(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") || "";

  const [values, setValues] = useState({ ...INITIAL_VALUES, service: preselected });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Whenever the customer picks a date, ask the backend which time slots
  // are actually open — this reflects both other customers' bookings and
  // any slots/days the technician has blocked from their own schedule.
  useEffect(() => {
    if (!values.preferred_date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(null);
    apiFetch<{ slots: SlotAvailability[] }>(`/api/availability?date=${values.preferred_date}`, {
      auth: false
    })
      .then((data) => {
        if (!cancelled) setSlots(data.slots);
      })
      .catch(() => {
        if (!cancelled) setSlotsError("Could not load available time slots. Please try a different date.");
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [values.preferred_date]);

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (key === "preferred_date") {
      setValues((v) => ({ ...v, preferred_time: "" }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setGeneralError(null);

    try {
      const data = await apiFetch<{ booking: Booking }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify(values),
        auth: false
      });
      setConfirmedBooking(data.booking);
      setStatus("idle");
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        setErrors(Object.fromEntries(Object.entries(err.details).map(([k, v]) => [k, v[0]])));
      } else if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
      setStatus("error");
    }
  }

  if (confirmedBooking) {
    const serviceName =
      SERVICES.find((s) => s.id === confirmedBooking.service)?.name ?? confirmedBooking.service;

    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-mist bg-white p-8 text-center shadow-card">
        <CheckCircle2 size={44} className="mx-auto text-sky-600" />
        <h2 className="mt-4 text-xl font-bold text-navy">
          Your service booking has been received successfully.
        </h2>
        <p className="mt-2 text-sm text-slate">
          We&apos;ll contact you shortly to confirm the details.
        </p>

        <dl className="mt-6 space-y-3 rounded-xl bg-frost p-5 text-left text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate">Booking ID</dt>
            <dd className="font-semibold text-navy">{confirmedBooking.booking_id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate">Customer Name</dt>
            <dd className="font-semibold text-navy">{confirmedBooking.customer_name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate">Service</dt>
            <dd className="font-semibold text-navy">{serviceName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate">Preferred Date</dt>
            <dd className="font-semibold text-navy">{confirmedBooking.preferred_date}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate">Preferred Time</dt>
            <dd className="font-semibold text-navy">{confirmedBooking.preferred_time}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate">Status</dt>
            <dd>
              <StatusBadge status={confirmedBooking.status} />
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-xs leading-relaxed text-slate">
          Keep your Booking ID and mobile number handy — once the job is complete you can use
          them to leave a review on the{" "}
          <a href="/reviews" className="font-semibold text-sky-600 hover:text-sky-700">
            Reviews
          </a>{" "}
          page.
        </p>

        <button
          type="button"
          onClick={() => {
            setConfirmedBooking(null);
            setValues(INITIAL_VALUES);
          }}
          className="mt-6 text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          Book another service
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl">
      {generalError && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <fieldset className="rounded-2xl border border-mist bg-white p-6 shadow-card sm:p-8">
        <legend className="px-1 text-base font-semibold text-navy">Customer Information</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" error={errors.customer_name}>
            <input
              className={inputClass}
              value={values.customer_name}
              onChange={(e) => update("customer_name", e.target.value)}
              required
            />
          </Field>
          <Field label="Mobile Number" error={errors.phone}>
            <input
              className={inputClass}
              inputMode="numeric"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </Field>
          <Field label="Email Address" error={errors.email} full>
            <input
              type="email"
              className={inputClass}
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-6 rounded-2xl border border-mist bg-white p-6 shadow-card sm:p-8">
        <legend className="px-1 text-base font-semibold text-navy">Service Information</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Select Service" error={errors.service} full>
            <select
              className={inputClass}
              value={values.service}
              onChange={(e) => update("service", e.target.value)}
              required
            >
              <option value="">Choose a service</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="AC Type" error={errors.ac_type}>
            <select
              className={inputClass}
              value={values.ac_type}
              onChange={(e) => update("ac_type", e.target.value)}
              required
            >
              <option value="">Choose AC type</option>
              {AC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="AC Brand" error={errors.ac_brand}>
            <select
              className={inputClass}
              value={values.ac_brand}
              onChange={(e) => update("ac_brand", e.target.value)}
              required
            >
              <option value="">Choose AC brand</option>
              {AC_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Number of AC Units" error={errors.number_of_units}>
            <input
              type="number"
              min={1}
              max={50}
              className={inputClass}
              value={values.number_of_units}
              onChange={(e) => update("number_of_units", e.target.value)}
              required
            />
          </Field>
          <Field label="Preferred Date" error={errors.preferred_date}>
            <input
              type="date"
              min={todayIso()}
              className={inputClass}
              value={values.preferred_date}
              onChange={(e) => update("preferred_date", e.target.value)}
              required
            />
          </Field>
          <Field
            label="Preferred Time Slot"
            error={errors.preferred_time || slotsError || undefined}
            full
          >
            <select
              className={inputClass}
              value={values.preferred_time}
              onChange={(e) => update("preferred_time", e.target.value)}
              disabled={!values.preferred_date || slotsLoading}
              required
            >
              <option value="">
                {!values.preferred_date
                  ? "Pick a date first"
                  : slotsLoading
                  ? "Checking availability…"
                  : "Choose a time slot"}
              </option>
              {(values.preferred_date ? slots : TIME_SLOTS.map((t) => ({ time_slot: t, available: true, reason: null }))).map(
                (s) => (
                  <option key={s.time_slot} value={s.time_slot} disabled={!s.available}>
                    {s.time_slot}
                    {!s.available ? (s.reason === "blocked" ? " — unavailable" : " — fully booked") : ""}
                  </option>
                )
              )}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-6 rounded-2xl border border-mist bg-white p-6 shadow-card sm:p-8">
        <legend className="px-1 text-base font-semibold text-navy">Address Information</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="House / Building Address" error={errors.address} full>
            <input
              className={inputClass}
              value={values.address}
              onChange={(e) => update("address", e.target.value)}
              required
            />
          </Field>
          <Field label="Area" error={errors.area}>
            <input
              className={inputClass}
              value={values.area}
              onChange={(e) => update("area", e.target.value)}
              required
            />
          </Field>
          <Field label="City" error={errors.city}>
            <input
              className={inputClass}
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              required
            />
          </Field>
          <Field label="Pincode" error={errors.pincode}>
            <input
              className={inputClass}
              inputMode="numeric"
              value={values.pincode}
              onChange={(e) => update("pincode", e.target.value)}
              required
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-6 rounded-2xl border border-mist bg-white p-6 shadow-card sm:p-8">
        <legend className="px-1 text-base font-semibold text-navy">Additional Information</legend>
        <div className="mt-4">
          <Field label="Problem Description / Additional Message" error={errors.message} full>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Describe the issue or anything the technician should know (optional)"
            />
          </Field>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        Book Service
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-sky-400";

function Field({
  label,
  error,
  full,
  children
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
