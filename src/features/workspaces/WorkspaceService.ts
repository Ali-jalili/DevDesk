/** @format */

import supabase from "@/lib/supabase";

async function createWorkspace(
  workspaceName: string,
  workspaceDescription: string,
) {
  const { data: authData } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("workspaces").insert({
    user_id: authData.user?.id ?? null,
    name: workspaceName,
    description: workspaceDescription,
  });

  if (error) throw new Error(error.message);

  return data;
}

async function getWorkspaces() {
  const { data, error } = await supabase.from("workspaces").select("*");
  if (error) throw new Error(error.message);

  return data;
}

async function getWorkspaceById(workspaceId: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function updateWorkspace(
  workspaceId: string,
  newName: string,
  newDescription: string,
) {
  const { data, error } = await supabase
    .from("workspaces")
    .update({
      name: newName,
      description: newDescription,
    })
    .eq("id", workspaceId)
    .select();

  if (error) throw new Error(error.message);

  return data;
}

async function deleteWorkspace(workspaceId: string) {
  // Child rows (requests, collections, environment_variables, environments)
  // are removed atomically by ON DELETE CASCADE foreign keys defined in
  // supabase/migrations/0001_workspaces_rename_and_cascade.sql.
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);
  if (error) throw new Error(error.message);
}

async function updateWorkspaceEnvironment(
  workspaceId: string,
  environmentId: string | null,
) {
  const { data, error } = await supabase
    .from("workspaces")
    .update({
      active_environment_id: environmentId,
    })
    .eq("id", workspaceId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  updateWorkspaceEnvironment,
};
