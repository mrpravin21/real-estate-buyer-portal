import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { favourites } from "@/db/schema";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/session";

type Params = { params: Promise<{ propertyId: string }> };

const uuidParam = z.string().uuid();

export async function DELETE(_request: Request, context: Params) {
  try {
    const session = await requireSession();
    const { propertyId: raw } = await context.params;
    const parsed = uuidParam.safeParse(raw);
    if (!parsed.success) {
      return jsonError("Invalid property id", 400);
    }
    const propertyId = parsed.data;

    await db
      .delete(favourites)
      .where(
        and(
          eq(favourites.userId, session.sub),
          eq(favourites.propertyId, propertyId)
        )
      );

    return jsonOk({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
