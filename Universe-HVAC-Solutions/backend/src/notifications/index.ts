import type { Booking } from "../types";
import { sendBookingEmail } from "./email";
import { sendWhatsAppNotification } from "./whatsapp";
import { sendBookingSMS } from "./sms";

export interface NotificationResult {
  channel: "email" | "whatsapp" | "sms";
  sent: boolean;
  reason?: string;
}

/**
 * Fans a new booking out to every notification channel (email + WhatsApp,
 * with SMS as an optional extra). Failures here are ALWAYS caught and
 * logged — a notification failure must never roll back or block a booking
 * that has already been saved to the database.
 */
export async function notifyNewBooking(booking: Booking): Promise<NotificationResult[]> {
  const settled = await Promise.allSettled([
    sendBookingEmail(booking),
    sendWhatsAppNotification(booking),
    sendBookingSMS(booking)
  ]);

  const channels: NotificationResult["channel"][] = ["email", "whatsapp", "sms"];

  return settled.map((result, i) => {
    const channel = channels[i];
    if (result.status === "fulfilled") {
      return { channel, ...result.value };
    }
    console.error(`[notifications] ${channel} threw unexpectedly for ${booking.booking_id}:`, result.reason);
    return { channel, sent: false, reason: "unexpected_error" };
  });
}
