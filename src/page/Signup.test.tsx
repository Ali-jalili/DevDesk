/** @format */

// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { handleSignUpMock } = vi.hoisted(() => ({
  handleSignUpMock: vi.fn(),
}));

vi.mock("@/app/context/useAuth", () => ({
  default: () => ({ handleSignUp: handleSignUpMock }),
}));

import Signup from "./Signup";

function renderSignup() {
  return render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>,
  );
}

describe("Signup validation", () => {
  beforeEach(() => handleSignUpMock.mockReset());

  it("shows required errors for empty fields", async () => {
    const user = userEvent.setup();
    renderSignup();

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(handleSignUpMock).not.toHaveBeenCalled();
  });

  it("shows invalid-email and short-password errors", async () => {
    const user = userEvent.setup();
    renderSignup();

    await user.type(screen.getByLabelText("Name"), "QA Tester");
    await user.type(screen.getByLabelText("Email"), "bad-email");
    await user.type(screen.getByLabelText("Password"), "1234567");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Please enter a valid email.")).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 8 characters."),
    ).toBeInTheDocument();
    expect(handleSignUpMock).not.toHaveBeenCalled();
  });
});
