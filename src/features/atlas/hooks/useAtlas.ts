/** @format */

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/app/context/useAuth";
import { getWorkspaces, getWorkspaceById } from "@/features/workspaces/WorkspaceService";
import { getAtlas } from "../AtlasService";

export default function useAtlas() {
  const { user } = useAuth();
  const storageKey = user ? `devdesk:last-workspace:${user.id}` : null;
  const workspaceId = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("devdesk:last-workspace-changed", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("devdesk:last-workspace-changed", onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    () => (storageKey ? localStorage.getItem(storageKey) : null),
    () => null,
  );
  return useQuery({
    queryKey: ["atlas", workspaceId ?? user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      const selected = workspaceId ? await getWorkspaceById(workspaceId) : (await getWorkspaces())[0];
      if (!selected) return null;
      return { ...(await getAtlas(selected.id)), workspaceId: selected.id };
    },
  });
}
