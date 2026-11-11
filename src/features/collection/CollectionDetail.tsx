/** @format */

import { useState } from "react";

import useGetCollection from "./hooks/useGetCollection";
import useGetRequests from "@/features/requests/hooks/useGetRequests";

import { FiPlus, FiSearch } from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

import RequestList from "../requests/RequestList";

export default function CollectionDetail() {
  const { workspaceId, collectionId } = useParams<{
    workspaceId: string;
    collectionId: string;
  }>();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { data: collection, isLoading } = useGetCollection(collectionId!);

  const {
    data: requests,
    isLoading: isRequestsLoading,
    error: requestsError,
  } = useGetRequests(collectionId);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Loading collection...
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Collection not found.
      </div>
    );
  }

  const filteredRequests = requests?.filter((request) =>
    (request.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const hasRequests = filteredRequests && filteredRequests.length > 0;

  return (
    <div className="space-y-8">
      {/* Collection Header */}

      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
          Collection
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {collection.name}
        </h1>

        {collection.description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {collection.description}
          </p>
        )}
      </section>

      {/* Requests */}

      <section>
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Requests</h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage API endpoints in this collection.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/app/workspaces/${workspaceId}/collections/${collectionId}/requests/new`,
              )
            }
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <FiPlus className="h-4 w-4" />
            New Request
          </button>
        </div>

        {/* Search */}

        <div className="mt-5">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <FiSearch className="h-4 w-4 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search requests..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Request List */}

        {isRequestsLoading ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
            Loading requests...
          </div>
        ) : requestsError ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {requestsError.message}
          </div>
        ) : hasRequests ? (
          <div className="mt-6">
            <RequestList
              data={filteredRequests ?? []}
              workspaceId={workspaceId!}
              collectionId={collectionId!}
            />
          </div>
        ) : (
          <div className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 text-center">
            <h3 className="text-sm font-semibold text-slate-900">
              {search ? "No requests found" : "No requests yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {search
                ? "Try another search term."
                : "Create your first API request for this collection."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/app/workspaces/${workspaceId}/collections/${collectionId}/requests/new`,
                  )
                }
                className="mt-5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Create Request
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
