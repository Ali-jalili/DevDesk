/** @format */

import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import useGetRequest from "./hooks/useGetRequest";

import Loading from "@/ui/Loading";

import RequestView from "./RequestView";

import RequestEditForm from "./RequestEditForm";
import useWorkspaceDetails from "@/features/workspaces/hooks/useWorkspaceDetails";

export default function RequestDetail() {
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const { workspaceId, collectionId, requestId } = useParams<{
    workspaceId: string;
    collectionId: string;
    requestId: string;
  }>();

  const { data, isLoading, error } = useGetRequest(requestId);
  const { data: workspace } = useWorkspaceDetails(workspaceId);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-red-500">
        Failed to load request.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Request not found.
      </div>
    );
  }

  function handleDeleteSuccess() {
    navigate(`/app/workspaces/${workspaceId}/collections/${collectionId}`);
  }

  return isEditing ? (
    <RequestEditForm
      data={data}
      onSuccess={() => setIsEditing(false)}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <RequestView
      data={data}
      activeEnvironmentId={workspace?.active_environment_id ?? null}
      onEdit={() => setIsEditing(true)}
      onDeleteSuccess={handleDeleteSuccess}
    />
  );
}
