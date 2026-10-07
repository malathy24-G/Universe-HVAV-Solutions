import type { Booking } from "../types";
import { SERVICES } from "../constants";

function serviceName(serviceId: string): string {
  return SERVICES.find((s) => s.id === serviceId)?.name ?? serviceId;
}

function buildMessageText(booking: Booking): string {
  return [
    "New AC Service Booking",
    "",
    `Booking ID: ${booking.booking_id}`,
    `Customer: ${booking.customer_name}`,
    `Phone: ${booking.phone}`,
    `Service: ${serviceName(booking.service)}`,
    `AC Brand: ${booking.ac_brand} (${booking.ac_type})`,
    `Date: ${booking.preferred_date}`,
    `Time: ${booking.preferred_time}`,
    `Address: ${booking.address}, ${booking.area}, ${booking.city} - ${booking.pincode}`
  ].join("\n");
}

/**
 * Sends a new-booking WhatsApp alert to the admin via the WhatsApp Business
 * Cloud API. This is a clean integration placeholder: it will start working
 * the moment WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID and
 * WHATSAPP_ADMIN_NUMBER are set — no code changes required.
 *
 * Setup:
 * 1. Create a Meta developer app with the WhatsApp product enabled.
 * 2. Get a permanent access token and your phone number ID.
 * 3. Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ADMIN_NUMBER
 *    in backend/.env.
 * See docs/README.md "WhatsApp setup" for the full walkthrough.
 */
export async function sendWhatsAppNotification(
  booking: Booking
): Promise<{ sent: boolean; reason?: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;

  if (!token || !phoneNumberId || !adminNumber) {
    console.log(
      `[whatsapp] Skipped — WhatsApp Cloud API not configured. Booking ${booking.booking_id} was still saved. See docs/README.md "WhatsApp setup".`
    );
    return { sent: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminNumber,
        type: "text",
        text: { body: buildMessageText(booking) }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[whatsapp] API error for ${booking.booking_id}:`, errorBody);
      return { sent: false, reason: "send_failed" };
    }

    return { sent: true };
  } catch (err) {
    console.error(`[whatsapp] Failed to send notification for ${booking.booking_id}:`, err);
    return { sent: false, reason: "send_failed" };
  }
}
