/** @format */

import { useSyncExternalStore } from "react";

import { useQuery } from "@tanstack/react-query";

import useAuth from "@/app/context/useAuth";
import { getWorkspaceById } from "@/features/workspaces/WorkspaceService";

/**
 * Resolves the "active" workspace (the one the user most recently opened) so
 * the header can surface a context chip without duplicating the account
 * identity that already lives in the sidebar.
 */
function useActiveWorkspace() {
  const { user } = useAuth();
  const storageKey = user ? `devdesk:last-workspace:${user.id}` : null;

  const activeWorkspaceId = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("devdesk:last-workspace-changed", onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(
          "devdesk:last-workspace-changed",
          onStoreChange,
        );
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => (storageKey ? localStorage.getItem(storageKey) : null),
    () => null,
  );

  const { data } = useQuery({
    queryKey: ["workspaceDetails", activeWorkspaceId],
    queryFn: () => getWorkspaceById(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  return { activeWorkspaceId, workspace: data };
}

export default useActiveWorkspace;
