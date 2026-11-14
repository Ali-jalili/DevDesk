-- Follow-up for databases where 0001 was applied manually.
-- Apply once in the Supabase SQL Editor; safe to run again after success.
begin;

-- 0001 used an unquoted mixed-case constraint name, so PostgreSQL did not
-- remove the original NO ACTION FK. Keep the correctly named CASCADE FK.
alter table public.requests
  drop constraint if exists "Request_collection_id_fkey";

-- The owner must be provided by the authenticated application, never guessed.
alter table public.workspaces
  alter column user_id drop default;

do $$
begin
  if exists (select 1 from public.workspaces where user_id is null) then
    raise exception 'Cannot require workspace owners while NULL user_id rows exist';
  end if;

  alter table public.workspaces
    alter column user_id set not null;
end
$$;

commit;
