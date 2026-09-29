// Forward a Duitku callback payload to the Member dashboard webhook.
export interface ForwardResult {
  ok: boolean;
  status: number | null;
  body: string;
  durationMs: number;
  error?: string;
  targetUrl: string | null;
}

export async function forwardToMember(payload: Record<string, string>): Promise<ForwardResult> {
  const targetUrl = Deno.env.get('MEMBER_DUITKU_WEBHOOK_URL') || null;
  const started = Date.now();
  if (!targetUrl) {
    return { ok: false, status: null, body: '', durationMs: 0, error: 'MEMBER_DUITKU_WEBHOOK_URL not configured', targetUrl };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Rapatin-Forwarded': 'duitku-callback',
      },
      body: new URLSearchParams(payload).toString(),
      signal: controller.signal,
    });
    const body = (await res.text()).slice(0, 5000);
    return { ok: res.ok, status: res.status, body, durationMs: Date.now() - started, targetUrl };
  } catch (e) {
    const msg = e instanceof Error ? (e.name === 'AbortError' ? 'Timeout 10s' : e.message) : String(e);
    return { ok: false, status: null, body: '', durationMs: Date.now() - started, error: msg, targetUrl };
  } finally {
    clearTimeout(timer);
  }
}
