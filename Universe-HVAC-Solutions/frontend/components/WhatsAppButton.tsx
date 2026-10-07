"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919677098135";
  const message = encodeURIComponent(
    "Hello Universe HVAC Solutions, I would like to enquire about AC service."
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Universe HVAC Solutions on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
    >
      <MessageCircle size={27} strokeWidth={2.25} className="text-white" />
    </a>
  );
}
