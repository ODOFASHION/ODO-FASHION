-- ODOFASHION PRODUCT CATALOG / ADMIN MANAGEMENT
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  price numeric(12,2) not null default 2500,
  category text not null default 'STREETWEAR',
  description text not null default '',
  image_url text,
  sizes text[] not null default array['S','M','L','XL','XXL'],
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_idx on public.products(active, created_at desc);
create index if not exists products_category_idx on public.products(category);

alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (active = true);

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
on public.products for select
to authenticated
using (public.is_odo_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert
to authenticated
with check (public.is_odo_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
to authenticated
using (public.is_odo_admin())
with check (public.is_odo_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
to authenticated
using (public.is_odo_admin());

-- Public image storage for product photos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_odo_admin()
);

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_odo_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_odo_admin()
);

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_odo_admin()
);

-- Seed the existing first drop. Safe to run more than once.
insert into public.products (sku,name,price,category,description,image_url,sizes,active)
values
('001','Laija Mero Maya T-Shirt',2500,'STREETWEAR','Cream oversized tee with distressed black Nepali typography.','ChatGPT%20Image%20May%2022,%202026,%2004_18_54%20PM%20(1).png',array['S','M','L','XL','XXL'],true),
('002','Sapana Energy T-Shirt',2500,'STREETWEAR','Black oversized tee built around ambition, energy and dreams.','ChatGPT%20Image%20May%2022,%202026,%2004_18_57%20PM%20(2).png',array['S','M','L','XL','XXL'],true),
('003','Kathmandu T-Shirt',2500,'STREETWEAR','A raw Kathmandu statement in heavyweight street typography.','ChatGPT%20Image%20May%2022,%202026,%2004_18_58%20PM%20(3).png',array['S','M','L','XL','XXL'],true),
('004','Zero to Hero Hoodie',2500,'STREETWEAR','Cream hoodie with a minimal chest mark and bold back message.','ChatGPT%20Image%20May%2022,%202026,%2004_18_59%20PM%20(5).png',array['S','M','L','XL','XXL'],true),
('005','Budi Aajhai T-Shirt',2500,'STREETWEAR','Black graphic tee with a raw, playful Nepali statement.','ChatGPT%20Image%20May%2022,%202026,%2004_19_00%20PM%20(6).png',array['S','M','L','XL','XXL'],true)
on conflict (sku) do nothing;
