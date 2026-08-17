-- ODOFASHION CUSTOMER REVIEWS

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  review_text text,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists product_reviews_user_product_idx
on public.product_reviews(product_sku,user_id);

create index if not exists product_reviews_product_idx
on public.product_reviews(product_sku,approved,created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "Public can read approved product reviews" on public.product_reviews;
create policy "Public can read approved product reviews"
on public.product_reviews
for select
to anon, authenticated
using (approved = true or user_id = auth.uid() or public.is_odo_admin());

drop policy if exists "Customers can create reviews" on public.product_reviews;
create policy "Customers can create reviews"
on public.product_reviews
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Customers can update own reviews" on public.product_reviews;
create policy "Customers can update own reviews"
on public.product_reviews
for update
to authenticated
using (user_id = auth.uid() or public.is_odo_admin())
with check (user_id = auth.uid() or public.is_odo_admin());

drop policy if exists "Customers and admins can delete reviews" on public.product_reviews;
create policy "Customers and admins can delete reviews"
on public.product_reviews
for delete
to authenticated
using (user_id = auth.uid() or public.is_odo_admin());

create or replace function public.odo_can_review_product(p_sku text,p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    join public.order_items oi on oi.order_id=o.id
    where o.user_id=p_user_id
      and upper(coalesce(o.order_status,''))='DELIVERED'
      and lower(coalesce(oi.product_sku,''))=lower(p_sku)
  )
  or exists (
    select 1
    from public.orders o
    join public.order_items oi on oi.order_id=o.id
    join public.products p on lower(trim(p.name))=lower(trim(oi.product_name))
    where o.user_id=p_user_id
      and upper(coalesce(o.order_status,''))='DELIVERED'
      and lower(p.sku)=lower(p_sku)
  );
$$;

grant execute on function public.odo_can_review_product(text,uuid) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='product_reviews'
  ) then
    alter publication supabase_realtime add table public.product_reviews;
  end if;
exception when undefined_object then null;
end $$;
