import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { jsonError, handleRouteError, jsonOk } from "@/lib/api-response";
import { signToken, cookieOptions } from "@/lib/auth/jwt";
import { AUTH_COOKIE } from "@/lib/constants";
import { registerSchema } from "@/lib/validation/auth";

const WEEK = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, parsed.email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return jsonError("An account with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const [user] = await db
      .insert(users)
      .values({
        email: parsed.email.toLowerCase(),
        passwordHash,
        name: parsed.name,
        role: "buyer",
        avatarUrl: parsed.avatarDataUrl,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = jsonOk({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    res.cookies.set(AUTH_COOKIE, token, cookieOptions(WEEK));
    return res;
  } catch (e) {
    return handleRouteError(e);
  }
}
