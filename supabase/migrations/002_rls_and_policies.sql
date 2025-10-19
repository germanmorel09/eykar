-- 002_rls_and_policies.sql
-- Enable Row Level Security and add policies so users can only access their own rows.

-- Wallets
-- 002_rls_and_policies.sql
-- Enable Row Level Security and add policies so users can only access their own rows.

-- Limpia políticas previas (no fallará si no existen)
drop policy if exists "wallets_is_owner" on public."wallets";
drop policy if exists "categories_is_owner" on public."categories";
drop policy if exists "goals_is_owner" on public."goals";
drop policy if exists "transactions_is_owner" on public."transactions";

-- Vuelve a crear las políticas usando casts a text para evitar errores de tipos
alter table public."wallets" enable row level security;
create policy "wallets_is_owner" on public."wallets"
  for all
  using (auth.uid()::text = "userId"::text)
  with check (auth.uid()::text = "userId"::text);

alter table public."categories" enable row level security;
create policy "categories_is_owner" on public."categories"
  for all
  using (auth.uid()::text = "userId"::text)
  with check (auth.uid()::text = "userId"::text);

alter table public."goals" enable row level security;
create policy "goals_is_owner" on public."goals"
  for all
  using (auth.uid()::text = "userId"::text)
  with check (auth.uid()::text = "userId"::text);

alter table public."transactions" enable row level security;
create policy "transactions_is_owner" on public."transactions"
  for all
  using (auth.uid()::text = "userId"::text)
  with check (auth.uid()::text = "userId"::text);

-- Note: If you plan to use service_role key for server operations, use it only on server side and bypass RLS as needed.
