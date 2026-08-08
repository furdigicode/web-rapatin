// Xendit MCP tools: definitions + handler (dipakai oleh mcp-rapatin)
import { xenditFetch, type XenditResult } from "./xendit.ts";

const CURRENCIES = ["IDR", "PHP", "USD", "VND", "THB", "MYR", "SGD", "EUR", "GBP", "HKD", "AUD"];

const TRANSACTION_TYPES = [
  "ADJUSTMENT_ADD", "ADJUSTMENT_DEDUCT", "BNPL_PARTNER_SETTLEMENT_CREDIT",
  "BNPL_PARTNER_SETTLEMENT_DEBIT", "CASHBACK_FEE", "CASHBACK_VAT",
  "CHARGEBACK", "CONVERSION", "DISBURSEMENT", "FOREX_DEDUCTION",
  "FOREX_DEPOSIT", "IN_PERSON_PAYMENT", "LOAN_REPAYMENT", "OTHER",
  "PAYMENT", "REFUND", "REMITTANCE", "REMITTANCE_COLLECTION_PAYMENT",
  "REMITTANCE_PAYOUT", "RESERVES_HOLD", "RESERVES_RELEASE", "TOPUP",
  "TRANSFER_IN", "TRANSFER_OUT", "WITHDRAWAL",
];

const CHANNEL_CATEGORIES = [
  "BANK", "CARDS", "CARDLESS_CREDIT", "CASH", "DIRECT_DEBIT",
  "EWALLET", "PAYLATER", "QR_CODE", "RETAIL_OUTLET",
  "VIRTUAL_ACCOUNT", "XENPLATFORM", "OTHER",
];

const forUserId = {
  type: "string",
  description: "Sub-account user ID (hanya untuk xenPlatform), dikirim sebagai header for-user-id.",
};

export const XENDIT_TOOLS = [
  {
    name: "xendit_get_balance",
    description:
      "Ambil saldo akun Xendit. Bisa lihat saldo CASH (tersedia untuk withdraw/disbursement) atau HOLDING (dana yang masih ditahan). Mendukung filter currency dan historical balance pada timestamp tertentu.",
    inputSchema: {
      type: "object",
      properties: {
        account_type: {
          type: "string",
          enum: ["CASH", "HOLDING"],
          default: "CASH",
          description: "Tipe saldo. CASH = dana tersedia, HOLDING = dana yang masih ditahan.",
        },
        currency: {
          type: "string",
          enum: CURRENCIES,
          description: "Filter mata uang. Wajib untuk akun multi-currency.",
        },
        at_timestamp: {
          type: "string",
          description: "ISO 8601 timestamp untuk melihat saldo pada waktu tertentu. Contoh: 2025-01-01T00:00:00.000Z",
        },
        for_user_id: forUserId,
      },
    },
  },
  {
    name: "xendit_list_transactions",
    description:
      "Ambil daftar transaksi Xendit dengan berbagai filter. Bisa filter berdasarkan tipe (PAYMENT, DISBURSEMENT, REFUND, dll), status, channel, tanggal, amount, dan reference ID. Hasil dipaginasi.",
    inputSchema: {
      type: "object",
      properties: {
        types: {
          type: "array",
          items: { type: "string", enum: TRANSACTION_TYPES },
          description: "Filter tipe transaksi.",
        },
        statuses: {
          type: "array",
          items: { type: "string", enum: ["PENDING", "SUCCESS", "FAILED", "REVERSED"] },
          description: "Filter status transaksi.",
        },
        channel_categories: {
          type: "array",
          items: { type: "string", enum: CHANNEL_CATEGORIES },
          description: "Filter channel pembayaran.",
        },
        currency: { type: "string", enum: CURRENCIES, description: "Filter mata uang." },
        reference_id: { type: "string", description: "Cari berdasarkan reference ID (exact match, case-sensitive)." },
        product_id: { type: "string", description: "Cari berdasarkan product ID (exact match)." },
        account_identifier: { type: "string", description: "Cari berdasarkan account identifier (e.g. nomor VA)." },
        amount: { type: "number", description: "Filter berdasarkan jumlah transaksi (exact match)." },
        created_gte: { type: "string", description: "Transaksi dibuat >= tanggal ini (ISO 8601)." },
        created_lte: { type: "string", description: "Transaksi dibuat <= tanggal ini (ISO 8601)." },
        updated_gte: { type: "string", description: "Transaksi diupdate >= tanggal ini (ISO 8601)." },
        updated_lte: { type: "string", description: "Transaksi diupdate <= tanggal ini (ISO 8601)." },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          default: 10,
          description: "Jumlah maksimal transaksi per halaman.",
        },
        after_id: { type: "string", description: "ID transaksi terakhir dari halaman sebelumnya (untuk next page)." },
        before_id: { type: "string", description: "ID transaksi pertama dari halaman berikutnya (untuk previous page)." },
        for_user_id: forUserId,
      },
    },
  },
  {
    name: "xendit_get_transaction",
    description: "Ambil detail satu transaksi Xendit berdasarkan transaction ID.",
    inputSchema: {
      type: "object",
      properties: {
        transaction_id: {
          type: "string",
          description: "Transaction ID Xendit. Contoh: txn_a765a3f0-34c0-41ee-8686-bca11835ebdc",
        },
        for_user_id: forUserId,
      },
      required: ["transaction_id"],
    },
  },
  {
    name: "xendit_generate_report",
    description:
      "Generate laporan Xendit (BALANCE_HISTORY, TRANSACTIONS, UPCOMING_TRANSACTIONS, DETAILED_TRANSACTIONS) untuk rentang tanggal tertentu. Report diproses asinkron; gunakan xendit_get_report untuk cek status dan URL unduhan.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["BALANCE_HISTORY", "TRANSACTIONS", "UPCOMING_TRANSACTIONS", "DETAILED_TRANSACTIONS"],
          description: "Tipe laporan yang akan di-generate.",
        },
        filter: {
          type: "object",
          properties: {
            from: { type: "string", description: "Tanggal mulai (ISO 8601). Contoh: 2025-01-01T00:00:00.000Z" },
            to: { type: "string", description: "Tanggal akhir (ISO 8601). Contoh: 2025-01-31T23:59:59.000Z" },
          },
          required: ["from", "to"],
        },
        format: {
          type: "string",
          enum: ["CSV", "XLSX"],
          default: "CSV",
          description: "Format file output.",
        },
        currency: {
          type: "string",
          enum: CURRENCIES,
          description: "Mata uang laporan. Wajib untuk BALANCE_HISTORY.",
        },
        report_version: {
          type: "string",
          enum: ["VERSION_2"],
          description: "Gunakan VERSION_2 untuk format report terbaru.",
        },
        for_user_id: forUserId,
      },
      required: ["type", "filter"],
    },
  },
  {
    name: "xendit_get_report",
    description: "Cek status report Xendit dan ambil URL unduhan bila sudah COMPLETED.",
    inputSchema: {
      type: "object",
      properties: {
        report_id: {
          type: "string",
          description: "ID report dari Xendit. Contoh: report_5c1b34a2-6ceb-4c24-aba9-c836bac82b28",
        },
      },
      required: ["report_id"],
    },
  },
];

