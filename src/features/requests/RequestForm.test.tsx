/** @format */

// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("saves a URL that starts with an environment variable", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<RequestForm mode="create" onSubmit={onSubmit} isPending={false} />);

    await user.type(screen.getByLabelText("Request Name"), "Get posts");
    fireEvent.change(screen.getByLabelText("URL"), {
      target: { value: "{{baseUrl}}/auth/login" },
    });
    await user.click(screen.getByRole("button", { name: "Create Request" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ url: "{{baseUrl}}/auth/login" }),
    );
  });

  it("blocks submission when the name field is empty", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<RequestForm mode="create" onSubmit={onSubmit} isPending={false} />);

    await user.type(screen.getByLabelText("URL"), "https://api.dev/users");
    await user.click(screen.getByRole("button", { name: "Create Request" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Request name is required/)).toBeInTheDocument();
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

  it("disables GET bodies without discarding typed content", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RequestForm mode="create" onSubmit={onSubmit} isPending={false} />);

    const method = screen.getByLabelText("Method");
    const body = screen.getByRole("textbox", { name: "Request Body" });

    await user.type(screen.getByLabelText("Request Name"), "Create post");
    await user.type(screen.getByLabelText("URL"), "https://api.dev/posts");
    await user.selectOptions(method, "POST");
    await user.clear(body);
    fireEvent.change(body, { target: { value: '{"sku":"book-1"}' } });
    await user.selectOptions(method, "GET");

    expect(body).toBeDisabled();
    expect(body).toHaveValue('{"sku":"book-1"}');
    expect(screen.getByText("GET requests don't have a body")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create Request" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ body: '{"sku":"book-1"}' }),
    );

    await user.selectOptions(method, "HEAD");
    expect(body).toBeDisabled();
    expect(screen.getByText("HEAD requests don't have a body")).toBeInTheDocument();

    await user.selectOptions(method, "POST");
    expect(body).toBeEnabled();
    expect(body).toHaveValue('{"sku":"book-1"}');
    expect(body).toHaveAttribute("placeholder", '{ "key": "value" }');
  });

  it("uses the bodyless state when editing a GET request", () => {
    render(
      <RequestForm
        mode="edit"
        initialValues={{
          id: "r-get",
          name: "Get posts",
          method: "GET",
          url: "https://api.dev/posts",
          headers: {},
          params: {},
          body: '{"saved":"value"}',
          description: "",
          example_request: "",
          example_response: "",
          notes: "",
          collection_id: "c1",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: null,
        }}
        onSubmit={vi.fn()}
        isPending={false}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Request Body" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Request Body" })).toHaveValue(
      '{"saved":"value"}',
    );
  });
});
