-- ODOFASHION MESSAGE PERMISSION FIX
-- Run once in Supabase SQL Editor if Admin Dashboard says:
-- "Unable to load messages. Check Supabase permissions."

alter table public.customer_messages enable row level security;

drop policy if exists "Admins can read messages via profile" on public.customer_messages;
create policy "Admins can read messages via profile"
on public.customer_messages
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

drop policy if exists "Admins can reply via profile" on public.customer_messages;
create policy "Admins can reply via profile"
on public.customer_messages
for insert
to authenticated
with check (
  (user_id = auth.uid() and sender_role = 'customer')
  or (
    sender_role = 'admin'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  )
);

drop policy if exists "Admins can mark messages read via profile" on public.customer_messages;
create policy "Admins can mark messages read via profile"
on public.customer_messages
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);
