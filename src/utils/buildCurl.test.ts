/** @format */

import { describe, expect, it } from "vitest";
import { buildCurl } from "./buildCurl";

describe("buildCurl", () => {
  it("builds a GET request with query params", () => {
    const curl = buildCurl({
      method: "GET",
      url: "https://api.dev/users",
      params: { page: "1", sort: "name" },
    });
    expect(curl).toContain(
      'curl -X GET "https://api.dev/users?page=1&sort=name"',
    );
  });

  it("adds header flags and body for non-GET methods", () => {
    const curl = buildCurl({
      method: "POST",
      url: "https://api.dev/login",
      headers: { "Content-Type": "application/json" },
      body: '{"a":1}',
    });
    expect(curl).toContain('curl -X POST "https://api.dev/login"');
    expect(curl).toContain('-H "Content-Type: application/json"');
    expect(curl).toContain('--data "{\\"a\\":1}"');
  });

  it("omits the body for GET requests even when provided", () => {
    const curl = buildCurl({
      method: "GET",
      url: "https://api.dev/x",
      body: '{"should":"not appear"}',
    });
    expect(curl).not.toContain("--data");
  });

  it("skips empty query params and headers", () => {
    const curl = buildCurl({
      method: "GET",
      url: "https://api.dev/x",
      params: { "": "ignored" },
      headers: { "": "ignored" },
    });
    expect(curl).toBe('curl -X GET "https://api.dev/x"');
  });
});
