-- ODO admin email correction
-- Run this in Supabase SQL Editor after the account with this email has signed up.
update public.profiles
set is_admin = true
where lower(email) = lower('arorafilms@8gmail.com');

select id, full_name, email, is_admin
from public.profiles
where lower(email) = lower('arorafilms@8gmail.com');
