/** @format */

// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RequestForm from "./RequestForm";

describe("RequestForm (create)", () => {
  it("submits the entered name and url through onSubmit", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<RequestForm mode="create" onSubmit={onSubmit} isPending={false} />);

    await user.type(screen.getByLabelText("Request Name"), "Get users");
    await user.type(screen.getByLabelText("URL"), "https://api.dev/users");

    await user.click(screen.getByRole("button", { name: "Create Request" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Get users",
        url: "https://api.dev/users",
        method: "GET",
        headers: {},
        params: {},
      }),
    );
  });

  it("blocks submission when the name field is empty", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<RequestForm mode="create" onSubmit={onSubmit} isPending={false} />);

    await user.type(screen.getByLabelText("URL"), "https://api.dev/users");
    await user.click(screen.getByRole("button", { name: "Create Request" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Request name is required")).toBeInTheDocument();
  });

  it("prefills fields in edit mode", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <RequestForm
        mode="edit"
        initialValues={{
          id: "r1",
          name: "Existing",
          method: "POST",
          url: "https://api.dev/thing",
          headers: { Authorization: "Bearer abc" },
          params: {},
          body: "",
          description: "",
          example_request: "",
          example_response: "",
          notes: "",
          collection_id: "c1",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: null,
        }}
        onSubmit={onSubmit}
        isPending={false}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Request Name")).toHaveValue("Existing");

    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Existing",
        headers: { Authorization: "Bearer abc" },
      }),
    );
  });
});
