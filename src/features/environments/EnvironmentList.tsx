/** @format */

import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiGlobe } from "react-icons/fi";

import EnvironmentDeleteButton from "./EnvironmentDeleteButton";
import type { EnvironmentRecord } from "@/types/database";

interface EnvironmentListProps {
  data: EnvironmentRecord[];
}

export default function EnvironmentList({ data }: EnvironmentListProps) {
  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FiGlobe className="h-6 w-6" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900">
            No environments yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Create an environment to manage API configurations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <article
          key={item.id}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FiGlobe className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-950">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400">Environment</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Manage environment variables and API configurations.
          </p>

          <p className="mt-4 text-xs text-slate-400">
            Created {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Unknown"}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/app/workspaces/${item.workspace_id}/environments/${item.id}`,
                )
              }
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Open
              <FiArrowRight className="h-4 w-4" />
            </button>

            <EnvironmentDeleteButton environmentId={item.id} />
          </div>
        </article>
      ))}
    </div>
  );
}
