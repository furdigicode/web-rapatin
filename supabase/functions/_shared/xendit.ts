// Shared Xendit API client for Edge Functions (read-only tools)
// Auth: Basic Auth with XENDIT_SECRET_KEY as username, empty password.

export const XENDIT_API_BASE = "https://api.xendit.co";

export type XenditResult = { ok: boolean; status: number; data: unknown };

function basicAuthHeader(): string | null {
  const key = Deno.env.get("XENDIT_SECRET_KEY");
  if (!key) return null;
  return `Basic ${btoa(`${key}:`)}`;
}

function appendQuery(url: URL, query: Record<string, unknown>) {
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item === undefined || item === null || item === "") continue;
        url.searchParams.append(k, String(item));
      }
    } else {
      url.searchParams.append(k, String(v));
    }
  }
}

/**
 * Call the Xendit API.
 * query values may be arrays (repeated params) or bracketed keys like "created[gte]".
 */
export async function xenditFetch(
  method: string,
  path: string,
  opts: {
    query?: Record<string, unknown>;
    body?: unknown;
    forUserId?: string;
  } = {},
): Promise<XenditResult> {
  const auth = basicAuthHeader();
  if (!auth) {
    return {
      ok: false,
      status: 500,
      data: { error: "XENDIT_SECRET_KEY belum dikonfigurasi." },
    };
  }

  const url = new URL(`${XENDIT_API_BASE}${path.startsWith("/") ? path : `/${path}`}`);
  if (opts.query) appendQuery(url, opts.query);

  const headers: Record<string, string> = {
    Authorization: auth,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (opts.forUserId) headers["for-user-id"] = opts.forUserId;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // keep raw text
  }
  if (!res.ok) {
    console.error(`[xendit] ${method} ${url.pathname} failed [${res.status}]: ${text.slice(0, 400)}`);
  }
  return { ok: res.ok, status: res.status, data };
}
