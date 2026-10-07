"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { apiFetch, setAdminToken } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = await apiFetch<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        auth: false
      });
      setAdminToken(data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-frost px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-mist bg-white p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo/logo-circle.png"
            alt="Universe HVAC Solutions"
            width={56}
            height={56}
            className="h-14 w-14"
          />
          <h1 className="mt-4 text-lg font-bold text-navy">Admin Login</h1>
          <p className="mt-1 text-sm text-slate">Universe HVAC Solutions</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
