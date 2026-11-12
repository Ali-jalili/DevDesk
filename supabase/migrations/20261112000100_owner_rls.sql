-- Authenticated users may only access rows whose workspace they own.
begin;

alter table public.workspaces enable row level security;
alter table public.collections enable row level security;
alter table public.environments enable row level security;
alter table public.environment_variables enable row level security;
alter table public.requests enable row level security;

revoke all on table public.workspaces, public.collections, public.environments,
  public.environment_variables, public.requests from anon, public;
grant select, insert, update, delete on table public.workspaces, public.collections,
  public.environments, public.environment_variables, public.requests to authenticated;
grant all on table public.workspaces, public.collections, public.environments,
  public.environment_variables, public.requests to service_role;

-- PostgreSQL combines permissive policies with OR, so remove older policies
-- on these app tables before installing the complete owner-scoped set.
do $$
declare
  old_policy record;
begin
  for old_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('workspaces', 'collections', 'environments',
        'environment_variables', 'requests')
  loop
    execute format('drop policy %I on %I.%I',
      old_policy.policyname, old_policy.schemaname, old_policy.tablename);
  end loop;
end
$$;

create policy workspaces_select_owner on public.workspaces
  for select to authenticated using (user_id = (select auth.uid()));
create policy workspaces_insert_owner on public.workspaces
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and (active_environment_id is null or exists (
      select 1 from public.environments e
      where e.id = active_environment_id and e.workspace_id = workspaces.id
    ))
  );
create policy workspaces_update_owner on public.workspaces
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (active_environment_id is null or exists (
      select 1 from public.environments e
      where e.id = active_environment_id and e.workspace_id = workspaces.id
    ))
  );
create policy workspaces_delete_owner on public.workspaces
  for delete to authenticated using (user_id = (select auth.uid()));

create policy collections_select_owner on public.collections
  for select to authenticated using (exists (
    select 1 from public.workspaces w
    where w.id = collections.workspace_id and w.user_id = (select auth.uid())
  ));
create policy collections_insert_owner on public.collections
  for insert to authenticated with check (exists (
    select 1 from public.workspaces w
    where w.id = collections.workspace_id and w.user_id = (select auth.uid())
  ));
create policy collections_update_owner on public.collections
  for update to authenticated
  using (exists (
    select 1 from public.workspaces w
    where w.id = collections.workspace_id and w.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.workspaces w
    where w.id = collections.workspace_id and w.user_id = (select auth.uid())
  ));
create policy collections_delete_owner on public.collections
  for delete to authenticated using (exists (
    select 1 from public.workspaces w
    where w.id = collections.workspace_id and w.user_id = (select auth.uid())
  ));

create policy environments_select_owner on public.environments
  for select to authenticated using (exists (
    select 1 from public.workspaces w
    where w.id = environments.workspace_id and w.user_id = (select auth.uid())
  ));
create policy environments_insert_owner on public.environments
  for insert to authenticated with check (exists (
    select 1 from public.workspaces w
    where w.id = environments.workspace_id and w.user_id = (select auth.uid())
  ));
create policy environments_update_owner on public.environments
  for update to authenticated
  using (exists (
    select 1 from public.workspaces w
    where w.id = environments.workspace_id and w.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.workspaces w
    where w.id = environments.workspace_id and w.user_id = (select auth.uid())
  ));
create policy environments_delete_owner on public.environments
  for delete to authenticated using (exists (
    select 1 from public.workspaces w
    where w.id = environments.workspace_id and w.user_id = (select auth.uid())
  ));

create policy environment_variables_select_owner on public.environment_variables
  for select to authenticated using (exists (
    select 1 from public.environments e
    join public.workspaces w on w.id = e.workspace_id
    where e.id = environment_variables.environment_id
      and w.user_id = (select auth.uid())
  ));
create policy environment_variables_insert_owner on public.environment_variables
  for insert to authenticated with check (exists (
    select 1 from public.environments e
    join public.workspaces w on w.id = e.workspace_id
    where e.id = environment_variables.environment_id
      and w.user_id = (select auth.uid())
  ));
create policy environment_variables_update_owner on public.environment_variables
  for update to authenticated
  using (exists (
    select 1 from public.environments e
    join public.workspaces w on w.id = e.workspace_id
    where e.id = environment_variables.environment_id
      and w.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.environments e
    join public.workspaces w on w.id = e.workspace_id
    where e.id = environment_variables.environment_id
      and w.user_id = (select auth.uid())
  ));
create policy environment_variables_delete_owner on public.environment_variables
  for delete to authenticated using (exists (
    select 1 from public.environments e
    join public.workspaces w on w.id = e.workspace_id
    where e.id = environment_variables.environment_id
      and w.user_id = (select auth.uid())
  ));

create policy requests_select_owner on public.requests
  for select to authenticated using (exists (
    select 1 from public.collections c
    join public.workspaces w on w.id = c.workspace_id
    where c.id = requests.collection_id and w.user_id = (select auth.uid())
  ));
create policy requests_insert_owner on public.requests
  for insert to authenticated with check (exists (
    select 1 from public.collections c
    join public.workspaces w on w.id = c.workspace_id
    where c.id = requests.collection_id and w.user_id = (select auth.uid())
  ));
create policy requests_update_owner on public.requests
  for update to authenticated
  using (exists (
    select 1 from public.collections c
    join public.workspaces w on w.id = c.workspace_id
    where c.id = requests.collection_id and w.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.collections c
    join public.workspaces w on w.id = c.workspace_id
    where c.id = requests.collection_id and w.user_id = (select auth.uid())
  ));
create policy requests_delete_owner on public.requests
  for delete to authenticated using (exists (
    select 1 from public.collections c
    join public.workspaces w on w.id = c.workspace_id
    where c.id = requests.collection_id and w.user_id = (select auth.uid())
  ));

commit;
