/** @format */

export interface WorkspaceOption {
  id: string;
}

export function isWorkspaceSelectionValid(
  routeWorkspaceId: string | undefined,
  loadedWorkspaceId: string | null | undefined,
) {
  return Boolean(routeWorkspaceId && routeWorkspaceId === loadedWorkspaceId);
}

export function pickNextWorkspaceId(
  workspaces: WorkspaceOption[],
  activeWorkspaceId: string | null,
  deletedWorkspaceId: string,
) {
  if (activeWorkspaceId !== deletedWorkspaceId) return activeWorkspaceId;

  return workspaces.find(({ id }) => id !== deletedWorkspaceId)?.id ?? null;
}

export function setLastWorkspaceForUser(
  userId: string,
  workspaceId: string | null,
) {
  const storageKey = `devdesk:last-workspace:${userId}`;
  if (workspaceId) {
    localStorage.setItem(storageKey, workspaceId);
  } else {
    localStorage.removeItem(storageKey);
  }
  window.dispatchEvent(new Event("devdesk:last-workspace-changed"));
}
