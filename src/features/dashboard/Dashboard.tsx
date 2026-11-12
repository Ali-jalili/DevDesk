/** @format */

import useWorkspaceSnapshot from "./useWorkspaceSnapshot";
import DashboardSkeleton from "./DashboardSkeleton";
import useAuth from "@/app/context/useAuth";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiFolder,
  FiGlobe,
  FiSend,
} from "react-icons/fi";

export default function Dashboard() {
  const {
    data: workspace,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useWorkspaceSnapshot();
  const { user } = useAuth();

  const userName = user?.user_metadata?.name || "there";

  if (workspaceError) {
    return (
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6"
        >
          <h1 className="text-lg font-semibold text-red-700">
            Failed to load your workspace
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {workspaceError instanceof Error
              ? workspaceError.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </main>
    );
  }

  if (workspaceLoading) {
    return <DashboardSkeleton />;
  }

  const readiness = workspace
    ? [
        { label: "Workspace created", complete: true },
        { label: "Collection added", complete: workspace.collections > 0 },
        { label: "Request documented", complete: workspace.requests > 0 },
        {
          label: "Environment configured",
          complete: workspace.environments > 0,
        },
      ]
    : [];
  const completed = readiness.filter((item) => item.complete).length;
  let nextAction = null;

  if (workspace?.collections === 0) {
    nextAction = {
      label: "Create your first collection",
      to: `/app/workspaces/${workspace.id}/collections`,
    };
  } else if (workspace?.requests === 0) {
    nextAction = {
      label: "Add your first API request",
      to: `/app/workspaces/${workspace.id}/collections`,
    };
  } else if (workspace?.environments === 0) {
    nextAction = {
      label: "Configure an environment",
      to: `/app/workspaces/${workspace.id}/environments`,
    };
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            DevDesk / workspace console
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Welcome back, {userName}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Continue managing your API workflows.
          </p>
        </div>
        <span className="hidden text-xs font-medium text-slate-400 sm:block">
          {workspace ? "Workspace context loaded" : "Ready to begin"}
        </span>
      </header>

      <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.5fr_0.5fr]">
        <div className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Continue working
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                {workspace?.name ?? "Create your first workspace"}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                {workspace
                  ? "Your active API workspace, ready for the next piece of work."
                  : "Start organizing collections, requests, and environments in one place."}
              </p>
              {workspace && (
                <p className="mt-4 text-xs font-medium text-slate-400">
                  Last activity: {workspace.lastActivity ?? "No activity yet"}
                </p>
              )}
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FiSend className="h-5 w-5" />
            </span>
          </div>

          <Link
            to={
              workspace
                ? `/app/workspaces/${workspace.id}`
                : "/app/workspaces/new"
            }
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {workspace ? "Open Workspace" : "Create Workspace"}
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
          {workspace ? (
            [
              {
                label: "Collections",
                value: workspace.collections,
                icon: FiFolder,
              },
              { label: "Requests", value: workspace.requests, icon: FiSend },
              {
                label: "Environments",
                value: workspace.environments,
                icon: FiGlobe,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col justify-center gap-1 p-4 sm:p-5"
                >
                  <Icon className="h-4 w-4 text-indigo-600" />
                  <strong className="text-xl text-slate-950">
                    {item.value}
                  </strong>
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 flex items-center justify-center p-6 text-center lg:col-span-1">
              <p className="text-sm leading-6 text-slate-500">
                No workspace context yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Workspace readiness
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-950">
                {workspace
                  ? `${completed}/4 foundations ready`
                  : "No workspace yet"}
              </h2>
            </div>
            {workspace && (
              <span className="text-xs text-slate-400">{completed}/4</span>
            )}
          </div>
          {workspace ? (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {readiness.map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${item.complete ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}
                  >
                    {item.complete ? (
                      <FiCheck className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <p className="mt-3 text-xs leading-4 text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Create a workspace to see its real setup status.
            </p>
          )}
        </section>

        {workspace && (
          <section className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Next action
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-950">
              {nextAction?.label ?? "Your workspace is ready"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {nextAction
                ? "A focused next step keeps your API workflow moving."
                : "Everything needed for a documented workflow is in place."}
            </p>
            {nextAction && (
              <Link
                to={nextAction.to}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Continue <FiArrowRight className="h-4 w-4" />
              </Link>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
