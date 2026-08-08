// MCP Server for Blog Articles — Streamable HTTP (spec 2025-06-18)
// Kompatibel dengan ClickUp, Claude Desktop, Cursor, dsb.
// Auth: Authorization: Bearer <MCP_ADMIN_API_KEY>  atau  X-API-Key: <MCP_ADMIN_API_KEY>
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  describeTable as mysqlDescribeTable,
  listTables as mysqlListTables,
  runQuery as mysqlRunQuery,
} from "../_shared/mysql.ts";
import { birdsendFetch } from "../_shared/birdsend.ts";
import { KLEDO_TOOLS, handleKledoTool } from "../_shared/kledo-mcp-tools.ts";
import { XENDIT_TOOLS, handleXenditTool } from "../_shared/xendit-mcp-tools.ts";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-API-Key, Mcp-Session-Id, Mcp-Protocol-Version, Accept",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
  "Access-Control-Max-Age": "86400",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const API_KEY = Deno.env.get("MCP_ADMIN_API_KEY")!;
const DEFAULT_AUTHOR_ID = "da51c3a0-4e84-4fe2-adfe-bd681a2fda2f";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const PROTOCOL_VERSION = "2025-06-18";

// -------- helpers --------
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

function countWords(html: string): number {
  const text = (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

function jsonRpcResult(id: unknown, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}
function jsonRpcError(id: unknown, code: number, message: string, data?: unknown) {
  return { jsonrpc: "2.0", id, error: { code, message, data } };
}

function toolText(payload: unknown, isError = false) {
  return {
    content: [{ type: "text", text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2) }],
    isError,
  };
}

// -------- tool definitions --------
const TOOLS = [
  {
    name: "list_articles",
    description: "List blog articles with optional filters (status, category, search). Returns summary fields.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["draft", "published", "scheduled"] },
        category: { type: "string" },
        search: { type: "string", description: "Case-insensitive substring match on title." },
        limit: { type: "number", description: "Max 100. Default 20." },
      },
    },
  },
  {
    name: "get_article",
    description: "Get a single blog article by id or slug.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, slug: { type: "string" } },
    },
  },
  {
    name: "create_article",
    description: "Create a new blog article. Defaults status to 'draft'. Slug auto-generated from title if empty.",
    inputSchema: {
      type: "object",
      required: ["title", "content", "category"],
      properties: {
        title: { type: "string" },
        content: { type: "string", description: "HTML content." },
        excerpt: { type: "string" },
        cover_image: { type: "string" },
        category: { type: "string" },
        author_id: { type: "string" },
        author: { type: "string" },
        focus_keyword: { type: "string" },
        seo_title: { type: "string" },
        meta_description: { type: "string" },
        slug: { type: "string" },
        status: { type: "string", enum: ["draft", "published", "scheduled"] },
        published_at: { type: "string", description: "ISO timestamp. Required if status=scheduled." },
        send_notification: { type: "boolean" },
      },
    },
  },
  {
    name: "update_article",
    description: "Partial update of an existing article by id. Recomputes word_count if content changes.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        content: { type: "string" },
        excerpt: { type: "string" },
        cover_image: { type: "string" },
        category: { type: "string" },
        author_id: { type: "string" },
        author: { type: "string" },
        focus_keyword: { type: "string" },
        seo_title: { type: "string" },
        meta_description: { type: "string" },
        slug: { type: "string" },
        status: { type: "string", enum: ["draft", "published", "scheduled"] },
        published_at: { type: "string" },
        send_notification: { type: "boolean" },
      },
    },
  },
  {
    name: "delete_article",
    description: "Delete an article. Requires confirm=true.",
    inputSchema: {
      type: "object",
      required: ["id", "confirm"],
      properties: {
        id: { type: "string" },
        confirm: { type: "boolean", description: "Must be true to actually delete." },
      },
    },
  },
  {
    name: "publish_article",
    description: "Shortcut to publish an article now (status=published, published_at=now).",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        send_notification: { type: "boolean" },
      },
    },
  },
  {
    name: "mysql_list_tables",
    description: "List all tables in the Rapatin MySQL database (read-only).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "mysql_describe_table",
    description: "Describe columns of a Rapatin MySQL table.",
    inputSchema: {
      type: "object",
      required: ["table"],
      properties: { table: { type: "string", description: "Table name (alphanumeric + underscore)." } },
    },
  },
  {
    name: "mysql_run_query",
    description: "Run a read-only SQL query against Rapatin MySQL. Only SELECT/SHOW/DESCRIBE/EXPLAIN/WITH allowed. Auto-capped to 1000 rows.",
    inputSchema: {
      type: "object",
      required: ["sql"],
      properties: {
        sql: { type: "string" },
        params: { type: "array", items: {}, description: "Prepared statement params." },
      },
    },
  },
  // ---- BirdSend (https://api.birdsend.co/v1) ----
  {
    name: "birdsend_account",
    description: "Get the connected BirdSend user account info.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "birdsend_list_broadcasts",
    description: "List BirdSend broadcasts (email campaigns) with pagination/search.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number" },
        per_page: { type: "number" },
        keyword: { type: "string" },
        search_by: { type: "string", enum: ["name", "status"] },
        order_by: { type: "string", enum: ["name", "created_at"] },
        sort: { type: "string", enum: ["asc", "desc"] },
      },
    },
  },
  {
    name: "birdsend_get_broadcast",
    description: "Get a single BirdSend broadcast by broadcast_id.",
    inputSchema: {
      type: "object",
      required: ["broadcast_id"],
      properties: { broadcast_id: { type: "number" } },
    },
  },
  {
    name: "birdsend_create_broadcast",
    description: "Create a BirdSend broadcast. Pass the payload fields per BirdSend API (name, email{subject,body}, recipients, sender, schedule, footer).",
    inputSchema: {
      type: "object",
      required: ["name", "email"],
      properties: {
        name: { type: "string" },
        email: { type: "object", description: "{ subject, body }" },
        recipients: { type: "object", description: "{ match, conditions[] }" },
        sender: { type: "object", description: "{ email, name, company, address }" },
        schedule: { type: "object", description: "{ type, datetime, timezone }" },
        footer: { type: "string" },
      },
    },
  },
  {
    name: "birdsend_update_broadcast",
    description: "Partially update a BirdSend broadcast by broadcast_id.",
    inputSchema: {
      type: "object",
      required: ["broadcast_id"],
      properties: {
        broadcast_id: { type: "number" },
        name: { type: "string" },
        email: { type: "object" },
        recipients: { type: "object" },
        sender: { type: "object" },
        schedule: { type: "object" },
        footer: { type: "string" },
      },
    },
  },
  {
    name: "birdsend_delete_broadcast",
    description: "Delete a BirdSend broadcast. Requires confirm=true.",
    inputSchema: {
      type: "object",
      required: ["broadcast_id", "confirm"],
      properties: { broadcast_id: { type: "number" }, confirm: { type: "boolean" } },
    },
  },
  {
    name: "birdsend_list_contacts",
    description: "List BirdSend contacts with pagination/search.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number" },
        per_page: { type: "number" },
        keyword: { type: "string" },
        search_by: { type: "string" },
        order_by: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] },
      },
    },
  },
  {
    name: "birdsend_get_contact",
    description: "Get a single BirdSend contact by contact_id.",
    inputSchema: {
      type: "object",
      required: ["contact_id"],
      properties: { contact_id: { type: "number" } },
    },
  },
  {
    name: "birdsend_create_contact",
    description: "Create a BirdSend contact. Optionally attach tags and custom fields.",
    inputSchema: {
      type: "object",
      required: ["email"],
      properties: {
        email: { type: "string" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        tags: { type: "array", items: {}, description: "Array of tag ids or names." },
        fields: { type: "object", description: "Custom field values." },
      },
    },
  },
  {
    name: "birdsend_update_contact",
    description: "Partially update a BirdSend contact by contact_id.",
    inputSchema: {
      type: "object",
      required: ["contact_id"],
      properties: {
        contact_id: { type: "number" },
        email: { type: "string" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        fields: { type: "object" },
      },
    },
  },
  {
    name: "birdsend_delete_contact",
    description: "Delete a BirdSend contact. Requires confirm=true.",
    inputSchema: {
      type: "object",
      required: ["contact_id", "confirm"],
      properties: { contact_id: { type: "number" }, confirm: { type: "boolean" } },
    },
  },
  {
    name: "birdsend_add_contact_tags",
    description: "Add one or more tags to a BirdSend contact.",
    inputSchema: {
      type: "object",
      required: ["contact_id", "tags"],
      properties: { contact_id: { type: "number" }, tags: { type: "array", items: {} } },
    },
  },
  {
    name: "birdsend_remove_contact_tag",
    description: "Remove a tag from a BirdSend contact.",
    inputSchema: {
      type: "object",
      required: ["contact_id", "tag_id"],
      properties: { contact_id: { type: "number" }, tag_id: { type: "number" } },
    },
  },
  {
    name: "birdsend_subscribe_contact",
    description: "Subscribe a BirdSend contact (re-activate).",
    inputSchema: {
      type: "object",
      required: ["contact_id"],
      properties: { contact_id: { type: "number" } },
    },
  },
  {
    name: "birdsend_unsubscribe_contact",
    description: "Unsubscribe a BirdSend contact.",
    inputSchema: {
      type: "object",
      required: ["contact_id"],
      properties: { contact_id: { type: "number" } },
    },
  },
  {
    name: "birdsend_list_tags",
    description: "List BirdSend tags.",
    inputSchema: {
      type: "object",
      properties: { page: { type: "number" }, per_page: { type: "number" }, keyword: { type: "string" } },
    },
  },
  {
    name: "birdsend_list_fields",
    description: "List BirdSend custom fields.",
    inputSchema: {
      type: "object",
      properties: { page: { type: "number" }, per_page: { type: "number" } },
    },
  },
  {
    name: "birdsend_list_forms",
    description: "List BirdSend forms.",
    inputSchema: {
      type: "object",
      properties: { page: { type: "number" }, per_page: { type: "number" } },
    },
  },
  {
    name: "birdsend_list_sequences",
    description: "List BirdSend sequences (automations).",
    inputSchema: {
      type: "object",
      properties: { page: { type: "number" }, per_page: { type: "number" } },
    },
  },
  ...KLEDO_TOOLS,
];

// -------- tool handlers --------
async function handleTool(name: string, args: Record<string, any>) {
  args = args || {};

  // ---- Kledo tools ----
  if (name.startsWith("kledo_")) {
    try {
      if (name.startsWith("kledo_delete_") && args.confirm !== true) {
        return toolText({ error: "Penghapusan dibatalkan. Kirim confirm: true untuk mengeksekusi." }, true);
      }
      const r = await handleKledoTool(name, args);
      if (!r) return toolText({ error: `Unknown tool: ${name}` }, true);
      if (!r.ok) return toolText({ error: "Kledo API error", status: r.status, details: r.data }, true);
      return toolText(r.data);
    } catch (e) {
      return toolText({ error: (e as Error).message }, true);
    }
  }

  // ---- BirdSend tools ----
  if (name.startsWith("birdsend_")) {

    try {
      const pick = (keys: string[]) => {
        const o: Record<string, unknown> = {};
        for (const k of keys) if (args[k] !== undefined) o[k] = args[k];
        return o;
      };
      const listQuery = pick(["page", "per_page", "keyword", "search_by", "order_by", "sort"]);
      let r;
      switch (name) {
        case "birdsend_account":
          r = await birdsendFetch("GET", "/account");
          break;
        case "birdsend_list_broadcasts":
          r = await birdsendFetch("GET", "/broadcasts", { query: listQuery });
          break;
        case "birdsend_get_broadcast":
          if (!args.broadcast_id) return toolText({ error: "broadcast_id is required." }, true);
          r = await birdsendFetch("GET", `/broadcasts/${args.broadcast_id}`);
          break;
        case "birdsend_create_broadcast":
          if (!args.name || !args.email) return toolText({ error: "name and email are required." }, true);
          r = await birdsendFetch("POST", "/broadcasts", {
            body: pick(["name", "email", "recipients", "sender", "schedule", "footer"]),
          });
          break;
        case "birdsend_update_broadcast":
          if (!args.broadcast_id) return toolText({ error: "broadcast_id is required." }, true);
          r = await birdsendFetch("PATCH", `/broadcasts/${args.broadcast_id}`, {
            body: pick(["name", "email", "recipients", "sender", "schedule", "footer"]),
          });
          break;
        case "birdsend_delete_broadcast":
          if (!args.broadcast_id) return toolText({ error: "broadcast_id is required." }, true);
          if (args.confirm !== true) return toolText({ error: "confirm must be true to delete." }, true);
          r = await birdsendFetch("DELETE", `/broadcasts/${args.broadcast_id}`);
          break;
        case "birdsend_list_contacts":
          r = await birdsendFetch("GET", "/contacts", { query: listQuery });
          break;
        case "birdsend_get_contact":
          if (!args.contact_id) return toolText({ error: "contact_id is required." }, true);
          r = await birdsendFetch("GET", `/contacts/${args.contact_id}`);
          break;
        case "birdsend_create_contact":
          if (!args.email) return toolText({ error: "email is required." }, true);
          r = await birdsendFetch("POST", "/contacts", {
            body: pick(["email", "first_name", "last_name", "tags", "fields"]),
          });
          break;
        case "birdsend_update_contact":
          if (!args.contact_id) return toolText({ error: "contact_id is required." }, true);
          r = await birdsendFetch("PATCH", `/contacts/${args.contact_id}`, {
            body: pick(["email", "first_name", "last_name", "fields"]),
          });
          break;
        case "birdsend_delete_contact":
          if (!args.contact_id) return toolText({ error: "contact_id is required." }, true);
          if (args.confirm !== true) return toolText({ error: "confirm must be true to delete." }, true);
          r = await birdsendFetch("DELETE", `/contacts/${args.contact_id}`);
          break;
        case "birdsend_add_contact_tags":
          if (!args.contact_id || !Array.isArray(args.tags)) {
            return toolText({ error: "contact_id and tags[] are required." }, true);
          }
          r = await birdsendFetch("POST", `/contacts/${args.contact_id}/tags`, { body: { tags: args.tags } });
          break;
        case "birdsend_remove_contact_tag":
          if (!args.contact_id || !args.tag_id) {
            return toolText({ error: "contact_id and tag_id are required." }, true);
          }
          r = await birdsendFetch("DELETE", `/contacts/${args.contact_id}/tags/${args.tag_id}`);
          break;
        case "birdsend_subscribe_contact":
          if (!args.contact_id) return toolText({ error: "contact_id is required." }, true);
          r = await birdsendFetch("POST", `/contacts/${args.contact_id}/subscribe`);
          break;
        case "birdsend_unsubscribe_contact":
          if (!args.contact_id) return toolText({ error: "contact_id is required." }, true);
          r = await birdsendFetch("DELETE", `/contacts/${args.contact_id}/unsubscribe`);
          break;
        case "birdsend_list_tags":
          r = await birdsendFetch("GET", "/tags", { query: listQuery });
          break;
        case "birdsend_list_fields":
          r = await birdsendFetch("GET", "/fields", { query: listQuery });
          break;
        case "birdsend_list_forms":
          r = await birdsendFetch("GET", "/forms", { query: listQuery });
          break;
        case "birdsend_list_sequences":
          r = await birdsendFetch("GET", "/sequences", { query: listQuery });
          break;
        default:
          return toolText({ error: `Unknown tool: ${name}` }, true);
      }
      if (!r.ok) return toolText({ error: "BirdSend API error", status: r.status, details: r.data }, true);
      return toolText(r.data);
    } catch (e) {
      return toolText({ error: (e as Error).message }, true);
    }
  }

  switch (name) {
    case "mysql_list_tables": {
      try {
        const tables = await mysqlListTables();
        return toolText({ count: tables.length, tables });
      } catch (e) {
        return toolText({ error: (e as Error).message }, true);
      }
    }
    case "mysql_describe_table": {
      if (!args.table) return toolText({ error: "table is required." }, true);
      try {
        const columns = await mysqlDescribeTable(args.table);
        return toolText({ table: args.table, columns });
      } catch (e) {
        return toolText({ error: (e as Error).message }, true);
      }
    }
    case "mysql_run_query": {
      if (!args.sql) return toolText({ error: "sql is required." }, true);
      try {
        const params = Array.isArray(args.params) ? args.params : [];
        const result = await mysqlRunQuery(args.sql, params);
        return toolText(result);
      } catch (e) {
        return toolText({ error: (e as Error).message }, true);
      }
    }
    case "list_articles": {
      const limit = Math.min(Math.max(Number(args.limit) || 20, 1), 100);
      let q = supabase
        .from("blog_posts")
        .select("id,title,slug,status,category,published_at,focus_keyword,word_count,created_at,updated_at")
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (args.status) q = q.eq("status", args.status);
      if (args.category) q = q.eq("category", args.category);
      if (args.search) q = q.ilike("title", `%${args.search}%`);
      const { data, error } = await q;
      if (error) return toolText({ error: error.message }, true);
      return toolText({ count: data?.length ?? 0, articles: data });
    }

    case "get_article": {
      if (!args.id && !args.slug) return toolText({ error: "Provide id or slug." }, true);
      let q = supabase.from("blog_posts").select("*").limit(1);
      if (args.id) q = q.eq("id", args.id);
      else q = q.eq("slug", args.slug);
      const { data, error } = await q.maybeSingle();
      if (error) return toolText({ error: error.message }, true);
      if (!data) return toolText({ error: "Not found." }, true);
      return toolText(data);
    }

    case "create_article": {
      if (!args.title || !args.content || !args.category) {
        return toolText({ error: "title, content, and category are required." }, true);
      }
      const status = args.status || "draft";
      if (status === "scheduled" && !args.published_at) {
        return toolText({ error: "published_at is required when status=scheduled." }, true);
      }
      const slug = args.slug ? slugify(args.slug) : slugify(args.title);
      const { data: existing } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
      const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

      const row = {
        title: args.title,
        slug: finalSlug,
        content: args.content,
        excerpt: args.excerpt ?? null,
        cover_image: args.cover_image ?? null,
        category: args.category,
        author: args.author || "Admin",
        author_id: args.author_id || DEFAULT_AUTHOR_ID,
        focus_keyword: args.focus_keyword ?? null,
        seo_title: args.seo_title ?? null,
        meta_description: args.meta_description ?? null,
        status,
        published_at: status === "published" ? (args.published_at || new Date().toISOString()) : (args.published_at ?? null),
        send_notification: args.send_notification ?? true,
        word_count: countWords(args.content),
      };

      const { data, error } = await supabase.from("blog_posts").insert(row).select().single();
      if (error) return toolText({ error: error.message }, true);
      return toolText({ created: data });
    }

    case "update_article": {
      if (!args.id) return toolText({ error: "id is required." }, true);
      const patch: Record<string, any> = {};
      const fields = ["title", "content", "excerpt", "cover_image", "category", "author", "author_id",
        "focus_keyword", "seo_title", "meta_description", "status", "published_at", "send_notification"];
      for (const f of fields) if (args[f] !== undefined) patch[f] = args[f];
      if (args.slug !== undefined) patch.slug = slugify(args.slug);
      if (args.content !== undefined) patch.word_count = countWords(args.content);
      if (patch.status === "published" && !patch.published_at) {
        const { data: cur } = await supabase.from("blog_posts").select("published_at").eq("id", args.id).maybeSingle();
        if (!cur?.published_at) patch.published_at = new Date().toISOString();
      }
      patch.updated_at = new Date().toISOString();

      const { data, error } = await supabase.from("blog_posts").update(patch).eq("id", args.id).select().single();
      if (error) return toolText({ error: error.message }, true);
      return toolText({ updated: data });
    }

    case "delete_article": {
      if (!args.id) return toolText({ error: "id is required." }, true);
      if (args.confirm !== true) return toolText({ error: "confirm must be true to delete." }, true);
      const { error } = await supabase.from("blog_posts").delete().eq("id", args.id);
      if (error) return toolText({ error: error.message }, true);
      return toolText({ deleted: args.id });
    }

    case "publish_article": {
      if (!args.id) return toolText({ error: "id is required." }, true);
      const patch: Record<string, any> = {
        status: "published",
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (args.send_notification !== undefined) patch.send_notification = args.send_notification;
      const { data, error } = await supabase.from("blog_posts").update(patch).eq("id", args.id).select().single();
      if (error) return toolText({ error: error.message }, true);
      return toolText({ published: data });
    }

    default:
      return toolText({ error: `Unknown tool: ${name}` }, true);
  }
}

// -------- JSON-RPC dispatcher --------
async function dispatch(msg: any, sessionId: string) {
  const { id, method, params } = msg;
  try {
    switch (method) {
      case "initialize":
        return jsonRpcResult(id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "rapatin-mcp", version: "1.0.0" },
        });
      case "notifications/initialized":
      case "notifications/cancelled":
      case "notifications/roots/list_changed":
        return null; // no response for notifications
      case "ping":
        return jsonRpcResult(id, {});
      case "tools/list":
        return jsonRpcResult(id, { tools: TOOLS });
      case "tools/call": {
        const name = params?.name;
        const args = params?.arguments || {};
        if (!name) return jsonRpcError(id, -32602, "Missing tool name");
        const result = await handleTool(name, args);
        return jsonRpcResult(id, result);
      }
      case "resources/list":
        return jsonRpcResult(id, { resources: [] });
      case "prompts/list":
        return jsonRpcResult(id, { prompts: [] });
      default:
        return jsonRpcError(id, -32601, `Method not found: ${method}`);
    }
  } catch (e) {
    return jsonRpcError(id, -32603, (e as Error).message);
  }
}

