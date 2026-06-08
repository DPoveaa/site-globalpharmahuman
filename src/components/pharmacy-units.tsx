import { PharmacyUnitsCarousel } from "./pharmacy-units-carousel";

type Unit = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  mapsUrl: string;
  imageUrl: string | null;
  openTime: string | null;
  closeTime: string | null;
  active: boolean;
};

async function getUnits() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  try {
    const res = await fetch(`${apiUrl}/units`, { next: { revalidate: 300, tags: ["units"] } });
    if (!res.ok) return [];
    return await res.json() as Unit[];
  } catch {
    return [];
  }
}

export async function PharmacyUnits() {
  const units = await getUnits();

  if (!units || units.length === 0) return null;

  return <PharmacyUnitsCarousel units={units} />;
}
