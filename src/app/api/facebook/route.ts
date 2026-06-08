import { NextResponse } from "next/server";

/**
 * Facebook Page Graph API Route
 * 
 * Busca os posts mais recentes da página do Facebook via Graph API oficial da Meta.
 * 100% gratuito, sem limites de visualização.
 * 
 * Requer:
 * - FACEBOOK_PAGE_ACCESS_TOKEN (Token de Acesso da Página - Permanente)
 * - FACEBOOK_PAGE_ID (ID da Página do Facebook)
 * 
 * Cache: 1 hora (revalidate: 3600)
 */

const GRAPH_API_VERSION = "v22.0";
const POSTS_LIMIT = 6;

// In-memory cache for the Facebook feed
let cachedFeed: { data: any[]; fetchedAt: number } | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

async function fetchFacebookFeed(token: string, pageId: string) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed?fields=id,message,full_picture,permalink_url,created_time&limit=${POSTS_LIMIT}&access_token=${token}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("[Facebook API] Error fetching feed:", res.status, errorBody);
    throw new Error(`Facebook API error: ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}

export async function GET() {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  // If not configured, return empty array (frontend will show static fallback)
  if (!token || !pageId) {
    return NextResponse.json(
      { posts: [], configured: false },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  }

  // Check in-memory cache first
  const now = Date.now();
  if (cachedFeed && now - cachedFeed.fetchedAt < CACHE_DURATION_MS) {
    return NextResponse.json(
      { posts: cachedFeed.data, configured: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          "X-Cache": "HIT",
        },
      }
    );
  }

  try {
    // Fetch latest posts from Facebook
    const posts = await fetchFacebookFeed(token, pageId);

    // Update in-memory cache
    cachedFeed = { data: posts, fetchedAt: now };

    return NextResponse.json(
      { posts, configured: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.error("[Facebook API] Failed to fetch feed:", error);

    // If cache exists but is stale, still return it
    if (cachedFeed) {
      return NextResponse.json(
        { posts: cachedFeed.data, configured: true },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
            "X-Cache": "STALE",
          },
        }
      );
    }

    // No cache, no API → frontend will show fallback
    return NextResponse.json(
      { posts: [], configured: true, error: "Failed to fetch" },
      { status: 200 }
    );
  }
}
