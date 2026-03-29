export type UserPublic = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string | null;
  areaSqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  floors: number | null;
  distanceMartM: number | null;
  distanceHospitalM: number | null;
  facing: string | null;
  yearBuilt: number | null;
};

export type FavouriteRow = Property & {
  propertyId: string;
  favouritedAt: string;
};
