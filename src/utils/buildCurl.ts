/** @format */

export interface CurlInput {
  method: string;
  url: string;
  headers?: Record<string, string> | null;
  params?: Record<string, string> | null;
  body?: string | null;
}

function quote(value: string) {
  // Escape backslashes and double quotes for a POSIX shell -H argument.
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Build a portable cURL command string from a stored request.
 * Query params are appended to the URL; headers become -H flags; the body is
 * passed with --data (omitted for GET/HEAD where it would be a no-op).
 */
export function buildCurl(input: CurlInput): string {
  const method = (input.method || "GET").toUpperCase();

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input.params ?? {})) {
    if (key) params.set(key, value);
  }
  const queryString = params.toString();
  const targetUrl = input.url + (queryString ? `?${queryString}` : "");

  const lines = [`curl -X ${method} ${quote(targetUrl)}`];

  for (const [key, value] of Object.entries(input.headers ?? {})) {
    if (key) lines.push(`  -H ${quote(`${key}: ${value}`)}`);
  }

  const body = (input.body ?? "").trim();
  if (body && method !== "GET" && method !== "HEAD") {
    lines.push(`  --data ${quote(body)}`);
  }

  return lines.join(" \\\n");
}
