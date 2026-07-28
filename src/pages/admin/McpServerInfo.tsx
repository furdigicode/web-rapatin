import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Server, Eye, EyeOff, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MCP_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mcp-rapatin`;

type Tool = { name: string; type: "read" | "write"; desc: string };

const ARTICLE_TOOLS: Tool[] = [
  { name: "list_articles", type: "read", desc: "Daftar artikel dengan filter status/kategori/search." },
  { name: "get_article", type: "read", desc: "Ambil satu artikel berdasarkan id atau slug." },
  { name: "create_article", type: "write", desc: "Buat artikel baru (default status=draft)." },
  { name: "update_article", type: "write", desc: "Update sebagian field artikel berdasarkan id." },
  { name: "delete_article", type: "write", desc: "Hapus artikel (butuh confirm=true)." },
  { name: "publish_article", type: "write", desc: "Publish artikel sekarang." },
];

const MYSQL_TOOLS: Tool[] = [
  { name: "mysql_list_tables", type: "read", desc: "Daftar semua tabel MySQL Rapatin (read-only)." },
  { name: "mysql_describe_table", type: "read", desc: "Tampilkan kolom sebuah tabel MySQL Rapatin." },
  { name: "mysql_run_query", type: "read", desc: "Jalankan SELECT/SHOW/DESCRIBE/EXPLAIN/WITH read-only (auto-cap 1000 baris)." },
];

const renderToolItem = (t: Tool) => (
  <div key={t.name} className="flex items-start gap-3 p-3 border rounded">
    <Badge variant={t.type === "write" ? "default" : "secondary"}>{t.type}</Badge>
    <div>
      <div className="font-mono text-sm font-medium">{t.name}</div>
      <div className="text-xs text-muted-foreground">{t.desc}</div>
    </div>
  </div>
);

const buildClaudeConfig = (key: string) => `{
  "mcpServers": {
    "rapatin": {
      "transport": {
        "type": "http",
        "url": "${MCP_URL}",
        "headers": {
          "Authorization": "Bearer ${key}"
        }
      }
    }
  }
}`;

const buildCurl = (key: string) => `curl -X POST "${MCP_URL}" \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`;

const McpServerInfo: React.FC = () => {
  const { toast } = useToast();
  const [showCopied, setShowCopied] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(label);
    toast({ title: "Tersalin", description: label });
    setTimeout(() => setShowCopied(""), 1500);
  };

  const fetchKey = async () => {
    setLoadingKey(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      if (!token) {
        toast({ title: "Sesi admin tidak ditemukan", variant: "destructive" });
        return;
      }
      const { data, error } = await supabase.functions.invoke("get-mcp-admin-key", {
        body: { token },
      });
      if (error || !data?.key) {
        toast({
          title: "Gagal mengambil API key",
          description: (data as any)?.error || error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }
      setApiKey(data.key);
      setShowKey(true);
    } finally {
      setLoadingKey(false);
    }
  };

  const displayKey = apiKey
    ? showKey
      ? apiKey
      : "•".repeat(Math.min(apiKey.length, 40))
    : "";
  const placeholder = apiKey || "<MCP_ADMIN_API_KEY>";

  return (
    <AdminLayout title="MCP Server">
      <div className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              MCP Server Rapatin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Endpoint Model Context Protocol untuk agen AI (Claude Desktop, Cursor, ChatGPT dengan MCP) agar dapat mengakses tools Rapatin (artikel, MySQL, dan lainnya).
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Endpoint URL</label>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-xs break-all">{MCP_URL}</code>
                <Button size="sm" variant="outline" onClick={() => copy(MCP_URL, "URL")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> API Key
              </label>
              {!apiKey ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <Button size="sm" onClick={fetchKey} disabled={loadingKey}>
                    {loadingKey ? "Memuat…" : "Tampilkan API Key"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Key hanya dikirim ke admin terautentikasi. Jangan bagikan.
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <code className="flex-1 p-2 bg-muted rounded text-xs break-all font-mono">
                    {displayKey}
                  </code>
                  <Button size="sm" variant="outline" onClick={() => setShowKey((s) => !s)}>
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copy(apiKey, "API Key")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Gunakan sebagai header <code className="px-1 bg-muted rounded">Authorization: Bearer &lt;key&gt;</code>.
              </p>
              <Button size="sm" variant="ghost" asChild>
                <a
                  href="https://supabase.com/dashboard/project/mepznzrijuoyvjcmkspf/settings/functions"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Kelola / rotate di Supabase Secrets
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tools yang tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {TOOLS.map((t) => (
                <div key={t.name} className="flex items-start gap-3 p-3 border rounded">
                  <Badge variant={t.type === "write" ? "default" : "secondary"}>{t.type}</Badge>
                  <div>
                    <div className="font-mono text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konfigurasi Claude Desktop / Cursor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">{buildClaudeConfig(placeholder)}</pre>
            <Button size="sm" variant="outline" onClick={() => copy(buildClaudeConfig(placeholder), "Konfigurasi")}>
              <Copy className="h-4 w-4 mr-2" />
              {showCopied === "Konfigurasi" ? "Tersalin" : "Salin konfigurasi"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uji cepat dengan cURL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">{buildCurl(placeholder)}</pre>
            <Button size="sm" variant="outline" onClick={() => copy(buildCurl(placeholder), "cURL")}>
              <Copy className="h-4 w-4 mr-2" />
              {showCopied === "cURL" ? "Tersalin" : "Salin perintah cURL"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default McpServerInfo;
