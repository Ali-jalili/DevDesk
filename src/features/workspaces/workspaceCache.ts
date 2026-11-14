/** @format */

import type { QueryClient, QueryKey } from "@tanstack/react-query";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function addIds(data: unknown, ids: Set<string>) {
  if (!Array.isArray(data)) return;
  for (const item of data) {
    const id = asRecord(item)?.id;
    if (typeof id === "string") ids.add(id);
  }
}

export function getWorkspaceQueryKeys(
  queryClient: QueryClient,
  workspaceId: string,
): QueryKey[] {
  const queries = queryClient.getQueryCache().getAll();
  const collectionIds = new Set<string>();
  const environmentIds = new Set<string>();
  const requestIds = new Set<string>();

  for (const query of queries) {
    const [scope, id] = query.queryKey;
    const data = query.state.data;

    if (scope === "collections" && id === workspaceId) {
      addIds(data, collectionIds);
    }
    if (scope === "environments" && id === workspaceId) {
      addIds(data, environmentIds);
    }
    if (scope === "atlas" && id === workspaceId) {
      const lines = asRecord(data)?.lines;
      if (Array.isArray(lines)) {
        for (const line of lines) {
          const lineRecord = asRecord(line);
          if (typeof lineRecord?.id === "string") {
            collectionIds.add(lineRecord.id);
          }
          if (Array.isArray(lineRecord?.requests)) {
            addIds(lineRecord.requests, requestIds);
          }
        }
      }
    }

    if (scope === "collections") {
      const collection = asRecord(data);
      if (
        collection?.workspace_id === workspaceId &&
        typeof collection.id === "string"
      ) {
        collectionIds.add(collection.id);
      }
    }
  }

  for (const query of queries) {
    const [scope, id] = query.queryKey;
    if (scope !== "requests") continue;

    if (typeof id === "string" && collectionIds.has(id)) {
      addIds(query.state.data, requestIds);
    }

    const request = asRecord(query.state.data);
    if (
      request &&
      typeof request.collection_id === "string" &&
      collectionIds.has(request.collection_id) &&
      typeof request.id === "string"
    ) {
      requestIds.add(request.id);
    }
  }

  return queries
    .filter((query) => {
      const [scope, id] = query.queryKey;
      if (scope === "workspaceDetails" || scope === "atlas") {
        return id === workspaceId;
      }
      if (scope === "collections") {
        return id === workspaceId || (typeof id === "string" && collectionIds.has(id));
      }
      if (scope === "environments") return id === workspaceId;
      if (scope === "environment_variables") {
        return typeof id === "string" && environmentIds.has(id);
      }
      if (scope === "requests") {
        return typeof id === "string" && (collectionIds.has(id) || requestIds.has(id));
      }
      return false;
    })
    .map((query) => query.queryKey);
}
