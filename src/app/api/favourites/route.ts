import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { favourites, properties } from "@/db/schema";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/session";
import { favouriteBodySchema } from "@/lib/validation/favourites";

export async function GET() {
  try {
    const session = await requireSession();

    const rows = await db
      .select({
        propertyId: properties.id,
        title: properties.title,
        description: properties.description,
        location: properties.location,
        price: properties.price,
        imageUrl: properties.imageUrl,
        areaSqft: properties.areaSqft,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        parkingSpots: properties.parkingSpots,
        floors: properties.floors,
        distanceMartM: properties.distanceMartM,
        distanceHospitalM: properties.distanceHospitalM,
        facing: properties.facing,
        yearBuilt: properties.yearBuilt,
        favouritedAt: favourites.createdAt,
      })
      .from(favourites)
      .innerJoin(properties, eq(favourites.propertyId, properties.id))
      .where(eq(favourites.userId, session.sub))
      .orderBy(desc(favourites.createdAt));

    return jsonOk({ favourites: rows });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const { propertyId } = favouriteBodySchema.parse(body);

    const [prop] = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!prop) {
      return jsonError("Property not found", 404);
    }

    await db
      .insert(favourites)
      .values({ userId: session.sub, propertyId })
      .onConflictDoNothing({
        target: [favourites.userId, favourites.propertyId],
      });

    return jsonOk({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
