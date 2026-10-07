import type { Booking } from "../types";

/**
 * Provider-agnostic SMS sender. No specific paid SMS provider is assumed.
 * To activate SMS notifications:
 * 1. Choose a provider (e.g. Twilio, MSG91, Textlocal).
 * 2. Set SMS_PROVIDER, SMS_API_KEY, SMS_API_SECRET, SMS_SENDER_ID in backend/.env.
 * 3. Implement the actual HTTP call for your chosen provider inside the
 *    `switch` block below — the call site (notifications/index.ts) never
 *    needs to change.
 */
export async function sendSMS(to: string, message: string): Promise<{ sent: boolean; reason?: string }> {
  const provider = process.env.SMS_PROVIDER;
  const apiKey = process.env.SMS_API_KEY;

  if (!provider || !apiKey) {
    console.log(`[sms] Skipped — no SMS_PROVIDER/SMS_API_KEY configured. Message to ${to} not sent.`);
    return { sent: false, reason: "not_configured" };
  }

  try {
    switch (provider.toLowerCase()) {
      // Add a case per provider you configure, e.g. "twilio", "msg91".
      // case "twilio": { ...call Twilio's REST API here...; return { sent: true }; }
      default:
        console.log(
          `[sms] Provider "${provider}" has no implementation yet. Add a case in backend/src/notifications/sms.ts.`
        );
        return { sent: false, reason: "provider_not_implemented" };
    }
  } catch (err) {
    console.error(`[sms] Failed to send SMS to ${to}:`, err);
    return { sent: false, reason: "send_failed" };
  }
}

export async function sendBookingSMS(booking: Booking): Promise<{ sent: boolean; reason?: string }> {
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER; // reuse admin contact number
  if (!adminNumber) return { sent: false, reason: "not_configured" };

  const message = `New booking ${booking.booking_id} from ${booking.customer_name} (${booking.phone}) for ${booking.preferred_date}.`;
  return sendSMS(adminNumber, message);
}
