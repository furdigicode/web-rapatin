// Shared BirdSend API client for Edge Functions
// Docs: https://developer.birdsend.co/api-documentation.html
const BASE_URL = "https://api.birdsend.co/v1";

export type BirdsendResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

function token(): string {
  const t = Deno.env.get("BIRDSEND_API_TOKEN") || "";
  if (!t) {
    throw new Error(
      "BIRDSEND_API_TOKEN belum diset di Supabase Secrets. Buat access token di BirdSend Developer area lalu simpan sebagai BIRDSEND_API_TOKEN.",
    );
  }
  return t;
}

export async function birdsendFetch(
  method: string,
  path: string,
  opts: { query?: Record<string, unknown>; body?: unknown } = {},
): Promise<BirdsendResult> {
  const url = new URL(`${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
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
    console.error(`[birdsend] ${method} ${url.pathname} failed [${res.status}]: ${text}`);
  }

  return { ok: res.ok, status: res.status, data };
}
