// Shared Duitku (POP / createInvoice) helpers.
// Docs: https://docs.duitku.com/api/id/#permintaan-transaksi

// Switch to 'production' to go live (single place to change).
export const DUITKU_ENVIRONMENT: 'sandbox' | 'production' = 'sandbox';

export const DUITKU_BASE_URL = DUITKU_ENVIRONMENT === 'production'
  ? 'https://api-prod.duitku.com'
  : 'https://api-sandbox.duitku.com';

export function getDuitkuCredentials(): { merchantCode: string; apiKey: string } | null {
  const merchantCode = Deno.env.get('DUITKU_MERCHANT_CODE');
  const apiKey = Deno.env.get('DUITKU_API_KEY');
  if (!merchantCode || !apiKey) return null;
  return { merchantCode, apiKey };
}

async function sha256Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Header signature for createInvoice: SHA256(merchantCode + timestamp + apiKey) */
export async function createInvoiceSignature(
  merchantCode: string,
  timestamp: string,
  apiKey: string,
): Promise<string> {
  return await sha256Hex(merchantCode + timestamp + apiKey);
}

/** Callback signature: MD5(merchantCode + amount + merchantOrderId + apiKey) */
export async function callbackSignature(
  merchantCode: string,
  amount: string,
  merchantOrderId: string,
  apiKey: string,
): Promise<string> {
  const md5 = (await import('npm:js-md5@0.8.3')).default;
  return md5(`${merchantCode}${amount}${merchantOrderId}${apiKey}`);
}

export interface DuitkuInvoiceResult {
  ok: boolean;
  paymentUrl?: string;
  reference?: string;
  raw: unknown;
  error?: string;
}

export interface CreateDuitkuInvoiceParams {
  merchantOrderId: string;
  paymentAmount: number;
  productDetails: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  callbackUrl: string;
  returnUrl: string;
  expiryPeriod?: number;
}

export async function createDuitkuInvoice(
  params: CreateDuitkuInvoiceParams,
): Promise<DuitkuInvoiceResult> {
  const creds = getDuitkuCredentials();
  if (!creds) {
    return { ok: false, raw: null, error: 'DUITKU_MERCHANT_CODE / DUITKU_API_KEY not configured' };
  }

  const timestamp = Date.now().toString();
  const signature = await createInvoiceSignature(creds.merchantCode, timestamp, creds.apiKey);

  const body = {
    paymentAmount: Math.round(params.paymentAmount),
    merchantOrderId: params.merchantOrderId,
    productDetails: params.productDetails,
    customerVaName: params.customerName,
    email: params.email,
    phoneNumber: params.phoneNumber,
    callbackUrl: params.callbackUrl,
    returnUrl: params.returnUrl,
    expiryPeriod: params.expiryPeriod ?? 1440,
  };

  console.log('Calling Duitku createInvoice:', {
    environment: DUITKU_ENVIRONMENT,
    merchantOrderId: body.merchantOrderId,
    paymentAmount: body.paymentAmount,
  });

  try {
    const response = await fetch(`${DUITKU_BASE_URL}/api/merchant/createInvoice`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-duitku-signature': signature,
        'x-duitku-timestamp': timestamp,
        'x-duitku-merchantcode': creds.merchantCode,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text);
    } catch (_e) {
      data = { raw: text };
    }

    console.log('Duitku createInvoice response:', response.status, text);

    const paymentUrl = data.paymentUrl as string | undefined;
    if (!response.ok || !paymentUrl) {
      return {
        ok: false,
        raw: data,
        error: (data.Message || data.statusMessage || `HTTP ${response.status}`) as string,
      };
    }

    return {
      ok: true,
      paymentUrl,
      reference: data.reference as string | undefined,
      raw: data,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Duitku createInvoice error:', msg);
    return { ok: false, raw: null, error: msg };
  }
}
