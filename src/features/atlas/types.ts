/** @format */

/** A single station on an Atlas line. */
export interface AtlasRequest {
  id: string;
  method: string | null;
  url: string | null;
  description: string | null;
  created_at: string;
  headers: Record<string, string> | null;
  params: Record<string, string> | null;
  body: string | null;
}

/** A collection rendered as one "line" on the metro map. */
export interface AtlasLine {
  id: string;
  name: string | null;
  created_at: string;
  requests: AtlasRequest[];
}

/** An environment with how many variables it currently holds. */
export interface AtlasEnvironment {
  id: string;
  name: string;
  variableCount: number;
}

/** The full payload the page renders from a single data fetch. */
export interface AtlasPayload {
  lines: AtlasLine[];
  environments: AtlasEnvironment[];
  activeEnvironmentId: string | null;
  workspaceName: string;
}

/** The most recently added request, used by "Pick up where you left off". */
export interface RecentRequest {
  id: string;
  method: string;
  path: string;
  collectionName: string;
  collectionId: string;
  createdAt: string;
}
