/** @format */

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiCode, FiLogOut, FiMenu, FiZap } from "react-icons/fi";

import useAuth from "@/app/context/useAuth";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, handleSignOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  const initials =
    user?.user_metadata?.name
      ?.split(" ")
      .map((part: string) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "D";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — brand + mobile menu toggle */}
        <div className="flex items-center gap-3">
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
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition group-hover:scale-105">
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
          </NavLink>
        </div>

        {/* Right — guest actions */}
        {!user ? (
          <nav className="flex items-center gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition sm:px-4 ${
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 sm:px-4"
            >
              <FiZap className="h-3.5 w-3.5" />
              Get started
            </NavLink>
          </nav>
        ) : (
          <div className="relative flex items-center gap-2" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-indigo-300 hover:shadow dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-500/40"
              aria-expanded={menuOpen}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden max-w-[10rem] truncate text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
                {user.user_metadata?.name || user.email}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900">
                <div className="border-b border-slate-100 p-4 dark:border-white/5">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user.user_metadata?.name || "DevDesk user"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>
                <div className="p-2">
                  <NavLink
                    to="/app/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    <FiZap className="h-4 w-4" />
                    Open dashboard
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void handleSignOut();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
