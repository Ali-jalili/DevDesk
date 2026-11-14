/** @format */

export const METHOD_ORDER = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export const METHOD_COLORS: Record<string, { color: string; light: string; text: string }> = {
  GET: { color: "#10b981", light: "#d1fae5", text: "#047857" },
  POST: { color: "#3b82f6", light: "#dbeafe", text: "#1d4ed8" },
  PUT: { color: "#f59e0b", light: "#fef3c7", text: "#b45309" },
  PATCH: { color: "#a855f7", light: "#f3e8ff", text: "#7e22ce" },
  DELETE: { color: "#ef4444", light: "#fee2e2", text: "#b91c1c" },
};

export function getMethod(method: string | null): string {
  return method?.toUpperCase() || "GET";
}

export function getMethodColor(method: string | null) {
  return METHOD_COLORS[getMethod(method)] ?? {
    color: "#64748b",
    light: "#f1f5f9",
    text: "#475569",
  };
}
