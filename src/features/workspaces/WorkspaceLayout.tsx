/** @format */

import { useEffect, useState } from "react";

import { Outlet, useParams } from "react-router-dom";

import { FiEdit3, FiGlobe } from "react-icons/fi";

import useWorkspaceDetails from "./hooks/useWorkspaceDetails";
import useUpdateWorkspaceEnvironment from "./hooks/useUpdateWorkspaceEnvironment";
import useGetEnvironments from "@/features/environments/hooks/useGetEnvironments";

import Loading from "@/ui/Loading";
import ErrorMessage from "@/components/ErrorMessage";

import EditWorkspaceModal from "./EditWorkspaceModal";
import useAuth from "@/app/context/useAuth";

export default function WorkspaceLayout() {
  const { user } = useAuth();

  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, error } = useWorkspaceDetails(workspaceId);

  const { data: environments } = useGetEnvironments(workspaceId);

  useEffect(() => {
    if (user?.id && workspaceId) {
      const lastWorkspaceKey = `devdesk:last-workspace:${user.id}`;
      localStorage.setItem(lastWorkspaceKey, workspaceId);
      window.dispatchEvent(new Event("devdesk:last-workspace-changed"));
    }
  }, [user?.id, workspaceId]);

  const { mutate: updateEnvironment, isPending: isUpdatingEnvironment } =
    useUpdateWorkspaceEnvironment();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!data || !workspaceId) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Workspace Header */}
        <section className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Workspace
                </span>
              </div>

              <h1 className="truncate text-3xl font-bold tracking-tight text-slate-950">
                {data.name}
              </h1>

              {data.description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {data.description}
                </p>
              )}

              {/* Environment Switch */}
              {environments && environments.length > 0 && (
                <div className="mt-5 max-w-sm rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <FiGlobe className="h-4 w-4" />
                    </span>

                    <div>
                      <label
                        htmlFor="environment-switch"
                        className="block text-sm font-semibold text-slate-800"
                      >
                        Active environment
                      </label>

                      <p className="text-xs text-slate-400">
                        Choose the configuration for this workspace
                      </p>
                    </div>
                  </div>

                  <select
                    id="environment-switch"
                    value={data.active_environment_id ?? ""}
                    disabled={isUpdatingEnvironment}
                    onChange={(e) =>
                      updateEnvironment({
                        workspaceId,
                        environmentId: e.target.value || null,
                      })
                    }
                    className="
                      mt-3
                      w-full
                      rounded-lg
                      border border-slate-200
                      bg-slate-50
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-700
                      outline-none
                      transition
                      focus:border-indigo-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <option value="">Select environment</option>

                    {environments.map((environment) => (
                      <option key={environment.id} value={environment.id}>
                        {environment.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                hover:text-slate-950
              "
            >
              <FiEdit3 className="h-4 w-4" />
              Edit
            </button>
          </div>
        </section>

        {/* Current Page */}

        <div className="mt-8">
          <Outlet />
        </div>

        {isEditModalOpen && (
          <EditWorkspaceModal
            workspaceId={workspaceId}
            name={data.name ?? "Untitled workspace"}
            description={data.description ?? ""}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </div>
    </main>
  );
}
