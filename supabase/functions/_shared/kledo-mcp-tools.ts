// Kledo MCP tools: definitions + handler (dipakai oleh mcp-rapatin)
import { kledoFetch } from "./kledo.ts";

export const KLEDO_TOOLS = [
  {
    "name": "kledo_create_contact",
    "description": "Create a new contact in Kledo. Used when a Rapatin user doesn't have a kledo_contact_id yet. Returns the contact_id to store in users.kledo_contact_id.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Contact name (user's full name)"
        },
        "type_id": {
          "type": "integer",
          "description": "Contact type. Always 3 for Rapatin users.",
          "default": 3
        },
        "company": {
          "type": "string",
          "description": "Company name (optional)"
        },
        "address": {
          "type": "string",
          "description": "Address (optional)"
        },
        "phone": {
          "type": "string",
          "description": "Phone number"
        },
        "email": {
          "type": "string",
          "description": "Email address"
        }
      },
      "required": [
        "name",
        "type_id"
      ]
    }
  },
  {
    "name": "kledo_get_contacts",
    "description": "List or search contacts in Kledo. Use to verify if a contact already exists before creating.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "description": "Page number for pagination",
          "default": 1
        },
        "per_page": {
          "type": "integer",
          "description": "Results per page",
          "default": 25
        },
        "search": {
          "type": "string",
          "description": "Search by name, email, or phone"
        }
      }
    }
  },
  {
    "name": "kledo_get_contact",
    "description": "Get a single contact by ID. Use to verify kledo_contact_id is valid.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Contact ID in Kledo"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "kledo_create_bank_transaction",
    "description": "Create a bank transaction (Terima Dana or Kirim Dana) in Kledo. trans_type_id 12 = Terima Dana (order balance top-up), trans_type_id 11 = Kirim Dana (withdraw disbursement). bank_account_id 1 = Xendit.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "trans_date": {
          "type": "string",
          "format": "date",
          "description": "Transaction date (YYYY-MM-DD)"
        },
        "trans_type_id": {
          "type": "integer",
          "enum": [
            11,
            12
          ],
          "description": "11 = Kirim Dana (withdraw), 12 = Terima Dana (top-up)"
        },
        "bank_account_id": {
          "type": "integer",
          "description": "Bank account ID. 1 = Xendit.",
          "default": 1
        },
        "contact_id": {
          "type": "integer",
          "description": "Kledo contact_id of the user"
        },
        "memo": {
          "type": "string",
          "description": "Reference number (order_number e.g. OR5562, or withdraw_id e.g. WD-0003-2511030013)"
        },
        "items": {
          "type": "array",
          "description": "Line items. For Terima Dana: item 1 = Saldo Pelanggan (1460), item 2 = Payment Fee (156) if > 0. For Kirim Dana: item 1 = Saldo Pelanggan (1460).",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": {
                "type": "integer",
                "description": "1460 = Saldo Pelanggan, 156 = Pendapatan Lainnya/Service Charge"
              },
              "desc": {
                "type": "string",
                "description": "e.g. 'Top Up Saldo', 'Payment fee QRIS', 'Withdraw Saldo Pelanggan'"
              },
              "amount": {
                "type": "number",
                "description": "Amount"
              },
              "amount_after_tax": {
                "type": "number",
                "description": "Amount after tax (same as amount if no tax)"
              }
            },
            "required": [
              "finance_account_id",
              "desc",
              "amount",
              "amount_after_tax"
            ]
          }
        }
      },
      "required": [
        "trans_date",
        "trans_type_id",
        "bank_account_id",
        "contact_id",
        "memo",
        "items"
      ]
    }
  },
  {
    "name": "kledo_get_bank_transactions",
    "description": "List bank transactions (mutasi Kas & Bank). Use to verify terima/kirim dana recorded correctly or audit transaction history.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "default": 1
        },
        "per_page": {
          "type": "integer",
          "default": 25
        },
        "bank_account_id": {
          "type": "integer",
          "description": "Filter by bank account. 1 = Xendit."
        },
        "trans_type_id": {
          "type": "integer",
          "description": "Filter: 11 = Kirim Dana, 12 = Terima Dana"
        },
        "search": {
          "type": "string",
          "description": "Search by memo/reference"
        },
        "start_date": {
          "type": "string",
          "format": "date",
          "description": "Filter from date (YYYY-MM-DD)"
        },
        "end_date": {
          "type": "string",
          "format": "date",
          "description": "Filter to date (YYYY-MM-DD)"
        }
      }
    }
  },
  {
    "name": "kledo_get_bank_transaction",
    "description": "Get detail of a single bank transaction by ID.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Bank transaction ID"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "kledo_create_expense",
    "description": "Create an expense in Kledo. Used to record Xendit fees: payment gateway fee on top-up (variable per method) or disbursement fee on withdraw (Rp 2.500 + PPN). contact_id always 3 (Xendit). Tarif: VA Rp 4.000 flat, QRIS/ShopeePay 0.63%, Dana/LinkAja 1.5%. Amount includes PPN 11% via floor(fee + fee * 0.11).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "trans_date": {
          "type": "string",
          "format": "date",
          "description": "Transaction date (YYYY-MM-DD)"
        },
        "pay_from_finance_account_id": {
          "type": "integer",
          "description": "Payment source. 1 = Xendit.",
          "default": 1
        },
        "contact_id": {
          "type": "integer",
          "description": "Always 3 (Xendit) for gateway fees.",
          "default": 3
        },
        "status_id": {
          "type": "integer",
          "description": "3 = Paid.",
          "default": 3
        },
        "memo": {
          "type": "string",
          "description": "Reference (order_number or #withdraw_id)"
        },
        "items": {
          "type": "array",
          "description": "Expense line items",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": {
                "type": "integer",
                "description": "1459 = Biaya Payment Gateway"
              },
              "tax_id": {
                "type": "integer",
                "description": "1 = PPN 11%"
              },
              "desc": {
                "type": "string",
                "description": "e.g. 'Biaya Xendit' or 'Disbursement Fee'"
              },
              "amount": {
                "type": "number",
                "description": "Fee amount (after PPN calculation)"
              },
              "amount_after_tax": {
                "type": "number",
                "description": "Same as amount (PPN already included in calculation)"
              }
            },
            "required": [
              "finance_account_id",
              "desc",
              "amount"
            ]
          }
        }
      },
      "required": [
        "trans_date",
        "pay_from_finance_account_id",
        "contact_id",
        "status_id",
        "memo",
        "items"
      ]
    }
  },
  {
    "name": "kledo_get_expenses",
    "description": "List expenses. Use to verify Xendit fees are recorded or find missing expense entries.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "default": 1
        },
        "per_page": {
          "type": "integer",
          "default": 25
        },
        "search": {
          "type": "string",
          "description": "Search by memo/reference"
        },
        "start_date": {
          "type": "string",
          "format": "date"
        },
        "end_date": {
          "type": "string",
          "format": "date"
        },
        "contact_id": {
          "type": "integer",
          "description": "Filter by contact. 3 = Xendit."
        }
      }
    }
  },
  {
    "name": "kledo_get_expense",
    "description": "Get detail of a single expense by ID.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Expense ID"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "kledo_create_invoice",
    "description": "Create an invoice (tagihan penjualan) in Kledo. Used for: (1) Schedule revenue with liability/bonus split, (2) Withdraw fee revenue Rp 3.000. Always LUNAS (status_id 3). For schedules: additional_discount_amount = bonus portion, witholding_amount = liability portion.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "trans_date": {
          "type": "string",
          "format": "date",
          "description": "Transaction date (YYYY-MM-DD)"
        },
        "due_date": {
          "type": "string",
          "format": "date",
          "description": "Due date (same as trans_date)"
        },
        "contact_id": {
          "type": "integer",
          "description": "Kledo contact_id of the user"
        },
        "status_id": {
          "type": "integer",
          "description": "3 = LUNAS (paid).",
          "default": 3
        },
        "memo": {
          "type": "string",
          "description": "Reference (meeting_id for schedules, withdraw_id for withdraw fee)"
        },
        "items": {
          "type": "array",
          "description": "Invoice line items",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": {
                "type": "integer",
                "description": "Revenue account: 3=Meeting100, 4=Meeting300, 5=Meeting500, 6=Meeting1000, 7=Rapatin Fee"
              },
              "desc": {
                "type": "string",
                "description": "Description. For schedules: '{topic} {date} {time}'. For withdraw: 'Withdraw Fee'"
              },
              "qty": {
                "type": "integer",
                "description": "Quantity (number of occurrences for recurring)",
                "default": 1
              },
              "price": {
                "type": "number",
                "description": "Price per unit"
              },
              "amount": {
                "type": "number",
                "description": "Total amount (qty * price)"
              },
              "unit_id": {
                "type": "integer",
                "description": "2 = Slot (schedules), 3 = Trx (withdraw fee)"
              }
            },
            "required": [
              "finance_account_id",
              "desc",
              "qty",
              "price",
              "amount",
              "unit_id"
            ]
          }
        },
        "additional_discount_amount": {
          "type": "number",
          "description": "Portion paid from bonus/non-liability. Recorded as discount, does NOT reduce Saldo Pelanggan. 0 or omit if full liability."
        },
        "witholding_amount": {
          "type": "number",
          "description": "Portion paid from liability. Reduces Saldo Pelanggan (1460)."
        },
        "witholding_account_id": {
          "type": "integer",
          "description": "1460 = Saldo Pelanggan.",
          "default": 1460
        }
      },
      "required": [
        "trans_date",
        "due_date",
        "contact_id",
        "status_id",
        "memo",
        "items"
      ]
    }
  },
  {
    "name": "kledo_get_invoices",
    "description": "List invoices. Use to verify schedule revenue or find invoice by ref_number/memo.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "default": 1
        },
        "per_page": {
          "type": "integer",
          "default": 25
        },
        "search": {
          "type": "string",
          "description": "Search by memo or ref_number (e.g. INV/2026/08/06/3001)"
        },
        "start_date": {
          "type": "string",
          "format": "date"
        },
        "end_date": {
          "type": "string",
          "format": "date"
        },
        "contact_id": {
          "type": "integer",
          "description": "Filter by contact"
        }
      }
    }
  },
  {
    "name": "kledo_get_invoice",
    "description": "Get detail of a single invoice by ID. Returns ref_number, items, discount, withholding breakdown.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Invoice ID"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "kledo_create_manual_journal",
    "description": "Create a manual journal entry (POST /finance/manualJournals). Required: trans_date (YYYY-MM-DD), memo, items[] (each with finance_account_id, desc, amount). Positive amount = Debit, negative = Credit, and the sum of all item amounts MUST equal 0. Used to reverse revenue when schedule is deleted (refund): Debit Pendapatan (121, positive) + Credit Saldo Pelanggan (1460, negative). Skip if schedule was full from_bonus (no Saldo Pelanggan movement on create). Response returns data.id and data.ref_number (e.g. JURNAL/2026/08/07/177).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "trans_date": {
          "type": "string",
          "format": "date",
          "description": "Refund date (YYYY-MM-DD)"
        },
        "memo": {
          "type": "string",
          "description": "Format: 'Refund Meeting ID {meeting_id} - {occurrence_id} - [{kledo_ref_number}]'. Use [NO REF] if no ref_number."
        },
        "items": {
          "type": "array",
          "description": "Journal entries. Positive = Debit, Negative = Credit. Sum must = 0.",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": {
                "type": "integer",
                "description": "1460 = Saldo Pelanggan (credit/negative), 121 = Pendapatan (debit/positive)"
              },
              "desc": {
                "type": "string",
                "description": "'Saldo kembali karena penghapusan jadwal' for 1460, 'Kurangi pendapatan {ref_number}' for 121"
              },
              "amount": {
                "type": "number",
                "description": "Positive = Debit, Negative = Credit"
              }
            },
            "required": [
              "finance_account_id",
              "desc",
              "amount"
            ]
          }
        }
      },
      "required": [
        "trans_date",
        "memo",
        "items"
      ]
    }
  },
  {
    "name": "kledo_get_manual_journals",
    "description": "List manual journals (GET /finance/manualJournals). Use to verify refund journals or audit reversals. Supported filters: page, per_page, search, start_date, end_date. Response: data.data[] with id, trans_date, ref_number (e.g. JURNAL/2026/08/07/177), memo, amount.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "default": 1
        },
        "per_page": {
          "type": "integer",
          "default": 25
        },
        "search": {
          "type": "string",
          "description": "Search by memo (e.g. meeting_id)"
        },
        "start_date": {
          "type": "string",
          "format": "date"
        },
        "end_date": {
          "type": "string",
          "format": "date"
        }
      }
    }
  },
  {
    "name": "kledo_get_manual_journal",
    "description": "Get detail of a single manual journal by ID (GET /finance/manualJournals/{id}). Response includes ref_number, memo, and items[] with finance_account_id, desc, amount (positive = debit, negative = credit).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Manual journal ID"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "kledo_get_finance_accounts",
    "description": "List chart of accounts (COA). Use to look up finance_account_id or verify account exists.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "default": 1
        },
        "per_page": {
          "type": "integer",
          "default": 100
        },
        "search": {
          "type": "string",
          "description": "Search by account name or code"
        }
      }
    }
  },
  {
    "name": "kledo_get_finance_account",
    "description": "Get detail of a single finance account including current balance.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Finance account ID (e.g. 1460 for Saldo Pelanggan)"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "kledo_delete_invoice",
    "description": "Delete/void an invoice. DESTRUCTIVE. Use only to correct erroneous entries.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Invoice ID to delete"
        },
        "confirm": {
          "type": "boolean",
          "description": "Harus true untuk mengeksekusi penghapusan."
        }
      },
      "required": [
        "id",
        "confirm"
      ]
    }
  },
  {
    "name": "kledo_delete_expense",
    "description": "Delete/void an expense. DESTRUCTIVE. Use only to correct erroneous entries.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Expense ID to delete"
        },
        "confirm": {
          "type": "boolean",
          "description": "Harus true untuk mengeksekusi penghapusan."
        }
      },
      "required": [
        "id",
        "confirm"
      ]
    }
  },
  {
    "name": "kledo_delete_manual_journal",
    "description": "Delete/void a manual journal. DESTRUCTIVE. Use only to correct erroneous entries.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "Manual journal ID to delete"
        },
        "confirm": {
          "type": "boolean",
          "description": "Harus true untuk mengeksekusi penghapusan."
        }
      },
      "required": [
        "id",
        "confirm"
      ]
    }
  },
  {
    "name": "kledo_update_contact",
    "description": "Update an existing contact in Kledo. Use to fix name, phone, email, or address.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": { "type": "integer", "description": "Contact ID to update" },
        "name": { "type": "string", "description": "Contact name" },
        "type_id": { "type": "integer", "description": "Contact type. 3 for Rapatin users.", "default": 3 },
        "company": { "type": "string", "description": "Company name (optional)" },
        "address": { "type": "string", "description": "Address (optional)" },
        "phone": { "type": "string", "description": "Phone number" },
        "email": { "type": "string", "description": "Email address" }
      },
      "required": ["id", "name"]
    }
  },
  {
    "name": "kledo_update_bank_transaction",
    "description": "Update an existing bank transaction (Terima/Kirim Dana). Replaces ALL items. Use to correct date, memo, contact, or amounts.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": { "type": "integer", "description": "Bank transaction ID to update" },
        "trans_date": { "type": "string", "format": "date", "description": "Transaction date (YYYY-MM-DD)" },
        "trans_type_id": { "type": "integer", "enum": [11, 12], "description": "11 = Kirim Dana, 12 = Terima Dana" },
        "bank_account_id": { "type": "integer", "description": "Bank account ID. 1 = Xendit.", "default": 1 },
        "contact_id": { "type": "integer", "description": "Kledo contact_id" },
        "memo": { "type": "string", "description": "Reference number" },
        "items": {
          "type": "array",
          "description": "Replacement line items (replaces ALL existing items).",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": { "type": "integer", "description": "1460 = Saldo Pelanggan, 156 = Pendapatan Lainnya" },
              "desc": { "type": "string", "description": "Item description" },
              "amount": { "type": "number", "description": "Amount" },
              "amount_after_tax": { "type": "number", "description": "Amount after tax" }
            },
            "required": ["finance_account_id", "desc", "amount", "amount_after_tax"]
          }
        }
      },
      "required": ["id", "trans_date", "trans_type_id", "bank_account_id", "contact_id", "memo", "items"]
    }
  },
  {
    "name": "kledo_update_expense",
    "description": "Update an existing expense in Kledo. Replaces ALL items. Use to correct Xendit fee amount, date, or memo.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": { "type": "integer", "description": "Expense ID to update" },
        "trans_date": { "type": "string", "format": "date", "description": "Transaction date (YYYY-MM-DD)" },
        "pay_from_finance_account_id": { "type": "integer", "description": "Payment source. 1 = Xendit.", "default": 1 },
        "contact_id": { "type": "integer", "description": "Always 3 (Xendit) for gateway fees.", "default": 3 },
        "status_id": { "type": "integer", "description": "3 = Paid.", "default": 3 },
        "memo": { "type": "string", "description": "Reference (order_number or #withdraw_id)" },
        "items": {
          "type": "array",
          "description": "Replacement expense line items (replaces ALL existing items).",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": { "type": "integer", "description": "1459 = Biaya Payment Gateway" },
              "tax_id": { "type": "integer", "description": "1 = PPN 11%" },
              "desc": { "type": "string", "description": "Item description" },
              "amount": { "type": "number", "description": "Fee amount" },
              "amount_after_tax": { "type": "number", "description": "Amount after tax" }
            },
            "required": ["finance_account_id", "desc", "amount"]
          }
        }
      },
      "required": ["id", "trans_date", "pay_from_finance_account_id", "contact_id", "status_id", "memo", "items"]
    }
  },
  {
    "name": "kledo_update_invoice",
    "description": "Update an existing invoice in Kledo. Replaces ALL items. Use to correct amounts, discount (bonus portion), or withholding (liability portion).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": { "type": "integer", "description": "Invoice ID to update" },
        "trans_date": { "type": "string", "format": "date", "description": "Transaction date (YYYY-MM-DD)" },
        "due_date": { "type": "string", "format": "date", "description": "Due date" },
        "contact_id": { "type": "integer", "description": "Kledo contact_id" },
        "status_id": { "type": "integer", "description": "3 = LUNAS (paid).", "default": 3 },
        "memo": { "type": "string", "description": "Reference (meeting_id / withdraw_id)" },
        "items": {
          "type": "array",
          "description": "Replacement invoice line items (replaces ALL existing items).",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": { "type": "integer", "description": "Revenue account: 3,4,5,6 = Meeting tiers, 7 = Rapatin Fee" },
              "desc": { "type": "string", "description": "Description" },
              "qty": { "type": "integer", "description": "Quantity", "default": 1 },
              "price": { "type": "number", "description": "Price per unit" },
              "amount": { "type": "number", "description": "Total amount (qty * price)" },
              "unit_id": { "type": "integer", "description": "2 = Slot, 3 = Trx" }
            },
            "required": ["finance_account_id", "desc", "qty", "price", "amount", "unit_id"]
          }
        },
        "additional_discount_amount": { "type": "number", "description": "Portion paid from bonus/non-liability." },
        "witholding_amount": { "type": "number", "description": "Portion paid from liability (Saldo Pelanggan)." },
        "witholding_account_id": { "type": "integer", "description": "1460 = Saldo Pelanggan.", "default": 1460 }
      },
      "required": ["id", "trans_date", "due_date", "contact_id", "status_id", "memo", "items"]
    }
  },
  {
    "name": "kledo_update_manual_journal",
    "description": "Update an existing manual journal entry. Use to fix items or memo. Items MUST balance to zero. Replaces ALL items.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": { "type": "integer", "description": "Manual journal ID to update" },
        "trans_date": { "type": "string", "format": "date", "description": "Transaction date (YYYY-MM-DD)" },
        "memo": { "type": "string", "description": "Memo/reference for the journal entry" },
        "items": {
          "type": "array",
          "description": "Replacement journal entries. Positive = Debit, Negative = Credit. Sum must = 0.",
          "items": {
            "type": "object",
            "properties": {
              "finance_account_id": { "type": "integer", "description": "Account ID (e.g. 1460, 121, 156)" },
              "desc": { "type": "string", "description": "Description of the entry" },
              "amount": { "type": "number", "description": "Positive = Debit, Negative = Credit" }
            },
            "required": ["finance_account_id", "desc", "amount"]
          }
        }
      },
      "required": ["id", "trans_date", "memo", "items"]
    }
  }
] as const;

