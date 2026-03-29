import "./load-env";
import { db } from "../src/db";
import { properties } from "../src/db/schema";

const SAMPLE = [
  {
    title: "Patan Heritage Terrace",
    description:
      "Sun-filled three-bedroom with private terrace, traditional brick accents, and modern kitchen — minutes from Patan Durbar Square.",
    location: "Patan, Lalitpur",
    price: 28500000,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    areaSqft: 2100,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpots: 1,
    floors: 2,
    distanceMartM: 420,
    distanceHospitalM: 890,
    facing: "East",
    yearBuilt: 2018,
  },
  {
    title: "Boudha Skyline Loft",
    description:
      "Contemporary loft with panoramic stupa views, floor-to-ceiling glass, and smart lighting throughout.",
    location: "Boudha, Kathmandu",
    price: 35200000,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    areaSqft: 1850,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
    floors: 1,
    distanceMartM: 280,
    distanceHospitalM: 1200,
    facing: "North-East",
    yearBuilt: 2021,
  },
  {
    title: "Jhamsikhel Garden Villa",
    description:
      "Quiet lane, mature garden, double-height living, and parking for two — ideal for families.",
    location: "Jhamsikhel, Lalitpur",
    price: 49800000,
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    areaSqft: 3400,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpots: 2,
    floors: 3,
    distanceMartM: 650,
    distanceHospitalM: 2100,
    facing: "South",
    yearBuilt: 2016,
  },
  {
    title: "Thamel Executive Flat",
    description:
      "Premium two-bedroom in a boutique building — concierge, gym, and rooftop lounge.",
    location: "Thamel, Kathmandu",
    price: 22100000,
    imageUrl:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    areaSqft: 1420,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
    floors: 1,
    distanceMartM: 150,
    distanceHospitalM: 950,
    facing: "West",
    yearBuilt: 2019,
  },
  {
    title: "Nakkhu Hillside Retreat",
    description:
      "Elevated plot with valley breeze, open plan, and space for a home office studio.",
    location: "Nakkhu, Lalitpur",
    price: 31500000,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    areaSqft: 2280,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpots: 2,
    floors: 2,
    distanceMartM: 780,
    distanceHospitalM: 1750,
    facing: "North",
    yearBuilt: 2020,
  },
];

async function main() {
  const existing = await db.select({ id: properties.id }).from(properties).limit(1);
  if (existing.length > 0) {
    console.log("Properties already seeded — skipping.");
    return;
  }
  await db.insert(properties).values(SAMPLE);
  console.log(`Inserted ${SAMPLE.length} properties.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
