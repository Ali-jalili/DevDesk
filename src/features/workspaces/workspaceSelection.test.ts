/** @format */

import { describe, expect, it } from "vitest";
import {
  isWorkspaceSelectionValid,
  pickNextWorkspaceId,
} from "./workspaceSelection";

const workspaces = [
  { id: "active", name: "Active" },
  { id: "next", name: "Next" },
];

describe("pickNextWorkspaceId", () => {
  it("switches to another workspace when the active one is deleted", () => {
    expect(pickNextWorkspaceId(workspaces, "active", "active")).toBe("next");
  });

  it("keeps the active workspace when a different one is deleted", () => {
    expect(pickNextWorkspaceId(workspaces, "active", "next")).toBe("active");
  });

  it("clears selection when the last workspace is deleted", () => {
    expect(pickNextWorkspaceId([workspaces[0]], "active", "active")).toBeNull();
  });
});

describe("isWorkspaceSelectionValid", () => {
  it("only selects a workspace after its route record loads", () => {
    expect(isWorkspaceSelectionValid("route", undefined)).toBe(false);
    expect(isWorkspaceSelectionValid("route", null)).toBe(false);
    expect(isWorkspaceSelectionValid("route", "another")).toBe(false);
    expect(isWorkspaceSelectionValid("route", "route")).toBe(true);
  });
});
