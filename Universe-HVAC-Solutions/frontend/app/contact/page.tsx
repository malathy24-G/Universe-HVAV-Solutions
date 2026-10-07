import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Universe HVAC Solutions",
  description: "Contact Universe HVAC Solutions in Kovur, Chennai for AC service and maintenance."
};

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "9677098135";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919677098135";
  const whatsappMessage = encodeURIComponent(
    "Hello Universe HVAC Solutions, I would like to enquire about AC service."
  );

  return (
    <section className="py-14 sm:py-20">
      <div className="container-content">
        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700">
          Contact
        </span>
        <h1 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
          Get in touch with Universe HVAC Solutions
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-mist bg-white p-6 shadow-card">
              <h2 className="text-base font-semibold text-navy">Company</h2>
              <p className="mt-1 text-sm text-slate">Universe HVAC Solutions</p>
              <p className="mt-3 text-sm text-slate">Founder &amp; CEO: P. Gowtham</p>

              <div className="mt-5 flex items-start gap-2.5 text-sm text-slate">
                <MapPin size={18} className="mt-0.5 shrink-0 text-sky-600" />
                <span>2nd Ambal Nagar, Kovur, Chennai - 600128, Tamil Nadu, India</span>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:+91${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-700"
                >
                  <Phone size={16} />
                  Call {phone}
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-frost"
                >
                  <MessageCircle size={16} className="text-[#25D366]" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-mist shadow-card">
              <div className="flex h-56 items-center justify-center bg-frost text-sm text-slate">
                <div className="flex flex-col items-center gap-2 px-6 text-center">
                  <MapPin size={22} className="text-sky-600" />
                  <span>Map location — 2nd Ambal Nagar, Kovur, Chennai - 600128</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-base font-semibold text-navy">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
