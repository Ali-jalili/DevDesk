/** @format */

import supabase from "@/lib/supabase";
import type { AtlasEnvironment, AtlasLine, AtlasPayload, AtlasRequest } from "./types";

export const HAS_UPDATED_AT = false;
// TODO: enable recently touched ordering after applying the updated_at migration.

function toRecord(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

export async function getAtlas(workspaceId: string): Promise<AtlasPayload> {
  const [collectionsResult, workspaceResult, environmentsResult] = await Promise.all([
    supabase.from("collections").select("id,name,created_at,requests(id,method,url,description,created_at,headers,params,body)").eq("workspace_id", workspaceId).order("created_at"),
    supabase.from("workspaces").select("active_environment_id,name").eq("id", workspaceId).single(),
    supabase.from("environments").select("id,name,environment_variables(count)").eq("workspace_id", workspaceId).order("created_at"),
  ]);
  if (collectionsResult.error) throw new Error(collectionsResult.error.message);
  if (workspaceResult.error) throw new Error(workspaceResult.error.message);
  if (environmentsResult.error) throw new Error(environmentsResult.error.message);

  const lines: AtlasLine[] = collectionsResult.data.map((collection) => ({
    id: collection.id,
    name: collection.name,
    created_at: collection.created_at,
    requests: [...(collection.requests ?? [])]
      .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
      .map((request): AtlasRequest => ({
        id: request.id,
        method: request.method,
        url: request.url,
        description: request.description,
        created_at: request.created_at,
        headers: toRecord(request.headers),
        params: toRecord(request.params),
        body: request.body,
      })),
  }));

  const environments: AtlasEnvironment[] = environmentsResult.data.map((environment) => ({
    id: environment.id,
    name: environment.name,
    variableCount: environment.environment_variables.reduce((sum, item) => sum + item.count, 0),
  }));
  return { lines, environments, activeEnvironmentId: workspaceResult.data.active_environment_id, workspaceName: workspaceResult.data.name ?? "Workspace" };
}
