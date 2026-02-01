import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Kledo API Constants
const KLEDO_API_BASE = 'https://rapatin.api.kledo.com/api/v1';

const KLEDO_HEADERS = {
  'Content-Type': 'application/json',
  'app-client': 'web',
  'X-App': 'finance',
};

// Bank Transaction Constants
const KLEDO_BANK_TRANS = {
  trans_type_id: 12,
  bank_account_id: 1,
  contact_id: 36,
  finance_account_id: 121, // Akun pendapatan
};

// Expense Constants
const KLEDO_EXPENSE = {
  pay_from_finance_account_id: 1,
  contact_id: 3,
  status_id: 3,
  finance_account_id: 1459, // Akun beban MDR
};

/**
 * Calculate payment gateway fee based on payment method
 * All calculations use floor (truncate), not rounding
 */
function calculatePaymentFee(price: number, paymentMethod: string): { fee: number; methodName: string } {
  const method = paymentMethod.toUpperCase();
  
  // Virtual Account - all flat 4440
  if (method.includes('VA') || method.includes('VIRTUAL_ACCOUNT') || 
      method.includes('MANDIRI') || method.includes('BCA') || 
      method.includes('BNI') || method.includes('BRI') ||
      method.includes('PERMATA') || method.includes('CIMB') ||
      method.includes('BSI') || method.includes('BJB') ||
      method.includes('SAHABAT_SAMPOERNA') || method.includes('BANK')) {
    return { fee: 4440, methodName: 'Virtual Account' };
  }
  
  // QRIS or ShopeePay - 0.63% + VAT 11%
  if (method.includes('QRIS') || method.includes('SHOPEEPAY')) {
    const baseFee = Math.floor(price * 0.0063);
    const vat = Math.floor(baseFee * 0.11);
    const methodName = method.includes('SHOPEEPAY') ? 'ShopeePay' : 'QRIS';
    return { fee: baseFee + vat, methodName };
  }
  
  // DANA or OVO - 1.5% + VAT 11%
  if (method.includes('DANA') || method.includes('OVO')) {
    const baseFee = Math.floor(price * 0.015);
    const vat = Math.floor(baseFee * 0.11);
    const methodName = method.includes('DANA') ? 'DANA' : 'OVO';
    return { fee: baseFee + vat, methodName };
  }
  
  // Default: treat as QRIS rate
  const baseFee = Math.floor(price * 0.0063);
  const vat = Math.floor(baseFee * 0.11);
  return { fee: baseFee + vat, methodName: paymentMethod || 'Unknown' };
}

/**
 * Format date to YYYY-MM-DD for Kledo API
 */
