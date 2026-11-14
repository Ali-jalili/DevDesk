/** @format */

import Loading from "@/ui/Loading";

import { useNavigate } from "react-router-dom";

import { FiArrowRight, FiGlobe } from "react-icons/fi";
import type { RequestRecord } from "@/types/database";

interface RequestListProps {
  data: RequestRecord[];

  workspaceId: string;

  collectionId: string;
}

function methodStyle(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-emerald-50 text-emerald-600";

    case "POST":
      return "bg-blue-50 text-blue-600";

    case "PUT":
      return "bg-amber-50 text-amber-600";

    case "DELETE":
      return "bg-red-50 text-red-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function RequestList({
  data,

  workspaceId,

  collectionId,
}: RequestListProps) {
  const navigate = useNavigate();

  if (!data) {
    return <Loading />;
  }

  if (data.length === 0) {
    return (
      <div
        className="
        flex
        min-h-56
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-white
      "
      >
        <p className="text-sm text-slate-500">No requests found.</p>
      </div>
    );
  }

  return (
    <div
      className="
      grid
      gap-5
      sm:grid-cols-2
    "
    >
      {data.map((item) => (
        <article
          key={item.id}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition
            hover:-translate-y-1
            hover:border-indigo-200
            hover:shadow-md
          "
        >
          {/* Header */}

          <div
            className="
            flex
            items-start
            justify-between
            gap-3
          "
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`
                    rounded-md
                    px-2
                    py-1
                    text-xs
                    font-bold
                    ${methodStyle(item.method ?? "GET")}
                  `}
                >
                  {(item.method ?? "GET").toUpperCase()}
                </span>

                <FiGlobe className="h-4 w-4 text-slate-400" />
              </div>

              <h3
                className="
                mt-3
                truncate
                text-base
                font-semibold
                text-slate-950
              "
              >
                {item.name}
              </h3>
            </div>
          </div>

          {/* URL */}

          <p
            className="
            mt-4
            truncate
            rounded-lg
            bg-slate-50
            px-3
            py-2
            text-sm
            text-slate-600
          "
          >
            {item.url}
          </p>

          {item.description && (
            <p
              className="
              mt-4
              line-clamp-2
              text-sm
              leading-6
              text-slate-500
            "
            >
              {item.description}
            </p>
          )}

          {/* Footer */}

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
              text-slate-400
            "
            >
              API Request
            </span>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/app/workspaces/${workspaceId}/collections/${collectionId}/requests/${item.id}`,
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                font-semibold
                text-indigo-600
                transition
                hover:bg-indigo-50
              "
            >
              Open
              <FiArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
