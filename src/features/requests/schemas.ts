/** @format */

import { z } from "zod";

/**
 * Zod schema shared by the create/edit request form.
 * Keeps the rules in one place so both flows validate identically.
 */
export const requestSchema = z
  .object({
    name: z.string().trim().min(1, "Request name is required."),
    method: z.string().min(1, "Method is required."),
    url: z.string().trim().min(1, "URL is required.").url("Enter a valid URL."),
    headers: z.array(z.object({ key: z.string(), value: z.string() })),
    params: z.array(z.object({ key: z.string(), value: z.string() })),
    body: z.string().refine(
      (value) => {
        if (value.trim() === "") return true;
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Body must be valid JSON when provided.",
      },
    ),
    description: z.string(),
    example_request: z.string(),
    example_response: z.string(),
    notes: z.string(),
  })
  .strict();

export type RequestSchemaInput = z.infer<typeof requestSchema>;
