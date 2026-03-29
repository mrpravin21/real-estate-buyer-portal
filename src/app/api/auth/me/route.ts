import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api-response";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, session.sub))
      .limit(1);

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    return jsonOk({ user });
  } catch (e) {
    return handleRouteError(e);
  }
}
