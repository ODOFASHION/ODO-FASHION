-- ODOFASHION WEBSITE VISIT TRACKING
-- Run this once in Supabase SQL Editor.

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  visitor_id text not null,
  user_id uuid null references auth.users(id) on delete set null,
  page_path text not null,
  page_title text,
  referrer text,
  source text,
  medium text,
  campaign text,
  landing_path text,
  device_type text,
  browser text,
  os text,
  language text,
  screen_width integer,
  screen_height integer,
  visit_number integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists site_visits_created_at_idx on public.site_visits(created_at desc);
create index if not exists site_visits_session_idx on public.site_visits(session_id);
create index if not exists site_visits_source_idx on public.site_visits(source);
create index if not exists site_visits_page_idx on public.site_visits(page_path);
create index if not exists site_visits_user_idx on public.site_visits(user_id);

alter table public.site_visits enable row level security;

drop policy if exists "Public can insert site visits" on public.site_visits;
create policy "Public can insert site visits"
on public.site_visits
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read site visits" on public.site_visits;
create policy "Admins can read site visits"
on public.site_visits
for select
to authenticated
using (public.is_odo_admin());
