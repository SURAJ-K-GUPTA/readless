import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Bookmark from "@/models/Bookmark";
import { getUserFromToken } from "@/lib/authHelpers";

// DELETE /api/bookmark/:id
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const deleted = await Bookmark.findOneAndDelete({ _id: id, userId: user.id });
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Bookmark deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PATCH /api/bookmark/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const data = await req.json();
    const updated = await Bookmark.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: data },
      { new: true }
    );

    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Bookmark updated", bookmark: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
} 