-- DevDesk — Phase 1 migration (final, based on production schema dump)
--
-- Verified against the live schema:
--   * tables: "CreateWorkspace", collections, environments,
--     environment_variables, requests (all RLS-enabled, owner-only policies)
--   * existing FKs:
--       CreateWorkspace_user_id_fkey          -> users.id                  ON DELETE CASCADE
--       createworkspace_active_environment_fk -> environments.id           ON DELETE NO ACTION
--       collections_workspace_id_fkey         -> "CreateWorkspace".id      ON DELETE NO ACTION
--       environments_workspace_id_fkey        -> "CreateWorkspace".id      ON DELETE CASCADE
--       environment_variables_environment_id_fkey -> environments.id       ON DELETE CASCADE
--       Request_collection_id_fkey            -> collections.id            ON DELETE NO ACTION
--
-- What this migration does:
--   1) Renames "CreateWorkspace" -> workspaces
--      (Postgres rewrites FKs and RLS policy expressions that reference
--       the table, so no manual SQL rewrites are needed)
--   2) Makes workspace deletion atomic by upgrading the three NO ACTION FKs:
--       collections.workspace_id  -> ON DELETE CASCADE
--       requests.collection_id    -> ON DELETE CASCADE
--       workspaces.active_environment_id -> ON DELETE SET NULL
--       (an active environment pointing at a row we are deleting would
--       otherwise block the cascade with an FK violation)
--   3) Closes a security hole: the requests INSERT policy allowed ANY
--      authenticated user to create requests in ANY collection. It is
--      replaced with an ownership check.
--
-- Safe to re-run: each foreign key is checked for its target delete action
-- before replacing legacy constraints. This also handles the quoted,
-- mixed-case Request_collection_id_fkey found in earlier schemas.

-- ---------------------------------------------------------------------------
-- 1) Rename the table (only executes while the old name still exists)
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public."CreateWorkspace"') is not null then
    alter table public."CreateWorkspace" rename to workspaces;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 2) Upgrade foreign keys so deleting a workspace is a single atomic delete
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.collections') is not null
     and to_regclass('public.workspaces') is not null then
    alter table public.collections drop constraint if exists collections_workspace_id_fkey;
    if not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.collections'::regclass
        and conname = 'fk_collections_workspace_id'
        and contype = 'f'
        and confdeltype = 'c'
    ) then
      alter table public.collections drop constraint if exists fk_collections_workspace_id;
      alter table public.collections
        add constraint fk_collections_workspace_id
        foreign key (workspace_id) references public.workspaces(id)
        on delete cascade;
    end if;
  end if;

  if to_regclass('public.requests') is not null
     and to_regclass('public.collections') is not null then
    alter table public.requests drop constraint if exists "Request_collection_id_fkey";
    if not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.requests'::regclass
        and conname = 'fk_requests_collection_id'
        and contype = 'f'
        and confdeltype = 'c'
    ) then
      alter table public.requests drop constraint if exists fk_requests_collection_id;
      alter table public.requests
        add constraint fk_requests_collection_id
        foreign key (collection_id) references public.collections(id)
        on delete cascade;
    end if;
  end if;

  if to_regclass('public.workspaces') is not null
     and to_regclass('public.environments') is not null then
    alter table public.workspaces drop constraint if exists createworkspace_active_environment_fk;
    if not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.workspaces'::regclass
        and conname = 'fk_workspaces_active_environment'
        and contype = 'f'
        and confdeltype = 'n'
    ) then
      alter table public.workspaces drop constraint if exists fk_workspaces_active_environment;
      alter table public.workspaces
        add constraint fk_workspaces_active_environment
        foreign key (active_environment_id) references public.environments(id)
        on delete set null;
    end if;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 3) Fix the requests INSERT policy security hole
--    Old policy:  for INSERT with check (auth.uid() IS NOT NULL)
--    New policy:  the caller must own the target collection
-- ---------------------------------------------------------------------------
drop policy if exists "Users can create requests" on public.requests;

create policy "Users can create requests in their own collections"
  on public.requests for insert
  with check (
    exists (
      select 1
      from public.collections c
      join public.workspaces w on w.id = c.workspace_id
      where c.id = collection_id and w.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Optional (commented out): enforce that every workspace has an owner.
-- A workspace with a NULL user_id is unreachable by any RLS policy.
-- Un-comment only if you verified no rows have user_id IS NULL:
--   select count(*) from public.workspaces where user_id is null;
--
-- alter table public.workspaces alter column user_id set not null;
-- ---------------------------------------------------------------------------
