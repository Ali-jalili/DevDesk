/** @format */

import supabase from "@/lib/supabase";
import type { Json, KeyValueMap, Requests, RequestRecord } from "@/types/database";

function toKeyValueMap(value: Json | null): KeyValueMap | null {
  if (value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] =>
      typeof entry[1] === "string",
    ),
  );
}

function toRequestRecord(row: Requests): RequestRecord {
  return {
    ...row,
    headers: toKeyValueMap(row.headers),
    params: toKeyValueMap(row.params),
  };
}

async function createRequest({
  name,
  method,
  url,
  headers,
  params,
  body,
  description,
  example_request,
  example_response,
  notes,
  collectionId,
}: {
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body: string;
  description: string;
  example_request: string;
  example_response: string;
  notes: string;
  collectionId: string;
}) {
  const { data, error } = await supabase.from("requests").insert({
    name: name,
    method: method,
    url: url,
    headers: headers,
    params: params,
    body: body,
    description: description,
    example_request: example_request,
    example_response: example_response,
    notes: notes,
    collection_id: collectionId,
  });

  if (error) throw new Error(error.message);

  return data;
}

async function getRequests(collectionId: string) {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("collection_id", collectionId);

  if (error) throw new Error(error.message);

  return data.map(toRequestRecord);
}

async function getRequestById(requestId: string) {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", requestId)
    .single();
  if (error) throw new Error(error.message);

  return toRequestRecord(data);
}

async function updateRequest(
  requestId: string,
  requestData: {
    name: string;
    method: string;
    url: string;
    headers: Record<string, string>;
    params: Record<string, string>;
    body: string;
    description: string;
    example_request: string;
    example_response: string;
    notes: string;
  },
) {
  const { data, error } = await supabase
    .from("requests")
    .update(requestData)
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toRequestRecord(data);
}

async function deleteRequest(requestId: string) {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
