import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "9677098135";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist bg-navy-800 text-white">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo/logo-circle.png"
              alt="Universe HVAC Solutions logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full bg-white"
            />
            <span className="font-display text-sm font-bold">
              Universe HVAC Solutions
              <span className="block text-[11px] font-semibold tracking-wide text-sky-300">
                Quality Service, Cool Comfort
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-100/80">
            Universe HVAC Solutions is a trusted AC service company providing professional installation, repair, cleaning, and maintenance with quality service and customer satisfaction.

          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-100/80">
            <li>
              <Link href="/about" className="hover:text-sky-300">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-sky-300">
                Services
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:text-sky-300">
                Book a Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-sky-300">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-sky-300">
                Leave a Review
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Founder &amp; CEO</h3>
          <p className="mt-4 text-sm text-navy-100/80">P. Gowtham</p>
          <h3 className="mt-6 text-sm font-semibold text-white">Admin</h3>
          <Link href="/admin/login" className="mt-2 inline-block text-sm text-navy-100/70 hover:text-sky-300">
            Admin Login
          </Link>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-100/80">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-sky-300" />
              <a href={`tel:+91${phone}`} className="hover:text-sky-300">
                {phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-sky-300" />
              <span>2nd Ambal Nagar, Kovur, Chennai - 600128, Tamil Nadu, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-100/60 sm:flex-row">
          <p>© {year} Universe HVAC Solutions. All rights reserved.</p>
          <p>Founder &amp; CEO: P. Gowtham ENGG</p>
        </div>
      </div>
    </footer>
  );
}
