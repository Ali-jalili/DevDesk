/** @format */

import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import useUpdateRequest from "./hooks/useUpdateRequest";
import type { RequestRecord } from "@/types/database";
import RequestForm from "./RequestForm";

interface RequestEditFormProps {
  data: RequestRecord;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RequestEditForm({
  data,
  onSuccess,
  onCancel,
}: RequestEditFormProps) {
  const { requestId } = useParams<{ requestId: string }>();
  const { mutate, isPending } = useUpdateRequest();

  function handleSubmit(values: {
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
    if (!requestId) return;

    mutate(
      { requestId, data: values },
      {
        onSuccess() {
          toast.success("Request updated successfully");
          onSuccess();
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <RequestForm
      mode="edit"
      initialValues={data}
      onSubmit={handleSubmit}
      isPending={isPending}
      onCancel={onCancel}
    />
  );
}
