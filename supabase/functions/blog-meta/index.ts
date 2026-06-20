import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE = "https://rapatin.id";
const FALLBACK_IMAGE = `${SITE}/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png`;

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(s: string | null | undefined): string {
  if (!s) return "";
  return String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function fallbackPage(status: number, slug: string): Response {
  const url = `${SITE}/blog/${slug}`;
  const html = `<!doctype html><html lang="id"><head>
<meta charset="utf-8">
<title>Rapatin - Jadwalkan rapat Zoom tanpa langganan</title>
<meta name="description" content="Rapatin - Jadwalkan rapat Zoom tanpa langganan">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="Rapatin">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${FALLBACK_IMAGE}">
<meta http-equiv="refresh" content="0; url=${url}">
</head><body><a href="${url}">Lanjut ke ${esc(url)}</a></body></html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    let slug = url.searchParams.get("slug") ?? "";
    if (!slug) {
      // fallback: parse from path /blog/<slug>
      const m = url.pathname.match(/\/blog\/([^/]+)/);
      if (m) slug = decodeURIComponent(m[1]);
    }
    slug = slug.trim().toLowerCase();
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return fallbackPage(400, slug || "");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(
        "title, slug, excerpt, meta_description, cover_image, category, author, focus_keyword, seo_title, published_at, created_at, updated_at",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !post) {
      return fallbackPage(404, slug);
    }

    const canonical = `${SITE}/blog/${post.slug}`;
    const title = (post.seo_title?.trim() || post.title || "Rapatin").slice(0, 160);
    const description = (
      post.meta_description?.trim() ||
      stripHtml(post.excerpt) ||
      `Baca artikel "${post.title}" di blog Rapatin.`
    ).slice(0, 300);
    const image = post.cover_image?.trim() || FALLBACK_IMAGE;
    const published = post.published_at || post.created_at;
    const modified = post.updated_at || published;
    const tags = (post.focus_keyword || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      image,
      url: canonical,
      datePublished: published,
      dateModified: modified,
      author: { "@type": "Person", name: post.author || "Rapatin" },
      publisher: {
        "@type": "Organization",
        name: "Rapatin",
        logo: { "@type": "ImageObject", url: FALLBACK_IMAGE },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      inLanguage: "id-ID",
      articleSection: post.category || undefined,
      keywords: tags.length ? tags.join(", ") : undefined,
    };

    const tagMetas = tags
      .map((t) => `<meta property="article:tag" content="${esc(t)}">`)
      .join("\n");

    const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="article">
<meta property="og:site_name" content="Rapatin">
<meta property="og:locale" content="id_ID">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:secure_url" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(post.title)}">

<meta property="article:published_time" content="${esc(published)}">
<meta property="article:modified_time" content="${esc(modified)}">
${post.category ? `<meta property="article:section" content="${esc(post.category)}">` : ""}
${post.author ? `<meta property="article:author" content="${esc(post.author)}">` : ""}
${tagMetas}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<meta name="twitter:image:alt" content="${esc(post.title)}">

<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

<meta http-equiv="refresh" content="0; url=${canonical}">
</head>
<body>
<h1>${esc(post.title)}</h1>
<p>${esc(description)}</p>
<p><a href="${canonical}">Baca artikel selengkapnya di ${esc(canonical)}</a></p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (e) {
    console.error("blog-meta error", e);
    return fallbackPage(500, "");
  }
});
