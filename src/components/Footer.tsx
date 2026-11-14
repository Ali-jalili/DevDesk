/** @format */

import { NavLink } from "react-router-dom";
import { FiCode, FiGithub } from "react-icons/fi";

import useAuth from "@/app/context/useAuth";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="relative border-t border-slate-200/80 bg-white dark:border-white/5 dark:bg-slate-950">
      {/* Top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr] md:items-start">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
                <FiCode className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                  DevDesk
                </span>
                <span className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">
                  API Workspace
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
              A focused workspace for organizing your API workflow, requests,
              collections, and environments.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              Product
            </h3>
            <nav className="mt-4 flex flex-col gap-3">
              <a
                href="#features"
                className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Features
              </a>
              <NavLink
                to={user ? "/app/atlas" : "/signup"}
                className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                {user ? "Open dashboard" : "Get started"}
              </NavLink>
            </nav>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              Project
            </h3>
            <nav className="mt-4 flex flex-col gap-3">
              <a
                href="https://github.com/Ali-jalili/Devdesk"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <FiGithub className="h-4 w-4 transition group-hover:scale-110" />
                GitHub
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200/80 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <p>© {new Date().getFullYear()} DevDesk</p>
          <p>Built for developers.</p>
        </div>
      </div>
    </footer>
  );
}
