-- ==================================================
-- Universe HVAC Solutions — Development Seed Data
-- ==================================================
-- Safe, clearly fictional sample bookings for local development and
-- demoing the admin dashboard. Do NOT run this against production.
--
-- No sample reviews are seeded here on purpose: reviews on this site can
-- only come from a real booking_id + phone match (see
-- backend/src/routes/reviews.routes.ts) and are moderated by the admin
-- before they go live, so there is nothing genuine to fake here.

insert into public.bookings (
  booking_id, customer_name, phone, email, service, ac_type, ac_brand, number_of_units,
  preferred_date, preferred_time, address, area, city, pincode, message, status
) values
  (
    'UHVAC-20260901-A1B2', 'Ravi Kumar', '9800000001', 'ravi.sample@example.com',
    'ac-repair-troubleshooting', 'Split AC', 'LG', 1, current_date + 2, '11:00 AM - 01:00 PM',
    '12 Sample Street', 'Kovur', 'Chennai', '600128',
    'AC is not cooling properly, makes noise on startup.', 'NEW'
  ),
  (
    'UHVAC-20260902-C3D4', 'Priya Raman', '9800000002', 'priya.sample@example.com',
    'ac-general-service', 'Split AC', 'Samsung', 2, current_date + 4, '09:00 AM - 11:00 AM',
    '45 Demo Avenue', 'Porur', 'Chennai', '600116',
    null, 'CONFIRMED'
  ),
  (
    'UHVAC-20260830-E5F6', 'Suresh Babu', '9800000003', 'suresh.sample@example.com',
    'ac-installation', 'Window AC', 'Voltas', 1, current_date + 1, '03:00 PM - 05:00 PM',
    '9 Test Lane', 'Anna Nagar', 'Chennai', '600040',
    'New AC unit purchased, needs installation.', 'ASSIGNED'
  ),
  (
    'UHVAC-20260825-G7H8', 'Divya Shree', '9800000004', 'divya.sample@example.com',
    'ac-deep-cleaning', 'Split AC', 'Daikin', 3, current_date - 3, '01:00 PM - 03:00 PM',
    '78 Sample Colony', 'Kovur', 'Chennai', '600128',
    null, 'COMPLETED'
  ),
  (
    'UHVAC-20260820-I9J0', 'Karthik M', '9800000005', 'karthik.sample@example.com',
    'ac-gas-refilling', 'Split AC', 'Blue Star', 1, current_date - 6, '05:00 PM - 07:00 PM',
    '22 Example Road', 'Vadapalani', 'Chennai', '600026',
    'Requested reschedule, customer unavailable.', 'CANCELLED'
  )
on conflict (booking_id) do nothing;
