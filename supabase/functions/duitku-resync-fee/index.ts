import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkDuitkuTransaction } from "../_shared/duitku.ts";
import { getKledoToken, invalidateKledoToken, KLEDO_API_BASE } from "../_shared/kledo.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Duitku expense config — must match kledo-sync KLEDO_EXPENSE_DUITKU
const KLEDO_EXPENSE_DUITKU = {
  pay_from_finance_account_id: 1463,
  contact_id: 3,
  status_id: 3,
  finance_account_id: 1459,
};

function formatDateForKledo(dateStr: string): string {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function createExpense(
  token: string,
  transDate: string,
  memo: string,
  feeAmount: number,
  methodName: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch(`${KLEDO_API_BASE}/finance/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-client': 'web',
        'X-App': 'finance',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        trans_date: transDate,
        pay_from_finance_account_id: KLEDO_EXPENSE_DUITKU.pay_from_finance_account_id,
        contact_id: KLEDO_EXPENSE_DUITKU.contact_id,
        status_id: KLEDO_EXPENSE_DUITKU.status_id,
        memo,
        items: [
          {
            finance_account_id: KLEDO_EXPENSE_DUITKU.finance_account_id,
            desc: `Biaya ${methodName}`,
            amount: feeAmount,
          },
        ],
      }),
    });

    const result = await response.json();
    console.log('Kledo expense response:', JSON.stringify(result));

    if (!response.ok) {
      return { success: false, error: result.message || `HTTP ${response.status}` };
    }

    if (result.data?.id) {
      return { success: true, id: result.data.id.toString() };
    }
    return { success: false, error: 'No expense ID returned' };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Find all paid Duitku orders with non-null duitku_fee that already have kledo_invoice_id
    // (bank transaction exists) but we need to check if expense was created
    // We'll look for orders where duitku_fee > 0 and kledo_invoice_id is set
    const { data: orders, error: fetchError } = await supabase
      .from('guest_orders')
      .select('id, order_number, duitku_merchant_order_id, duitku_fee, payment_method, price, kledo_invoice_id, paid_at, kledo_sync_error')
      .eq('payment_gateway', 'duitku')
      .eq('payment_status', 'paid')
      .not('duitku_fee', 'is', null)
      .gt('duitku_fee', 0)
      .not('kledo_invoice_id', 'is', null)
      .order('paid_at', { ascending: true });

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Found ${orders.length} Duitku orders needing expense creation`);

    let token = await getKledoToken();
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Failed to get Kledo token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const results: Array<{ order_number: string; fee: number; expense_created: boolean; expense_id?: string; error?: string }> = [];

    for (const order of orders) {
      const transDate = formatDateForKledo(order.paid_at || order.created_at);
      const memo = order.order_number;
      const fee = Number(order.duitku_fee);
      const methodName = `Duitku${order.payment_method ? ` (${order.payment_method})` : ''}`;

      console.log(`Creating expense for ${order.order_number}:`, { transDate, memo, fee, methodName });

      let expenseResult = await createExpense(token, transDate, memo, fee, methodName);

      // Retry once on auth error
      if (!expenseResult.success && expenseResult.error?.toLowerCase().includes('unauthor')) {
        console.log('Auth error, refreshing token...');
        await invalidateKledoToken();
        token = await getKledoToken();
        if (token) {
          expenseResult = await createExpense(token, transDate, memo, fee, methodName);
        }
      }

      results.push({
        order_number: order.order_number,
        fee,
        expense_created: expenseResult.success,
        expense_id: expenseResult.id,
        error: expenseResult.error,
      });

      if (expenseResult.success) {
        console.log(`Expense created for ${order.order_number}: ${expenseResult.id}`);
      } else {
        console.error(`Expense failed for ${order.order_number}: ${expenseResult.error}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
