/** @format */

import { NavLink, useParams } from "react-router-dom";
import { FiBriefcase, FiCode, FiMenu, FiZap } from "react-icons/fi";

import useAuth from "@/app/context/useAuth";
import useActiveWorkspace from "@/features/workspaces/hooks/useActiveWorkspace";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { workspace } = useActiveWorkspace();
  const { workspaceId: currentWorkspaceId } = useParams<{
    workspaceId?: string;
  }>();

  // Prefer the workspace the user is viewing right now, else the last active.
  const activeName =
    (currentWorkspaceId ? workspace?.name : undefined) ?? workspace?.name;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Left — brand + mobile menu toggle */}
        <div className="flex min-w-0 items-center gap-2.5">
          {user && (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 md:hidden"
              aria-label="Open navigation"
            >
              <FiMenu className="h-5 w-5" />
            </button>
          )}

          <NavLink
            to={user ? "/app/dashboard" : "/"}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition group-hover:scale-105">
              <FiCode className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                DevDesk
              </span>
              <span className="mt-0.5 hidden text-[11px] font-medium tracking-wide text-slate-400 min-[380px]:block">
                API Workspace
              </span>
            </div>
          </NavLink>
        </div>

        {/* Right */}
        {!user ? (
          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  isActive
                    ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
                }`
              }
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 sm:px-4 sm:text-sm"
            >
              <FiZap className="hidden h-3.5 w-3.5 sm:block" />
              <span className="sm:hidden">Sign up</span>
              <span className="hidden sm:inline">Get started</span>
            </NavLink>
          </nav>
        ) : (
          /* Context-aware active-workspace chip — replaces the duplicate avatar. */
          <div className="flex shrink-0 items-center">
            {activeName ? (
              <NavLink
                to={`/app/workspaces/${currentWorkspaceId ?? workspace?.id}`}
                className="group flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 py-1 pl-1 pr-3 shadow-sm transition hover:border-indigo-300 hover:shadow dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-500/40"
              >
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <FiBriefcase className="h-3.5 w-3.5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Active
                  </span>
                  <span className="max-w-[7rem] truncate text-sm font-semibold text-slate-800 sm:max-w-[10rem] dark:text-slate-100">
                    {activeName}
                  </span>
                </span>
              </NavLink>
            ) : (
              <NavLink
                to="/app/workspaces/new"
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                <FiBriefcase className="h-3.5 w-3.5" />
                No workspace yet
              </NavLink>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
