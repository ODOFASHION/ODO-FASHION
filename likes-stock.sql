-- ODOFASHION REAL LIKES + STOCK MANAGEMENT

alter table public.products
  add column if not exists stock_quantity integer not null default 0,
  add column if not exists low_stock_threshold integer not null default 3;

alter table public.products
  add constraint products_stock_quantity_nonnegative
  check (stock_quantity >= 0)
  not valid;

alter table public.products
  add constraint products_low_stock_threshold_nonnegative
  check (low_stock_threshold >= 0)
  not valid;

create table if not exists public.product_likes (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null references public.products(sku) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (product_sku, user_id)
);

create index if not exists product_likes_sku_idx
on public.product_likes(product_sku, created_at desc);

create index if not exists product_likes_user_idx
on public.product_likes(user_id, created_at desc);

alter table public.product_likes enable row level security;

drop policy if exists "Authenticated users can read product like counts" on public.product_likes;
create policy "Authenticated users can read product like counts"
on public.product_likes
for select
to authenticated
using (true);

drop policy if exists "Users can like products" on public.product_likes;
create policy "Users can like products"
on public.product_likes
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can unlike products" on public.product_likes;
create policy "Users can unlike products"
on public.product_likes
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can manage product likes" on public.product_likes;
create policy "Admins can manage product likes"
on public.product_likes
for all
to authenticated
using (public.is_odo_admin())
with check (public.is_odo_admin());

-- Give the original first-drop products a sensible starting stock if still at 0.
update public.products
set stock_quantity = 20
where sku in ('001','002','003','004','005','006')
  and stock_quantity = 0;

-- Existing caps: start with a small launch quantity only when still unset.
update public.products
set stock_quantity = 10
where sku in ('CAP-001','CAP-002')
  and stock_quantity = 0;

-- Keep the original first-drop catalog complete.
insert into public.products (sku,name,price,category,description,image_url,sizes,active,stock_quantity,low_stock_threshold)
values
('006','Dreamer Without Direction T-Shirt',1700,'STREETWEAR','Cream oversized streetwear T-shirt featuring the bold “Dreamer Without Direction” statement, finished with the ODO owl identity and a raw premium aesthetic.','',array['S','M','L','XL','XXL'],true,20,3)
on conflict (sku) do update set
  stock_quantity = case when public.products.stock_quantity = 0 then excluded.stock_quantity else public.products.stock_quantity end,
  low_stock_threshold = excluded.low_stock_threshold;
