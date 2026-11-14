/** @format */

import { describe, expect, it } from "vitest";
import { isValidRequestUrl } from "./requestUrl";

describe("isValidRequestUrl", () => {
  it.each([
    "https://api.example.com/a",
    "http://localhost:3000",
    "{{baseUrl}}/auth/login",
    "{{ baseUrl }}/x",
    "https://{{host}}/x?id={{id}}",
    "{{baseUrl}}",
  ])("accepts %s", (url) => {
    expect(isValidRequestUrl(url)).toBe(true);
  });

  it.each([
    "{{baseUrl}}users",
    "foo",
    "api.example.com/users",
    "",
    "ftp://x.com",
  ])("rejects %s", (url) => {
    expect(isValidRequestUrl(url)).toBe(false);
  });
});
