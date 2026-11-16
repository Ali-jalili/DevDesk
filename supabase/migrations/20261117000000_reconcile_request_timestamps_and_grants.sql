-- Reconcile databases where the original migrations were applied manually
-- or where requests.updated_at already existed as a nullable column.
begin;

-- The existing moddatetime trigger refreshes this value on UPDATE. Backfill
-- existing rows before enforcing NOT NULL; the default covers future INSERTs.
update public.requests
set updated_at = now()
where updated_at is null;

alter table public.requests
  alter column updated_at set default now(),
  alter column updated_at set not null;

-- Keep authenticated access limited to the CRUD operations used by the app.
revoke all on table public.workspaces, public.collections, public.environments,
  public.environment_variables, public.requests from authenticated;
grant select, insert, update, delete on table public.workspaces, public.collections,
  public.environments, public.environment_variables, public.requests to authenticated;

commit;
