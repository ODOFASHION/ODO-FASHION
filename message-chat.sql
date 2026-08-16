-- ODOFASHION CUSTOMER MESSAGES / ADMIN REPLIES
create table if not exists public.customer_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('customer','admin')),
  message text not null check (length(trim(message)) > 0),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists customer_messages_user_idx
on public.customer_messages(user_id, created_at desc);

alter table public.customer_messages enable row level security;

drop policy if exists "Users can read own messages" on public.customer_messages;
create policy "Users can read own messages"
on public.customer_messages
for select
to authenticated
using (user_id = auth.uid() or public.is_odo_admin());

drop policy if exists "Users can send messages" on public.customer_messages;
create policy "Users can send messages"
on public.customer_messages
for insert
to authenticated
with check (user_id = auth.uid() and sender_role = 'customer');

drop policy if exists "Admins can reply" on public.customer_messages;
create policy "Admins can reply"
on public.customer_messages
for insert
to authenticated
with check (public.is_odo_admin() and sender_role = 'admin');

drop policy if exists "Admins can mark messages read" on public.customer_messages;
create policy "Admins can mark messages read"
on public.customer_messages
for update
to authenticated
using (public.is_odo_admin())
with check (public.is_odo_admin());
