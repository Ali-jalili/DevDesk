/** @format */

import { useState } from "react";
import { FiBriefcase, FiChevronDown } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateWorkspaceEnvironment from "@/features/workspaces/hooks/useUpdateWorkspaceEnvironment";
import type { AtlasEnvironment } from "./types";

export default function EnvironmentPill({ workspaceId, environments, activeEnvironmentId }: { workspaceId: string; environments: AtlasEnvironment[]; activeEnvironmentId: string | null }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateWorkspaceEnvironment();
  const active = environments.find((environment) => environment.id === activeEnvironmentId);
  const update = (environmentId: string | null) => mutate({ workspaceId, environmentId }, { onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["atlas", workspaceId] }); setOpen(false); } });
  return <div className="relative w-full sm:w-auto">
    <button type="button" aria-expanded={open} aria-haspopup="listbox" disabled={isPending} onClick={() => setOpen((value) => !value)} className="flex min-h-[54px] w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition hover:border-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:min-w-60 sm:w-auto"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><FiBriefcase /></span><span className="min-w-0 flex-1"><span className="block text-[10px] font-bold tracking-[.12em] text-slate-400">ENVIRONMENT</span><span className="block truncate text-sm font-semibold text-slate-800">{active?.name ?? "Select environment"}<span className="font-normal text-slate-400"> · {active?.variableCount ?? 0} variables</span></span></span><FiChevronDown className="text-slate-400" /></button>
    {open && <><button aria-label="Close environments" className="fixed inset-0 z-20 cursor-default" onClick={() => setOpen(false)} /><div role="listbox" aria-label="Choose environment" className="absolute right-0 top-full z-30 mt-2 w-full min-w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">{environments.map((environment) => <button role="option" aria-selected={activeEnvironmentId === environment.id} key={environment.id} type="button" onClick={() => update(environment.id)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-indigo-50"><span className="font-medium text-slate-700">{environment.name}</span><span className="text-xs text-slate-400">{environment.variableCount} variables</span></button>)}{activeEnvironmentId && <button type="button" onClick={() => update(null)} className="w-full rounded-lg border-t border-slate-100 px-3 py-2.5 text-left text-sm text-slate-500 hover:bg-slate-50">No active environment</button>}</div></>}
  </div>;
}
