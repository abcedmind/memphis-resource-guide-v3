-- Memphis Family Resource Guide v3 — run this in the Supabase SQL Editor.
--
-- Safe to run more than once (2026-09-28): tables use "if not exists" and every
-- policy is dropped and re-created, so pasting it into a project that already
-- has the tables just brings the policies up to date.
--
-- Admins are the emails in admin_emails, not "anyone signed in". Supabase
-- signs up any new email that asks for a magic link unless sign-ups are off,
-- so "authenticated" alone would let a stranger read family registrations.
-- Also turn off Authentication → Sign In / Providers (older dashboards: Authentication → Settings) → "Allow new users to
-- sign up" (the site's login form no longer creates accounts either).

-- Resource groups (age bands + demographic categories)
create table if not exists resource_groups (
  id text primary key,
  label text not null,
  kind text not null check (kind in ('age', 'demo')),
  char_stage int,
  color text not null,
  note text,
  sort_order int default 0
);

-- Resources
create table if not exists resources (
  id text primary key default ('r_' || gen_random_uuid()::text),
  group_id text not null references resource_groups(id),
  name text not null,
  category text not null check (category in ('education','health','food','enrichment','technology','identity')),
  description text not null,
  how_to_access text not null,
  url text,
  min_age int default 0,
  max_age int default 99,
  flags text[] default '{}',
  serve text check (serve in ('online','inperson','navigator')),
  basic_info_only boolean default false,
  is_approved boolean default true,
  sort_order int default 0, -- preserves v2's curated order within each group
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pending submissions (public can submit, admin approves)
create table if not exists submissions (
  id text primary key default ('s_' || gen_random_uuid()::text),
  name text not null,
  category text not null,
  description text not null,
  how_to_access text,
  url text,
  min_age int default 0,
  max_age int default 99,
  serve text default 'navigator',
  target_group text default 'all',
  submitter_name text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

-- Family registrations (only stored if family explicitly opts in)
create table if not exists registrations (
  id text primary key default ('reg_' || gen_random_uuid()::text),
  parent_name text,
  contact text,
  zip text,
  children jsonb not null default '[]',
  family_needs jsonb default '{}',
  created_at timestamptz default now()
);

-- Who counts as an admin. Add or remove rows here in the SQL editor, never from
-- the site. The table has RLS on and no policies, so the public API can't read it.
create table if not exists admin_emails (email text primary key);
alter table admin_emails enable row level security;
insert into admin_emails (email) values ('zandenkelly@gmail.com') on conflict do nothing;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from admin_emails where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Row Level Security
alter table resource_groups enable row level security;
alter table resources enable row level security;
alter table submissions enable row level security;
alter table registrations enable row level security;

-- Public read for resources and groups
drop policy if exists "Public read groups" on resource_groups;
create policy "Public read groups" on resource_groups for select using (true);
drop policy if exists "Public read resources" on resources;
create policy "Public read resources" on resources for select using (is_approved = true);

-- Public insert for submissions
drop policy if exists "Public insert submissions" on submissions;
create policy "Public insert submissions" on submissions for insert with check (true);

-- Public insert for registrations (opt-in only)
drop policy if exists "Public insert registrations" on registrations;
create policy "Public insert registrations" on registrations for insert with check (true);

-- Admin policies (emails in admin_emails only — see is_admin() above)
drop policy if exists "Admin all groups" on resource_groups;
create policy "Admin all groups" on resource_groups for all using (is_admin());
drop policy if exists "Admin all resources" on resources;
create policy "Admin all resources" on resources for all using (is_admin());
drop policy if exists "Admin all submissions" on submissions;
create policy "Admin all submissions" on submissions for all using (is_admin());
drop policy if exists "Admin read registrations" on registrations;
create policy "Admin read registrations" on registrations for select using (is_admin());

-- v3 addition: admins can delete a registration once a navigator has
-- followed up (feature parity with v2's admin panel; data minimization).
drop policy if exists "Admin delete registrations" on registrations;
create policy "Admin delete registrations" on registrations for delete using (is_admin());
