import type { Metadata } from "next";
import AdminAvailability from "@/components/AdminAvailability";

export const metadata: Metadata = {
  title: "My Schedule | Universe HVAC Solutions Admin",
  robots: { index: false, follow: false }
};

export default function AdminAvailabilityPage() {
  return <AdminAvailability />;
}
