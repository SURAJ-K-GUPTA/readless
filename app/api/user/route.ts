import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { userSchema } from "@/zod/userSchema";
import { generateToken } from "@/lib/auth";
import { treeifyError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: treeifyError(parsed.error) }, { status: 400 });
    }

    const { email, password, type } = parsed.data;

    if (type === "register") {
      const exists = await User.findOne({ email });
      if (exists) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, passwordHash });

      const token = generateToken(newUser);

      const res = NextResponse.json({ message: "User created" }, { status: 201 });
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    // login
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user);

    const res = NextResponse.json({ message: "Login successful" }, { status: 200 });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch (error) {
    console.error("User auth error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
