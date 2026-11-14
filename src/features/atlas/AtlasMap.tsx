/** @format */

import { useEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent, MutableRefObject, MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiFolder, FiPlus } from "react-icons/fi";
import type { AtlasLine, AtlasRequest } from "./types";
import { getMethod, getMethodColor, METHOD_ORDER } from "./methodColors";
import { selectAtlasStats } from "./atlasSelectors";

function relativeAge(createdAt: string) {
  const days = Math.max(0, Math.floor((Date.now() - Date.parse(createdAt)) / 86_400_000));
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-days, "day");
}

interface Props {
  lines: AtlasLine[];
  workspaceId: string;
  filter: string | null;
  onFilter: (method: string | null) => void;
}

function Station({ request, workspaceId, lineId, dimmed, latest, reduceMotion, stationRef, onKeyDown }: {
  request: AtlasRequest; workspaceId: string; lineId: string; dimmed: boolean; latest: boolean; reduceMotion: boolean;
  stationRef: (element: HTMLAnchorElement | null) => void; onKeyDown: (event: ReactKeyboardEvent<HTMLAnchorElement>) => void;
}) {
  const method = getMethod(request.method);
  const color = getMethodColor(request.method);
  const path = request.url || "/";
  const hasDescription = !!request.description?.trim();
  const [age, setAge] = useState("recently");
  const [tooltip, setTooltip] = useState<{ left: number; top: number; below: boolean } | null>(null);
  const showTooltip = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const below = rect.top < 200;
    setTooltip({ left: Math.max(8, Math.min(window.innerWidth - 272, rect.left + rect.width / 2 - 128)), top: below ? rect.bottom : rect.top, below });
  };
  const handleMouseEnter = (event: ReactMouseEvent<HTMLAnchorElement>) => showTooltip(event.currentTarget);
  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => showTooltip(event.currentTarget);
  useEffect(() => {
    const timeout = window.setTimeout(() => setAge(relativeAge(request.created_at)), 0);
    return () => window.clearTimeout(timeout);
  }, [request.created_at]);
  const count = (value: Record<string, string> | null) => Object.keys(value ?? {}).length;
  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 24 }}>
    <Link
      ref={stationRef}
      onKeyDown={onKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setTooltip(null)}
      onFocus={handleFocus}
      onBlur={() => setTooltip(null)}
      onClick={(event) => { if (window.matchMedia("(max-width: 767px)").matches) { event.preventDefault(); window.dispatchEvent(new CustomEvent("atlas:station", { detail: { request, lineId } })); } }}
      to={`/app/workspaces/${workspaceId}/collections/${lineId}/requests/${request.id}`}
      aria-label={`${method} ${path}${hasDescription ? "" : ", no description"}`}
      title={path}
      className="group relative flex min-h-24 min-w-[104px] shrink-0 flex-col items-center px-2 pt-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg"
      style={{ opacity: dimmed ? 0.25 : 1, transition: "opacity 180ms ease" }}
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className={`absolute inset-0 rounded-full border-2 ${hasDescription ? "border-transparent" : "border-dashed"}`} style={{ borderColor: hasDescription ? "transparent" : color.color }} />
        {latest && <motion.span aria-hidden="true" className="absolute inset-0 rounded-full border" style={{ borderColor: color.color }} animate={reduceMotion ? undefined : { scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />}
        <span className="h-5 w-5 rounded-full border-[3px] border-white shadow-[0_1px_4px_rgba(15,23,42,.22)]" style={{ backgroundColor: color.color }} />
      </span>
      <span className="mt-1 text-[11px] font-bold tracking-wide" style={{ color: color.color }}>{method}</span>
      <span className="max-w-32 truncate font-mono text-xs text-slate-600" title={path}>{path}</span>
      <AnimatePresence>{tooltip && <motion.span initial={{ opacity: 0, scale: 0.97, y: tooltip.below ? -4 : 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ type: "spring", stiffness: 420, damping: 30 }} style={{ position: "fixed", left: tooltip.left, top: tooltip.top, translate: tooltip.below ? "0 10px" : "0 calc(-100% - 10px)" }} className="pointer-events-none z-[90] hidden w-64 origin-bottom rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl md:block">
        <span className="flex items-center gap-2"><b className="rounded-md px-2 py-1 text-[11px]" style={{ color: color.text, backgroundColor: color.light }}>{method}</b><b className="truncate font-mono text-sm text-slate-800">{path}</b></span>
        <span className="mt-2 block text-xs text-slate-500">{request.description || "No description yet. Add one"}</span>
        <span className="mt-2 flex flex-wrap gap-1 text-[10px] text-emerald-700"><i className="rounded bg-emerald-50 px-1.5 py-1 not-italic">Headers {count(request.headers)}</i><i className="rounded bg-emerald-50 px-1.5 py-1 not-italic">Params {count(request.params)}</i>{request.body && <i className="rounded bg-emerald-50 px-1.5 py-1 not-italic">Body</i>}</span>
        <span className="mt-2 flex items-center justify-between text-[11px] text-slate-400"><span>Added {age}</span><span className="font-semibold text-indigo-600">Open →</span></span>
      </motion.span>}</AnimatePresence>
    </Link></motion.div>
  );
}

