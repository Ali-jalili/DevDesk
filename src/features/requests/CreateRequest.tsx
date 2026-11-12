/** @format */

import useCreateRequest from "./hooks/useCreateRequest";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import RequestForm from "./RequestForm";

export default function CreateRequest() {
  const { workspaceId, collectionId } = useParams<{
    workspaceId: string;
    collectionId: string;
  }>();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateRequest();

  function submitFormRequest(values: {
    name: string;
    method: string;
    url: string;
    headers: Record<string, string>;
    params: Record<string, string>;
    body: string;
    description: string;
    example_request: string;
    example_response: string;
    notes: string;
  }) {
    mutate(
      {
        ...values,
        collectionId: collectionId!,
      },
      {
        onSuccess() {
          toast.success("Request created successfully");
          navigate(
            `/app/workspaces/${workspaceId}/collections/${collectionId}`,
          );
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/app/workspaces/${workspaceId}/collections/${collectionId}`,
            )
          }
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to collection
        </button>

        <h1 className="text-xl font-semibold">Create Request</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Define a new API request for this collection.
        </p>
      </div>

      <RequestForm
        mode="create"
        onSubmit={submitFormRequest}
        isPending={isPending}
      />
    </div>
  );
}
