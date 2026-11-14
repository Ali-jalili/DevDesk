/** @format */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "@/app/context/useAuth";
import useAtlas from "./hooks/useAtlas";
import AtlasHeader from "./AtlasHeader";
import AtlasMap from "./AtlasMap";
import AtlasSkeleton from "./AtlasSkeleton";
import { AttentionList, AtlasEmpty, RecentRequests } from "./AtlasPanels";
import { selectAtlasStats, selectRecentRequests } from "./atlasSelectors";
import type { ParsedCurl } from "@/utils/parseCurl";
import { parseCurl } from "@/utils/parseCurl";

export default function AtlasPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useAtlas();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | null>(null);

  const importRequest = useCallback((parsed: ParsedCurl) => {
    if (!data?.lines[0]) {
      toast.error("Create a collection before importing a request.");
      return;
    }
    const path = (() => { try { return new URL(parsed.url).pathname; } catch { return parsed.url; } })();
    navigate(`/app/workspaces/${data.workspaceId}/collections/${data.lines[0].id}/requests/new`, {
      state: { prefill: {
        name: `${parsed.method} ${path}`,
        method: parsed.method,
        url: parsed.url,
        headers: Object.entries(parsed.headers).map(([key, value]) => ({ key, value })),
        params: Object.entries(parsed.params).map(([key, value]) => ({ key, value })),
        body: parsed.body,
      } },
    });
  }, [data, navigate]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text");
      if (!text || !/^(\s*curl\b|\s*https?:\/\/)/i.test(text)) return;
      const parsed = parseCurl(text);
      if (!parsed) return;
      event.preventDefault();
      importRequest(parsed);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [importRequest]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilter(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (isLoading) return <AtlasSkeleton />;
  if (error) return <main className="p-6"><div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Could not load Atlas: {error.message}</div></main>;
  if (!data) return <main className="mx-auto max-w-6xl p-5"><AtlasEmpty noWorkspace /></main>;

  const stats = selectAtlasStats(data.lines);
  const recent = selectRecentRequests(data.lines);
  const firstName = String(user?.user_metadata?.name || user?.email?.split("@")[0] || "there").split(/[\s@]/)[0];
  const undocumented = stats.undocumented.map((item) => {
    const line = data.lines.find((candidate) => candidate.requests.some((request) => request.id === item.id));
    return { ...item, method: item.method ?? "GET", path: item.url ?? "", collectionId: line?.id ?? "", collectionName: line?.name ?? "Collection", createdAt: item.created_at };
  });

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1680px] flex-col gap-5 bg-slate-50 p-4 sm:gap-6 sm:p-6 lg:p-8 xl:p-10">
      <AtlasHeader workspaceId={data.workspaceId} workspaceName={data.workspaceName} userName={firstName} requestCount={stats.total} collectionCount={data.lines.length} undocumentedCount={stats.undocumented.length} environments={data.environments} activeEnvironmentId={data.activeEnvironmentId} onImport={importRequest} />
      {stats.total === 0 && data.lines.length === 0 ? (
        <AtlasEmpty noWorkspace={false} />
      ) : (
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <AtlasMap lines={data.lines} workspaceId={data.workspaceId} filter={filter} onFilter={setFilter} />
          <div className="grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-1 xl:content-start">
            <RecentRequests requests={recent} workspaceId={data.workspaceId} />
            <AttentionList undocumented={undocumented} emptyLines={stats.emptyLines} environments={data.environments} workspaceId={data.workspaceId} coverage={stats.coverage} requestCount={stats.total} />
          </div>
        </div>
      )}
    </main>
  );
}
