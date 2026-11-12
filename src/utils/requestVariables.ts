/** @format */

/**
 * Pure helpers for executing requests with environment variables.
 * Kept out of SendRequest.tsx so they can be unit tested in isolation.
 */

const VARIABLE_PATTERN = /\{\{\s*([^{}]+?)\s*\}\}/g;

/** Replace `{{ key }}` placeholders with values from the given map. Unknown keys are left as-is. */
export function interpolate(value: string, variables: Record<string, string>) {
  return value.replace(VARIABLE_PATTERN, (match, key: string) =>
    Object.hasOwn(variables, key.trim()) ? variables[key.trim()] : match,
  );
}

/** List the placeholder names referenced in any of the given strings that have no value in `variables`. */
export function findUnresolvedVariables(
  values: string[],
  variables: Record<string, string>,
) {
  const names = new Set<string>();

  for (const value of values) {
    for (const match of value.matchAll(VARIABLE_PATTERN)) {
      const key = match[1].trim();
      if (!Object.hasOwn(variables, key)) names.add(key);
    }
  }

  return [...names];
}

/** Pretty-print a JSON response body; fall back to the raw text. */
export function formatResponse(body: string) {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body || "(empty response)";
  }
}

/** Human-readable byte size. */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
