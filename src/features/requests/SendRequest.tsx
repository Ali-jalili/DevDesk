import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import useGetVariables from "@/features/environments/hooks/useGetVariables";
import type { RequestRecord } from "@/types/database";

type RequestResponse = {
  status: number;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
  sizeBytes: number;
  truncated: boolean;
};

const MAX_RESPONSE_BYTES = 1024 * 1024;

function interpolate(value: string, variables: Record<string, string>) {
  return value.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (match, key: string) =>
    Object.hasOwn(variables, key) ? variables[key] : match,
  );
}

function findUnresolvedVariables(values: string[]) {
  const names = new Set<string>();
  const pattern = /\{\{\s*([^{}]+?)\s*\}\}/g;

  for (const value of values) {
    for (const match of value.matchAll(pattern)) names.add(match[1].trim());
  }

  return [...names];
}

function formatResponse(body: string) {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body || "(empty response)";
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function readResponseBody(response: Response) {
  if (!response.body) {
    return { body: "", sizeBytes: 0, truncated: false };
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let sizeBytes = 0;
  let truncated = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const remainingBytes = MAX_RESPONSE_BYTES - sizeBytes;
    if (value.byteLength > remainingBytes) {
      if (remainingBytes > 0) {
        chunks.push(value.slice(0, remainingBytes));
        sizeBytes += remainingBytes;
      }
      truncated = true;
      await reader.cancel();
      break;
    }

    chunks.push(value);
    sizeBytes += value.byteLength;
  }

  const bytes = new Uint8Array(sizeBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    body: new TextDecoder().decode(bytes),
    sizeBytes,
    truncated,
  };
}

export default function SendRequest({
  request,
  activeEnvironmentId,
}: {
  request: RequestRecord;
  activeEnvironmentId: string | null;
}) {
  const {
    data: variables = [],
    isLoading: isLoadingVariables,
    error: variablesError,
    refetch: refetchVariables,
  } = useGetVariables(activeEnvironmentId ?? undefined);
  const [response, setResponse] = useState<RequestResponse | null>(null);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function send() {
    setError("");
    setResponse(null);

    if (variablesError) {
      setError("Environment variables could not be loaded. Try again before sending.");
      return;
    }

    const values = Object.fromEntries(variables.map(({ key, value }) => [key, value]));
    const rawValues = [
      request.url ?? "",
      ...Object.entries(request.params ?? {}).flatMap(([key, value]) => [key, value]),
      ...Object.entries(request.headers ?? {}).flatMap(([key, value]) => [key, value]),
      request.body ?? "",
    ];
    const unresolved = findUnresolvedVariables(rawValues).filter(
      (key) => !Object.hasOwn(values, key),
    );

    if (unresolved.length > 0) {
      setError(`Missing environment variable${unresolved.length > 1 ? "s" : ""}: ${unresolved.join(", ")}`);
      return;
    }

    setIsSending(true);
    try {
      const target = new URL(interpolate(request.url ?? "", values));
      if (!["http:", "https:"].includes(target.protocol)) {
        throw new Error("Only HTTP and HTTPS request URLs are supported.");
      }

      for (const [key, value] of Object.entries(request.params ?? {})) {
        target.searchParams.set(interpolate(key, values), interpolate(value, values));
      }

      const headers = Object.fromEntries(
        Object.entries(request.headers ?? {}).map(([key, value]) => [
          interpolate(key, values),
          interpolate(value, values),
        ]),
      );
      const body = request.body ? interpolate(request.body, values) : "";
      const method = (request.method ?? "GET").toUpperCase();
      const startedAt = performance.now();
      const result = await fetch(target.toString(), {
        method,
        headers,
        body: method === "GET" || method === "HEAD" ? undefined : body || undefined,
      });
      const responseBody = await readResponseBody(result);

      setResponse({
        status: result.status,
        headers: Object.fromEntries(result.headers.entries()),
        durationMs: Math.round(performance.now() - startedAt),
        ...responseBody,
      });
    } catch (caught) {
      setError(
        caught instanceof TypeError
          ? "The browser could not reach this API. Check the URL and your network; the API may also block browser requests through CORS."
          : caught instanceof Error
            ? caught.message
            : "Request failed.",
      );
    } finally {
      setIsSending(false);
    }
  }

  const isSendDisabled =
    isSending || isLoadingVariables || !!variablesError || !request.url;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">Send request</h2>
          <p className="mt-1 text-sm text-slate-500">
            Uses variables from the active environment.
          </p>
        </div>
        <button
          type="button"
          onClick={send}
          disabled={isSendDisabled}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending || isLoadingVariables ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSending
            ? "Sending..."
            : isLoadingVariables
              ? "Loading environment..."
              : "Send"}
        </button>
      </div>

      {!activeEnvironmentId && (
        <p className="mt-3 text-xs text-amber-700">
          No active environment selected. Requests without environment variables can still be sent.
        </p>
      )}
      {variablesError && (
        <div role="alert" className="mt-3 flex flex-wrap items-center gap-2 text-sm text-red-700">
          <span>Environment variables could not be loaded.</span>
          <button
            type="button"
            onClick={() => void refetchVariables()}
            className="font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}
      {error && (
        <pre
          role="alert"
          className="mt-4 whitespace-pre-wrap rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </pre>
      )}

      {response && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <strong>Response</strong>
            <span
              className={`rounded-full px-2.5 py-1 font-semibold ${
                response.status < 400
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {response.status}
            </span>
            <span className="text-slate-500">{response.durationMs} ms</span>
            <span className="text-slate-500">{formatBytes(response.sizeBytes)}</span>
          </div>

          {Object.keys(response.headers).length > 0 && (
            <details className="rounded-xl border border-slate-200">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700">
                Response headers ({Object.keys(response.headers).length})
              </summary>
              <dl className="space-y-2 border-t border-slate-200 px-4 py-3 text-xs">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="grid gap-1 sm:grid-cols-[180px_1fr]">
                    <dt className="font-semibold text-slate-700">{key}</dt>
                    <dd className="break-all text-slate-500">{value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}

          {response.truncated && (
            <p role="status" className="text-xs text-amber-700">
              Response body was truncated at 1 MB.
            </p>
          )}
          <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
            {formatResponse(response.body)}
          </pre>
        </div>
      )}
    </section>
  );
}
