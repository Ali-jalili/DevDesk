/** @format */

import { z } from "zod";
import { isValidRequestUrl } from "@/utils/requestUrl";

/**
 * Zod schema shared by the create/edit request form.
 * Keeps the rules in one place so both flows validate identically.
 */
export const requestSchema = z
  .object({
    name: z.string().trim().min(1, "Request name is required."),
    method: z.string().min(1, "Method is required."),
    url: z
      .string()
      .trim()
      .min(1, "URL is required.")
      .refine(isValidRequestUrl, "Enter a valid URL."),
    headers: z.array(z.object({ key: z.string(), value: z.string() })),
    params: z.array(z.object({ key: z.string(), value: z.string() })),
    body: z.string(),
    description: z.string(),
    example_request: z.string(),
    example_response: z.string(),
    notes: z.string(),
  })
  .strict()
  .superRefine((data, context) => {
    if (["GET", "HEAD"].includes(data.method.toUpperCase())) return;
    if (data.body.trim() === "") return;

    try {
      JSON.parse(data.body);
    } catch {
      context.addIssue({
        code: "custom",
        path: ["body"],
        message: "Body must be valid JSON when provided.",
      });
    }
  });

export type RequestSchemaInput = z.infer<typeof requestSchema>;
