-- 001_create_tables.sql
-- Create tables for wallets, transactions, categories and goals
-- Note: uses gen_random_uuid(); enable pgcrypto if needed in your Supabase project.

create extension if not exists pgcrypto;

-- Wallets
create table if not exists public."wallets" (
  "id" uuid primary key default gen_random_uuid(),
  "name" text not null,
  "balance" numeric not null default 0,
  "userId" text not null,
  "created_at" timestamptz default now()
);
create index if not exists wallets_userid_idx on public."wallets" ("userId");

-- Categories
create table if not exists public."categories" (
  "id" uuid primary key default gen_random_uuid(),
  "name" text not null,
  "iconName" text,
  "type" text,
  "color" text,
  "userId" text not null,
  "created_at" timestamptz default now()
);
create index if not exists categories_userid_idx on public."categories" ("userId");

-- Goals
create table if not exists public."goals" (
  "id" uuid primary key default gen_random_uuid(),
  "name" text not null,
  "targetAmount" numeric not null,
  "currentAmount" numeric not null default 0,
  "deadline" timestamptz,
  "userId" text not null,
  "created_at" timestamptz default now()
);
create index if not exists goals_userid_idx on public."goals" ("userId");

-- Transactions
create table if not exists public."transactions" (
  "id" uuid primary key default gen_random_uuid(),
  "description" text,
  "amount" numeric not null,
  "date" timestamptz not null default now(),
  "type" text,
  "categoryId" uuid,
  "walletId" uuid,
  "userId" text not null,
  "created_at" timestamptz default now()
);
create index if not exists transactions_userid_idx on public."transactions" ("userId");
