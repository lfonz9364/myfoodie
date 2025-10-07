export function haversineMeters(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
) {
  const R = 6371e3; // Radius of Earth in metres
  const toRad = (x: number) => (x * Math.PI) / 180; // degrees to radians
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLat = toRad(b.lat - a.lat); // delta latitude
  const dLon = toRad(b.lon - a.lon); // delta longitude

  // Haversine formula
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  // distance
  const distance = 2 * R * Math.asin(Math.sqrt(h));

  return distance; // in metres
}

export function metersToWalkingMins(meters: number) {
  const mins = (meters / 4500) * 60; // 4.5 km/hour walking speed
  return Math.round(mins * 1.2); // 20% extra time for crossing roads, waiting at lights, etc.
}
