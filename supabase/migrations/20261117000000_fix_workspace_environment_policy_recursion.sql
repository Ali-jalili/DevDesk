-- Avoid recursive RLS evaluation when a workspace policy validates its
-- active environment and the environments policy checks workspace ownership.
create or replace function public.workspace_environment_belongs_to_user(
  p_workspace_id uuid,
  p_environment_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspaces w
    join public.environments e on e.workspace_id = w.id
    where w.id = p_workspace_id
      and w.user_id = (select auth.uid())
      and e.id = p_environment_id
  );
$$;

revoke all on function public.workspace_environment_belongs_to_user(uuid, uuid)
  from public, anon;
grant execute on function public.workspace_environment_belongs_to_user(uuid, uuid)
  to authenticated;

drop policy if exists workspaces_insert_owner on public.workspaces;
create policy workspaces_insert_owner on public.workspaces
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and (
      active_environment_id is null
      or public.workspace_environment_belongs_to_user(id, active_environment_id)
    )
  );

drop policy if exists workspaces_update_owner on public.workspaces;
create policy workspaces_update_owner on public.workspaces
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (
      active_environment_id is null
      or public.workspace_environment_belongs_to_user(id, active_environment_id)
    )
  );