function LineRow({ line, workspaceId, filter, index, reduceMotion, stationRefs, stationOffset }: { line: AtlasLine; workspaceId: string; filter: string | null; index: number; reduceMotion: boolean; stationRefs: MutableRefObject<(HTMLAnchorElement | null)[]>; stationOffset: number }) {
  const railRef = useRef<HTMLDivElement>(null);
  const last = useMemo(() => line.requests.reduce<AtlasRequest | null>((latest, request) => !latest || request.created_at > latest.created_at ? request : latest, null), [line.requests]);
  const filtered = filter === "NO_DESCRIPTION" ? (request: AtlasRequest) => !!request.description?.trim() : (request: AtlasRequest) => !filter || getMethod(request.method) !== filter;
  const lineDimmed = !!filter && !line.requests.some((request) => !filtered(request));
  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: lineDimmed ? 0.25 : 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.06, opacity: { duration: 0.18 } }} className="grid gap-2 border-b border-slate-100 py-3 last:border-0 md:grid-cols-[160px_minmax(0,1fr)] md:items-start md:gap-4">
      <Link to={`/app/workspaces/${workspaceId}/collections/${line.id}`} className="flex min-h-10 items-center gap-3 rounded-lg text-left hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><FiFolder /></span>
        <span className="min-w-0"><b className="block truncate text-sm text-slate-800">{line.name || "Untitled collection"}</b><span className="text-xs text-slate-400">{line.requests.length} requests</span></span>
      </Link>
      <div className="group/rail relative min-w-0">
        <motion.div initial={reduceMotion ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : index * 0.06, ease: "easeOut" }} style={{ transformOrigin: "left" }} className="pointer-events-none absolute left-0 right-0 top-5 h-2 rounded-full bg-slate-200 md:left-2" />
        {line.requests.length > 6 && <><span className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-5 bg-gradient-to-r from-white to-transparent"/><span className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-5 bg-gradient-to-l from-white to-transparent"/><button type="button" aria-label={`Scroll ${line.name} requests left`} onClick={() => railRef.current?.scrollBy({ left: -360, behavior: "smooth" })} className="absolute left-0 top-2 z-30 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-sm hover:text-indigo-600 group-hover/rail:flex focus-visible:flex"><FiChevronLeft /></button><button type="button" aria-label={`Scroll ${line.name} requests right`} onClick={() => railRef.current?.scrollBy({ left: 360, behavior: "smooth" })} className="absolute right-0 top-2 z-30 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-sm hover:text-indigo-600 group-hover/rail:flex focus-visible:flex"><FiChevronRight /></button></>}
        <div ref={railRef} className="relative flex snap-x snap-mandatory gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:thin] md:gap-2">
          {line.requests.map((request, stationIndex) => <Station key={request.id} request={request} workspaceId={workspaceId} lineId={line.id} dimmed={filtered(request)} latest={request.id === last?.id} reduceMotion={reduceMotion} stationRef={(element) => { stationRefs.current[stationOffset + stationIndex] = element; }} onKeyDown={(event) => { const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0; if (!direction) return; event.preventDefault(); stationRefs.current[stationOffset + stationIndex + direction]?.focus(); }} />)}
          <Link to={`/app/workspaces/${workspaceId}/collections/${line.id}`} aria-label={`Add request to ${line.name}`} className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-slate-400 hover:border-indigo-400 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"><FiPlus /></Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function AtlasMap({ lines, workspaceId, filter, onFilter }: Props) {
  const reduceMotion = !!useReducedMotion();
  const stationRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [selectedStation, setSelectedStation] = useState<{ request: AtlasRequest; lineId: string } | null>(null);
  useEffect(() => {
    const open = (event: Event) => setSelectedStation((event as CustomEvent<{ request: AtlasRequest; lineId: string }>).detail);
    window.addEventListener("atlas:station", open);
    return () => window.removeEventListener("atlas:station", open);
  }, []);
  const stats = selectAtlasStats(lines);
  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-900">Your API, mapped</h2><p className="mt-1 text-sm text-slate-500">Each line is a collection. Each stop is a request, in the order you built them.</p></div><Link to={`/app/workspaces/${workspaceId}/collections`} className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">+ New collection</Link></div>
      <div className="mt-4">{lines.slice(0, 6).map((line, index) => <LineRow key={line.id} line={line} workspaceId={workspaceId} filter={filter} index={index} reduceMotion={reduceMotion} stationRefs={stationRefs} stationOffset={lines.slice(0, index).reduce((sum, item) => sum + item.requests.length, 0)} />)}</div>
      {lines.length > 6 && <details className="group mt-2"><summary className="cursor-pointer list-none py-2 text-sm font-semibold text-indigo-600">Show all {lines.length} lines</summary><div>{lines.slice(6).map((line, index) => <LineRow key={line.id} line={line} workspaceId={workspaceId} filter={filter} index={index + 6} reduceMotion={reduceMotion} stationRefs={stationRefs} stationOffset={lines.slice(0, index + 6).reduce((sum, item) => sum + item.requests.length, 0)} />)}</div></details>}
      {lines.length === 0 && <div className="my-8 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center"><p className="font-medium text-slate-700">Your API map is ready for its first line.</p><Link to={`/app/workspaces/${workspaceId}/collections`} className="mt-3 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Create a collection</Link></div>}
      <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-4" aria-label="Filter requests by method">
        {METHOD_ORDER.map((method) => { const color = getMethodColor(method); return <button key={method} type="button" aria-pressed={filter === method} onClick={() => onFilter(filter === method ? null : method)} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:border-indigo-300" style={{ borderColor: filter === method ? color.color : "#e2e8f0", color: color.text }}><i className="h-2.5 w-2.5 rounded-full" style={{ background: color.color }} />{method}<span className="text-slate-400">{stats.methods[method] ?? 0}</span></button>; })}
        <button type="button" aria-pressed={filter === "NO_DESCRIPTION"} onClick={() => onFilter(filter === "NO_DESCRIPTION" ? null : "NO_DESCRIPTION")} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-300">No description <span className="text-slate-400">{stats.undocumented.length}</span></button>
        <span className="ml-auto hidden self-center text-xs text-slate-400 sm:block">Click a method to focus the map</span>
      </div>
      <AnimatePresence>{filter && <motion.div className="sr-only" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">Map filtered by {filter}</motion.div>}</AnimatePresence>
      <AnimatePresence>{selectedStation && <motion.div className="fixed inset-0 z-[100] flex items-end bg-slate-950/40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStation(null)}><motion.section role="dialog" aria-modal="true" aria-label="Request details" initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} transition={{ type: "spring", damping: 28 }} onClick={(event) => event.stopPropagation()} className="w-full rounded-t-3xl bg-white p-5 pb-8 shadow-2xl"><div className="mb-4 flex items-center justify-between"><span className="h-1 w-10 rounded-full bg-slate-200"/><button autoFocus type="button" onClick={() => setSelectedStation(null)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500">Close</button></div><SheetDetails request={selectedStation.request} workspaceId={workspaceId} lineId={selectedStation.lineId} /></motion.section></motion.div>}</AnimatePresence>
    </section>
  );
}

function SheetDetails({ request, workspaceId, lineId }: { request: AtlasRequest; workspaceId: string; lineId: string }) {
  const method = getMethod(request.method);
  const color = getMethodColor(request.method);
  const path = request.url || "/";
  return <><span className="inline-flex rounded-md px-2.5 py-1 text-xs font-bold" style={{ color: color.text, background: color.light }}>{method}</span><h3 className="mt-3 break-all font-mono text-base font-bold text-slate-900">{path}</h3><p className="mt-2 text-sm text-slate-500">{request.description || "No description yet. Add one"}</p><div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-700"><span className="rounded-lg bg-emerald-50 px-2 py-1">Headers {Object.keys(request.headers ?? {}).length}</span><span className="rounded-lg bg-emerald-50 px-2 py-1">Params {Object.keys(request.params ?? {}).length}</span>{request.body && <span className="rounded-lg bg-emerald-50 px-2 py-1">Body</span>}</div><Link to={`/app/workspaces/${workspaceId}/collections/${lineId}/requests/${request.id}`} className="mt-5 flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white">Open request</Link></>;
}