const LIST_KEYS = [
  "page",
  "per_page",
  "search",
  "start_date",
  "end_date",
  "contact_id",
  "bank_account_id",
  "trans_type_id",
];

function listQuery(args: Record<string, any>) {
  const q: Record<string, unknown> = {};
  for (const k of LIST_KEYS) if (args[k] !== undefined) q[k] = args[k];
  return q;
}

function pick(args: Record<string, any>, keys: string[]) {
  const o: Record<string, unknown> = {};
  for (const k of keys) if (args[k] !== undefined) o[k] = args[k];
  return o;
}

export type KledoToolResult = { ok: boolean; status: number; data: unknown } | { error: string };

/** Returns null when the tool name is not a Kledo tool. */
export async function handleKledoTool(
  name: string,
  args: Record<string, any>,
): Promise<{ ok: boolean; status: number; data: unknown } | null> {
  args = args || {};

  switch (name) {
    // ---- Contacts ----
    case "kledo_get_contacts":
      return await kledoFetch("GET", "/finance/contacts", { query: listQuery(args) });
    case "kledo_get_contact":
      return await kledoFetch("GET", `/finance/contacts/${args.id}`);
    case "kledo_create_contact":
      return await kledoFetch("POST", "/finance/contacts", {
        body: { type_id: 3, ...pick(args, ["name", "type_id", "company", "address", "phone", "email"]) },
      });
    case "kledo_update_contact":
      return await kledoFetch("PUT", `/finance/contacts/${args.id}`, {
        body: pick(args, ["name", "type_id", "company", "address", "phone", "email"]),
      });

    // ---- Bank transactions (Kas & Bank) ----
    case "kledo_get_bank_transactions":
      return await kledoFetch("GET", "/finance/bankTrans", { query: listQuery(args) });
    case "kledo_get_bank_transaction":
      return await kledoFetch("GET", `/finance/bankTrans/${args.id}`);
    case "kledo_create_bank_transaction":
      return await kledoFetch("POST", "/finance/bankTrans", {
        body: pick(args, ["trans_date", "trans_type_id", "bank_account_id", "contact_id", "memo", "items"]),
      });
    case "kledo_update_bank_transaction":
      return await kledoFetch("PUT", `/finance/bankTrans/${args.id}`, {
        body: pick(args, ["trans_date", "trans_type_id", "bank_account_id", "contact_id", "memo", "items"]),
      });

    // ---- Expenses ----
    case "kledo_get_expenses":
      return await kledoFetch("GET", "/finance/expenses", { query: listQuery(args) });
    case "kledo_get_expense":
      return await kledoFetch("GET", `/finance/expenses/${args.id}`);
    case "kledo_create_expense":
      return await kledoFetch("POST", "/finance/expenses", {
        body: pick(args, [
          "trans_date",
          "pay_from_finance_account_id",
          "contact_id",
          "status_id",
          "memo",
          "items",
        ]),
      });
    case "kledo_update_expense":
      return await kledoFetch("PUT", `/finance/expenses/${args.id}`, {
        body: pick(args, [
          "trans_date",
          "pay_from_finance_account_id",
          "contact_id",
          "status_id",
          "memo",
          "items",
        ]),
      });
    case "kledo_delete_expense":
      return await kledoFetch("DELETE", `/finance/expenses/${args.id}`);

    // ---- Invoices ----
    case "kledo_get_invoices":
      return await kledoFetch("GET", "/finance/invoices", { query: listQuery(args) });
    case "kledo_get_invoice":
      return await kledoFetch("GET", `/finance/invoices/${args.id}`);
    case "kledo_create_invoice":
      return await kledoFetch("POST", "/finance/invoices", {
        body: pick(args, [
          "trans_date",
          "due_date",
          "contact_id",
          "status_id",
          "memo",
          "items",
          "additional_discount_amount",
          "witholding_amount",
          "witholding_account_id",
        ]),
      });
    case "kledo_update_invoice":
      return await kledoFetch("PUT", `/finance/invoices/${args.id}`, {
        body: pick(args, [
          "trans_date",
          "due_date",
          "contact_id",
          "status_id",
          "memo",
          "items",
          "additional_discount_amount",
          "witholding_amount",
          "witholding_account_id",
        ]),
      });
    case "kledo_delete_invoice":
      return await kledoFetch("DELETE", `/finance/invoices/${args.id}`);

    // ---- Manual journals ----
    case "kledo_get_manual_journals":
      return await kledoFetch("GET", "/finance/manualJournals", { query: listQuery(args) });
    case "kledo_get_manual_journal":
      return await kledoFetch("GET", `/finance/manualJournals/${args.id}`);
    case "kledo_create_manual_journal":
      return await kledoFetch("POST", "/finance/manualJournals", {
        body: pick(args, ["trans_date", "memo", "items"]),
      });
    case "kledo_update_manual_journal":
      return await kledoFetch("PUT", `/finance/manualJournals/${args.id}`, {
        body: pick(args, ["trans_date", "memo", "items"]),
      });
    case "kledo_delete_manual_journal":
      return await kledoFetch("DELETE", `/finance/manualJournals/${args.id}`);

    // ---- Chart of accounts ----
    case "kledo_get_finance_accounts":
      return await kledoFetch("GET", "/finance/accounts", { query: listQuery(args) });
    case "kledo_get_finance_account":
      return await kledoFetch("GET", `/finance/accounts/${args.id}`);

    default:
      return null;
  }
}
