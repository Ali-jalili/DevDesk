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

  const { count: collections } = await supabase
    .from("collections")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("workspace_id", workspace.id);

  const { data: collectionData } = await supabase
    .from("collections")
    .select("id, created_at")
    .eq("workspace_id", workspace.id);

  const collectionIds = collectionData?.map((item) => item.id) ?? [];

  const { count: requests } = await supabase
    .from("requests")
    .select("id", {
      count: "exact",
      head: true,
    })
    .in("collection_id", collectionIds);

  const { count: environments } = await supabase
    .from("environments")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("workspace_id", workspace.id);

  const { data: environmentData } = await supabase
    .from("environments")
    .select("created_at")
    .eq("workspace_id", workspace.id);

  const { data: requestData } = collectionIds.length
    ? await supabase
        .from("requests")
        .select("created_at")
        .in("collection_id", collectionIds)
    : { data: [] };

  const timestamps = [
    workspace.created_at,
    ...(collectionData ?? []).map((item) => item.created_at),
    ...(requestData ?? []).map((item) => item.created_at),
    ...(environmentData ?? []).map((item) => item.created_at),
  ].filter(Boolean);

  const latestActivity = timestamps.sort(
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
