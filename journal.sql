-- ODOFASHION JOURNAL / NEWS
create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'UPDATE',
  excerpt text,
  content text not null default '',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journal_posts_published_idx on public.journal_posts(published, published_at desc);

alter table public.journal_posts enable row level security;

drop policy if exists "Public can read published journal posts" on public.journal_posts;
create policy "Public can read published journal posts"
on public.journal_posts
for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins can read all journal posts" on public.journal_posts;
create policy "Admins can read all journal posts"
on public.journal_posts
for select
to authenticated
using (public.is_odo_admin());

drop policy if exists "Admins can insert journal posts" on public.journal_posts;
create policy "Admins can insert journal posts"
on public.journal_posts
for insert
to authenticated
with check (public.is_odo_admin());

drop policy if exists "Admins can update journal posts" on public.journal_posts;
create policy "Admins can update journal posts"
on public.journal_posts
for update
to authenticated
using (public.is_odo_admin())
with check (public.is_odo_admin());

drop policy if exists "Admins can delete journal posts" on public.journal_posts;
create policy "Admins can delete journal posts"
on public.journal_posts
for delete
to authenticated
using (public.is_odo_admin());
