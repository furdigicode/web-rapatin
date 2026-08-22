// Shared helper: append raw Rapatin API request/response entries to guest_orders.rapatin_api_log
// deno-lint-ignore-file no-explicit-any

const MAX_ENTRIES = 20;

export interface RapatinLogEntry {
  at?: string;
  action: 'login' | 'create_schedule';
  source: string;
  ok: boolean;
  status?: number | null;
  request?: unknown;
  response?: unknown;
  error?: string | null;
  duration_ms?: number | null;
}

/** Remove credentials from anything we persist. */
export function redact(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const clone: Record<string, unknown> = Array.isArray(value)
    ? ({ ...(value as any) } as Record<string, unknown>)
    : { ...(value as Record<string, unknown>) };
  for (const key of Object.keys(clone)) {
    if (/password|token|authorization|secret|apikey|api_key/i.test(key)) {
      clone[key] = '[redacted]';
    } else if (clone[key] && typeof clone[key] === 'object') {
      clone[key] = redact(clone[key]);
    }
  }
  return clone;
}

/** Best-effort append. Never throws. */
export async function appendRapatinLog(
  supabase: any,
  orderId: string | null | undefined,
  entry: RapatinLogEntry,
): Promise<void> {
  if (!orderId) return;
  try {
    const payload = {
      at: entry.at ?? new Date().toISOString(),
      action: entry.action,
      source: entry.source,
      ok: entry.ok,
      status: entry.status ?? null,
      request: redact(entry.request ?? null),
      response: entry.response ?? null,
      error: entry.error ?? null,
      duration_ms: entry.duration_ms ?? null,
    };

    const { data } = await supabase
      .from('guest_orders')
      .select('rapatin_api_log')
      .eq('id', orderId)
      .maybeSingle();

    const existing = Array.isArray(data?.rapatin_api_log) ? data.rapatin_api_log : [];
    const next = [...existing, payload].slice(-MAX_ENTRIES);

    await supabase
      .from('guest_orders')
      .update({ rapatin_api_log: next })
      .eq('id', orderId);
  } catch (e) {
    console.error('appendRapatinLog failed (ignored):', e instanceof Error ? e.message : String(e));
  }
}

/** Try to parse raw text as JSON, otherwise return the raw string. */
export function parseMaybeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
