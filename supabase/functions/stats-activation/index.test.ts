import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

test("Activation runs all four queries with at most one active connection and preserves results", async () => {
  const source = readFileSync(new URL("./index.ts", import.meta.url), "utf8")
    .replace(/^import .*;\r?\n/gm, "");
  const compiled = ts.transpile(source, { target: ts.ScriptTarget.ES2022 });
  let handler: ((req: Request) => Promise<Response>) | undefined;
  let active = 0;
  let peak = 0;
  const paramsSeen: unknown[][] = [];
  const results = [
    [{ bulan: "2026-10", new_signups: 186, deposit_users: 105 }],
    [{ bulan: "2026-10", depositors: 105, avg_hours: 12 }],
    [{ bulan: "2026-10", revenue_new: 100000 }],
    [{ bulan: "2026-10", guest: 4, total: 20 }],
  ];
  const query = async (_sql: string, params: unknown[]) => {
    const index = paramsSeen.length;
    paramsSeen.push(params);
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active--;
    return { rows: results[index] };
  };
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "eq", "gt"]) chain[method] = () => chain;
  chain.maybeSingle = async () => ({ data: { id: "test-admin" } });
  new Function("Deno", "createClient", "runQuery", compiled)(
    { env: { get: () => "test" }, serve: (fn: typeof handler) => { handler = fn; } },
    () => ({ from: () => chain }), query,
  );
  if (!handler) throw new Error("Handler not registered");
  const token = btoa(JSON.stringify({ sub: "test-admin", email: "test@example.invalid", exp: 4102444800 }));
  const response = await handler(new Request("https://example.invalid", {
    method: "POST", body: JSON.stringify({ token, month: "2026-10" }),
  }));
  expect(response.status).toBe(200);
  expect(paramsSeen).toEqual([
    ["2026-09-01", "2026-11-01"],
    ["2026-09-01", "2026-11-01", "2026-09-01", "2026-11-01"],
    ["2026-09-01", "2026-11-01"],
    ["2026-09-01", "2026-11-01"],
  ]);
  expect(peak).toBe(1);
  expect(active).toBe(0);
  const body = await response.json();
  expect(body.current.new_signups).toBe(186);
  expect(body.current.deposit_users).toBe(105);
  expect(body.current.avg_hours_first_deposit).toBe(12);
  expect(body.current.revenue_new).toBe(100000);
  expect(body.current.guest_schedules).toBe(4);
  expect(body.previous.month).toBe("2026-09");
});