/** @format */

import type { ReactNode } from "react";
import { FiCode, FiLogIn, FiUserPlus } from "react-icons/fi";

interface AuthShellProps {
  mode: "login" | "signup";
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function AuthShell({
  mode,
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  const isLogin = mode === "login";
  const ModeIcon = isLogin ? FiLogIn : FiUserPlus;

  return (
    <main className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#f6f7fb] px-4 py-12 dark:bg-slate-950 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-64 left-1/2 h-[38rem] w-[58rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/70 via-violet-100/50 to-transparent blur-3xl dark:from-indigo-900/30 dark:via-violet-950/20" />
        <div className="absolute -bottom-64 -right-48 h-[34rem] w-[34rem] rounded-full bg-fuchsia-200/25 blur-3xl dark:bg-fuchsia-900/10" />
      </div>

      <section className="relative w-full max-w-[28rem] overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/95 shadow-[0_28px_90px_-38px_rgba(30,41,59,0.32)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

        <div className="p-6 sm:p-9">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20">
              <FiCode className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight text-slate-950 dark:text-white">
                DevDesk
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                API workspace
              </span>
            </span>
          </div>

          <div className="mb-7">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <ModeIcon className="h-4 w-4" />
              {isLogin ? "Welcome back" : "Create your account"}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[1.8rem]">
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
      </section>
    </main>
  );
}
