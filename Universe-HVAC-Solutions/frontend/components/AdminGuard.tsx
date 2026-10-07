"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { apiFetch, clearAdminToken, getAdminToken } from "@/lib/api";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    apiFetch("/api/auth/me")
      .then(() => setChecked(true))
      .catch(() => {
        clearAdminToken();
        router.replace("/admin/login");
      });
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-navy" />
      </div>
    );
  }

  return <>{children}</>;
}
