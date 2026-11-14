/** @format */

import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { getWorkspaceQueryKeys } from "./workspaceCache";

describe("getWorkspaceQueryKeys", () => {
  it("selects a deleted workspace and its descendants but leaves other workspaces cached", () => {
    const client = new QueryClient();
    client.setQueryData(["workspaceDetails", "deleted"], { id: "deleted" });
    client.setQueryData(["collections", "deleted"], [{ id: "collection-1" }]);
    client.setQueryData(["collections", "collection-1"], {
      id: "collection-1",
      workspace_id: "deleted",
    });
    client.setQueryData(["requests", "collection-1"], [
      { id: "request-1", collection_id: "collection-1" },
    ]);
    client.setQueryData(["requests", "request-1"], {
      id: "request-1",
      collection_id: "collection-1",
    });
    client.setQueryData(["environments", "deleted"], [{ id: "environment-1" }]);
    client.setQueryData(["environment_variables", "environment-1"], [
      { id: "variable-1", environment_id: "environment-1" },
    ]);
    client.setQueryData(["atlas", "deleted"], {
      workspaceId: "deleted",
      lines: [],
    });
    client.setQueryData(["workspaceDetails", "kept"], { id: "kept" });
    client.setQueryData(["collections", "kept"], [{ id: "collection-2" }]);

    const keys = getWorkspaceQueryKeys(client, "deleted");
    const keyIds = keys.map((key) => key[1]);

    expect(keyIds).toContain("deleted");
    expect(keyIds).toContain("collection-1");
    expect(keyIds).toContain("request-1");
    expect(keyIds).toContain("environment-1");
    expect(keyIds).not.toContain("kept");
    expect(keyIds).not.toContain("collection-2");

    for (const queryKey of keys) {
      client.removeQueries({ queryKey, exact: true });
    }

    expect(client.getQueryData(["workspaceDetails", "deleted"])).toBeUndefined();
    expect(client.getQueryData(["requests", "request-1"])).toBeUndefined();
    expect(client.getQueryData(["environment_variables", "environment-1"])).toBeUndefined();
    expect(client.getQueryData(["workspaceDetails", "kept"])).toEqual({ id: "kept" });
  });
});
