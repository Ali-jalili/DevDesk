/** @format */

import type { AtlasLine, AtlasRequest, RecentRequest } from "./types";
import { getMethod } from "./methodColors";

export function selectAtlasStats(lines: AtlasLine[]) {
  const requests = lines.flatMap((line) => line.requests);
  const undocumented = requests.filter((request) => !request.description?.trim());
  const methods: Record<string, number> = {};
  requests.forEach((request) => {
    const method = getMethod(request.method);
    methods[method] = (methods[method] ?? 0) + 1;
  });
  return {
    requests,
    total: requests.length,
    undocumented,
    emptyLines: lines.filter((line) => line.requests.length === 0),
    methods,
    coverage: requests.length ? Math.round(((requests.length - undocumented.length) / requests.length) * 100) : 0,
  };
}

export function selectRecentRequests(lines: AtlasLine[], limit = 4): RecentRequest[] {
  return lines.flatMap((line) => line.requests.map((request) => ({
    ...request,
    method: getMethod(request.method),
    path: request.url ?? "",
    collectionId: line.id,
    collectionName: line.name ?? "Untitled collection",
    createdAt: request.created_at,
  }))).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, limit);
}

export function stationPath(request: AtlasRequest) {
  return request.url || "/";
}
