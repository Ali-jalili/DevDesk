/** @format */

import { deleteWorkspace } from "@/features/workspaces/WorkspaceService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: { workspaceId: string }) =>
      deleteWorkspace(variables.workspaceId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({ queryKey: ["workspaceDetails"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["environments"] });
      queryClient.invalidateQueries({ queryKey: ["environment_variables"] });
      toast.success("Workspace deleted successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export default useDeleteWorkspace;
