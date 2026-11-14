/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useAuth from "@/app/context/useAuth";
import { deleteWorkspace, getWorkspaces } from "@/features/workspaces/WorkspaceService";
import {
  pickNextWorkspaceId,
  setLastWorkspaceForUser,
} from "@/features/workspaces/workspaceSelection";
import { getWorkspaceQueryKeys } from "@/features/workspaces/workspaceCache";

function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ workspaceId }: { workspaceId: string }) =>
      deleteWorkspace(workspaceId),

    onMutate: async ({ workspaceId }) => {
      const queryKeys = getWorkspaceQueryKeys(queryClient, workspaceId);
      await Promise.all(
        queryKeys.map((queryKey) =>
          queryClient.cancelQueries({ queryKey, exact: true }),
        ),
      );
      return { queryKeys };
    },

    onSuccess: async (_data, { workspaceId }, context) => {
      const storageKey = user ? `devdesk:last-workspace:${user.id}` : null;
      const activeWorkspaceId = storageKey
        ? localStorage.getItem(storageKey)
        : null;

      if (user && activeWorkspaceId === workspaceId) {
        let remainingWorkspaces: Awaited<ReturnType<typeof getWorkspaces>> = [];
        try {
          remainingWorkspaces = await queryClient.fetchQuery({
            queryKey: ["workspaces", user.id],
            queryFn: getWorkspaces,
          });
        } catch {
          // Clear a deleted selection even if refreshing the list fails.
        }
        setLastWorkspaceForUser(
          user.id,
          pickNextWorkspaceId(
            remainingWorkspaces,
            activeWorkspaceId,
            workspaceId,
          ),
        );
      }

      for (const queryKey of context?.queryKeys ?? []) {
        queryClient.removeQueries({ queryKey, exact: true });
      }
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace deleted successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export default useDeleteWorkspace;
