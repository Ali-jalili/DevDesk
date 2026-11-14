/** @format */

// @vitest-environment jsdom

import { vi, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { useAuthMock, useActiveWorkspaceMock } = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  useActiveWorkspaceMock: vi.fn(),
}));

vi.mock("@/app/context/useAuth", () => ({
  default: function useAuth() {
    return useAuthMock();
  },
}));

vi.mock("@/features/workspaces/hooks/useActiveWorkspace", () => ({
  default: function useActiveWorkspace() {
    return useActiveWorkspaceMock();
  },
}));

import Header from "./Header";

describe("Header active workspace link", () => {
  it("links to the loaded workspace instead of an invalid route id", () => {
    useAuthMock.mockReturnValue({ user: { id: "user-1" } });
    useActiveWorkspaceMock.mockReturnValue({
      workspace: { id: "blog-workspace", name: "Blog Platform" },
    });

    render(
      <MemoryRouter initialEntries={["/app/workspaces/missing-workspace"]}>
        <Routes>
          <Route
            path="/app/workspaces/:workspaceId"
            element={<Header />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Blog Platform/ })).toHaveAttribute(
      "href",
      "/app/workspaces/blog-workspace",
    );
  });
});
