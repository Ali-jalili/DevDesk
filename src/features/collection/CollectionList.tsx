/** @format */

import { useState } from "react";

import {
  FiEdit2,
  FiFolder,
  FiMoreVertical,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import EditCollectionModal from "./EditCollectionModal";
import DeleteCollectionAlert from "./DeleteCollectionAlert";
import type { CollectionWithRequestCount } from "@/types/database";

interface CollectionListProps {
  collections: CollectionWithRequestCount[];
}

function CollectionList({ collections }: CollectionListProps) {
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [selectedCollection, setSelectedCollection] =
    useState<CollectionWithRequestCount | null>(null);

  const [selectedCollectionToDelete, setSelectedCollectionToDelete] =
    useState<CollectionWithRequestCount | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  function openEdit(collection: Collection) {
    setOpenMenuId(null);

    setSelectedCollection(collection);
  }

  function closeEdit() {
    setSelectedCollection(null);
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((item) => (
        <article
          key={item.id}
          className="
            group
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

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                "
              >
                <FiFolder className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-base
                    font-semibold
                    text-slate-950
                  "
                >
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400">Collection</p>
              </div>
            </div>

            {/* Actions */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenuId(openMenuId === item.id ? null : item.id)
                }
                aria-label={`Actions for ${item.name}`}
                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <FiMoreVertical className="h-5 w-5" />
              </button>

              {openMenuId === item.id && (
                <div
                  className="
                    absolute
                    right-0
                    top-10
                    z-20
                    w-40
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-1.5
                    shadow-xl
                  "
                >
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      text-slate-700
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <FiEdit2 className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);

                      setSelectedCollectionToDelete(item);

                      setIsDeleteAlertOpen(true);
                    }}
                    className="
                      mt-1
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}

          <p
            className="
              mt-5
              min-h-[48px]
              line-clamp-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            {item.description || "No description provided."}
          </p>

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
            <div>
              <p className="text-xs text-slate-400">API Requests</p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {item.requests?.[0]?.count ?? 0}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/app/workspaces/${item.workspace_id}/collections/${item.id}`,
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

      {selectedCollection && (
        <EditCollectionModal
          collectionId={selectedCollection.id}
          workspaceId={selectedCollection.workspace_id}
          name={selectedCollection.name}
          description={selectedCollection.description}
          onClose={closeEdit}
        />
      )}

      {selectedCollectionToDelete && (
        <DeleteCollectionAlert
          collectionId={selectedCollectionToDelete.id}
          workspaceId={selectedCollectionToDelete.workspace_id}
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
        />
      )}
    </div>
  );
}

export default CollectionList;
