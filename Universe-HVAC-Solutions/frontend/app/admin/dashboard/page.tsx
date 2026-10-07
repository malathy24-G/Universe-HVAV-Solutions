import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminBookingTable";

export const metadata: Metadata = {
  title: "Admin Dashboard | Universe HVAC Solutions",
  robots: { index: false, follow: false }
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
