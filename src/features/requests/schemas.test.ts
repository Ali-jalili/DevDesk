/** @format */

import { describe, expect, it } from "vitest";
import { requestSchema } from "./schemas";

const validPayload = {
  name: "Get users",
  method: "GET",
  url: "https://api.dev/users",
  headers: [],
  params: [],
  body: "",
  description: "",
  example_request: "",
  example_response: "",
  notes: "",
};

describe("requestSchema", () => {
  it("accepts a well-formed request with a valid URL", () => {
    expect(requestSchema.safeParse(validPayload).success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = requestSchema.safeParse({ ...validPayload, name: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid URL", () => {
    const result = requestSchema.safeParse({
      ...validPayload,
      url: "not a url",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const urlIssue = result.error.issues.find(
        (issue) => issue.path[0] === "url",
      );
      expect(urlIssue?.message).toBe("Enter a valid URL.");
    }
  });

  it("accepts an empty body but rejects invalid JSON", () => {
    expect(
      requestSchema.safeParse({
        ...validPayload,
        body: '{"ok":true}',
      }).success,
    ).toBe(true);

    const invalid = requestSchema.safeParse({
      ...validPayload,
      body: "{ not valid json",
    });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      const bodyIssue = invalid.error.issues.find(
        (issue) => issue.path[0] === "body",
      );
      expect(bodyIssue?.message).toBe("Body must be valid JSON when provided.");
    }
  });
});