function verifyAuth(req: Request): boolean {
  if (!API_KEY) return false;
  const auth = req.headers.get("authorization") || req.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer ") && auth.slice(7).trim() === API_KEY) return true;
  const xKey = req.headers.get("x-api-key") || req.headers.get("X-API-Key") || "";
  if (xKey && xKey === API_KEY) return true;
  return false;
}

function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32001,
        message: "Unauthorized: missing or invalid API key. Send via 'Authorization: Bearer <token>' or 'X-API-Key' header.",
      },
    }),
    {
      status: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer realm="Rapatin MCP"',
      },
    },
  );
}

function methodNotAllowed(): Response {
  return new Response(
    JSON.stringify(jsonRpcError(null, -32000, "Method not allowed. Use POST.")),
    {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json", Allow: "POST, OPTIONS" },
    },
  );
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  console.log(`[mcp] ${req.method} ${url.pathname} accept="${req.headers.get("accept") || ""}" auth=${req.headers.get("authorization") ? "yes" : "no"} xkey=${req.headers.get("x-api-key") ? "yes" : "no"}`);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (!verifyAuth(req)) {
    return unauthorizedResponse();
  }

  if (req.method === "GET" || req.method === "DELETE") {
    return methodNotAllowed();
  }

  if (req.method !== "POST") {
    return methodNotAllowed();
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify(jsonRpcError(null, -32700, "Parse error")),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const messages = Array.isArray(body) ? body : [body];
  const isInitialize = messages.some((m) => m?.method === "initialize");
  const sessionId = req.headers.get("mcp-session-id") || req.headers.get("Mcp-Session-Id") || crypto.randomUUID();

  const responses: any[] = [];
  for (const m of messages) {
    console.log(`[mcp] rpc method=${m?.method} id=${m?.id} tool=${m?.params?.name ?? ""}`);
    const r = await dispatch(m, sessionId);
    if (r !== null) responses.push(r);
  }

  const extraHeaders: Record<string, string> = {};
  if (isInitialize) {
    extraHeaders["Mcp-Session-Id"] = sessionId;
  }

  // No responses (only notifications) → 202 Accepted
  if (responses.length === 0) {
    return new Response(null, { status: 202, headers: { ...corsHeaders, ...extraHeaders } });
  }

  const payload = Array.isArray(body) ? responses : responses[0];

  // Content negotiation: prefer SSE when client accepts text/event-stream
  const accept = (req.headers.get("accept") || "").toLowerCase();
  const wantsSSE = accept.includes("text/event-stream");

  if (wantsSSE) {
    const sseBody = `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
    return new Response(sseBody, {
      status: 200,
      headers: {
        ...corsHeaders,
        ...extraHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
      "Content-Type": "application/json",
    },
  });
});