function formatDateForKledo(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Invalidate cached token when it's rejected by Kledo
 */
async function invalidateCachedToken(supabase: ReturnType<typeof createClient>): Promise<void> {
  console.log("Invalidating cached Kledo token...");
  const { error } = await supabase
    .from('kledo_auth_tokens')
    .delete()
    .gt('expires_at', new Date().toISOString());
  
  if (error) {
    console.error("Failed to invalidate token:", error);
  } else {
    console.log("Cached token invalidated successfully");
  }
}

/**
 * Login to Kledo API and get access token
 */
async function loginToKledo(): Promise<string | null> {
  const email = Deno.env.get('KLEDO_EMAIL');
  const password = Deno.env.get('KLEDO_PASSWORD');

  if (!email || !password) {
    console.error("KLEDO_EMAIL or KLEDO_PASSWORD not configured");
    return null;
  }

  console.log("Logging in to Kledo API...");

  try {
    const response = await fetch(`${KLEDO_API_BASE}/authentication/singleLogin`, {
      method: 'POST',
      headers: KLEDO_HEADERS,
      body: JSON.stringify({
        email,
        password,
        remember_me: 1,
        is_otp: 0,
        apple_identity_token: null,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kledo login failed:", response.status, errorText);
      return null;
    }

    const result = await response.json();
    
    // Token is at result.data.data.access_token (nested structure)
    if (result.data?.data?.access_token) {
      console.log("Kledo login successful");
      return result.data.data.access_token;
    }

    console.error("Kledo login response missing token:", JSON.stringify(result).substring(0, 500));
    return null;
  } catch (error) {
    console.error("Kledo login error:", error);
    return null;
  }
}

/**
 * Get Kledo token with caching - reuse existing token if not expired
 * Token is valid for 30 days, we use 29 days as safety margin
 */
async function getKledoToken(supabase: ReturnType<typeof createClient>): Promise<string | null> {
  try {
    // 1. Check for existing valid token in database
    const { data: existingToken, error: fetchError } = await supabase
      .from('kledo_auth_tokens')
      .select('access_token, expires_at')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!fetchError && existingToken?.access_token) {
      console.log("Using cached Kledo token (expires:", existingToken.expires_at, ")");
      return existingToken.access_token;
    }

    // 2. No valid token found, login to get new one
    console.log("No valid cached token, performing fresh login...");
    const newToken = await loginToKledo();
    
    if (!newToken) {
      return null;
    }

    // 3. Save new token with 29-day expiry (safety margin from 30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 29);
    
    const { error: insertError } = await supabase
      .from('kledo_auth_tokens')
      .insert({
        access_token: newToken,
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error("Failed to cache token:", insertError);
      // Still return the token even if caching failed
    } else {
      console.log("New token cached, expires:", expiresAt.toISOString());
    }

    // 4. Cleanup old expired tokens
    const { error: cleanupError } = await supabase
      .from('kledo_auth_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (cleanupError) {
      console.log("Token cleanup warning:", cleanupError.message);
    }

    return newToken;
  } catch (error) {
    console.error("getKledoToken error:", error);
    // Fallback to direct login if caching mechanism fails
    return await loginToKledo();
  }
}

/**
 * Check if error is an authentication error
 */
function isAuthenticationError(status: number, message: string): boolean {
  return status === 401 || 
         message.toLowerCase().includes('unauthenticated') ||
         message.toLowerCase().includes('unauthorized');
}

/**
 * Create bank transaction in Kledo (penerimaan)
 */
async function createBankTransaction(
  token: string,
  transDate: string,
  memo: string,
  amount: number
): Promise<{ success: boolean; refNumber?: string; error?: string; isAuthError?: boolean }> {
  console.log("Creating Kledo bank transaction:", { transDate, memo, amount });

  try {
    const response = await fetch(`${KLEDO_API_BASE}/finance/bankTrans`, {
      method: 'POST',
      headers: {
        ...KLEDO_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        trans_date: transDate,
        trans_type_id: KLEDO_BANK_TRANS.trans_type_id,
        bank_account_id: KLEDO_BANK_TRANS.bank_account_id,
        contact_id: KLEDO_BANK_TRANS.contact_id,
        memo,
        items: [
          {
            finance_account_id: KLEDO_BANK_TRANS.finance_account_id,
            desc: 'Quick Order',
            amount,
          },
        ],
      }),
    });

    const result = await response.json();
    console.log("Kledo bank transaction response:", JSON.stringify(result));

    if (!response.ok) {
      const errorMessage = result.message || `HTTP ${response.status}`;
      const isAuthError = isAuthenticationError(response.status, errorMessage);
      return { success: false, error: errorMessage, isAuthError };
    }

    // Simpan ref_number dari response Kledo
    if (result.data?.ref_number) {
      return { success: true, refNumber: result.data.ref_number };
    }

    // Fallback ke id jika ref_number tidak ada
    if (result.data?.id) {
      return { success: true, refNumber: `BANK/${result.data.id}` };
    }

    return { success: false, error: 'No ref_number in response' };
  } catch (error) {
    console.error("Kledo bank transaction error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create expense in Kledo (biaya MDR)
 */
async function createExpense(
  token: string,
  transDate: string,
  memo: string,
  feeAmount: number,
  methodName: string
): Promise<{ success: boolean; id?: string; error?: string; isAuthError?: boolean }> {
  console.log("Creating Kledo expense:", { transDate, memo, feeAmount, methodName });

  try {
    const response = await fetch(`${KLEDO_API_BASE}/finance/expenses`, {
      method: 'POST',
      headers: {
        ...KLEDO_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        trans_date: transDate,
        pay_from_finance_account_id: KLEDO_EXPENSE.pay_from_finance_account_id,
        contact_id: KLEDO_EXPENSE.contact_id,
        status_id: KLEDO_EXPENSE.status_id,
        memo,
        items: [
          {
            finance_account_id: KLEDO_EXPENSE.finance_account_id,
            desc: `Biaya ${methodName}`,
            amount: feeAmount,
          },
        ],
      }),
    });

    const result = await response.json();
    console.log("Kledo expense response:", JSON.stringify(result));

    if (!response.ok) {
      const errorMessage = result.message || `HTTP ${response.status}`;
      const isAuthError = isAuthenticationError(response.status, errorMessage);
      return { success: false, error: errorMessage, isAuthError };
    }

    if (result.data?.id) {
      return { success: true, id: result.data.id.toString() };
    }

    return { success: false, error: 'No expense ID in response' };
  } catch (error) {
    console.error("Kledo expense error:", error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing Kledo sync for order:", orderId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch order details
    const { data: order, error: fetchError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      console.error("Order not found:", orderId, fetchError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check idempotency - skip if already synced
    if (order.kledo_invoice_id) {
      console.log("Order already synced to Kledo:", order.kledo_invoice_id);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Already synced',
          kledo_invoice_id: order.kledo_invoice_id 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate order is paid
    if (order.payment_status !== 'paid') {
      console.log("Order not paid, skipping Kledo sync:", order.payment_status);
      return new Response(
        JSON.stringify({ error: 'Order not paid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare data - gunakan order_number untuk memo
    const transDate = formatDateForKledo(order.paid_at || order.created_at);
    const memo = order.order_number || order.access_slug || orderId;
    const amount = order.price;
    const paymentMethod = order.payment_method || 'Unknown';

    // Calculate payment fee
    const { fee, methodName } = calculatePaymentFee(amount, paymentMethod);
    console.log("Calculated fee:", { amount, paymentMethod, fee, methodName });

    // Retry mechanism for auth errors
    const MAX_RETRIES = 1;
    let retryCount = 0;
    let token: string | null = null;

    // Helper function to get token with proper error handling
    async function ensureToken(): Promise<string | null> {
      token = await getKledoToken(supabase);
      if (!token) {
        const errorMsg = 'Failed to login to Kledo';
        await supabase
          .from('guest_orders')
          .update({ kledo_sync_error: errorMsg })
          .eq('id', orderId);
      }
      return token;
    }

    // Execute Kledo sync with retry logic
    async function executeKledoSync(): Promise<Response> {
      // Get token if not available
      if (!token) {
        token = await ensureToken();
        if (!token) {
          return new Response(
            JSON.stringify({ error: 'Failed to login to Kledo' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Create bank transaction
      const bankTransResult = await createBankTransaction(token, transDate, memo, amount);
      
      // Check for auth error and retry if possible
      if (!bankTransResult.success && bankTransResult.isAuthError && retryCount < MAX_RETRIES) {
        console.log(`Auth error detected on bank transaction, refreshing token and retrying... (attempt ${retryCount + 1})`);
        retryCount++;
        
        // Invalidate old token
        await invalidateCachedToken(supabase);
        
        // Force fresh login
        token = null;
        
        // Retry
        return executeKledoSync();
      }
      
      if (!bankTransResult.success) {
        const errorMsg = `Bank transaction failed: ${bankTransResult.error}`;
        await supabase
          .from('guest_orders')
          .update({ kledo_sync_error: errorMsg })
          .eq('id', orderId);
        
        return new Response(
          JSON.stringify({ error: errorMsg }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create expense for payment gateway fee
      const expenseResult = await createExpense(token!, transDate, memo, fee, methodName);
      
      // Check for auth error on expense and retry if possible
      if (!expenseResult.success && expenseResult.isAuthError && retryCount < MAX_RETRIES) {
        console.log(`Auth error detected on expense, refreshing token and retrying... (attempt ${retryCount + 1})`);
        retryCount++;
        
        // Invalidate old token
        await invalidateCachedToken(supabase);
        
        // Force fresh login
        token = null;
        
        // Note: Bank transaction already succeeded, so we only retry the expense
        const newToken = await ensureToken();
        if (!newToken) {
          // Save bank transaction result even if we can't get a new token
          await supabase
            .from('guest_orders')
            .update({ 
              kledo_invoice_id: bankTransResult.refNumber,
              kledo_sync_error: 'Expense failed: Token refresh failed after bank transaction',
              kledo_synced_at: new Date().toISOString()
            })
            .eq('id', orderId);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              warning: 'Expense failed: Token refresh failed',
              kledo_invoice_id: bankTransResult.refNumber 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Retry expense only
        const retryExpenseResult = await createExpense(newToken, transDate, memo, fee, methodName);
        
        if (!retryExpenseResult.success) {
          const errorMsg = `Expense failed after retry: ${retryExpenseResult.error}`;
          await supabase
            .from('guest_orders')
            .update({ 
              kledo_invoice_id: bankTransResult.refNumber,
              kledo_sync_error: errorMsg,
              kledo_synced_at: new Date().toISOString()
            })
            .eq('id', orderId);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              warning: errorMsg,
              kledo_invoice_id: bankTransResult.refNumber 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Retry succeeded
        await supabase
          .from('guest_orders')
          .update({ 
            kledo_invoice_id: bankTransResult.refNumber,
            kledo_synced_at: new Date().toISOString(),
            kledo_sync_error: null
          })
          .eq('id', orderId);

        console.log("Kledo sync completed successfully after expense retry:", {
          orderId,
          memo,
          bankTransRefNumber: bankTransResult.refNumber,
          expenseId: retryExpenseResult.id,
        });

        return new Response(
          JSON.stringify({ 
            success: true,
            kledo_invoice_id: bankTransResult.refNumber,
            kledo_expense_id: retryExpenseResult.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!expenseResult.success) {
        // Bank transaction succeeded but expense failed - still save the ref_number
        const errorMsg = `Expense failed: ${expenseResult.error}`;
        await supabase
          .from('guest_orders')
          .update({ 
            kledo_invoice_id: bankTransResult.refNumber,
            kledo_sync_error: errorMsg,
            kledo_synced_at: new Date().toISOString()
          })
          .eq('id', orderId);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            warning: errorMsg,
            kledo_invoice_id: bankTransResult.refNumber 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update order with success - simpan ref_number ke kledo_invoice_id
      await supabase
        .from('guest_orders')
        .update({ 
          kledo_invoice_id: bankTransResult.refNumber,
          kledo_synced_at: new Date().toISOString(),
          kledo_sync_error: null
        })
        .eq('id', orderId);

      console.log("Kledo sync completed successfully:", {
        orderId,
        memo,
        bankTransRefNumber: bankTransResult.refNumber,
        expenseId: expenseResult.id,
      });

      return new Response(
        JSON.stringify({ 
          success: true,
          kledo_invoice_id: bankTransResult.refNumber,
          kledo_expense_id: expenseResult.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Execute the sync
    return await executeKledoSync();

  } catch (error) {
    console.error("Kledo sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
