/** @format */

import Loading from "@/ui/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import useGetWorkspaces from "./hooks/useWorkspaces";

import { NavLink } from "react-router-dom";

import { FiArrowRight, FiBriefcase, FiPlus } from "react-icons/fi";

import { motion } from "framer-motion";

export default function Workspaces() {
  const { data, isLoading, error } = useGetWorkspaces();

  if (isLoading) return <Loading />;

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const hasWorkspaces = data && data.length > 0;

  return (
    <main
      className="
        min-h-[calc(100vh-4rem)]
        bg-slate-50
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        {/* Header */}

        <section
          className="
            mb-10
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                mb-2
                text-sm
                font-semibold
                text-indigo-600
              "
            >
              Your workspaces
            </p>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
              "
            >
              Workspaces
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              Manage your API projects, collections, requests, and environments
              from one place.
            </p>
          </div>

          <NavLink
            to="/app/workspaces/new"
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-4
              focus:ring-indigo-500/20
            "
          >
            <FiPlus className="h-4 w-4" />
            New Workspace
          </NavLink>
        </section>

        {/* Empty State */}

        {!hasWorkspaces ? (
          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              flex
              min-h-[420px]
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-6
              text-center
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-indigo-50
                text-indigo-600
              "
            >
              <FiBriefcase className="h-8 w-8" />
            </div>

            <h2
              className="
                mt-6
                text-xl
                font-semibold
                text-slate-900
              "
            >
              Create your first workspace
            </h2>

            <p
              className="
                mt-3
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              Workspaces help you organize API projects, collections, requests,
              and environments in a clean structure.
            </p>

            <NavLink
              to="/app/workspaces/new"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-indigo-700
              "
            >
              Create Workspace
              <FiArrowRight className="h-4 w-4" />
            </NavLink>
          </motion.section>
        ) : (
          /* Workspace Cards */

          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {data.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.06,
                }}
                whileHover={{
                  y: -4,
                }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:border-indigo-200
                  hover:shadow-md
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-lg
                    font-bold
                    text-indigo-600
                  "
                >
                  {(workspace.name ?? "W").charAt(0).toUpperCase()}
                </div>

                <h2
                  className="
                    mt-5
                    truncate
                    text-lg
                    font-semibold
                    text-slate-900
                  "
                >
                  {workspace.name ?? "Untitled workspace"}
                </h2>

                <p
                  className="
                    mt-2
                    line-clamp-3
                    min-h-[72px]
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  {workspace.description || "No description provided."}
                </p>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-100
                    pt-4
                  "
                >
                  <span
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Workspace
                  </span>

                  <NavLink
                    to={`/app/workspaces/${workspace.id}`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-slate-200
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
                    Open
                    <FiArrowRight className="h-4 w-4" />
                  </NavLink>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
