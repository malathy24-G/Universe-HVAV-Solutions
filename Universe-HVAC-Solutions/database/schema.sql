-- ==================================================
-- Universe HVAC Solutions — Database Schema
-- Target: PostgreSQL via Supabase
-- ==================================================
-- Run this in the Supabase SQL Editor (or via `supabase db push`)
-- after creating a new Supabase project.

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- --------------------------------------------------
-- Enum: booking_status
-- --------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type booking_status as enum (
      'NEW',
      'CONFIRMED',
      'ASSIGNED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED'
    );
  end if;
end$$;

-- --------------------------------------------------
-- Table: bookings
-- --------------------------------------------------
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  booking_id        text not null unique,           -- human-facing ID, e.g. UHVAC-20260920-4F2A
  customer_name     text not null,
  phone             text not null,
  email             text not null,
  service           text not null,
  ac_type           text not null,
  ac_brand          text not null default 'Other',  -- e.g. LG, Samsung, Voltas, Daikin...
  number_of_units   integer not null check (number_of_units between 1 and 50),
  preferred_date    date not null,
  preferred_time    text not null,
  address           text not null,
  area              text not null,
  city              text not null,
  pincode           text not null,
  message           text,
  status            booking_status not null default 'NEW',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- If you are upgrading an existing database that predates the AC brand
-- field, this adds the column safely without touching existing rows:
-- alter table public.bookings add column if not exists ac_brand text not null default 'Other';

-- --------------------------------------------------
-- Table: blocked_slots
-- --------------------------------------------------
-- This is how the technician (a solo operator — the same person does
-- every job) marks themselves unavailable: either a specific time slot on
-- a date, or the whole day (time_slot = null) for days off, travel, etc.
-- The booking form and the /api/availability endpoint both read this
-- table so customers are never shown a slot the technician has blocked.
create table if not exists public.blocked_slots (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  time_slot   text,                -- null = the entire day is blocked
  reason      text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_blocked_slots_date on public.blocked_slots (date);

-- --------------------------------------------------
-- Table: reviews
-- --------------------------------------------------
-- A review can only be created by supplying a real booking_id + matching
-- phone number (checked at the application layer), and stays hidden
-- (published = false) until an admin approves it — see
-- backend/src/routes/reviews.routes.ts. This keeps the site free of fake
-- or unmoderated reviews.
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  booking_id      text not null references public.bookings (booking_id) on delete cascade,
  customer_name   text not null,
  service         text,
  rating          integer not null check (rating between 1 and 5),
  comment         text not null,
  published       boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_reviews_published on public.reviews (published);
create index if not exists idx_reviews_created_at on public.reviews (created_at desc);

-- --------------------------------------------------
-- Indexes (bookings)
-- --------------------------------------------------
create index if not exists idx_bookings_status on public.bookings (status);
create index if not exists idx_bookings_service on public.bookings (service);
create index if not exists idx_bookings_preferred_date on public.bookings (preferred_date);
create index if not exists idx_bookings_created_at on public.bookings (created_at desc);
create index if not exists idx_bookings_phone on public.bookings (phone);

-- --------------------------------------------------
-- updated_at auto-touch trigger
-- --------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at
  before update on public.bookings
  for each row
  execute function public.set_updated_at();

-- --------------------------------------------------
-- Row Level Security
-- --------------------------------------------------
-- The Next.js backend uses the Supabase SERVICE ROLE key for all
-- reads/writes (see lib/supabase.ts), which bypasses RLS by design.
-- RLS is still enabled here as defense-in-depth: it ensures the
-- public anon/browser key (if ever exposed) cannot read or modify
-- bookings directly against the database.
alter table public.bookings enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "No public access" on public.bookings;
create policy "No public access"
  on public.bookings
  for all
  using (false)
  with check (false);

drop policy if exists "No public access" on public.blocked_slots;
create policy "No public access"
  on public.blocked_slots
  for all
  using (false)
  with check (false);

drop policy if exists "No public access" on public.reviews;
create policy "No public access"
  on public.reviews
  for all
  using (false)
  with check (false);

-- Note: admin authentication in this project is handled at the
-- application layer (see backend/src/auth.ts, ADMIN_EMAIL /
-- ADMIN_PASSWORD_HASH) rather than via Supabase Auth, so no Supabase
-- Auth-based policy is required. The backend always uses the Supabase
-- SERVICE ROLE key (see backend/src/db/supabase.ts), which bypasses RLS
-- by design — RLS above is defense-in-depth in case the anon/browser key
-- is ever exposed. If you later migrate to Supabase Auth for the admin,
-- add a policy such as:
--
-- create policy "Admins can manage bookings"
--   on public.bookings
--   for all
--   using (auth.jwt() ->> 'role' = 'admin')
--   with check (auth.jwt() ->> 'role' = 'admin');
