import { Resend } from "resend";
import type { Booking } from "../types";
import { SERVICES } from "../constants";

function serviceName(serviceId: string): string {
  return SERVICES.find((s) => s.id === serviceId)?.name ?? serviceId;
}

function buildEmailHtml(booking: Booking): string {
  const rows: [string, string][] = [
    ["Booking ID", booking.booking_id],
    ["Customer Name", booking.customer_name],
    ["Phone", booking.phone],
    ["Email", booking.email],
    ["Service", serviceName(booking.service)],
    ["AC Type", booking.ac_type],
    ["AC Brand", booking.ac_brand],
    ["Number of Units", String(booking.number_of_units)],
    ["Preferred Date", booking.preferred_date],
    ["Preferred Time", booking.preferred_time],
    ["Address", `${booking.address}, ${booking.area}, ${booking.city} - ${booking.pincode}`],
    ["Problem Description", booking.message?.trim() || "—"]
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #E7ECF1;color:#5B6470;font-size:13px;white-space:nowrap;">${label}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E7ECF1;color:#0E2436;font-size:14px;font-weight:600;">${value}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#123A5C;padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;font-size:18px;margin:0;">New AC Service Booking</h1>
      <p style="color:#CBD9E5;font-size:13px;margin:4px 0 0;">Universe HVAC Solutions</p>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E7ECF1;border-top:none;">
      ${rowsHtml}
    </table>
    <p style="color:#5B6470;font-size:12px;margin-top:16px;">
      This booking has been saved to the admin dashboard. Log in to confirm, assign a technician, or update its status.
    </p>
  </div>`;
}

/**
 * Sends a new-booking notification email to the admin via Resend.
 * If RESEND_API_KEY is not configured, this logs a placeholder instead of
 * throwing, so booking creation never fails because of missing credentials.
 */
export async function sendBookingEmail(booking: Booking): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.log(
      `[email] Skipped — RESEND_API_KEY / ADMIN_NOTIFICATION_EMAIL / EMAIL_FROM not fully configured. Booking ${booking.booking_id} was still saved.`
    );
    return { sent: false, reason: "not_configured" };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: "New AC Service Booking - Universe HVAC Solutions",
      html: buildEmailHtml(booking)
    });
    return { sent: true };
  } catch (err) {
    console.error(`[email] Failed to send notification for ${booking.booking_id}:`, err);
    return { sent: false, reason: "send_failed" };
  }
}
