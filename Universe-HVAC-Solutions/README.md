# Universe HVAC Solutions — AC Booking Platform

A full-stack website for **Universe HVAC Solutions** (Chennai) where customers can
browse AC services, check live availability, and book a visit online — with a secure
admin dashboard to manage bookings, your own schedule, and customer reviews. Booking
notifications go out to you by **email and WhatsApp** the moment a customer books.

This project is split into three independent folders, each runnable and deployable on
its own:

```
Universe-HVAC-Solutions/
├── frontend/    Next.js website + admin dashboard (client-only, talks to backend/ over HTTP)
├── backend/     Express + TypeScript REST API (bookings, availability, reviews, notifications)
└── database/    PostgreSQL schema + seed data (for Supabase)
```

## 1. Services

- AC General Service
- AC Deep Cleaning Service
- AC Repair & Troubleshooting
- AC Water Leakage Fixing
- AC Gas Refilling
- AC Installation
- AC Uninstallation
- Annual Maintenance Service

Inverter and non-inverter AC units are both serviced.

## 2. Features

**Customer-facing**
- Home, About, Services, Contact, Booking and Reviews pages
- Booking form that shows only genuinely open time slots — it checks both existing
  bookings and any days/slots you've blocked off from your own schedule
- Booking form captures name, phone, email, address, AC type **and AC brand**
- Instant booking confirmation with a unique Booking ID
- "Leave a Review" page — a customer enters their real Booking ID + phone number to
  submit a review, which goes live once you approve it (no fake reviews possible)
- WhatsApp contact button, fully responsive design

**Admin dashboard** (`/admin/login` → `/admin/dashboard`)
- Bookings tab: search, filter (status/service/date), sort, inline status updates,
  a detail view, and delete
- My Schedule tab: block a whole day off, or a single time slot on a date — the
  booking form instantly respects this
- Reviews tab: approve or hide submitted reviews
- Secure login (bcrypt-hashed password, JWT bearer token — no cookies, so it works
  cleanly even when frontend and backend are deployed on different domains)

**Backend**
- REST API for bookings, availability, reviews, contact enquiries and admin auth
- Server-side validation on every write (Zod)
- Notifications on every new booking: **Email (Resend)** and **WhatsApp Business
  Cloud API**, plus an optional SMS hook — a booking is never lost even if a
  notification fails to send
- Works with **zero external services configured**: without Supabase, it
  automatically stores everything in local JSON files under `backend/data/`, so you
  can develop and test immediately after `npm install`

## 3. Technology Stack

| Layer          | Technology                                             |
|----------------|---------------------------------------------------------|
| Frontend       | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| Backend        | Node.js, Express, TypeScript                            |
| Database       | PostgreSQL via Supabase (local JSON fallback for development) |
| Authentication | bcrypt + JWT bearer token (`Authorization` header)       |
| Email          | Resend                                                   |
| WhatsApp       | WhatsApp Business Cloud API                              |
| SMS            | Provider-agnostic abstraction (bring your own provider)  |
| Deployment     | Frontend → Vercel. Backend → Render / Railway / any Node host |

## 4. Running it locally

You need two terminals — one for the backend, one for the frontend.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# generate a password hash for the admin account:
npm run generate-admin-hash -- "YourStrongPassword123"
# paste the printed hash into .env as ADMIN_PASSWORD_HASH
# also set ADMIN_JWT_SECRET (openssl rand -base64 48) and ADMIN_EMAIL
npm run dev
```

The API starts on `http://localhost:4000`. Without Supabase configured, it stores
data in `backend/data/*.json` automatically — nothing else to set up.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The site starts on `http://localhost:3000` and talks to the backend at the URL in
`NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`).

### First admin login

Go to `http://localhost:3000/admin/login` and sign in with `ADMIN_EMAIL` and the
plain-text password you hashed above (not the hash itself).

## 5. Database setup (Supabase / PostgreSQL)

The project runs perfectly for development without this step. To move to a real
Postgres database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run `database/schema.sql`, then optionally
   `database/seed.sql` for sample bookings (clearly fictional — safe for local demos
   only, never run it against a live/production database).
3. In Supabase → Project Settings → API, copy the **Project URL** and
   **service_role key**.
4. In `backend/.env`, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The backend
   switches from the local JSON files to Postgres automatically — no code changes.

## 6. WhatsApp setup (Meta WhatsApp Business Cloud API)

1. Create a Meta developer app at [developers.facebook.com](https://developers.facebook.com)
   and add the **WhatsApp** product.
2. From the WhatsApp → API Setup page, get a permanent access token and your
   **Phone Number ID**.
3. In `backend/.env`, set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and
   `WHATSAPP_ADMIN_NUMBER` (your own WhatsApp number, international format, no `+`,
   e.g. `919677098135`).
4. That's it — new bookings will start sending you a WhatsApp message automatically.

## 7. Email setup (Resend)

1. Create a free account at [resend.com](https://resend.com) and verify a sending
   domain (or use their test domain while developing).
2. Get an API key from the Resend dashboard.
3. In `backend/.env`, set `RESEND_API_KEY`, `EMAIL_FROM` (must be on your verified
   domain), and `ADMIN_NOTIFICATION_EMAIL` (where you want to receive alerts).

## 8. Deployment

**Backend** — deploy `backend/` to Render, Railway, Fly.io, or any Node host:
- Build command: `npm run build`
- Start command: `npm start`
- Set every variable from `backend/.env.example` in the host's environment settings
- Set `FRONTEND_ORIGIN` to your deployed frontend's URL (comma-separate if you have
  more than one, e.g. a Vercel preview + production URL)

**Frontend** — deploy `frontend/` to Vercel:
- Root directory: `frontend`
- Set `NEXT_PUBLIC_API_URL` to your deployed backend's URL
- Set the other `NEXT_PUBLIC_*` variables from `frontend/.env.example`

Because admin auth uses a bearer token (not a cookie), there is no cross-origin
cookie configuration to worry about even though the two apps live on different
domains.

## 9. Project structure reference

```
backend/src/
├── server.ts             Entry point
├── app.ts                Express app, CORS, route mounting
├── constants.ts           Services / AC types / brands / time slots (single source of truth)
├── types.ts, validation.ts, auth.ts
├── db/                    Storage layer (Supabase or local JSON) + availability logic
├── notifications/         Email, WhatsApp, SMS
├── middleware/            Admin auth guard
└── routes/                auth, bookings, availability, reviews, contact, meta

frontend/
├── app/                   Pages (Home, About, Services, Contact, Booking, Reviews, Admin)
├── components/            BookingForm, AdminBookingTable, AdminAvailability, AdminReviews, etc.
└── lib/                   api.ts (backend client), constants.ts, types.ts

database/
├── schema.sql             bookings, blocked_slots, reviews tables
└── seed.sql               sample bookings for local development only
```

## 10. Content policy

No fake reviews, awards, certifications, statistics, public email address, or
pricing appear anywhere on the site. Reviews are only ever created by a customer
supplying a real, matching booking ID and phone number, and stay hidden until you
approve them in the admin dashboard.
