/** @format */

import type { ReactNode } from "react";
import {
  FiArrowDownRight,
  FiCode,
  FiFolder,
  FiGlobe,
  FiLayers,
  FiSend,
} from "react-icons/fi";

interface AuthShellProps {
  mode: "login" | "signup";
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
}

const productAreas = [
  { label: "Workspaces", icon: FiLayers },
  { label: "Collections", icon: FiFolder },
  { label: "Requests", icon: FiSend },
  { label: "Environments", icon: FiGlobe },
];

export default function AuthShell({
  mode,
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <main className="relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-[#f6f7fc] px-4 py-8 dark:bg-slate-950 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-52 left-1/2 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/60 via-violet-100/50 to-transparent blur-3xl dark:from-indigo-900/30 dark:via-violet-950/20" />
        <div className="absolute -bottom-48 -right-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-200/25 blur-3xl dark:bg-fuchsia-900/10" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:min-h-[min(720px,calc(100vh-160px))] lg:grid-cols-[1fr_0.92fr] lg:gap-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#10152d] p-7 text-white shadow-2xl shadow-indigo-950/15 sm:p-10 lg:min-h-[610px] lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg shadow-indigo-950/30">
              <FiCode className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight">
                DevDesk
              </span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-200/70">
                API workspace
              </span>
            </span>
          </div>

          <div className="relative mt-10 max-w-lg sm:mt-14">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              <span className="h-px w-6 bg-indigo-400" />
              {isLogin ? "Pick up where you left off" : "Start with a workspace"}
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-[2.8rem]">
              Keep your API work
              <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                in one place.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              Organize workspaces, group requests into collections, and use
              environment variables when a request needs them.
            </p>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10 backdrop-blur sm:mt-10 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Example structure
              </span>
              <span className="rounded-full border border-indigo-300/20 bg-indigo-300/10 px-2.5 py-1 text-[9px] font-semibold text-indigo-200">
                Sample only
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-400/15 text-indigo-200">
                <FiLayers className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-medium uppercase tracking-wider text-slate-400">
                  Workspace
                </span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-white">
                  Store API
                </span>
              </span>
              <FiArrowDownRight className="h-4 w-4 text-indigo-300/70" />
              <span className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-200">
                Catalog
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                <FiSend className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-medium uppercase tracking-wider text-slate-400">
                  Example request
                </span>
                <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-100">
                  GET /api/products
                </span>
              </span>
              <span className="rounded-md bg-emerald-400/10 px-2 py-1 font-mono text-[9px] font-semibold text-emerald-300">
                GET
              </span>
            </div>

            <p className="mt-3 text-[10px] leading-5 text-slate-400">
              Illustrative example; it is not account data and sends no request.
            </p>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-4">
            {productAreas.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-2.5 py-2.5 text-[10px] font-medium text-slate-300"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-indigo-300" />
                {label}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[30rem]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 sm:p-9">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                {isLogin ? "Account access" : "Create account"}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>

            {children}

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-white/10">
              {footer}
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-slate-400 dark:text-slate-500">
            {isLogin
              ? "Sign in to continue to your workspace."
              : "After signing up, you can create a workspace from your dashboard."}
          </p>
        </section>
      </div>
    </main>
  );
}
