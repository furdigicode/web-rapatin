import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MCP_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mcp-blog`;

const TOOLS = [
  { name: "list_articles", type: "read", desc: "Daftar artikel dengan filter status/kategori/search." },
  { name: "get_article", type: "read", desc: "Ambil satu artikel berdasarkan id atau slug." },
  { name: "create_article", type: "write", desc: "Buat artikel baru (default status=draft)." },
  { name: "update_article", type: "write", desc: "Update sebagian field artikel berdasarkan id." },
  { name: "delete_article", type: "write", desc: "Hapus artikel (butuh confirm=true)." },
  { name: "publish_article", type: "write", desc: "Publish artikel sekarang." },
];

const claudeConfig = `{
  "mcpServers": {
    "rapatin-blog": {
      "transport": {
        "type": "http",
        "url": "${MCP_URL}",
        "headers": {
          "Authorization": "Bearer <MCP_ADMIN_API_KEY>"
        }
      }
    }
  }
}`;

const curlSample = `curl -X POST "${MCP_URL}" \\
  -H "Authorization: Bearer <MCP_ADMIN_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`;

const McpServerInfo: React.FC = () => {
  const { toast } = useToast();
  const [showCopied, setShowCopied] = useState<string>("");

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(label);
    toast({ title: "Tersalin", description: label });
    setTimeout(() => setShowCopied(""), 1500);
  };

  return (
    <AdminLayout title="MCP Server">
      <div className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              MCP Server untuk Blog
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Endpoint Model Context Protocol untuk agen AI (Claude Desktop, Cursor, ChatGPT dengan MCP) agar dapat membaca dan menulis artikel blog.
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
              <label className="text-sm font-medium">Autentikasi</label>
              <p className="text-sm">
                Header <code className="px-1 bg-muted rounded">Authorization: Bearer &lt;MCP_ADMIN_API_KEY&gt;</code>.
                Ambil / rotate nilai API key di Supabase Secrets.
              </p>
              <Button size="sm" variant="outline" asChild>
                <a
                  href="https://supabase.com/dashboard/project/mepznzrijuoyvjcmkspf/settings/functions"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka Supabase Secrets
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
            <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">{claudeConfig}</pre>
            <Button size="sm" variant="outline" onClick={() => copy(claudeConfig, "Konfigurasi")}>
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
            <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">{curlSample}</pre>
            <Button size="sm" variant="outline" onClick={() => copy(curlSample, "cURL")}>
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
