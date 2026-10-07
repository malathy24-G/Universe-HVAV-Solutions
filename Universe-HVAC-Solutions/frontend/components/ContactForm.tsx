"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    try {
      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
        auth: false
      });
      setStatus("success");
      setValues({ name: "", phone: "", message: "" });
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        setErrors(Object.fromEntries(Object.entries(err.details).map(([k, v]) => [k, v[0]])));
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-mist bg-white p-8 text-center shadow-card">
        <CheckCircle2 size={36} className="text-sky-600" />
        <h3 className="text-lg font-semibold text-navy">Message sent</h3>
        <p className="text-sm text-slate">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-mist bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-sky-400"
            required
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-navy">
            Mobile Number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-sky-400"
            required
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            className="w-full resize-none rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-sky-400"
            required
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>

        {status === "error" && Object.keys(errors).length === 0 && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
        >
          {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
          Send Message
        </button>
      </div>
    </form>
  );
}
