import { describe, expect, it } from "vitest";
import { convertKeyValueArrayToObject } from "./convertKeyValueArrayToObject";

describe("convertKeyValueArrayToObject", () => {
  it("converts key/value entries into an object", () => {
    expect(convertKeyValueArrayToObject([
      { key: "Authorization", value: "Bearer token" },
      { key: "Accept", value: "application/json" },
    ])).toEqual({ Authorization: "Bearer token", Accept: "application/json" });
  });

  it("ignores entries with an empty key", () => {
    expect(convertKeyValueArrayToObject([
      { key: "", value: "ignored" },
      { key: "kept", value: "value" },
    ])).toEqual({ kept: "value" });
  });

  it("uses the last value when a key occurs more than once", () => {
    expect(convertKeyValueArrayToObject([
      { key: "x", value: "first" },
      { key: "x", value: "last" },
    ])).toEqual({ x: "last" });
  });
});
