-- Clean-install schema for a Supabase project. Existing installations are
-- brought to the same shape by the conditional FK repair below.
begin;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  active_environment_id uuid
);

create table if not exists public.environments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  workspace_id uuid not null,
  created_at timestamptz default now()
);

create table if not exists public.environment_variables (
  id uuid primary key default gen_random_uuid(),
  environment_id uuid not null,
  key text not null,
  value text not null,
  created_at timestamptz default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  method text,
  url text,
  headers jsonb,
  params jsonb,
  body text,
  description text,
  collection_id uuid,
  updated_at timestamptz,
  created_at timestamptz not null default now(),
  example_request text,
  example_response text,
  notes text
);

-- Remove known legacy duplicates / non-cascading links from the manual schema.
alter table public.collections drop constraint if exists collections_workspace_id_fkey;
alter table public.requests drop constraint if exists "Request_collection_id_fkey";
alter table public.workspaces drop constraint if exists createworkspace_active_environment_fk;

do $$
declare
  fk record;
begin
  if not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.workspaces'::regclass
      and c.confrelid = 'auth.users'::regclass
      and c.contype = 'f' and c.confdeltype = 'c'
      and c.conkey = array[(select a.attnum::smallint from pg_attribute a
        where a.attrelid = c.conrelid and a.attname = 'user_id')]
  ) then
    for fk in select conname from pg_constraint
      where conrelid = 'public.workspaces'::regclass and contype = 'f'
        and conkey = array[(select attnum::smallint from pg_attribute
          where attrelid = 'public.workspaces'::regclass and attname = 'user_id')]
    loop
      execute format('alter table public.workspaces drop constraint %I', fk.conname);
    end loop;
    alter table public.workspaces add constraint fk_workspaces_user_id
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.workspaces'::regclass
      and c.confrelid = 'public.environments'::regclass
      and c.contype = 'f' and c.confdeltype = 'n'
      and c.conkey = array[(select a.attnum::smallint from pg_attribute a
        where a.attrelid = c.conrelid and a.attname = 'active_environment_id')]
  ) then
    alter table public.workspaces drop constraint if exists fk_workspaces_active_environment;
    alter table public.workspaces add constraint fk_workspaces_active_environment
      foreign key (active_environment_id) references public.environments(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.environments'::regclass
      and c.confrelid = 'public.workspaces'::regclass
      and c.contype = 'f' and c.confdeltype = 'c'
      and c.conkey = array[(select a.attnum::smallint from pg_attribute a
        where a.attrelid = c.conrelid and a.attname = 'workspace_id')]
  ) then
    alter table public.environments drop constraint if exists environments_workspace_id_fkey;
    alter table public.environments add constraint environments_workspace_id_fkey
      foreign key (workspace_id) references public.workspaces(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.environment_variables'::regclass
      and c.confrelid = 'public.environments'::regclass
      and c.contype = 'f' and c.confdeltype = 'c'
      and c.conkey = array[(select a.attnum::smallint from pg_attribute a
        where a.attrelid = c.conrelid and a.attname = 'environment_id')]
  ) then
    alter table public.environment_variables drop constraint if exists environment_variables_environment_id_fkey;
    alter table public.environment_variables add constraint environment_variables_environment_id_fkey
      foreign key (environment_id) references public.environments(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.collections'::regclass
      and c.confrelid = 'public.workspaces'::regclass
      and c.contype = 'f' and c.confdeltype = 'c'
      and c.conkey = array[(select a.attnum::smallint from pg_attribute a
        where a.attrelid = c.conrelid and a.attname = 'workspace_id')]
  ) then
    alter table public.collections drop constraint if exists fk_collections_workspace_id;
    alter table public.collections add constraint fk_collections_workspace_id
      foreign key (workspace_id) references public.workspaces(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.requests'::regclass
      and c.confrelid = 'public.collections'::regclass
      and c.contype = 'f' and c.confdeltype = 'c'
      and c.conkey = array[(select a.attnum::smallint from pg_attribute a
        where a.attrelid = c.conrelid and a.attname = 'collection_id')]
  ) then
    alter table public.requests drop constraint if exists fk_requests_collection_id;
    alter table public.requests add constraint fk_requests_collection_id
      foreign key (collection_id) references public.collections(id) on delete cascade;
  end if;
end
$$;

create index if not exists workspaces_user_id_idx on public.workspaces(user_id);
create index if not exists environments_workspace_id_idx on public.environments(workspace_id);
create index if not exists environment_variables_environment_id_idx on public.environment_variables(environment_id);
create index if not exists collections_workspace_id_idx on public.collections(workspace_id);
create index if not exists requests_collection_id_idx on public.requests(collection_id);

commit;
