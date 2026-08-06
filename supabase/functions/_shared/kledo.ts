// Shared Kledo API client for Edge Functions
// Auth: login (KLEDO_EMAIL / KLEDO_PASSWORD) -> token cached in kledo_auth_tokens (29 days)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const KLEDO_API_BASE = "https://rapatin.api.kledo.com/api/v1";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "app-client": "web",
  "X-App": "finance",
};

export type KledoResult = { ok: boolean; status: number; data: unknown };

function db() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function loginToKledo(): Promise<string | null> {
  const email = Deno.env.get("KLEDO_EMAIL");
  const password = Deno.env.get("KLEDO_PASSWORD");
  if (!email || !password) {
    console.error("[kledo] KLEDO_EMAIL / KLEDO_PASSWORD not configured");
    return null;
  }

  try {
    const res = await fetch(`${KLEDO_API_BASE}/authentication/singleLogin`, {
      method: "POST",
      headers: BASE_HEADERS,
      body: JSON.stringify({
        email,
        password,
        remember_me: 1,
        is_otp: 0,
        apple_identity_token: null,
      }),
    });
    if (!res.ok) {
      console.error("[kledo] login failed", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const result = await res.json();
    const token = result?.data?.data?.access_token;
    if (!token) {
      console.error("[kledo] login response missing token");
      return null;
    }
    return token as string;
  } catch (e) {
    console.error("[kledo] login error", e);
    return null;
  }
}

export async function invalidateKledoToken(): Promise<void> {
  try {
    await db()
      .from("kledo_auth_tokens")
      .delete()
      .gt("expires_at", new Date().toISOString());
  } catch (e) {
    console.error("[kledo] invalidate token error", e);
  }
}

export async function getKledoToken(): Promise<string | null> {
  const supabase = db();
  try {
    const { data: existing } = await supabase
      .from("kledo_auth_tokens")
      .select("access_token, expires_at")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing?.access_token) return existing.access_token as string;

    const token = await loginToKledo();
    if (!token) return null;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 29);
    await supabase
      .from("kledo_auth_tokens")
      .insert({ access_token: token, expires_at: expiresAt.toISOString() });
    await supabase
      .from("kledo_auth_tokens")
      .delete()
      .lt("expires_at", new Date().toISOString());

    return token;
  } catch (e) {
    console.error("[kledo] getKledoToken error", e);
    return await loginToKledo();
  }
}

async function rawFetch(
  token: string,
  method: string,
  path: string,
  opts: { query?: Record<string, unknown>; body?: unknown },
): Promise<KledoResult> {
  const url = new URL(`${KLEDO_API_BASE}${path.startsWith("/") ? path : `/${path}`}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: { ...BASE_HEADERS, Accept: "application/json", Authorization: `Bearer ${token}` },
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
    console.error(`[kledo] ${method} ${url.pathname} failed [${res.status}]: ${text.slice(0, 400)}`);
  }
  return { ok: res.ok, status: res.status, data };
}

/**
 * Call the Kledo API with cached token + one automatic re-login retry on 401/403.
 */
export async function kledoFetch(
  method: string,
  path: string,
  opts: { query?: Record<string, unknown>; body?: unknown } = {},
): Promise<KledoResult> {
  let token = await getKledoToken();
  if (!token) {
    return {
      ok: false,
      status: 500,
      data: { error: "Gagal login ke Kledo. Periksa secret KLEDO_EMAIL / KLEDO_PASSWORD." },
    };
  }

  let result = await rawFetch(token, method, path, opts);
  if (result.status === 401 || result.status === 403) {
    await invalidateKledoToken();
    token = await loginToKledo();
    if (!token) return result;
    result = await rawFetch(token, method, path, opts);
  }
  return result;
}
