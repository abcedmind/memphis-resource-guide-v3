import type { Resource } from "./types";

/**
 * Fixed street locations for resources that have a real front door.
 * Online/countywide/multi-site programs intentionally have no entry —
 * a distance number would be misleading for them.
 *
 * Keyed by resource id (stable across seed data and the database).
 */
export const RESOURCE_COORDS: Record<
  string,
  { lat: number; lng: number; place: string }
> = {
  // Central Library — CLOUD901, JobLINC live here
  cloud901: { lat: 35.1216, lng: -89.9433, place: "Central Library, 3030 Poplar Ave" },
  joblinc: { lat: 35.1216, lng: -89.9433, place: "Central Library, 3030 Poplar Ave" },
  // Memphis Zoo (Overton Park)
  zoo: { lat: 35.1509, lng: -89.9938, place: "2000 Prentiss Pl, Overton Park" },
  // OUTMemphis Youth Empowerment Center
  prysm: { lat: 35.1141, lng: -89.9683, place: "2055 Southern Ave" },
  "out-nav": { lat: 35.1141, lng: -89.9683, place: "2055 Southern Ave" },
  // Shelby County Health Department (WIC main clinic)
  wic: { lat: 35.1436, lng: -90.0416, place: "814 Jefferson Ave" },
  // Porter-Leath main campus (Early Head Start / Head Start intake)
  ehs: { lat: 35.1615, lng: -90.0301, place: "868 N Manassas St" },
  hs: { lat: 35.1615, lng: -90.0301, place: "868 N Manassas St" },
  // Latino Memphis
  latino: { lat: 35.0916, lng: -89.8963, place: "6041 Mt Moriah Rd Ext" },
  // The Arc Mid-South
  arc: { lat: 35.1329, lng: -89.9853, place: "3485 Poplar Ave Ste 210" },
  // Boling Center (UTHSC)
  boling: { lat: 35.1416, lng: -90.0334, place: "711 Jefferson Ave" },
  // Refugee Empowerment Program
  "refugee-emp": { lat: 35.1043, lng: -89.9354, place: "3765 S Perkins Rd" },
  // CodeCrew HQ
  codecrew: { lat: 35.1391, lng: -90.0134, place: "400 N Cleveland St" },
  // Boys & Girls Clubs — Technical Training Center (flagship)
  bgc: { lat: 35.1712, lng: -90.0122, place: "1768 Chelsea Ave" },
};

/** Great-circle distance in miles between two points. */
export function haversineMiles(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 3958.7613; // Earth radius, miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance from the user to a resource, or null when it has no fixed site. */
export function resourceDistanceMiles(
  r: Resource,
  userLat: number,
  userLng: number
): number | null {
  const c = RESOURCE_COORDS[r.id];
  if (!c) return null;
  return haversineMiles(userLat, userLng, c.lat, c.lng);
}

/**
 * Sort resources for "near me": everything with a known location first,
 * closest first; resources without a fixed site keep their original order
 * after them (they're online/countywide, so distance doesn't apply).
 */
export function sortByDistance(
  resources: Resource[],
  userLat: number,
  userLng: number
): Resource[] {
  return resources
    .map((r, i) => ({ r, i, d: resourceDistanceMiles(r, userLat, userLng) }))
    .sort((a, b) => {
      if (a.d === null && b.d === null) return a.i - b.i;
      if (a.d === null) return 1;
      if (b.d === null) return -1;
      return a.d - b.d;
    })
    .map((x) => x.r);
}
