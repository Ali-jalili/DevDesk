/** @format */

import supabase from "@/lib/supabase";

async function createCollection({
  workspaceId,
  name,
  description,
}: {
  workspaceId: string;
  name: string;
  description: string;
}) {
  const { data, error } = await supabase.from("collections").insert({
    name: name,
    description: description,
    workspace_id: workspaceId,
  });

  if (error) throw new Error(error.message);

  return data;
}

async function getCollections(workspaceId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*,requests(count)")
    .eq("workspace_id", workspaceId);

  if (error) throw new Error(error.message);

  return data;
}

async function updateCollection(
  collectionId: string,
  newName: string,
  newDescription: string,
) {
  const { data, error } = await supabase
    .from("collections")
    .update({
      name: newName,
      description: newDescription,
    })
    .eq("id", collectionId);

  if (error) throw new Error(error.message);

  return data;
}

async function deleteCollection(collectionId: string) {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId);
  if (error) throw new Error(error.message);
}

async function getCollectionById(collectionId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", collectionId)
    .single();
  if (error) throw new Error(error.message);

  return data;
}

export {
  createCollection,
  getCollections,
  updateCollection,
  deleteCollection,
  getCollectionById,
};
