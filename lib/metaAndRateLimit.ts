import { load } from "cheerio";

// --- Jina API Rate Limiter ---
// Simple in-memory rate limiter: 60 calls/hour per IP
const jinaRateLimit: Record<string, number[]> = {};
const JINA_LIMIT = 60;
const JINA_WINDOW = 60 * 60 * 1000; // 1 hour in ms

export function canCallJina(ip: string): boolean {
  const now = Date.now();
  if (!jinaRateLimit[ip]) return true;
  // Remove timestamps older than 1 hour
  jinaRateLimit[ip] = jinaRateLimit[ip].filter(ts => now - ts < JINA_WINDOW);
  return jinaRateLimit[ip].length < JINA_LIMIT;
}

export function recordJinaCall(ip: string) {
  const now = Date.now();
  if (!jinaRateLimit[ip]) jinaRateLimit[ip] = [];
  jinaRateLimit[ip].push(now);
}

export async function extractMetadataFromURL(url: string): Promise<{
  title?: string;
  favicon?: string;
  tags?: string[];
  ogTitle?: string;
  ogImage?: string;
  ogDescription?: string;
}> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();
    const $ = load(html);
    const title = $("title").text() || undefined;
    let favicon = $("link[rel='icon']").attr("href") || $("link[rel='shortcut icon']").attr("href") || "/favicon.ico";
    if (favicon && !favicon.startsWith("http")) {
      const u = new URL(url);
      favicon = u.origin + (favicon.startsWith("/") ? favicon : "/" + favicon);
    }
    const tags = $("meta[name='keywords']").attr("content")?.split(",").map((t: string) => t.trim()).filter(Boolean) || [];
    const ogTitle = $("meta[property='og:title']").attr("content") || undefined;
    const ogImage = $("meta[property='og:image']").attr("content") || undefined;
    const ogDescription = $("meta[property='og:description']").attr("content") || undefined;
    return { title, favicon, tags, ogTitle, ogImage, ogDescription };
  } catch {
    return {};
  }
} 