// Shared MySQL helpers for Rapatin read-only access.
// Config is loaded from the `mysql_connection_config` table (singleton row),
// with a fallback to env vars for backward compatibility.
import mysql from "npm:mysql2@3.11.3/promise";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const MAX_ROWS = 1000;
export const QUERY_TIMEOUT_MS = 15_000;

interface MysqlConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

let cached: { config: MysqlConfig; at: number } | null = null;
const CACHE_MS = 30_000;

export async function loadConfig(forceRefresh = false): Promise<MysqlConfig> {
  if (!forceRefresh && cached && Date.now() - cached.at < CACHE_MS) {
    return cached.config;
  }
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  let config: MysqlConfig = {
    host: Deno.env.get("RAPATIN_MYSQL_HOST") ?? "",
    port: parseInt(Deno.env.get("RAPATIN_MYSQL_PORT") ?? "3306", 10),
    user: Deno.env.get("RAPATIN_MYSQL_USER") ?? "",
    password: Deno.env.get("RAPATIN_MYSQL_PASSWORD") ?? "",
    database: Deno.env.get("RAPATIN_MYSQL_DATABASE") ?? "",
  };
  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data } = await supabase
        .from("mysql_connection_config")
        .select("host, port, database, username, password")
        .eq("id", "singleton")
        .maybeSingle();
      if (data && data.host) {
        config = {
          host: data.host,
          port: data.port ?? 3306,
          user: data.username ?? "",
          password: data.password ?? "",
          database: data.database ?? "",
        };
      }
    } catch (e) {
      console.error("loadConfig db error", e);
    }
  }
  cached = { config, at: Date.now() };
  return config;
}

const READONLY_PREFIXES = /^(select|show|describe|desc|explain|with)\b/i;
const WRITE_KEYWORDS = /\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|rename|replace|call|load|handler|lock|unlock|set|use|reset|kill|start|commit|rollback|savepoint|analyze|optimize|repair|flush)\b/i;

export function assertReadOnly(sql: string): { ok: true } | { ok: false; error: string } {
  if (!sql || typeof sql !== "string") return { ok: false, error: "SQL kosong." };
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
  const trimmedNoTrailing = stripped.replace(/;+\s*$/, "");
  if (trimmedNoTrailing.includes(";")) {
    return { ok: false, error: "Multiple statement tidak diizinkan." };
  }
  return { ok: true };
}

export function ensureLimit(sql: string, max = MAX_ROWS): string {
  const stripped = sql.replace(/;+\s*$/, "").trim();
  if (!/^(select|with)\b/i.test(stripped)) return stripped;
  if (/\blimit\s+\d+/i.test(stripped)) return stripped;
  return `${stripped} LIMIT ${max}`;
}

export function missingConfig(c: MysqlConfig): string[] {
  const missing: string[] = [];
  if (!c.host) missing.push("host");
  if (!c.user) missing.push("username");
  if (!c.password) missing.push("password");
  if (!c.database) missing.push("database");
  return missing;
}

async function createConn(c: MysqlConfig) {
  try {
    return await mysql.createConnection({
      host: c.host.trim(),
      port: Number(c.port || 3306),
      user: c.user.trim(),
      password: c.password,
      database: c.database.trim(),
      connectTimeout: 10_000,
      multipleStatements: false,
      dateStrings: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  } catch (error: any) {
    console.error("MySQL connection failed", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      sqlState: error?.sqlState,
      syscall: error?.syscall,
      address: error?.address,
      port: error?.port,
    });
    throw new Error(
      `MySQL connection failed: ${error?.code ?? "UNKNOWN"} - ${error?.message ?? String(error)}`,
    );
  }
}


export interface QueryResult {
  rows: any[];
  fields: { name: string; type?: any }[];
  rowCount: number;
  durationMs: number;
  truncated: boolean;
}

async function withConn<T>(fn: (c: any) => Promise<T>): Promise<T> {
  const cfg = await loadConfig();
  const missing = missingConfig(cfg);
  if (missing.length) throw new Error(`Konfigurasi MySQL belum lengkap: ${missing.join(", ")}`);
  const conn = await createConn(cfg);
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
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const queryPromise = c.execute(bounded, params);
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          try { c.destroy(); } catch { /* ignore */ }
          reject(new Error(`Query timeout setelah ${QUERY_TIMEOUT_MS} ms`));
        }, QUERY_TIMEOUT_MS);
      });
      const [rows, fields]: any = await Promise.race([queryPromise, timeoutPromise]);
      const rowArr = Array.isArray(rows) ? rows : [];
      return {
        rows: rowArr,
        fields: (fields ?? []).map((f: any) => ({ name: f.name, type: f.type })),
        rowCount: rowArr.length,
        durationMs: Date.now() - start,
        truncated: rowArr.length >= MAX_ROWS,
      };
    } finally {
      if (timer) clearTimeout(timer);
    }
  });
}

// Backward-compat alias so callers still importing missingEnv keep working.
export function missingEnv(): string[] { return []; }
