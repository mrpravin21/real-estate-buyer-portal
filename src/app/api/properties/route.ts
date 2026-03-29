import { asc } from "drizzle-orm";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { handleRouteError, jsonOk } from "@/lib/api-response";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: properties.id,
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
      })
      .from(properties)
      .orderBy(asc(properties.title));

    return jsonOk({ properties: rows });
  } catch (e) {
    return handleRouteError(e);
  }
}
