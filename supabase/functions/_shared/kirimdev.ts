// Shared helper for Kirimdev (Meta WhatsApp Cloud API-compatible) senders.

export function formatPhoneE164(raw: string): string {
  let cleaned = (raw ?? "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.substring(1);
  if (!cleaned.startsWith("62")) cleaned = "62" + cleaned;
  return "+" + cleaned;
}

export function kirimdevUrl(): string {
  const phoneNumberId = Deno.env.get("KIRIMDEV_PHONE_NUMBER_ID");
  if (!phoneNumberId) throw new Error("KIRIMDEV_PHONE_NUMBER_ID not configured");
  return `https://api.kirimdev.com/v1/${phoneNumberId}/messages`;
}

export function kirimdevAuthHeader(): { Authorization: string } {
  const apiKey = Deno.env.get("KIRIMDEV_API_KEY");
  if (!apiKey) throw new Error("KIRIMDEV_API_KEY not configured");
  return { Authorization: `Bearer ${apiKey}` };
}

export async function kirimdevSendTemplate(opts: {
  to: string;
  name: string;
  languageCode?: string;
  components?: any[];
}): Promise<Response> {
  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    to: formatPhoneE164(opts.to),
    type: "template",
    template: {
      name: opts.name,
      language: { code: opts.languageCode ?? "id_ID" },
      ...(opts.components && opts.components.length ? { components: opts.components } : {}),
    },
  };
  return fetch(kirimdevUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...kirimdevAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
}

export async function kirimdevSendText(to: string, body: string): Promise<Response> {
  const payload = {
    messaging_product: "whatsapp",
    to: formatPhoneE164(to),
    type: "text",
    text: { body: body && body.length > 0 ? body : " " },
  };
  return fetch(kirimdevUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...kirimdevAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
}
