/** @format */

const VARIABLE_PATTERN = /\{\{\s*[A-Za-z0-9_.-]+\s*\}\}/g;
const LEADING_VARIABLE_PATTERN = /^\{\{\s*[A-Za-z0-9_.-]+\s*\}\}/;

/** Validate a request URL before environment variables have been resolved. */
export function isValidRequestUrl(value: string) {
  const url = value.trim();
  if (!url) return false;

  const withExamples = url.replace(VARIABLE_PATTERN, "example");
  if (/^https?:\/\//i.test(withExamples)) {
    try {
      const parsed = new URL(withExamples);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  const leadingVariable = LEADING_VARIABLE_PATTERN.exec(url);
  if (!leadingVariable) return false;

  const suffix = url.slice(leadingVariable[0].length);
  return suffix === "" || /^[/?#:]/.test(suffix);
}
