import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Bookmark from "@/models/Bookmark";
import { bookmarkSchema } from "@/zod/bookmarkSchema";
import { treeifyError } from "zod";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getUserFromToken } from "@/lib/authHelpers";
import { canCallJina, recordJinaCall, extractMetadataFromURL } from "@/lib/metaAndRateLimit";

async function fetchJinaSummary(url: string): Promise<string> {
  try {
    const target = encodeURIComponent(url);
    const res = await fetch(`https://r.jina.ai/${target}`);
    if (!res.ok) throw new Error("Jina API error");
    const summary = await res.text();
    // Optionally trim summary if too long (e.g., 2000 chars)
    return summary.length > 2000 ? summary.slice(0, 2000) + "..." : summary;
  } catch {
    return "Summary temporarily unavailable.";
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const parsed = bookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: treeifyError(parsed.error) }, { status: 400 });
    }

    const cookieStore = cookies();
    const token = (await cookieStore).get?.("token")?.value ?? (await cookieStore).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as { id: string };
    const { url } = parsed.data;

    // Extract metadata if not provided
    const extracted = await extractMetadataFromURL(url);
    const title = parsed.data.title || extracted.title || extracted.ogTitle || url;
    const favicon = parsed.data.favicon || extracted.favicon;
    const tags = parsed.data.tags || extracted.tags;

    // Rate limit Jina API calls per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    let finalSummary = parsed.data.summary;
    if (!finalSummary || finalSummary === "") {
      if (!canCallJina(ip)) {
        finalSummary = "Summary temporarily unavailable. (Rate limit exceeded)";
      } else {
        finalSummary = await fetchJinaSummary(url);
        recordJinaCall(ip);
      }
    }

    const newBookmark = await Bookmark.create({
      userId: decoded.id,
      url,
      title,
      summary: finalSummary,
      favicon,
      tags,
      orderIndex: parsed.data.orderIndex,
    });

    return NextResponse.json({ message: "Bookmark saved", bookmark: newBookmark }, { status: 201 });
  } catch (error) {
    console.error("Bookmark save error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET /api/bookmark?tag=xyz&page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const filter: { userId: string; tags?: string } = { userId: user.id };
    if (tag) filter.tags = tag;

    const bookmarks = await Bookmark.find(filter).sort({ orderIndex: 1 }).skip(skip).limit(limit);
    const total = await Bookmark.countDocuments(filter);

    return NextResponse.json({ bookmarks, total }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
