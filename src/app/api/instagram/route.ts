import { NextResponse } from "next/server";

/**
 * Instagram Graph API Route
 * 
 * Busca os posts mais recentes do Instagram via Graph API oficial da Meta.
 * 100% gratuito, sem limites de visualização.
 * 
 * Requer:
 * - INSTAGRAM_ACCESS_TOKEN (Long-Lived Token, 60 dias, auto-renovável)
 * - INSTAGRAM_BUSINESS_ID (ID da conta Business/Creator do Instagram)
 * 
 * Cache: 1 hora (revalidate: 3600)
 */

const GRAPH_API_VERSION = "v22.0";
const MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const POSTS_LIMIT = 12;

// In-memory cache for the Instagram feed
let cachedFeed: { data: any[]; fetchedAt: number } | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Token refresh tracking
let lastTokenRefresh: number = 0;
const TOKEN_REFRESH_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function refreshTokenIfNeeded(token: string): Promise<string> {
  const now = Date.now();

  // Only refresh every ~30 days
  if (lastTokenRefresh > 0 && now - lastTokenRefresh < TOKEN_REFRESH_INTERVAL_MS) {
    return token;
  }

  try {
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
    const res = await fetch(refreshUrl);

    if (res.ok) {
      const data = await res.json();
      if (data.access_token) {
        lastTokenRefresh = now;
        console.log("[Instagram API] Token refreshed successfully");
        return data.access_token;
      }
    }
  } catch (error) {
    console.warn("[Instagram API] Token refresh failed, using current token:", error);
  }

  lastTokenRefresh = now; // Don't retry immediately on failure
  return token;
}

async function fetchInstagramFeed(token: string, igUserId: string) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${igUserId}/media?fields=${MEDIA_FIELDS}&limit=${POSTS_LIMIT}&access_token=${token}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("[Instagram API] Error fetching feed:", res.status, errorBody);
    throw new Error(`Instagram API error: ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_BUSINESS_ID;

  // If not configured, return empty array (frontend will show static fallback)
  if (!token || !igUserId) {
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
    // Try to refresh the token if needed
    const currentToken = await refreshTokenIfNeeded(token);

    // Fetch latest posts from Instagram
    const posts = await fetchInstagramFeed(currentToken, igUserId);

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
    console.error("[Instagram API] Failed to fetch feed:", error);

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
