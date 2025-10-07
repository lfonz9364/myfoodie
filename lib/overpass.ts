import { haversineMeters, metersToWalkingMins } from "./geo";
import { applyTimeHeuristics, prepByCuisine } from "./timeHeuristics";
import { Place } from "./types";

export async function fetchNearbyOverpass(
  user: { lat: number; lon: number },
  radiusMeters: number = 900
): Promise<Place[]> {
  const query = `
[out:json][timeout:25];
(
  node["amenity"~"restaurant|cafe|fast_food"](around:${radiusMeters},${user.lat},${user.lon});
  way ["amenity"~"restaurant|cafe|fast_food"](around:${radiusMeters},${user.lat},${user.lon});
  relation ["amenity"~"restaurant|cafe|fast_food"](around:${radiusMeters},${user.lat},${user.lon});
);
out center tags;`;
  const url = "https://overpass-api.de/api/interpreter";
  const res = await fetch(url, {
    method: "POST",
    body: query,
  });
  const data = await res.json();

  const places: Place[] = (data.elements ?? [])
    .map((el: any) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (!lat || !lon) return null;

      // Extract tags
      const tags = [
        el.tags?.cuisine,
        el.tags?.diet,
        el.tags?.name?.toLowerCase().includes("sushi") ? "sushi" : null,
      ]
        .filter(Boolean)
        .flatMap((t) =>
          typeof t === "string"
            ? t.split(";").map((x) => x.trim().toLowerCase())
            : []
        );

      const walk = metersToWalkingMins(haversineMeters(user, { lat, lon }));
      return {
        id: String(el.id),
        name: el.tags?.name ?? "Unnamed",
        lat,
        lon,
        tags,
        price: null,
        popularity: 0.5,
        orderUrl: null,
        phone: null,
        avgPrepMins: prepByCuisine(tags),
        queueMinsGuess: applyTimeHeuristics(tags),
        walkMins: walk,
      } as unknown as Place;
    })
    .filter(Boolean);

  return places;
}
