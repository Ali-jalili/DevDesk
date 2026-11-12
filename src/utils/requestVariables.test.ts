/** @format */

import { describe, expect, it } from "vitest";
import {
  interpolate,
  findUnresolvedVariables,
  formatResponse,
  formatBytes,
} from "./requestVariables";

describe("interpolate", () => {
  it("replaces known placeholders with their values", () => {
    expect(
      interpolate("{{baseUrl}}/users/{{id}}", {
        baseUrl: "https://api.dev",
        id: "42",
      }),
    ).toBe("https://api.dev/users/42");
  });

  it("trims surrounding whitespace in placeholder keys", () => {
    expect(interpolate("GET {{ base }} now", { base: "https://api.dev" })).toBe(
      "GET https://api.dev now",
    );
  });

  it("leaves unknown placeholders untouched", () => {
    expect(
      interpolate("{{token}} and {{baseUrl}}", { baseUrl: "https://api.dev" }),
    ).toBe("{{token}} and https://api.dev");
  });

  it("handles values with no placeholders", () => {
    expect(interpolate("plain text", {})).toBe("plain text");
  });
});

describe("findUnresolvedVariables", () => {
  it("returns placeholder names that have no matching variable", () => {
    expect(
      findUnresolvedVariables(["{{baseUrl}}/x", "{{token}}", "plain"], {
        baseUrl: "https://api.dev",
      }),
    ).toEqual(["token"]);
  });

  it("returns an empty list when everything resolves", () => {
    expect(
      findUnresolvedVariables(["{{a}}", "{{b}}"], { a: "1", b: "2" }),
    ).toEqual([]);
  });

  it("deduplicates repeated placeholders", () => {
    expect(
      findUnresolvedVariables(["{{token}}", "{{ token }}", "{{token}}"], {}),
    ).toEqual(["token"]);
  });
});

describe("formatResponse", () => {
  it("pretty-prints valid JSON", () => {
    expect(formatResponse('{"ok":true}')).toBe('{\n  "ok": true\n}');
  });

  it("returns raw text for non-JSON responses", () => {
    expect(formatResponse("hello")).toBe("hello");
  });

  it("returns a hint for an empty body", () => {
    expect(formatResponse("")).toBe("(empty response)");
  });
});

describe("formatBytes", () => {
  it.each([
    [0, "0 B"],
    [512, "512 B"],
    [2048, "2.0 KB"],
    [5 * 1024 * 1024, "5.00 MB"],
  ])("formats %i bytes as %s", (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected);
  });
});
