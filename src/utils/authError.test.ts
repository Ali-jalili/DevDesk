import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "./authError";

describe("getAuthErrorMessage", () => {
  it.each([
    ["User already registered", "An account with this email already exists."],
    ["Invalid login credentials", "Email or password is incorrect."],
    ["Password should be at least 6 characters", "Password does not meet the requirements."],
    ["Failed to fetch", "Unable to connect. Please check your internet connection."],
    ["Unexpected server response", "Something went wrong. Please try again."],
  ])("maps %s to a safe user message", (message, expected) => {
    expect(getAuthErrorMessage(new Error(message))).toBe(expected);
  });

  it("returns a generic message for non-Error values", () => {
    expect(getAuthErrorMessage({ message: "secret" })).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