function pick(args: Record<string, any>, keys: string[]) {
  const o: Record<string, unknown> = {};
  for (const k of keys) if (args[k] !== undefined) o[k] = args[k];
  return o;
}

export async function handleXenditTool(
  name: string,
  args: Record<string, any>,
): Promise<XenditResult | null> {
  const forUser = args.for_user_id as string | undefined;

  switch (name) {
    case "xendit_get_balance":
      return await xenditFetch("GET", "/balance", {
        query: pick(args, ["account_type", "currency", "at_timestamp"]),
        forUserId: forUser,
      });

    case "xendit_list_transactions": {
      const query: Record<string, unknown> = pick(args, [
        "types",
        "statuses",
        "channel_categories",
        "currency",
        "reference_id",
        "product_id",
        "account_identifier",
        "amount",
        "limit",
        "after_id",
        "before_id",
      ]);
      if (args.created_gte !== undefined) query["created[gte]"] = args.created_gte;
      if (args.created_lte !== undefined) query["created[lte]"] = args.created_lte;
      if (args.updated_gte !== undefined) query["updated[gte]"] = args.updated_gte;
      if (args.updated_lte !== undefined) query["updated[lte]"] = args.updated_lte;
      return await xenditFetch("GET", "/transactions", { query, forUserId: forUser });
    }

    case "xendit_get_transaction":
      if (!args.transaction_id) {
        return { ok: false, status: 400, data: { error: "transaction_id wajib diisi." } };
      }
      return await xenditFetch("GET", `/transactions/${args.transaction_id}`, { forUserId: forUser });

    case "xendit_generate_report":
      if (!args.type || !args.filter) {
        return { ok: false, status: 400, data: { error: "type dan filter wajib diisi." } };
      }
      return await xenditFetch("POST", "/reports", {
        body: pick(args, ["type", "filter", "format", "currency", "report_version"]),
        forUserId: forUser,
      });

    case "xendit_get_report":
      if (!args.report_id) {
        return { ok: false, status: 400, data: { error: "report_id wajib diisi." } };
      }
      return await xenditFetch("GET", `/reports/${args.report_id}`);

    default:
      return null;
  }
}
