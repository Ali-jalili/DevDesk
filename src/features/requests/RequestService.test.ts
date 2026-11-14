/** @format */

import { describe, expect, it, vi, beforeEach } from "vitest";

const { insertMock, fromMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  fromMock: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  default: {
    from: fromMock,
  },
}));

import { createRequest } from "./RequestService";

const payload = {
  name: "Get users",
  method: "GET",
  url: "https://api.dev/users",
  headers: { Accept: "application/json" },
  params: {},
  body: "",
  description: "",
  example_request: "",
  example_response: "",
  notes: "",
  collectionId: "collection-1",
};

describe("createRequest", () => {
  beforeEach(() => {
    fromMock.mockReset();
    insertMock.mockReset();
    fromMock.mockReturnValue({ insert: insertMock });
  });

  it("inserts the row and returns the created data", async () => {
    const row = { id: "request-1", name: "Get users" };
    insertMock.mockResolvedValue({ data: row, error: null });

    await expect(createRequest(payload)).resolves.toBe(row);
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Get users",
        collection_id: "collection-1",
      }),
    );
  });

  it("throws when the Supabase insert fails", async () => {
    insertMock.mockResolvedValue({
      data: null,
      error: { message: "new row violates row-level security policy" },
    });

    await expect(createRequest(payload)).rejects.toThrow("row-level security");
  });
});
