/** @format */

import RequestDeleteButton from "./RequestDeleteButton";
import { FiEdit3, FiCode } from "react-icons/fi";
import SendRequest from "./SendRequest";
import type { RequestRecord } from "@/types/database";

interface RequestViewProps {
  data: RequestRecord;
  activeEnvironmentId: string | null;
  onEdit: () => void;
  onDeleteSuccess: () => void;
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

export default function RequestView({
  data,
  activeEnvironmentId,
  onEdit,
  onDeleteSuccess,
}: RequestViewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-md px-3 py-1 text-xs font-bold ${methodStyle(
                  data.method ?? "GET",
                )}`}
              >
                {(data.method ?? "GET").toUpperCase()}
              </span>
              <h1 className="truncate text-xl font-bold text-slate-950">
                {data.name ?? "Untitled request"}
              </h1>
            </div>
            <p className="mt-4 truncate rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {data.url ?? ""}
            </p>
          </div>

          <button
            onClick={onEdit}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FiEdit3 className="h-4 w-4" />
            Edit
          </button>
        </div>
      </section>

      <SendRequest request={data} activeEnvironmentId={activeEnvironmentId} />

      {/* Headers */}
      {Object.keys(data.headers || {}).length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-semibold text-slate-950">
            <FiCode />
            Headers
          </h2>
          <div className="mt-4 space-y-2">
            {Object.entries(data.headers ?? {}).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span>{key}</span>
                <span className="text-slate-500">{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Params */}
      {Object.keys(data.params || {}).length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-950">Params</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(data.params ?? {}).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span>{key}</span>
                <span className="text-slate-500">{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Body */}
      {data.body && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-950">Body</h2>
          <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
            {data.body}
          </pre>
        </section>
      )}

      {/* Documentation */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <h2 className="font-semibold text-slate-950">Documentation</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {data.description || "No description provided."}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Example Request</h3>
          <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
            {data.example_request || "No example request."}
          </pre>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Example Response</h3>
          <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
            {data.example_response || "No example response."}
          </pre>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Notes</h3>
          <p className="mt-3 whitespace-pre-line text-sm text-slate-500">
            {data.notes || "No notes."}
          </p>
        </div>
      </section>

      {/* Delete */}
      <section className="flex justify-end border-t border-slate-200 pt-6">
        <RequestDeleteButton requestId={data.id} onSuccess={onDeleteSuccess} />
      </section>
    </div>
  );
}
