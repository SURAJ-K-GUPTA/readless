import { NextResponse } from "next/server";

export async function DELETE() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return res;
}
