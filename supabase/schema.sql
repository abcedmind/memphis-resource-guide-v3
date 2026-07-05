-- Memphis Family Resource Guide v3 — run this in the Supabase SQL Editor.

-- Resource groups (age bands + demographic categories)
create table resource_groups (
  id text primary key,
  label text not null,
  kind text not null check (kind in ('age', 'demo')),
  char_stage int,
  color text not null,
  note text,
  sort_order int default 0
);

-- Resources
create table resources (
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pending submissions (public can submit, admin approves)
create table submissions (
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
create table registrations (
  id text primary key default ('reg_' || gen_random_uuid()::text),
  parent_name text,
  contact text,
  zip text,
  children jsonb not null default '[]',
  family_needs jsonb default '{}',
  created_at timestamptz default now()
);

-- Row Level Security
alter table resource_groups enable row level security;
alter table resources enable row level security;
alter table submissions enable row level security;
alter table registrations enable row level security;

-- Public read for resources and groups
create policy "Public read groups" on resource_groups for select using (true);
create policy "Public read resources" on resources for select using (is_approved = true);

-- Public insert for submissions
create policy "Public insert submissions" on submissions for insert with check (true);

-- Public insert for registrations (opt-in only)
create policy "Public insert registrations" on registrations for insert with check (true);

-- Admin policies (authenticated users only)
create policy "Admin all groups" on resource_groups for all using (auth.role() = 'authenticated');
create policy "Admin all resources" on resources for all using (auth.role() = 'authenticated');
create policy "Admin all submissions" on submissions for all using (auth.role() = 'authenticated');
create policy "Admin read registrations" on registrations for select using (auth.role() = 'authenticated');

-- v3 addition: admins can delete a registration once a navigator has
-- followed up (feature parity with v2's admin panel; data minimization).
create policy "Admin delete registrations" on registrations for delete using (auth.role() = 'authenticated');
