import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/constants";
import { verifyToken, type JwtPayload } from "./jwt";

export async function getSession(): Promise<JwtPayload | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<JwtPayload> {
  const session = await getSession();
  if (!session) {
    const err = new Error("UNAUTHORIZED");
    (err as Error & { status: number }).status = 401;
    throw err;
  }
  return session;
}
