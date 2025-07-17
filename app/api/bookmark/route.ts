import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Bookmark from "@/models/Bookmark";
import { bookmarkSchema } from "@/zod/bookmarkSchema";
import { treeifyError } from "zod";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getUserFromToken } from "@/lib/authHelpers";

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
    const { url, title, summary, favicon, tags, orderIndex } = parsed.data;

    const newBookmark = await Bookmark.create({
      userId: decoded.id,
      url,
      title,
      summary,
      favicon,
      tags,
      orderIndex,
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
