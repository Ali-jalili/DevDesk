/** @format */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { FiCommand } from "react-icons/fi";
import EnvironmentPill from "./EnvironmentPill";
import type { AtlasEnvironment } from "./types";
import { parseCurl } from "@/utils/parseCurl";
import type { ParsedCurl } from "@/utils/parseCurl";

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 700);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);
  return <>{reduceMotion ? value : shown}</>;
}

export default function AtlasHeader({ workspaceId, workspaceName, userName, requestCount, collectionCount, undocumentedCount, environments, activeEnvironmentId, onImport }: { workspaceId: string; workspaceName: string; userName: string; requestCount: number; collectionCount: number; undocumentedCount: number; environments: AtlasEnvironment[]; activeEnvironmentId: string | null; onImport: (parsed: ParsedCurl) => void }) {
  const [curlText, setCurlText] = useState("");
  function importCurl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseCurl(curlText);
    if (parsed) onImport(parsed);
  }
  return <>
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.17em] text-indigo-600">Atlas / {workspaceName}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{greeting()}, {userName}</h1><p className="mt-1 text-sm text-slate-500 sm:text-base"><CountUp value={requestCount} /> requests across <CountUp value={collectionCount} /> collections{undocumentedCount > 0 && <><span> · </span><span className="font-semibold text-amber-700"><CountUp value={undocumentedCount} /> still need a description</span></>}</p></div>
      <EnvironmentPill workspaceId={workspaceId} environments={environments} activeEnvironmentId={activeEnvironmentId} />
    </header>
    <form className="flex min-h-[58px] items-center gap-3 overflow-hidden rounded-2xl bg-slate-950 px-4 text-sm shadow-lg shadow-slate-950/10" onSubmit={importCurl}>
      <span aria-hidden="true" className="font-mono font-bold text-indigo-400">›</span><input value={curlText} onChange={(event) => setCurlText(event.target.value)} aria-label="Paste a cURL command or URL" placeholder={'curl -X POST https://api.shop.dev/v1/orders -H "Authorization: Bearer {{token}}" …'} className="min-w-0 flex-1 bg-transparent font-mono text-slate-300 outline-none placeholder:text-slate-500" /><span className="hidden whitespace-nowrap text-slate-400 xl:block">Paste a cURL or URL — we&apos;ll build the request</span><kbd className="hidden items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-300 sm:inline-flex"><FiCommand /> V</kbd>
    </form>
  </>;
}
