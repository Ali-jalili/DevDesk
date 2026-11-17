/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateWorkspaceEnvironment } from "@/features/workspaces/WorkspaceService";
import type { Workspaces } from "@/types/database";

type UpdateWorkspaceEnvironmentInput = {
  workspaceId: string;
  environmentId: string | null;
};

export default function useUpdateWorkspaceEnvironment() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ workspaceId, environmentId }: UpdateWorkspaceEnvironmentInput) =>
      updateWorkspaceEnvironment(workspaceId, environmentId),

    async onMutate({ workspaceId, environmentId }) {
      const queryKey = ["workspaceDetails", workspaceId] as const;
      await queryClient.cancelQueries({ queryKey });

      const previousWorkspace = queryClient.getQueryData<Workspaces | null>(queryKey);
      queryClient.setQueryData<Workspaces | null>(queryKey, (workspace) =>
        workspace
          ? { ...workspace, active_environment_id: environmentId }
          : workspace,
      );

      return { queryKey, previousWorkspace };
    },

    onError(error, _variables, context) {
      if (context?.previousWorkspace !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousWorkspace);
      }
      toast.error(`Could not update active environment: ${error.message}`);
    },

    onSuccess(data) {
      queryClient.setQueryData(["workspaceDetails", data.id], data);
      toast.success("Active environment updated");
    },

    onSettled(_data, _error, { workspaceId }) {
      void queryClient.invalidateQueries({
        queryKey: ["workspaceDetails", workspaceId],
      });
      void queryClient.invalidateQueries({ queryKey: ["atlas", workspaceId] });
    },
  });

  return {
    mutate,
    isPending,
  };
}
