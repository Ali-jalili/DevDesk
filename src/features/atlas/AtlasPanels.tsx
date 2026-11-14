/** @format */

import { Link } from "react-router-dom";
import { FiChevronRight, FiPlus, FiSquare } from "react-icons/fi";
import type { AtlasEnvironment, AtlasLine, RecentRequest } from "./types";
import { getMethodColor } from "./methodColors";

function relativeTime(value: string) {
  const days = Math.floor((Date.now() - Date.parse(value)) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? "month" : "months"} ago`;
}

export function RecentRequests({ requests, workspaceId }: { requests: RecentRequest[]; workspaceId: string }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-base font-bold text-slate-900">Recently added</h2><p className="mt-1 text-sm text-slate-500">Your latest requests</p>
    {requests.length ? <ul className="mt-4 divide-y divide-slate-100">{requests.map((request) => { const color = getMethodColor(request.method); return <li key={request.id}><Link to={`/app/workspaces/${workspaceId}/collections/${request.collectionId}/requests/${request.id}`} className="flex min-h-[66px] items-center gap-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"><span className="rounded-lg px-2.5 py-1 text-[11px] font-bold" style={{ color: color.text, background: color.light }}>{request.method}</span><span className="min-w-0 flex-1"><b className="block truncate font-mono text-sm font-medium text-slate-800">{request.path}</b><span className="block truncate text-xs text-slate-400">{request.collectionName} · {relativeTime(request.createdAt)}</span></span><FiChevronRight className="shrink-0 text-slate-300" /></Link></li>; })}</ul> : <p className="mt-5 text-sm text-slate-500">No requests yet. Add the first stop to your API map.</p>}
  </section>;
}

export function AttentionList({ undocumented, emptyLines, environments, workspaceId, coverage, requestCount }: { undocumented: RecentRequest[]; emptyLines: AtlasLine[]; environments: AtlasEnvironment[]; workspaceId: string; coverage: number; requestCount: number }) {
  const zeroEnvironment = environments.find((environment) => environment.variableCount === 0);
  const actions = [
    ...(undocumented[0] ? [{ label: `${undocumented.length} ${undocumented.length === 1 ? "request has" : "requests have"} no description`, action: "Review", to: `/app/workspaces/${workspaceId}/collections/${undocumented[0].collectionId}/requests/${undocumented[0].id}`, icon: "◌" }] : []),
    ...(emptyLines[0] ? [{ label: `${emptyLines[0].name || "Collection"} has no requests`, action: "Add one", to: `/app/workspaces/${workspaceId}/collections/${emptyLines[0].id}`, icon: "□" }] : []),
    ...(zeroEnvironment ? [{ label: `${zeroEnvironment.name} has no variables`, action: "Open", to: `/app/workspaces/${workspaceId}/environments/${zeroEnvironment.id}`, icon: "{}" }] : []),
  ].slice(0, 3);
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-base font-bold text-slate-900">Needs attention</h2>
    <div className="mt-4"><div className="flex justify-between gap-3 text-sm"><span className="font-semibold text-slate-600">Documentation coverage</span><span className="text-slate-400">{requestCount - undocumented.length} of {requestCount} requests</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-[width] duration-700" style={{ width: `${coverage}%` }} /></div></div>
    {actions.length ? <ul className="mt-2 divide-y divide-slate-100">{actions.map((item) => <li key={item.label}><Link to={item.to} className="flex min-h-[58px] items-center gap-3 py-2 text-sm text-slate-600 hover:text-indigo-600"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-slate-500">{item.icon}</span><span className="min-w-0 flex-1">{item.label}</span><span className="shrink-0 text-xs font-semibold text-indigo-600">{item.action}</span></Link></li>)}</ul> : <p className="mt-4 border-t border-slate-100 pt-4 text-sm font-medium text-emerald-700">Everything is documented</p>}
  </section>;
}

export function AtlasEmpty({ noWorkspace }: { noWorkspace: boolean }) {
  return <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><FiSquare /></span><h2 className="mt-4 text-lg font-bold text-slate-900">{noWorkspace ? "Create your first workspace" : "Your API map is ready"}</h2><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{noWorkspace ? "A workspace gives your collections and environments a home." : "Start with a collection, then add requests as stations on your map."}</p><Link to={noWorkspace ? "/app/workspaces/new" : "/app/workspaces"} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">{noWorkspace ? "Create workspace" : "Browse workspaces"}<FiPlus /></Link></section>;
}
