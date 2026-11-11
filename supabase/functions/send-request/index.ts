const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const input = await request.json();
    const url = new URL(input.url);
    if (!["http:", "https:"].includes(url.protocol)) return json({ error: "Only HTTP(S) URLs are supported" }, 400);
    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local") ||
      hostname === "0.0.0.0" || hostname === "::1" || /^127\./.test(hostname) ||
      /^10\./.test(hostname) || /^192\.168\./.test(hostname) || /^169\.254\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) {
      return json({ error: "Private and local network targets are not allowed" }, 400);
    }

    const method = String(input.method ?? "GET").toUpperCase();
    if (!["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].includes(method)) {
      return json({ error: "Unsupported HTTP method" }, 400);
    }
    const headers = new Headers(input.headers ?? {});
    headers.delete("host");
    headers.delete("content-length");
    headers.delete("connection");
    const upstream = await fetch(url, {
      method,
      headers,
      body: ["GET", "HEAD"].includes(method) || !input.body ? undefined : String(input.body),
      redirect: "manual",
    });
    const body = (await upstream.text()).slice(0, 1_000_000);
    const responseHeaders: Record<string, string> = {};
    upstream.headers.forEach((value, key) => {
      if (["content-type", "content-length", "cache-control"].includes(key.toLowerCase())) responseHeaders[key] = value;
    });
    return json({ status: upstream.status, headers: responseHeaders, body });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Proxy request failed" }, 400);
  }
});
