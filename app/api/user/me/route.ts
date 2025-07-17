import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = (await cookieStore).get?.("token")?.value ?? (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    let decoded: { id: string; email: string };
    try {
      decoded = verifyToken(token) as { id: string; email: string };
    } catch {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
