/** @format */

import supabase from "@/lib/supabase";

export async function getWorkspaceSnapshot(
  userId: string,
  workspaceId?: string,
) {
  let workspaceQuery = supabase
    .from("workspaces")
    .select("id, name, created_at")
    .eq("user_id", userId);

  if (workspaceId) {
    workspaceQuery = workspaceQuery.eq("id", workspaceId);
  } else {
    workspaceQuery = workspaceQuery
      .order("created_at", { ascending: false })
      .limit(1);
  }

  const { data: workspace, error } = await workspaceQuery.maybeSingle();

  if (error) throw error;

  if (!workspace) {
    return null;
  }

  const workspaceDbId = workspace.id;

  const { count: collections, error: collectionsError } = await supabase
    .from("collections")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("workspace_id", workspaceDbId);

  if (collectionsError) throw collectionsError;

  const { data: collectionData, error: collectionDataError } = await supabase
    .from("collections")
    .select("id, created_at")
    .eq("workspace_id", workspaceDbId);

  if (collectionDataError) throw collectionDataError;

  const collectionIds = collectionData?.map((item) => item.id) ?? [];

  const { count: requests, error: requestsError } = collectionIds.length
    ? await supabase
        .from("requests")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in("collection_id", collectionIds)
    : { count: 0, error: null as null };

  if (requestsError) throw requestsError;

  const { count: environments, error: environmentsError } = await supabase
    .from("environments")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("workspace_id", workspaceDbId);

  if (environmentsError) throw environmentsError;

  const { data: environmentData, error: environmentDataError } = await supabase
    .from("environments")
    .select("created_at")
    .eq("workspace_id", workspaceDbId);

  if (environmentDataError) throw environmentDataError;

  const { data: requestData, error: requestDataError } = collectionIds.length
    ? await supabase
        .from("requests")
        .select("created_at")
        .in("collection_id", collectionIds)
    : { data: [] as { created_at: string | null }[], error: null as null };

  if (requestDataError) throw requestDataError;

  const timestamps = [
    workspace.created_at,
    ...(collectionData ?? []).map((item) => item.created_at),
    ...(requestData ?? []).map((item) => item.created_at),
    ...(environmentData ?? []).map((item) => item.created_at),
  ].filter(Boolean);

  const latestActivity = timestamps
    .filter((value): value is string => Boolean(value))
    .sort(
      (first, second) => new Date(second).getTime() - new Date(first).getTime(),
    )[0];

  return {
    id: workspace.id,
    name: workspace.name,

    collections: collections ?? 0,

    requests: requests ?? 0,

    environments: environments ?? 0,

    lastActivity: latestActivity ? formatRelativeTime(latestActivity) : null,
  };
}

function formatRelativeTime(timestamp: string) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000),
  );

  if (elapsedSeconds < 60) return "Just now";
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`;
  if (elapsedSeconds < 86400)
    return `${Math.floor(elapsedSeconds / 3600)}h ago`;
  return `${Math.floor(elapsedSeconds / 86400)}d ago`;
}
