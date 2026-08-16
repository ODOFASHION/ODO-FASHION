-- ODOFASHION ORDER NOTIFICATIONS
-- Run once in Supabase SQL Editor.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  kind text not null default 'order',
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
on public.notifications(user_id, created_at desc);

create index if not exists notifications_order_idx
on public.notifications(order_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications"
on public.notifications
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read admin notifications" on public.notifications;
create policy "Admins can read admin notifications"
on public.notifications
for select to authenticated
using (user_id is null and public.is_odo_admin());

drop policy if exists "Users can mark own notifications read" on public.notifications;
create policy "Users can mark own notifications read"
on public.notifications
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins can mark admin notifications read" on public.notifications;
create policy "Admins can mark admin notifications read"
on public.notifications
for update to authenticated
using (user_id is null and public.is_odo_admin())
with check (user_id is null and public.is_odo_admin());

create or replace function public.odo_order_notification_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  customer_message text;
  admin_message text;
begin
  if tg_op = 'INSERT' then
    insert into public.notifications(user_id, order_id, kind, title, message)
    values (
      null,
      new.id,
      'new_order',
      'NEW ORDER RECEIVED',
      format('%s placed order %s for NPR %s.', coalesce(new.customer_name, 'Customer'), new.order_number, to_char(new.total, 'FM999,999,990'))
    );
    return new;
  end if;

  if tg_op = 'UPDATE' and new.order_status is distinct from old.order_status then
    customer_message := case upper(new.order_status)
      when 'CONFIRMED' then 'Your ODO order has been confirmed. We are preparing it for you.'
      when 'PROCESSING' then 'Your ODO order is now being prepared.'
      when 'SHIPPED' then 'Your ODO order has been shipped and is on the way.'
      when 'DELIVERED' then 'Your ODO order has been delivered. Thank you for choosing ODO.'
      when 'CANCELLED' then 'Your ODO order has been cancelled. Please contact ODO customer care if you need help.'
      else format('Your ODO order status is now %s.', new.order_status)
    end;

    if new.user_id is not null then
      insert into public.notifications(user_id, order_id, kind, title, message)
      values (
        new.user_id,
        new.id,
        'order_status',
        format('ORDER %s — %s', new.order_number, new.order_status),
        customer_message
      );
    end if;

    admin_message := format('%s: order %s is now %s.', coalesce(new.customer_name, 'Customer'), new.order_number, new.order_status);
    insert into public.notifications(user_id, order_id, kind, title, message)
    values (null, new.id, 'order_status_admin', 'ORDER STATUS UPDATED', admin_message);

    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists odo_order_notification_trigger on public.orders;
create trigger odo_order_notification_trigger
after insert or update of order_status on public.orders
for each row
execute function public.odo_order_notification_trigger();

grant execute on function public.odo_order_notification_trigger() to authenticated;

-- Enable Supabase Realtime for notifications (safe if already enabled).
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
exception when undefined_object then
  null;
end $$;
