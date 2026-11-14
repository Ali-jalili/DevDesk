/**
 * @format
 */

import toast from "react-hot-toast";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import {
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiGitMerge,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { useEffect, useRef } from "react";

import useAuth from "@/app/context/useAuth";
import WorkspaceSidebarNav from "./WorkspaceSidebarNav";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const navigation = [
  {
    label: "Atlas",
    to: "/app/atlas",
    icon: FiGitMerge,
  },
  {
    label: "Workspaces",
    to: "/app/workspaces",
    icon: FiBriefcase,
  },
];

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onClose,
}: SidebarProps) {
  const { user, handleSignOut } = useAuth();

  const { workspaceId } = useParams<{
    workspaceId?: string;
  }>();

  const userName = user?.user_metadata?.name || "User";
  const avatar = userName.charAt(0).toUpperCase();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management: when mobile drawer opens, focus the close button so
  // keyboard users don't get stranded on the menu toggle that opened it.
  useEffect(() => {
    if (mobileOpen) {
      closeButtonRef.current?.focus();
    }
  }, [mobileOpen]);

  // ESC closes the mobile drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen, onClose]);

  async function logoutHandler() {
    try {
      setIsLoggingOut(true);
      await handleSignOut();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-slate-950/30
            backdrop-blur-[2px]
            md:hidden
          "
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed left-0 top-16 z-50
          h-[calc(100vh-64px)]
          border-r border-slate-200/80
          bg-white

          w-72
          transition-all duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          md:sticky md:z-30 md:translate-x-0
          ${collapsed ? "md:w-[69px]" : "md:w-60"}
        `}
      >
        <div className="flex h-full flex-col p-3">
          <div className="mb-3 flex justify-end md:hidden">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="
                rounded-lg p-2
                text-slate-500
                transition
                hover:bg-slate-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40
              "
              aria-label="Close navigation"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Global navigation */}
          <nav aria-label="Global navigation" className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/app/atlas"}
                  onClick={onClose}
                  aria-label={collapsed ? item.label : undefined}
                  className={({ isActive }) => `
          flex items-center
          rounded-lg
          px-3 py-2.5
          text-sm font-medium
          transition

          ${collapsed ? "md:justify-center" : ""}

          ${
            isActive
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }
        `}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />

                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              );
            })}

            {/* Workspace-scoped navigation (CSS-only transition, no state) */}
            <div
              className={`
                overflow-hidden border-t border-slate-200 pt-4
                transition-[max-height,opacity] duration-300 ease-in-out
                ${
                  workspaceId && !collapsed
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              {!collapsed && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Workspace
                </p>
              )}
              {workspaceId && (
                <WorkspaceSidebarNav key={workspaceId} onClose={onClose} />
              )}
            </div>
          </nav>
          <div className="mt-auto space-y-3">
            <div
              className={`
              block
    rounded-2xl
    border border-slate-200
    bg-white
    p-3
    transition
    ${collapsed ? "md:p-2" : ""}
  `}
            >
              <div
                className={`
      flex items-center gap-3
      ${collapsed ? "md:justify-center" : ""}
    `}
              >
                {/* Avatar */}
                <div
                  className="
        flex h-9 w-9 shrink-0
        items-center justify-center
        rounded-full
        bg-indigo-50
        text-sm font-bold
        text-indigo-600
        ring-1 ring-indigo-100
      "
                >
                  {avatar}
                </div>

                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-400">
                      Account
                    </p>

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {userName}
                    </p>
                  </div>
                )}
              </div>

              {!collapsed && (
                <button
                  type="button"
                  onClick={logoutHandler}
                  disabled={isLoggingOut}
                  className="
        mt-3
        flex w-full items-center justify-center gap-2
        rounded-lg
        border border-slate-200
        px-3 py-2
        text-sm font-medium
        text-slate-600
        transition

        hover:border-red-200
        hover:bg-red-50
        hover:text-red-600

        disabled:opacity-60
      "
                >
                  <FiLogOut className="h-4 w-4" />

                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              )}
            </div>

            <div className="block border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={onToggle}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={`
                  hidden
                  w-full items-center
                  rounded-lg
                  px-3 py-2.5
                  text-sm font-medium
                  text-slate-500
                  transition
                  hover:bg-slate-50
                  hover:text-slate-950
                  md:flex

                  ${collapsed ? "md:justify-center" : ""}
                `}
              >
                {collapsed ? (
                  <FiChevronRight className="h-5 w-5" />
                ) : (
                  <>
                    <FiChevronLeft className="h-5 w-5" />

                    <span className="ml-3">Collapse</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
