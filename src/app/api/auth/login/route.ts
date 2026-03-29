import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api-response";
import { signToken, cookieOptions } from "@/lib/auth/jwt";
import { AUTH_COOKIE } from "@/lib/constants";
import { loginSchema } from "@/lib/validation/auth";

const WEEK = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.email.toLowerCase()))
      .limit(1);

    if (!user) {
      return jsonError("Invalid email or password", 401);
    }

    const ok = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!ok) {
      return jsonError("Invalid email or password", 401);
    }

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
