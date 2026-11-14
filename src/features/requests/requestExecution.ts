/** @format */

import {
  findUnresolvedVariables,
  interpolate,
} from "@/utils/requestVariables";
import { isValidRequestUrl } from "@/utils/requestUrl";

interface RequestExecutionInput {
  url: string | null;
  method: string | null;
  headers: Record<string, string> | null;
  params: Record<string, string> | null;
  body: string | null;
}

export function prepareRequest(
  request: RequestExecutionInput,
  variables: Record<string, string>,
) {
  const method = (request.method ?? "GET").toUpperCase();
  const rawValues = [
    request.url ?? "",
    ...Object.entries(request.params ?? {}).flatMap(([key, value]) => [key, value]),
    ...Object.entries(request.headers ?? {}).flatMap(([key, value]) => [key, value]),
    request.body ?? "",
  ];
  const unresolved = findUnresolvedVariables(rawValues, variables);

  if (unresolved.length > 0) {
    throw new Error(
      `Undefined variables: ${unresolved.join(", ")}. Add them to the active environment.`,
    );
  }

  const resolvedUrl = interpolate(request.url ?? "", variables);
  if (!isValidRequestUrl(resolvedUrl)) {
    throw new Error("Enter a valid URL.");
  }

  const target = new URL(resolvedUrl);
  if (!["http:", "https:"].includes(target.protocol)) {
    throw new Error("Only HTTP and HTTPS request URLs are supported.");
  }

  for (const [key, value] of Object.entries(request.params ?? {})) {
    target.searchParams.set(
      interpolate(key, variables),
      interpolate(value, variables),
    );
  }

  const headers = Object.fromEntries(
    Object.entries(request.headers ?? {}).map(([key, value]) => [
      interpolate(key, variables),
      interpolate(value, variables),
    ]),
  );
  const body = request.body ? interpolate(request.body, variables) : "";

  return {
    url: target.toString(),
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : body || undefined,
  };
}
