/** @format */

import { describe, expect, it } from "vitest";
import { parseCurl } from "./parseCurl";

describe("parseCurl", () => {
  it("parses method, URL params, headers, and quoted JSON body", () => {
    expect(parseCurl(`curl -X PATCH 'https://api.shop.dev/orders/42?notify=true' -H 'Authorization: Bearer abc' --data-raw '{"status":"packed"}'`)).toEqual({
      method: "PATCH",
      url: "https://api.shop.dev/orders/42",
      headers: { Authorization: "Bearer abc" },
      params: { notify: "true" },
      body: '{"status":"packed"}',
    });
  });

  it("infers POST from data and accepts continued commands", () => {
    const command = `curl https://api.shop.dev/orders \\
      -H 'Content-Type: application/json' \\
      -d '{"quantity":2}'`;
    expect(parseCurl(command)?.method).toBe("POST");
  });

  it("accepts a pasted URL and rejects input without a target", () => {
    expect(parseCurl("https://api.shop.dev/products?page=2")?.params).toEqual({ page: "2" });
    expect(parseCurl("curl -X POST")).toBeNull();
  });
});
