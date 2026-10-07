"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, CalendarClock, ClipboardList, Star } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import { clearAdminToken } from "@/lib/api";

const TABS = [
  { href: "/admin/dashboard", label: "Bookings", icon: ClipboardList },
  { href: "/admin/dashboard/availability", label: "My Schedule", icon: CalendarClock },
  { href: "/admin/dashboard/reviews", label: "Reviews", icon: Star }
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAdminToken();
    router.push("/admin/login");
  }

  return (
    <AdminGuard>
      <div className="bg-frost">
        <div className="container-content flex flex-wrap items-center justify-between gap-4 py-6">
          <h1 className="text-xl font-bold text-navy">Admin Dashboard</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-mist bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-mist"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>

        <div className="container-content">
          <nav className="flex gap-2 border-b border-mist pb-px">
            {TABS.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-1.5 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-b-2 border-navy text-navy"
                      : "border-b-2 border-transparent text-slate hover:text-navy"
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="container-content py-8">{children}</div>
    </AdminGuard>
  );
}
