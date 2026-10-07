"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-mist bg-white/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/logo/logo-circle.png"
            alt="Universe HVAC Solutions logo"
            width={44}
            height={44}
            className="h-10 w-10 sm:h-11 sm:w-11"
            priority
          />
          <span className="font-display text-[70px] font-bold leading-tight text-navy sm:text-base">
            Universe HVAC Solutions
            <span className="block text-[50px] font-semibold tracking-wide text-sky-600 sm:text-xs">
              Quality Service, Cool Comfort
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-sky-600 ${
                  active ? "text-navy" : "text-slate"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/booking"
            className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-navy-700"
          >
            Book a Service
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-mist bg-white md:hidden">
          <nav className="container-content flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy hover:bg-frost"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-navy px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Book a Service
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
