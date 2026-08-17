-- ODOFASHION RETURN / EXCHANGE REQUESTS

create table if not exists public.return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  request_type text not null check (request_type in ('RETURN','EXCHANGE')),
  reason text not null,
  details text,
  exchange_size text,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED','COMPLETED','CANCELLED')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists return_requests_user_idx on public.return_requests(user_id, created_at desc);
create index if not exists return_requests_order_idx on public.return_requests(order_id);
create index if not exists return_requests_status_idx on public.return_requests(status, created_at desc);

alter table public.return_requests enable row level security;

drop policy if exists "Customers can read own return requests" on public.return_requests;
create policy "Customers can read own return requests"
on public.return_requests for select to authenticated
using (user_id = auth.uid() or public.is_odo_admin());

drop policy if exists "Customers can create own return requests" on public.return_requests;
create policy "Customers can create own return requests"
on public.return_requests for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "Customers can cancel pending requests" on public.return_requests;
create policy "Customers can cancel pending requests"
on public.return_requests for update to authenticated
using (user_id = auth.uid() and status = 'PENDING')
with check (user_id = auth.uid() and status = 'CANCELLED');

drop policy if exists "Admins can manage return requests" on public.return_requests;
create policy "Admins can manage return requests"
on public.return_requests for all to authenticated
using (public.is_odo_admin()) with check (public.is_odo_admin());

create or replace function public.odo_return_request_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists return_request_updated_at on public.return_requests;
create trigger return_request_updated_at
before update on public.return_requests
for each row execute function public.odo_return_request_updated_at();

create or replace function public.odo_can_request_return(p_order_id uuid, p_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.orders o
    where o.id = p_order_id
      and o.user_id = p_user_id
      and upper(coalesce(o.order_status,'')) = 'DELIVERED'
  )
  and not exists (
    select 1 from public.return_requests r
    where r.order_id = p_order_id
      and r.user_id = p_user_id
      and r.status in ('PENDING','APPROVED','COMPLETED')
  );
$$;

grant execute on function public.odo_can_request_return(uuid,uuid) to authenticated;

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='return_requests'
  ) then
    alter publication supabase_realtime add table public.return_requests;
  end if;
exception when undefined_object then null;
end $$;
