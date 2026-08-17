-- Brighton Lawn & Landscape — admin data model
-- Mirrors the fields from the Laravel/Filament ProjectResource (origin/laravel-admin branch)
-- Run this once in the Supabase SQL editor for the project.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('residential', 'commercial')),
  tag text not null,
  location text,
  is_published boolean not null default true,
  cover_image_url text not null,
  cover_image_position text not null default 'center center',
  overview_kicker text,
  overview_heading text,
  overview_body text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_stats (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  value text not null,
  label text not null,
  sort_order integer not null default 0
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0
);

create index if not exists project_stats_project_id_idx on project_stats(project_id);
create index if not exists project_images_project_id_idx on project_images(project_id);
create index if not exists projects_sort_order_idx on projects(sort_order);

-- keep updated_at current on edit
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- Row Level Security: anonymous visitors can only read published projects.
-- All writes go through Netlify Functions using the service_role key, which bypasses RLS,
-- so no authenticated-write policy is needed here — the admin UI never talks to Supabase directly for writes.
alter table projects enable row level security;
alter table project_stats enable row level security;
alter table project_images enable row level security;

create policy "public can read published projects"
  on projects for select
  using (is_published = true);

create policy "public can read stats of published projects"
  on project_stats for select
  using (exists (
    select 1 from projects p where p.id = project_stats.project_id and p.is_published = true
  ));

create policy "public can read images of published projects"
  on project_images for select
  using (exists (
    select 1 from projects p where p.id = project_images.project_id and p.is_published = true
  ));
