import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function getUserFromToken(): Promise<{ id: string; email: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    return verifyToken(token) as { id: string; email: string };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<{ id: string; email: string }> {
  const user = await getUserFromToken();
  if (!user) throw new Error("Unauthorized");
  return user;
} 