import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database, Play, RefreshCw, Eye, EyeOff, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QueryLogRow {
  id: string;
  admin_email: string | null;
  action: string;
  sql: string | null;
  status: string;
  row_count: number | null;
  duration_ms: number | null;
  error_message: string | null;
  created_at: string;
}

function getAdminToken() {
  return localStorage.getItem("adminAuthToken") ?? "";
}

async function callMysql(body: Record<string, any>) {
  const token = getAdminToken();
  const { data, error } = await supabase.functions.invoke("mysql-query", {
    body: { token, ...body },
  });
  if (error) throw new Error(error.message);
  if (!data?.ok) throw new Error(data?.error ?? "Unknown error");
  return data;
}

export default function MysqlConnect() {
  const { toast } = useToast();

  // Connection tab
  const [pingLoading, setPingLoading] = useState(false);
  const [pingInfo, setPingInfo] = useState<{ version: string; durationMs: number } | null>(null);

  // Schema tab
  const [tables, setTables] = useState<string[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<any[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(false);

  // Query tab
  const [sql, setSql] = useState("SELECT 1 AS ok");
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    rows: any[];
    fields: { name: string }[];
    rowCount: number;
    durationMs: number;
    truncated: boolean;
  } | null>(null);

  // Log
  const [log, setLog] = useState<QueryLogRow[]>([]);
  const [logLoading, setLogLoading] = useState(false);

  async function loadLog() {
    setLogLoading(true);
    const { data, error } = await supabase
      .from("mysql_query_log")
      .select("id, admin_email, action, sql, status, row_count, duration_ms, error_message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      toast({ title: "Gagal memuat log", description: error.message, variant: "destructive" });
    } else {
      setLog(data ?? []);
    }
    setLogLoading(false);
  }

  useEffect(() => { loadLog(); }, []);

  async function testConnection() {
    setPingLoading(true);
    setPingInfo(null);
    try {
      const r = await callMysql({ action: "ping" });
      setPingInfo({ version: r.version, durationMs: r.durationMs });
      toast({ title: "Koneksi berhasil", description: `MySQL ${r.version} · ${r.durationMs} ms` });
      loadLog();
    } catch (e) {
      toast({ title: "Koneksi gagal", description: (e as Error).message, variant: "destructive" });
    }
    setPingLoading(false);
  }

  async function loadTables() {
    setTablesLoading(true);
    try {
      const r = await callMysql({ action: "list_tables" });
      setTables(r.tables ?? []);
      loadLog();
    } catch (e) {
      toast({ title: "Gagal", description: (e as Error).message, variant: "destructive" });
    }
    setTablesLoading(false);
  }

  async function describe(name: string) {
    setSelectedTable(name);
    setColumnsLoading(true);
    setColumns([]);
    try {
      const r = await callMysql({ action: "describe_table", table: name });
      setColumns(r.columns ?? []);
      loadLog();
    } catch (e) {
      toast({ title: "Gagal", description: (e as Error).message, variant: "destructive" });
    }
    setColumnsLoading(false);
  }

  async function runQuery() {
    setQueryLoading(true);
    setQueryResult(null);
    try {
      const r = await callMysql({ action: "query", sql });
      setQueryResult({
        rows: r.rows, fields: r.fields, rowCount: r.rowCount,
        durationMs: r.durationMs, truncated: r.truncated,
      });
      loadLog();
    } catch (e) {
      toast({ title: "Query error", description: (e as Error).message, variant: "destructive" });
    }
    setQueryLoading(false);
  }

  return (
    <AdminLayout title="MySQL Connect">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" /> MySQL Connect
          </h1>
          <p className="text-muted-foreground text-sm">
            Akses read-only ke database MySQL aplikasi Rapatin.
          </p>
        </div>

        <Tabs defaultValue="connection">
          <TabsList>
            <TabsTrigger value="connection">Koneksi</TabsTrigger>
            <TabsTrigger value="schema">Skema</TabsTrigger>
            <TabsTrigger value="query">Query Runner</TabsTrigger>
            <TabsTrigger value="log">Riwayat</TabsTrigger>
          </TabsList>

          <TabsContent value="connection">
            <Card>
              <CardHeader>
                <CardTitle>Test Koneksi</CardTitle>
                <CardDescription>
                  Kredensial diambil dari Supabase secrets: RAPATIN_MYSQL_HOST / PORT / USER / PASSWORD / DATABASE.
                  Pastikan user MySQL memiliki hak <strong>SELECT saja</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={testConnection} disabled={pingLoading}>
                  {pingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Test Koneksi
                </Button>
                {pingInfo && (
                  <div className="text-sm bg-muted p-3 rounded-md">
                    <div>Versi server: <code>{pingInfo.version}</code></div>
                    <div>Latency: {pingInfo.durationMs} ms</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Daftar Tabel</CardTitle>
                    <CardDescription>{tables.length} tabel</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={loadTables} disabled={tablesLoading}>
                    {tablesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[500px] overflow-auto space-y-1">
                    {tables.map((t) => (
                      <button
                        key={t}
                        onClick={() => describe(t)}
                        className={`block w-full text-left px-2 py-1 rounded text-sm hover:bg-muted ${
                          selectedTable === t ? "bg-muted font-medium" : ""
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                    {tables.length === 0 && (
                      <p className="text-sm text-muted-foreground">Klik refresh untuk memuat tabel.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kolom</CardTitle>
                  <CardDescription>{selectedTable ?? "Pilih tabel"}</CardDescription>
                </CardHeader>
                <CardContent>
                  {columnsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : columns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada kolom ditampilkan.</p>
                  ) : (
                    <div className="max-h-[500px] overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1">Field</th>
                            <th className="text-left py-1">Type</th>
                            <th className="text-left py-1">Null</th>
                            <th className="text-left py-1">Key</th>
                          </tr>
                        </thead>
                        <tbody>
                          {columns.map((c: any) => (
                            <tr key={c.Field} className="border-b">
                              <td className="py-1 font-mono">{c.Field}</td>
                              <td className="py-1 font-mono">{c.Type}</td>
                              <td className="py-1">{c.Null}</td>
                              <td className="py-1">{c.Key}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle>Query Runner</CardTitle>
                <CardDescription>
                  Hanya SELECT / SHOW / DESCRIBE / EXPLAIN / WITH. Otomatis dibatasi 1000 baris.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                <Button onClick={runQuery} disabled={queryLoading}>
                  {queryLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Jalankan
                </Button>

                {queryResult && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {queryResult.rowCount} baris · {queryResult.durationMs} ms
                      {queryResult.truncated && <Badge variant="secondary" className="ml-2">Truncated 1000</Badge>}
                    </div>
                    <div className="max-h-[500px] overflow-auto border rounded-md">
                      <table className="w-full text-xs">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            {queryResult.fields.map((f) => (
                              <th key={f.name} className="text-left px-2 py-1 border-b">{f.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.rows.map((row, i) => (
                            <tr key={i} className="border-b">
                              {queryResult.fields.map((f) => (
                                <td key={f.name} className="px-2 py-1 font-mono whitespace-nowrap">
                                  {row[f.name] === null ? <span className="text-muted-foreground">NULL</span> :
                                    typeof row[f.name] === "object" ? JSON.stringify(row[f.name]) : String(row[f.name])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Riwayat Query</CardTitle>
                  <CardDescription>50 aktivitas terakhir</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={loadLog} disabled={logLoading}>
                  {logLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left px-2 py-1">Waktu</th>
                        <th className="text-left px-2 py-1">Admin</th>
                        <th className="text-left px-2 py-1">Action</th>
                        <th className="text-left px-2 py-1">Status</th>
                        <th className="text-left px-2 py-1">Rows</th>
                        <th className="text-left px-2 py-1">Durasi</th>
                        <th className="text-left px-2 py-1">SQL / Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {log.map((r) => (
                        <tr key={r.id} className="border-b align-top">
                          <td className="px-2 py-1 whitespace-nowrap">{new Date(r.created_at).toLocaleString("id-ID")}</td>
                          <td className="px-2 py-1">{r.admin_email ?? "-"}</td>
                          <td className="px-2 py-1">{r.action}</td>
                          <td className="px-2 py-1">
                            <Badge variant={r.status === "success" ? "default" : r.status === "blocked" ? "secondary" : "destructive"}>
                              {r.status}
                            </Badge>
                          </td>
                          <td className="px-2 py-1">{r.row_count ?? "-"}</td>
                          <td className="px-2 py-1">{r.duration_ms ?? "-"} ms</td>
                          <td className="px-2 py-1 font-mono max-w-md">
                            <div className="truncate" title={r.error_message ?? r.sql ?? ""}>
                              {r.error_message ?? r.sql ?? ""}
                            </div>
                            {r.sql && r.status !== "error" && (
                              <button
                                className="text-primary underline text-[10px]"
                                onClick={() => setSql(r.sql!)}
                              >Muat ke editor</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
