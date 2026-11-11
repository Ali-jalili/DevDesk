import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import supabase from "@/lib/supabase";
import useGetVariables from "@/features/environments/hooks/useGetVariables";
import type { RequestRecord } from "@/types/database";

type ProxyResponse = { status: number; headers: Record<string, string>; body: string };

function interpolate(value: string, variables: Record<string, string>) {
  return value.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (match, key: string) =>
    Object.hasOwn(variables, key) ? variables[key] : match,
  );
}

export default function SendRequest({ request, activeEnvironmentId }: {
  request: RequestRecord;
  activeEnvironmentId: string | null;
}) {
  const { data: variables = [] } = useGetVariables(activeEnvironmentId ?? undefined);
  const [response, setResponse] = useState<ProxyResponse | null>(null);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function send() {
    setError("");
    setResponse(null);
    setIsSending(true);
    try {
      const values = Object.fromEntries(variables.map(({ key, value }) => [key, value]));
      const url = interpolate(request.url ?? "", values);
      const target = new URL(url);
      for (const [key, value] of Object.entries(request.params ?? {})) {
        target.searchParams.set(interpolate(key, values), interpolate(value, values));
      }
      const headers = Object.fromEntries(Object.entries(request.headers ?? {}).map(([key, value]) => [
        interpolate(key, values), interpolate(value, values),
      ]));
      const body = request.body ? interpolate(request.body, values) : "";
      const { data, error: invokeError } = await supabase.functions.invoke<ProxyResponse>("send-request", {
        body: { url: target.toString(), method: request.method ?? "GET", headers, body },
      });
      if (invokeError) throw invokeError;
      setResponse(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed");
    } finally {
      setIsSending(false);
    }
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-semibold text-slate-950">Send request</h2>
        <p className="mt-1 text-sm text-slate-500">Uses variables from the active environment.</p></div>
      <button onClick={send} disabled={isSending || !request.url} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
        {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSending ? "Sending…" : "Send"}
      </button>
    </div>
    {!activeEnvironmentId && <p className="mt-3 text-xs text-amber-700">No active environment selected. Templates will remain unchanged.</p>}
    {error && <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</pre>}
    {response && <div className="mt-5 space-y-3">
      <div className="flex items-center gap-3 text-sm"><strong>Response</strong><span className={`rounded-full px-2.5 py-1 font-semibold ${response.status < 400 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{response.status}</span></div>
      <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{formatResponse(response.body)}</pre>
    </div>}
  </section>;
}

function formatResponse(body: string) {
  try { return JSON.stringify(JSON.parse(body), null, 2); } catch { return body || "(empty response)"; }
}
