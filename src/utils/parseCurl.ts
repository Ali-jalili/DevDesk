/** @format */

import { isValidRequestUrl } from "./requestUrl";

export interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body: string;
}

function tokenize(input: string): string[] {
  const normalized = input.replace(/\\\r?\n/g, " ");
  const tokens: string[] = [];
  let token = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;
  for (const character of normalized) {
    if (escaped) { token += character; escaped = false; continue; }
    if (character === "\\" && quote !== "'") { escaped = true; continue; }
    if (quote) { if (character === quote) quote = null; else token += character; continue; }
    if (character === "'" || character === '"') { quote = character; continue; }
    if (/\s/.test(character)) { if (token) { tokens.push(token); token = ""; } continue; }
    token += character;
  }
  if (escaped) token += "\\";
  if (token) tokens.push(token);
  return tokens;
}

export function parseCurl(input: string): ParsedCurl | null {
  const tokens = tokenize(input.trim());
  if (!tokens.length) return null;
  let method = "";
  let target = "";
  let body = "";
  const headers: Record<string, string> = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === "-X" || token === "--request") method = tokens[++index] ?? "";
    else if (token.startsWith("-X") && token.length > 2) method = token.slice(2);
    else if (token === "-H" || token === "--header") {
      const header = tokens[++index] ?? "";
      const separator = header.indexOf(":");
      if (separator > 0) headers[header.slice(0, separator).trim()] = header.slice(separator + 1).trim();
    } else if (token === "-d" || token === "--data" || token === "--data-raw" || token === "--data-binary") {
      body = tokens[++index] ?? "";
      if (!method) method = "POST";
    } else if (token.startsWith("--data-raw=") || token.startsWith("--data=")) {
      body = token.slice(token.indexOf("=") + 1);
      if (!method) method = "POST";
    } else if (/^https?:\/\//i.test(token) || (!token.startsWith("-") && token.includes("/"))) target = token;
  }
  if (!target || !isValidRequestUrl(target)) return null;
  try {
    let resolvedTarget = target.replace(/\{\{\s*[A-Za-z0-9_.-]+\s*\}\}/g, "example");
    if (/^\{\{\s*[A-Za-z0-9_.-]+\s*\}\}/.test(target)) {
      resolvedTarget = `https://example.com${resolvedTarget.slice("example".length)}`;
    }
    new URL(resolvedTarget);
    const params: Record<string, string> = {};
    const queryIndex = target.search(/[?#]/);
    const rawBase = queryIndex === -1 ? target : target.slice(0, queryIndex);
    const questionIndex = target.indexOf("?");
    if (questionIndex >= 0) {
      const hashIndex = target.indexOf("#", questionIndex);
      const rawQuery = target.slice(
        questionIndex + 1,
        hashIndex === -1 ? undefined : hashIndex,
      );
      new URLSearchParams(rawQuery).forEach((value, key) => {
        params[key] = value;
      });
    }
    return { method: (method || (body ? "POST" : "GET")).toUpperCase(), url: rawBase, headers, params, body };
  } catch {
    return null;
  }
}
