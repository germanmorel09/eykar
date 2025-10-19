Supabase migrations
====================

This folder contains two SQL migration files to create the tables used by the app and the Row Level Security (RLS) policies.

Files
- `001_create_tables.sql` — creates `wallets`, `categories`, `goals`, `transactions` tables and indexes.
- `002_rls_and_policies.sql` — enables RLS and creates policies that restrict access to rows where `auth.uid() = userId`.

How to apply

1) Using the Supabase SQL editor (recommended for quick setup):
   - Open your Supabase project dashboard
   - Go to SQL Editor > New query
   - Paste the content of `001_create_tables.sql` and run it
   - Paste the content of `002_rls_and_policies.sql` and run it

2) Using the supabase CLI:
   - Install CLI: `npm i -g supabase` (or follow supabase docs)
   - Authenticate: `supabase login`
   - Push SQL: `supabase db query < supabase/migrations/001_create_tables.sql` (run both files)

Notes
- Ensure you enable the `pgcrypto` extension (the migration does this with `create extension if not exists pgcrypto;`).
- Add your Supabase keys to `.env.local` and Vercel environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server only)
```
