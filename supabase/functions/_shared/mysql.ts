// Shared MySQL helpers for Rapatin read-only access.
// Used by `mysql-query` (admin UI) and `mcp-blog` (MCP tools).
import mysql from "npm:mysql2@3.11.3/promise";

const HOST = Deno.env.get("RAPATIN_MYSQL_HOST") ?? "";
const PORT = parseInt(Deno.env.get("RAPATIN_MYSQL_PORT") ?? "3306", 10);
const USER = Deno.env.get("RAPATIN_MYSQL_USER") ?? "";
const PASSWORD = Deno.env.get("RAPATIN_MYSQL_PASSWORD") ?? "";
const DATABASE = Deno.env.get("RAPATIN_MYSQL_DATABASE") ?? "";

export const MAX_ROWS = 1000;
export const QUERY_TIMEOUT_MS = 15_000;

const READONLY_PREFIXES = /^(select|show|describe|desc|explain|with)\b/i;
// Word-boundary blacklist. `\b` before words is fine even after removing comments.
const WRITE_KEYWORDS = /\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|rename|replace|call|load|handler|lock|unlock|set|use|reset|kill|start|commit|rollback|savepoint|analyze|optimize|repair|flush)\b/i;

export function assertReadOnly(sql: string): { ok: true } | { ok: false; error: string } {
  if (!sql || typeof sql !== "string") return { ok: false, error: "SQL kosong." };
  // Strip line comments, block comments, and MySQL executable comments.
  const stripped = sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ")
    .replace(/#[^\n]*/g, " ")
    .trim();
  if (!stripped) return { ok: false, error: "SQL kosong setelah normalisasi." };
  if (!READONLY_PREFIXES.test(stripped)) {
    return { ok: false, error: "Hanya SELECT/SHOW/DESCRIBE/EXPLAIN/WITH yang diizinkan." };
  }
  if (WRITE_KEYWORDS.test(stripped)) {
    return { ok: false, error: "Query mengandung keyword write/DDL yang dilarang." };
  }
  // Disallow multiple statements.
  const trimmedNoTrailing = stripped.replace(/;+\s*$/, "");
  if (trimmedNoTrailing.includes(";")) {
    return { ok: false, error: "Multiple statement tidak diizinkan." };
  }
  return { ok: true };
}

export function ensureLimit(sql: string, max = MAX_ROWS): string {
  const stripped = sql.replace(/;+\s*$/, "").trim();
  if (/\blimit\s+\d+/i.test(stripped)) return stripped;
  // Wrap to enforce max rows without breaking ORDER BY / GROUP BY etc.
  return `SELECT * FROM ( ${stripped} ) AS _capped LIMIT ${max}`;
}

export function missingEnv(): string[] {
  const missing: string[] = [];
  if (!HOST) missing.push("RAPATIN_MYSQL_HOST");
  if (!USER) missing.push("RAPATIN_MYSQL_USER");
  if (!PASSWORD) missing.push("RAPATIN_MYSQL_PASSWORD");
  if (!DATABASE) missing.push("RAPATIN_MYSQL_DATABASE");
  return missing;
}

async function createConn() {
  return await mysql.createConnection({
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    connectTimeout: 10_000,
    // Enable TLS if the server supports it; accept self-signed to keep setup simple.
    ssl: { rejectUnauthorized: false } as any,
    multipleStatements: false,
    dateStrings: true,
  });
}

export interface QueryResult {
  rows: any[];
  fields: { name: string; type?: any }[];
  rowCount: number;
  durationMs: number;
  truncated: boolean;
}

async function withConn<T>(fn: (c: any) => Promise<T>): Promise<T> {
  const missing = missingEnv();
  if (missing.length) throw new Error(`Env MySQL belum lengkap: ${missing.join(", ")}`);
  const conn = await createConn();
  try {
    return await fn(conn);
  } finally {
    try { await conn.end(); } catch { /* ignore */ }
  }
}

export async function ping(): Promise<{ version: string; durationMs: number }> {
  const start = Date.now();
  return await withConn(async (c) => {
    const [rows]: any = await c.query("SELECT VERSION() AS version");
    return { version: rows?.[0]?.version ?? "unknown", durationMs: Date.now() - start };
  });
}

export async function listTables(): Promise<string[]> {
  return await withConn(async (c) => {
    const [rows]: any = await c.query("SHOW TABLES");
    return (rows as any[]).map((r) => Object.values(r)[0] as string);
  });
}

export async function describeTable(table: string): Promise<any[]> {
  if (!/^[A-Za-z0-9_$]+$/.test(table)) throw new Error("Nama tabel tidak valid.");
  return await withConn(async (c) => {
    const [rows]: any = await c.query(`DESCRIBE \`${table}\``);
    return rows as any[];
  });
}

export async function runQuery(sql: string, params: any[] = []): Promise<QueryResult> {
  const check = assertReadOnly(sql);
  if (!check.ok) throw new Error(check.error);
  const bounded = ensureLimit(sql);
  const start = Date.now();
  return await withConn(async (c) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS);
    try {
      const [rows, fields]: any = await c.execute(bounded, params);
      const rowArr = Array.isArray(rows) ? rows : [];
      return {
        rows: rowArr,
        fields: (fields ?? []).map((f: any) => ({ name: f.name, type: f.type })),
        rowCount: rowArr.length,
        durationMs: Date.now() - start,
        truncated: rowArr.length >= MAX_ROWS,
      };
    } finally {
      clearTimeout(timer);
    }
  });
}
