import { NextResponse } from "next/server";

/**
 * Proxy para o LightWidget (Instagram Feed)
 * 
 * O plano gratuito do LightWidget serve os widgets via HTTP, o que causa
 * bloqueio de "Mixed Content" em sites HTTPS. Este proxy busca o conteúdo
 * do LightWidget server-side (Node.js não tem restrição de Mixed Content)
 * e o re-serve via HTTPS do próprio domínio, resolvendo o problema.
 * 
 * Cache: 1 hora (stale-while-revalidate: 2 horas)
 */

const LIGHTWIDGET_WIDGET_ID = "21630b1c8251538cbcdac860e3d2e363";
const LIGHTWIDGET_URL = `https://lightwidget.com/widgets/${LIGHTWIDGET_WIDGET_ID}.html`;

// In-memory cache
let cachedHtml: { content: string; fetchedAt: number } | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hora

export async function GET() {
  const now = Date.now();

  // Return cache if fresh
  if (cachedHtml && now - cachedHtml.fetchedAt < CACHE_DURATION_MS) {
    return new NextResponse(cachedHtml.content, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Frame-Options": "SAMEORIGIN",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const res = await fetch(LIGHTWIDGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        Referer: "https://lightwidget.com/",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`LightWidget fetch failed: ${res.status}`);
    }

    let html = await res.text();

    // Rewrite all protocol-relative or HTTP URLs to HTTPS within the widget HTML
    // so that sub-resources (images, JS) loaded by the widget also use HTTPS
    html = html
      .replace(/src="\/\//g, 'src="https://')
      .replace(/href="\/\//g, 'href="https://')
      .replace(/src='\/\//g, "src='https://")
      .replace(/href='\/\//g, "href='https://")
      .replace(/src="http:\/\//g, 'src="https://')
      .replace(/href="http:\/\//g, 'href="https://');

    // Cache the result
    cachedHtml = { content: html, fetchedAt: now };

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Frame-Options": "SAMEORIGIN",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("[Instagram Widget Proxy] Error:", error);

    // Return stale cache if available
    if (cachedHtml) {
      return new NextResponse(cachedHtml.content, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
          "X-Cache": "STALE",
        },
      });
    }

    return new NextResponse("<p>Feed temporariamente indisponível.</p>", {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
