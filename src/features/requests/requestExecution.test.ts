/** @format */

import { describe, expect, it } from "vitest";
import { prepareRequest } from "./requestExecution";

const request = {
  url: "{{baseUrl}}/posts",
  method: "GET",
  headers: { Authorization: "Bearer {{token}}" },
  params: { limit: "{{pageSize}}" },
  body: '{"ignored":"value"}',
};

describe("prepareRequest", () => {
  it("reports all missing variables before sending", () => {
    expect(() => prepareRequest(request, { pageSize: "1" })).toThrow(
      "Undefined variables: baseUrl, token. Add them to the active environment.",
    );
  });

  it.each(["GET", "HEAD"])("omits a saved body for %s requests", (method) => {
    const prepared = prepareRequest({ ...request, method }, {
      baseUrl: "https://api.example.test",
      token: "test-token",
      pageSize: "2",
    });

    expect(prepared.body).toBeUndefined();
    expect(prepared.url).toBe("https://api.example.test/posts?limit=2");
  });

  it("includes a body for methods that support it", () => {
    const prepared = prepareRequest({ ...request, method: "POST" }, {
      baseUrl: "https://api.example.test",
      token: "test-token",
      pageSize: "2",
    });

    expect(prepared.body).toBe('{"ignored":"value"}');
  });
});
