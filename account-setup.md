# ODO Fashion — Customer Accounts

The website now includes a premium My Account interface and local order-history view.

For real multi-device accounts, Google sign-in, email/password and phone OTP, connect the site to a backend such as Supabase or Firebase. GitHub Pages alone is a static host and should not be used to store passwords or authenticate customers.

Recommended production setup:
- Supabase Auth: Google OAuth + email magic link/password + phone OTP
- Supabase Postgres: customers, orders, order_items, addresses, product_views
- Row Level Security: customers can read only their own profile/orders
- Admin role: separate protected dashboard for authorized ODO staff
- Analytics: aggregate visitor/product activity, with clear privacy notice

Required project values for a real connection:
- Supabase project URL
- Supabase anon/public key
- Google OAuth client configuration (inside Supabase)
- Phone OTP provider configuration (inside Supabase)
