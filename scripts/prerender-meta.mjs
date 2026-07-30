// Menulis satu file HTML per rute marketing ke dist/, dengan <head> berisi
// title/description/canonical/OG khusus halaman tersebut.
// Dijalankan otomatis lewat npm script "postbuild".

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const DIST = resolve("dist");
const SOURCE = resolve(DIST, "index.html");
// Pengaman: jangan pernah menghasilkan output build yang membengkak.
const MAX_PRERENDER_PAGES = 200;

if (!existsSync(SOURCE)) {
  console.error("[prerender-meta] dist/index.html tidak ditemukan, lewati.");
  process.exit(0);
}

// Ambil data rute dari sumber tunggal (TS) tanpa perlu transpiler:
// file-nya hanya berisi literal, jadi kita parse dengan mengevaluasi array-nya.
const routesFile = readFileSync(resolve("src/config/seo-routes.ts"), "utf8");

const SITE_URL = "https://rapatin.id";
const DEFAULT_OG_IMAGE =
  "https://rapatin.id/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png";

function parseRoutes(src) {
  const start = src.indexOf("export const SEO_ROUTES");
  if (start === -1) throw new Error("SEO_ROUTES tidak ditemukan");
  const arrayStart = src.indexOf("[", start);
  let depth = 0;
  let end = arrayStart;
  for (let i = arrayStart; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const literal = src.slice(arrayStart, end);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)();
}

const routes = parseRoutes(routesFile).slice(0, MAX_PRERENDER_PAGES);

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const canonicalFor = (path) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

// Hapus tag head lama yang akan kita ganti agar tidak duplikat.
const STRIP_PATTERNS = [
  /<title>[\s\S]*?<\/title>\s*/i,
  /<meta\s+name="description"[^>]*>\s*/gi,
  /<meta\s+name="keywords"[^>]*>\s*/gi,
  /<link\s+rel="canonical"[^>]*>\s*/gi,
  /<meta\s+property="og:(?:type|url|title|description|image|site_name)"[^>]*>\s*/gi,
  /<meta\s+name="twitter:(?:card|url|title|description|image)"[^>]*>\s*/gi,
];

function buildHead(route) {
  const url = canonicalFor(route.path);
  const image = route.image || DEFAULT_OG_IMAGE;
  const type = route.type || "website";
  const t = escapeAttr(route.title);
  const d = escapeAttr(route.description);

  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    route.keywords
      ? `<meta name="keywords" content="${escapeAttr(route.keywords)}" />`
      : null,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:site_name" content="Rapatin" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:url" content="${url}" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ]
    .filter(Boolean)
    .map((line) => `    ${line}`)
    .join("\n");
}

const template = readFileSync(SOURCE, "utf8");

let written = 0;
for (const route of routes) {
  let html = template;
  for (const pattern of STRIP_PATTERNS) html = html.replace(pattern, "");

  const headBlock = `${buildHead(route)}\n`;
  if (html.includes("<head>")) {
    html = html.replace("<head>", `<head>\n${headBlock}`);
  } else {
    console.warn(`[prerender-meta] <head> tidak ditemukan untuk ${route.path}`);
    continue;
  }

  const target =
    route.path === "/"
      ? resolve(DIST, "index.html")
      : resolve(DIST, `.${route.path}/index.html`);

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  written++;
  console.log(`[prerender-meta] ${route.path} -> ${target.replace(DIST, "dist")}`);
}

console.log(`[prerender-meta] selesai (${written} halaman)`);
